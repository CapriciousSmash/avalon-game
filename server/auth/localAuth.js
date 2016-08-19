var passport = request('passport');
var LocalStrategy = request('passport-local');
//---------------------------Local Strategy-------------------------------------
module.exports = function(User) {
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, username, password, done) {
    // console.log('sign them up!', username, password);
    if (!req.user) {
      User.findOrCreate({where: {
        name: username,
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
    // console.log('checking username', username);
    var foundUser;
    return User.find({name: username})
      .then(function(user) {
        // console.log('checking username and password for ', user);
        if (user.length === 0) {
          return [false, user[0]];
        } else {
          foundUser = user[0];
          return User.isValidPassword(password, user.dataValues.id);
        }
      })
      .then(function(match) {
        // console.log('match', match, 'user', foundUser);
        if (match) {
          return done(null, foundUser);
        } else {
          return done(null, false);
        }
      })
      .catch(function(err) {
        done(err)
      });
  }));
}
