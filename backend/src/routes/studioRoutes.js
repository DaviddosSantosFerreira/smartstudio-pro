const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const studioController = require('../controllers/studioController');

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
  }
});

// Rotas administrativas
router.get('/settings', studioController.getSettings);
router.put('/settings', studioController.updateSettings);
router.post('/upload-logo', upload.single('logo'), studioController.uploadLogo);

// Rota pública para booking
router.get('/public/:slug', studioController.getPublicSettings);

module.exports = router;

