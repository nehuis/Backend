import { Router } from "express";
import { userModel } from "../models/user.model.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("registrando nuevo user ", req.body);

  const exist = await userModel.findOne({ email });
  if (exist) {
    return res
      .status(400)
      .send({ status: "error", message: "El usuario ya está registrado" });
  }

  const userDTO = { name, email, password };

  const result = await userModel.create(userDTO);

  res.send({
    status: "Success",
    payload: `Usuario creado con éxito. Id: ${result.id}`,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email, password });
  if (!user) {
    return res
      .status(401)
      .send({ status: "Error", payload: "Datos incorrectos" });
  }

  req.session.user = {
    name: `${user.name}`,
    email: `${user.email}`,
  };

  res.send({
    status: "Success",
    payload: `${user._id}`,
    message: "Primer logueo realizado",
  });
});

export default router;
