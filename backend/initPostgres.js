const { Pool } = require('pg');

// Use sua URL do banco aqui
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://smartstudio_db_user:cQn0BwG90vrYMuNsBxmDsSIY5OKhKinj@dpg-d5rc1q9r0fns73e2mn10-a/smartstudio_db',
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDB() {
  try {
    console.log('Conectando ao PostgreSQL...');
    await pool.connect();
    console.log('Conectado com sucesso!');

    // Tabela de Clientes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(255),
        cpf VARCHAR(14),
        birth_date DATE,
        address TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabela "clients" criada/verificada.');

    // Tabela de Profissionais
    await pool.query(`
      CREATE TABLE IF NOT EXISTS professionals (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        specialty VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabela "professionals" criada/verificada.');

    // Tabela de Serviços
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        duration_minutes INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabela "services" criada/verificada.');

    // Tabela de Agendamentos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        client_id INT REFERENCES clients(id),
        professional_id INT REFERENCES professionals(id),
        service_id INT REFERENCES services(id),
        appointment_date TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'scheduled',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabela "appointments" criada/verificada.');
    
    // Inserir dados de teste se não existirem
    const checkClients = await pool.query('SELECT COUNT(*) FROM clients');
    if (parseInt(checkClients.rows[0].count) === 0) {
        console.log('Inserindo dados de teste...');
        await pool.query("INSERT INTO clients (name, phone, email) VALUES ('Ana Costa', '11999887766', 'ana@email.com')");
        await pool.query("INSERT INTO clients (name, phone, email) VALUES ('Pedro Oliveira', '11999887767', 'pedro@email.com')");
        await pool.query("INSERT INTO professionals (name, specialty) VALUES ('Dr. Silva', 'Geral')");
        await pool.query("INSERT INTO services (name, price, duration_minutes) VALUES ('Consulta', 100.00, 30)");
        console.log('Dados de teste inseridos.');
    }

    console.log('Banco de dados inicializado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
    process.exit(1);
  }
}

initDB();

module.exports = initDB;

