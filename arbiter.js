/**
 *
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