#include "math/vector2.js"
#include "featurePair.js"

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