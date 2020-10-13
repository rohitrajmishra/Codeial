const mongoose = require('mongoose');

// Connect to DB
mongoose.connect('mongodb://localhost:27017/codeial_dev', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Acquire the connection to check if it's Successful
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error connecting to db'));

db.once('open', function (){
  console.log('Successfully connected to the database');
});

module.exports = db;
