var expect = require('chai').expect;
var Promise = require('bluebird');
require('dotenv').config();

describe('Testing redis', function() {
  var redisDb = require('../server/db/redis.js')
  var testCache;

  beforeEach(function() {
    testCache = new redisDb(15);
  })

  it('should be able to set and get', function() {
    // do things
    var test = '5';
    return testCache.data.setAsync('test', test)
    .then(function() {
      return testCache.data.getAsync('test');
    })
    .then(function(result) {
      expect(result).to.equal(test);
    })
  })

  afterEach(function() {
    testCache.clear();
    testCache.data.quit();
  })

});