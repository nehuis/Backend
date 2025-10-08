import { cartModel } from "../models/cart.model.js";

export default class CartsDAO {
  async getAll() {
    return await cartModel.find().populate("products.product").lean();
  }

  async getById(id) {
    return cartModel.findById(id).populate("products.product").lean();
  }

  async getDocumentById(id) {
    return cartModel.findById(id).populate("products.product");
  }

  async create(cart) {
    return cartModel.create(cart);
  }

  async update(cartId, update) {
    return cartModel.findByIdAndUpdate(cartId, update, { new: true });
  }

  async delete(cartId) {
    return cartModel.findByIdAndDelete(cartId);
  }

  async removeProduct(cartId, productId) {
    return cartModel
      .findByIdAndUpdate(
        cartId,
        { $pull: { products: { product: productId } } },
        { new: true }
      )
      .populate("products.product");
  }
}
