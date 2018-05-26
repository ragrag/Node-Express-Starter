const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator/check');
const passport = require('passport');
const bcrypt = require('bcryptjs');

//Fetch models
let User = require('../models/user');

//Register Form
router.get('/register', (req, res) => {
    res.render('register');
});

//Registration
router.post('/register', [
    check('name').isLength({
        min: 1
    }).withMessage("Name is required"),
    check('email').isLength({
        min: 1
    }).withMessage("Email is required").isEmail().withMessage("Email not valid"),
    check('username').isLength({
        min: 1
    }).withMessage("Username is required"),
    check('password').isLength({
        min: 1
    }).withMessage("Password is required"),
    check('password2').custom((value, {
        req
    }) => value === req.body.password).withMessage('Passwords do not match')
], (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        console.log(errors.array());
        res.render("register", {
            errors: errors.array()
        });
    } else {
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                    console.log(err);
                } else {
                    newUser.password = hash;
                    newUser.save((err) => {

                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            req.flash('success', "Registration Successful");
                            res.redirect('/users/login')
                        }
                    });
                }

            });

        });
    }
});


//login route
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res,next) => {
    passport.authenticate('local', {
        successRedirect : '/',
        failureRedirect:'/users/login',
        failureFlash : true
 
    })(req,res,next);
});

//Logout
router.get('/logout', (req,res)=>{
req.logout();
req.flash('success','Logged out');
res.redirect('/');
});

module.exports = router;