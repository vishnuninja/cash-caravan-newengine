var _ng = _ng || {};
_ng.SlotController = function () {
    _ng.CoreController.call(this, coreApp);
    this.gameStateAnimation = false;
    this.isUnfinishedStopped = false;
    this.isCallNextGameStateStopped = false;
    this.spaceBarEvent = "idle";
    this.isSpaceBarHeld = false;
    this.isWindowFocused = true;
    this.isGamePaused = false;      //To use when window is defocused.
    this.isPFSRunning = false;
    this.addEvents();
    this.addGameController();
    this.specialGameStateAnimationDelay = _ng.GameConfig.specialGameStateAnimationDelay || 1000;
}

_ng.SlotController.prototype = Object.create(_ng.CoreController.prototype);
_ng.SlotController.prototype.constructor = _ng.SlotController;

var p = _ng.SlotController.prototype;
var cc = _ng.CoreController.prototype;

p.addGameController = function () { }

p.setModel = function (model) {
    cc.setModel.call(this, model);
    this.panelModel = this.model.panelModel;
    this.userModel = this.model.userModel;
    this.settingsModel = this.model.settingsModel;
    
    _ng.quickSpinType = commonConfig.quickSpinType;
}
p.addEvents = function () {
    cc.addEvents.call(this);
    _mediator.subscribe("SHOW_LOG", this.onShowLog.bind(this));

    _mediator.subscribe("spinStart", this.onSpinClickHandler.bind(this));
    _mediator.subscribe("onSpinResponse", this.onSpinResponseHandler.bind(this));
    _mediator.subscribe("STOP_SPIN_NOW", this.onStopSpinHandler.bind(this));
    _mediator.subscribe("allReelsStopped", this.onAllReelStopped.bind(this));
    _mediator.subscribe("onTotalWinShown", this.onTotalWinShown.bind(this));
    _mediator.subscribe("onBigWinShown", this.onBigWinShown.bind(this));
    _mediator.subscribe("startFreeSpins", this.onStartFreespins.bind(this));
    _mediator.subscribe("onFSEndShown", this.onFSEndShown.bind(this));
    _mediator.subscribe("showFreeSpinEnded", function(){
        _mediator.publish("showFSWinOnPanel");
    });
    _mediator.subscribe("GAMBLE_END", this.onGambleEnd.bind(this));
    _mediator.subscribe("continueUnfinishedGame", this.onUnfinishGame.bind(this));

    _mediator.subscribe("AlternateLineWinShownOnce", this.onAlternateLineWinsShownOnce.bind(this));

    _mediator.subscribe("callNextGameState", this.callNextGameState.bind(this));
    _mediator.subscribe("specialGameStateAnimationCompleted", this.callNextGameState.bind(this));
    _mediator.subscribe("bonusSymbolAnimationCompleted", this.callNextGameState.bind(this));

    _mediator.subscribe("onGameCreated", this.onGameInit.bind(this));
    _mediator.subscribe("runGameInit", this.onGameInit.bind(this));

    _mediator.subscribe("SHOW_GAMBLE", this.onGambleShowHandler.bind(this));
    _mediator.subscribe("SHOW_GAMBLE", function(){
        _mediator.publish("setSpaceBarEvent", "idle");
    });
    _mediator.subscribe("totalBetUpdated", this.onTotalBetUpdate.bind(this));

    _mediator.subscribe(_events.slot.coinValueUpdated, this.onCoinValueUpdated.bind(this));
    _mediator.subscribe(_events.slot.lineValueUpdated, this.onLineValueUpdated.bind(this));

    _mediator.subscribe("START_AUTOSPIN", this.onStartAutoSpin.bind(this));
    //For Resetting Autospin data in Model
    _mediator.subscribe("stopAutoSpin", this.onStopAutoSpin.bind(this));
    //Hides Autostop button and count also from panel along with resetting autospin data in model
    _mediator.subscribe("cancelAutoSpin", this.onStopAutoSpin.bind(this));


    _mediator.subscribe("bonusGameEnded", this.onBonusGameEnd.bind(this));
    _mediator.subscribe("callPostMatrixAction", this.postMatrixCheck.bind(this));

    //_mediator.subscribe("onFeatureResponse", this.onFeatureResponse.bind(this));

    _mediator.subscribe("spinClick", this.onSpinClick.bind(this));
    _mediator.subscribe("reloadGame", this.reloadGame.bind(this));
    _mediator.subscribe("unfinishedFreeSpins", this.onUnfinishedFreeSpins.bind(this));


    //autospin events 
    _mediator.subscribe("AS_StopOnAnyWin", this.onStopOnAnyWinSelection.bind(this));
    _mediator.subscribe("AS_StopOnWinLimit", this.onStopOnWinLimitSelection.bind(this));
    _mediator.subscribe("AS_StopOnLossLimit", this.onStopOnLossLimitSelection.bind(this));

    _mediator.subscribe("hidePanel", this.onHidePanel.bind(this));
    _mediator.subscribe("showPanel", this.onShowPanel.bind(this));
    _mediator.subscribe("hideReelView", this.onHideReelView.bind(this));
    _mediator.subscribe("showReelView", this.onShowReelView.bind(this));
    _mediator.subscribe("hideWinView", this.onHideWinView.bind(this));
    _mediator.subscribe("showWinView", this.onShowWinView.bind(this));
    _mediator.subscribe("hideMainContainer", this.onHideMainContainer.bind(this));
    _mediator.subscribe("showMainContainer", this.onShowMainContainer.bind(this));
    _mediator.subscribe("hideClockView", this.onHideClockView.bind(this));
    _mediator.subscribe("showClockView", this.onShowClockView.bind(this));
    _mediator.subscribe("hideGameTitle", this.onHideGameTitle.bind(this));
    _mediator.subscribe("showGameTitle", this.onShowGameTitle.bind(this));
    _mediator.subscribe("hidePaytableContainer", this.onHidePaytableContainer.bind(this));
    _mediator.subscribe("showPaytableContainer", this.onShowPaytableContainer.bind(this));
    _mediator.subscribe("hidePopupContainer", this.onHidePopupContainer.bind(this));
    _mediator.subscribe("showPopupContainer", this.onShowPopupContainer.bind(this));

    _mediator.subscribe("continueInitGame", this.continueAfterGameUnfinishAnimations.bind(this));

    _mediator.subscribe("hideNotificationWindow", this.onHideNotificationWindow.bind(this));
    _mediator.subscribe("showNotificationWindow", this.onShowNotificationWindow.bind(this));

    
    //override changeReelView function to publish required things. removeReelView, updateReelConfig, createReelView, repositionReelView
    _mediator.subscribe("changeReelView", this.changeReelView.bind(this));
    //function to call repositionReelView of slotView.
    _mediator.subscribe("repositionReelView", this.repositionReelView.bind(this));
    //Remove all the children of ReelView.
    _mediator.subscribe("removeReelView", this.removeReelView.bind(this));
    _mediator.subscribe("updateReelViewUiConfig", this.updateReelViewUiConfig.bind(this));
    _mediator.subscribe("updateSpinDataReels", this.updateSpinDataReels.bind(this));
    _mediator.subscribe("updateReelSymbolConfig", this.updateReelSymbolConfig.bind(this));

    _mediator.subscribe(_events.core.secondaryAssetsLoaded, function () {
        if (this.isUnfinishedStopped) {
            this.isUnfinishedStopped = false;
            _mediator.publish("hideNotificationWindow");
            setTimeout(function () {
                this.onUnfinishGame();
            }.bind(this), 400);
        }
        if (this.isCallNextGameStateStopped) {
            this.isCallNextGameStateStopped = false;
            _mediator.publish("hideNotificationWindow");
            setTimeout(function () {
                this.callNextGameState();
            }.bind(this), 400);
        }
    }.bind(this));
    _mediator.subscribe("setSpaceBarEvent", function (event) {
        this.spaceBarEvent = event;
    }.bind(this));
    window.addEventListener("keyup", this.dealWithKeyboard.bind(this), false);
    window.addEventListener("keypress", this.deakWithSpaceBarHolding.bind(this), false);

    _mediator.subscribe("introScreenHidden", function(){
        setTimeout(function(){
            this.view.callGameinit();
        }.bind(this), 100);
    }.bind(this));
    _mediator.subscribe("windowFocusChanged", function(bool){
        this.isWindowFocused = bool

        _mediator.publish("SHOW_LOG", "winfocuschange "+bool);
        if(bool){
            _sndLib.focusSoundOn();
        }else{
            _sndLib.focusSoundOff();
        }


        if(bool && this.isGamePaused){
            this.isGamePaused = false;
            this.callNextGameState();
        }
    }.bind(this))
    _mediator.subscribe(_events.core.error, function () {
        this.model.isError = true;
    }.bind(this));
    _mediator.subscribe("errorClose", function (data) {
        this.model.isError = false;
        //if reels are not stopped then only enable return true 
        if(!this.allReelsStopped){
            this.errorContinueClicked = true;
        }
        //clear line wins after error 
        this.model.spinData.totalLineWins = [];
        if(data.event){
            _mediator.publish(data.event);
        }else{
            this.callNextGameState();
        }
    }.bind(this));
    // _mediator.subscribe("closeBonus", function(){
    // //To be rechecked later. 
    // //callNextGameState should be called always from here.
    // // if(this.model.getIsFullPFSActive()){
    // //     // this.callNextGameState();
    // //     setTimeout(function(){
    // //         this.callNextGameState();
    // //     }, 100);
    // // }
    // })
    _mediator.subscribe("hideMainGame", function(){
        _mediator.publish("hidePanel", {noEffect: true});
        _mediator.publish("hideMainContainer", {noEffect: true});
        _mediator.publish("hideClockView", {noEffect: true});
        _mediator.publish("hideGameTitle", {noEffect: true});
        _mediator.publish("hidePaytableContainer", {noEffect: true});
    }.bind(this));
    _mediator.subscribe("showMainGame", function(){
        _mediator.publish("showPanel");
        _mediator.publish("showMainContainer");
        _mediator.publish("showClockView");
        _mediator.publish("showGameTitle");
        _mediator.publish("showPaytableContainer");
    }.bind(this));
    _mediator.subscribe("openURL", function(data){
        this.openURL(data.type, data.url);
    }.bind(this));
    this.addSpecificEvents();
};


