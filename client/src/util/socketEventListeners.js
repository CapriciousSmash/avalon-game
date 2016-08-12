import game from '../scripts/game';

var partyLeaderPickParty = (socket) => {
  socket.emit('pickParty', ['player1', 'player2', 'player3']);
};
var voteOnParty = (socket) => {       
  socket.emit('voteOnParty', true);
};
var voteOnQuest = (socket) => {
  socket.emit('voteOnQuest', true);
};

module.exports = {
  AllListeners: function(socket) {
    socket.on('assignRoles', function(data) {
      // var $yesButton = $('<button id="yes"></button>').text('YES!').attr('onclick', party);
      // var $noButton = $('<button id="yes"></button>').text('NO!').attr('onclick', party);
      // $('#gameContainer').append($yesButton, $noButton);
      console.log('Data I got from assignRoles', data);
    });
    socket.on('sendParty', function(data) {
      console.log('Data I got from sendParty', data);
    });
    socket.on('resolveParty', function(data) {
      console.log('Data I got from resolveParty', data);
    });
    socket.on('startVote', function(data) {
      console.log('Data I got from startVote', data);
    });
    socket.on('resolveVote', function(data) {
      console.log('Data I got from resolveVote', data);
    });
    socket.on('startQuest', function(data) {
      console.log('Data I got from startQuest', data);
    });
    socket.on('resolveQuest', function(data) {
      console.log('Data I got from resolveQuest', data);
    });
    socket.on('gameEnd', function(data) {
      game.stabMerlin((player) => {
        socket.emit('stabMerlin', player);
      });
      console.log('Data I got from gameEnd', data);
    });
    socket.on('resolveMerlin', function(data) {
      console.log('Data I got from resolveMerlin', data);
    });
  }
}