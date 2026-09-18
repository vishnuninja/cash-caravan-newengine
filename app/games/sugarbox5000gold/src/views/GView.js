var sView = _ng.SlotView.prototype;


sView.createExtraElements = function () {
	_ng.buyFeaturePopupStatus = false;
	this.ScatterArray = [];
    this.sizeArray = [0,-150,-175,-200,-225,-250,-275];
    this.sizeArrayPor = [-250,-275,-300,-325,-350,-375]
	_mediator.publish("SHOW_TICKER");
    _mediator.subscribe("onGameCreated", this.onGameInitGame.bind(this));
	_mediator.publish("fadeTextsSpinClicked");
	// _mediator.subscribe("createHistoryPanel",this.createHistoryPanel.bind(this));
	// _mediator.subscribe("AddHistBox", this.AddHistBox.bind(this));
	// _mediator.subscribe("removeHistBox",this.removeHistBox.bind(this))
	_mediator.subscribe("CreateBuyFreeSpin", this.createBuyFreeSpinPanel.bind(this));
	_mediator.publish("CreateBuyFreeSpin");
	_mediator.subscribe("UpdateBet",this.UpdateBet.bind(this));
	_mediator.subscribe("BuyRequest",this.BuyRequest.bind(this));
	_mediator.subscribe("buyPanelVisible",this.BuyPanelVisible.bind(this));
	// _mediator.subscribe("FSend",this.FSend.bind(this))
	_mediator.subscribe("enableBuyFeature",this.enableBuyFeature.bind(this));
	_mediator.subscribe("disableBuyFeature",this.disableBuyFeature.bind(this));
	// _mediator.subscribe("moveBuyFeature",this.moveBuyFeature.bind(this));
	// _mediator.subscribe("bringBackBuyFeature",this.bringBackBuyFeature.bind(this));
	_mediator.subscribe("CreateScatterWinAnim",this.CreateScatterWinAnim.bind(this));
	_mediator.subscribe("sliderFalse",this.sliderFalse.bind(this));
    // _mediator.subscribe("ScatterWinAnim",this.ScatterWinAnim.bind(this));
	_mediator.subscribe("toggleLand",this.toggleLand.bind(this));
	_mediator.subscribe("hideandShowBuyfeature",this.hideandShowBuyfeature.bind(this));
	// _mediator.subscribe("_hideAndShowOfTwoXButton",this._hideAndShowOfTwoXButton.bind(this));
	_mediator.subscribe("setRemainingFSpins",this.setRemainingFSpins.bind(this));
	_mediator.subscribe("hideAndShowBuyControlls",this.hideAndShowBuyControlls.bind(this));
	_mediator.subscribe("checkBalanceForBuyFeature",this.checkBalanceForBuyFeature.bind(this));

	_mediator.subscribe("ResizeGview",this.ResizeGview.bind(this));
	
	// Add logo and replay animation
	this.addingLogo();

	this.volBox=pixiLib.getContainer();
	var blackBg=pixiLib.getRectangleSprite(326,53.5, 0x000000);
	blackBg.x=7;
	blackBg.y=593;
	blackBg.alpha=0.9;
	blackBg.scale.set(0.95,0.6);

	var currentVolume = 0.2;


	this.slider = new Slider({
		name: "lineValueSlider",
		props: { x: 17.5, y: 610 },
		dotImage: "asSliderDot",
		BGImage: "VolumeBGSlider",
		FGImage: "VolumeFillSlider",
		isVerticalSlider: false,
		startingValue: 0,
		endValue: 1,
		currentValue: currentVolume,
		toFixedValue: 1, //Value After Decimal, give 0 for integers
		doMultiplier: 100, //Value After Decimal, give 0 for integers
		text: {
			prefix: "",
			postfix: "%",
			attachedToSlider: false,
			props: { x: 270, y: 0, anchor: { y: 0.5, x: 0.5 } },
			textStyle: { fill: 0xffffff, fontSize: 16 }
		},
	
		displayForMinValue: {
			elementConstructor: "text",
			params: {
				props: { x: -35, y: 0, anchor: 0.5 },
				text: "0%",
				textStyle: { fontFamily: "Montserrat-Regular", fontSize: 16, fill: 0xffffff, padding: 10 }
			}
		},
	
		displayForMaxValue: {
			elementConstructor: "text",
			params: {
				props: { x: 368, y: 0, anchor: 0.5 },
				text: "100%",
				textStyle: { fontFamily: "Montserrat-Regular", fontSize: 16, fill: 0xffffff, padding: 10 }
			}
		},
	  eventToPublish: "settingVolumeChange"
	
	})
		this.slider.name = "SliderTEst"
		this.slider.scale.set(1);
		this.volBox.addChild(blackBg);
		this.volBox.addChild(this.slider);
		this.mainContainer.addChild(this.volBox);
		this.volBox.visible=false;
		this.slider.children[4].visible = false;
		this.slider.children[5].visible = false;
		this.slider.children[2].scale.set(1);
		this.slider.children[2].name = "dot";
		_mediator.subscribe("ToggleVolBox",this.ToggleVolPanel.bind(this));
		_mediator.subscribe("SliderMoved",this.SliderMoved.bind(this));
		this.HistoryArray = [];
		// this.createHistoryPanel();
}


sView.sliderFalse=function()
{
	// if (this.volBox) {
		this.volBox.visible=false;
		// this.graBGfrVolumeBar.visible = false;
	// }
	// if (this.blackBg) {
		// this.blackBg.visible= false;
	// }
	// if (this.graBGfrVolumeBar) {
		// this.graBGfrVolumeBar.visible = false;	
	// }

}
sView.TweenLogo=function()
{
	TweenMax.to(this.gameTitle,  0.5, {
		width: this.gameTitle.width+10,
		height: this.gameTitle.height+10,
		ease: Linear.easeInOut,
		yoyo : true,
		repeat:-1})
}

sView.addingLogo = function(){
	// Create logo container (like dede5000) - only create once
	if (!this.logocontainer) {
		this.logocontainer = pixiLib.getContainer();
		this.logocontainer.visible = true; // Ensure container is visible
		this.mainContainer.addChildAt(this.logocontainer, 0);
	}
	
	// Don't create replay button if it already exists
	if (this.replayButton) {
		return;
	}
	
	// Add replay animation to logo container (only visible in history mode, no click action - just visual)
	// Check if Spine resource is loaded before creating
	if (PIXI.Loader && PIXI.Loader.shared && PIXI.Loader.shared.resources) {
		const replayResource = PIXI.Loader.shared.resources["replay.json"] || PIXI.Loader.shared.resources["replay"];
		if (!replayResource || !replayResource.spineData) {
			// Try again after a delay
			setTimeout(() => {
				if (!this.replayButton) {
					this.addingLogo();
				}
			}, 1000);
			return;
		}
	}
	
	try {
		this.replayButton = pixiLib.getElement("Spine", "replay");
		this.replayButton.name = "Replay Animation";
		this.replayButton.state.setAnimation(0, "replay", true);
		this.replayButton.interactive = false; // No interaction, just visual
		this.replayButton.buttonMode = false; // Not a button
		this.logocontainer.addChild(this.replayButton);
		
		// Check if in history mode (round_id in URL)
		const urlParams = new URLSearchParams(window.location.search);
		const roundId = urlParams.get('round_id');
		const isHistoryMode = !!roundId;
		this.replayButton.visible = isHistoryMode;
		
	} catch (e) {
		// Try again after a delay
		setTimeout(() => {
			if (!this.replayButton) {
				this.addingLogo();
			}
		}, 1000);
	}
}

sView.resizeForIpad = function(){
	function isiPad() {
		return /iPad/i.test(navigator.userAgent);
	}
	if (isiPad() && _viewInfoUtil.viewType === "VP") {	
		this.gameTitle.visible=true;
	}
	else if(isiPad() && _viewInfoUtil.viewType === "VL"){
		this.gameTitle.visible=true;
	}
}

