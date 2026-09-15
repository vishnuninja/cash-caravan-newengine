var _ng = _ng || {};
_ng.SlotService = function () {
	_ng.CoreService.call(this);
	this.sessionId = getUrlVar('session_id');
	// hardcode for back office by avinash
	var isBo = getUrlVar('isBO');

	// if (env === "lcl" || env === "bld" || env === "dev") {
	// 	// if (env === "dev") commonConfig.serverDevIP = "";
	// 	this.spinUrl = commonConfig.serverDevIP + commonConfig.serverDevURL;
	// 	this.callBackUrl = commonConfig.serverDevIP + "/gameengine/casino/casino.php";
	// } else if (isBo) {
	// 	this.spinUrl = commonConfig.serverIP + commonConfig.serverURL_BO;
	// 	this.callBackUrl = commonConfig.serverIP + "/gameengine/casino/casino.php";
	// } else {
	// 	this.spinUrl = commonConfig.serverIP + commonConfig.serverURL;
	// 	this.callBackUrl = commonConfig.serverIP + "/gameengine/casino/casino.php";
	// }

	//this.spinUrl = commonConfig.serverIP + commonConfig.serverURL;
	this.spinUrl = "https://dev-games.progaindia.com" + commonConfig.serverURL;
	this.callBackUrl = commonConfig.serverIP + "/gameengine/casino/casino.php";

	this.sessionId = getUrlVar('session_id');
	this.isNewUrl = (this.sessionId || this.sessionId == "");

	_mediator.subscribe("InitRequest", this.sendInitReq.bind(this));
	_mediator.subscribe("SM_COLLECT", this.sendSMCollectReq.bind(this));
	_mediator.subscribe("callReSpinRequest", this.sendReSpinReq.bind(this));
	_mediator.subscribe("callFreeSpinRequest", this.sendFSSpinReq.bind(this));
	_mediator.subscribe("callSpinRequest", this.sendSpinReq.bind(this));
	_mediator.subscribe("callFeatureRequest", this.sendFeatureReq.bind(this));
	_mediator.subscribe("callGambleRequest", this.sendGambleReq.bind(this));

	this.isDemoMode = coreApp.getUrlVar("demoMode");
	if (this.isDemoMode) {
		this.demoUrl = "demoserver/" + _ng.GameConfig.gameName + ".json";
		this.loadDemoServer({});
		this.spinCounter = 0, this.featureCounter = 0, this.fsCounter = 0, this.respinCounter = 0;
	}


	this.amountType = coreApp.gameModel.amountType;

}
_ng.SlotService.prototype = Object.create(_ng.CoreService.prototype);
_ng.SlotService.prototype.constructor = _ng.SlotService;

var v = _ng.SlotService.prototype;

v.setModel = function (model) { this.slotModel = model; };

v.sendInitReq = function (obj) {
	var obj = "game_id=" + _ng.GameConfig.gameId + "&request_type=1&amount_type=" + this.amountType + "&username=" + coreApp.getUrlVar("username");
	if (this.isNewUrl) {
		obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
	}
	this.requestType = 1;
	this.callServer(this.spinUrl, obj);
};

v.sendSMCollectReq = function (obj) {
	var obj = "game_id=" + _ng.GameConfig.gameId + "&request_type=7&amount_type=" + this.amountType + "&username=" + coreApp.getUrlVar("username");
	if (this.isNewUrl) {
		obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
	}
	this.requestType = 7;
	this.callServer(this.spinUrl, obj);
};


