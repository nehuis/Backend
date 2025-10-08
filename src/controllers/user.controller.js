import { usersService } from "../services/user.service.js";

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await usersService.getAll();
    res.send({ status: "success", payload: users });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error, message: "No se pudo obtener los usuarios." });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await usersService.getUserById(uid);

    if (!user) {
      return res
        .status(404)
        .send({ status: "error", message: "Usuario no encontrado" });
    }

    res.send({ status: "success", payload: user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error, message: "Error al obtener el usuario." });
  }
};

// Crear un nuevo usuario
export const saveUser = async (req, res) => {
  try {
    const newUser = await usersService.createUser(req.body);
    res
      .status(201)
      .send({ status: "success", message: "Usuario creado", payload: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error, message: "No se pudo guardar el usuario." });
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await usersService.updateUser(uid, req.body);

    if (!user) {
      return res
        .status(404)
        .send({ status: "error", message: "Usuario no encontrado" });
    }

    res.send({
      status: "success",
      message: "Usuario actualizado",
      payload: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error, message: "Error al actualizar el usuario." });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await usersService.deleteUser(uid);

    if (!result) {
      return res
        .status(404)
        .send({ status: "error", message: "Usuario no encontrado" });
    }

    res.send({ status: "success", message: "Usuario eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error, message: "Error al eliminar el usuario." });
  }
};
