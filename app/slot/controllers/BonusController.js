function BonusController() {
	
}

var vc = BonusController.prototype;

vc.setView = function (view) {
	this.view = view;
	this.createListeners();
};
vc.createListeners = function (argument) {
	this.model = coreApp.gameModel;
	_mediator.subscribe(_events.core.onResize, this.onResize.bind(this));
    _mediator.subscribe("showBonusGame", this.onShowBonusGame.bind(this));
    _mediator.subscribe("onFeatureResponse", this.onFeatureResponse.bind(this));
    _mediator.subscribe("closeBonus", this.onCloseBonusRound.bind(this));
};

vc.onCloseBonusRound = function () {
	this.view.onCloseBonusRound(this.model.getFeatureObject());
	if(_ng.GameConfig.changeFeatureWinAmountObj) {
	var winAmount = this.model.getFeatureObject().current_round.win_amount ? {win: this.model.getFeatureObject().current_round.win_amount}: {win: ""};	
	} else {
	var winAmount = this.model.getFeatureObject().win_amount ? this.model.getFeatureObject().win_amount: "";
	}
	_mediator.publish(_events.slot.updateWin, winAmount);
	_mediator.publish(_events.slot.updateBalance);
}
vc.onFeatureResponse = function () {
	//Need to make BonusView a generic Class
	try{
		this.view.onFeatureResponse(this.model.getFeatureObject());
	}catch(e){}
}
vc.onShowBonusGame = function () {
	//Need to make BonusView a generic Class
	try{
		this.view.showBonusGame(this.model.getFeatureObject());
	}catch(e){}
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
