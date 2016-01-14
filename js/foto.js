function Foto(inUrlImg, inUrlImgThumb, inX, inY, inAngle, isBordered) {			
	this.init(inUrlImg, inUrlImgThumb, inX, inY, inAngle, isBordered);
}

Foto.prototype.init = function(inUrlImg, inUrlImgThumb, inX, inY, inAngle, isBordered) {
	this.moveMultiply    = 5;
	this.spinMultiply    = 1.5;
	this.showingSpeed    = 250;
	this.maxThumbSizePc  = 50;
	this.maxFullSizePc   = 95;
	this.shadowSize      = 3;
	this.needPaint       = true;
	
	this.isBordered      = isBordered;
	this.x               = inX;
	this.y               = inY;
	this.angle           = inAngle;
	this.velocity        = new XYA();
	this.dragPos         = new XY();
	this.thumbParams     = {};
	this.state           = new FotoState(FotoState.states.FREE, this);
	this.sizeThumb       = new XY();
	this.sizeFull        = new XY();
	this.oldClipVertexs  = {};
	
	this.img = new FotoImg(inUrlImg, function() {
				this.initSizes();
			}.bind(this)
		);
	this.imgThumb = new FotoImg(inUrlImgThumb, function() {
				this.initSizes();
			}.bind(this)
		);
}

Foto.prototype.initSizes = function() {
	if ( this.imgThumb.isReady() && this.img.isReady() ) {
		this.border          = this.isBordered ? pc(1) : 0;
		
		this.scaleThumb      = reduceToSize(this.imgThumb.width(), this.imgThumb.height(), pc(this.maxThumbSizePc));
		this.scale           = this.scaleThumb === 1 ? 
								this.imgThumb.width() / this.img.width() : 
								reduceToSize(this.img.width(), this.img.height(), pc(this.maxThumbSizePc));

		this.scaleFull = scaleToSize(this.img.width(), this.img.height(), pc(this.maxFullSizePc));
		
		this.sizeThumb.width(this.imgThumb.width()   + this.border/this.scaleThumb);
		this.sizeThumb.height(this.imgThumb.height() + this.border/this.scaleThumb);
		this.sizeFull.width(this.img.width()   + this.border/this.scale);
		this.sizeFull.height(this.img.height() + this.border/this.scale);
		
		this.radius = sqrt(pow(this.sizeThumb.width()/2, 2) + pow(this.sizeThumb.height()/2, 2)) * this.scaleThumb;
	}
}

Foto.prototype.getVertexs = function() {
	return [
		this.toWorld(-this.sizeThumb.width()/2, -this.sizeThumb.height()/2),
		this.toWorld( this.sizeThumb.width()/2, -this.sizeThumb.height()/2),
		this.toWorld( this.sizeThumb.width()/2,  this.sizeThumb.height()/2),
		this.toWorld(-this.sizeThumb.width()/2,  this.sizeThumb.height()/2)
	];
}

Foto.prototype.getClipRect = function() {
	var ext  = this.shadowSize + 3;
	var size = this.isThumb() ? this.sizeThumb : this.sizeFull;
	var obj = [
			this.toWorldInt(-size.width()/2 - ext, -size.height()/2 - ext),
			this.toWorldInt( size.width()/2 + ext, -size.height()/2 - ext),
			this.toWorldInt( size.width()/2 + ext,  size.height()/2 + ext),
			this.toWorldInt(-size.width()/2 - ext,  size.height()/2 + ext)
		];
		
	var Xmax, Ymax, Xmin, Ymin;
	for ( var i = 0; i < 4; i++ ) {
		if ( obj[i].x > Xmax || i === 0 ) { Xmax = obj[i].x }
		if ( obj[i].y > Ymax || i === 0 ) { Ymax = obj[i].y }
		if ( obj[i].x < Xmin || i === 0 ) { Xmin = obj[i].x }
		if ( obj[i].y < Ymin || i === 0 ) { Ymin = obj[i].y }
	}
	return { x: Xmin, y: Ymin, w: Xmax - Xmin, h: Ymax - Ymin};
}

Foto.prototype.getMatrix = function() {
	var scale = this.isThumb() ? this.scaleThumb : this.scale;
	var M = mulMatrix( getRotateMatrix(this.angle), getMoveMatrix(this.x,this.y) );
	    M = mulMatrix( getScaleMatrix(scale, scale), M );
	return M;
}

Foto.prototype.getInverseMatrix = function() {
	return inverseMatrix(this.getMatrix());
}

Foto.prototype.toWorldInt = function(x, y) {
	var xy = this.toWorld(x, y);
	return {x: ceil(xy.x), y: ceil(xy.y)};
}

Foto.prototype.toWorld = function(x, y) {
	var M = mulMatrix( [[x, y, 1]], this.getMatrix() );
	return {x: M[0][0], y: M[0][1]};
}

Foto.prototype.toLocal = function(x, y) {
	var M = mulMatrix( [[x, y, 1]], this.getInverseMatrix() );
	return {x: M[0][0], y: M[0][1]};
}

