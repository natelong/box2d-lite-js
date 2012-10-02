/**
 * @fileoverview The main container for the app
 */
 
var Box2d = {};

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
/**
 * @fileoverview 2-dimensional vector object
 */

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

/**
 * @fileoverview The core type for a physics object in the simulation
 */

Box2d.Body = function Body(){
	this.position = new Box2d.Math.Vector2();
	this.rotation = 0;
	this.velocity = new Box2d.Math.Vector2();
	this.angularVelocity = 0;
	this.force = new Box2d.Math.Vector2();
	this.torque = 0;
	this.friction = 0.2;
	
	this.width = new Box2d.Math.Vector2( 1, 1 );
	this.mass = Infinity;
	this.invMass = 0;
	this.I = Infinity;
	this.invI = 0;
	this.id;
	this.type = Box2d.Body.type;
};
Box2d.Body.type = 'Body';
	
Box2d.Body.prototype.set = function set( w, m ){
	if( w.type !== Box2d.Math.Vector2.type ){
		throw 'Type of "width" must be "' + Box2d.Math.Vector2.type + '"';
	}
	this.position.set( 0, 0 );
	this.rotation = 0;
	this.velocity.set( 0, 0 );
	this.angularVelocity = 0;
	this.force.set( 0, 0 );
	this.torque = 0;
	this.friction = 0.2;
	
	this.width = w;
	this.mass = m;
	
	if( this.mass < Infinity ){
		this.invMass = 1 / this.mass;
		this.I = this.mass * ( this.width.x * this.width.x + this.width.y * this.width.y ) / 12;
		this.invI = 1 / this.I;
	}else{
		this.invMass = 0;
		this.I = Infinity;
		this.invI = 0;
	}
};

Box2d.Body.prototype.addForce = function addForce( f ){
	this.force += f;
};

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
/**
 * @fileoverview A container for body edges
 */

(function(){
	var FeaturePair = function FeaturePair( x ){
		if( arguments.length === 1 ){
			this.edges = {};
			this.edges.inEdge1 = x.edges.inEdge1;
			this.edges.outEdge1 = x.edges.outEdge1;
			this.edges.inEdge2 = x.edges.inEdge2;
			this.edges.outEdge2 = x.edges.outEdge2;
			this.value = x.value;
		}else{
			this.edges = {};
			this.edges.inEdge1 = null;
			this.edges.outEdge1 = null;
			this.edges.inEdge2 = null;
			this.edges.outEdge2 = null;
			this.value = null;
		}
	};
	var proto = FeaturePair.prototype;
	
	proto.flip = function flip(){
		Box2d.Math.swap( this.edges.inEdge1, this.edges.inEdge2 );
		Box2d.Math.swap( this.edges.outEdge1, this.edges.outEdge2 );
	};
	
	proto.getKey = function getKey(){
		return this.edges.inEdge1 +
				( this.edges.outEdge1 << 8 ) +
				( this.edges.inEdge2 << 16 ) +
				( this.edges.outEdge2 << 24 );
	};
	
	proto.equals = function equals( fp ){
		return this.getKey() === fp.getKey();
	}
	
	Box2d.FeaturePair = FeaturePair;
})();

/**
 * @fileoverview A container for a physical contact between two bodies
 */


(function(){	
	var Contact = function Contact(){
		this.pn = 0; // number
		this.pt = 0; // number
		this.pnb = 0; // number
		
		this.position = new Box2d.Math.Vector2();
		this.normal = new Box2d.Math.Vector2();
		this.r1 = new Box2d.Math.Vector2(); // vector2
		this.r2 = new Box2d.Math.Vector2(); // vector2
		this.separation = 0;
		this.massNormal = 0; // number
		this.massTangent = 0; // number
		this.bias = 0; // number
		this.feature = new Box2d.FeaturePair();
	};
	var proto = Contact.prototype;
	
	proto.set = function set( x ){
		if( arguments.length === 1 ){
			this.pn = x.pn;
			this.pt = x.pt;
			this.pnb = x.pnb;
			
			this.position = new Box2d.Math.Vector2( x.position.x, x.position.y );
			this.normal = new Box2d.Math.Vector2( x.normal.x, x.normal.y );
			this.r1 = x.r1;
			this.r2 = x.r2;
			this.separation = x.separation;
			this.massNormal = x.massNormal;
			this.massTangent = x.massTangent;
			this.bias = x.bias;
			this.feature = new Box2d.FeaturePair( x.feature );
		}
	};
	
	Box2d.Contact = Contact;
})();

