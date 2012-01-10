(function(){
	var World = function World( gravity, iterations ){
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
	var proto = World.prototype;
	
	proto.addBody = function addBody( body ){
		if( body && body.type && body.type === Box2d.Body.type ){
			body.id = this.bodyCounter++;
			this.bodies.push( body );
		}else{
			throw 'Argument must be of type "body." Try instantiating a new body first.';
		}
	};
	
	proto.addJoint = function addJoint( joint ){
		if( joint && joint.type && joint.type === Box2d.Joint.type ){
			this.joints.push( joint );
		}else{
			throw 'Argument must be of type "joint." Try instantiating a new joint first.';
		}
	};
	
	proto.clear = function clear(){
		this.bodies = [];
		this.joints = [];
		this.arbiterList = new Box2d.ArbiterList();
	};
	
	proto.step = function step( dt ){
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
	
	proto.broadPhase = function broadPhase(){
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
	
	Box2d.World = World;
})();