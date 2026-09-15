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

  this.timer = 0;
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

  //FOR PFS

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

  var continueText = pixiLib.getElement("Text", fsPopupConfig.continueText.textStyle);
  continueBtn.addChild(continueText);
  pixiLib.setProperties(continueText, fsPopupConfig.continueText.props);
  pixiLib.setText(continueText, gameLiterals.continueText);

  eventType = eventType ? eventType : "nothing";
  this.hideInfoEventType = eventType;
  this.hideInfoDelay = 0;
  setTimeout(function () {
    //Adding timeout so popup will be shown fully then enable spacebar
    _mediator.publish("setSpaceBarEvent", "hideInfoPopup");
  }, 500);
  pixiLib.addEvent(continueBtn, this.hideInfoPopup.bind(this, eventType));
  _ngFluid.call(this, fsPopupConfig.params);
  _mediator.publish("setSpaceBarEvent", "idle");

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

/**************************************/
/*POPUP FOR PROMO FREE SPIN AWARDED*/
view.promoFreeSpinAwarded = function() {
 
  const yesButtonStyle = new PIXI.TextStyle({
      fontFamily: "Arial Black",
      fill: "#f8f7f7",
      fontSize: 24,
      fontWeight: "bolder"
  });

  const laterButtonStyle = new PIXI.TextStyle({
      fontFamily: "Arial Black",
      fontSize: 24,
      fontWeight: "bolder",
      align: "center",
  });

  const headingStyle = new PIXI.TextStyle({
      fontFamily: "Arial Black",
      fill: "#24a8eb",
      fontSize: 24,
      fontWeight: "bolder"
  });

  const infoStyle = new PIXI.TextStyle({
      fontFamily: "Tahoma",
      fill: "#f8f7f7",
      fontSize: 18,
      fontWeight: "bolder",
      align: "center",
  });

  const timeStyle = new PIXI.TextStyle({
      align: "center",
      fill: "#f7b21d",
      fontFamily: "Tahoma",
      fontSize: 24,
      fontWeight: "bolder",
  });

  this.grayBg = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
  this.grayBg.alpha = 0.6;
  this.grayBg.name = "grayBg";
  this.grayBg.interactive = true;
  coreApp.gameView.popupContainer.addChildAt(this.grayBg, 0);

  this.promoPopup = pixiLib.getElement();
  this.promoPopup.name = "awardedPromoPopup";
  this.addChild(this.promoPopup);

  var bg = pixiLib.getElement("Sprite","popup_bg");
  bg.name = "bg";
  bg.anchor.set(0.5);
  bg.scale.set(0.8);
  this.promoPopup.addChild(bg);

  /*for YES BUTTON*/
  var yesButtonContainer = pixiLib.getElement();
  yesButtonContainer.name = "yesButtonContainer";
  yesButtonContainer.position.set(-118, 150);
  yesButtonContainer.scale.set(0.8);
  this.promoPopup.addChild(yesButtonContainer);

  var yesButton = pixiLib.getButton("Yes_btn");
  yesButton.name = "yesButton";
  yesButton.anchor.set(0.5);
  yesButtonContainer.addChild(yesButton);
  if(yesButton)
  pixiLib.addEvent(yesButton, this.onYesButtonClick.bind(this));  
  
  var yesButtonText = pixiLib.getElement("Text",yesButtonStyle);
  yesButtonText.name = "yesButtonText";
  yesButtonText.anchor.set(0.5);
  yesButtonText.text = gameLiterals.pfsYes;
  yesButtonContainer.addChild(yesButtonText);

  /*for USE LATER BUTTON*/
  var laterButtonContainer = pixiLib.getElement();
  laterButtonContainer.name = "laterButtonContainer";
  laterButtonContainer.scale.set(0.8);
  laterButtonContainer.position.set(121, 150);
  this.promoPopup.addChild(laterButtonContainer);

  var laterButton = pixiLib.getButton("Later_btn");
  laterButton.name = "laterButton";
  laterButton.anchor.set(0.5);
  laterButtonContainer.addChild(laterButton);
  pixiLib.addEvent(laterButton,this.onLaterButtonClick.bind(this));

  var laterButtonText = pixiLib.getElement("Text",laterButtonStyle);
  laterButtonText.name = "laterButtonText";
  laterButtonText.anchor.set(0.5);
  laterButtonText.text = gameLiterals.pfsUseLater;
  laterButtonContainer.addChild(laterButtonText);

  /*HEADING TEXT*/
  var headingText = pixiLib.getElement("Text",headingStyle);
  headingText.name = "headingText";
  headingText.anchor.set(0.5);
  headingText.position.set(0,-138);
  headingText.text = gameLiterals.headingText1.replace("XX",coreApp.gameModel.getTotalPFS());
  this.promoPopup.addChild(headingText);

  /*INFO TEXT
  IF YOU CHOOSE TO PLAY LATER, THE BONUS WILL BE AVAILABLE \nAGAIN WHEN YOU REOPEN THE GAME.
  */
  var infoText = pixiLib.getElement("Text",infoStyle);
  infoText.name = "infoText";
  infoText.anchor.set(0.5);
  infoText.position.set(0,-19);
  infoText.text = gameLiterals.PfsText2;
  this.promoPopup.addChild(infoText);

  /*INFO TEXT
  THIS BONUS IS AVAILABLE FOR
  */
  var bonusAvailText = pixiLib.getElement("Text",infoStyle);
  bonusAvailText.name = "bonusAvailText";
  bonusAvailText.anchor.set(0.5);
  bonusAvailText.position.set(0, 35);
  bonusAvailText.text = gameLiterals.PfsText3;
  this.promoPopup.addChild(bonusAvailText);

  /*TIME INFO TEXT
  23 HOURS 59 MINUTES
  */
  this.timeText = pixiLib.getElement("Text",timeStyle);
  this.timeText.name = "timeText";
  this.timeText.anchor.set(0.5);
  this.timeText.position.set(0, 73);
  this.timeText.text = gameLiterals.PfsDate;
  this.promoPopup.addChild(this.timeText);

  this.onViewResize();
}

