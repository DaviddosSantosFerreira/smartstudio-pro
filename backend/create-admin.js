require('dotenv').config(); // Adicionar esta linha no topo!

const pool = require('./src/config/database');

async function createAdmin() {
  try {
    console.log('🔄 Conectando ao banco...');
    
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, active) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO NOTHING
       RETURNING id, name, email`,
      ['Admin', 'admin@smartstudio.com', '$2b$10$IPGLQXqKYhuQq0GRdngH2uTgW.a3gLdrsEoCOiOgj2fIPgDPHr/ti', 'admin', true]
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Usuário admin criado!');
      console.log('📧 Email: admin@smartstudio.com');
      console.log('🔑 Senha: 123456');
    } else {
      console.log('ℹ️ Usuário já existe');
    }
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    await pool.end();
    process.exit(1);
  }
}

createAdmin();