// require all files in modules
var assignRoles = require('./modules/assignRoles.js');
var chooseParty = require('./modules/chooseParty.js');
var voteOnParty = require('./modules/voteOnParty.js');
var decideQuest = require('./modules/decideQuest.js');
var identifyMerlin = require('./modules/identifyMerlin.js');
var gameOver = require('./modules/gameOver.js');

// require all other node_modules needed
// export main loop function

// recieves a Redis server spun up for it's use
module.exports.gameLoop = function(memcache) {
  // keep track of current game stage and if the game is over or not
  var stage = 'roles';
  var isGameOver = false;

  // as long as gameOver is false, keep running the loop
  while (!isGameOver) {
    // based on stage, run the code to handle that stage
    // stage and gameOver will be passed into functions to be mutated
    // as needed

    // Assigning random roles
    if (stage === 'roles') {
      stage = assignRoles(memcache);
    }
    // Choose the party to go on a quest
    if (stage === 'party') {
      stage = chooseParty(memcache);
    }
    // Vote for if the party is viable
    if (stage === 'vote') {
      stage = voteOnParty(memcache);
    }
    // Players decide to succeed or fail a quest
    if (stage === 'quest') {
      stage = decideQuest(memcache);
    }
    // Assassin guesses who Merlin is
    if (stage === 'identifyMerlin') {
      stage = identifyMerlin(memcache);
    }
    // Game Over, handle any closing issues
    if (stage === 'gameOver') {
      stage = gameOver(memcache);
      isGameOver = true;
    }

  }
} 
