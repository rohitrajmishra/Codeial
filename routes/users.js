const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);

// Sign-Up
router.get('/signup', usersController.signup);
router.post('/create', usersController.create);

// Sign-In
router.get('/signin', usersController.signin);

// Use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local', {
      failureRedirect: '/users/signin'
    }
  ),
  usersController.createSession);

// Sign-out
router.get('/signout', usersController.destroySession)
module.exports = router;
