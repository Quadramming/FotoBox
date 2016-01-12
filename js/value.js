function Value(input) {
	this.val = (input === undefined) ? 0 : input;
	
	this.clear = function() { 
		this.val = 0;
	}

	this.invert = function() {
		this.val *= -1;
	}

	this.v = function(input) {
		if ( input !== undefined && input !== null ) {
			this.val = input;
		}
		return this.val;
	}
	
	this.isClear = function() {
		return this.val == 0;
	}
}

function XY(inX, inY) {
	this.m_x = new Value(inX);
	this.m_y = new Value(inY);

	this.x = this.X = this.w = this.W = this.width = this.Width = function(input) {
		return this.m_x.v(input);
	}

	this.y = this.Y = this.h = this.H = this.height = this.Height = function(input) {
		return this.m_y.v(input);
	}

	this.clearX  = function() { this.m_x.clear()  }
	this.clearY  = function() { this.m_y.clear()  }
	this.invertX = function() { this.m_x.invert() }
	this.invertY = function() { this.m_y.invert() }

	this.clear = function() {
		this.m_x.clear();
		this.m_y.clear();
	}
	
	this.set = function(inX, inY) {
		this.m_x.v(inX);
		this.m_y.v(inY);
	}
	
	this.isClear = function() {
		return this.m_x.isClear() && this.m_y.isClear();
	}
}

function XYA(inX, inY, inA) {
	this.m_xy = new XY(inX, inY);
	this.m_a  = new Value(inA);

	for ( var prop in this.m_xy ) {
		if ( typeof this.m_xy[prop] === 'function' ) {
			this[prop] = new function(property, self) {
				return function (input) {
					return this.m_xy[property](input);
				}.bind(self);
			}(prop, this);
		}
	}

	this.z = this.Z = this.a = this.A = this.angle = this.Angle = function(input) {
		return this.m_a.v(input);
	}

	this.clearZ  = function() { this.m_z.clear() }
	this.invertZ = function() { this.m_z.invert() }

	this.clear = function() {
		this.m_xy.clear();
		this.m_a.clear();
	}
	
	this.isClear = function() {
		return this.m_xy.isClear() && this.m_a.isClear();
	}

	this.set = function(inX, inY, inZ) {
		this.m_xy.set(inX, inY);
		this.m_a.v(inZ);
	}
}
