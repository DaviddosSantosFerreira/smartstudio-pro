const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../smartstudio.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('✅ Conectado ao banco de dados SQLite');
    initDatabase();
  }
});

function initDatabase() {
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

    // Inserir dados de exemplo
    insertSampleData();
  });
}

function insertSampleData() {
  // Profissionais de exemplo
  const professionals = [
    { name: 'Maria Silva', specialty: 'Cabeleireira', phone: '11987654321', email: 'maria@email.com', commission_percentage: 50, color: '#ec4899' },
    { name: 'João Santos', specialty: 'Barbeiro', phone: '11987654322', email: 'joao@email.com', commission_percentage: 45, color: '#3b82f6' }
  ];

  const insertProfessional = db.prepare(`
    INSERT OR IGNORE INTO professionals (name, specialty, phone, email, commission_percentage, color)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  professionals.forEach(p => {
    insertProfessional.run(p.name, p.specialty, p.phone, p.email, p.commission_percentage, p.color);
  });
  insertProfessional.finalize();

  // Serviços de exemplo
  const services = [
    { name: 'Corte Feminino', description: 'Corte e finalização', duration: 60, price: 80.00 },
    { name: 'Corte Masculino', description: 'Corte + barba', duration: 45, price: 50.00 },
    { name: 'Coloração', description: 'Aplicação de cor', duration: 120, price: 150.00 },
    { name: 'Escova', description: 'Escova modeladora', duration: 45, price: 60.00 }
  ];

  const insertService = db.prepare(`
    INSERT OR IGNORE INTO services (name, description, duration, price)
    VALUES (?, ?, ?, ?)
  `);

  services.forEach(s => {
    insertService.run(s.name, s.description, s.duration, s.price);
  });
  insertService.finalize();

  // Produtos de exemplo
  const products = [
    { name: 'Shampoo Profissional', description: '500ml', price: 45.00, stock: 20, min_stock: 5 },
    { name: 'Condicionador', description: '500ml', price: 40.00, stock: 15, min_stock: 5 },
    { name: 'Máscara Capilar', description: '250g', price: 65.00, stock: 10, min_stock: 3 }
  ];

  const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products (name, description, price, stock, min_stock)
    VALUES (?, ?, ?, ?, ?)
  `);

  products.forEach(p => {
    insertProduct.run(p.name, p.description, p.price, p.stock, p.min_stock);
  });
  insertProduct.finalize();

  // Clientes de exemplo
  const clients = [
    { name: 'Ana Costa', phone: '11999887766', email: 'ana@email.com' },
    { name: 'Pedro Oliveira', phone: '11999887767', email: 'pedro@email.com' }
  ];

  const insertClient = db.prepare(`
    INSERT OR IGNORE INTO clients (name, phone, email)
    VALUES (?, ?, ?)
  `);

  clients.forEach(c => {
    insertClient.run(c.name, c.phone, c.email);
  });
  insertClient.finalize();
}

module.exports = db;