sView.onGameInitGame = function(){
	var multiplier  = (coreApp.gameModel.isFreeSpinActive() == false && coreApp.gameModel.getIsFreeSpinEnded()==false) ? _ng.normalMultiplier : _ng.fsMultiplier;
	_mediator.publish('showMultipler', multiplier);
	if(_viewInfoUtil.viewType=="VD")
	{
		_mediator.publish("SHOW_TICKER_MESSAGE", gameLiterals.tickertext3);
	}
	else
	{
		_mediator.publish("SHOW_TICKER_MESSAGE", gameLiterals.placeurbet_text);
	}
	// _ng.externalUiController.betUi.updateUi(coreApp.gameModel.getTotalBet());
	// Initialize History Panel View and Controller after game is fully created
	if (!this.historyPanelController) {
		// this.createHistoryPanelView();
	}
}



sView.gameSpecificOnResize = function () {
	function isiPad() {
		return /iPad/i.test(navigator.userAgent);
	}
	
	// Check if in history mode - hide buttons if in history mode
	// const urlParams = new URLSearchParams(window.location.search);
	// const hasRoundId = urlParams.has('round_id');
	// const isNormalSpin = urlParams.get('is_normal_spin') === 'true';
	// const isBuyFeature = urlParams.get('is_buy_feature') === 'true';
	// const isSuperBuyFeature = urlParams.get('is_buy_super_feature') === 'true';
	// const isPFR_Feature = urlParams.get('IsPfr') === 'true';
	
	const isInHistoryMode = isHistoryMode;
	
	if (this.respinText) {
		pixiLib.setProperties(this.respinText, this.textProperties[_viewInfoUtil.viewType]);
	}
	if(this.panelBase){
	if(_viewInfoUtil.viewType === "VD"){
	// REPLAY BUTTON - Position on left side for desktop
	if (this.replayButton) {
		this.replayButton.scale.set(0.65);
		this.replayButton.position.set(180, 180); // Left side position
		const urlParamsVD = new URLSearchParams(window.location.search);
		const roundIdVD = urlParamsVD.get('round_id');
		this.replayButton.visible = !!roundIdVD;
	}
		
		// //BUY PANEL CONTAINER
		// this.BuyPanelCon.position.set(33,127);
		// //BUY FREE SPIN
		// this.panelBase.position.set(123,180);
		// this.BuyBtn.position.set(125,-34);
		// this.BuyBtn.scale.set(0.45);
		// //SUPER BUY
		// this.superFreeSpinBtn.position.set(125, 70);
		// this.superFreeSpinBtn.scale.set(0.45);
		// //2X BET
		// this.twoXBetBg.position.set(126,214);
		// this.twoXBetBg.scale.set(0.45);
		// //HISTORY
		// this.historyContainer.position.set(125,70);
		// this.BuyPanelCon.addChild(this.historyContainer);
		
		// // Hide buttons and panelBase in history mode
		// if (isInHistoryMode) {
		// 	if (this.BuyBtn) this.BuyBtn.visible = false;
		// 	if (this.superFreeSpinBtn) this.superFreeSpinBtn.visible = false;
		// 	if (this.twoXBetBg) this.twoXBetBg.visible = false;
		// 	if (this.panelBase) this.panelBase.visible = false;
		// }
		
	}else if(_viewInfoUtil.viewType === "VP"){
		if (isiPad()) {
			this.historyContainer.position.set(-224, -442);
			// this.historyContainer.scale.set(0.9);

			this.twoXBetBg.position.set(211,-109);
			this.twoXBetBg.scale.set(0.53, 0.48);
			
		// REPLAY BUTTON - Position below logo for iPad (centered, visible on screen)
		if (this.replayButton) {
			this.replayButton.scale.set(0.85);
			this.replayButton.position.set(355, 0); // Below logo position (logo at 75, replay at 75+130=205)
			const urlParamsVP = new URLSearchParams(window.location.search);
			const roundIdVP = urlParamsVP.get('round_id');
			this.replayButton.visible = !!roundIdVP;
			if (this.logocontainer) {
				this.logocontainer.visible = true;
			}
		}
		} else {
			this.historyContainer.position.set(-224, -440);
			this.twoXBetBg.position.set(211,-109);
			this.twoXBetBg.scale.set(0.53, 0.48);

			this.panelBase.position.set(0,-29);
			
		// REPLAY BUTTON - Position below logo for mobile portrait (centered, visible on screen)
		if (this.replayButton) {
			this.replayButton.scale.set(0.7);
			// Check if XS device (very small screen) and move replay button down
			const actualWindowWidth = window.innerWidth || 375;
			const isXSDevice = actualWindowWidth <= 480;
			const replayY = isXSDevice ? 40 : 0; // Move down 20px for XS devices
			this.replayButton.position.set(360, replayY); // Below logo position (logo at 60, replay at 60+120=180)
			const urlParamsVP = new URLSearchParams(window.location.search);
			const roundIdVP = urlParamsVP.get('round_id');
			this.replayButton.visible = !!roundIdVP;
			if (this.logocontainer) {
				this.logocontainer.visible = true;
			}
		}
		}

		this.BuyBtn.scale.set(0.53);
		this.BuyBtn.position.set(-221,-270);

		this.superFreeSpinBtn.position.set(211,-270);
		this.superFreeSpinBtn.scale.set(0.53, 0.53);

		// coreApp.gameView.panel.BuyControl.addChild(this.BuyBtn);
		coreApp.gameView.panel.BuyControl.addChild(this.BuyBtn);
		coreApp.gameView.panel.BuyControl.addChild(this.superFreeSpinBtn);
		coreApp.gameView.panel.BuyControl.addChild(this.twoXBetBg);
		coreApp.gameView.panel.BuyControl.addChild(this.historyContainer);
		this.BuyPanelCon.visible = false;
		coreApp.gameView.panel.BuyBaseLeft.visible = true;
		coreApp.gameView.panel.BuyBaseRight.visible = true;
		/* isShowing_popup: variable created inside the GInfoPopupView */
		if(coreApp.gameModel.isFullFSActive()){
				this.superFreeSpinBtn.visible = false;
				this.BuyBtn.visible = false;
				coreApp.gameView.panel.BuyBaseLeft.visible = false;
				coreApp.gameView.panel.BuyBaseRight.visible = false;
		}
		
		// Hide buttons and panelBase in history mode
		if (isInHistoryMode) {
			if (this.BuyBtn) this.BuyBtn.visible = false;
			if (this.superFreeSpinBtn) this.superFreeSpinBtn.visible = false;
			if (this.twoXBetBg) this.twoXBetBg.visible = false;
			if (coreApp.gameView.panel.BuyBaseLeft && coreApp.gameView.panel.BuyBaseRight) {
				coreApp.gameView.panel.BuyBaseLeft.visible = false;
				coreApp.gameView.panel.BuyBaseRight.visible = false;
			}
			if (this.panelBase) this.panelBase.visible = false;
		}

		if(this.scatFillAnim)
			this.scatFillAnim.visible = false;

	}
	else if(_viewInfoUtil.viewType === "VL") {
	// REPLAY BUTTON - Position for mobile landscape
	if (this.replayButton) {
		this.replayButton.scale.set(0.6);
		this.replayButton.position.set(180, 180); // Landscape position
		const urlParamsVL = new URLSearchParams(window.location.search);
		const roundIdVL = urlParamsVL.get('round_id');
		this.replayButton.visible = !!roundIdVL;
		if (this.logocontainer) {
			this.logocontainer.visible = true;
		}
	}
		
		//BUY PANEL CONTAINER
		// this.BuyPanelCon.position.set(45,113);
		this.BuyPanelCon.y = 91;
		var xRatio = _viewInfoUtil.getWindowWidth() / _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].width;
		var yRatio = _viewInfoUtil.getWindowHeight() / _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].height;
		var scaleFactor = Math.min(xRatio, yRatio);
		var negativePadding =  (2.5- (xRatio / scaleFactor));
		this.BuyPanelCon.x = 300 * negativePadding;//
		this.BuyPanelCon.visible = true;
		//BUY FREE SPIN
		this.panelBase.position.set(-233,225);
		this.BuyBtn.position.set(-230,9);
		this.BuyBtn.scale.set(0.45);
		this.superFreeSpinBtn.position.set(-230,110);
		this.superFreeSpinBtn.scale.set(0.45);
		//2X BET
		this.twoXBetBg.position.set(-230,251);
		this.twoXBetBg.scale.set(0.45);
		//HISTORY
		this.historyContainer.position.set(-231,108);
		this.BuyPanelCon.addChild(this.BuyBtn);
		this.BuyPanelCon.addChild(this.superFreeSpinBtn);
		this.BuyPanelCon.addChild(this.twoXBetBg);
		this.BuyPanelCon.addChild(this.historyContainer);

		coreApp.gameView.panel.BuyBaseLeft.visible = false;
		coreApp.gameView.panel.BuyBaseRight.visible = false;
		if(coreApp.gameModel.isFullFSActive()){
			this.superFreeSpinBtn.visible = true;
			this.BuyBtn.visible = true;
		}
		
		// Hide buttons and panelBase in history mode
		if (isInHistoryMode) {
			if (this.BuyBtn) this.BuyBtn.visible = false;
			if (this.superFreeSpinBtn) this.superFreeSpinBtn.visible = false;
			if (this.twoXBetBg) this.twoXBetBg.visible = false;
			if (this.panelBase) this.panelBase.visible = false;
		}

		if(this.scatFillAnim)
			this.scatFillAnim.visible = false;
		
		}
	}	
}

