
var Player = makeClass('Player', GameObject);

Player.init = function(){
	GameObject.init.apply(this);
	this.x = WIDTH/2;
	this.y = HEIGHT/2;
	this.xv = 0;
	this.yv = 0;

	this.w = 50;
	this.h = 50;

	this.fw = 30;
	this.fh = 15;

	this.fric = 6;

	this.caf = 0;
	this.bounceTime = Math.random() * Math.PI * 2;
}

Player.update = function(dt){
	this.bounceTime += dt;

	var f = 1500 + this.caf * 0;//15;

	var fricDiv = Math.max(1, ((this.caf+10) / 10));
	// console.log(fricDiv);

	var fric = 1 - (this.fric / fricDiv ) * dt;

	this.xv *= fric;
	this.yv *= fric;

	if(Input.down.left || Input.down.a)
		this.xv -= f * dt;
	if(Input.down.right || Input.down.d)
		this.xv += f * dt;
	if(Input.down.up || Input.down.w)
		this.yv -= f * dt;
	if(Input.down.down || Input.down.s)
		this.yv += f * dt;

	this.x += this.xv * dt;
	this.y += this.yv * dt;

	camera.x = this.x - WIDTH/2;
	camera.y = this.y - HEIGHT/2;

	// curr tile
	var ctx = Math.round((this.x - 32) / 64);
	var cty = Math.round((this.y - 32) / 64);

	var onFloor = false;

	for(var i = ctx - 1; i <= ctx + 1; i++){
		for(var j = cty - 1; j <= cty + 1; j++){
			if(i >= 0 && j >= 0 && i < map.w && j < map.h){
				if(this.collidesWithTile(i, j) && map.getTile(i, j) != 0){
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

Player.respawn = function(){
	this.x = 0;
	this.y = 0;
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
	var y = this.y - 18 - Math.abs(Math.sin(this.bounceTime * 8) * 14) + 
		randomDouble(-jitter, jitter);

	// shadow
	g.fillStyle = 'rgba(0,0,0,.65)';
	var wide = 6;
	g.fillRect(this.x - this.w/2 - wide/2, this.y-this.h/8, this.w+wide, this.h/2);

	// player
	g.fillStyle = 'white';
	g.fillRect(x - this.w/2, y - this.h/2, this.w, this.h);

	// floor collision box
	g.fillStyle = 'red';
	// g.fillRect(this.x-this.fw/2, this.y-this.fh/2, this.fw, this.fh);
}




