var gWV = WinView.prototype;
var FsTotalMultiplier = 0;

gWV.addGameElements = function () {
	this.totalMultiplierValue = [];
	this.freespinTotalValue = 0;
	this.multiContainer = pixiLib.getContainer();
	this.multiContainer.alpha = 0;
	this.addChild(this.multiContainer);

	this.tumbleBox = pixiLib.getElement("Sprite", "tumble_box");
	this.tumbleBox.position.set(-735, -397);
	this.multiContainer.addChild(this.tumbleBox);

	this.currentTotal = 0;
	this.finalValue = 0;
	this.scatterCount = 0;

	var multiplierWinTxtStyle = {
		// "type": "BitmapFont",
		// "fontName": "Numbers-export",
		"fontSize": 25,
		"align": "center"
	}
	var multiText = {
		// "type": "BitmapFont",
		// "fontName": "featureBitmapFont-export",
		"fontSize": 35,
		"align": "center"
	}
	var winStyle = {
		// "type": "BitmapFont",
		// "fontName": "numbers-export",
		"fontSize": 45,
		"align": "center"
	};
	var winStyle1 = {
		// "type": "BitmapFont",
		// "fontName": "dedeBitmap",
		"fontSize": 28,
		"align": "center"
	};

	this.allWin = pixiLib.getElement("Text", winStyle1);
	this.allWin.name = "All win text";
	this.allWin._rawAmount = 0;
	this.multiContainer.addChild(this.allWin);
	pixiLib.setText(this.allWin, "");
	this.allWin.anchor.set(0.5);
	this.allWin.position.set(-492, -356);

	this.multiplierWinTxt = pixiLib.getElement("Text", multiText);
	this.multiContainer.addChild(this.multiplierWinTxt);
	pixiLib.setText(this.multiplierWinTxt, "");
	this.multiplierWinTxt.anchor.set(0.5);
	this.multiplierWinTxt.name = "MultiplayerWinText";
	this.multiplierWinTxt.x = this.allWin.x + this.allWin.width + 10;
	this.multiplierWinTxt.y = -353;
	this.multiplierWinTxt.visible = true;
	this.addChild(this.multiContainer);

	this.BonusPos = [];
	this.winBgs = [];
	this.winTexts = [];
	this.winFlame = [];
	this.BonusPosX = [147, 316, 488, 659, 829]
	this.BonusPosY = [175, 357, 530]
	this.winAnimArr = [];

	_mediator.subscribe("hitSym", this.hitSym.bind(this));
	_mediator.subscribe('removeMultipliers', this.removeMultipliers.bind(this));
	_mediator.subscribe('createSticky', this.createSticky.bind(this));
	_mediator.subscribe('tweenTotalWin', this.tweenTotalWin.bind(this));
	_mediator.subscribe('removeAllmultipliers', this.removeAllmultipliers.bind(this));
	_mediator.subscribe('getTotalwin', this.getTotalwin.bind(this));
	_mediator.subscribe("TumbleWin", this.TumbleWin.bind(this));
	_mediator.subscribe("removeWinAnim", this.removewinAnim.bind(this));
	_mediator.subscribe("ScatterWin", this.ScatterWin.bind(this))
	_mediator.subscribe("toggleTumbleBox", this.toggleTumbleBox.bind(this));
	_mediator.subscribe("updateTextWithCountUp", this.updateTextWithCountUp.bind(this));
	_mediator.subscribe("showExtraSpins", this.showExtraSpins.bind(this));
	_mediator.subscribe("playLandAnim", this.playLandAnim.bind(this));
	_mediator.subscribe("resetTotalFSWin", this.resetTotalFSWin.bind(this));
	_mediator.subscribe("playBearWinAnimation", this.playBearWinAnimation.bind(this));
	this.cacheID = 100;
	this.cachePos = 100;
	this.bearPos = {
		VD: { x: 1180, y: 375, scale: 0.67 },
		VL: { x: 1193, y: 360, scale: 0.67 },
		VP: { x: 676, y: 869, scale: 0.7},
	}

	this.createBearCharacter();
	this.onGameResize();
}
gWV.onGameResize = function (val) {

	_mediator.publish("ResizeGview");
	if (_viewInfoUtil.viewType == "VP") {

		this.multiContainer.position.set(611, -87);
		this.multiContainer.scale.set(1);

		this.tumbleBox.scale.set(0.75);
		this.tumbleBox.position.set(-120, 87);

		this.allWin.position.set(60, 116);
		this.multiplierWinTxt.position.set(170, 117);
	}
	else if (_viewInfoUtil.viewType == "VL") {
		// this.multiContainer.x = -35;
		// this.multiContainer.y = 230;
		this.multiContainer.position.set(45, 392);
		this.multiContainer.scale.set(1);
		this.tumbleBox.x = 465;
		this.tumbleBox.y = -391;
		this.tumbleBox.scale.set(0.67);
		this.allWin.position.set(640, -362);
		this.multiplierWinTxt.x = 747;
		this.multiplierWinTxt.y = -367;

	} else {
		this.multiContainer.position.set(1061, 314);
		this.multiContainer.scale.set(0.8)

	}
	_mediator.publish("resizeBuypopup")
	if (this.bearCharacter) {
		this.bearCharacter.scale.set(this.bearPos[_viewInfoUtil.viewType].scale);
		this.bearCharacter.position.set(this.bearPos[_viewInfoUtil.viewType].x, this.bearPos[_viewInfoUtil.viewType].y);

		// if (_viewInfoUtil.viewType == "VL") {
		// 	this.bearCharacter.mask = null;
		// 	this.characterMask.visible = false;
		// } else if (_viewInfoUtil.viewType == "VP") {
		// 	this.characterMask.scale.set(this.bearPos[_viewInfoUtil.viewType].scale);
		// 	this.characterMask.position.set(this.bearPos[_viewInfoUtil.viewType].x - this.bearCharacter.width / 2,
		// 		this.bearPos[_viewInfoUtil.viewType].y - this.bearCharacter.height / 2);
		// 	this.bearCharacter.mask = this.characterMask;
		// 	this.characterMask.visible = true;
		// }
	}
}
gWV.resetTotalFSWin = function (value) {
	this.freespinTotalValue = value;
}
gWV.showAlternateLineWins = function (linesObj) {
	this.alternatetriggeredOnce = false;
	this.linesObj = linesObj;
	this.linesLoopIndex = 0;
	this.lineWinsLoopCount = 0;
	_mediator.publish("FadeReels", 1);
	if (this.BonusPos.length > 0) {
		setTimeout(
			function () {
				this.showLine();
				if (!(coreApp.gameModel.userModel.userData.next_round && coreApp.gameModel.userModel.userData.next_round.type == "freespins"))
					_mediator.publish("EnablePanel");
				_mediator.publish("FadeReels", 0.3);
			}.bind(this), (_ng.isQuickSpinActive && _ng.quickSpinType === "turbo") ?
			500 : this.BonusPos.length * 450
		)
	}
	else {
		this.showLine();
	}
};

