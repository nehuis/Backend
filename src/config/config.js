import dotenv from "dotenv";
import program from "../process.js";

const enviroment = program.opts().m;
console.log("enviroment:", enviroment);

dotenv.config({
  path:
    enviroment === "dev"
      ? "./src/config/.env.development"
      : "./src/config/.env.production",
});

export default {
  port: process.env.PORT,
  mongo_url: process.env.MONGO_URL,
  admin_name: process.env.ADMIN_NAME,
  admin_password: process.env.ADMIN_PASSWORD,
  secret: process.env.SECRET,
};
