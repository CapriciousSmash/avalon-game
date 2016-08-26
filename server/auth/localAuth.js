var passport = require('passport');
var LocalStrategy = require('passport-local');

// Auth check to redirect those not signed in
module.exports.isAuth = function(req, res, next) {
  var log = req.isAuthenticated();
  console.log(log);
  if(log) {
    console.log('success');
    return next();
  }
  console.log('failure');
  return res.redirect('/signin');
}
//---------------------------Local Strategy-------------------------------------
module.exports.localAuth = function(User) {

  passport.serializeUser(function(user, done) {
    var uid;
    console.log('serialize user');
    if (Array.isArray(user)) {
      uid = user[0].dataValues.id;
    } else {
      uid = user.dataValues.id;
    }
    console.log('uid', uid);
    return done(null, uid);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    console.log('deserialize user ', id);
    return User.find({where: {
        id: id
      }})
      .then(function(user) {
        console.log('deserialize successfull, ', user.dataValues.id);
        done(null, user.dataValues.id);
      })
      .catch(function(err) {
        console.log('deserialize unsuccessfull');
        done(err, null);
      });
  });
  
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, username, password, done) {
    // console.log('sign them up!', username, password);
    if (!req.user) {
      User.findOrCreate({where: {
        username: username,
        password: User.generateHash(password)
      }})
      .then(function(user) {
        done(null, user);
      }).catch(function(err) {
        done(err);
      });
    } else {
      //user exists and is logged in
      done(null, false);
    }
  }));
  //---------------------------local login----------------------------------------
  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, username, password, done) {
    console.log('checking username', username);
    var foundUser;
    return User.find({where: {
        username: username
      }})
      .then(function(user) {
        console.log('checking username and password for ');
        if (!user) {
          console.log('no user');
          return [false, user];
        } else {
          foundUser = user;
          return User.isValidPassword(password, user.dataValues.id);
        }
      })
      .then(function(match) {
        console.log('match', match);
        if (match && foundUser) {
          console.log('passwords match');
          return done(null, foundUser);
        } else {
          console.log('passwords don\'t match');
          return done(null, false);
        }
      })
      .catch(function(err) {
        done(err)
      });
  }));
}
