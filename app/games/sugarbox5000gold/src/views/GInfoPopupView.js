var view = InfoPopupView.prototype;

view.addSubscription = function () {
	_mediator.subscribe("showRealityCheckPopup", this.showRealityCheckPopup.bind(this));
	_mediator.subscribe("showFreeSpinAwarded", this.showFreeSpinAwarded.bind(this));
	_mediator.subscribe("showFreeSpinEnded", this.showFreeSpinEnded.bind(this));
	_mediator.subscribe("showSuperMeterPopup", this.showSuperMeterPopup.bind(this));
	_mediator.subscribe(_events.core.onResize, this.onViewResize.bind(this));
	_mediator.subscribe("showBonusAwardedMsg", this.onShowBonusAward.bind(this));
	_mediator.subscribe("showBonusWinMsg", this.onShowBonusWin.bind(this));
	//error messages
	_mediator.subscribe("showErrorMsg", this.onShowErrorMsg.bind(this));
	//Spacebar Events
	_mediator.subscribe("hideInfoPopup", this.hideInfoPopup.bind(this, this.hideInfoEventType, this.hideInfoDelay));
	_mediator.subscribe("onFSContinueClick", this.onFSContinueClick.bind(this));
	_mediator.subscribe("onBonusAwardContinueClick", this.onBonusAwardContinueClick.bind(this));
	_mediator.subscribe("onBonusWinContinueClick", this.onBonusWinContinueClick.bind(this));
	_mediator.subscribe("onFsCloseHandler", this.onFsCloseHandler.bind(this));
	_mediator.subscribe("gotolobby", this.gotoLobby.bind(this));
	_mediator.subscribe("showFreeSpinEndedZeroBalance", this.showFreeSpinEndedZeroBalance.bind(this));
	_mediator.subscribe("buyFreeSpinPopup", this.buyFreeSpinPopup.bind(this));
	_mediator.subscribe("showGambleWindow", this.showGambleWindow.bind(this));
	_mediator.subscribe("buyFreeSuperSpinPopup", this.buyFreeSuperSpinPopup.bind(this));
	_mediator.subscribe("ExtraFSAwardpopup", this.ExtraFSAwardpopup.bind(this));
	_mediator.subscribe("closeBuyFSPopup", this.closeBuyFSPopup.bind(this));
	_mediator.subscribe("spinStart", this.closeBuyFSPopup.bind(this));
	_mediator.subscribe("WinExceededPopup", this.WinExceededPopup.bind(this));
	_mediator.subscribe("resizeBuypopup", this.resizeBuypopup.bind(this));
	_mediator.subscribe("setFsPlayedcnt", this.setFsPlayedcnt.bind(this));
	_mediator.subscribe("updateFreeSpinCost", this.updateFreeSpinCost.bind(this));
	_mediator.subscribe("updateSuperSpinCost", this.updateSuperSpinCost.bind(this));
	//bet adjustment 
	_mediator.subscribe("createTotalBetSelector", this.createTotalBetSelector.bind(this));
	_mediator.subscribe("updateSelectorContainerBet", this.updateSelectorContainerBet.bind(this));
	_mediator.subscribe("selectorPlusInteraction", this.selectorPlusInteraction.bind(this));
	_mediator.subscribe("selectorMinusInteraction", this.selectorMinusInteraction.bind(this));
	_mediator.subscribe("countExitForCongratulation", this.CountExit.bind(this));
	/*for quick spin info*/
	_mediator.subscribe("quickSpinInfoPopup", this.quickSpinInfoPopup.bind(this));
	_mediator.subscribe("closeQuickSpinInfo", this.closeQuickSpinInfo.bind(this));
	_mediator.subscribe("showHistoryModePopup", this.showHistoryModePopup.bind(this));
	//FOR PFS

	this.exceed = false;
	// this.onViewResize();

};
view.showFreeSpinAwarded = function (numSpins, nextAction) {
	this.isShowing_popup = true;

	_mediator.publish("CreateScatterWinAnim");
	setTimeout(() => {
		// _mediator.publish("moveBuyFeature");
		// if (_ng.isQuickSpinActive == true) {
		//     _ng.turboActiveByUser = true;
		// }
		// _mediator.publish("onQuickSpinOff");

		this.nextAction = nextAction;

		var fsPopupConfig = _ng.GameConfig.infoPopupView.freeSpinPopup;
		var numSpins = coreApp.gameModel.getTotalFreeSpins();
		// var numSpins = (Number.isInteger(parseInt(numSpins))) ? numSpins : coreApp.gameModel.getTotalFSTriggered();

		this.grayBg = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
		this.grayBg.alpha = 0.2;
		this.grayBg.interactive = true;
		this.grayBg.buttonMode = true;
		coreApp.gameView.decoratorContainer.addChildAt(this.grayBg, 0);

		this.popupParent = pixiLib.getElement();
		this.addChild(this.popupParent);


		var congTxt = pixiLib.getElement("Spine", "congratulation");
		this.popupParent.addChild(congTxt);
		pixiLib.setProperties(congTxt, fsPopupConfig.descriptionImg.props);
		congTxt.state.setAnimation(0, '2loop_freespins_shower', true);
		congTxt.name = "free spin awarded";
		

		this.numSpinsTxt = pixiLib.getElement("Text", fsPopupConfig.fsValue.textStyle);
		this.popupParent.addChild(this.numSpinsTxt);
		pixiLib.setProperties(this.numSpinsTxt, fsPopupConfig.fsValue.props);
		pixiLib.setText(this.numSpinsTxt, numSpins);

		
		var continueBtn = pixiLib.getButton(fsPopupConfig.continueButton.bgImage);
		this.popupParent.addChild(continueBtn);
		pixiLib.setProperties(continueBtn, fsPopupConfig.continueButton.props);

		var continueText = pixiLib.getElement("Text", fsPopupConfig.continueText.textStyle);
		continueBtn.addChild(continueText);
		pixiLib.setProperties(continueText, fsPopupConfig.continueText.props);
		pixiLib.setText(continueText, gameLiterals.continueText);



		setTimeout(function () {
			//Adding timeout so popup will be shown fully then enable spacebar
			_mediator.publish("setSpaceBarEvent", "onFSContinueClick");
		}, 1000);
		pixiLib.addEvent(continueBtn,()=>{
			this.grayBg.interactive = false;
			this.grayBg.buttonMode = false;
			this.onFSContinueClick();
		})
		pixiLib.addEvent(this.grayBg,()=>{
			this.grayBg.interactive = false;
			this.grayBg.buttonMode = false;
			this.onFSContinueClick();
		})
		_ngFluid.call(this, fsPopupConfig.params);

		this.onViewResize();
		this.showInfoPopup();
		coreApp.CURRENTACTIVEPOPUP = "congratulations_awarded";

		//skipping the popup
		if (_ng.autoPlayBeforeFg == true) {
			pixiLib.setInteraction(continueBtn, false);
			this.grayBg.interactive = false;
			this.grayBg.buttonMode = false;
			setTimeout(function () {
				_mediator.publish("onFSContinueClick");
			}, 1000);
		}

		_sndLib.play(_sndLib.sprite.fsAwardPopup);

	}, 2300);

};

view.hideInfoPopup = function (eventToPublish, delay) {
	_sndLib.play(_sndLib.sprite.hidePopup);
	var delay = 0 || delay;
	if (this.grayBg) {
		TweenMax.to(this.grayBg, 0.3, { alpha: 0 });
	}
	if (this.popupParent) {
		TweenMax.to(this.popupParent.scale, 0.3, {
			x: 0, y: 0,
			onComplete: function () {

				if (this.popupParent) {
					this.popupParent.destroy();
					delete this.popupParent;
				}

				if (this.grayBg) {
					this.grayBg.destroy();
					delete this.grayBg;
				}
				if (this.hideInfoEventType) {
					setTimeout(function () {
						_mediator.publish(this.hideInfoEventType);
					}.bind(this), this.hideInfoDelay);
				}
			}.bind(this)
		})
	}
};
view.counterWinAmount = function (th, startValue, obj, time) {
	const urlParams = new URLSearchParams(window.location.search);
	const roundId = urlParams.get('round_id');
	var endValue = (coreApp.gameModel.getTotalFSWin() / 100); //startValue + bonusValue;
	var initValue = startValue;
	var tempdif = endValue - initValue;
	var noOfSteps = time / 50;
	//endValue = parseFloat(endValue);
	var incrementer = tempdif / noOfSteps;
	var currentStep = 0;
	_sndLib.play(_sndLib.sprite.counterBigWinLoop);
	this.interVal = setInterval(function () {
		currentStep++;
		if (currentStep > noOfSteps) {
			clearInterval(this.interVal);
			_sndLib.stop(_sndLib.sprite.counterBigWinLoop);
			obj.text = pixiLib.getFormattedAmount(endValue * 100);

			if (roundId) {
				this.coinFlipReplaySimulation();
			}
		}
		else {
			var BoundedVal = (initValue + (currentStep * incrementer));
			obj.text = pixiLib.getFormattedAmount(BoundedVal * 100); //Math.round(initValue + (currentStep * incrementer));//
		}
	}.bind(this), 50);
};
view.showFreeSpinEnded = function () {
	coreApp.CURRENTACTIVEPOPUP = "congratulations_rewarded";
	// Check if round_id exists in URL params to determine if it's history/replay mode
	const urlParams = new URLSearchParams(window.location.search);
	const roundId = urlParams.get('round_id');

	/*reseting after free spin ended*/
	if (_ng.BuyFSenabled === true) {
		_ng.BuyFSenabled = false
	}
	if (_ng.GameConfig.superBuyEnabled === true) {
		_ng.GameConfig.superBuyEnabled = false
	}
	_mediator.publish("showNewMessage", "");
	_sndLib.play(_sndLib.sprite.fsWinPopup);
	var winAmount = coreApp.gameModel.getTotalFSWin();
	if ((this.exceed == false) && (Number(coreApp.gameModel.getTotalFSWin())) >= coreApp.gameModel.spinData.max_win_cap * (Number(coreApp.gameModel.getTotalBet()))) {
		console.log("win exceeded");
		this.WinExceededPopup((Number(coreApp.gameModel.getTotalBet())));
	}
	else {
		if (this.exceed) { this.exceed = false; }
		var fsPopupConfig = _ng.GameConfig.infoPopupView.freeSpinEndPopup;
		this.grayBg = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
		this.grayBg.alpha = 0.6;
		this.grayBg.interactive = true;
		this.grayBg.buttonMode = true;
		// pixiLib.addEvent(this.grayBg, this.onCollectButtonClick.bind(this,"collect"));
		coreApp.gameView.decoratorContainer.addChildAt(this.grayBg, 0);

		this.popupParent = pixiLib.getElement();
		this.addChild(this.popupParent);

		var congTxt = pixiLib.getElement("Spine", "congratulation");
		this.popupParent.addChild(congTxt);
		pixiLib.setProperties(congTxt, fsPopupConfig.descriptionImg.props);
		congTxt.state.setAnimation(0, '02loop_amount_shower', true);


		this.winAmountTxt = pixiLib.getElement("Text", fsPopupConfig.fsWinValue.textStyle);
		this.popupParent.addChild(this.winAmountTxt);
		pixiLib.setProperties(this.winAmountTxt, fsPopupConfig.fsWinValue.props);
		pixiLib.setText(this.winAmountTxt, pixiLib.getFormattedAmount(winAmount));

		var fsStyle = {
			"dropShadow": true,
			"dropShadowAlpha": 0.4,
			"dropShadowAngle": 0,
			"dropShadowBlur": 5,
			"dropShadowColor": "#ffffff",
			"dropShadowDistance": 0,
			"fill": [
				"#ffffff",
				"#f8e1b9"
			],
			"fontFamily": "Baloo-Regular",
			"fontSize": 35,
			// "fontWeight": "bolder",
			"lineJoin": "round",
			"stroke": "#ff7300",
			"strokeThickness": 10,
			"align": "center",
		}

		var inFreeSpin = pixiLib.getElement("Text", fsStyle);
		this.popupParent.addChild(inFreeSpin);
		inFreeSpin.anchor.set(0.5);
		inFreeSpin.position.set(20, 43);
		inFreeSpin.text = gameLiterals.inFreeSpinText.replace("XX", this.val);
		this.counterWinAmount(this, 0, this.winAmountTxt, 3000);

		this.endcontinueBtn = pixiLib.getButton(fsPopupConfig.continueButton.bgImage);
		this.popupParent.addChild(this.endcontinueBtn);
		pixiLib.setProperties(this.endcontinueBtn, fsPopupConfig.continueButton.props);

		//Collect text
		var collectText = pixiLib.getElement("Text", fsPopupConfig.collectText.textStyle);
		this.endcontinueBtn.addChild(collectText);
		pixiLib.setProperties(collectText, fsPopupConfig.collectText.props);
		pixiLib.setText(collectText, gameLiterals.collectBtnText);

		this.doubleRewardBtn = pixiLib.getButton(fsPopupConfig.doubleButton.bgImage);
		this.popupParent.addChild(this.doubleRewardBtn);
		pixiLib.setProperties(this.doubleRewardBtn, fsPopupConfig.doubleButton.props);

		if (roundId) {
			pixiLib.setInteraction(this.doubleRewardBtn, false);
			pixiLib.setInteraction(this.endcontinueBtn, false);
		}

		var rewardText = pixiLib.getElement("Text", fsPopupConfig.rewardText.textStyle);
		this.popupParent.addChild(rewardText);
		pixiLib.setProperties(rewardText, fsPopupConfig.rewardText.props);
		pixiLib.setText(rewardText, gameLiterals.doubleYourRewardText);

		// setTimeout(function () {
		// 	//Adding timeout so popup will be shown fully then enable spacebar
		// 	// _mediator.publish("setSpaceBarEvent", "onFsCloseHandler");
		// 	this.popupReadyToClose = true;
		// }.bind(this), 3000);
		pixiLib.addEvent(this.endcontinueBtn, this.onCollectButtonClick.bind(this,"collect"));
		pixiLib.addEvent(this.doubleRewardBtn, this.on2XBtnClick.bind(this,"gamble"));
		_ngFluid.call(this, fsPopupConfig.params);

		this.onViewResize();
		this.showInfoPopup();

		/*skiping rewarded popup*/
		// this.skipFreeSpinRewarded();
	}
};

