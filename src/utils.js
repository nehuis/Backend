import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
import { faker } from "@faker-js/faker";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const passwordHash = bcrypt.hashSync("coder123", 10);

export default __dirname;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/public/img`);
  },

  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

export const uploader = multer({
  storage,
  onError: function (err, next) {
    console.log(err);
    next();
  },
});

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (passwordDB, passwordClient) => {
  console.log(`Datos a validar: ${passwordDB}, ${passwordClient}`);

  return bcrypt.compareSync(passwordClient, passwordDB);
};

export const PRIVATE_KEY = process.env.PRIVATE_KEY;

export const generateJWToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    },
    PRIVATE_KEY,
    { expiresIn: "24h" }
  );
};

export const authToken = (req, res, next) => {
  const token = req.cookies?.jwtCookieToken;
  console.log("Token desde cookie:", token);
  if (!token) {
    return res
      .status(401)
      .json({ error: "Usuario no autenticado o sin token" });
  }
  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) {
      console.error("Error verificando token:", error?.message || error);
      return res.status(403).json({ error: "Token inválido" });
    }
    req.user = credentials;
    console.log("Usuario autenticado:", req.user);
    next();
  });
};

export const passportCall = (strategy) => {
  return (req, res, next) => {
    console.log("Entrando a passportCall con strategy:", strategy);
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) {
        console.error("Error en Passport:", err);
        return next(err);
      }

      if (!user) {
        console.warn("No se encontró usuario en JWT:", info);
        return res.status(401).json({
          error: info?.message || "Usuario no autenticado",
        });
      }

      console.log("Usuario obtenido del strategy:", user);
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (...roles) => {
  return async (req, res, next) => {
    console.log("Roles permitidos:", roles);
    console.log("Usuario recibido en req.user:", req.user);

    if (!req.user) {
      return res.status(401).send("Unauthorized: User not found in JWT");
    }

    if (!roles.includes(req.user.role)) {
      console.log("Acceso denegado:", req.user.role);
      return res
        .status(403)
        .send(`Acceso denegado: el rol '${req.user.role}' no tiene permisos`);
    }

    next();
  };
};

export const generateUser = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: passwordHash,
    role: faker.helpers.arrayElement(["user", "admin"]),
    pets: [],
  };
};

export const generatePet = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    name: faker.animal.dog(),
    species: faker.animal.type(),
    birthDate: faker.date.past(),
  };
};
