var X,Y,Z,Tx,Ty;
var mouseX, mouseY;

var mouseIsDown = false;


function init()
{
    canvas = document.getElementById("canvas");
    canvas.width = document.body.clientWidth; //document.width is obsolete
    canvas.height = document.body.clientHeight; //document.height is obsolete
    canvasW = canvas.width;
    canvasH = canvas.height;

    if( canvas.getContext )
    {
        setup();
        setInterval( run , 33 );
    }
    document.addEventListener('wheel', function(e) {
        if(e.deltaY >= 2) {
            if (Z - 0.1 > 0)
                Z -= 0.1;
        }else{
            Z += 0.1;
        }
    });
}

function setup() {
    console.log("setup");
    canvas = document.getElementById("canvas");
    canvas.onmousedown = function(e) {
        mouseIsDown = true; 
        mouseX = e.x;
        mouseY = e.y;
    }
    canvas.onmouseup = function(e) {
        mouseIsDown = false; 
        Tx += X;
        X=0;
        Ty += Y;
        Y=0;
    }
    canvas.onmousemove = function(e) {
        if (mouseIsDown){
            X = mouseX-e.x;
            Y = mouseY-e.y;
        }
    }
    Tx=0;
    Ty=0;
    X=0;
    Y=0;
    Z=1;
}

function run() {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,c.width, c.height);
    ctx.restore();
    ctx.setTransform(); // You need to make sure to include this
    ctx.translate(c.width / 2 - (Tx+X),  c.height / 2 - (Ty+Y));
    ctx.scale(Z,Z);
    //ctx.translate(c.width / 2 - X,  c.height / 2 - Y);


    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, 2 * Math.PI);
    ctx.stroke();
}
