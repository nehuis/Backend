import { Router } from "express";
import { uploader } from "../utils.js";
import { productModel } from "../models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;

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

    const result = await productModel.paginate(filter, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOption,
      lean: true,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${
      req.path
    }`;

    const buildLink = (pageNum) => {
      const params = new URLSearchParams({ ...req.query, page: pageNum });
      return `${baseUrl}?${params.toString()}`;
    };

    res.send({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});

router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModel.findById(productId);

    res.send({ status: "Success", payload: product });
  } catch (error) {
    console.log(`No se pudo obtener data: ${error}`);
    res.send({ status: "Error", payload: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category } =
      req.body;

    const product = await productModel.create({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
    });

    res.send({ status: "Success", payload: product._id });
  } catch (error) {
    console.log(`Error al crear el producto: ${error}`);
    res.send({ status: "Error", payload: error });
  }
});

router.put("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const productUpdate = req.body;

    const updateProduct = await productModel.findByIdAndUpdate(
      productId,
      productUpdate,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateProduct) {
      return res
        .status(404)
        .send({ status: "Error", payload: "Producto no encontrado" });
    }

    res.send({
      status: "Success",
      payload: `Producto ${updateProduct._id} actualizado con éxito`,
    });
  } catch (error) {
    console.log(`Error al actualizar el producto: ${error}`);
    res.status(500).send({ status: "Error", payload: error });
  }
});

router.delete("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const deleteProduct = await productModel.findByIdAndDelete(productId, {
      new: true,
    });

    if (!deleteProduct) {
      return res.status(404).send({
        status: "Error",
        payload: `producto no encontrado`,
      });
    }

    res.send({
      status: "Success",
      payload: `Producto ${deleteProduct._id} eliminado`,
    });
  } catch (error) {
    console.log(`Error al eliminar el producto: ${error}`);
    res.status(500).send({ status: "Error", payload: error });
  }
});

router.post("/thumbnail", uploader.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        status: "Error",
        payload: "No se adjuntó un archivo",
      });
    }

    const { title, description, code, price, stock, category } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).send({
        status: "Error",
        payload: "Faltan campos obligatorios",
      });
    }

    const newProduct = await productModel.create({
      title,
      description,
      code,
      price,
      stock,
      category,
      status: true,
      thumbnail: `/img/${req.file.filename}`,
    });

    res.send({
      status: "Success",
      payload: `Producto creado con éxito. Id: ${newProduct._id}`,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).send({
      status: "Error",
      payload: "Error interno del servidor",
    });
  }
});
export default router;
