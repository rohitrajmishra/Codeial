const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users_controller');

router.get('/profile', usersController.profile);

// Sign-Up
router.get('/signup', usersController.signup);
router.post('/create', usersController.create);

// Sign-In
router.get('/signin', usersController.signin);
router.get('/create-session', usersController.createSession);

module.exports = router;
