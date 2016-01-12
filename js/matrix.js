function getScaleMatrix(x, y) {
	return  [[x, 0, 0], 
			 [0, y, 0], 
			 [0, 0, 1]];
}

function getMoveMatrix(x, y) {
	return  [[1, 0, 0], 
			 [0, 1, 0], 
			 [x, y, 1]];
}

function getRotateMatrix(a) {
	return [[cos(a), -sin(a), 0],
			[sin(a),  cos(a), 0],
			[     0,       0, 1]];
}

function determinantMatrix(A) {
    var N         = A.length;
	var B         = [];
	var denom     = 1; 
	var exchanges = 0;
	for ( var i = 0; i < N; ++i ) { 
		B[i] = [];
		for ( var j = 0; j < N; ++j ) {
			B[i][j] = A[i][j];
		}
	}
	for ( var i = 0; i < N-1; ++i ) { 
		var maxN     = i; 
		var maxValue = abs(B[i][i]);
		for ( var j = i+1; j < N; ++j ) { 
			var value = abs(B[j][i]);
			if ( value > maxValue ) { 
				maxN = j; maxValue = value; 
			}
		}
		if ( maxN > i ) { 
			var t   = B[i]; 
			B[i]    = B[maxN]; 
			B[maxN] = t;
			++exchanges;
		} else { 
			if ( maxValue == 0 ) { 
				return maxValue; 
			}
		}
		var value1 = B[i][i];
		for ( var j = i+1; j < N; ++j ) { 
			var value2 = B[j][i];
			B[j][i] = 0;
			for ( var k = i+1; k < N; ++k ) { 
				B[j][k] = (B[j][k] * value1 - B[i][k] * value2) / denom;
			}
		}
		denom = value1;
	}
	if ( exchanges%2 ) {
		return -B[N-1][N-1];
	} else {
		return  B[N-1][N-1];
	}
}

function inverseMatrix(A) {
	var det = determinantMatrix(A);
	if ( det == 0 ) {
		return false;
	}
	var N    = A.length;
	var invA = [];
	for ( var i = 0; i < N; i++ ) {
		invA[i] = [];
		for ( var j = 0; j < N; j++ ) {
			var B    = [];
			var sign = ((i+j) % 2 == 0) ? 1 : -1;
			for ( var m = 0; m < j; m++ ) { 
				B[m] = [];
				for ( var n = 0; n < i; n++ ) {
					B[m][n] = A[m][n];
				}
				for ( var n = i+1; n < N; n++ ) {
					B[m][n-1] = A[m][n];
				}
			}
			for ( var m = j+1; m < N; m++ ) { 
				B[m-1] = [];
				for ( var n = 0; n < i; n++ ) { 
					B[m-1][n] = A[m][n];
				}
				for ( var n = i+1; n < N; n++ ) { 
					B[m-1][n-1] = A[m][n];
				}
			}
			invA[i][j] = sign * determinantMatrix(B) / det;
		}
	}
    return invA;
}

function mulMatrix(A, B) {
	var rowsA = A.length;
	var colsA = A[0].length;
	var rowsB = B.length;
	var colsB = B[0].length;
	var C     = [];

	if ( colsA != rowsB ) {
		return false;
	}
	for ( var i = 0; i < rowsA; i++ ) {
		C[i] = [];
	}
	for ( var k = 0; k < colsB; k++ ) { 
		for ( var i = 0; i < rowsA; i++ ) { 
			var temp = 0;
			for ( var j = 0; j < rowsB; j++ ) {
				temp += A[i][j]*B[j][k];
			}
			C[i][k] = temp;
		}
	 }
	return C;
}

