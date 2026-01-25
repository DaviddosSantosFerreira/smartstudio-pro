const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/services', reportController.getServiceReport);
router.get('/professionals', reportController.getProfessionalReport);
router.get('/financial', reportController.getFinancialReport);

module.exports = router;

