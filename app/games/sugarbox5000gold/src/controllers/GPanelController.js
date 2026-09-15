var pc = PanelController.prototype;

pc.addEvents = function(){
    this.popupDisplayIndex = 0;
    _mediator.subscribe(_events.core.onResize, this.onResize.bind(this));
    _mediator.subscribe(_events.core.gameCreationCompleted, this.setUpPanelValues.bind(this));
    _mediator.subscribe(_events.slot.coinValueUpdated, this.onCoinValueUpdated.bind(this));
    _mediator.subscribe(_events.slot.lineValueUpdated, this.onLineValueUpdated.bind(this));
    _mediator.subscribe(_events.slot.totalBetUpdated, this.onTotalBetUpdated.bind(this));
    _mediator.subscribe(_events.slot.updateBalance, this.updateBalance.bind(this));
    _mediator.subscribe("UPDATE_BALANCE_FROM_DATA", this.updateBalance.bind(this));
    _mediator.subscribe(_events.slot.updateWin, this.updateWin.bind(this));
    _mediator.subscribe("clearAllWins", this.onClearAllWins.bind(this));
    _mediator.subscribe("totalWinShownOnBigWinSettled", this.onTotalWinShownOnBigWinSettled.bind(this));
   // _mediator.subscribe("totalWinShownOnBigWinSettled", this.onTotalWinShownOnBigWinSettled.bind(this));
    _mediator.subscribe("showPanelWin", this.onTotalWinShown.bind(this));
    _mediator.subscribe("showFSWinOnPanel", this.showFSWinOnPanel.bind(this));
    _mediator.subscribe("onUpdateWinField", this.onUpdateWinField.bind(this));
    _mediator.subscribe("spinStart", this.onSpinStart.bind(this));
    _mediator.subscribe("hidePanel", this.onHidePanel.bind(this));
    _mediator.subscribe("showPanel", this.onShowPanel.bind(this));
    _mediator.subscribe("DisablePanel", this.onDisablePanel.bind(this));
    _mediator.subscribe("EnablePanel", this.onEnablePanel.bind(this));
    //show stop spin button 
    _mediator.subscribe("onSpinResponse", this.onSpinReceivedHandler.bind(this));
    _mediator.subscribe("cancelAutoSpin", this.onCancelAutoSpin.bind(this));
    _mediator.subscribe("allReelsStopped", this.onStopSpinHandler.bind(this));
    _mediator.subscribe("allReelsStarted", this.onAllReelsStarted.bind(this));
    _mediator.subscribe("UPDATE_AUTOSPIN_COUNT", this.onAutoSpinCountUpdate.bind(this));
    _mediator.subscribe("HIDE_AUTOSPIN_WINDOW", this.onHideAutoSpin.bind(this));
    _mediator.subscribe("updateAutoSpinBtnStates", this.updateAutoSpinBtnStates.bind(this));
    //hide gamble button
    _mediator.subscribe("hideGambleButtonOnClick", this.hideGambleButtonOnClick.bind(this));
    
    _mediator.subscribe("closeBonus", this.onCloseBonusRound.bind(this));
    _mediator.subscribe("spaceBarStopClicked", this.onStopSpinClicked.bind(this));
    _mediator.subscribe("showRealityCheckPopup", this.showRealityCheckPopup.bind(this));
    _mediator.subscribe(_events.core.error, function(){
        setTimeout(function(){
            _mediator.publish("cancelAutoSpin");
        }, 100);
    }.bind(this)); 
    // _mediator.subscribe("panelClick", this.closeAutoSpin.bind(this));
    _mediator.subscribe("updateTotalBet", this.updateTotalBet.bind(this));
    _mediator.subscribe("updateTwoxbet", this.updateTwoxbet.bind(this));

    this.slotModel = coreApp.gameModel;
    this.addExtraEvents();
};
pc.updateTotalBet = function(){
    if (this.popupDisplayIndex == 0) {
        this.popupDisplayIndex = 1;
        var totalBet = this.slotModel.getTotalBet();
    if(_ng.twoXBetEnabled === true){
        this.view.updateTotalBet(totalBet*coreApp.gameModel.spinData.antebet);
        _mediator.publish("updatePopupBet",totalBet*coreApp.gameModel.spinData.antebet);
        _mediator.publish("updateSetBet",totalBet*coreApp.gameModel.spinData.antebet);
        _mediator.publish("updateSelectorContainerBet",totalBet*coreApp.gameModel.spinData.antebet);
    }else{
        this.view.updateTotalBet(totalBet);
        _mediator.publish("updatePopupBet",totalBet);
        _mediator.publish("updateSetBet",totalBet);
        _mediator.publish("updateSelectorContainerBet",totalBet);
    }
    } else{        
        var totalBet = this.slotModel.getTotalBet();
        if(_ng.twoXBetEnabled === true){
            this.view.updateTotalBet(totalBet*coreApp.gameModel.spinData.antebet);
            _mediator.publish("updatePopupBet",totalBet*coreApp.gameModel.spinData.antebet);
            _mediator.publish("updateSetBet",totalBet*coreApp.gameModel.spinData.antebet);
            _mediator.publish("updateSelectorContainerBet",totalBet*coreApp.gameModel.spinData.antebet);
        }else{
            this.view.updateTotalBet(totalBet);
            _mediator.publish("updatePopupBet",totalBet);
            _mediator.publish("updateSetBet",totalBet);
            _mediator.publish("updateSelectorContainerBet",totalBet);
        }
    }

}
pc.onAutoSpinCountUpdate =  function (count) {
    if(count)
     _ng.autoPlayPrevCount = count;
    
    this.view.onAutoSpinCountUpdate(count);
    if(count == 0){
        _ng.autoPlayBeforeFg = false;
        _ng.autoPlayPrevCount = 0;
        _mediator.publish("enableBuyFeature");
    }
    if(coreApp.gameModel.isAutoSpinActive() == true){
    _mediator.publish("showNewMessage",gameLiterals.spinsleft_text +" "+ count);
    }
}
pc.updateTwoxbet = function(){
    var totalBet = this.slotModel.getTotalBet();
    this.view.updateTotalBet(totalBet*coreApp.gameModel.spinData.antebet);
    _mediator.publish("updatePopupBet",totalBet*coreApp.gameModel.spinData.antebet);
    _mediator.publish("updateSetBet",totalBet*coreApp.gameModel.spinData.antebet);
    _mediator.publish("updateSelectorContainerBet",totalBet*coreApp.gameModel.spinData.antebet);
}
pc.onTotalWinShown = function (){
    // if ((!coreApp.gameModel.isAutoSpinActive() || !coreApp.gameModel.isFullFSActive()) && !coreApp.gameModel.isBigWinActive()) {
    // this.view.updateWin(coreApp.gameModel.spinData.getTotalWinAmount());
    // }
}
pc.onClearAllWins = function(){
    
}
pc.onSpinStart = function (argument) {    
    _mediator.publish("closeQuickSpinInfo");
    _mediator.publish("killReelAniTweens");
    this.isAllReelsStarted = false;
    this.stopSpinIsReadyToActivate = false;
    this.view.disablePanel();
    this.view.hideGambleButton();    
}
pc.onEnablePanel = function(){
    this.view.enablePanel();
}
pc.onTotalBetUpdated = function(){
    this.updateTotalBet();
    this.view.checkMaxBetState();
    _mediator.publish("checkBalanceForBuyFeature");
}