/**
 * @fileoverview All of the major helpers for handling the interactions between bodies
 */

(function(){
	Box2d.Axis = {
		FACE_A_X: 0,
		FACE_A_Y: 1,
		FACE_B_X: 2,
		FACE_B_Y: 3
	};
	
	Box2d.EdgeNumber = {
		NO_EDGE: 0,
		EDGE1: 1,
		EDGE2: 2,
		EDGE3: 3,
		EDGE4: 4
	};
	
	Box2d.ClipVertex = function ClipVertex(){
		this.v = new Box2d.Math.Vector2();
		this.fp = new Box2d.FeaturePair();
		this.ClipVertex = function(){
			fp.value = 0;
		};
	};
	
	Box2d.clipSegmentToLine = function clipSegmentToLine( vOut, vIn, normal, offset, clipEdge ){
		// start with no output points
		var numOut = 0;
		
		// calculate the distance of end points to the line
		var distance0 = normal.dot( vIn[0].v ) - offset;
		var distance1 = normal.dot( vIn[1].v ) - offset;
		
		// might as well hoist this var manually
		var interp;
		var tmp;
		
		// if the points are behind the plane
		if( distance0 <= 0 ){
			vOut[numOut] = vIn[0];
			numOut += 1;
		}
		if( distance1 <= 0){
			vOut[numOut] = vIn[1];
			numOut += 1;
		}
		
		// if the points are on different sides of the plane
		if( distance0 * distance1 < 0 ){
			// find intersection point of edge and plane
			interp = distance0 / ( distance0 - distance1 );
			tmp = vIn[1].v.sub( vIn[0].v );
			tmp = tmp.mul( interp );
			vOut[numOut] = new Box2d.ClipVertex();
			vOut[numOut].v = tmp.add( vIn[0].v );
			
			if( distance0 > 0 ){
				vOut[numOut].fp = vIn[0].fp;
				vOut[numOut].fp.edges.inEdge1 = clipEdge;
				vOut[numOut].fp.edges.inEdge2 = Box2d.EdgeNumber.NO_EDGE;
			}else{
				vOut[numOut].fp = vIn[1].fp;
				vOut[numOut].fp.edges.outEdge1 = clipEdge;
				vOut[numOut].fp.edges.outEdge2 = Box2d.EdgeNumber.NO_EDGE;
			}
			numOut += 1;
		}
		
		return numOut;
	};
	
	/**
	 * @param {Box2d.ClipVertex Array} c
	 * @param {Box2d.Math.Vector2} h
	 * @param {Box2d.Math.Vector2} pos
	 * @param {Box2d.Math.Matrix22} rot
	 * @param {Box2d.Math.Vector2} normal
	 */
	Box2d.computeIncidentEdge = function computeIncidentEdge( c, h, pos, rot, normal ){
		
		// the normal is from the reference box. Convert it to
		// the incident box's frame and flip sign
		var rotT = rot.transpose(); // matrix22
		var n = rotT.mul( normal ).neg(); // vector2
		var nAbs = n.abs(); // vector2
		
		c[0] = new Box2d.ClipVertex();
		c[1] = new Box2d.ClipVertex();
		
		if( nAbs.x > nAbs.y ){
			if( Box2d.Math.sign( n.x ) > 0 ){
				c[0].v.set( h.x, -h.y );
				c[0].fp.edges.inEdge2 = Box2d.EdgeNumber.EDGE3;
				c[0].fp.edges.outEdge2 = Box2d.EdgeNumber.EDGE4;
				
				c[1].v.set( h.x, h.y );
				c[1].fp.edges.inEdge2 = Box2d.EdgeNumber.EDGE4;
				c[1].fp.edges.outEdge2 = Box2d.EdgeNumber.EDGE1;
			}else{
				c[0].v.set( -h.x, h.y );
				c[0].fp.edges.inEdge2 = Box2d.EdgeNumber.EDGE1;
				c[0].fp.edges.outEdge2 = Box2d.EdgeNumber.EDGE2;
				
				c[1].v.set( -h.x, -h.y );
				c[1].fp.edges.inEdge2 = Box2d.EdgeNumber.EDGE2;
				c[1].fp.edges.outEdge2 = Box2d.EdgeNumber.EDGE3;
			}
		}else{
			if( Box2d.Math.sign( n.y ) > 0 ){
				c[0].v.set( h.x, h.y );
				c[0].fp.edges.inEdge2 = Box2d.EdgeNumber.EDGE4;
				c[0].fp.edges.outEdge2 = Box2d.EdgeNumber.EDGE1;
				
				c[1].v.set( -h.x, h.y );
				c[1].fp.edges.inEdge2 = Box2d.EdgeNumber.EDGE1;
				c[1].fp.edges.outEdge2 = Box2d.EdgeNumber.EDGE2;
			}else{
				c[0].v.set( -h.x, -h.y );
				c[0].fp.edges.inEdge2 = Box2d.EdgeNumber.EDGE2;
				c[0].fp.edges.outEdge2 = Box2d.EdgeNumber.EDGE3;
				
				c[1].v.set( h.x, -h.y );
				c[1].fp.edges.inEdge2 = Box2d.EdgeNumber.EDGE3;
				c[1].fp.edges.outEdge2 = Box2d.EdgeNumber.EDGE4;
			}
		}
		
		c[0].v = pos.add( rot.mul( c[0].v ) );
		c[1].v = pos.add( rot.mul( c[1].v ) );
	};
	
	Box2d.collide = function collide( contacts, bodyA, bodyB ){
		var RELATIVE_TO_1 = 0.95;
		var ABSOLUTE_TO_1 = 0.01;
		// setup
		var hA = bodyA.width.mul( 0.5 ); // vector2
		var hB = bodyB.width.mul( 0.5 ); // vector2
		
		var posA = bodyA.position; // vector2
		var posB = bodyB.position; // vector2
		
		var rotA = new Box2d.Math.Matrix22( bodyA.rotation ); // matrix22
		var rotB = new Box2d.Math.Matrix22( bodyB.rotation ); // matrix22
		
		var rotAT = rotA.transpose(); // matrix22
		var rotBT = rotB.transpose(); // matrix22
		
		var dp = posB.sub( posA ); // vector2
		var dA = rotAT.mul( dp ); // vector2
		var dB = rotBT.mul( dp ); // vector2
		
		var c = rotAT.mul( rotB ); // matrix22
		var absC = c.abs(); //matrix22
		var absCT = absC.transpose(); //matrix22
		
		var tmp;
		
		// box a faces
		var faceA = dA.abs();
		faceA = faceA.sub( hA )
		tmp = absC.mul( hB );
		faceA = faceA.sub( tmp ); // vector2
		if( faceA.x > 0 || faceA.y > 0 ){
			return 0;
		}
		
		// box b faces
		var faceB = dB.abs().sub( hB ).sub( absCT.mul( hA ) ); // vector2
		if( faceB.x > 0 || faceB.y > 0 ){
			return 0;
		}
		
		// find best axis
		var axis; // Axis
		var separation; // number
		var normal; // vector2
		
		// box a faces
		axis = Box2d.Axis.FACE_A_X;
		separation = faceA.x;
		normal = dA.x > 0 ? rotA.col1 : rotA.col1.neg();
		
		if( faceA.y > RELATIVE_TO_1 * separation + ABSOLUTE_TO_1 * hA.y ){
			axis = Box2d.Axis.FACE_A_Y;
			separation = faceA.y;
			normal = dA.y > 0 ? rotA.col2 : rotA.col2.neg();
		}
		
		// box b faces
		if( faceB.x > RELATIVE_TO_1 * separation + ABSOLUTE_TO_1 * hB.x ){
			axis = Box2d.Axis.FACE_B_X;
			separation = faceB.x;
			normal = dB.x > 0 ? rotB.col1 : rotB.col1.neg();
		}
		
		if( faceB.y > RELATIVE_TO_1 * separation + ABSOLUTE_TO_1 * hB.y ){
			axis = Box2d.Axis.FACE_B_Y;
			separation = faceB.y;
			normal = dB.y > 0 ? rotB.col2 : rotB.col2.neg();
		}
		
		// setup clipping plane data based on the separating axis
		var frontNormal; // vector2
		var sideNormal; // vector2
		var incidentEdge = []; // ClipVertex[]
		var front; // number
		var negSide; // number
		var posSide; // number
		var negEdge; // EdgeNumber
		var posEdge; // EdgeNumber
		var side; // number
		
		switch( axis ){
			case Box2d.Axis.FACE_A_X:
				frontNormal = normal;
				front = posA.dot( frontNormal ) + hA.y;
				sideNormal = rotA.col1;
				side = posA.dot( sideNormal );
				negSide = -side + hA.y;
				posSide = side + hA.y;
				negEdge = Box2d.EdgeNumber.EDGE3;
				posEdge = Box2d.EdgeNumber.EDGE1;
				Box2d.computeIncidentEdge( incidentEdge, hB, posB, rotB, frontNormal );
			break;
			case Box2d.Axis.FACE_A_Y:
				frontNormal = normal;
				front = posA.dot( frontNormal ) + hA.y;
				sideNormal = rotA.col1;
				side = posA.dot( sideNormal );
				negSide = -side + hA.x;
				posSide = side + hA.x;
				negEdge = Box2d.EdgeNumber.EDGE2;
				posEdge = Box2d.EdgeNumber.EDGE4;
				Box2d.computeIncidentEdge( incidentEdge, hB, posB, rotB, frontNormal );
			break;
			case Box2d.Axis.FACE_B_X:
				frontNormal = normal.neg();
				front = posB.dot( frontNormal ) + hB.x;
				sideNormal = rotB.col2;
				side = posB.dot( sideNormal );
				negSide = -side + hB.y;
				posSide = side + hB.y;
				negEdge = Box2d.EdgeNumber.EDGE3;
				posEdge = Box2d.EdgeNumber.EDGE1;
				Box2d.computeIncidentEdge( incidentEdge, hA, posA, rotA, frontNormal );
			break;
			case Box2d.Axis.FACE_B_Y:
				frontNormal = normal.neg();
				front = posB.dot( frontNormal ) + hB.y;
				sideNormal = rotB.col1;
				side = posB.dot( sideNormal );
				negSide = -side + hB.x;
				posSide = side + hB.x;
				negEdge = Box2d.EdgeNumber.EDGE2;
				posEdge = Box2d.EdgeNumber.EDGE4;
				Box2d.computeIncidentEdge( incidentEdge, hA, posA, rotA, frontNormal );
			break;
		}
		
		// clip other face with 5 box planes ( 1 face plane, 4 edge planes )
		var clipPoints1 = []; // clipvertex array
		var clipPoints2 = []; // clipvertex array
		var np; // number
		
		np = Box2d.clipSegmentToLine( clipPoints1, incidentEdge, sideNormal.neg(), negSide, negEdge );
		
		if( np < 2 ){
			return 0;
		}
		// clip to negative box side 1
		np = Box2d.clipSegmentToLine( clipPoints2, clipPoints1, sideNormal, posSide, posEdge );
		if( np < 2 ){
			return 0;
		}
		
		// now clipPoints2 contains the clipping points.
		// due to roundoff, it is possible that clipping removes all points

		var numContacts = 0;
		for( var i = 0; i < 2; i++ ){
			separation = frontNormal.dot( clipPoints2[i].v ) - front;
			
			if( separation <= 0 ){
				contacts[ numContacts ] = new Box2d.Contact();
				contacts[ numContacts ].separation = separation;
				contacts[ numContacts ].normal = normal;
				// slide contact point onto reference face (easy to cull)
				contacts[ numContacts ].position = clipPoints2[i].v.sub( frontNormal.mul( separation ) );
				contacts[ numContacts ].feature = clipPoints2[i].fp;
				if( axis === Box2d.Axis.FACE_B_X || axis === Box2d.Axis.FACE_B_Y ){
					contacts[ numContacts ].feature.flip();
				}
				numContacts += 1;
			}
		}
		
		return numContacts;
	};
})();

