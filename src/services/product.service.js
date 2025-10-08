import ProductsDAO from "../dao/products.dao.js";
import ProductDTO from "../dto/product.dto.js";

export default class ProductService {
  constructor() {
    this.dao = new ProductsDAO();
  }

  async getPaginatedProducts({ page, limit, sort, query }) {
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

    const result = await this.dao.getPaginated(filter, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOption,
      lean: true,
    });

    result.docs = result.docs.map((p) => new ProductDTO(p));
    return result;
  }

  async getProductById(id) {
    const product = await this.dao.getById(id);
    return product ? new ProductDTO(product) : null;
  }

  async createProduct(data) {
    const product = await this.dao.create(data);
    return new ProductDTO(product);
  }

  async updateProduct(id, data) {
    const { _id, ...safeData } = data;
    const updated = await this.dao.update(id, safeData);
    return updated ? new ProductDTO(updated) : null;
  }

  async deleteProduct(id) {
    return await this.dao.delete(id);
  }
}
