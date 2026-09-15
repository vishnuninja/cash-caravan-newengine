FreeSpinModel = function () {
	this.isFreeSpinTriggered = false;
	this.isFreeSpinEnded = false;
	this.isFreeSpinActive = false;
	
	this.isFullFSActive = false;		//will be set false only on listening on onFSEndShown
	this.totalFreeSpins = 0;
	this.totalFSTriggered = 0;
	this.remainingFreeSpins = 0;
	this.totalFSWin = 0;
	this.multiplier = 0;
};

var fsModel = FreeSpinModel.prototype;


fsModel.saveInitData = function (obj) {
	if (obj.next_round.type === "freespins") {
		this.isFreeSpinActive = true;
		this.isFullFSActive = true;
		this.totalFreeSpins = obj.next_round.num_spins;
		this.totalFSTriggered = obj.next_round.num_spins;
		this.remainingFreeSpins = obj.next_round.spins_left;
		this.totalFSWin = obj.next_round.total_fs_win_amount || 0;
		this.multiplier = obj.next_round.multiplier || 0;
		this.source = obj.next_round.source;
		
		if(_ng.GameConfig.gameId == 14 || _ng.GameConfig.gameId == 1141){
			_ng.wildSymbol = obj.previous_round.bonus_details.exp_symbol ? obj.previous_round.bonus_details.exp_symbol : "10";
		}
	}
}

fsModel.saveSpinData = function (obj) {
	//reset data 
	this.isFreeSpinEnded = false;
	if (obj.current_round && obj.current_round.bonus_games_won) {
		for (let i = 0; i < obj.current_round.bonus_games_won.length; i++) {
			if (obj.current_round.bonus_games_won[i].type == "freespins") {
				var wObj = obj.current_round.bonus_games_won[i];
				this.isFreeSpinActive = true;
				this.isFullFSActive = true;
				this.isFreeSpinTriggered = true;
				this.totalFreeSpins = wObj.num_spins;
				this.totalFSTriggered = wObj.num_spins;
				this.remainingFreeSpins = wObj.spins_left;
				this.totalFSWin = wObj.win_amount || 0;

				//set wild here 
			}
		}

		//mystic ocean
		if(_ng.GameConfig.gameId == 14 && this.isFreeSpinTriggered && _ng.wildSymbol == undefined){
			try{
				_ng.wildSymbol = obj.current_round.bonus_games_won[0].exp_symbol ?  obj.current_round.bonus_games_won[0].exp_symbol : "10";
			}catch(e){};
		}

	}
	this.multiplier = obj.next_round.multiplier || 0;
	if (obj.current_round.freespin_state === 1) {
		this.totalFSWin = obj.current_round.total_fs_win_amount || 0;
		this.isFreeSpinEnded = true;
		this.isFreeSpinActive = false;
		this.remainingFreeSpins = 0;
	}

	if (obj.next_round.type === "freespins") {
		this.isFreeSpinActive = true;
		this.isFullFSActive = true;
		this.totalFreeSpins = obj.next_round.num_spins;
		this.remainingFreeSpins = obj.next_round.spins_left;
		this.totalFSWin = obj.current_round.total_fs_win_amount || 0;
	}

	if(_ng.GameConfig.gameId == 14 || _ng.GameConfig.gameId == 1141){
		//save postmatrix 
		//1. matrix
		this.postMatrix = obj.current_round.post_matrix_info.matrix;
		//2. total win amount 
		//total_fs_win_amount /// payline_win_amount // win_amount
		this.postMatrixTotalWin = obj.current_round.win_amount;
		this.postMatrixWinAmount = obj.current_round.post_matrix_info.exp_amount;
		if(obj.current_round.post_matrix_info.exp_amount){
		   this.preWinAmount = this.postMatrixTotalWin - this.postMatrixWinAmount;
		}else{
		   this.preWinAmount = this.postMatrixTotalWin;
		}
		console.log(obj.current_round.post_matrix_info.length , "onresposne ");
		if(obj.current_round.post_matrix_info.length==0){
			_ng.isExpWildAcitve = false;
		}else{
		_ng.wildSymbol = obj.current_round.post_matrix_info.exp_symbol ?  obj.current_round.post_matrix_info.exp_symbol : "10";//previous_round.bonus_details.exp_symbol
		_ng.expand_positions = obj.current_round.post_matrix_info.expand_positions ?  obj.current_round.post_matrix_info.expand_positions : [];
		_ng.isExpWildAcitve = obj.current_round.post_matrix_info.feature_name ? true : false;
		_ng.paylineDetails = obj.current_round.post_matrix_info.payline_details;
		}
	}
};

fsModel.setFreespins = function (obj) {
	this.isFreeSpinActive = obj.freespinsActive;
	this.remainingFreeSpins = obj.left;
	this.totalFreeSpins = obj.total;
	if (obj.freespinsActive) {
		this.isFullFSActive = true;
	}
}


fsModel.getMultiplier = function () {
	return this.multiplier;
};

fsModel.isMultiplier = function () {
	return this.multiplier > 1 ? true : false;
};

fsModel.isActive = function () {
	return this.isFreeSpinActive;
};

fsModel.currentCount = function (argument) {
	return this.remainingFreeSpins;
}

fsModel.totalCount = function (argument) {
	return this.totalFreeSpins;
}
fsModel.totalTriggeredCount = function () {
	return this.totalFSTriggered;
}


fsModel.getIsFreeSpinTriggered = function () {
	return this.isFreeSpinTriggered;
}

fsModel.setIsFreeSpinTriggered = function (bool) {
	this.isFreeSpinTriggered = bool;
}

fsModel.getIsFreeSpinEnded = function () {
	return this.isFreeSpinEnded;
}

fsModel.setFreeSpinEnded = function (bool) {
	this.isFreeSpinEnded = bool;
}

fsModel.getFreeSpinTotalWin = function () {
	return this.totalFSWin;
}


fsModel.setFreeSpinActiveStatus = function (bool) {
	this.isFreeSpinActive = bool;
	if (bool) {
		this.isFullFSActive = true;
	}
}
fsModel.setFullFSActiveStatus = function (bool) {
	this.isFullFSActive = bool;
}

fsModel.setFreespinsTotalCount = function (num) {
	this.totalFreeSpins = num;
}

fsModel.setFreespinsCurrentCount = function (num) {
	this.remainingFreeSpins = num;
}