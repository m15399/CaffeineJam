
var allObjects = [];
var newObjects = [];
var destroyedObjects = [];
var freeSpots = [];

function addObject(o){
	var spot;
	if(freeSpots.length == 0){
		spot = allObjects.length;
	} else {
		spot = freeSpots.pop();
	}
	o.objectNumber = spot;
	allObjects[spot] = o;
}

function removeObject(o){
	var i = o.objectNumber;
	allObjects[i] = undefined;
	freeSpots.push(i);
}

function addNewObjects(){
	for(var i = 0; i < newObjects.length; i++){
		addObject(newObjects[i]);
	}
	newObjects = [];
}

function removeDestroyedObjects(){
	for(var i = 0; i < destroyedObjects.length; i++){
		removeObject(destroyedObjects[i]);
	}
	destroyedObjects = [];
}

function updateAll(dt){
	// console.log(allObjects.length);
	addNewObjects();
	for(var i = 0; i < allObjects.length; i++){
		if(allObjects[i] != undefined)
			allObjects[i].update(dt);
	}
	removeDestroyedObjects();
	addNewObjects();
}

function drawAll(g){
	for(var i = 0; i < allObjects.length; i++){
		if(allObjects[i] != undefined)
			allObjects[i].draw(g);
	}
}

//

var GameObject = makeClass('GameObject');

GameObject.init = function(){
	newObjects.push(this);
}

GameObject.update = function(dt){}

GameObject.draw = function(g){}

GameObject.destroy = function(){
	destroyedObjects.push(this);
}

