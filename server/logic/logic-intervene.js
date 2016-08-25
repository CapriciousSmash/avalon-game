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

  memcache.getPids().then(function(pidsList) {
    memcache.getRound().then(function(currentRound) {

      var partyList = data.partyList;

      // Find the correct number of players that needs to be in the party by
      // using the teamBuilder cheatsheet
      var numPlayers = pidsList.length;
      if (numPlayers < 5 || numPlayers > 10) {
        numPlayers = 5;
      }

      if (partyList.length === teamBuilder[numPlayers - 5][currentRound - 1]) {
        // Ensures partyList only contains unique values:
        var hashSearch = {};
        for (var x = 0; x < partyList.length; x++) {
          if (hashSearch[partyList[x]]) {

            console.log('Error: Repeated party member');
            socket.emit('Invalid Party', {message: 'invalid party chosen - repeated characters'});
            return gameLogic(memcache, socket, 'CHOOSE PARTY');

          } else {
            hashSearch[partyList[x]] = true;
          }
        }

        // If we have made it this far, nothing died. Time to add members to the memcache team and
        // go on to the next phase
        partyList.forEach(function addToMemTeam(personId) {
          memcache.addToTeam(personId);
        });

        setTimeout(function() {
          console.log('calling resolve party from game logic filter');
          gameLogic(memcache, socket, 'RESOLVE PARTY');
        }, 1000);

      } else {

        console.log('Error: Wrong number of party members');
        socket.emit('Invalid Party', {message: 'invalid party chosen - wrong number of characters'});
        return gameLogic(memcache, socket, 'CHOOSE PARTY');

      }

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
          console.log('calling resolve vote from game logic filters');
          gameLogic(memcache, socket, 'RESOLVE VOTE');
        }
      });
    });
  });

};

// questVote is called to advance the game to the next stage by resolving the
// party more quickly if all votes are in
module.exports.questVote = function(memcache, socket, data) {

  console.log('quest vote in: ', data);
  
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