Foto.prototype.isHit = function(x, y) {
	var localPos = this.toLocal(x, y);
	var size     = this.isThumb() ? this.sizeThumb : this.sizeFull;
	if ( abs(localPos.x) < size.width()/2 && abs(localPos.y) < size.height()/2 ) {
		if ( ! this.isBordered ) {
			var locX      = round(localPos.x + size.width()/2);
			var locY      = round(localPos.y + size.height()/2);
			var color     = this.imgThumb.getPixel(locX, locY);
			if ( color.a !== 0 ) {
				return true;
			}
		} else {
			return true;
		}
	}
	return false;
}

Foto.prototype.process = function(delta, x, y) {
	this.oldClipVertexs = this.getClipRect();
	
	if ( this.state.isEqual(FotoState.states.FREE) ) {
		this.processMoveing(delta);
		this.calcFriction(this.velocity, delta);
	}
	if ( this.state.isEqual(FotoState.states.CONTROL) ) {
		this.processMoveing(delta);
		var localPos = this.toLocal(x, y);
		this.calcImpact(localPos.x, localPos.y);
	}
	if ( this.state.isEqual(FotoState.states.SHOWINGIN) || this.state.isEqual(FotoState.states.SHOWINGOUT) ) {
		var delta = time.now() - this.state.getParams().time;
		var passed = delta / this.showingSpeed;
		var remain = (1 - passed);
		if ( delta > this.showingSpeed ) {
			passed = 1;
			remain = 0;
		}
		if ( this.state.isEqual(FotoState.states.SHOWINGIN) ) {
			this.x        = this.state.getParams().x        * remain + passed * canvas.getWidth()/2;
			this.y        = this.state.getParams().y        * remain + passed * canvas.getHeight()/2;
			this.angle    = this.state.getParams().angle    * remain;
			this.scale    = this.state.getParams().scale    * remain + passed * this.scaleFull;
		}
		if ( this.state.isEqual(FotoState.states.SHOWINGOUT) ) {
			this.x        = this.thumbParams.x        * passed + remain * canvas.getWidth()/2;
			this.y        = this.thumbParams.y        * passed + remain * canvas.getHeight()/2;
			this.angle    = this.thumbParams.angle    * passed;
			this.scale    = this.thumbParams.scale    * passed + remain * this.scaleFull;
		}
		if ( passed === 1 ) {
			if ( this.state.isEqual(FotoState.states.SHOWINGIN)  ) { this.state.set(FotoState.states.SHOWING) }
			if ( this.state.isEqual(FotoState.states.SHOWINGOUT) ) { this.state.set(FotoState.states.FREE)    }
		}
	}
}

Foto.prototype.addClip = function(context) {
	if ( this.isReady() && this.isNeedPaint() ) {
		var vertexs = [this.getClipRect(), this.oldClipVertexs];
		for ( var i in vertexs ) {
			var v = vertexs[i];
			context.rect(v.x, v.y, v.w, v.h);
		}
		this.needPaint = false;
	}
}

Foto.prototype.processMoveing = function(delta) {
	this.x     += this.velocity.x() * delta;
	this.y     += this.velocity.y() * delta;
	this.angle += this.velocity.a() * delta;
	this.angle  = devideAngle(this.angle);
}

Foto.prototype.calcImpact = function(x, y) {
	dX = (x - this.dragPos.x()) * this.moveMultiply * this.scaleThumb;
	dY = (y - this.dragPos.y()) * this.moveMultiply * this.scaleThumb;
	
	if ( dX == 0 && dY == 0 ) { 
		return; 
	}
	
	var dist = sqrt(dX*dX + dY*dY);
	var sinA = sinBetweenVectors(x, y, dX, dY);
	var sign = getSign(y*dX - x*dY);
	var dA   = this.spinMultiply*sign*sinA*dist / 100;

	this.velocity.set(
		dX*cos(this.angle) + dY*sin(this.angle),
		dY*cos(this.angle) - dX*sin(this.angle),
		dA
	);
}

Foto.prototype.calcFriction = function(velocity, delta) {
	var moveFriction    = 2000;
	var rotateFrciction = 2;//2;

	function calc(val, friction) {
		var sign = getSign(val);
		if ( val == 0 ) {
			return 0;
		} else {
			val -= sign * friction;
			if ( sign != getSign(val) ) {
				return 0;
			}
			return val;
		}
	}

	var deltaFriction = moveFriction * delta;

	velocity.set(
		calc(velocity.x(), deltaFriction),
		calc(velocity.y(), deltaFriction),
		calc(velocity.a(), rotateFrciction*delta) 
	);
}

Foto.prototype.setCaught = function(setCaught, x, y) {
	if ( this.state.isEqual(FotoState.states.CONTROL) || this.state.isEqual(FotoState.states.FREE) ) {
		var localPos = this.toLocal(x, y);
		this.dragPos.set(localPos.x, localPos.y);
		if ( setCaught ) {
			 this.state.set(FotoState.states.CONTROL);
		} else {
			if ( this.state.isParamsEqual(this.state.getCurrentParams()) ) {
				this.thumbParams = this.state.getCurrentParams();
				this.state.set(FotoState.states.SHOWINGIN);
				this.velocity.clear();
			} else {
				this.state.set(FotoState.states.FREE);
			}
		}
	}
}

