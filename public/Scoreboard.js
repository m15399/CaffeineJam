
var Scoreboard = makeClass('Scoreboard', GameObject);

Scoreboard.init = function(){
	GameObject.init.apply(this);
	this.drawOrder = 10;
	this.locked = false;
	this.zoomed = false;
	this.namesCopy = [];
	this.scoresCopy = [];
	this.playerIndex = 0;
}


Scoreboard.draw = function(g){
	var ps;
	if(this.locked == false){
		ps = copyExisting(players);
		ps.sort(function(a, b){
			return b.score - a.score;
		});
		this.psCopy = ps;

		this.namesCopy = [];
		this.scoresCopy = [];
		this.playerIndex = 0;

		for(var i = 0; i < ps.length; i++){
			var p = ps[i];
			if(p.id == lpid){
				this.playerIndex = i;
			}
			this.namesCopy[i] = p.name;
			this.scoresCopy[i] = p.score;
		}
	} 
	

	g.save();
	camera.reverseTransform();

	var time = Math.max(0, Math.floor(roundLeft));
	g.font = '32px Arial';
	g.textAlign = 'center';
	g.fillText(time, 50, 50);


	var size = 14;

	if(this.zoomed){
		g.translate(WIDTH/2, size*5*1.5);
		g.scale(5, 5);
	} else {
		g.translate(WIDTH-43, size*1.5);
	}

	g.fillStyle = 'white';
	g.font = size + 'px Arial';
	g.textAlign = 'right';
	for(var i = 0; i < this.namesCopy.length; i++){
		var name = this.namesCopy[i];
		if(i == this.playerIndex)
			g.font = 'bold ' + size + 'px Arial';
		
		g.fillText(name + ' -', 0, i * (size + 2));
		if(i == this.playerIndex)
			g.font = size + 'px Arial';
		
	}
	g.textAlign = 'left';
	for(var i = 0; i < this.scoresCopy.length; i++){
		var score = this.scoresCopy[i];
		if(i == this.playerIndex)
			g.font = 'bold ' + size + 'px Arial';

		g.fillText(Math.floor(score), 5, i * (size + 2));

		if(i == this.playerIndex)
			g.font = size + 'px Arial';
	}

	g.restore();
}