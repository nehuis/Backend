import ProductViewService from "../services/views.service.js";

const productViewService = new ProductViewService();

export const renderProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;

    const result = await productViewService.getPaginatedProducts({
      page,
      limit,
      sort,
      query,
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
};

export const renderProductDetail = async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productViewService.getProductById(pid);
    if (!product) return res.status(404).send("Producto no encontrado");

    const cartId = "6877dcdc815cd552cb35002c";
    res.render("productDetail", { product, cartId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error interno del servidor");
  }
};

export const renderRealTimeProducts = (req, res) => {
  res.render("realTimeProducts");
};

// Cookies
export const setSignedCookie = (req, res) => {
  res
    .cookie("nehuisCookie", "cookie con firma", {
      maxAge: 10000,
      signed: true,
    })
    .send("Cookie asignada con firma");
};

export const setUnsignedCookie = (req, res) => {
  res
    .cookie("nehuisCookie2", "otra cookie sin firma", { maxAge: 10000 })
    .send("Cookie asignada sin firma");
};

export const getCookies = (req, res) => {
  res.send(req.cookies);
};

export const deleteCookie = (req, res) => {
  res.clearCookie("nehuisCookie2").send("Cookie eliminada");
};

// Sesión
export const handleSession = (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`Se ha visitado el sitio: '${req.session.counter}' veces`);
  } else {
    req.session.counter = 1;
    res.send("Bienvenido!!..");
  }
};
