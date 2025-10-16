const express= require('express');
const router= express.Router();
const User = require('../model/user.js');
const Review = require('../model/reviews.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/expressError.js'); // renamed to PascalCase
const { listingSchema, reviewSchema } = require('../schema.js');
const path = require('path');
const methodOverride = require('method-override');
const parser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { saveRedirectUrl } = require('../midllewares/midleware.js');
const userController = require('../controllers/users.js');




//get request for the user form, post request to register user

router.route('/signup')
.get(userController.signupForm)
.post(wrapAsync(userController.userSignup));


router.route('/login')
.get( userController.loginForm)
.post(saveRedirectUrl, passport.authenticate('local', {failureRedirect:'/login', failureFlash: true} ), 
userController.userLogin);

router.get('/logout',userController.userLogout);

module.exports = router;