p.onGambleShowHandler = function (){
    _mediator.publish("clearAllWins");
    _mediator.publish("hideGambleButtonOnClick");
    coreApp.gameModel.gambleData.isGambleActive = false;
    this.model.spinData.totalLineWins = [];
}

p.onShowLog =  function(text){
    //this.view.logTxt.visible = true;
    //this.view.logTxt.text +="\n"+ text;
}
p.openURL = function(type, url){
    if(url){
        window.location.href = url;
    }else{
        switch(type){
            case "lobby": 
                window.location.href = _ng.GameConfig.urls.lobbyURL;
            break;
            case "deposit":
                window.location.href = _ng.GameConfig.urls.depositURL;
            break;
        }
    }
}
p.removeReelView = function(){
    this.view.removeReelView();
}
p.changeReelView = function(){}
p.addSpecificEvents = function () {}
p.updateReelViewUiConfig = function(data){
    this.view.updateReelViewUiConfig(data);
}
p.updateReelSymbolConfig = function(data){
    this.view.updateReelSymbolConfig(data);
}
p.repositionReelView = function(){
    this.view.repositionReelView();
}
p.updateSpinDataReels = function(data){
    this.model.spinData.updateReels(data);
}
p.dealWithKeyboard = function (e) {
    if(e.key === "Escape"){
        _mediator.publish("hideBigWin_click");
        return;
    }
    if (e.keyCode === 32) {
        if (this.checkForSpaceEvent()) {
            _mediator.publish(this.spaceBarEvent);
            _mediator.publish("setSpaceBarEvent", "idle");
        }
    }
    this.isSpaceBarHeld = false;
    if(this.heldSpaceBarTimer){
        clearTimeout(this.heldSpaceBarTimer);
    }
};
p.fireSpaceBarHoldEvent = function(){
    if(this.checkForSpaceEvent() && this.isSpaceBarHeld){
        _mediator.publish(this.spaceBarEvent);
        _mediator.publish("setSpaceBarEvent", "idle");
    }
    this.heldSpaceBarTimer = setTimeout(function(){
        this.fireSpaceBarHoldEvent();
    }.bind(this), 500);
}
p.deakWithSpaceBarHolding = function(e){
    if(e.keyCode === 32 && !this.isSpaceBarHeld){
        this.isSpaceBarHeld = true;
        this.heldSpaceBarTimer = setTimeout(function(){
            this.fireSpaceBarHoldEvent();
        }.bind(this), _ng.GameConfig.spaceBarHoldTimeout);
    }
}
p.checkForSpaceEvent = function () {
    if (this.spaceBarEvent === "idle" || !_ng.isSpaceClickToSpinActive || coreApp.gameModel.isRealityCheckActive || this.model.isError) {
        return false;
    }
    return true;
}
p.onHideNotificationWindow = function () {
    this.view.hideNotificationWindow();
}
p.onShowNotificationWindow = function (options) {
    this.view.showNotificationWindow(options);
}
p.onStopOnAnyWinSelection = function (bool) {
    this.model.autoSpinData.setStopOnAnyWin(bool);
}
p.onStopOnWinLimitSelection = function (bool, val) {
    // console.log("isStopOnWInlimit selected", bool, val);
    // var winLimit = val*this.model.getTotalBet()+this.model.getBalance();
    // console.log("win limit set : ", winLimit);
    this.model.autoSpinData.setASWinLimit(bool, val);
}
p.onStopOnLossLimitSelection = function (bool, val) {
    // console.log("isStopOnLoss selected", bool, val);
    // var lossLimit = this.model.getBalance()- (val*this.model.getTotalBet());
    // console.log("loss limit set : ", lossLimit);

    this.model.autoSpinData.setASLossLimit(bool, val);
}

