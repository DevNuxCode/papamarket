document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutText = document.getElementById("logoutText");

  logoutBtn.addEventListener("mouseenter", () => {
    logoutBtn.style.backgroundColor = "#dc2626"; // rojo
    logoutBtn.style.color = "#fff";
    logoutText.style.display = "inline";
  });

  logoutBtn.addEventListener("mouseleave", () => {
    logoutBtn.style.backgroundColor = "#f3f4f6"; // vuelve al gris
    logoutBtn.style.color = "#444";
    logoutText.style.display = "none";
  });
});