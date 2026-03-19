const db = require('../config/database');

const healthCheck = async (req, res) => {
  try {
    // PG or SQLite compatible query
    const query = process.env.DATABASE_URL ? 'SELECT NOW()' : 'SELECT DATETIME("now")';
    db.query ? db.query(query, (err, result) => {
      if (err) throw err;
      res.json({ status: 'OK', db: 'connected', type: process.env.DATABASE_URL ? 'Postgres' : 'SQLite' });
    }) : db.get(query, (err) => {
      if (err) throw err;
      res.json({ status: 'OK', db: 'connected', type: 'SQLite' });
    });
  } catch (err) {
    res.status(500).json({ status: 'Error', db: 'disconnected', error: err.message });
  }
};

module.exports = { healthCheck };

