var cavasDiv = document.getElementById("pool-container");
var canvas = document.getElementById("canvas");
canvas.width = cavasDiv.clientWidth;
canvas.height = cavasDiv.clientHeight;

var context = canvas.getContext("2d"),
	width = canvas.width,
	height = canvas.height;

pool_width = 300;
pool_height = 2 * pool_width;
ball_radius = pool_width / 24;
pool_rect = {x: 0.75 * width, y: 0.1 * height, w:pool_width, h: pool_height};

pool_start = {x: pool_rect.w/2, y: pool_rect.h - pool_height*0.25}
pool_end = {x: pool_rect.w/2, y: pool_height*0.25}

DRAGGING = false;
PAUSED = false ;

STICKS = [];
BALLS = [];
friction = 0.97;
bounce = 0.99;
//friction = 1;
//bounce = 1;

function drawArrow(fromx, fromy, tox, toy){
	//variables to be used when creating the arrow
	const width = 22;
	var headlen = 10;
	// This makes it so the end of the arrow head is located at tox, toy, don't ask where 1.15 comes from
	tox -= Math.cos(angle) * ((width*1.15));
	toy -= Math.sin(angle) * ((width*1.15));

	var angle = Math.atan2(toy-fromy,tox-fromx);
	
	//starting path of the arrow from the start square to the end square and drawing the stroke
	context.beginPath();
	context.moveTo(fromx, fromy);
	context.lineTo(tox, toy);
	context.strokeStyle = "#cc0000";
	context.lineWidth = width;
	context.stroke();
	
	//starting a new path from the head of the arrow to one of the sides of the point
	context.beginPath();
	context.moveTo(tox, toy);
	context.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));
	
	//path from the side point of the arrow, to the other side point
	context.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));
	
	//path from the side point back to the tip of the arrow, and then again to the opposite side point
	context.lineTo(tox, toy);
	context.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

	//draws the paths created above
	context.strokeStyle = "#cc0000";
	context.lineWidth = width;
	context.stroke();
	context.fillStyle = "#cc0000";
	context.fill();
	context.strokeStyle = "#000000";
	context.lineWidth = 1;
	context.fillStyle = "#000000";
}

function distance (x0, y0, x1, y1) {
	return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
}

function getBallSpeed (b) {
	return Math.abs(distance(b.x, b.y, b.px, b.py));
}

function addBall (x, y, c, m) {
	BALLS.push({x:pool_rect.x + x,y: pool_rect.y + y,c:c,px: pool_rect.x + x,py: pool_rect.y + y, r: ball_radius, m:m});
}


function addStick(p0, p1, l) {
	STICKS.push({p0:p0, p1:p1, length:l});
}


function constrainBalls() {
	for(var i = 0; i < BALLS.length; i++) {
		var b = BALLS[i],
			vx = (b.x - b.px) * friction;
			vy = (b.y - b.py) * friction;

		if (b.x + b.r > pool_rect.x + pool_rect.w) {
			b.x = pool_rect.x + pool_rect.w - b.r;
			b.px = b.x + vx * bounce;
		}
		if (b.x - b.r < pool_rect.x) {
			b.x = pool_rect.x + b.r;
			b.px = b.x + vx * bounce;
		}
		if (b.y + b.r > pool_rect.y + pool_rect.h) {
			b.y = pool_rect.y + pool_rect.h - b.r;
			b.py = b.y + vy * bounce;
		}
		if (b.y - b.r < pool_rect.y) {
			b.y = pool_rect.y + b.r;
			b.py = b.y + vy * bounce;
		}
	}
}

function updateSticks() {
	for(var i = 0; i < STICKS.length; i++) {
		var s = STICKS[i],
			dx = s.p1.x - s.p0.x,
			dy = s.p1.y - s.p0.y,
			distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < s.p1.r + s.p0.r) {
			var difference = s.length - distance,
				percent = difference / distance / 1,
				offsetX = dx * percent,
				offsetY = dy * percent;
			s.p0.x -= offsetX;
			s.p0.y -= offsetY;
			s.p1.x += offsetX;
			s.p1.y += offsetY;
		}
	}
}

