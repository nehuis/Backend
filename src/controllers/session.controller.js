import SessionService from "../services/session.service.js";
import passport from "passport";

const sessionService = new SessionService();

export const githubAuth = passport.authenticate("github", {
  scope: ["user:email"],
});

export const githubCallback = [
  passport.authenticate("github"),
  async (req, res) => {
    const user = req.user;
    const tokenUser = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role,
    };
    const access_token = generateJWToken(tokenUser);
    res.cookie("jwtCookieToken", access_token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    });
    res.redirect("/views/users");
  },
];

export const register = [
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/fail-register",
  }),
  async (req, res) => {
    res.send({ status: "Success", payload: "Usuario creado con éxito" });
  },
];

export const login = [
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/fail-login",
  }),
  async (req, res) => {
    const { email, password } = req.body;
    const result = await sessionService.login(email, password);

    if (!result)
      return res
        .status(404)
        .send({ status: "Error", payload: "Usuario no encontrado" });
    if (result === "INVALID_PASSWORD")
      return res
        .status(401)
        .send({ status: "Error", payload: "Contraseña incorrecta" });

    res.cookie("jwtCookieToken", result.access_token, {
      maxAge: 60000,
      httpOnly: false,
    });
    res.send({
      status: "Success",
      access_token: result.access_token,
      message: "Login successful!",
    });
  },
];
