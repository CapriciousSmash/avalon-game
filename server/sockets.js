var sockets = require('socket.io');
var deepSearch = require('./utility/deepSearch.js');
var memcache = require('./utility/makeServers.js').memcache;
var lobbyState = require('./utility/makeServers.js').lobbyState;
var players = require('./utility/makeServers.js').players;
var game = require('./logic/logic-main').gameLogic;


module.exports = function(server) {
  var io = sockets.listen(server);

  var setting = {
    merlin: false,
    assassin: false,
  };

  io.on('connection', function(socket) {
    //Join lobby immediately
    socket.join('capri0sun');
    //console.log('NUM PEOPLE NOW\n', io.sockets.adapter.rooms);  
    socket.emit('lobbyInfo', lobbyState, players);

    //PLAYER==================================================
    socket.on('userInfo', function(uid, username) {
      for (var prop in players) {
        if ( deepSearch(socket.id.slice(2), players[prop])) {
          players[prop].splice(deepSearch(socket.id.slice(2), players[prop]), 1);
        }
      }
    });

    socket.on('disconnect', function() {
      io.emit('peerLeft', socket.id.slice(2));

      //Have to find the player in the room, find better optimization
      var roomId;
      for (var prop in players) {
        if ( deepSearch(socket.id.slice(2), players[prop]) > -1 ) {
          roomId = prop;
          players[prop].splice(deepSearch(socket.id.slice(2), players[prop]), 1);
        }
      }

      if (roomId) {
        //If room was full show now there is a space available
        if (lobbyState[roomId].status === 'Ready') {
          lobbyState[roomId].status = 'Waiting...';
          memcache[roomId].setStatus('Waiting..');
          //emit the to room you are leaving
          io.to(roomId).emit('roomInfo', {
            gm: players[roomId][0],
            players: players[roomId].slice(1, players[roomId].length)        
          });
        }
        io.to('capri0sun').emit('lobbyStatus', lobbyState, players);
      }
    });

    socket.on('sendCheckBox', function(value) {
      if (setting[value]) {
        setting[value] = false;
      } else {
        setting[value] = true;
      }
      socket.broadcast.emit('updateCharacter', value, setting[value]);
    });

    socket.on('capacity', function(roomId, value) {
      memcache[roomId].setCapMax(value);
      lobbyState[roomId].max = value;
      /*              Come back to me                     */
      io.to('capri0sun').emit('lobbyStatus', lobbyState, players);
      io.emit('updateParty', value);
    });

    socket.on('updateOnCharacter', function(value) {
      io.emit('updateCharacter', value, setting[value]);
    });

    socket.on('updateOnParty', function(roomId, value) {
      console.log('roomId', roomId);
      memcache[roomId].getCapMax().then(function(data) {
        data = data || 5;
        io.emit('updateParty', data);
      });
    });

    //LOBBY==================================================
    socket.on('joinRoom', function(newRoomId, uid, username) {
      //Leave lobby and enter room
      socket.leave('capri0sun');    
      var peopleInRoom = io.sockets.adapter.rooms[newRoomId] || [];
      if (peopleInRoom.length < lobbyState[newRoomId].max) {
        //Join the room and add player to list of players of that room
        socket.join(newRoomId);
        players[newRoomId].push({
          uid: socket.id.slice(2), 
          color: 0xffce00,
          ready: false,
          userID: uid,
          username: username
        });
        
        //Tell people if the room is full after you join
        if (io.sockets.adapter.rooms[newRoomId].length >= lobbyState[newRoomId].max) {
          lobbyState[newRoomId].status = 'Ready';
          memcache[newRoomId].setStatus('Ready');
        }

        //Tell people in the room you are joining
        io.to(newRoomId).emit('roomInfo', {
          gm: players[newRoomId][0],
          players: players[newRoomId].slice(1, players[newRoomId].length)        
        });

        //Tell people in lobby the new room status
        io.to('capri0sun').emit('lobbyStatus', lobbyState, players);
      } else {    
        //Too many people in the room
        socket.emit('joinResponse', false);
      }
    });

    socket.on('leaveRoom', function(oldRoomId) {
      io.emit('peerLeft', socket.id.slice(2));

      //Leave room and join lobby
      socket.leave(oldRoomId);
      socket.join('capri0sun');
      players[oldRoomId].splice(deepSearch(socket.id.slice(2), players[oldRoomId]), 1);

      //Emit the to room you are leaving
      io.to(oldRoomId).emit('roomInfo', {
        gm: players[oldRoomId][0],
        players: players[oldRoomId].slice(1, players[oldRoomId].length)        
      });

      //If room was full show now there is a space available    
      if (lobbyState[oldRoomId].status === 'Ready') {
        lobbyState[oldRoomId].status = 'Waiting...';
        memcache[oldRoomId].setStatus('Waiting...');
      }
      //Tell people in lobby the new room status
      io.to('capri0sun').emit('lobbyStatus', lobbyState, players);
    });
    //ROOM==================================================
    socket.on('ready', function(data) {
      //Change the player's ready state
      players[data.roomId][deepSearch(socket.id.slice(2), players[data.roomId])].ready = data.state;

      //Check to see if everyone is ready
      var everyoneReady = true;
      var playersForRoom = players[data.roomId];
      for (var x = 0, max = playersForRoom.length; x < max; x++) {
        if (!playersForRoom[x].ready) {
          everyoneReady = false;
        }
      }
      socket.broadcast.to(data.roomId).emit('roomInfo', {
        gm: playersForRoom[0],
        players: playersForRoom.slice(1, playersForRoom.length)
      });    

      //Start the game if everyone is ready
      if (everyoneReady) {
        io.to(data.roomId).emit('leaveRoomGoToGamePage');
      }
    });
    //GAME INIT=============================================
    socket.on('startGame', function(roomId, person) {
      console.log('STARTING THE GAME', roomId, '-', person);
      //Tell Lobby game is starting
      lobbyState[roomId].status = 'Playing';
      io.to('capri0sun').emit('lobbyStatus', lobbyState, players);
      //Only game master can start the game
      if (socket.id.slice(2) === players[roomId][0].uid) {
        io.to(roomId).emit('allPeers', players[roomId]);
        var pidsList = [];
        for (var x = 0; x < players[roomId].length; x++) {
          pidsList.push(players[roomId][x].userID);
        }
        console.log('pids list is ', pidsList);
        memcache[roomId].init(pidsList, roomId).then(function() {
          setTimeout(function() {
            game(memcache[roomId], io.to(roomId), 'GAME START');
          }, 5000);
        });
      }
    });

    //IN GAME ACTIONS=======================================

    socket.on('pickParty', function(data, roomId) {
      //playerId ---> person being 
      console.log('pickParty', data);
      logicFilter.pickParty(memcache[roomId], io, data);
    });
    socket.on('voteOnParty', function(data, roomId) {
      //playerId
      //vote ---> boolean
      console.log('voteOnParty', data);
      // TODO: Ensure that votes are not duplicated and came from valid players
      logicFilter.partyVote(memcache[roomId], io, data);
    });
    socket.on('voteOnQuest', function(data, roomId) {
      //playerId
      //vote ---> boolean
      console.log('voteOnQuest', data);
      // TODO: Ensure that votes are not duplicated and came from valid players
      logicFilter.questVote(memcache[roomId], io, data);
    });
    socket.on('stabMerlin', function(data, roomId) {
      //merlinId
      console.log('stabMerlin', data);
      logicFilter.stabMerlin(memcache[roomId], io, data);
    });
  });
}
