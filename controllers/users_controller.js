const User = require('../models/user');

module.exports.profile = function(req, res) {
  // return res.end('<h1> User profile</h1>')
  return res.render('user_profile', {
    title: "User profile"
  });
}

module.exports.signin = function(req, res) {
  // return res.end('<h1> User profile</h1>')
  return res.render('signIn', {
    title: "Sign In"
  });
}

// Sign-in and create-session
module.exports.createSession = function (req, res) {
  // TODO create-session
}

module.exports.signup = function(req, res) {
  // return res.end('<h1> User profile</h1>')
  return res.render('signUp', {
    title: "Sign Up"
  });
}

module.exports.create = function (req, res) {
  // confirm password logic
  if(req.body.password != req.body.repeatPassword){
    return res.redirect('back');
  }

  //
  User.findOne({email: req.body.email}, function (err, user) {
    if(err){
      console.log('error in finding user in signing up');
      return;
    }

    if(!user){
      // If user does not exists, create new user
      User.create(req.body, function (err, user) {
        if(err){
          console.log(err);
          console.log('error in Creating user while signing up');
        }

        return res.redirect('/users/signin');
      })
    } else {
      // If user already exists
      return res.redirect('back');
    }
  });


}