/**
 * @fileoverview A container for the relationship between two bodies
 */
 
(function(){
	var Arbiter = function Arbiter( body1, body2 ){
		this.MAX_POINTS = 2;
		if( arguments.length !== 2 ||
				!( body1 instanceof Box2d.Body ) ||
				!( body2 instanceof Box2d.Body ) ){
			throw 'Arguments must be 2 bodies';
		}
		
		if( body1.id > body2.id ){
			this.body1 = body1;
			this.body2 = body2;
		}else{
			this.body2 = body1;
			this.body1 = body2;
		}

		this.contacts = [];
		this.numContacts = Box2d.collide( this.contacts, this.body1, this.body2 );;

		this.friction = Math.sqrt( body1.friction * body2.friction );
	};
	var proto = Arbiter.prototype;
	
	Arbiter.type = 'Arbiter';
	proto.type = Arbiter.type;
	
	proto.update = function update( newContacts, numNewContacts ){
		var mergedContacts = [];
		var i; // number
		var k; // number
		var j; // number
		var c;
		var cOld;
		
		for( i = 0; i < numNewContacts; i++ ){
			k = -1;
			for( j = 0; j < this.numContacts; j++ ){
				if( newContacts[i].feature.equals( this.contacts[j].feature ) ){
					k = j;
					break;
				}
			}
			
			if( k > -1 ){
					cOld = this.contacts[k];
					mergedContacts[i] = newContacts[i]; // contact
					c = mergedContacts[i];
					c.pn = cOld.pn;
					c.pt = cOld.pt;
					c.pnb = cOld.pnb;
			}else{
				mergedContacts[i] = newContacts[i];
			}
		}
		
		for( i = 0; i < numNewContacts; i++ ){
			this.contacts[i] = mergedContacts[i];
		}
		this.numContacts = numNewContacts;
	};
	
	proto.preStep = function preStep( inv_dt ){
		var allowedPenetration = 0.01;
		var biasFactor = 0.2;
		var i; // number
		var c; // contact
		var r1; // vector2
		var r2; // vector2
		var rn1; // number
		var rn2; // number
		var kNormal; // number
		
		var tangent; // vector2
		var rt1; // number
		var rt2; // number
		var kTangent; // number
		
		var p; // vector2
		
		for( i = 0; i < this.numContacts; i++ ){
			c = this.contacts[i];
			r1 = c.position.sub( this.body1.position );
			r2 = c.position.sub( this.body2.position );
			
			rn1 = Box2d.Math.Vector2.dot( r1, c.normal );
			rn2 = Box2d.Math.Vector2.dot( r2, c.normal );
			
			kNormal = this.body1.invMass + this.body2.invMass;
			kNormal += this.body1.invI * ( Box2d.Math.Vector2.dot( r1, r1 ) - rn1 * rn1 );
			kNormal += this.body2.invI * ( Box2d.Math.Vector2.dot( r2, r2 ) - rn2 * rn2 );
			c.massNormal = 1 / kNormal;
			
			tangent = Box2d.Math.Vector2.crossVN( c.normal, 1 ); // vector2
			rt1 = Box2d.Math.Vector2.dot( r1, tangent ); // number
			rt2 = Box2d.Math.Vector2.dot( r2, tangent ); // number
			
			kTangent = this.body1.invMass + this.body2.invMass;
			kTangent += this.body1.invI * ( Box2d.Math.Vector2.dot( r1, r1 ) - rt1 * rt1 );
			kTangent += this.body2.invI * ( Box2d.Math.Vector2.dot( r2, r2 ) - rt2 * rt2 );
			c.massTangent = 1 / kTangent;
			
			c.bias = -biasFactor * inv_dt * Math.min( 0, c.separation + allowedPenetration );
			
			p = c.normal.mul( c.pn ).add( tangent.mul( c.pt ) ); // vector2
			
			this.body1.velocity = this.body1.velocity.sub( p.mul( this.body1.invMass ) );
			this.body1.angularVelocity -= this.body1.invI * Box2d.Math.Vector2.crossVV( r1, p );
			
			this.body2.velocity = this.body2.velocity.add( p.mul( this.body2.invMass ) );
			this.body2.angularVelocity += this.body2.invI * Box2d.Math.Vector2.crossVV( r2, p );
		}
	};
	
	proto.applyImpulse = function applyImpulse(){
		var b1 = this.body1; // body
		var b2 = this.body2; // body
		var i; // number
		var c; // contact
		var dv; // vector2
		var vn; // number
		var dPn; // number
		var pn0; // number
		var pn; // vector2
		var tangent; // vector2
		var vt; // number
		var dPt; // number
		var maxPt; // number
		var oldTangentImpulse; // number
		var Pt; // vector2
		var tmp;
		
		for( i = 0; i < this.numContacts; i++ ){
			c = this.contacts[i];
			c.r1 = c.position.sub( b1.position );
			c.r2 = c.position.sub( b2.position );
			
			// relative velocity at contact
			tmp = Box2d.Math.Vector2.crossNV( b2.angularVelocity, c.r2 );
			dv = b2.velocity.add( tmp );
			dv = dv.sub( b1.velocity );
			tmp = Box2d.Math.Vector2.crossNV( b2.angularVelocity, c.r1 );
			dv = dv.sub( tmp );
			
			vn = Box2d.Math.Vector2.dot( dv, c.normal );
			dPn = c.massNormal * ( -vn + c.bias );
			
			//clamp the accumulated impulse
			pn0 = c.pn;
			c.pn = Math.max( pn0 + dPn, 0 );
			dPn = c.pn - pn0;
			
			// apply contact impulse
			pn = c.normal.mul( dPn );
			b1.velocity = b1.velocity.sub( pn.mul( b1.invMass ) );
			b1.angularVelocity -= b1.invI * Box2d.Math.Vector2.crossVV( c.r1, pn );
			
			b2.velocity = b2.velocity.add( pn.mul( b2.invMass ) );
			b2.angularVelocity += b2.invI * Box2d.Math.Vector2.crossVV( c.r2, pn );
			
			// relative velocity at contact
			dv = b2.velocity.add( Box2d.Math.Vector2.crossNV( b2.angularVelocity, c.r2 ) );
			dv = dv.sub( b1.velocity );
			dv = dv.sub( Box2d.Math.Vector2.crossNV( b1.angularVelocity, c.r1 ) );
			
			tangent = Box2d.Math.Vector2.crossVN( c.normal, 1 );
			vt = Box2d.Math.Vector2.dot( dv, tangent );
			dPt = c.massTangent * -vt;
			
			// compute friction impulse
			maxPt = this.friction * c.pn;
			
			// clamp friction
			oldTangentImpulse = c.pt;
			c.pt = Box2d.Math.clamp( oldTangentImpulse + dPt, -maxPt, maxPt );
			dPt = c.pt - oldTangentImpulse;
			
			// apply contact impulse
			Pt = tangent.mul( dPt );
			
			b1.velocity = b1.velocity.sub( Pt.mul( b1.invMass ) );
			b1.angularVelocity -= b1.invI * Box2d.Math.Vector2.crossVV( c.r1, Pt );
			
			b2.velocity = b2.velocity.add( Pt.mul( b2.invMass ) );
			b2.angularVelocity += b2.invI * Box2d.Math.Vector2.crossVV( c.r2, Pt );
		}
	};
	
	Box2d.Arbiter = Arbiter;
})();

