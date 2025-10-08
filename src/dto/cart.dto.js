export default class CartDTO {
  constructor(cart) {
    this._id = cart._id;
    this.products = cart.products.map((p) => ({
      productId: p.product._id,
      title: p.product.title,
      price: p.product.price,
      quantity: p.quantity,
    }));
  }
}
