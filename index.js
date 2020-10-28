const express = require('express');
// Cookie parser
const cookieParser = require('cookie-parser');

// Mongodb mongoose Setup
const db = require('./config/mongoose');
const User = require('./models/user')

// User for session cookie and authentication
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');


const app = express();
const port = 8001;
const expressLayouts = require('express-ejs-layouts');

// Sass middleware, precompilation from scss or sass to css files
app.use(sassMiddleware({
  src: './assets/scss',
  dest: './assets/css',
  debug: true,
  outputStyle: 'extended',
  prefix: '/css'
}));

// Body parser
app.use(express.urlencoded({
  extended: true
}));

// cookie
app.use(cookieParser());

// Setup for static files
app.use(express.static('./assets'));

// Layouts need to be put before router, router will use these layouts
app.use(expressLayouts);
// Extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Setup the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
  name: 'codeial',
  // TODO change secret key before deployment in production mode
  secret: 'blahsomething',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: (1000 * 60 * 100)
  },
  store: new MongoStore({
    mongooseConnection: db,
    autoRemove: 'disabled'
  }, function(err) {
    console.log(err || 'connect-mongodb setup ok');
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// flash messages uses session-cookies to created so use them after session
app.use(flash());
app.use(customMware.setFlash);

// User express router
app.use('/', require('./routes'));

app.listen(port, function(err) {
  if (err) {
    // console.log('Error: ', err);
    console.log(`Error in running the server: ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
})
