
var InputClass = makeClass('InputClass');

InputClass.init = function(){
	var that = this;
	window.onkeydown = function(e){
		that.keyboard(e, true);
	}
	window.onkeyup = function(e){
		that.keyboard(e, false);
	}

	this.down = {};
	this.pressed = {};
	this.newlyPressed = {};
}

InputClass.preUpdate = function(){
	this.pressed = this.newlyPressed;
	this.newlyPressed = {};
}

InputClass.postUpdate = function(){
	this.pressed = {};
}

InputClass.keys = [
	'enter', 13,
	'space', 32,
	'left', 37,
	'up', 38,
	'right', 39,
	'down', 40,
	'w', 87,
	'a', 65,
	's', 83,
	'd', 68
];

InputClass.keyboard = function(e, down){
	var key = e.keyCode ? e.keyCode : e.which;

	for(var i = 1; i < this.keys.length; i+=2){
		if(this.keys[i] == key){
			var name = this.keys[i-1];
			if(down){
				if(!this.down[name]){
					this.newlyPressed[name] = true;
					this.down[name] = true;
				}
			}
			else{
				delete this.down[name];
			}
		}
	}

}

var Input = InputClass.create(); 