sView.showMultiplier = function () {
	this.multiContainer.visible = true;
	this.gameTitle.visible = false;
}
sView.updateMultiplier = function (id) {
	this.multiContainer.visible = true;

}
sView.hideMultiplier = function () {
	this.multiContainer.visible = false;
	this.gameTitle.visible = true;
}
sView.createBuyFreeSpinPanel = function(){
	this.grayBg = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
    this.grayBg.alpha = 0.6;
	this.grayBg.position.set(-150,-150);
	this.grayBg.scale.set(10);
    this.grayBg.interactive = true;
	this.grayBg.visible = false;
   this.mainContainer.addChild(this.grayBg);
   pixiLib.addEvent(this.grayBg, function(){
}.bind(this));

	this.BuyPanelCon = pixiLib.getContainer();
	this.BuyPanelCon.name = "buyPanelContainer"

	this.panelBase = pixiLib.getElement("Sprite","sidePanelBase_VD");
	this.panelBase.anchor.set(0.5);
	this.panelBase.scale.set(0.3);
	this.BuyPanelCon.addChild(this.panelBase);
	this.mainContainer.addChild(this.BuyPanelCon);

	this.BuyBtn = pixiLib.getButton("buy_feature_btn");
	this.BuyBtn.name = "Buy Free Spin";
	this.BuyBtn.anchor.set(0.5);
	pixiLib.addEvent(this.BuyBtn, function(){
		_sndLib.play(_sndLib.sprite.btnClick);
		_mediator.publish("closeVolBar");/* for closing vol-slider bar */
		if(_ng.twoXBetEnabled)
			return;
		if(!coreApp.gameController.allReelsStopped)
			return
		_ng.buyFeaturePopupStatus = true;
		this.BuyRequest();
		// TweenMax.to(this.BuyBtn, 0.06, {
		// 		width: this.BuyBtn.width-10,
		// 		height: this.BuyBtn.height-10,
		// 		ease: Linear.easeInOut,
		// 		yoyo : true,
		// 		repeat:1,
		// 		onComplete : function() {
		// 			if(_ng.twoXBetEnabled)
		// 				return;
		// 			if(!coreApp.gameController.allReelsStopped)
		// 				return
		// 			_ng.buyFeaturePopupStatus = true;
		// 			this.BuyRequest();
		// 		}.bind(this)
		// 	});
	}.bind(this));
	this.BuyPanelCon.addChild(this.BuyBtn);

	const buyfreespinTextStyle = new PIXI.TextStyle({
		dropShadowAlpha: 0.2,
		dropShadowColor: "#702323",
		dropShadowDistance: 0,
		fill: "#fcfcfc",
		fontFamily: "Baloo-Regular",
		fontSize: 35,
		// fontWeight: "bold",
		lineJoin: "bevel",
		miterLimit: 4,
		stroke: "#d63d3d",
		strokeThickness: 7
	 });

	const freeSpinBuyAmountStyle = new PIXI.TextStyle({
		dropShadowAlpha: 0.2,
		dropShadowColor: "#f05d5d",
		dropShadowDistance: 0,
		fill: "#ffe226",
		fontFamily: "Baloo-Regular",
		fontSize: 50,
		align: "center",
		// fontWeight: "bold",
		lineJoin: "bevel",
		miterLimit: 4,
		stroke: "#ff218c",
		strokeThickness: 7,
		maxWidth: 240
	 });

	// const superstyle1 = new PIXI.TextStyle({
	// 	dropShadowAlpha: 0.2,
	// 	dropShadowColor: "#702323",
	// 	dropShadowDistance: 0,
	// 	fill: "#fcfcfc",
	// 	fontFamily: "Baloo-Regular",
	// 	fontSize: 30,
	// 	// fontWeight: "bold",
	// 	lineJoin: "bevel",
	// 	miterLimit: 4,
	// 	stroke: "#d63d3d",
	// 	strokeThickness: 7,
	// 	maxWidth: 235
	//  });



	this.buyText = pixiLib.getElement("Text", buyfreespinTextStyle);
	this.buyText.position.set(78,-75);
	this.BuyBtn.addChild(this.buyText);
	this.buyText.anchor.set(0.5);
	pixiLib.setText(this.buyText, gameLiterals.buyText);

	this.freespinText = pixiLib.getElement("Text", buyfreespinTextStyle);
	this.freespinText.position.set(78,-30);
	this.BuyBtn.addChild(this.freespinText);
	this.freespinText.anchor.set(0.5);
	pixiLib.setText(this.freespinText, gameLiterals.freeSpinText);

	this.amtTxt = pixiLib.getElement("Text",freeSpinBuyAmountStyle);
	this.amtTxt.name = "buyfsAmt";
	this.amtTxt.position.set(78,21);
	this.BuyBtn.addChild(this.amtTxt);
	this.amtTxt.anchor.set(0.5);
	//SUPER BUY
	this.createSuperFreeSpin();


	//2X BET 
	this.twoXBetBg = pixiLib.getButton("2xBase");
	this.twoXBetBg.name = "2XBet";
	this.twoXBetBg.anchor.set(0.5);
	this.BuyPanelCon.addChild(this.twoXBetBg);

	this.amontBase = pixiLib.getElement("Sprite","betAmtBase");
	this.amontBase.anchor.set(0.5);
	this.amontBase.position.set(0,-55);
	this.twoXBetBg.addChild(this.amontBase);

	
	const doubleChanceTextStyle = new PIXI.TextStyle({
		dropShadow: true,
		dropShadowAlpha: 0.5,
		dropShadowAngle: 1.2,
		dropShadowDistance: 2,
		fill: "#fcfcfc",
		fontFamily: "Baloo-Regular",
		fontSize: 45,
		// fontWeight: "bold",
		lineJoin: "bevel",
		miterLimit: 4,
		stroke: "#0c7d48",
		strokeThickness: 10
	});
	
	// const doubleChanceStyle = new PIXI.TextStyle({
	// dropShadow: true,
    // dropShadowAlpha: 0.5,
    // dropShadowAngle: 1.2,
    // dropShadowDistance: 2,
    // fill: "#fcfcfc",
    // // fontFamily: "Tahoma",
    // fontSize: 39,
    // fontWeight: "bold",
    // lineJoin: "bevel",
    // miterLimit: 4,
    // stroke: "#0c7d48",
    // strokeThickness: 10
	// });
	
	const toWinFeatureTextStyle = new PIXI.TextStyle({
		dropShadow: true,
		dropShadowAlpha: 0.5,
		dropShadowAngle: 1.2,
		dropShadowDistance: 2,
		fill: "#ffffff",
		fontFamily: "Baloo-Regular",
		fontSize: 30,
		// fontWeight: "bold",
		lineJoin: "bevel",
		miterLimit: 4,
		stroke: "#0c7d48",
		strokeThickness: 10
	});

	// const doubleChanceAmountStyle = new PIXI.TextStyle({
	// 	dropShadowAlpha: 0.2,
	// 	dropShadowColor: "#f05d5d",
	// 	dropShadowDistance: 0,
	// 	fill: "#faf434",
	// 	fontFamily: "Baloo-Regular",
	// 	fontSize: 50,
	// 	// fontWeight: "bold",
	// 	lineJoin: "bevel",
	// 	miterLimit: 4,
	// 	// stroke: "#ff218c",
	// 	// strokeThickness: 7,
	// 	maxWidth: 235    
	// });

	//BET text
	this.twoXbuyTxt = pixiLib.getElement("Text", doubleChanceTextStyle);
	this.twoXbuyTxt.anchor.set(0.5);
	pixiLib.setText(this.twoXbuyTxt, gameLiterals.betText);
	this.amontBase.addChild(this.twoXbuyTxt)
	this.twoXbuyTxt.position.set(0,-100);
	//DOUBLE Text
	this.doubleTxt = pixiLib.getElement("Text", doubleChanceTextStyle);
	this.doubleTxt.anchor.set(0.5);
	pixiLib.setText(this.doubleTxt, gameLiterals.doubleText);
	this.amontBase.addChild(this.doubleTxt)
	this.doubleTxt.position.set(0,55);
	//CHANCE
	// this.chanceTxt = pixiLib.getElement("Text",otherStyles);
	// this.chanceTxt.anchor.set(0.5);
	// pixiLib.setText(this.chanceTxt, gameLiterals.chanceToText);
	// this.amontBase.addChild(this.chanceTxt)
	// this.chanceTxt.position.set(0,90);
	
	//WIN FEATURE
	this.chanceTxt = pixiLib.getElement("Text", toWinFeatureTextStyle);
	this.chanceTxt.anchor.set(0.5);
	pixiLib.setText(this.chanceTxt, gameLiterals.winFeature);
	this.amontBase.addChild(this.chanceTxt)
	this.chanceTxt.position.set(0,100);

	this.twoxbetamt = pixiLib.getElement("Text", freeSpinBuyAmountStyle);
	this.twoxbetamt.scale.set(1);
	this.twoxbetamt.position.set(0, -25);
	this.twoxbetamt.anchor.set(0.5);
	pixiLib.setText(this.twoxbetamt,"$2.8");
	this.amontBase.addChild(this.twoxbetamt)

	// this.offIcon = pixiLib.getElement("Sprite","on_icon");
	// this.offIcon.position.set(-27,-0.5);
	// this.offIcon.scale.set(1)
	
	// this.tickOn = pixiLib.getElement("Sprite","tick_icon");
	// this.tickOn.position.set(27,0.5);
	// this.tickOn.scale.set(1);

	this.twoxOn = pixiLib.getElement("Sprite","on_btn_normal");
	this.twoxOn.position.set(0,105);
	this.twoxOn.anchor.set(0.5);
	this.twoxOn.scale.set(1)
	this.twoxOn.interactive = true;
	this.twoxOn.buttonMode = true;
	this.twoXBetBg.addChild(this.twoxOn);
	// this.twoxOn.addChild(this.tickOn);

	this.twoxoff = pixiLib.getElement("Sprite","off_btn_normal");
	this.twoxoff.position.set(0,105);
	this.twoxoff.anchor.set(0.5);
	this.twoxoff.scale.set(1)
	this.twoxoff.interactive = true;
	this.twoxoff.buttonMode = true;
	this.twoXBetBg.addChild(this.twoxoff);
	// this.twoxoff.addChild(this.offIcon);

	pixiLib.addEvent(this.twoXBetBg, function () {
		_mediator.publish("closeVolBar");/* for closing vol-slider bar */
		if (_ng.twoXBetEnabled == false) {
			if(!coreApp.gameController.allReelsStopped)
				return
			_ng.twoXBetEnabled = true;
			_sndLib.play(_sndLib.sprite.btnClick);
			TweenMax.to(this.twoXBetBg, 0.06, {
				width: this.twoXBetBg.width - 10,
				height: this.twoXBetBg.height - 10,
				ease: Linear.easeInOut,
				yoyo: true,
				repeat: 1,
				onComplete: function () {
					this.twoxoff.visible = false;
					pixiLib.setInteraction(this.BuyBtn, false);
					pixiLib.setInteraction(this.superFreeSpinBtn, false);
					this.BuyBtn.alpha = 0.6;
					this.superFreeSpinBtn.alpha = 0.6;
					_mediator.publish("updateTwoxbet");
				}.bind(this)
			});
		}
		else {
			_sndLib.play(_sndLib.sprite.btnClick);
			TweenMax.to(this.twoXBetBg, 0.06, {
				width: this.twoXBetBg.width - 10,
				height: this.twoXBetBg.height - 10,
				ease: Linear.easeInOut,
				yoyo: true,
				repeat: 1,
				onComplete: function () {
					this.twoxoff.visible = true;
					this.BuyBtn.alpha = 1;
					this.superFreeSpinBtn.alpha = 1;
					_ng.twoXBetEnabled = false;
					_mediator.publish("updateTotalBet");
					_mediator.publish("checkBalanceForBuyFeature");
				}.bind(this)
			});
		}
	}.bind(this),
	)
	if(coreApp.gameModel.obj.previous_round.coin_value) {
        pixiLib.setText(this.amtTxt,pixiLib.getFormattedAmount(coreApp.gameModel.obj.previous_round.coin_value * coreApp.gameModel.spinData.buyfg));
		pixiLib.setText(this.twoxbetamt,pixiLib.getFormattedAmount(coreApp.gameModel.obj.previous_round.coin_value * coreApp.gameModel.spinData.antebet));
	}
    else{
		pixiLib.setText(this.amtTxt,pixiLib.getFormattedAmount(coreApp.gameModel.panelModel.selectedCoinValue * coreApp.gameModel.spinData.buyfg));
		pixiLib.setText(this.twoxbetamt,pixiLib.getFormattedAmount(coreApp.gameModel.panelModel.selectedCoinValue * coreApp.gameModel.spinData.antebet));
	}

}
sView.toggleLand=function()
{
	if (_ng.twoXBetEnabled == true) {
		_sndLib.play(_sndLib.sprite.btnClick);
		TweenMax.to(this.twoXBetBg, 0.06, {
			width: this.twoXBetBg.width - 10,
			height: this.twoXBetBg.height - 10,
			ease: Linear.easeInOut,
			yoyo: true,
			repeat: 1,
			onComplete: function () {
				this.twoxoff.visible = false;
				pixiLib.setInteraction(this.BuyBtn, false);
				this.BuyBtn.alpha = 0.6;
				this.superFreeSpinBtn.alpha = 0.6;
			
			}.bind(this)
		});
	}
	else {
		_sndLib.play(_sndLib.sprite.btnClick);
		TweenMax.to(this.twoXBetBg, 0.06, {
			width: this.twoXBetBg.width - 10,
			height: this.twoXBetBg.height - 10,
			ease: Linear.easeInOut,
			yoyo: true,
			repeat: 1,
			onComplete: function () {
				this.twoxoff.visible = true;
				pixiLib.setInteraction(this.BuyBtn, true);
				this.BuyBtn.alpha = 1;
				this.superFreeSpinBtn.alpha = 1;
			
			}.bind(this)
		});
	}
}
sView.UpdateBet=function(value)
{
	this.Updatevalue = value;
	_mediator.publish("updateFreeSpinCost",value);//Value will update on inside the pop up(GInfoPopup);
	_mediator.publish("updateSuperSpinCost",value);//Value will update on inside the pop up(GInfoPopup);
	pixiLib.setText(this.amtTxt,pixiLib.getFormattedAmount(value*coreApp.gameModel.spinData.buyfg));
	pixiLib.setText(this.superSpinAmt,pixiLib.getFormattedAmount(value*coreApp.gameModel.spinData.superBuyfg));
	var bet = value*coreApp.gameModel.spinData.antebet;
	pixiLib.setText(this.twoxbetamt,pixiLib.getFormattedAmount(bet))
	_mediator.publish("ChangeWinValues",value);
	// _mediator.publish("updatePanelfs",value);
}
sView.BuyRequest = function(){
		// _mediator.publish("createTotalBetSelector");

	if(_viewInfoUtil.viewType=="VP"){
		_mediator.publish("hideAndShowBuyControlls",false);
	}
	if(_viewInfoUtil.viewType=="VD"){
		// _mediator.publish("ToggleSpin",false);
		// _mediator.publish("setSpaceBarEvent", "idle");
	}
	else if(_viewInfoUtil.viewType=="VP" || _viewInfoUtil.viewType=="VL"){
		_mediator.publish("showMobPanel");
		_mediator.publish("ToggleSpin",false)
		_mediator.publish("ToggleMobPanel",false);
	}
	_mediator.publish("disableBuyFeature");
	_mediator.publish("buyFreeSpinPopup");
}
sView.BuyPanelVisible = function(){
	this.BuyPanelCon.visible = true;
	this.grayBg.visible = true;
}

