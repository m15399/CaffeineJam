
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
	var os = copyExisting(allObjects);
	os.sort(function(a, b){
		return a.drawOrder - b.drawOrder;
	});

	for(var i = 0; i < os.length; i++){
		if(os[i] != undefined)
			os[i].draw(g);
	}
}

function getObjectsByTag(tag){
	var ret = [];
	for(var i = 0; i < allObjects.length; i++){
		var o = allObjects[i];
		if(o && o.tag == tag)
			ret.push(o);
	}
	return ret;
}

//

var GameObject = makeClass('GameObject');

GameObject.init = function(){
	newObjects.push(this);
	this.drawOrder = 0;
}

GameObject.update = function(dt){}

GameObject.draw = function(g){}

GameObject.destroy = function(){
	destroyedObjects.push(this);
}

