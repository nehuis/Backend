import ProductService from "../services/product.service.js";
const productService = new ProductService();

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;
    const filter = {};
    if (query) {
      if (query === "true" || query === "false")
        filter.status = query === "true";
      else filter.category = { $regex: query, $options: "i" };
    }
    const sortOption =
      sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};
    const result = await productService.getProducts(filter, {
      page,
      limit,
      sort: sortOption,
      lean: true,
    });
    res.send({ status: "Success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "Error", payload: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.productId);
    if (!product)
      return res
        .status(404)
        .send({ status: "Error", payload: "Producto no encontrado" });
    res.send({ status: "Success", payload: product });
  } catch (error) {
    res.status(500).send({ status: "Error", payload: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.send({ status: "Success", payload: product });
  } catch (error) {
    res.status(500).send({ status: "Error", payload: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(
      req.params.productId,
      req.body
    );
    if (!product)
      return res
        .status(404)
        .send({ status: "Error", payload: "Producto no encontrado" });
    res.send({ status: "Success", payload: product });
  } catch (error) {
    res.status(500).send({ status: "Error", payload: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.productId);
    if (!product)
      return res
        .status(404)
        .send({ status: "Error", payload: "Producto no encontrado" });
    res.send({ status: "Success", payload: product });
  } catch (error) {
    res.status(500).send({ status: "Error", payload: error.message });
  }
};
