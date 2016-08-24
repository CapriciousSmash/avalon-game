var sequelize = require('../sequelize.js').sequelize;
var User = require('../sequelize.js').User;
var Promise = require('bluebird');
var bcrypt = require('bcrypt-nodejs');

module.exports = {
  getInfo: function(id) {
    return User.find({where: {
      id: id
    }})
    .then(function(user) {
      return {
        id: id,
        username: user.username,
        points: user.points,
        games: user.games
      };
    });
  },
  increaseScore: function(id) {
    return User.find({where: {
      id: id
    }})
    .then(function(user) {
      var points = user.points;
      return User.update({points: points + 1}, {where: {id: id}});
    });
  },
  increaseGames: function(id) {
    return User.find({where: {
      id: id
    }})
    .then(function(user) {
      var games = user.games;
      return User.update({games: games + 1}, {where: {id: id}});
    });
  },
}