v.sendReSpinReq = function (obj) {
	this.requestType = 5;
	var obj = "game_id=" + _ng.GameConfig.gameId + "&request_type=2&coin_value=" + coreApp.gameModel.getSelectedCoinValue() + "&num_coins=" + coreApp.gameModel.getSelectedNumCoins() + "&num_betlines=" + coreApp.gameModel.getSelectedLines() + "&amount_type=" + this.amountType + "&username=" + coreApp.getUrlVar("username");
	if (this.isNewUrl) {
		obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
	}

	if (isGermanUI && coreApp.gameModel.spinData.smBalance>0) {
		obj += "&coin_value2=" + _ng.selectedCoinValue2;
	} else {
		obj += "&coin_value2=0";
	}

	this.callServer(this.spinUrl, obj);
};
v.sendFSSpinReq = function (obj) {
	this.requestType = 4;
	var obj = "game_id=" + _ng.GameConfig.gameId + "&request_type=2&coin_value=" + coreApp.gameModel.getSelectedCoinValue() + "&num_coins=" + coreApp.gameModel.getSelectedNumCoins() + "&num_betlines=" + coreApp.gameModel.getSelectedLinesFS() + "&amount_type=" + this.amountType + "&username=" + coreApp.getUrlVar("username");
	if (this.isNewUrl) {
		obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
	}

	if (isGermanUI && coreApp.gameModel.spinData.smBalance>0) {
		obj += "&coin_value2=" + _ng.selectedCoinValue2;
	} else {
		obj += "&coin_value2=0";
	}

	this.callServer(this.spinUrl, obj);
};
v.sendSpinReq = function (obj) {
	this.requestType = 2;
	var amountType = this.amountType;
	if (coreApp.gameModel.getIsPFSActive()) {
		amountType = 3;
	}
	var obj = "game_id=" + _ng.GameConfig.gameId + "&request_type=2&coin_value=" + coreApp.gameModel.getSelectedCoinValue() + "&num_coins=" + coreApp.gameModel.getSelectedNumCoins() + "&num_betlines=" + coreApp.gameModel.getSelectedLines() + "&amount_type=" + amountType + "&username=" + coreApp.getUrlVar("username");
	if (this.isNewUrl) {
		obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
	}


	if (isGermanUI && coreApp.gameModel.spinData.smBalance>0) {
		obj += "&coin_value2=" + _ng.selectedCoinValue2;
	} else {
		obj += "&coin_value2=0";
	}

	this.callServer(this.spinUrl, obj);
};
v.sendFeatureReq = function (obj) {
	this.requestType = 3;
	this.featureId = obj.id;
	var obj = "game_id=" + _ng.GameConfig.gameId + "&request_type=3&amount_type=" + this.amountType + "&username=" + coreApp.getUrlVar("username") + "&&bonus_game_id=" + obj.id + "&pick_position=" + obj.position;
	if (this.isNewUrl) {
		obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
	}
	this.callServer(this.spinUrl, obj);
}
v.sendGambleReq = function (obj) {
	this.requestType = 6;
	var obj = "game_id=" + _ng.GameConfig.gameId + "&request_type=4&amount_type=" + this.amountType + "&username=" + coreApp.getUrlVar("username") + "&pick_position=" + obj.position + "&bet_amount=" + obj.betAmount;
	if (this.isNewUrl) {
		obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
	}
	this.callServer(this.spinUrl, obj);
}
v.sendFreeSpinReq = function (obj) { };
v.sendBonusReq = function (obj) { };
v.callDemoServer = function (obj) {
	switch (this.requestType) {
		case 1:
			this.slotModel.saveInitData(JSON.stringify(this.demoData.init));
			_mediator.publish(_events.core.initReceived);
			_mediator.publish("onGameInitResponse");
			break;
		case 2:
			this.slotModel.saveSpinData(JSON.stringify(this.demoData.spin[this.spinCounter]));
			this.spinCounter++;
			_mediator.publish("onSpinResponse");
			break;
		case 3:
			var featureObj = this.demoData["feature_" + this.featureId];
			var objData = featureObj[this.featureCounter];
			this.slotModel.saveFeatureData(JSON.stringify(objData));
			this.featureCounter++;
			if (objData.current_round.state == 1) {
				this.featureCounter = 0;
			}
			_mediator.publish("onFeatureResponse");
			break;
		case 4:
			this.slotModel.saveSpinData(JSON.stringify(this.demoData.fs[this.fsCounter]));
			this.fsCounter++;
			_mediator.publish("onSpinResponse");
			break;
		case 5:
			this.slotModel.saveSpinData(JSON.stringify(this.demoData.respin[this.respinCounter]));
			this.respinCounter++;
			_mediator.publish("onSpinResponse");
			break;
		case 6:
			this.slotModel.saveGambleResponse(JSON.stringify(this.demoData.spin[this.spinCounter]));
			this.spinCounter++;
			_mediator.publish("onGambleResponse");
			break;
		default:
			break;
	};
}
v.callServer = function (url, obj) {
	if (this.isDemoMode) {
		setTimeout(this.callDemoServer.bind(this, obj), 500);
		return;
	}
	var xhttp = new XMLHttpRequest();
	var parent = this;
	xhttp.onload = function () {
		console.log("onload :: xhttp.status = ", xhttp.status);
		if (xhttp.status == 200) {
			parent.onServerResponse(this.responseText);
		} else {
			_mediator.publish(_events.core.error, { code: "ERROR_OCCURED" });
		}
	};

	xhttp.onerror = function () {
		console.log("onerror :: xhttp.status = ", xhttp.status);
		_mediator.publish(_events.core.error, { code: "NO_INTERNET" });
	};
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	try {
		xhttp.send(obj);
	} catch (e) {
		_mediator.publish(_events.core.error, {
			code: "NO_INTERNET"
		});
	}
};
//time reduce call back method  
v.callServerAfterSpin = function () {
	if (commonConfig.isGameEndService != "true") {
		return;
	}
	var url = this.callBackUrl;
	var obj = "game_id=" + _ng.GameConfig.gameId + "&amount_type=" + this.amountType + "&request_type=5&session_id=" + this.sessionId + "&username=" + coreApp.getUrlVar("username");

	if (this.isDemoMode) { return; }
	var xhttpCallBack = new XMLHttpRequest();
	var parent = this;
	xhttpCallBack.onload = function () {
		if (xhttpCallBack.status == 200) {
			parent.onServerResCallBackEvent(this.responseText);
		} else {
			//_mediator.publish(_events.core.error, { code: "ERROR_OCCURED" });
		}
	};
	xhttpCallBack.onerror = function () {
		//_mediator.publish(_events.core.error, { code: "NO_INTERNET" });
	};
	xhttpCallBack.open("POST", url, true);
	xhttpCallBack.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	try {
		xhttpCallBack.send(obj);
	} catch (e) {
		//_mediator.publish(_events.core.error, { code: "NO_INTERNET" });
	}
};
v.onServerResCallBackEvent = function () {
	console.log(" call back received ");
}


