
socket.on('bullet', function(msg){
	Bullet.create(msg[0],msg[1],msg[2],msg[3],msg[4]);
});

socket.on('killB', function(l){
	var bullets = getObjectsByTag('b');
	var closest = undefined;
	var cd = 999999;
	for(var i = 0; i < bullets.length; i++){
		var b = bullets[i];
	
		var dx = l[0] - b.x;
		var dy = l[1] - b.y;

		var dist = Math.sqrt(dx * dx + dy * dy);
		if(dist < cd){
			closest = b;
			cd = dist;
		}
	}
	if(closest)
		closest.destroy();
});

var Bullet = makeClass('Bullet', GameObject);

Bullet.init = function(x, y, xv, yv, pid){
	GameObject.init.apply(this);

	this.x = x;
	this.y = y;
	this.xv = xv;
	this.yv = yv;

	this.r = 20;

	this.id = pid;
	if(pid == lpid){
		this.updateServer();
	}
	this.tag = 'b';
}

Bullet.updateServer = function(){
	var msg = [
		this.x,
		this.y,
		this.xv,
		this.yv,
		this.id
	];
	broadcast('bullet', roundArray(msg));
}

Bullet.update = function(dt){
	this.x += this.xv * dt;
	this.y += this.yv * dt;

	var x = this.x;
	var y = this.y;

	var bound = 100;
	if(x < -bound || x > (64 * map.w + 64 + bound) ||  
		y < -bound || y > (64 * map.h + 64 + bound)){
			this.destroy();
	}
}

Bullet.draw = function(g){
	g.beginPath();
	g.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
	g.lineWidth = 3;
	g.strokeStyle = 'white';
	g.stroke();
}
