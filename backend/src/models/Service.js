const db = require('../config/dbAdapter');

class Service {
  static getAll() {
    return db.all('SELECT * FROM services ORDER BY name');
  }

  static getActive() {
    return db.all('SELECT * FROM services WHERE active = true ORDER BY name');
  }

  static getById(id) {
    return db.get('SELECT * FROM services WHERE id = $1', [id]);
  }

  static create(data) {
    const { name, description, duration, price, active = true } = data;
    return db.run(
      'INSERT INTO services (name, description, duration, price, active) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, description, duration, price, active]
    );
  }

  static update(id, data) {
    const { name, description, duration, price, active } = data;
    return db.run(
      'UPDATE services SET name = $1, description = $2, duration = $3, price = $4, active = $5 WHERE id = $6',
      [name, description, duration, price, active, id]
    );
  }

  static delete(id) {
    return db.run('DELETE FROM services WHERE id = $1', [id]);
  }
}

module.exports = Service;
