const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, optionalAuthenticateToken, requireAdmin } = require('../middleware/auth');

router.post('/', optionalAuthenticateToken, orderController.createOrder);
router.get('/my-orders', authenticateToken, orderController.getMyOrders);
router.get('/admin/all', requireAdmin, orderController.getAllOrders);
router.put('/admin/status/:id', requireAdmin, orderController.updateOrderStatus);
router.get('/:id', authenticateToken, orderController.getOrderById);

module.exports = router;
