var fsModel = FreeSpinModel.prototype;

//TODO
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
        if(obj.next_round.fs_game_id == 4) {
			_ng.BuyFSenabled = true;
        }
        if(obj.next_round.fs_game_id == 8) {
			_ng.GameConfig.superBuyEnabled = true;
        }
		if(obj.next_round.fs_game_id == 6) {
			_ng.twoXBetEnabled = true;
		}
	}
}

fsModel.saveSpinData = function (obj) {

		//block freespin spins
		if(this.isFreeSpinActive && obj.current_round.spin_type == 'normal') {
  
			_mediator.publish(_events.core.error, {
			 code: "INVALID_SESSION",
			 message: "invalid session or session does not exist",
			 extraInfo: {error_source : "rgs"}
			});
		  
			return;
		   }
		   
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
		if(obj.next_round.fs_game_id == 4) {
			_ng.BuyFSenabled = true;
        }
        if(obj.next_round.fs_game_id == 8) {
			_ng.GameConfig.superBuyEnabled = true;
        }
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