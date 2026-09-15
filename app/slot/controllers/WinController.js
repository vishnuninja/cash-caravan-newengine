function WinController(argument) {
    if (_ng.GameConfig.isClusterWin) {
        this.onShowTotalWin = this.onShowTotalClusterWin.bind(this);
    }
}
var vc = WinController.prototype;
vc.setView = function (view) {
	this.view = view;
	this.createListeners();
};
vc.createListeners = function (argument) {
	_mediator.subscribe("stopSpinNow", this.onStopSpinNowHandler.bind(this));
	_mediator.subscribe("showAlternateLineWins", this.onShowAlternateWins.bind(this));
	_mediator.subscribe("spinStart", this.onSpinStart.bind(this));
	_mediator.subscribe("clearAllWins", this.onClearAllwins.bind(this));
	_mediator.subscribe("allReelsStopped", this.onAllReelStopped.bind(this));
	_mediator.subscribe("playSpecialGameStateAnimation", this.createStickySymbols.bind(this));
	_mediator.subscribe("removeStickySymbols", this.removeStickySymbols.bind(this));
	_mediator.subscribe("playBonusSymbolAnimation", this.playBonusSymbolAnimation.bind(this));
	_mediator.subscribe("singleReelStop", this.onEachReelStop.bind(this));
	_mediator.subscribe("showSpawningWild", this.onShowSpawningWild.bind(this));
	_mediator.subscribe("showWalkingWild", this.onShowWalkingWild.bind(this));	
	_mediator.subscribe("showWildMultiplier", this.onShowWildMultiplier.bind(this));
	_mediator.subscribe("showStickySymbols", this.onShowStickySymbols.bind(this));	
	_mediator.subscribe("showTotalWin", this.onShowTotalWin.bind(this));
	_mediator.subscribe("updateWinViewConfigs", this.updateWinViewConfigs.bind(this));
	_mediator.subscribe(_events.core.onResize, this.onGameResize.bind(this));
	this.model = coreApp.gameModel;
	this.addExtraListeners();

};
vc.onStopSpinNowHandler = function (argument) {
	this.view.stopSpinNow(this.model.spinData.getReels());
};
vc.onGameResize = function(){
	this.view.onGameResize();
}
vc.updateWinViewConfigs = function(){
	this.view.updateWinViewConfigs();
}
vc.onShowTotalWin = function () {
	if (!_ng.GameConfig.noTotalWinSymbols){
		this.view.showAllWins(coreApp.gameModel.spinData.getTotalLineWins());
	}
}
vc.onShowTotalClusterWin = function () {
	this.view.showTotalClusterWin(coreApp.gameModel.spinData.getTotalLineWins());
}

vc.onShowStickySymbols = function(){
	this.view.showStickySymobolsOnInit(this.model.getStickySymbols());
}

vc.addExtraListeners = function(){}

vc.onAllReelStopped = function () {
	this.view.removeBonusLand();
	this.view.onAllReelStopped();
}

vc.playBonusSymbolAnimation = function(data){
	this.view.playBonusSymbolAnimation(data);
}
vc.onShowBigWin = function () {
	this.view.showBigWin(coreApp.gameModel.getTotalWin(), _ng.GameConfig.specialWins);
}
//you can show scatter blink or wild blink on each reel stop
vc.onEachReelStop = function (reelId) {
	//this.view.removeBonusLand();
	this.view.showEachReelStopAction(reelId, coreApp.gameModel.getReelMatrix()[reelId]);
}
//this is special case if walking wild available play animation 
vc.onWalkingWild = function () {
	this.view.showWalkingWild();
}

vc.onShowSpawningWild = function (reelIdAry, state) {
	this.view.showSpawningWild(reelIdAry, state);
}

vc.onShowWalkingWild = function (reelIdAry) {
	this.view.showWalkingWild(reelIdAry);
}
vc.onShowWildMultiplier = function (multiplier) {
	this.view.showWildMultiplier(multiplier);
}
vc.onSpinStart = function (argument) {
	this.view.stopSoundOnClick();
	this.view.onSpinStart(coreApp.gameModel.isFreeSpinActive());
	this.view.clearAllWins();
}
vc.onClearAllwins = function (argument) {
	this.view.clearAllWins();
}
vc.onShowAlternateWins = function (argument) {
	this.view.showAlternateLineWins(coreApp.gameModel.spinData.getTotalLineWins());
}
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
vc.onReelStop = function (argument) {
}
vc.createStickySymbols = function(data){
	if(data.type === "stickyRespin"){
		this.view.createStickySymbols(data);	
	}
}
vc.removeStickySymbols = function(){
	this.view.removeStickySymbols();
}

