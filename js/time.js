var time = new function() {
	
	this.init = function() {
		this.nowTime = Date.now();
	}
	
	this.now = function() {
		return this.nowTime;
	}
	
	this.update = function() {
		var prevTime = this.nowTime;
		this.nowTime = Date.now();
		var diff     = this.nowTime - prevTime;
		return diff / 1000;
	}
	
	this.init();
};

