function ReelStrip(argument) {
	ViewContainer.call(this, arguments);
}

ReelStrip.prototype = Object.create(ViewContainer.prototype);
ReelStrip.prototype.constructor = ReelStrip;

var reelStrip = ReelStrip.prototype;

reelStrip.createView = function (id) {
	this.reelId = id;
	this.tickerCounter = 0;
	this.reelConfig = _ng.GameConfig.ReelViewUiConfig;
	_ng.extraSymbols = this.reelConfig.data.extraAddSymbols;
	this.tickerSymbolsCount = this.reelConfig.data.noOfSymbols+1;
	// this.setReelSymbolConfig();
	this.stripData = _ng.GameConfig.defaultReels[this.reelId].split("");
	this.stripData = coreApp.gameController.model.spinData.getReels()[this.reelId] ? coreApp.gameController.model.spinData.getReels()[this.reelId] : this.stripData;
	this.stripData = this.addExtraSymbols(this.stripData);
	this.createStrip();
	this.maxSpinTime = 10000;
	this.createGameElements();
	this.stopSpinCounter = 0;
};
reelStrip.createGameElements = function () {}
reelStrip.addExtraSymbols = function (reel) {
	this.addtionalSymbols = 2;
	var tempAry = reel.toString().split(",");
	var extra = _ng.extraSymbols;
	tempAry.unshift(extra[Math.round(Math.random() * (extra.length - 1))]);
	tempAry.push(extra[Math.round(Math.random() * (extra.length - 1))]);
	return tempAry;
}
reelStrip.createStrip = function () {
	this.symbolsArray = [];
	this.symbolsPos = [];
	for (var i = 0; i < this.stripData.length; i++) {
		this.reelSymbolConfig = _ng.GameConfig.reelSymbolConfig;
		var symb = new ReelSymbol(this.reelSymbolConfig[this.stripData[i]]);
		symb.name = this.stripData[i] + "_" + i;
		symb.symName = this.stripData[i];
		this.addChild(symb);
		this.symbolsArray.push(symb);
		this.symConfig = this.reelConfig.data.symbolConfig;
		symb.y = (this.symConfig.symbolHeight + this.symConfig.symbolYGap) * i;
		this.symbolsPos.push(symb.y);
	}

	if(this.reelConfig.data.reelSpinConfig.hideTopSymbol){
		this.toggleExtraSym(false);
	}
}
reelStrip.spinLoop = function (argument) {
	this.loopCounter++;
	if(_ng.GameConfig.spineSymbol && !this.isSpining){
		this.isSpining = true;
		for (var i = 0; i < this.symbolsArray.length; i++) {
			if(_ng.isQuickSpinActive && _ng.quickSpinType==="turbo"){
				this.symbolsArray[i].children[0].state.setAnimation(0, "Spin Loop", true);
			}else{
				this.symbolsArray[i].children[0].state.setAnimation(0, "Start spin", false);
			}
			this.symbolsArray[i].children[0].state.timeScale = (_ng.isQuickSpinActive && _ng.quickSpinType==="turbo") ? 2 : 1;
		}
	}else if(!_ng.GameConfig.spineSymbol){
			for (var i = 0; i < this.symbolsArray.length; i++) {
				this.symbolsArray[i].y += this.speed;
				if (this.speed < this.maxSpeed) {
					this.speed = this.speed * this.reelConfig.data.spinSpeed;
					if (this.speed > this.maxSpeed) {
						this.speed = this.maxSpeed;
					}
				}
			}
	if (this.symbolsArray[0].y >= this.symConfig.symbolHeight + this.symConfig.symbolYGap) {
		var bottomSymbol = this.symbolsArray.splice(this.symbolsArray.length - 1, 1)[0];
		bottomSymbol.y = 0;
		var extra = _ng.extraSymbols;
		var value = (extra[Math.round(Math.random() * (extra.length - 1))]);
		if(this.isStopCalled){
			if(this.tickerCounter<this.tickerSymbolsCount){
				value = this.rawSymbolsReverse[this.tickerCounter];
			}
			if(value == undefined){
				value = "a";
			}
			this.tickerCounter++;
			if(this.tickerSymbolsCount == this.tickerCounter){
				this.loopCounter = this.maxSpinTime;
			}
		}
		value = this.reelSymbolConfig[value];
		if(this.reelConfig.data.reelSpinConfig.useBlur){
			bottomSymbol.changeSymbol(value.symbol.texture+"_blur");
		}else{
			bottomSymbol.changeSymbol(value.symbol.texture);
		}
		bottomSymbol.symName = value.symbol.texture;
		this.symbolsArray.unshift(bottomSymbol);
	}
	}
	
	if (this.loopCounter < this.maxSpinTime) {
		clearTimeout(this.loopTimeout);
		this.loopTimeout = setTimeout(this.spinLoop.bind(this), 20);
	} else {
		clearTimeout(this.loopTimeout);
		this.setFinalPos();
	}
};