/*use later button of PROMO FREESPIN AWARDED*/
view.onLaterButtonClick = function() {
  this.removeChild(this.promoPopup);
  coreApp.gameView.popupContainer.removeChild(this.grayBg);
  coreApp.gameModel.PFSData = new PromoFreeSpinModel();
  _ng.GameConfig.PFSUseLater = true;
  _mediator.publish("runGameInit");
  _mediator.publish("ToggleSpin",true);
}

/*yes button of PROMO FREESPIN AWARDED*/
view.onYesButtonClick = function(){
  this.removeChild(this.promoPopup);
  coreApp.gameView.popupContainer.removeChild(this.grayBg);
  _mediator.publish("runGameInit");
  coreApp.gameModel.updatePanelModelPFS(); /**pfs coin value,coin value index, current bet updation */
  _mediator.publish("showPromoView");   /*FOR SHOWING TOP STRIP*/

}

/*for closing PROMO FREESPIN AWARDED*/
view.closePromoFreeSpinAwarded = function() {
  this.removeChild(this.promoPopup);
  coreApp.gameView.popupContainer.removeChild(this.grayBg);
}

 /**************************************/
/*POPUP FOR PROMO FREE SPIN UNFINISHED*/
view.unfinishedPromoFreeSpin = function() {
 
  const headingStyle = new PIXI.TextStyle({
      fontFamily: "Arial Black",
      fill: "#24a8eb",
      fontSize: 24,
      fontWeight: "bolder",
      align: "center",
  });

  const laterButtonStyle = new PIXI.TextStyle({
      fontFamily: "Arial Black",
      fontSize: 24,
      fontWeight: "bolder"
  });

  const remainingSpinStyle = new PIXI.TextStyle({
      align: "center",
      fill: "#f7b21d",
      fontFamily: "Tahoma",
      fontSize: 90,
      fontWeight: "bolder",
  });

  this.grayBg = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
  this.grayBg.alpha = 0.6;
  this.grayBg.name = "grayBg";
  this.grayBg.interactive = true;
  coreApp.gameView.popupContainer.addChildAt(this.grayBg, 0);

  this.promoPopup = pixiLib.getElement();
  this.promoPopup.name = "unFinishedPromoPopup";
  this.addChild(this.promoPopup);

  var bg = pixiLib.getElement("Sprite","popup_bg");
  bg.name = "bg";
  bg.anchor.set(0.5);
  bg.scale.set(0.8);
  this.promoPopup.addChild(bg);

  /*HEADING TEXT*/
  var headingText = pixiLib.getElement("Text",headingStyle);
  headingText.name = "headingText";
  headingText.anchor.set(0.5);
  headingText.position.set(0,-138);
  headingText.text = gameLiterals.pfsText7;
  this.promoPopup.addChild(headingText);

  /*for CONTINUE BUTTON*/
  var continueButtonContainer = pixiLib.getElement();
  continueButtonContainer.name = "continueButtonContainer";
  continueButtonContainer.scale.set(1);
  continueButtonContainer.position.set(0, 145);
  this.promoPopup.addChild(continueButtonContainer);

  var continueButton = pixiLib.getButton("Later_btn");
  continueButton.name = "continueButton";
  continueButton.anchor.set(0.5);
  continueButtonContainer.addChild(continueButton);
  pixiLib.addEvent(continueButton,this.unFinishedContinueButtonClick.bind(this));

  var continueButtonText = pixiLib.getElement("Text",laterButtonStyle);
  continueButtonText.name = "continueButtonText";
  continueButtonText.anchor.set(0.5);
  continueButtonText.text = gameLiterals.pfsText6;
  continueButtonContainer.addChild(continueButtonText);

  /*for REMAINING SPINS*/
  var remainingSpins = pixiLib.getElement("Text",remainingSpinStyle);
  remainingSpins.name = "remainingSpins";
  remainingSpins.anchor.set(0.5);
  remainingSpins.text = coreApp.gameModel.getRemainingPFS();
  this.promoPopup.addChild(remainingSpins);

  this.onViewResize();
}

