import game from '../scripts/game';

module.exports = {
  allListeners: function(socket) {
    socket.on('assignRoles', function(data) {
      // var $yesButton = $('<button id="yes"></button>').text('YES!').attr('onclick', party);
      // var $noButton = $('<button id="yes"></button>').text('NO!').attr('onclick', party);
      // $('#gameContainer').append($yesButton, $noButton);
      game.pickParty(party => {
        socket.emit('pickParty', {
          playerId: party
        });
      // Need party number from data <-------------------------------
      }, 2);
      console.log('Data I got from assignRoles', data);
    });
    socket.on('chooseParty', function(data) {
      console.log('Data I got from sendParty', data);
    });
    socket.on('resolveParty', function(data) {
      console.log('Data I got from resolveParty', data);
    });
    socket.on('startVote', function(data) {
      game.createVoteButtons(voteOnParty => {
        socket.emit('voteOnParty', {
          playerId: socket.id,
          vote: voteOnParty
        });
      });
      console.log('Data I got from startVote', data);
    });
    socket.on('resolveVote', function(data) {
      console.log('Data I got from resolveVote', data);
    });
    socket.on('startQuest', function(data) {
      game.createQuestButtons( voteOnQuest => {
        socket.emit('voteOnQuest', {
          playerId: socket.id,
          vote: voteOnQuest
        });
      });
      console.log('Data I got from startQuest', data);
    });
    socket.on('resolveQuest', function(data) {
      console.log('Data I got from resolveQuest', data);
    });
    socket.on('gameEnd', function(data) {
      game.stabMerlin(player => {
        socket.emit('stabMerlin', 
          {
            merlindId: player
          });
      });
      console.log('Data I got from gameEnd', data);
    });
    socket.on('resolveMerlin', function(data) {
      console.log('Data I got from resolveMerlin', data);
    });
  },
  startGame: function(socket) {
    socket.emit('startGame');
  }
}