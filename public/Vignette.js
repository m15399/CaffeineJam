
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