
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

	// Draw

	// Clear screen
	g.fillStyle = '#000';
	g.fillRect(0, 0, canvas.width, canvas.height);

	// Adjust coordinate system to window
	g.save();
	g.translate(leftSide, 0);
	g.scale(scaleFac, scaleFac);

	g.translate(-camera.x, -camera.y);
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
for(var i = 0; i < 50; i++){
	Pickup.create(randomDouble(0, 64 * map.w), randomDouble(0, 64 * map.h))
}
var player = Player.create();

window.requestAnimationFrame(mainLoop);

