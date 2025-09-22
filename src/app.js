import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import path from "path";
import { Server } from "socket.io";
import MongoStore from "connect-mongo";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";

import config from "./config/config.js";
import __dirname from "./utils.js";
import initializePassport from "./config/passport.config.js";
import MongoDBSingleton from "./config/mongodb-singleton.js";

// Routers actualizados
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import userRouter from "./routes/user.router.js";
import sessionRouter from "./routes/sessions.router.js";

// Routers de vistas
import viewRouter from "./routes/views.router.js";
import userViewRouter from "./routes/users.views.router.js";
import gitHubViews from "./routes/github.views.js";
import UsersExtendRouter from "./routes/custom/users.extend.router.js";

import ProductService from "./services/product.service.js";
const productService = new ProductService();

dotenv.config();

// Configuración de Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "img")));
app.use(cors());

const PORT = config.port || 8080;

// Sesiones con Mongo
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.mongo_url,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 15,
    }),
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
  })
);

// Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Configuración de Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views/");
app.set("view engine", "handlebars");

// API Endpoints
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);

// Vistas
app.use("/", viewRouter);
app.use("/views/users", userViewRouter);
app.use("/api/github", gitHubViews);

const usersExtendRouter = new UsersExtendRouter();
app.use("/api/extend/users", usersExtendRouter.getRouter());

// Socket.io
const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("Cliente conectado");

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

// Conexión a Mongo (singleton)
const mongoInstance = async () => {
  try {
    MongoDBSingleton.getInstance();
  } catch (error) {
    console.log(error);
  }
};
mongoInstance();
