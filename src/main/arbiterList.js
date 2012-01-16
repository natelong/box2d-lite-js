#include "arbiter.js"

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