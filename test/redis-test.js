var expect = require('chai').expect;
var Promise = require('bluebird');
require('dotenv').config({silent: true});

describe('Testing redis', function() {
  var redisDb = require('../server/db/redis.js');
  var testPids = ['1', '2', '3', '4', '5'];
  var testGid = 15;
  var testCache;

  beforeEach(function() {
    testCache = new redisDb(testGid);
    testCache.init(testPids, testGid);
  });

  it('should be able to access the redis db', function() {
    // do things
    var test = '5';
    return testCache.data.setAsync('test', test)
    .then(function() {
      return testCache.data.getAsync('test');
    })
    .then(function(result) {
      expect(result).to.equal(test);
    });
  });

  describe('Testing Info Methods', function() {

    it('initInfo defaults max to 10', function() {
      return testCache.initInfo(testGid)
      .then(function() {
        return testCache.getCapMax();
      })
      .then(function(cap) {
        expect(cap).to.equal('10');
      });
    });

    it('initInfo sets max to a minimum of 5', function() {
      return testCache.initInfo(testGid, 4)
      .then(function() {
        return testCache.getCapMax();
      })
      .then(function(cap) {
        expect(cap).to.equal('5');
      });
    });

    it('initInfo sets max to a maximum of 10', function() {
      return testCache.initInfo(testGid, 11)
      .then(function() {
        return testCache.getCapMax();
      })
      .then(function(cap) {
        expect(cap).to.equal('10');
      });
    });

    it('initInfo sets status to waiting', function() {
      return testCache.initInfo(testGid)
      .then(function() {
        return testCache.getStatus();
      })
      .then(function(status) {
        expect(status).to.equal('waiting');
      });
    });

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
      });
    });

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
      });
    });
  });

  describe('Testing Init and various Gets', function() {
    it('init should set PIDS', function() {
      return testCache.getPids()
      .then(function(pids) {
        expect(pids).to.deep.equal(testPids);
      });
    });

    it('init should set GID', function() {
      return testCache.getGameID()
      .then(function(gid) {
        expect(Number(gid)).to.equal(testGid);
      });
    });

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
      });
    });

    it('init should set the size of the game', function() {
      return testCache.getGameSize()
      .then(function(size) {
        expect(size).to.equal(testPids.length + '');
      });
    });

    it('init should set round to 1', function() {
      return testCache.getRound()
      .then(function(round) {
        expect(round).to.equal('1');
      });
    });

    it('init should set phase to GAME START', function() {
      return testCache.getTurnPhase()
      .then(function(phase) {
        expect(phase).to.equal('GAME START');
      });
    });

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
      });
    });

    it('init should set veto to 0', function() {
      return testCache.getVeto()
      .then(function(veto) {
        expect(veto).to.equal('0');
      });
    });

    it('init should set Merlin guess to none', function() {
      return testCache.getMguess()
      .then(function(mguess) {
        expect(mguess).to.equal('none');
      });
    });

    it('init should set winner to none', function() {
      return testCache.getWinner()
      .then(function(winner) {
        expect(winner).to.equal('none');
      });
    });
  });

  describe('Testing Set Functions', function() {
    it('should set the role to knight', function() {
      return testCache.setRole(1, 'knight')
      .then(function() {
        return testCache.getRole(1);
      })
      .then(function(res) {
        expect(res).to.equal('knight');
      });
    });

    it('should return the correct players as knights and minions', function() {
      var knights, minions;
      return testCache.setRole(1, 'knight')
      .then(function() {
        return testCache.setRole(2, 'knight');
      })
      .then(function() {
        return testCache.setRole(3, 'minion');
      })
      .then(function() {
        return testCache.setRole(4, 'knight');
      })
      .then(function() {
        return testCache.setRole(5, 'minion');
      })
      .then(function() {
        return testCache.getKnights();
      })
      .then(function(res) {
        console.log('res', res);
        knights = res.slice();
        return testCache.getMinions();
      })
      .then(function(res) {
        minions = res.slice();
        expect(knights).to.equal(['1', '2', '4']);
        expect(minions).to.equal(['3', '5']);
      });
    });

    it('should add pid to team', function() {
      return testCache.addToTeam(1)
      .then(function() {
        return testCache.getTeam();
      })
      .then(function(res) {
        expect(res).to.deep.equal(['1']);
      });
    });

    it('should remove pid from team', function() {
      return testCache.addToTeam(1)
      .then(function() {
        return testCache.addToTeam(2);
      })
      .then(function() {
        return testCache.remFromTeam(1);
      })
      .then(function() {
        return testCache.getTeam();
      })
      .then(function(res) {
        expect(res).to.deep.equal(['2']);
      });
    });

    it('should change phase', function() {
      return testCache.setTurnPhase('pick party')
      .then(function() {
        return testCache.getTurnPhase();
      })
      .then(function(res) {
        expect(res).to.equal('pick party');
      });
    });

    it('should increase round', function() {
      return testCache.incrRound()
      .then(function(res) {
        expect(res).to.equal(2);
      });
    });

    it('should set the leader', function() {
      return testCache.setLeader(1)
      .then(function() {
        return testCache.getLeader();
      })
      .then(function(res) {
        expect(res).to.equal('1');
      });
    });

    it('should increase the veto count', function() {
      return testCache.incrVeto()
      .then(function(res) {
        expect(res).to.equal(1);
      });
    });

    it('should reset the veto count', function() {
      return testCache.incrVeto()
      .then(function(res) {
        expect(res).to.equal(1);
        return testCache.resetVeto();
      })
      .then(function() {
        return testCache.getVeto();
      })
      .then(function(res) {
        expect(res).to.equal('0');
      });
    });

    it('should increase win count', function() {
      return testCache.incrWin()
      .then(function(res) {
        expect(res).to.equal(1);
      });
    });

    it('should increase loss count', function() {
      return testCache.incrLoss()
      .then(function(res) {
        expect(res).to.equal(1);
      });
    });

    it('should set MGuess', function() {
      return testCache.setMguess(1)
      .then(function() {
        return testCache.getMguess();
      })
      .then(function(res) {
        expect(res).to.equal('1');
      });
    });

    it('should set Merlin', function() {
      return testCache.setMerlin(1)
      .then(function() {
        return testCache.getMerlin();
      })
      .then(function(res) {
        expect(res).to.equal('1');
      });
    });

    it('should set Assassin', function() {
      return testCache.setAssassin(1)
      .then(function() {
        return testCache.getAssassin();
      })
      .then(function(res) {
        expect(res).to.equal('1');
      });
    });

    it('should set Winner', function() {
      return testCache.setWinner(true)
      .then(function() {
        return testCache.getWinner();
      })
      .then(function(res) {
        expect(res).to.equal('true');
      });
    });

    it('should save the vote count and order', function() {
      var numOrder = ['1', '4', '3', '5', '2'];
      var voteOrder = ['true', 'true', 'false', 'false', 'true'];
      return testCache.saveVoteCount(1, true)
      .then(function() {
        return testCache.saveVoteCount(4, true);
      })
      .then(function() {
        return testCache.saveVoteCount(3, false);
      })
      .then(function() {
        return testCache.saveVoteCount(5, false);
      })
      .then(function() {
        return testCache.saveVoteCount(2, true);
      })
      .then(function() {
        return testCache.getVoteCount();
      })
      .then(function(res) {
        expect(res).to.deep.equal(voteOrder);
        return testCache.getVoteOrder();
      })
      .then(function(res) {
        expect(res).to.deep.equal(numOrder);
      });
    });

    it('should save clear the vote count and order', function() {
      var numOrder = ['1', '4', '3', '5', '2'];
      var voteOrder = ['true', 'true', 'false', 'false', 'true'];
      return testCache.saveVoteCount(1, true)
      .then(function() {
        return testCache.saveVoteCount(4, true);
      })
      .then(function() {
        return testCache.saveVoteCount(3, false);
      })
      .then(function() {
        return testCache.saveVoteCount(5, false);
      })
      .then(function() {
        return testCache.saveVoteCount(2, true);
      })
      .then(function() {
        return testCache.clearVotes();
      })
      .then(function() {
        return testCache.getVoteCount();
      })
      .then(function(res) {
        expect(res).to.deep.equal([]);
        return testCache.getVoteOrder();
      })
      .then(function(res) {
        expect(res).to.deep.equal([]);
      });
    });

    it('should save quest results', function() {
      return testCache.saveQuestResult(1, true)
      .then(function() {
        return testCache.getQuestResult();
      })
      .then(function(res) {
        expect(res).to.deep.equal(['true']);
      });
    });

    it('should return the results in a random order', function() {
      var inOrder = ['true', 'false', 'true', 'false', 'true'];
      testCache.saveQuestResult(1, true);
      testCache.saveQuestResult(2, false);
      testCache.saveQuestResult(3, true);
      testCache.saveQuestResult(4, false);
      return testCache.saveQuestResult(5, true)
      .then(function() {
        return testCache.getQuestResult();
      })
      .then(function(res) {
        var numResults = {
          true: 0,
          false: 0
        };

        for (var i = 0; i < res.length; i++) {
          numResults[res[i]]++;
        }

        expect(numResults.true).to.equal(3);
        expect(numResults.false).to.equal(2);
        // This test will sometimes fail as radnomness can
        // put the results back into the original order
        expect(res).to.not.deep.equal(inOrder);
      });
    });
  });

  afterEach(function() {
    testCache.data.flushall();
    testCache.data.quit();
  });

});