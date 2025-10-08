import { Router } from "express";
import {
  getUsers,
  getUserById,
  saveUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authorization } from "../utils.js";

const router = Router();

router.get("/", authorization("admin"), getUsers);
router.get("/:uid", authorization("admin"), getUserById);
router.post("/", authorization("admin"), saveUser);
router.put("/:uid", authorization("admin", "user"), updateUser);
router.delete("/:uid", authorization("admin"), deleteUser);

export default router;
