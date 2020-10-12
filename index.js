const express = require('express');
// Cookie parser
const cookieParser = require('cookie-parser');

// Mongodb mongoose Setup
const db = require('./config/mongoose');
const User = require('./models/user')

const app = express();
const port = 8001;
const expressLayouts = require('express-ejs-layouts');


// Body parser
app.use(express.urlencoded({ extended: true }));

// cookie
app.use(cookieParser());

// Setup for static files
app.use(express.static('./assets'));

// Layouts need to be put before router, router will use these layouts
app.use(expressLayouts);
// Extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// User express router
app.use('/', require('./routes'));

// Setup the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, function (err){
  if(err){
    // console.log('Error: ', err);
    console.log(`Error in running the server: ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
})
