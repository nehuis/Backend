import { Router } from "express";
import passport from "passport";
import { userModel } from "../models/user.model.js";
import { isValidPassword } from "../utils.js";
import { generateJWToken } from "../utils.js";

const router = Router();

router.get(
  "/github",
  passport.authenticate("github", {
    scope: "[user:email]",
  }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/api/github/error",
  }),
  async (req, res) => {
    const user = req.user;

    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: `${user.email}`,
      fechaCreacion: `${user.fechaCreacion}`,
    };
    req.session.admin = true;

    res.redirect("/views/users");
  }
);

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/fail-register",
  }),
  async (req, res) => {
    res.send({
      status: "Success",
      payload: "Usuario creado con éxito",
    });
  }
);

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/fail-login",
  }),
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await userModel.findOne({ email: email });
      console.log("Usuario encontrado para login:");
      console.log(user);
      if (!user) {
        console.warn("User doesn't exists with username: " + email);
        return res.status(204).send({
          error: "Not found",
          message: "Usuario no encontrado con username: " + email,
        });
      }
      if (!isValidPassword(user.password, password)) {
        console.warn("Invalid credentials for user: " + email);
        return res.status(401).send({
          status: "error",
          error: "El usuario y la contraseña no coinciden!",
        });
      }

      const tokenUser = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        fechaCreacion: user.fechaCreacion,
        role: user.role,
      };
      const access_token = generateJWToken(tokenUser);
      console.log(access_token);

      res.cookie("jwtCookieToken", access_token, {
        maxAge: 60000,
        httpOnly: false,
      });

      res.send({
        status: "Success",
        access_token: access_token,
        message: "Login successful!",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ status: "error", error: "Error interno de la applicacion." });
    }
  }
);

router.get("/fail-register", (req, res) => {
  res.status(401).send({ error: "Error al registrar el usuario" });
});

router.get("/fail-login", (req, res) => {
  res.status(401).send({ error: "Error al loguear el usuario" });
});

export default router;
