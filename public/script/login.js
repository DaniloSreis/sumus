document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("formLogin");
  const btnLogin = document.getElementById("btnLogin");

  if (formLogin && btnLogin) {
    formLogin.addEventListener("submit", async (event) => {
      event.preventDefault();
      btnLogin.disabled = true;
      btnLogin.textContent = "Entrando...";

      const email = document.getElementById("inputEmailLogin").value;
      const senha = document.getElementById("inputSenhaLogin").value;
      const tipoUsuarioRadio = document.querySelector("input[name=\"tipoUsuarioLogin\"]:checked");

      if (!tipoUsuarioRadio) {
        alert("Por favor, selecione o tipo de usuário (Passageiro ou Motorista).");
        btnLogin.disabled = false;
        btnLogin.textContent = "Entrar";
        return;
      }
      const tipoUsuario = tipoUsuarioRadio.value;

      const dadosLogin = {
        email: email,
        senha: senha,
        tipoUsuario: tipoUsuario, // O backend precisará verificar o tipo de usuário também, se relevante para o login
      };

      try {
        // A rota /api/auth/login será criada/ajustada no backend
        const response = await fetch("http://localhost:3030/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosLogin),
        });

        const resultado = await response.json();

        if (response.ok) {
          alert("Login realizado com sucesso! Você será redirecionado.");
          // Armazenar informações do usuário ou token, se o backend retornar
          // Exemplo: localStorage.setItem("userToken", resultado.token);
          localStorage.setItem("userEmail", email); // Para uso na página conta.html
          localStorage.setItem("userTipo", tipoUsuario);
          
          // Redirecionar para a página da conta ou dashboard
          window.location.href = "./conta.html"; 
        } else {
          alert(`Erro ao fazer login: ${resultado.detalhe || resultado.erro || "Credenciais inválidas ou usuário não encontrado."}`);
        }
      } catch (error) {
        console.error("Erro na requisição de login:", error);
        alert("Ocorreu um erro ao tentar fazer login. Verifique o console para mais detalhes.");
      }
      btnLogin.disabled = false;
      btnLogin.textContent = "Entrar";
    });
  }
});
