var Camera = makeClass('Camera', GameObject);

Camera.init = function(){
	GameObject.init.apply(this);

	this.x = 0;
	this.y = 0;
}

Camera.getLeft = function(){
	return this.x;
}
Camera.getRight = function(){
	return this.x + WIDTH;
}
Camera.getTop = function(){
	return this.y;
}
Camera.getBottom = function(){
	return this.y + HEIGHT;
}

Camera.applyTransform = function(){
	g.translate(-camera.x, -camera.y);
}

Camera.reverseTransform = function(){
	g.translate(camera.x, camera.y);
}

var camera = Camera.create();
