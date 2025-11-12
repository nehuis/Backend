import mongoose from "mongoose";
import dotenv from "dotenv";
import Assert from "assert";
import UserDAO from "../../src/dao/user.dao.js";

dotenv.config({ quiet: true });
const assert = Assert.strict;

describe("Test del DAO de usuarios", function () {
  this.timeout(10000);

  before(async function () {
    console.log("Conectando a:", process.env.MONGO_URL_TEST);
    await mongoose.connect(process.env.MONGO_URL_TEST);
    this.userDao = new UserDAO();
  });

  beforeEach(async function () {
    await mongoose.connection.collection("usuarios").deleteMany({});
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("getAll() debe devolver un array", async function () {
    const result = await this.userDao.getAll();
    assert.ok(Array.isArray(result), "El resultado debe ser un array");
  });

  it("create() debe crear un usuario correctamente", async function () {
    const mockUser = {
      first_name: "Nombre",
      last_name: "Prueba",
      email: `user${Date.now()}@mail.com`,
      password: "123456",
    };

    const result = await this.userDao.create(mockUser);
    assert.ok(result._id, "El documento creado debe tener un _id");
    assert.strictEqual(result.email, mockUser.email);
  });

  it("getByEmail() debe obtener un usuario por su email", async function () {
    const mockUser = {
      first_name: "Email",
      last_name: "Lookup",
      email: `email${Date.now()}@mail.com`,
      password: "test",
    };

    await this.userDao.create(mockUser);
    const found = await this.userDao.getByEmail(mockUser.email);

    assert.ok(found, "Debe encontrar el usuario por email");
    assert.strictEqual(found.email, mockUser.email);
  });

  it("getById() debe obtener un usuario por su ID", async function () {
    const mockUser = {
      first_name: "Buscar",
      last_name: "Por ID",
      email: `find${Date.now()}@mail.com`,
      password: "123456",
    };

    const created = await this.userDao.create(mockUser);
    const found = await this.userDao.getById(created._id);

    assert.ok(found, "Debe devolver un documento válido");
    assert.strictEqual(found.email, mockUser.email);
  });

  it("update() debe modificar un usuario correctamente", async function () {
    const mockUser = {
      first_name: "Actualizar",
      last_name: "Usuario",
      email: `update${Date.now()}@mail.com`,
      password: "123456",
    };

    const created = await this.userDao.create(mockUser);
    const updated = await this.userDao.update(created._id, {
      first_name: "Actualizado",
    });

    assert.strictEqual(updated.first_name, "Actualizado");
  });

  it("delete() debe eliminar un usuario correctamente", async function () {
    const mockUser = {
      first_name: "Eliminar",
      last_name: "Usuario",
      email: `delete${Date.now()}@mail.com`,
      password: "123456",
    };

    const created = await this.userDao.create(mockUser);
    await this.userDao.delete(created._id);

    const found = await this.userDao.getById(created._id);
    assert.strictEqual(found, null, "El usuario debe haber sido eliminado");
  });
});