p.onSpinClick = function (argument) {
    _mediator.publish("closeSettingsPanel");
    _mediator.publish("onHidePaytable");
    // if (this.model.getBalance() < this.model.getTotalBet()) {
    //     _mediator.publish(_events.core.error, { code: "INSUF_BALL_001" });
    //     return;
    // }
    _mediator.publish("setSpaceBarEvent", "idle");
    _mediator.publish("spinStart");
    _mediator.publish("callSpinRequest");
};
p.onHidePaytableContainer = function(data){
    this.view.onHidePaytableContainer(data);
}
p.onShowPaytableContainer = function(){
    this.view.onShowPaytableContainer();
}
p.onHidePopupContainer = function(){
    this.view.onHidePopupContainer();
}
p.onShowPopupContainer = function(){
    this.view.onShowPopupContainer();
}
p.onHidePanel = function (data) {
    this.view.onHidePanel(data);
}
p.onShowPanel = function () {
    this.view.onShowPanel();
}
p.onHideReelView = function (data) {
    this.view.onHideReelView(data);
}
p.onShowReelView = function () {
    this.view.onShowReelView();
}
p.onHideWinView = function (data) {
    this.view.onHideWinView(data);
}
p.onShowWinView = function () {
    this.view.onShowWinView();
}
p.onHideMainContainer = function(data){
    this.view.onHideMainContainer(data);
}
p.onShowMainContainer = function(){
    this.view.onShowMainContainer();
}
p.onHideClockView = function(data){
    this.view.onHideClockView(data);
}
p.onShowClockView = function(){
    this.view.onShowClockView();
}
p.onHideGameTitle = function(data){
    this.view.onHideGameTitle(data);
}
p.onShowGameTitle = function(){
    this.view.onShowGameTitle();
}
p.onStopSpinHandler = function () {
    clearTimeout(this.stopSpinTimeout);
    _mediator.publish("stopSpinNow");
}

