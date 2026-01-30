const express = require('express');
const router = express.Router();
const multer = require('multer');
const studioController = require('../controllers/studioController');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Use JPEG, PNG, GIF ou WEBP.'));
    }
  }
});

// Rotas administrativas
router.get('/settings', studioController.getSettings);
router.put('/settings', studioController.updateSettings);
router.post('/upload-logo', upload.single('logo'), studioController.uploadLogo);

// Rota pública para booking
router.get('/public/:slug', studioController.getPublicSettings);

module.exports = router;

