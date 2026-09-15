function TickerViewController(){

}
var tbox = TickerViewController.prototype;
tbox.setView = function (view) {
	this.view = view;
	this.createListeners();
}
tbox.createListeners = function () {	
	_mediator.subscribe("SHOW_TICKER", this.toggleTicker.bind(this, true));
	_mediator.subscribe("HIDE_TICKER", this.toggleTicker.bind(this, false));

	_mediator.subscribe("SHOW_TICKER_MESSAGE", this.showMessage.bind(this));
	_mediator.subscribe("showSingleLine", this.showLineWinMessage.bind(this, false));
	_mediator.subscribe("SHOW_IDLE_MESSAGE", this.showIdleMessage.bind(this, false));
	if(_ng.GameConfig.tickerConfig.hasMGTicker){
		_mediator.subscribe("spinStart", this.onSpinClick.bind(this));
		_mediator.subscribe("allReelsStopped", this.onAllReelStopped.bind(this));
	}
	_mediator.subscribe(_events.core.onResize, this.onResize.bind(this));
};

tbox.onSpinClick = function(){
	//if(!coreApp.gameModel.isFreeSpinActive()){
		this.view.onSpinClick();	
	//}
}

tbox.onAllReelStopped = function(){
	if(!coreApp.gameModel.isFreeSpinActive()){
		this.view.onAllReelStopped();
	}
}

tbox.onSpinStart = function (msg) {
	if(coreApp.gameModel.isAutoSpinActive()){
		var msg = pixiLib.getLiteralText("Autospins");
		this.showMessage(msg + ": "+coreApp.gameModel.getAutoSpinCurrentCount()+"/"+coreApp.gameModel.getAutoSpinTotalCount());
	}else{
		this.showMessage(msg);
	}
}
tbox.showIdleMessage = function(){
	if(!coreApp.gameModel.isFreeSpinActive()){
		this.view.showIdleMessage();
	}
};


tbox.showLineWinMessage = function(obj, v1, v2){
	//console.log(obj, v1, v2);
	var winObj = coreApp.gameModel.spinData.getTotalLineWins()[v2];
	var winAmount = pixiLib.getFormattedAmount(winObj.win);
	this.view.showMessage("Line win: line "+winObj.line+" win "+winAmount);
};

tbox.clearLineWins = function(){
	//this.view.showMessage("");	
}


tbox.showMessage = function (msg) {
	this.view.showMessage(msg);
}

tbox.showBuildMessage = function (type) {
	//this.view.showMessage(this.getCustomMsg(type));
}

tbox.getCustomMsg =  function (type) {
	var txt = "";
	// if(type === "lineWin"){
	// 	txt = "line:"+valuesObj.line + " win:"+valuesObj.winAmount;
	// }else if(type === "TotalWin"){
	// 	txt = "Total win:"+valuesObj;
	// }
	return txt;
}

tbox.toggleTicker = function (Bool) {
	if(Bool){
		this.view.show();	
	}else{
		this.view.hide();	
	}
	
}
tbox.onResize = function (argument) {
	this.view.onResize();
}
