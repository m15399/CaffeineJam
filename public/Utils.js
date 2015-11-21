
function randomAngle(){
	return Math.random() * Math.PI * 2;
}

function xOfAngle(a){
	return Math.cos(a);
}

function yOfAngle(a){
	return Math.sin(a);
}

function anglePoint(a){
	var r = [];
	r[0] = xOfAngle(a);
	r[1] = yOfAngle(a);
	return r;
}

function randomAnglePoint(){
	return anglePoint(randomAngle());
}

function clamp(val, min, max){
	return Math.max(Math.min(val, max), min);
}

function randomInt(min, max){
	max += 1;
	return Math.floor(Math.random() * (max - min)) + min;
}