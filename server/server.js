require('dotenv').config();
var redisDb = require('./db/redis');
var express = require('express');
var session = require('express-session');
var http = require('http');
var bodyParser = require('body-parser');
var path = require('path');
var passport = require('passport');
// Import the game logic router to allow calling of game logic functions
// based on received signals
var game = require('./logic/logic-main').gameLogic;
var logicFilter = require('./logic/logic-intervene').gameFilter;

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

var memcache = new redisDb(5138008);

//Utility, move elsewhere
function deepSearch(id, arr) {
  for (var x = 0; x < arr.length; x++) {
    if (arr[x].uid === id) {
      return x;
    }
  }
}

var players = [];
io.on('connection', (socket)=>{
  //Init player
  players.push({
    uid: socket.id, 
    color: null,
    ready: false
  });

  //Socket Listeners
  //Lobby
  socket.on('lobby', function(lobbyId) {
    socket.emit('lobbyInfo', {
      gm: players[0],
      players: players.slice(1, players.length)
    });
    socket.broadcast.emit('lobbyInfo', {
      gm: players[0],
      players: players.slice(1, players.length)
    });
  });
  socket.on('ready', function(playerReady) {
    players[deepSearch(socket.id, players)].ready = playerReady;
    var startGame = true;
    // for (var x = 0; x < players.length; x++) {
    //   if (!players[x].ready) {
    //     startGame = false;
    //   }
    // }

    socket.broadcast.emit('lobbyInfo', {
      gm: players[0],
      players: players.slice(1, players.length)
    });    
    
    if (startGame) {
      io.emit('startGame');
      setTimeout(function(){
        var pidsList = [];
        for (var x = 0; x < players.length; x++) {
          pidsList.push(players[x].uid);
        }
        memcache.init(pidsList);
        game(memcache, io, 'GAME START');
      },5000);
    }
  });
  //Game
  socket.on('userColor', function(color) {
    var p = players[deepSearch(socket.id, players)];
    p.color = color;
    socket.broadcast.emit('newPeer', p);
    socket.emit('allPeers', players);
  });
  socket.on('disconnect', function() {
    io.emit('peerLeft', socket.id);
    players.splice(deepSearch(socket.id, players), 1);
    io.emit('lobbyInfo', {
      gm: players[0],
      players: players.slice(1, players.length)
    });
  });

  socket.on('pickParty', function(data) {
    console.log('pickParty', data);
    logicFilter.pickParty(memcache, io, data);
  });
  socket.on('voteOnParty', function(data) {
    console.log('voteOnParty');
    // TODO: Ensure that votes are not duplicated and came from valid players
    logicFilter.partyVote(memcache, io, data);
  });
  socket.on('voteOnQuest', function(data) {
    console.log('voteOnQuest');
    // TODO: Ensure that votes are not duplicated and came from valid players
    logicFilter.questVote(memcache, io, data);
  });
  socket.on('stabMerlin', function(data) {
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
