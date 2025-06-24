import { Router } from "express";
import { loadCart, saveCart, loadProducts } from "../fs/dataManager.js";

const router = Router();

router.post("/", (req, res) => {
  const carts = loadCart();
  const newId = carts.length ? carts[carts.length - 1].id + 1 : 1;

  const newCart = {
    id: newId,
    products: [],
  };

  carts.push(newCart);
  saveCart(carts);

  return res.status(201).send({
    status: "Success",
    payload: newCart,
  });
});

router.post("/:cartId/product/:productId", (req, res) => {
  const carts = loadCart();
  const products = loadProducts();
  const { cartId, productId } = req.params;

  const cart = carts.find((c) => c.id === Number(cartId));
  if (!cart) {
    return res
      .status(404)
      .send({ status: "Error", payload: "Carrito no encontrado" });
  }

  const product = products.find((p) => p.id === Number(productId));
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

  const existing = cart.products.find((p) => p.product === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.products.push({ product: product.id, quantity: quantity });
  }

  saveCart(carts);
  return res.send({ status: "Success", payload: cart });
});

router.get("/", (req, res) => {
  const carts = loadCart();
  return res.send({ status: "Success", payload: carts });
});

router.get("/:cartId", (req, res) => {
  const carts = loadCart();
  const { cartId } = req.params;

  const cart = carts.find((c) => c.id === Number(cartId));
  if (!cart) {
    return res
      .status(404)
      .send({ status: "Error", payload: "Carrito no encontrado" });
  }

  return res.send({ status: "Success", payload: cart });
});

export default router;
