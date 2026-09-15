AutoSpinModel = function (argument) {
	this.isAutoSpinActive = false;
	this.totalAutoSpins = 0;
	this.currentCount = 0;
	this.currentTotalWin = 0;
	this.currentTotalLoss = 0;
};

var autoModel = AutoSpinModel.prototype;

autoModel.isActive = function () {
	return this.isAutoSpinActive;
};

autoModel.getCurrentCount = function (argument) {
	return this.currentCount;
}

autoModel.setCurrentCount = function (num) {
	this.currentCount = num;
}

autoModel.getTotalCount = function () {
	return this.totalAutoSpins;
}
autoModel.startAutoSpin = function (num) {
	this.isAutoSpinActive = true;
	this.totalAutoSpins = num;
	this.currentCount = 0;

	//this.asWinLimitValue = Number(this.winMultiplier * coreApp.gameModel.getTotalBet());
	//this.asLossLimitValue = coreApp.gameModel.getBalance() - (this.lossMultiplier * coreApp.gameModel.getTotalBet());
	this.asLossLimitAmount = coreApp.gameModel.getBalance() - this.asLossLimitValue;

	// console.log("win limit active ?", this.getIsASWinLimitActive());
	// console.log("selected WIn Limit :  ", this.asWinLimitValue);

	// console.log("Loss limit active ?", this.getIsASLossLimitActive());
	// console.log("selected asLossLimitValue Limit :  ", this.asLossLimitValue);
}

autoModel.stopAutoSpin = function () {
	this.isAutoSpinActive = false;
	this.totalAutoSpins = 0;
	this.currentCount = 0;
}
autoModel.setStopOnAnyWin = function (bool) {
	this.stopOnAnyWinActive = bool;
}
autoModel.getIsStopOnAnyWin = function (bool) {
	return this.stopOnAnyWinActive;
}
autoModel.setASWinLimit = function (bool, val) {
	this.winMultiplier = val;
	this.asWinLimitValue = val;
	this.isASWinLimitActive = bool;
	// console.log(val, "loss win value ");
}
autoModel.getIsASWinLimitActive = function(){
	return this.isASWinLimitActive;
}
autoModel.getIsASWinLimitValue = function(){
	return Number(this.asWinLimitValue).toFixed(2);
}

autoModel.setASLossLimit = function (bool, val) {
	this.lossMultiplier = val;
	this.asLossLimitValue = val;
	this.isASLossLimitActive = bool;
	// console.log(val, "loss limit value ");
	
}
autoModel.getIsASLossLimitActive = function(){
	return this.isASLossLimitActive;
}
autoModel.getIsASLossLimitValue = function(){	
	var val = this.asLossLimitAmount ? this.asLossLimitAmount : 0;
	return val.toFixed(2);
}

