const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { requireAdmin } = require('../middleware/auth');

router.get('/stats', requireAdmin, analyticsController.getDashboardStats);

module.exports = router;
