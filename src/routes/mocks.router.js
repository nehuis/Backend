import { Router } from "express";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { userModel } from "../models/user.model.js";
import { petModel } from "../models/pet.model.js";

const router = Router();

const generateUser = () => {
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync("coder123", 10),
    role: faker.helpers.arrayElement(["user", "admin"]),
    pets: [],
  };
};

const generatePet = () => {
  return {
    name: faker.animal.dog(),
    species: faker.animal.type(),
    birthDate: faker.date.past(),
  };
};

router.get("/mockingpets", async (req, res) => {
  try {
    const pets = [];
    for (let i = 0; i < 100; i++) {
      pets.push(generatePet());
    }
    res.json({ status: "success", payload: pets });
  } catch (error) {
    console.error("Error en /mockingpets:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error generando mascotas" });
  }
});

router.get("/mockingusers", async (req, res) => {
  try {
    const users = [];
    for (let i = 0; i < 50; i++) {
      users.push(generateUser());
    }
    res.json({ status: "success", payload: users });
  } catch (error) {
    console.error("Error en /mockingusers:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error generando usuarios" });
  }
});

router.post("/generateData", async (req, res) => {
  try {
    const { users = 0, pets = 0 } = req.body;

    const userDocs = [];
    const petDocs = [];

    for (let i = 0; i < users; i++) userDocs.push(generateUser());
    for (let i = 0; i < pets; i++) petDocs.push(generatePet());

    const insertedUsers = await userModel.insertMany(userDocs);
    const insertedPets = await petModel.insertMany(petDocs);

    res.json({
      status: "success",
      message: `Se generaron ${insertedUsers.length} usuarios y ${insertedPets.length} mascotas.`,
    });
  } catch (error) {
    console.error("Error en /generateData:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error generando datos en la BD" });
  }
});

export default router;
