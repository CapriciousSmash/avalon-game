// var passport = require('passport');
var LocalStrategy = require('passport-local');
//---------------------------Local Strategy-------------------------------------
module.exports = function(passport, User) {
  passport.serializeUser(function(user, done) {
      done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
          done(err, user);
      });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function(username, password, done) {
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
    var foundUser = 0;
    return User.find({where: {
        username: username
      }})
      .then(function(user) {
        console.log('checking username and password for ', user);
        if (!user) {
          console.log('no user');
          return [false, user];
        } else {
          foundUser = user;
          return User.isValidPassword(password, user.dataValues.id);
        }
      })
      .then(function(match) {
        console.log('match', match, 'user', foundUser);
        if (match) {
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
