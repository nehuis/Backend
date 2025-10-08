const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  try {
    const res = await fetch("/api/sessions/login", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const dataRes = await res.json();

    if (res.ok && dataRes.status === "success") {
      console.log("Logueado:", dataRes);

      window.location.replace("/views/users");
    } else {
      alert(dataRes.error || "Error en login");
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
});
