// require all files in modules
// require all other node_modules needed
// export main loop function

// recieves a Redis server spun up for it's use
module.export.gameLoop = function(memcache) {
  // keep track of current game stage and if the game is over or not
  var stage = 'roles';
  var gameOver = false;

  // as long as gameOver is false, keep running the loop
  while (!gameOver) {
    // based on stage, run the code to handle that stage
    // stage and gameOver will be passed into functions to be mutated
    // as needed

    // STAGES:
    //   roles, party, vote, quest, identifyMerlin, gameOver

    // Assigning random roles
    if (stage === 'roles') {

    }
    // Assigning random roles
    if (stage === 'party') {

    }
    // Assigning random roles
    if (stage === 'vote') {

    }
    // Assigning random roles
    if (stage === 'quest') {

    }
    // Assigning random roles
    if (stage === 'identifyMerlin') {

    }
    // Assigning random roles
    if (stage === 'gameOver') {

    }

  }
} 
