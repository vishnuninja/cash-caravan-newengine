GBigview=BigWinView.prototype;

GBigview.onShowTotalWin = function () {
	_ng.isTotalWinShown = true;
	var winAmount = coreApp.gameModel.getTotalWin();
	this.x = 0, this.y = 0;
	if (!this.blackBg) {
		this.blackBg = pixiLib.getRectangleSprite(_viewInfoUtil.getWindowWidth(), _viewInfoUtil.getWindowHeight(), 0x000000);
		this.blackBg.alpha = 0;

		coreApp.gameView.decoratorContainer.addChild(this.blackBg);
	}
	this.blackBg.name = "blackBg";
	this.blackBg.interactive = true;
	this.blackBg.visible = true;
	if (!this.winAmountContainer) {
		this.winAmountContainer = pixiLib.getElement();
		coreApp.gameView.decoratorContainer.addChild(this.winAmountContainer);
		_ngFluid.call(this.winAmountContainer, _ng.GameConfig.specialWins.totalWin.props)
	}
	if (!this.winAmountTxt) {
		this.winTextStyle = _ng.GameConfig.specialWins.totalWin.textStyle;
		this.winAmountTxt = pixiLib.getElement("Text", this.winTextStyle, "0");
		// this.winAmountContainer.addChild(this.winAmountTxt);
		this.winAmountTxt.anchor.set(0.5);
	}

	pixiLib.setText(this.winAmountTxt, pixiLib.getFormattedAmount(winAmount, true));
	// _mediator.publish("SHOW_TICKER_MESSAGE", "Total win: "+pixiLib.getFormattedAmount(winAmount, true));

	this.winAmountTxt.alpha = 0;
    if (coreApp.gameModel.getIsFreeSpinTriggered()) {
		if (_ng.isQuickSpinActive) {
			this.winAmountTxt.alpha = 1;
			this.winAmountTxt.scale.set(1.5);
			this.onTotalWinResize();
			_sndLib.play(_sndLib.sprite.totalWin);
			//#todo only for base game it should call 
			if(_ng.GameConfig.gameName  == "sugarbox5000gold"){
				if(coreApp.gameModel.spinData.spinType != "normal"){
					setTimeout(this.hideTotalWin.bind(this), 400);
				}
			}else{
				setTimeout(this.hideTotalWin.bind(this), _ng.GameConfig.enterIntoFreeGameDurationTurbo);
			}
		} else {
			this.winAmountTxt.scale.set(2);
			TweenMax.to(this.winAmountTxt, 0.5, { alpha: 1 });
			TweenMax.to(this.winAmountTxt.scale, 1, { x: 1, y: 1, ease: Back.easeOut.config(1.5) });
			this.onTotalWinResize();
			_sndLib.play(_sndLib.sprite.totalWin);
			// if(_ng.GameConfig.gameName  == "sugarbox5000gold" && coreApp.gameModel.spinData.spinType != "normal"){
			if(_ng.GameConfig.gameName  == "sugarbox5000gold" && coreApp.gameModel.spinData.spinType == "normal"){
				setTimeout(this.hideTotalWin.bind(this), _ng.GameConfig.totalWinDuration+2000);
			}else{
				setTimeout(this.hideTotalWin.bind(this), _ng.GameConfig.enterIntoFreeGameDuration);
			}
			
		}
	} else {
		if (_ng.isQuickSpinActive) {
			this.winAmountTxt.alpha = 1;
			this.winAmountTxt.scale.set(1.5);
			this.onTotalWinResize();
			_sndLib.play(_sndLib.sprite.totalWin);
			//#todo only for base game it should call 
			if(_ng.GameConfig.gameName  == "sugarbox5000gold"){
				if(coreApp.gameModel.spinData.spinType != "normal"){
					setTimeout(this.hideTotalWin.bind(this), 400);
				}
			}else{
				setTimeout(this.hideTotalWin.bind(this), 400);
			}
		} else {
			this.winAmountTxt.scale.set(2);
			TweenMax.to(this.winAmountTxt, 0.5, { alpha: 1 });
			TweenMax.to(this.winAmountTxt.scale, 1, { x: 1, y: 1, ease: Back.easeOut.config(1.5) });
			this.onTotalWinResize();
			_sndLib.play(_sndLib.sprite.totalWin);
			// if(_ng.GameConfig.gameName  == "sugarbox5000gold" && coreApp.gameModel.spinData.spinType != "normal"){
			if(_ng.GameConfig.gameName  == "sugarbox5000gold" && coreApp.gameModel.spinData.spinType == "normal"){
				setTimeout(this.hideTotalWin.bind(this), _ng.GameConfig.totalWinDuration+2000);
			}else{
				setTimeout(this.hideTotalWin.bind(this), _ng.GameConfig.totalWinDuration);
			}
			
		}	
	}
};

