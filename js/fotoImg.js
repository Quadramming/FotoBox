function FotoImg(inUrlImg, inOnloadCB) {
	this.size            = new XY();
	this.img             = new Image;
	this.img.src         = inUrlImg;
	this.img.crossOrigin = "anonymous";
	this.img.onload      = function() {
		this.size.set(this.img.width, this.img.height);
		inOnloadCB();
	}.bind(this);
}

FotoImg.prototype.getImageData = function() {
	var canvas    = document.createElement('canvas');
	canvas.width  = this.size.width();
	canvas.height = this.size.height();
	var context   = canvas.getContext('2d');
	context.drawImage(this.img, 0, 0);
	return context.getImageData(0, 0, this.img.width, this.img.height);
}

FotoImg.prototype.getPixel = function(x, y) {
	var imageData = this.getImageData();
	var position  = ( x + imageData.width * y ) * 4, data = imageData.data;
	return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };
}

FotoImg.prototype.draw = function(context) {
	context.drawImage(this.img, -this.size.x()/2, -this.size.y()/2, this.size.x(), this.size.y());
}

FotoImg.prototype.isReady = function() { return this.size.x() != 0 }
FotoImg.prototype.width   = function() { return this.size.width()  }
FotoImg.prototype.height  = function() { return this.size.height() }

