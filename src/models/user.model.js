import mongoose from "mongoose";

const userCollection = "usuarios";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: [true, "El email es obligatorio"],
  },
  password: String,
});

export const userModel = mongoose.model(userCollection, userSchema);
