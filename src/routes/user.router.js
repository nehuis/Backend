import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers); // Listar usuarios
router.get("/:userId", getUserById); // Usuario por ID
router.post("/", createUser); // Crear usuario
router.put("/:id", updateUser); // Actualizar usuario
router.delete("/:id", deleteUser); // Eliminar usuario

export default router;
