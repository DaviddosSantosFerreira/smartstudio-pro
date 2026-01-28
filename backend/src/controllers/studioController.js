const StudioSettings = require('../models/StudioSettings');
const path = require('path');
const fs = require('fs');

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

exports.uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    
    const logoUrl = `/uploads/${req.file.filename}`;
    res.json({ url: logoUrl });
  } catch (error) {
    next(error);
  }
};

