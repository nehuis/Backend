import CartsDAO from "../dao/carts.dao.js";
import ProductsDAO from "../dao/products.dao.js";
import CartDTO from "../dto/cart.dto.js";
import { sendTicketEmail } from "../controllers/email.controller.js";

export default class CartService {
  constructor() {
    this.dao = new CartsDAO();
    this.productsDao = new ProductsDAO();
  }

  async getAllCarts() {
    const carts = await this.dao.getAll();
    return carts.map((cart) => new CartDTO(cart));
  }

  async getCartById(id) {
    const cart = await this.dao.getById(id);
    return cart ? new CartDTO(cart) : null;
  }

  async createCart(data) {
    const cart = await this.dao.create(data);
    return new CartDTO(cart);
  }

  async updateCart(id, update) {
    const cart = await this.dao.update(id, update);
    return cart ? new CartDTO(cart) : null;
  }

  async addProduct(cartId, productId, quantity = 1) {
    const cart = await this.dao.getDocumentById(cartId);
    if (!cart) return null;

    const product = await this.productsDao.getDocumentById(productId);
    if (!product) throw new Error("Producto no encontrado");

    if (product.stock <= 0) {
      throw new Error("El producto no tiene stock disponible");
    }

    const existing = cart.products.find(
      (p) => p.product.toString() === productId
    );

    if (existing) {
      if (product.stock < existing.quantity + quantity) {
        throw new Error("No hay suficiente stock para agregar más unidades");
      }
      existing.quantity += quantity;
    } else {
      if (product.stock < quantity) {
        throw new Error("No hay suficiente stock para la cantidad solicitada");
      }
      cart.products.push({ product: productId, quantity });
    }

    const updatedCart = await cart.save();
    return new CartDTO(updatedCart.toObject());
  }

  async deleteCart(id) {
    return await this.dao.delete(id);
  }

  async removeProduct(cartId, productId) {
    const updatedCart = await this.dao.removeProduct(cartId, productId);
    return updatedCart ? new CartDTO(updatedCart) : null;
  }

  async purchaseCart(cartId, ticketService, userEmail) {
    const cart = await this.dao.getDocumentById(cartId);
    if (!cart) return null;

    let amount = 0;
    const productsNotProcessed = [];
    const productsPurchased = [];

    for (let item of cart.products) {
      const product = await this.productsDao.getDocumentById(item.product._id);

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();

        amount += product.price * item.quantity;

        productsPurchased.push({
          title: product.title,
          price: product.price,
          quantity: item.quantity,
        });
      } else {
        productsNotProcessed.push(item.product._id.toString());
      }
    }

    let ticket = null;
    if (amount > 0) {
      // creamos el ticket con detalle de productos
      ticket = await ticketService.createTicket(
        userEmail,
        amount,
        productsPurchased
      );

      // ✅ Enviar ticket al mail del usuario con los productos comprados
      if (ticket) {
        await sendTicketEmail(userEmail, {
          id: ticket._id,
          purchase_datetime: ticket.purchase_datetime,
          amount: ticket.amount,
          products: productsPurchased, // 👈 solo lo que realmente se compró
        });
      }
    }

    // dejamos en el carrito solo lo que no se procesó
    cart.products = cart.products.filter((item) =>
      productsNotProcessed.includes(item.product._id.toString())
    );

    await cart.save();

    return { ticket, productsNotProcessed };
  }
}
