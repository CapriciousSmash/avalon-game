var isAuth = require('./auth/localAuth.js').isAuth;
var path = require('path');
var pgHelp = require('./db/controller/index.js');

module.exports = function(app, passport) {

  var sendFile = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../client/public/index.html'));
  };

  // utility endpoint to return player data for use in the app
  app.get('/stats', function(req, res) {
    // return information based on who's logged in
    var sessions = req.sessionStore.sessions;
    var userId;
    for (var key in sessions) {
      var uid = JSON.parse(sessions[key])
      if (uid.passport && uid.passport.user) {
        userId = uid.passport.user;
      }
    }
    if(userId) {
      pgHelp.getInfo(userId)
      .then(function(data) {
        res.send(data);
      });
    } else {
      res.send('null');
    }
  });

  // logout endpoint, stops session
  app.get('/logout', function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
  });

  // These routes need auth, effectively middleware to catch-all route
  app.get('/play', isAuth, sendFile);
  app.get('/profile', isAuth, sendFile);
  app.get('/game', isAuth, sendFile);

  // These routes don't need auth
  app.get('/gameinfo', sendFile);
  app.get('/signin', sendFile);

  // post request handlers for signing in and signing up
  app.post('/signin', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/signin'
  }));

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signin'
  }));

  // catchall redirect to landing page
  app.get('*',function(req, res) {
    res.redirect('/');
  });

};
