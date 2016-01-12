var mouse = new function Mouse() {
	
	this.init = function() {
		this.x       = 0;
		this.y       = 0;
		this.m1      = false;
		this.mDownCB = null;
		this.mUpCB   = null;

		window.addEventListener('mousemove', function(e) {
				mouse.processMove(e);
			});
	
		window.addEventListener('mousedown', function(e) {
				mouse.processDown(e);
			});

		window.addEventListener('mouseup', function(e) {
				mouse.processUp(e);
			});
	}
	
	this.getX       = function()        { return this.x;           }
	this.getY       = function()        { return this.y;           }
	this.isM1       = function()        { return this.m1;          }
	this.setMDownCB = function(f)       { this.mDownCB = f;        }
	this.setMUpCB   = function(f)       { this.mUpCB   = f;        }
	this.simulate   = function(x, y, m) { this.process(x, y, m);   }
	
	this.processDown = function(e) {
		if ( typeof e.clientX === "number" && typeof e.clientY === "number" ) {
			var point = new XY(e.clientX*globalScale, e.clientY*globalScale);
			this.process(point.x(), point.y(), true);
		}
	}

	this.processUp = function(e) {
		if ( typeof e.clientX === "number" && typeof e.clientY === "number" ) {
			var point = new XY(e.clientX*globalScale, e.clientY*globalScale);
			this.process(point.x(), point.y(), false);
		}
	}
	
	this.processMove = function(e) {
		if ( typeof e.clientX === "number" && typeof e.clientY === "number" && typeof e.buttons === "number" ) {
			var point = new XY(e.clientX*globalScale, e.clientY*globalScale);
			this.process(point.x(), point.y(), e.buttons === 1);
		}
	}
	
	this.process = function(x, y, m) {
		this.x = x;
		this.y = y;
	
		if ( m === true && this.m1 === false ) {
			this.m1 = true;
			if ( this.mDownCB ) { this.mDownCB() }
		}
		if ( m === false && this.m1 === true ) {
			this.m1 = false;
			if ( this.mUpCB ) { this.mUpCB() }
		}
	}
	
	this.init();
}

