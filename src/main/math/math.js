/**
 * @fileoverview Some generic math helper functions
 */
 
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