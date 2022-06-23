
const express = require('express');
const router = express.Router();
const catchAsync = require('../utility/catchAsync');
const review = require('../controllers/review');

const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleWare')

//Creating Review
router.post('/:id/reviews', isLoggedIn,validateReview, catchAsync(review.createNewReview));

//Deleting Reviews
router.delete('/:id/reviews/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview));
module.exports = router;