view.on2XBtnClick = function (action){
	action = action || "gamble"; //Default will be gmble...
	this.CountExit(action);
}
view.onCollectButtonClick = function (action){

	_sndLib.stop(_sndLib.sprite.counterBigWinLoop);
	var winAmount = coreApp.gameModel.getTotalFSWin();
	if (this.interVal) {
		if (this.winAmountTxt.text === pixiLib.getFormattedAmount(winAmount)) { // if counting win amount is completed, close popup	
			this.doubleRewardBtn.interactive = false;
			this.endcontinueBtn.interactive = false; /* Prevent multiple click */

			clearInterval(this.interVal);
			_mediator.publish("sendCoinFlipReq", action, "empty", () => {

				this.onFsCloseHandler(action);
			});
		}
		else {
			clearInterval(this.interVal);
			pixiLib.setText(this.winAmountTxt, pixiLib.getFormattedAmount(winAmount));
		}
	}
		
}
view.CountExit = function (eventAction) {
	_sndLib.stop(_sndLib.sprite.counterBigWinLoop);
		var winAmount = coreApp.gameModel.getTotalFSWin();
		if (this.interVal) {
			if (this.winAmountTxt.text === pixiLib.getFormattedAmount(winAmount)) { // if counting win amount is completed, close popup
				this.doubleRewardBtn.interactive = false;
			    this.endcontinueBtn.interactive = false;/* Prevent multiple click */

				clearInterval(this.interVal);
				this.onFsCloseHandler(eventAction);
			}
			else {
				clearInterval(this.interVal);
				pixiLib.setText(this.winAmountTxt, pixiLib.getFormattedAmount(winAmount));
			}
		}
}

view.onFSContinueClick = function () {
	coreApp.CURRENTACTIVEPOPUP = "";
	_mediator.publish("ToggleTurbo", false);
	_mediator.publish("_hideAndShowOfTwoXButton", false);
	var fsCount = coreApp.gameModel.getTotalFreeSpins();
	if (this.nextAction == "closeBonus") {
		_mediator.publish("closeBonus");
	}
	//If Freespins are Re-Triggered, don't show starting Freespins message in Ticker
	if (coreApp.gameModel.getTotalFSTriggered() == coreApp.gameModel.getTotalFreeSpins()) {
		_mediator.publish("showNewMessage", "Starting Freespins");
		_mediator.publish("SHOW_TICKER");
	}
	_mediator.publish('showMultipler', 0);
	this.hideInfoEventType = "startFreeSpins";
	this.hideInfoDelay = 500;
	this.hideInfoPopup("startFreeSpins", 500);
};
view.onFsCloseHandler = function (eventType) {
	coreApp.CURRENTACTIVEPOPUP = "";
	_mediator.publish('showMultipler', 0);
	_mediator.publish("ToggleTurbo", true);
	// _mediator.publish("_hideAndShowOfTwoXButton", true);
	_mediator.publish("enableBuyFeature");
	_mediator.publish("bringspinbtnback");
	_mediator.publish("UpdateWin", "");
	_mediator.publish(_events.slot.updateBalance);
	_mediator.publish("toggleTumbleBox", false);
	_mediator.publish("setSpaceBarEvent", "idle");
	this.hideInfoEventType =(eventType == "collect") ? "onFSEndShown" : "showGambleWindow";
	if(eventType == "onBackButtonClicked")
		this.hideInfoEventType = "showFreeSpinEnded"
	this.hideInfoDelay = 0;
	_sndLib.play(_sndLib.sprite.hidePopup);
	this.hideInfoPopup("onFSEndShown");
	_mediator.publish("SHOW_IDLE_MESSAGE");

	if(eventType == 'collect') {
		if(coreApp.gameModel.getIsPFSEnded()) {
			_mediator.publish("promoFreeSpinRewarded");
		}
	}
}

/* Latest code  */
view.buyFreeSpinPopup = function () {

	var buyfsConfig =  _ng.GameConfig.infoPopupView.BuyFSPopup

	this.grayBg = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
	this.grayBg.alpha = 0.6;
	this.grayBg.interactive = true;
	coreApp.gameView.popupContainer.addChildAt(this.grayBg, 0);

	this.popupParent = pixiLib.getElement();
	this.popupParent.name = "popupParent";
	this.addChild(this.popupParent);

	var backgroundBase = pixiLib.getElement("Sprite", buyfsConfig.background.bgImage);
	backgroundBase.name = "backgroundBase";
	this.popupParent.addChild(backgroundBase);
    pixiLib.setProperties(backgroundBase, buyfsConfig.background.props);

	this.freespinCost = pixiLib.getFormattedAmount(coreApp.gameModel.panelModel.totalBet * 100);

	this.AreYouSure = pixiLib.getElement("Text", buyfsConfig.descriptionText.textStyle);
	this.AreYouSure.name = "AreYouSure";
	pixiLib.setProperties(this.AreYouSure, buyfsConfig.descriptionText.props);

	let updatedText = gameLiterals.areusure.replace("XZ", "10").replace("XY", this.freespinCost);
	pixiLib.setText(this.AreYouSure, updatedText);
	this.popupParent.addChild(this.AreYouSure);

	this.buyButton = pixiLib.getButton(buyfsConfig.confirmButton.bgImage);
	this.buyButton.name = "buyButton";
	pixiLib.setProperties(this.buyButton, buyfsConfig.confirmButton.props);
	this.popupParent.addChild(this.buyButton);
	pixiLib.addEvent(this.buyButton, this.onBuyFeatureClick.bind(this));

	this.cancelFsButton = pixiLib.getButton("closeSuperWin");
	this.cancelFsButton.name = "cancelFsButton";
	pixiLib.setProperties(this.cancelFsButton, buyfsConfig.cancelButton.props);
	this.popupParent.addChild(this.cancelFsButton);
	pixiLib.addEvent(this.cancelFsButton, this.buyFeatureCancelClicked.bind(this));

	pixiLib.addEvent(this.grayBg, this.buyFeatureCancelClicked.bind(this));

	 _ngFluid.call(this, buyfsConfig.params);
	this.onViewResize();
	this.showInfoPopup();
	this.showBuyPopupAnimation();

}
view.buyFreeSuperSpinPopup = function () {
	var buysuperConfig =  _ng.GameConfig.infoPopupView.superBuyFSPopup

	this.grayBg = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
	this.grayBg.alpha = 0.6;
	this.grayBg.interactive = true;
	coreApp.gameView.popupContainer.addChildAt(this.grayBg, 0);

	this.popupParent = pixiLib.getElement();
	this.popupParent.name = "popupParent";
	this.addChild(this.popupParent);

	var backgroundBase = pixiLib.getElement("Sprite", buysuperConfig.background.bgImage);
	backgroundBase.name = "backgroundBase";
	this.popupParent.addChild(backgroundBase);
    pixiLib.setProperties(backgroundBase, buysuperConfig.background.props);

	this.superBuyCost = pixiLib.getFormattedAmount(coreApp.gameModel.panelModel.totalBet * coreApp.gameModel.spinData.superBuyfg);

	this.AreYouSure = pixiLib.getElement("Text", buysuperConfig.descriptionText.textStyle);
	this.AreYouSure.name = "AreYouSure";
	pixiLib.setProperties(this.AreYouSure, buysuperConfig.descriptionText.props);

	let updatedText = gameLiterals.superDescription.replace("XW", "10").replace("XY", "20X").replace("XZ", this.superBuyCost);
	pixiLib.setText(this.AreYouSure, updatedText);
	this.popupParent.addChild(this.AreYouSure);

	
	this.buyButton = pixiLib.getButton(buysuperConfig.confirmButton.bgImage);
	this.buyButton.name = "buyButton";
	pixiLib.setProperties(this.buyButton, buysuperConfig.confirmButton.props);
	this.popupParent.addChild(this.buyButton);

	pixiLib.addEvent(this.buyButton, this.superBuyFeatureClick.bind(this));

	this.cancelFsButton = pixiLib.getButton("closeSuperWin");
	this.cancelFsButton.name = "cancelFsButton";
	pixiLib.setProperties(this.cancelFsButton, buysuperConfig.cancelButton.props);
	this.popupParent.addChild(this.cancelFsButton);

	pixiLib.addEvent(this.cancelFsButton, this.superBuyCancelClicked.bind(this));
	pixiLib.addEvent(this.grayBg, this.superBuyCancelClicked.bind(this));

	_ngFluid.call(this, buysuperConfig.params);

	this.onViewResize();
	this.showInfoPopup();
	this.showBuyPopupAnimation();

}