p.onBonusGameEnd = function () {
    var totalBonusWin = this.model.getFeatureObject().current_round.win_amount;
    // _mediator.publish("SHOW_TICKER");
    // _mediator.publish("SHOW_TICKER_MESSAGE", pixiLib.getLiteralText("Total bonus won") + ": " + totalBonusWin);
    _mediator.publish("onUpdateWinField", totalBonusWin);
    if(this.model.getIsFullPFSActive()){
        //Setting feature triggered false manually.
        //For bonus round which don't result in freespins
        //Leprechaun's Loot Wheel Bonus
        coreApp.gameModel.spinData.setIsBonusTriggered(false);
        setTimeout(function(){
            this.callNextGameState();
        }.bind(this), 1000);
        return;
    }
    _mediator.publish("EnablePanel");
    _mediator.publish("setSpaceBarEvent", "spinClick");
}

p.onStartAutoSpin = function (count) {
    // console.log(" autospin started ", count);
    this.model.startAutoSpins(count);
    this.requestSpin(false);
    this.updateAutoSpinCount();
}
p.onStopAutoSpin = function (count) {
    // console.log(" autospin started ", count);
    this.model.stopAutoSpins();
}


p.updateAutoSpinCount = function () {
    var count = this.model.getAutoSpinCurrentCount() + 1;
    // console.log(count, "========count ");

    this.model.setAutoSpinCurrentCount(count);
    var asCount = this.model.getAutoSpinTotalCount() - this.model.getAutoSpinCurrentCount();
    _mediator.publish("UPDATE_AUTOSPIN_COUNT", asCount);
    if (count == this.model.getAutoSpinTotalCount()) {
        // this.model.stopAutoSpins();
        _mediator.publish('cancelAutoSpin');
    }
}

