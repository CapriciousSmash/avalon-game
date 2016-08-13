var sequelize = require('../sequelize.js').sequelize;
var User = require('../sequelize.js').User;
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
  },
  increaseScore: function(id) {
    return User.find({id: id})
    .then(function(user) {
      var score = user.score;
      User.update({score: score + 1}, {where: {id: id}});
    });
  },
  increaseGames: function(id) {
    return User.find({id: id})
    .then(function(user) {
      var games = user.games;
      User.update({games: games + 1}, {where: {id: id}});
    });
  },
}