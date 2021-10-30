// " vim:foldmethod=indent:foldlevel=1:foldnestmax=2
var UPDATE = false,
    POINTS = [],
    STICKS = [],
    DRAGGING = false,
    UPDATES = 20,
    N = 20;


function togglePlay () {
    if (UPDATE) {
        UPDATE = false;
        document.getElementById('play').innerText = "Play";
    } else {
        UPDATE = true;
        document.getElementById('play').innerText = "Pause";
    }
}


window.onload = function () {
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width,
        height = canvas.height;

    var bounce = 0.5,
        gravity = 0.1,
        friction = 0.999;

    update();
    createRope(400,20,300,110,N);

    function distance (x0, y0, x1, y1) {
        return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
    }

    function createPoint (x, y, pinned) {
        return {x : x, y : y, oldx : x, oldy : y, pinned : pinned};
    }

    function createStick (p0, p1, l) {
        return {p0 : p0, p1 : p1, draw : true, length : l};
    }

    function createRope (startX, startY, endX, endY, N) {
        let points = [],
            sticks = [],
            dx = ( endX - startX ) / N,
            dy = ( endY - startY ) / N,
            l = distance(startX, startY, endX, endY) / N;

        for (let i = 0; i < N+1; i++) {
            points.push(createPoint(startX + i * dx, startY + i * dy, false));
        }
        points[0].pinned = true;
        for (let i = 0; i < N; i++) {
            sticks.push(createStick(points[i], points[i+1], l));
        }

        for (let p in points) {
            POINTS.push(points[p]);
        }
        for (let s in sticks) {
            STICKS.push(sticks[s]);
        }
    }
    
    function clearCanvas () {
        context.clearRect(0, 0, width, height);
    }
    
    function renderSticks () {
        context.beginPath();
        for (let i = 0, len = STICKS.length; i < len; i++) {
            var s = STICKS[i];
            if (s.draw) {
                context.moveTo(s.p0.x, s.p0.y);
                context.lineTo(s.p1.x, s.p1.y);
            }
        }
        context.stroke();
    }
    
    function renderPoints () {
        for (let i = 0, len = POINTS.length; i < len; i++) {
            var p = POINTS[i];
            context.beginPath();
            if (p.pinned) {
                context.arc(p.x, p.y, 5,0, Math.PI * 2);
            } else {
                //context.arc(p.x, p.y, 4,0, Math.PI * 2);
            }
            context.fill();
        }
    }

    function updateSticks () {
        for (let i = 0, len = STICKS.length; i < len; i++) {
            var s = STICKS[i],
                dx = s.p1.x - s.p0.x,
                dy = s.p1.y - s.p0.y,
                dist = Math.sqrt(dx * dx + dy * dy),
                diff = s.length - dist,
                perc = diff / dist / 2,
                offx = dx * perc,
                offy = dy * perc;
            if (!s.p0.pinned) {
                s.p0.x -= offx;
                s.p0.y -= offy;
            }
            if (!s.p1.pinned) {
                s.p1.x += offx;
                s.p1.y += offy;
            }
        }
    }

    function updatePoints () {
        for (let i = 0, len = POINTS.length; i < len; i++) {
            var p = POINTS[i],
                vx = (p.x - p.oldx) * friction,
                vy = (p.y - p.oldy) * friction;
            if (!p.pinned) {
                p.oldx = p.x;
                p.oldy = p.y;
                p.x += vx;
                p.y += vy;
                p.y += gravity;
            }
        }
    }

    function constrainPoints () {
        for (let i = 0, len = POINTS.length; i < len; i++) {
            var p = POINTS[i],
                vx = (p.x - p.oldx) * friction,
                vy = (p.y - p.oldy) * friction;
            
            if (!p.pinned) {
                if (p.x > width) {
                    p.x = width;
                    p.oldx = p.x + vx * bounce;
                }
                if (p.x < 0) {
                    p.x = 0;
                    p.oldx = p.x + vx * bounce;
                }
                if (p.y > height) {
                    p.y = height;
                    p.oldy = p.y + vy * bounce;
                }
                if (p.y < 0) {
                    p.y = 0;
                    p.oldy = p.y + vy * bounce;
                }
            }
        }
    }
    

    function update () {
        clearCanvas();
        if (UPDATE) {
            updatePoints();
            for (var i = 0; i < UPDATES; i ++ ) {
                updateSticks();
                constrainPoints();
            }
        }
        renderPoints();
        renderSticks();
        requestAnimationFrame(update);
    }
    canvas.addEventListener("mouseup", function(event) {
        DRAGGING = false;
    });
    canvas.addEventListener("mousedown", function(event){
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        if (distance(POINTS[0].x, POINTS[0].y, x, y) < 20) {
            DRAGGING = true;
        } else {
            DRAGGING = false;
        }
    });
    canvas.addEventListener("mousemove", function(event) {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        if (DRAGGING) {
            POINTS[0].x = x;
            POINTS[0].y = y;
        }
    });
}

