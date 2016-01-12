var fotoPapper = new function FotoPapper() {

	function Img(inUrl) {
		this.ready           = false;
		this.img             = new Image;
		this.img.src         = inUrl;
		this.img.crossOrigin = "anonymous";
		this.img.onload      = function() {
			this.ready = true;
		}.bind(this);
		
		this.isReady = function() { return this.ready }
		this.get     = function() { return this.img   }
	}

	this.img      = new Img("./img/papper.png");
	this.imgThumb = new Img("./img/papperThumb.png");

	this.draw = function(context, x, y, isThumb) {
		if ( this.isReady() ) { 
			isThumb ? 
				context.drawImage(this.img.get(),      -x/2, -y/2, x, y):
				context.drawImage(this.imgThumb.get(), -x/2, -y/2, x, y);
		}
	}

	this.isReady = function() { return this.img.isReady() && this.imgThumb.isReady() }
}
