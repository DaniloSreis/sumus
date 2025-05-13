import express from "express";
const router = express.Router();
import User from "../app/models/user.js"; // Acessar o modelo User
// Se fosse usar bcrypt para senhas (recomendado):
// import bcrypt from "bcryptjs"; 

router.post("/login", async (req, res) => {
  const { email, senha, tipoUsuario } = req.body;

  if (!email || !senha || !tipoUsuario) {
    return res.status(400).json({ erro: "Email, senha e tipo de usuário são obrigatórios." });
  }

  try {
    const usuario = await User.findOne({ where: { email: email } });

    if (!usuario) {
      return res.status(401).json({ erro: "Usuário não encontrado.", detalhe: "Verifique o email digitado." });
    }

    // Verificar tipo de usuário
    if (usuario.tipoUsuario !== tipoUsuario) {
      return res.status(401).json({ erro: "Tipo de usuário incorreto.", detalhe: `Este email está cadastrado como ${usuario.tipoUsuario}, não como ${tipoUsuario}.` });
    }

    // Verificar senha (comparação direta, NÃO RECOMENDADO PARA PRODUÇÃO)
    // Em um cenário real, a senha armazenada no banco estaria hasheada
    // e compararíamos usando bcrypt.compareSync(senha, usuario.senha)
    if (usuario.senha !== senha) {
      return res.status(401).json({ erro: "Credenciais inválidas.", detalhe: "Senha incorreta." });
    }

    // Login bem-sucedido
    // Poderia gerar um token JWT aqui e enviar para o cliente
    res.json({ 
      mensagem: "Login realizado com sucesso!", 
      usuario: {
        email: usuario.email,
        nome: usuario.nome,
        tipoUsuario: usuario.tipoUsuario,
        foto_path: usuario.foto_path
        // Não envie a senha de volta!
      }
    });

  } catch (err) {
    console.error("Erro no servidor durante o login:", err);
    res.status(500).json({ erro: "Erro interno do servidor ao tentar fazer login.", detalhe: err.message });
  }
});

export default router;
