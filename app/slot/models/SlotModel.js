_ng.SlotModel = function () {
	//CoreModel.call(this, coreApp);
	this.userModel = new UserModel();
	this.panelModel = new PanelModel();
	this.settingsModel = new SettingsModel();
	this.autoSpinData = new AutoSpinModel();
	this.freeSpinData = new FreeSpinModel();
	this.PFSData = new PromoFreeSpinModel();
	this.featureData = new FeatureModel();
	this.gambleData = new GambleModel();
	this.spinData = new SpinData(); //wins/matrix all other info about spin
	this.isRealityCheckActive = false;
	//walking wild 
	this.isWalkingWildAvailable = false;
	this.isBigWin = false;
	this.isError = false;
	//Sticky Re-spin Feature (Candy)
	//Storing Symbol Position to make them sticky in Winview
	this.stickyRSSymbols = [];
	this.amountType = coreApp.getUrlVar("amount_type") ? coreApp.getUrlVar("amount_type") : 1;
}

_ng.SlotModel.constructor = _ng.SlotModel;
//SlotModel.prototype = Object.create(CoreModel.prototype);

var data = _ng.SlotModel.prototype;

data.saveInitData = function (obj) {
	this.obj = JSON.parse(obj);
	this.userModel.saveUserInfo(this.obj);
	this.panelModel.saveInitData(this.obj);
	this.spinData.saveInitData(this.obj);
	this.freeSpinData.saveInitData(this.obj);
	this.gambleData.saveInitData(this.obj);
	this.PFSData.saveInitData(this.obj);
	this.updatePanelModel();

}
data.saveBalanceInfoSM = function (obj) {
	this.spinData.smBalance = obj.player.balance2 || 0;
}

data.saveGambleResponse = function (obj) {
	this.obj = JSON.parse(obj);
	this.gambleData.saveGambleResponse(this.obj);
	this.spinData.saveGambleResponse(this.obj);
	this.userModel.saveUserInfo(this.obj);
	this.PFSData.saveSpinData(this.obj);
	this.updatePanelModel();
	//set balance 
	//set win amount 
}

data.saveFeatureData = function (obj) {
	this.obj = JSON.parse(obj);
	this.userModel.saveUserInfo(this.obj);
	this.spinData.saveFeatureData(obj);
	this.PFSData.saveSpinData(this.obj);
	this.updatePanelModel();
}

data.isBigWinActive = function () {
	if (!_viewInfoUtil.isSecondaryAssetsLoaded || _ng.isSkipBigwinActive == true) {
		return false;
	}
	return this.isBigWin;
}

data.getBalance = function (argument) {
	return this.userModel.getBalance();
};
data.setBalance = function (data) {
	this.userModel.setBalance(data);
};
data.getCurrencyCode = function () {
	return this.userModel.getCurrencyCode();
};

data.saveSpinData = function (obj) {
	this.obj = JSON.parse(obj);
	this.userModel.saveUserInfo(this.obj);
	this.panelModel.saveInitData(this.obj);
	this.spinData.saveSpinData(this.obj);
	this.freeSpinData.saveSpinData(this.obj);
	this.gambleData.saveSpinData(this.obj);
	this.PFSData.saveSpinData(this.obj);
	this.updatePanelModel();
	//check is bigwin available 
	this.checkBigwinAvailable();

}

data.checkBigwinAvailable = function () {
	if (this.getTotalWin() > 0) {
		if (_ng.GameConfig.specialWins.bigWin.multiplier * this.getTotalBet() <= this.getTotalWin()) {
			this.isBigWin = true;
		} else {
			this.isBigWin = false;
		}
	}
}
data.getTotalFSWin = function () {
	return this.freeSpinData.getFreeSpinTotalWin();
}

data.getAllTotalBet = function () {
	return this.panelModel.getAllTotalBet();
}
data.setAllTotalBet = function (totalBet) {
	return this.panelModel.setAllTotalBet(totalBet);
}

