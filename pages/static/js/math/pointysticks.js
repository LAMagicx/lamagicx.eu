// " vim:foldmethod=indent:foldlevel=1:foldnestmax=2
var X,Y;
var D = 20;

var ADDING = false;

function togglePlay () {
    if (UPDATE) {
        UPDATE = false;
        document.getElementById('play').innerText = "Play";
    } else {
        UPDATE = true;
        document.getElementById('play').innerText = "Pause";
    }
}
window.onload = function() {
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		width = canvas.width,
		height = canvas.height;

	var points = [],
		sticks = [],
		bounce = 0.5,
		gravity = 0.3,
		friction = 0.99;

	function distance(p0, p1) {
		var dx = p1.x - p0.x,
			dy = p1.y - p0.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

    function createPoint(x, y, ox, oy, p) {
        points.push({x:x, y:y, oldx:ox, oldy:oy, pinned:p});
    }

    function createStick(p0, p1, l) {
        sticks.push({p0:p0, p1:p1, length:l});
    }
	
    update();

	function update() {
		updatePoints();
		constrainPoints();
		for(var i = 0; i < 5; i++) {
			updateSticks();
		 }
		renderPoints();
		renderSticks();
		requestAnimationFrame(update);
	}

	function updatePoints() {
		for(var i = 0; i < points.length; i++) {
			var p = points[i],
				vx = (p.x - p.oldx) * friction;
				vy = (p.y - p.oldy) * friction;

			p.oldx = p.x;
			p.oldy = p.y;
			p.x += vx;
			p.y += vy;
			p.y += gravity;
		}
	}

	function constrainPoints() {
		for(var i = 0; i < points.length; i++) {
			var p = points[i],
				vx = (p.x - p.oldx) * friction;
				vy = (p.y - p.oldy) * friction;

			if(p.x > width) {
				p.x = width;
				p.oldx = p.x + vx * bounce;
			}
			else if(p.x < 0) {
				p.x = 0;
				p.oldx = p.x + vx * bounce;
			}
			if(p.y > height) {
				p.y = height;
				p.oldy = p.y + vy * bounce;
			}
			else if(p.y < 0) {
				p.y = 0;
				p.oldy = p.y + vy * bounce;
			}
            for (let j = 0, len = points.length; j < len; j++) {
                if (i != j) {
                    if (distance(points[i], points[j]) < D) {
                        createStick(points[i], points[j], D);
                    }
                }
            }
		}
	}

	function updateSticks() {
        var remove = [];
		for(var i = 0; i < sticks.length; i++) {
			var s = sticks[i],
				dx = s.p1.x - s.p0.x,
				dy = s.p1.y - s.p0.y,
				distance = Math.sqrt(dx * dx + dy * dy),
				difference = s.length - distance,
				percent = difference / distance / 2,
				offsetX = dx * percent,
				offsetY = dy * percent;
            if (distance < D) {
                s.p0.x -= offsetX;
                s.p0.y -= offsetY;
                s.p1.x += offsetX;
                s.p1.y += offsetY;
            } else {
                remove.push(i);
            }
		}
        for (let r of remove) {
            sticks.splice(r,1);
        }
	}

	function renderPoints() {
		context.clearRect(0, 0, width, height);
		for(var i = 0; i < points.length; i++) {
			var p = points[i];
			context.beginPath();
			context.arc(p.x, p.y, 5, 0, Math.PI * 2);
			context.fill();
		}
	}

	function renderSticks() {
		context.beginPath();
		for(var i = 0; i < sticks.length; i++) {
			var s = sticks[i];
			context.moveTo(s.p0.x, s.p0.y);
			context.lineTo(s.p1.x, s.p1.y);
		}
		context.stroke();
	}

    canvas.addEventListener("mouseup", function(event) {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        ADDING = false;
        
    });
    canvas.addEventListener("mousedown", function(event){
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        ADDING = true;

        X = x;
        Y = y;

    });
    canvas.addEventListener("mousemove", function(event) {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        if (ADDING) {
            createPoint(X,Y,x,y,false);
        }
    });
};
