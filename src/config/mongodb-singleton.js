import mongoose from "mongoose";
import { logger } from "./logger_CUSTOM.js";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

export default class MongoDBSingleton {
  static #instance = null;

  constructor() {
    this.#connectMongoDB();
  }

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new MongoDBSingleton();
    } else {
      logger.warn("Ya existe una instancia de MongoDBSingleton");
    }
    return this.#instance;
  }

  #connectMongoDB = async () => {
    try {
      const env = process.env.NODE_ENV || "development";

      const mongoUrl =
        env === "test" ? process.env.MONGO_URL_TEST : process.env.MONGO_URL;

      await mongoose.connect(mongoUrl, {});

      logger.debug(`Conectado a MongoDB (${env})`);
    } catch (error) {
      console.error("No se pudo conectar a la BD: " + error);
      process.exit();
    }
  };
}