gWV.showAllWins = function (allWinLines) {
	this.createWinSymbolContainer();
	if (this.lineSymbols) { this.clearLine(); }
	this.tweens = [];
	this.lineSymbols = [];
	this.linesObj = allWinLines;
	var isWildInWinLine = false;

	for (let k = 0; k < this.linesObj.length; k++) {
		var lineNum = this.linesObj[k].line;
		for (var i = 0; i < this.linesObj[k].pos.length; i++) {
			var symbol = this.getSymbolFromPosition(this.linesObj[k].pos[i]);
			if (symbol === "w") {
				isWildInWinLine = true;
			}
		}
	}

	for (let k = 0; k < this.linesObj.length; k++) {
		var lineNum = this.linesObj[k].line;
		for (var i = 0; i < this.linesObj[k].pos.length; i++) {
			var symbol = this.getSymbolFromPosition(this.linesObj[k].pos[i]);
			symbol = this.getSymbolName(symbol);
			if (isWildInWinLine && _ng.GameConfig.symbolAnimations[symbol + "_wild"]) { symbol = symbol + "_wild"; }
			var winSym = new WinSymbol(symbol);
			this.winSymbolContainer.addChild(winSym);
			winSym.playAnimation();
			this.lineSymbols.push(winSym);

			var symbolOffset = { x: 0, y: 0 };
			if (this.animationConfig[symbol] && this.animationConfig[symbol][0].offset && _viewInfoUtil.isSecondaryAssetsLoaded) { symbolOffset = this.animationConfig[symbol][0].offset; }
			var xReelPos = this.getSymbolFromPosition(this.linesObj[k].pos[i], "xValue");
			var yReelPos = this.getSymbolFromPosition(this.linesObj[k].pos[i], "yValue");
			winSym.x = this.reelConfig.data.eachReelPos[xReelPos] + symbolOffset.x;
			var symbolTopPadding = (this.reelConfig.data.eachReelYPos) ? this.reelConfig.data.eachReelYPos[xReelPos] : 0;
			var yPos = Math.floor(Number(this.linesObj[k].pos[i]) / Number(this.reelConfig.data.noOfReels));
			var gaps = (this.symConfig.symbolYGap * (yPos + 1));
			winSym.y = ((this.symConfig.symbolHeight) * (yPos + 1)) + gaps + symbolTopPadding + symbolOffset.y;
			if (this.getValidateExpWild(this.linesObj[k].pos[i])) {
				var frames = [];
				for (var z = 1; z < 25; z++) {
					frames.push(PIXI.Texture.from((z < 10) ? "wexp_0" + z : "wexp_" + z));
				}
				var expWild = new PIXI.AnimatedSprite(frames)
				if (!this.wildSybols) { this.wildSybols = []; }
				this.wildSybols.push(expWild);
				this.winSymbolContainer.addChild(expWild);
				expWild.x = winSym.x - 92; expWild.y = winSym.y - 89;
				expWild.play();
				winSym.visible = false;
			}
			this.updateSymbolProps(winSym, k, i);
		}
		// _mediator.publish("showSingleLine", lineNum, k);
	}
	this.allWinsAdditionalAnimation();
};
gWV.hitSym = function (reelNum, symArray) {
}

