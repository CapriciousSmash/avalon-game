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

//var players = [];
var players = {};
io.on('connection', (socket)=>{
  //Init player
  players[socket.id] = {
    uid: socket.id, 
    color: null
  };

  //Listeners
  socket.on('userColor', function(color){
    players[socket.id].color = color;
    socket.broadcast.emit('newPeer', players[socket.id]);
    socket.emit('allPeers', players);
  });
  socket.on('disconnect', function(){
    io.emit('peerLeft', socket.id);
    delete(players[socket.id]);
  });
});

// serve index.html for rest
app.get('*', (req, res)=>{
  res.sendFile(path.resolve(__dirname + '/../client/public/index.html'));
});