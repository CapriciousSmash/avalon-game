import game from '../scripts/game';

module.exports = {
  gameInit: function(socket) {
    game.init();
    //Show user
    $('#gameUserInfoContainer .userName').text( socket.id );

    //Add all the people in the game to canvas
    socket.on('allPeers', function(players) {
      game.addAllPlayers(players, socket.id);
    });

    socket.on('peerLeft', function(uid) {
      game.removePlayer(uid);
    });
  },
  allListeners: function(socket, roomId) {
    socket.on('assignRoles', function(data) {
      game.assignRoles(data, socket.id, data[socket.id]);
      console.log('I AM', socket.id, ':', data[socket.id]);
      //Append div on top of canvas to show user's role
      //Did this to reduce amount of objects in canvas that is needed to be rendered
      $('#gameUserInfoContainer .role').text( data[socket.id] );
    });
    socket.on('chooseParty', function(data) {
      if (data.currentLeader === socket.id) {
        game.pickParty(party => {
          console.log('preparing to pick the party');
          socket.emit('pickParty', {
            partyList: party
          }, roomId);
        // Need party number from data <-------------------------------
        }, data.partySize, socket.id);
        console.log('Data I got from sendParty', data);
      }
    }, roomId, socket.id);
    socket.on('resolveParty', function(data) {
      game.removeObject(socket.id);
      console.log('Data I got from resolveParty', data);
    });
    socket.on('startVote', function(data) {
      game.partyButtons(voteOnParty => {
        socket.emit('voteOnParty', {
          playerId: socket.id,
          vote: voteOnParty
        }, roomId);
      });
      console.log('Data I got from startVote', data);
    });
    socket.on('resolveVote', function(data) {
      console.log('Data I got from resolveVote', data);
    });
    socket.on('startQuest', function(data) {
      if (data.partyMembers.includes(socket.id)) {
        game.questButtons(voteOnQuest => {
          socket.emit('voteOnQuest', {
            playerId: socket.id,
            vote: voteOnQuest
          }, roomId);
        });
      }
      console.log('Data I got from startQuest', data);
    });
    socket.on('resolveQuest', function(data) {
      console.log('Data I got from resolveQuest', data);
    });
    socket.on('gameEnd', function(data) {
      console.log('Data I got from gameEnd', data);
    });
    socket.on('chooseMerlin', function(data) {
      game.stabMerlin(player => {
        socket.emit('stabMerlin', 
          {
            merlindId: player[0],
            playerId: socket.id
          }, roomId);
      });
    });
    socket.on('resolveMerlin', function(data) {
      console.log('Data I got from resolveMerlin', data);
    });
  }
};