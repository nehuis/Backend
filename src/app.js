import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import viewRouter from "./routes/views.router.js";
import userViewRouter from "./routes/users.views.router.js";
import userRouter from "./routes/user.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import gitHubViews from "./routes/github.views.js";
import __dirname from "./utils.js";
import path from "path";
import { Server } from "socket.io";
import mongoose from "mongoose";
import {
  deleteProduct,
  loadProducts,
  saveProducts,
} from "./services/product.services.js";
import MongoStore from "connect-mongo";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import UsersExtendRouter from "./routes/custom/users.extend.router.js";
import program from "./process.js";
import config from "./config/config.js";

import dotenv from "dotenv";
// import { resolve } from "path";

// dotenv.config();
// dotenv.config({ path: resolve("./.env") });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "img")));

const PORT = config.port || 8080;

app.use(express.static(path.join(__dirname, "public")));

const PathDB =
  "mongodb+srv://nehuis:YUPgt5ySEjlU8jqd@cluster0.xguy6qd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: PathDB,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 15,
    }),
    secret: "nehu1ss3cret",
    resave: true,
    saveUninitialized: true,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views/");
app.set("view engine", "handlebars");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", userRouter);

app.use("/", viewRouter);

app.use("/views/users", userViewRouter);
app.use("/api/sessions", sessionsRouter);

app.use("/api/github", gitHubViews);

const usersExtendRouter = new UsersExtendRouter();
app.use("/api/extend/users", usersExtendRouter.getRouter());

const httpServer = app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("Cliente conectado");

  const products = await loadProducts();
  socket.emit("updateProducts", products);

  socket.on("newProduct", async (prod) => {
    await saveProducts(prod);
    const products = loadProducts();
    socketServer.emit("updateProducts", products);
  });

  socket.on("deleteProduct", async (id) => {
    await deleteProduct(id);
    const products = loadProducts();
    socketServer.emit("updateProducts", products);
  });
});

const connectMongoDB = async () => {
  try {
    await mongoose.connect(PathDB);
    console.log("Conectado");
  } catch (error) {
    console.log("No se pudo conectar a la BD");
    process.exit();
  }
};
connectMongoDB();
