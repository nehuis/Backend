import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", getProducts); // Listar productos (con paginación / filtros)
router.get("/:productId", getProductById); // Obtener producto por ID
router.post("/", createProduct); // Crear producto
router.put("/:productId", updateProduct); // Actualizar producto
router.delete("/:productId", deleteProduct); // Eliminar producto

export default router;
