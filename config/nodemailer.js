const nodemailer = require('nodemailer');
const ejs = require('ejs');

let transporter =  nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'raz25test@gmail.com',
    pass: 'raz@test66'
  }

})

let renderTemplate = (data, relativePath) => {
  let mainHTML;
  ejs.renderFile(
    path.join(__dirname, '../views/mailers', relativePath),
    data,
    function(err, template){
      if(err){
        console.log("error in rendering template");
        return;
      }

      mainHTML = template;
    }
  );

  return mainHTML;
}

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate
}
