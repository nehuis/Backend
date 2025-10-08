import ProductService from "../services/product.service.js";

const productService = new ProductService();

export const getProductsView = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await productService.getPaginatedProducts({ page, limit });

    res.render("products", {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      currentPage: result.page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar productos");
  }
};

export const getProductDetailView = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.pid);
    if (!product) return res.status(404).send("Producto no encontrado");

    console.log("Detalle del producto: ", product);

    res.render("productDetail", { product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar detalle de producto");
  }
};

export const getProductCreateView = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .render("error", { message: "No tenés permisos para crear productos" });
  }

  res.render("productForm", { product: null });
};

export const postProductView = async (req, res) => {
  try {
    await productService.createProduct(req.body);
    res.redirect("/products");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear producto");
  }
};

export const getProductEditView = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.pid);
    console.log("Producto encontrado:", product);

    if (!product) return res.status(404).send("Producto no encontrado");

    res.render("productForm", { product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar formulario de edición");
  }
};

export const updateProductView = async (req, res) => {
  try {
    await productService.updateProduct(req.params.pid, req.body);
    res.redirect("/products");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar producto");
  }
};

export const deleteProductView = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.pid);
    res.redirect("/products");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar producto");
  }
};
