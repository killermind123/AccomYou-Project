// app.js
// Main entry point for the application
// Sets up the server, connects to the database, and defines routes
if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}

const url = process.env.ATLAS_DB_URL ;


const express = require('express');
const app = express();
const mongoose = require('mongoose'); 
const Listing = require('./model/list.js');
const Review = require('./model/reviews.js');
const path = require('path');
const methodOverride = require('method-override');
const parser = require('body-parser');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/expressError.js'); // renamed to PascalCase
const { listingSchema, reviewSchema } = require('./schema.js');
const listingRoutes = require('./routes/listing.js');
const reviewRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/user.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./model/user.js');

// Middleware setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(parser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejsMate);

const store = MongoStore.create({
  mongoUrl: url,
  touchAfter: 24 * 60 * 60, // time period in seconds
  crypto  : {
    secret: process.env.SECRET
  }
});

store.on("error", function(e){
  console.log("SESSION STORE ERROR", e)
});


const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    express: Date.now() + 1000 * 60 * 60 * 24 * 7, // One week 
    maxAge: 1000 * 60 * 60 * 24 * 7, // One week
    httpOnly: true // Mitigate XSS attacks
  }
};



app.use(session(sessionOptions));


// Connect to MongoDB
main()
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Error connecting to MongoDB:', err));

async function main() {
  await mongoose.connect(url, {
    useNewUrlParser: true
  });
}





const validateReview = (req, res, next) => {
  let {error} = reviewSchema.validate(req.body);
  
  if (error) {
    let message = error.details.map(el => el.message).join(',');

    throw new ExpressError(400, message);
  }else {
    next();
  }
} 

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  console.log(req.user);
  next();
});

app.use(  '/listings', listingRoutes);

app.use('/listings/:id/reviews', reviewRoutes );
app.use('/', userRoutes )

app.get('/', (req, res) => {
  res.render('listings/home.ejs');
});

/*app.get('/demouser', async (req, res) => {
  let newUser = new User({email: 'demouser', username: 'demouser'});
 const register = await User.register(newUser, 'demopassword');
  res.send(register);
});*/




// Home route

 

// Catch-all for undefined routes
/*app.all('*', (req, res, next) => {
    const err = new ExpressError(404, 'Page Not Found');
    console.log(err); // check what gets printed
    next(err);
});*/




// Centralized error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).render('listings/error.ejs', { message });
  console.error(message);
});

// Start server
app.listen(3000, () => {
  console.log('🚀 Server is running on port 3000');    
});