p.onTotalBetUpdate = function () {
    _mediator.publish("HIDE_AUTOSPIN_WINDOW");
    _mediator.publish("clearAllWins");
};
p.onSpinResponseHandler = function () {
    //console.log("===============spin response received ");

    //show stop spin button
    //_mediator.publish();

    //stop spin after some delay
    if(_ng.isQuickSpinActive && _ng.quickSpinType==="turbo"){
        this.onStopSpinHandler();
    }else if (_ng.isQuickSpinActive) {
        setTimeout(this.onStopSpinHandler.bind(this), _ng.GameConfig.quickSpinIntervel ? _ng.GameConfig.quickSpinIntervel : 300);
    } else {
        this.stopSpinTimeout = setTimeout(this.stopReels.bind(this), _ng.GameConfig.ReelViewUiConfig.data.reelSpinConfig.reelStopAfterResponseDelay);
    }
    this.onSpecificSpinResponseHandler();
}
p.onSpecificSpinResponseHandler = function () {
}
p.stopReels = function () {
    clearTimeout(this.stopSpinTimeout);
    _mediator.publish("stopSpin");
}
p.onGameInit = function (argument) {
    // console.log(" =====game init response received in slot controller ");
    if(this.model.getIsPFSActive() && !this.isPFSRunning){
        this.isPFSRunning = true;
        _mediator.publish("DisablePanel");
        //Setting this true forcibly.
        this.allReelsStopped = true;
        this.model.updatePanelModel();
        if(this.model.getTotalPFS() == this.model.getRemainingPFS()){
            _mediator.publish(_events.core.error, { code: "PROMO_FREE_SPINS" });
        }else{
            _mediator.publish(_events.core.error, { code: "PROMO_FREE_SPINS_UNFINISHED" });
        }
        return;
    }

    //direct show
    if (this.model.spinData.isSpawningWild) {
        _mediator.publish("showSpawningWild", this.model.spinData.spawningWildReelNum, "initState");
        _mediator.publish("DisablePanel");
        this.model.spinData.isSpawningWild = false;
        return;
    }

    if (this.model.spinData.getIsStickyTriggered()) {
        _mediator.publish("showStickySymbols", "initState");
        this.model.spinData.setIsStickyTriggered(false);
        return;
    }

    if(this.model.spinData.isGameUnfinishedAnimActive){
        _mediator.publish("DisablePanel");
        _mediator.publish("setSpaceBarEvent", "idle");
        this.showGameUnfinishAnimations();
        return;
    }


    //todo check bonus game/
    if (this.model.isFreeSpinActive() || this.model.isReSpinActive() || this.model.isStickyRespinTriggered() || this.model.isStickyRespinActive() || this.model.isFeatureActive() || this.model.isGambleActive()) {
        //show unfinished game popup 
        _mediator.publish("DisablePanel");
        var unfinishedText = (_ng.GameConfig.unfinishedPopupText) ? _ng.GameConfig.unfinishedPopupText : "You have Unfinished Game!";
        _mediator.publish("showErrorMsg", unfinishedText, "continueUnfinishedGame", true);
        // _mediator.publish("setSpaceBarEvent", "continueUnfinishedGame");
        return;
    }


    if(this.isPFSRunning){
        this.callNextGameState();
        return;
    }
    _mediator.publish("EnablePanel");
    _mediator.publish("setSpaceBarEvent", "spinClick");
}
p.showGameUnfinishAnimations = function (){ this.callNextGameState(); }
p.continueAfterGameUnfinishAnimations = function (){
    if (this.model.isFreeSpinActive() || this.model.isReSpinActive() || this.model.isStickyRespinTriggered() || this.model.isStickyRespinActive() || this.model.isFeatureActive() || this.model.isGambleActive()) {
        _mediator.publish("DisablePanel");
        var unfinishedText = (_ng.GameConfig.unfinishedPopupText) ? _ng.GameConfig.unfinishedPopupText : "You have Unfinished Game!";
        _mediator.publish("showErrorMsg", unfinishedText, "continueUnfinishedGame", true);
        return;
    }

    if(this.isPFSRunning){
        this.callNextGameState();
        return;
    }
    _mediator.publish("EnablePanel");
    _mediator.publish("setSpaceBarEvent", "spinClick");
};
p.showNotification = function () {
    //use function to add extra condition when required to load
    //all secondary assets before any feature game/Freespin
    return false;
}
p.onUnfinishGame = function () {
    _mediator.publish("DisablePanel");
    if (this.showNotification() && !_viewInfoUtil.isSecondaryAssetsLoaded) {
        this.isUnfinishedStopped = true;
        _mediator.publish("showNotificationWindow", { alpha: 0.85 });
        return;
    }
    if (this.model.spinData.isBonusFreatureMSG && this.model.spinData.bonusFreatureMSGType != "200bets") {
        _mediator.publish("showFeatureAwardedMSG", this.model.spinData.bonusFreatureMSGType);
        return;
    }
    if (this.model.isFreeSpinActive()) {
        _mediator.publish("SHOW_TICKER");
        var leftValue = (this.model.getTotalFreeSpins() - this.model.getFreeSpinCurrentCount()) + 1;
        _mediator.publish("SHOW_TICKER_MESSAGE", pixiLib.getLiteralText("Free spins") + ": " + leftValue + "/" + this.model.getTotalFreeSpins());
        _mediator.publish("unfinishedFreeSpins");

        // if (this.model.spinData.isProgressbarActive) {
        //     _mediator.publish("updateProgressBar", this.model.spinData.bar_value, this.model.spinData.current_level);
        //     return;
        // }
    }

    if (this.model.getFeatureParentType() === "freespins" || this.model.getFeatureParentType() === "freespin") {
        _mediator.publish("unfinishedFreeSpins");
    }
    
    this.onSpecificUnfinishGame();
}


p.onSpecificUnfinishGame = function () {
    this.callNextGameState();
}
p.onUnfinishedFreeSpins = function () {
    _sndLib.playBg(_sndLib.sprite.bgFS);
}

