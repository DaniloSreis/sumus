const menuHamburguer = document.querySelector(".menu-hamburguer");
const linhas = document.querySelectorAll(".linha");
const linksNavegacao = document.querySelectorAll(".links-navegacao li");
const containerLinksNavegacao = document.querySelector(".links-navegacao");
let headerHeight = document.querySelector("header").offsetHeight;

document.querySelector(".links-navegacao").style.top = `${headerHeight}px`;
document.querySelector(".links-navegacao").style.height = `calc(100vh + ${headerHeight}px)`;

menuHamburguer.addEventListener("click", () => {
  linhas.forEach((linha) => {
    if (linha.classList.contains("aberto")) {
      linha.classList.remove("aberto");
      linha.classList.add("fechado");
    } else {
      linha.classList.remove("fechado");
      linha.classList.add("aberto");
    }
  });

  for (let i = 0; i < linksNavegacao.length; i++) {
    if (linhas[1].classList.contains("aberto")) {
      linksNavegacao[i].style.display = "block";
    } else {
      linksNavegacao[i].style.display = "none";
    }
  }

  containerLinksNavegacao.classList.toggle("ativo");
});
