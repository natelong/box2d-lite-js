/**
 * @license Copyright (c) 2011 Nate Long
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @fileoverview 2-dimensional vector object
 */

goog.provide( 'Box2d.Math.Vector2' );

/**
 * A 2-dimensional vector object to track 2d points and velocities
 * @constructor
 * @typedef {(object)}
 * @notypecheck
 */
Box2d.Math.Vector2 = function Vector2(){
	if( arguments.length === 2  &&
			typeof arguments[0] === 'number' &&
			typeof arguments[1] === 'number' ){
		this.x = arguments[0];
		this.y = arguments[1];
	}else if( arguments.length === 0 ){
		this.x = 0;
		this.y = 0;
	}else{
		throw 'Arguments must be 2 numbers or nothing at all';
	}
	this.type = Box2d.Math.Vector2.type;
};

Box2d.Math.Vector2.type = 'vector2';

/**
 * Set the internal values of the vector
 * @param {number} x The x component of the vector
 * @param {number} y The y component of the vector
 * @notypecheck
 */
Box2d.Math.Vector2.prototype.set = function set( x, y ){
	if( arguments.length === 2 &&
			typeof arguments[0] === 'number' &&
			typeof arguments[1] === 'number' ){
		this.x = arguments[0];
		this.y = arguments[1];
	}else if( arguments.length === 1 && arguments[0].type === Box2d.Math.Vector2.type ){
		this.x = arguments[0].x;
		this.y = arguments[0].y;
	}else{
		throw 'Argument must be 2 numbers or 1 "Vector2"';
	}
};

/**
 * Return a negated version of the Vector
 * @return {Box2d.Math.Vector2} The negated vector
 */
Box2d.Math.Vector2.prototype.neg = function neg(){
	return new Box2d.Math.Vector2( -this.x, -this.y );
};

/**
 * Add two vectors and return a new vector based on the output
 * @param {Box2d.Math.Vector2} x The vector to be added to the current vector
 * @return {Box2d.Math.Vector2} A new vector that is the result of the addition
 */
Box2d.Math.Vector2.prototype.add = function add( x ){
	var output = new Box2d.Math.Vector2( this.x, this.y );
	if( typeof x === 'number' ){
		output.x += x;
		output.y += x;
	}else if( x instanceof Box2d.Math.Vector2 ){
		output.x += x.x;
		output.y += x.y;
	}else{
		throw 'Argument must be of type "Vector2" or "number"';
	}
	return output;
};

/**
 * Subtract a vector from the current vector and return a new vector based on the output
 * @param {Box2d.Math.Vector2} x The vector to be subtracted from the current vector
 * @return {Box2d.Math.Vector2} A new vector that is the result of the subtraction
 */
Box2d.Math.Vector2.prototype.sub = function sub( x ){
	var output = new Box2d.Math.Vector2( this.x, this.y );
	if( typeof x === 'number' ){
		output.x -= x;
		output.y -= x;
	}else if( x.type && x.type === Box2d.Math.Vector2.type ){
		output.x -= x.x;
		output.y -= x.y;
	}else{
		throw 'Argument must be of type "Vector2" or "number"';
	}
	return output;
};

/**
 * Multiply two vectors and return a new vector based on the output
 * @param {Box2d.Math.Vector2} x The vector to be multiplied by the current vector
 * @return {Box2d.Math.Vector2} A new vector that is the result of the multiplication
 */
Box2d.Math.Vector2.prototype.mul = function mul( x ){
	var output = new Box2d.Math.Vector2( this.x, this.y );
	if( typeof x === 'number' ){
		output.x *= x;
		output.y *= x;
	}else if( x.type && x.type === Box2d.Math.Vector2.type ){
		output.x *= x.x;
		output.y *= x.y;
	}else{
		throw 'Argument must be of type "Vector2" or "number"';
	}
	return output;
};

/**
 * Compute the dot product of the current vector and a passed vector
 * @param {Box2d.Math.Vector2} x The vector to be with which to calculate the dot product
 * @return {number} The result of the calculation
 */
Box2d.Math.Vector2.prototype.dot = function dot( x ){
	return Box2d.Math.Vector2.dot( this, x );
};

/**
 * Square the current vector and return a new vector based on the output
 * @return {Box2d.Math.Vector2} A new vector that is the current vector squared
 */
Box2d.Math.Vector2.prototype.square = function square(){
	return new Box2d.Math.Vector2( this.x * this.x, this.y * this.y );
};

/**
 * Get the length of the current vector
 * @return {number} The length of the current vector
 */
Box2d.Math.Vector2.prototype.length = function length(){
	return Math.sqrt( this.x * this.x + this.y * this.y );
};

/**
 * Get the absolute value of the vector
 * @return {Box2d.Math.Vector2} A new vector that is the absolute value of the current vector
 */
Box2d.Math.Vector2.prototype.abs = function abs(){
	return Box2d.Math.Vector2.abs( this );
};

/**
 * Get the dot product of two vectors
 * @static
 * @param {Box2d.Math.Vector2} a The first vector
 * @param {Box2d.Math.Vector2} b The second vector
 * @return {number} The dot product of the two passed vectors
 */
Box2d.Math.Vector2.dot = function dot( a, b ){
	if( a.type !== Box2d.Math.Vector2.type || b.type !== Box2d.Math.Vector2.type ){
		throw 'Arguments must be of type "Vector2"';
	}
	return a.x * b.x + a.y * b.y;
};

/**
 * Compute the cross product of two vectors
 * @static
 * @param {Box2d.Math.Vector2} a The first vector
 * @param {Box2d.Math.Vector2} b The second vector
 * @return {number} The cross product of the two vectors
 */
Box2d.Math.Vector2.crossVV = function crossVV( a, b ){
	if( a.type !== Box2d.Math.Vector2.type || b.type !== Box2d.Math.Vector2.type ){
		throw 'Arguments must be of type "Vector2"';
	}
	return a.x * b.y - a.y * b.x;
};

/**
 * Compute the cross product of a vector and a scalar
 * @static
 * @param {Box2d.Math.Vector2} a The vector
 * @param {number} s The scalar
 * @return {number} The cross product
 */
Box2d.Math.Vector2.crossVN = function crossVN( a, s ){
	if( a.type !== Box2d.Math.Vector2.type || typeof s !== 'number' ){
		throw 'Arguments must be of type "Vector2" and "number"';
	}
	return new Box2d.Math.Vector2( s * a.y, -s * a.x );
};

/**
 * Compute the cross product of a scalar and a vector
 * @static
 * @param {number} s The scalar
 * @param {Box2d.Math.Vector2} a The vector
 * @return {number} The cross product
 */
Box2d.Math.Vector2.crossNV = function crossNV( s, a ){
	if( typeof s !== 'number' || a.type !== Box2d.Math.Vector2.type ){
		throw 'Arguments must be of type "number" and "Vector2"';
	}
	return new Box2d.Math.Vector2( -s * a.y, s * a.x );
};

/**
 * Compute the dot product of the current vector and a passed vector
 * @static
 * @param {Box2d.Math.Vector2} x The vector for which to find the absolute value
 * @return {Box2d.Vector} A vector that represents the absolute value of the passed vector
 */
Box2d.Math.Vector2.abs = function abs( a ){
	if( a.type !== Box2d.Math.Vector2.type ){
		throw 'Argument must be of type "Vector2"';
	}
	return new Box2d.Math.Vector2( Math.abs( a.x ), Math.abs( a.y ) );
};