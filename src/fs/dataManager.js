import fs from "fs";
import path from "path";

const productPath = path.resolve("src", "data", "products.json");
const cartPath = path.resolve("src", "data", "cart.json");

function readFile(filepath) {
  if (!fs.existsSync(filepath)) return [];
  const data = fs.readFileSync(filepath, "utf-8");
  const parsed = JSON.parse(data || "[]");
  return Array.isArray(parsed) ? parsed : [];
}

function writeFile(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

export function loadProducts() {
  return readFile(productPath);
}

export function saveProducts(products) {
  writeFile(productPath, products);
}

export function loadCart() {
  return readFile(cartPath);
}

export function saveCart(cart) {
  return writeFile(cartPath, cart);
}
