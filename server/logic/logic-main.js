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

    // Assigning random roles
    if (stage === 'roles') {
      // stage = func(memcache)
    }
    // Choose the party to go on a quest
    if (stage === 'party') {
      // stage = func(memcache)
    }
    // Vote for if the party is viable
    if (stage === 'vote') {
      // stage = func(memcache)
    }
    // Players decide to succeed or fail a quest
    if (stage === 'quest') {
      // stage = func(memcache)
    }
    // Assassin guesses who Merlin is
    if (stage === 'identifyMerlin') {
      // stage = func(memcache)
    }
    // Game Over, handle any closing issues
    if (stage === 'gameOver') {
      // stage = func(memcache)
      gameOver = true;
    }

  }
} 
