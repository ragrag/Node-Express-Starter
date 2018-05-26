const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator/check');


//Fetch models
let Article = require('../models/article');
let User = require('../models/user');

//Add Article Route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add', {
        title: 'add test'
    });
});

//Add article post
router.post('/add', [check('title').isLength({
        min: 1
    }).withMessage("Invalid title")],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('add', {
                title: 'add test',
                errors: errors.array()
            });
        } else {
            let article = new Article();
            article.title = req.body.title;
            article.author = req.user._id;
            article.body = req.body.body;

            article.save((err) => {

                if (err) {
                    console.log(err);
                    return;
                } else {
                    req.flash('success', 'Article Added');
                    res.redirect('/');
                }
            });
        }
    });


//Edit article route
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Article.findById(req.params.id, (err, article) => {

        if (article.author != req.user._id) {
            req.flash('danger', 'Not authorized');
            res.redirect('/');
        }
        if (err) {
            console.log("error");
            return;
        } else {
            res.render('edit_article', {
                article: article
            });

        }
    });
});



//Delete article route
router.delete('/:id', (req, res) => {

    if(!req.user._id){
        res.status(500).send();
    }
    let query = {
        _id: req.params.id
    }

    Article.findById(req.params.id, (err,article) => {
        if (article.author!= req.user._id)
        res.status(500).send();
        else {
            Article.remove(query, (err) => {
                if (err) {
                    console.log(err);
                }
                res.send('Successfully deleted');
            });
        }
    });
   
});




//Get article route
router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        User.findById(article.author, (err, user) => {

            res.render('article', {
                article: article,
                author: user.name
            });

        });
    });
});




//Update article post
router.post('/edit/:id', (req, res) => {

    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {
        _id: req.params.id
    };

    Article.update(query, article, (err) => {

        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
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