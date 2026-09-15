function InfoPopupView(gameView) {
  this.gameView = coreApp.gameView;
  this.hideInfoEventType = "";
  this.hideInfoDelay = 0;
  this.rcTotalTime = 0;
  this.rcpTimeout = _ng.GameConfig.realityCheck.timeOut;
  this.rcpIsFirstDisplay = true;

  if (pixiLib.getUrlVar("rcpTimer") !== undefined) {
    var timer = pixiLib.getUrlVar("rcpTimer");
    timer = parseFloat(timer);
    if (!isNaN(timer) && timer > 0) {
      this.rcpTimeout = timer;
    }
  }
  this.rcpTimeElapsed = this.rcpTimeout;    //Show RCP popup after this time only for first times
  if (pixiLib.getUrlVar("rcpTimeElapsed") !== undefined) {
    var elapsedTimer = pixiLib.getUrlVar("rcpTimeElapsed");
    elapsedTimer = parseFloat(elapsedTimer);
    if (!isNaN(elapsedTimer) && elapsedTimer > 0) {
      this.rcpTimeElapsed = elapsedTimer;
    }
  }


  ViewContainer.call(this);
  this.addSubscription();
  this.createRealityCheckPopup();
  this.startRealityInterval();
}

InfoPopupView.prototype = Object.create(ViewContainer.prototype);
InfoPopupView.prototype.constructor = InfoPopupView;

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
};
view.showFreeSpinEndedZeroBalance = function (events) {
  _sndLib.play(_sndLib.sprite.fsWinPopup);

  var fsPopupConfig = _ng.GameConfig.infoPopupView.errorPopup;
  this.fsEndTextStyle = fsPopupConfig.descriptionText.textStyle;

  this.grayBg = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
  this.grayBg.alpha = 0.6;
  this.grayBg.name = "grayBg";
  this.grayBg.interactive = true;
  coreApp.gameView.popupContainer.addChildAt(this.grayBg, 0);

  this.popupParent = pixiLib.getElement();
  this.addChild(this.popupParent);

  var fsEndedScreen = pixiLib.getElement("Sprite", fsPopupConfig.background.bgImage);
  this.popupParent.addChild(fsEndedScreen);
  pixiLib.setProperties(fsEndedScreen, fsPopupConfig.background.props);

  var descriptionText = pixiLib.getElement("Text", fsPopupConfig.descriptionText.textStyle);
  pixiLib.setText(descriptionText, "Hope you have better luck next time");
  this.popupParent.addChild(descriptionText);
  pixiLib.setProperties(descriptionText, fsPopupConfig.descriptionText.props);

  var continueBtn = pixiLib.getButton(fsPopupConfig.continueButton.bgImage, fsPopupConfig.continueButton.options);
  this.popupParent.addChild(continueBtn);
  pixiLib.setProperties(continueBtn, fsPopupConfig.continueButton.props);

  setTimeout(function () {
    //Adding timeout so popup will be shown fully then enable spacebar
    _mediator.publish("setSpaceBarEvent", "onFsCloseHandler");
  }, 500);
  pixiLib.addEvent(continueBtn, this.onFsCloseHandler.bind(this));
  _ngFluid.call(this, fsPopupConfig.params);

  this.onViewResize();
  this.showInfoPopup();
}
view.onShowBonusAward = function (str) {
  var fsPopupConfig = _ng.GameConfig.infoPopupView.bonusAwardPopup || _ng.GameConfig.infoPopupView.freeSpinPopup;

  this.grayBg = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
  this.grayBg.alpha = 0.6;
  this.grayBg.interactive = true;
  coreApp.gameView.popupContainer.addChildAt(this.grayBg, 0);

  this.popupParent = pixiLib.getElement();
  this.addChild(this.popupParent);

  var fsAwardedScreen = pixiLib.getElement("Sprite", fsPopupConfig.background.bgImage);
  this.popupParent.addChild(fsAwardedScreen);
  pixiLib.setProperties(fsAwardedScreen, fsPopupConfig.background.props);

  this.descriptionText = pixiLib.getElement("Text", fsPopupConfig.descriptionText.textStyle);
  pixiLib.setText(this.descriptionText, str);
  this.popupParent.addChild(this.descriptionText);

  //Both Bonus Winning popup and FS win popup are using same config
  //In case description Text's props are different for both use bonusProps for Bonus popup and props for FS Popup
  if (fsPopupConfig.descriptionText.bonusProps) {
    pixiLib.setProperties(this.descriptionText, fsPopupConfig.descriptionText.bonusProps);
  } else {
    pixiLib.setProperties(this.descriptionText, fsPopupConfig.descriptionText.props);
  }

  var continueBtn = pixiLib.getButton(fsPopupConfig.continueButton.bgImage, fsPopupConfig.continueButton.options);
  this.popupParent.addChild(continueBtn);
  pixiLib.setProperties(continueBtn, fsPopupConfig.continueButton.props);

  setTimeout(function () {
    //Adding timeout so popup will be shown fully then enable spacebar
    _mediator.publish("setSpaceBarEvent", "onBonusAwardContinueClick");
  }, 500);
  pixiLib.addEvent(continueBtn, this.onBonusAwardContinueClick.bind(this));
  _ngFluid.call(this, fsPopupConfig.params);

  this.onViewResize();
  this.showInfoPopup();
  // _sndLib.play(_sndLib.sprite.bonusPopup);
  _sndLib.play(_sndLib.sprite.bonusPopup);
};

