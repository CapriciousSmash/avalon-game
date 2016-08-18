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
    testCache.init(testPids, testGid);
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

  describe('Testing Info Methods', function() {

    it('initInfo defaults max to 10', function() {
      return testCache.initInfo(testGid)
      .then(function() {
        return testCache.getCapMax();
      })
      .then(function(cap) {
        expect(cap).to.equal('10');
      })
    })

    it('initInfo sets max to a minimum of 5', function() {
      return testCache.initInfo(testGid, 4)
      .then(function() {
        return testCache.getCapMax();
      })
      .then(function(cap) {
        expect(cap).to.equal('5');
      })
    })

    it('initInfo sets max to a maximum of 10', function() {
      return testCache.initInfo(testGid, 11)
      .then(function() {
        return testCache.getCapMax();
      })
      .then(function(cap) {
        expect(cap).to.equal('10');
      })
    })

    it('initInfo sets status to waiting', function() {
      return testCache.initInfo(testGid)
      .then(function() {
        return testCache.getStatus();
      })
      .then(function(status) {
        expect(status).to.equal('waiting');
      })
    })

    it('setCapMax changes cap', function() {
      return testCache.initInfo(testGid)
      .then(function() {
        return testCache.setCapMax(5);
      })
      .then(function() {
        return testCache.getCapMax();
      })
      .then(function(res) {
        expect(res).to.equal('5');
      })
    })

    it('setStatus changes status', function() {
      return testCache.initInfo(testGid)
      .then(function() {
        return testCache.setStatus('ready');
      })
      .then(function() {
        return testCache.getStatus();
      })
      .then(function(res) {
        expect(res).to.equal('ready');
      })
    })
  })

  describe('Testing Init and various Gets', function() {
    it('init should set PIDS', function() {
      return testCache.getPids()
      .then(function(pids) {
        expect(pids).to.deep.equal(testPids);
      })
    })

    it('init should set GID', function() {
      return testCache.getGameID()
      .then(function(gid) {
        expect(Number(gid)).to.equal(testGid);
      })
    })

    it('init should set player\'s Role to none and vote to false', function() {
      var role, vote;
      return testCache.getRole('1')
      .then(function(res) {
        role = res;
        return testCache.data.getAsync('1:VOTE');
      })
      .then(function(res) {
        vote = res;
        expect(role).to.equal('none');
        expect(vote).to.equal('false');
      })
    })

    it('init should set the size of the game', function() {
      return testCache.getGameSize()
      .then(function(size) {
        expect(size).to.equal(testPids.length + '');
      })
    })

    it('init should set round to 1', function() {
      return testCache.getRound()
      .then(function(round) {
        expect(round).to.equal('1');
      })
    })

    it('init should set phase to GAME START', function() {
      return testCache.getTurnPhase()
      .then(function(phase) {
        expect(phase).to.equal('GAME START');
      })
    })

    it('init should set wins and losses to 0', function() {
      var wins, losses;
      return testCache.getWin()
      .then(function(res) {
        wins = res;
        return testCache.getLoss();
      })
      .then(function(res) {
        losses = res;
        expect(wins).to.equal('0');
        expect(losses).to.equal('0');
      })
    })

    it('init should set veto to 0', function() {
      return testCache.getVeto()
      .then(function(veto) {
        expect(veto).to.equal('0');
      })
    })

    it('init should set Merlin guess to none', function() {
      return testCache.getMguess()
      .then(function(mguess) {
        expect(mguess).to.equal('none');
      })
    })

    it('init should set winner to none', function() {
      return testCache.getWinner()
      .then(function(winner) {
        expect(winner).to.equal('none');
      })
    })
  })

  afterEach(function() {
    testCache.clear();
    testCache.data.quit();
  })

});