sView.ToggleVolPanel=function(directlyClose){
	if (directlyClose == false) {
		this.volBox.visible = directlyClose;
		// this.graBGfrVolumeBar.visible = false;
	}
	else{
		this.volBox.visible = ! this.volBox.visible;
		if (this.volBox.visible == false) {
			// this.graBGfrVolumeBar.visible = false;
		}
		else{
			// this.graBGfrVolumeBar.visible = true;
		}
	}
}

sView.SliderMoved=function()
{
	var bool;
	if(this.oldSlid==this.NewSlid)
		{
			_mediator.publish("boolSlid",false);
		}
		else{
			_mediator.publish("boolSlid",true);
		}
}

sView.ResizeGview = function(){	
	if(this.BuyBtnVL){
		if (_viewInfoUtil.viewType === "VL") {
			this.BuyBtnVL.x = 30;
		this.BuyBtnVL.y = 435;
			this.BuyBtnVL.scale.set(0.6);
			this.BuyBtnVL.visible=true;
		}
		else
		{
			this.BuyBtnVL.visible=false;
		}
	}
	
	if ( coreApp.gameView.infoPopup.BuypopupPanelCon && coreApp.gameView.infoPopup.returnPopupStatus().visible == true) {
		_mediator.publish("hideandShowBuyfeature",false);
	}
	else if (coreApp.gameView.infoPopup.BuypopupPanelCon && coreApp.gameView.infoPopup.returnPopupStatus().visible == false) {
		_mediator.publish("hideandShowBuyfeature",true);
	}	
}

