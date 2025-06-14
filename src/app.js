import express from "express";
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import __dirname from "./utils.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8080;

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});
