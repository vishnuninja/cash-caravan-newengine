function ReelView(argument) {
	ViewContainer.call(this, arguments);
}

ReelView.prototype = Object.create(ViewContainer.prototype);
ReelView.prototype.constructor = ReelView.prototype;
var view = ReelView.prototype;

view.createView = function (argument) {
	this.forceStop = false;
	this.reelConfig = _ng.GameConfig.ReelViewUiConfig;
	this.isAnticipateSndPlaying = false;
	this.createExtraBottomElements();
	if (this.reelConfig.reelGridBottom) {
		this.createBottomGrid();
	}
	if (this.reelConfig.fsReelGridBottom) {
		this.createFSBottomGrid();
	}

	//actual gamereels 
	this.createReels();


	if (this.reelConfig.data.maskInfo.maskType == 1) {
		this.createSingleMask();
	} else if (this.reelConfig.data.maskInfo.maskType == 2){
        this.createReelWiseMask();
	}	
	if (this.reelConfig.reelGridTop) {
		this.createTopGrid();
	}
	if (this.reelConfig.fsReelGridTop) {
		this.createFSTopGrid();
	}
	this.createExtraElements();
};


view.createExtraBottomElements = function(){
	
}
view.createExtraElements = function () {
	// body...
}
view.showWildMultiplier = function(){}

view.createBottomGrid = function (argument) {
	//@todo need to update frame in freespin/normal spin
	this.bottomGrid = pixiLib.getElement("Sprite", this.reelConfig.reelGridBottom.image);
	this.bottomGrid.name = "bottomGrid";
	this.addChild(this.bottomGrid);
	pixiLib.setProperties(this.bottomGrid, this.reelConfig.reelGridBottom.props["VD"]);
}

view.createFSBottomGrid = function () {
	this.fsBottomGrid = pixiLib.getElement("Sprite", this.reelConfig.fsReelGridBottom.image);
	this.fsBottomGrid.name = "fsBottomGrid";
	this.addChild(this.fsBottomGrid);
	pixiLib.setProperties(this.fsBottomGrid, this.reelConfig.fsReelGridBottom.props["VD"]);
	this.fsBottomGrid.visible = false;
}
view.showFreespinGrid = function () {
	if (this.fsBottomGrid) {
		this.fsBottomGrid.alpha = 0;
		this.fsBottomGrid.visible = true;
		TweenMax.to(this.fsBottomGrid, 1, { alpha: 1 })
	}

	if (this.fsTopGrid) {
		this.fsTopGrid.alpha = 0;
		this.fsTopGrid.visible = true;
		TweenMax.to(this.fsTopGrid, 1, { alpha: 1 })
	}
}
view.hideFreespinGrid = function () {
	if (this.fsBottomGrid) {
		TweenMax.to(this.fsBottomGrid, 1, {
			alpha: 0,
			onComplete: function () {
				this.fsBottomGrid.visible = false;
				this.fsBottomGrid.alpha = 1;
			}.bind(this)
		})
	}
	if (this.fsTopGrid) {
		TweenMax.to(this.fsTopGrid, 1, {
			alpha: 0,
			onComplete: function () {
				this.fsTopGrid.visible = false;
				this.fsTopGrid.alpha = 1;
			}.bind(this)
		})
	}
}
view.createTopGrid = function (argument) {
	this.topGrid = pixiLib.getElement("Sprite", this.reelConfig.reelGridTop.image);
	this.topGrid.name = "topGrid";
	this.addChild(this.topGrid);
	pixiLib.setProperties(this.topGrid, this.reelConfig.reelGridTop.props["VD"]);
}

view.createFSTopGrid = function (argument) {
	this.fsTopGrid = pixiLib.getElement("Sprite", this.reelConfig.fsReelGridTop.image);
	this.fsTopGrid.name = "fsTopGrid";
	this.addChild(this.fsTopGrid);
	pixiLib.setProperties(this.fsTopGrid, this.reelConfig.fsReelGridTop.props["VD"]);
	this.fsTopGrid.visible = false;
}

