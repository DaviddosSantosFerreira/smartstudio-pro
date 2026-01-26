const db = require('../config/dbAdapter');

class Financial {
  static getAll(filters = {}) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT f.*, 
               p.name as professional_name
        FROM financial_transactions f
        LEFT JOIN professionals p ON f.professional_id = p.id
      `;
      
      const params = [];
      const conditions = [];

      if (filters.startDate && filters.endDate) {
        conditions.push('f.date BETWEEN ? AND ?');
        params.push(filters.startDate, filters.endDate);
      }

      if (filters.type) {
        conditions.push('f.type = ?');
        params.push(filters.type);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY f.date DESC, f.created_at DESC';

      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      const { type, category, description, amount, date, payment_method, appointment_id, professional_id, notes } = data;
      
      db.run(
        'INSERT INTO financial_transactions (type, category, description, amount, date, payment_method, appointment_id, professional_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [type, category, description, amount, date, payment_method, appointment_id, professional_id, notes],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...data });
        }
      );
    });
  }

  static getSummary(startDate, endDate) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
          COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
          COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as balance
         FROM financial_transactions 
         WHERE date BETWEEN ? AND ?`,
        [startDate, endDate],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM financial_transactions WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve({ message: 'Transação deletada com sucesso' });
      });
    });
  }
}

module.exports = Financial;