view.onBonusAwardContinueClick = function () {
  this.hideInfoEventType = "showBonusGame";
  this.hideInfoDelay = 0;
  this.hideInfoPopup("showBonusGame");
};
view.onShowBonusWin = function (str) {
  _sndLib.play(_sndLib.sprite.bonusPopup);
  var fsPopupConfig = _ng.GameConfig.infoPopupView.bonusWinPopup || _ng.GameConfig.infoPopupView.freeSpinPopup;

  this.grayBg = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
  this.grayBg.alpha = 0.6;
  this.grayBg.interactive = true;
  coreApp.gameView.popupContainer.addChildAt(this.grayBg, 0);

  this.popupParent = pixiLib.getElement();
  this.addChild(this.popupParent);

  var fsAwardedScreen = pixiLib.getElement("Sprite", fsPopupConfig.background.bgImage);
  this.popupParent.addChild(fsAwardedScreen);
  pixiLib.setProperties(fsAwardedScreen, fsPopupConfig.background.props);

  this.descriptionText = pixiLib.getElement("Text", fsPopupConfig.descriptionText.textStyle);
  pixiLib.setText(this.descriptionText, str);
  this.popupParent.addChild(this.descriptionText);

  //Both Bonus Winning popup and FS win popup are using same config
  //In case description Text's props are different for both use bonusProps for Bonus popup and props for FS Popup
  if (fsPopupConfig.descriptionText.bonusProps) {
    pixiLib.setProperties(this.descriptionText, fsPopupConfig.descriptionText.bonusProps);
  } else {
    pixiLib.setProperties(this.descriptionText, fsPopupConfig.descriptionText.props);
  }

  var continueBtn = pixiLib.getButton(fsPopupConfig.continueButton.bgImage, fsPopupConfig.continueButton.options);
  this.popupParent.addChild(continueBtn);
  pixiLib.setProperties(continueBtn, fsPopupConfig.continueButton.props);

  setTimeout(function () {
    //Adding timeout so popup will be shown fully then enable spacebar
    _mediator.publish("setSpaceBarEvent", "onBonusWinContinueClick");
  }, 500);
  pixiLib.addEvent(continueBtn, this.onBonusWinContinueClick.bind(this));
  _ngFluid.call(this, fsPopupConfig.params);

  this.onViewResize();
  this.showInfoPopup();
};

view.onBonusWinContinueClick = function () {
  this.hideInfoEventType = "closeBonus";
  this.hideInfoDelay = 0;
  this.hideInfoPopup("closeBonus");
};

view.onShowErrorMsg = function (str, eventType, isUnfinished) {
  var fsPopupConfig = _ng.GameConfig.infoPopupView.errorPopup;

  this.grayBg = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
  this.grayBg.alpha = 0.95;
  this.grayBg.interactive = true;
  coreApp.gameView.popupContainer.addChildAt(this.grayBg, 0);

  this.popupParent = pixiLib.getElement();
  this.addChild(this.popupParent);

  var fsAwardedScreen = pixiLib.getElement("Sprite", fsPopupConfig.background.bgImage);
  this.popupParent.addChild(fsAwardedScreen);
  pixiLib.setProperties(fsAwardedScreen, fsPopupConfig.background.props);

  this.descriptionText = pixiLib.getElement("Text", fsPopupConfig.descriptionText.textStyle);
  pixiLib.setText(this.descriptionText, str);
  this.popupParent.addChild(this.descriptionText);
  pixiLib.setProperties(this.descriptionText, fsPopupConfig.descriptionText.props);

  var continueBtn = pixiLib.getButton(fsPopupConfig.continueButton.bgImage, fsPopupConfig.continueButton.options);
  this.popupParent.addChild(continueBtn);
  pixiLib.setProperties(continueBtn, fsPopupConfig.continueButton.props);
  eventType = eventType ? eventType : "nothing";
  this.hideInfoEventType = eventType;
  this.hideInfoDelay = 0;
  setTimeout(function () {
    //Adding timeout so popup will be shown fully then enable spacebar
    _mediator.publish("setSpaceBarEvent", "hideInfoPopup");
  }, 500);
  pixiLib.addEvent(continueBtn, this.hideInfoPopup.bind(this, eventType));
  _ngFluid.call(this, fsPopupConfig.params);

  this.addAdditionalMessage();
  this.onViewResize();
  this.showInfoPopup();
  if (isUnfinished) {
    _sndLib.play(_sndLib.sprite.showPopup);
  } else {
    _sndLib.play(_sndLib.sprite.errorPopup);
  }
};
view.addAdditionalMessage = function () { };

