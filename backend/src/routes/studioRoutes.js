const express = require('express');
const router = express.Router();
const studioController = require('../controllers/studioController');
const { authMiddleware } = require('../middlewares/auth');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Use JPEG, PNG, GIF ou WEBP.'));
    }
  }
});

// Rotas PÚBLICAS (booking)
router.get('/public/:slug', studioController.getPublicSettings);

// Rotas PROTEGIDAS (painel admin)
router.get('/settings', authMiddleware, studioController.getSettings);
router.put('/settings', authMiddleware, studioController.updateSettings);
router.post('/upload-logo', authMiddleware, upload.single('logo'), studioController.uploadLogo);

module.exports = router;

