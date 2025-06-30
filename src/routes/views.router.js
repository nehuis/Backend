import express from "express";
import { loadProducts } from "../fs/dataManager.js";

const router = express.Router();

router.get("/home", (req, res) => {
  const products = loadProducts();
  res.render("home", { products });
});

router.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts");
});

export default router;
