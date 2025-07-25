import { productModel } from "../models/product.model.js";

const loadProducts = async () => {
  return await productModel.find({});
};

const saveProducts = async (prod) => {
  const newProduct = new productModel(prod);
  return await newProduct.save();
};

const deleteProduct = async (id) => {
  await productModel.findByIdAndDelete(id);
};

export { loadProducts, saveProducts, deleteProduct };
