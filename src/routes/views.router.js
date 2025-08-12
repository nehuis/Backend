import express from "express";
import { productModel } from "../models/product.model.js";
import cookieParser from "cookie-parser";

const router = express.Router();

router.use(cookieParser("nehuis"));

router.get("/products", async (req, res) => {
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

    const cartId = "6877dcdc815cd552cb35002c";

    res.render("products", {
      products: result.docs,
      cartId,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      currentPage: result.page,
    });
  } catch (error) {
    console.error("Error al cargar productos en la vista:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await productModel.findById(pid).lean();

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    const cartId = "6877dcdc815cd552cb35002c";

    res.render("productDetail", { product, cartId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts");
});

router.get("/setCookies", (req, res) => {
  res
    .cookie("nehuisCookie", "cookie con firma", {
      max_age: 10000,
      signed: true,
    })
    .send("Cookie asignada con firma");
});

router.get("/setCookies2", (req, res) => {
  res
    .cookie("nehuisCookie2", "otra cookie sin firma", { max_age: 10000 })
    .send("Cookie asignada sin firma");
});

router.get("/getCookies", (req, res) => {
  res.send(req.cookies);
  // res.send(req.cookies.nehuisCookie1);
  // res.send(req.signedCookies);
});

router.get("/deleteCookie", (req, res) => {
  res.clearCookie("nehuisCookie2").send("Cookie eliminada");
});

router.get("/session", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`Se ha visitado el sitio: '${req.session.counter}' veces`);
  } else {
    req.session.counter = 1;
    res.send("Bienvenido!!..");
  }
});

export default router;
