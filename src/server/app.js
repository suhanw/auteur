const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

const User = require('./models/user');
const seedDB = require('./util/seeds');

// DB CONFIG==============================
// switch between dev or prod
var dbUrl = process.env.DATABASEURL || "mongodb://localhost/tumblr_clone";
var dbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};
mongoose.connect(dbUrl, dbOptions);
// seedDB();
// DB CONFIG==============================  

// APP CONFIG=============================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname + '/../client/public')));
// APP CONFIG=============================

// AUTH CONFIG============================
const sessionOptions = {
  secret: 'renhao',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000, // converts to 1 day
  }
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sessionOptions.cookie.secure = true;
}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy()); // method provided by passport-local-mongoose
passport.serializeUser(User.serializeUser()); // method provided by passport-local-mongoose
passport.deserializeUser(User.deserializeUser()); // method provided by passport-local-mongoose
// AUTH CONFIG============================

// API ROUTES==============================
app.use(require('./controllers/controllers'));
// API ROUTES==============================

// switch between dev (local) or prod
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Server started');
});
