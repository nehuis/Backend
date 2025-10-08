import { Router } from "express";
import {
  getProducts,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { passportCall, authorization } from "../utils.js";

const router = Router();

router.get(
  "/",
  passportCall("jwt"),
  authorization("admin", "user"),
  getProducts
);

router.get(
  "/:pid",
  passportCall("jwt"),
  authorization("admin", "user"),
  getProductDetail
);

router.post("/", passportCall("jwt"), authorization("admin"), createProduct);

router.put("/:pid", passportCall("jwt"), authorization("admin"), updateProduct);

router.delete(
  "/:pid",
  passportCall("jwt"),
  authorization("admin"),
  deleteProduct
);

export default router;
