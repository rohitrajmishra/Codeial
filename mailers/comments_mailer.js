const nodeMailer  = require('../config/nodemailer');

// This is another way of exporting a method
exports.newComment = (comment) => {
  // console.log("Inside newComment mailer");
  let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');
  console.log("htmlString --> ", htmlString)
  console.log(comment);
  var mailOptions = {
    from: 'raz25test@gmail.com',
    to: comment.user.email,
    subject: 'New comment published, Sending Email using Node.js',
    html: htmlString
  };

  nodeMailer.transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log("Error in sending mail ", error);
    } else {
      console.log('Email sent: ' + info.response);
      return;
    }
  });
}
