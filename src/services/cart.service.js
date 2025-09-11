import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";

export default class CartService {
  async createCart() {
    return await cartModel.create({ products: [] });
  }

  async getAllCarts() {
    return await cartModel.find();
  }

  async getCartById(cartId) {
    return await cartModel.findById(cartId).populate("products.product").lean();
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await cartModel.findById(cartId);
    if (!cart) return null;

    const product = await productModel.findById(productId);
    if (!product) return "PRODUCT_NOT_FOUND";

    const existing = cart.products.find((p) => p.product.equals(product._id));
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ product: product._id, quantity });
    }

    await cart.save();
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await cartModel.findById(cartId);
    if (!cart) return null;

    const initialLength = cart.products.length;
    cart.products = cart.products.filter((p) => !p.product.equals(productId));

    if (cart.products.length === initialLength) return "PRODUCT_NOT_IN_CART";

    await cart.save();
    return cart;
  }

  async updateCart(cartId, products) {
    return await cartModel.findByIdAndUpdate(
      cartId,
      { products },
      { new: true, runValidators: true }
    );
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await cartModel.findById(cartId);
    if (!cart) return null;

    const product = await productModel.findById(productId);
    if (!product) return "PRODUCT_NOT_FOUND";

    cart.products = cart.products.filter((p) => !p.product.equals(productId));
    cart.products.push({ product: productId, quantity });

    await cart.save();
    return cart;
  }

  async clearCart(cartId) {
    const cart = await cartModel.findById(cartId);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return cart;
  }
}
