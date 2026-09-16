// var _ng = _ng || {};
var gSC = _ng.SlotController.prototype;

gSC.addEvents = function () {
    cc.addEvents.call(this);
    _mediator.subscribe("SHOW_LOG", this.onShowLog.bind(this));

    _mediator.subscribe("spinStart", this.onSpinClickHandler.bind(this));
    _mediator.subscribe("onSpinResponse", this.onSpinResponseHandler.bind(this));
    _mediator.subscribe("STOP_SPIN_NOW", this.onStopSpinHandler.bind(this));
    _mediator.subscribe("allReelsStopped", this.onAllReelStopped.bind(this));
    _mediator.subscribe("onAllTumblesComplete", this.onAllTumblesComplete.bind(this));
    _mediator.subscribe("showTumbleWin", this.showTumbleWin.bind(this));
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
    _mediator.subscribe("checkExtraFreeSpinAward", this.checkExtraFreeSpinAward.bind(this));


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

    // _mediator.subscribe("hidePromoView", this.onHidePromoView.bind(this));    /*FOR PROMO TOP STRIP VIEW*/
    // _mediator.subscribe("showPromoView", this.onShowPromoView.bind(this));    /*FOR PROMO TOP STRIP VIEW*/
    // _mediator.subscribe("destroyPromoView", this.onDestroyPromoView.bind(this));    /*FOR PROMO TOP STRIP VIEW*/

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
    // window.addEventListener("keypress", this.deakWithSpaceBarHolding.bind(this), false);

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

        this.errorContinueClicked = true;
         _mediator.publish("setSpaceBarEvent", "spinClick");/* Subscribed in ExternalUI */
        //clear line wins after error 
        this.model.spinData.totalLineWins = [];
        if(data.event){
            _mediator.publish(data.event);
        }else{
            this.callNextGameState();
        }
    }.bind(this));
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
    this.pendingExtraFs = false;
};

