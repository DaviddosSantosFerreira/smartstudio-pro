const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const studioController = require('../controllers/studioController');

// Criar pasta uploads se não existir
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
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

