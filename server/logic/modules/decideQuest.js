module.exports.decideQuest = function(memcache) {
  // pause game for 1 minute
    // send back countdown?

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
    return 'gameOver';
  } else {
    return 'party';
  }
}