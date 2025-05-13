import express from "express";
const router = express.Router();
import userController from "../app/controllers/userController.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configuração do Multer para armazenamento de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/";
    // Cria o diretório se não existir
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath); // Diretório onde os arquivos serão salvos
  },
  filename: function (req, file, cb) {
    // Define o nome do arquivo como email_timestamp.extensao para evitar conflitos
    const userEmail = req.params.email || req.body.email; // Pega o email dos parâmetros da rota ou do corpo da requisição
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, `${userEmail.replace(/[^a-zA-Z0-9]/g, "_")}_${uniqueSuffix}`);
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Filtra para aceitar apenas imagens
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Erro: O arquivo deve ser uma imagem válida (jpeg, jpg, png, gif)!");
  }
});

// Rota para criar um novo usuário (sem upload de foto no momento da criação inicial)
router.post("/", async (req, res) => {
  const { nome, email, senha, telefone, tipoUsuario } = req.body;
  if (!nome || !email || !senha || !tipoUsuario) {
    return res.status(400).json({ erro: "Campos nome, email, senha e tipoUsuario são obrigatórios." });
  }
  try {
    const novoUsuario = await userController.criar({ nome, email, senha, telefone, tipoUsuario });
    res.status(201).json({ mensagem: "Usuário criado com sucesso!", usuario: novoUsuario });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar usuário", detalhe: err.message });
  }
});

// Rota para upload/atualização de foto do usuário
// Espera o email do usuário como parâmetro na URL e a foto no campo 'fotoPerfil'
router.post("/:email/foto", upload.single("fotoPerfil"), async (req, res) => {
  const { email } = req.params;
  if (!req.file) {
    return res.status(400).json({ erro: "Nenhum arquivo de foto enviado." });
  }
  const fotoPath = req.file.path; // Caminho do arquivo salvo pelo multer

  try {
    const usuarioAtualizado = await userController.atualizarFoto(email, fotoPath);
    if (usuarioAtualizado) {
      res.json({ mensagem: "Foto do usuário atualizada com sucesso!", usuario: usuarioAtualizado });
    } else {
      res.status(404).json({ erro: "Usuário não encontrado para atualizar a foto." });
    }
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar foto do usuário", detalhe: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const usuarios = await userController.listarTodos();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar usuários", detalhe: err.message });
  }
});

// Atualizar dados do usuário (exceto foto) por email
router.put("/:email", async (req, res) => {
  const { email } = req.params;
  const dadosAtualizacao = req.body; // Contém os campos a serem atualizados (ex: nome, senha, telefone)
  try {
    const usuarioAtualizado = await userController.atualizar(email, dadosAtualizacao);
    if (usuarioAtualizado) {
      res.json({ mensagem: "Usuário atualizado com sucesso!", usuario: usuarioAtualizado });
    } else {
      res.status(404).json({ erro: "Usuário não encontrado para atualização." });
    }
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar usuário", detalhe: err.message });
  }
});

// Rota para deletar um usuário
router.delete("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const deletado = await userController.deletar(email);
    if (deletado) {
      res.json({ mensagem: "Usuário deletado com sucesso!" });
    } else {
      res.status(404).json({ erro: "Usuário não encontrado para deletar." });
    }
  } catch (err) {
    res.status(500).json({ erro: "Erro ao deletar usuário", detalhe: err.message });
  }
});


// Rota para buscar o usuário pelo email
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const usuario = await userController.buscarPorEmail(email);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ erro: "Usuário não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar usuário", detalhe: err.message });
  }
});

export default router;
