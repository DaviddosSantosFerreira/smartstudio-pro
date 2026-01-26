const db = require('./database');

// Função auxiliar para compatibilidade entre SQLite e Postgres
const dbAdapter = {
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      if (process.env.NODE_ENV === 'production') {
        // PostgreSQL
        db.query(sql, params, (err, result) => {
          if (err) reject(err);
          else resolve(result.rows);
        });
      } else {
        // SQLite
        db.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      }
    });
  },

  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      if (process.env.NODE_ENV === 'production') {
        // PostgreSQL
        db.query(sql, params, (err, result) => {
          if (err) reject(err);
          else resolve({ id: result.rows[0]?.id, changes: result.rowCount });
        });
      } else {
        // SQLite
        db.run(sql, params, function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, changes: this.changes });
        });
      }
    });
  }
};

module.exports = dbAdapter;

