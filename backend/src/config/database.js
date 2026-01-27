const { Pool } = require('pg');

// Configuração da conexão PostgreSQL
const isProduction = process.env.NODE_ENV === 'production';

let connectionString;
if (isProduction) {
  // Produção: usar DATABASE_URL do ambiente
  connectionString = process.env.DATABASE_URL;
} else {
  // Local: usar postgres://postgres:SENHA_LOCAL@localhost:5432/smartstudio_local
  const senhaLocal = process.env.SENHA_LOCAL || 'postgres';
  connectionString = `postgres://postgres:${senhaLocal}@localhost:5432/smartstudio_local`;
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: isProduction && !connectionString.includes('localhost') ? {
    rejectUnauthorized: false
  } : false
});

pool.on('error', (err) => {
  console.error('❌ Erro no pool do PostgreSQL:', err);
});

// Testar conexão e inicializar banco
(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conectado ao PostgreSQL');
    client.release();
    await initDatabase();
  } catch (error) {
    console.error('❌ Erro ao conectar ao PostgreSQL:', error);
  }
})();

async function initDatabase() {
  try {
    const client = await pool.connect();
    
    // Tabela de Clientes
    await client.query(`
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
      )
    `);

    // Tabela de Profissionais
    await client.query(`
      CREATE TABLE IF NOT EXISTS professionals (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialty VARCHAR(255),
        phone VARCHAR(20),
        email VARCHAR(255),
        commission_percentage DECIMAL(5,2) DEFAULT 0,
        active BOOLEAN DEFAULT true,
        color VARCHAR(7) DEFAULT '#3b82f6',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de Serviços
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        duration INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de Produtos
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INTEGER DEFAULT 0,
        min_stock INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de Agendamentos
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL,
        professional_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        date DATE NOT NULL,
        time VARCHAR(10) NOT NULL,
        status VARCHAR(20) DEFAULT 'scheduled',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT appointments_status_check CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (professional_id) REFERENCES professionals(id),
        FOREIGN KEY (service_id) REFERENCES services(id)
      )
    `);

    // Tabela Financeira
    await client.query(`
      CREATE TABLE IF NOT EXISTS financial_transactions (
        id SERIAL PRIMARY KEY,
        type VARCHAR(10) NOT NULL,
        category VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        date DATE NOT NULL,
        payment_method VARCHAR(50),
        appointment_id INTEGER,
        professional_id INTEGER,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT financial_transactions_type_check CHECK (type IN ('income', 'expense')),
        FOREIGN KEY (appointment_id) REFERENCES appointments(id),
        FOREIGN KEY (professional_id) REFERENCES professionals(id)
      )
    `);

    // Tabela de Configurações de Orientação Financeira
    await client.query(`
      CREATE TABLE IF NOT EXISTS orientation_settings (
        id SERIAL PRIMARY KEY,
        prolabore_percentage DECIMAL(5,2) DEFAULT 25,
        reinvestment_percentage DECIMAL(5,2) DEFAULT 15,
        reserve_percentage DECIMAL(5,2) DEFAULT 10,
        tax_percentage DECIMAL(5,2) DEFAULT 20,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Inserir configuração padrão
    const checkSettings = await client.query('SELECT COUNT(*) as count FROM orientation_settings WHERE id = 1');
    if (parseInt(checkSettings.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO orientation_settings (id, prolabore_percentage, reinvestment_percentage, reserve_percentage, tax_percentage)
        VALUES (1, 25, 15, 10, 20)
      `);
    }

    // Inserir dados de exemplo
    await insertSampleData(client);

    client.release();
    console.log('✅ Tabelas do banco de dados verificadas/criadas');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
  }
}

async function insertSampleData(client) {
  try {
    // Verificar se já existem dados
    const checkClients = await client.query('SELECT COUNT(*) as count FROM clients');
    if (parseInt(checkClients.rows[0].count) > 0) {
      console.log('ℹ️ Dados de exemplo já existem, pulando inserção');
      return;
    }

    // Profissionais de exemplo
    const checkProfessionals = await client.query('SELECT COUNT(*) as count FROM professionals WHERE name IN ($1, $2)', ['Maria Silva', 'João Santos']);
    if (parseInt(checkProfessionals.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO professionals (name, specialty, phone, email, commission_percentage, color)
        VALUES 
          ('Maria Silva', 'Cabeleireira', '11987654321', 'maria@email.com', 50, '#ec4899'),
          ('João Santos', 'Barbeiro', '11987654322', 'joao@email.com', 45, '#3b82f6')
      `);
    }

    // Serviços de exemplo
    const checkServices = await client.query('SELECT COUNT(*) as count FROM services WHERE name IN ($1, $2, $3, $4)', ['Corte Feminino', 'Corte Masculino', 'Coloração', 'Escova']);
    if (parseInt(checkServices.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO services (name, description, duration, price)
        VALUES 
          ('Corte Feminino', 'Corte e finalização', 60, 80.00),
          ('Corte Masculino', 'Corte + barba', 45, 50.00),
          ('Coloração', 'Aplicação de cor', 120, 150.00),
          ('Escova', 'Escova modeladora', 45, 60.00)
      `);
    }

    // Produtos de exemplo
    const checkProducts = await client.query('SELECT COUNT(*) as count FROM products WHERE name IN ($1, $2, $3)', ['Shampoo Profissional', 'Condicionador', 'Máscara Capilar']);
    if (parseInt(checkProducts.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO products (name, description, price, stock, min_stock)
        VALUES 
          ('Shampoo Profissional', '500ml', 45.00, 20, 5),
          ('Condicionador', '500ml', 40.00, 15, 5),
          ('Máscara Capilar', '250g', 65.00, 10, 3)
      `);
    }

    // Clientes de exemplo
    const checkClientsInsert = await client.query('SELECT COUNT(*) as count FROM clients WHERE name IN ($1, $2)', ['Ana Costa', 'Pedro Oliveira']);
    if (parseInt(checkClientsInsert.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO clients (name, phone, email)
        VALUES 
          ('Ana Costa', '11999887766', 'ana@email.com'),
          ('Pedro Oliveira', '11999887767', 'pedro@email.com')
      `);
    }

    console.log('✅ Dados de exemplo inseridos');
  } catch (error) {
    console.error('❌ Erro ao inserir dados de exemplo:', error);
  }
}

module.exports = pool;
