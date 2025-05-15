// server.js
const express = require('express');
const cors = require('cors');
const bookRoutes = require('./controllers/bookController');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rotas
app.use('/books', bookRoutes);

// Servir o frontend (opcional, para facilitar o desenvolvimento)
app.use(express.static(path.join(__dirname, '../frontend')));

// Rota padrão
app.get('/', (req, res) => {
  res.json({ message: 'API de Gerenciamento de Biblioteca' });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  res.status(500).json({ 
    message: 'Erro interno no servidor', 
    error: process.env.NODE_ENV === 'production' ? 'Ocorreu um erro interno' : err.message 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});