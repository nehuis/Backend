import { Router } from "express";
import {
  githubAuth,
  githubCallback,
  register,
  login,
} from "../controllers/session.controller.js";

const router = Router();

// GitHub OAuth
router.get("/github", githubAuth);
router.get("/githubcallback", githubCallback);

// Registro
router.post("/register", register);
router.get("/fail-register", (req, res) => {
  res.send({ status: "Error", message: "Error al crear el usuario" });
});

// Login
router.post("/login", login);
router.get("/fail-login", (req, res) => {
  res.send({ status: "Error", message: "Login failed" });
});

export default router;
