var _ng = _ng || {};
_ng.SlotService = function () {
	_ng.CoreService.call(this);
	// this.slotModel = slotModel;

	var isLocal = false;
	this.serverURL = "";
	this.initUrl = this.serverURL+"/casino_new/casino_server.php";
	
	this.spinUrl = this.serverURL+"/casino_new/casino_server.php";

	//this.initUrl = "localhost:8888/casino_new/init.php";
	//this.spinUrl = "localhost:8888/casino_new/spin.php";


	//this.gambleUrl = "http://localhost/slot/gamble.php";
	//this.featureUrl = "http://localhost/slot/feature.php";
	_mediator.subscribe("InitRequest", this.sendInitReq.bind(this));
	_mediator.subscribe("callReSpinRequest", this.sendReSpinReq.bind(this));
	_mediator.subscribe("callFreeSpinRequest", this.sendFSSpinReq.bind(this));
	_mediator.subscribe("callSpinRequest", this.sendSpinReq.bind(this));
	_mediator.subscribe("callFeatureRequest", this.sendFeatureReq.bind(this));
}

_ng.SlotService.constructor = _ng.SlotService;
_ng.SlotService.prototype = Object.create(_ng.CoreService.prototype);

var v = _ng.SlotService.prototype;
v.setModel = function(model){
    this.slotModel = model;
};
v.sendInitReq = function (obj) {
	// console.log("init request sent to server ------>");
	var obj = "game_id="+_ng.GameConfig.gameId+"&request_type=1&amount_type=1&username="+coreApp.getUrlVar("username");
	console.log("--- game init req-->: ", obj);
	this.requestType = 1;
	this.callServer(this.initUrl, obj);
	// var obj1 = {"player":{"first_name":"ameer","user_name":"ameer","account_id":7,"balance":"12618.68","bank":"2.00","cash":"12618.68","bonus_bucks":"1000.00"},"game":{"game_id":"8","game_name":"egyptcleopatra","num_rows":"3","num_columns":"5","min_coins":"1","max_coins":"5","default_coins":"2","default_coin_value":"10","coin_values":"1;2;3;4;5;10;20;50","num_paylines":"10"},"current_round":[],"next_round":[],"previous_round":{"round_id":"188942","matrix":"cgged;defwf;efdce","win_amount":"0.00","sticky_win_details":""}};

	// setTimeout(this.onServerResponse.bind(this, obj1), 200);
};
v.sendSpinReq = function (obj) {
	this.requestType = 2;
	var obj = "game_id="+_ng.GameConfig.gameId+"&request_type=2&coin_value="+coreApp.gameModel.getSelectedCoinValue()+"&num_coins="+coreApp.gameModel.getSelectedNumCoins()+"&num_betlines="+coreApp.gameModel.getSelectedLines()+"&game_name="+_ng.GameConfig.gameName+"&amount_type=1&username="+coreApp.getUrlVar("username");
	console.log("--- game spin req-->: ", obj);
	this.callServer(this.spinUrl, obj);
};
v.sendReSpinReq = function (obj) {
	this.requestType = 5;
	var obj = "game_id="+_ng.GameConfig.gameId+"&request_type=2&coin_value="+coreApp.gameModel.getSelectedCoinValue()+"&num_coins="+coreApp.gameModel.getSelectedNumCoins()+"&num_betlines="+coreApp.gameModel.getSelectedLines()+"&game_name="+_ng.GameConfig.gameName+"&amount_type=1&username="+coreApp.getUrlVar("username");
	console.log("--- game spin req-->: ", obj);
	this.callServer(this.spinUrl, obj);
};
v.sendFSSpinReq = function (obj) {
	this.requestType = 4;
	var obj = "game_id="+_ng.GameConfig.gameId+"&request_type=2&coin_value="+coreApp.gameModel.getSelectedCoinValue()+"&num_coins="+coreApp.gameModel.getSelectedNumCoins()+"&num_betlines="+coreApp.gameModel.getSelectedLines()+"&game_name="+_ng.GameConfig.gameName+"&amount_type=1&username="+coreApp.getUrlVar("username");
	console.log("--- game spin req-->: ", obj);
	this.callServer(this.spinUrl, obj);
};
v.sendFeatureReq = function (obj) {
	this.requestType = 3;
	var obj = "game_id="+_ng.GameConfig.gameId+"&request_type=3&game_name="+_ng.GameConfig.gameName+"&amount_type=1&username="+coreApp.getUrlVar("username")+"&&bonus_game_id="+obj.id+"&pick_position="+obj.position;
	this.callServer(this.spinUrl, obj);
}

v.sendFreeSpinReq = function (obj) {};
v.sendBonusReq = function (obj) {};
v.sendGambleReq = function (obj) {};

v.callServer = function(url, obj) {
  var xhttp = new XMLHttpRequest();
  var parent = this;
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      parent.onServerResponse(this.responseText);
    }else{
			_mediator.publish("showErrorMsg", "No active internet! Reload game", "reloadGame");
		}
	};
	xhttp.onerror = function () {
		_mediator.publish("showErrorMsg", "No active internet! Reload game", "reloadGame");
	};
  xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(obj);
};


v.onServerResponse = function (resObj) {
	// console.log("SResponse---------------------------------->>>");
	resObj.responseType = this.requestType;
	console.log(resObj);
	
	switch (this.requestType){
		case 1:
			this.slotModel.saveInitData(resObj);
			_mediator.publish(_events.core.initReceived);
			_mediator.publish("onGameInitResponse");
			break;
		case 2:
			console.log("=================///////////////=========");
			this.slotModel.saveSpinData(resObj);
			_mediator.publish("onSpinResponse");
			break;
		case 3:
			this.slotModel.saveFeatureData(resObj);
			_mediator.publish("onFeatureResponse");
			break;
		case 4:
			this.slotModel.saveSpinData(resObj);
			_mediator.publish("onSpinResponse");
			break;
		case 5:
			this.slotModel.saveSpinData(resObj);
			_mediator.publish("onSpinResponse");
			break;
		default:
			break;
	};
};
