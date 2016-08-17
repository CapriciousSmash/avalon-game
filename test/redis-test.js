var expect = require('chai').expect;
var Promise = require('bluebird');
require('dotenv').config();

describe('Testing redis', function() {
  var redisDb = require('../server/db/redis.js')
  var testCache;

  // beforeEach(function() {
    testCache = new redisDb(15);
  // })

  it('true should be true', function() {
    // do things
    var testFunc = function() {
      return true;
    }
    expect(testFunc()).to.equal(true);
  })

  // afterEach(function() {
    // testCache.client.quit();
  // })

});