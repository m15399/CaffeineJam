

var ourName = 'defaultdefaultdefaultdefaultdefault';

function loadImage(path){
	var img = new Image();
	img.setAttribute('src', '/' + path);
	return img;
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