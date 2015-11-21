
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

function randomDouble(min, max){
	return Math.random() * (max - min) + min;
}

function rectsCollide(cx, cy, w, h, cx2, cy2, w2, h2){
	var x = cx - w/2;
	var y = cy - h/2;
	var x2 = cx2 - w2/2;
	var y2 = cy2 - h2/2;

	var r = x + w;
	var b = y + h;
	var r2 = x2 + w2;
	var b2 = y2 + h2;

	if(x < r2 && r > x2) {
		if(y < b2 && b > y2){
			return true;
		}
	}
	return false;
}