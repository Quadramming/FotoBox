FotoState.states = {
	FREE       : 0,
	SHOWINGIN  : 1,
	SHOWING    : 2,
	SHOWINGOUT : 3,
	CONTROL    : 4
}

function FotoState(inState, inOwner) {
	this.owner = inOwner;
	this.set(inState);
}

FotoState.prototype.set = function(inState) {
	this.owner.needPaint = true;
	this.state  = inState;
	this.params = this.getCurrentParams();
}

FotoState.prototype.getCurrentParams = function() {
	return {
		x        : this.owner.x,
		y        : this.owner.y,
		angle    : this.owner.angle,
		scale    : this.owner.scale,
		time     : time.now()
	};
}

FotoState.prototype.isEqual = function(inState) {
	return this.state == inState;
} 

FotoState.prototype.isParamsEqual = function(A) {
	return  A.x        == this.params.x        && 
			A.y        == this.params.y        && 
			A.angle    == this.params.angle    && 
			A.scale    == this.params.scale     ;
}

FotoState.prototype.getParams = function(A) { return this.params }
