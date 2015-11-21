
var Pickup = makeClass('Pickup', GameObject);

Pickup.init = function(x, y){
	GameObject.init.apply(this);

	this.x = x;
	this.y = y;

	this.w = 25;
	this.h = 25;

	this.caf = 2;
}

Pickup.update = function(dt){
	var p = player;
	if(rectsCollide(p.x, p.y, p.w, p.h, this.x, this.y, this.w, this.h)){
		this.destroy();
		p.caf += this.caf;
	}
}

Pickup.draw = function(g){
	g.fillStyle = 'green';
	g.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
}