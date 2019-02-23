const express = require('express');
const router = express.Router();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const fs = require('fs');
require('dotenv').config();
//Fetch models
let User = require('../models/user');
const fb_id = process.env.FACEBOOK_ID;
const fb_secret = process.env.FACEBOOK_SECRET;
const twitter_id = process.env.TWITTER_ID
const twitter_secret = process.env.TWITTER_SECRET;



//FACEBOOK
passport.use(new FacebookStrategy({
    clientID: fb_id,
    clientSecret: fb_secret,
    callbackURL: "https://localhost:3001/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name'] 
  },
  function(accessToken, refreshToken, profile, done) {

    User.findOne( {
        $and: [{'social.provider':profile.provider } ,{ 'social.id':profile.id}]} , function(err, user) {

      if (err) { return done(err); }
        if(user)
        {
            done(null, user);
        }
        else 
        {
            let newUser = new User;
                newUser.name = profile.name.givenName;
                newUser.email = profile.emails[0].value;
                newUser.social.provider = profile.provider;
                newUser.social.id = profile.id;
                newUser.username = profile.name.givenName + profile.id.slice(-3);
                newUser.displayPicture.data =fs.readFileSync('uploads/defavatar.jpg');
                newUser.displayPicture.contentType = "image/jpg"; 
                newUser.following.addToSet(newUser);
                newUser.isVerified = true;
                newUser.save((err)=>{
                    if(err)
                    {return done(err);}
                    else return done(null,newUser);
                });
        }
    });
  }

));

router.get('/facebook', passport.authenticate('facebook', { scope : ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook',
 { successRedirect: '/', failureRedirect: '/users/login' }));


//TWITTER
passport.use(new TwitterStrategy({
    consumerKey: twitter_id,
    consumerSecret: twitter_secret,
    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
    callbackURL: "https://www.mysnippies.com/auth/twitter/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    
    User.findOne({
        $and: [{'social.provider':profile.provider } ,{ 'social.id':profile.id}]} , function(err, user) {

      if (err) { return done(err); }
        if(user)
        {
            
            done(null, user);
        }
        else 
        {
            let newUser = new User;
                newUser.name = profile.displayName;
                newUser.social.provider = profile.provider;
                newUser.social.id = profile.id;
                newUser.email = profile.emails[0].value;
                newUser.username = profile.username +  profile.id.slice(-8);
                newUser.displayPicture.data =fs.readFileSync('uploads/defavatar.jpg');
                newUser.displayPicture.contentType = "image/jpg"; 
                newUser.following.addToSet(newUser);
                newUser.isVerified = true;
                newUser.save((err)=>{
                    if(err)
                    {return done(err);}
                    else return done(null,newUser);
                });
        }



     
    });
  }

));



router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', passport.authenticate('twitter',
 { successRedirect: '/', failureRedirect: '/users/login' }));



 module.exports = router;