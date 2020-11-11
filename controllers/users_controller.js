const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req, res) {
  User.findById(req.params.id, function(err, user){
    return res.render('user_profile', {
      title: "User profile",
      profile_user: user
    });
  })
  // return res.end('<h1> User profile</h1>')

}

module.exports.update = async function(req, res) {
  if(req.user.id == req.params.id){
    try{
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function(err) {
        if (err) {
          console.log('****Multer Error: ', err);
        }

        // console.log(req.file);
        user.name = req.body.name;
        user.email = req.body.email;

        if(req.file){
          // Check if avatar already exists(replace)
          if(user.avatar){
            let filePath = path.join(__dirname, '..', user.avatar);
            console.log(filePath);
            if(fs.existsSync(filePath)){
              console.log('Unlinking existing avatar image..');
              fs.unlinkSync(filePath);
            }

          }

          // Saving the path of the uploaded file into the avatar field in the user
          user.avatar = User.avatarPath + '/' + req.file.filename;
        }

        user.save();
        return res.redirect('back');

      });
    }catch(err){
      res.flash('error', err);
      return res.redirect('back');
    }
  }else{
    return res.status(401).send('Unauthorized');
  }
}


module.exports.signin = function(req, res) {
  if(req.isAuthenticated()){
    return res.redirect('/users/profile');
  }

  return res.render('signIn', {
    title: "Sign In"
  });
}

// Sign-in and create-session
module.exports.createSession = function (req, res) {
  req.flash('success', 'Logged in Successfully');
  return res.redirect('/');
}

module.exports.signup = function(req, res) {
  if(req.isAuthenticated()){
    return res.redirect('/users/profile');
  }
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


// Sign-out and destroySession
module.exports.destroySession = function (req, res) {
  // Logout function is given by passport js
  req.logout();
  req.flash('success', 'You have logged out...');

  return res.redirect('/');
}
