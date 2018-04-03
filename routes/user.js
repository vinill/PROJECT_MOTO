const router = require('express').Router();
const User = require('../models/user');
const passport = require('passport');
const passportConf = require('../config/passport');


router.get('/login', (req,res)=>{
    res.render('accounts/login', {message: req.flash('loginMessage')});
});

router.post('/login',passport.authenticate('local-login',{
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/profile',(req,res,next)=>{
    User.findOne({_id:req.user._id}, function (err, user) {
        if(err) return next(err);
        res.render('accounts/profile',{user: user});
    });
});

router.get('/signup',(req,res)=>{
    res.render('accounts/signup', {
        errors: req.flash('errors')
    });
});

router.post('/signup',(req,res,next)=>{
    let user = new User();

    user.profile.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.profile.picture = user.gravatar();

    User.findOne({ email:req.body.email }, (err, exisingUser)=>{

        if(exisingUser){
            req.flash('errors', 'Acoount with that email already exists');
            return res.redirect('/signup');
        } else {
            user.save((err,user)=>{
                if (err) return next(err);

                req.logIn(user, (err)=>{
                    if(err) return next(err);
                    res.redirect('/profile');
                })
            });
        };
    });
});

router.get('/logout',(req,res,next)=>{
    req.logout();
    res.redirect('/');
});

router.get('/edit-profile', function(req, res, next) {
    res.render('accounts/edit-profile', { message: req.flash('success')});
});

router.post('/edit-profile', function(req, res, next) {
    User.findOne({ _id: req.user._id }, function(err, user) {

        if (err) return next(err);

        if (req.body.name) user.profile.name = req.body.name;
        if (req.body.address) user.address = req.body.address;

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', 'Successfully Edited your profile');
            return res.redirect('/edit-profile');
        });
    });
});

module.exports = router;