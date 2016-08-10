var gameEnd = require('./gameOver').gameEnd;
var chooseParty = require('./chooseParty').chooseParty;

module.exports.startQuest = function(memcache, socket) {
  // Information needed from memcache
  // - Current party composition
  var partyMembers = ['<-- FROM MEMCACHE -->'];

  // TODO: Set current game phase in memcache to 'QUEST'

  // TODO: Signal to players that the quest has started and the party members
  // must vote on the result. The signal should also target the quest party
  // and allow them to make a vote. 
  socket.emit('startQuest', {
    gameId: 5138008,
    partyMembers
  });

  // TODO: Start timer for resolveQuest
  setTimeout(function() {
    resolveQuest(memcache, socket);
  }, 5000000);
};

var resolveQuest = function(memcache, socket) {
  var gamePhase = '<-- FROM MEMCACHE -->';
  // If the current game phase isn't 'QUEST', fizzle
  if (gamePhase !== 'QUEST') {
    return;
  }

  // Information needed from memcache
  // - Current party composition
  var partyMembers = ['<-- FROM MEMCACHE -->'];
  // - Total number of players
  var totalPlayers = '<-- FROM MEMCACHE -->';
  // - Results from previous quests (successes and failures
  var numSuccess = '<-- FROM MEMCACHE -->';
  var numFailures = '<-- FROM MEMCACHE -->';
  var currentQuest = numSuccess + numFailures + 1;
  // - Current quest voting results 
  var playerVotes = ['<-- FROM MEMCACHE -->'];

  // TODO: Determine quest success or failure based on voting results
  var successVotes = '<-- SEARCH FROM PLAYERVOTES -->';
  var failureVotes = '<-- SEARCH FROM PLAYERVOTES -->';

  var requiredVotesToFail = currentQuest === 4 && totalPlayers >= 7 ? 2 : 1;
  var questSucceeded = failureVotes < requiredVotesToFail ? true : false;

  if (questSucceeded) {
    // TODO: Inform (signal websocket) players that the quest succeeded
    socket.emit('resolveQuest', {
      result: 'success',
      numSuccess: numSuccess + 1,
      numFailures,
      successVotes,
      failureVotes
    });
    if (++numSuccess >= 3) {
      // TODO: Set winners to knights in the memcache

      //  Set timer for gameEnd
      setTimeout(function() {
        gameEnd(memcache, socket);
      }, 5000000);

    } else /* Less than 3 quests succeeded */ {
      // TODO: Increase the total number of successes in memcache

      // TODO: Set timer for chooseParty
      setTimeout(function() {
        chooseParty(memcache,socket);
      }, 5000000);
    }
  } else /* Quest failed */ {
    // TODO: Inform (signal) players that the quest has failed
    socket.emit('resolveQuest', {
      result: 'failure',
      numSuccess,
      numFailures: numFailures + 1,
      successVotes,
      failureVotes
    });
    if (++numFailures >= 3) {
      // TODO: Set winners to minions in the memcache

      // TODO: Set timer for gameEnd with minion victory
      setTimeout(function() {
        gameEnd(memcache, socket);
      }, 5000000);
    } else /* Less than 3 quests have failed */ {
      // TODO: Increase total number of failures in memcache

      // TODO: Set timer for chooseParty
      setTimeout(function() {
        chooseParty(memcache, socket);
      }, 5000000);
    }
  }
};

module.exports.resolveQuest = resolveQuest;


