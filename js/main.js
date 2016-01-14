/* 
TO WORK
	* Fix multitouch
	* Fix puzzle
	* Fix push objects
	* Upload
	
Sizes:
	1920x1080 (max 1080)
	160px  max thumb (iPhone 4s)
	1026px max full
*/

//================================================================
// Main
//================================================================

var fotos = [];
var canvas;
var fullRedraw  = true;
var globalScale = 1;

window.onload = function() {
	setEvents();
	canvas = new Canvas();

	for ( var i = 0; i < 100; i++ ) {
		fotos.push( new Foto("./img/fotos/0.jpg", "./img/fotos/0Thumb.jpg", rand(0, canvas.getWidth()), rand(0, canvas.getHeight()), rand(0, PIx2), true));
	}
	if ( false /* you can try turn it on :) */ ) {
		for ( var i = 0; i < 9; i++ ) {
			fotos.push( new Foto("./img/puzzle/"+i+".png", "./img/puzzle/"+i+".png", rand(0, canvas.getWidth()), rand(0, canvas.getHeight()), rand(0, PIx2), false) );
		}
	}
	
	mouse.setMDownCB(mouseDown); 
	mouse.setMUpCB(mouseUp); 
	startAnimation();
}

function resize() {
	if ( canvas !== undefined ) {
		endShowingAll();
		canvas.resize();
		for ( var i in fotos ) {
			fotos[i].initSizes();
		}
	}
}

function endShowingAll() {
	for ( var i in fotos ) {
		fotos[i].endShowing();
	}
}

function askFullRedraw() {
	fullRedraw = true;
}

//================================================================
// Sizes
//================================================================

function calcPc(x) { return x / canvas.getMainSizePercent(); }
function pc(x)     { return round(x * canvas.getMainSizePercent()); }

//================================================================
// MouseEvents
//================================================================

function mouseDown() {
	endShowingAll();
	var x = mouse.getX();
	var y = mouse.getY();
	for ( var i in fotos ) {
		if ( fotos[i].isHit(x, y) ) {
			fotos[i].setCaught(true, x, y);
			return;
		}
	}
}

function mouseUp(e) {
	for ( var i in fotos ) {
		if ( fotos[i].isControlled() ) {
			fotos[i].setCaught(false, mouse.getX(), mouse.getY());
		}
	}
}

//================================================================
// Animation & process
//================================================================

function startAnimation() {
	requestAnimationFrame(startAnimation);
	canvas.drawAll();
	processAll();
}

function processAll() {
	var delta = time.update();
	
	for ( var i in fotos ) {
		fotos[i].process(delta, mouse.getX(), mouse.getY());
	}

	for ( var i = 0; i < fotos.length; i++ ) {
		if ( fotos[i].isShowing() ) {
			if ( i > 0 ) {
				var temp = fotos[i];
				fotos.splice(i, 1)
				fotos.unshift(temp);
			}
		}
		if ( fotos[i].isControlled() ) {
			if ( i > 0 ) {
				if ( ! Foto.checkCollision(fotos[i], fotos[i-1]) ) {
					var tmp = fotos[i-1];
					fotos[i-1] = fotos[i];
					fotos[i] = tmp;
					i -= 2;
				}
			}
			
		}
	}
	canvas.process();
	fpsCount.tick();
}
