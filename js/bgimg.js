var bgImg = new function() {

	this.init = function() {
		this.bgColor    = "#6a4632";
		this.imgReady   = false;
		this.img        = new Image;
		this.img.src    = "./img/wood.jpg";
		this.img.onload = function () {
			this.imgReady = true;
			askFullRedraw();
		}.bind(this);
	}
	
	this.draw = function(context, w, h) {
		if ( this.imgReady ) {
			context.setTransform(1, 0, 0, 1, 0, 0, 0);
			context.drawImage(this.img, 0, 0, w, h);
		} else {
			context.fillStyle = this.bgColor;
			context.fillRect(0, 0, w, h);
		}
	}
	
	this.init();
};

