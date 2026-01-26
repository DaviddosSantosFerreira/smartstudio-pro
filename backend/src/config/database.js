const { Pool } = require('pg');

// Verifica se é produção (Render) ou desenvolvimento (Local SQLite)
const isProduction = process.env.NODE_ENV === 'production';

let db;

if (isProduction) {
  // Render PostgreSQL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  db = pool;
} else {
  // Local SQLite (mantém para testes locais, embora o script initPostgres.js seja para Postgres)
  const sqlite3 = require('sqlite3').verbose();
  const path = require('path');
  const dbPath = process.env.DB_PATH || path.join(__dirname, '../../smartstudio.sqlite');
  db = new sqlite3.Database(dbPath);
}

module.exports = db;
