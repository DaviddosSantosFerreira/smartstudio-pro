const db = require('../config/dbAdapter');

class Service {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM services ORDER BY name', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static getActive() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM services WHERE active = 1 ORDER BY name', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM services WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      const { name, description, duration, price } = data;
      
      db.run(
        'INSERT INTO services (name, description, duration, price) VALUES (?, ?, ?, ?)',
        [name, description, duration, price],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...data });
        }
      );
    });
  }

  static update(id, data) {
    return new Promise((resolve, reject) => {
      const { name, description, duration, price, active } = data;
      
      db.run(
        'UPDATE services SET name = ?, description = ?, duration = ?, price = ?, active = ? WHERE id = ?',
        [name, description, duration, price, active, id],
        (err) => {
          if (err) reject(err);
          else resolve({ id, ...data });
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM services WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve({ message: 'Serviço deletado com sucesso' });
      });
    });
  }
}

module.exports = Service;

