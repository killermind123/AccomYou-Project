const express = require('express');
const router = express.Router();
const Listing = require('../model/list.js');
const Review = require('../model/reviews.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/expressError.js'); // renamed to PascalCase
const { listingSchema, reviewSchema } = require('../schema.js');
const path = require('path');
const methodOverride = require('method-override');
const parser = require('body-parser');
const {isloggedin} = require('../midllewares/midleware.js');
const {isOwner} = require('../midllewares/midleware.js');
const {validateListing} = require('../midllewares/midleware.js');
const listingController = require('../controllers/listing.js');
const multer  = require('multer')
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage: storage });
// If you want to store files locally, use this instead:








// Home route
/*router.get('/', (req, res) => {
  res.render('listings/home.ejs');
  
});*/
 router.get( '/userProfile', isloggedin, wrapAsync(listingController.userProfile) );

//index route
router.get('/', wrapAsync(listingController.index));



//addlisting

router.route('/new')
.get(isloggedin ,listingController.listingForm)
.post(isloggedin, upload.single("listing[image]"), wrapAsync(listingController.addListing));


router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isloggedin,  isOwner, upload.single("image"), wrapAsync(listingController.updateListing))
.delete(isloggedin,  isOwner, wrapAsync(listingController.deleteListing));
  // Edit listing form
  router.get('/:id/edit', isloggedin,  isOwner, wrapAsync(listingController.editListing));

 
  
  
  
  module.exports = router;