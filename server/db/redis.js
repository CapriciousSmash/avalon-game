var Promise = require('bluebird');
var db = require('redis');
Promise.promisifyAll(db.RedisClient.prototype);
Promise.promisifyAll(db.Multi.prototype);

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
  for (var i = 0; i < pidArray.length; i++) {
    this.client.saddAsync('PIDS', pidArray[i]);
    this.client.setAsync(pidArray[i] + ':ROLE', 'none');
    this.client.setAsync(pidArray[i] + ':VOTE', 'false');
  }
  this.client.smembersAsync('PIDS');
  this.client.setAsync('STAGE:SIZE', pidArray.length);
  this.client.setAsync('STAGE:ROUND', 1);
  this.client.setAsync('STAGE:PHASE', 'GAME START');
  this.client.setAsync('SCORE:WIN', 0);
  this.client.setAsync('SCORE:LOSS', 0);
  this.client.setAsync('VETO', 0);
  this.client.setAsync('MGUESS', 'none');
  return this.client.setAsync('WINNER', 'none');
};

// getPids - Takes nothing, returns array of PIDs
makeCache.prototype.getPids = function() {
  return this.client.smembersAsync('PIDS');
};

// setRole - takes PID and the role to set the PID's role to
makeCache.prototype.setRole = function(pid, role) {
  this.client.setAsync(pid + ':ROLE', role);
  return this.client.saddAsync(role + 'S', pid);
};
// getKnights - returns a list of all the knights
makeCache.prototype.getKnights = function() {
  return this.client.smembersAsync('knights');
};
// getMinions - returns a list of all the minions
makeCache.prototype.getMinions = function() {
  return this.client.smembersAsync('minions');
};
// getRole - takes PID and returns the role tied to that PID
makeCache.prototype.getRole = function(pid) {
  return this.client.getAsync(pid + ':ROLE');
};
// addToTeam - takes PID of player to add to team
makeCache.prototype.addToTeam = function(pid) {
  return this.client.saddAsync('TEAM', pid);
};
// remFromTeam - takes PID of player to remove from team
makeCache.prototype.remFromTeam = function(pid) {
  return this.client.sremAsync('TEAM', pid);
};
// getTeam - returns the PIDs of all players on the team
makeCache.prototype.getTeam = function() {
  return this.client.smembersAsync('TEAM');
};
// getGameSize - returns the size of the game
makeCache.prototype.getGameSize = function() {
  return this.client.getAsync('SIZE');
};
// setTurnPhase - takes the phase and sets it in the memcache
makeCache.prototype.setTurnPhase = function(phase) {
  return this.client.setAsync('STAGE:PHASE', phase);
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
  return this.client.setAsync('LEADER', leader);
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
  return this.client.setAsync('VETO', 0);
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
  return this.client.setAsync('MGUESS', mGuess);
};
// getMguess - returns the current Mguess
makeCache.prototype.getMguess = function() {
  return this.client.getAsync('MGUESS');
};
// setMerlin - takes the PID of Merlin and sets that player's role to Merlin
makeCache.prototype.setMerlin = function(pid) {
  return this.client.setAsync('MERLIN', pid);
  // this.client.setAsync(pid + ':ROLE', 'merlin');
};
// getMerlin - returns the PID of the player currently assigned to the role of Merlin
makeCache.prototype.getMerlin = function() {
  return this.client.getAsync('MERLIN');
};
// setAssassin - takes the PID of the Assassin and sets that player's role to Assassin
makeCache.prototype.setAssassin = function(pid) {
  return this.client.setAsync('ASSASSIN', pid);
  // this.client.setAsync(pid + ':ROLE', 'assassin');
};
// getAssassin - return the PID of the player currently assigned to the role of Assassin
makeCache.prototype.getAssassin = function() {
  return this.client.getAsync('ASSASSIN');
};
// setWinner - takes true or false for if the knights or minions win
makeCache.prototype.setWinner = function(winner) {
  return this.client.setAsync('WINNER', winner);
};
// getWinner - returns true or false for if the knights or minions win
makeCache.prototype.getWinner = function() {
  return this.client.getAsync('WINNER');
};
// saveVoteCount - takes the PID of the user who has set their vote for the party
makeCache.prototype.saveVoteCount = function(pid, vote) {
  this.client.set(pid + ':VOTE', vote);
  this.client.rpushAsync('VOTECOUNT', vote);
  return this.client.rpushAsync('VOTEORDER', pid);
};
// getVoteCount - returns the list of all the finalized votes
makeCache.prototype.getVoteCount = function() {
  return this.client.lrangeAsync('VOTECOUNT', 0, -1);
};
// getVoteOrder - returns the order the votes were placed in
makeCache.prototype.getVoteOrder = function() {
  return this.client.lrangeAsync('VOTEORDER', 0, -1);
};
// clearVoteOrder - clears the vote order to be newly populated
makeCache.prototype.clearVotes = function() {
  this.client.delAsync('VOTEORDER');
  return this.client.delAsync('VOTECOUNT');
};
// initQuestResult - takes the PID of the team and sets their votes before opening them for change
makeCache.prototype.initQuestResult = function() {
  return this.getPids()
  .then(function(pids) {
    for (var i = 0; i < pids.length; i++) {
      this.setVote(pids[i], true);
    }
  })
};
// saveQuestResult - takes the PID of the user who has set their decision for quest
makeCache.prototype.saveQuestResult = function(pid, vote) {
  this.client.set(pid + ':VOTE', vote);
  return this.client.rpushAsync('QRESULT', vote);
};
// getQuestResult - returns the array of all the quest decisions
makeCache.prototype.getQuestResult = function() {
  return this.client.lrangeAsync('QRESULT', 0, -1)
          .then(function(qresults) {
            var randoResults = [];
            var randoIndex;
            for (var i = 0; i < qresults.length;) {
              randoIndex = Math.floor(Math.random() * i);
              randoResults.push(qresults.splice(randoIndex), 1);
            }
            return randoResults;
          });
}
// clearQuestResults - clears the quest results to be used once again
makeCache.prototype.clearQuestResults = function() {
  return this.client.delAsync('QRESULT');
};
// clear - deletes all stored values
makeCache.prototype.clear = function() {
  return this.client.flushdbAsync();
};
// quit - closes the client connection
makeCache.prototype.quit = function() {
  return this.clear();
  // .then(this.client.quit);
};

module.exports = makeCache;