p.onFSEndShown = function (argument) {
    this.model.freeSpinData.setFullFSActiveStatus(false);
    this.model.freeSpinData.setFreeSpinEnded(false);
    _sndLib.playBg(_sndLib.sprite.bg);

    if (this.model.spinData.postFeatureActivity == true) {
        this.postFreespinsActivity();
    }
    //To be rechecked later. 
    //callNextGameState should be called always from here.
    if(this.model.getIsFullPFSActive()){
        this.callNextGameState();
    }else{
        //Added extra Check to support previous games.
        //All Freespins should publish callNextGameState here
        //Enabling/Disabling or any feature trigger will be taken care in callNextGameState
        if(_ng.GameConfig.callNextGameStateAfterFreespins){
            _mediator.publish("callNextGameState");
        }else{
            if (this.model.obj.next_round.type) {
                _mediator.publish("DisablePanel");
            }else{
                _mediator.publish("EnablePanel");
                _mediator.publish("setSpaceBarEvent", "spinClick");
            }
        }
    }
}
p.onStartFreespins = function (delay) {
    this.model.setIsFreeSpinTriggered(false);
    _sndLib.playBg(_sndLib.sprite.bgFS);
    _mediator.publish("FreeSpinsStarted");
    if(delay !== undefined){
        setTimeout(this.callNextGameState.bind(this), delay);
    }else{
        setTimeout(this.callNextGameState.bind(this), 200);
    }
}
p.requestSpin = function (isFree, isReSpin) {
    if(this.model.isError){ return; }

    _mediator.publish("setSpaceBarEvent", "idle");
    if (isFree) {
        _mediator.publish("callFreeSpinRequest");
        _mediator.publish("spinStart", true);
    } else if (isReSpin == "callReSpinRequest") {
        _mediator.publish("spinStart", true);
        _mediator.publish("callReSpinRequest");
    } else {
        _mediator.publish("spinStart", false);
        _mediator.publish("callSpinRequest");
    }
}
p.checkFeatureAssets = function (feature) {
    if (!_viewInfoUtil.isSecondaryAssetsLoaded && _ng.GameConfig.featuresWithSecondaryAssets.indexOf(feature) > -1) {
        this.isCallNextGameStateStopped = true;
        _mediator.publish("showNotificationWindow", { alpha: 0.85 });
        return true;
    }
    return false;
}
p.callGameActivity = function(){
    
}
p.callNextGameState = function () {
    if(this.model.isError){ return; }

    if(this.model.isGambleActive()){
        _mediator.publish("SHOW_GAMBLE");
        this.model.gambleData.isGambleInitActive = false;
        this.model.spinData.totalLineWins = [];
        return;
    }



    if(!this.isWindowFocused){
        console.log("Stopping game: ", this.isWindowFocused);
        this.isGamePaused = true;
        return;
    }
    if(this.model.spinData.preFeatureActivity==true){
        this.callGameActivity();
        return;
    }
    // publish playSpecialGameStateAnimation for any triggering animation
    // publish specialGameStateAnimationCompleted, when required animation is completed.
    if (this.model.isStickyRespinTriggered() || this.model.isStickyRespinActive()) {
        if (this.checkFeatureAssets("stickyRespin")) { return; }
        _mediator.publish("clearAllWins");

        // commented for test on respin playing freespin bg
        // if (this.model.getFeatureParentType() === "freespins" || this.model.getFeatureParentType() === "freespin") {
        //     _mediator.publish("unfinishedFreeSpins");
        // }

        if (!this.gameStateAnimation) {
            setTimeout(function () {
                _mediator.publish("playSpecialGameStateAnimation", { type: "stickyRespin", symbolPositions: this.model.getStickyRSSymbols(), matrix: this.model.getReelMatrix() });
            }.bind(this), this.specialGameStateAnimationDelay);
            this.gameStateAnimation = true;
            return;
        }

        this.requestSpin(false, "callReSpinRequest");
        this.gameStateAnimation = false;

        this.beforeOnAllReelStopped = function () {
            if (!this.model.isStickyRespinTriggered() && !this.model.isStickyRespinActive()) {
                _mediator.publish("removeStickySymbols");
                this.beforeOnAllReelStopped = function () { };
            }
        }
    } else if (this.model.isReSpinActive()) {
        if (this.checkFeatureAssets("respin")) { return; }
        _mediator.publish("clearAllWins");
        if (_ng.GameConfig.showRespinPopup) {
            _mediator.publish("clearAllWins");
            if (this.model.getIsRespinTriggered()) {
                setTimeout(function () {
                    _mediator.publish("playSpecialGameStateAnimation", { type: "stickyRespin", symbolPositions: this.model.getStickyRSSymbols(), matrix: this.model.getReelMatrix() });
                }.bind(this), this.specialGameStateAnimationDelay);
                this.model.setIsRespinTriggered(false);
                return;
            }
            this.requestSpin(false, "callReSpinRequest");
        } else {
            this.requestSpin(false, "callReSpinRequest");
        }
    }
    else if (this.model.getIsFreeSpinEnded()) {
        this.handleFSEnd();
    }
    else if (this.model.isFeatureActive()) {
        this.showFeatureGame();
    } else if (this.model.getIsFreeSpinTriggered()) {
        if (this.checkFeatureAssets("freespins")) { return; }
        this.model.stopAutoSpins();
        _mediator.publish("cancelAutoSpin");
        _mediator.publish("clearAllWins");

        if (!this.gameStateAnimation) {
            setTimeout(function () {
                _mediator.publish("playBonusSymbolAnimation", { bonusID: 100, reelMatrix: this.model.getReelMatrix() });
            }.bind(this), 500);
            this.gameStateAnimation = true;
        } else {
            this.gameStateAnimation = false;
            setTimeout(function () { _mediator.publish("showFreeSpinAwarded"); }, 100);
        }
    }else if (this.model.isFreeSpinActive()) {
        if (this.checkFeatureAssets("freespins")) { return; }
        _mediator.publish("clearAllWins");
        _mediator.publish("SHOW_TICKER");

        var leftValue = (this.model.getTotalFreeSpins() - this.model.getFreeSpinCurrentCount()) + 1;
        _mediator.publish("SHOW_TICKER_MESSAGE", pixiLib.getLiteralText("Free spins") + ": " + leftValue + "/" + this.model.getTotalFreeSpins());

        this.requestSpin(true);
    }else if (this.model.getIsPFSEnded()){
        setTimeout(function(){
            _mediator.publish(_events.core.error, { code: "PROMO_FREE_SPINS_ENDED" });
        }, 1500);
    }else if (this.model.getIsPFSActive()){
        _mediator.publish("clearAllWins");
        var delay = 0;
        _mediator.publish("SHOW_TICKER");
        if(this.model.getIsPFSTriggered()){
            _mediator.publish("SHOW_TICKER_MESSAGE", "Starting Bonus free spins");
            delay = 500;
        }
        setTimeout(function(){
            var leftValue = (this.model.getTotalPFS() - this.model.getRemainingPFS()) + 1;
            var msg = "";
            msg += pixiLib.getLiteralText("Bonus free spins") + ": " + leftValue + "/" + this.model.getTotalPFS();
            msg += "                        ";
            msg += "Total win: " + pixiLib.getFormattedAmount(this.model.getTotalPFSWin());
            _mediator.publish("SHOW_TICKER_MESSAGE", msg);
            this.requestSpin(false);
        }.bind(this), delay);
    }else if (this.model.isAutoSpinActive()) {
        _mediator.publish("clearAllWins");
        this.updateAutoSpinCount();
        this.requestSpin(false);
    } else if (this.isSpaceBarHeld) {
        _mediator.publish("clearAllWins");
        this.requestSpin(false);
    } else {
        _mediator.publish("setSpaceBarEvent", "spinClick");
        _mediator.publish("EnablePanel");

        if (!this.model.isAutoSpinActive() || !this.model.isFullFSActive()) {
            _sndLib.highBg();
        }
        
        if (this.model.getTotalWinLines() && this.model.getTotalWinLines().length > 0) {
            _mediator.publish("showAlternateLineWins");
        }
    }
}
p.showFeatureGame = function(){
    if (this.checkFeatureAssets("feature")) { return; }
    coreApp.gameModel.stopAutoSpins();
    _mediator.publish("cancelAutoSpin");
    _mediator.publish("clearAllWins");

    if (this.model.getFeatureParentType() === "freespins" || this.model.getFeatureParentType() === "freespin") {
        _mediator.publish("unfinishedFreeSpins");
    }

    if (!this.gameStateAnimation && this.checkForBonusSymbolAnimation()) {
        setTimeout(function () {
            _mediator.publish("playBonusSymbolAnimation", { bonusID: this.model.getFeatureObject().bonus_game_id, reelMatrix: this.model.getReelMatrix() });
        }.bind(this), 1000);
        this.gameStateAnimation = true;
    } else {
        this.gameStateAnimation = false;
        this.createFeatureAwardText();
    }
}
p.createFeatureAwardText = function () {
    try{
        var ss = _ng.GameConfig.bonusGames[this.model.getFeatureObject().bonus_game_id].name;
    }catch(e){
        _mediator.publish("showBonusAwardedMsg", "You won bonus game");
        return;
    }

    if (_ng.GameConfig.bonusGames[this.model.getFeatureObject().bonus_game_id] && _ng.GameConfig.bonusGames[this.model.getFeatureObject().bonus_game_id].name) {
        if (_ng.GameConfig.bonusAwardText) {
           var mText = pixiLib.getLiteralText("CONGRATULATIONS!");
           mText += "\n " + "\n "+ pixiLib.getLiteralText("YOU WON");
           mText += "\n " + "\n " + pixiLib.getLiteralText(_ng.GameConfig.bonusGames[this.model.getFeatureObject().bonus_game_id].name + " ROUND");
           _mediator.publish("showBonusAwardedMsg", mText);
        } else {
            var mText = pixiLib.getLiteralText("Congratulations!");
            mText += "\n " + pixiLib.getLiteralText("You won");
            mText += "\n " + pixiLib.getLiteralText(_ng.GameConfig.bonusGames[this.model.getFeatureObject().bonus_game_id].name + " round");
            _mediator.publish("showBonusAwardedMsg", mText);
        }
    } else {
        _mediator.publish("showBonusAwardedMsg", "You won bonus game");
    }
}
p.handleFSEnd = function(){
    _mediator.publish("clearAllWins");
    setTimeout(function () {
        _mediator.publish("HIDE_TICKER");
        if (this.model.getTotalFSWin() > 0) {
            _mediator.publish("showFreeSpinEnded");            
        } else {
            if(commonConfig.showFSPopupWithZeroWins){
                _mediator.publish("showFreeSpinEndedZeroBalance", {eventsToPublish: ["EnablePanel", "onFSEndShown"]});
            }else{
                _mediator.publish("EnablePanel");
                _mediator.publish("onFSEndShown");
            }
        }
    }.bind(this), 1000);
}
p.postFreespinsActivity = function(){
    this.model.spinData.postFeatureActivity = false;
}
p.checkForBonusSymbolAnimation = function () {
    return true;
};
p.beforeOnAllReelStopped = function () { };
p.onInsufficientFunds = function () {
    _mediator.publish(_events.core.error, { code: "INSUF_BALL_001" });
}
p.onDisconnections = function () {
    _mediator.publish(_events.core.error, { code: "NO_INTERNET" });
}
p.onAllReelStopped = function () {
    this.allReelsStopped = true;
    if(_ng.singleQuickSpin){
        _ng.singleQuickSpin = false;
        _ng.isQuickSpinActive = false;
    }
    if(this.model.isError || this.errorContinueClicked){ 
        this.errorContinueClicked = false;
        return;         
    }
    if(this.checkForSpecialAnimations()){ return; }

    if (this.model.spinData.isBonusFeatureWin) {
        _mediator.publish("onUpdateProgressCount", this.model.spinData.bonusFeatureWinCount);
    }

    this.beforeOnAllReelStopped();

    if (this.model.getWildMultiplier() > 0 && _ng.GameConfig.showWildMultiplierAnimation) {
        _mediator.publish("showWildMultiplier", this.model.getWildMultiplier());
        return;
    }

    if (this.model.spinData.isSpawningWild) {
        _mediator.publish("showSpawningWild", this.model.spinData.spawningWildReelNum);
        return;
    }

    if (this.model.spinData.isWalkingWild) {
        _mediator.publish("showWalkingWild", this.model.spinData.walkingWildReelNum);
        return;
    }


    this.checkLossLimit();

    if (this.model.spinData.getTotalWinAmount() > 0) {
        if (this.model.autoSpinData.getIsStopOnAnyWin()) {
            coreApp.gameModel.stopAutoSpins();
            _mediator.publish("cancelAutoSpin");
        }
        this.checkWinLimit();
        _mediator.publish((this.model.isBigWinActive()) ? "showBigWins" : "showTotalWin");
       
        if (this.model.isAutoSpinActive() || this.model.isFullFSActive() || this.isSpaceBarHeld || coreApp.gameModel.isFeatureActive()) {
            _mediator.publish("showPanelWin");
        }
    } else {
        setTimeout(this.callNextGameState.bind(this), 200);
    }
}
p.checkForSpecialAnimations = function(){
    return false;
}
p.checkLossLimit = function (state) {
    if (this.model.autoSpinData.getIsASLossLimitActive() && (Number(this.model.getBalance()) <= Number(this.model.autoSpinData.getIsASLossLimitValue()))) {
        coreApp.gameModel.stopAutoSpins();
        _mediator.publish("cancelAutoSpin");
    }
}