GBigview.onShowBigWin = function (){
	_mediator.publish("HIDE_TICKER");
	this.isBigWinRunning = true;
	this.isClosing = false;

	var winAmount = coreApp.gameModel.getTotalWin();
	var totalBet = coreApp.gameModel.getTotalBet();
	var specialWinObj = _ng.GameConfig.specialWins;
	this.bigWinConfig = _ng.GameConfig.bigWinView;


	this.grayBg = pixiLib.getShape("rect", {
		w: _viewInfoUtil.getWindowWidth(),
		h: _viewInfoUtil.getWindowHeight()
	});
	var bgAlpha = 0.8;
	if (_ng.GameConfig.bigWinView.bgAlpha) {
		bgAlpha = _ng.GameConfig.bigWinView.bgAlpha;
	}
	this.grayBg.alpha = bgAlpha;
	this.grayBg.interactive = true;
	this.grayBg.buttonMode = true;
	this.grayBg.name = "grayBg";
	coreApp.gameView.decoratorContainer.addChildAt(this.grayBg, 0);


	this.coinShower = pixiLib.getElement("AnimatedSprite", { "prefix": "coinShower_", "startIndex": "1", "endIndex": "25", "digit": "dual", "loop": true, "animationSpeed": "0.3", "type": "spriteAnimation" })
	this.coinShower.x += 53;
	this.coinShower.y += 127;
	this.coinShower.scale.set(1.2)
	this.coinShower.visible=false;
	this.addChild(this.coinShower);

	this.winType = "";
	if (winAmount >= specialWinObj.max_win.multiplier * totalBet) {
		this.winType = "max_win";
	} else if (winAmount >= specialWinObj.fantastic_win.multiplier * totalBet) {
		this.winType = "fantastic_win";
	} else if (winAmount >= specialWinObj.super_win.multiplier * totalBet) {
		this.winType = "super_win";
	}else if (winAmount >= specialWinObj.omg.multiplier * totalBet) {
		this.winType = "omg";
	}else if (winAmount >= specialWinObj.nice.multiplier * totalBet) {
		this.winType = "nice";
	}



	this.winAmount = winAmount;
	this.bigWinAmount = specialWinObj.super_win.multiplier * totalBet;


	this.bigWinSpine = new PIXI.spine.Spine(PIXI.Loader.shared.resources[this.bigWinConfig.spineImage].spineData);
	this.bigWinSpine.visible = false;
	this.bigWinSpine.scale.set(0.5);
	this.addChild(this.bigWinSpine);
	var bigWinStyle = this.bigWinConfig.totalWinAmount.textStyle;

	this.bigWinAmtTxt = pixiLib.getElement("Text", bigWinStyle);
	this.bigWinAmtTxt.incrementalAmount = 0;
	this.bigWinSpine.addChild(this.bigWinAmtTxt); //ToDo: attach to slot for better exit...
    pixiLib.setProperties(this.bigWinAmtTxt, this.bigWinConfig.totalWinAmount.params);
	pixiLib.setText(this.bigWinAmtTxt, winAmount);
	this.bigWinAmtTxt.anchor.set(0.5);

	if (!this.isResponsiveCalled) {
		this.isResponsiveCalled = true;
		_ngFluid.call(this, this.bigWinConfig.params);
	}
	if (this.bigWinConfig.setSize) {
		this.setSize(0, 0);
	}

	setTimeout(function(){
		this.coinShower.visible = true;
		this.coinShower.play();
	}.bind(this),500)
				
	this.runSpineAnimation(0, this.bigWinAmount);
}

GBigview.hideTotalWin = function () {
    _mediator.publish("clearAllWins", { from: "onTotalWinShown" });
    this.blackBg.visible = false;
 
    var winTxtDealy = (_ng.isQuickSpinActive && _ng.quickSpinType === "turbo") ? 0.1 : 0.5;
    var totalWinShownDealy = (_ng.isQuickSpinActive && _ng.quickSpinType === "turbo") ? 100 : 300;
 
 
    TweenMax.to(this.winAmountTxt, winTxtDealy, { alpha: 0 });
    setTimeout(function () {
        _mediator.publish("onTotalWinShown");
        // we already showing total win amount in autospins and freespins
        if (!(coreApp.gameModel.isFeatureActive() || coreApp.gameModel.isAutoSpinActive() || coreApp.gameModel.isFullFSActive() || coreApp.gameController.isSpaceBarHeld)) {
            _mediator.publish("showPanelWin");
        }
        // _mediator.publish(_events.slot.updateBalance);
    }, totalWinShownDealy);
};

GBigview.playSequentionalAnim = function(animArry, state) {

    const playNextAnimation = (index) => {
        if (index >= animArry.length) return;
        let animationState = this.bigWinSpine.state.setAnimation(0, animArry[index], state);
        animationState.listener = {
            complete: () => {
                playNextAnimation(index + 1);
				if(index>0)
					animationState.loop = true;
            }
        };
    };
    playNextAnimation(0); // Start with the first animation in the array
}


