var gameEnd = require('./gameOver').gameEnd;
var chooseParty = require('./chooseParty').chooseParty;

module.exports.startQuest = function(memcache, socket, chooseParty) {
  console.log('starting quest');
  // Information needed from memcache
  // - Current party composition
  memcache.setTurnPhase('QUEST');

  var partyMembers;
  memcache.getTeam().then(function(party) {
    partyMembers = party;
    console.log('starting quest with party: ', party);
    // TODO: Set current game phase in memcache to 'QUEST'

    // TODO: Signal to players that the quest has started and the party members
    // must vote on the result. The signal should also target the quest party
    // and allow them to make a vote. 
    socket.emit('startQuest', {
      gameId: 5138008,
      partyMembers
    });

    // TODO: Start timer for resolveQuest
    setTimeout(function() {
      console.log('call resolveQuest by setTimeout from startQuest');
      resolveQuest(memcache, socket, chooseParty);
    }, 30000);
  });
};

var resolveQuest = function(memcache, socket, chooseParty) {
  console.log('resolving quest');
  var gamePhase;
  memcache.getTurnPhase().then(function(phase) {
    gamePhase = phase;
    console.log('gamePhase is ', gamePhase);
    // If the current game phase isn't 'QUEST', fizzle
    if (gamePhase !== 'QUEST' && gamePhase !== null) {
      console.log('gamePhase not QUEST, fizzling');
      return;
    }

    memcache.incrRound();

    // Information needed from memcache
    // - Current party composition
    var partyMembers;
    // - Total number of players
    var totalPlayers;
    // - Results from previous quests (successes and failures
    var numSuccess;
    var numFailures;
    var currentQuest = numSuccess + numFailures + 1;
    // - Current quest voting results 
    var playerVotes;

    // TODO: Determine quest success or failure based on voting results
    var successVotes = 0;
    var failureVotes = 0;
    var requiredVotesToFail;
    var questSucceeded;

    memcache.getTeam()
    .then(function(team) {
      partyMembers = team.slice();
    })
    .then(function() {
      memcache.getPids()
    .then(function(pids) {
      totalPlayers = pids.length;
    })
    .then(function() {
      memcache.getWin()
    .then(function(wins) {
      numSuccess = wins;
    })
    .then(function() {
      memcache.getLoss()
    .then(function(loss) {
      numFailures = loss;
    })
    .then(function() {
      memcache.getQuestResult()
    .then(function(results) {
      playerVotes = results.slice();
      console.log('Player votes in resolve quest: ', playerVotes);
      for (var i = 0; i < playerVotes.length; i++) {
        if (playerVotes[i] === 'true') {
          successVotes++;
        } else {
          failureVotes++;
        }
      }
      console.log('Quest results locked in.');
      console.log('Quest success votes: ', successVotes);
      console.log('Quest failure votes: ', failureVotes);
      requiredVotesToFail = currentQuest === 4 && totalPlayers >= 7 ? 2 : 1;
      questSucceeded = failureVotes < requiredVotesToFail ? true : false;
      memcache.clearTeam();
      memcache.clearQuestResults();
      if (questSucceeded) {
        // TODO: Inform (signal websocket) players that the quest succeeded
        console.log('Quest succeeded');
        socket.emit('resolveQuest', {
          gameId: 5318008,
          result: 'success',
          numSuccess: numSuccess + 1,
          numFailures,
          successVotes,
          failureVotes
        });
        if (++numSuccess >= 3) {
          // TODO: Set winners to knights in the memcache
          memcache.setWinner(true);
          //  Set timer for gameEnd
          setTimeout(function() {
            console.log('calling gameEnd by setTimeout from resolveQuest');
            gameEnd(memcache, socket);
          }, 5000);

        } else /* Less than 3 quests succeeded */ {
          // TODO: Increase the total number of successes in memcache
          memcache.incrWin();
          // TODO: Set timer for chooseParty
          setTimeout(function() {
            console.log('calling chooseParty by estTimeout from resolveQuest');
            chooseParty(memcache,socket);
          }, 5000);
        }
      } else /* Quest failed */ {
        // TODO: Inform (signal) players that the quest has failed
        console.log('Quest has failed.');
        socket.emit('resolveQuest', {
          gameId: 5318008,
          result: 'failure',
          numSuccess,
          numFailures: numFailures + 1,
          successVotes,
          failureVotes
        });
        if (++numFailures >= 3) {
          // TODO: Set winners to minions in the memcache
          memcache.setWinner(false);
          // TODO: Set timer for gameEnd with minion victory
          setTimeout(function() {
            console.log('calling gameEnd by setTimeout from resolveQuest');
            gameEnd(memcache, socket);
          }, 5000);
        } else /* Less than 3 quests have failed */ {
          // TODO: Increase total number of failures in memcache
          memcache.incrLoss();
          // TODO: Set timer for chooseParty
          setTimeout(function() {
            console.log('calling chooseParty by estTimeout from resolveQuest');
            chooseParty(memcache, socket);
          }, 5000);
        }
      }
    }) }); }); }); }); 
  });
};

module.exports.resolveQuest = resolveQuest;
