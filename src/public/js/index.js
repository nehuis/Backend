const socket = io();
const form = document.getElementById("prodForm");
const list = document.getElementById("productsList");

function showProducts(products) {
  if (products.length === 0) {
    list.innerHTML = '<p class="empty">No hay productos</p>';
    return;
  }
  list.innerHTML = products
    .map(
      (p) => `
        <li class="product-card">
          <button class="delete-btn" data-id="${p.id}">✕</button>
          <h5>${p.title}</h5>
          <p>${p.description}</p>
          <span class="price">$${p.price}</span>
        </li>`
    )
    .join("");
}

socket.on("updateProducts", showProducts);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  data.price = Number(data.price);
  socket.emit("newProduct", data);
  form.reset();
});

list.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    socket.emit("deleteProduct", e.target.dataset.id);
  }
});
