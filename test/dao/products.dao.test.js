import mongoose from "mongoose";
import dotenv from "dotenv";
import Assert from "assert";
import ProductsDAO from "../../src/dao/products.dao.js";

dotenv.config({ quiet: true });
const assert = Assert.strict;

describe("Test del DAO de productos", function () {
  this.timeout(10000);

  before(async function () {
    await mongoose.connect(process.env.MONGO_URL_TEST);
    this.productDao = new ProductsDAO();
  });

  beforeEach(async function () {
    await mongoose.connection.collection("products").deleteMany({});
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("create() debe crear un producto correctamente", async function () {
    const mockProduct = {
      title: "Producto de prueba",
      description: "Descripción del producto",
      price: 100,
      stock: 10,
      code: `code-${Date.now()}`,
      category: "testing",
      status: true,
    };

    const result = await this.productDao.create(mockProduct);
    assert.ok(result._id, "El producto creado debe tener un _id");
    assert.strictEqual(result.title, mockProduct.title);
  });

  it("getById() debe obtener un producto por su ID", async function () {
    const product = await this.productDao.create({
      title: "Buscar producto",
      description: "para test",
      price: 50,
      stock: 5,
      code: `find-${Date.now()}`,
      category: "test",
      status: true,
    });

    const found = await this.productDao.getById(product._id);
    assert.ok(found);
    assert.strictEqual(found._id.toString(), product._id.toString());
  });

  it("update() debe modificar un producto correctamente", async function () {
    const product = await this.productDao.create({
      title: "Viejo título",
      description: "para actualizar",
      price: 75,
      stock: 3,
      code: `update-${Date.now()}`,
      category: "test",
      status: true,
    });

    const updated = await this.productDao.update(product._id, {
      title: "Nuevo título",
    });

    assert.strictEqual(updated.title, "Nuevo título");
  });

  it("delete() debe eliminar un producto correctamente", async function () {
    const product = await this.productDao.create({
      title: "Eliminar producto",
      description: "para test",
      price: 20,
      stock: 1,
      code: `delete-${Date.now()}`,
      category: "test",
      status: true,
    });

    await this.productDao.delete(product._id);
    const found = await this.productDao.getById(product._id);
    assert.strictEqual(found, null);
  });
});