data.getAllTotalWin = function () {
	return this.spinData.getAllTotalWinAmount();
}

data.getTotalWin = function () {
	return this.spinData.getTotalWinAmount();
}
data.getReelMatrix = function () {
	return this.spinData.getReels();
};

data.getPostMatrix = function () {
	return this.spinData.getPostMatrix();
};

data.getTotalBet = function () {
	return this.panelModel.getTotalBet();
}
data.getTotalBetPerLine = function () {
}
data.getTotalWinLines = function (argument) {
	return this.spinData.getTotalLineWins();
};
data.getTotalWinLinesNumbers = function (argument) {
	return this.spinData.getTotalWinLinesNumbers();
};
data.getTotalWinSymbols = function (argument) {
	return this.spinData.getTotalWinSymbols();
};

data.getPostMatrixInfo = function () {
	return this.spinData.getPostMatrixInfo();
};
data.getMinimumLines = function (argument) {
	// body...
}
data.getMinBet = function (argument) {
	// body...
}
data.getMaxBet = function (argument) {
	// body...
}
data.getBetValues = function (argument) {
	// body...
}
data.setMaxBet = function (argument) {
	// body...
}
//Autospin data----------------
data.isAutoSpinActive = function () {
	return this.autoSpinData.isActive();
}
data.getAutoSpinCurrentCount = function () {
	return this.autoSpinData.getCurrentCount();
}
data.setAutoSpinCurrentCount = function (num) {
	return this.autoSpinData.setCurrentCount(num);
}
data.getAutoSpinTotalCount = function () {
	return this.autoSpinData.getTotalCount();
}

data.startAutoSpins = function (num) {
	this.autoSpinData.startAutoSpin(num);
}
data.stopAutoSpins = function () {
	this.autoSpinData.stopAutoSpin();
}
/********Promo Freespin Data*********/
data.getIsPFSTriggered = function () {
	return this.PFSData.isPFSTriggered;
}
data.getIsPFSActive = function () {
	return this.PFSData.isPFSActive;
}
data.getIsFullPFSActive = function () {
	return this.PFSData.isFullPFSActive;
}
data.getIsPFSEnded = function () {
	return this.PFSData.isPFSEnded;
}
data.updatePanelModel = function () {
	if (this.PFSData.isFullPFSActive) {
		var PFSData = this.PFSData.getPFSData();
		this.userModel.updateUserModelWithPFS(PFSData);
		this.panelModel.updatePanelModelWithPFS(PFSData);
	}
}
data.getTotalPFS = function () {
	return this.PFSData.totalPromoFreeSpins;
}
data.getRemainingPFS = function () {
	return this.PFSData.remainingPromoFreeSpins;
}
data.getTotalPFSWin = function () {
	return this.PFSData.totalPFSWins;
}
/*************************************/


data.isGambleActive = function () {
	return this.gambleData.isGambleInitActive;
}


//Freespin data----------------
data.getIsFreeSpinTriggered = function () {
	return this.freeSpinData.getIsFreeSpinTriggered();
}
data.setIsFreeSpinTriggered = function (bool) {
	this.freeSpinData.setIsFreeSpinTriggered(bool);
}
data.getIsFreeSpinEnded = function () {
	return this.freeSpinData.getIsFreeSpinEnded();
}
data.isFreeSpinActive = function () {
	return this.freeSpinData.isActive();
}
data.setFreeSpinActiveStatus = function (bool) {
	this.isFreeSpinActive.setFreeSpinActiveStatus(bool);
};
data.isFullFSActive = function () {
	return this.freeSpinData.isFullFSActive;
}
data.getFreeSpinCurrentCount = function () {
	return this.freeSpinData.currentCount();
}