Foto.prototype.endShowing = function() {
	if ( this.isShowing() ) {
		this.state.set(FotoState.states.SHOWINGOUT);
	}
}

Foto.prototype.isControlled = function()  { return this.state.isEqual(FotoState.states.CONTROL)      }
Foto.prototype.isShowing    = function()  { return this.state.isEqual(FotoState.states.SHOWING)     || 
												   this.state.isEqual(FotoState.states.SHOWINGIN)    }
Foto.prototype.isZooming    = function()  { return this.state.isEqual(FotoState.states.SHOWINGOUT)  || 
												   this.state.isEqual(FotoState.states.SHOWINGIN)    }
Foto.prototype.getX         = function()  { return this.x                                            }
Foto.prototype.getY         = function()  { return this.y                                            }
Foto.prototype.getRadius    = function()  { return this.radius                                       }
Foto.prototype.invertVelX   = function()  { this.velocity.invertX()                                  }
Foto.prototype.invertVelY   = function()  { this.velocity.invertY()                                  }
Foto.prototype.setX         = function(x) { this.x = x                                               }
Foto.prototype.setY         = function(y) { this.y = y                                               }
Foto.prototype.killImpactX  = function()  { this.velocity.clearX()                                   }
Foto.prototype.killImpactY  = function()  { this.velocity.clearY()                                   }
Foto.prototype.isThumb      = function()  { return !this.state.isEqual(FotoState.states.SHOWING)    && 
												   !this.state.isEqual(FotoState.states.SHOWINGIN)  &&
												   !this.state.isEqual(FotoState.states.SHOWINGOUT)  }
Foto.prototype.isNeedPaint  = function()  { return !this.velocity.isClear()                         || 
													this.isZooming()                                || 
													this.needPaint                                   }
Foto.prototype.isReady      = function()  { return this.imgThumb.isReady() && this.img.isReady()     }


Foto.prototype.reduceShadowOffset = function(offset) {
	return abs(offset) > this.shadowSize ? getSign(offset)*this.shadowSize : offset;
}

Foto.prototype.draw = function(context) {
	if ( this.imgThumb.isReady() && this.img.isReady() && fotoPapper.isReady() ) {
		var M = this.getMatrix();
		context.setTransform(M[0][0], M[0][1], M[1][0], M[1][1], M[2][0], M[2][1]);
		if ( this.isThumb() ) {
			if ( this.isBordered ) {
			    var shadowXOffset = this.reduceShadowOffset( (this.x - canvas.getWidth()/2) / 100 );
			    var shadowYOffset = this.reduceShadowOffset( this.y / 100 );

			    context.globalAlpha = 0.5;
				context.setTransform(M[0][0], M[0][1], M[1][0], M[1][1], M[2][0]+shadowXOffset, M[2][1]+shadowYOffset);
				context.fillStyle = "#000000";
				context.fillRect(-this.sizeThumb.width()/2, -this.sizeThumb.height()/2, this.sizeThumb.width(), this.sizeThumb.height());
				
				context.globalAlpha = 1;
				context.setTransform(M[0][0], M[0][1], M[1][0], M[1][1], M[2][0], M[2][1]);
				context.fillStyle = "#ffffff";
				context.fillRect(-this.sizeThumb.width()/2, -this.sizeThumb.height()/2,   this.sizeThumb.width(), this.sizeThumb.height());
				
				this.imgThumb.draw(context);
				fotoPapper.draw(context,this.sizeThumb.width(), this.sizeThumb.height(), false);
			} else {
				this.imgThumb.draw(context);
			}
		} else {
			if ( this.isBordered ) {
				context.fillStyle = "#ffffff";
				context.fillRect(-this.sizeFull.width()/2, -this.sizeFull.height()/2,   this.sizeFull.width(), this.sizeFull.height());
				this.img.draw(context);
				fotoPapper.draw(context,this.sizeFull.width(), this.sizeFull.height(), true);
			} else {
				this.img.draw(context);
			}
		}
	}
}

Foto.checkCollision = function(A, B) {
	function checkDist(first, second) {
		var dX   = first.getX() - second.getX();
		var dY   = first.getY() - second.getY();
		var dist = sqrt(dX*dX + dY*dY);
		return dist <= first.getRadius() + second.getRadius()
	}

	function checkVertexs(first, second) {
		var vertexs = first.getVertexs();
		for ( var i in vertexs ) {
			if ( second.isHit(vertexs[i].x, vertexs[i].y) ) {
				return true;
			}
		}
		return false;
	}

	function checkCenter(first, second) {
		return first.isHit(second.getX(), second.getY());
	}

	return checkDist(A, B) && ( checkCenter(A, B) || checkCenter(B, A) || checkVertexs(A, B) || checkVertexs(B, A) );
}

