const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/', appointmentController.getAll);
router.get('/upcoming', appointmentController.getUpcoming);
router.get('/date/:date', appointmentController.getByDate);
router.get('/:id', appointmentController.getById);
router.post('/', appointmentController.create);
router.put('/:id', appointmentController.update);
router.patch('/:id/status', appointmentController.updateStatus);
router.delete('/:id', appointmentController.delete);

module.exports = router;

