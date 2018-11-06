const express   = require('express');
const app       = express();
const mongoose  = require('mongoose');

const seedDB    = require('./util/seeds');

// DB CONFIG==============================
var dbUrl = process.env.DATABASEURL || "mongodb://localhost/tumblr_clone";
var dbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
};
mongoose.connect(dbUrl, dbOptions);
seedDB();
// DB CONFIG==============================

// APP CONFIG=============================

// APP CONFIG=============================

// API ROUTES==============================
app.get("/api", function(req, res) {
  res.send('this is the API endpoint');
});
// API ROUTES==============================

app.listen(8080, function() {
  console.log('Listening on 8080');
});
