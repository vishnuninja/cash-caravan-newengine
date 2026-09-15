function ReelController(argument) {
	// body...
}

var vc = ReelController.prototype;

vc.setView = function (view) {
	this.view = view;
	this.model = coreApp.gameModel;
	this.createListeners();
};
vc.createListeners = function (argument) {
	_mediator.subscribe("spinStart", this.onSpinClickHandler.bind(this));
	_mediator.subscribe("stopSpinNow", this.onStopSpinNowHandler.bind(this));
	_mediator.subscribe("stopSpin", this.onStopSpinHandler.bind(this));
	_mediator.subscribe("stopImmediatelySpin", this.onStopSpinImmediately.bind(this));
	_mediator.subscribe("showAlternateLineWins", this.onShowAlternateLineWins.bind(this));
	_mediator.subscribe("clearAllWins", this.onClearAllWins.bind(this));
	_mediator.subscribe("hideReelSymbols", this.hideReelSymbols.bind(this));
	_mediator.subscribe("showReelSymbols", this.showReelSymbols.bind(this));
	_mediator.subscribe("fadeAllSymbols", this.fadeAllSymbols.bind(this));
	_mediator.subscribe("addTintOnSymbols", this.addTintOnSymbols.bind(this));
	_mediator.subscribe("clearLineWins", this.onClearAllWins.bind(this));
	_mediator.subscribe("showSingleLine", this.onShowLineWinHandler.bind(this));
	_mediator.subscribe("FreeSpinsStarted", this.onFreeSpinsStarted.bind(this));
	_mediator.subscribe("unfinishedFreeSpins", this.onFreeSpinsStarted.bind(this));
	_mediator.subscribe("onFSEndShown", this.onFreeSpinsEnded.bind(this));
	_mediator.subscribe("allReelsStopped", this.onAllReelsStoppedHandler.bind(this));
	_mediator.subscribe("showWildMultiplier", this.onShowWildMultiplier.bind(this));
	_mediator.subscribe("createReelView", this.createReelView.bind(this));
	_mediator.subscribe("stopAnticipation", this.stopAnticipation.bind(this));
	this.createSpecificListeners();
};

vc.createSpecificListeners = function () {}
vc.createReelView = function(){
	this.view.createView();
}
vc.stopAnticipation = function(){
	this.view.stopAnticipation();
}
vc.onShowWildMultiplier = function (multiplier) {
	this.view.showWildMultiplier(multiplier);
}
vc.onAllReelsStoppedHandler = function () {
	this.view.onAllReelsStopped();
	this.view.clearReelSymbols();
}
vc.addTintOnSymbols = function(dataObj){
	this.view.addTintOnSymbols(dataObj);
}
vc.onFreeSpinsStarted = function () {
	this.view.showFreespinGrid();
}
vc.onFreeSpinsEnded = function () {
	this.view.hideFreespinGrid();
	// this.view.showRegularBg();
}
vc.onShowLineWinHandler = function (lineNum, index) {
	// console.log(" reelcontroller ============== ");
	var cLine = coreApp.gameModel.spinData.getTotalLineWins()[index];
	this.view.fadeReelSymbols(cLine);
};
vc.hideReelSymbols = function(array, type){
	this.view.hideReelSymbols(array, type);
}
vc.fadeAllSymbols = function(value){
	this.view.fadeAllSymbols(value);
}
vc.onShowAlternateLineWins = function (argument) {
	// body...
	this.view.fadeReels(0.5);
};
vc.showReelSymbols = function(){
	this.view.clearReelSymbols();
}
vc.onClearAllWins = function (argument) {
	// body...
	this.view.fadeReels(1);
	this.view.clearReelSymbols();
};
vc.onSpinClickHandler = function (argument) {
	this.view.fadeReels(1);
	if(_ng.isQuickSpinActive && _ng.quickSpinType==="turbo"){
		this.view.quickSpinStart();
	}else{
		this.view.startSpin();
	}
	
};
vc.onStopSpinNowHandler = function (argument) {
	if(_ng.isQuickSpinActive && _ng.quickSpinType==="turbo"){
		this.view.quickSpinStop(this.model.spinData.getReels());
	}else{
		this.view.stopSpinNow(this.model.spinData.getReels());
	}
};
vc.onStopSpinHandler = function (argument) {
	// console.log("RC stop spin =========================>>_____________---------");
	// this.view.stopSpin(this.model.spinData.getReels());
	this.view.stopSpin("spinresponserecieved");
}
vc.onStopSpinImmediately = function (argument) {
	this.view.stopImmediately(this.model.spinData.getReels());
};
vc.onResize = function (argument) {
	this.view.resize();
};
vc.show = function (argument) {
	this.view.show();
};
vc.hide = function (argument) {
	this.view.hide();
};
vc.destroy = function (argument) {
	this.view.destroy();
};
