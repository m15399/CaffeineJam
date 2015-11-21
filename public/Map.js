

var tileImages = [
	undefined,
	loadImage('wood-tile.png'),
	loadImage('wood-tile.png'),
];

var Map = makeClass('Map', GameObject);

Map.init = function(){
	GameObject.init.apply(this);

	this.w = 32;
	this.h = 32;

	this.tiles = [];

	this.generateTiles();
}

Map.generateTiles = function(){
	for(var i = 0; i < this.w * this.h; i++){
		this.tiles[i] = randomInt(0, 2);
	}
}

Map.draw = function(g){

	var sx = Math.floor(Math.max(0, camera.getLeft()/64));
	var ex = Math.floor(Math.min(this.w, camera.getRight()/64)) + 1;
	var sy = Math.floor(Math.max(0, camera.getTop()/64));
	var ey = Math.floor(Math.min(this.w, camera.getBottom()/64)) + 1;

	for(var i = sx; i < ex; i++){
		for(var j = sy; j < ey; j++){
			var x = i * 64;
			var y = j * 64;

			var image = tileImages[this.tiles[j * this.w + i]];

			if(image)
				g.drawImage(image, x, y);
		}
	}
}

