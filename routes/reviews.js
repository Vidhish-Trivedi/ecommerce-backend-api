const express = require('express');
const {getProductReviews, createReview} = require('../controllers/reviewController');
const router = express.Router();

// Get a single review by ID
router.get('/:id', getProductReviews);

// Create a new review
router.post('/', createReview);

module.exports = router;