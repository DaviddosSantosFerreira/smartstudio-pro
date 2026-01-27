const db = require('../config/dbAdapter');

class Appointment {
  static async getAll(filters = {}) {
    let query = `
      SELECT a.*, 
             c.name as client_name, c.phone as client_phone,
             p.name as professional_name, p.color as professional_color,
             s.name as service_name, s.price as service_price, s.duration as service_duration
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      LEFT JOIN professionals p ON a.professional_id = p.id
      LEFT JOIN services s ON a.service_id = s.id
    `;
    
    const params = [];
    const conditions = [];
    let paramIndex = 1;

    if (filters.startDate && filters.endDate) {
      conditions.push(`a.date BETWEEN $${paramIndex++} AND $${paramIndex++}`);
      params.push(filters.startDate, filters.endDate);
    }

    if (filters.professionalId) {
      conditions.push(`a.professional_id = $${paramIndex++}`);
      params.push(filters.professionalId);
    }

    if (filters.status) {
      conditions.push(`a.status = $${paramIndex++}`);
      params.push(filters.status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY a.date DESC, a.time DESC';

    return db.all(query, params);
  }

  static getByDate(date) {
    return db.all(
      `SELECT a.*, 
              c.name as client_name, c.phone as client_phone,
              p.name as professional_name, p.color as professional_color,
              s.name as service_name, s.price as service_price, s.duration as service_duration
       FROM appointments a
       LEFT JOIN clients c ON a.client_id = c.id
       LEFT JOIN professionals p ON a.professional_id = p.id
       LEFT JOIN services s ON a.service_id = s.id
       WHERE a.date = $1
       ORDER BY a.time`,
      [date]
    );
  }

  static getById(id) {
    return db.get(
      `SELECT a.*, 
              c.name as client_name,
              p.name as professional_name,
              s.name as service_name
       FROM appointments a
       LEFT JOIN clients c ON a.client_id = c.id
       LEFT JOIN professionals p ON a.professional_id = p.id
       LEFT JOIN services s ON a.service_id = s.id
       WHERE a.id = $1`,
      [id]
    );
  }

  static async create(data) {
    const { client_id, professional_id, service_id, date, time, notes } = data;
    const result = await db.run(
      'INSERT INTO appointments (client_id, professional_id, service_id, date, time, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [client_id, professional_id, service_id, date, time, notes]
    );
    return { id: result.id, ...data };
  }

  static async update(id, data) {
    const { client_id, professional_id, service_id, date, time, status, notes } = data;
    await db.run(
      'UPDATE appointments SET client_id = $1, professional_id = $2, service_id = $3, date = $4, time = $5, status = $6, notes = $7 WHERE id = $8',
      [client_id, professional_id, service_id, date, time, status, notes, id]
    );
    return { id, ...data };
  }

  static async updateStatus(id, status) {
    await db.run(
      'UPDATE appointments SET status = $1 WHERE id = $2',
      [status, id]
    );
    return { id, status };
  }

  static async delete(id) {
    await db.run('DELETE FROM appointments WHERE id = $1', [id]);
    return { message: 'Agendamento deletado com sucesso' };
  }

  static getUpcoming(limit = 10) {
    const today = new Date().toISOString().split('T')[0];
    return db.all(
      `SELECT a.*, 
              c.name as client_name,
              p.name as professional_name,
              s.name as service_name
       FROM appointments a
       LEFT JOIN clients c ON a.client_id = c.id
       LEFT JOIN professionals p ON a.professional_id = p.id
       LEFT JOIN services s ON a.service_id = s.id
       WHERE a.date >= $1 AND a.status IN ('scheduled', 'confirmed')
       ORDER BY a.date, a.time
       LIMIT $2`,
      [today, limit]
    );
  }
}

module.exports = Appointment;
