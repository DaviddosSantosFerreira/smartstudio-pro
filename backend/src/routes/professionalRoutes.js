const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/professionalController');

router.get('/', professionalController.getAll);
router.get('/active', professionalController.getActive);
router.get('/:id', professionalController.getById);
router.post('/', professionalController.create);
router.put('/:id', professionalController.update);
router.delete('/:id', professionalController.delete);

module.exports = router;

