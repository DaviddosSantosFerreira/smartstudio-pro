const db = require('../config/database');

class Settings {
  static getOrientationSettings() {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM orientation_settings WHERE id = 1', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static updateOrientationSettings(data) {
    return new Promise((resolve, reject) => {
      const { prolabore_percentage, reinvestment_percentage, reserve_percentage, tax_percentage } = data;
      
      db.run(
        `UPDATE orientation_settings 
         SET prolabore_percentage = ?, reinvestment_percentage = ?, reserve_percentage = ?, tax_percentage = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = 1`,
        [prolabore_percentage, reinvestment_percentage, reserve_percentage, tax_percentage],
        (err) => {
          if (err) reject(err);
          else resolve({ message: 'Configurações atualizadas com sucesso' });
        }
      );
    });
  }
}

module.exports = Settings;