gWV.clearAllWins = function () {
	if (this.wildSybols) {
		for (var i = 0; i < this.wildSybols.length; i++) {
			this.winSymbolContainer.removeChild(this.wildSybols[i]);
		}
		this.wildSybols = [];
	}
	this.isStopSpinCalled = false;
	this.clearLine();
	try {
		if (this.symbolForWinSound) { _sndLib.stop(_sndLib.sprite[this.symbolForWinSound]); }
	} catch (e) { }
	clearTimeout(this.showLineTimeout);
};
gWV.getValidateExpWild = function (position) {
	if ((position == 0 || position == 1 || position == 2 || position == 3 || position == 4) && _ng.expandedReels && _ng.expandedReels[position]) { return true; }
	return false;
}
gWV.removeWinBg = function () {
	if (this.border) {
		this.removeChild(this.border);
	}
}
gWV.CreateWinBg = function () {

	this.border = pixiLib.getElement("Sprite", "Total_Base");
	this.border.name = "BG border";
	// this.border.scale.set(0.1);
	this.border.rotation = 1.57;
	this.addChild(this.border);
	this.border.x = 640; this.border.y = 400;


	if (_viewInfoUtil.viewType === "VD") {
		this.border.x = 595; this.border.y = 335;
		this.border.scale.set(1.5);
	}
	else if (_viewInfoUtil.viewType === "VP") {
		this.border.x = 670; this.border.y = 319;
		this.border.scale.set(1.2);
	}
	else {
		this.border.x = 732; this.border.y = 300;
		this.border.scale.set(2, 2);
	}
}

// Rest of code is multiplier part done by Jeffin
gWV.createStickyContainer = function () {
	if (!this.stickyContainer) {
		this.stickyContainer = pixiLib.getContainer();
		this.stickyContainer.name = "stickyContainer";
		this.addChild(this.stickyContainer);
	}
	else {
		this.stickyContainer.visible = true;
	}
	this.stickyContainer.x = coreApp.gameView.reelController.view.reelContainer.x;
	this.stickyContainer.y = coreApp.gameView.reelController.view.reelContainer.y;
}

gWV.removeMultipliers = function () {
	if (this.allWinMoved && this.allWinMoved == true) {
		// this.allWin.x = this.allWin.x + 50;
		this.allWinMoved = false;
	}
	pixiLib.setText(this.allWin, "");
	this.allWin._rawAmount = 0;

	this.currentTotal = 0;
	if (coreApp.gameModel.userModel.userData.current_round.spin_type == "freespin") {
		if (this.stickyContainer) {
			this.removeChild(this.stickyContainer)
			delete this.stickyContainer;
		}
		this.toggleTumbleBox(0);
		_mediator.publish("toggleFadeContainer", true);
		this.currentTotal = 0;
		this.finalValue = 0;
		this.multiplierTotal = 0;
		pixiLib.setText(this.allWin, "");
		indexValue = -1;
		pixiLib.setText(this.multiplierWinTxt, "");
		this.totalMultiplierValue = [];
		this.multiplierArray = [];
	}
}

