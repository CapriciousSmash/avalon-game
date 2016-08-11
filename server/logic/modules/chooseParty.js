var voteOnParty = require('./voteOnParty').voteOnParty;

// The current party leader must choose the requisite number of players to go on a Quest
module.exports.chooseParty = function(memcache, socket) {
  // Information needed from memcache:
  // - Current round
  var currentRound = '<-- FROM MEMCACHE -->';
  // - Number of players in game
  var numPlayers = '<-- FROM MEMCACHE -->';
  // - Previous party leader
  var prevPartyLeader = '<-- FROM MEMCACHE -->';

  // TODO: Set the current phase in the game to 'PARTY' in memcache
  // TODO: Determine new party leader based on previous party leader
  var currentPartyLeader = '<-- WRITE THE LOGIC -->';
  
  // Write logic to determine the number of players the party leader must choose
  // given the current round and total players in game

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

  var partySize = teamBuilder[numPlayers - 5][currentRound - 1];
  
  // TODO: Should signal through sockets to the players that the party is being chosen
  // The party leader should be aware that he or she is the party leader and be given 
  // the tools to choose the new party
  socket.emit('sendParty', {
  	gameId: 5318008,
  	partySize,
  	currentPartyLeader
  });
  
  // TODO: Set timer for resolveParty
  setTimeout(function() {
  	resolveParty(memcache, socket);
  }, 500000);
};

var resolveParty = function(memcache, socket) {
  // Information needed from memcache:
  // - List of party members chosen by the party leader
  var partyMembers = ['<-- FROM MEMCACHE -->'];
  // - Current game phase 
  var gamePhase = '<-- FROM MEMCACHE -->';

  // If phase from memcache is 'PARTY', then continue, otherwise, fizzle
  if (gamePhase !== 'PARTY') {
  	return;
  }
  
  // Retrieved the list of party members

  // TODO: Set the new party into memcache

  // Notify players of the current party
  socket.emit('resolveParty', {
  	gameId: 5318008,
  	partyMembers,
  });

  // TODO: Set timer for voteOnParty
  setTimeout(function() {
  	voteOnParty(memcache, socket);
  }, 5000000);
};

module.exports.resolveParty = resolveParty;





