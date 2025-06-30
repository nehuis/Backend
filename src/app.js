import express from "express";
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import viewRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { loadProducts, saveProducts } from "./fs/dataManager.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const PORT = process.env.PORT || 8080;

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views/");
app.set("view engine", "handlebars");

app.use("/", viewRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("Cliente conectado");
  socket.emit("updateProducts", loadProducts());

  socket.on("newProduct", (prod) => {
    const products = loadProducts();
    products.push({ id: crypto.randomUUID(), ...prod });
    saveProducts(products);
    socketServer.emit("updateProducts", products);
  });

  socket.on("deleteProduct", (id) => {
    const products = loadProducts().filter((p) => p.id !== id);
    saveProducts(products);
    socketServer.emit("updateProducts", products);
  });
});
