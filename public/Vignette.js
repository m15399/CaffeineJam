
var vignetteImage = loadImage('vignette.png');

var Vignette = makeClass('Vignette', GameObject);

Vignette.init = function(){
	GameObject.init.apply(this);

	this.drawOrder = 5;
}

Vignette.draw = function(g){
	g.save();
	camera.reverseTransform(g);
	g.drawImage(vignetteImage, 0, 0);
	g.restore();
}

var bgImage = loadImage('background.png');

var Background = makeClass('Background', GameObject);

Background.init= function(){
	GameObject.init.apply(this);
	this.drawOrder = -50;
}

Background.draw = function(g){
	g.save();

	var size = 100;
	var par = 2;
	g.translate(camera.x, camera.y);
	g.translate(-(camera.x % (size*par))/par, -(camera.y % (size*par))/par);


	for(var i = -size; i < WIDTH + size; i += size){
		for(var j = -size; j < HEIGHT + size; j+= size){
			g.drawImage(bgImage, i, j);
		}
	}



	g.restore();
}