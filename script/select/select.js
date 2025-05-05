let select = document.querySelector(".select"),
  selectedValue = document.getElementById("selected-value"),
  optionsViewButton = document.getElementById("options-view-button"),
  inputsOptions = document.querySelectorAll(".option input");

inputsOptions.forEach((input) => {
  input.addEventListener("click", (event) => {
    selectedValue.textContent = input.dataset.label;

    const isMouserOrTouch =
      event.pointerType == "mouse" || event.pointerType == "touch";
    isMouserOrTouch && optionsViewButton.click();
  });
});
/*
  Fecha o select ao pressionar a tecla Escape ou Espaço,
  se o select estiver aberto.
*/
window.addEventListener("keydown", (e) => {
  if (!select.classList.contains("open")) return;

  if (e.key == "Escape" || e.key == " ") {
    optionsViewButton.click();
  }
});

/* 
  Ao clicar no botão, alterna a visibilidade do select.
  Se o select for aberto, foca na opção selecionada (ou na primeira).
*/
optionsViewButton.addEventListener("click", () => {
  select.classList.toggle("open");

  if (!select.classList.contains("open")) return;

  const input =
    document.querySelector(".option input:checked") ||
    document.querySelector(".option input");

  input.focus();
  input.click();
});
