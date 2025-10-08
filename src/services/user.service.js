import UsersDAO from "../dao/user.dao.js";
import UserDTO from "../dto/user.dto.js";

class UserService {
  constructor() {
    this.dao = new UsersDAO();
  }

  async getAll() {
    const users = await this.dao.getAll();
    return users.map((u) => new UserDTO(u));
  }

  async getUserById(id) {
    const user = await this.dao.getById(id);
    return user ? new UserDTO(user) : null;
  }

  async getUserByEmail(email) {
    const user = await this.dao.getByEmail(email);
    return user ? new UserDTO(user) : null;
  }

  async createUser(data) {
    const user = await this.dao.create(data);
    return new UserDTO(user);
  }

  async updateUser(id, data) {
    const user = await this.dao.update(id, data);
    return user ? new UserDTO(user) : null;
  }

  async deleteUser(id) {
    return await this.dao.delete(id);
  }

  async findOrCreateFromGithub(profile) {
    const email = profile._json?.email || profile.emails?.[0]?.value;
    const fullName =
      profile._json?.name || profile.displayName || profile.username;

    const [first_name, ...rest] = fullName.split(" ");
    const last_name = rest.join(" ") || "";

    let user = await this.dao.getByEmail(email);

    if (!user) {
      user = await this.dao.create({
        first_name,
        last_name,
        email,
        role: "user",
        password: "",
      });
    }

    return new UserDTO(user);
  }
}

export const usersService = new UserService();
