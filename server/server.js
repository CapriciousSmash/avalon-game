require('dotenv').config({silent: true});
var express = require('express');
var session = require('express-session');
var http = require('http');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportLocal = require('./auth/localAuth.js').localAuth;
var User = require('./db/sequelize.js').User;
var cookieParser = require('cookie-parser');
var router = require('./routes.js');
var sockets = require('./sockets.js');
// Import the game logic router to allow calling of game logic functions
// based on received signals
var game = require('./logic/logic-main').gameLogic;
var logicFilter = require('./logic/logic-intervene');

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/../client/public'));

passportLocal(User);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ 
  secret: '8SER9M9jXS',
  saveUninitialized: false,
  resave: false,
  cookie: {
    secret: '8SER9M9jXS'
  }
}));
app.use(passport.initialize());
app.use(passport.session());

router(app);

var server = app.listen(port, ()=>{
  console.log('Listening on port', port);
});
sockets(server);
