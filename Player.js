var Player = Entity.extend(function(){
	this.currState=undefined; // estado atual;
	var podeAtacar=false;
	this.dir = -1;
	this.states={
			ANDAR:'ANDAR',
			PARADO:'PARADO',
			SALTAR:'SALTAR',
			MURRON:'MURRON',
	}


	this.constructor= function(spriteSheet,x,y){
		this.super();
		this.x=x;
		this.y=y;
		this.spriteSheet=spriteSheet;
		this.currState=this.states.PARADO;
		this.currentFrame=0;
		this.active=true;
		setup();
	};

	this.update=function(){
		this.currentFrame=(this.currentFrame+1)%(this.frames.length);
		 
		this.width=this.frames[this.currentFrame].width+35;    //atualizar a altura 
		this.height=this.frames[this.currentFrame].height+35;  // atualizar os 
	};

	this.getSprite=function(){
		return this.frames[this.currentFrame];
	};


	var setup= function(){

		this.eStates['ANDAR']=this.spriteSheet.getStats('ANDAR');
		this.eStates['PARADO']=this.spriteSheet.getStats('PARADO');
		this.eStates['SALTAR']=this.spriteSheet.getStats('SALTAR');
		this.eStates['MURRON']=this.spriteSheet.getStats('MURRON');

		this.frames=this.eStates[this.currState]; 
		this.width=this.frames[0].width;  //atualizar a altura 
		this.height=this.frames[0].height;  // atualizar os 

		// atualizar o array de frames atual

	}.bind(this);



	this.andar=function(){
		toogleState(this.states.ANDAR);
	}

	this.parar=function(){
		toogleState(this.states.PARADO);
	}

	this.saltar=function(){
		toogleState(this.states.SALTAR);
	}

	this.murro_n=function(){
		toogleState(this.states.MURRON);
	}	

	var toogleState=function (theState){
		if(this.killed) return;
		if(this.currState!=theState){
			this.currState=theState;
			this.frames=this.eStates[theState];
			this.currentFrame=0;
		} 
	}.bind(this);

});