data.setFreespinsCurrentCount = function (num) {
	this.freeSpinData.setFreespinsCurrentCount(num);
}
data.getTotalFreeSpins = function (argument) {
	return this.freeSpinData.totalCount();
}
data.getFreeSpinTotalCount = function () {
	return this.freeSpinData.totalCount();
}
data.getTotalFSTriggered = function () {
	return this.freeSpinData.totalTriggeredCount();
}
data.setFreespinsTotalCount = function (num) {
	this.freeSpinData.setFreespinsTotalCount(num);
}
//isWalkingWild 
data.isWalkingWildActive = function () {
	return this.isWalkingWildAvailable;
}
data.setWalkingWildActive = function (bool) {
	this.isWalkingWildAvailable = bool;
}
//isReSpinActive 
data.isReSpinActive = function () {
	return this.spinData.getIsRespinActive();
}
data.setReSpinActive = function (bool) {
	this.isReSpinActive = bool;
}
//feature is active
data.isFeatureActive = function () {
	// return this.featureData.isActive();
	return this.spinData.getIsBonusTriggered();
}
data.getFeatureObject = function () {
	return this.spinData.getFeatureObject();
}


data.setFreespins = function (obj) {
	this.freeSpinData.setFreespins(obj);
}

data.isFeatureData = function () {
	return this.spinData.getIsBonusTriggered();
}
data.isUnityFeature = function () {
	return this.spinData.isUnityFeature;
}
data.isGiantFeature = function () {
	return this.spinData.isGiantFeature;
}
/************ Candy Sticky Respin Feature **************/
data.isStickyRespinTriggered = function () {
	return this.spinData.isStickyRespinTriggered;
}
data.isStickyRespinActive = function () {
	return this.spinData.isStickyRespinActive;
}
data.getStickyRSSymbols = function () {
	return this.spinData.stickyRSSymbols;
}
data.isSpawningWildActive = function () {
	return this.spinData.getIsSpawningWildActive();
}
/*******************************************************/
//isSpaceClick active 
data.isSpaceClick = function () {
	this.isSpaceClickActive = false;
}

data.setSpaceClick = function (bool) {
	this.isSpaceClickActive = bool;
}

//isBgSound active 
data.isBgSound = function () {
	this.isBgSoundPlay = false;
}

data.setSpaceClick = function (bool) {
	this.isBgSoundPlay = bool;
}

data.formatAmount = function (winAmount) {
	return winAmount.toFixed(2);
}
data.getSelectedNumCoins = function () {
	return this.panelModel.getSelectedNumCoins();
}
data.getSelectedCoinValue = function () {
	return this.panelModel.getCoinValue();
}
data.getSelectedLines = function () {
	if (_ng.GameConfig.paylinesType === "fixed") {
		return _ng.GameConfig.paylines;
	}
	//return this.panelModel.numberPaylines;
	return this.panelModel.selectedPaylines;
}
data.getSelectedLinesFS = function () {
	if (this.panelModel.fsPaylines) {
		return this.panelModel.fsPaylines;
	} else {
		this.getSelectedLines();
	}
}
data.getCoinArray = function () {
	return this.panelModel.getCoinArray();
}
data.getCoinIndex = function () {
	return this.panelModel.getCoinIndex();
}
data.getCoinValue = function () {
	return this.panelModel.getCoinValue();
}
/*data.getBalance = function(){
	return this.panelModel.getBalance();
}*/
data.getLineValue = function () {
	return this.panelModel.getLineValue();
}
data.getTotalPaylines = function () {
	return this.panelModel.getTotalPaylines();
}

data.getIsRespinTriggered = function () {
	return this.spinData.getIsRespinTriggered();
}
data.setIsRespinTriggered = function (bool) {
	this.spinData.setIsRespinTriggered(bool);
}

data.getRespinsTotal = function () {
	return this.spinData.getRespinsTotal();
}
data.getRespinsLeft = function () {
	return this.spinData.getRespinsLeft();
}
data.getWildMultiplier = function () {
	return this.spinData.getWildMultiplier();
}
data.getFeatureParentType = function () {
	return this.spinData.getFeatureParentType();
}
data.getStickySymbols = function (params) {
	return this.spinData.getStickySymbols();

}