view.createView = function (argument) { };

view.showFreeSpinAwarded = function (numSpins, nextAction) {
  _sndLib.play(_sndLib.sprite.fsAwardPopup);
  this.nextAction = nextAction;
  var fsPopupConfig = _ng.GameConfig.infoPopupView.freeSpinPopup;
  var numSpins = Number.isInteger(parseInt(numSpins)) ? numSpins : coreApp.gameModel.getTotalFSTriggered();

  this.grayBg = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
  this.grayBg.alpha = 0.6;
  this.grayBg.interactive = true;
  coreApp.gameView.popupContainer.addChildAt(this.grayBg, 0);

  this.popupParent = pixiLib.getElement();
  this.addChild(this.popupParent);

  var fsAwardedScreen = pixiLib.getElement("Sprite", fsPopupConfig.background.bgImage);
  this.popupParent.addChild(fsAwardedScreen);
  pixiLib.setProperties(fsAwardedScreen, fsPopupConfig.background.props);

  this.descriptionText = pixiLib.getElement("Text", fsPopupConfig.descriptionText.textStyle);
  var mText = pixiLib.getLiteralText(fsPopupConfig.descriptionText.text);
  mText = numSpins + " " + mText;
  pixiLib.setText(this.descriptionText, mText);
  this.popupParent.addChild(this.descriptionText);
  pixiLib.setProperties(this.descriptionText, fsPopupConfig.descriptionText.props);

  var continueBtn = pixiLib.getButton(fsPopupConfig.continueButton.bgImage, fsPopupConfig.continueButton.options);
  this.popupParent.addChild(continueBtn);
  pixiLib.setProperties(continueBtn, fsPopupConfig.continueButton.props);

  setTimeout(function () {
    //Adding timeout so popup will be shown fully then enable spacebar
    _mediator.publish("setSpaceBarEvent", "onFSContinueClick");
  }, 500);
  pixiLib.addEvent(continueBtn, this.onFSContinueClick.bind(this));
  _ngFluid.call(this, fsPopupConfig.params);

  this.onViewResize();
  this.showInfoPopup();
};

view.showInfoPopup = function () {
  this.popupParent.scale.set(0);
  this.grayBg.alpha = 0;
  TweenMax.to(this.grayBg, 0.3, { alpha: 0.6 });

  if (this.container) {
    this.addChild(this.container);
  }

  TweenMax.to(this.popupParent.scale, 0.3, { x: 1, y: 1, ease: Back.easeOut.config(1.5) });
};

view.onFSContinueClick = function () {
  if (this.nextAction == "closeBonus") {
    _mediator.publish("closeBonus");
  }
  //If Freespins are Re-Triggered, don't show starting Freespins message in Ticker
  if (coreApp.gameModel.getTotalFSTriggered() == coreApp.gameModel.getTotalFreeSpins()) {
    _mediator.publish("SHOW_TICKER_MESSAGE", gameLiterals.startfree);
    _mediator.publish("SHOW_TICKER");
  }
  this.hideInfoEventType = "startFreeSpins";
  this.hideInfoDelay = 500;
  this.hideInfoPopup("startFreeSpins", 500);
};

view.hideInfoPopup = function (eventToPublish, delay) {
  _sndLib.play(_sndLib.sprite.hidePopup);
  TweenMax.to(this.grayBg, 0.3, { alpha: 0 });
  TweenMax.to(this.popupParent.scale, 0.3, {
    x: 0,
    y: 0,
    onComplete: function () {
      this.popupParent.destroy();
      delete this.popupParent;

      this.grayBg.destroy();
      delete this.grayBg;
      if (this.hideInfoEventType) {
        setTimeout(
          function () {
            _mediator.publish(this.hideInfoEventType);
          }.bind(this),
          this.hideInfoDelay
        );
      }
    }.bind(this)
  });
};

