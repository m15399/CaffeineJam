
var pImages = [
	loadImage('red-hipster.png'),
	loadImage('blue-hipster.png'),
];

socket.on('player', function(msg){
	var id = msg[0];
	var p = players[id];
	if(!p){
		var name = msg[9];
		p = Player.create(id, name);
	}
	p.setNetworkInfo(msg);
});

socket.on('dcPlayer', function(pid){
	players[pid].destroy();
	players[pid] = undefined;
});

var Player = makeClass('Player', GameObject);

Player.init = function(id, name){
	GameObject.init.apply(this);

	this.w = 50;
	this.h = 50;

	this.fw = 38;
	this.fh = 24;

	this.fric = 6;

	this.skin = id % pImages.length;

	this.respawn();

	this.reloadTime = 1;
	this.reload = 0;

	this.name = name;
	this.score = 0;

	this.id = id;
	players[id] = this;

	this.inX = 0;
	this.inY = 0;
}

Player.updateServer = function(){
	broadcast('player', this.getNetworkInfo());
}

Player.getNetworkInfo = function(){
	var msg = [
		this.id, // 0
		this.x,
		this.y,
		this.xv, 
		this.yv, // 4
		this.score,
		this.skin, 
		this.inX,
		this.inY, // 8
		this.name,
		this.caf,
	];
	return roundArray(msg);
}

Player.setNetworkInfo = function(msg){
	this.id = msg[0];
	this.x = msg[1];
	this.y = msg[2];
	this.xv = msg[3];
	this.yv = msg[4];
	this.score = msg[5];
	this.skin = msg[6];
	this.inX = msg[7];
	this.inY = msg[8];
	this.name = msg[9];
	this.caf = msg[10];
}

Player.updateInput = function(dt){

	var nInX = 0;
	var nInY = 0;

	if(Input.down.a)
		nInX += -1;
	if(Input.down.d)
		nInX += 1;
	if(Input.down.w)
		nInY += -1;
	if(Input.down.s)
		nInY += 1;

	if(Input.pressed.left)
		this.fire(-1, 0);
	if(Input.pressed.right)
		this.fire(1, 0);
	if(Input.pressed.up)
		this.fire(0, -1);
	if(Input.pressed.down)
		this.fire(0, 1);

	if(nInX != this.inX || nInY != this.inY || this.reload == this.reloadTime){
		this.inX = nInX;
		this.inY = nInY;
		this.updateServer();
	}
}

Player.update = function(dt){
	this.bounceTime += dt;
	this.reload -= dt;

	this.score += Math.sqrt(this.caf) * dt / 2;

	var fricDiv = Math.max(1, ((this.caf+10) / 10));
	// console.log(fricDiv);

	var fric = 1 - (this.fric / fricDiv ) * dt;

	this.xv *= fric;
	this.yv *= fric;

	if(this.id == lpid)
		this.updateInput(dt);	

	var f = 1500 + this.caf * 0;//15;

	this.xv += f * this.inX * dt;
	this.yv += f * this.inY * dt;

	this.x += this.xv * dt;
	this.y += this.yv * dt;

	if(this.id == lpid){
		// cam
		camera.x = this.x - WIDTH/2;
		camera.y = this.y - HEIGHT/2;

		// check cols with bullets
		var bullets = getObjectsByTag('b');
		for(var i = 0; i < bullets.length; i++){
			var b = bullets[i];
			if(b.id != lpid){
				var dx = this.x - b.x;
				var dy = (this.y-18) - b.y;

				var dist = Math.sqrt(dx * dx + dy * dy);
				if(dist < 30){
					
					var xDir = 0;
					var yDir = 0;
					if(b.xv > 0)
						xDir = 1;
					else if (b.xv < 0)
						xDir = -1;
					else if(b.yv > 0)
						yDir = 1;
					else 
						yDir = -1;

					console.log(xDir + ', ' + yDir);

					var hitForce = 500 + this.caf * 10;
					this.xv += xDir * hitForce;
					this.yv += yDir * hitForce;
					this.updateServer();

					b.destroy();
					broadcast('killB', [b.x, b.y]);
				}
			}
		}

		// check collisions with floor
		// curr tile
		var ctx = Math.round((this.x - 32) / 64);
		var cty = Math.round((this.y - 32) / 64);

		var onFloor = false;

		for(var i = ctx - 1; i <= ctx + 1; i++){
			for(var j = cty - 1; j <= cty + 1; j++){
				if(i >= 0 && j >= 0 && i < map.w && j < map.h){
					if(this.collidesWithTile(i, j) && map.getTile(i, j) == 1){
						onFloor = true;
						break;
					}
				}
			}
		}
		if(!onFloor){
			this.respawn();
		} 
	}
}

Player.fire = function(xDir, yDir){

	if(this.reload > 0)
		return;
	this.reload = this.reloadTime;

	var shootForce = 500 + this.caf * 10;
	this.xv += xDir * -shootForce;
	this.yv += yDir * -shootForce;

	var vb = 500;
	Bullet.create(this.x, this.y-30, xDir * vb, yDir * vb, this.id);
}

Player.respawn = function(){
	var tile = map.getRandomFloorTile();
	this.x = tile[0] * 64 + 32;
	this.y = tile[1] * 64 + 32;

	this.xv = 0;
	this.yv = 0;

	this.caf = 0;
	this.bounceTime = Math.random() * Math.PI * 2;

	if(lpid == this.id)
		this.updateServer();
}

Player.collidesWithTile = function(x, y){
	var tx = 32 + 64 * x, ty = 32 + 64 * y;
	if(rectsCollide(this.x, this.y, this.fw, this.fh, tx, ty, 64, 64)){
		return true;
	} 
	return false;
}

Player.draw = function(g){

	var jitter = this.caf/2;
	var x = this.x + randomDouble(-jitter, jitter);
	var bounce = Math.abs(Math.sin(this.bounceTime * 8));
	var y = this.y - 18 - bounce * 14 + 
		randomDouble(-jitter, jitter);

	// shadow
	drawShadow(g, this.x, this.y, 40 - 15 * bounce, 15);

	// player
	g.fillStyle = 'white';
	// g.fillRect(x - this.w/2, y - this.h/2, this.w, this.h);

	var iw = 50;
	var ih = 150/100*iw;
	g.drawImage(pImages[this.skin], x-iw/2-2, y - ih/2-15, iw, ih);


	// floor collision box
	g.fillStyle = 'rgba(255, 0, 0, .5)';
	// g.fillRect(this.x-this.fw/2, this.y-this.fh/2, this.fw, this.fh);
}




