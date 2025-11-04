import mongoose from "mongoose";
import UserDAO from "../../src/dao/user.dao.js";
import Assert from "assert";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

mongoose.connect(process.env.MONGO_URL_TEST);

const assert = Assert.strict;

describe("Testing modulo users DAO", () => {
  before(function () {
    this.userDao = new UserDAO();
  });

  beforeEach(function () {});

  it("El dao debe devolver los usuarios en forma de array", async function () {
    console.log(this.userDao);
    const isArray = true;

    const result = await this.userDao.getAll();
    // console.log("Consulta:", result);
    assert.strictEqual(Array.isArray(result), isArray);
  });

  it("El dao debe agregar el usuario correctamente a la BD", async function () {
    const mockUser = {
      first_name: "Nombre de prueba",
      last_name: "Apellido de prueba",
      email: "prueba@gmail.com",
      password: "prueba",
    };

    const result = await this.userDao.create(mockUser);
    // console.log("Resultado: ", result);

    assert.ok(result._id);
  });

  it("El dao debe agregar al documento insertado un array de mascotas vacío", async function () {
    const mockUser = {
      first_name: "Nombre de prueba",
      last_name: "Apellido de prueba",
      email: "prueba@gmail.com",
      password: "prueba",
    };

    const result = await this.userDao.create(mockUser);
    // console.log("Resultado: ", result);

    assert.deepStrictEqual(result.pets, []);
  });
});
