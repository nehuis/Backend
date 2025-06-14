import { Router } from "express";
import { loadCart, saveCart, loadProducts } from "../fs/dataManager.js";

const router = Router();

router.post("/", (req, res) => {
  const carts = loadCart();
  let cart = req.body;

  cart.id = Math.floor(Math.random() * 1000 + 1);

  if (!cart.products) {
    return res.send({ status: "Error", payload: "Valor inválido" });
  }

  carts.push(cart);
  saveCart(carts);

  res.send({
    status: "Success",
    payload: `Carrito ${cart.id} creado con éxito`,
  });
});

router.post("/:cartId/product/:productId", (req, res) => {
  const carts = loadCart();
  const products = loadProducts();
  const { cartId, productId } = req.params;

  let cart = carts.find((c) => c.id === parseInt(cartId));
  if (!cart) {
    return res
      .status(404)
      .send({ status: "Error", payload: "Carrito no encontrado" });
  }

  let product = products.find((p) => p.id === parseInt(productId));
  if (!product) {
    return res
      .status(404)
      .send({ status: "Error", payload: "Producto no encontrado" });
  }

  let existingProduct = cart.products.find(
    (p) => p.product === parseInt(productId)
  );
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.products.push({ product: parseInt(productId), quantity: 1 });
  }
  saveCart(carts);

  res.send({ status: "Success", payload: cart });
});

router.get("/", (req, res) => {
  const carts = loadCart();
  res.send({ status: "Success", payload: carts });
});

router.get("/:cartId", (req, res) => {
  const carts = loadCart();
  let { cartId } = req.params;

  const cart = carts.find((cart) => cart.id === parseInt(cartId));
  if (!cart) {
    return res.send({ status: "Error", payload: "Carrito no encontrado" });
  }

  res.send({ status: "Success", payload: cart });
  saveCart(carts);
});

export default router;