/**
 * @fileoverview A container for arbiter objects
 */

(function(){
	var ArbiterList = function(){
		this.arbiters = [];
	};
	var proto = ArbiterList.prototype;
	
	proto.add = function add( a ){
		if( !a | !a.type || a.type !== Box2d.Arbiter.type ){
			throw 'Arguments must be of type "Arbiter"';
		}
		this.arbiters.push( a );
	};
	
	proto.remove = function remove( a ){
		if( !a | !a.type || a.type !== Box2d.Arbiter.type ){
			throw 'Arguments must be of type "Arbiter"';
		}
		var index = this.getIndex( a );
		if( index === false ){
			return false;
		}
		
		if( index === 0 ){
			this.arbiters.shift();
		}else if( index === this.arbiters.length - 1 ){
			this.arbiters.pop();
		}else{
			this.arbiters.splice( index, 1 )
		}
	};
	
	proto.getIndex = function getIndex( a ){
		if( !a | !a.type || a.type !== Box2d.Arbiter.type ){
			throw 'Arguments must be of type "Arbiter"';
		}
		var i = this.arbiters.length;
		while( i-- ){
			if( this.arbiters[i].body1 === a.body1 &&
					this.arbiters[i].body2 === a.body2 ||
					this.arbiters[i].body1 === a.body2 &&
					this.arbiters[i].body2 === a.body1){
				return i;
			}
		}
		return false;
	};
	
	proto.get = function get( a ){
		if( typeof this.arbiters[a] === 'undefined' ){
			return false;
		}
		return this.arbiters[a];
	};
	
	proto.getLength = function getLength(){
		return this.arbiters.length;
	};
	
	Box2d.ArbiterList = ArbiterList;
})();

