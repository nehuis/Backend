import { Router } from "express";
import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const cart = await cartModel.create({
      products: [],
    });

    res.send({
      status: "Success",
      payload: `Carrito creado con éxito. ID: ${cart.id}`,
    });
  } catch (error) {
    console.log(`Error al crear el carrito: ${error}`);
    res.send({ status: "Error", payload: error });
  }
});

router.post("/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "Error", payload: "Carrito no encontrado" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .send({ status: "Error", payload: "Producto no encontrado" });
    }

    const quantity = Number(req.body.quantity) || 1;
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res
        .status(400)
        .send({ status: "Error", payload: "Cantidad inválida" });
    }

    const existing = cart.products.find((p) => p.product.equals(product._id));
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ product: product._id, quantity: quantity });
    }

    await cart.save();

    return res.send({ status: "Success", payload: cart });
  } catch (error) {
    console.log(`Error al crear el carrito: ${error}`);
    res.send({ status: "Error", payload: error });
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await cartModel.find();
    res.send({ status: "Success", payload: carts });
  } catch (error) {
    console.log(`Error al obtener data: ${error}`);
    res.send({ status: "Error", payload: error });
  }
});

router.get("/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await cartModel
      .findById(cartId)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.status(404).send({
        status: "Error",
        payload: "Carrito no encontrado",
      });
    }

    res.send({
      status: "Success",
      payload: cart,
    });
  } catch (error) {
    console.error("Error al obtener el carrito con productos:", error);
    res.status(500).send({
      status: "Error",
      payload: "Error interno del servidor",
    });
  }
});

router.get("/view/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await cartModel
      .findById(cartId)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res
        .status(404)
        .send({ status: "Error", payload: "Carrito no encontrado" });
    }

    res.render("cartDetail", { cart });
  } catch (error) {
    console.error("Error al obtener el carrito con productos:", error);
    res
      .status(500)
      .send({ status: "Error", payload: "Error interno del servidor" });
  }
});

router.delete("/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res.send({ status: "Error", payload: "El carrito no existe" });
    }

    const cartLength = cart.products.length;
    cart.products = cart.products.filter((p) => !p.product.equals(productId));

    if (cart.products.length === cartLength) {
      return res.send({
        status: "Error",
        payload: "Producto no encontrado en el carrito",
      });
    }

    await cart.save();

    res.send({
      status: "Success",
      payload: `Producto ${productId} eliminado del carrito ${cartId}`,
    });
  } catch (error) {
    console.log(`Error al eliminar el producto: ${error}`);
    res.send({ status: "Error", payload: error });
  }
});

router.put("/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).send({
        status: "Error",
        payload: "El body debe contener un array de productos",
      });
    }

    for (const item of products) {
      if (
        !item.product ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return res.status(400).send({
          status: "Error",
          payload:
            "Cada producto debe tener un ID válido y una cantidad positiva",
        });
      }
    }

    const updatedCart = await cartModel.findByIdAndUpdate(
      cartId,
      { products: products },
      { new: true, runValidators: true }
    );

    if (!updatedCart) {
      return res
        .status(404)
        .send({ status: "Error", payload: "Carrito no encontrado" });
    }

    res.send({
      status: "Success",
      payload: `Carrito ${updatedCart._id} actualizado con éxito`,
    });
  } catch (error) {
    console.log(`Error al actualizar el carrito: ${error}`);
    res.status(500).send({ status: "Error", payload: error });
  }
});

router.put("/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).send({
        status: "Error",
        payload: "La cantidad debe ser un número entero positivo",
      });
    }

    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "Error", payload: "Carrito no encontrado" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .send({ status: "Error", payload: "Producto no encontrado" });
    }

    cart.products = cart.products.filter((p) => !p.product.equals(productId));

    cart.products.push({ product: productId, quantity });

    await cart.save();

    res.send({
      status: "Success",
      payload: `Producto actualizado en el carrito ${cartId}`,
    });
  } catch (error) {
    console.error(
      "Error al actualizar cantidad del producto en carrito:",
      error
    );
    res
      .status(500)
      .send({ status: "Error", payload: "Error interno del servidor" });
  }
});

router.delete("/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "Error", payload: "Carrito no encontrado" });
    }

    cart.products = [];
    await cart.save();

    res.send({
      status: "Success",
      payload: `Todos los productos del carrito ${cartId} fueron eliminados.`,
    });
  } catch (error) {
    console.error("Error al eliminar productos del carrito:", error);
    res
      .status(500)
      .send({ status: "Error", payload: "Error interno del servidor" });
  }
});

export default router;
