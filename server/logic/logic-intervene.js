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
  
  memcache.saveQuestResult(data.playerId, data.vote).then(function() {
    memcache.getQuestResult(function(qResults) {
      var voteCount = qResults.length;

      memcache.getTeam().then(function(partyList) {
        var numPartymembers = partyList.length;

        if (voteCount === numPartyMembers) {
          gameLogic(memcache, socket, 'RESOLVE QUEST');
        }
      });
    });
  });
};


module.exports.stabMerlin = function(memcache, socket, data) {

  memcache.setMerlin(data.merlinId).then(function() {
    gameLogic(memcache, socket, 'RESOLVE MERLIN');
  });
  
};