// script/conta.js
document.addEventListener("DOMContentLoaded", () => {
  const formInformacoes = document.querySelector(".form-informacoes");
  const formFoto = document.querySelector(".form-foto");
  const imgPreview = document.querySelector(".container-foto img");
  const fotoUploadInput = document.getElementById("foto-upload");

  // Tenta obter o email do usuário do localStorage (simulando um login)
  // Para teste, pode-se definir um email fixo se não houver sistema de login implementado
  const userEmail = localStorage.getItem("userEmail") || "teste@exemplo.com"; // Substitua por um email válido para teste

  async function carregarDadosUsuario() {
    if (!userEmail) {
      alert("Email do usuário não encontrado. Faça login primeiro.");
      // window.location.href = "login.html"; // Redirecionar para login
      return;
    }

    try {
      const response = await fetch(`http://localhost:3030/api/user/${userEmail}`);
      if (response.ok) {
        const usuario = await response.json();
        document.getElementById("primeiro-nome").value = usuario.nome.split(" ")[0] || "";
        document.getElementById("segundo-nome").value = usuario.nome.split(" ").slice(1).join(" ") || "";
        // Não populamos senhas por segurança.
        // Se houver foto_path, tentamos exibi-la
        if (usuario.foto_path) {
          // Assumindo que as imagens são servidas a partir da raiz do servidor /uploads/
          imgPreview.src = `/${usuario.foto_path.replace(/\\/g, "/")}`; 
        }
      } else {
        const erro = await response.json();
        console.error("Erro ao carregar dados do usuário:", erro);
        alert(`Não foi possível carregar os dados do usuário: ${erro.detalhe || erro.erro}`);
      }
    } catch (error) {
      console.error("Erro na requisição ao carregar dados:", error);
      alert("Ocorreu um erro ao buscar dados do usuário.");
    }
  }

  if (formInformacoes) {
    formInformacoes.addEventListener("submit", async (event) => {
      event.preventDefault();
      const primeiroNome = document.getElementById("primeiro-nome").value;
      const segundoNome = document.getElementById("segundo-nome").value;
      const nomeCompleto = `${primeiroNome} ${segundoNome}`.trim();
      const senhaAtual = document.getElementById("senha-atual").value; // Backend precisa validar essa senha
      const novaSenha = document.getElementById("nova-senha").value;

      const dadosAtualizacao = {};
      if (nomeCompleto) dadosAtualizacao.nome = nomeCompleto;
      if (novaSenha) {
        // Adicionar lógica para enviar senhaAtual se o backend exigir para mudar a senha
        dadosAtualizacao.senha = novaSenha; 
      }
      // Adicionar outros campos se necessário (ex: telefone, etc.)

      if (Object.keys(dadosAtualizacao).length === 0) {
        alert("Nenhum dado para atualizar.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3030/api/user/${userEmail}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosAtualizacao),
        });

        const resultado = await response.json();
        if (response.ok) {
          alert("Dados atualizados com sucesso!");
          if (resultado.usuario && resultado.usuario.nome) {
             document.getElementById("primeiro-nome").value = resultado.usuario.nome.split(" ")[0] || "";
             document.getElementById("segundo-nome").value = resultado.usuario.nome.split(" ").slice(1).join(" ") || "";
          }
          document.getElementById("senha-atual").value = "";
          document.getElementById("nova-senha").value = "";
        } else {
          alert(`Erro ao atualizar dados: ${resultado.detalhe || resultado.erro}`);
        }
      } catch (error) {
        console.error("Erro na requisição de atualização:", error);
        alert("Ocorreu um erro ao tentar atualizar os dados.");
      }
    });
  }

  if (formFoto) {
    fotoUploadInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imgPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    formFoto.addEventListener("submit", async (event) => {
      event.preventDefault();
      const fotoFile = fotoUploadInput.files[0];

      if (!fotoFile) {
        alert("Por favor, selecione uma foto para enviar.");
        return;
      }

      const formData = new FormData();
      formData.append("fotoPerfil", fotoFile);

      try {
        const response = await fetch(`http://localhost:3030/api/user/${userEmail}/foto`, {
          method: "POST",
          body: formData, // Não defina Content-Type manualmente, o browser faz isso para FormData
        });

        const resultado = await response.json();
        if (response.ok) {
          alert("Foto atualizada com sucesso!");
          if (resultado.usuario && resultado.usuario.foto_path) {
            imgPreview.src = `/${resultado.usuario.foto_path.replace(/\\/g, "/")}`; 
          }
        } else {
          alert(`Erro ao atualizar foto: ${resultado.detalhe || resultado.erro}`);
        }
      } catch (error) {
        console.error("Erro na requisição de upload de foto:", error);
        alert("Ocorreu um erro ao tentar enviar a foto.");
      }
    });
  }

  // Carregar dados do usuário ao carregar a página
  carregarDadosUsuario();
});
