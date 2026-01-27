const db = require('../config/dbAdapter');

class Product {
  static getAll() {
    return db.all('SELECT * FROM products ORDER BY name');
  }

  static getById(id) {
    return db.get('SELECT * FROM products WHERE id = $1', [id]);
  }

  static getLowStock() {
    return db.all('SELECT * FROM products WHERE stock <= min_stock ORDER BY name');
  }

  static create(data) {
    const { name, description, price, stock, min_stock } = data;
    return db.run(
      'INSERT INTO products (name, description, price, stock, min_stock) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, description, price, stock, min_stock]
    );
  }

  static update(id, data) {
    const { name, description, price, stock, min_stock } = data;
    return db.run(
      'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, min_stock = $5 WHERE id = $6',
      [name, description, price, stock, min_stock, id]
    );
  }

  static updateStock(id, quantity) {
    return db.run(
      'UPDATE products SET stock = stock + $1 WHERE id = $2',
      [quantity, id]
    );
  }

  static delete(id) {
    return db.run('DELETE FROM products WHERE id = $1', [id]);
  }
}

module.exports = Product;
