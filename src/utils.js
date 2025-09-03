import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

export const PRIVATE_KEY = "nehuisPrivate";

export const generateJWToken = (user) => {
  return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "2h" });
};

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Headers", authHeader);

  if (!authHeader) {
    return res
      .status(401)
      .send({ error: "Usuario no autenticado o sin token" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) return res.status(403).send({ error: "Token inválido" });

    req.user = credentials.user;
    console.log(req.user);

    next();
  });
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    console.log("Entrando a passportCall con strategy: ", strategy);
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);

      if (!user) {
        return res
          .status(401)
          .send({ error: info.message ? info.message : info.toString() });
      }

      console.log("Usuario obtenido del strategy: ", user);

      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user)
      return res.status(401).send("Unauthorized: User not found in JWT");

    if (req.user.role != role) {
      return res
        .status(403)
        .send("Forbidden: El usuario no tiene permisos con este rol");
    }
    next();
  };
};