view.unFinishedContinueButtonClick = function() {
  this.removeChild(this.promoPopup);
  coreApp.gameView.popupContainer.removeChild(this.grayBg);
  _mediator.publish("runGameInit");
  coreApp.gameModel.updatePanelModelPFS(); /**pfs coin value,coin value index, current bet updation */
  _mediator.publish("showPromoView");   /*FOR SHOWING TOP STRIP*/
}

 /*************************************/
/*POPUP FOR PROMO FREE SPIN REWARDED - end*/
view.promoFreeSpinRewarded = function() {
  const headingStyle = new PIXI.TextStyle({
      fontFamily: "Arial Black",
      fill: "#24a8eb",
      fontSize: 23,
      fontWeight: "bolder"
  });

  const laterButtonStyle = new PIXI.TextStyle({
      fontFamily: "Arial Black",
      fontSize: 24,
      fontWeight: "bolder"
  });

  const totalWinStyle = new PIXI.TextStyle({
      align: "center",
      fill: "#f2f0ee",
      fontFamily: "Tahoma",
      fontSize: 30,
      fontWeight: "bolder",
  });

  const totalWinValueStyle = new PIXI.TextStyle({
      align: "center",
      fill: "#f7b21d",
      fontFamily: "Tahoma",
      fontSize: 40,
      fontWeight: "bolder",
  });

  this.grayBg = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
  this.grayBg.alpha = 0.6;
  this.grayBg.name = "grayBg";
  this.grayBg.interactive = true;
  coreApp.gameView.popupContainer.addChildAt(this.grayBg, 0);

  this.promoPopup = pixiLib.getElement();
  this.promoPopup.name = "unFinishedpromoPopup";
  this.addChild(this.promoPopup);

  var bg = pixiLib.getElement("Sprite","popup_bg");
  bg.name = "bg";
  bg.anchor.set(0.5);
  bg.scale.set(0.8);
  this.promoPopup.addChild(bg);

  /*HEADING TEXT*/
  var headingText = pixiLib.getElement("Text",headingStyle);
  headingText.name = "headingText";
  headingText.anchor.set(0.5);
  headingText.position.set(0,-138);
  headingText.text = gameLiterals.pfsText4;
  this.promoPopup.addChild(headingText);

  /*for CONTINUE BUTTON*/
  var continueButtonContainer = pixiLib.getElement();
  continueButtonContainer.name = "continueButtonContainer";
  continueButtonContainer.scale.set(1);
  continueButtonContainer.position.set(0, 145);
  this.promoPopup.addChild(continueButtonContainer);

  var continueButton = pixiLib.getButton("Later_btn");
  continueButton.name = "continueButton";
  continueButton.anchor.set(0.5);
  continueButtonContainer.addChild(continueButton);
  pixiLib.addEvent(continueButton,this.rewardedContinueClick.bind(this));

  var continueButtonText = pixiLib.getElement("Text",laterButtonStyle);
  continueButtonText.name = "continueButtonText";
  continueButtonText.anchor.set(0.5);
  continueButtonText.text = gameLiterals.pfsText6;
  continueButtonContainer.addChild(continueButtonText);

  /*TOTAL WIN TEXT*/
  var totalWinText = pixiLib.getElement("Text",totalWinStyle);
  totalWinText.name = "totalWinText";
  totalWinText.anchor.set(0.5);
  totalWinText.position.set(0, -44);
  totalWinText.text = gameLiterals.pfsText5;
  this.promoPopup.addChild(totalWinText);

  var totalWinValue = pixiLib.getElement("Text",totalWinValueStyle);
  totalWinValue.name = "totalWinValue";
  totalWinValue.anchor.set(0.5);
  totalWinValue.position.set(0, 18);
  this.promoPopup.addChild(totalWinValue);

  var totalWinAmount = coreApp.gameModel.getTotalPFSWin();
  totalWinValue.text =  pixiLib.getFormattedAmount(totalWinAmount);

  this.onViewResize();
  // While popup is visible, ensure spin is disabled on mobile too
  _mediator.publish("ToggleSpin", false);
  if (_viewInfoUtil.device === 'Mobile') {
    _mediator.publish("ToggleMobPanel", false);
  }
  // Mark PFSEnded in model so controllers keep spin hidden until this popup closes
  if (coreApp && coreApp.gameModel && coreApp.gameModel.PFSData) {
    coreApp.gameModel.PFSData.isPFSEnded = true;
  }
}

