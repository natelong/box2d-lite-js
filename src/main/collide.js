#include "math/vector2.js"
#include "math/math.js"
#include "math/matrix22.js"
#include "featurePair.js"
#include "contact.js"

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