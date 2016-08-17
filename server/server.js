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

// Added comment to be able to trigger a push :)

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

var memcache = new redisDb(7);
memcache.clear();

//Utility, move elsewhere
function deepSearch(id, arr) {
  for (var x = 0; x < arr.length; x++) {
    if (arr[x].uid === id) {
      return x;
    }
  }
}

var players = [];
var rooms = {};
io.on('connection', (socket)=>{
  //PLAYER==================================================
  //Init Player
  players.push({
    uid: socket.id.slice(2), 
    color: null,
    ready: false
  });
  //Give player color
  socket.on('userColor', function(color) {
    var p = players[deepSearch(socket.id.slice(2), players)];
    p.color = color;
  });
  //Remove Player
  socket.on('disconnect', function() {
    io.emit('peerLeft', socket.id.slice(2));
    players.splice(deepSearch(socket.id.slice(2), players), 1);
    io.emit('lobbyInfo', {
      gm: players[0],
      players: players.slice(1, players.length)
    });
  });
  //ROOMS==================================================
  socket.on('joinRoom', function(data) {
    if (io.sockets.adapter.rooms[data.room] > 10) {
      socket.emit('joinResponse', false);  
    } else {
      socket.join(data.room);
      socket.emit('joinResponse', true);  
    }
  });
  socket.on('leaveRoom', function(data) {
    socket.leave(data.room);
    //refresh page for everyone else
  });
  //LOBBY==================================================
  socket.on('lobby', function(lobbyId) {
    io.emit('lobbyInfo', {
      gm: players[0],
      players: players.slice(1, players.length)
    });
  });
  socket.on('ready', function(playerReady) {
    players[deepSearch(socket.id.slice(2), players)].ready = playerReady;
    var everyoneReady = true;
    for (var x = 0; x < players.length; x++) {
      if (!players[x].ready) {
        everyoneReady = false;
      }
    }
    socket.broadcast.emit('lobbyInfo', {
      gm: players[0],
      players: players.slice(1, players.length)
    });    

    if (everyoneReady) {
      io.emit('leaveLobby');
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