gWV.calculatePosFromIndex = function (value) {
	var symbol = "m";
	var xReelPos = this.getSymbolFromPosition(value, "xValue");
	var symbolOffset = (this.animationConfig[symbol] && this.animationConfig[symbol][0].offset && _viewInfoUtil.isSecondaryAssetsLoaded) ? this.animationConfig[symbol][0].offset : { x: 0, y: 0 };
	var symbolTopPadding = (this.reelConfig.data.eachReelYPos) ? this.reelConfig.data.eachReelYPos[xReelPos] : 0;
	var yPos = Math.floor(Number(value) / Number(this.reelConfig.data.noOfReels));
	var gaps = (this.symConfig.symbolYGap * (yPos + 1));
	xPos = this.reelConfig.data.eachReelPos[xReelPos] + symbolOffset.x;
	yPos = ((this.symConfig.symbolHeight) * (yPos + 1)) + gaps + symbolTopPadding + symbolOffset.y;
	let positions = [xPos, yPos];
	return positions;
}
gWV.getNonZeroMultiplierPos = function (arr) {
	let tmpPosArray = [];
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] !== 0) {
			let temp = [arr[i], i];
			tmpPosArray.push(temp);
		}
	}
	return tmpPosArray;
}
gWV.showLine = function () { };
gWV.newReelSymbols = function () {

}
gWV.createSticky = function () {
	if (coreApp.gameModel.userModel.userData.current_round.spin_type == "freespin" && this.currentTotal > 0) {
		this.createStickyandTween();
	}
}
gWV.createStickyandTween = function () {
	this.PottextStyle = {
		"type": "BitmapFont",
		"fontName": "box-Multiplier",
		"fontSize": 18,
		"align": "center"
	};
	// if(globalArray.length == 0){
	// 			return;
	// };
	this.createStickyContainer();
	this.multiplierTotal = 0;
	this.multiplierArray = [];
	this.symbolIndex = this.findSticky();
	// _mediator.publish("visibilityOfMultiplierSymbol", 0);
	for (let index = 0; index < this.symbolIndex.length; index++) {

		let newPos = this.calculatePosFromIndex(this.symbolIndex[index][1]);
		this.TweenMultiplierText = pixiLib.getElement("Text", this.PottextStyle);
		this.TweenMultiplierText.anchor.set(0.5);
		this.TweenMultiplierText.name = "Multiplier " + index;
		pixiLib.setText(this.TweenMultiplierText, this.symbolIndex[index][0] + "x");
		this.TweenMultiplierText.x = newPos[0];
		this.totalMultiplierValue.push(this.symbolIndex[index][0]);
		this.TweenMultiplierText.y = newPos[1];
		this.stickyContainer.addChild(this.TweenMultiplierText);
		this.TweenMultiplierText.alpha = 0;
		let temp = [this.TweenMultiplierText, this.symbolIndex[index][0]];
		this.multiplierArray.push(temp);
	}
	setTimeout(() => {
		this.tweenAnimation();
		// _mediator.publish("visibilityOfMultiplierSymbol", 1);
	}, 1400);
}

