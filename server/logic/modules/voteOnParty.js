// Sets up the players to vote on the party chosen by the party leader. 
module.exports.voteOnParty = function(memcache, socket) {
  // Information needed from memcache
  // - 

  // TODO: Set current game phase in memcache to 'VOTE'

  // TODO: Signal to players to begin voting. 
  socket.emit('startVote', {});

  // TODO: Set timer for resolution to give players time to vote.
}

module.exports.resolvePartyVote = function(memcache, socket) {
  // Information needed from memcache
  // - Player voting results
  // - Current vetoes count
  // - Current game phase

  // TODO: If current game phase is not 'VOTE', fizzle

  // TODO: Calculate player voting results
  // Accepts > Rejects === Party accepted
  // Rejects >= Accepts === Party rejected
  if (/* Party accepted */) {
    // TODO: Signal to players (websockets) that the quest has been
    // accepted

    // TODO: Set timer for startQuest
  } else /* Party rejected */ {
    // TODO: Signal to players (websockets) that the quest has been
    // rejected

    // TODO: Increase veto count in memcache

    // TODO: Check current veto count from memcache
    if (/* Veto count >= 5 */) {
      // TODO: Signal to players that heroes have lost. 

      // TODO: Set timer for gameOver with minion victory
    } else /* Veto count < 5 */ {
      // TODO: Set timer for chooseParty
    }
  }
};




