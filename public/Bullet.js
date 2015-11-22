
socket.on('bullet', function(msg){
	Bullet.create(msg[0],msg[1],msg[2],msg[3],msg[4]);
});

socket.on('killB', function(l){
	Sounds.knockback.play();
	
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

var typewriter = loadImage('typewriter.png');

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
	this.rot = 0;

	Sounds.projectile.play();
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

	this.rot += dt * 5;

	var x = this.x;
	var y = this.y;

	var bound = 100;
	if(x < -bound || x > (64 * map.w + 64 + bound) ||  
		y < -bound || y > (64 * map.h + 64 + bound)){
			this.destroy();
	}

	if(Math.random() < .15){
		var spread = 10;
		var pv = 50;
		var px = randomDouble(this.x-spread, this.x+spread);
		var py = randomDouble(this.y-spread, this.y+spread);
		Paper.create(px, py, randomDouble(-pv, pv), randomDouble(-pv, pv));
	}

}

Bullet.draw = function(g){
	g.save();
	g.translate(this.x, this.y);
	// g.beginPath();
	// g.arc(0, 0, this.r, 0, 2 * Math.PI, false);
	// g.lineWidth = 3;
	// g.strokeStyle = 'white';
	// g.stroke();
	g.rotate(this.rot);
	g.drawImage(typewriter, -25, -28, 50, 50);
	g.restore();
}

var papers = [
	loadImage('paper1.png'),
	loadImage('paper2.png'),

];

var Paper = makeClass('Paper', GameObject);

Paper.init = function(x, y, xv, yv){
	GameObject.init.apply(this);

	this.x = x;
	this.y = y;
	this.xv = xv;
	this.yv = yv;

	var ramt = .15;
	this.rs = randomDouble(-ramt, ramt);
	this.rot = Math.random();

	this.drawOrder = -1;

	this.life = .5;

	this.image = papers[randomInt(0, 1)];
}

Paper.update = function(dt){
	this.life -= dt;
	if(this.life < 0)
		this.destroy();
	this.x += this.xv * dt;
	this.y += this.yv * dt;
	this.rot += this.rs * dt;
}

Paper.draw = function(g){
	g.save();
	g.translate(this.x, this.y);
	g.rotate(this.rot);
	g.drawImage(this.image, -12, -12, 25, 25);
	g.restore();
}

