let cartId = localStorage.getItem("cartId");

const toggleBtn = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");

async function ensureCart() {
  if (!cartId) {
    try {
      const res = await fetch("/api/carts", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al crear carrito");
      const data = await res.json();

      cartId = data.cart?.id || data.cart?._id || data._id || data.payload?._id;
      if (!cartId) throw new Error("No se pudo obtener el ID del carrito");

      localStorage.setItem("cartId", cartId);
      console.log("Nuevo carrito creado:", cartId);
    } catch (error) {
      console.error("Error al crear carrito:", error);
    }
  }
}

async function agregarAlCarrito(pid) {
  try {
    await ensureCart();
    const qty = document.getElementById("qty")?.value || 1;

    const res = await fetch(`/api/carts/${cartId}/products/${pid}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty }),
    });

    if (!res.ok) throw new Error("Error al agregar al carrito");

    Toastify({
      text: "Producto agregado al carrito",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "green",
    }).showToast();
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    Toastify({
      text: "Error al agregar al carrito",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "red",
    }).showToast();
  }
}

async function finalizarCompra() {
  try {
    if (!cartId) {
      Toastify({
        text: "No tenés un carrito activo",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "orange",
      }).showToast();
      return;
    }

    const res = await fetch(`/api/carts/${cartId}/purchase`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al procesar compra");

    const data = await res.json();
    Toastify({
      text: "Compra realizada con éxito. Ticket ID: " + data.ticket._id,
      duration: 4000,
      gravity: "top",
      position: "right",
      backgroundColor: "blue",
    }).showToast();

    localStorage.removeItem("cartId");
    cartId = null;
  } catch (error) {
    console.error("Error al finalizar compra:", error);
    Toastify({
      text: "Error al finalizar compra",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "red",
    }).showToast();
  }
}

if (currentTheme === "dark") {
  document.body.classList.add("dark-mode");
  toggleBtn.textContent = "☀️";
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const newTheme = document.body.classList.contains("dark-mode")
    ? "dark"
    : "light";
  toggleBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", newTheme);
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-ir-carrito");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const cartId = localStorage.getItem("cartId");

    if (cartId) {
      window.location.href = `/views/carts/${cartId}`;
    } else {
      Toastify({
        text: "No tenés un carrito activo",
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        stopOnFocus: true,
        style: {
          background: "linear-gradient(135deg, #ffee00ff, #c7565f)",
          color: "#fff",
          fontWeight: "600",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
      }).showToast();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const cartId = document.body.dataset.cartid;
  if (cartId) {
    localStorage.setItem("cartId", cartId);
  }

  const items = document.querySelectorAll(".cart-item");
  if (items.length > 0) {
    let total = 0;
    items.forEach((item) => {
      const priceEl = item.querySelector(".item-price");
      const qtyEl = item.querySelector(".item-qty");
      if (!priceEl || !qtyEl) return;

      const price = parseFloat(priceEl.textContent.replace(/[^\d.]/g, ""));
      const qty = parseInt(qtyEl.textContent.replace(/[^\d]/g, ""));
      total += price * qty;
    });

    const totalEl = document.getElementById("total");
    if (totalEl) totalEl.textContent = "$" + total.toFixed(2);
  }
});
