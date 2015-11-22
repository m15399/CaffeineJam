

/*

music
bumping?
big text
fall animation

*/

var canvas = document.getElementsByTagName('canvas')[0];
var g = canvas.getContext('2d');
canvas.mozImageSmoothingEnabled = false;
canvas.webkitImageSmoothingEnabled = false;
canvas.msImageSmoothingEnabled = false;
canvas.imageSmoothingEnabled = false;

var WIDTH = 1024, 
	HEIGHT = 768;
var scaleFac = 1;
var leftSide = 0;


resize();
window.addEventListener('resize', resize);

function resize(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	scaleFac = canvas.height / HEIGHT;
	leftSide = (canvas.width - WIDTH * scaleFac)/2;

	g.fillStyle = 'black';
	g.fillRect(0, 0, canvas.width, canvas.height);
}

var lastTime = Date.now()-1;
var lastSecTime = lastTime;
var framesThisSec = 0;
var fps = 0;



function mainLoop(){
	var now = Date.now();
	var dt = (now - lastTime)/1000;
	lastTime = now;

	var fpsUpdate = .5;
	if(now - lastSecTime > 1000 * fpsUpdate){
		fps = framesThisSec / fpsUpdate;
		lastSecTime = now;
		framesThisSec = 0;
	}

	// Update
	Input.preUpdate();
	updateAll(dt);
	Input.postUpdate();

	roundLeft -= dt;

	// Draw

	// Clear screen
	g.fillStyle = '#000';
	g.fillRect(0, 0, canvas.width, canvas.height);

	// Adjust coordinate system to window
	g.save();
	g.translate(leftSide, 0);
	g.scale(scaleFac, scaleFac);

	camera.applyTransform(g);
	drawAll(g);

	g.restore();

	// Draw vertical bars on the left and right sides
	g.fillStyle = '#333';
	g.fillRect(0, 0, leftSide, canvas.height);
	g.fillRect(canvas.width-leftSide, 0, canvas.width, canvas.height);

	g.fillStyle = 'white';
	g.font = '12px Arial';
	g.fillText(fps, 10, 22);

	framesThisSec++;

	var throttle = false;
	if(throttle){
		var delay = 1000/60;
		setTimeout(function(){
			window.requestAnimationFrame(mainLoop);
		}, delay);
	} else {
		window.requestAnimationFrame(mainLoop);
	}

}

var map = Map.create();
var players = [];

var scoreboard = Scoreboard.create();
var roundTime = 60 * 2;

var roundLeft = 0;

socket.on('endGame', function(msg){
	scoreboard.zoomed = true;
});

socket.on('map', function(msg){
	map.setTiles(msg[0],msg[1],msg[2]);
	var lp = players[lpid];
	if(lp){
		lp.score = 0;
		lp.respawn();
	}
	scoreboard.zoomed = false;
	roundLeft = roundTime;

	Title.create();
});

socket.on('welcome', function(msg){
	lpid = msg;
	console.log('recieved welcome, id is ' + msg);

	var playerName;
	// playerName = (prompt('Enter your name:') || ('Player ' + msg)).substring(0,16);
	playerName = 'Mark';
	var lp = Player.create(lpid, playerName);
	socket.emit('myNameIs', playerName);
	broadcast('player', lp.getNetworkInfo());
});

Vignette.create();

window.requestAnimationFrame(mainLoop);

