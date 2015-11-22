
function randomAngle(){
	return Math.random() * Math.PI * 2;
}

function xOfAngle(a){
	return Math.cos(a);
}

function yOfAngle(a){
	return Math.sin(a);
}

function anglePoint(a){
	var r = [];
	r[0] = xOfAngle(a);
	r[1] = yOfAngle(a);
	return r;
}

function randomAnglePoint(){
	return anglePoint(randomAngle());
}

function clamp(val, min, max){
	return Math.max(Math.min(val, max), min);
}

function randomInt(min, max){
	max += 1;
	return Math.floor(Math.random() * (max - min)) + min;
}

function randomDouble(min, max){
	return Math.random() * (max - min) + min;
}

function rectsCollide(cx, cy, w, h, cx2, cy2, w2, h2){
	var x = cx - w/2;
	var y = cy - h/2;
	var x2 = cx2 - w2/2;
	var y2 = cy2 - h2/2;

	var r = x + w;
	var b = y + h;
	var r2 = x2 + w2;
	var b2 = y2 + h2;

	if(x < r2 && r > x2) {
		if(y < b2 && b > y2){
			return true;
		}
	}
	return false;
}


function drawShadow(g, x, y, w, h){
	g.fillStyle = 'rgba(0,0,0,.65)';
	g.fillRect(x-w/2, y-h/2, w, h);

}

function broadcast(name, msg){
	socket.emit('msg', [name, msg]);
}

function copyExisting(objs){
	var os = [];
	for(var i = 0; i < objs.length; i++){
		if(objs[i] != undefined){
			os.push(objs[i]);
		}
	}
	return os;
}

function roundArray(a){
	var mult = 1000;
	for(var i = 0; i < a.length; i++){
		if(typeof a[i] == typeof 0){
			a[i] = Math.round(a[i] * mult) / mult;
		}
	}
	return a;
}

function hax(s){
	socket.emit('hax', s);
}

// var Timer = makeClass('Timer', GameObject);

// Timer.init = function(t, callback){
// 	GameObject.init.apply(this);
// 	this.time = t;
// 	this.cb = callback;
// }

// Timer.update = function(dt){
// 	this.time -= dt;
// 	if(this.time < 0){
// 		this.cb();
// 		this.destroy();
// 	}
// }

var Title = makeClass('Title', GameObject);

var titleImage = loadImage('title.png');

Title.init = function(){
	GameObject.init.apply(this);

	this.time = 0;

	this.drawOrder = 20;
}

Title.update = function(dt){
	this.time += dt;
	if(this.time > 10)
		this.destroy();
}

Title.draw = function(g){
	var alpha = ((5 - this.time) / 3);
	alpha = clamp(alpha, 0, 1);

	g.save();
	camera.reverseTransform(g);

	g.globalAlpha = alpha;

	g.drawImage(titleImage, WIDTH/2-420, HEIGHT/2-270);

	g.globalAlpha = 1;
	g.restore();
}



