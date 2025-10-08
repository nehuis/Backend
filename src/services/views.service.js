import { productModel } from "../models/product.model.js";

export default class ProductViewService {
  async getPaginatedProducts({ page = 1, limit = 10, sort, query }) {
    const filter = {};
    if (query) {
      if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else {
        filter.category = { $regex: query, $options: "i" };
      }
    }

    const sortOption =
      sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

    return productModel.paginate(filter, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOption,
      lean: true,
    });
  }

  async getProductById(pid) {
    return productModel.findById(pid).lean();
  }
}
