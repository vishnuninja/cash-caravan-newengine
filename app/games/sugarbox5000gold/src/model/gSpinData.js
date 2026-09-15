var gSpinData = SpinData.prototype;

gSpinData.saveInitData = function (obj) {
	//Store Previous Data, if any
	this.preReels = undefined;
	this.isInitCall = true;
	this.stickyMsgArr = [];

	if (obj.previous_round) {
		if (obj.previous_round.round_id) {
			this.roundId = obj.previous_round.round_id;
		}
		if (obj.previous_round.win_amount) {
			this.totalWin = obj.previous_round.win_amount;
			// this.allTotalWin += this.totalWin;
		}
		if(obj.previous_round.matrix2 && obj.previous_round.matrix2.length>1)
			{
				var matrix = obj.previous_round.matrix2;
			var tempMatrix = matrix.split(";");
			this.reels = [];
			for (var i = 0; i < tempMatrix.length; i++) {
				for (var j = 0; j < tempMatrix[i].length; j++) {
					if (i == 0) {
						this.reels[j] = [];
					}
					this.reels[j].push(tempMatrix[i][j]);
				}
			}
			}
		else if (obj.previous_round.matrix) {
			var matrix = obj.previous_round.matrix;
			var tempMatrix = matrix.split(";");
			this.reels = [];
			for (var i = 0; i < tempMatrix.length; i++) {
				for (var j = 0; j < tempMatrix[i].length; j++) {
					if (i == 0) {
						this.reels[j] = [];
					}
					this.reels[j].push(tempMatrix[i][j]);
				}
			}
		}

		this.current_level = 0;
		//this is for TOE
		if (obj.previous_round.bonus_details) {
			for (let i = 0; i < obj.previous_round.bonus_details.length; i++) {

				// if (_ng.GameConfig.gameId == 1 || _ng.GameConfig.gameId == 8 || _ng.GameConfig.gameId == 1081 || _ng.GameConfig.gameId == 1082 || _ng.GameConfig.gameId == 1083 || _ng.GameConfig.gameId == 2081) {
				if (_ng.GameConfig.featureType == "ProgressFeature") {
					if (obj.previous_round.bonus_details[i].type == "progress_bar") {
						this.isProgressbarActive = true;
						this.bar_value = obj.previous_round.bonus_details[i].bar_value;
						this.current_level = obj.previous_round.bonus_details[i].current_level;
					} else if (obj.previous_round.bonus_details[i].type == "sticky_wilds_reel") {
						this.isStickyWildsReelActive = true;
						this.sticky_symbol = obj.previous_round.bonus_details[i].sticky_symbol;
						this.positions = obj.previous_round.bonus_details[i].positions;
						this.stickyMsgArr.push(obj.previous_round.bonus_details[i]);
						this.spawningWildReelNum = this.getStickyWildsPositions(this.positions);
					} else if (obj.previous_round.bonus_details[i].type == "multiplier") {
						this.isMultiplierActive = true;
						this.multiplierValue = obj.previous_round.bonus_details[i].value;
						this.stickyMsgArr.push(obj.previous_round.bonus_details[i]);
					} else if (obj.previous_round.bonus_details[i].type == "win_both_ways") {
						this.isWinBothWaysActive = true;
						this.freespins = obj.previous_round.bonus_details[i].freespins;
						this.stickyMsgArr.push(obj.previous_round.bonus_details[i]);
					}
				}
				if (obj.previous_round.bonus_details[i].type == "bonus_game") {

					if (obj.previous_round.bonus_details[i].pick_details) {
						this.pickDetails = obj.previous_round.bonus_details[i].pick_details;
					}
				}
			}
		}

		// this is for IB
		if (obj.previous_round.feature_details) {
			if (obj.previous_round.feature_details.type == "200bets" || obj.previous_round.feature_details.type == "ultraspin" || obj.previous_round.feature_details.type == "free_game") {
				this.isBonusFreatureMSG = true;
				this.bonusFreatureMSGType = obj.previous_round.feature_details.type;
				this.bonusFreatureMSGValue = obj.previous_round.feature_details.value;
				this.preFeatureActivity = this.bonusFreatureMSGType == "200bets" ? true : false;
				this.postFeatureActivity = this.bonusFreatureMSGType != "200bets" ? true : false;
			} else {
				this.featureDetails = obj.previous_round.feature_details;
			}
		}

		/*************Candy Sticky Respin Feature ************/
		if (obj.next_round && obj.next_round.type == "sticky_respin") {
			this.isStickyRespinTriggered = true;
			this.isStickyRespinActive = true;
			this.stickyRSSymbols = obj.next_round.sticky_positions;
		}
		/******************************************************/


		/************Gamble unfinished Feature ************/
		if (obj.next_round && obj.next_round.type === "gamble") {
			this.isGambleActive = true;
			this.gambleBetAmount = obj.next_round.bet_amount;
		}
		/******************************************************/

		/********************coin toss (gamble feature) ************************/
		if(obj.gamble_recovery_data){
			this.gamble_feature_active = obj.gamble_recovery_data.gamble_feature_active;
			coreApp.gameModel.freeSpinData.totalFSWin = obj.gamble_recovery_data.round_total_win * 100;

		}


		/*************** Warrior Quest Respin Feature ******************/
		//need to recheck 
		if (obj.current_round && obj.current_round.bonus_games_won && obj.current_round.bonus_games_won.length > 0 && obj.current_round.bonus_games_won[0].type == "respins") {
			this.isStickyRespinTriggered = true;
		}

		//only for wrath condition  
		if ((_ng.GameConfig.featureType == "SWR") && obj.next_round && obj.next_round.type == "respins") {
			this.spawningWildReelNum = this.getWildsPositions(this.formatMatrix(obj.previous_round.matrix));
			if (this.spawningWildReelNum.length > 0) {
				this.isSpawningWild = true;
			}
		}

		//is respin active
		if (obj.next_round.type === "respins" && obj.next_round.spins_left > 0) {
			this.parentType = obj.next_round.parent_type;
			this.isRespinActive = true;
			this.isRespinTriggered = true;
			this.numRespins = obj.next_round.num_spins;
			this.numRespinsLeft = obj.next_round.spins_left;
			this.respinsWinAmount = obj.next_round.win_amount;

			this.wildMultiplier = obj.next_round.multiplier;
			//win_positions to be used for WarriorQuest for Sticky Respin Feature
			//@todo needs to remove once serer is renamed 
			// obj.next_round.sticky_positions = obj.next_round.sticky_positions ? obj.next_round.sticky_positions : obj.next_round.win_positions;




			if (obj.next_round.sticky_positions && obj.next_round.sticky_positions.length > 0) {
				this.isStickyRespinActive = true;
				this.stickyRSSymbols = obj.next_round.sticky_positions;
			}
			this.source = obj.next_round.source;
		} else {
			this.isRespinActive = false;
			this.numRespins = obj.next_round.num_spins;
			this.numRespinsLeft = obj.next_round.spins_left;
			this.respinsWinAmount = obj.next_round.win_amount;
		}

		if (obj.next_round.type == "random_multiplier_feature") {
			this.isRespinActive = true;
			this.isRespinTriggered = true;
			this.numRespins = obj.next_round.type.num_spins;
			this.numRespinsLeft = obj.next_round.type.spins_left;
			// this.winMultiplier = obj.next_round.type.multiplier;
		}

		//assumed not using so removed by Avinash & Ameer
		/*if (obj.next_round && obj.type == "respins") {
			if( this.isRespinActive && _ng.GameConfig.isStickyRespin) {
				this.isStickyRespinTriggered = true;
				this.isStickyRespinActive = true;
				this.stickyRSSymbols = obj.next_round.win_positions;
				this.isRespinActive = false;
			
			} else if (!this.isRespinActive && _ng.GameConfig.isStickyRespin) {
				this.isStickyRespinTriggered = false;
				this.isStickyRespinActive = false;
				this.stickyRSSymbols = [];
			}
		}*/
		/************************************************/

		// if(obj.current_round.bonus_games_won && obj.current_round.bonus_games_won.length>0){
		// 	var winObj = obj.current_round.bonus_games_won[0];
		// 	if (_ng.GameConfig.bonusGames){
		// 		if(Object.keys(_ng.GameConfig.bonusGames).indexOf(winObj.bonus_game_id) > -1){
		// 			this.isBonusGameTriggerd = true;
		// 			this.featureObject = winObj;
		// 		}
		// 	}
		// }

		if (obj.next_round && obj.next_round.bonus_game_id) {
			var winObj = obj.next_round;
			if (_ng.GameConfig.bonusGames) {
				if (Object.keys(_ng.GameConfig.bonusGames).indexOf(winObj.bonus_game_id.toString()) > -1) {
					this.isBonusGameTriggerd = true;
					this.featureObject = winObj;
					if (obj.next_round.parent_type == "freespin") {
						this.parentType = obj.next_round.parent_type;
					}
				}
			}
		}
	}
	if (_ng.GameConfig.ReelViewUiConfig.data.defaultReels) {
		var dReels = _ng.GameConfig.ReelViewUiConfig.data.defaultReels;
		for (var i = 0; i < dReels.length; i++) {
			for (var j = 0; j < dReels[i].length; j++) {
				if (i == 0) {
					this.defaultReels[j] = [];
				}
				this.defaultReels[j].push(dReels[i][j]);
			}
		}
	}
	this.saveGameSpecInitData(obj);
}



gSpinData.saveGameSpecInitData = function (obj) {
	if (obj.previous_round.misc_bonus_details && obj.previous_round.misc_bonus_details.length>0 ) {

		var multiObj = obj.previous_round.misc_bonus_details;
		for (var i = 0; i < multiObj.length; i++) {
			if(multiObj[i].spin_type === "normal"){
				_ng.normalMultiplier = 	 multiObj[i].multiplier;
			}
			if(multiObj[i].spin_type === "freespin"){
				_ng.fsMultiplier = 	 multiObj[i].multiplier;
			}
		}
	}
};