view.showFreeSpinEnded = function () {
  _sndLib.play(_sndLib.sprite.fsWinPopup);

  var winAmount = coreApp.gameModel.getTotalFSWin();
  var fsPopupConfig = _ng.GameConfig.infoPopupView.freeSpinEndPopup;
  this.fsEndTextStyle = fsPopupConfig.descriptionText.textStyle;

  this.grayBg = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
  this.grayBg.alpha = 0.6;
  this.grayBg.name = "grayBg";
  this.grayBg.interactive = true;
  coreApp.gameView.popupContainer.addChildAt(this.grayBg, 0);

  this.popupParent = pixiLib.getElement();
  this.addChild(this.popupParent);

  var fsEndedScreen = pixiLib.getElement("Sprite", fsPopupConfig.background.bgImage);
  this.popupParent.addChild(fsEndedScreen);
  pixiLib.setProperties(fsEndedScreen, fsPopupConfig.background.props);

  var winAmountTxt = pixiLib.getElement("Text", fsPopupConfig.fsWinValue.textStyle);
  this.popupParent.addChild(winAmountTxt);
  pixiLib.setProperties(winAmountTxt, fsPopupConfig.fsWinValue.props);
  pixiLib.setText(winAmountTxt, pixiLib.getFormattedAmount(winAmount));

  var descriptionText = pixiLib.getElement("Text", fsPopupConfig.descriptionText.textStyle);
  pixiLib.setText(descriptionText, fsPopupConfig.descriptionText.text);
  this.popupParent.addChild(descriptionText);
  pixiLib.setProperties(descriptionText, fsPopupConfig.descriptionText.props);

  var continueBtn = pixiLib.getButton(fsPopupConfig.continueButton.bgImage, fsPopupConfig.continueButton.options);
  this.popupParent.addChild(continueBtn);
  pixiLib.setProperties(continueBtn, fsPopupConfig.continueButton.props);

  setTimeout(function () {
    //Adding timeout so popup will be shown fully then enable spacebar
    _mediator.publish("setSpaceBarEvent", "onFsCloseHandler");
  }, 500);
  pixiLib.addEvent(continueBtn, this.onFsCloseHandler.bind(this));
  _ngFluid.call(this, fsPopupConfig.params);

  this.onViewResize();
  this.showInfoPopup();
};

view.showSuperMeterPopup = function () {

  var smPopupConfig = _ng.GameConfig.infoPopupView.superMeterPopup;

  this.grayBg = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
  this.grayBg.alpha = 0.6;
  this.grayBg.name = "grayBg";
  this.grayBg.interactive = true;
  coreApp.gameView.popupContainer.addChildAt(this.grayBg, 0);

  this.popupParent = pixiLib.getElement();
  this.addChild(this.popupParent);

  var bg = pixiLib.getElement("Sprite", smPopupConfig.background.bgImage);
  this.popupParent.addChild(bg);
  pixiLib.setProperties(bg, smPopupConfig.background.props);

  //  var contentValue = pixiLib.getElement("Text", smPopupConfig.contentValue.textStyle);
  // pixiLib.setText(contentValue, smPopupConfig.contentValue.text);

  var contentValue = pixiLib.getElement("Sprite", smPopupConfig.contentValue.bgImage);

  this.popupParent.addChild(contentValue);
  pixiLib.setProperties(contentValue, smPopupConfig.contentValue.props);

  var noButton = pixiLib.getButton(smPopupConfig.noButton.bgImage, smPopupConfig.noButton.options);
  this.popupParent.addChild(noButton);
  pixiLib.setProperties(noButton, smPopupConfig.noButton.props);
  
  var yesButton = pixiLib.getButton(smPopupConfig.yesButton.bgImage, smPopupConfig.yesButton.options);
  this.popupParent.addChild(yesButton);
  pixiLib.setProperties(yesButton, smPopupConfig.yesButton.props);

  setTimeout(function () {
    //Adding timeout so popup will be shown fully then enable spacebar
    _mediator.publish("setSpaceBarEvent", "onFsCloseHandler");
  }, 500);

  pixiLib.addEvent(noButton, this.onSmNoHandler.bind(this));
  pixiLib.addEvent(yesButton, this.onSmYesHandler.bind(this));
  _ngFluid.call(this, smPopupConfig.params);

  this.onViewResize();
  this.showInfoPopup();
};

view.onSmNoHandler = function () {
  this.hideInfoEventType = "onSMPopupShown";
  this.hideInfoDelay = 0;
  _sndLib.play(_sndLib.sprite.hidePopup);
  this.hideInfoPopup("onSMPopupShown");
};

