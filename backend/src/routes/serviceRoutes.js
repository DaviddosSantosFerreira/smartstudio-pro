const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authMiddleware } = require('../middlewares/auth');

// Rotas PÚBLICAS (booking)
router.get('/active', serviceController.getActive);

// Rotas PROTEGIDAS (painel admin)
router.get('/', authMiddleware, serviceController.getAll);
router.get('/:id', authMiddleware, serviceController.getById);
router.post('/', authMiddleware, serviceController.create);
router.put('/:id', authMiddleware, serviceController.update);
router.delete('/:id', authMiddleware, serviceController.delete);

module.exports = router;