view.resizeBuypopup = function () {
	//Add positions here , for rotating vp to vl or vl to vp
}
view.closeBuyFSPopup = function () {
	if (this.BuypopupCon) {
		this.BuypopupCon.visible = false;
		this.BuypopupPanel.visible = false;
		this.grayBgbuy.visible = false;
	}
}

view.WinExceededPopup = function (totalBet) {

	if (this.winPopupPanel) {
		this.winPopupCon.visible = true;
		this.winPopupPanel.visible = true;
		this.grayWinPop.visible = true;
	}
	else {
		this.grayWinPop = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
		this.grayWinPop.alpha = 0.6;
		this.grayWinPop.interactive = true;
		this.grayWinPop.buttonMode = true;
		this.grayWinPop.scale.set(10);
		this.grayWinPop.x = -1000
		this.grayWinPop.y = -1000
		this.addChild(this.grayWinPop);

		this.winPopupPanel = pixiLib.getElement("Sprite", "superWinPopupBase");
		this.addChild(this.winPopupPanel);
		this.winPopupPanel.name = "WinPanel";
		this.winPopupPanel.anchor.set(0.5);
		this.winPopupPanel.position.set(0, 0);
		this.winPopupPanel.scale.set(0.8, 0.8)

		this.winPopupCon = pixiLib.getContainer();
		this.winPopupCon.name = "winPopupCon"
		this.winPopupCon.y = 302;
		this.addChild(this.winPopupCon);

		var style = {
			dropShadow: false,
			dropShadowColor: "#ef0aff",
			fill: "#ffffff",
			align: "center",
			fontFamily: "Baloo-Regular",
			// fontFamily: "Arial",
			fontSize: 45,
			// fontWeight: "bold",
			stroke: "#ef0aff",
			strokeThickness: 6,
			maxWidth: 620,
		}
		this.winExceed = pixiLib.getElement("Text", style);
		this.winExceed.anchor.set(0.5);
		this.winExceed.position.set(0, -390);

		let updatedText = gameLiterals.WinExceed_description.replace("XZ", coreApp.gameModel.spinData.max_win_cap + "X");
		pixiLib.setText(this.winExceed, updatedText);
		this.winPopupCon.addChild(this.winExceed);

		this.winAmountTxt = pixiLib.getElement("Text", style);
		this.winAmountTxt.anchor.set(0.5);
		this.winAmountTxt.position.set(0, -210);

		let updatedText1 = gameLiterals.WinExceedAmt.replace("XP", (pixiLib.getFormattedAmount(coreApp.gameModel.spinData.max_win_cap * totalBet)));
		pixiLib.setText(this.winAmountTxt, updatedText1);
		this.winPopupCon.addChild(this.winAmountTxt);

		if (coreApp.gameModel.obj.current_round.spin_type == "freespin") {
			pixiLib.addEvent(this.grayWinPop, function () {
				this.removeChild(this.winPopupCon);
				this.removeChild(this.winPopupPanel);
				this.removeChild(this.grayWinPop);
				this.exceed = true;
				this.showFreeSpinEnded();
			}.bind(this));
		}
		else {
			pixiLib.addEvent(this.grayWinPop, function () {

				// this.winPopupCon.visible = false;
				// this.winPopupPanel.visible = false;
				// this.grayWinPop.visible = false;
			}.bind(this));

		}
	}
}
view.BuyServerReq = function (type) {

	switch (type) {
		case "BuyFreeSpinContent":
			_ng.BuyFSenabled = true;
			_mediator.publish("callBuyFreeSpinRequest");
			break;
		case "SuperBuyContent":
			_ng.GameConfig.superBuyEnabled = true;
			_mediator.publish("callSuperBuyRequest");
			break;
		default:
			break;
	}
	_mediator.publish("spinStart");
}

view.ExtraFSAwardpopup = function (callback) {

	var extraFsConfig = _ng.GameConfig.infoPopupView.extraFsPopup;

	this.popupParent = pixiLib.getElement();
	this.addChild(this.popupParent);

	var backgroundScreen = pixiLib.getElement("Sprite", extraFsConfig.background.bgImage);
	backgroundScreen.name = "backgroundScreen";
  	this.popupParent.addChild(backgroundScreen);
  	pixiLib.setProperties(backgroundScreen, extraFsConfig.background.props);

	var descriptionText = pixiLib.getElement("Text", extraFsConfig.descriptionText.textStyle);
	descriptionText.name = "descriptionText";
	this.popupParent.addChild(descriptionText);
	pixiLib.setProperties(descriptionText, extraFsConfig.descriptionText.props);

	var fsCount = coreApp.gameModel.obj.current_round.post_matrix_info.extra_fs;

	pixiLib.setText(descriptionText, "+" + fsCount + " " + gameLiterals.extraFreeSpinText);

	_ngFluid.call(this, extraFsConfig.params);

	const onComplete = () => {
		if (this.popupParent) {
			this.removeChild(this.popupParent);
			this.popupParent = null;
			_sndLib.stop(_sndLib.sprite.extra_fs);
			if (typeof callback === 'function') {
				callback();
			}
		}
	};
	setTimeout(onComplete, 3000); 
};

view.setFsPlayedcnt = function (value) {
	this.val = value;
	// if(this.TotalFSCount){
	//     pixiLib.setText(this.TotalFSCount, val);
	// }
}

//bet changing option for buy feature
view.createTotalBetSelector = function () {

	this.selectorContainer = pixiLib.getContainer();
	this.selectorContainer.name = "Panel Bet selectorContainer";
	this.addChild(this.selectorContainer);
	this.onSelectorResize();

	var style = {
		// "fontStyle": "bold",
		"fontSize": 25,
		"fontFamily": "Baloo-Regular",
		"lineJoin": "round",
		"fill": "#00C2FF",
		"stroke": '#391400',
		"strokeThickness": 9
	}
	this.betText = pixiLib.getElement("Text", style);
	this.selectorContainer.addChild(this.betText);
	this.betText.anchor.set(0.5);
	this.betText.position.set(0, -34);
	pixiLib.setText(this.betText, gameLiterals.totalbet);


	this.minusButton = pixiLib.getButton("betMinus");
	this.minusButton.anchor.set(0.5);
	this.minusButton.position.set(-90, 0);
	this.minusButton.scale.set(0.4);
	this.selectorContainer.addChild(this.minusButton);

	pixiLib.addEvent(this.minusButton, this.onMinusClick.bind(this));

	this.betBase = pixiLib.getElement("Sprite", "betValueBase");
	this.betBase.anchor.set(0.5);
	this.betBase.position.set(0, 0);
	this.betBase.scale.set(0.9);
	this.selectorContainer.addChild(this.betBase);

	var style1 = {
		"fill": "0xffffff",
		"fontSize": 30,
		"fontFamily": "Baloo-Regular",
	}

	this.selectorValue = pixiLib.getElement("Text", style1);
	this.betBase.addChild(this.selectorValue);
	this.selectorValue.anchor.set(0.5);
	this.selectorValue.position.set(0, 0);
	if (this.selectorValue)
		pixiLib.setText(this.selectorValue, coreApp.gameModel.getTotalBet());
	else
		pixiLib.setText(this.selectorValue, "1");

	this.plusButton = pixiLib.getButton("betPlus");
	this.plusButton.name = "plusButton";
	this.plusButton.anchor.set(0.5);
	this.plusButton.position.set(90, 0);
	this.plusButton.scale.set(0.4);
	this.selectorContainer.addChild(this.plusButton);
	pixiLib.setInteraction(this.plusButton, true);

	pixiLib.addEvent(this.plusButton, this.onPlusClick.bind(this));
	_mediator.publish("updateTotalBet");

}

view.updateSelectorContainerBet = function (value) {
	var betval = pixiLib.getFormattedAmount(value);
	if (this.selectorValue)
		pixiLib.setText(this.selectorValue, betval);
}

view.onPlusClick = function () {
	_mediator.publish("setIncrement");
	_mediator.publish("ToggleSpin", false);
}

view.onMinusClick = function () {
	_mediator.publish("setDecrement");
	_mediator.publish("ToggleSpin", false);
}

view.removeSelector = function () {
	if (this.selectorContainer.parent) {
		this.selectorContainer.parent.removeChild(this.selectorContainer);
	}
}

view.selectorPlusInteraction = function (value) {
	if (this.plusButton)
		pixiLib.setInteraction(this.plusButton, value);
}

view.selectorMinusInteraction = function (value) {
	if (this.minusButton)
		pixiLib.setInteraction(this.minusButton, value);
}

view.onSelectorResize = function () {
	if (this.selectorContainer) {
		if (_viewInfoUtil.viewType == "VL") {
			this.selectorContainer.position.set(0, 320);
			this.selectorContainer.scale.set(1.2);
			_mediator.publish("SHOW_TICKER_MESSAGE", "");
		}
		else if (_viewInfoUtil.viewType == "VD") {
			this.selectorContainer.position.set(0, 325);
			this.selectorContainer.scale.set(1);
			_mediator.publish("SHOW_TICKER_MESSAGE", "");
		}
		else {
			this.selectorContainer.position.set(0, 600);
			// this.selectorContainer.x = 0; this.selectorContainer.y = coreApp.gameView.panelContainer.children[12].y - 25;
			this.selectorContainer.scale.set(1.5);
			_mediator.publish("SHOW_TICKER_MESSAGE", "");
		}
	}
}

//for overwriting info popup y position