view.onSmYesHandler = function () {

  _mediator.publish("SM_COLLECT")

  this.hideInfoEventType = "onSMPopupShown";
  this.hideInfoDelay = 0;
  _sndLib.play(_sndLib.sprite.hidePopup);
  this.hideInfoPopup("onSMPopupShown");
};


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

  // setInterval(function () {
  //   this.rcTotalTime++;
  //   var mText = pixiLib.getLiteralText(_ng.GameConfig.realityCheck.contentTxt.text);
  //   pixiLib.setText(this.container.contentTxt, mText.replace("%A1%", parseFloat(this.rcTotalTime.toFixed(2))));
  // }.bind(this), 1 * 60000);

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
  // this.rcPopupCount++;
  // setTimeout(function () {
  //     //Adding timeout so popup will be shown fully then enable spacebar
  //     _mediator.publish("setSpaceBarEvent", "onRCCloseHandler");
  // }, 500);
  coreApp.gameModel.isRealityCheckActive = true;
  clearInterval(this.realityInterval);
  this.onViewResize();
  if (!this.container.visible) {
    this.showPopup();
    // var mText = pixiLib.getLiteralText(_ng.GameConfig.realityCheck.contentTxt.text);
    // pixiLib.setText(this.container.contentTxt, mText.replace("%A1%", parseFloat(this.rcTotalTime.toFixed(2))));

    var mText = pixiLib.getLiteralText(_ng.GameConfig.realityCheck.totalBetTxt.text);
    if (mText.indexOf("%A1%") == -1) mText += " %A1%";
    var lossAmount  = (coreApp.gameModel.getAllTotalBet()-coreApp.gameModel.getAllTotalWin())

    lossAmount = lossAmount<0? 0 : lossAmount;

    pixiLib.setText(this.container.totalBetTxt, mText.replace("%A1%", pixiLib.getFormattedAmount(lossAmount)));

    mText = pixiLib.getLiteralText(_ng.GameConfig.realityCheck.totalWinTxt.text);
    if (mText.indexOf("%A1%") == -1) mText += " %A1%";
    pixiLib.setText(this.container.totalWinTxt, mText.replace("%A1%", pixiLib.getFormattedAmount(coreApp.gameModel.getAllTotalWin())));
  }
};

view.showPopup = function () {
  _sndLib.play(_sndLib.sprite.showPopup);

  this.container.visible = true;
  this.overlay.visible = true;
  this.container.scale.set(0);
  this.overlay.alpha = 0;

  TweenMax.to(this.overlay, 0.3, { alpha: 0.6 });
  TweenMax.to(this.container.scale, 0.3, { x: 1, y: 1, ease: Back.easeOut.config(1.5) });
};

view.hidePopup = function () {
  _sndLib.play(_sndLib.sprite.btnClick);
  _sndLib.play(_sndLib.sprite.hidePopup);
  TweenMax.to(this.overlay, 0.3, { alpha: 0 });
  TweenMax.to(this.container.scale, 0.3, {
    x: 0, y: 0, onComplete: function () {
      this.overlay.visible = false;
      this.container.visible = false;
      this.startRealityInterval();
    }.bind(this)
  });
};

view.onRCCloseHandler = function () {
  this.hideInfoEventType = undefined;
  _sndLib.play(_sndLib.sprite.btnClick);
  coreApp.gameModel.isRealityCheckActive = false;
  this.hidePopup();
  this.gotoLobby();
};

view.gotoLobby = function () {
  _mediator.publish("openURL", { type: "lobby" });
}
view.onRCContinueHandler = function () {
  coreApp.gameModel.isRealityCheckActive = false;
  _sndLib.play(_sndLib.sprite.btnClick);
  this.hideInfoEventType = undefined;
  this.hidePopup();
};


view.onFsCloseHandler = function () {
  this.hideInfoEventType = "onFSEndShown";
  this.hideInfoDelay = 0;
  _sndLib.play(_sndLib.sprite.hidePopup);
  this.hideInfoPopup("onFSEndShown");
};

view.onViewResize = function () {
  if (this.grayBg) {
    this.grayBg.width = _viewInfoUtil.getWindowWidth();
    this.grayBg.height = _viewInfoUtil.getWindowHeight();

    // this.updateSize();
    this.setSize(0, 0);
  }
  if (this.overlay) {
    this.overlay.width = _viewInfoUtil.getWindowWidth();
    this.overlay.height = _viewInfoUtil.getWindowHeight();
    this.setSize(0, 0);
  }
};
