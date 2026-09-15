function GambleController(argument) {
	// body...
}

var vc = GambleController.prototype;

vc.setView = function (view) {
	this.view = view;
	this.createListeners();
};
vc.createListeners = function (argument) {
  _mediator.subscribe("SHOW_GAMBLE", this.onShowGamble.bind(this));
  _mediator.subscribe("HIDE_GAMBLE", this.onHideGamble.bind(this));

  _mediator.subscribe("onResize", this.onResize.bind(this));
  _mediator.subscribe("onGambleResponse", this.onGambleResponseHandler.bind(this));
};

vc.onShowGamble = function (){
	this.view.show(); 
}
vc.onHideGamble = function (){
	this.view.hide();
}

vc.onGambleResponseHandler = function (){
	this.view.onGambleResponse();
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
