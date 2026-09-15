function HistoryPanelController(argument) { }

var hpc = HistoryPanelController.prototype;

hpc.setView = function (view) {
	this.view = view;
	this.createListeners();
};

hpc.createListeners = function (argument) {
	_mediator.subscribe("SHOW_HISTORY_PANEL", this.onShowHistoryPanelHandler.bind(this, true));
	_mediator.subscribe("onShowHistoryPanel", this.onShowHistoryPanelHandler.bind(this, true));
	_mediator.subscribe("onHideHistoryPanel", this.onShowHistoryPanelHandler.bind(this, false));
	_mediator.subscribe(_events.core.onResize, this.onResize.bind(this));
};

hpc.onShowHistoryPanelHandler = function (bool) {
	if (typeof bool !== "boolean") bool = true;

	if (bool) {
		// Hide clock view
		coreApp.gameView.clockView.hide();

		// Hide other panels
		_mediator.publish("onHidePaytable");
		_mediator.publish("closeSettingsPanel");

		// Disable spin button
		_mediator.publish("DisablePanel");
		pixiLib.setInteraction(coreApp.gameView.panel.spinButton, false);
		pixiLib.setInteraction(coreApp.gameView.panel.autoSpinButton, false);

		// Show the history panel
		this.view.show();
	} else {
		// Show clock view
		coreApp.gameView.clockView.show();

		// Enable spin button
		_mediator.publish("EnablePanel");
		_mediator.publish("checkBalanceForBuyFeature");
		
		pixiLib.setInteraction(coreApp.gameView.panel.spinButton, true);
		pixiLib.setInteraction(coreApp.gameView.panel.autoSpinButton, true);

		// Hide the history panel
		this.view.hide();
	}
};

hpc.onResize = function (argument) {
	this.view.onResize();
};

hpc.show = function (argument) {
	this.view.show();
};

hpc.hide = function (argument) {
	this.view.hide();
};

hpc.destroy = function (argument) {
	this.view.destroy();
};

