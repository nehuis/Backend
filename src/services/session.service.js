import { userModel } from "../models/user.model.js";
import { isValidPassword, generateJWToken } from "../utils.js";

export default class SessionService {
  async login(email, password) {
    const user = await userModel.findOne({ email });
    if (!user) return null;
    if (!isValidPassword(user.password, password)) return "INVALID_PASSWORD";

    const tokenUser = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role,
      fechaCreacion: user.fechaCreacion,
    };

    const access_token = generateJWToken(tokenUser);
    return { user, access_token };
  }

  async register(data) {
    const user = await userModel.create(data);
    return user;
  }
}
