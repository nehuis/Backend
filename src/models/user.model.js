import mongoose from "mongoose";

const userCollection = "usuarios";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: [true, "El email es obligatorio"],
  },
  password: { type: String, required: true },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
});

export const userModel = mongoose.model(userCollection, userSchema);
