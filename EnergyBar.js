var EnergyBar = Component.extend(function () {
		this.maxHealth = 2500;
		this.maxStamina = 2000;
		this.health = 0;
		this.stamina = 0;
		var fillWith = 100;
		this.text = "";
		var borderColor = "white";
		var fillColor = "red";
		var textColor = "black";
		var bar = 0;
		var lado = "";

		this.constructor = function (x, y, w, h, drawContext, _text, _textColor, _borderColor, _fillColor, _bar, _lado, _champion) {
			this.super();
			this.x = x;
			this.y = y;
			this.width = w;
			this.height = h;
			this.ctx = drawContext;
			borderColor = _borderColor !== undefined ? _borderColor : "white";
			fillColor = _fillColor !== undefined ? _fillColor : "red";
			textColor = _textColor !== undefined ? _textColor : "black";
			this.text = _text;
			bar = _bar !== undefined ? _bar : 0;
			lado = _lado !== undefined ? _lado : "esq";
			this.maxHealth = _champion[2];
			this.maxStamina = _champion[3];
			switch(bar){
				case 0: this.update(_champion[2]); break;
				case 1: this.update(_champion[3]); break;
			}
		};
		// faz a atualização do gráfico de a cordo com o valor do parametro
		this.update = function (energyLevel) {
			if (bar == 0){
				if (energyLevel < 0)
					energyLevel = 0;
				if (energyLevel > this.maxHealth)
					energyLevel = this.maxHealth;
				this.health = energyLevel;
				this.fillWith = this.health / this.maxHealth * this.width;
			} else if (bar == 1){
				if (energyLevel < 0)
					energyLevel = 0;
				if (energyLevel > this.maxStamina)
					energyLevel = this.maxStamina;
				this.stamina = energyLevel;
				this.fillWith = this.stamina / this.maxStamina * this.width;
			}
		};

		this.render = function () {

			this.ctx.save();
			//desenho do fundo
			this.ctx.beginPath();
			this.ctx.shadowColor = this.shadow.shadowColor;
			this.ctx.shadowBlur = this.shadow.shadowBlur;
			this.ctx.shadowOffsetX = this.shadow.shadowOffsetX;
			this.ctx.shadowOffsetY = this.shadow.shadowOffsetY;

			this.ctx.rect(this.x, this.y, this.width, this.height);
			switch(bar){
				case 0: this.ctx.fillStyle = '#f79191'; break;
				case 1: this.ctx.fillStyle = '#accbf9'; break;
			}
			this.ctx.fill();
			this.ctx.closePath();
			this.ctx.restore();
			//desenho do preenchimento
			this.ctx.beginPath();
			this.ctx.rect(this.x, this.y, this.fillWith, this.height);
			var grd = this.ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
			grd.addColorStop(0, fillColor);
			grd.addColorStop(0.2, fillColor);
			grd.addColorStop(0.5, fillColor);
			grd.addColorStop(0.8, fillColor);
			grd.addColorStop(1, fillColor);
			this.ctx.fillStyle = grd;
			this.ctx.fill();
			this.ctx.closePath();

			//desenho do bordo
			this.ctx.beginPath();
			this.ctx.lineWidth = 1;
			this.ctx.lineJoin = "round";
			this.ctx.rect(this.x, this.y, this.width, this.height);
			this.ctx.strokeStyle = borderColor;
			this.ctx.stroke();
			this.ctx.closePath();
			switch(bar){
				case 0: this.ctx.font = "14px Arial"; break;
				case 1: this.ctx.font = "14px Arial"; break;
			}
			this.ctx.fillStyle = textColor;
			/* switch(bar){
				case 0: this.ctx.fillText(this.health+"/"+this.maxHealth, lado == "dir" ? this.right() - 72 : this.left() + 5, this.top() + 15); break;
				case 1: this.ctx.fillText(this.stamina+"/"+this.maxStamina, lado == "dir" ? this.right() - 57: this.left() + 5, this.top() + 15);  break;
			} */
			if(lado == "dir"){
				this.ctx.textAlign = "right";
			} else {
				this.ctx.textAlign = "left";
			}			
			switch(bar){
				case 0: this.ctx.fillText(lado == "dir" ? this.health+"/"+this.maxHealth : this.maxHealth+"/"+this.health, lado == "dir" ? this.right() - 5 : this.left() + 5, this.top() + 15); break;
				case 1: this.ctx.fillText(lado == "dir" ? this.stamina+"/"+this.maxStamina : this.maxStamina+"/"+this.stamina, lado == "dir" ? this.right() - 5 : this.left() + 5, this.top() + 15);  break;
			}
			

		};

	});
