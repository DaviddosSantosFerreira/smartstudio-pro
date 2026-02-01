const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/professionalController');
const { authMiddleware } = require('../middlewares/auth');

// Rotas PÚBLICAS (booking)
router.get('/active', professionalController.getActive);

// Rotas PROTEGIDAS (painel admin)
router.get('/', authMiddleware, professionalController.getAll);
router.get('/:id', authMiddleware, professionalController.getById);
router.post('/', authMiddleware, professionalController.create);
router.put('/:id', authMiddleware, professionalController.update);
router.delete('/:id', authMiddleware, professionalController.delete);

module.exports = router;