gWV.showEachReelStopAction = function (reelId, reelStrip) {
	//#todo if this reel is not expanded 
	if (!_ng.GameConfig.ReelViewUiConfig.showScatterLand || !_viewInfoUtil.isSecondaryAssetsLoaded) {
		return;
	}
	this.createWinSymbolContainer();

	var symbolArray = [];
	if (reelId == 0) { this.scatterCount = 0; }

	if (!_ng.isQuickSpinActive) {
		for (i = 0; i < reelStrip.length; i++) {
			for (j = 0; j < _ng.GameConfig.aniticipateSymbol.length; j++) {
				if (reelStrip[i] === _ng.GameConfig.aniticipateSymbol[j]) {
					this.scatterCount += 1;
					// var winSym = new WinSymbol(_ng.GameConfig.aniticipateSymbol[j] + "_land");
					// this.winSymbolContainer.addChild(winSym);
					// var symbolTopPadding = 0;
					// if (this.reelConfig.data.eachReelYPos) {
					//     symbolTopPadding = this.reelConfig.data.eachReelYPos[i];
					// }
					// var symbolOffset = {x: 0, y: 0};
					// if (this.animationConfig[_ng.GameConfig.aniticipateSymbol[j]] && this.animationConfig[_ng.GameConfig.aniticipateSymbol[j]].offset){
					//     symbolOffset = this.animationConfig[_ng.GameConfig.aniticipateSymbol[j]].offset
					// }
					// if (this.reelConfig.data.eachReelPos && this.reelConfig.data.eachReelPos[i] !== undefined) {
					//     winSym.x = this.reelConfig.data.eachReelPos[reelId] + symbolOffset.x;
					// } else {
					//     winSym.x = this.symConfig.symbolWidth * reelId + (this.symConfig.symbolXGap * i) + symbolOffset.x;
					// }
					// winSym.y = this.symConfig.symbolHeight * (i + 1) + (this.symConfig.symbolYGap * i) + symbolTopPadding + symbolOffset.y;

					if (this.scatterCount < 4 && this.reelId < 4) {
						_sndLib.play(_sndLib.sprite.sLand_3);
					}
					else if (this.scatterCount >= 4) {
						_sndLib.stop(_sndLib.sprite.sLand_3);
						_sndLib.play(_sndLib.sprite.sLand_4);

					}
					// winSym.playAnimation();
					// this.ScatterAppearArray.push(winSym);
					// symbolArray.push([reelId, i]);
				}
			}
		}
		// if(symbolArray.length>0){ 
		// 	_mediator.publish("hideReelSymbols", symbolArray, "eachReel"); 
		// }
	}


};
gWV.removeBonusLand = function () {

	setTimeout(function () {
		for (let i = 0; i < this.ScatterAppearArray.length; i++) {
			this.winSymbolContainer.removeChild(this.ScatterAppearArray[i]);
			this.ScatterAppearArray[i] = null;
		}
		this.ScatterAppearArray = [];
	}.bind(this), 1)
};
gWV.removeAllmultipliers = function () {
}
gWV.tweenAnimation = function () {
	let xPos, yPos;
	if (this.multiplierArray.length == 0) {
		return;
	};
	this.allWin.x = this.allWin.x - 50;
	this.allWinMoved = true;

	this.multiplierWinTxt.x = (this.allWin.x + this.allWin.width);

	for (let j = 0; j < this.multiplierArray.length; j++) {
		let time = (_ng.isQuickSpinActive && _ng.quickSpinType === "turbo") ? 0.1 : 0.4;
		if (_viewInfoUtil.viewType == "VD") {
			xPos = this.multiplierWinTxt.worldTransform.tx - (this.multiplierArray[j][0].worldTransform.tx - this.multiplierArray[j][0].x);
			yPos = this.multiplierWinTxt.worldTransform.ty - (this.multiplierArray[j][0].worldTransform.ty - this.multiplierArray[j][0].y);
		} else {
			xPos = 510;
			yPos = 0;
		}
		TweenMax.to(this.multiplierArray[j][0], time, {
			x: xPos, y: yPos,
			ease: Linear.easeInOut,
			onStart: function () {
				this.multiplierArray[j][0].alpha = true;
			}.bind(this),
			onComplete: function () {
				this.multiplierArray[j][0].parent.removeChild(this.multiplierArray[j][0]);
				this.tweenTotalWin(this.multiplierArray[j][1]);
			}.bind(this),
		}).delay(time * j);
	}
}
gWV.toggleTumbleBox = function (value) {
	this.multiContainer.alpha = value;
}
gWV.tweenTotalWin = function (value) {
	this.multiplierTotal = this.multiplierTotal + value;
	pixiLib.setText(this.multiplierWinTxt, "x" + this.multiplierTotal);
	if (coreApp.gameModel.obj.current_round.post_matrix_info.win == this.multiplierTotal) {
		let time = 0;

		if (_ng.isQuickSpinActive && _ng.quickSpinType === "turbo") {
			time = 250;
		}
		else {
			time = 500;
		}
		setTimeout(() => {
			this.tweenFinal();
		}, time);
	}
}
gWV.tweenFinal = function () {
	if (this.currentTotal == 0) {
		return;
	}
	var multiText = {
		// "type": "BitmapFont",
		// "fontName": "featureBitmapFont-export",
		"fontSize": 28,
		"align": "center"
	}
	this.mText = pixiLib.getElement("Text", multiText);
	this.multiContainer.addChild(this.mText);
	pixiLib.setText(this.mText, this.multiplierTotal);
	this.mText.anchor.set(0.5);
	this.mText.x = this.multiplierWinTxt.x;
	this.mText.y = this.multiplierWinTxt.y;
	let xPos = this.allWin.worldTransform.tx - this.mText.worldTransform.tx - this.mText.x;
	let yPos = this.allWin.worldTransform.ty - this.mText.worldTransform.ty - this.mText.y;
	// if (sum > 0) {
	let time = 0;
	if (_ng.isQuickSpinActive && _ng.quickSpinType === "turbo") {
		time = 0.15
	}
	else {
		time = 0.5;
	}
	pixiLib.setText(this.multiplierWinTxt, "");
	TweenMax.to(this.mText, time, {
		// x:this.allWin.x,
		x: this.allWin.x,
		y: this.allWin.y,
		ease: Power2.easeInOut,
		alpha: 0,
		onUpdate: function () {
			const progress = this.progress();
			if (progress <= 0) {
				this.target.alpha = 0;
			}
		},
		onComplete: function () {
			if (this.allWinMoved && this.allWinMoved == true) {
				// this.allWin.x = this.allWin.x+50;
				if (_viewInfoUtil.viewType == "VP") {
					this.allWin.x = 60;
				}
				else if (_viewInfoUtil.viewType == "VL") {
					this.allWin.x = 655
				}
				else {
					this.allWin.x = -492
				}
				this.allWinMoved = false;
			}
			this.mText.parent.removeChild(this.mText);
			_sndLib.play(_sndLib.sprite.totalmultiplication);
			let roundWin = coreApp.gameModel.userModel.userData.current_round.payline_win_amount;
			_mediator.publish("updateTextWithCountUp", roundWin, 150, this.allWin);
			if (coreApp.gameModel.userModel.userData.current_round.spin_type == "freespin") {
				this.freespinTotalValue = coreApp.gameModel.userModel.userData.current_round.total_fs_win_amount;
			}
			else {
				this.freespinTotalValue = roundWin;
			}
			_mediator.publish("UpdateWin", this.freespinTotalValue);
			if (!coreApp.gameModel.isFreeSpinActive()) {
				_mediator.publish(_events.slot.updateBalance);
			}
			_mediator.publish("SHOW_TICKER_MESSAGE", gameLiterals.win_text + " : " + pixiLib.getFormattedAmount(this.freespinTotalValue, true));
			coreApp.gameController.isMulValueUpdation = true;
			//Calling All win pop up after the updation of totalamount
			_mediator.publish("triggerAllWinAnimation");
		}.bind(this),
	})
}
gWV.findIndexfromValue = function (finalArray, value) {
	for (let index = 0; index < finalArray.length; index++) {
		if (finalArray[index] == value) {
			return index;
		}

	}
}
gWV.findSticky = function () {
	if (coreApp.gameModel.userModel.userData.current_round.misc_prizes.count == 0) {
		mValue = coreApp.gameModel.userModel.userData.current_round.screen_wins;
		mValue = this.getNonZeroMultiplierPos(mValue);
	}
	else {
		let count = coreApp.gameModel.userModel.userData.current_round.misc_prizes.count;
		mValue = coreApp.gameModel.userModel.userData.current_round.misc_prizes[count - 1].screenWins;
		mValue = this.getNonZeroMultiplierPos(mValue);
	}
	return mValue;
}
gWV.TumbleWin = function (array, num, tickerValues) { //parsed values like which symbol name burst and the total number
	if (coreApp.gameModel.userModel.userData.current_round.spin_type == "freespin") {
		this.toggleTumbleBox(1);
		_mediator.publish("toggleFadeContainer", false);
	}
	this.arrayTemp = array;
	// console.log("tumbleWin " + array);
	this.winamtStyle = {
		// "type": "BitmapFont",
		// "fontName": "dedeBitmap",
		"fontSize": 36,
		"align": "center"
	};
	for (var j = 0; j < coreApp.gameModel.obj.current_round.misc_prizes[num].old_reel_symbol.length; j++) {
		this.winamt = pixiLib.getElement("Text", this.winamtStyle);
		this.winamt.name = "TumbleWin";
		this.winamt.anchor.set(0.5);
		this.winamt.scale.set(1);
		this.winamt.x = 500 - (j * 110);
		this.winamt.y = 300 + (j * 80);
		this.addChild(this.winamt);
		this.winAnimArr.push(this.winamt);
		// console.log(tickerValues[0][0],tickerValues[0][1]);
		this.currentWin = this.finalArray[0];
		this.currentWin = parseFloat(this.currentWin);
		this.currentTotal = this.currentTotal + this.currentWin;
		this.freespinTotalValue = this.freespinTotalValue + this.currentWin;
		console.log("FREE SPIN TOTAL VALUE",this.freespinTotalValue);
		
		pixiLib.setText(this.winamt, pixiLib.getFormattedAmount(array[0]));
		// _mediator.publish("showNewMessage", tickerValues[0][0] + " X " + "        " + gameLiterals.pays + " " + pixiLib.getFormattedAmount(array[0]));
		// _mediator.publish("updateSymbol", tickerValues[0][1]);
		// setTimeout(() => {
		// 	_mediator.publish("showNewMessage", "");
		// 	_mediator.publish("updateSymbol", "");
		// }, 1000);
		TweenMax.to(this.winamt, 1.2, {
			y: this.winamt.y - 80,
			alpha: 0,
			ease: Linear.easeInOut,
		});
		array.shift();
		tickerValues.shift();
	}
	_mediator.publish("updateTextWithCountUp", this.currentTotal, 300, this.allWin);
	// pixiLib.updateTextWithCountup(this.allWin, {isAmount : false, startValue : this.allWin.text, endValue : this.currentTotal, duration : 2})
	_mediator.publish("UpdateWin", this.freespinTotalValue);
	_mediator.publish("SHOW_TICKER_MESSAGE", gameLiterals.win_text + " : " + pixiLib.getFormattedAmount(this.freespinTotalValue));
}
gWV.getTotalwin = function (array) {
	this.finalValue = [];
	this.finalArray = array;
	this.finalValue = 0;
	for (let l = 0; l < array.length; l++) {
		let cValue = array[l];
		cValue = parseFloat(cValue);
		this.finalValue = this.finalValue + cValue;
	}
}
gWV.removewinAnim = function () {
	for (var i = 0; i < this.winAnimArr.length; i++) {
		this.removeChild(this.winAnimArr[i]);
	}
	this.winAnimArr = [];
}

