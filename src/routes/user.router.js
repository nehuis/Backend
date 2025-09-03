import { Router } from "express";
import { userModel } from "../models/user.model.js";
import { authToken } from "../utils.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await userModel.find();
    console.log(users);
    res.send({ status: "Success", payload: users });
  } catch (error) {
    console.error("No se pudo obtener usuarios con moongose: " + error);
    res.status(500).send({
      error: "No se pudo obtener usuarios con moongose",
      message: error,
    });
  }
});

router.get("/:userId", authToken, async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(202).json({ message: "User not found with ID: " + userId });
    }
    res.json(user);
  } catch (error) {
    console.error("Error consultando el usuario con ID: " + userId);
  }
});

router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email, age } = req.body;

    const result = await userModel.create({
      first_name,
      last_name,
      email,
      age,
    });

    res.status(201).send({ status: "Success", payload: result });
  } catch (error) {
    console.error("No se pudo crear el usuario con moongose: " + error);
    res.status(500).send({
      error: "No se pudo crear el usuario con moongose",
      message: error,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const userUpdate = req.body;

    const result = await userModel.updateOne(
      { _id: req.params.id },
      userUpdate
    );

    res.status(202).send({ status: "Success", payload: result });
  } catch (error) {
    console.error("No se pudo actualizar el usuario con moongose: " + error);
    res.status(500).send({
      error: "No se pudo actualizar el usuario con moongose",
      message: error,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await userModel.deleteOne({ _id: req.params.id });

    res.send({ status: "Success", payload: result });
  } catch (error) {
    console.error("No se pudo eliminar el usuario con moongose: " + error);
    res.status(500).send({
      error: "No se pudo eliminar el usuario con moongose",
      message: error,
    });
  }
});

export default router;