GBigview.runSpineAnimation = function () {
    coreApp.CURRENTACTIVEPOPUP = "bigwinview";
    const gameModel = coreApp.gameModel;
    const specialWins = _ng.GameConfig.specialWins;

    const winAmount = gameModel.getTotalWin();
    const totalBet = gameModel.getTotalBet();

    this.winAmount = winAmount;

    this.counterFinished = false;
    this.counterTween = null;

    clearTimeout(this.bigWinTimer);
    clearTimeout(this.autoCloseTimer);

    // Reset counter immediately
    this.bigWinAmtTxt.incrementalAmount = 0;
    pixiLib.setText( this.bigWinAmtTxt, pixiLib.getFormattedAmount(0, true));

    // Move amount text to its final position
    TweenMax.to(this.bigWinAmtTxt, 0.5, {
        y: this.bigWinConfig.totalWinAmount.finalPositionY,
        ease: Back.easeOut.config(1.5)
    });

    // Show spine immediately
    this.bigWinSpine.visible = true;

    this.playSequentionalAnim([
        this.bigWinConfig[this.winType].In,
        this.bigWinConfig[this.winType].Loop
    ], false);

    _sndLib.play(_sndLib.sprite.bigWin); //ToDo: counter sound needs to be seperated, if counter time needs to change...

    // Start counter...
    this.counterTween = TweenMax.to(this.bigWinAmtTxt, 3, {
        incrementalAmount: winAmount,
        ease: Linear.easeNone,
        onUpdate: () => {
            pixiLib.setText( this.bigWinAmtTxt, pixiLib.getFormattedAmount(Math.round(this.bigWinAmtTxt.incrementalAmount), true));
        },
        onComplete: () => { this.completeCounter(); }
    });
};

GBigview.completeCounter = function () {
    if(this.bigWinTimer)    clearTimeout(this.bigWinTimer);
    if (this.counterTween) {
        this.counterTween.kill();
        this.counterTween = null;
    }
    this.counterFinished = true;
    console.log("completeCounter called");
    TweenMax.killTweensOf(this.bigWinAmtTxt);
    pixiLib.setText( this.bigWinAmtTxt, pixiLib.getFormattedAmount(this.winAmount, true));
    if(this.autoCloseTimer) clearTimeout(this.autoCloseTimer);
    this.autoCloseTimer = setTimeout(() => {
        console.log("autoCloseTimer called");
        this.closeBigWin();
    }, 1000); // Hold for 2 seconds
};

GBigview.hideBigWin_click = function () {
    if (this.isClosing)
        return;
    if (!this.counterFinished) {
        this.completeCounter();
        return;
    }
    if(this.autoCloseTimer) clearTimeout(this.autoCloseTimer);
    this.closeBigWin();
};

GBigview.closeBigWin = function () {
    if (this.isClosing) {
        return;
    }
    this.isClosing = true;
    _sndLib.stop(_sndLib.sprite.bigWin);
    clearTimeout(this.bigWinTimer);
    clearTimeout(this.autoCloseTimer);
    TweenMax.killTweensOf(this.bigWinAmtTxt);
    
    const trackEntry = this.bigWinSpine.state.setAnimation( 0, this.bigWinConfig[this.winType].Out, false);
    trackEntry.listener = {
        complete: () => { 
            this.bigWinAmtTxt.text = "";
            trackEntry.listener = null; // Remove listener
			setTimeout(() => {
				this.removeBigWin();
			}, 50);
        }
    };
};

GBigview.removeBigWin = function () {
    this.isClosing = false;
    clearTimeout(this.bigWinTimer);
    clearTimeout(this.autoCloseTimer);
    // Stop any running tweens
    TweenMax.killTweensOf(this.bigWinAmtTxt);
    // Reset popup state
    coreApp.CURRENTACTIVEPOPUP = "";

    // Fade background
    if (this.grayBg2) {
        TweenMax.to(this.grayBg2, 0.15, {
            alpha: 0,
            onComplete: this.hideBigAnimationComplete_click.bind(this)
        });
    }

    // Remove Spine safely
    if (this.bigWinSpine && this.bigWinSpine.parent) {
        this.bigWinSpine.visible = false;
        this.removeChild(this.bigWinSpine);
    }

    // Remove coin shower safely
    if (this.coinShower && this.coinShower.parent)
        this.removeChild(this.coinShower);

    // Stop all Big Win sounds
    // this.stopLoopSound();
    // Reset game state
    coreApp.gameModel.isBigWin = false;

    // Notify game
    _mediator.publish("SHOW_TICKER");
    _mediator.publish("showPanelWin");
};