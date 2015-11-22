
var Sound = makeClass('Sound');

Sound.init =function(fn, num, loop){
	this.audios = [];
	for(var i = 0; i < num; i++){
		this.audios[i] = new Audio();
		this.audios[i].src = fn;
		if(loop)
			this.audios[i].loop = true;
	}
	this.curr = 0;
}

Sound.play = function(){
	var a = this.audios[this.curr];
	if(a.readyState > 0)
		a.currentTime = 0;
	a.play();

	this.curr++;
	if(this.curr >= this.audios.length)
		this.curr = 0;
}

var Sounds = {
	collect: Sound.create('/collect.wav', 5, false),
	fall: Sound.create('/fall.wav', 3, false),
	knockback: Sound.create('/knockback.wav', 2, false),
	projectile: Sound.create('/projectile.wav', 4, false),
	select: Sound.create('/select.wav', 1, false),

}



/*
var Audio = {
	music: new Audio(),
	shot: new Audio(),
	hit: new Audio(),

	load: function(){
		this.music.src = '/music.mp3';
		this.music.loop = true;
		this.shot.src = '/shot.wav';
		this.hit.src = '/hit.wav';
	}
}
*/
