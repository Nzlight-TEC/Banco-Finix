const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../'))); // Serve from root

// Routes
app.get('/api/health', require('./routes/health').healthCheck);
app.post('/api/login', require('./routes/auth').login);
app.post('/api/register', require('./routes/auth').register);

// 404 fallback to principal.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../principal.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Algo deu errado!' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido, fechando SQLite');
  const db = require('./config/database');
  db.close((err) => {
    if (err) console.error(err.message);
    process.exit(0);
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log('👤 Demo: user@test.com / 123456 (crie user real via /api/register)');
});

module.exports = server;