p.checkWinLimit = function (state) {
    if (this.model.autoSpinData.getIsASWinLimitActive() && (Number(this.model.spinData.getTotalWinAmount()) >= Number(this.model.autoSpinData.getIsASWinLimitValue()))) {
        coreApp.gameModel.stopAutoSpins();
        _mediator.publish("cancelAutoSpin");
    }
}
p.postMatrixCheck = function (state) {
    if(this.model.isError){ return; }
    //we need to set post matrtix in original matrix
    this.model.spinData.setPostMatrix();
    this.checkLossLimit();

    //after expanding added 
    if (state == "initState") {
        this.onGameInit();
        return;
    } else if (state === "postWinActivity") {
        setTimeout(this.callNextGameState.bind(this), 200);
    } else if (this.model.spinData.getTotalWinAmount() > 0) {
        if (this.model.autoSpinData.getIsStopOnAnyWin()) {
            coreApp.gameModel.stopAutoSpins();
            _mediator.publish("cancelAutoSpin");
        }
        this.checkWinLimit();
        _mediator.publish((this.model.isBigWinActive()) ? "showBigWins" : "showTotalWin");
       
        if (this.model.isAutoSpinActive() || this.model.isFullFSActive() || this.isSpaceBarHeld || coreApp.gameModel.isFeatureActive()) {
            _mediator.publish("showPanelWin");
        }
    } else {
        setTimeout(this.callNextGameState.bind(this), 200);
    }
}

