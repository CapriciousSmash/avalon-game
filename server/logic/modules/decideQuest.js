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
  // Information needed from memcache
  // - Current party composition
  // - Results from previous quests (successes and failures)
  // - Current quest voting results 

  // TODO: If the current game phase isn't 'QUEST', fizzle

  // TODO: Determine quest success or failure based on voting results

  // if (/* Quest succeeded */) {
  //   // TODO: Inform (signal websocket) players that the quest succeeded
  //   if (/* 3 quests have succeeded */) {
  //     // TODO: Set timer for gameEnd
  //   } else /* Less than 3 quests succeeded */ {
  //     // TODO: Set timer for chooseParty
  //   }
  // } else /* Quest failed */ {
  //   // TODO: Inform (signal) players that the quest has failed
  //   if (/* 3 Quests have failed */) {
  //     // TODO: Set timer for gameEnd with minion victory
  //   } else /* Less than 3 quests have failed */ {
  //     // TODO: Set timer for chooseParty
  //   }
  // }
};

module.exports.resolveQuest = resolveQuest;


