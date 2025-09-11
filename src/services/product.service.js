import { productModel } from "../models/product.model.js";

export default class ProductService {
  async getProducts(filter, options) {
    return await productModel.paginate(filter, options);
  }

  async getProductById(productId) {
    return await productModel.findById(productId);
  }

  async createProduct(data) {
    return await productModel.create(data);
  }

  async updateProduct(productId, data) {
    return await productModel.findByIdAndUpdate(productId, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteProduct(productId) {
    return await productModel.findByIdAndDelete(productId);
  }
}
