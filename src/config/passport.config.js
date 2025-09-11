import passport from "passport";
import passportLocal from "passport-local";
import jwtStrategy from "passport-jwt";
import GitHubStrategy from "passport-github2";
import { userModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import { PRIVATE_KEY } from "../utils.js";

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
        console.log("Entrando a PassPort_JWT");
        try {
          console.log("JWT Obtenido del payload: ", jwt_payload);
          return done(null, jwt_payload.user);
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
        clientID: "Iv23liuqggsN2X6E50J4",
        clientSecret: "8da2ebffa1e6569db3060e2905f12fea7c399cda",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
        scope: ["user:email"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile._json?.email || profile.emails?.[0]?.value;
          const fullName =
            profile._json?.name || profile.displayName || profile.username;

          const [first_name, ...rest] = fullName.split(" ");
          const last_name = rest.join(" ") || "";

          let user = await userModel.findOne({ email });
          if (!user) {
            user = await userModel.create({
              first_name,
              last_name,
              email,
              role: "user",
              password: "",
            });
          }

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
          return done("Error al registrar el usuario. Error: " + error);
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
          return done("Error al iniciar sesión: " + error);
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
  console.log("Estramos en cookieExtractor");
  if (req && req.cookies) {
    console.log("Cookies presentes: ", req.cookies);
    token = req.cookies["jwtCookieToken"];
    console.log("JWT de la cookie: ", token);
  }

  return token;
};

export default initializePassport;
