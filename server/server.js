const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/../client/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Socket Listeners
io.on('connection', (socket)=>{
  //Add listeners here
  socket.on('peer', function(pid){
    socket.broadcast.emit('newPeer', pid);
  });
  socket.on('disconnect', function(socket){
    console.log('user disconnected');
  });
});

/*//Our Peer Server
var ExpressPeerServer = require('peer').ExpressPeerServer;
app.use('/myapp', ExpressPeerServer(server, {debug:true}));
*/

// serve index.html for rest
app.get('*', (req, res)=>{
  res.sendFile(path.resolve(__dirname + '/../client/public/index.html'));
});

const port = process.env.PORT || 3000;
server.listen(port, ()=>{
  console.log('Listening on port', port);
});
