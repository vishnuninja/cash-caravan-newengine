_ng.ErrorViewEUI = function() {
    this.setConfig();
	this.createListeners();
}

_ng.ErrorViewEUI.prototype.constructor = _ng.ErrorViewEUI;
var errorView = _ng.ErrorViewEUI.prototype;

errorView.setConfig = function() {
    this.errorTranslations = {
		en: {
			"NO_INTERNET": {action: "reload", title: "Message", message: "No active internet! Please reload game.", buttonText: "Reload"},
			"PRIMARY_ASSET_LOADING_ERROR": {action: "reload", title: "Message", message: "Server has been disconnected. Please reload the game.", buttonText: "Reload"},
			"SECONDARY_ASSET_LOADING_ERROR": {action: "reload", title: "Message", message: "Server has been disconnected. Please reload the game.", buttonText: "Reload"},
			"ERROR_OCCURED": {action: "reload", title: "Message", code: "ERROR_OCCURED", message: "Server has been disconnected. Please reload the game.", buttonText: "Reload"},
			"INSUF_BALL_001": {action: "close", title: "INSUFFICIENT FUNDS", code: "INSUF_BALL_001", message: "You have not enough funds to place this wager", buttonText: "CONTINUE"},
			"INVALID_USERNAME": { action: "reload", title: "Message", code: "INVALID_USERNAME", message: "Invalid username! Please reload the game.", buttonText: "Reload"},
			"INVALID_SESSION": { action: "reload", title: "Message", code: "INVALID_SESSION", message: "Invalid session! Please reload the game.", buttonText: "Reload"},
			"INTERNAL_ERROR": { action: "reload", title: "Message", code: "INNTERNAL_ERROR", message: "Please reload the game. Internal error code: ", buttonText: "Reload"},
			"PROMO_FREE_SPINS": { action: "close", title: "Message", code: "PROMO_FREE_SPINS", message: "You have been awarded XXX Bonus free spins.", buttonText: "Continue", event: "runGameInit"},
			"PROMO_FREE_SPINS_UNFINISHED": { action: "close", title: "Message", code: "PROMO_FREE_SPINS_UNFINISHED", message: "You have unfinished Bonus free spins.", buttonText: "Continue", event: "runGameInit"},
			"PROMO_FREE_SPINS_ENDED": { action: "reload", title: "Message", code: "PROMO_FREE_SPINS_ENDED", message: "Your Bonus free spins are now complete, please continue playing with your available balance.", buttonText: "Continue"}
		},
		tr: {
			"NO_INTERNET": {action: "reload", title: "Mesaj", message: "Aktif internet yok! Lütfen oyunu yeniden yükleyin.", buttonText: "Yeniden Yükle"},
			"PRIMARY_ASSET_LOADING_ERROR": {action: "reload", title: "Mesaj", message: "Sunucu bağlantısı kesildi. Lütfen oyunu yeniden yükleyin.", buttonText: "Yeniden Yükle"},
			"SECONDARY_ASSET_LOADING_ERROR": {action: "reload", title: "Mesaj", message: "Sunucu bağlantısı kesildi. Lütfen oyunu yeniden yükleyin.", buttonText: "Yeniden Yükle"},
			"ERROR_OCCURED": {action: "reload", title: "Mesaj", code: "ERROR_OCCURED", message: "Sunucu bağlantısı kesildi. Lütfen oyunu yeniden yükleyin.", buttonText: "Yeniden Yükle"},
			"INSUF_BALL_001": {action: "close", title: "YETERSİZ BAKİYE", code: "INSUF_BALL_001", message: "Bu bahsi yapmak için yeterli bakiyeniz yok", buttonText: "DEVAM ET"},
			"INVALID_USERNAME": { action: "reload", title: "Mesaj", code: "INVALID_USERNAME", message: "Geçersiz kullanıcı adı! Lütfen oyunu yeniden yükleyin.", buttonText: "Yeniden Yükle"},
			"INVALID_SESSION": { action: "reload", title: "Mesaj", code: "INVALID_SESSION", message: "Geçersiz oturum! Lütfen oyunu yeniden yükleyin.", buttonText: "Yeniden Yükle"},
			"INTERNAL_ERROR": { action: "reload", title: "Mesaj", code: "INTERNAL_ERROR", message: "Lütfen oyunu yeniden yükleyin. İç hata kodu: ", buttonText: "Yeniden Yükle"},
			"PROMO_FREE_SPINS": { action: "close", title: "Mesaj", code: "PROMO_FREE_SPINS", message: "XXX Bonus bedava çevirmeler kazandınız.", buttonText: "Devam Et", event: "runGameInit"},
			"PROMO_FREE_SPINS_UNFINISHED": { action: "close", title: "Mesaj", code: "PROMO_FREE_SPINS_UNFINISHED", message: "Tamamlanmamış Bonus bedava çevirmeleriniz var.", buttonText: "Devam Et", event: "runGameInit"},
			"PROMO_FREE_SPINS_ENDED": { action: "reload", title: "Mesaj", code: "PROMO_FREE_SPINS_ENDED", message: "Bonus bedava çevirmeleriniz tamamlandı, lütfen mevcut bakiyenizle oynamaya devam edin.", buttonText: "Devam Et"}
		},
		ro: {
			"NO_INTERNET": {action: "reload", title: "MESAJ", message: "Fără conexiune activă la internet! Vă rugăm să reîncărcați jocul.", buttonText: "Reîncarcă"},
			"PRIMARY_ASSET_LOADING_ERROR": {action: "reload", title: "MESAJ", message: "Serverul a fost deconectat. Vă rugăm să reîncărcați jocul.", buttonText: "Reîncarcă"},
			"SECONDARY_ASSET_LOADING_ERROR": {action: "reload", title: "MESAJ", message: "Serverul a fost deconectat. Vă rugăm să reîncărcați jocul.", buttonText: "Reîncarcă"},
			"ERROR_OCCURED": {action: "reload", title: "MESAJ", code: "ERROR_OCCURED", message: "Serverul a fost deconectat. Vă rugăm să reîncărcați jocul.", buttonText: "Reîncarcă"},
			"INSUF_BALL_001": {action: "close", title: "FONDURI INSUFICIENTE", code: "INSUF_BALL_001", message: "Nu aveți suficiente fonduri pentru a plasa această miză", buttonText: "Continuă"},
			"INVALID_USERNAME": { action: "reload", title: "MESAJ", code: "INVALID_USERNAME", message: "Nume de utilizator invalid! Vă rugăm să reîncărcați jocul.", buttonText: "Reîncarcă"},
			"INVALID_SESSION": { action: "reload", title: "MESAJ", code: "INVALID_SESSION", message: "Sesiune invalidă! Vă rugăm să reîncărcați jocul.", buttonText: "Reîncarcă"},
			"INTERNAL_ERROR": { action: "reload", title: "MESAJ", code: "INNTERNAL_ERROR", message: "Vă rugăm să reîncărcați jocul. Cod de eroare intern: ", buttonText: "Reîncarcă"},
			"PROMO_FREE_SPINS": { action: "close", title: "MESAJ", code: "PROMO_FREE_SPINS", message: "Ați primit XXX rotiri gratuite Bonus.", buttonText: "Continuă", event: "runGameInit"},
			"PROMO_FREE_SPINS_UNFINISHED": { action: "close", title: "MESAJ", code: "PROMO_FREE_SPINS_UNFINISHED", message: "Aveți rotiri gratuite Bonus neterminate.", buttonText: "Continuă", event: "runGameInit"},
			"PROMO_FREE_SPINS_ENDED": { action: "reload", title: "MESAJ", code: "PROMO_FREE_SPINS_ENDED", message: "Rotirile gratuite Bonus s-au terminat. Vă rugăm să continuați jocul cu soldul disponibil.", buttonText: "Continuă"}
		}
	};
	this.errorConfig = this.getErrorConfig();
}

