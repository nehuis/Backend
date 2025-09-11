import { userModel } from "../models/user.model.js";

export default class UserService {
  async getAllUsers() {
    return await userModel.find();
  }

  async getUserById(id) {
    return await userModel.findById(id);
  }

  async createUser(data) {
    return await userModel.create(data);
  }

  async updateUser(id, data) {
    return await userModel.updateOne({ _id: id }, data);
  }

  async deleteUser(id) {
    return await userModel.deleteOne({ _id: id });
  }
}
