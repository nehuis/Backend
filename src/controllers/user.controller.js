import UserService from "../services/user.service.js";
const userService = new UserService();

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.send({ status: "Success", payload: users });
  } catch (error) {
    res.status(500).send({ status: "Error", payload: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    if (!user)
      return res
        .status(404)
        .send({ status: "Error", payload: "Usuario no encontrado" });
    res.send({ status: "Success", payload: user });
  } catch (error) {
    res.status(500).send({ status: "Error", payload: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).send({ status: "Success", payload: user });
  } catch (error) {
    res.status(500).send({ status: "Error", payload: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body);
    res.send({ status: "Success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "Error", payload: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.send({ status: "Success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "Error", payload: error.message });
  }
};
