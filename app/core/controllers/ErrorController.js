function ErrorController(argument) {
	// body...
	this.code;
	this.action;
	this.message;
	this.title;
	this.event;

	this.errorConfig = {
		"NO_INTERNET": {action: "reload", title: "Message", message: "No active internet! Please reload game.", buttonText: "Reload"},
		"PRIMARY_ASSET_LOADING_ERROR": {action: "reload", title: "Message", message: "Server has been disconnected. Please reload the game.", buttonText: "Reload"},
		"SECONDARY_ASSET_LOADING_ERROR": {action: "reload", title: "Message", message: "Server has been disconnected. Please reload the game.", buttonText: "Reload"},
		"ERROR_OCCURED": {action: "reload", title: "Message", code: "ERROR_OCCURED", message: "Server has been disconnected. Please reload the game.", buttonText: "Reload"},
		"INSUF_BALL_001": {action: "close", title: "Message", code: "INSUF_BALL_001", message: "You have insufficient balance!", buttonText: "CONTINUE"},
		"INVALID_USERNAME": { action: "reload", title: "Message", code: "INVALID_USERNAME", message: "Invalid username! Please reload the game.", buttonText: "Reload"},
		"INVALID_SESSION": { action: "reload", title: "Message", code: "INVALID_SESSION", message: "Invalid session! Please reload the game.", buttonText: "Reload"},
		"INTERNAL_ERROR": { action: "reload", title: "Message", code: "INNTERNAL_ERROR", message: "Please reload the game. Internal error code: ", buttonText: "Reload"},
		"PROMO_FREE_SPINS": { action: "close", title: "Message", code: "PROMO_FREE_SPINS", message: "You have been awarded XXX Bonus free spins.", buttonText: "Continue", event: "runGameInit"},
		"PROMO_FREE_SPINS_UNFINISHED": { action: "close", title: "Message", code: "PROMO_FREE_SPINS_UNFINISHED", message: "You have unfinished Bonus free spins.", buttonText: "Continue", event: "runGameInit"},
		"PROMO_FREE_SPINS_ENDED": { action: "reload", title: "Message", code: "PROMO_FREE_SPINS_ENDED", message: "Your Bonus free spins are now complete, please continue playing with your available balance.", buttonText: "Continue"},
		
		// "INVALID_NUM_COINS": {action: "reload", title: "Message", code: "INVALID_NUM_COINS", message: "No active internet! Please reload game.", buttonText: "Reload"},
		// "INVALID_NUM_BETLINES": {action: "reload", title: "Message", code: "INVALID_NUM_BETLINES", message: "No active internet! Please reload game.", buttonText: "Reload"},
		// "ROUND_PAYLINES_NOT_FOUND_0001": {action: "reload", title: "Message", code: "ROUND_PAYLINES_NOT_FOUND_0001", message: "No active internet! Please reload game.", buttonText: "Reload"},
	}
}

var vc = ErrorController.prototype;	

vc.setView = function (view) {
	this.view = view;
	this.createListeners();
};
vc.createListeners = function (argument) {
	_mediator.subscribe(_events.core.onResize, this.onResize.bind(this));
	// _mediator.subscribe(_events.core.error, this.onError.bind(this));
	// _mediator.publish(_events.core.error, {code: "E002", action: "reload", type: "error"});
};
vc.onError = function(params){
	var isOperatorErrorToHandle = false;
	params = params || {};
	this.code = params.code || "ERROR_OCCURED";

	if(commonConfig.handleOperatorErrorCodes && (params.extraInfo && params.extraInfo.error_source && params.extraInfo.error_source === "operator")){
		Object.assign(this.errorConfig, commonConfig.handleOperatorErrorCodes);
		if(Object.keys(this.errorConfig).indexOf(this.code.toString()) >= 0){
			isOperatorErrorToHandle = true;
		}
	}

	// if(this.errorConfig[params.code] == undefined){
	if (params.code == undefined || (params.message !== undefined && params.message.length <= 0)){
		this.code = "ERROR_OCCURED";
		params = {};	//Discard all previous data in case of errorCode is not present in errorConfig
	}
	this.action = params.action || (this.errorConfig[this.code] && this.errorConfig[this.code].action) || "reload";
	this.message = params.message || (this.errorConfig[this.code] && this.errorConfig[this.code].message) || "Server has been disconnected. Please reload the game.";
	this.title = params.title || (this.errorConfig[this.code] && this.errorConfig[this.code].title) || "Message";
	this.buttonText = params.title || (this.errorConfig[this.code] && this.errorConfig[this.code].buttonText) || "Reload";
	this.event = params.event || (this.errorConfig[this.code] && this.errorConfig[this.code].event) || undefined;
	if(this.code === "INSUF_BALL_001" || isOperatorErrorToHandle){
		this.message = this.errorConfig[this.code].message;
	}

	var eData = {
		'code': this.code,
		'action': this.action,
		'message': this.message,
		'title': this.title,
		'buttonText': this.buttonText,
		'event': this.event
	}
	//Done show error popup for Responsible Gaming Limits as they are handled in Website itself.
	//Check is only on operator erros, because Game server errors are shown always.
	if(commonConfig.showOperatorErrors ||
		!(params.extraInfo && params.extraInfo.error_source && params.extraInfo.error_source === "operator") ||
		isOperatorErrorToHandle){
		this.view.updatePopup(eData);
		this.view.show();
	}
	if(params.extraInfo && params.extraInfo.error_source && params.extraInfo.error_source === "operator" && commonConfig.enablePanelAfterOperatorError){
		setTimeout(function(){
			_mediator.publish("errorClose", {event: undefined});
		}, 0);
	}
	setTimeout(function(){
		_mediator.publish("STOP_SPIN_NOW");
		_mediator.publish("STOP_REELS_ON_ERROR");
		
	}.bind(this), 1000);
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