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
var lobbyState = {};
var players = {};
for (var x = 1; x <= 4; x ++) {
  //Initialize redis database
  var id = shortid.generate();
  memcache[id] = new redisDb(x);
  memcache[id].clear();
  memcache[id].initInfo(id);
  
  //Initialize server side save state variables
  players[id] = [];
  lobbyState[id] = {
    status: 'waiting',
    max: 10
  };  
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
  //Join lobby immediately
  socket.join('capri0sun');
  console.log('NUM PEOPLE NOW\n', io.sockets.adapter.rooms);  
  socket.emit('lobbyInfo', lobbyState);

  //PLAYER==================================================
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
      //If room was full show now there is a space available
      if (lobbyState[roomId].status === 'ready') {
        lobbyState[roomId].status = 'waiting';
        memcache[roomId].setStatus('waiting');
        //emit the to room you are leaving
        io.to(roomId).emit('roomInfo', {
          gm: players[roomId][0],
          players: players[roomId].slice(1, players[roomId].length)        
        });
      }
      io.to('capri0sun').emit('lobbyState', lobbyState);
    }
  });

  //LOBBY==================================================
  socket.on('joinRoom', function(newRoomId) {
    //Leave lobby and enter room
    socket.leave('capri0sun');    
    var peopleInRoom = io.sockets.adapter.rooms[newRoomId] || [];
    if (peopleInRoom.length < lobbyState[newRoomId].max) {
      console.log('JOINING THE ROOM');
      //Join the room and add player to list of players of that room
      socket.join(newRoomId);
      console.log('AFTER JOINING \n', io.sockets.adapter.rooms);
      players[newRoomId].push({
        uid: socket.id.slice(2), 
        color: 0xffce00,
        ready: false
      });
      //Tell people in the room you are joining
      io.to(newRoomId).emit('roomInfo', {
        gm: players[newRoomId][0],
        players: players[newRoomId].slice(1, players[newRoomId].length)        
      });

      //Tell people if the room is full after you join
      if (io.sockets.adapter.rooms[newRoomId].length >= lobbyState[newRoomId].max) {
        lobbyState[newRoomId].status = 'ready';
        memcache[newRoomId].setStatus('ready');
        
        //Tell people in lobby the new room status
        io.to('capri0sun').emit('lobbyState', lobbyState);
      }
    } else {    
      //Too many people in the room
      socket.emit('joinResponse'. false);
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
    if (lobbyState[oldRoomId].status === 'ready') {
      lobbyState[oldRoomId].status = 'waiting';
      memcache[oldRoomId].setStatus('waiting');
      //Tell people in lobby the new room status
      io.to('capri0sun').emit('lobbyState', lobbyState);
    }
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
    //Only game master can start the game
    if (socket.id.slice(2) === players[roomId][0].uid) {
      io.to(roomId).emit('allPeers', players[roomId]);
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
