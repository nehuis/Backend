import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  githubCallback,
  current,
  logout,
} from "../controllers/session.controller.js";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/views/users",
  }),
  register
);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/views/users" }),
  login
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/views/users/login" }),
  githubCallback
);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  current
);
router.post("/logout", logout);

export default router;
