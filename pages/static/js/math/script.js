window.onload = function () {
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width,
        height = canvas.height;

    var bounce = 0.5,
        gravity = 0.1,
        friction = 0.999;
        points = [],
        sticks = [];

    function addPoint (x, y, ox, oy) {
        points.push({x: x, y: y, oldx: ox, oldy: oy});
    }

    function addStick (i1, i2) {
        sticks.push({p0: points[i1], p1: points[i2],length: distance(points[i1], points[i2])});
    }

    addPoint(50,50,30,30);
    addPoint(100,50,100,50);
    addPoint(50,100,50,100);
    addPoint(100,100,100,100);
    addPoint(75,75,75,75);

    addStick(0, 1);
    addStick(1, 3);
    addStick(2, 3);
    addStick(2, 0);
    addStick(0, 4);
    addStick(1, 4);
    addStick(2, 4);
    addStick(3, 4);

    update();
    
    function update () {
        updatePoints();
        updateSticks();
        renderPoints();
        renderSticks();
        requestAnimationFrame(update);
    }

    function distance (p1, p0) {
        return Math.sqrt((p0.x - p1.x) * (p0.x - p1.x) + (p0.y - p1.y) * (p0.y - p1.y));
    }

    function updateSticks () {
        for (let i = 0, len = sticks.length; i < len; i++) {
            var s = sticks[i],
                dx = s.p1.x - s.p0.x,
                dy = s.p1.y - s.p0.y,
                dist = Math.sqrt(dx * dx + dy * dy),
                diff = s.length - dist,
                perc = diff / dist / 2,
                offx = dx * perc,
                offy = dy * perc;

            s.p0.x -= offx;
            s.p0.y -= offy;
            s.p1.x += offx;
            s.p1.y += offy;
        }
    }

    function updatePoints () {
        for (let i = 0, len = points.length; i < len; i++) {
            var p = points[i],
                vx = (p.x - p.oldx) * friction,
                vy = (p.y - p.oldy) * friction;

            p.oldx = p.x;
            p.oldy = p.y;
            p.x += vx;
            p.y += vy;
            p.y += gravity;

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

    function renderSticks () {
        context.beginPath();
        for (let i = 0, len = sticks.length; i < len; i++) {
            var s = sticks[i];
            context.moveTo(s.p0.x, s.p0.y);
            context.lineTo(s.p1.x, s.p1.y);
        }
        context.stroke();
    }
    
    

    function renderPoints () {
        context.clearRect(0, 0, width, height);
        for (let i = 0, len = points.length; i < len; i++) {
            var p = points[i];
            context.beginPath();
            context.arc(p.x, p.y, 5,0, Math.PI * 2);
            context.fill();
        }
    }
}
