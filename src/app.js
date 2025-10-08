import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import path from "path";
import { Server } from "socket.io";
import MongoStore from "connect-mongo";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
import cookieParser from "cookie-parser";

import __dirname from "./utils.js";
import initializePassport from "./config/passport.config.js";
import MongoDBSingleton from "./config/mongodb-singleton.js";

// Routers
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import userRouter from "./routes/user.router.js";
import sessionRouter from "./routes/sessions.router.js";
import emailRouter from "./routes/email.router.js";
import smsRouter from "./routes/sms.router.js";

// Routers de vistas
import userViewRouter from "./routes/users.views.router.js";
import cartsViewsRouter from "./routes/carts.views.router.js";
import gitHubViews from "./routes/github.views.js";
import productsViewsRouter from "./routes/products.views.router.js";

import ProductService from "./services/product.service.js";
const productService = new ProductService();

import { logger } from "./config/logger_BASE.js";
import { addLogger } from "./config/logger_CUSTOM.js";

// Configuración de Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.use(cookieParser());

const PORT = process.env.PORT || 8080;

// Sesiones con Mongo
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 15,
    }),
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// Passport
initializePassport();
app.use(passport.initialize());

// Configuración de Handlebars
app.engine("handlebars", handlebars.engine({}));
app.set("views", __dirname + "/views/");
app.set("view engine", "handlebars");

// API Endpoints
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/email", emailRouter);
app.use("/api/sms", smsRouter);

// Vistas
app.use("/views/users", userViewRouter);
app.use("/views/carts", cartsViewsRouter);
app.use("/api/github", gitHubViews);
app.use("/products", productsViewsRouter);

// Socket.io
const httpServer = app.listen(PORT, () => {
  logger.info(`Server running on port: ${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  logger.info("Cliente conectado");

  const products = await productService.getProducts({}, { lean: true });
  socket.emit("updateProducts", products);

  socket.on("newProduct", async (prod) => {
    await productService.createProduct(prod);
    const products = await productService.getProducts({}, { lean: true });
    socketServer.emit("updateProducts", products);
  });

  socket.on("deleteProduct", async (id) => {
    await productService.deleteProduct(id);
    const products = await productService.getProducts({}, { lean: true });
    socketServer.emit("updateProducts", products);
  });
});

// Conexión a Mongo
const mongoInstance = async () => {
  try {
    MongoDBSingleton.getInstance();
  } catch (error) {
    logger.error(error);
  }
};
mongoInstance();

app.use(addLogger);
