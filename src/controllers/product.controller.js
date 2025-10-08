import ProductService from "../services/product.service.js";

const productService = new ProductService();

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;
    const result = await productService.getPaginatedProducts({
      page,
      limit,
      sort,
      query,
    });

    res.json({
      status: "success",
      payload: result.docs,
      pagination: {
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        currentPage: result.page,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener productos" });
  }
};

export const getProductDetail = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.pid);
    if (!product)
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });

    res.json({ status: "success", payload: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener detalle de producto",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ status: "success", payload: product });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error al crear producto" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updated = await productService.updateProduct(
      req.params.pid,
      req.body
    );
    if (!updated)
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });

    res.json({ status: "success", payload: updated });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error al actualizar producto" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await productService.deleteProduct(req.params.pid);
    if (!deleted)
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });

    res.json({ status: "success", message: "Producto eliminado" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error al eliminar producto" });
  }
};
