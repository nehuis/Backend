import { productModel } from "../models/product.model.js";

export default class ProductsDAO {
  async getPaginated(filter, options) {
    return productModel.paginate(filter, options);
  }

  async getById(id) {
    return productModel.findById(id).lean();
  }

  async getDocumentById(id) {
    return productModel.findById(id); 
  }

  async create(data) {
    return productModel.create(data);
  }

  async update(id, data) {
    return productModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return productModel.findByIdAndDelete(id);
  }
}
