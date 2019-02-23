//requires
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const strings = require('./config/strings')

require('dotenv').config();

//connect and select db
mongoose.connect(strings.database);
let db = mongoose.connection;


//Check db connection
db.once('open', () => {
    console.log("Connected to db");
});


//Check for db errors
db.on('error', (err) => {
    console.log(err);
});

//init app
const app = express();



//Fetching models
let User = require('./models/user');

//load views Engine
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

// Body parser middleware
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({
    extended: true
}))

// parse application/json
app.use(bodyParser.json())

//Set static folder
app.use(express.static(path.join(__dirname, 'static')));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
 

//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}))

//Express Message Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


// //Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


// global variable
app.get('*', (req,res,next)=>{
res.locals.user = req.user || null;
res.locals.mobile = /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile|ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(req.header('user-agent'));
next(); 
});


//home route
app.get('/', (req, res) => {
     res.render('index'); 
});

//router files
let users = require('./routes/users');
app.use('/users', users);
let Oauth = require('./routes/auth');
app.use('/auth', Oauth);


//server start
app.listen(process.env.PORT || strings.port, () => {
    console.log("Server Started.");
});