gWV.ScatterWin = function () {
	this.winamtStyle = {
		// "type": "BitmapFont",
		// "fontName": "dedeBitmap",
		"fontSize": 36,
		"align": "center"
	};
	this.ScatterWintxt = pixiLib.getElement("Text", this.winamtStyle);
	this.ScatterWintxt.name = "";
	this.ScatterWintxt.anchor.set(0.5);
	this.ScatterWintxt.scale.set(1);
	this.ScatterWintxt.x = 500;
	this.ScatterWintxt.y = 300;
	this.addChild(this.ScatterWintxt);
	pixiLib.setText(this.ScatterWintxt, pixiLib.getFormattedAmount(coreApp.gameModel.obj.current_round.scatter_win));
	_mediator.publish("UpdateWin", coreApp.gameModel.obj.current_round.scatter_win);
	this.freespinTotalValue = this.freespinTotalValue + coreApp.gameModel.obj.current_round.scatter_win;
	_mediator.publish("SHOW_TICKER_MESSAGE", gameLiterals.win_text + " : " + pixiLib.getFormattedAmount(coreApp.gameModel.obj.current_round.scatter_win));
	setTimeout(() => {
		if (!coreApp.gameModel.isFreeSpinActive()) {
			_mediator.publish(_events.slot.updateBalance);
		}
	}, 200);
	TweenMax.to(this.ScatterWintxt, 0.8, {
		width: this.ScatterWintxt.width + 10,
		height: this.ScatterWintxt.height + 10,
		ease: Linear.easeInOut,
		yoyo: true,
		repeat: 2,
		onComplete: function () {
			this.removeChild(this.ScatterWintxt);
		}.bind(this)
	});
}

