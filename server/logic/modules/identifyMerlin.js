var gameOver = require('./gameOver').gameOver;

// Gives minions chance for redemption in game if the Assassin correctly identifies
// which player is Merlin
module.exports.identifyMerlin = function(memcache, socket) {
  console.log('identifying Merlin');
  // Information needed from memcache
  // - Identify of Assassin
  memcache.getAssassin()
  .then(function(assassinId) {


    // TODO: Set current game phase in memcache to 'ID MERLIN'
    memcache.setTurnPhase('ID MERLIN');

    // TODO: Signal to players that the Assassin must make a decision to 
    // identify Merlin
    socket.emit('chooseMerlin', {
      gameId: 5318008,
      assassinId
    });

    // TODO: Set timer for resolveIdMerlin
    setTimeout(function() {
      resolveIdMerlin(memcache, socket);
    }, 5000);
  });
};

var resolveIdMerlin = function(memcache, socket) {
  console.log('checking Merlin\'s identity');
  // TODO: If the current game phase is not 'ID MERLIN', fizzle
  memcache.getTurnPhase()
  .then(function(gamePhase) {
    if (gamePhase !== 'ID MERLIN') {
      return;
    }

    // Information needed from memcache
    // - The identify of merlin
    // - The choice of Assassin for the identify of merlin
    var merlinId, assassinChoice;

    // TODO: If identify of merlin === Assassin's choice, then reverse
    // winner in memcache to the minions
    memcache.getMerlin()
    .then(function(merlin) {
      merlinId = merlin;
    })
    .then(function() {
      memcache.getMguess()
    .then(function(mGuess) {
      assassinChoice = mGuess;
      if (merlinId === assassinChoice) {
        // TODO: Signal to players that Assassins' choice was correct
        socket.emit('resolveMerlin', {
          correctChoice: true
        });

        // TODO: Set memcache winning side to minions
        memcache.setWinner(false);
      } else /* Assassin choice ID !== Merlin ID */ {
        // TODO: Signal to the players that the Assassin's choice was
        // incorrect and reveal the identity of Merlin
        socket.emit('resolveMerlin', {
          correctChoice: false
        });
        memcache.setWinner(true);
      }
    })

    // TODO: Set timer for gameOver
    setTimeout(function() {
      gameOver(memcache, socket);
    }, 5000);
  }); });
};

module.exports.resolveIdMerlin = resolveIdMerlin;