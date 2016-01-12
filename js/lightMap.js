var lightImg = new function() {

	this.init = function() {
		this.imgReady   = false;
		this.img        = new Image;
		this.img.src    = "./img/light.png";
		this.img.onload = function () {
			this.imgReady = true;
			askFullRedraw();
		}.bind(this);
	}
	
	this.draw = function(context, w, h) {
		if ( this.imgReady ) {
			context.setTransform(1, 0, 0, 1, 0, 0, 0);
			//var state = context.globalCompositeOperation;
			//context.globalCompositeOperation = "multiply"; // TOO HARD
			//console.log(max);
			var max = w > h ? w : h;
			var x   = w > h ? 0 : -(h-w)/2;
			context.drawImage(this.img, x, 0, max, max);
			//context.globalCompositeOperation = state;
		}
	}
	
	this.init();
};

