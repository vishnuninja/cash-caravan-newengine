PanelController = function () {
     //this.addEvents();
}
var pc = PanelController.prototype;

pc.addEvents = function(){
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

    this.slotModel = coreApp.gameModel;
    this.addExtraEvents();
};

pc.hideGambleButtonOnClick = function(){
    this.view.hideGambleButton();
}
pc.addExtraEvents = function(){}

// pc.closeAutoSpin = function(){
//     this.view.onHideAutoSpin();
// }
pc.updateAutoSpinBtnStates = function(num){
    this.view.updateAutoSpinBtnStates(num);
}
pc.onCancelAutoSpin = function(){
    this.view.onCancelAutoSpin();
}

pc.onCloseBonusRound =  function () {
    this.updateBalance();
}

pc.onHideAutoSpin = function () {
    this.view.onHideAutoSpin();
}
pc.onAutoSpinCountUpdate =  function (count) {
    this.view.onAutoSpinCountUpdate(count);
}
pc.showRealityCheckPopup = function () {
    this.view.onAutoSpinStopClick();
}
pc.onStopSpinHandler = function () {
    //remove spin stop button 
    this.view.hideSpinStop();
}

pc.onAllReelsStarted = function () {
    // console.log("spin all stopped =====================>>>");
    this.isAllReelsStarted = true;
    if(this.stopSpinIsReadyToActivate){
        // console.log("spin stop activated  =====================>>>");
        if(!_ng.GameConfig.noStopSpin){
            this.view.showSpinStop();
        }
        this.stopSpinIsReadyToActivate = false;
    }
}

pc.onSpinReceivedHandler = function () {
    if(this.isAllReelsStarted){
        if(!_ng.GameConfig.noStopSpin){
            this.view.showSpinStop();
        }
        this.isAllReelsStarted = false;
    }else{
        this.stopSpinIsReadyToActivate = true;
    }
}
pc.onStopSpinClicked = function(){    
    this.view.onStopSpinClicked();
}
pc.onHidePanel = function (argument) {
    this.view.hidePanel();
}
pc.onShowPanel = function (argument) {
    this.view.showPanel();
}
pc.onDisablePanel = function (argument) {
    this.view.disablePanel();
}
pc.onEnablePanel = function (argument) {
    this.view.enablePanel();

    if(coreApp.gameModel.gambleData.isGambleActive){
        this.view.showGambleButton();
    }

}
pc.onSpinStart = function (argument) {    
    // if (!(coreApp.gameModel.isAutoSpinActive() || coreApp.gameModel.isFreeSpinActive())){
    //     _sndLib.play(_sndLib.sprite.spinStartBtn);
    // }
    this.isAllReelsStarted = false;
    this.stopSpinIsReadyToActivate = false;
    this.view.disablePanel();
    this.view.hideGambleButton();    
}
//@added check to avoid the panel win update in freegame/auto play with bigwin
pc.onTotalWinShown = function (){
     if ((!coreApp.gameModel.isAutoSpinActive() || !coreApp.gameModel.isFullFSActive()) && !coreApp.gameModel.isBigWinActive()) {
     this.view.updateWin(coreApp.gameModel.spinData.getTotalWinAmount());
     }
}
pc.showFSWinOnPanel = function(){
    if(coreApp.gameModel.getTotalFSWin() > 0){
        this.view.updateWin(coreApp.gameModel.getTotalFSWin());
    }
}

pc.onTotalWinShownOnBigWinSettled = function (){
  this.view.updateWin(coreApp.gameModel.spinData.getTotalWinAmount());
}

pc.onUpdateWinField = function(amount){
    var amount = amount || coreApp.gameModel.spinData.getTotalWinAmount();
    this.view.updateWin(amount);    
}
pc.onClearAllWins = function () {
    this.view.updateWin("");
}
pc.setView = function(view){
    this.view = view;
}
pc.setVariables = function(coreApp){
    this.controller = coreApp.gameController;
}
pc.onResize = function(){
    this.view.onResize();
}
pc.onCoinValueUpdated = function(){}
pc.onLineValueUpdated = function(){}
pc.onTotalBetUpdated = function(){
    this.updateTotalBet();
    this.view.checkMaxBetState();
}
pc.setUpPanelValues = function(){
    this.setUpLineValue();    
    this.setUpCoinValue();
    this.updatePanelValues();
    coreApp.gameView.CPController.view.autoSpinStopButton.visible = false;
}
pc.setUpCoinValue = function(){
    this.view.setUpCoinValue(this.slotModel.getCoinIndex(), this.slotModel.getCoinArray());
}
pc.setUpLineValue = function(){
    this.view.setUpLineValue(this.slotModel.getLineValue(), this.slotModel.getTotalPaylines());
}
pc.updatePanelValues = function(){
    // this.updateTotalBet();
    this.updateBalance();
    this.updateLines();
    this.updateCoinValue();
    this.onTotalBetUpdated();
}
pc.updateWin = function(data){
    var win = (data && (data.win != undefined)) ? data.win : this.slotModel.getTotalWin();
    this.view.updateWin(win);
}
pc.updateTotalBet = function(){
    var totalBet = this.slotModel.getTotalBet();
    this.view.updateTotalBet(totalBet);
}
pc.updateBalance = function(balanceData){
    if(Number(balanceData)>0){//UPDATE_BALANCE_FROM_DATA
        this.view.updateBalance(balanceData);
    }else{
        this.view.updateBalance(this.slotModel.getBalance());    
    }
    
}
pc.updateLines = function(lineNo){
    this.view.updateLines(lineNo);
}
pc.updateCoinValue = function(){
    this.view.updateCoinValue();
}