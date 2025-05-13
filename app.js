import dotenv from 'dotenv';
dotenv.config();

import express, { json } from 'express';
import cors from 'cors';
import routes from './routes/web.js';
import sequelize from './config/database.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.APP_PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://127.0.0.1:8080'] 
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(json());
app.use('/api', routes);
 
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


app.use(json());

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado ao banco com sucesso!');
    await sequelize.sync({ alter: true }); 
    console.log('Modelos sincronizados com o banco de dados.');
  } catch (err) {
    console.error('Erro ao conectar ou sincronizar com o banco:', err);
  }
})();

export default app;
