const db = require('../config/dbAdapter');

class Client {
  static getAll() {
    console.log('📋 Client.getAll - Buscando clientes...');
    return db.all('SELECT * FROM clients ORDER BY name')
      .then(clients => {
        console.log('📋 Client.getAll - Clientes encontrados:', clients.length);
        return clients;
      })
      .catch(err => {
        console.error('❌ Client.getAll - Erro:', err);
        throw err;
      });
  }

  static getById(id) {
    return db.get('SELECT * FROM clients WHERE id = ?', [id]);
  }

  static async create(data) {
    // Garantir que valores vazios sejam null ao invés de string vazia
    const { name, phone, email, cpf, birth_date, address, notes } = data;
    
    if (!name || (typeof name === 'string' && name.trim() === '')) {
      throw new Error('Nome é obrigatório');
    }
    
    console.log('🔧 Client.create - Dados recebidos:', JSON.stringify(data, null, 2));
    
    // Limpar valores vazios
    const cleanData = {
      name: String(name).trim(),
      phone: phone && String(phone).trim() ? String(phone).trim() : null,
      email: email && String(email).trim() ? String(email).trim() : null,
      cpf: cpf && String(cpf).trim() ? String(cpf).trim() : null,
      birth_date: birth_date || null,
      address: address && String(address).trim() ? String(address).trim() : null,
      notes: notes && String(notes).trim() ? String(notes).trim() : null
    };
    
    // Para PostgreSQL, precisamos usar RETURNING para obter o ID
    let sql = 'INSERT INTO clients (name, phone, email, cpf, birth_date, address, notes) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const isProduction = process.env.NODE_ENV === 'production' && process.env.DATABASE_URL;
    if (isProduction) {
      sql += ' RETURNING id';
    }
    
    const params = [
      cleanData.name, 
      cleanData.phone, 
      cleanData.email, 
      cleanData.cpf, 
      cleanData.birth_date, 
      cleanData.address, 
      cleanData.notes
    ];
    
    console.log('🔧 Client.create - SQL:', sql);
    console.log('🔧 Client.create - Params:', params);
    console.log('🔧 Client.create - NODE_ENV:', process.env.NODE_ENV);
    
    try {
      const result = await db.run(sql, params);
      
      console.log('🔧 Client.create - Resultado completo:', JSON.stringify(result, null, 2));
      
      if (!result) {
        throw new Error('Resultado vazio do banco de dados');
      }
      
      if (result.id === null || result.id === undefined) {
        console.error('❌ Client.create - ID não retornado. Result:', result);
        throw new Error('Falha ao criar cliente: ID não retornado do banco de dados. Result: ' + JSON.stringify(result));
      }
      
      const createdClient = { id: result.id, ...cleanData };
      console.log('✅ Client.create - Cliente criado com sucesso:', createdClient);
      
      return createdClient;
    } catch (err) {
      console.error('❌ Client.create - Erro completo:', err);
      console.error('❌ Client.create - Mensagem:', err.message);
      console.error('❌ Client.create - Stack:', err.stack);
      throw err;
    }
  }

  static update(id, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const { name, phone, email, cpf, birth_date, address, notes } = data;
        
        await db.run(
          'UPDATE clients SET name = ?, phone = ?, email = ?, cpf = ?, birth_date = ?, address = ?, notes = ? WHERE id = ?',
          [name, phone, email, cpf, birth_date, address, notes, id]
        );
        
        resolve({ id, ...data });
      } catch (err) {
        reject(err);
      }
    });
  }

  static delete(id) {
    return new Promise(async (resolve, reject) => {
      try {
        await db.run('DELETE FROM clients WHERE id = ?', [id]);
        resolve({ message: 'Cliente deletado com sucesso' });
      } catch (err) {
        reject(err);
      }
    });
  }

  static search(term) {
    return db.all(
      'SELECT * FROM clients WHERE name LIKE ? OR phone LIKE ? OR email LIKE ? ORDER BY name',
      [`%${term}%`, `%${term}%`, `%${term}%`]
    );
  }
}

module.exports = Client;

