import { Router } from "express";
import { loadProducts, saveProducts } from "../fs/dataManager.js";

const router = Router();

router.get("/", (req, res) => {
  const products = loadProducts();
  res.send({ status: "Success", payload: products });
});

router.get("/:productId", (req, res) => {
  const products = loadProducts();
  let { productId } = req.params;

  const product = products.find(
    (product) => product.id === parseInt(productId)
  );
  if (!product) {
    return res.send({ status: "Error", payload: "Producto no encontrado" });
  }

  res.send({ status: "Success", payload: product });
});

router.post("/", (req, res) => {
  const products = loadProducts();
  const product = req.body;

  product.id = Math.floor(Math.random() * 1000 + 1);

  if (
    !product.title ||
    !product.description ||
    !product.code ||
    !product.price ||
    !product.stock ||
    !product.category
  ) {
    return res.status(400).send({
      status: "Error",
      payload: "Los valores ingresados son inválidos",
    });
  }

  products.push(product);
  saveProducts(products);

  res.send({
    status: "Success",
    payload: `Producto creado con éxito. Id: ${product.id}`,
  });
});

router.put("/:productId", (req, res) => {
  const products = loadProducts();
  let { productId } = req.params;
  let productUpdate = req.body;

  const productPosition = products.findIndex(
    (u) => u.id === parseInt(productId)
  );
  if (productPosition < 0) {
    return res.send({ status: "Error", payload: "Producto no encontrado" });
  }

  productUpdate.id = products[productPosition].id;
  products[productPosition] = productUpdate;

  saveProducts(products);

  res.send({
    status: "Success",
    payload: `Producto ${productUpdate.id} actualizado con éxito`,
  });
});

router.delete("/:productId", (req, res) => {
  const products = loadProducts();
  let { productId } = req.params;

  const productPosition = products.findIndex(
    (u) => u.id === parseInt(productId)
  );
  if (productPosition < 0) {
    return res.send({ status: "Error", payload: "Producto no encontrado" });
  }

  products.splice(productPosition, 1);

  saveProducts(products);

  res.send({
    status: "Success",
    payload: `Producto ${productId} eliminado`,
  });
});

export default router;
