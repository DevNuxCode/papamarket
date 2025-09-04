(function () {
  const html = document.documentElement;
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const collapseBtn = document.getElementById("collapseBtn");
  const themeToggle = document.getElementById("themeToggle");

  // === THEME HANDLING ===
  function setTheme(mode) {
    html.setAttribute("data-theme", mode);
    localStorage.setItem("theme", mode);

    const sun = themeToggle?.querySelector(".icon-sun");
    const moon = themeToggle?.querySelector(".icon-moon");
    if (sun && moon) {
      if (mode === "dark") {
        sun.style.display = "none";
        moon.style.display = "inline";
      } else {
        sun.style.display = "inline";
        moon.style.display = "none";
      }
    }
  }

  // Load theme (default = dark)
  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);

  // === SIDEBAR HANDLING ===
  function setSidebar(collapsed) {
    if (collapsed) {
      sidebar.classList.add("collapsed");
      localStorage.setItem("sidebar", "collapsed");
    } else {
      sidebar.classList.remove("collapsed");
      localStorage.setItem("sidebar", "expanded");
    }
  }

  // Load sidebar state (default = collapsed)
  const savedSidebar = localStorage.getItem("sidebar") || "collapsed";
  setSidebar(savedSidebar === "collapsed");

  sidebarToggle?.addEventListener("click", () => {
    setSidebar(!sidebar.classList.contains("collapsed"));
  });
  collapseBtn?.addEventListener("click", () => {
    setSidebar(!sidebar.classList.contains("collapsed"));
  });

  themeToggle?.addEventListener("click", () => {
    setTheme(html.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });
})();

// === Extra: eliminar items del carrito ===
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-item")) {
    const id = e.target.dataset.id;
    fetch(`/ventas/carrito/remove/${id}/`, {
      method: "POST",
      headers: { "X-CSRFToken": getCSRF() },
    }).then(() => location.reload());
  }
});

// === Extra: pago a proveedores ===
document.getElementById("pagoProveedorBtn")?.addEventListener("click", () => {
  const monto = prompt("Ingrese monto del pago a proveedor:");
  if (monto) {
    fetch(`/caja/pago_proveedor/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRF(),
      },
      body: JSON.stringify({ monto: monto }),
    }).then(() => location.reload());
  }
});