view.createSingleMask = function (argument) {
	var maskPosition = this.reelConfig.data.maskInfo.maskPosition;
	this.maskObj = pixiLib.getElement("Graphics", {w: maskPosition.width, h: maskPosition.height, type: maskPosition.type, pointsArray: maskPosition.pointsArray});
	this.maskObj.name = "maskObject";
	this.addChild(this.maskObj);
	pixiLib.setProperties(this.maskObj, maskPosition);
	//mask
	this.reelContainer.mask = this.maskObj;
}
/**@vijay creating the reelwise mask 10-01-2020 */
view.createReelWiseMask = function () {

	for (var i = 0; i < this.reelConfig.data.noOfReels; i++) {
	var maskPosition = this.reelConfig.data.maskInfo.reelMaskPosition[i];
	this.maskObj = pixiLib.getElement("Graphics", {w: maskPosition.width, h: maskPosition.height, type: maskPosition.type, pointsArray: maskPosition.pointsArray});
	this.maskObj.name = "maskObject"+i;
	this.maskObj.alpha = 0.5; 
	//.anchor.y =
	//pixiLib.setProperties(this.maskObj, {anchor: {x: 0.5, y: 0.5}});
//	this.maskObj.anchor.set(0.5, 0.5);
	this.addChild(this.maskObj);
	pixiLib.setProperties(this.maskObj, maskPosition);
	var reelObj = this.reelContainer.getChildByName(("reelObj"+i));
	reelObj.mask = this.maskObj; 
	}
}

view.toggleMask = function (bool){
	if(bool){
		this.maskObj.visible = true;
		this.reelContainer.mask = this.maskObj;
	}else{
		this.reelContainer.mask = null;
		this.maskObj.visible = false;
	}
}



view.createReels = function (argument) {
	this.reels = [];

	this.reelContainer = pixiLib.getContainer();
	this.reelContainer.name = "reels"
	this.addChild(this.reelContainer);

	for (var i = 0; i < this.reelConfig.data.noOfReels; i++) {
		var reelObj = new TumbleReelStrip(i, this);
		reelObj.name =  "reelObj"+i;
		this.reelContainer.addChild(reelObj);
		if (this.reelConfig.data.eachReelPos) {
			reelObj.x = this.reelConfig.data.eachReelPos[i];
		} else {
			reelObj.x = (this.reelConfig.data.symbolConfig.symbolWidth + this.reelConfig.data.symbolConfig.symbolXGap) * i;
		}
		if(this.reelConfig.data.eachReelYPos){
			reelObj.y = this.reelConfig.data.eachReelYPos[i];
		}
		// reelObj.createView(i);
		this.reels.push(reelObj);
	}
	pixiLib.setProperties(this.reelContainer, this.reelConfig.data.reelPositionsWRTGrid);
	//Adding top reel...
	this.topreelContainer = pixiLib.getContainer();
	this.topreelContainer.name = "topreels"
	this.addChild(this.topreelContainer);
	var topReel = new TopTumbleReelStrip(i, this);
	topReel.name = "topReel";
	this.topreelContainer.addChild(topReel);
	this.topreelContainer.position.set(386, 52);
	this.reels.push(topReel);
}


view.startSpin = function (argument) {
	//console.log(" on all reels startedd ============================");
	this.startSpinCounter = 0;
	this.stopSpinCounter = 0;
	this.forceStop = false;
	_sndLib.play(_sndLib.sprite.reelSpinning);
	this.anticipateAry = {};
	this.isAnticipateActive = false;
	this.isAnticipateSndPlaying = false;
	this.individualStrip("start");
	// if(this.reelConfig.data.reelSpinConfig.hideTopSymbol){
	// 	this.toggleMask(true);
	// }
};

view.quickSpinStart = function (argument) {
	//console.log(" on all reels startedd ============================");
	this.startSpinCounter = 0;
	this.stopSpinCounter = 0;
	this.forceStop = false;
	_sndLib.play(_sndLib.sprite.reelSpinning);
	this.anticipateAry = {};
	this.isAnticipateActive = false;
	this.isAnticipateSndPlaying = false;

	//start all reels at once 
	for (var i = 0; i < this.reelConfig.data.noOfReels; i++) { 
		_mediator.publish("onEachReelStart", i);
		this.reels[i].startSpin();
	}
	_mediator.publish("allReelsStarted");
	// if(this.reelConfig.data.reelSpinConfig.hideTopSymbol){
	// 	this.toggleMask(true);
	// }
};

