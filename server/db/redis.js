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
    getPids
    setRole
    getRole
    setVote
    getVote
    setGameSize
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

// setPids - Takes an array of PIDs and populates the db's
//           list and set default for pid based properties
makeCache.prototype.setPids = function(pidArray) {
  for (var i = 0; i < pidArray; i++) {
    this.client.saddAsync('PIDS', pidArray[i]);
    this.client.setAsync(pidArray[i] + ':ROLE', 'none');
    this.client.setAsync(pidArray[i] + ':VOTE', 'false');
  }
};

// getPids - Takes nothing, returns array of PIDs
makeCache.prototype.getPids = function() {
  return this.client.smembersAsync('PIDS');
};

module.exports = new makeCache();