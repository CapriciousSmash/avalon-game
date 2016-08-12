var Promise = requre('bluebird');
var db = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

// Class that creates new DB instances and client connections for each game
// Initialize Redis either with heroku if .env included or local redis
var makeCache = function(gameNumber) {
  this.gameNumber = gameNumber;
  this.client = db.createClient(process.env.REDIS_URL, {db: gameNumber});

  this.client.on('error', function(err) {
    console.log('ERROR' + err);
  });


}

// init - Takes an array of PIDs and populates the db's
//        properties with their initial values.
makeCache.prototype.init = function(pidArray) {
  for (var i = 0; i < pidArray; i++) {
    this.client.saddAsync('PIDS', pidArray[i]);
    this.client.setAsync(pidArray[i] + ':ROLE', null);
    this.client.setAsync(pidArray[i] + ':VOTE', 'false');
  }

  this.client.setAsync('STAGE:SIZE', pidArray.length);
  this.client.setAsync('STAGE:ROUND', 1);
  this.client.setAsync('STAGE:PHASE', 'startGame');
  this.client.setAsync('SCORE:WIN', 0);
  this.client.setAsync('SCORE:LOSS', 0);
  this.client.setAsync('VETO', 0);
  this.client.setAsync('MGUESS', null);
  this.client.setAsync('WINNER', null);
};

// getPids - Takes nothing, returns array of PIDs
makeCache.prototype.getPids = function() {
  return this.client.smembersAsync('PIDS');
};

// setRole - takes PID and the role to set the PID's role to
makeCache.prototype.setRole = function(pid, role) {
  this.client.setAsync(pid + ':ROLE', role);
};

// getRole - takes PID and returns the role tied to that PID
makeCache.prototype.getRole = function(pid) {
  return this.client.getAsync(pid + ':ROLE');
};

// setVote - takes PID and vote to set the PID's vote to
makeCache.prototype.setVote = function(pid, vote) {
  this.client.setAsync(pid + ':VOTE', vote);
};

// getVote - takes PID and returns the vote tied to that PID
makeCache.prototype.getVote = function(pid) {
  return this.client.getAsync(pid + ':VOTE');
};

// getGameSize - returns the size of the game
makeCache.prototype.getGameSize = function() {
  return this.client.getAsync('SIZE');
};

// setTurnPhase - takes the phase and sets it in the memcache
makeCache.prototype.setTurnPhase = function(phase) {
  this.client.setAsync('STAGE:PHASE', phase);
};
// getTurnPhase - returns the phase currently stored in the memcache
makeCache.prototype.getTurnPhase = function() {
  return this.client.getAsync('STAGE:PHASE');
};
// incrRound - increase the round to the next, returns the next round
makeCache.prototype.incrRound = function() {
  return this.client.incrAsync('STAGE:ROUND');
};
// getRound - returns the current round
makeCache.prototype.getRound = function() {
  return this.client.getAsync('STAGE:ROUND');
};
// setLeader - takes the next leader and sets it
makeCache.prototype.setLeader = function(leader) {
  this.client.setAsync('LEADER', leader);
};
// getLeader - returns the current leader
makeCache.prototype.getLeader = function() {
  return this.client.getAsync('LEADER');
};
// incrVeto - increase the veto count and returns the updated value
makeCache.prototype.incrVeto = function() {
  return this.client.incrAsync('VETO');
};
// getVeto - returns the current veto count
makeCache.prototype.getVeto = function() {
  return this.client.getAsync('VETO');
};
// resetVeto - resets veto count to 0
makeCache.prototype.resetVeto = function() {
  this.client.setAsync('VETO', 0);
};
// incrWin - increases win count and returns update value
makeCache.prototype.incrWin = function() {
  return this.client.incrAsync('SCORE:WIN');
};
// getWin - returns current win count
makeCache.prototype.getWin = function() {
  return this.client.getAsync('SCORE:WIN');
};
// incrLoss - increases loss count and returns update value
makeCache.prototype.incrLoss = function() {
  return this.client.incrAsync('SCORE:LOSS');
};
// getLoss - returns current loss count
makeCache.prototype.getLoss = function() {
  return this.client.getAsync('SCORE:LOSS');
};
// setMguess - takes the PID of the Mguess and updates it in memcache
makeCache.prototype.setMguess = function(mGuess) {
  this.client.setAsync('MGUESS', mGuess);
};
// getMguess - returns the current Mguess
makeCache.prototype.getMguess = function() {
  return this.client.getAsync('MGUESS');
};
// setMerlin - takes the PID of Merlin and sets that player's role to Merlin
makeCache.prototype.setMerlin = function(pid) {
  this.client.setAsync('MERLIN', pid);
  this.client.setAsync(pid + ':ROLE', 'merlin');
};
// getMerlin - returns the PID of the player currently assigned to the role of Merlin
makeCache.prototype.getMerlin = function() {
  return this.client.getAsync('MERLIN');
};
// setAssassin - takes the PID of the Assassin and sets that player's role to Assassin
makeCache.prototype.setAssassin = function(pid) {
  this.client.setAsync('ASSASSIN', pid);
  this.client.setAsync(pid + ':ROLE', 'assassin');
};
// getAssassin - return the PID of the player currently assigned to the role of Assassin
makeCache.prototype.getAssassin = function() {
  return this.client.getAsync('ASSASSIN');
};
// setWinner - takes true or false for if the knights or minions win
makeCache.prototype.setWinner = function(winner) {
  this.client.setAsync('WINNER', winner);
};
// getWinner - returns true or false for if the knights or minions win
makeCache.prototype.getWinner = function() {
  return this.client.getAsync('WINNER');
};
// saveVoteCount - takes the PID of the user who has set their vote for the party
makeCache.prototype.saveVoteCount = function(pid) {
  this.getVote(pid)
  .then(function(vote) {
    this.client.saddAsync('VOTECOUNT', vote);
  });
};
// getVoteCount - returns the list of all the finalized votes
makeCache.prototype.getVoteCount = function() {
  return this.client.smembersAsync('VOTECOUNT');
};
// initQuestResult - takes the PID of the team and sets their votes before opening them for change
makeCache.prototype.initQuestResult = function() {
  this.getPids()
  .then(function(pids) {
    for (var i = 0; i < pids.length; i++) {
      this.setVote(pids[i], true);
    }
  })
};
// saveQuestResult - takes the PID of the user who has set their decision for quest
makeCache.prototype.saveQuestResult = function(pid) {
  this.getVote(pid)
  .then(function(vote) {
    this.client.saddAsync('QRESULT', vote);
  });
};
// getQuestResult - returns the array of all the quest decisions
makeCache.prototype.getQuestResult = function() {
  return this.client.smembersAsync('QRESULT');
}

module.exports = new makeCache();
