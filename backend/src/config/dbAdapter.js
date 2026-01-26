const db = require('./database');

// Função auxiliar para converter placeholders ? para $1, $2, etc (PostgreSQL)
function convertPlaceholders(sql, params) {
  if (process.env.NODE_ENV === 'production') {
    let convertedSql = sql;
    let paramIndex = 1;
    // Substitui cada ? sequencialmente por $1, $2, etc
    convertedSql = convertedSql.replace(/\?/g, () => `$${paramIndex++}`);
    return convertedSql;
  }
  return sql;
}

// Função auxiliar para compatibilidade entre SQLite e Postgres
const dbAdapter = {
  all: (sql, params = []) => {
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL
      const convertedSql = convertPlaceholders(sql, params);
      return db.query(convertedSql, params)
        .then(result => result.rows)
        .catch(err => Promise.reject(err));
    } else {
      // SQLite
      return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    }
  },

  get: (sql, params = []) => {
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL
      const convertedSql = convertPlaceholders(sql, params);
      return db.query(convertedSql, params)
        .then(result => result.rows[0] || null)
        .catch(err => Promise.reject(err));
    } else {
      // SQLite
      return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    }
  },

  run: (sql, params = []) => {
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL - se SQL contém RETURNING, retorna o ID do resultado
      const convertedSql = convertPlaceholders(sql, params);
      return db.query(convertedSql, params)
        .then(result => {
          const id = result.rows[0]?.id || null;
          return { id: id, changes: result.rowCount };
        })
        .catch(err => Promise.reject(err));
    } else {
      // SQLite
      return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, changes: this.changes });
        });
      });
    }
  }
};

module.exports = dbAdapter;

