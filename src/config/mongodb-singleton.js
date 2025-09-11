import mongoose from "mongoose";
import config from "./config.js";

export default class MongoDBSingleton {
  static #instance = null;

  constructor() {
    this.#connectMongoDB();
  }

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new MongoDBSingleton();
    } else {
      console.log("Ya existe una instancia de MongoDBSingleton");
    }
    return this.#instance;
  }

  #connectMongoDB = async () => {
    try {
      await mongoose.connect(config.mongo_url);
      console.log("Conectado a la BD");
    } catch (error) {
      console.error("No se pudo conectar a la BD: " + error);
      process.exit();
    }
  };
}