sView.disableBuyFeature = function(){
	// Check if in history mode - hide buttons if in history mode
	// const urlParams = new URLSearchParams(window.location.search);
	// const hasRoundId = urlParams.has('round_id');
	// const isNormalSpin = urlParams.get('is_normal_spin') === 'true';
	// const isBuyFeature = urlParams.get('is_buy_feature') === 'true';
	// const isSuperBuyFeature = urlParams.get('is_buy_super_feature') === 'true';
	// const isPFR_Feature = urlParams.get('IsPfr') === 'true';
	// const isInHistoryMode = hasRoundId && (isNormalSpin || isBuyFeature || isSuperBuyFeature || isPFR_Feature);
	const isInHistoryMode = isHistoryMode;

	// Hide buttons and panelBase in history mode
	if (isInHistoryMode) {
		if (this.BuyBtn) {
			this.BuyBtn.visible = false;
			pixiLib.setInteraction(this.BuyBtn, false);
		}
		if (this.superFreeSpinBtn) {
			this.superFreeSpinBtn.visible = false;
			pixiLib.setInteraction(this.superFreeSpinBtn, false);
		}
		if (this.twoXBetBg) {
			this.twoXBetBg.visible = false;
			pixiLib.setInteraction(this.twoXBetBg, false);
		}
		if (this.twoxoff) {
			pixiLib.setInteraction(this.twoxoff, false);
		}
		if (this.twoxOn) {
			pixiLib.setInteraction(this.twoxOn, false);
		}
		if (this.panelBase) {
			this.panelBase.visible = false;
		}
	} else {
		// Normal disable behavior
		// this.BuyPanelCon.alpha=.7;
		pixiLib.setInteraction(this.BuyBtn,false);
		pixiLib.setInteraction(this.superFreeSpinBtn,false);
		pixiLib.setInteraction(this.twoxoff,false);
		pixiLib.setInteraction(this.twoxOn,false);
		pixiLib.setInteraction(	this.twoXBetBg,false);
	}
	_mediator.publish("disablePanelFs");
	
}
sView.enableBuyFeature = function(){
	// Check if in history mode - hide buttons if in history mode
	// const urlParams = new URLSearchParams(window.location.search);
	// const hasRoundId = urlParams.has('round_id');
	// const isNormalSpin = urlParams.get('is_normal_spin') === 'true';
	// const isBuyFeature = urlParams.get('is_buy_feature') === 'true';
    // const isSuperBuyFeature = urlParams.get('is_buy_super_feature') === 'true';
	// const isPFR_Feature = urlParams.get('IsPfr') === 'true';
	// const isInHistoryMode = hasRoundId && (isNormalSpin || isBuyFeature || isSuperBuyFeature || isPFR_Feature);
	const isInHistoryMode = isHistoryMode;

	// Hide buttons and panelBase in history mode
	if (isInHistoryMode) {
		if (this.BuyBtn) {
			this.BuyBtn.visible = false;
			pixiLib.setInteraction(this.BuyBtn, false);
		}
		if (this.superFreeSpinBtn) {
			this.superFreeSpinBtn.visible = false;
			pixiLib.setInteraction(this.superFreeSpinBtn, false);
		}
		if (this.twoXBetBg) {
			this.twoXBetBg.visible = false;
			pixiLib.setInteraction(this.twoXBetBg, false);
		}
		if (this.twoxoff) {
			pixiLib.setInteraction(this.twoxoff, false);
		}
		if (this.twoxOn) {
			pixiLib.setInteraction(this.twoxOn, false);
		}
		if (this.panelBase) {
			this.panelBase.visible = false;
		}
		return; // Exit early - don't enable buttons in history mode
	}

	if(coreApp.gameModel.isAutoSpinActive()){
		// _mediator.publish("disableBuyFeature");
		if(_ng.twoXBetEnabled==true){
			// this.BuyPanelCon.alpha=1;
			pixiLib.setInteraction(this.BuyBtn,false);
			pixiLib.setInteraction(this.superFreeSpinBtn,false);
			_mediator.publish("enabledPanelFs");
		}
		else{
		// this.BuyPanelCon.alpha=0.7;
		pixiLib.setInteraction(this.superFreeSpinBtn,false);
		pixiLib.setInteraction(this.BuyBtn,false);
		pixiLib.setInteraction(this.twoxoff,false);
        pixiLib.setInteraction(this.twoxOn,false);
        pixiLib.setInteraction( this.twoXBetBg,false);
		_mediator.publish("enabledPanelFs");
		}
	}
    else if(_ng.twoXBetEnabled==true){
        // this.BuyPanelCon.alpha=1;
		pixiLib.setInteraction(this.superFreeSpinBtn,false);
        pixiLib.setInteraction(this.BuyBtn,false);
        pixiLib.setInteraction(this.twoxoff,true);
        pixiLib.setInteraction(this.twoxOn,true);
        pixiLib.setInteraction( this.twoXBetBg,true);
		_mediator.publish("enabledPanelFs");
    }
	else if(coreApp.gameModel.isFreeSpinActive()){
		_mediator.publish("disableBuyFeature");
	}
    else{
        // this.BuyPanelCon.alpha=1;
		this.BuyBtn.alpha=1;
		this.superFreeSpinBtn.alpha = 1;
		// Ensure buttons are visible
		if (this.BuyBtn) this.BuyBtn.visible = true;
		if (this.superFreeSpinBtn) this.superFreeSpinBtn.visible = true;
		if (this.twoXBetBg) this.twoXBetBg.visible = true;
        pixiLib.setInteraction(this.BuyBtn,true);
		pixiLib.setInteraction(this.superFreeSpinBtn,true);
        pixiLib.setInteraction(this.twoxoff,true);
        pixiLib.setInteraction(this.twoxOn,true);
        pixiLib.setInteraction( this.twoXBetBg,true);
        _mediator.publish("enabledPanelFs");
    }
}
// sView.moveBuyFeature = function(){
// 	_mediator.publish("visiblityTotalWin",true);
// 	// _mediator.publish("ToggleTurbo",false);
	
