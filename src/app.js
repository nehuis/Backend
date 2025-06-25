import express from "express";
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import viewRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

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

// app.use("/views", viewRouter);

app.get("/socket", (req, res) => {
  res.render("socket");
});

const httpServer = app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("mensaje", (data) => {
    console.log("Data: ", data);
  });

  socket.emit("msj_2", "Backend");
});
