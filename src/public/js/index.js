const cartId = document.body.dataset.cartid;

function agregarAlCarrito(productId) {
  const quantity = Number(document.getElementById("qty").value) || 1;

  fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error al agregar al carrito");
      return res.json();
    })
    .then(() => {
      Toastify({
        text: "Producto agregado al carrito",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#4caf50",
        stopOnFocus: true,
      }).showToast();
    })
    .catch((err) => {
      console.error("Error al agregar al carrito:", err);
      Toastify({
        text: "Error al agregar el producto",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#f44336",
        stopOnFocus: true,
      }).showToast();
    });
}
