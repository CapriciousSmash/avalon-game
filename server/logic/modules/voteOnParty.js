module.exports.voteOnParty = function(memcache) {

  // pause game for 1 minute
    // Send back countdown?

  // check votes to see if party is rejected
  if(/* Party is rejected accepts < rejects*/) {
    if (/* Veto count is already 5 */) {
      // set minions to winners
      return 'gameOver';
    } else {
      // increase veto count
      // assign next party leader
      // empty party selection
      return 'party';
    }
  } else {
    // set veto count to 5
    return 'quest';
  }
}