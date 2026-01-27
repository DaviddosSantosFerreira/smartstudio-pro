const db = require('../config/dbAdapter');

class Financial {
  static async getAll(filters = {}) {
    let query = `
      SELECT f.*, 
             p.name as professional_name
      FROM financial_transactions f
      LEFT JOIN professionals p ON f.professional_id = p.id
    `;
    
    const params = [];
    const conditions = [];
    let paramIndex = 1;

    if (filters.startDate && filters.endDate) {
      conditions.push(`f.date BETWEEN $${paramIndex++} AND $${paramIndex++}`);
      params.push(filters.startDate, filters.endDate);
    }

    if (filters.type) {
      conditions.push(`f.type = $${paramIndex++}`);
      params.push(filters.type);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY f.date DESC, f.created_at DESC';

    return db.all(query, params);
  }

  static async create(data) {
    const { type, category, description, amount, date, payment_method, appointment_id, professional_id, notes } = data;
    const result = await db.run(
      'INSERT INTO financial_transactions (type, category, description, amount, date, payment_method, appointment_id, professional_id, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      [type, category, description, amount, date, payment_method, appointment_id, professional_id, notes]
    );
    return { id: result.id, ...data };
  }

  static getSummary(startDate, endDate) {
    return db.get(
      `SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as balance
       FROM financial_transactions 
       WHERE date BETWEEN $1 AND $2`,
      [startDate, endDate]
    );
  }

  static async delete(id) {
    await db.run('DELETE FROM financial_transactions WHERE id = $1', [id]);
    return { message: 'Transação deletada com sucesso' };
  }
}

module.exports = Financial;
