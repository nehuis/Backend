import { Router } from "express";
import jwt from "jsonwebtoken";
import { authToken, PRIVATE_KEY } from "../../utils.js";

export default class CustomRouter {
  constructor() {
    this.router = Router();
    this.init();
  }

  getRouter() {
    return this.router;
  }

  init() {}

  get(path, polices, ...callbacks) {
    console.log("Entrando con GET a custom router " + path);
    console.log(polices);

    this.router.get(
      path,
      this.handlePolices(polices),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }
  post(path, polices, ...callbacks) {
    console.log("Entrando con POST a custom router " + path);
    console.log(polices);

    this.router.post(
      path,
      this.handlePolices(polices),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }
  put(path, polices, ...callbacks) {
    console.log("Entrando con PUT a custom router " + path);
    console.log(polices);

    this.router.put(
      path,
      this.handlePolices(polices),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }
  delete(path, polices, ...callbacks) {
    console.log("Entrando con DELETE a custom router " + path);
    console.log(polices);

    this.router.delete(
      path,
      this.handlePolices(polices),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  handlePolices = (polices) => (req, res, next) => {
    console.log("Politicas a evaluar");
    console.log(polices);

    if (polices[0] === "PUBLIC") return next();

    const authHeader = req.headers.authorization;
    console.log("Token presente en el header auth:");
    console.log(authHeader);

    if (!authHeader) {
      return res
        .status(401)
        .send({ error: "Usuario no autenticado o sin token" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, PRIVATE_KEY, (err, credentials) => {
      if (err)
        return res.status(403).send({ error: "Token inválido, no autorizado" });

      const userData = credentials.user;
      console.log(userData);

      if (!policies.includes(userData.role.toUpperCase())) {
        return res.status(403).send({ error: "Usuario no autorizado" });
      }

      req.user = userData;
      next();
    });
  };

  generateCustomResponses = (req, res, next) => {
    res.sendSuccess = (payload) =>
      res.status(200).send({ status: "Success", payload: payload });

    res.sendInternalServerError = (error) =>
      res.status(500).send({ status: "Error", error });

    res.sendClientError = (error) =>
      res
        .status(400)
        .send({ status: "Client Error, Bad request from client.", error });

    res.sendUnauthorizedError = (error) =>
      res
        .status(401)
        .send({ error: "User not authenticated or missing token." });

    res.sendForbiddenError = (error) =>
      res.status(403).send({
        error:
          "Token invalid or user with no access, Unauthorized please check your roles!",
      });
    next();
  };

  applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (error) {
        params[1].status(500).send(error);
      }
    });
  }
}
