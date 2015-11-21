
/*

This file contains the server code for the game.

*/

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


var numPlayers = 0;

io.on('connection', function(socket){
  console.log('a user connected ' + socket.id);

  socket.playerName = '';
  socket.playerReady = false;
  numPlayers++;

  socket.emit('welcome', socket.id);

  socket.on('myNameIs', function(msg){
  	socket.playerName = msg;
  });

  socket.on('dcAll', function(msg){
    for (var id in io.sockets.connected) {
      if (io.sockets.connected.hasOwnProperty(id)) {
        var sock = io.sockets.connected[id];
        console.log('disconeccting ' + sock.id);  
        sock.disconnect();
      }
    }
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
    numPlayers--;
    socket.broadcast.emit('removePlayer', socket.id);
  });
});

var port = 9000;

http.listen(port, function(){
  console.log('listening on *: ' + port);
});