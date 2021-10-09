const express = require('express');
const session = require('express-session');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const localStrategy = require('passport-local').Strategy;

const app = express();

// Import internal files
const User = require('./Public/Components/Models/User');

// Point to Environment Variables
dotenv.config({ path: './config/config.env' });

// Connect to database
mongoose.connect(process.env.MONGO_URL, {});

// Middleware
app.engine('hbs', hbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Passport.js
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new localStrategy(function (username, password, done) {
    User.findOne({ username:username }, function (err, user) {
        if (err) return done(err);
        if (!user) return done(null, false, {
            message: 'Incorrect Username !'
        });

        bcrypt.compare(password, user.password, function (err, res) {
            if (err) return done(err);

            if (res === false) return done(null, false, {
                message: 'Incorrect Password !'
            });

            return done(null, user);
        });
    });
}));

// Routes
app.get('/', (req, res) => {
    res.render('home', {
        title: 'Home',
        username: req.body.username
    });
});

app.listen(process.env.PORT, () => {
    console.log(`🚀 Listening on port ${process.env.PORT}`);
});