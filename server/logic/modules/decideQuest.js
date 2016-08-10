module.exports.startQuest = function(memcache, socket) {
  // Information needed from memcache
  // - Current party composition

  // TODO: Signal to players that the quest has started and the party members
  // must vote on the result. The signal should also target the quest party
  // and allow them to make a vote. 

  // TODO: Start timer for resolveQuest


  // Needs a couple of pauses in the middle as results are revealed and before heading off to next sections
  // pause game for 1 minute

    // Send back count down?  Concurrent setInterval that we cancel in setTimeout

  // check to see if quest succeeded for failed
  if (/* round === 4 && party size >= 7 */) {
    if (/* failures >= 2 */) {
      // increase losses
    } else {
      // increase wins
    }
  } else {
    if (/* failures >= 1 */) {
      // increase losses
    } else {
      // increase wins
    }
  }

  // send successes and failures so players can see the specific results

  // pause for 15 seconds for gestation

  if (/* Wins = 3 */) {
    return 'identifyMerlin';
  } else if (/* Loss = 3 */) {
    // set winner to false(minions)
    return 'gameOver';
  } else {
    return 'party';
  }
};

module.exports.resolveQuest = function(memcache, socket) {
  // Information needed from memcache
  // - Current party composition
  // - Results from previous quests (successes and failures)
  // - Current quest voting results 

  // TODO: Determine quest success or failure based on voting results

  if (/* Quest succeeded */) {
    // TODO: Inform (signal websocket) players that the quest succeeded
    if (/* 3 quests have succeeded */) {
      // TODO: Set timer for gameEnd
    } else /* Less than 3 quests succeeded */ {
      // TODO: Set timer for chooseParty
    }
  } else /* Quest failed */ {
    // TODO: Inform (signal) players that the quest has failed
    if (/* 3 Quests have failed */) {
      // TODO: Set timer for gameEnd with minion victory
    } else /* Less than 3 quests have failed */ {
      // TODO: Set timer for chooseParty
    }
  }
};




