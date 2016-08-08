module.exports.decideQuest = function(memcache) {
  if (/* Wins = 3 */) {
    return 'identifyMerlin';
  } else if (/* Loss = 3 */) {
    return 'gameOver';
  } else {
    return 'party';
  }
}