v.loadDemoServer = function (obj) {
	var xhttp = new XMLHttpRequest();
	var parent = this;
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			parent.demoData = JSON.parse(this.responseText);
		}
	};
	xhttp.open("GET", this.demoUrl, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(obj);
}
v.onServerResponse = function (resObj) {
	var jsonObj = JSON.parse(resObj);
	if (jsonObj.error_number !== undefined) {
		_mediator.publish(_events.core.error, {
			code: jsonObj.error_code,
			message: jsonObj.error_message,
			extraInfo: jsonObj.extra_info
		});
		return;
	}
	switch (this.requestType) {
		case 1:
			this.slotModel.saveInitData(resObj);
			_mediator.publish(_events.core.initReceived);
			_mediator.publish("onGameInitResponse");
			this.callServerAfterSpin();
			break;
		case 2:
			this.slotModel.saveSpinData(resObj);
			_mediator.publish("onSpinResponse");
			this.callServerAfterSpin();
			break;
		case 3:
			this.slotModel.saveFeatureData(resObj);
			_mediator.publish("onFeatureResponse");
			this.callServerAfterSpin();
			break;
		case 4:
			this.slotModel.saveSpinData(resObj);
			_mediator.publish("onSpinResponse");
			this.callServerAfterSpin();
			break;
		case 5:
			this.slotModel.saveSpinData(resObj);
			_mediator.publish("onSpinResponse");
			this.callServerAfterSpin();
			break;
		case 6:
			this.slotModel.saveGambleResponse(resObj);
			_mediator.publish("onGambleResponse");
			this.callServerAfterSpin();
			break;
		case 7:
			this.slotModel.saveBalanceInfoSM(resObj);
			_mediator.publish("onSMCollectResponse");
			this.callServerAfterSpin();
			break;
		default:
			break;
	};
};