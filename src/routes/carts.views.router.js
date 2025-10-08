import { Router } from "express";
import { renderCart } from "../controllers/carts.views.controller.js";

const router = Router();

router.get("/:cid", renderCart);

export default router;