p.onSpinClickHandler = function (isFreeSpin) {
    this.allReelsStopped = false;
    _mediator.publish("clearAllWins");
    if (isFreeSpin != true) {
        this.model.setAllTotalBet(this.model.getTotalBet());
        this.model.setBalance(this.model.getBalance() - (this.model.getTotalBet()));
        _mediator.publish(_events.slot.updateBalance);
    }
    _mediator.publish("DisablePanel");
    if (_sndLib.isLowBg && (!coreApp.gameModel.isAutoSpinActive() && !coreApp.gameModel.isFullFSActive())) {
        _sndLib.lowBg();
    }
}
p.onBigWinShown = function (argument) {
    var waitTimer = 100;
    if ((coreApp.gameModel.isAutoSpinActive() || coreApp.gameModel.isFullFSActive()) && coreApp.gameModel.isBigWinActive()) {
        waitTimer = 1100;
    }
    _mediator.publish(_events.slot.updateBalance);
    setTimeout(this.callNextGameState.bind(this), waitTimer);
}
p.onTotalWinShown = function (argument) {
    _mediator.publish("clearAllWins", { from: "onTotalWinShown" });
    setTimeout(this.callNextGameState.bind(this), 200);
}
p.onAlternateLineWinsShownOnce = function (argument) {}
p.onLineValueUpdated = function (data) {
    var index = data.index;
    var value = ++index;
    this.panelModel.setPaylineValue(value);
}
p.onCoinValueUpdated = function (data) {
    var index = data.index;
    this.panelModel.setBetIndex(index);
};
p.reloadGame = function () {
    location.reload();
}
p.onGambleEnd = function (){
    if(coreApp.gameModel.gambleData.winAmount>0){
        coreApp.gameModel.spinData.totalWin = coreApp.gameModel.gambleData.winAmount;
        _mediator.publish("showPanelWin");
    }
    _mediator.publish(_events.slot.updateBalance);
    this.callNextGameState();
}