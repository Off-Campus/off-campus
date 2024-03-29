const express = require("express");
const session = require("express-session");
const hbs = require("express-handlebars");
const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const localStrategy = require("passport-local").Strategy;

const app = express();

// Import internal files
const User = require("./Public/Components/Models/User");

// Point to Environment Variables
dotenv.config({ path: "./config/config.env" });

// Connect to databases
mongoose.connect(
  process.env.USER_MONGO_URL,
  {
    useNewUrlParser: true,
  },
  () => {
    console.log("🚀 Successfully connected to USERS database...");
  }
);

// TODO: Setup and connect books database
/*
mongoose.connect(
  process.env.BOOKS_MONGO_URL,
  {
    useNewUrlParser: true,
  },
  () => {
    console.log("🚀 Successfully connected to BOOKS database...");
  }
);
*/

// Middleware
app.engine("hbs", hbs({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/Public"));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

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

passport.use(
  new localStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) return done(err);
      if (!user)
        return done(null, false, {
          message: "Incorrect Username !",
        });

      bcrypt.compare(password, user.password, function (err, res) {
        if (err) return done(err);

        if (res === false)
          return done(null, false, {
            message: "Incorrect Password !",
          });

        return done(null, user);
      });
    });
  })
);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

// Routes
app.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
    username: req.body.username,
  });
});

app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

app.get("/logout", (req, res) => {
  res.render("logout", {
    title: "Logout",
  });
});

app.get("/register", (req, res) => {
  res.render("register", {
    title: "Register",
  });
});
// Start app listener
app.listen(process.env.PORT, () => {
  console.log("");
  console.log(`🚀 Listening on port ${process.env.PORT}...`);
});
