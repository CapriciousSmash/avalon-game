var startQuest = require('./decideQuest').startQuest;
var gameEnd = require('./gameOver').gameEnd;
var chooseParty = require('./chooseParty').chooseParty;

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
  var accepts = '<-- SEARCH VOTE RESULTS FOR ACCEPTS -->';
  var vetoes = '<-- SEARCH VOTE RESULTS FOR VETOES -->';
  // - Current game phase
  var gamePhase = '<-- FROM MEMCACHE -->';
  // - Current party rejections count
  var partyRejections = '<-- FROM MEMCACHE -->';

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
      gameId: 5318008,
      result: 'accepted'
    });

    // TODO: Set rejection count in memcache back to 0

    // TODO: Set timer for startQuest
    setTimeout(function() {
      startQuest(memcache, socket);
    }, 5000000);
  } else /* Party rejected */ {
    // Signal to players (websockets) that the quest has been rejected
    socket.emit('resolveVote', {
      result: 'reject',
      timesRejected: partyRejections + 1
    });

    // TODO: Increase veto count in memcache

    // TODO: Check current rejection count from memcache
    if (partyRejections >= 4) {

      // TODO: Set winners of the game to minions in memcache

      // TODO: Set timer for gameEnd with minion victory
      setTimeout(function() {
        gameEnd(memcache, socket);
      }, 5000000);
    } else /* Veto count < 5 */ {
      // TODO: Set timer for chooseParty
      setTimeout(function() {
        chooseParty(memcache, socket);
      }, 5000000);
    }
  }

};

module.exports.resolvePartyVote = resolvePartyVote;



