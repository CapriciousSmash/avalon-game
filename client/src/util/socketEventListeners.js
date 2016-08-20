import game from '../scripts/game';

module.exports = {
/*Disabled because everyone starts with same color aside from user
  userInit: function(socket) {
    function randomHexColor() {
      var hred = (Math.floor(Math.random() * 180) + 20).toString(16);
      var hgreen = (Math.floor(Math.random() * 180) + 20).toString(16);
      var hblue = (Math.floor(Math.random() * 180) + 20).toString(16);

      return Number('0x' + (hred + hgreen + hblue).toUpperCase());
    }

    //Give user a color
    var userColor = randomHexColor();
    socket.emit('userColor', userColor);
  },*/
  gameInit: function(socket) {
    game.init();
    //Add all the people in the game to canvas
    socket.on('allPeers', function(players) {
      console.log("Got em players!", players);
      for (let p in players) {
        game.addPlayer(players[p].uid, players[p].color);
      }
    });

    //Add in new peer to the game
    socket.on('newPeer', function(player) {
      // Later connect new peer's audio
      // var conn = peer.connect(uid);

      // conn.on('open', function(){
      //   conn.send('hey newbie');
      //   conn.on('data', function(data){
      //     console.log('(old)Received some greetings:', data);
      //   });
      // });

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
      console.log('assignROLES socket id', socket.id);
      game.assignRoles(data, socket.id, data[socket.id]);
      console.log('Data I got from assignRoles', data);
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