const nodeMailer  = require('../config/nodemailer');

// This is another way of exporting a method
exports.newComment = (comment) => {
  console.log("Inside newComment mailer");
  console.log(comment);
  var mailOptions = {
    from: 'raz25test@gmail.com',
    to: comment.user.email,
    subject: 'New comment published, Sending Email using Node.js',
    html: '<h1>Yup, your comment is now published</h1>'
  };

  nodeMailer.transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log("Error in sending mail ", error);
    } else {
      console.log('Email sent: ' + info);
      return;
    }
  });
}
