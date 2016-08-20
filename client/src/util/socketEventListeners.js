import game from '../scripts/game';

module.exports = {
  gameInit: function(socket) {
    game.init();
    //Add all the people in the game to canvas
    var conn = {};

    socket.on('allPeers', function(players) {
      for (let p in players) {
        game.addPlayer(players[p].uid, players[p].color);
        //Connect everyone's audio
        conn[players[p].uid] = peer.connect(players[p].uid);

        conn.on('open', function() {
          conn.send('hey newbie');
          conn.on('data', function(data) {
            console.log('(old)Received some greetings:', data);
          });
        });
      }
    });

    // peer.on('connection', function(conn){
    //   conn.on('data', function(data){
    //     console.log('(new)Received some greetings:', data);
    //   });
    //   conn.send('Hey gramps!');
    // });
    socket.on('peerLeft', function(uid) {
      game.removePlayer(uid);
    });
  },
  allListeners: function(socket, roomId) {
    socket.on('assignRoles', function(data) {
      game.assignRoles(data, socket.id, data[socket.id]);
      console.log('I AM', socket.id, ':', data[socket.id]);
    });
    socket.on('chooseParty', function(data) {
      if (data.currentLeader === socket.id) {
        game.pickParty(party => {
          socket.emit('pickParty', {
            partyList: party
          }, roomId);
        // Need party number from data <-------------------------------
        });
        console.log('Data I got from sendParty', data);
      }
    }, roomId);
    socket.on('resolveParty', function(data) {
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
      game.questButtons( voteOnQuest => {

        socket.emit('voteOnQuest', {
          playerId: socket.id,
          vote: voteOnQuest
        }, roomId);
      });
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