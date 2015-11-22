

var tileImages = [
	undefined,
	loadImage('wood-tile.png'),
	loadImage('broken-wood-left.png'),
	loadImage('broken-wood-right.png'),
];

var Map = makeClass('Map', GameObject);

Map.init = function(){
	GameObject.init.apply(this);

	this.w = 16;
	this.h = 16;

	this.tiles = [];
	for(var i = 0; i < 16 * 16; i++){
		this.tiles[i] = 1;
	}
	this.drawOrder = -10;
}

Map.setTiles = function(w, h, ts){
	this.w = w;
	this.h = h;
	this.tiles = ts;
	this.fixTiles();
}

Map.fixTiles = function(){
	// put broken edges
	for(var i = 0; i < this.w; i++){
		for(var j = 0; j < this.h; j++){
			if(this.getTile(i, j) != 0)
				continue;
			if(this.getTile(i-1, j) != 1 && this.getTile(i+1, j) == 1){
				this.tiles[j * this.w + i] = 3;
			} else if (this.getTile(i+1, j) != 1 && this.getTile(i-1, j) == 1){
				this.tiles[j * this.w + i] = 2;
			}
		}
	}
}

Map.getTile = function(x, y){
	if(x < 0 || x >= this.w)
		return 0;
	if(y < 0 || y >= this.h)
		return 0;
	return this.tiles[this.w * y + x];
}

Map.getRandomFloorTile = function(){
	var x = randomInt(0, this.w-1);
	var y = randomInt(0, this.h-1);
	if(this.getTile(x, y) == 1){
		return [x, y];
	} else {
		return this.getRandomFloorTile();
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

			var image = tileImages[this.getTile(i, j)];

			if(image)
				g.drawImage(image, x, y);
		}
	}
}

