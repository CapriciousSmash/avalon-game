var Promise = require('bluebird');
var db = require('redis');
Promise.promisifyAll(db.RedisClient.prototype);
Promise.promisifyAll(db.Multi.prototype);

// Class that creates new DB instances and client connections for each game
// Initialize Redis either with heroku if .env included or local redis
var makeCache = function(gameNumber) {
  this.gameNumber = gameNumber;
  this.data = db.createClient(process.env.REDIS_URL, {db: gameNumber});

  this.data.on('error', function(err) {
    console.log('ERROR' + err);
  });
};

// init - Takes an array of PIDs and populates the db's
//        properties with their initial values.
makeCache.prototype.init = function(pidArray, gameId) {

  // Initialize the game server to run a game
  this.data.setAsync('GAMEID', gameId);
  for (var i = 0; i < pidArray.length; i++) {
    this.data.saddAsync('PIDS', pidArray[i]);
    this.data.setAsync(pidArray[i] + ':ROLE', 'none');
    this.data.setAsync(pidArray[i] + ':VOTE', 'false');
  }
  this.data.smembersAsync('PIDS');
  this.data.setAsync('STAGE:SIZE', pidArray.length);
  this.data.setAsync('STAGE:ROUND', 1);
  this.data.setAsync('STAGE:PHASE', 'GAME START');
  this.data.setAsync('SCORE:WIN', 0);
  this.data.setAsync('SCORE:LOSS', 0);
  this.data.setAsync('VETO', 0);
  this.data.setAsync('MGUESS', 'none');
  return this.data.setAsync('WINNER', 'none');
};

// getPids - Takes nothing, returns array of PIDs
makeCache.prototype.getPids = function() {
  return this.data.smembersAsync('PIDS');
};
// getGameID - returns the id of the game (room name hex val)
makeCache.prototype.getGameID = function() {
  return this.data.getAsync('GAMEID');
};
// setRole - takes PID and the role to set the PID's role to
makeCache.prototype.setRole = function(pid, role) {
  this.data.setAsync(pid + ':ROLE', role);
  return this.data.saddAsync(role + 'S', pid);
};
// getKnights - returns a list of all the knights
makeCache.prototype.getKnights = function() {
  return this.data.smembersAsync('knights');
};
// getMinions - returns a list of all the minions
makeCache.prototype.getMinions = function() {
  return this.data.smembersAsync('minions');
};
// getRole - takes PID and returns the role tied to that PID
makeCache.prototype.getRole = function(pid) {
  return this.data.getAsync(pid + ':ROLE');
};
// addToTeam - takes PID of player to add to team
makeCache.prototype.addToTeam = function(pid) {
  return this.data.saddAsync('TEAM', pid);
};
// remFromTeam - takes PID of player to remove from team
makeCache.prototype.remFromTeam = function(pid) {
  return this.data.sremAsync('TEAM', pid);
};
// getTeam - returns the PIDs of all players on the team
makeCache.prototype.getTeam = function() {
  return this.data.smembersAsync('TEAM');
};
// getGameSize - returns the size of the game
makeCache.prototype.getGameSize = function() {
  return this.data.getAsync('SIZE');
};
// setTurnPhase - takes the phase and sets it in the memcache
makeCache.prototype.setTurnPhase = function(phase) {
  return this.data.setAsync('STAGE:PHASE', phase);
};
// getTurnPhase - returns the phase currently stored in the memcache
makeCache.prototype.getTurnPhase = function() {
  return this.data.getAsync('STAGE:PHASE');
};
// incrRound - increase the round to the next, returns the next round
makeCache.prototype.incrRound = function() {
  return this.data.incrAsync('STAGE:ROUND');
};
// getRound - returns the current round
makeCache.prototype.getRound = function() {
  return this.data.getAsync('STAGE:ROUND');
};
// setLeader - takes the next leader and sets it
makeCache.prototype.setLeader = function(leader) {
  return this.data.setAsync('LEADER', leader);
};
// getLeader - returns the current leader
makeCache.prototype.getLeader = function() {
  return this.data.getAsync('LEADER');
};
// incrVeto - increase the veto count and returns the updated value
makeCache.prototype.incrVeto = function() {
  return this.data.incrAsync('VETO');
};
// getVeto - returns the current veto count
makeCache.prototype.getVeto = function() {
  return this.data.getAsync('VETO');
};
// resetVeto - resets veto count to 0
makeCache.prototype.resetVeto = function() {
  return this.data.setAsync('VETO', 0);
};
// incrWin - increases win count and returns update value
makeCache.prototype.incrWin = function() {
  return this.data.incrAsync('SCORE:WIN');
};
// getWin - returns current win count
makeCache.prototype.getWin = function() {
  return this.data.getAsync('SCORE:WIN');
};
// incrLoss - increases loss count and returns update value
makeCache.prototype.incrLoss = function() {
  return this.data.incrAsync('SCORE:LOSS');
};
// getLoss - returns current loss count
makeCache.prototype.getLoss = function() {
  return this.data.getAsync('SCORE:LOSS');
};
// setMguess - takes the PID of the Mguess and updates it in memcache
makeCache.prototype.setMguess = function(mGuess) {
  return this.data.setAsync('MGUESS', mGuess);
};
// getMguess - returns the current Mguess
makeCache.prototype.getMguess = function() {
  return this.data.getAsync('MGUESS');
};
// setMerlin - takes the PID of Merlin and sets that player's role to Merlin
makeCache.prototype.setMerlin = function(pid) {
  return this.data.setAsync('MERLIN', pid);
  // this.data.setAsync(pid + ':ROLE', 'merlin');
};
// getMerlin - returns the PID of the player currently assigned to the role of Merlin
makeCache.prototype.getMerlin = function() {
  return this.data.getAsync('MERLIN');
};
// setAssassin - takes the PID of the Assassin and sets that player's role to Assassin
makeCache.prototype.setAssassin = function(pid) {
  return this.data.setAsync('ASSASSIN', pid);
  // this.data.setAsync(pid + ':ROLE', 'assassin');
};
// getAssassin - return the PID of the player currently assigned to the role of Assassin
makeCache.prototype.getAssassin = function() {
  return this.data.getAsync('ASSASSIN');
};
// setWinner - takes true or false for if the knights or minions win
makeCache.prototype.setWinner = function(winner) {
  return this.data.setAsync('WINNER', winner);
};
// getWinner - returns true or false for if the knights or minions win
makeCache.prototype.getWinner = function() {
  return this.data.getAsync('WINNER');
};
// saveVoteCount - takes the PID of the user who has set their vote for the party
makeCache.prototype.saveVoteCount = function(pid, vote) {
  this.data.set(pid + ':VOTE', vote);
  this.data.rpushAsync('VOTECOUNT', vote);
  return this.data.rpushAsync('VOTEORDER', pid);
};
// getVoteCount - returns the list of all the finalized votes
makeCache.prototype.getVoteCount = function() {
  return this.data.lrangeAsync('VOTECOUNT', 0, -1);
};
// getVoteOrder - returns the order the votes were placed in
makeCache.prototype.getVoteOrder = function() {
  return this.data.lrangeAsync('VOTEORDER', 0, -1);
};
// clearVoteOrder - clears the vote order to be newly populated
makeCache.prototype.clearVotes = function() {
  this.data.delAsync('VOTEORDER');
  return this.data.delAsync('VOTECOUNT');
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
  this.data.set(pid + ':VOTE', vote);
  return this.data.rpushAsync('QRESULT', vote);
};
// getQuestResult - returns the array of all the quest decisions
makeCache.prototype.getQuestResult = function() {
  return this.data.lrangeAsync('QRESULT', 0, -1)
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
  return this.data.delAsync('QRESULT');
};
// clear - deletes all stored values
makeCache.prototype.clear = function() {
  return this.data.flushdbAsync();
};
// quit - closes the data connection
makeCache.prototype.quit = function() {
  return this.clear();
  // .then(this.data.quit);
};

