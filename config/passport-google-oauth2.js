const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");

// Tell passport to user a new strategy for google login
passport.use(
  new googleStrategy({
    clientID: "82794511411-7eoehntlthai9la954vvdiu18eni490m.apps.googleusercontent.com",
    clientSecret: "x3VwqY4J31wZEW-I8HH2v6k-",
    callbackURL: "http://localhost:8001/users/auth/google/callback",
  }, function(accessToken, resfreshToken, profile, done) {
    User.findOne({
      email: profile.emails[0].value
    }).exec(function(err, user) {
      if (err) {
        console.log("error in google strategy-passport", err);
        return;
      }

      console.log(profile);

      if (user) {
        // If found, set this user as req.user
        return done(null, user);
      } else {
        // If not found, create the user and set it as req.user
        User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
          },
          function(err, user) {
            if (err) {
              console.log(
                "Error in creting user google strategy-passport",
                err
              );
              return;
            }

            return done(null, user);
          }
        );
      }
    });
  })
);

module.exports = passport;
