const db = require('./database');

// Verificar se está usando PostgreSQL ou SQLite
const isProduction = process.env.NODE_ENV === 'production' && process.env.DATABASE_URL;

// Função auxiliar para converter placeholders ? para $1, $2, etc (PostgreSQL)
function convertPlaceholders(sql, params) {
  if (isProduction) {
    let convertedSql = sql;
    let paramIndex = 1;
    convertedSql = convertedSql.replace(/\?/g, () => `$${paramIndex++}`);
    return convertedSql;
  }
  return sql;
}

// Função auxiliar para compatibilidade entre SQLite e Postgres
const dbAdapter = {
  all: (sql, params = []) => {
    if (isProduction) {
      const convertedSql = convertPlaceholders(sql, params);
      return db.query(convertedSql, params)
        .then(result => result.rows || [])
        .catch(err => {
          console.error('❌ dbAdapter.all (PostgreSQL) - Erro:', err);
          return Promise.reject(err);
        });
    } else {
      return new Promise((resolve, reject) => {
        if (!db) {
          return reject(new Error('Banco de dados não inicializado'));
        }
        db.all(sql, params || [], (err, rows) => {
          if (err) {
            console.error('❌ dbAdapter.all (SQLite) - Erro:', err);
            console.error('❌ SQL:', sql);
            console.error('❌ Params:', params);
            reject(err);
          } else {
            resolve(rows || []);
          }
        });
      });
    }
  },

  get: (sql, params = []) => {
    if (isProduction) {
      const convertedSql = convertPlaceholders(sql, params);
      return db.query(convertedSql, params)
        .then(result => result.rows[0] || null)
        .catch(err => Promise.reject(err));
    } else {
      return new Promise((resolve, reject) => {
        if (!db) {
          return reject(new Error('Banco de dados não inicializado'));
        }
        db.get(sql, params || [], (err, row) => {
          if (err) {
            console.error('❌ dbAdapter.get (SQLite) - Erro:', err);
            reject(err);
          } else {
            resolve(row || null);
          }
        });
      });
    }
  },

  run: (sql, params = []) => {
    if (isProduction) {
      const convertedSql = convertPlaceholders(sql, params);
      return db.query(convertedSql, params)
        .then(result => {
          const id = result.rows[0]?.id || null;
          return { id: id, changes: result.rowCount };
        })
        .catch(err => {
          console.error('❌ dbAdapter.run (PostgreSQL) - Erro:', err);
          return Promise.reject(err);
        });
    } else {
      return new Promise((resolve, reject) => {
        if (!db) {
          return reject(new Error('Banco de dados não inicializado'));
        }
        db.run(sql, params || [], function(err) {
          if (err) {
            console.error('❌ dbAdapter.run (SQLite) - Erro:', err);
            console.error('❌ SQL:', sql);
            console.error('❌ Params:', params);
            reject(err);
          } else {
            const lastID = this.lastID;
            const changes = this.changes;
            
            if (lastID === undefined || lastID === null) {
              db.get('SELECT last_insert_rowid() as id', [], (err, row) => {
                if (err) {
                  reject(new Error('Falha ao obter ID do registro inserido: ' + err.message));
                } else {
                  resolve({ id: row.id, changes: changes || 0 });
                }
              });
            } else {
              resolve({ id: lastID, changes: changes || 0 });
            }
          }
        });
      });
    }
  }
};

module.exports = dbAdapter;

