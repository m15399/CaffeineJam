
var Scoreboard = makeClass('Scoreboard', GameObject);

Scoreboard.init = function(){
	GameObject.init.apply(this);
	this.drawOrder = 10;
}

Scoreboard.draw = function(g){
	var ps = copyExisting(players);
	ps.sort(function(a, b){
		return b.score - a.score;
	});

	g.save();
	camera.reverseTransform();

	g.fillStyle = 'white';
	var size = 14;
	g.font = size + 'px Arial';
	g.textAlign = 'right';
	for(var i = 0; i < ps.length; i++){
		var p = ps[i];
		g.fillText(p.name + ' -', WIDTH - 40, i * (size + 2) + size*2);
	}
	g.textAlign = 'left';
	for(var i = 0; i < ps.length; i++){
		var p = ps[i];
		g.fillText(Math.floor(p.score), WIDTH - 35, i * (size + 2) + size*2);
	}

	g.restore();
}