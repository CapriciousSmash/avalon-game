var voteOnParty = require('./voteOnParty').voteOnParty;

// The current party leader must choose the requisite number of players to go on a Quest
var chooseParty = function(memcache, socket) {
  console.log('choosing party');
  memcache.setTurnPhase('PARTY');

  // Get current round
  memcache.getRound().then(function(currentRound) {
    memcache.getPids().then(function(pidsList) {
      var numPlayers = pidsList.length;
      // Find previous party leader and change

      // prevLeader should be the ID of the previous leader [string]
      memcache.getLeader()
      .then(function(prevLeader) {
        var oldIdx = pidsList.indexOf(prevLeader);
        var newIdx = pidsList[oldIdx + 1] ? oldIdx + 1 : 0;
        var currentLeader = pidsList[newIdx];

        memcache.setLeader(currentLeader);

        // Doesn't look like there's an apparent pattern to the number of players and round
        // number to the number of party members so will hard code in a matrix for now:
        var teamBuilder = [
          // Each array is for number of players, while each element in the array is the
          // current round:
          // 5 Players:
          [2, 3, 2, 3, 3],
          // 6 Players:
          [2, 3, 4, 3, 4],
          // 7 Players:
          [2, 3, 3, 4, 4],
          // 8 Players:
          [3, 4, 4, 5, 5],
          // 9 Players:
          [3, 4, 4, 5, 5],
          // 10 Players:
          [3, 4, 4, 5, 5]
        ];

        var partySize = teamBuilder[numPlayers - 5] ? teamBuilder[numPlayers - 5][currentRound - 1] : 0;

        console.log('choose Party size: ', partySize);
        console.log('party size is based on numPlayers - 5: ', numPlayers);
        console.log('and party size is based on currentRound - 1: ', currentRound);

        // The current leader should be interpreted by the actual current leader on the
        // client side to know that they should decide the party size based on the limit set
        socket.emit('chooseParty', {
          gameId: 5318008,
          partySize,
          currentLeader,
          currentRound
        });

        setTimeout(function() {
          console.log('resolveParty called by setTimeout from chooseParty');
          resolveParty(memcache, socket);
        }, 30000);

      });
    });
  });

};

var resolveParty = function(memcache, socket) {
  console.log('resolving party choice');
  // Get current phase to decide whether this function should run or fizzle
  console.log('resolveParty chooseParty log: ', typeof chooseParty);
  memcache.getTurnPhase()
  .then(function(gamePhase) {
    if (gamePhase !== 'PARTY' && gamePhase !== null) {
      console.log('game phase is ', gamePhase);
      console.log('gamePhase not PARTY, fizzling');
      return;
    }

    // TODO: If timer runs out and this function was called, there will not
    // be enough party members so there should be a default sent

    // Party members should have been set by a previous socket. 
    memcache.getTeam()
    .then(function(partyMembers) {
      socket.emit('resolveParty', {
        gameId: 5318008,
        partyMembers,
      });

      setTimeout(function() {
        console.log('voteOnParty called by setTimeout from resolveParty');
        voteOnParty(memcache, socket, chooseParty);
      }, 5000);

    });
  });

};

module.exports.chooseParty = chooseParty;
module.exports.resolveParty = resolveParty;