/**
 * @fileoverview The main holder for the simulation
 */

Box2d.World = function World( gravity, iterations ){
	if( gravity && gravity.type && gravity.type === Box2d.Math.Vector2.type ){
		this.gravity = gravity;
	}else{
		this.gravity = new Box2d.Math.Vector2();
	}
	if( typeof iterations === 'number' ){
		this.iterations = iterations;
	}else{
		this.iterations = 1;
	}
	
	this.bodies = [];
	this.joints = [];
	this.arbiterList = new Box2d.ArbiterList();
	this.bodyCounter = 0;
};

Box2d.World.prototype.addBody = function addBody( body ){
	if( body && body.type && body.type === Box2d.Body.type ){
		body.id = this.bodyCounter++;
		this.bodies.push( body );
	}else{
		throw 'Argument must be of type "body." Try instantiating a new body first.';
	}
};

Box2d.World.prototype.clear = function clear(){
	this.bodies = [];
	this.joints = [];
	this.arbiterList = new Box2d.ArbiterList();
};

Box2d.World.prototype.step = function step( dt ){
	var inv_dt = dt > 0 ? 1 / dt : 0;
	var i;
	var b;
	var j;
	
	// determine overlapping bodies and update contact points
	this.broadPhase();
	
	// integrate forces
	i = this.bodies.length;
	while( i-- ){
		b = this.bodies[i];
		
		if( b.invMass === 0 ){
			continue;
		}
		
		b.velocity = b.velocity.add( this.gravity.add( b.force.mul( b.invMass ) ).mul( dt ) );
		b.angularVelocity += dt * b.invI * b.torque;
	}
	
	// perform pre-steps
	i = this.arbiterList.getLength();
	while( i-- ){
		this.arbiterList.get( i ).preStep( inv_dt );
	}
	
	// do joints (not implemented yet)
	
	// perform iterations
	i = this.iterations;
	while( i-- ){
		j = this.arbiterList.getLength();
		while( j-- ){
			this.arbiterList.get( j ).applyImpulse();
		}
	}
	
	// integrate velocities
	i = this.bodies.length;
	while( i-- ){
		b = this.bodies[i];
		
		b.position = b.position.add( b.velocity.mul( dt ) );
		b.rotation += dt * b.angularVelocity;
		
		b.force.set( 0, 0 );
		b.torque = 0;
	}
	
};

Box2d.World.prototype.broadPhase = function broadPhase(){
	var i; // number
	var j;
	var bodyCount = this.bodies.length; // number
	var bi; // body
	var bj; // body
	var newArb; // arbiter
	var arbIndex; // number

	// O(n^2) broad-phase
	for( i = 0; i < bodyCount; i++ ){
		bi = this.bodies[i];
		
		for( j = 0; j < bodyCount; j++ ){
			bj = this.bodies[j];
		
			if( bi.invMass === 0 && bj.invMass === 0 || bi === bj ){
				continue;
			}
			
			newArb = new Box2d.Arbiter( bi, bj );

			if( newArb.numContacts > 0 ){
				arbIndex = this.arbiterList.getIndex( newArb );
				if( arbIndex !== false ){
					this.arbiterList.get( arbIndex ).update( newArb.contacts, newArb.numContacts );
				}else{
					this.arbiterList.add( newArb );
				}
			}else{
				this.arbiterList.remove( newArb );
			}
		}
	}
};
