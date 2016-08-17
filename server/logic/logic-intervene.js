var gameLogic = require('./logic-main').gameLogic;

var teamBuilder = [
  // Each array is for number of players, while each element in the array is the
  // current round:
  // 5 Players:
  [2, 3, 2, 3, 3],
  // 6 Players:
  [2, 3, 4, 3, 4],
  // 7 Players:
  [2, 3, 3, 4, 4],
  // 8 Players:
  [3, 4, 4, 5, 5],
  // 9 Players:
  [3, 4, 4, 5, 5],
  // 10 Players:
  [3, 4, 4, 5, 5]
];
// pickParty is called to advance the game to the next stage if the 
// party leader makes a choice on the party before the timer runs out
module.exports.pickParty = function(memcache, socket, data) {

  console.log('pick party data: ', data);

  memcache.getTeam().then(function(teamList) {
    if(teamList.indexOf(data.playerId) > 0) {
      return;
    }
    memcache.addToTeam(data.playerId).then(function() {
      
      memcache.getTeam().then(function(partyList) {
        var partyCount = partyList.length;

        memcache.getPids().then(function(pidsList) {
          memcache.getRound().then(function(currentRound) {
            if (partyCount === teamBuilder[pidsList.length - 5][currentRound - 1]) {
              gameLogic(memcache, socket, 'RESOLVE PARTY');
            }
          });
        });
      });

    });
    
  });

 
};

// partyVote is called to advance the game to the questing stage by resolving the
// party more quickly if all votes are in
module.exports.partyVote = function(memcache, socket, data) {

  console.log('party vote data: ', data);

  var playerId = data.playerId;

  memcache.saveVoteCount(data.playerId, data.vote).then(function() {
    memcache.getVoteCount().then(function(voteCountList) {
      var voteCount = voteCountList.length;

      memcache.getPids().then(function(pidsList) {
        var numPlayers = pidsList.length;

        if (voteCount === numPlayers) {
          gameLogic(memcache, socket, 'RESOLVE VOTE');
        }
      });
    });
  });

};

// questVote is called to advance the game to the next stage by resolving the
// party more quickly if all votes are in
module.exports.questVote = function(memcache, socket, data) {
  
  // Test to see whether the player who voted should be voting
  memcache.getTeam().then(function(partyList) {
    if (partyList.indexOf(data.playerId) > -1) {
      // Make sure votes were not duplicated
      memcache.getQuestResult().then(function(qResults) {

        if (qResults.indexOf(data.playerId) === -1) {
          memcache.saveQuestResult(data.playerId, data.vote);
          // If voting is complete, move onward.
          var voteCount = qResults.length;

          if (voteCount === partyList.length) {
            console.log('All party votes are in, calling main game logic');
            gameLogic(memcache, socket, 'RESOLVE QUEST');
          }
        } else {
          console.log('Player voted already, fizzling');
        }

      });
    } else {
      console.log('Invalid voting detected. Ending function');
    }
  });

};


module.exports.stabMerlin = function(memcache, socket, data) {

  var playerId = data.playerId;

  memcache.getAssassin().then(function(assassinId) {
    
    if (playerId === assassinId) {
      memcache.setMguess(data.merlinId).then(function() {
        gameLogic(memcache, socket, 'RESOLVE MERLIN');
      });
    } else {
      console.log('Someone besides assassin tried to stab Merlin. Fizzling');
    }
  });
  
};