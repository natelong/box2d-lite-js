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
 * @fileoverview Some generic math helper functions
 */

goog.provide( 'Box2d.Math' );
 
/**
 * A Generic Math object with some basic functions to simplify things here and there
 * @enum {Function}
 */
Box2d.Math = {
	/**
	 * Swaps two values, with side effects if the values are non-primitive types (passed by ref)
	 * @param {*} a The value to be swapped with b
	 * @param {*} b The value to be swapped with a
	 */
	swap: function swap( a, b ){
		var c = a;
		a = b;
		b = c;
	},
	/**
	 * Find the sign of a number
	 * @param {number} x The number whose sign you're looking for
	 * @return {number} The sign of the number passed in
	 */
	sign: function sign( x ){
		return x < 0 ? -1 : 1;
	},
	/**
	 * Clamp a value to a specified range
	 * @param {number} x The number to be clamped
	 * @param {number} min The minimum value for x
	 * @param {number} max The maximum value for x
	 * @return {number} X, clamped to the defined range
	 */
	clamp: function clamp( x, min, max ){
		if( x < min ){
			return min;
		}else if( x > max ){
			return max;
		}else{
			return x;
		}
	}
};