view.createRealityCheckPopup = function () {
	var realityCheckConfig = _ng.GameConfig.realityCheck;

	this.overlay = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
	this.overlay.alpha = 0.001;
	this.overlay.interactive = true;
	coreApp.gameView.popupContainer.addChildAt(this.overlay, 0);

	this.container = pixiLib.getElement();
	this.addChild(this.container);

	// var bg = pixiLib.getShape("rect", { w: 640, h: 300 });
	var bg = pixiLib.getElement("Sprite", realityCheckConfig.background.bgImage);
	this.container.addChild(bg);
	pixiLib.setProperties(bg, realityCheckConfig.background.props);

	this.container.contentTxt = pixiLib.getElement("Text", realityCheckConfig.contentTxt.textStyle);
	this.container.addChild(this.container.contentTxt);
	pixiLib.setProperties(this.container.contentTxt, realityCheckConfig.contentTxt.props);

	this.container.totalBetTxt = pixiLib.getElement("Text", realityCheckConfig.totalBetTxt.textStyle);
	this.container.addChild(this.container.totalBetTxt);
	pixiLib.setProperties(this.container.totalBetTxt, realityCheckConfig.totalBetTxt.props);

	this.container.totalWinTxt = pixiLib.getElement("Text", realityCheckConfig.totalWinTxt.textStyle);
	this.container.addChild(this.container.totalWinTxt);
	pixiLib.setProperties(this.container.totalWinTxt, realityCheckConfig.totalWinTxt.props);

	var closeBtn = pixiLib.getButton(realityCheckConfig.closeBtn.bgImage, realityCheckConfig.closeBtn.options);
	this.container.addChild(closeBtn);
	pixiLib.setProperties(closeBtn, realityCheckConfig.closeBtn.props);

	var continueBtn = pixiLib.getButton(realityCheckConfig.continueBtn.bgImage, realityCheckConfig.continueBtn.options);
	this.container.addChild(continueBtn);
	pixiLib.setProperties(continueBtn, realityCheckConfig.continueBtn.props);

	pixiLib.addEvent(closeBtn, this.onRCCloseHandler.bind(this));
	pixiLib.addEvent(continueBtn, this.onRCContinueHandler.bind(this));
	_ngFluid.call(this, realityCheckConfig.params);

	this.container.visible = false;
	this.overlay.visible = false;
	this.y = 330;

};

view.startRealityInterval = function () {
	if (commonConfig.noRCPPopupMobile && _viewInfoUtil.device === "Mobile") {
		return;
	}
	if (commonConfig.noRCPPopupDesktop && _viewInfoUtil.device === "Desktop") {
		return;
	}
	this.realityInterval = setInterval(function () {
		this.rcpTimeElapsed = this.rcpTimeout;
		if (this.rcpIsFirstDisplay) {
			this.rcTotalTime = this.rcpTimeout;
			var mText = pixiLib.getLiteralText(_ng.GameConfig.realityCheck.contentTxt.text);
			pixiLib.setText(this.container.contentTxt, mText.replace("%A1%", parseFloat(this.rcTotalTime.toFixed(2))));
			setInterval(function () {
				this.rcTotalTime++;
				var mText = pixiLib.getLiteralText(_ng.GameConfig.realityCheck.contentTxt.text);
				pixiLib.setText(this.container.contentTxt, mText.replace("%A1%", parseFloat(this.rcTotalTime.toFixed(2))));
			}.bind(this), 1 * 60000);
		}
		_mediator.publish("showRealityCheckPopup");
		this.rcpIsFirstDisplay = false;
	}.bind(this), this.rcpTimeElapsed * 60000);

};

view.showRealityCheckPopup = function () {

	if (!_ng.GameConfig.realityCheck.isRealiyCheck) {
		return;
	}
	coreApp.gameModel.isRealityCheckActive = true;
	clearInterval(this.realityInterval);
	this.onViewResize();
	if (!this.container.visible) {
		this.showPopup();
		var mText = pixiLib.getLiteralText(_ng.GameConfig.realityCheck.totalBetTxt.text);
		if (mText.indexOf("%A1%") == -1) mText += " %A1%";
		var lossAmount = (coreApp.gameModel.getAllTotalBet() - coreApp.gameModel.getAllTotalWin())

		lossAmount = lossAmount < 0 ? 0 : lossAmount;

		pixiLib.setText(this.container.totalBetTxt, mText.replace("%A1%", pixiLib.getFormattedAmount(lossAmount)));

		mText = pixiLib.getLiteralText(_ng.GameConfig.realityCheck.totalWinTxt.text);
		if (mText.indexOf("%A1%") == -1) mText += " %A1%";
		pixiLib.setText(this.container.totalWinTxt, mText.replace("%A1%", pixiLib.getFormattedAmount(coreApp.gameModel.getAllTotalWin())));
	}
};


view.onViewResize = function () {
	// console.log("🔄 [GInfoPopupView] onViewResize called - handling orientation change");
	if(this.backBtn){
		var gambleConfig = _ng.GameConfig.infoPopupView.gamblePopup;
		pixiLib.setProperties(this.backBtn, gambleConfig.backButton.props[_viewInfoUtil.viewType]);
	}

	// Update grayBg size if it exists (for congratulations popup and other popups)
	if (this.grayBg) {
		const newWidth = _viewInfoUtil.getWindowWidth();
		const newHeight = _viewInfoUtil.getWindowHeight();
		this.grayBg.width = newWidth;
		this.grayBg.height = newHeight;
		if (this.setSize) {
			this.setSize(0, 0);
		}
	}

	// Update mobile history mode popup if it's showing
	if (this.historyModePopupContainer && this.historyModePopupContainer.visible) {
		// console.log("🔄 [GInfoPopupView] Updating mobile history mode popup on resize");

		const actualWindowWidth = window.innerWidth || 375;
		const actualWindowHeight = window.innerHeight || 667;
		const isSmallScreen = actualWindowWidth <= 768;
		const isPortraitLayout = actualWindowWidth <= actualWindowHeight && isSmallScreen;

		// Update overlay size using stored reference
		if (this.historyModePopupOverlay && this.historyModePopupOverlay.width !== undefined) {
			this.historyModePopupOverlay.width = actualWindowWidth;
			this.historyModePopupOverlay.height = actualWindowHeight;
		} else if (this.historyModePopupContainer.children.length > 0) {
			// Fallback: use first child if reference not available
			const overlay = this.historyModePopupContainer.children[0];
			if (overlay && overlay.width !== undefined) {
				overlay.width = actualWindowWidth;
				overlay.height = actualWindowHeight;
			}
		}

		// Update content container position (centered) using stored reference
		if (this.historyModePopupContentContainer) {
			this.historyModePopupContentContainer.x = actualWindowWidth / 2;
			this.historyModePopupContentContainer.y = actualWindowHeight / 2;
		} else if (this.historyModePopupContainer.children.length > 1) {
			// Fallback: use second child if reference not available
			const contentContainer = this.historyModePopupContainer.children[1];
			if (contentContainer) {
				contentContainer.x = actualWindowWidth / 2;
				contentContainer.y = actualWindowHeight / 2;
			}
		}

		// console.log("🔄 [GInfoPopupView] Mobile history popup updated:", {
		// 	width: actualWindowWidth,
		// 	height: actualWindowHeight,
		// 	isPortrait: isPortraitLayout,
		// 	viewType: _viewInfoUtil ? _viewInfoUtil.viewType : "VD",
		// 	orientation: _viewInfoUtil ? _viewInfoUtil.orientation : "unknown"
		// });
	}

	// Update overlay for other popups (reality check, etc.)
	if (this.overlay) {
		this.overlay.width = _viewInfoUtil.getWindowWidth();
		this.overlay.height = _viewInfoUtil.getWindowHeight();
		if (this.setSize) {
			this.setSize(0, 0);
		}
	}
	this.onSelectorResize();
	// console.log("🔄 [GInfoPopupView] onViewResize completed - viewType:", _viewInfoUtil ? _viewInfoUtil.viewType : "VD", "orientation:", _viewInfoUtil ? _viewInfoUtil.orientation : "unknown");
};
view.returnPopupStatus = function () {
	return this.BuypopupPanel;
}


/*for skipping free spin rewarded popup if autoplay is enabled
After free game is finished
*/
view.skipFreeSpinRewarded = function () {
	if (_ng.autoPlayBeforeFg == true) {
		if (this.endcontinueBtn) {
			pixiLib.setInteraction(this.endcontinueBtn, false);
		}
		if (this.grayBg) {
			this.grayBg.interactive = false;
			this.grayBg.buttonMode = false;
		}
		_mediator.publish("continueAutoSpin");
		_mediator.publish("showAutoStopBtn");
	}
}
view.updateFreeSpinCost = function (Updatevalue) {
	if (!this.AreYouSure)
		return;
	let updatedText = this.AreYouSure.text.replace(this.freespinCost, pixiLib.getFormattedAmount(Updatevalue * coreApp.gameModel.spinData.buyfg));
	pixiLib.setText(this.AreYouSure, updatedText);
	this.freespinCost = pixiLib.getFormattedAmount(Updatevalue * coreApp.gameModel.spinData.buyfg);
}
view.updateSuperSpinCost = function (Updatevalue) {
	if (!this.AreYouSure)
		return;
	let updatedText = this.AreYouSure.text.replace(this.superBuyCost, pixiLib.getFormattedAmount(Updatevalue * coreApp.gameModel.spinData.superBuyfg));
	pixiLib.setText(this.AreYouSure, updatedText);
	this.superBuyCost = pixiLib.getFormattedAmount(Updatevalue * coreApp.gameModel.spinData.superBuyfg);
}

