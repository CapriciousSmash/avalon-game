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

//Socket Listeners
io.on('connection', (socket)=>{
  //Add listeners here
  var players = [];
  socket.on('peer', function(pid){
    socket.emit('oldPeers', players);
    socket.broadcast.emit('newPeer', pid);
    players.push(pid);
  });
  socket.on('disconnect', function(socket){
    console.log('user disconnected');
  });
});

// serve index.html for rest
app.get('*', (req, res)=>{
  res.sendFile(path.resolve(__dirname + '/../client/public/index.html'));
});