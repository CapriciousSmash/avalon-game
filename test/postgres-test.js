var expect = require('chai').expect;
var User = require('../server/db/sequelize.js').User;
var sequelize = require('../server/db/sequelize.js').sequelize;
var Promise = require('bluebird');
require('dotenv').config();

describe('Testing Postgres', function() {
  // outline what to add to make sure to remove it
  var name = 'testOtron';
  var name2 = 'tronOtest';
  var password = '123456';
  var hashpass = User.generateHash(password);

  it('should add user', function() {
    return User.findOrCreate({where: {
      name: name,
      password: password
    }})
    .then(function(user) {
      expect(user[0].dataValues.name).to.equal(name);
      expect(user[0].dataValues.password).to.equal(password);
    });
  });

  it('should hash input password', function() {
    expect(hashpass).to.not.equal(password);
  });

  it('should find that the passwords match', function() {
    this.timeout(0);
    return User.findOrCreate({where: {
      name: name2
      // password:hashpass
    }})
    .then(function(user) {
      return User.isValidPassword(password, user[0].dataValues.id);
    })
    .then(function(res) {
      console.log('res: ', res);
      expect(res).to.equal(true);
    });
  });
});