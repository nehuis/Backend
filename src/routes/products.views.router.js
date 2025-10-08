import { Router } from "express";
import {
  getProductsView,
  getProductDetailView,
  getProductCreateView,
  postProductView,
  getProductEditView,
  updateProductView,
  deleteProductView,
} from "../controllers/products.views.controller.js";
import { authorization, passportCall } from "../utils.js";

const router = Router();

router.get(
  "/create",
  passportCall("jwt"),
  authorization("admin"),
  getProductCreateView
);
router.post(
  "/create",
  passportCall("jwt"),
  authorization("admin"),
  postProductView
);

router.get(
  "/:pid/edit",
  passportCall("jwt"),
  authorization("admin"),
  getProductEditView
);
router.post(
  "/:pid/edit",
  passportCall("jwt"),
  authorization("admin"),
  updateProductView
);
router.post(
  "/:pid/delete",
  passportCall("jwt"),
  authorization("admin"),
  deleteProductView
);

router.get("/:pid", getProductDetailView);
router.get("/", getProductsView);

export default router;
