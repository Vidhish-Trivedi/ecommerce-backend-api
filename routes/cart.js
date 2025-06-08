const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequired } = require('../middleware/validation');
const { addToCart, getCart, updateCart } = require('../controllers/cartController');

const router = express.Router();

router.post('/add', 
  authenticateToken, 
  requireRole('Buyer'),
  validateRequired(['productId', 'quantity']),
  addToCart
);

router.get('/', authenticateToken, requireRole('Buyer'), getCart);

router.put('/update', 
  authenticateToken, 
  requireRole('Buyer'),
  validateRequired(['productId', 'quantity']),
  updateCart
);

module.exports = router;