import express from "express";
import session from "express-session";
import hbs from "express-handlebars";
import mongoose from "mongoose";
import passport from "passport";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

const localStrategy = require("passport-local").Strategy;
const app = express();

// Import internal files
import User from "./src/Models/User";

// Point to environment variables
dotenv.config({ path: __dirname + "/config/config.env" });

// Connect to mongoDB
mongoose.connect(process.env.MONGO_URL, {});

// Middleware
app.engine("hbs", hbs({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));

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
        return done(null, done, {
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

app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    username: req.body.username,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Listening on Port ${process.env.PORT}`);
});
