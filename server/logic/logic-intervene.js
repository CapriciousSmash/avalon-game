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
  //Grab TEAM
  var partyCount = '<-- FROM MEMCACHE -->';
  //Grab STAGE:SIZE
  var numPlayers = '<-- FROM MEMCACHE -->';
  //Grab STAGE:ROUND
  var currentRound = '<-- FROM MEMCACHE -->';

  // Doesn't look like there's an apparent pattern to the number of players and round
  // number to the number of party members so will hard code in a matrix for now:

  if (partyCount === teamBuilder[numPlayers - 5][currentRound - 1]) {
  	gameLogic(memcache, socket, 'RESOLVE PARTY');
  }
  
};

// partyVote is called to advance the game to the questing stage by resolving the
// party more quickly if all votes are in
module.exports.partyVote = function(memcache, socket, data) {

  var playerId = data.playerId;

  //Grab VOTECOUNT
  var voteCount = '<-- FROM MEMCACHE -->';
  //Grab STAGE:SIZE
  var numPlayers = '<-- FROM MEMCACHE -->';

  // Note: Further processing may be necessary to make sure to give the party time to 
  // discuss and possibly take back their votes. 

  // Can use this funciton to ensure that votes are valid and from the proper people

  if (voteCount === numPlayers) {
  	gameLogic(memcache, socket, 'RESOLVE VOTE');
  }
};

// questVote is called to advance the game to the next stage by resolving the
// party more quickly if all votes are in
module.exports.questVote = function(memcache, socket, data) {
  //GRAB QRESULT
  var voteCount = '<-- FROM MEMCACHE -->';
  //Grab TEAM
  var numPartyMembers = '<-- FROM MEMCACHE -->';

  // Can use this funciton to ensure that votes are valid and from the proper people
  if (voteCount === numPartyMembers) {
  	gameLogic(memcache, socket, 'RESOLVE QUEST');
  }
};


module.exports.stabMerlin = function(memcache, socket, data) {
  // Ensure valid choicing
  // data.stabMerlin vs memcache's MERLIN
  gameLogic(memcache, socket, 'RESOLVE MERLIN');
};