/*
this popup will shown only once in a reload,
*/
view.quickSpinInfoPopup = function () {

	_sndLib.play(_sndLib.sprite.notification);

	_ng.GameConfig.quickSpinInfoPopupShown = true;
	_ng.GameConfig.quickSpinInfoTriggered = false;

	var buttonStyle = {
		fill: "#ffffff",
		fontFamily: "Baloo-Regular",
		// fontFamily: "Arial Black",
		// fontWeight: "bolder",
		fontSize: 50,
		strokeThickness: 2
	}

	var infoStyle = {
		fill: "#fafafa",
		fontFamily: "Baloo-Regular",
		// fontFamily: "Verdana, Geneva, sans-serif",
		stroke: "#0f0f0f",
		strokeThickness: 2,
		fontSize: 30,
		align: "center"
	}

	var headingStyle = {
		fill: "#e7c30d",
		fontFamily: "Baloo-Regular",
		// fontFamily: "Verdana, Geneva, sans-serif",
		// fontWeight: "bolder",
		stroke: "#0f0f0f",
		strokeThickness: 2
	}

	var quickSpinStyle = {
		fill: "#f2f2f2",
		fontFamily: "Baloo-Regular",
		// fontFamily: "Arial Black",
		fontSize: 20,
		// fontWeight: "bolder",
		lineHeight: 30,
		stroke: "#151414",
		strokeThickness: 3
	}

	this.quickSpinInfoContainer = pixiLib.getContainer();
	this.quickSpinInfoContainer.name = "quickSpinInfoContainer";
	this.quickSpinInfoContainer.position.set(26, 0);
	this.addChild(this.quickSpinInfoContainer);

	var popupBg = pixiLib.getElement("Sprite", "Rectangle 8");
	popupBg.name = "popupBg";
	popupBg.anchor.set(0.5);
	popupBg.scale.set(1.1, 0.78);
	this.quickSpinInfoContainer.addChild(popupBg);

	var quickSpinInfoClose = pixiLib.getButton("bet_close");
	quickSpinInfoClose.name = "quickSpinInfoClose";
	quickSpinInfoClose.position.set(292, -161);
	this.quickSpinInfoContainer.addChild(quickSpinInfoClose);
	pixiLib.addEvent(quickSpinInfoClose, this.closeQuickSpinInfo.bind(this));

	var headingTxt = pixiLib.getElement("Text", headingStyle);
	headingTxt.name = "headingTxt";
	headingTxt.anchor.set(0.5);
	headingTxt.position.set(0, -168);
	pixiLib.setText(headingTxt, gameLiterals.headingTxt);
	this.quickSpinInfoContainer.addChild(headingTxt);

	var infoTextOne = pixiLib.getElement("Text", infoStyle);
	infoTextOne.name = "infoTextOne";
	infoTextOne.anchor.set(0.5);
	infoTextOne.position.set(0, -65);
	pixiLib.setText(infoTextOne, gameLiterals.info1);
	this.quickSpinInfoContainer.addChild(infoTextOne);

	var infoTextTwo = pixiLib.getElement("Text", infoStyle);
	infoTextTwo.name = "infoTextTwo";
	infoTextTwo.anchor.set(0.5);
	infoTextTwo.position.set(0, 6);
	pixiLib.setText(infoTextTwo, gameLiterals.info2);
	this.quickSpinInfoContainer.addChild(infoTextTwo);

	var tickBox = pixiLib.getElement("Sprite", "Tick_box");
	tickBox.name = "tickBox";
	tickBox.position.set(-6.5, 65);
	tickBox.anchor.set(0.5);
	tickBox.scale.set(0.9);
	this.quickSpinInfoContainer.addChild(tickBox);

	tickBox.interactive = true;
	pixiLib.addEvent(tickBox, this.tickBoxClicked.bind(this));

	this.tick = pixiLib.getElement("Sprite", "Tick");
	this.tick.name = "tick";
	this.tick.position.set(0, 0);
	this.tick.anchor.set(0.5);
	tickBox.addChild(this.tick);
	this.tick.visible = false;

	var quickSpinText = pixiLib.getElement("Text", quickSpinStyle);
	quickSpinText.name = "quickSpinText";
	quickSpinText.anchor.set(0.5);
	quickSpinText.position.set(75, 65);
	pixiLib.setText(quickSpinText, gameLiterals.quickSpinText);
	this.quickSpinInfoContainer.addChild(quickSpinText);

	var buttonBg = pixiLib.getElement("Sprite", "Rectangle 27");
	buttonBg.name = "buttonBg";
	buttonBg.position.set(0, 159);
	buttonBg.anchor.set(0.5);
	buttonBg.scale.set(0.8);
	this.quickSpinInfoContainer.addChild(buttonBg);

	buttonBg.interactive = true;
	pixiLib.addEvent(buttonBg, this.closeQuickSpinInfo.bind(this));

	var okButtonTxt = pixiLib.getElement("Text", buttonStyle);
	okButtonTxt.name = "okButtonTxt";
	okButtonTxt.anchor.set(0.5);
	pixiLib.setText(okButtonTxt, gameLiterals.okButtonTxt);
	buttonBg.addChild(okButtonTxt);

}

view.tickBoxClicked = function () {

	if (commonConfig.disableQuickSpin) {  /*for GERMAN regulations*/
		return;
	}

	this.tick.visible = !_ng.isQuickSpinActive;

	if (_ng.isQuickSpinActive) {
		_mediator.publish("onSloAnimQuickSpinOff");
	} else {
		_mediator.publish("onSloAnimQuickSpinOn");
	}
}

view.closeQuickSpinInfo = function () {
	if (this.quickSpinInfoContainer) {
		coreApp.gameView.panel.fakeButton.visible = false;
		this.removeChild(this.quickSpinInfoContainer);
	}
}

view.onRCCloseHandler = function () {
	this.hideInfoEventType = undefined;
	_sndLib.play(_sndLib.sprite.btnClick);
	coreApp.gameModel.isRealityCheckActive = false;

	this.hidePopup();
	// this.gotoLobby();
};
view.showBuyPopupAnimation = function () {

	this.popupParent.scale.set(1);
	TweenMax.to(this.popupParent.scale, 1, {
		x: 1.1,
		y: 1.1,
		ease: Power1.easeInOut,
		yoyo: true,
		repeat: -1
	});
}

view.onBuyFeatureClick = function () {
	if (coreApp.gameController.allReelsStopped) {
		this.hideInfoEventType = "";
		this.hideInfoPopup();
		// this.removeSelector();
		_ng.buyFeaturePopupStatus = false;
		this.BuyServerReq("BuyFreeSpinContent");
		_mediator.publish("ToggleSpin", false);
		_mediator.publish("setSpaceBarEvent", "idle");
		_mediator.publish("hideMobPanel")
		_mediator.publish("disableBuyFeature");
		// this.closeBuyFSPopup();
		_mediator.publish("disablePanelFs");
		if (_viewInfoUtil.viewType == "VP")
			_mediator.publish("hideAndShowBuyControlls", true);//Only for portrait   
	}
}
view.superBuyFeatureClick = function () {
	if (coreApp.gameController.allReelsStopped) {
		this.hideInfoEventType = "";
		this.hideInfoPopup();
		// this.removeSelector();
		_ng.buyFeaturePopupStatus = false;
		this.BuyServerReq("SuperBuyContent");
		_mediator.publish("ToggleSpin", false);
		_mediator.publish("setSpaceBarEvent", "idle");
		_mediator.publish("hideMobPanel")
		_mediator.publish("disableBuyFeature");
		_mediator.publish("disablePanelFs");
		if (_viewInfoUtil.viewType == "VP")
			_mediator.publish("hideAndShowBuyControlls", true);//Only for portrait   
	}
}

view.superBuyCancelClicked = function () {
	this.hideInfoEventType = "";
	this.hideInfoPopup();
	_ng.buyFeaturePopupStatus = false;
	// this.removeSelector();
	_mediator.publish("setSpaceBarEvent", "spinClick");
	_mediator.publish("ToggleMobPanel", true);
	_mediator.publish("ToggleSpin", true)
	_mediator.publish("hideMobPanel")
	_mediator.publish("onCloseBtn")
	_mediator.publish("hideAndShowBuyControlls", true);
	// _mediator.publish("SHOW_TICKER_MESSAGE", gameLiterals.spinwin_text);
	_mediator.publish("checkBalanceForBuyFeature");
}
view.buyFeatureCancelClicked = function () {
	this.hideInfoEventType = "";
	this.hideInfoPopup();
	_ng.buyFeaturePopupStatus = false;
	// this.removeSelector();
	_mediator.publish("setSpaceBarEvent", "spinClick");
	_mediator.publish("ToggleMobPanel", true);
	_mediator.publish("ToggleSpin", true)
	_mediator.publish("hideMobPanel")
	_mediator.publish("onCloseBtn")
	_mediator.publish("hideAndShowBuyControlls", true);
	// _mediator.publish("SHOW_TICKER_MESSAGE", gameLiterals.spinwin_text);
	_mediator.publish("checkBalanceForBuyFeature");
}

