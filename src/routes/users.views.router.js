import { Router } from "express";
import { passportCall } from "../utils.js";

const router = Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/", passportCall("jwt"), (req, res) => {
  console.log(req.user);

  res.render("profile", {
    user: req.user,
  });
});

router.get("/error", (req, res) => {
  res.render("error");
});

export default router;
