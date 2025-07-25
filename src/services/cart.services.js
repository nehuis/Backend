import { cartModel } from "../models/cart.model.js";

const loadCarts = async () => {
  return await cartModel.find({});
};

export { loadCarts };
