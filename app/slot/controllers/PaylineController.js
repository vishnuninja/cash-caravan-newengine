function PaylineController(argument) {
}

var vc = PaylineController.prototype;

vc.setView = function (view) {
	this.view = view;
	this.createListeners();
};
vc.createListeners = function (argument) {
  _mediator.subscribe("showAllLines", this.onShowAllLines.bind(this));
  _mediator.subscribe("hideAllLines", this.onHideAllLines.bind(this));

  _mediator.subscribe("showSingleLine", this.onShowSingleLine.bind(this));
  _mediator.subscribe("showMultiLines", this.onShowMultiLines.bind(this));


  _mediator.subscribe("clearLineWins", this.onHideAllLines.bind(this));
  _mediator.subscribe(_events.core.secondaryAssetsLoaded, this.createpaylines.bind(this));
};

vc.createpaylines = function (){
	this.view.createpaylines();
}

vc.onShowAllLines = function (argument) {
	this.view.showAllLines();
}

vc.onHideAllLines = function (argument) {
	this.view.hideAllLines();
}

vc.onShowSingleLine = function (argument) {
	this.view.showSingleLine(argument);
}

vc.onShowMultiLines = function (argument) {
	this.view.showMultiLines();
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
