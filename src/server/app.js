require('dotenv').config(); // environment variables

const express = require('express');
const app = express();
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer); // create a Server for sockets
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');


// DB CONFIG ==============================
var dbUrl = process.env.DATABASEURL;
var dbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};
mongoose.connect(dbUrl, dbOptions);
// require('../../seeds/seeds')(); // to seed the DB REMOVE IN PROD
// DB CONFIG==============================    

// APP CONFIG=============================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname + '/../client/public')));
// APP CONFIG=============================

// AUTH CONFIG============================
const store = new MongoDBStore({
  uri: process.env.DATABASEURL,
  collection: 'sessions',
  clear_interval: (1000 * 60 * 60) // delete expired sessions every hour
});

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // converts to 1 day
  },
  store: store,
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sessionOptions.cookie.secure = true;
}

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy()); // method provided by passport-local-mongoose
passport.serializeUser(User.serializeUser()); // method provided by passport-local-mongoose
passport.deserializeUser(User.deserializeUser()); // method provided by passport-local-mongoose
// AUTH CONFIG============================

// CHAT CONFIG=============================
const chatNamespace = require('./sockets/chat_namespace');
chatNamespace(io); // this module will create a Namespace
// CHAT CONFIG=============================

// NOTIFICATION CONFIG=====================
const notificationRoutes = require('./routes/notifications');
app.use('/api', notificationRoutes(io));
// NOTIFICATION CONFIG=====================

// API ROUTES==============================
app.use(require('./controllers/controllers'));
// API ROUTES==============================

httpServer.listen(process.env.PORT, function () {
  console.log('Server started');
}); 
