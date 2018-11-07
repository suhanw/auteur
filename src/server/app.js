const express         = require('express');
const app             = express();
const mongoose        = require('mongoose');
const bodyParser      = require('body-parser');
const methodOverride  = require('method-override');
const passport        = require('passport');
const session         = require('express-session');
const LocalStrategy   = require('passport-local').Strategy;

const User = require('./models/user');
const userRoutes = require('./routes/users');
const sessionRoutes = require('./routes/session');
const middleware = require('./middleware/middleware');
const seedDB    = require('./util/seeds');

// DB CONFIG==============================
var dbUrl = process.env.DATABASEURL || "mongodb://localhost/tumblr_clone";
var dbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
};
mongoose.connect(dbUrl, dbOptions);
// seedDB();
// DB CONFIG==============================

// APP CONFIG=============================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
// APP CONFIG=============================

// AUTH CONFIG============================
const sessionOptions = {
  secret: 'renhao',
  resave: false,
  saveUninitialized: false,
  cookie: {}
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sessionOptions.cookie.secure = true;
}

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// AUTH CONFIG============================

// API ROUTES==============================
app.get("/api", middleware.isLoggedIn, function(req, res) {
  res.send('this is the API endpoint');
});

app.use('/api', userRoutes);
app.use('/api', sessionRoutes);
// API ROUTES==============================

app.listen(8080, function() {
  console.log('Listening on 8080');
});