view.showHistoryModePopup = function(roundId) {

	const gameWidth = _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].width;
	const gameHeight = _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].height;

	const userLocale = sessionStorage.getItem("Language") || sessionStorage.Language || 'en';
	const lang = userLocale.toLowerCase();

	const viewType = _viewInfoUtil ? _viewInfoUtil.viewType : "VD";
	const isMobileViewType = viewType === "VP" || viewType === "VL";
	const actualWindowWidth = window.innerWidth || 1280;
	const isSmallScreen = actualWindowWidth <= 768;
	const isMobile = isMobileViewType || isSmallScreen;

	if (isMobile) {

		let allReelsStoppedFlag = false;
		const checkAllReelsStopped = () => {
			if (coreApp && coreApp.gameController && coreApp.gameController.allReelsStopped) {
				allReelsStoppedFlag = true;

				this.showMobileHistoryModePopup(roundId);
				return;
			}
		};

		checkAllReelsStopped();
		
		if (!allReelsStoppedFlag) {

			const allReelsStoppedHandler = () => {

				if (_mediator && typeof _mediator.unsubscribe === 'function') {
					_mediator.unsubscribe("allReelsStopped", allReelsStoppedHandler);
				}
				setTimeout(() => {
					this.showMobileHistoryModePopup(roundId);
				}, 500);
			};
			
			_mediator.subscribe("allReelsStopped", allReelsStoppedHandler);

			setTimeout(() => {
				if (!allReelsStoppedFlag) {

					if (_mediator && typeof _mediator.unsubscribe === 'function') {
						_mediator.unsubscribe("allReelsStopped", allReelsStoppedHandler);
					}
					this.showMobileHistoryModePopup(roundId);
				}
			}, 5000);
		}
		
		return;
	}

	_sndLib.play(_sndLib.sprite.btnClick);

	if (this.historyModePopupContainer) {
		if (coreApp && coreApp.gameView && coreApp.gameView.popupContainer && this.historyModePopupContainer.parent === coreApp.gameView.popupContainer) {
			coreApp.gameView.popupContainer.removeChild(this.historyModePopupContainer);
		} else if (coreApp && coreApp.stage && this.historyModePopupContainer.parent === coreApp.stage) {
			coreApp.stage.removeChild(this.historyModePopupContainer);
		} else if (_ng && _ng.stage && this.historyModePopupContainer.parent === _ng.stage) {
			_ng.stage.removeChild(this.historyModePopupContainer);
		}
		this.historyModePopupContainer = null;
	}

	this.historyModePopupContainer = pixiLib.getContainer();
	this.historyModePopupContainer.name = "historyModePopupContainer";
	this.historyModePopupContainer.visible = true;
	this.historyModePopupContainer.alpha = 1.0;

	let targetContainer = null;
	if (coreApp && coreApp.gameView && coreApp.gameView.popupContainer) {
		targetContainer = coreApp.gameView.popupContainer;
	} else if (coreApp && coreApp.stage) {
		targetContainer = coreApp.stage;
	} else if (_ng && _ng.stage) {
		targetContainer = _ng.stage;
	}
	
	if (!targetContainer) {

		return;
	}
	
	targetContainer.addChild(this.historyModePopupContainer);
	targetContainer.setChildIndex(this.historyModePopupContainer, targetContainer.children.length - 1);

	const overlay = pixiLib.getRectangleSprite(gameWidth, gameHeight, 0x000000);
	overlay.alpha = 0.6;
	overlay.interactive = false;
	overlay.buttonMode = false;
	this.historyModePopupContainer.addChild(overlay);

	const buttonSpacing = 80;
	const buttonWidth = lang === 'tr' ? 250 : 180;
	const buttonHeight = 60;
	const borderRadius = buttonHeight / 2;
	const borderWidth = 2;
	const totalWidth = (buttonWidth * 2) + buttonSpacing;

	const startX = (gameWidth - totalWidth) / 2;
	const buttonY = (gameHeight - buttonHeight) / 2;

	const copyBtnGraphics = new PIXI.Graphics();
	copyBtnGraphics.beginFill(0x000000);
	copyBtnGraphics.drawRoundedRect(0, 0, buttonWidth, buttonHeight, borderRadius);
	copyBtnGraphics.endFill();

	copyBtnGraphics.lineStyle(borderWidth, 0xffffff);
	copyBtnGraphics.drawRoundedRect(0, 0, buttonWidth, buttonHeight, borderRadius);
	const copyBtn = new PIXI.Container();
	copyBtn.addChild(copyBtnGraphics);
	copyBtn.x = startX;
	copyBtn.y = buttonY;
	copyBtn.interactive = true;
	copyBtn.buttonMode = true;

	copyBtn._buttonWidth = buttonWidth;
	copyBtn._buttonHeight = buttonHeight;
	copyBtn._borderRadius = borderRadius;
	this.historyModePopupContainer.addChild(copyBtn);

	const copyBtnContainer = pixiLib.getContainer();
	copyBtnContainer.x = copyBtn.x;
	copyBtnContainer.y = copyBtn.y;
	this.historyModePopupContainer.addChild(copyBtnContainer);

	const chainIcon = pixiLib.getElement("Text", {
		fontFamily: "Baloo-Regular",
		// fontFamily: "Arial",
		fontSize: 30,
		fill: 0xffffff
	});
	pixiLib.setText(chainIcon, "🔗");
	chainIcon.x = 30;
	chainIcon.y = buttonHeight / 2;
	chainIcon.anchor.set(0.5, 0.5);
	copyBtnContainer.addChild(chainIcon);

	const copyBtnText = pixiLib.getElement("Text", {
		fontFamily: "Baloo-Regular",
		// fontFamily: "Montserrat-Bold",
		fontSize: lang === 'tr' ? 20 : 22,
		fill: 0xffffff
	});
	const copyBtnTextLabel = lang === 'tr' ? "BAĞLANTIYI KOPYALA" : "GENERATE";
	pixiLib.setText(copyBtnText, copyBtnTextLabel);
	copyBtnText.x = buttonWidth / 2 + 15;
	copyBtnText.y = buttonHeight / 2;
	copyBtnText.anchor.set(0.5, 0.5);
	copyBtnContainer.addChild(copyBtnText);

	const replayBtnGraphics = new PIXI.Graphics();
	replayBtnGraphics.beginFill(0x000000);
	replayBtnGraphics.drawRoundedRect(0, 0, buttonWidth, buttonHeight, borderRadius);
	replayBtnGraphics.endFill();

	replayBtnGraphics.lineStyle(borderWidth, 0xffffff);
	replayBtnGraphics.drawRoundedRect(0, 0, buttonWidth, buttonHeight, borderRadius);
	const replayBtn = new PIXI.Container();
	replayBtn.addChild(replayBtnGraphics);
	replayBtn.x = startX + buttonWidth + buttonSpacing;
	replayBtn.y = buttonY;
	replayBtn.interactive = true;
	replayBtn.buttonMode = true;
	this.historyModePopupContainer.addChild(replayBtn);

	const replayBtnContainer = pixiLib.getContainer();
	replayBtnContainer.x = replayBtn.x;
	replayBtnContainer.y = replayBtn.y;
	this.historyModePopupContainer.addChild(replayBtnContainer);

	const playIcon = pixiLib.getElement("Text", {
		fontFamily: "Baloo-Regular",
		// fontFamily: "Arial",
		fontSize: 26,
		fill: 0xffffff
	});
	pixiLib.setText(playIcon, "▶");
	playIcon.x = 30;
	playIcon.y = buttonHeight / 2;
	playIcon.anchor.set(0.5, 0.5);
	replayBtnContainer.addChild(playIcon);

	const replayBtnText = pixiLib.getElement("Text", {
		fontFamily: "Baloo-Regular",
		// fontFamily: "Montserrat-Bold",
		fontSize: lang === 'tr' ? 20 : 22,
		fill: 0xffffff
	});
	const replayBtnTextLabel = lang === 'tr' ? "TEKRAR İZLE" : "REPLAY";
	pixiLib.setText(replayBtnText, replayBtnTextLabel);
	replayBtnText.x = buttonWidth / 2 + 15;
	replayBtnText.y = buttonHeight / 2;
	replayBtnText.anchor.set(0.5, 0.5);
	replayBtnContainer.addChild(replayBtnText);

	pixiLib.addEvent(copyBtn, () => {
		_sndLib.play(_sndLib.sprite.btnClick);
		this.copyReplayLink(roundId, copyBtnText, copyBtn, chainIcon);
	});

	copyBtnContainer.interactive = true;
	copyBtnContainer.buttonMode = true;
	copyBtnContainer.hitArea = new PIXI.Rectangle(0, 0, buttonWidth, buttonHeight);
	pixiLib.addEvent(copyBtnContainer, () => {
		_sndLib.play(_sndLib.sprite.btnClick);
		this.copyReplayLink(roundId, copyBtnText, copyBtn, chainIcon);
	});

	pixiLib.addEvent(replayBtn, () => {
		_sndLib.play(_sndLib.sprite.btnClick);

		this.closeHistoryModePopup();
		setTimeout(() => {
			this.restartReplay();
		}, 100);
	});

	replayBtnContainer.interactive = true;
	replayBtnContainer.buttonMode = true;
	replayBtnContainer.hitArea = new PIXI.Rectangle(0, 0, buttonWidth, buttonHeight);
	pixiLib.addEvent(replayBtnContainer, () => {
		_sndLib.play(_sndLib.sprite.btnClick);

		this.closeHistoryModePopup();
		setTimeout(() => {
			this.restartReplay();
		}, 100);
	});

}

view.showMobileHistoryModePopup = function(roundId) {

	_sndLib.play(_sndLib.sprite.btnClick);

	const actualWindowWidth = window.innerWidth || 375;
	const actualWindowHeight = window.innerHeight || 667;
	const isSmallScreen = actualWindowWidth <= 768;
	const isPortraitLayout = actualWindowWidth <= actualWindowHeight && isSmallScreen;

	const gameWidth = actualWindowWidth;
	const gameHeight = actualWindowHeight;

	const userLocale = sessionStorage.getItem("Language") || sessionStorage.Language || 'en';
	const lang = userLocale.toLowerCase();

	if (this.historyModePopupContainer) {
		if (coreApp && coreApp.gameView && coreApp.gameView.popupContainer && this.historyModePopupContainer.parent === coreApp.gameView.popupContainer) {
			coreApp.gameView.popupContainer.removeChild(this.historyModePopupContainer);
		} else if (coreApp && coreApp.stage && this.historyModePopupContainer.parent === coreApp.stage) {
			coreApp.stage.removeChild(this.historyModePopupContainer);
		} else if (_ng && _ng.stage && this.historyModePopupContainer.parent === _ng.stage) {
			_ng.stage.removeChild(this.historyModePopupContainer);
		}
		this.historyModePopupContainer = null;
	}

	this.historyModePopupContainer = pixiLib.getContainer();
	this.historyModePopupContainer.name = "mobileHistoryModePopupContainer";
	this.historyModePopupContainer.visible = true;
	this.historyModePopupContainer.alpha = 0;

	let targetContainer = null;
	if (coreApp && coreApp.gameView && coreApp.gameView.popupContainer) {
		targetContainer = coreApp.gameView.popupContainer;
	} else if (coreApp && coreApp.stage) {
		targetContainer = coreApp.stage;
	} else if (_ng && _ng.stage) {
		targetContainer = _ng.stage;
	}
	
	if (!targetContainer) {

		return;
	}
	
	targetContainer.addChild(this.historyModePopupContainer);
	targetContainer.setChildIndex(this.historyModePopupContainer, targetContainer.children.length - 1);

	const overlay = pixiLib.getRectangleSprite(gameWidth, gameHeight, 0x000000);
	overlay.alpha = 0.7;
	overlay.interactive = true;
	overlay.buttonMode = false;
	this.historyModePopupContainer.addChild(overlay);

	const contentContainer = pixiLib.getContainer();

	contentContainer.x = gameWidth / 2;
	contentContainer.y = gameHeight / 2;
	contentContainer.pivot.set(0, 0);
	this.historyModePopupContainer.addChild(contentContainer);

	const buttonWidth = lang === 'tr' ? 280 : 220;
	const buttonHeight = 60;
	const buttonSpacing = 20;
	const borderRadius = buttonHeight / 2;
	const borderWidth = 2;

	const totalContentHeight = (buttonHeight * 2) + buttonSpacing;

	const buttonStartY = -totalContentHeight / 2;

	const copyBtnGraphics = new PIXI.Graphics();
	copyBtnGraphics.beginFill(0x000000);
	copyBtnGraphics.drawRoundedRect(0, 0, buttonWidth, buttonHeight, borderRadius);
	copyBtnGraphics.endFill();
	copyBtnGraphics.lineStyle(borderWidth, 0xffffff);
	copyBtnGraphics.drawRoundedRect(0, 0, buttonWidth, buttonHeight, borderRadius);
	
	const copyBtn = new PIXI.Container();
	copyBtn.addChild(copyBtnGraphics);
	copyBtn.x = -buttonWidth / 2;
	copyBtn.y = buttonStartY;
	copyBtn.interactive = true;
	copyBtn.buttonMode = true;
	copyBtn.cursor = 'pointer';
	contentContainer.addChild(copyBtn);

	const copyBtnContainer = pixiLib.getContainer();
	copyBtnContainer.x = copyBtn.x;
	copyBtnContainer.y = copyBtn.y;
	contentContainer.addChild(copyBtnContainer);

	const chainIcon = pixiLib.getElement("Text", {
		fontFamily: "Arial",
		fontSize: 26,
		fill: 0xffffff
	});
	pixiLib.setText(chainIcon, "🔗");
	chainIcon.x = 30;
	chainIcon.y = buttonHeight / 2;
	chainIcon.anchor.set(0.5, 0.5);
	copyBtnContainer.addChild(chainIcon);

	const copyBtnText = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-Bold",
		fontSize: lang === 'tr' ? 16 : 18,
		fill: 0xffffff
	});
	const copyBtnTextLabel = lang === 'tr' ? "BAĞLANTIYI KOPYALA" : "GENERATE";
	pixiLib.setText(copyBtnText, copyBtnTextLabel);
	copyBtnText.x = buttonWidth / 2 + 15;
	copyBtnText.y = buttonHeight / 2;
	copyBtnText.anchor.set(0.5, 0.5);
	copyBtnContainer.addChild(copyBtnText);

	const replayBtnGraphics = new PIXI.Graphics();
	replayBtnGraphics.beginFill(0x000000);
	replayBtnGraphics.drawRoundedRect(0, 0, buttonWidth, buttonHeight, borderRadius);
	replayBtnGraphics.endFill();
	replayBtnGraphics.lineStyle(borderWidth, 0xffffff);
	replayBtnGraphics.drawRoundedRect(0, 0, buttonWidth, buttonHeight, borderRadius);
	
	const replayBtn = new PIXI.Container();
	replayBtn.addChild(replayBtnGraphics);
	replayBtn.x = -buttonWidth / 2;
	replayBtn.y = buttonStartY + buttonHeight + buttonSpacing;
	replayBtn.interactive = true;
	replayBtn.buttonMode = true;
	replayBtn.cursor = 'pointer';
	contentContainer.addChild(replayBtn);

	const replayBtnContainer = pixiLib.getContainer();
	replayBtnContainer.x = replayBtn.x;
	replayBtnContainer.y = replayBtn.y;
	contentContainer.addChild(replayBtnContainer);

	const playIcon = pixiLib.getElement("Text", {
		fontFamily: "Arial",
		fontSize: 26,
		fill: 0xffffff
	});
	pixiLib.setText(playIcon, "▶");
	playIcon.x = 30;
	playIcon.y = buttonHeight / 2;
	playIcon.anchor.set(0.5, 0.5);
	replayBtnContainer.addChild(playIcon);

	const replayBtnText = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-Bold",
		fontSize: lang === 'tr' ? 16 : 18,
		fill: 0xffffff
	});
	const replayBtnTextLabel = lang === 'tr' ? "TEKRAR İZLE" : "REPLAY";
	pixiLib.setText(replayBtnText, replayBtnTextLabel);
	replayBtnText.x = buttonWidth / 2 + 15;
	replayBtnText.y = buttonHeight / 2;
	replayBtnText.anchor.set(0.5, 0.5);
	replayBtnContainer.addChild(replayBtnText);

	copyBtn._buttonWidth = buttonWidth;
	copyBtn._buttonHeight = buttonHeight;
	copyBtn._borderRadius = borderRadius;

	const copyButtonClickHandler = () => {
		_sndLib.play(_sndLib.sprite.btnClick);
		this.copyReplayLink(roundId, copyBtnText, copyBtn, chainIcon);

	};
	
	pixiLib.addEvent(copyBtn, copyButtonClickHandler);
	
	copyBtnContainer.interactive = true;
	copyBtnContainer.buttonMode = true;
	copyBtnContainer.hitArea = new PIXI.Rectangle(0, 0, buttonWidth, buttonHeight);
	pixiLib.addEvent(copyBtnContainer, copyButtonClickHandler);
	
	pixiLib.addEvent(replayBtn, () => {
		_sndLib.play(_sndLib.sprite.btnClick);

		this.closeHistoryModePopup();
		setTimeout(() => {
			this.restartReplay();
		}, 100);
	});
	
	replayBtnContainer.interactive = true;
	replayBtnContainer.buttonMode = true;
	replayBtnContainer.hitArea = new PIXI.Rectangle(0, 0, buttonWidth, buttonHeight);
	pixiLib.addEvent(replayBtnContainer, () => {
		_sndLib.play(_sndLib.sprite.btnClick);

		this.closeHistoryModePopup();
		setTimeout(() => {
			this.restartReplay();
		}, 100);
	});

	TweenMax.to(this.historyModePopupContainer, 0.5, {
		alpha: 1,
		ease: Power2.easeOut,
		onComplete: () => {

		}
	});

	const updateCursor = (button) => {
		if (button) {
			button.mouseover = () => {
				if (document.body) {
					document.body.style.cursor = 'pointer';
				}
			};
			button.mouseout = () => {
				if (document.body) {
					document.body.style.cursor = 'default';
				}
			};
		}
	};
	
	updateCursor(copyBtn);
	updateCursor(replayBtn);
	updateCursor(copyBtnContainer);
	updateCursor(replayBtnContainer);

}

