/* UNUSED
function CacheMatrix() {
	this.init = function() {
		this.value = null;
		this.x     = 0;
		this.y     = 0;
		this.angle = 0;
		this.scale = 0;
	}
	
	this.check = function(x, y, angle, scale) {
		return x === this.x && y === this.y && angle === this.angle && scale === this.scale;
	}
	
	this.get = function() {
		return this.value;
	}
	
	this.set = function(value, x, y, angle, scale) {
		this.value = value;
		this.x     = x;
		this.y     = y;
		this.angle = angle;
		this.scale = scale;
	}
	
	this.init();
}

this.getMatrix = function() {
	if ( this.cacheMatrix.check(this.x, this.y, this.angle, this.scale) ) {
		return this.cacheMatrix.get();
	} else {
		var M = mulMatrix( getRotateMatrix(this.angle), getMoveMatrix(this.x,this.y) );
		    M = mulMatrix(getScaleMatrix(this.scale, this.scale), M);
		this.cacheMatrix.set(M, this.x, this.y, this.angle, this.scale);
		return M;
	}
}

this.getInverseMatrix = function() {
	if ( this.cacheInvMatrix.check(this.x, this.y, this.angle, this.scale) ) {
		return this.cacheInvMatrix.get();
	} else {
		var M = inverseMatrix(this.getMatrix());
		this.cacheInvMatrix.set(M, this.x, this.y, this.angle, this.scale);
		return M;
	}
}

*/
