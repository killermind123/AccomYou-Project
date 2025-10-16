const router = require('express').Router({mergeParams:true});
const Listing = require('../model/list.js');
const Review = require('../model/reviews.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/expressError.js'); // renamed to PascalCase
const { listingSchema, reviewSchema } = require('../schema.js');
const path = require('path');
const methodOverride = require('method-override');
const parser = require('body-parser');
const { merge } = require('./listing.js');
const {validateReview} = require('../midllewares/midleware.js'); 
const {isloggedin} = require('../midllewares/midleware.js'); 
const {isReviewAuthor} = require('../midllewares/midleware.js');
const reviewController = require('../controllers/Review.js');


//route for reviews:

  router.post('/', isloggedin, validateReview, wrapAsync(reviewController.addReview));


//Delete review
router.delete('/:reviewId', isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;

