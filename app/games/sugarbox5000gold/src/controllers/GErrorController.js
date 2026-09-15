var err = ErrorController.prototype;	

err.setView = function (view) {
	this.view = view;
	this.createListeners();
    this.updateErrorConfig();
};
err.updateErrorConfig = function () {

    this.errorConfig = {
		"NO_INTERNET": {action: "reload", title: gameLiterals.errorTitle, message: gameLiterals.NO_INTERNET, buttonText: gameLiterals.reload},
		"PRIMARY_ASSET_LOADING_ERROR": {action: "reload", title: "Message", message: "Server has been disconnected. Please reload the game.", buttonText: "Reload"},
		"SECONDARY_ASSET_LOADING_ERROR": {action: "reload", title: "Message", message: "Server has been disconnected. Please reload the game.", buttonText: "Reload"},
		"ERROR_OCCURED": {action: "reload", title: "Message", code: "ERROR_OCCURED", message: "Server has been disconnected. Please reload the game.", buttonText: "Reload"},
		"INSUF_BALL_001": {action: "close", title: gameLiterals.errorTitle, code: "INSUF_BALL_001", message: gameLiterals.INSUF_BALL_001, buttonText: gameLiterals.errorContinue},
		"INVALID_USERNAME": { action: "reload", title: "Message", code: "INVALID_USERNAME", message: "Invalid username! Please reload the game.", buttonText: "Reload"},
		"INVALID_SESSION": { action: "reload", title: "Message", code: "INVALID_SESSION", message: "Invalid session! Please reload the game.", buttonText: "Reload"},
		"INTERNAL_ERROR": { action: "reload", title: "Message", code: "INNTERNAL_ERROR", message: "Please reload the game. Internal error code: ", buttonText: "Reload"},
		"PROMO_FREE_SPINS": { action: "close", title: "Message", code: "PROMO_FREE_SPINS", message: "You have been awarded XXX Bonus free spins.", buttonText: "Continue", event: "runGameInit"},
		"PROMO_FREE_SPINS_UNFINISHED": { action: "close", title: "Message", code: "PROMO_FREE_SPINS_UNFINISHED", message: "You have unfinished Bonus free spins.", buttonText: "Continue", event: "runGameInit"},
		"PROMO_FREE_SPINS_ENDED": { action: "reload", title: "Message", code: "PROMO_FREE_SPINS_ENDED", message: "Your Bonus free spins are now complete, please continue playing with your available balance.", buttonText: "Continue"},
	}
    
}