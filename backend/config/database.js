const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, '../../banco-finix.db');
let db;

if (process.env.DATABASE_URL) {
  // Neon Postgres mode
  console.log('🔌 Conectando Neon Postgres...');
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  db.on('error', (err) => {
    console.error('Erro inesperado no pool PG:', err.stack);
  });

  // Test connection
  db.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('❌ Falha conexão PG:', err.message);
    } else {
      console.log('✅ Neon Postgres conectado!');
    }
  });

  // No auto-schema for PG (use migrations/schema.sql manual)
} else {
  // SQLite local fallback
  console.log('📱 Modo SQLite local');
  db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        type TEXT NOT NULL,
        balance REAL DEFAULT 0.00,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        account_id INTEGER,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (account_id) REFERENCES accounts (id)
      )
    `);

    // Demo user
    const demoHash = '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
    db.get("SELECT id FROM users WHERE email = 'user@test.com'", (err, row) => {
      if (!row) {
        db.run("INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
          ['user@test.com', demoHash, 'Demo User']);
      }
    });
  });
}

module.exports = db;

