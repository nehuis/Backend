import CartService from "../services/cart.service.js";
const cartService = new CartService();

export const createCart = async (req, res) => {
  try {
    const cart = await cartService.createCart();
    res.send({ status: "Success", payload: `Carrito creado ID: ${cart.id}` });
  } catch (error) {
    res.status(500).send({ status: "Error", payload: error.message });
  }
};

export const getCarts = async (req, res) => {
  try {
    const carts = await cartService.getAllCarts();
    res.send({ status: "Success", payload: carts });
  } catch (error) {
    res.status(500).send({ status: "Error", payload: error.message });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.cartId);
    if (!cart)
      return res
        .status(404)
        .send({ status: "Error", payload: "Carrito no encontrado" });
    res.send({ status: "Success", payload: cart });
  } catch (error) {
    res.status(500).send({ status: "Error", payload: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const quantity = Number(req.body.quantity) || 1;
    const result = await cartService.addProductToCart(
      cartId,
      productId,
      quantity
    );

    if (!result)
      return res
        .status(404)
        .send({ status: "Error", payload: "Carrito no encontrado" });
    if (result === "PRODUCT_NOT_FOUND")
      return res
        .status(404)
        .send({ status: "Error", payload: "Producto no encontrado" });

    res.send({ status: "Success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "Error", payload: error.message });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const result = await cartService.removeProductFromCart(
      req.params.cartId,
      req.params.productId
    );

    if (!result)
      return res
        .status(404)
        .send({ status: "Error", payload: "Carrito no encontrado" });
    if (result === "PRODUCT_NOT_IN_CART")
      return res.send({
        status: "Error",
        payload: "Producto no encontrado en el carrito",
      });

    res.send({ status: "Success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "Error", payload: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const result = await cartService.updateCart(
      req.params.cartId,
      req.body.products
    );
    if (!result)
      return res
        .status(404)
        .send({ status: "Error", payload: "Carrito no encontrado" });
    res.send({ status: "Success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "Error", payload: error.message });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;
    const result = await cartService.updateProductQuantity(
      cartId,
      productId,
      quantity
    );

    if (!result)
      return res
        .status(404)
        .send({ status: "Error", payload: "Carrito no encontrado" });
    if (result === "PRODUCT_NOT_FOUND")
      return res
        .status(404)
        .send({ status: "Error", payload: "Producto no encontrado" });

    res.send({ status: "Success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "Error", payload: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const result = await cartService.clearCart(req.params.cartId);
    if (!result)
      return res
        .status(404)
        .send({ status: "Error", payload: "Carrito no encontrado" });
    res.send({ status: "Success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "Error", payload: error.message });
  }
};
