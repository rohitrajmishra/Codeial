const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// authentication using passport
passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
  },
  function(req, email, password, done){
    // find the user and establish the identity
    User.findOne({email: email}, function (err, user){
      if(err){
        req.flash('error', err);
        console.log('Error in finding user --> Passport');
        return done(err);
      }

      if(!user || user.password != password){
        req.flash('error', 'Invalid Username/Password');
        console.log('Invalid Username/Password');
        return done(null, false);
      }

      return done(null, user);
    })

  }
));

// serialize the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done){
  done(null, user.id);
});

// Deserialize the user from the key in cookie sent by browser to Server
passport.deserializeUser(function (id, done){
  User.findById(id, function (err, user){
    if(err){
      console.log('Error in finding user --> Passport');
      return done(err);
    }

    return done(null, user);
  });
});


// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
  // if the user is signed in, then pass on the request to the next function('Controller's action)
  if(req.isAuthenticated()){
    return next();
  }

  // if user is not authenticated
  return res.redirect('/users/signin')
}

passport.setAuthenticatedUser = function (req, res, next){
  if(req.isAuthenticated()){
    // req.user contaings the current signed in user from session cookie
    // and we are sending this to the locals for the views
    res.locals.user = req.user;
  }

  next();
}

module.exports = passport;