gSC.onGameInit = function (argument) {
    // console.log(" =====game init response received in slot controller ");
    _ng.externalUiController.betUi.updateUi(coreApp.gameModel.getTotalBet());
    if(this.model.getIsPFSActive() && !this.isPFSRunning){
        this.isPFSRunning = true;
        _mediator.publish("DisablePanel");
        //Setting this true forcibly.
        this.allReelsStopped = true;
        this.model.updatePanelModel();
        // Always show unfinishedPromoFreeSpin panel (no "USE LATER" button)
        _mediator.publish("unfinishedPromoFreeSpin");
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

     if (this.model.spinData.isGambleFeatureActive()) {
         _mediator.publish("unfinishedFreeSpins");
         _mediator.publish("setRemainingFSpins", "0");
         _mediator.publish("setFsPlayedcnt",coreApp.gameModel.obj.gamble_recovery_data.bonus_game_total_rounds);/* TODO: MAKE IT DYNAMIC */
         this.changeContainerBg(true);
         _mediator.publish("showFreeSpinEnded");
         _mediator.publish("disableBuyFeature");
         _mediator.publish("setSpaceBarEvent", "idle");
         _mediator.publish("_hideAndShowOfTwoXButton", true);

        return;
    }

    if(this.model.spinData.isGameUnfinishedAnimActive){
        _mediator.publish("DisablePanel");
        _mediator.publish("setSpaceBarEvent", "idle");
        this.showGameUnfinishAnimations();
        return;
    }

    // Check if in history mode - priority: is_ante_bet > is_buy_feature > is_bonus
    const urlParams = new URLSearchParams(window.location.search);
    const hasRoundId = urlParams.has('round_id');
    const isInHistoryMode = hasRoundId;
    // Safety check: ensure model exists before accessing it
    if (!this.model) {
        // setTimeout(() => {
        //     this.onGameInit();
        // }, 500);
        window.alert("Model not found");
        return;
    }

    // Check for unfinished game states OR history mode
    const hasUnfinishedGame = this.model.isFreeSpinActive() || this.model.isReSpinActive() || this.model.isStickyRespinTriggered() ||
        this.model.isStickyRespinActive() || this.model.isFeatureActive() || this.model.isGambleActive();

    if (hasUnfinishedGame || isInHistoryMode) {
        // CRITICAL: Prevent popup from showing again if user already clicked continue
        if (this._unfinishedGameContinueClicked) {
            // User already clicked continue, don't show popup again
            // Continue with normal game flow
            if (!this.isPFSRunning && this.model) {
                if (this.model.getIsPFSEnded && !this.model.getIsPFSEnded()) {
                    _mediator.publish("EnablePanel");
                }
                _mediator.publish("setSpaceBarEvent", "spinClick");
            }
            return;
        }
        
        // Prevent multiple popups - if history popup was already shown, don't show it again
        if (isInHistoryMode && this._historyPopupShown) {
            // This ensures the game finishes initializing
            if (!this.isPFSRunning && this.model) {
                if (this.model.getIsPFSEnded && !this.model.getIsPFSEnded()) {
                    _mediator.publish("EnablePanel");
                }
                _mediator.publish("setSpaceBarEvent", "spinClick");
            }
            return;
        }

        // Check if popup container exists (game view must be initialized)
        // gameCreationCompleted must be called first for popupContainer to exist
        if (!coreApp || !coreApp.gameView || !coreApp.gameView.popupContainer) {
            // Optimized retry delay for smoother experience
            setTimeout(() => {
                this.onGameInit();
            }, 500); // Reduced delay to 500ms for faster retry
            return;
        }

        _mediator.publish("DisablePanel");

        // Show different message in history mode
        let messageText;
        if (isInHistoryMode) {
             messageText = pixiLib.getLiteralText("DOYOUWANTTOSEEHISTORY?");

            // Set flag to prevent showing popup again - ONLY when popup is actually shown
            this._historyPopupShown = true;
        } else {
            // Safety check for coreLiterals
            if (typeof coreLiterals !== 'undefined' && coreLiterals.unFinishedText) {
                messageText = coreLiterals.unFinishedText;
            } else {
                messageText = gameLiterals.unfinished; // Fallback message
            }
        }
        
        _mediator.publish("showErrorMsg", messageText, "continueUnfinishedGame", true);
        return;
    }


    if(this.isPFSRunning){
        this.callNextGameState();
        return;
    }
    // Don't enable panel if PFS ended
    if (!this.model.getIsPFSEnded()) {
        _mediator.publish("EnablePanel");
    }
    _mediator.publish("setSpaceBarEvent", "spinClick");
}


gSC.addSpecificEvents = function () {

    this.WasSpaceHeld=false;
    this.allReelsStopped = true;
    this.allTumbleFinished = true;
    
    //SID UNCOMMIT
   _ng.isForceAllowed=true;
    _mediator.subscribe("AllTumbleFinish",this.AllTumbleFinish.bind(this));
    _mediator.subscribe("continueAutoSpin",this.continueAutoSpin.bind(this));
    _mediator.subscribe("triggerAllWinAnimation",this.triggerAllWinAnimation.bind(this));

    _ng.twoXBetEnabled = false;
    _ng.autoPlayBeforeFg = false;
    _ng.autoPlayPrevCount = 0;
    
    this.spaceBarClickCount = 0;
    this.spaceBarClickInterval = setInterval(() => {
        this.spaceBarClickCount = 0;
    }, 3000);
   
}

/*windows key up event*/
gSC.dealWithKeyboard = function (e) {
   /*  if (e.key === "Escape") {
        _mediator.publish("hideBigWin_click");
        return;
    } */
    if (e.keyCode === 32) {
        switch (coreApp.CURRENTACTIVEPOPUP) {
            case "congratulations_awarded":
                _mediator.publish("onFSContinueClick");
                break;
            case "congratulations_rewarded":
                // _mediator.publish("showGamblePopup");
                break;
            case "bigwinview":
                _mediator.publish("hideBigWin_click");
                break;
            default:
                break;
        }
    }
    this.WasSpaceHeld = false;
    this.isSpaceBarHeld = false;
    if (this.heldSpaceBarTimer) {
        clearTimeout(this.heldSpaceBarTimer);
    }
};

gSC.fireSpaceBarHoldEvent = function(firstTime){
    if(this.checkForSpaceEvent() && this.isSpaceBarHeld){
        _mediator.publish(this.spaceBarEvent);
        _mediator.publish("setSpaceBarEvent", "idle");
    }

    this.heldSpaceBarTimer = setTimeout(function(){
        this.fireSpaceBarHoldEvent(false);
    }.bind(this), 500);
    if(!this.isWindowFocused)
    {
        _ng.isQuickSpinActive=false;
        this.isSpaceBarHeld=false;
         this.WasSpaceHeld=false;
    }

    if(!_ng.isQuickSpinActive  && firstTime){
    this.checkReelsStopped=setInterval(function(){
        if(this.allReelsStopped && this.isSpaceBarHeld  && this.WasSpaceHeld)
            {
                // console.log("Space bar hold activated")
                _ng.isQuickSpinActive=true;
                console.log("QUICK SPIN ACTIVATE")
                clearInterval(this.checkReelsStopped);
            }
    }.bind(this),20)
    }
}
gSC.deakWithSpaceBarHolding = function(e){
    if(e.keyCode === 32 && !this.isSpaceBarHeld){
        this.isSpaceBarHeld = true;

        /* for showing quick spin info popup */
        if(!_ng.GameConfig.quickSpinInfoPopupShown)
            this.quickSpinInfoOnSpaceBar();

        this.heldSpaceBarTimer = setTimeout(function(){
            
            if(!_ng.isQuickSpinActive)
            {
                this.WasSpaceHeld=true;
            }
            console.log(" ACTIVATE")
            this.fireSpaceBarHoldEvent(true);
        }.bind(this), _ng.GameConfig.spaceBarHoldTimeout);
    }
}
gSC.onAllReelStopped = async function () {
    if(this.model.isError || this.errorContinueClicked){ 
        this.errorContinueClicked = false;
        this.allReelsStopped = true;
        // _mediator.publish("cancelAutoSpin");
        this.autoSpinTriggered = false;
        return;         
    }
    if(quickBtnSettingsStatus){
        _ng.isQuickSpinActive=true;
    }
    if(_viewInfoUtil.viewType=="VP" ||_viewInfoUtil.viewType=="VL"){
        _mediator.publish("toggleStopSpinBg",false)
    }
    if (coreApp.gameModel.obj.current_round.spin_type != "freespin") {
        if (!coreApp.gameModel.isAutoSpinActive() && coreApp.gameModel.obj.current_round.win_amount == 0) {
            _mediator.publish("SHOW_IDLE_MESSAGE");  
        }   
    }
    _mediator.publish('showMultipler', this.model.spinData.proMulti);
    /* GOLD FEATURE */
    if (coreApp.gameModel.obj.current_round.spin_type !== "freespin" && coreApp.gameModel.obj.current_round.misc_prizes.count == 0 && coreApp.gameModel.obj.current_round.post_matrix_info.has_gold) {
        
    }else{

        _mediator.publish("callPostMatrixAction");
    }

    if (coreApp.gameModel.obj.current_round.spin_type == "freespin") {
        _mediator.publish("checkExtraFreeSpinAward"); 
    }

     _mediator.publish("DisablePanel");
    if (coreApp.gameModel.obj.current_round.misc_prizes.count == 0) {
        this.allReelsStopped = true;
        if (coreApp.gameModel.isAutoSpinActive() == true) {
            _mediator.publish("ToggleMobPanel", false);
            _mediator.publish("ToggleSpin", false)
        }
        if (coreApp.gameModel.isAutoSpinActive() == false && coreApp.gameModel.isFullFSActive() == false) {
            // Between spins, prevent enabling spin when PFS is active or ending
            if (this.model && this.model.getIsPFSActive && (this.model.getIsPFSActive() || this.model.getIsPFSEnded && this.model.getIsPFSEnded())) {
                _mediator.publish("ToggleSpin", false);
            } else {
                _mediator.publish("ToggleSpin", true);
            }
        }
        _mediator.publish("AllTumbleFinish", 0);

        // if (!coreApp.gameModel.isFullFSActive() && !coreApp.gameModel.getIsPFSActive()) {
        //     _mediator.publish("enableBuyFeature");
        //     _mediator.publish("checkBalanceForBuyFeature");
        // }
        if (coreApp.gameModel.isFullFSActive() == true) {
            _mediator.publish("ToggleMobPanel", false);
            _mediator.publish("ToggleSpin", false);

        }

    }
    if (coreApp.gameModel.obj.current_round.misc_prizes.count != 0 && coreApp.gameModel.obj.current_round.payline_wins && coreApp.gameModel.obj.current_round.payline_wins.details && coreApp.gameModel.obj.current_round.payline_wins.details != "") {
        this.winArr = [];
        this.winHisArr = [];
        this.symbolpop = [];
        this.histSymbol = [];
        var symbols = [];
        this.newArray = [];
        var oneArr = coreApp.gameModel.obj.current_round.payline_wins.details.split(";");
        for (var k = 0; k < oneArr.length; k++) {
            var temp = oneArr[k].split(":");
            this.winArr.push(temp[1]);
            this.winHisArr.push(temp[1]);
            this.symbolpop.push(temp[3]);
            this.histSymbol.push(temp[4]);
            let neededValues = [parseInt(temp[3]), temp[4]];
            this.newArray.push(neededValues);
        }
        for (var i = 0; i < coreApp.gameModel.obj.current_round.misc_prizes.count; i++) {
            for (k = 0; k < coreApp.gameModel.obj.current_round.misc_prizes[i+1].old_reel_symbol.length; k++) { // +1 is added for cash caravan because misc_prizes index start from 1 in response...
                symbols.push(coreApp.gameModel.obj.current_round.misc_prizes[i+1].old_reel_symbol[k])
            }
        }
        _mediator.publish("getTotalwin", this.winArr);
    }


    if (coreApp.gameModel.obj.current_round.misc_prizes!="" &&coreApp.gameModel.obj.current_round.misc_prizes.count > 0) {
        this.view.reelView.performTumble();
    }
}
        
gSC.AllTumbleFinish = function (num,reelID) {
    this.num = num;
    this.reelID = reelID;
    //with tumbles
    if ((num+1 == coreApp.gameModel.obj.current_round.misc_prizes.count) && reelID==5) {
            _mediator.publish("createSticky");/* todo:remove later */
            _mediator.publish("hideFakeButton");
            this.allTumbleFinished = true;
            
            if (!coreApp.gameModel.isFreeSpinActive() && coreApp.gameModel.obj.current_round.spin_type =="normal") {
                _mediator.publish("ToggleTurbo",true);
                if (this.autoSpinTriggered == true && this.currentAutoSpinCount == 0 &&(coreApp.gameModel.getAutoSpinCurrentCount() == coreApp.gameModel.getAutoSpinTotalCount())) {
                    this.autoSpinTriggered = false;
                    if(_ng.GameConfig.TurboOn)
                        {
                            _ng.GameConfig.FastAnim=false;
                            _ng.isQuickSpinActive = false;
                        }
                    setTimeout(() => {
                        
                                _mediator.publish("toggleAutoSpinOptions",true); 
                                _mediator.publish("ToggleSpin",false);   
                            }, 1500);
                  }   
            }
            if(!coreApp.gameModel.obj.current_round.post_matrix_info.multiplier){
                //AFTER TUMBLE FINISH..
                this.triggerAllWinAnimation();
            }
    }

    else if(num == coreApp.gameModel.obj.current_round.misc_prizes.count){
            _mediator.publish("createSticky");/* todo: remove later */
            _mediator.publish("hideFakeButton");
            this.allTumbleFinished = true;
            if (!coreApp.gameModel.isFreeSpinActive() && coreApp.gameModel.obj.current_round.spin_type =="normal") {
                _mediator.publish("ToggleTurbo",true);
                if (this.autoSpinTriggered == true && this.currentAutoSpinCount == 0 &&(coreApp.gameModel.getAutoSpinCurrentCount() == coreApp.gameModel.getAutoSpinTotalCount())) {
                    this.autoSpinTriggered = false;
                    if(_ng.GameConfig.TurboOn)
                        {
                             _ng.GameConfig.FastAnim=false;
                             _ng.isQuickSpinActive = false;
                        }
                    setTimeout(() => {
                        
                                _mediator.publish("toggleAutoSpinOptions",true); 
                                _mediator.publish("ToggleSpin",false);   
                            }, 500);
                  }
                  
            }

    }


}
gSC.onStartFreespins = function (delay) {
    // If buy bonus (freespins) is starting during PFS, hide the PFS UI
    if (this.isPFSRunning || this.model.PFSData.remainingPromoFreeSpins > 0) {
        _mediator.publish("hidePromoView");
        this.isPFSRunning = false; // Stop PFS running flag
    }
    
    this.model.setIsFreeSpinTriggered(false);
    this.autoSpinTriggered = false;
    if(_ng.GameConfig.TurboOn)
        {
            _ng.isQuickSpinActive = false;
            _ng.GameConfig.FastAnim = false;
        }
    _sndLib.playBg(_sndLib.sprite.bgFS);
    _mediator.publish("FreeSpinsStarted");
    if(delay !== undefined){
        setTimeout(this.callNextGameState.bind(this), delay);
    }else{

        setTimeout(this.callNextGameState.bind(this), 200);
    }
    this.changeContainerBg(true);
}
// gSC.delayBigwin= function(){
//     _mediator.publish("EnablePanel");
//     //delaying big wins animation until tumble gets over
//     if ((this.num+1 == coreApp.gameModel.obj.current_round.misc_prizes.count) && this.reelID==5) {
//         _mediator.publish((this.model.isBigWinActive()) ? "showBigWins" : "showTotalWin");
// }
// else if(this.num == coreApp.gameModel.obj.current_round.misc_prizes.count){
//         _mediator.publish((this.model.isBigWinActive()) ? "showBigWins" : "showTotalWin");
//    }

// ///////////////////////////////////////////////////////////////////
// }
        
        
     




gSC.onBigWinShown = function (argument) {
    var waitTimer = ((coreApp.gameModel.isAutoSpinActive() || coreApp.gameModel.isFullFSActive()) && coreApp.gameModel.isBigWinActive()) ? 1100 : 100;
    setTimeout(this.callNextGameState.bind(this), waitTimer);
}
gSC.onTotalWinShown = function (argument) {
    // Monitor changes in _ng.isForceAllowed to kill and restart tweens
    const checkallReelsStopped = setInterval(function () {
        if (this.allReelsStopped) {
            _mediator.publish("clearAllWins", { from: "onTotalWinShown" });
            if (_ng.GameConfig.FastAnim) {
                    //WIN
                    if(coreApp.gameModel.obj.current_round.misc_prizes.count){
                    //1.MULTIPLIER
                    //2.ALL WIN TRIGGER
                    //3.SCATTER 
                    // this.callNextGameState();
                    _mediator.publish("onBigWinShown");

                }else{
                //NO WIN
                }
                
            }
            else {
                //NORMAL SPIN 

                //WIN
                if(coreApp.gameModel.obj.current_round.misc_prizes.count){
                    //1.MULTIPLIER
                    //2.ALL WIN TRIGGER
                    //3.SCATTER 
                    // this.callNextGameState();
                    _mediator.publish("onBigWinShown");

                }else{
                //NO WIN
                }

            }
            // Stop monitoring once the tweens are restarted
            clearInterval(checkallReelsStopped);
        }
    }.bind(this), 10); // Check every 100ms

}

gSC.postMatrixCheck = function (state) {
    if(this.model.isError){ return; }
    //we need to set post matrtix in original matrix
    this.model.spinData.setPostMatrix();
    this.checkLossLimit();

    var flag=0;
    var BonusWin=coreApp.gameModel.obj.current_round.screen_wins;
    for(var i=0;i<BonusWin.length;i++)
    {
        if(BonusWin[i]>0)
        {
            flag+=1;
            //break;
        }
    }

    //new code
    if(coreApp.gameModel.obj.current_round.misc_prizes == ""){
        //no win
        setTimeout(this.callNextGameState.bind(this), 200);
    }else{
        //win and tumble
        
        if(coreApp.gameModel.obj.current_round.misc_prizes.count > 0){
            return;
        }else{
            setTimeout(this.callNextGameState.bind(this), 200);
        }
    }

}
gSC.onSpinResponseHandler = function () {
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
gSC.checkWinLimit = function (state) {
    // Check if we're in replay/history mode - don't show MAX WIN popup in replay mode
    const urlParams = new URLSearchParams(window.location.search);
    const hasRoundId = urlParams.has('round_id');
    const isReplayMode = hasRoundId || (window.slotService && window.slotService.isReplayMode);

    if (isReplayMode) {
        console.log("🎬 Replay mode detected - skipping MAX WIN popup check");
        return; // Don't check win limits in replay mode
    }

    //   console.log("Limkt Exceeded: "+(Number(this.model.spinData.getTotalWinAmount())))
    if (this.model.autoSpinData.getIsASWinLimitActive() && (Number(this.model.spinData.getTotalWinAmount()) >= Number(this.model.autoSpinData.getIsASWinLimitValue()))) {
        coreApp.gameModel.stopAutoSpins();
        _mediator.publish("cancelAutoSpin");
    }

    else if((Number(this.model.spinData.getTotalWinAmount()) >= coreApp.gameModel.spinData.max_win_cap * (Number(this.model.getTotalBet()))))
        {
                // console.log("Limkt Exceeded")
                 _mediator.publish("WinExceededPopup",this.model.getTotalBet())
        }
        // else if((Number(coreApp.gameModel.getTotalFSWin()))>=5000*(Number(this.model.getTotalBet())))
        //     {
        //         _mediator.publish("WinExceededPopup",this.model.getTotalBet())
        //     }
}
gSC.onStartAutoSpin = function (count) {
    this.autoSpinTriggered = true;
    if(_ng.GameConfig.TurboOn)
    {
        _ng.isQuickSpinActive = true;
        _ng.GameConfig.FastAnim=true;
    }
    // console.log(" autospin started ", count);
    this.model.startAutoSpins(count);
    this.requestSpin(false);
    this.updateAutoSpinCount();
}
gSC.onStopAutoSpin = function (count) {
    this.currentAutoSpinCount = coreApp.gameModel.getAutoSpinCurrentCount();
    this.model.stopAutoSpins();
    _mediator.publish("showNewMessage","");
    _mediator.publish("enableBuyFeature");
    _mediator.publish("ToggleSpin",true);
    _mediator.publish("updateAutoSpinText",false);
    if (coreApp.gameModel.isFreeSpinActive() == false) {
        _mediator.publish("hideandShowBuyfeature",true); 
    }
}

gSC.onSpinClickHandler = function (isFreeSpin) {
    _ng.isForceAllowed=true;
    this.allTumbleFinished = false;
    _ng.GameConfig.isGoldFeature = false;
    _mediator.publish("disableBuyFeature");
    _mediator.publish("removeHistBox");
    _mediator.publish("removeWinAnim");
    
    if(coreApp.gameModel.isFreeSpinActive()){
        // var leftValue = (coreApp.gameModel.userModel.userData.next_round.spins_left)-1;
        var leftValue = coreApp.gameModel.getFreeSpinCurrentCount() - 1;
        _mediator.publish("showNewMessage",gameLiterals.spinsleft_text +" "+ leftValue);
        var getTotalFreeSpins = coreApp.gameModel.userModel.userData.next_round.num_spins;
        _mediator.publish("setFsPlayedcnt",getTotalFreeSpins);
        _mediator.publish("setRemainingFSpins",leftValue);
        console.log("FREE SPIN LEFT",leftValue);
         
    }
    if (coreApp.gameModel.userModel.userData.previous_round
        && coreApp.gameModel.userModel.userData.previous_round
        .bonus_details) {
            let winAmount = coreApp.gameModel.userModel.userData.next_round.total_fs_win_amount;
            if (winAmount > 0) {
                	_mediator.publish("resetTotalFSWin",winAmount);
                    _mediator.publish("UpdateWin",winAmount); 
            } else {
                _mediator.publish("resetTotalFSWin",winAmount,0);
                _mediator.publish("UpdateWin",winAmount); 
            }
    }
   
    if (coreApp.gameModel.obj.current_round.spin_type != "freespin" && !this.model.getIsPFSActive()) {
        _mediator.publish("SHOW_TICKER_MESSAGE", gameLiterals.goodluck_text);   
    }
if (!coreApp.gameModel.isFreeSpinActive()) {
    _mediator.publish("UpdateWin",0); 
    	_mediator.publish("resetTotalFSWin",0);  
}
    this.allReelsStopped = false;
    // _mediator.publish("clearAllWins");
    _mediator.publish("ClearBonusSym");

    if(_ng.BuyFSenabled === true) {
        this.model.setAllTotalBet(this.model.getTotalBet());
        this.model.setBalance(this.model.getBalance() - (this.model.getTotalBet()*coreApp.gameModel.spinData.buyfg));
        if(!coreApp.gameModel.isFreeSpinActive()){
            _mediator.publish(_events.slot.updateBalance);
        }
    } else if(_ng.GameConfig.superBuyEnabled === true) {
        this.model.setAllTotalBet(this.model.getTotalBet());
        this.model.setBalance(this.model.getBalance() - (this.model.getTotalBet()*coreApp.gameModel.spinData.superBuyfg));
        if(!coreApp.gameModel.isFreeSpinActive()){
            _mediator.publish(_events.slot.updateBalance);
        }
    } else if(_ng.twoXBetEnabled===true) {
        this.model.setAllTotalBet(this.model.getTotalBet());
        this.model.setBalance(this.model.getBalance() - (this.model.getTotalBet()*coreApp.gameModel.spinData.antebet));
        if(!coreApp.gameModel.isFreeSpinActive()){
            _mediator.publish(_events.slot.updateBalance);
        }
    } else if (!this.model.getIsPFSActive() && isFreeSpin != true) {
        this.model.setAllTotalBet(this.model.getTotalBet());
        this.model.setBalance(this.model.getBalance() - (this.model.getTotalBet()));
        if(!coreApp.gameModel.isFreeSpinActive()){
            _mediator.publish(_events.slot.updateBalance);
        }
    }
    _mediator.publish("DisablePanel");
    if (_sndLib.isLowBg && (!coreApp.gameModel.isAutoSpinActive() && !coreApp.gameModel.isFullFSActive())) { _sndLib.lowBg(); }
}
gSC.handleFSEnd = function(){
      if (this._fsEndHandled) return;  // guard
        this._fsEndHandled = true;
    _mediator.publish("resetTotalFSWin",0);
    _mediator.publish("clearAllWins");
    
    _mediator.publish("checkButtonState")
    _sndLib.stopBg(_sndLib.sprite.bgFS);
    _mediator.publish("_hideAndShowOfTwoXButton", true);
   
    setTimeout(function () {
        _mediator.publish("SHOW_TICKER");
        if (this.model.getTotalFSWin() > 0) {
            _mediator.publish("showFreeSpinEnded");
             this._fsEndHandled = false;            
        } else {
            if(commonConfig.showFSPopupWithZeroWins){
                _mediator.publish("showFreeSpinEndedZeroBalance", {eventsToPublish: ["EnablePanel", "onFSEndShown"]});
            }else{
                _mediator.publish(_events.slot.updateBalance);
                _mediator.publish("EnablePanel");
                _mediator.publish("onFSEndShown");

                /*reseting after free spin ended*/
                if(_ng.BuyFSenabled===true){
                    _ng.BuyFSenabled=false;
                }
                if(_ng.GameConfig.superBuyEnabled === true) {
                    _ng.GameConfig.superBuyEnabled = false;
                }
                _mediator.publish("showNewMessage","");
                _mediator.publish("onFsCloseHandler");

                /*for continuing autoplay*/
                if(_ng.autoPlayBeforeFg == true) {
                    _mediator.publish("continueAutoSpin");
                    _mediator.publish("showAutoStopBtn");
                } 
            }
        }
    }.bind(this), 1000);
    this.changeContainerBg(false);
}
gSC.onUnfinishGame = function () {
    // Check if we're in history mode and need to fetch replay data
    const urlParams = new URLSearchParams(window.location.search);
    const hasRoundId = urlParams.has('round_id');
    const isInHistoryMode = hasRoundId;

    // If in history mode and slotService exists, fetch replay data now
    if (isInHistoryMode && window.slotService && window.slotService.isReplayMode) {
        if (!window.slotService.replayDataArray || window.slotService.replayDataArray.length === 0) {
            // Pass a callback to continue the game flow after API call completes
            window.slotService.getReplayData(() => {
                // Auto-start the replay sequence after data is loaded
                if (window.slotService && window.slotService.replayDataArray && window.slotService.replayDataArray.length > 0) {
                    // Small delay to ensure everything is ready
                    setTimeout(() => {
                        if (window.slotService && typeof window.slotService.injectReplayData === 'function') {
                            window.slotService.injectReplayData();
                        } else {
                            this.continueUnfinishGameFlow();
                        }
                    }, 500);
                } else {
                    this.continueUnfinishGameFlow();
                }
            });
            return;
        } else {
            // Replay data already loaded, auto-start replay sequence
            setTimeout(() => {
                if (window.slotService && typeof window.slotService.injectReplayData === 'function') {
                    window.slotService.injectReplayData();
                } else {
                    this.continueUnfinishGameFlow();
                }
            }, 500);
            return;
        }
    }

    this.continueUnfinishGameFlow();
}

gSC.continueUnfinishGameFlow = function () {
    const isInHistoryMode = isHistoryMode;
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
        _mediator.publish("unfinishedFreeSpins");

        if(!isInHistoryMode)
        _mediator.publish("_hideAndShowOfTwoXButton",false);
    
        this.changeContainerBg(true);

    }

    if (this.model.getFeatureParentType() === "freespins" || this.model.getFeatureParentType() === "freespin") {
        _mediator.publish("unfinishedFreeSpins");
    }
    
    this.onSpecificUnfinishGame();
}
gSC.onSpinClick = function (argument) {   
    _mediator.publish("spinStart");
    _mediator.publish("callSpinRequest");
    _mediator.publish("ToggleMobPanel",false);
    _mediator.publish("ToggleTurbo",false);
    _mediator.publish("ToggleSpin",false)
    _mediator.publish("toggleBetContainer",false);
    _mediator.publish("MakeTrueAtSpin");
    _mediator.publish("setSpaceBarEvent", "idle");
    // _mediator.publish("closeSettingsPanel");
    _mediator.publish("onHidePaytable");
    // if (this.model.getBalance() < this.model.getTotalBet()) {
    //     _mediator.publish(_events.core.error, { code: "INSUF_BALL_001" });
    //     return;
    // }
    // _mediator.publish("ToggleSpin",true)
};
gSC.callNextGameState = function () {
    if(this.model.isError){ return; }

    if(coreApp.gameController.errorContinueClicked) {
            _mediator.publish("ToggleSpin",true);
            return;
    } 

    if(this.model.isGambleActive()){
        _mediator.publish("SHOW_GAMBLE");
        this.model.gambleData.isGambleInitActive = false;
        this.model.spinData.totalLineWins = [];
        return;
    }



    if(!this.isWindowFocused){
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
    else if (this.model.getIsFreeSpinTriggered()) {
        // Check freespin trigger FIRST - even during PFS!
        if (this.checkFeatureAssets("freespins")) { return; }
        //for storing autoplay history
        if(coreApp.gameModel.isAutoSpinActive() == true) {
            _ng.autoPlayBeforeFg = true;
        }
        this.model.stopAutoSpins();
        _mediator.publish("cancelAutoSpin");
        _mediator.publish("clearAllWins");

        if (!this.gameStateAnimation) {
            setTimeout(function () {
                _mediator.publish("playBonusSymbolAnimation", { bonusID: 100, reelMatrix: this.model.getReelMatrix() });
            }.bind(this), 10);
            this.gameStateAnimation = true;
        } else {
            this.gameStateAnimation = false;
            if( coreApp.gameModel.obj.current_round.misc_prizes &&coreApp.gameModel.obj.current_round.misc_prizes.count > 0 )
            {
                setTimeout(function () { 
                    _mediator.publish("showFreeSpinAwarded");

                 },200);
            }
            else
            {
            setTimeout(function () { _mediator.publish("showFreeSpinAwarded"); }, 100);
            }
        }
    } else if (this.model.getIsFreeSpinEnded()) {
        if(this.model.getIsPFSActive()) {   
            // this.model.PFSData.totalPFSWins += coreApp.gameModel.getTotalFSWin();
        }
        this.handleFSEnd();
    }
    else if (this.model.isFeatureActive()) {
        this.showFeatureGame();
    }else if (this.model.isFreeSpinActive()) {
        if (this.checkFeatureAssets("freespins")) { return; }

        //showing extra fs only from here
        if(this.pendingExtraFs) {
            this.pendingExtraFs = false;
            _mediator.publish("showExtraSpins",() => {
                this.callNextGameState();
            })
            return;
        }        

        _mediator.publish("clearAllWins");
        _mediator.publish("SHOW_TICKER");

        var leftValue = (this.model.getTotalFreeSpins() - this.model.getFreeSpinCurrentCount()) + 1;
        // Pause if extra FS popup was shown and awaiting user acknowledgment
        if (this.awaitingExtraFsAck) {
            return;
        }
        this.requestSpin(true);
    }else if (this.model.getIsPFSEnded()){
        // Prevent user interaction while rewarded popup is preparing
        _mediator.publish("cancelAutoSpin");
        _mediator.publish("ToggleSpin", false);
        _mediator.publish("DisablePanel");
        if (_viewInfoUtil.device === 'Mobile') {
            _mediator.publish("ToggleMobPanel", false);
        }
        _mediator.publish("updatePromoWinText",this.model.PFSData.totalPFSWins);
        _mediator.publish("promoFreeSpinRewarded");
        return;  // Don't enable panel until user clicks continue on popup
    }else if (this.model.getIsPFSActive() && !_ng.GameConfig.PFSUseLater){
        if(!this.isPFSRunning){
            // Always show unfinishedPromoFreeSpin panel (no "USE LATER" button)
            _mediator.publish("unfinishedPromoFreeSpin");
            return;
        }
        _mediator.publish("clearAllWins");
        var delay = 0;
        _mediator.publish("SHOW_TICKER");
        if(this.model.getIsPFSTriggered()){
            _mediator.publish("SHOW_TICKER_MESSAGE", "Starting Bonus free spins");
            delay = 500;
        }
        setTimeout(function(){
            // Check if PFS is still active before requesting spin (it might have ended)
            if (!this.model.getIsPFSActive() || this.model.getIsPFSEnded()) {
                this.callNextGameState();  // Re-evaluate game state
                return;
            }
            var promoSpinLeft = this.model.getRemainingPFS();
            _mediator.publish("updatePromoSpinLeft",promoSpinLeft);
            _mediator.publish("updatePromoWinText",this.model.PFSData.totalPFSWins);
            // _ng.externalUiController.spinActive(false);
            // this.requestSpin(false);
             if(this.model.isAutoSpinActive()){
                this.updateAutoSpinCount();
                this.requestSpin(false);
            } else {
                _ng.externalUiController.spinActive(false);
            }
        }.bind(this), delay);
    }else if (this.model.isAutoSpinActive()) {
        _mediator.publish("clearAllWins");
        this.updateAutoSpinCount();
        this.requestSpin(false);
    } else if (this.isSpaceBarHeld && this.allReelsStopped) {
        _mediator.publish("clearAllWins");
        this.requestSpin(false);
    } else {
        // if (coreApp.gameView.infoPopup.BuypopupPanelCon && coreApp.gameView.infoPopup.returnPopupStatus().visible == false) {
            _mediator.publish("setSpaceBarEvent", "spinClick");   
        // }
        // if (_viewInfoUtil.device == "Mobile") {
        //     _mediator.publish("EnablePanel");   
        // }

        if (!this.model.isAutoSpinActive() || !this.model.isFullFSActive()) {
            _sndLib.highBg();
        }
        
        if (this.model.getTotalWinLines() && this.model.getTotalWinLines().length > 0) {
            _mediator.publish("showAlternateLineWins");
        }

        if(!_ng.GameConfig.quickSpinInfoPopupShown && _ng.GameConfig.quickSpinInfoTriggered) {
            _mediator.publish("quickSpinInfoPopup");
        }
        if (!coreApp.gameModel.isFullFSActive() && !coreApp.gameModel.getIsPFSActive()) {
            _mediator.publish("enableBuyFeature");
            _mediator.publish("checkBalanceForBuyFeature");
        }
        
    }
}

/*For continuing autospin after free game*/
gSC.continueAutoSpin = function (){
    // _mediator.publish("countExitForCongratulation");
  //Close the rewarded popup in 3sec
    if(_ng.autoPlayBeforeFg == true) {
        setTimeout(() => {
            _mediator.publish("onFsCloseHandler");   /*2 times calling if free game winamount is zero --- optimize later*/
            _mediator.publish("START_AUTOSPIN",_ng.autoPlayPrevCount);
            _mediator.publish("updateAutoSpinText",true);
        }, 2000);
    }
}

gSC.triggerAllWinAnimation = function () {
    if (this.model.spinData.getTotalWinAmount() > 0) {
        //ToDo: remove if condition...
        if (this.model.autoSpinData.getIsStopOnAnyWin()) {
            coreApp.gameModel.stopAutoSpins();
            _mediator.publish("cancelAutoSpin");
        }
        coreApp.gameController.allReelsStopped = true;
        _mediator.publish((this.model.isBigWinActive()) ? "showBigWins" : "onTotalWinShown");
    }
}

gSC.quickSpinInfoOnSpaceBar = function () {
    
    if( _viewInfoUtil.device == "Mobile" || coreApp.gameModel.isAutoSpinActive() ||
        coreApp.gameModel.isFreeSpinActive() || _ng.BuyFSenabled || _ng.GameConfig.superBuyEnabled  || coreApp.gameModel.getIsPFSActive()) {
        return;
     }
        
    this.spaceBarClickCount++; 
    
    if(this.spaceBarClickCount == 12) {
        clearInterval(this.spaceBarClickInterval);
        _ng.GameConfig.quickSpinInfoTriggered = true;
    }
}

gSC.enableMobilePanel = function () {
    /** checking the spin button panel is visible or not on mobile mode.
     * 
    */
    if (_viewInfoUtil.device == "Mobile") {

        // Don't enable panel if PFS is active or ended
        if(this.model.getIsPFSActive() || this.model.getIsPFSEnded())
            return
        
        var status = (coreApp.gameModel.isFreeSpinActive() ? "freeSpin" : "normal");
    }
    switch (status) {
        case "freeSpin":
            return;
            break;
        case "normal":
            if(!coreApp.gameModel.isAutoSpinActive() && coreApp.gameModel.obj.current_round.spin_type != "freespin"){
                _mediator.publish("EnablePanel");
            }
            break;
        default:
            break;
    }
}

/*FOR CHANGING containerBg
    isFreespin = false - on BaseGame
    isFreespin = true - on  FreeGame
*/
gSC.changeContainerBg = function (isFreespin) {
 
    if (desktopFullScreen == false || desktopFullScreen == "false") {
        var elm = document.getElementById("containerbg");
        elm.src = appPath + "games/" + gameName + "/dist/" + (isFreespin ? "containerfg.jpg" : "containerbg.jpg");
        elm.width = "100%";
        elm.height = "100%";
    }
}

gSC.checkAndContinue = function() {
    if (!this.awaitingExtraFsAck) {
        if (coreApp.gameModel.isAutoSpinActive() && this.model.autoSpinCount > 0) {
            // If in auto-spin mode, trigger the next spin directly
            this.model.autoSpinCount--;
            _mediator.publish("onSpinClickHandler", false);
        } else {
            if(!coreApp.gameModel.isBigWinActive())
             this.callNextGameState();
            
        }
    }
};

////////////////////////////////////////////////////////////////
gSC.onAllTumblesComplete = function(){
    this.triggerAllWinAnimation();

    this.enableMobilePanel();
    _mediator.publish("checkAndLand");

    if (coreApp.gameModel.isAutoSpinActive()) {
        _mediator.publish("ToggleMobPanel", false);
        _mediator.publish("ToggleSpin", false);
    }

    if (coreApp.gameModel.isFullFSActive()) {
        _mediator.publish("ToggleMobPanel", false);
        _mediator.publish("ToggleSpin", false);
    }

    if (!coreApp.gameModel.isAutoSpinActive() && !coreApp.gameModel.isFullFSActive()) {
        // Don't enable spin if PFS is active or ended
        var isPFR = this.model.getIsPFSActive && (this.model.getIsPFSActive() || this.model.getIsPFSEnded && this.model.getIsPFSEnded());
        if (!isPFR) {
            _mediator.publish("ToggleSpin", true);
        }
    }

    if (coreApp.gameModel.obj.current_round.spin_type != "freespin") {
        setTimeout(() => {
            _mediator.publish(_events.slot.updateBalance);
        }, 600);
    }

    // if (!coreApp.gameModel.isFullFSActive() && !coreApp.gameModel.getIsPFSActive()) {
    //     _mediator.publish("enableBuyFeature");
    //     _mediator.publish("checkBalanceForBuyFeature");
    // }
}

gSC.showTumbleWin = function (currentIndex) {
    _mediator.publish("TumbleWin", this.winArr, currentIndex, this.newArray);
    _mediator.publish("AddHistBox",currentIndex ,this.winHisArr,this.symbolpop,this.histSymbol);

}

gSC.checkExtraFreeSpinAward = function (){
    if (coreApp.gameModel.obj.current_round.post_matrix_info.extra_fs) {
        this.pendingExtraFs = true;
    }
}

