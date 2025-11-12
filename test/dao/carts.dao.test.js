import mongoose from "mongoose";
import dotenv from "dotenv";
import Assert from "assert";
import CartsDAO from "../../src/dao/carts.dao.js";
import ProductsDAO from "../../src/dao/products.dao.js";

dotenv.config({ quiet: true });
const assert = Assert.strict;

describe("Test del DAO de carritos", function () {
  this.timeout(15000);

  before(async function () {
    await mongoose.connect(process.env.MONGO_URL_TEST);
    this.cartDao = new CartsDAO();
    this.productDao = new ProductsDAO();
  });

  beforeEach(async function () {
    await mongoose.connection.collection("carts").deleteMany({});
    await mongoose.connection.collection("products").deleteMany({});
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("create() debe crear un carrito vacío", async function () {
    const cart = await this.cartDao.create({ products: [] });
    assert.ok(cart._id);
    assert.deepStrictEqual(cart.products, []);
  });

  it("getById() debe obtener un carrito existente", async function () {
    const cart = await this.cartDao.create({ products: [] });
    const found = await this.cartDao.getById(cart._id);
    assert.ok(found);
    assert.strictEqual(found._id.toString(), cart._id.toString());
  });

  it("update() debe modificar el carrito correctamente", async function () {
    const cart = await this.cartDao.create({ products: [] });
    const updated = await this.cartDao.update(cart._id, { products: [] });
    assert.ok(updated);
  });

  it("removeProduct() debe eliminar un producto del carrito", async function () {
    // Crear un producto de prueba
    const product = await this.productDao.create({
      title: "Producto carrito",
      description: "Test",
      price: 10,
      stock: 5,
      code: `cart-${Date.now()}`,
      category: "test",
      status: true,
    });

    // Crear un carrito con ese producto
    const cart = await this.cartDao.create({
      products: [{ product: product._id, quantity: 2 }],
    });

    // Eliminar el producto
    const updated = await this.cartDao.removeProduct(cart._id, product._id);

    assert.ok(Array.isArray(updated.products));
    assert.strictEqual(updated.products.length, 0);
  });

  it("delete() debe eliminar un carrito correctamente", async function () {
    const cart = await this.cartDao.create({ products: [] });
    await this.cartDao.delete(cart._id);
    const found = await this.cartDao.getById(cart._id);
    assert.strictEqual(found, null);
  });
});
