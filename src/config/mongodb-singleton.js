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
      await mongoose.connect(process.env.MONGO_URL);
      logger.debug("Conectado a la BD");
    } catch (error) {
      console.error("No se pudo conectar a la BD: " + error);
      process.exit();
    }
  };
}
