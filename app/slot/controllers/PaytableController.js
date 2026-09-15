function PaytableController(argument) {
}
var vc = PaytableController.prototype;
vc.setView = function (view) {
	this.view = view;
	this.createListeners();
};
vc.createListeners = function (argument) {
	_mediator.subscribe("SHOW_PAYTABLE", this.onShowPaytableHandler.bind(this, true));
	_mediator.subscribe("onShowPaytable", this.onShowPaytableHandler.bind(this, true));
	_mediator.subscribe("onHidePaytable", this.onShowPaytableHandler.bind(this, false));
	_mediator.subscribe(_events.core.onResize, this.onResize.bind(this));
};
vc.onShowPaytableHandler = function (bool) {
	if (typeof bool !== "boolean") bool = true;
	
	if (bool) {
		// tempararly hiding clockview on paytable and settings view.    
		coreApp.gameView.clockView.hide();
		this.view.show();
		if(commonConfig.hideGameOnPaytable && (commonConfig.hideGameOnPaytableFor.indexOf(_viewInfoUtil.device) >= 0)){
			_mediator.publish("hideMainContainer", {noEffect: true});
			_mediator.publish("hidePanel", {noEffect: true});
			_mediator.publish("hideGameTitle", {noEffect: true})
		}
	} else {
		// tempararly hiding clockview on paytable and settings view.    
		coreApp.gameView.clockView.show();
		this.view.hide();
		if(commonConfig.hideGameOnPaytable && (commonConfig.hideGameOnPaytableFor.indexOf(_viewInfoUtil.device) >= 0)){
			_mediator.publish("showMainContainer", {noEffect: true});
			_mediator.publish("showPanel", {noEffect: true});
			_mediator.publish("showGameTitle", {noEffect: true})
		}
	}
}
vc.onResize = function (argument) {
	this.view.onResize();
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
