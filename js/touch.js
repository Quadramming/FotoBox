var touch = new function Touch() {

	this.init = function() {
		this.x = 0;
		this.y = 0;
	
		window.addEventListener('touchstart', function(e) {
			touch.processTouchStart(e);
			e.preventDefault();
		});

		window.addEventListener('touchmove', function(e) {
			touch.processTouchMove(e);
			e.preventDefault();
		});

		window.addEventListener('touchend', function(e) {
			touch.processTouchEnd(e);
			e.preventDefault();
		});
	}

	this.processTouchStart = function(e) {
		var touchobj = e.touches[0];
		if ( typeof touchobj.clientX === "number" && typeof touchobj.clientY === "number" ) {
			this.x = touchobj.clientX;
			this.y = touchobj.clientY;
			mouse.simulate(this.x, this.y, true);
		}
	}
	
	this.processTouchMove = function(e) {
		var touchobj = e.touches[0];
		if ( typeof touchobj.clientX === "number" && typeof touchobj.clientY === "number" ) {
			this.x = touchobj.clientX;
			this.y = touchobj.clientY;
			mouse.simulate(this.x, this.y, true);
		}
	}
	
	this.processTouchEnd = function(e) {
		mouse.simulate(this.x, this.y, false);
	}

	this.init();
}

