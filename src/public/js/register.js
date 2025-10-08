const form = document.getElementById("registerForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  console.log("DataObj: ", obj);

  fetch("/api/sessions/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then(async (result) => {
      if (result.ok) {
        const data = await result.json();
        console.log("Registrado:", data);

        window.location.replace("/views/users");
      } else {
        const error = await result.json();
        console.error("Error en registro:", error);
        alert(error.error || "Error al registrarse");
      }
    })
    .catch((err) => console.error("Fetch error:", err));
});
