const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, ()=>{
  console.log('Listening on port', port);
});
const io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/../client/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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
    for (var x = 0; x < players.length; x++) {
      if (!players[x].ready) {
        startGame = false;
      }
    }
    if (startGame) {
      socket.broadcast.emit('lobbyInfo', {
        gm: players[0],
        players: players.slice(1, players.length)
      });  
      io.emit('startGame');
    } else {
      socket.broadcast.emit('lobbyInfo', {
        gm: players[0],
        players: players.slice(1, players.length)
      });    
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
});
// serve index.html for rest
app.get('*', (req, res)=>{
  res.sendFile(path.resolve(__dirname + '/../client/public/index.html'));
});