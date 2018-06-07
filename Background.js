//Exerc�cio 5.4 
//Background.js

var Background = Entity.extend(function(){
	this.currState=undefined; // estado atual;


	this.states={
			UNIQUE:'UNIQUE'
	}


	this.constructor= function(spriteSheet,x,y){
		//completar 
		this.super();
		this.x=x;
		this.y=y;
		this.spriteSheet=spriteSheet;
		this.currState=this.states.UNIQUE;
		this.currentFrame=0;
		this.active=true;
		this.vx=0;
		setup();
	};

	this.update=function(){
		//completar   
		this.x+=this.vx; // mover o background horizontalmente
	};

	this.getSprite=function(){
		return this.frames[this.currentFrame];
	};

	var setup= function(){
		//completar   
		this.eStates['UNIQUE']=this.spriteSheet.getStats('UNIQUE');
		this.frames= this.eStates['UNIQUE'];
		this.width=this.frames[0].width;
		this.height=this.frames[0].height;
	}.bind(this);

	this.andar=function(){
		//completar    
		this.vx=1;
	}

	this.parar=function(){
		//completar   
		this.vx=0;
	}

});


