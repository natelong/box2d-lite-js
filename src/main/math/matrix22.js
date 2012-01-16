#include "math/vector2.js"

/**
 * @fileoverview 2x2 Matrix Object
 */

// TODO: Fix this function signature doc
/**
 * A 2x2 Matrix for handling transformations of 2-dimensional points
 * @param {*} angle The starting angle of the matrix
 * @constructor
 * @typedef {(object)}
 */
Box2d.Math.Matrix22 = function Matrix22( angle ){
	/**
	 * A temporary cosine value for column calculations
	 * @type {number}
	 */
	var cosine;
	/**
	 * A temporary sine value for column calculations
	 * @type {number}
	 */
	var sin;
	
	// If there is only one argument and it's a number, then it's an angle, so find the sine and
	// cosine to get the starting values for the matrix
	if( arguments.length === 1 &&
			typeof arguments[0] === 'number' ){

		cosine = Math.cos( angle );
		sin = Math.sin( angle );
		
		this.col1 = new Box2d.Math.Vector2( cosine, sin );
		this.col2 = new Box2d.Math.Vector2( -sin, cosine );
	// If there are two arguments and they are both of type vector2, then assign them to the column
	// values of the matrix
	}else if( arguments.length === 2 &&
			arguments[0].type && arguments[0].type === Box2d.Math.Vector2.type &&
			arguments[1].type && arguments[1].type === Box2d.Math.Vector2.type ){
		this.col1 = arguments[0];
		this.col2 = arguments[1];
	// Otherwise, just initialize the matrix with zeroes
	}else{
		this.col1 = new Box2d.Math.Vector2();
		this.col2 = new Box2d.Math.Vector2();
	}
};

/**
 * Returns a new Matrix with transposed values (values are rotated 90 CW)
 * @this {Box2d.Math.Matrix22}
 * @return {Box2d.Math.Matrix22} The transposed matrix
 */
Box2d.Math.Matrix22.prototype.transpose = function transpose(){
	return new Box2d.Math.Matrix22(
		new Box2d.Math.Vector2( this.col1.x, this.col2.x ),
		new Box2d.Math.Vector2( this.col1.y, this.col2.y )
	);
};

/**
 * Sets the values of the matrix to the specified vectors
 * @param {Box2d.Math.Vector2} vec1 The desired value for the first column of the Matrix
 * @param {Box2d.Math.Vector2} vec2 The desired value for the second column of the Matrix
 */
Box2d.Math.Matrix22.prototype.set = function set( vec1, vec2 ){
	this.col1 = vec1;
	this.col2 = vec2;
};

/**
 * Multiplies a Matrix by another Matrix (necessary since JS doesn't support operator overloading
 * @this {Box2d.Math.Matrix22}
 * @param {(Box2d.Math.Matrix22|Box2d.Math.Vector2)} x The matrix or vector by which to multiply
 *  the current matrix
 * @return {Box2d.Math.Matrix22} The matrix that results from the multiply operation
 */
Box2d.Math.Matrix22.prototype.mul = function mul( x ){
	/**
	 * The resulting matrix
	 * @type {Box2d.Math.Matrix22}
	 */
	var output;

	if( x instanceof Box2d.Math.Vector2 ){
		output = new Box2d.Math.Vector2(
			this.col1.x * x.x + this.col2.x * x.y,
			this.col1.y * x.x + this.col2.y * x.y
		);
	}else if( x instanceof Box2d.Math.Matrix22 ){
		output = new Box2d.Math.Matrix22(
			this.mul( x.col1 ),
			this.mul( x.col2 )
		);
	}else{
		throw 'Argument must be of type "Vector2" or "number"';
	}
	return output;
};

/**
 * Gets the a new matrix where the values are the absolute values of the current matrix
 * @this {Box2d.Math.Matrix22}
 * @return {Box2d.Math.Matrix22} The absolute value matrix
 */
Box2d.Math.Matrix22.prototype.abs = function abs(){
	return new Box2d.Math.Matrix22(
		Box2d.Math.Vector2.abs( this.col1 ),
		Box2d.Math.Vector2.abs( this.col2 )
	);
};