view.individualStrip = function (spinType, isStopNow) {
	if (spinType == "start") {
		if (this.startSpinCounter >= this.reels.length) {
			this.startSpinCounter = this.reels.length - 1;
		}
		_mediator.publish("onEachReelStart", this.startSpinCounter);
		this.reels[this.startSpinCounter].startSpin();
	} else {
	//spintype is == stop

		if (this.startSpinCounter >= this.reels.length) {
			this.startSpinCounter = this.reels.length - 1;
		}

		if (this.isAnticipateActive && ( !_ng.GameConfig.anticipationReels || _ng.GameConfig.anticipationReels[this.startSpinCounter]) && !isStopNow) {
			//console.log(" Anticipation is activated! ======");
			if (!this.isAnticipateSndPlaying) {
				_sndLib.stop(_sndLib.sprite.reelSpinning);
				_sndLib.play(_sndLib.sprite.anticipation);
				this.isAnticipateSndPlaying = true;
			}

			this.addAnticipateReelAnim(this.startSpinCounter);
			this.reels[this.startSpinCounter].anticipateSpin(this.reelsData[this.startSpinCounter], isStopNow);
			this.currentAnticipationReelId = this.startSpinCounter;
		} else {
			this.reels[this.startSpinCounter].stopSpin(this.reelsData[this.startSpinCounter], isStopNow);
		}
	}
	this.startSpinCounter++;

	//@todo make it dynamic each real stop delay
	if (this.startSpinCounter < this.reelConfig.data.noOfReels) {
		this.delayInterval = (spinType == "start") ? this.reelConfig.data.reelSpinConfig.reelSpinStartGap : this.reelConfig.data.reelSpinConfig.reelStopGap;
		
		var anticipateDelay = this.reelConfig.data.anticipationDelay;
		var delay = (this.isAnticipateActive) ? anticipateDelay : this.delayInterval;

		if (isStopNow) {
			var delay = 5;
		}

		this.callNextReelInterval = setTimeout(this.individualStrip.bind(this, spinType, isStopNow), delay);
	} else {
		_mediator.publish("allReelsStarted");
	}

	//Scatter anticipation conditions
	if (_ng.GameConfig.aniticipateSymbol && spinType === "stop" && this.isAnticipateActive == false && this.forceStop == false && _viewInfoUtil.isSecondaryAssetsLoaded && !isStopNow) {
		this.checkIsScatter(this.reelsData[this.startSpinCounter - 1]);
	}
}


view.individualStripStop = function (spinType, isStopNow) {
	if (this.stopSpinCounter >= this.reels.length) {
		this.stopSpinCounter = this.reels.length - 1;
	}
	if (this.isAnticipateActive && ( !_ng.GameConfig.anticipationReels || _ng.GameConfig.anticipationReels[this.stopSpinCounter]) && !isStopNow) {
		//console.log(" Anticipation is activated! ======");
		if (!this.isAnticipateSndPlaying || _ng.GameConfig.sounds.playAnticipationForEachReel) {
			_sndLib.stop(_sndLib.sprite.reelSpinning);
			_sndLib.play(_sndLib.sprite.anticipation);
			this.isAnticipateSndPlaying = true;
		}

		this.addAnticipateReelAnim(this.stopSpinCounter);
		this.reels[this.stopSpinCounter].anticipateSpin(this.reelsData[this.stopSpinCounter], isStopNow);
		this.currentAnticipationReelId = this.stopSpinCounter;
	} else {
		this.reels[this.stopSpinCounter].stopSpin(this.reelsData[this.stopSpinCounter], isStopNow);
	}
	this.stopSpinCounter++;

	//@todo make it dynamic each real stop delay
	if (this.stopSpinCounter < this.reelConfig.data.noOfReels) {
		this.delayInterval = this.reelConfig.data.reelSpinConfig.reelStopGap;
		
		var anticipateDelay = this.reelConfig.data.anticipationDelay;
		var delay = (this.isAnticipateActive) ? anticipateDelay : this.delayInterval;

		if (isStopNow) {
			var delay = 5;
		}
		this.reelIntervalId = this.stopSpinCounter-1;
		this.callNextReelInterval = setTimeout(this.individualStripStop.bind(this, spinType, isStopNow), delay);
	} else {
		_mediator.publish("allReelsStarted");
	}

	//Scatter anticipation conditions
	if (_ng.GameConfig.aniticipateSymbol && spinType === "stop" && this.isAnticipateActive == false && this.forceStop == false && _viewInfoUtil.isSecondaryAssetsLoaded) {
		this.checkIsScatter(this.reelsData[this.stopSpinCounter - 1]);
	}
}