view.rewardedContinueClick = function() {
  this.removeChild(this.promoPopup);
  coreApp.gameView.popupContainer.removeChild(this.grayBg);
  coreApp.gameModel.PFSData.isPFSEnded = false;
  coreApp.gameModel.PFSData.isPFSActive = false;  // Now set to false when user clicks continue
  _mediator.publish("hidePromoView");   //TODO : DESTROY
  coreApp.gameModel.updatePanelModelPFS(); //Setting Previous Bet
  // Re-enable controls after closing
  _mediator.publish("EnablePanel");
  _mediator.publish("ToggleSpin", true);
  _mediator.publish("setSpaceBarEvent", "spinClick");
  // Re-enable ante bet and buy feature when PFR fully ends
  _mediator.publish("enableBuyFeature");
  _mediator.publish("enabledPanelFs");
  // Show autoplay button when PFR fully ends
  _mediator.publish("showAutoPlayButton");
}


/*for timer*/
view.startDateTimer = function() {

  // Example Unix timestamp received from the backend (in seconds)
  var backendTime = coreApp.gameModel.PFSData.endDateTime;

  const expirationTimestamp = backendTime; // Replace this with the actual timestamp from your backend

  this.expiryDate = new Date(expirationTimestamp * 1000); //

  // Start the timer
  this.timerId = setTimeout(this.step.bind(this));
  
}

// Update interval (1 second)
var interval = 1500; // ms
this.timerId; // to store the setTimeout ID

view.step = function() {

  // console.log("tshsgshgshs",this.step);
    var interval = 1500; // ms

    // Current time
    var currentTime = Date.now();
    
    
    // // Time left until expiry
    var timeRemaining = this.expiryDate - currentTime;
    
    if (timeRemaining <= 0) {
        console.log("Timer expired");
        clearTimeout(this.timerId);

        var combinedText = "0 Days 0 Hours 00 Minutes 00 Seconds ";
        this.updateTimerText(combinedText);
        return;
    }
    
    // Calculate remaining days, hours, minutes, and seconds
    var days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
    var hourshours = Math.floor((timeRemaining / (1000 * 60)) % 60);
    var seconds = Math.floor((timeRemaining / 1000) % 60);
      
    // console.log(`${days}d ${hours}h ${minutes}m ${seconds}s remaining`);
    var combinedText = days + " Days " + hours + " Hours " + hourshours + " Minutes " + seconds + " Seconds ";
    this.updateTimerText(combinedText);

    // Set up the next step after 1 second
    this.timerId = setTimeout(() => this.step(), interval);
    // this.timerId;
}

view.updateTimerText = function(tempText) {
  if( this.timeText)
    this.timeText.text = tempText;
}















