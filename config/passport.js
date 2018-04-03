const passport =  require('passport');
const LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
passport.serializeUser((user,done)=>{
    done(null,user._id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user);
    })
});


passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},  (req,email,passport,done) =>{
    User.findOne({email:email}, (err,user)=>{
        if (err) return done(err);

        if(!user){
            return done(null,false,req.flash('loginMessage', 'No user has been found'));
        }

        if(!user.comparePassword(passport)){
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong Password pal'))
        }
        return done(null,user);
    })
}
));


exports.isAuthenticated =  (req, res, next)=> {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login');
};