// 	if(_viewInfoUtil.viewType === "VD"){
// 		TweenMax.to(this.BuyPanelCon, 0.8, {
// 			x: this.BuyPanelCon.x+1000,
// 			ease: Linear.easeInOut,
// 		});
// 	}
// 	else if(_viewInfoUtil.viewType === "VL"){
// 		TweenMax.to(this.BuyPanelCon, 0.8, {
// 			x: this.BuyPanelCon.x-1000,
// 			ease: Linear.easeInOut,
// 		});
// 	}
// 	else{
// 		_mediator.publish("moveVisiblebuyFeature",false);
// 	}
// }
// sView.bringBackBuyFeature = function(){
// 	// _mediator.publish("ToggleTurbo",true);
// 	_mediator.publish("visiblityTotalWin",false);
	
// 	if(_viewInfoUtil.viewType === "VD"){
// 		TweenMax.to(this.BuyPanelCon, 0.8, {
// 			x: 45,
// 			ease: Linear.easeInOut,
// 		});
// 	}
// 	else if(_viewInfoUtil.viewType === "VL"){
// 		TweenMax.to(this.BuyPanelCon, 0.8, {
// 			x: 430,
// 			ease: Linear.easeInOut,
// 		});
// 	}
// 	else{
// 		_mediator.publish("moveVisiblebuyFeature",true);
// 	}
// }

sView.CreateScatterWinAnim = function() {
//TODO - optimize and update function call

	if (_viewInfoUtil.viewType === "VD" || _viewInfoUtil.viewType === "VL") {
		this.scatFillAnim = pixiLib.getElement("Spine","scatterFill");

		this.scatFillAnim.position.set(_viewInfoUtil.getWindowWidth() / 2, _viewInfoUtil.getWindowHeight() / 2);
		this.scatFillAnim.width = _viewInfoUtil.getWindowWidth();
		this.scatFillAnim.height = _viewInfoUtil.getWindowHeight();
		this.scatFillAnim.state.setAnimation(0,'landscape',false);
	}
	else if (_viewInfoUtil.viewType === "VP") {
		this.scatFillAnim=pixiLib.getElement("Spine","scatterFill");

		this.scatFillAnim.position.set(_viewInfoUtil.getWindowWidth() / 2, _viewInfoUtil.getWindowHeight() / 2);
		this.scatFillAnim.state.setAnimation(0,'portrait',false);
	}

	_sndLib.play(_sndLib.sprite.scatter_Open);

	this.stage.addChild(this.scatFillAnim);

	setTimeout(function(){
		_sndLib.stop(_sndLib.sprite.scatter_Open);
		this.stage.removeChild(this.scatFillAnim);
	}.bind(this),2500);
}

sView.hideandShowBuyfeature = function(bool){
	if (_viewInfoUtil.viewType == "VP") {
		_mediator.publish("moveVisiblebuyFeature",bool);	
	}
	else{
		if(coreApp.gameModel.isAutoSpinActive() != true)
			this.BuyPanelCon.visible = bool;
	}
	if (_viewInfoUtil.viewType == "VL") {
		this.BuyPanelCon.visible = true;
	}
}

sView.createSuperFreeSpin = function() {
 
	const buySuperFreeSpinTextStyle = new PIXI.TextStyle({
		dropShadowAlpha: 0.2,
		dropShadowColor: "#702323",
		dropShadowDistance: 0,
		fill: "#fcfcfc",
		fontFamily: "Baloo-Regular",
		fontSize: 35,
		// fontWeight: "bold",
		lineJoin: "bevel",
		miterLimit: 4,
		stroke: "#d63d3d",
		strokeThickness: 7,
		// maxWidth: 235
	 });

	const superFreeSpinBuyAmountStyle = new PIXI.TextStyle({
		dropShadowAlpha: 0.2,
		dropShadowColor: "#702323",
		dropShadowDistance: 0,
		fill: "#fcfcfc",
		fontFamily: "Baloo-Regular",
		fontSize: 50,
		// fontWeight: "bold",
		lineJoin: "bevel",
		miterLimit: 4,
		stroke: "#d63d3d",
		strokeThickness: 7,
		maxWidth: 240
	 });

	// const superstyle = new PIXI.TextStyle({
	// 	dropShadowAlpha: 0.2,
	// 	dropShadowColor: "#702323",
	// 	dropShadowDistance: 0,
	// 	fill: "#fafaf9",
	// 	// fontFamily: "Tahoma",
	// 	fontSize: 30,
	// 	fontWeight: "bold",
	// 	lineJoin: "bevel",
	// 	miterLimit: 4,
	// 	stroke: "#d63d3d",
	// 	strokeThickness: 4
	// });
 
    this.superFreeSpinBtn = pixiLib.getButton("superFreeSpins");
    this.superFreeSpinBtn.name = "superFreeSpinBtn";
    this.superFreeSpinBtn.anchor.set(0.5);
    this.BuyPanelCon.addChild(this.superFreeSpinBtn);

    pixiLib.addEvent(this.superFreeSpinBtn, function() {
		_mediator.publish("closeVolBar");/* for closing vol-slider bar */
		if(_ng.twoXBetEnabled)
			return;
		if(!coreApp.gameController.allReelsStopped)
			return
		_ng.buyFeaturePopupStatus = true;
        _sndLib.play(_sndLib.sprite.btnClick);
		_mediator.publish("disableBuyFeature");
		_mediator.publish("buyFreeSuperSpinPopup");
		// _mediator.publish("createTotalBetSelector");

		if(_viewInfoUtil.viewType=="VD") {
			// _mediator.publish("ToggleSpin",false);
			// _mediator.publish("setSpaceBarEvent", "idle");
		}
		 
		if(_viewInfoUtil.viewType=="VP"){
			_mediator.publish("hideAndShowBuyControlls",false);
			_mediator.publish("ToggleMobPanel",false);
		} 

    }.bind(this));

    this.superText1 = pixiLib.getElement("Text", buySuperFreeSpinTextStyle);
    this.superText1.name = "superText1";
    this.superText1.position.set(78,-90);
    this.superFreeSpinBtn.addChild(this.superText1);
    this.superText1.anchor.set(0.5);
	pixiLib.setText(this.superText1, gameLiterals.superText);

    this.superText = pixiLib.getElement("Text", buySuperFreeSpinTextStyle);
    this.superText.name = "superText";
    this.superText.position.set(78,-52);
    this.superFreeSpinBtn.addChild(this.superText);
    this.superText.anchor.set(0.5);
	pixiLib.setText(this.superText, gameLiterals.buyText);

	this.superText2 = pixiLib.getElement("Text", buySuperFreeSpinTextStyle);
    this.superText2.name = "superText2";
    this.superText2.position.set(78,-12);
    this.superFreeSpinBtn.addChild(this.superText2);
    this.superText2.anchor.set(0.5);
	pixiLib.setText(this.superText2, gameLiterals.freeSpinText);

    this.superSpinAmt = pixiLib.getElement("Text", superFreeSpinBuyAmountStyle);
    this.superSpinAmt.name = "superSpinAmt";
    this.superSpinAmt.position.set(78,31);
    this.superFreeSpinBtn.addChild(this.superSpinAmt);
    this.superSpinAmt.anchor.set(0.5);

	if(coreApp.gameModel.obj.previous_round.coin_value){
        pixiLib.setText(this.superSpinAmt,pixiLib.getFormattedAmount(coreApp.gameModel.obj.previous_round.coin_value*coreApp.gameModel.spinData.superBuyfg));
	}
    else{
		pixiLib.setText(this.superSpinAmt,pixiLib.getFormattedAmount(coreApp.gameModel.panelModel.selectedCoinValue * coreApp.gameModel.spinData.superBuyfg));
	}
}

