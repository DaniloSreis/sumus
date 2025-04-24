const menuHamburguer = document.querySelector(".menu-hamburguer");
const linksNavegacao = document.querySelector(".links-navegacao");
const containerMenu = document.querySelector(".container-menu");

menuHamburguer.addEventListener("click", () => {
  if (menuHamburguer.classList.contains("aberto")) {
    menuHamburguer.classList.remove("aberto");
    menuHamburguer.classList.add("fechado");
  } else {
    menuHamburguer.classList.remove("fechado");
    menuHamburguer.classList.add("aberto");
  }
  containerMenu.classList.toggle("aberto");
  linksNavegacao.classList.toggle("mostrar");
});
