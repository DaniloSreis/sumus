document.addEventListener("DOMContentLoaded", () => {
  const formCadastro = document.getElementById("formCadastro");
  const btnCriarConta = document.getElementById("btnCriarConta");

  if (formCadastro && btnCriarConta) {
    formCadastro.addEventListener("submit", async (event) => {
      event.preventDefault();
      btnCriarConta.disabled = true;
      btnCriarConta.textContent = "Enviando...";

      const nome = document.getElementById("inputNome").value;
      const email = document.getElementById("inputEmail").value;
      const senha = document.getElementById("inputSenha").value;
      const telefone = document.getElementById("inputTelefone").value;
      const tipoUsuarioRadio = document.querySelector("input[name='tipoUsuario']:checked");
      
      if (!tipoUsuarioRadio) {
        alert("Por favor, selecione o tipo de usuário (Passageiro ou Motorista).");
        btnCriarConta.disabled = false;
        btnCriarConta.textContent = "Criar Conta";
        return;
      }
      const tipoUsuario = tipoUsuarioRadio.value;

      // Montando o objeto com todos os dados do formulário
      const dadosUsuario = {
        nome: nome,
        email: email,
        senha: senha, // Descomentado para enviar a senha
        telefone: telefone, // Descomentado para enviar o telefone (o backend o trata como opcional)
        tipoUsuario: tipoUsuario // Descomentado para enviar o tipo de usuário
      };

      // Adicionando o console.log para depuração, como sugerido anteriormente
      console.log("Dados enviados para o backend:", dadosUsuario);

      try {
        const response = await fetch("http://localhost:3030/api/user/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosUsuario),
        });

        const resultado = await response.json();

        if (response.ok) {
          alert("Usuário criado com sucesso! Você será redirecionado para a página de login.");
          // Idealmente, redirecionar para uma página de login ou para a página da conta
          window.location.href = "/login.html"; // Exemplo
          console.log("Usuário criado:", resultado);
          formCadastro.reset(); 
        } else {
          // Exibe a mensagem de erro vinda do backend, ou uma mensagem genérica
          alert(`Erro ao criar usuário: ${resultado.detalhe || resultado.erro || "Erro desconhecido"}`);
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Ocorreu um erro ao tentar criar a conta. Verifique o console para mais detalhes.");
      }
      btnCriarConta.disabled = false;
      btnCriarConta.textContent = "Criar Conta";
    });
  }
});
