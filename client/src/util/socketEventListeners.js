import game from '../scripts/game';

module.exports = {
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
  },
  gameInit: function(socket) {
    game.init();
      
    //Add all the people in the game to canvas
    socket.on('allPeers', function(players) {
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
  allListeners: function(socket) {
    socket.on('assignRoles', function(data) {
      //game.assignRoles(data, socket.id.slice(2), data[socket.id.slice(2)]);
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
          playerId: socket.id.slice(2),
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
          playerId: socket.id.slice(2),
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