const db = require('../config/dbAdapter');

class Professional {
  static getAll() {
    return db.all('SELECT * FROM professionals ORDER BY name');
  }

  static getActive() {
    return db.all('SELECT * FROM professionals WHERE active = true ORDER BY name');
  }

  static getById(id) {
    return db.get('SELECT * FROM professionals WHERE id = $1', [id]);
  }

  static create(data) {
    const { name, specialty, phone, email, commission_percentage, color, active = true } = data;
    return db.run(
      'INSERT INTO professionals (name, specialty, phone, email, commission_percentage, color, active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [name, specialty, phone, email, commission_percentage, color, active]
    );
  }

  static update(id, data) {
    const { name, specialty, phone, email, commission_percentage, color, active } = data;
    return db.run(
      'UPDATE professionals SET name = $1, specialty = $2, phone = $3, email = $4, commission_percentage = $5, color = $6, active = $7 WHERE id = $8',
      [name, specialty, phone, email, commission_percentage, color, active, id]
    );
  }

  static delete(id) {
    return db.run('DELETE FROM professionals WHERE id = $1', [id]);
  }
}

module.exports = Professional;
