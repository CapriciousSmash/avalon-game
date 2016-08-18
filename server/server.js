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
for (let x = 1; x <= 4; x ++) {
  //Initialize redis database
  let id = shortid.generate();
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
  //players.push({ uid: socket.id.slice(2), color: null, ready: false});

  /*Disabled because everyone starts with same color aside from user
  //Give player color
  socket.on('userColor', function(color) {
    var p = players[deepSearch(socket.id.slice(2), players)];
    p.color = color;
  });*/

  //Remove Player
  socket.on('disconnect', function() {
    io.emit('peerLeft', socket.id.slice(2));
    //players[0].splice(deepSearch(socket.id.slice(2), players[0]), 1);
    //io.emit('lobbyInfo', {
    //  gm: players[0][0],
    //  players: players[0].slice(1, players[0].length)
    //});
  });

  //TODO!!!: Make sure everyone connects to a set lobby roomnumber
  //LOBBY NUMBER : capri0sun
  //Create function for people leaving/joining room

  //LOBBY==================================================
  socket.emit('lobbyInfo', lobbyState);
  socket.on('joinRoom', function(roomId) {
    if (io.sockets.adapter.rooms[roomId] >= lobbyState[roomId].max) {
      socket.emit('joinResponse', false);  
    } else {
      socket.join(roomId);
      players[roomId].push({
        uid: socket.id.slice(2), 
        color: 0xffce00,
        ready: false
      });
      if (io.sockets.adapter.rooms[roomId] >= lobbyState[roomId].max) {
        lobbyState[roomId].status = 'ready';
        memcache[roomId].setStatus('ready');
        io.emit('lobbyInfo', lobbyState);
        //refresh page for everyone else
      }
    }
  });
  socket.on('leaveRoom', function(data) {
    io.emit('peerLeft', socket.id.slice(2));
    players[data.roomId].splice(deepSearch(socket.id.slice(2), players[data.roomId]), 1);    
    socket.broadcast.to(data.roomId).emit('roomInfo', {
      gm: players[data.roomId][0],
      players: players[data.roomId].slice(1, playersForRoom.length)
    });  
    socket.leave(data.room);
    if (lobbyState[roomId].status === 'ready') {
      lobbyState[roomId].status = 'waiting';
      memcache[roomId].setStatus('waiting');
      io.emit('lobbyInfo', lobbyState);
    }  
  //ROOM==================================================
  });
  socket.on('inRoom', function(roomId) {
    io.to(roomId).emit('roomInfo', {
      gm: players[roomId][0],
      players: players[roomId].slice(1, players[roomId].length)
    });
  });
  socket.on('ready', function(data) {
    players[data.roomId][deepSearch(socket.id.slice(2), players[data.roomId])].ready = data.state;
    var everyoneReady = true;
    let playersForRoom = players[data.roomId];
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
  socket.on('startGame', function() {
    socket.emit('allPeers', players);
    //Only game master can start the game
    if (socket.id.slice(2) === players[0].uid) {
      console.log('STARTING', socket.id.slice(2), players[0].uid);
      var pidsList = [];
      for (var x = 0; x < players.length; x++) {
        pidsList.push(players[x].uid);
      }
      memcache.init(pidsList).then(function() {
        setTimeout(function() {
          game(memcache, io, 'GAME START');
        }, 5000);
      });
    }
  });

  //IN GAME ACTIONS========================================

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
