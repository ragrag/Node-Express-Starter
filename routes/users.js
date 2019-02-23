const express = require('express');
const router = express.Router();

//Fetch models
let User = require('../models/user');

//login route
router.get('/login', (req, res) => {
    res.render('login');
});

//Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged out');
    res.redirect('/');
});


//Access Coontrol
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login first');
        res.redirect('/users/login');
    }
}
module.exports = router;