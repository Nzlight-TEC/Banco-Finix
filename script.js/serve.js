const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Serve static files (HTML, CSS, etc.)
app.use(express.static(path.join(__dirname)));

// Database connection from env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_lsAjznoRk30N@ep-dawn-bird-anrtle68-pooler.c-6.us-east-1.aws.neon.tech/Banco%20Finix?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    res.json({ status: 'OK', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'Error', db: 'disconnected', error: err.message });
  }
});

// Demo login API (mock first, DB later)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Mock demo user (replace with DB query later)
  if (email === 'user@test.com' && password === '123456') {
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: { email, name: 'Demo User' }
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials. Use: user@test.com / 123456' 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'principal.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing DB pool');
  await pool.end();
  process.exit(0);
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log('👤 Demo login: user@test.com / 123456');
});

