var PI   = Math.PI;
var PIx2 = Math.PI*2;

function rand(min, max, round) {
	if ( round ) {
		return Math.round(Math.random() * (max - min)) + min;
	} else {
		return Math.random() * (max - min) + min;
	}
}

function reduceToSize(w, h, size) {
	var scale = 1;
	if ( w > size ) {
		scale = size / w;
	}
	if ( h > size ) {
		var tmp = size / h;
		if ( tmp < scale ) { 
			scale = tmp;
		}
	}
	return scale;
}

function scaleToSize(w, h, size) {
	var scaleW = size / w;
	var scaleH = size / h;
	return scaleW < scaleH ? scaleW : scaleH;
}

function devideAngle(angle) {
	if ( angle > PI ) {
		angle -= PIx2;
	}
	if ( angle < -PI ) {
		angle += PIx2;
	}
	return angle;
} 

function sinBetweenVectors(ax, ay, bx, by) {
	var mul  = ax*bx + ay*by;
	var lenA = sqrt(ax*ax + ay*ay);
	var lenB = sqrt(bx*bx + by*by);
	var cos  = mul / (lenA*lenB);
	var arg  = 1 - cos*cos;
	if ( arg < 0 ) {
		arg = 0;
	} 
	return sqrt(arg);
}

function getSign(x) { return x >= 0 ? 1 : -1; }
function sin(a)     { return Math.sin(a);     }
function cos(a)     { return Math.cos(a);     }
function sqrt(a)    { return Math.sqrt(a);    }
function floor(a)   { return Math.floor(a);   }
function ceil(a)    { return Math.ceil(a);    }
function round(a)   { return Math.round(a);   }
function abs(a)     { return Math.abs(a);     }
function pow(a, b)  { return Math.pow(a, b);  }

