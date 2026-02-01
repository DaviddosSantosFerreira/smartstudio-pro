const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authMiddleware } = require('../middlewares/auth');

// Rotas PÚBLICAS (booking)
router.get('/available-times', appointmentController.getAvailableTimes);
router.post('/', appointmentController.create);

// Rotas PROTEGIDAS (painel admin)
router.get('/', authMiddleware, appointmentController.getAll);
router.get('/:id', authMiddleware, appointmentController.getById);
router.put('/:id', authMiddleware, appointmentController.update);
router.patch('/:id/status', authMiddleware, appointmentController.updateStatus);
router.delete('/:id', authMiddleware, appointmentController.delete);

module.exports = router;

