import CartService from "../services/cart.service.js";
import TicketService from "../services/ticket.service.js";

const cartService = new CartService();
const ticketService = new TicketService();

export const getAllCarts = async (req, res) => {
  try {
    const carts = await cartService.getAllCarts();
    res.json({ status: "success", carts });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener carritos");
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.cartId);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    res.json({ status: "success", cart });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener carrito" });
  }
};

export const createCart = async (req, res) => {
  try {
    const cart = await cartService.createCart({
      user: req.user._id,
      products: [],
    });
    res.status(201).json({ status: "success", cart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear carrito");
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const updated = await cartService.updateCart(cid, req.body);
    if (!updated) return res.status(404).send("Carrito no encontrado");
    res.json({ status: "success", cart: updated });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar carrito");
  }
};

export const deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const deleted = await cartService.deleteCart(cid);
    if (!deleted) return res.status(404).send("Carrito no encontrado");
    res.json({ status: "success", message: "Carrito eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar carrito");
  }
};

export const addProductToCart = async (req, res) => {
  let { cid, pid } = req.params;
  const quantity = req.body.quantity || 1;

  try {
    if (!cid || cid === "null" || cid === "undefined") {
      const newCart = await cartService.createCart();
      cid = newCart._id.toString();
    }

    const updatedCart = await cartService.addProduct(cid, pid, quantity);

    res.json({
      status: "success",
      cartId: cid,
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);

    if (error.message && error.message.includes("stock")) {
      return res.status(400).json({ status: "error", message: error.message });
    }

    res.status(500).json({
      status: "error",
      message: "Error interno al agregar al carrito",
    });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updated = await cartService.removeProduct(cid, pid);
    if (!updated)
      return res.status(404).send("Carrito o producto no encontrado");
    res.json({ status: "success", cart: updated });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar producto del carrito");
  }
};

export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await cartService.purchaseCart(
      cid,
      ticketService,
      req.user.email
    );
    if (!result)
      return res.status(404).json({ error: "Carrito no encontrado" });
    res.json({
      status: "success",
      ticket: result.ticket,
      productsNotProcessed: result.productsNotProcessed,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al procesar la compra" });
  }
};
