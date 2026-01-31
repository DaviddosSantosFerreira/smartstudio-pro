const StudioSettings = require('../models/StudioSettings');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const db = require('../config/database');
const pool = require('../config/database');

exports.getSettings = async (req, res, next) => {
  try {
    const settings = await StudioSettings.get();
    res.json(settings || {});
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const result = await StudioSettings.update(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getPublicSettings = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const settings = await StudioSettings.getBySlug(slug);
    
    if (!settings) {
      return res.status(404).json({ error: 'Estúdio não encontrado' });
    }
    
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Fazer upload para o Cloudinary usando buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'smartstudio/logos',
          public_id: `logo_${Date.now()}`,
          overwrite: true,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Atualizar o logo_url no banco de dados
    const updateQuery = `
      UPDATE studio_settings 
      SET logo_url = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = 1
      RETURNING *
    `;
    const dbResult = await pool.query(updateQuery, [result.secure_url]);

    res.json({ 
      message: 'Logo enviado com sucesso',
      logo_url: result.secure_url,
      settings: dbResult.rows[0]
    });
  } catch (error) {
    console.error('Erro ao fazer upload do logo:', error);
    res.status(500).json({ error: 'Erro ao fazer upload do logo' });
  }
};

exports.uploadLogo = uploadLogo;

