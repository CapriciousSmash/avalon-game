var expect = require('chai').expect;
var Promise = require('bluebird');
require('dotenv').config();

describe('Testing redis', function() {
  var redisDb = require('../server/db/redis.js')
  var testPids = ['1', '2', '3', '4', '5'];
  var testGid = 15;
  var testCache;

  beforeEach(function() {
    testCache = new redisDb(testGid);
  })

  it('should be able to access the redis db', function() {
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

  it('init should set PIDS', function() {
    return testCache.init(testPids, testGid)
    .then(function() {
      return testCache.getPids();
    })
    .then(function(pids) {
      expect(pids).to.deep.equal(testPids);
    })
  })

  it('init should set GID', function() {
    return testCache.init(testPids, testGid)
    .then(function() {
      return testCache.getGameID();
    })
    .then(function(gid) {
      expect(Number(gid)).to.equal(testGid);
    })
  })

  afterEach(function() {
    testCache.clear();
    testCache.data.quit();
  })

});