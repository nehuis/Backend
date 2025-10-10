import passport from "passport";
import passportLocal from "passport-local";
import jwtStrategy from "passport-jwt";
import GitHubStrategy from "passport-github2";
import { userModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import { PRIVATE_KEY } from "../utils.js";
import { usersService } from "../services/user.service.js";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const localStrategy = passportLocal.Strategy;
const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY,
      },
      async (jwt_payload, done) => {
        try {
          const user = await userModel.findById(jwt_payload._id).lean();
          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
        scope: ["user:email"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await usersService.findOrCreateFromGithub(profile);
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },

      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, password } = req.body;
          console.log("registrando nuevo user ", req.body);

          const exist = await userModel.findOne({ email });
          if (exist) {
            console.log("El usuario ya existe");
            return done(null, false);
          }

          const userDTO = {
            first_name,
            last_name,
            email,
            password: createHash(password),
          };

          const result = await userModel.create(userDTO);

          done(null, result);
        } catch (error) {
          return done(new Error("Error al registrar el usuario: " + error));
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },

      async (req, username, password, done) => {
        try {
          const { email, password } = req.body;

          const user = await userModel.findOne({ email });
          if (!user) return done(null, false);

          if (!isValidPassword(user.password, password)) {
            console.log("Datos incorrectos");
            return done(null, false);
          }

          done(null, user);
        } catch (error) {
          return done(new Error("Error al iniciar sesión: " + error));
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      console.error("Error deserializando el usuario " + error);
    }
  });
};

const cookieExtractor = (req) => {
  let token = null;
  console.log("Entramos en cookieExtractor");
  if (req && req.cookies) {
    console.log("Cookies presentes: ", req.cookies);
    token = req.cookies["jwtCookieToken"];
    console.log("JWT de la cookie: ", token);
  }

  return token;
};

export default initializePassport;
