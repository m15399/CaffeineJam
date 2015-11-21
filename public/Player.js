
var Player = makeClass('Player', GameObject);

Player.init = function(){
	GameObject.init.apply(this);
	this.x = WIDTH/2;
	this.y = HEIGHT/2;
	this.xv = 0;
	this.yv = 0;

	this.w = 50;
	this.h = 50;

	this.force = 800;
	this.maxv = 400;
	this.fric = 4;
}

Player.update = function(dt){
	var f = this.force;

	var fric = 1 - this.fric * dt;

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

	// this.xv = clamp(this.xv, -this.maxv, this.maxv);
	// this.yv = clamp(this.yv, -this.maxv, this.maxv);


	this.x += this.xv * dt;
	this.y += this.yv * dt;

	camera.x = this.x - WIDTH/2;
	camera.y = this.y - HEIGHT/2;
}

Player.draw = function(g){
	g.fillStyle = 'white';
	g.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
}




