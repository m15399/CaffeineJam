
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

var tiles = [];
var w = 16, h = 16;

function randomInt(min, max){
  max += 1;
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateMap(){
  for(var i = 0; i < w * h; i++){
    tiles[i] = 1;
  }

  // make left and right edges empty
  for(var i = 0; i < h; i++){
    tiles[w * i] = 0;
    tiles[w * (i+1)-1] = 0;
  }

  // poke holes
  var holes = w * h / 12; //8;

  for(var i = 0; i < holes; i++){
    var x = randomInt(1, w-2);
    var y = randomInt(1, h)-2;

    for(var j = x; j < x+2 && j < w; j++){
      for(var k = y; k < y+2 && k < h; k++){
        tiles[k*w + j] = 0;
      }
    }
  }
  for(var i = 0; i < w * h / 70; i++){
    replacePickup(i);
  }
}

function getTile(x, y){
  if(x < 0 || x >= w)
    return 0;
  if(y < 0 || y >= h)
    return 0;
  return tiles[w * y + x];
}

function getRandomFloorTile(){
  var x = randomInt(0, w-1);
  var y = randomInt(0, h-1);
  if(getTile(x, y) == 1){
    return [x, y];
  } else {
    return getRandomFloorTile();
  }
}

function replacePickup(num){
  var tile = getRandomFloorTile();
  pickups[num] = [num, tile[0], tile[1], randomInt(0, 2)];
}

var pickups = [];
var players = [];
var freePlayers = [];


function dcPlayer(pid){
  players[pid] = undefined;
  freePlayers.push(pid);
}

generateMap();

io.on('connection', function(socket){
  console.log('a user connected ' + socket.id);

  // socket.playerName = '';
  // socket.playerReady = false;
  // numPlayers++;

  var spot;
  if(freePlayers.length == 0){
    spot = players.length;
  } else {
    spot = freePlayers.pop();
  }
  players[spot] = socket;
  socket.pid = spot;

  socket.emit('welcome', spot);

  socket.emit('map', [w, h, tiles]);
  for(var i = 0; i < players.length; i++){
    if(players[i] != undefined && players[i].lastUpdate){
      socket.emit('player', players[i].lastUpdate);
    }
  }

  socket.emit('pus', pickups);






  socket.on('msg', function(msg){
    if(msg[0] == 'player'){
      players[socket.pid].lastUpdate = msg[1];
    }
    socket.broadcast.emit(msg[0], msg[1]);
  });

  socket.on('killPu', function(id){
    replacePickup(id);
    io.emit('pu', pickups[id]);
  });

  socket.on('myNameIs', function(msg){
  	socket.playerName = msg;
    console.log(msg + ' connected!');
  });

  // socket.on('dcAll', function(msg){
  //   for (var id in io.sockets.connected) {
  //     if (io.sockets.connected.hasOwnProperty(id)) {
  //       var sock = io.sockets.connected[id];
  //       console.log('disconeccting ' + sock.id);  
  //       sock.disconnect();
  //     }
  //   }
  // });

  socket.on('disconnect', function(){
    console.log('user disconnected: ' + socket.playerName);
    dcPlayer(socket.pid);
    socket.broadcast.emit('dcPlayer', socket.pid);
  });
});

var port = 9000;

http.listen(port, function(){
  console.log('listening on *: ' + port);
});