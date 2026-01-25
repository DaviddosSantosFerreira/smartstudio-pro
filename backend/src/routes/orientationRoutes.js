const express = require('express');
const router = express.Router();
const orientationController = require('../controllers/orientationController');

router.get('/settings', orientationController.getSettings);
router.put('/settings', orientationController.updateSettings);
router.post('/calculate', orientationController.calculateDistribution);

module.exports = router;

