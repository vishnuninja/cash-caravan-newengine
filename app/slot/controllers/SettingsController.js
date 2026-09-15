var _ng = _ng || {};
_ng.SettingsController = function () {
    this.addEvents();
}

var sc = _ng.SettingsController.prototype;

_ng.SettingsController.prototype.addEvents = function(){
    _mediator.subscribe(_events.core.onResize, this.onResize.bind(this));
    // _mediator.subscribe(_events.core.gameCreationCompleted, this.setUpPanelValues.bind(this));
    // _mediator.subscribe(_events.slot.coinValueUpdated, this.onCoinValueUpdated.bind(this));
    // _mediator.subscribe(_events.slot.lineValueUpdated, this.onLineValueUpdated.bind(this));
    // _mediator.subscribe(_events.slot.totalBetUpdated, this.onTotalBetUpdated.bind(this));
    // _mediator.subscribe(_events.slot.updateBalance, this.updateBalance.bind(this));
    // _mediator.subscribe(_events.slot.updateWin, this.updateWin.bind(this));
    // _mediator.subscribe("SHOW_SETTINGS", this.onOpenSettingsPanel.bind(this));

    _mediator.subscribe("openSettingsPanel", this.onOpenSettingsPanel.bind(this));
    _mediator.subscribe("closeSettingsPanel", this.onCloseSettingsPanel.bind(this));

    _mediator.subscribe("spinStart", this.onSpinClickHandler.bind(this));
    _mediator.subscribe("EnablePanel", this.onEnablePanelHandler.bind(this));
    _mediator.subscribe("DisablePanel", this.onDisablePanel.bind(this));
    _mediator.subscribe("setVolume", this.onVolumeChange.bind(this));
}  

sc.onVolumeChange = function(val){
    this.view.volumeChange(val);
}

sc.onSpinClickHandler = function(){
    this.view.enableMenu(false);
}

sc.onDisablePanel = function(){
    this.view.enableMenu(false);
}

sc.onEnablePanelHandler = function(){
    this.view.enableMenu(true);   
}

_ng.SettingsController.prototype.setView = function(view){
    this.view = view;
}
_ng.SettingsController.prototype.setVariables = function(coreApp){
    this.controller = coreApp.gameController;
}
_ng.SettingsController.prototype.onOpenSettingsPanel = function(){
    this.view.openSettingsPanel();
}
_ng.SettingsController.prototype.onCloseSettingsPanel = function(){
    this.view.closeSettingsPanel();
}
_ng.SettingsController.prototype.onResize = function(){
    this.view.onResize();
}
// sc.onCoinValueUpdated = function(){
// }
// sc.onLineValueUpdated = function(){
// }
// sc.onTotalBetUpdated = function(){
//     this.updateTotalBet();
//     this.view.checkMaxBetState();
// }
// sc.setUpPanelValues = function(){
//     this.setUpLineValue();
//     this.setUpCoinValue();

//     this.updatePanelValues();
// }
// sc.setUpCoinValue = function(){
//     var selectedIndex = this.controller.getCoinIndex();
//     var coinArray = this.controller.getCoinArray();
//     this.view.setUpCoinValue(selectedIndex, coinArray);
// }
// sc.setUpLineValue = function(){
//     var selectedPaylines = this.controller.getLineValue();
//     var totalPaylines = this.controller.getTotalPaylines();
//     this.view.setUpLineValue(selectedPaylines, totalPaylines);
// }
// sc.updatePanelValues = function(){
//     this.updateTotalBet();
//     this.updateBalance();
//     this.updateLines();
//     this.updateCoinValue();
// }
// sc.updateWin = function(data){
//     var win = (data && data.win) ? data.win : this.controller.getTotalWin();
//     this.view.updateWin(win);
// }
// sc.updateTotalBet = function(){
//     var totalBet = this.controller.getTotalBet();
//     this.view.updateTotalBet(totalBet);
// }
// sc.updateBalance = function(){
//     var balance = this.controller.getBalance();
//     this.view.updateBalance(balance);
// }
// sc.updateLines = function(lineNo){
//     this.view.updateLines();
// }
// sc.updateCoinValue = function(){
//     this.view.updateCoinValue();
// }