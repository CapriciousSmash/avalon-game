var sequelize = require('../sequelize.js').sequelize;
var User = requre('../sequelize.js').User;
var Promise = require('bluebird');
var bcrypt = require('bcrypt-nodejs');

module.exports = {
  getScore: function(id) {
    return User.find({id: id})
    .then(function(user) {
      var score = user.score;
      var games = user.games;

      return [score, games].slice();
    });
  }
}