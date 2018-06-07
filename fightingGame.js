(function(){ //não apagar
	var canvas;
	var body;
	var drawingSurface;
	var entities = [];
	var teclas= new Array(255);
	var gameWorld=undefined;
	var camera=undefined;
	//players
	var umPlayer=undefined;
	var doisPlayer=undefined;
	var background=undefined;
	var assetsLoaded=0;
	//Barras de Vida e Energia
	var barraVidaPlayerUm = undefined;
	var barraStaminaPlayerUm = undefined;
	var barraVidaPlayerDois = undefined;
	var barraStaminaPlayerDois = undefined;
	var gameTimer = undefined;
	
	//ARRAY CADA CHAMP
	var baddude = ["baddude", "Campeão básico, bom para iniciantes!", 1200, 700, 50, 70, -40, 100, 120];
	var billylee = ["billylee", "Campeão básico, bom para iniciantes!", 1300, 800, 40, 60, -30, 90, 100];
	var maxHealth = 2500;
	var maxStamina = 2000;
	
	var champions = [baddude, billylee];
	
	var nSprites = 3;
	var nivel = 0;
	
	
	var pSelect = 0;
	var champSelected = [];
	
	//Estados de Jogo
	var GameStates = {
		RUNNING: 1,
		PAUSED: 2,
		STOPED: 3,
		LOADING: 4,
		LOADED: 5
	};
	var gameState = undefined;
	
	window.addEventListener("load",init, false);

	function init(){
		//INICIO PASSAR TUDO À FRENTE
		var passarFrente = document.getElementById("passar");
		passarFrente.setAttribute("style", "visibility:visible;")
		passarFrente.addEventListener("mousedown", function(){
				champSelected.push(champions[0]);
				champSelected.push(champions[1]);
				loadSprites();
			}, false);
		//FIM PASSAR TUDO À FRENTE
		
		canvas = document.querySelector("canvas");
		canvas.setAttribute("style", "margin:-8px;");
		drawingSurface = canvas.getContext("2d");
		
		gameState = GameStates.LOADING;
		
		body = document.querySelector("body");
		body.setAttribute("style", "overflow:hidden;");
		
		var nNormal = document.getElementById("nNormal");
		
		window.addEventListener("keyup",keySelectNivel,false);
		
	}
	
	function keySelectNivel(e){
		var codTecla=e.keyCode;
		teclas[codTecla]=false; 

		var bFocus = document.activeElement.id;
		
		var nBasico = document.getElementById("nBasico");
		var nNormal = document.getElementById("nNormal");
		
		if (codTecla == keyboard.UP && bFocus == "nNormal") {
			nBasico.focus();
		} else if (codTecla == keyboard.DOWN && bFocus == "nBasico") {
			nNormal.focus();
		} else if (codTecla == keyboard.ENTER){
			if (bFocus == "nNormal"){
				nivel = 1;
			}
			window.removeEventListener;
			criarPainelChamps(pSelect);
		}
	}
	
	function criarPainelChamps(pSelect){
	if (pSelect==0){
		var player1 = document.getElementById("player1");
		var player2 = document.getElementById("player2");
		player1.innerHTML = "";
		player2.innerHTML = "";
		player1.style.overflow = "hidden";
		
		var champs = document.getElementById("champs");
		champs.innerHTML = "";
		
		var center = document.createElement("center");
		
		var logo = document.createElement("img");
		logo.setAttribute("src", "assets/logo.png");
		logo.setAttribute("id", "logo");
		center.appendChild(logo);
		
		var title = document.createElement("img");
		title.setAttribute("src", "assets/select_champ.png");
		title.setAttribute("id", "select");
		center.appendChild(title);
		
		var board = document.createElement("div");
		board.setAttribute("id", "board");
		center.appendChild(board);
		
		for (var i = 0; i < champions.length; i++){
			var input = document.createElement("input");
			input.setAttribute("type", "image");
			input.setAttribute("id", "icon");
			input.setAttribute("value", ""+champions[i][0]);
			input.setAttribute("src", "assets/champions/"+champions[i][0]+".png");
			input.addEventListener("focus", function(e){printChamp(e.target.value)});
			if(i==0){
				input.autofocus;
			}
			board.appendChild(input);
		}
		
		var btn_inicio = document.createElement("button");
		btn_inicio.setAttribute("type", "image");
		btn_inicio.setAttribute("id", "btn_inicio");
		btn_inicio.innerHTML = "Começar";
		btn_inicio.addEventListener("click",loadSprites,false);
		btn_inicio.style.cursor = "not-allowed";
		btn_inicio.style.opacity = "0.6";
		btn_inicio.disabled = true;
		center.appendChild(btn_inicio);
		
		champs.appendChild(center);
		
		/* window.addEventListener("keyup",function(){keySelectChampion(i)},false); */
		
	} else if (pSelect==1){		
		var board = document.getElementById("board");
		board.innerHTML = "";
		
		for (var i = 0; i < champions.length; i++){
			var input = document.createElement("input");
			input.setAttribute("type", "image");
			input.setAttribute("id", "icon");
			input.setAttribute("value", ""+champions[i][0]);
			input.setAttribute("src", "assets/champions/"+champions[i][0]+".png");
			if(champSelected[0][0] == champions[i][0]){
				input.disabled = true;
				input.style.cursor = "not-allowed";
			}
			
			input.addEventListener("focus", function(e){printChamp(e.target.value)});
			/* if(i==0){
				input.autofocus;
			} */
			board.appendChild(input);
		}
		

	} else if (pSelect==2){	
		var btn_inicio = document.getElementById("btn_inicio");
		btn_inicio.style.cursor = "pointer";
		btn_inicio.style.opacity = "1";
		btn_inicio.disabled = false;
	}
	}
	
	function printChamp(name){
		var i = 0;
		for (var j = 0; j < champions.length; j++){
			if (champions[j][0] == name){
				i = j;
			}
		}
		if (pSelect==0){
			var player1 = document.getElementById("player1");
			player1.innerHTML = "";
			
			var center = document.createElement("center");
			
			var title = document.createElement("h2");
			title.setAttribute("id", "title_champ");
			title.innerHTML = ""+champions[i][0];
			center.appendChild(title);
			
			var description = document.createElement("p");
			description.innerHTML = ""+champions[i][1];
			center.appendChild(description);
			
			player1.appendChild(center);
			
			var title_health = document.createElement("p");
			title_health.innerHTML = "<h3>Dados</h3>";
			player1.appendChild(title_health);
			
			var bar_health_width = (champions[i][2] * 100)/maxHealth;
			
			var bar_health_back = document.createElement("div");
			bar_health_back.setAttribute("class", "bar_back");
			var bar_health_color = document.createElement("div");
			bar_health_color.setAttribute("class", "bar_red");
			bar_health_color.style.width = ""+bar_health_width+"%";
			bar_health_color.innerHTML = "" + champions[i][2] + "/" + maxHealth;
			bar_health_back.appendChild(bar_health_color);
			player1.appendChild(bar_health_back);
			
			var bar_stamina_width = (champions[i][3] * 100)/maxStamina;
			var bar_stamina_back = document.createElement("div");
			bar_stamina_back.setAttribute("class", "bar_back");
			var bar_stamina_color = document.createElement("div");
			bar_stamina_color.setAttribute("class", "bar_blue");
			bar_stamina_color.style.width = ""+bar_stamina_width+"%";
			bar_stamina_color.innerHTML = "" + champions[i][3] + "/" + maxStamina;
			bar_stamina_back.appendChild(bar_stamina_color);
			player1.appendChild(bar_stamina_back);
			
			var punch = document.createElement("p");
			punch.innerHTML = "<h3>Ataques/Defesa</h3><b>Murro:</b> "+champions[i][4]+"</br>";
			player1.appendChild(punch);
			
			var kick = document.createElement("p");
			kick.innerHTML = "<b>Pontapé:</b> "+champions[i][5]+"</br>";
			player1.appendChild(kick);
			
			var defense = document.createElement("p");
			defense.innerHTML = "<b>Defesa:</b> "+champions[i][6]+"</br>";
			player1.appendChild(defense);
			
			var comb1 = document.createElement("p");
			comb1.innerHTML = "<b>Combo 1:</b> "+champions[i][7]+"</br>";
			player1.appendChild(comb1);
			
			var comb2 = document.createElement("p");
			comb2.innerHTML = "<b>Combo 2:</b> "+champions[i][8]+"</br></br>";
			player1.appendChild(comb2);
			
			var center2 = document.createElement("center");
			var champ_img = document.createElement("img");
			champ_img.setAttribute("src", "assets/champions/"+champions[i][0]+"1.png");
			center2.appendChild(champ_img);
			
			
			var btn_select = document.createElement("button");
			btn_select.setAttribute("type", "image");
			btn_select.setAttribute("id", "btn_select0");
			btn_select.innerHTML = "Selecionar";
			btn_select.addEventListener("click",function(){selectChamp(i)},false);
			center2.appendChild(btn_select);
			player1.appendChild(center2);
		} else if (pSelect==1){			
			var player2 = document.getElementById("player2");
			player2.innerHTML = "";
			
			var center = document.createElement("center");
			
			var title = document.createElement("h2");
			title.setAttribute("id", "title_champ");
			title.innerHTML = ""+champions[i][0];
			center.appendChild(title);
			
			var description = document.createElement("p");
			description.innerHTML = ""+champions[i][1];
			center.appendChild(description);
			
			player2.appendChild(center);
			
			var title_health = document.createElement("p");
			title_health.innerHTML = "<h3>Dados</h3>";
			player2.appendChild(title_health);
			
			var bar_health_width = (champions[i][2] * 100)/maxHealth;
			
			var bar_health_back = document.createElement("div");
			bar_health_back.setAttribute("class", "bar_back");
			var bar_health_color = document.createElement("div");
			bar_health_color.setAttribute("class", "bar_red");
			bar_health_color.style.width = ""+bar_health_width+"%";
			bar_health_color.innerHTML = "" + champions[i][2] + "/" + maxHealth;
			bar_health_back.appendChild(bar_health_color);
			player2.appendChild(bar_health_back);
			
			var bar_stamina_width = (champions[i][3] * 100)/maxStamina;
			
			var bar_stamina_back = document.createElement("div");
			bar_stamina_back.setAttribute("class", "bar_back");
			var bar_stamina_color = document.createElement("div");
			bar_stamina_color.setAttribute("class", "bar_blue");
			bar_stamina_color.style.width = ""+bar_stamina_width+"%";
			bar_stamina_color.innerHTML = "" + champions[i][3] + "/" + maxStamina;
			bar_stamina_back.appendChild(bar_stamina_color);
			player2.appendChild(bar_stamina_back);
			
			var punch = document.createElement("p");
			punch.innerHTML = "<h3>Ataques/Defesa</h3><b>Murro:</b> "+champions[i][4]+"</br>";
			player2.appendChild(punch);
			
			var kick = document.createElement("p");
			kick.innerHTML = "<b>Pontapé:</b> "+champions[i][5]+"</br>";
			player2.appendChild(kick);
			
			var defense = document.createElement("p");
			defense.innerHTML = "<b>Defesa:</b> "+champions[i][6]+"</br>";
			player2.appendChild(defense);
			
			var comb1 = document.createElement("p");
			comb1.innerHTML = "<b>Combo 1:</b> "+champions[i][7]+"</br>";
			player2.appendChild(comb1);
			
			var comb2 = document.createElement("p");
			comb2.innerHTML = "<b>Combo 2:</b> "+champions[i][8]+"</br></br>";
			player2.appendChild(comb2);
			
			var center2 = document.createElement("center");
			var champ_img = document.createElement("img");
			champ_img.setAttribute("src", "assets/champions/"+champions[i][0]+"1.png");
			center2.appendChild(champ_img);
			
			
			var btn_select = document.createElement("button");
			btn_select.setAttribute("type", "image");
			btn_select.setAttribute("id", "btn_select1");
			btn_select.innerHTML = "Selecionar";
			btn_select.addEventListener("click",function(){selectChamp(i)},false);
			center2.appendChild(btn_select);
			player2.appendChild(center2);
		}
	}
	
	function selectChamp(i){
		champSelected.push(champions[i]);
		var old_btn_select = document.getElementById("btn_select"+pSelect);
		old_btn_select.style.cursor = "not-allowed";
		old_btn_select.style.opacity = "0.6";
		old_btn_select.disabled = true;
		pSelect++;
		if (pSelect < 3){
			criarPainelChamps(pSelect);
		}
	}
	
	/* function keySelectChampion(e, i){
		var codTecla=e.keyCode;
		teclas[codTecla]=false; 

		var championFocus = document.activeElement.id;
		
		if (codTecla == keyboard.ENTER && championFocus != ""){
			champSelected.push(champions[i]);
			var old_btn_select = document.getElementById("btn_select"+pSelect);
			old_btn_select.style.cursor = "not-allowed";
			old_btn_select.style.opacity = "0.6";
			old_btn_select.disabled = true;
			pSelect++;
			if (pSelect < 3){
				criarPainelChamps(pSelect);
			}
			window.removeEventListener;
		}
	} */

	
	function loadSprites(){
		canvas.width = window.innerWidth;
		canvas.height = 600;
		// 1 -  criar o gameWorld
		gameWorld = new GameWorld(0, 0, 1920, 600);
		
		// 2 - criar e configurar a c�mara 
		
		camera= new Camera(0, canvas.height/3, canvas.width, canvas.height/2);
		//camera.center(gameWorld);

		// 3.1 - carregar a spriteSheet do player1
		var spPlayer1= new SpriteSheet();
		
		spPlayer1.load("assets//"+champSelected[0][0]+"//1//"+champSelected[0][0]+".png",
					   "assets//"+champSelected[0][0]+"//1//"+champSelected[0][0]+".json",
						loaded);
					
		// 3.2 - carregar a spriteSheet do player2
		var spPlayer2= new SpriteSheet();
		
		spPlayer2.load("assets//"+champSelected[1][0]+"//2//"+champSelected[1][0]+".png",
					   "assets//"+champSelected[1][0]+"//2//"+champSelected[1][0]+".json",
						loaded);
					
		// 4 - carregar a spriteSheet do background
		var spBackground= new SpriteSheet();
		spBackground.load("assets//background.png",
						  "assets//background.json",
						  loaded);
	}

	function loaded(){
		//verificar quantas spriteSheets já foram carregadas e iniciar o jogo se ja
		// foram todas carregadas 
		assetsLoaded++;
		if(assetsLoaded === (nSprites) ) {
			var painel = document.getElementById("painel");
			body.removeChild(painel);
			startGame();
		}
		
	}

	function stopGame() {
		gameState = GameStates.STOPED;
	}

	function startGame(){
		oBackground = new Background(gSpriteSheets['assets//background.png'], 0, 0);
		oBackground.x = (canvas.width - oBackground.width)/2;

		// 1.1 - criar a entidade player1
		umPlayer= new Player(gSpriteSheets['assets//'+champSelected[0][0]+'//1//'+champSelected[0][0]+'.png'],
									canvas.width * 0.3,canvas.height - 240);
				
		// 1.2 - criar a entidade player2
		doisPlayer= new Player(gSpriteSheets['assets//'+champSelected[1][0]+'//2//'+champSelected[1][0]+'.png'],
									canvas.width * 0.7,canvas.height - 240);
		
		// 3 - configurar o background
		// 4 colocar as entidades no array de entidades
		//background.andar();
		entities.push(oBackground);
		entities.push(umPlayer);
		entities.push(doisPlayer);
		//Update the sprite as soon as the image has been loaded
		
		gameState = GameStates.LOADED;
		
		//EnergyBar: (x, y, w, h, drawContext, _text, _textColor, _borderColor, _fillColor, _bar, _lado)
		
		barraVidaPlayerUm = new EnergyBar(15, 15, 300, 20, drawingSurface, 'Vida', 'black', 'black', 'red', 0, 'esq', champSelected[0]);
		barraStaminaPlayerUm = new EnergyBar(15, 40, 300, 20, drawingSurface, 'Stamina', 'black', 'black', 'blue', 1, 'esq', champSelected[0]);
		
		barraVidaPlayerDois = new EnergyBar(canvas.width-315, 15, 300, 20, drawingSurface, 'Vida', 'black', 'black', 'red', 0, 'dir', champSelected[1]);
		barraStaminaPlayerDois = new EnergyBar(canvas.width-315, 40, 300, 20, drawingSurface, 'Stamina', 'black', 'black', 'blue', 1, 'dir', champSelected[1]);
		
		gameTimer = new GameTimer((canvas.width >> 1) - 25, 5, 50, 50, drawingSurface, '', "black", "black", "white", update, stopGame);
		
		gameState = GameStates.RUNNING;
		gameTimer.start();
		

		window.addEventListener("keydown",keyDownHandler,false);
		window.addEventListener("keyup",keyUpHandler,false);
	}


	function keyDownHandler(e){
		var codTecla=e.keyCode;
		teclas[codTecla]=true;	
	}

	function keyUpHandler(e){
		var codTecla=e.keyCode;
		teclas[codTecla]=false;  

		switch(codTecla){
		case  keyboard.KPAD_PLUS  :  umPlayer.vx =umPlayer.vy+=3; break;
		case  keyboard.KPAD_MINUS :  umPlayer.vx =umPlayer.vy-=3; break;
		}
		
		umPlayer.parar();
		doisPlayer.parar();
		oBackground.parar();

	}


	function update(){
		//Create the animation loop
		
		if (gameState == GameStates.RUNNING) {
			//PLAYER 1
			if(teclas[keyboard.LEFT]) 	{
				umPlayer.andar();
				umPlayer.x-=umPlayer.vx;
				umPlayer.dir=-1;
				champSelected[0][2] -= 30;
				barraVidaPlayerUm.update(champSelected[0][2]);
			} else if(teclas[keyboard.RIGHT]) 	{
				umPlayer.andar();
				umPlayer.x+=umPlayer.vx;
				umPlayer.dir=1;
			}
			
			//PLAYER 2
			if(teclas[keyboard.a]) 	{
				doisPlayer.andar();
				doisPlayer.x-=doisPlayer.vx;
				doisPlayer.dir=-1;
				champSelected[1][2] -= 30;
				barraVidaPlayerDois.update(champSelected[1][2]);
			} else if(teclas[keyboard.d]) 	{
				doisPlayer.andar();
				doisPlayer.x+=umPlayer.vx;
				doisPlayer.dir=1;
			}
			//if(teclas[keyboard.DOWN]) 	umPlayer.y+=umPlayer.vy;
			if(teclas[keyboard.SPACE]) {
				// completar Salto
			
			}


			for (var i=0; i< entities.length;i++){
				entities[i].update();
			}

			
			// 1 - calcular 1/3 do tamanho do background
			// 2 -  reposicionar o background consoante a sua posi��o atual e a sua dire��o

			// 3 - animar o background se o tanque atingir os limites interiores da c�mara
			//     a uma velocidade de 1/3 da velocidade do tanque
			//Player1
			if(umPlayer.x < camera.leftInnerBoundary()){
				oBackground.vx=umPlayer.vx/3;
				umPlayer.x=camera.leftInnerBoundary();
			}
			
			if(umPlayer.x + umPlayer.width > camera.rightInnerBoundary()){
				oBackground.vx=umPlayer.vx/3*-1;
				umPlayer.x=camera.rightInnerBoundary() - umPlayer.width;
			}
			
			//PLAYER 2
			if(doisPlayer.x < camera.leftInnerBoundary()){
				oBackground.vx=doisPlayer.vx/3;
				doisPlayer.x=camera.leftInnerBoundary();
			}
			
			if(doisPlayer.x + doisPlayer.width > camera.rightInnerBoundary()){
				oBackground.vx=doisPlayer.vx/3*-1;
				doisPlayer.x=camera.rightInnerBoundary() - doisPlayer.width;
			}
			
			
			
			
			// 2 - Mover a camara se o gato sair dos inner boundary
			if(umPlayer.x < camera.leftInnerBoundary())
				camera.x = Math.floor(umPlayer.x - (camera.width*0.25));
   
			if(umPlayer.x + umPlayer.width > camera.rightInnerBoundary())
				camera.x = Math.floor(umPlayer.x + umPlayer.width - (camera.width*0.75));    
   
			 //4 - manter a camara  dentro dos limites do mundo  
			if(camera.x < gameWorld.x)
				camera.x = gameWorld.x;
			   
			if(camera.x + camera.width > gameWorld.x + gameWorld.width)
				camera.x = gameWorld.x + gameWorld.width - camera.width;
			
			


			window.requestAnimationFrame(update);

			render();
		}
	}

	function render(){ 
		//Clear the previous animation frame

//		demulF++;
		//if(demulF%2!=0)return;   
		drawingSurface.clearRect(0, 0, canvas.width, canvas.height);

		for(var i=0; i<entities.length; i++){ 

			var entity=entities[i];
			var sprite= entities[i].getSprite();  


			if(entity.active){
				drawingSurface.drawImage
				(
						entity.spriteSheet.img, 
						sprite.x, sprite.y, 
						sprite.width, sprite.height,
						entity.x, entity.y,  
						entity.width, entity.height
				);
			}
		}
		camera.drawFrame(drawingSurface, true);
		
		barraVidaPlayerUm.render();
		barraStaminaPlayerUm.render();
		
		barraVidaPlayerDois.render();
		barraStaminaPlayerDois.render();
		
		gameTimer.render();
	}
})();// não apagar