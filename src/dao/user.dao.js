import { userModel } from "../models/user.model.js";

export default class UserDAO {
  async getAll() {
    return await userModel.find();
  }

  async getByEmail(email) {
    return await userModel.findOne({ email });
  }

  async getById(id) {
    return await userModel.findById(id);
  }

  async create(userData) {
    return await userModel.create(userData);
  }

  async update(id, data) {
    return await userModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await userModel.findByIdAndDelete(id);
  }
}
