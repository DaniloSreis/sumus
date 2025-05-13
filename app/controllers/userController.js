// controllers/UserController.js
import User from "../models/user.js";
import path from "path"; // Para lidar com caminhos de arquivo

class UserController {
  // Método para criar usuário, agora incluindo senha, telefone e tipoUsuario
  async criar(dadosUsuario) {
    const { nome, email, senha, telefone, tipoUsuario } = dadosUsuario;
    // Idealmente, a senha deve ser hasheada antes de salvar
    const usuario = await User.create({ nome, email, senha, telefone, tipoUsuario });
    console.log("Usuário criado:", usuario.toJSON());
    return usuario.toJSON(); // Retorna o usuário criado para feedback no frontend
  }

  async listarTodos() {
    const usuarios = await User.findAll();
    return usuarios.map((u) => u.toJSON());
  }

  // Método para atualizar usuário, pode incluir nome, senha, etc.
  // A atualização de foto será um método separado para lidar com o upload do arquivo.
  async atualizar(emailAntigo, dadosAtualizacao) {
    // Exemplo: dadosAtualizacao pode conter { nome, novaSenha, telefone }
    // Se novaSenha for fornecida, ela deve ser hasheada.
    const [numLinhasAfetadas] = await User.update(dadosAtualizacao, {
      where: { email: emailAntigo },
    });
    if (numLinhasAfetadas > 0) {
      console.log("Usuário atualizado.");
      const usuarioAtualizado = await this.buscarPorEmail(emailAntigo); // Busca o usuário com os dados atualizados
      return usuarioAtualizado;
    }
    return null; // Indica que nenhum usuário foi atualizado (ex: email não encontrado)
  }

  async deletar(email) {
    const numLinhasAfetadas = await User.destroy({ where: { email } });
    if (numLinhasAfetadas > 0) {
      console.log("Usuário deletado.");
      return true;
    }
    return false; // Indica que nenhum usuário foi deletado
  }

  async buscarPorEmail(email) {
    const usuario = await User.findOne({ where: { email } });
    return usuario ? usuario.toJSON() : null;
  }

  // Novo método para atualizar a foto do usuário
  async atualizarFoto(email, fotoPath) {
    const [numLinhasAfetadas] = await User.update({ foto_path: fotoPath }, {
      where: { email: email },
    });
    if (numLinhasAfetadas > 0) {
      console.log(`Foto do usuário ${email} atualizada para ${fotoPath}`);
      const usuarioAtualizado = await this.buscarPorEmail(email);
      return usuarioAtualizado;
    }
    return null;
  }
}

export default new UserController();
