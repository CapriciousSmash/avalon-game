var gameLogic = require('./logic-main');

// filterParty is called to advance the game to the next stage if the 
// party leader makes a choice on the party before the timer runs out
var filterParty = function(memcache, socket) {
  var partyCount = '<-- FROM MEMCACHE -->';

  
};

// The purpose of the filter function is to check on specific signals from
// player clients to fire off the next step in the game logic early.
module.exports.gameFilter = function(memcache, socket, type) {
  


};