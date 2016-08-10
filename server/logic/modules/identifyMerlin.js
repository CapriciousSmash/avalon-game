// Gives minions chance for redemption in game if the Assassin correctly identifies
// which player is Merlin
module.exports.identifyMerlin = function(memcache, socket) {
  // Information needed from memcache
  // - Identify of Assassin

  // TODO: Set current game phase in memcache to 'ID MERLIN'

  // TODO: Signal to players that the Assassin must make a decision to 
  // identify Merlin

  // TODO: Set timer for resolveIdMerlin
};

module.exports.resolveIdMerlin = function(memcache, socket) {
  // Information needed from memcache
  // - The identify of merlin
  // - The choice of Assassin for the identify of merlin
  // - Current game phase

  // TODO: If the current game phase is not 'ID MERLIN', fizzle

  // TODO: Signal to players that the Assassin has chosen Merlin

  // TODO: If identify of merlin === Assassin's choice, then reverse
  // winner in memcache to the minions
  if (/* Merlin ID === Assassin's choice ID */) {
  	// TODO: Signal to players that Assassins' choice was correct
  	// TODO: Set memcache winning side to minions
  } else /* Assassin choice ID !== Merlin ID */ {
  	// TODO: Signal to the players that the Assassin's choice was
  	// incorrect and reveal the identity of Merlin
  }

  // TODO: Set timer for gameOver
};