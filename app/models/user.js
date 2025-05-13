import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';

class User extends Model {}

User.init({
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  // Adicionando campo para o caminho da foto do usuário
  foto_path: {
    type: DataTypes.STRING,
    allowNull: true, // Permite que o usuário não tenha foto inicialmente
  },
  // Adicionando os campos que faltavam do formulário criar-conta.html
  senha: {
    type: DataTypes.STRING,
    allowNull: false, // Senha deve ser obrigatória
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true, // Telefone pode ser opcional
  },
  tipoUsuario: { // 'passageiro' ou 'motorista'
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: false, // Mantendo como false, mas idealmente true para createdAt/updatedAt
});

export default User;
