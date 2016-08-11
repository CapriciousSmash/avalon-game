var gameLogic = require('./logic-main').gameLogic;

// filterParty is called to advance the game to the next stage if the 
// party leader makes a choice on the party before the timer runs out
var filterParty = function(memcache, socket, data) {
  var partyCount = '<-- FROM MEMCACHE -->';
  var numPlayers = '<-- FROM MEMCACHE -->';
  var currentRound = '<-- FROM MEMCACHE -->';

  // Doesn't look like there's an apparent pattern to the number of players and round
  // number to the number of party members so will hard code in a matrix for now:
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

  if (partyCount === teamBuilder[numPlayers - 5][currentRound - 1]) {
  	gameLogic(memcache, socket, 'RESOLVE PARTY');
  }
  
};

// filterVote is called to advance the game to the questing stage by resolving the
// party more quickly if all votes are in
var filterVote = function(memcache, socket, data) {
  var playerId = data.playerId;
  


  var voteCount = '<-- FROM MEMCACHE -->';
  var numPlayers = '<-- FROM MEMCACHE -->';

  // Note: Further processing may be necessary to make sure to give the party time to 
  // discuss and possibly take back their votes. 

  // Can use this funciton to ensure that votes are valid and from the proper people

  if (voteCount === numPlayers) {
  	gameLogic(memcache, socket, 'RESOLVE VOTE');
  }
};

var filterQuest = function(memcache, socket, data) {
  var voteCount = '<-- FROM MEMCACHE -->';
  var numPartyMembers = '<-- FROM MEMCACHE -->';

  // Can use this funciton to ensure that votes are valid and from the proper people
  if (voteCount === numPartyMembers) {
  	gameLogic(memcache, socket, 'RESOLVE QUEST');
  }
}

var filterMerlin = function(memcache, socket, data) {
  // Ensure valid choicing
  gameLogic(memcache, socket, 'RESOLVE MERLIN');
}

// The purpose of the filter function is to check on specific signals from
// player clients to fire off the next step in the game logic early.
module.exports.gameFilter = function(memcache, socket, type, data) {
  
  if (type === 'PICK PARTY') {
  	filterParty(memcache, socket, data);
  }

  if (type === 'PARTY VOTE') {
  	filterVote(memcache, socket, data);
  }

  if (type === 'QUEST VOTE') {
  	filterQuest(memcache, socket, data);
  }

  if (type === 'STAB MERLIN') {
  	filterMerlin(memcache, socket, data);
  }

};