sView.createHistoryPanel = function(){
	// const fsLeftStyle = new PIXI.TextStyle({
	// 		"type": "BitmapFont",
	// 				"fontName": "box-Multiplier",
	// 				"fontSize": 18,
	// 				"align": "center",
	// 				// "maxWidth": 500,
	// });
	const fsLeftStyle = {
		"type": "BitmapFont",
		"fontName": "box-Multiplier",
		"fontSize": 34,
		"align": "center",
	}
	var txtStyle = {
		align: "center",
		fill: ["#fe5c10", "#fa6e2d", "#fe5c10"],
		fontFamily: "Baloo-Regular",
		fontSize: 35,
		// fontWeight: "bolder",
		lineJoin: "round",
		stroke: "#fbd9d3",
		strokeThickness: 4,
		dropShadow: true,
		dropShadowColor: "#fbd9d3",
		dropShadowDistance: 6,
		dropShadowAngle: Math.PI / 2,
		dropShadowBlur: 0,
		maxWidth: 270,
	}

	this.historyContainer = pixiLib.getContainer();
	this.historyContainer.name = "historyContainer"
	this.BuyPanelCon.addChild(this.historyContainer);

	this.historyBase = pixiLib.getElement("Spine", "liquid_jar_Final");
	this.historyBase.state.setAnimation(0, "Idle", true);
	this.historyBase.name = "historyBaseAnim";
	this.historyContainer.addChild(this.historyBase);
	this.historyBase.scale.set(0.57, 0.54);
	this.historyBase.position.set(0,318);

	
	// this.historyBase = pixiLib.getElement("Sprite","historyboxNew");
	// this.historyBase.anchor.set(0.5);
	// this.historyContainer.addChild(this.historyBase);
	// this.historyBase.name = "History Base";
	//UP ARROW
	this.upArrow = pixiLib.getButton("Arrowbutton");
	this.upArrow.anchor.set(0.5);
	this.upArrow.name = "UpArrow";
	this.upArrow.scale.set(0.5);
	this.upArrow.position.set(0,-115);
	this.historyBase.addChild(this.upArrow);
	pixiLib.setInteraction(this.upArrow , false);

	pixiLib.addEvent(this.upArrow,function(){
		pixiLib.setInteraction(this.upArrow , false);
		TweenMax.to(this.historyboxContainer, 0.5, {
			y: this.historyboxContainer.y-this.tumbleHistBox.height,
			ease: Power1.easeOut,
			onComplete: function(){
				if(this.historyboxContainer.y < 21) {   /*this means first tumble history reached at the first position*/
					pixiLib.setInteraction(this.upArrow , false);
					pixiLib.setInteraction(this.downArrow , true);
					return;
				}
				pixiLib.setInteraction(this.upArrow , true);
				pixiLib.setInteraction(this.downArrow , true);
			}.bind(this)
		});
	}.bind(this));
	
	//DOWN ARROW
	this.downArrow = pixiLib.getButton("Arrowbutton");
	this.downArrow.anchor.set(0.5);
	this.downArrow.name = "DownArrow";
	this.downArrow.position.set(0,162);
	this.downArrow.scale.set(0.5, -0.5);
	// this.downArrow.scale.y = -1;

	this.historyBase.addChild(this.downArrow);
	pixiLib.setInteraction(this.downArrow , false);

	pixiLib.addEvent(this.downArrow,function() {
		pixiLib.setInteraction(this.downArrow , false);
		TweenMax.to(this.historyboxContainer, 0.5, {
			y: this.historyboxContainer.y+this.tumbleHistBox.height,
			ease: Power1.easeOut,
			onComplete: function() {
				/*this means last tumble history reached at the top position*/
				if(this.historyboxContainer.y > this.historyboxContainer.height - this.tumbleHistBox.height * 6 ) {  
					pixiLib.setInteraction(this.downArrow , false);
					pixiLib.setInteraction(this.upArrow , true);
					return;
				}
				pixiLib.setInteraction(this.upArrow , true);
				pixiLib.setInteraction(this.downArrow , true);
			}.bind(this)
		});
	}.bind(this));

	this.historyboxContainer = pixiLib.getContainer();
	this.historyBase.addChild(this.historyboxContainer);
	this.historyboxContainer.name = "historyboxContainer";


	this.FSpinsLefttxt = pixiLib.getElement("Text", txtStyle);
	this.FSpinsLefttxt.name ="FSpinsLefttxt";
	this.FSpinsLefttxt.anchor.set(0.5);
	pixiLib.setText(this.FSpinsLefttxt, gameLiterals.freeSpinTxt);
	this.historyBase.addChild(this.FSpinsLefttxt);
	this.FSpinsLefttxt.position.set(6,-288);
	this.FSpinsLefttxt.visible = false;

	this.fsleftNum = pixiLib.getElement("Text", fsLeftStyle);
	this.fsleftNum.name = "fsleftNum";
	this.historyBase.addChild(this.fsleftNum);
	pixiLib.setText(this.fsleftNum, "");
	this.fsleftNum.anchor.set(0.5);
	this.fsleftNum.position.set(0,-230);

	this.historyMask = pixiLib.getRectangleSprite(this.historyBase.width *.5, this.historyBase.height*.5, 0x00ffff);
	this.historyBase.addChild(this.historyMask);
	this.historyMask.position.set(-125,-94);
	this.historyMask.name = "historyMask";
	this.historyMask.scale.set(1,0.9);
    this.historyboxContainer.mask = this.historyMask;
	
}

sView.AddHistBox = function(num,win,symbolpop,historySym) {

	var limit=coreApp.gameModel.obj.current_round.misc_prizes[num].old_reel_symbol.length;
	var sym = coreApp.gameModel.obj.current_round.misc_prizes[num].old_reel_symbol;
	for (var j = 0; j <limit ; j++) {
		this.count+=1;
		this.tumbleHistBox = pixiLib.getElement("Sprite","historyTile");
		this.tumbleHistBox.name = "tumbleHistBox";
		this.historyboxContainer.addChild(this.tumbleHistBox);
		this.tumbleHistBox.anchor.set(0.5);
		this.tumbleHistBox.scale.set(0.75);	
		this.tumbleHistBox.y = -500;
		this.HistoryArray.push(this.tumbleHistBox);

		const stripStyle = new PIXI.TextStyle({
			dropShadowAlpha: 0.2,
			dropShadowColor: "#702323",
			dropShadowDistance: 0,
			fill: "#fcfcfc",
			fontFamily: "Baloo-Regular",
			fontSize: 40,
			// fontWeight: "bold",
			lineJoin: "bevel",
			miterLimit: 4,
			stroke: "#d63d3d",
			strokeThickness: 7,
			maxWidth: 180,
		 });
		this.noOfSympop = pixiLib.getElement("Text",stripStyle);
		this.noOfSympop.anchor.set(0.5);
		this.noOfSympop.position.set(-130,-5);
		this.tumbleHistBox.addChild(this.noOfSympop);
		pixiLib.setText(this.noOfSympop,symbolpop[this.count - 1]);

		this.symboltexture = pixiLib.getElement("Sprite",historySym[this.count - 1]);
		this.symboltexture.scale.set(0.2);
		this.symboltexture.anchor.set(0.5);
		this.symboltexture.position.set(-93,-5);
		this.tumbleHistBox.addChild(this.symboltexture);

		this.wingot = pixiLib.getElement("Text",stripStyle);
		this.wingot.anchor.set(0.5);
		this.wingot.position.set(62,-5);
		this.tumbleHistBox.addChild(this.wingot);
		pixiLib.setText(this.wingot,pixiLib.getFormattedAmount(win[this.count - 1]))

		this.tweenHistBox(this.count - 1);
		this.stripNum+=1;

		if(this.count>5){
			this.removeAfter5();
			this.scrollHistoryBox();
		}
	}
}

