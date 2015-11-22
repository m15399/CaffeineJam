
var pickups = [];

socket.on('pus', function(msg){
	for(var i = 0; i < pickups.length; i++){
		pickups[i].destroy();
	}
	pickups = [];

	for(var i = 0; i < msg.length; i++){
		var p = msg[i];
		setPickup(p, false);
	}
});

function setPickup(p, sound){

	if(sound)
		Sounds.collect.play();

	var id = p[0];
	var tx = p[1];
	var ty = p[2];
	var type = p[3];

	if(pickups[id])
		pickups[id].destroy();

	var pu = Pickup.create(id);
	pu.x = tx * 64 + 32;
	pu.y = ty * 64 + 24;
	pu.type = type;
}

socket.on('pu', function(msg){
	setPickup(msg, true);
});

var pickupImages = [
	loadImage('tea.png'),
	loadImage('coffee.png'),
	loadImage('choc.png'),

];

var Pickup = makeClass('Pickup', GameObject);

Pickup.init = function(id){
	GameObject.init.apply(this);

	this.w = 25;
	this.h = 25;

	this.drawOrder = -5;

	this.id = id;
	pickups[id] = this;

	this.float = Math.random() * Math.PI * 2;

	this.caf = 2;
	this.active = true;

	this.type = 0;
}



Pickup.update = function(dt){

	this.float += dt;

	var p = players[lpid];
	if(!p || !this.active)
		return;
	if(rectsCollide(p.x, p.y, p.w, p.h, this.x, this.y, this.w, this.h)){
		this.active = false;
		socket.emit('killPu', this.id);
		p.caf += this.caf;

		BigText.create(p.caf);
	}
}

Pickup.draw = function(g){

	var foff = Math.sin(this.float * 3.5) * 5;

	var div = -4;
	drawShadow(g, this.x-4, this.y + 15, 24 - foff / div, 20 - foff / div);

	g.fillStyle = 'green';
	// g.fillRect(this.x - this.w/2, this.y - this.h/2 + foff, this.w, this.h);

	var image = pickupImages[this.type];
	g.drawImage(image, this.x-20, this.y-23 + foff, 40, 40);
}