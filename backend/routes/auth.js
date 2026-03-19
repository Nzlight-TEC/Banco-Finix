const bcrypt = require('bcryptjs');
const db = require('../config/database');

const isPg = !!process.env.DATABASE_URL && db.query;

const login = (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email e senha obrigatórios' });
  }

  const q = isPg 
    ? 'SELECT id, email, name, password_hash FROM users WHERE email = $1'
    : 'SELECT id, email, name, password_hash FROM users WHERE email = ?';

  (isPg ? db.query(q, [email]) : db.get(q, [email])).then(async ([user]) => {
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    const { password_hash, ...safeUser } = user.rows ? user.rows[0] : user;
    res.json({ 
      success: true, 
      message: 'Login bem-sucedido',
      user: safeUser 
    });
  }).catch(err => {
    console.error('DB error:', err);
    res.status(500).json({ success: false, message: 'Erro DB' });
  });
};

const register = (req, res) => {
  const { email, password, name } = req.body;
  
  bcrypt.hash(password, 12, (err, password_hash) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro hash' });
    }

    const q = isPg 
      ? 'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name'
      : 'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)';

    (isPg ? db.query(q, [email, password_hash, name]) : db.run(q, [email, password_hash, name])).then(result => {
      const userId = isPg ? result.rows[0].id : result.lastID;
      const userQ = isPg 
        ? 'SELECT id, email, name FROM users WHERE id = $1'
        : 'SELECT id, email, name FROM users WHERE id = ?';

      (isPg ? db.query(userQ, [userId]) : db.get(userQ, userId)).then(([user]) => {
        res.status(201).json({ 
          success: true, 
          message: 'Usuário criado com sucesso',
          user: user.rows ? user.rows[0] : user
        });
      }).catch(err => {
        res.status(500).json({ success: false, message: 'Erro DB' });
      });
    }).catch(err => {
      if (err.code === '23505' || err.message.includes('UNIQUE')) {
        return res.status(409).json({ success: false, message: 'Email já cadastrado' });
      }
      console.error('DB error:', err);
      res.status(500).json({ success: false, message: 'Erro DB' });
    });
  });
};

module.exports = { login, register };

