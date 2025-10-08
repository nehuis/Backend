import UserDTO from "../dto/user.dto.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export default class SessionService {
  async generateToken(user) {
    const token = jwt.sign(
      {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
      config.secret,
      {
        expiresIn: "1h",
      }
    );

    return token;
  }

  async register(user) {
    return new UserDTO(user);
  }

  async login(user) {
    const token = await this.generateToken(user);
    return { user: new UserDTO(user), token };
  }

  async current(user) {
    return new UserDTO(user);
  }

  async logout(res) {
    res.clearCookie("jwtCookieToken");
    return { message: "Sesión cerrada" };
  }
}
