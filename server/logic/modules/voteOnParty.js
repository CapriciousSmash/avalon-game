module.exports.voteOnParty = function(memcache) {
  if(/* Party is rejected */) {
    if (/* Veto count exceeds 5 */) {
      return 'gameOver';
    } else {
      return 'party';
    }
  } else {
    return 'quest';
  }
}