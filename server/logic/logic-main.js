// Import all functions from modules
const assignRoles = require('./modules/assignRoles.js');
const chooseParty = require('./modules/chooseParty.js').chooseParty;
const resolveParty = require('./modules/chooseParty.js').resolveParty;
const voteOnParty = require('./modules/voteOnParty.js').voteOnParty;
const resolvePartyVote = require('./modules/voteOnParty.js').resolvePartyVote;
const startQuest = require('./modules/decideQuest.js').startQuest;
const resolveQuest = require('./modules/decideQuest.js').resolveQuest;
const gameEnd = require('.modules/gameOver.js').gameEnd;
const gameOver = require('./modules/gameOver.js').gameOver;
const identifyMerlin = require('./modules/identifyMerlin.js').identifyMerlin;
const resolveIdMerlin = require('./modules/identifyMerlin.js').resolveIdMerlin;

// Export a router to the functions to the game server main file
// Function expects a type [string] to route to the correct function.
// Socket and memcache are objects for the signaling and redis passed from the server
module.exports.gameLogic = function(memcache, socket, type) {
  if (type === 'GAME START') {
    assignRoles(memcache, socket);
  }
};