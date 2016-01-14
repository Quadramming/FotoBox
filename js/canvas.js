function Canvas() {
	
	this.create = function() {
		this.width                 = window.innerWidth  * globalScale;
		this.height                = window.innerHeight * globalScale;
		this.maxSize               = this.width < this.height ? this.height : this.width;
		this.mainSize              = this.width < this.height ? this.width  : this.height;
		this.mainSizePercent       = this.mainSize / 100;
		this.canvas                = document.createElement("canvas");
		this.canvas.id             = "mainCanvas";
		this.canvas.width          = this.width;
		this.canvas.height         = this.height;
		this.canvas.style.width    = "100%";
		this.canvas.style.height   = "100%";
		this.context               = this.canvas.getContext("2d");
		document.body.appendChild(this.canvas);
	}
	
	this.resize = function() {
		document.body.removeChild(this.canvas);
		this.create();
		askFullRedraw();
	}	
	
	this.drawAll = function() {
		this.context.save();
	
		this.context.beginPath();
		for ( var i in fotos ) {
			fotos[i].addClip(this.context);
		}
		if ( ! fullRedraw ) { 
			//this.context.rect(0, 0, 50, 50); // FPS
			this.context.clip();
		} else {
			fullRedraw = false;
		}
		
		bgImg.draw(this.context, this.width, this.height);
		for ( var i = fotos.length-1; i >= 0; i-- ) {
			fotos[i].draw(this.context);
		}
		lightImg.draw(this.context, this.width, this.height);
		
		//fpsCount.draw(this.context);
		this.context.restore();
	}
	
	this.process = function() {
		for ( var i in fotos ) {
			var foto = fotos[i];
			if ( foto.getX() >  this.width ) { foto.isControlled() ? foto.killImpactX() : foto.invertVelX(); foto.setX(this.width)  }
			if ( foto.getX() <           0 ) { foto.isControlled() ? foto.killImpactX() : foto.invertVelX(); foto.setX(0)           }
			if ( foto.getY() > this.height ) { foto.isControlled() ? foto.killImpactY() : foto.invertVelY(); foto.setY(this.height) }
			if ( foto.getY() <           0 ) { foto.isControlled() ? foto.killImpactY() : foto.invertVelY(); foto.setY(0)           }
		}
	}
	
	this.getWidth           = function() { return this.width           }
	this.getHeight          = function() { return this.height          }
	this.getMainSizePercent = function() { return this.mainSizePercent }
	
	this.create();
};

