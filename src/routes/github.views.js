import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
  res.render("githubLogin");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/error", (req, res) => {
  res.render("register");
});

router.get("/instructions", (req, res) => {
  res.render("instructions");
});

export default router;
