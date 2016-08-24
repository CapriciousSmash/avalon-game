var startQuest = require('./decideQuest').startQuest;
var gameEnd = require('./gameOver').gameEnd;
var chooseParty = require('./chooseParty').chooseParty;

// Sets up the players to vote on the party chosen by the party leader. 
module.exports.voteOnParty = function(memcache, socket, chooseParty) {
  console.log('voting on party');
  memcache.setTurnPhase('VOTE');

  memcache.getTeam().then(function(partyMembers) {
    // Signal to players to begin voting. 
    socket.emit('startVote', {
      partyMembers 
    });

    setTimeout(function() {
      resolvePartyVote(memcache, socket, chooseParty);
    }, 30000);
  });

}

var resolvePartyVote = function(memcache, socket, chooseParty) {
  console.log('resolving votes');
  // TODO: If this function was called because timer runs out, then
  // set some default value

  // Check game Phase, if current phase is not 'VOTE' then fizzle
  memcache.getTurnPhase().then(function(gamePhase) {
    console.log('current game phase: ', gamePhase);
    if (gamePhase !== 'VOTE') {
      console.log('game phase not VOTE, fizzling -- ', gamePhase);
      return;
    }
    memcache.getVoteCount().then(function(voteCount) {
      memcache.getVoteOrder().then(function(voteOrder) {

        console.log('vote count ', voteCount);
        console.log('vote order ', voteOrder);
        
        // Getting a voteCount of boolean values and pIDs in vote order, 
        // form an associative list between voter and result
        var voteList = {};

        for (var x = 0; x < voteCount.length; x++) {
          voteList[voteOrder[x]] = voteCount[x];
        }

        // Tally the votes:
        var accepts = voteCount.reduce(function(total, curr) {
          return curr === 'true' ? total + 1 : total;
        }, 0);

        console.log('accepts ', accepts);

        var rejects = voteCount.reduce(function(total, curr) {
          return curr === 'false' ? total + 1 : total;
        }, 0);

        console.log('rejects ', rejects);

        var partyAccepted = accepts > rejects ? true : false;

        if (partyAccepted) {
          // Signals to players that the quest has been accepted and who
          // voted for and against the party
          socket.emit('resolveVote', {
            gameId: 5318008,
            result: 'accepted',
            voteList
          });

          // Reset rejection count in the memcache
          memcache.resetVeto();

          setTimeout(function() {
            startQuest(memcache, socket, chooseParty);
          }, 5000);

        } else /* Party rejected */ {

          memcache.incrVeto().then(function(vetoCount) {
            // Signal to players that the quest has been rejected
            socket.emit('resolveVote', {
              gameId: 5318008,
              result: 'rejected',
              timesRejected: vetoCount
            });

            console.log('party rejected, vetoCount is: ', vetoCount);

            if (vetoCount >= 5) {
              // Set winners to minions in memcache and call the end of the game
              memcache.setWinner('MINIONS');

              console.log('setting timeout in resolveParty for game end');
              setTimeout(function() {
                gameEnd(memcache, socket);
              }, 5000);

            } else {

              console.log('setting timeout for chooseParty in resolveParty');
              setTimeout(function() {
                chooseParty(memcache, socket);
              }, 5000);

            }

          });

        }

        memcache.clearVotes();

      });
    });

  });

};

module.exports.resolvePartyVote = resolvePartyVote;