gWV.updateTextWithCountUp = function (endValue, totalTime, obj) {
    // 1. Pull from a raw property instead of parsing the display text. Fallback to 0.
    let startValue = obj._rawAmount || 0; 
    let increment = (endValue - startValue) / totalTime;
    let startTime = new Date().getTime();
    
    let timer = setInterval(function () {
        let elapsedTime = new Date().getTime() - startTime;
        if (elapsedTime >= totalTime) {
            obj._rawAmount = endValue; // 2. Save the raw end value
            obj.text = pixiLib.getFormattedAmount(endValue);
            clearInterval(timer);
        } else {
            let currentValue = startValue + increment * elapsedTime;
            obj._rawAmount = currentValue; // 3. Save the current raw value
            obj.text = pixiLib.getFormattedAmount(currentValue);
        }
    }, 10);
}

gWV.playBonusSymbolAnimation = function (data) {

	if (coreApp.gameModel.obj.current_round.scatter_win && coreApp.gameModel.obj.current_round.scatter_win > 0) {
		_mediator.publish("ScatterWin")
	}
	if (coreApp.gameModel.obj.current_round.misc_prizes.count == 0 || coreApp.gameModel.obj.current_round.misc_prizes == "") {
		var bonusID = data.bonusID;
		var reelMatrix = data.reelMatrix;
		var bonusSymbol = _ng.GameConfig.bonusGames[bonusID].symbol;
		var animationDuration = this.animationConfig[bonusSymbol][0].animationDuration;
		var symbolArray = [];
		this.createWinSymbolContainer();
		for (var i = 0; i < reelMatrix.length; i++) {
			for (var j = 0; j < reelMatrix[i].length; j++) {
				if (reelMatrix[i][j] === bonusSymbol) {
					symbolArray.push(pixiLib.getPosition(j, i));
				}
			}
		}
		_mediator.publish("hideReelSymbols", symbolArray);
		this.animateScatterSymbols(reelMatrix, bonusSymbol, animationDuration);

		_sndLib.play(_sndLib.sprite.scatterLand);
		
		setTimeout(function () {
			_mediator.publish("showReelSymbols");
			this.clearBonusSymbols();
			_mediator.publish("bonusSymbolAnimationCompleted");
		}.bind(this), animationDuration);
	}
	else {
		if (coreApp.gameModel.obj.misc_prizes && coreApp.gameModel.obj.misc_prizes[coreApp.gameModel.obj.misc_prizes.count - 1] && coreApp.gameModel.obj.misc_prizes[coreApp.gameModel.obj.misc_prizes.count - 1].new_reel) {
			var bonusID = data.bonusID;
			var reelMatrix = coreApp.gameModel.obj.misc_prizes[coreApp.gameModel.obj.misc_prizes.count - 1].new_reel;
			var bonusSymbol = _ng.GameConfig.bonusGames[bonusID].symbol;
			var animationDuration = this.animationConfig[bonusSymbol][0].animationDuration;
			var symbolArray = [];
			this.createWinSymbolContainer();
			for (var i = 0; i < reelMatrix.length; i++) {
				for (var j = 0; j < reelMatrix[i].length; j++) {
					if (reelMatrix[i][j] === bonusSymbol) {
						symbolArray.push(pixiLib.getPosition(j, i));
					}
				}
			}
			_mediator.publish("hideReelSymbols", symbolArray);
			this.animateScatterSymbols(reelMatrix, bonusSymbol, animationDuration);
			
			_sndLib.play(_sndLib.sprite.sLand_4);
		
			setTimeout(function () {
				_mediator.publish("showReelSymbols");
				this.clearBonusSymbols();
				_mediator.publish("bonusSymbolAnimationCompleted");
			}.bind(this), animationDuration);
		}
		else {
			_mediator.publish("bonusSymbolAnimationCompleted");
		}
	}
};

