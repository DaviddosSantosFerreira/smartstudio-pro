const db = require('../config/database');

class Appointment {
  static getAll(filters = {}) {
    return new Promise((resolve, reject) => {
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

      if (filters.startDate && filters.endDate) {
        conditions.push('a.date BETWEEN ? AND ?');
        params.push(filters.startDate, filters.endDate);
      }

      if (filters.professionalId) {
        conditions.push('a.professional_id = ?');
        params.push(filters.professionalId);
      }

      if (filters.status) {
        conditions.push('a.status = ?');
        params.push(filters.status);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY a.date DESC, a.time DESC';

      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static getByDate(date) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT a.*, 
                c.name as client_name, c.phone as client_phone,
                p.name as professional_name, p.color as professional_color,
                s.name as service_name, s.price as service_price, s.duration as service_duration
         FROM appointments a
         LEFT JOIN clients c ON a.client_id = c.id
         LEFT JOIN professionals p ON a.professional_id = p.id
         LEFT JOIN services s ON a.service_id = s.id
         WHERE a.date = ?
         ORDER BY a.time`,
        [date],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT a.*, 
                c.name as client_name,
                p.name as professional_name,
                s.name as service_name
         FROM appointments a
         LEFT JOIN clients c ON a.client_id = c.id
         LEFT JOIN professionals p ON a.professional_id = p.id
         LEFT JOIN services s ON a.service_id = s.id
         WHERE a.id = ?`,
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      const { client_id, professional_id, service_id, date, time, notes } = data;
      
      db.run(
        'INSERT INTO appointments (client_id, professional_id, service_id, date, time, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [client_id, professional_id, service_id, date, time, notes],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...data });
        }
      );
    });
  }

  static update(id, data) {
    return new Promise((resolve, reject) => {
      const { client_id, professional_id, service_id, date, time, status, notes } = data;
      
      db.run(
        'UPDATE appointments SET client_id = ?, professional_id = ?, service_id = ?, date = ?, time = ?, status = ?, notes = ? WHERE id = ?',
        [client_id, professional_id, service_id, date, time, status, notes, id],
        (err) => {
          if (err) reject(err);
          else resolve({ id, ...data });
        }
      );
    });
  }

  static updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE appointments SET status = ? WHERE id = ?',
        [status, id],
        (err) => {
          if (err) reject(err);
          else resolve({ id, status });
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM appointments WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve({ message: 'Agendamento deletado com sucesso' });
      });
    });
  }

  static getUpcoming(limit = 10) {
    return new Promise((resolve, reject) => {
      const today = new Date().toISOString().split('T')[0];
      
      db.all(
        `SELECT a.*, 
                c.name as client_name,
                p.name as professional_name,
                s.name as service_name
         FROM appointments a
         LEFT JOIN clients c ON a.client_id = c.id
         LEFT JOIN professionals p ON a.professional_id = p.id
         LEFT JOIN services s ON a.service_id = s.id
         WHERE a.date >= ? AND a.status IN ('scheduled', 'confirmed')
         ORDER BY a.date, a.time
         LIMIT ?`,
        [today, limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
}

module.exports = Appointment;

