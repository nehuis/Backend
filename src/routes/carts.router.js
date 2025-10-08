import { Router } from "express";
import {
  getAllCarts,
  getCart,
  createCart,
  updateCart,
  deleteCart,
  addProductToCart,
  removeProductFromCart,
  purchaseCart,
} from "../controllers/cart.controller.js";
import { passportCall, authorization } from "../utils.js";

const router = Router();

router.get(
  "/",
  passportCall("jwt"),
  authorization("admin", "user"),
  getAllCarts
);
router.get(
  "/:cartId",
  passportCall("jwt"),
  authorization("admin", "user"),
  getCart
);

router.get("/view/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartService.getCartById(cid);

  if (!cart)
    return res.status(404).render("404", { message: "Carrito no encontrado" });

  res.render("cartDetail", { cart });
});

router.post("/", passportCall("jwt"), authorization("admin"), createCart);
router.put("/:cid", passportCall("jwt"), authorization("admin"), updateCart);
router.delete("/:cid", passportCall("jwt"), authorization("admin"), deleteCart);

router.post("/:cid/products/:pid", addProductToCart);

router.post("/products/:pid", addProductToCart);

router.delete(
  "/:cid/product/:pid",
  passportCall("jwt"),
  authorization("admin", "user"),
  removeProductFromCart
);

router.post(
  "/:cid/purchase",
  passportCall("jwt"),
  authorization("admin", "user"),
  purchaseCart
);

export default router;
