require('dotenv').config();
var redisDb = require('./db/redis');
var express = require('express');
var session = require('express-session');
var http = require('http');
var bodyParser = require('body-parser');
var path = require('path');
var passport = require('passport');
var shortid = require('shortid');
// Import the game logic router to allow calling of game logic functions
// based on received signals
var game = require('./logic/logic-main').gameLogic;
var logicFilter = require('./logic/logic-intervene');


var app = express();
var port = process.env.PORT || 3000;
var server = app.listen(port, ()=>{
  console.log('Listening on port', port);
});
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/../client/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ 
  secret: '8SER9M9jXS',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

/////////////////////////////////////////////////////////////////////

var memcache = {};
var lobbyState = [];
var players = {};
for (var x = 1; x <= 4; x ++) {
  //Initialize redis database
  var id = shortid.generate();
  memcache[id] = new redisDb(x);
  memcache[id].clear();
  memcache[id].initInfo(id);
  
  //Initialize server side save state variables
  players[id] = [];
  lobbyState.push({
    id: id,
    status: memcache[id].getStatus,
    max: memcache[id].getCapMax
  });  
}

//Utility, move elsewhere
function deepSearch(id, arr) {
  for (var x = 0; x < arr.length; x++) {
    if (arr[x].uid === id) {
      return x;
    }
  }
}

io.on('connection', (socket)=>{
  //PLAYER==================================================
  //Remove Player
  socket.on('disconnect', function() {
    io.emit('peerLeft', socket.id.slice(2));

    //Have to find the player in the room, find better optimization
    var roomId;
    for (var prop in players) {
      if ( deepSearch(socket.id.slice(2), players[prop])) {
        roomId = prop;
        players[prop].splice(deepSearch(socket.id.slice(2), players[prop]), 1);
      }
    }
    if (roomId) {
      if (lobbyState[roomId].status === 'ready') {
        //emit the to room you are leaving
        lobbyState[roomId].status = 'waiting';
        memcache[roomId].setStatus('waiting');
        io.to(roomId).emit('roomInfo', {
          gm: players[roomId][0],
          players: players[roomId].slice(1, players[roomId].length)        
        });
      }
      io.to('capri0sun').emit('lobbyState', lobbyState);
    }
  });

  //LOBBY==================================================
  socket.emit('lobbyInfo', lobbyState);
  socket.on('joinRoom', function(newRoomId) {
    //Leave lobby and enter room
    socket.leave('capri0sun');    
    if (io.sockets.adapter.rooms[newRoomId] >= lobbyState[newRoomId].max) {
      //Too many people in the room
      socket.emit('joinResponse'. false);
    } else {
      //join the room and add to list of players of that room
      socket.join(newRoomId);
      players[newRoomId].push({
        uid: socket.id.slice(2), 
        color: 0xffce00,
        ready: false
      });
      if (io.sockets.adapter.rooms[newRoomId] >= lobbyState[newRoomId].max) {
        //Max number of people in room, change status
        lobbyState[newRoomId].status = 'ready';
        memcache[newRoomId].setStatus('ready');
        //Tell people in the lobby new lobby state
        io.to('capri0sun').emit('lobbyState', lobbyState);
        //Tell people in the room you are joining
        io.to(newRoomId).emit('roomInfo', {
          gm: players[oldRoomId][0],
          players: players[newRoomId].slice(1, players[newRoomId].length)        
        });
      }
    }
  });
  socket.on('leaveRoom', function(oldRoomId) {
    io.emit('peerLeft', socket.id.slice(2));
    //Leave room and join lobby
    socket.leave(oldRoomId);
    socket.join('capri0sun');
    players[oldRoomId].splice(deepSearch(socket.id.slice(2), players[oldRoomId]), 1);
    if (lobbyState[oldRoomId].status === 'ready') {
      //emit the to room you are leaving
      lobbyState[oldRoomId].status = 'waiting';
      memcache[oldRoomId].setStatus('waiting');
      io.to(oldRoomId).emit('roomInfo', {
        gm: players[oldRoomId][0],
        players: players[oldRoomId].slice(1, players[oldRoomId].length)        
      });
      io.to('capri0sun').emit('lobbyState', lobbyState);
    }
  });
  //ROOM==================================================
  socket.on('ready', function(data) {
    players[data.roomId][deepSearch(socket.id.slice(2), players[data.roomId])].ready = data.state;
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

    if (everyoneReady) {
      io.to(data.roomId).emit('leaveRoomStartGame');
    }
  });
  //GAME INIT=============================================
  socket.on('leaveRoomStartGame', function(roomId) {
    socket.to(roomId).emit('allPeers', players[roomId]);
    //Only game master can start the game
    if (socket.id.slice(2) === players[roomId][0].uid) {
      console.log('STARTING', socket.id.slice(2), players[roomId][0].uid);
      var pidsList = [];
      for (var x = 0; x < players.length; x++) {
        pidsList.push(players[roomId][x].uid);
      }
      memcache[roomId].init(pidsList).then(function() {
        setTimeout(function() {
          game(memcache[roomId], io, 'GAME START');
        }, 5000);
      });
    }
  });

  //IN GAME ACTIONS=======================================

  socket.on('pickParty', function(data) {
    //playerId ---> person being 
    console.log('pickParty', data);
    logicFilter.pickParty(memcache, io, data);
  });
  socket.on('voteOnParty', function(data) {
    //playerId
    //vote ---> boolean
    console.log('voteOnParty', data);
    // TODO: Ensure that votes are not duplicated and came from valid players
    logicFilter.partyVote(memcache, io, data);
  });
  socket.on('voteOnQuest', function(data) {
    //playerId
    //vote ---> boolean
    console.log('voteOnQuest', data);
    // TODO: Ensure that votes are not duplicated and came from valid players
    logicFilter.questVote(memcache, io, data);
  });
  socket.on('stabMerlin', function(data) {
    //merlinId
    console.log('stabMerlin', data);
    logicFilter.stabMerlin(memcache, io, data);
  });
});
// serve index.html for rest
app.get('*', (req, res)=>{
  res.sendFile(path.resolve(__dirname + '/../client/public/index.html'));
});

app.get('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});