// DB INFO
// This section of handlers specifically interacts with how certain status and
// situational information is handled for ease of use

// initInfo - takes the gameId and the max players for the game (default 10) and
//            initializes the info for that db
makeCache.prototype.initInfo = function(gameId, max) {
  max = max || 10;
// Create connection to info DB and store the game's info
  var info = db.createClient(process.env.REDIS_URL, {db: 0});
  return info.setAsync(gameId + ':CAP:MAX', max)
  .then(function() {
    return info.setAsync(gameId + ':CAP:CUR', 0);
  })
  .then(function() {
    return info.setAsync(gameId + 'STATUS', 'waiting');
  })
  .then(function() {
    return info.saddAsync('GAMEIDS', gameId);
  }).then(function() {
    return info.quit();
  });
};
// getCapMax - takes the game id in question and returns number of the current capacity maximum
makeCache.prototype.getCapMax = function() {
  var info = db.createClient(process.env.REDIS_URL, {db: 0});
  return info.getAsync(this.gameNumber + ':CAP:MAX')
  .then(function() {
    return info.quit();
  });
};
// setCapMax - takes the game id and number to set new capacity maximum to
makeCache.prototype.setCapMax = function(cap) {
  var info = db.createClient(process.env.REDIS_URL, {db: 0});
  // Check if cap is greater than 9
  if (cap > 9) {
    // if so, set it to 10
    return info.setAsync(this.gameNumber + ':CAP:MAX', 10)
    .then(function() {
      return info.quit();
    })
  } else if (cap < 6) {
  // else if it's smaller than 6
    // set it to 5
    return info.setAsync(this.gameNumber + ':CAP:MAX', 5)
    .then(function() {
      return info.quit();
    })
  } else {
  // else
    // set it to the number passed in
    return info.setAsync(this.gameNumber + ':CAP:MAX', cap)
    .then(function() {
      return info.quit();
    })
  }
};
// setStatus - takes a string to update the current game status
makeCache.prototype.setStatus = function(status) {
  var info = db.createClient(process.env.REDIS_URL, {db: 0});
  return info.setAsync(this.gameNumber + ':STATUS', status)
  .then(function() {
    return info.quit();
  });
};
// getStatus - returns the current game status
makeCache.prototype.getStatus = function() {
  var info = db.createClient(process.env.REDIS_URL, {db: 0});
  return info.getAsync(this.gameNumber + ':Status')
  .then(function(status) {
    info.quit();
    return status;
  })
};
// getAllGIDs - returns all the game ids stored and utilized
makeCache.prototype.getAllGIDs = function() {
  var info = db.createClient(process.env.REDIS_URL, {db: 0});
  return info.smembersAsync('GAMEIDS')
  .then(function(gameIds) {
    info.quit();
    return gameIds;
  })
};

module.exports = makeCache;
