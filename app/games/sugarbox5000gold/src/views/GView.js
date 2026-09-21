var sView = _ng.SlotView.prototype;


sView.createExtraElements = function () {
	this.ScatterArray = [];
    this.sizeArray = [0,-150,-175,-200,-225,-250,-275];
    this.sizeArrayPor = [-250,-275,-300,-325,-350,-375]
	_mediator.publish("SHOW_TICKER");
    _mediator.subscribe("onGameCreated", this.onGameInitGame.bind(this));
	_mediator.publish("fadeTextsSpinClicked");
	// _mediator.subscribe("BuyRequest",this.BuyRequest.bind(this));
	// _mediator.subscribe("FSend",this.FSend.bind(this));
	// _mediator.subscribe("moveBuyFeature",this.moveBuyFeature.bind(this));
	// _mediator.subscribe("bringBackBuyFeature",this.bringBackBuyFeature.bind(this));
	// _mediator.subscribe("CreateScatterWinAnim",this.CreateScatterWinAnim.bind(this));
	_mediator.subscribe("sliderFalse",this.sliderFalse.bind(this));
    // _mediator.subscribe("ScatterWinAnim",this.ScatterWinAnim.bind(this));
	// _mediator.subscribe("toggleLand",this.toggleLand.bind(this));
	// _mediator.subscribe("_hideAndShowOfTwoXButton",this._hideAndShowOfTwoXButton.bind(this));
	// _mediator.subscribe("setRemainingFSpins",this.setRemainingFSpins.bind(this));

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

// sView.BuyRequest = function(){
// 		// _mediator.publish("createTotalBetSelector");

// 	if(_viewInfoUtil.viewType=="VP"){
// 		_mediator.publish("hideAndShowBuyControlls",false);
// 	}
// 	if(_viewInfoUtil.viewType=="VD"){
// 		// _mediator.publish("ToggleSpin",false);
// 		// _mediator.publish("setSpaceBarEvent", "idle");
// 	}
// 	else if(_viewInfoUtil.viewType=="VP" || _viewInfoUtil.viewType=="VL"){
// 		_mediator.publish("showMobPanel");
// 		_mediator.publish("ToggleSpin",false)
// 		_mediator.publish("ToggleMobPanel",false);
// 	}
// 	_mediator.publish("disableBuyFeature");
// 	_mediator.publish("buyFreeSpinPopup");
// }

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
	
}
sView.playScatterWinTransition = async function () {

 _sndLib.play(_sndLib.sprite.transition);
 return new Promise((resolve) => {
	resolve();
	//ToDo: To add transition...
//   this.scatFillAnim = pixiLib.getElement("Spine", "scatterFill");
//   let entry = this.scatFillAnim.state.setAnimation(0, "landscape", false);
//   this.scatFillAnim.name ="scatterFill";
//   this.scatFillAnim.position.set(_viewInfoUtil.getWindowWidth() / 2, _viewInfoUtil.getWindowHeight() / 2);
//   this.stage.addChild(this.scatFillAnim);
//   entry.listener = {
//    complete: function () {
//     setTimeout(() => {
//      this.stage.removeChild(this.scatFillAnim);
//      resolve();
//     }, 10);
//    }.bind(this)
//   }
 });
}



sView.createTitle = function (){};