view.stopSpin = function (matrix) {
	this.anticipateAry = {};
	this.isAnticipateActive = false;
	this.reelsData = matrix;
	this.totalScatters = 0;
	this.stopSpinCounter = 0;
	this.individualStripStop("stop");
};

//stop button code 
view.stopSpinNow = function (matrix) {
	this.reelsData = matrix;
	this.anticipateAry = {};
	this.forceStop = true;

	if(this.isAnticipateActive && this.currentAnticipationReelId){
		this.reels[this.currentAnticipationReelId].killAnticipation();
	}

	this.stopAnticipation();
	this.isAnticipateActive = false;
	clearTimeout(this.callNextReelInterval);
	this.individualStripStop("stop", true);	
};
view.quickSpinStop = function (matrix) {
	this.reelsData = matrix;
	this.anticipateAry = {};
	this.forceStop = true;

	if(this.isAnticipateActive && this.currentAnticipationReelId){
		this.reels[this.currentAnticipationReelId].killAnticipation();
	}
	this.stopAnticipation();
	this.isAnticipateActive = false;
	clearTimeout(this.callNextReelInterval);

	for (var i = 0; i < this.reelConfig.data.noOfReels; i++) {
		this.reels[i].stopSpin(this.reelsData[i], true);
	}
	
};

view.fadeReels = function (value) {
	if (this.reelConfig.data.isSymbolFadeInWins) {
		for (var i = 0; i < this.reels.length; i++) {
			this.reels[i].alpha = value;
		}
	}
};
view.addTintOnSymbols = function (dataObj) {
	var tintValue = (dataObj && dataObj.tintValue) || 0xFFFFFF;
	var symbolArray = (dataObj && dataObj.symbolArray) || undefined;
	if (symbolArray && symbolArray.length > 0) {
		for (var i = 0; i < symbolArray.length; i++) {
			var rowColumn = pixiLib.getRowColumn(symbolArray[i]);
			this.reels[rowColumn.column].symbolsArray[rowColumn.row + 1].applyTint(tintValue);
		}
	} else {
		for (var i = 0; i < this.reelConfig.data.noOfReels; i++) {
			for (var j = 0; j < this.reelConfig.data.noOfSymbols; j++) {
				this.reels[i].symbolsArray[j + 1].applyTint(tintValue);
			}
		}
	}
}
view.fadeAllSymbols = function (value) {
	if (isNaN(value)) {
		value = 0.5;
	}
	for (var i = 0; i < this.reels.length; i++) {
		this.reels[i].alpha = value;
	}
}
view.fadeReelSymbols = function (lineAry) {
	this.fadeReels(0.3);
	if (this.reelConfig.data.isSymbolFadeInWins) {
		for (var i = 0; i < lineAry.pos.length; i++) {
			var yPos = Number(lineAry.pos[i]);
			var posObj = pixiLib.getRowColumn(yPos);
			this.reels[posObj.column].symbolsArray[posObj.row + 1].visible = false;
		}
	}
};
// backup 
// view.fadeReelSymbols = function (lineAry) {
// 	this.fadeReels(0.3);
// 	if (this.reelConfig.data.isSymbolFadeInWins) {
// 		var count = 0;
// 		for (var i = 0; i < this.reels.length; i++) {
// 			if (lineAry.blink[i] == 1) {
// 				var yPos = Math.floor(Number(lineAry.pos[count]) / Number(this.reelConfig.data.noOfReels));
// 				this.reels[i].symbolsArray[yPos + 1].visible = false;
// 				count++;
// 			}
// 		}
// 	}
// };
view.hideReelSymbols = function (symbolArray, type) {
	if(type === "eachReel"){
		for (var i = 0; i < symbolArray.length; i++) {
			this.reels[symbolArray[i][0]].symbolsArray[symbolArray[i][1]+1].visible = false;
		}
		return;
	}
	for (var i = 0; i < symbolArray.length; i++) {
		var rowColumn = pixiLib.getRowColumn(symbolArray[i]);
		this.reels[rowColumn.column].symbolsArray[rowColumn.row + 1].visible = false;
	}
}
view.clearReelSymbols = function (lineAry) {
	for (var i = 0; i < this.reels.length; i++) {
		for (var j = 0; j < this.reels[i].symbolsArray.length; j++) {
			this.reels[i].symbolsArray[j].visible = true;
		}
	}
};
view.endSpinImmediatly = function (argument) { };
view.onSpinResponse = function (argument) { };
view.onReelSpinStarted = function (argument) { };
view.onAllReelsStopped = function (argument) { };
view.onEachReelStop = function (reelNumber) { };




