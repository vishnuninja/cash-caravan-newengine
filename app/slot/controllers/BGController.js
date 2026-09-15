function BGController(argument) {
	// body...
}

var vc = BGController.prototype;

vc.setView = function (view) {
	this.view = view;
	this.createListeners();
};
vc.createListeners = function () {
	_mediator.subscribe("unfinishedFreeSpins", this.onFreeSpinsStarted.bind(this));
	_mediator.subscribe("FreeSpinsStarted", this.onFreeSpinsStarted.bind(this));
	_mediator.subscribe("showFreespinBg", this.onShowFreespinBG.bind(this));
	_mediator.subscribe("onFSEndShown", this.onFreeSpinsEnded.bind(this));
	_mediator.subscribe(_events.core.onResize, this.onResize.bind(this));
};

vc.onFreeSpinsStarted = function () {
	this.view.showFreespinBg();	
}
vc.onShowFreespinBG = function(){
	this.view.showFreespinBg();	
}
vc.onFreeSpinsEnded = function () {
	this.view.hideFreespinBg();	
	// this.view.showRegularBg();
}

vc.onResize = function () {
	this.view.resize();
};
vc.show = function () {
	this.view.show();
};
vc.hide = function () {
	this.view.hide();
};
vc.destroy = function () {
	this.view.destroy();
};
