const express = require('express');
const router = express.Router();
const financialController = require('../controllers/financialController');

router.get('/', financialController.getAll);
router.get('/summary', financialController.getSummary);
router.post('/', financialController.create);
router.delete('/:id', financialController.delete);

module.exports = router;

