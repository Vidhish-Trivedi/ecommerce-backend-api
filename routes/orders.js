const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequired } = require('../middleware/validation');
const { 
  createOrder, 
  getBuyerOrders, 
  getSellerOrders, 
  updateOrderStatus 
} = require('../controllers/orderController');

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  requireRole('Buyer'),
  validateRequired(['shippingAddress', 'paymentMethod']),
  createOrder
);

router.get(
  '/buyer',
  authenticateToken,
  requireRole('Buyer'),
  getBuyerOrders
);

router.get(
  '/seller',
  authenticateToken,
  requireRole('Seller'),
  getSellerOrders
);

router.put(
  '/:id/status',
  authenticateToken,
  requireRole('Seller'),
  validateRequired(['status']),
  updateOrderStatus
);

module.exports = router;