function renderBalls () {
	context.clearRect(0,0,width, height);
	for (let i = 0; i < BALLS.length; i++) {
		var b = BALLS[i];
		context.beginPath();
		context.arc(b.x, b.y, b.r, 0, Math.PI * 2);
		if (i == 0) {
			context.stroke();
		} else {
			context.fill();
		}
	}
}

function renderSticks() {
	context.beginPath();
	for(var i = 0; i < STICKS.length; i++) {
		var s = STICKS[i];
		context.moveTo(s.p0.x, s.p0.y);
		context.lineTo(s.p1.x, s.p1.y);
	}
	context.stroke();
}

function renderPool () {
	context.beginPath();
	context.moveTo(pool_rect.x, pool_rect.y);
	context.lineTo(pool_rect.x + pool_rect.w, pool_rect.y);
	context.lineTo(pool_rect.x + pool_rect.w, pool_rect.y + pool_rect.h);
	context.lineTo(pool_rect.x, pool_rect.y + pool_rect.h);
	context.lineTo(pool_rect.x, pool_rect.y);
	context.stroke();
}

function updateBalls () {
	for (let i = 0; i < BALLS.length; i++) {
		var b = BALLS[i],
			vx = (b.x - b.px) * friction,
			vy = (b.y - b.py) * friction;

		b.px = b.x;
		b.py = b.y;
		b.x += vx;
		b.y += vy;
		//b.y += 0.1;

	}
}

function update () {
	updateBalls();
	constrainBalls();
	for(var i = 0; i < 5; i++) {
		updateSticks();
	 }
	renderBalls();
	//renderSticks();
	if (!PAUSED) {
		renderPool();
		requestAnimationFrame(update);
	}
}

canvas.addEventListener("mouseup", function(event) {
	let rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.left;
	let y = event.clientY - rect.top;
	if (DRAGGING) {
		BALLS[0].x = BALLS[0].x - ( x - BALLS[0].x ) / 5;
		BALLS[0].y = BALLS[0].y - ( y - BALLS[0].y ) / 5;
	}
	DRAGGING = false;
});
canvas.addEventListener("mousedown", function(event){
	let rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.left;
	let y = event.clientY - rect.top;

	if (distance(BALLS[0].x, BALLS[0].y, x, y) < 20) {
		DRAGGING = true;
	} else {
		DRAGGING = false;
	}
});
canvas.addEventListener("mousemove", function(event) {
	let rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.left;
	let y = event.clientY - rect.top;
});

addBall(pool_start.x, pool_start.y, (0,0,0), 10);
addBall(pool_end.x, pool_end.y, (0,0,0), 10);
addBall(pool_end.x - ball_radius*Math.sqrt(1), pool_end.y - ball_radius*Math.sqrt(3), (0,0,0), 10);
addBall(pool_end.x + ball_radius*Math.sqrt(1), pool_end.y - ball_radius*Math.sqrt(3), (0,0,0), 10);
addBall(pool_end.x - ball_radius*Math.sqrt(1) - ball_radius*Math.sqrt(1), pool_end.y - ball_radius*Math.sqrt(3) - ball_radius*Math.sqrt(3), (0,0,0), 10);
addBall(pool_end.x - ball_radius*Math.sqrt(1) + ball_radius*Math.sqrt(1), pool_end.y - ball_radius*Math.sqrt(3) - ball_radius*Math.sqrt(3), (0,0,0), 10);
addBall(pool_end.x + ball_radius*Math.sqrt(1) + ball_radius*Math.sqrt(1), pool_end.y - ball_radius*Math.sqrt(3) - ball_radius*Math.sqrt(3), (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);
addBall(pool_end.x + Math.random()*100, pool_end.y + Math.random()*100, (0,0,0), 10);

var ballCombinations = [];
for (let i = 0; i < BALLS.length - 1; i++) {
	for (let j = i + 1; j < BALLS.length; j++) {
		ballCombinations.push([BALLS[i], BALLS[j]]);
	}
}

for (let i = 0; i < ballCombinations.length; i++) {
	var b1 = ballCombinations[i][0],
		b2 = ballCombinations[i][1];
	addStick(b1, b2, b1.r+b2.r);
}

update();
