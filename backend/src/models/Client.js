const db = require('../config/dbAdapter');

class Client {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM clients ORDER BY name', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM clients WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      const { name, phone, email, cpf, birth_date, address, notes } = data;
      
      db.run(
        'INSERT INTO clients (name, phone, email, cpf, birth_date, address, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, phone, email, cpf, birth_date, address, notes],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...data });
        }
      );
    });
  }

  static update(id, data) {
    return new Promise((resolve, reject) => {
      const { name, phone, email, cpf, birth_date, address, notes } = data;
      
      db.run(
        'UPDATE clients SET name = ?, phone = ?, email = ?, cpf = ?, birth_date = ?, address = ?, notes = ? WHERE id = ?',
        [name, phone, email, cpf, birth_date, address, notes, id],
        (err) => {
          if (err) reject(err);
          else resolve({ id, ...data });
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM clients WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve({ message: 'Cliente deletado com sucesso' });
      });
    });
  }

  static search(term) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM clients WHERE name LIKE ? OR phone LIKE ? OR email LIKE ? ORDER BY name',
        [`%${term}%`, `%${term}%`, `%${term}%`],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
}

module.exports = Client;

