window.onload = function() {
    newScene().init(document.body);
}

function randomSign() {
    return Math.random() < 0.5 ? -1 : 1;
}

/*// -----------------------------------------------------------------------------
 *                              * Scene Function *
*/// -----------------------------------------------------------------------------
function newScene() {
    'use strict';
    var raf_ID = 0;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var width = canvas.width = window.innerWidth;
    var height = canvas.height = window.innerHeight;
    var draw = drawElement(ctx);

    var FPS = 60;
    var BACKGROUND_COLOR = "rgba(0, 176, 230)";

    function init(parent) {
        resize();
        parent.appendChild(canvas);
        staticRender();
        
        window.onresize = function() {
            resize();
        }

        document.addEventListener('keyup', function(evt) {
            if (evt.code == "Space") {
                staticRender();
            }
        }, false);

        document.addEventListener('click', function(evt) {
            staticRender();
        }, false);
    }
    
    function animatedRender() {
        setTimeout(function() {
            raf_ID = window.requestAnimationFrame(render);
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = BACKGROUND_COLOR;
            ctx.fillRect(0, 0, width, height);

            // Nothing drawn yet! Static only for now...

        }, 1000/FPS);
    }

    function staticRender() {
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, width, height);
        draw.drawRandomTree(0, width, height * 0.65, height, 10);
        draw.drawRandomCloud(0, width, 0, height * 0.25, 5);
    }

    function startAnimatedRender() {
        animatedRender();
    }

    function stopAnimatedRender() {
        window.cancelAnimationFrame(raf_ID);
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    return {
        init: init,
        staticRender: staticRender,
        startAnimatedRender: startAnimatedRender, 
        stopAnimatedRender: stopAnimatedRender
    };
}



/*// -----------------------------------------------------------------------------
 *                              * Draw Function *
*/// -----------------------------------------------------------------------------
function drawElement(_ctx) {
    var SIN_SIXTY = Math.sqrt(3) / 2;
    var COLORS = {
        "trunk": "rgb(99, 59, 26)",
        "leaf": "rgb(29, 145, 39)",
        "cloud": "rgb(255, 255, 255)"
    };
    
    var ctx = _ctx;

    function drawSquare(x, y, width, color) { // Square centered at x, y
        var halfWidth = width / 2;
        ctx.strokeStyle = ctx.fillStyle = color;
        ctx.moveTo(x - halfWidth, y - 2 * halfWidth);
        ctx.beginPath();
        ctx.lineTo(x + halfWidth, y - halfWidth);
        ctx.lineTo(x + halfWidth, y + halfWidth);
        ctx.lineTo(x - halfWidth, y + halfWidth);
        ctx.lineTo(x - halfWidth, y - halfWidth);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function drawTriangle(x, y, height, color) { // Triangle centered at x, y
        var halfHeight = height / 2;
        var sideLength = height / SIN_SIXTY;
        var pointOne = [x, y - halfHeight];
        var pointTwo = [x + sideLength / 2, y + halfHeight];
        var pointThree = [pointTwo[0] - sideLength, pointTwo[1]];
        ctx.strokeStyle = ctx.fillStyle = color;
        ctx.beginPath();
        ctx.lineTo(pointOne[0], pointOne[1]);
        ctx.lineTo(pointTwo[0], pointTwo[1]);
        ctx.lineTo(pointThree[0], pointThree[1]);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function drawCircle(x, y, radius, color) { // Circle centered at x, y
        ctx.strokeStyle = ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function drawEllipse(x, y, radiusX, radiusY, rotation, color) {
        ctx.strokeStyle = ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(x, y, radiusX, radiusY, rotation, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function drawTree(baseX, baseY) {
        var trunkWidth = Math.random() * 30 + 10;
        var leafHeight= trunkWidth * Math.round(Math.random() * 2 + 2);
        var treeSections = Math.round(Math.random() * 3) + 3;
        
        drawSquare(baseX, baseY, trunkWidth, COLORS["trunk"]);
        baseY -= (trunkWidth / 2) + (leafHeight / 2) - 1;

        for (var i = 0; i < treeSections; i++) {
            if (leafHeight > 0) {
                drawTriangle(baseX, baseY, leafHeight, COLORS["leaf"]);
            } else {
                break;
            }
            baseY -= leafHeight / 2; // Gets top point of current leaf
            leafHeight -= leafHeight * 0.25;
            baseY -= (leafHeight / 8); // Moves up 1/8 Leaf height
        }
    }

    function drawRandomTree(minX, maxX, minY, maxY, numTrees = 1) { // Tree with trunk centered at x, y
        for (var tree = 0; tree < numTrees; tree++) {
            var baseX = Math.random() * (maxX - minX) + minX;
            var baseY = Math.random() * (maxY - minY) + minY;
            drawTree(baseX, baseY);
        }
    }

    function drawCloud(centerX, centerY, maxSize) {
        var MAX_OFFSET = 75;
        var numOfEllipse = Math.round(Math.random() * 4) + 2;
        var radiusX = Math.random() * maxSize + 50;
        var radiusY = Math.random() * maxSize + 50;

        for (var i = 0; i < numOfEllipse; i++) {
            drawEllipse(centerX, centerY, radiusX, radiusY, 0, COLORS["cloud"]);
            centerX = centerX + Math.random() * MAX_OFFSET * randomSign();
            centerY = centerY + Math.random() * MAX_OFFSET * randomSign();
            radiusX = Math.random() * maxSize + 50;
            radiusY = Math.random() * maxSize + 50;
        }
    }

    function drawRandomCloud(minX, maxX, minY, maxY, numClouds = 1) {
        var MAX_SIZE_RATIO = 0.1
        for (var cloud = 0; cloud < numClouds; cloud++) {
            var maxSize = (maxX - minX) * MAX_SIZE_RATIO;
            var centerX = Math.random() * (maxX - minX) + minX;
            var centerY = Math.random() * (maxY - minY) + minY;
            drawCloud(centerX, centerY, maxSize);
        }
    }

    return {
        drawCircle: drawCircle,
        drawSquare: drawSquare,
        drawTriangle: drawTriangle,
        drawTree: drawTree,
        drawRandomTree, drawRandomTree,
        drawCloud, drawCloud,
        drawRandomCloud, drawRandomCloud
    };
}
