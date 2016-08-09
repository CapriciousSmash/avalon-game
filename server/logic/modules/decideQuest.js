module.exports.decideQuest = function(memcache) {
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
}