view.resize = function (argument) {
	for (var i = 0; i < viewConfig.length; i++) {
		UIUtils.setProperties(this[this.viewConfig[i].id], this.viewConfig[i].props);
	}
};

view.show = function (argument) {
	this.visible = true;
};

view.hide = function (argument) {
	this.visible = false;
};

view.destroy = function (argument) {
	this.destroy();
};
view.checkIsScatter = function (matrix) {
	var scatters = _ng.GameConfig.aniticipateSymbol;
	for (var i = 0; i < scatters.length; i++) {
		if (matrix.indexOf(scatters[i]) >= 0) {
			if (!this.anticipateAry[scatters[i]]) {
				this.anticipateAry[scatters[i]] = [];
			}
			this.anticipateAry[scatters[i]].push(scatters[i]);
			if (this.anticipateAry[scatters[i]].length >= 2) {
				this.isAnticipateActive = true;
			}
		}
	}
	this.addGameSpecificCondition()
};

view.addGameSpecificCondition = function () {

}
view.addAnticipateReelAnim = function (reelId) {
	if (this.reelConfig.data.anticipationSpine) {
		this.addSpineAnticipationAnim(reelId);
		var props = this.reelConfig.data.anticipationSpine.props;
	} else if (this.reelConfig.data.anticipationFrames) {
		this.addSpritAnimation(reelId);
		var props = this.reelConfig.data.anticipationFrames.props;
	} else {
		return;
	}
	
	if(props.length && props.length > 0){
		props = props[reelId];
	}
	this.reelFrame.visible = true;
	this.reelFrame.x = this.reels[reelId].x + props.x;
	this.reelFrame.y = this.reels[reelId].y + props.y;
	if (props.scale) {
		this.reelFrame.scale.x = props.scale.x ? props.scale.x : 1;
		this.reelFrame.scale.y = props.scale.y ? props.scale.y : 1;
	}
	this.reelFrame.animationSpeed = props.animationSpeed ? props.animationSpeed : 1;
	this.updateAnticipationDynamicProp(reelId);
}
view.updateAnticipationDynamicProp = function (reelId) {
	// add properties to fix position of anticipation animation if reels are not required.
};

view.addSpineAnticipationAnim = function (reelId) {
	//console.log("spin anticipation ==========");
	if (!this.reelFrame && this.reelConfig.data.anticipationSpine) {
		this.reelFrame = new PIXI.spine.Spine(PIXI.Loader.shared.resources[this.reelConfig.data.anticipationSpine.spineName].spineData);
		this.reelFrame.name = "SpineAnimation";
		this.reelFrame.type = "spine"
		this.reelFrame.visible = true;
		this.addChild(this.reelFrame);
		//@Must be removed and add in reelconfig
		this.reelFrame.scale.set(0.5);
		this.reelFrame.state.setAnimation(0, this.reelConfig.data.anticipationSpine.animationName, true);
	}
}

view.addSpritAnimation = function (reelId) {
	//console.log("frames  anticipation ==========");
	if (!this.reelFrame) {
		this.reelFrame = pixiLib.getElement("AnimatedSprite", this.reelConfig.data.anticipationFrames.frames);
		this.reelFrame.name = "SpriteAnimation";
		this.addChild(this.reelFrame);
		this.reelFrame.type = "frames";
		this.reelFrame.visible = true;
	}
	this.reelFrame.play();
}

view.onAllReelsStopped = function () {
	//console.log(" on all reels stopped ============================");
	_sndLib.stop(_sndLib.sprite.reelSpinning);
	// this.stopAnticipation();
	clearTimeout(this.callNextReelInterval);
}
view.stopAnticipation = function (){
	if(!this.isAnticipateActive){
		return;
	}
	if (this.reelFrame) {
		if (this.reelFrame.type === "frames") {
			this.reelFrame.stop();
		}
		_sndLib.stop(_sndLib.sprite.anticipation);
		this.isAnticipateSndPlaying = false;
		this.reelFrame.visible = false;
	}
}
