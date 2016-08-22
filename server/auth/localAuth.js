// var passport = require('passport');
var LocalStrategy = require('passport-local');
//---------------------------Local Strategy-------------------------------------
module.exports = function(passport, User) {

  passport.serializeUser(function(user, done) {
    var userId;
    console.log('serialize user', user);
    if (Array.isArray(user)) {
      userId = user[0].id;
    } else {
      userId = user.id;
    }
    return done(null, userId);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    console.log('deserialize');
    return User.find({where: {
        id: id
      }})
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
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
    var foundUser;
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
