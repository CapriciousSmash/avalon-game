var expect = require('chai').expect;
var Promise = require('bluebird');

describe('Testing redis', function() {
  var redisDb = require('../server/db/redis.js')

  beforeEach(function() {
    var testCache = new redisDb(15);
  })

  it('should some kind of description', function() {
    // do things
    expect(func1().to.be.verb(func2()));
  })

  afterEach(function() {
    testCache.client.quit();
  })

});