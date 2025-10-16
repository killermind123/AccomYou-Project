const Review = require('../model/reviews.js');
const Listing = require('../model/list.js');
const User = require('../model/user.js');



module.exports.signupForm = (req, res)=>{
    res.render('users/signup.ejs');
}

module.exports.userSignup = async (req,res)=>{
    try{
        const {email, username, password} =  req.body;
    let newUser= new User({
        email: email,
        username: username,
        } );

   const register= await User.register(newUser, password );
   req.login(register, err=>{
    if(err) return next(err);
    req.flash('success', 'Welcome to AccomYou');
   res.redirect('/listings');
   console.log(register);
   });
   

    }catch(err){
        req.flash('error', err.message);
        res.redirect('/signup');

    }
    
}


module.exports.loginForm = (req,res)=>{
    res.render('users/login.ejs');
}


module.exports.userLogin = async (req,res)=>{
   req.flash('success', 'Welcome back to AccomYou');
   let redirectUrl = res.locals.redirectUrl || '/listings';
   res.redirect(redirectUrl);

}


module.exports.userLogout =  (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success', 'Successfully logged out');
        res.redirect('/listings');
    });
}