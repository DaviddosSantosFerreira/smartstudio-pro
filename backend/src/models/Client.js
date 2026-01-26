const db = require('../config/dbAdapter');

class Client {
  static getAll() {
    return db.all('SELECT * FROM clients ORDER BY name');
  }

  static getById(id) {
    return db.get('SELECT * FROM clients WHERE id = ?', [id]);
  }

  static create(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const { name, phone, email, cpf, birth_date, address, notes } = data;
        
        // Para PostgreSQL, precisamos usar RETURNING para obter o ID
        let sql = 'INSERT INTO clients (name, phone, email, cpf, birth_date, address, notes) VALUES (?, ?, ?, ?, ?, ?, ?)';
        if (process.env.NODE_ENV === 'production') {
          sql += ' RETURNING id';
        }
        
        const result = await db.run(sql, [name, phone, email, cpf, birth_date, address, notes]);
        
        resolve({ id: result.id, ...data });
      } catch (err) {
        reject(err);
      }
    });
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

