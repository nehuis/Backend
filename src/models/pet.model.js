import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  birthDate: { type: Date, default: Date.now },
});

export const petModel = mongoose.model("Pet", petSchema);
