const express = require('express');
const { validateRequired, validateEmail, validatePassword } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { register, login, getProfile, updateProfile } = require('../controllers/authController');

const router = express.Router();

router.post('/register', 
  validateRequired(['fullName', 'email', 'password', 'userType']),
  validateEmail,
  validatePassword,
  register
);

router.post('/login', 
  validateRequired(['email', 'password']),
  login
);

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;