errorView.getUserLocale = function() {
    var locale = sessionStorage.getItem("Language") || sessionStorage.Language || 'en';
    return locale.toLowerCase();
};

errorView.getErrorConfig = function() {
	var locale = this.getUserLocale();
	var translations = this.errorTranslations[locale] || this.errorTranslations.en;
	return translations;
};

errorView.createListeners = function () {
	_mediator.subscribe(_events.core.error, this.onError.bind(this));
};

errorView.onError = function(params) {
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
	// Use translated message if available, otherwise use provided message or default
	var userLocale = this.getUserLocale();

	var defaultMessage = userLocale === 'tr' ? "Sunucu bağlantısı kesildi. Lütfen oyunu yeniden yükleyin.": userLocale === 'ro' ? "Serverul a fost deconectat. Vă rugăm să reîncărcați jocul."
						: "Server has been disconnected. Please reload the game.";
	var defaultTitle = userLocale === 'tr' ? "Mesaj": userLocale === 'ro' ? "MESAJ": "Message";
	var defaultButtonText = userLocale === 'tr' ? "Yeniden Yükle": userLocale === 'ro' ? "REÎNCARCĂ": "Reload";
		
	this.message = params.message || (this.errorConfig[this.code] && this.errorConfig[this.code].message) || defaultMessage;
	this.title = params.title || (this.errorConfig[this.code] && this.errorConfig[this.code].title) || defaultTitle;
	this.buttonText = params.buttonText || (this.errorConfig[this.code] && this.errorConfig[this.code].buttonText) || defaultButtonText;
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
			this.show(eData);
	}
	if(params.extraInfo && params.extraInfo.error_source && params.extraInfo.error_source === "operator" && commonConfig.enablePanelAfterOperatorError){
		setTimeout(function(){
			_mediator.publish("errorClose", {event: undefined});
		}, 0);
	}
	setTimeout(function(){
		if(_ng.GameConfig.isQuickSpinSelectedAtSpinTime) {
			_mediator.publish("startReelsWithResponse");
		}
		_mediator.publish("STOP_SPIN_NOW");
		_mediator.publish("STOP_REELS_ON_ERROR");
	}.bind(this), 1000);
}

errorView.show = function(data) {
	const title = data.title;
	const message = data.message;
	const buttonText = data.buttonText;
	this.eventToPublish = data.event;
	this.action = data.action;

	_ng.externalUiController.commonPopup.show({title : title, message : message},{
		middle: {
            label: buttonText,
            callback: this.confirmButtonClicked.bind(this)
        }	
	});
}

errorView.confirmButtonClicked = function() {
	if (this.action === "reload") {
		this.reload();
	}
	else if (this.action === "lobby") {
		this.gotolobby();
	}
	else if(this.action == "close") {
		this.close();
	}
}

errorView.reload = function() {
	pixiLib.reloadPage();
}

errorView.close = function() {	
	if(!coreApp.gameController.allReelsStopped) {
		return;
	}
	_mediator.publish("errorClose", {event: this.eventToPublish});
	this.hide();
}

errorView.gotolobby = function () {
	_mediator.publish("openURL", { type: "lobby" });
}

errorView.hide = function () {
	_ng.externalUiController.commonPopup.hide();
	_mediator.publish("errorClose", {event: this.eventToPublish});
};