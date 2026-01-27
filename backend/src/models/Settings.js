const db = require('../config/dbAdapter');

class Settings {
  static getOrientationSettings() {
    return db.get('SELECT * FROM orientation_settings WHERE id = 1');
  }

  static async updateOrientationSettings(data) {
    const { prolabore_percentage, reinvestment_percentage, reserve_percentage, tax_percentage } = data;
    await db.run(
      `UPDATE orientation_settings 
       SET prolabore_percentage = $1, reinvestment_percentage = $2, reserve_percentage = $3, tax_percentage = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = 1`,
      [prolabore_percentage, reinvestment_percentage, reserve_percentage, tax_percentage]
    );
    return { message: 'Configurações atualizadas com sucesso' };
  }
}

module.exports = Settings;
