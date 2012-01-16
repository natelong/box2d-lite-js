#include "math/math.js"
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