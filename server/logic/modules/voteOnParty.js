var startQuest = 

// Sets up the players to vote on the party chosen by the party leader. 
module.exports.voteOnParty = function(memcache, socket) {
  // Information needed from memcache
  // - Current party 
  var partyMembers = ['<-- FROM MEMCACHE -->'];

  // TODO: Set current game phase in memcache to 'VOTE'

  // TODO: Signal to players to begin voting. 
  socket.emit('startVote', {
    partyMembers
  });

  // TODO: Set timer for resolution to give players time to vote.
  setTimeout(function() {
    resolvePartyVote(memcache, socket);
  }, 500000);
}

var resolvePartyVote = function(memcache, socket) {
  // Information needed from memcache
  // - Player voting results
  var voteResults = ['<-- FROM MEMCACHE -->'];
  // - Current vetoes count
  var accepts = '<-- SEARCH VOTE RESULTS FOR ACCEPTS -->';
  var vetoes = '<-- SEARCH VOTE RESULTS FOR VETOES -->';
  // - Current game phase
  var gamePhase = '<-- FROM MEMCACHE -->';

  // If current game phase is not 'VOTE', fizzle
  if (gamePhase !== 'VOTE') {
    return;
  }

  // TODO: Calculate player voting results
  // Accepts > Rejects === Party accepted
  // Rejects >= Accepts === Party rejected

  var partyAccepted = accepts > vetoes ? true : false;
  if (partyAccepted) {
    // TODO: Signal to players (websockets) that the quest has been
    // accepted
    socket.emit('resolveVote', {
      result: 'accepted'
    });

    // TODO: Set timer for startQuest
    setTimeout
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

module.exports.resolvePartyVote = resolvePartyVote;



