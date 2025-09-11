import { Router } from "express";
import {
  createCart,
  getCarts,
  getCartById,
  addProduct,
  removeProduct,
  updateCart,
  updateProductQuantity,
  clearCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.post("/", createCart); // Crear carrito
router.get("/", getCarts); // Listar carritos
router.get("/:cartId", getCartById); // Ver carrito por ID
router.post("/:cartId/product/:productId", addProduct); // Agregar producto
router.delete("/:cartId/product/:productId", removeProduct); // Eliminar producto
router.put("/:cartId", updateCart); // Reemplazar carrito
router.put("/:cartId/product/:productId", updateProductQuantity); // Actualizar cantidad de producto
router.delete("/:cartId", clearCart); // Vaciar carrito

export default router;
