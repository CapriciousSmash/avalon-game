var expect = require('chai').expect;
var User = require('../server/db/sequelize.js').User;
var sequelize = require('../server/db/sequelize.js').sequelize;
var userHelpers = require('../server/db/controller/index.js');
var Promise = require('bluebird');
require('dotenv').config({silent: true});

describe('Testing Postgres', function() {
  // outline what to add to make sure to remove it
  var name = 'testOtron';
  var name2 = 'tron0test';
  var password = '123456';
  var hashpass; // = User.generateHash(password);
  var games, score;

  it('should add user', function() {
    return User.findOrCreate({where: {
      username: name,
      password: password
    }})
    .then(function(user) {
      expect(user[0].dataValues.username).to.equal(name);
      expect(user[0].dataValues.password).to.equal(password);
    });
  });

  it('should hash input password', function() {
    expect(hashpass).to.not.equal(password);
  });

  it('should find that the passwords match', function() {
    this.timeout(0);
    return User.findOrCreate({where: {
      username: name2
      // password: hashpass
    }})
    .then(function(user) {
      return User.isValidPassword(password, user[0].dataValues.id);
    })
    .then(function(res) {
      expect(res).to.equal(true);
    });
  });

  it('should increase score by 1', function() {
    return userHelpers.getInfo(2)
    .then(function(res) {
      score = res.points;
    })
    .then(function() {
      return userHelpers.increaseScore(2);
    })
    .then(function() {
      return userHelpers.getInfo(2);
    })
    .then(function(res) {
      expect(res.points).to.equal((score + 1));
    });
  });

  it('should increase games by 1', function() {
    return userHelpers.getInfo(2)
    .then(function(res) {
      games = res.games;
    })
    .then(function() {
      return userHelpers.increaseGames(2);
    })
    .then(function() {
      return userHelpers.getInfo(2);
    })
    .then(function(res) {
      expect(res.games).to.equal((games + 1));
    });
  });
});