view.showCopiedToast = function(parentContainer, lang) {

	if (this.copiedToast) {
		if (this.copiedToast.parent) {
			this.copiedToast.parent.removeChild(this.copiedToast);
		}
		this.copiedToast = null;
	}

	const toastContainer = pixiLib.getContainer();
	toastContainer.x = 0;
	toastContainer.y = -100;

	const toastBg = new PIXI.Graphics();
	toastBg.beginFill(0x4CAF50);
	toastBg.drawRoundedRect(0, 0, 150, 50, 10);
	toastBg.endFill();
	toastContainer.addChild(toastBg);
	toastContainer.x = -75;

	const toastText = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-Bold",
		fontSize: 18,
		fill: 0xffffff
	});
	const toastLabel = lang === 'tr' ? "Kopyalandı!" : "Copied!";
	pixiLib.setText(toastText, toastLabel);
	toastText.x = 75;
	toastText.y = 25;
	toastText.anchor.set(0.5, 0.5);
	toastContainer.addChild(toastText);

	parentContainer.addChild(toastContainer);
	this.copiedToast = toastContainer;

	toastContainer.alpha = 0;
	toastContainer.scale.set(0.8);
	TweenMax.to(toastContainer, 0.3, {
		alpha: 1,
		scale: { x: 1, y: 1 },
		ease: Back.easeOut.config(1.5)
	});

	setTimeout(() => {
		if (toastContainer && toastContainer.parent) {
			TweenMax.to(toastContainer, 0.3, {
				alpha: 0,
				scale: { x: 0.8, y: 0.8 },
				ease: Power2.easeIn,
				onComplete: () => {
					if (toastContainer && toastContainer.parent) {
						toastContainer.parent.removeChild(toastContainer);
					}
					if (this.copiedToast === toastContainer) {
						this.copiedToast = null;
					}
				}
			});
		}
	}, 2000);
}

view.copyReplayLink = function(roundId, linkTextElement, linkBtn, chainIcon) {

	const userLocale = sessionStorage.getItem("Language") || sessionStorage.Language || 'en';

	const baseUrl = window.location.origin + window.location.pathname;
	const shareUrl = new URL(baseUrl);

	shareUrl.searchParams.set('round_id', roundId);
	shareUrl.searchParams.set('user_locale', userLocale);
	shareUrl.searchParams.set('is_replay', 'true');
	
	const linkString = shareUrl.toString();

	this.copyToClipboard(linkString);

	if (linkBtn && linkBtn.children && linkBtn.children[0] && linkBtn.children[0] instanceof PIXI.Graphics) {
		const buttonGraphics = linkBtn.children[0];
		const btnWidth = linkBtn._buttonWidth || 180;
		const btnHeight = linkBtn._buttonHeight || 60;
		const btnRadius = linkBtn._borderRadius || 10;
		buttonGraphics.clear();
		buttonGraphics.beginFill(0x4CAF50);
		buttonGraphics.drawRoundedRect(0, 0, btnWidth, btnHeight, btnRadius);
		buttonGraphics.endFill();

		buttonGraphics.lineStyle(2, 0xffffff);
		buttonGraphics.drawRoundedRect(0, 0, btnWidth, btnHeight, btnRadius);
	}

	if (chainIcon) {
		chainIcon.tint = 0x4CAF50;
	}

	setTimeout(() => {

		if (linkBtn && linkBtn.children && linkBtn.children[0] && linkBtn.children[0] instanceof PIXI.Graphics) {
			const buttonGraphics = linkBtn.children[0];
			const btnWidth = linkBtn._buttonWidth || 180;
			const btnHeight = linkBtn._buttonHeight || 60;
			const btnRadius = linkBtn._borderRadius || 10;
			buttonGraphics.clear();
			buttonGraphics.beginFill(0x000000);
			buttonGraphics.drawRoundedRect(0, 0, btnWidth, btnHeight, btnRadius);
			buttonGraphics.endFill();

			buttonGraphics.lineStyle(2, 0xffffff);
			buttonGraphics.drawRoundedRect(0, 0, btnWidth, btnHeight, btnRadius);
		}
		if (chainIcon) {
			chainIcon.tint = 0xFFFFFF;
		}
	}, 2000);

}

view.copyToClipboard = function(text) {

	if (navigator.clipboard && window.isSecureContext) {
		navigator.clipboard.writeText(text).then(() => {

		}).catch((err) => {

			this.fallbackCopyToClipboard(text);
		});
	} else {

		this.fallbackCopyToClipboard(text);
	}
}

view.fallbackCopyToClipboard = function(text) {

	const textArea = document.createElement("textarea");
	textArea.value = text;
	textArea.style.position = "fixed";
	textArea.style.left = "-999999px";
	textArea.style.top = "-999999px";
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	
	try {
		const successful = document.execCommand('copy');
		if (successful) {

		} else {

		}
	} catch (err) {

	}
	
	document.body.removeChild(textArea);
}

view.restartReplay = function() {

	const urlParams = new URLSearchParams(window.location.search);
	const roundId = urlParams.get('round_id');
	const userLocale = urlParams.get('user_locale') || sessionStorage.getItem("Language") || 'en';
	const sessionId = urlParams.get('session_id') || sessionStorage.getItem("sessionId");
	const wager = urlParams.get('wager');
	const isAnteBet = urlParams.get('is_ante_bet');
	const isBuyFeature = urlParams.get('is_buy_feature');
	const isSuperBuyFeature = urlParams.get('is_buy_super_feature');
	const isBonus = urlParams.get('is_bonus');

	let currency = null;
	try {
		if (urlParams && urlParams.has('currency')) {
			currency = urlParams.get('currency');
		} else {
			currency = sessionStorage.getItem("adaptor_currency") || sessionStorage.adaptor_currency || null;
		}
	} catch (e) {

	}
	
	if (!roundId) {

		return;
	}

	const baseUrl = window.location.origin + window.location.pathname;
	const replayUrl = new URL(baseUrl);

	replayUrl.searchParams.set('is_replay', 'true');
	replayUrl.searchParams.set('round_id', roundId);
	
	if (userLocale) {
		replayUrl.searchParams.set('user_locale', userLocale);
	}
	
	window.location.href = replayUrl.toString();
}

