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

/*
  Methods for the cache
    getGameSize
    setGameStage
    getGameStage
    setTurnPhase
    getTurnPhase
    setLeader
    getLeader
    getVeto
    resetVeto
    incrVeto
    saveVoteCount
    saveQuestResult
    recordWin
    recordLoss
    getWin
    getLoss
    setMGuess
    getMGuess
    setMerlin
    getMerlin
    setAssassin
    getAssassin
    setWinner
    getWinner
*/

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
  this.client.setAsync('GAMESCORE:WIN', 0);
  this.client.setAsync('GAMESCORE:LOSS', 0);
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

// getGameSize

module.exports = new makeCache();
