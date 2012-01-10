/**
 *
 */

(function(){
	var Body = function Body(){
		this.position = new Box2d.Math.Vector2();
		this.rotation = 0;
		this.velocity = new Box2d.Math.Vector2();
		this.angularVelocity = 0;
		this.force = new Box2d.Math.Vector2();
		this.torque = 0;
		this.friction = 0.2;
		
		this.width = new Box2d.Math.Vector2( 1, 1 );
		this.mass = 3.402823466e+38;
		this.invMass = 0;
		this.I = 3.402823466e+38;
		this.invI = 0;
		this.id;
	};
	var proto = Body.prototype;
	
	Body.type = 'Body';
	proto.type = Body.type;
	
	proto.set = function set( w, m ){
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
		
		if( this.mass < 3.402823466e+38 ){
			this.invMass = 1 / this.mass;
			this.I = this.mass * ( this.width.x * this.width.x + this.width.y * this.width.y ) / 12;
			this.invI = 1 / this.I;
		}else{
			this.invMass = 0;
			this.I = 3.402823466e+38;
			this.invI = 0;
		}
	};
	
	proto.addForce = function addForce( f ){
		this.force += f;
	};
	
	Box2d.Body = Body;
})();