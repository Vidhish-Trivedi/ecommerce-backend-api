const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequired } = require('../middleware/validation');
const upload = require('../config/multer');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getAllProducts,
  getProductById
} = require('../controllers/productController');

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Seller routes
router.post('/', 
  authenticateToken, 
  requireRole('Seller'), 
  upload.array('images', 5),
  validateRequired(['title', 'description', 'category', 'price', 'quantity']),
  createProduct
);

router.put('/:id', 
  authenticateToken, 
  requireRole('Seller'), 
  upload.array('images', 5),
  updateProduct
);

router.delete('/:id', authenticateToken, requireRole('Seller'), deleteProduct);
router.get('/seller/inventory', authenticateToken, requireRole('Seller'), getSellerProducts);

module.exports = router;