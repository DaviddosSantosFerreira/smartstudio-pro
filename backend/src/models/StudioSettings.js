const db = require('../config/dbAdapter');

class StudioSettings {
  static async get() {
    const settings = await db.get('SELECT * FROM studio_settings WHERE id = 1');
    return settings;
  }

  static async update(data) {
    const { 
      name, 
      slug,
      logo_url, 
      phone, 
      whatsapp,
      instagram,
      address,
      description,
      primary_color,
      secondary_color
    } = data;
    
    // Verifica se já existe
    const existing = await db.get('SELECT id FROM studio_settings WHERE id = 1');
    
    if (existing) {
      await db.run(
        `UPDATE studio_settings SET 
          name = $1, slug = $2, logo_url = $3, phone = $4, whatsapp = $5,
          instagram = $6, address = $7, description = $8, 
          primary_color = $9, secondary_color = $10, updated_at = CURRENT_TIMESTAMP
        WHERE id = 1`,
        [name, slug, logo_url, phone, whatsapp, instagram, address, description, primary_color, secondary_color]
      );
    } else {
      await db.run(
        `INSERT INTO studio_settings (id, name, slug, logo_url, phone, whatsapp, instagram, address, description, primary_color, secondary_color)
        VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [name, slug, logo_url, phone, whatsapp, instagram, address, description, primary_color, secondary_color]
      );
    }
    
    return { message: 'Configurações atualizadas com sucesso' };
  }

  static async getBySlug(slug) {
    return await db.get('SELECT * FROM studio_settings WHERE slug = $1', [slug]);
  }
}

module.exports = StudioSettings;