view.closeHistoryModePopup = function() {
	if (this.historyModePopupContainer) {

		if (coreApp && coreApp.gameView && coreApp.gameView.popupContainer && this.historyModePopupContainer.parent === coreApp.gameView.popupContainer) {
			coreApp.gameView.popupContainer.removeChild(this.historyModePopupContainer);
		} else if (coreApp && coreApp.stage && this.historyModePopupContainer.parent === coreApp.stage) {
			coreApp.stage.removeChild(this.historyModePopupContainer);
		} else if (_ng && _ng.stage && this.historyModePopupContainer.parent === _ng.stage) {
			_ng.stage.removeChild(this.historyModePopupContainer);
		} else if (this.historyModePopupContainer.parent) {

			this.historyModePopupContainer.parent.removeChild(this.historyModePopupContainer);
		}
		this.historyModePopupContainer = null;
	}
}

view.showGambleWindow = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const roundId = urlParams.get('round_id');
  var gambleConfig = _ng.GameConfig.infoPopupView.gamblePopup;

  this.grayBg = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
  this.grayBg.alpha = 0.8;
  this.grayBg.interactive = true;
  coreApp.gameView.popupContainer.addChildAt(this.grayBg, 0);

  this.popupParent = pixiLib.getElement();
  this.addChild(this.popupParent);


  this.popupBG = pixiLib.getElement("Spine", gambleConfig.background.spineImage);
  this.popupParent.addChild(this.popupBG);
  pixiLib.setProperties(this.popupBG, gambleConfig.background.props);
  this.popupBG.state.setAnimation(0, gambleConfig.background.animationState.LOOP, true);

  this.descriptionHead = pixiLib.getElement("Text", gambleConfig.headingText.textStyle);
  pixiLib.setText(this.descriptionHead, gameLiterals.gambleHeadText);
  pixiLib.setProperties(this.descriptionHead, gambleConfig.headingText.props);
  pixiLib.attachToSlot(this.popupBG, "emptyslot1",this.descriptionHead);

  this.chooseColorText = pixiLib.getElement("Text", gambleConfig.subHeadText.textStyle);
  pixiLib.setText(this.chooseColorText, gameLiterals.chooseColorText);
  pixiLib.setProperties(this.chooseColorText, gambleConfig.subHeadText.props);
  pixiLib.attachToSlot(this.popupBG, "emptyslot2",this.chooseColorText);

  this.redBtn = pixiLib.getButton(gambleConfig.redButton.bgImage, gambleConfig.redButton.options);
  this.popupParent.addChild(this.redBtn);
  pixiLib.setProperties(this.redBtn, gambleConfig.redButton.props);
  pixiLib.addEvent(this.redBtn,this.onRedButtonClick.bind(this))

  this.blueBtn = pixiLib.getButton(gambleConfig.blueButton.bgImage, gambleConfig.blueButton.options);
  this.popupParent.addChild(this.blueBtn);
  pixiLib.setProperties(this.blueBtn, gambleConfig.blueButton.props);
  pixiLib.addEvent(this.blueBtn,this.onBlueButtonClick.bind(this))
  
  this.tossBtn = pixiLib.getButton(gambleConfig.tossButton.bgImage, gambleConfig.tossButton.options);
  this.popupParent.addChild(this.tossBtn);
  pixiLib.setProperties(this.tossBtn, gambleConfig.tossButton.props);

  //TOSS BTN TEXT
  var tossBtnText = pixiLib.getElement("Text", gambleConfig.tossBtnText.textStyle);
  pixiLib.setText(tossBtnText, gameLiterals.tossBtnText);
  pixiLib.setProperties(tossBtnText, gambleConfig.tossBtnText.props);
  this.tossBtn.addChild(tossBtnText);

  pixiLib.addEvent(this.tossBtn,this.onTossButtonClick.bind(this))
  pixiLib.setInteraction(this.tossBtn, false);

  this.backBtn = pixiLib.getButton(gambleConfig.backButton.bgImage, gambleConfig.backButton.options);
  this.popupParent.addChild(this.backBtn);
  pixiLib.setProperties(this.backBtn, gambleConfig.backButton.props[_viewInfoUtil.viewType]);
  pixiLib.addEvent(this.backBtn, () => {
	_sndLib.stop(_sndLib.sprite.gambleBG);
	pixiLib.setInteraction(this.backBtn, false);
	this.onFsCloseHandler("onBackButtonClicked");
  });

  if(roundId){
	pixiLib.setInteraction(this.backBtn, false);
	this.replayForToss();
  }

//   eventType = eventType ? eventType : "nothing";
  this.hideInfoEventType = "";
  this.hideInfoDelay = 0;
  setTimeout(function () {
    //Adding timeout so popup will be shown fully then enable spacebar
    _mediator.publish("setSpaceBarEvent", "hideInfoPopup");
  }, 500);
  _ngFluid.call(this, gambleConfig.params);
  this.onViewResize();
  this.showInfoPopup();
  _sndLib.play(_sndLib.sprite.gambleBG);
}

view.onRedButtonClick = function () {
    this.redBtn.interactive = false;
    this.redBtn.texture = pixiLib.getTexture("red_pressed");

    this.blueBtn.interactive = true;
    this.blueBtn.texture = pixiLib.getTexture("blue_normal");
 	pixiLib.setInteraction(this.tossBtn, true);
    this.colorType = "red";
};

view.onBlueButtonClick = function () {
   
    this.blueBtn.interactive = false;
    this.blueBtn.texture = pixiLib.getTexture("blue_pressed");

    this.redBtn.interactive = true;
    this.redBtn.texture = pixiLib.getTexture("red_normal");
	pixiLib.setInteraction(this.tossBtn, true);

    this.colorType = "blue";
};
view.onTossButtonClick = function () {
	this.backBtn.visible = false;
	this.blueBtn.visible = false;
	this.redBtn.visible = false;
	this.tossBtn.visible = false;

	_mediator.publish("sendCoinFlipReq", "gamble", this.colorType , () => {
		this.showGambleWinView();
	});

}

view.showGambleWinView = function(){
	_sndLib.stop(_sndLib.sprite.gambleBG);
    var gambleConfig = _ng.GameConfig.infoPopupView.gamblePopup;
	const isSucess = coreApp.gameModel.gambleResultData.iscoinTossGambleActive;
	var gambleWinAmount = pixiLib.getFormattedAmount(coreApp.gameModel.gambleResultData.gamebleWinAmount);

	if(isSucess){
		const state = this.popupBG.state;
		_sndLib.play(_sndLib.sprite.tossWin);
		state.setAnimation(0,this.colorType+"_win", false);
		state.addListener({
			complete: (trackEntry) => {
				if (trackEntry.animation.name === this.colorType+"_win") {

					var winAmount = pixiLib.getElement("Text", gambleConfig.amountText.textStyle);
					pixiLib.setText(winAmount, gambleWinAmount);
					pixiLib.setProperties(winAmount, gambleConfig.amountText.props);
					pixiLib.attachToSlot(this.popupBG, "emptyslot3", winAmount);

					/* SHOW WIN POP UP */
					state.setAnimation(0, this.colorType + "_win_loop", true);
					this.updateGamblingWinAmount();
					pixiLib.addEvent(this.grayBg, this.closeGambleView.bind(this));

					
				}
			}
		});
	
	}else{

		var color = (this.colorType == "blue") ? "red": "blue";
		const state = this.popupBG.state;
		_sndLib.play(_sndLib.sprite.tossLoss);
		state.setAnimation(0,color+"_lose", false);
		state.addListener({
			complete: (trackEntry) => {
				if (trackEntry.animation.name === color+"_lose") {

					var winAmount = pixiLib.getElement("Text", gambleConfig.amountText.textStyle);
					pixiLib.setText(winAmount, gambleWinAmount);
					pixiLib.setProperties(winAmount, gambleConfig.amountText.props);
					pixiLib.attachToSlot(this.popupBG, "emptyslot3", winAmount);

					/* SHOW BETTER LUCK POP UP */
					state.setAnimation(0,color+"_lose_loop", true);
					this.updateGamblingWinAmount();
					pixiLib.addEvent(this.grayBg, this.closeGambleView.bind(this));

					
				}
			}
		});
	}

}
view.closeGambleView = function () {
	this.onFsCloseHandler("collect");
}

view.updateGamblingWinAmount = function (){
	const urlParams = new URLSearchParams(window.location.search);
	const roundId = urlParams.get('round_id');
	var gambleConfig = _ng.GameConfig.infoPopupView.gamblePopup;

	/* Press anywhere text */
	var pressAnyWhere = pixiLib.getElement("Text", gambleConfig.anywhereText.textStyle);
	pixiLib.setText(pressAnyWhere, gameLiterals.anywhereText);
	pixiLib.setProperties(pressAnyWhere, gambleConfig.anywhereText.props);
	this.popupParent.addChild(pressAnyWhere);

	_ng.externalUiController.ticker.showWinText('');
	var gambleWin = pixiLib.getFormattedAmount(coreApp.gameModel.gambleResultData.getGambleWinAmount());
	_ng.externalUiController.ticker.showWinText(gambleWin);

	/* ********REPLAY*********** */
	if(roundId){
		setTimeout(() => {
			this.closeGambleView();
		}, 500);
		setTimeout(() => {
			this.showHistoryModePopup(roundId);
		}, 700);
	}
}

view.coinFlipReplaySimulation = function (){

 const urlParams = new URLSearchParams(window.location.search);
 const roundId = urlParams.get('round_id');

 var responseData = window.slotService.replayDataArray[window.slotService.replayDataArray.length-1];

 if (responseData.is_bonus_round_gambled) {

  setTimeout(() => {
    this.doubleRewardBtn.emit('pointertap');/*SHOW GAMBLE WINDOW*/
  }, 1000);

 }else{
	//IN THE CASE OF COLLECT BUTTON CLICK
	pixiLib.setInteraction(this.endcontinueBtn, true);
	this.endcontinueBtn.interactive = false;
	setTimeout(() => {
		this.onFsCloseHandler("collect");
		this.endcontinueBtn.interactive = true;
	}, 200);
	setTimeout(() => {
			this.showHistoryModePopup(roundId);
	}, 500);
 }
 
}

view.replayForToss = function (){

 var responseData = window.slotService.replayDataArray[window.slotService.replayDataArray.length-1];
  var obj = {
		win_amount: responseData.round_total_win_amount,
		success: responseData.has_won_gamble_game,
		balance: responseData.current_round.balance
 };
 /* TODO: MAKE IT SAME RESPONSE FOR REAL AND REPLAY */
 coreApp.gameModel.gambleResultData.saveCoinTossGambleResponse(obj);
 
 if (responseData.is_bonus_round_gambled) {

	var color = responseData.gamble_data; //COLOR
	this.colorType = color;
	 setTimeout(() => {
		if(color === "red"){
			this.redBtn.emit('pointertap');//clicking color btn
		}else{
			this.blueBtn.emit('pointertap');
		}
	 }, 300);

	 setTimeout(() => {
		 this.blueBtn.visible = false;
		 this.redBtn.visible = false;
		 this.tossBtn.visible = false;
		this.showGambleWinView();
	 }, 600);
 }

}