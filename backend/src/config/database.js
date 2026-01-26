const { Pool } = require('pg');

// Verifica se é produção (Render) ou desenvolvimento (Local SQLite)
// Só usa PostgreSQL se DATABASE_URL estiver definida E NODE_ENV for production
const isProduction = process.env.NODE_ENV === 'production' && process.env.DATABASE_URL;

let db;

if (isProduction && process.env.DATABASE_URL) {
  // Render PostgreSQL - só se DATABASE_URL estiver definida
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : {
      rejectUnauthorized: false
    }
  });
  db = pool;
  console.log('✅ Conectado ao PostgreSQL');
} else {
  // Local SQLite (desenvolvimento ou produção sem DATABASE_URL)
  const sqlite3 = require('sqlite3').verbose();
  const path = require('path');
  const dbPath = process.env.DB_PATH || path.join(__dirname, '../../smartstudio.sqlite');
  
  console.log('🔧 Inicializando SQLite...');
  console.log('🔧 Caminho do banco:', dbPath);
  console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
  console.log('🔧 DATABASE_URL:', process.env.DATABASE_URL ? 'Definida' : 'Não definida');
  
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ Erro ao conectar ao banco de dados:', err);
      console.error('❌ Erro detalhado:', err.message);
      console.error('❌ Stack:', err.stack);
    } else {
      console.log('✅ Conectado ao banco de dados SQLite');
      initDatabase();
    }
  });
  
  // Garantir que o banco está pronto antes de exportar
  db.on('error', (err) => {
    console.error('❌ Erro no banco de dados:', err);
  });
}

function initDatabase() {
  // Só inicializa SQLite se não estiver usando PostgreSQL
  if (isProduction) return;
  
  db.serialize(() => {
    // Tabela de Clientes
    db.run(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        cpf TEXT,
        birth_date DATE,
        address TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de Profissionais
    db.run(`
      CREATE TABLE IF NOT EXISTS professionals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        specialty TEXT,
        phone TEXT,
        email TEXT,
        commission_percentage REAL DEFAULT 0,
        active BOOLEAN DEFAULT 1,
        color TEXT DEFAULT '#3b82f6',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de Serviços
    db.run(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        duration INTEGER NOT NULL,
        price REAL NOT NULL,
        active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de Produtos
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        stock INTEGER DEFAULT 0,
        min_stock INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de Agendamentos
    db.run(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        professional_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        date DATE NOT NULL,
        time TEXT NOT NULL,
        status TEXT CHECK(status IN ('scheduled', 'confirmed', 'completed', 'cancelled')) DEFAULT 'scheduled',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (professional_id) REFERENCES professionals(id),
        FOREIGN KEY (service_id) REFERENCES services(id)
      )
    `);

    // Tabela Financeira
    db.run(`
      CREATE TABLE IF NOT EXISTS financial_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        date DATE NOT NULL,
        payment_method TEXT,
        appointment_id INTEGER,
        professional_id INTEGER,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id),
        FOREIGN KEY (professional_id) REFERENCES professionals(id)
      )
    `);

    // Tabela de Configurações de Orientação Financeira
    db.run(`
      CREATE TABLE IF NOT EXISTS orientation_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prolabore_percentage REAL DEFAULT 25,
        reinvestment_percentage REAL DEFAULT 15,
        reserve_percentage REAL DEFAULT 10,
        tax_percentage REAL DEFAULT 20,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Inserir configuração padrão
    db.run(`
      INSERT OR IGNORE INTO orientation_settings (id, prolabore_percentage, reinvestment_percentage, reserve_percentage, tax_percentage)
      VALUES (1, 25, 15, 10, 20)
    `);

    console.log('✅ Tabelas do banco de dados verificadas/criadas');
  });
}

module.exports = db;