sView.scrollHistoryBox = function() {
	pixiLib.setInteraction(this.upArrow, true);
}

sView.removeHistBox = function(){
	this.historyboxContainer.y = 0;
	for(var i=0;i<this.HistoryArray.length;i++){
		this.tweenRemove(i);
	}
	this.HistoryArray = [];
	this.flag=0;
	this.count=0;
	this.stripNum=0;
	pixiLib.setInteraction(this.upArrow , false);
	pixiLib.setInteraction(this.downArrow , false);
}

sView.tweenHistBox = function(num){
	TweenMax.to(this.tumbleHistBox, 0.5, {
		y: 100-(this.tumbleHistBox.height*num),
		ease: Sine.easeInOut,
	});
	_sndLib.play(_sndLib.sprite.Outro);
}
sView.removeAfter5 = function(){
	TweenMax.to(this.historyboxContainer, 0.5, {
		y: this.historyboxContainer.y+this.tumbleHistBox.height,
		ease: Elastic.easeInOut.config(1.1, 1),
	});
}
sView.tweenRemove = function(i){
	TweenMax.to(this.HistoryArray[i], i * 0.1, {
		y: 1000,
		ease: Power1.easeOut,
		onComplete : function(){
			this.historyboxContainer.removeChild(this.HistoryArray[i]);
		}.bind(this)
	});
}

sView._hideAndShowOfTwoXButton = function (bool){
	const isInHistoryMode = isHistoryMode;
	const currentAction = bool;
	// In history mode, always hide buttons regardless of bool parameter
	if (isInHistoryMode) {
		bool = false;
	}

    this.twoXBetBg.visible = bool;
	if(coreApp.gameView.panel.BuyBaseLeft && coreApp.gameView.panel.BuyBaseRight){
		coreApp.gameView.panel.BuyBaseLeft.visible = bool;
		coreApp.gameView.panel.BuyBaseRight.visible = bool;
	}

	if(_viewInfoUtil.viewType == "VP" || (_viewInfoUtil.viewType == "VL" && !coreApp.gameModel.isFreeSpinActive())) {
		this.superFreeSpinBtn.visible = bool;
		this.BuyBtn.visible = bool;
	}
	if(!bool){
		if(isInHistoryMode && currentAction){
			this.playJarOpenClose("Idle","Idle");
			this.FSpinsLefttxt.visible = false;
			this.fsleftNum.visible = false;
		}else{
			this.playJarOpenClose("Opening","Idle2");
			this.FSpinsLefttxt.visible = true;
			this.fsleftNum.visible = true;
		}
	}else{
		this.playJarOpenClose("Closing","Idle");

		this.FSpinsLefttxt.visible = false;
		this.fsleftNum.visible = false;
		_mediator.publish("setRemainingFSpins","");/* Rest to null */
	}	
}

sView.setRemainingFSpins = function(count){
	pixiLib.setText(this.fsleftNum,count);
}

sView.hideAndShowBuyControlls = function (bool) {
	if(_viewInfoUtil.device == 'Mobile')
		coreApp.gameView.panel.BuyControl.visible = bool;
}

sView.createTitle = function (){};

/* For disabling the Buy Free Game button if the Buy Free Game balance is insufficient */
sView.checkBalanceForBuyFeature = function() {
	// Check if in history mode - hide buttons if in history mode
	// const urlParams = new URLSearchParams(window.location.search);
	// const hasRoundId = urlParams.has('round_id');
	// const isNormalSpin = urlParams.get('is_normal_spin') === 'true';
	// const isBuyFeature = urlParams.get('is_buy_feature') === 'true';
	// const isSuperBuyFeature = urlParams.get('is_buy_super_feature') === 'true';
	// const isPFR_Feature = urlParams.get('IsPfr') === 'true';
	// const isInHistoryMode = hasRoundId && (isNormalSpin || isBuyFeature || isSuperBuyFeature || isPFR_Feature);
	const isInHistoryMode = isHistoryMode;
	
	// Hide buttons and panelBase in history mode
	if (isInHistoryMode) {
		if (this.BuyBtn) {
			this.BuyBtn.visible = false;
			pixiLib.setInteraction(this.BuyBtn, false);
		}
		if (this.superFreeSpinBtn) {
			this.superFreeSpinBtn.visible = false;
			pixiLib.setInteraction(this.superFreeSpinBtn, false);
		}
		if (this.twoXBetBg) {
			this.twoXBetBg.visible = false;
			pixiLib.setInteraction(this.twoXBetBg, false);
		}
		if (this.panelBase) {
			this.panelBase.visible = false;
		}
		return; // Exit early - don't check balance in history mode
	}

	if(!coreApp.gameController.allReelsStopped || coreApp.gameModel.isFreeSpinActive() ||
		coreApp.gameModel.isAutoSpinActive() || coreApp.gameModel.getIsPFSActive()) {
		return;
	}

	var userBalance =  coreApp.gameModel.userModel.balance;

	var buyFsAmount =  coreApp.gameModel.panelModel.selectedCoinValue * coreApp.gameModel.spinData.buyfg;
	var buySuperFsAmount = coreApp.gameModel.panelModel.selectedCoinValue * coreApp.gameModel.spinData.superBuyfg;
	var anteBetAmount = coreApp.gameModel.panelModel.selectedCoinValue * coreApp.gameModel.spinData.antebet;

	// Enable/disable Buy Free Game button
	const canBuyFs = buyFsAmount <= userBalance;
	pixiLib.setInteraction(this.BuyBtn, canBuyFs && !_ng.twoXBetEnabled);

	// Enable/disable Super Free Spin button
	const canBuySuperFs = buySuperFsAmount <= userBalance;
	pixiLib.setInteraction(this.superFreeSpinBtn, canBuySuperFs && !_ng.twoXBetEnabled);

	// Enable/disable 2x Bet button
	const canUseAnteBet = anteBetAmount <= userBalance;
	pixiLib.setInteraction(this.twoXBetBg, canUseAnteBet && !_ng.BuyFSenabled && !_ng.GameConfig.superBuyEnabled);
}

sView.createHistoryPanelView = function () {
	// Create History Panel View
	var historyView = new HistoryPanelView();
	historyView.name = "historyPanelView";
	
	// Add to popup container so it appears on top
	var targetContainer = null;
	if (this.popupContainer) {
		targetContainer = this.popupContainer;
	} else if (coreApp && coreApp.gameView && coreApp.gameView.popupContainer) {
		targetContainer = coreApp.gameView.popupContainer;
	} else {
		return;
	}
	
	targetContainer.addChild(historyView);
	
	// Create and connect controller
	this.historyPanelController = new HistoryPanelController();
	this.historyPanelController.setView(historyView);
	
	// Initialize the view
	historyView.createView();
}

sView.playJarOpenClose = function (actionState, finalState) {
	if (this.historyBase) {
		const state = this.historyBase.state;

		state.setAnimation(0, actionState, false);
		// Add a listener to handle animation completion
		state.addListener({
			complete: (trackEntry) => {
				if (trackEntry.animation.name === actionState) {
					state.setAnimation(0, finalState, true);
				}
			}
		});
	}
}