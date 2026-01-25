const db = require('../config/database');

class Product {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM products ORDER BY name', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static getLowStock() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM products WHERE stock <= min_stock AND active = 1', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      const { name, description, price, stock, min_stock } = data;
      
      db.run(
        'INSERT INTO products (name, description, price, stock, min_stock) VALUES (?, ?, ?, ?, ?)',
        [name, description, price, stock || 0, min_stock || 0],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...data });
        }
      );
    });
  }

  static update(id, data) {
    return new Promise((resolve, reject) => {
      const { name, description, price, stock, min_stock, active } = data;
      
      db.run(
        'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, min_stock = ?, active = ? WHERE id = ?',
        [name, description, price, stock, min_stock, active, id],
        (err) => {
          if (err) reject(err);
          else resolve({ id, ...data });
        }
      );
    });
  }

  static updateStock(id, quantity) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [quantity, id],
        (err) => {
          if (err) reject(err);
          else resolve({ message: 'Estoque atualizado' });
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve({ message: 'Produto deletado com sucesso' });
      });
    });
  }
}

module.exports = Product;

