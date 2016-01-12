var fpsCount = new function() {
	
	this.init = function() {
		this.prevTime    = time.now();
		this.fpsShowTime = 0;
		this.fps         = 0;
		this.showFps     = 0;
	}
	
	this.tick = function() {
		this.fps++;
		if ( (time.now() - this.prevTime) > 1000 ) {
			this.prevTime = time.now();
			this.showFps = this.fps;
			this.fps = 0;
		}
	}
	
	this.draw = function(context) {
		context.setTransform(1, 0, 0, 1, 0, 0, 0);
		context.fillStyle = "#FF0000";
		context.font      = "15px Verdana";
		context.fillText(this.showFps + " FPS", 0, 20);
		//console.log(this.showFps);
	}
	
	this.init();
};