gWV.animateScatterSymbols = function (reelMatrix, bonusSymbol, animationDuration) {
	for (var i = 0; i < reelMatrix.length; i++) {
		for (var j = 0; j < reelMatrix[i].length; j++) {
			if (reelMatrix[i][j] === bonusSymbol) {
				var symbol = bonusSymbol;
				symbol = this.getSymbolName(symbol);
				var winSym = new WinSymbol(symbol);
				this.winSymbolContainer.addChild(winSym);
				this.bonusSymbols.push(winSym);
				var symbolTopPadding = 0;
				if (this.reelConfig.data.eachReelYPos) {
					symbolTopPadding = this.reelConfig.data.eachReelYPos[i];
				}
				var symbolOffset = { x: 0, y: 0 };
				if (this.animationConfig[symbol] && this.animationConfig[symbol][0].offset && _viewInfoUtil.isSecondaryAssetsLoaded) {
					symbolOffset = this.animationConfig[symbol][0].offset
				}
				if (this.reelConfig.data.eachReelPos && this.reelConfig.data.eachReelPos[i] !== undefined) {
					winSym.x = this.reelConfig.data.eachReelPos[i] + symbolOffset.x;
				} else {
					winSym.x = this.symConfig.symbolWidth * i + (this.symConfig.symbolXGap * i) + symbolOffset.x;
				}
				winSym.y = (this.symConfig.symbolHeight * j) + (this.symConfig.symbolYGap * j) + symbolTopPadding + symbolOffset.y;
				winSym.playAnimation();
			}
		}
	}
}
gWV.showExtraSpins = function (callback) {
	_sndLib.play(_sndLib.sprite.extra_fs);
	_mediator.publish("ExtraFSAwardpopup", callback);
}
gWV.playLandAnim = function (reelId, position) {

	if ((this.cacheID != reelId || this.cachePos != position) && position < 6 && position > 0) {
		this.cacheID = reelId;
		this.cachePos = position;
		// console.log("In creation: " + this.cacheID + "  " + this.cachePos);

		setTimeout(function () {

			// 		var s_landAnim = pixiLib.getElement("Spine", "Land");


			// 		s_landAnim.scale.set(0.3)

			// 		this.addChild(s_landAnim);
			// 		s_landAnim.state.setAnimation(0, 'animation', true);



			var symbol = "s";
			symbol = this.getSymbolName(symbol);
			let winSym = pixiLib.getElement("Sprite", "s");
			winSym.name = "land " + reelId + " " + position;
			winSym.scale.set(0.45);
			this.addChild(winSym);
			winSym.anchor.set(0.5)
			this.bonusSymbols.push(winSym);

			// var symbol = "s_land";
			// symbol = this.getSymbolName(symbol);
			// let winSym =pixiLib.getElement("Spine", "Land") ;
			// winSym.name="land "+reelId+ " "+position;
			// winSym.scale.set(0.3);
			// this.addChild(winSym);
			// this.bonusSymbols.push(winSym);
			var symbolTopPadding = 0;
			if (this.reelConfig.data.eachReelYPos) {
				symbolTopPadding = this.reelConfig.data.eachReelYPos[reelId];
			}
			var symbolOffset = { x: 0, y: 0 };
			if (this.animationConfig[symbol] && this.animationConfig[symbol][0].offset && _viewInfoUtil.isSecondaryAssetsLoaded) {
				symbolOffset = this.animationConfig[symbol][0].offset
			}
			if (this.reelConfig.data.eachReelPos && this.reelConfig.data.eachReelPos[reelId] !== undefined) {
				winSym.x = this.reelConfig.data.eachReelPos[reelId] + symbolOffset.x;
			} else {
				winSym.x = this.symConfig.symbolWidth * reelId + (this.symConfig.symbolXGap * reelId) + symbolOffset.x;
			}
			winSym.y = this.symConfig.symbolHeight * (position + 1) + (this.symConfig.symbolYGap * position) + symbolTopPadding + symbolOffset.y;
			winSym.x += 150;
			winSym.y -= 165;
			// winSym.state.setAnimation(0, 'animation', false);
			TweenMax.to(winSym.scale, 0.8, {
				x: 0.55, y: 0.55, yoyo: true, repeat: 2
			});
			setTimeout(function () {
				this.removeChild(winSym);
				this.cacheID = 100;
				this.cachePos = 100;
				// this.removeChild(s_landAnim);
			}.bind(this), 750);
		}.bind(this), 200)
	}

};
//creation and tween
gWV.createBearCharacter = function(){

	this.bearCharacter = pixiLib.getElement("Spine", "CC_character_spine");
	this.bearCharacter.state.setAnimation(0, "idle", true);
	this.bearCharacter.name = "bearCharacter";
	this.addChild(this.bearCharacter);

}
gWV.playBearWinAnimation = function (callback) {
	var timeScale = (_ng.isQuickSpinActive && _ng.GameConfig.FastAnim) ? 3 : 1;   
;
	if (this.bearCharacter) {
		const state = this.bearCharacter.state;

		// state.data.setMix("win", "idle", 0.7);
		state.timeScale = timeScale;
		state.setAnimation(0, "win", false);
		// Add a listener to handle animation completion
		state.addListener({
			complete: (trackEntry) => {
				if (trackEntry.animation.name === "win") {
					state.setAnimation(0, "idle", true);
					state.timeScale = 1;
				}
			}
		});
	}
}

