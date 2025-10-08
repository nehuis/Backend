import CartService from "../services/cart.service.js";
const cartService = new CartService();

export const renderCart = async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.cid);
    if (!cart)
      return res
        .status(404)
        .render("404", { message: "Carrito no encontrado" });
    res.render("cartDetail", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).render("500", { message: "Error al cargar carrito" });
  }
};
