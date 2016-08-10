// The current party leader must choose the requisite number of players to go on a Quest
module.exports.chooseParty = function(memcache) {
  // Information needed from memcache:
  // - Current round
  // - Number of players in game
  // - Previous party leader

  // TODO: Set the current phase in the game to 'PARTY' in memcache
  // TODO: Determine new party leader based on previous party leader
  
  // TODO: Write logic to determine the number of players the party leader must choose
  // given the current round and total players in game
  
  // TODO: Should signal through sockets to the players that the party is being chosen
  // The party leader should be aware that he or she is the party leader and be given 
  // the tools to choose the new party
  
  // TODO: Set timer for resolveParty
};

module.exports.resolveParty = function(memcache) {
  // Information needed from memcache:
  // - List of party members chosen by the party leader

  // If phase from memcache is 'PARTY', then continue, otherwise, fizzle
  
  // TODO: Retrieve the list of party members

  // TODO: Set the new party into memcache

  // TODO: Notify players of the current party (websockets)

  // TODO: Set timer for voteOnParty
};