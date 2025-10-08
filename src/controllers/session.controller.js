import UserDTO from "../dto/user.dto.js";
import { generateJWToken } from "../utils.js";

export const register = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(400)
        .json({ status: "error", error: "Registro fallido" });
    }

    const token = generateJWToken({
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.role,
    });

    res
      .cookie("jwtCookieToken", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        sameSite: "lax", // o "none" si usás front separado
        secure: false, // true si usás HTTPS
      })
      .status(201)
      .json({
        status: "success",
        payload: new UserDTO(req.user),
      });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        status: "error",
        error: "Login fallido. Credenciales incorrectas",
      });
    }

    console.log("Usuario en login:", req.user);

    const token = generateJWToken({
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.role,
    });

    res
      .cookie("jwtCookieToken", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      })
      .status(200)
      .json({
        status: "success",
        payload: new UserDTO(req.user),
      });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const githubCallback = async (req, res) => {
  try {
    const token = generateJWToken(req.user);
    res
      .cookie("jwtCookieToken", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      })
      .redirect("/views/users");
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwtCookieToken");
  res.status(200).json({ status: "success", message: "Logout successful" });
};

export const current = (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ status: "error", message: "Not authenticated" });
  }

  return res.json({
    status: "success",
    payload: new UserDTO(req.user),
  });
};
