const db = require('./database');

// Função auxiliar para converter placeholders ? para $1, $2, etc (PostgreSQL)
function convertPlaceholders(sql, params) {
  let convertedSql = sql;
  let paramIndex = 1;
  convertedSql = convertedSql.replace(/\?/g, () => `$${paramIndex++}`);
  return convertedSql;
}

// Função auxiliar para compatibilidade com PostgreSQL
const dbAdapter = {
  all: (sql, params = []) => {
    const convertedSql = convertPlaceholders(sql, params);
    return db.query(convertedSql, params || [])
      .then(result => result.rows || [])
      .catch(err => {
        console.error('❌ dbAdapter.all (PostgreSQL) - Erro:', err);
        console.error('❌ SQL:', convertedSql);
        console.error('❌ Params:', params);
        return Promise.reject(err);
      });
  },

  get: (sql, params = []) => {
    const convertedSql = convertPlaceholders(sql, params);
    return db.query(convertedSql, params || [])
      .then(result => result.rows[0] || null)
      .catch(err => {
        console.error('❌ dbAdapter.get (PostgreSQL) - Erro:', err);
        console.error('❌ SQL:', convertedSql);
        console.error('❌ Params:', params);
        return Promise.reject(err);
      });
  },

  run: (sql, params = []) => {
    const convertedSql = convertPlaceholders(sql, params);
    return db.query(convertedSql, params || [])
      .then(result => {
        // Para INSERT com RETURNING, retorna o ID do resultado
        const id = result.rows[0]?.id || null;
        return { id: id, changes: result.rowCount || 0 };
      })
      .catch(err => {
        console.error('❌ dbAdapter.run (PostgreSQL) - Erro:', err);
        console.error('❌ SQL:', convertedSql);
        console.error('❌ Params:', params);
        return Promise.reject(err);
      });
  }
};

module.exports = dbAdapter;