reelStrip.setFinalPos = function (argument) {
	_mediator.publish("setFinalPos", this.reelId);
	clearTimeout(this.loopTimeout);
	this.playReelStopSound();
	var lastReelSymbolid = this.symbolsPos.length-1;
	for (var i = 0; i < this.symbolsPos.length; i++) {
		this.symbolsArray[i].y = this.symbolsPos[i] + 60;
		try {
			// var value = this.reelSymbolConfig[this.reelData[i]];
			// this.symbolsArray[i].changeSymbol(value);
			// this.symbolsArray[i].symName = value.symbol.texture;
		} catch (e) {}

		var stopDelay = (_ng.isQuickSpinActive && _ng.quickSpinType==="turbo") ? 0.1 : 0.5;
		
		TweenLite.to(this.symbolsArray[i], stopDelay, {
			ease: Back.easeOut.config(1.7),
			y: this.symbolsPos[i],
			onComplete: function () {
				this.onFinalStopReached();
			}.bind(this)
		});
		if (this.reelId == (_ng.GameConfig.ReelViewUiConfig.data.noOfReels - 1)) { _mediator.publish("stopAnticipation"); }
	}
	if(this.reelConfig.data.reelSpinConfig.useBlur){
	 	for (var i = 0; i < this.symbolsArray.length; i++) {
	 		if(this.symbolsArray[i].symName){ this.symbolsArray[i].changeSymbol(this.symbolsArray[i].symName); }
	 	}
	}
};
reelStrip.onFinalStopReached = function (){
	this.isStopCalled = false;
	if (this.isPublishEvents == false) {
		this.isPublishEvents = true;
		
		_mediator.publish("singleReelStop", this.reelId);
		_mediator.publish("scaleReelMaskOnEachReelStop", this.reelId, 1.1);

		if (this.reelId == (_ng.GameConfig.ReelViewUiConfig.data.noOfReels - 1)) {
			_mediator.publish("allReelsStopped");
			_sndLib.stop(_sndLib.sprite.reelSpinning);
		}
		if (this.reelId == (_ng.GameConfig.ReelViewUiConfig.data.noOfReels - 2)) {
			 _sndLib.stop(_sndLib.sprite.reelSpinning);
		}
	}
	//remove all blur images from reelstrip 
	if(this.reelConfig.data.reelSpinConfig.useBlur){
		for (var i = 0; i < this.symbolsArray.length; i++) {
			this.symbolsArray[i].changeSymbol(this.symbolsArray[i].symName);
		}
	}

	if(this.reelConfig.data.reelSpinConfig.hideTopSymbol){
		this.toggleExtraSym(false);
	}
}

reelStrip.playReelStopSound = function () {
	_sndLib.play(_sndLib.sprite.reelStop);
}
reelStrip.startSpin = function (argument) {
	if(this.reelConfig.data.reelSpinConfig.hideTopSymbol){
		this.toggleExtraSym(true);
	}

	this.tickerCounter = 0;
	this.isStopCalled = false;
	this.isPublishEvents = false;
	this.loopCounter = 0;
	this.minSpeed = this.reelConfig.data.minSpeed;
	this.maxSpeed = this.reelConfig.data.maxSpeed;
	this.speed = this.minSpeed;
	this.isSpining = false;
	if (this.reelConfig.data.reelSpinConfig.startJerk) {
		TweenMax.allTo(this.symbolsArray, this.reelConfig.data.reelSpinConfig.startJerkSpeed / 1000, {
			y: '-=' + this.reelConfig.data.reelSpinConfig.startJerkDistance,
			onComplete: function () {
				this.spinLoop();
				if(this.reelConfig.data.reelSpinConfig.useBlur){
					for (var i = 0; i < this.symbolsArray.length; i++) {
						this.symbolsArray[i].changeSymbol(this.symbolsArray[i].symName+"_blur");
					}
				}
			}.bind(this)
		});
	} else {
		this.spinLoop();
		if(this.reelConfig.data.reelSpinConfig.useBlur && !_ng.isQuickSpinActive && _ng.quickSpinType!="turbo"){
			for (var i = 0; i < this.symbolsArray.length; i++) {
				var symbolImg = this.symbolsArray[i].symName ? this.symbolsArray[i].symName  : this.symbolsArray[i].config.symbol.texture;
				this.symbolsArray[i].changeSymbol(symbolImg+"_blur");
				this.symbolsArray[i].alpha = 1;
			}
		}
	}
};
reelStrip.stopSpin = function (reelAry, isStopNow) {
	this.isStopCalled = true;
	this.rawSymbols = reelAry;
	this.rawSymbolsReverse = Array.from(reelAry).reverse();
	this.reelData = this.addExtraSymbols(reelAry);
};
reelStrip.anticipateSpin = function (stripData, isStopNow) {
	this.maxSpeed = this.reelConfig.data.anticipateSpeed ? this.reelConfig.data.anticipateSpeed : 70;
	this.anticipateTimeout = this.reelConfig.data.anticipationDelay ? this.reelConfig.data.anticipationDelay : 3000;
	this.stripData = stripData;
	this.isStopNow = isStopNow;
	this.anticipationTimeout = setTimeout(this.stopSpin.bind(this, stripData, isStopNow), this.anticipateTimeout);
}
reelStrip.killAnticipation = function(){
	this.loopCounter = this.maxSpinTime;
	clearTimeout(this.anticipationTimeout);
	this.stopSpin(this.stripData, true);
}
/**@vijay code added to remove the top and bottom symbols 09-01-2020 */
reelStrip.removeTopBottomSymbols = function() {}
reelStrip.toggleExtraSym = function(bool) {
	if(bool){
		this.symbolsArray[0].alpha = 1;
		this.symbolsArray[this.symbolsPos.length-1].alpha = 1;
	}else{
		this.symbolsArray[0].alpha = 0;
		this.symbolsArray[this.symbolsPos.length-1].alpha = 0;
	}
}

