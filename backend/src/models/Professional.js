const db = require('../config/database');

class Professional {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM professionals ORDER BY name', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static getActive() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM professionals WHERE active = 1 ORDER BY name', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM professionals WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      const { name, specialty, phone, email, commission_percentage, color } = data;
      
      db.run(
        'INSERT INTO professionals (name, specialty, phone, email, commission_percentage, color) VALUES (?, ?, ?, ?, ?, ?)',
        [name, specialty, phone, email, commission_percentage || 0, color || '#3b82f6'],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...data });
        }
      );
    });
  }

  static update(id, data) {
    return new Promise((resolve, reject) => {
      const { name, specialty, phone, email, commission_percentage, active, color } = data;
      
      db.run(
        'UPDATE professionals SET name = ?, specialty = ?, phone = ?, email = ?, commission_percentage = ?, active = ?, color = ? WHERE id = ?',
        [name, specialty, phone, email, commission_percentage, active, color, id],
        (err) => {
          if (err) reject(err);
          else resolve({ id, ...data });
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM professionals WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve({ message: 'Profissional deletado com sucesso' });
      });
    });
  }
}

module.exports = Professional;

