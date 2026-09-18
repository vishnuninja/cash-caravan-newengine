function SpinData() {
	this.matrix = [];
	this.reels = [];
	this.defaultReels = [];
	this.lineWins = [];
	this.roundId = 0;
	this.totalWin = 0;
	this.allTotalWin = 0;
	this.totalFSWin = 0;
	//last game data
	this.lastRoundId = 0;
	this.lastMatrix = [];
	this.lastReels = [];
	this.lastLineWins = [];
	this.lastTotalWin = 0;
	this.isInitCall = false;
	this.isExpandingWild = false;
	this.isSpawningWild = false;
	this.isRespinActive = false;
	this.gamble_feature_active = false;
	this.isWalkingWild = false;
	this.featureDetails = [];
	this.isStickyRespinTriggered = false;	//Candy Feature, Respin with some sticky symbols, will only be true for 1st reSpin
	this.isStickyRespinActive = false;      //Candy Feature, Sticky Respin is re-triggered, will not be true for 1st reSpin
	this.stickyRSSymbols = [];				//Candy Feature, Storing sticky symbols
	this.isBonusGameTriggerd = false;
	this.isProgressBarFilled = false;
	this.isGambleActive = false;
	this.postMatrixInfo = {};
	if (_ng.GameConfig.isClusterWin) {
		this.setTotalLineWins = this.setTotalClusterWins.bind(this);
	}
}

var spinInfo = SpinData.prototype;

spinInfo.saveInitData = function (obj) {
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
		if (obj.previous_round.matrix) {
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
spinInfo.saveGambleResponse = function (obj) {
	if (obj.current_round.state === 1) {
		this.isGambleActive = false;
	} else if (obj.current_round.state === 0) {
		this.isGambleActive = true;
	}
}
spinInfo.saveGameSpecInitData = function (obj) { };
spinInfo.saveSpinData = function (obj) {
	this.preReels = undefined;
	this.isInitCall = false;
	this.isGambleActive = false;
	this.rangeMeterFSTriggered = false;
	this.isExpandingWild = false;
	this.isSpawningWild = false;
	this.isRespinActive = false;
	this.isBonusGameTriggerd = false;
	this.postMatrixReels = [];
	this.wildPositions = [];
	this.featureObject = {};
	this.userData = obj;
	this.setMatrix(obj);

	this.allTotalWin += this.totalWin;
	//@todo check is wild expantion available
	if (obj.current_round.post_matrix_info && obj.current_round.post_matrix_info.feature_name) {
		var matrix = obj.current_round.post_matrix_info.matrix;
		var tempMatrix = matrix.split(";");
		this.postMatrixReels = [];
		for (var i = 0; i < tempMatrix.length; i++) {
			for (var j = 0; j < tempMatrix[i].length; j++) {
				if (i == 0) {
					this.postMatrixReels[j] = [];
				}
				this.postMatrixReels[j].push(tempMatrix[i][j]);
			}
		}
	}

	//reset data 
	this.postWinsActivity = false;
	this.isProgressbarActive = false;
	this.stickyMsgArr = [];

	this.isBonusFreatureMSG = false;
	this.isBonusFeatureWin = false;

	this.scatterPayoutActive = false;
	this.scatterPaySymbol = -1;
	this.scatterPayPositions = [];
	this.scatterPayAmount = 0;
	this.wildMultiplier = 0;
	this.fsMultiplier = 0;
	this.isRespinActive = false;
	this.isUnityFeature = false;
	this.isGiantFeature = false;
	this.isStickyRespinTriggered = false;
	this.isStickyRespinActive = false;
	this.numRespins = obj.next_round.num_spins;
	this.numRespinsLeft = obj.next_round.spins_left;
	this.respinsWinAmount = obj.next_round.win_amount;

	this.isBonusGameWon = false;


	if (obj.current_round && obj.current_round.bonus_games_won) {
		for (let i = 0; i < obj.current_round.bonus_games_won.length; i++) {
			// if (obj.current_round.bonus_games_won[i].type === "freespins" && obj.current_round.bonus_games_won[i].parant_type.indexOf("meter_")>=0) {
			// 	//range meter //parant_type
			// 	this.rangeMeterFSTriggered = true;
			// }

			if (obj.current_round.bonus_games_won[i].type == "screen_wins") {
				this.scatterPayoutActive = true;
				this.scatterPaySymbol = obj.current_round.bonus_games_won[i].screen_symbol;
				this.scatterPayPositions = obj.current_round.bonus_games_won[i].num_screen_symbols;
				this.scatterPayAmount = obj.current_round.bonus_games_won[i].win_amount;
			}
			if (obj.current_round.bonus_games_won[i].type == "respins" && obj.current_round.bonus_games_won[i].spins_left > 0) {
				this.isRespinActive = true;
				this.numRespins = obj.current_round.bonus_games_won[i].num_spins;
				this.numRespinsLeft = obj.current_round.bonus_games_won[i].spins_left;
				this.respinsWinAmount = obj.current_round.bonus_games_won[i].win_amount;
			}
			if (obj.current_round.bonus_games_won[i].type == "bonus_game") {
				var winObj = obj.current_round.bonus_games_won[i];
				if (_ng.GameConfig.bonusGames) {
					if (Object.keys(_ng.GameConfig.bonusGames).indexOf(winObj.bonus_game_id.toString()) > -1) {
						this.isBonusGameWon = true;
						this.isBonusGameTriggerd = true;
						this.featureObject = winObj;
						console.log("isBonusGameTriggerd");
					}
				}
			}
			// Infinity Battle 
			if (obj.current_round.bonus_games_won[i].type == "200bets" || obj.current_round.bonus_games_won[i].type == "ultraspin" || obj.current_round.bonus_games_won[i].type == "free_game") {
				this.isBonusFreatureMSG = true;
				this.bonusFreatureMSGType = obj.current_round.bonus_games_won[i].type;
				this.bonusFreatureMSGValue = obj.current_round.bonus_games_won[i].value;
				// _mediator.publish('showFeatureAwardedMSG', obj.current_round.bonus_games_won[i].type);
				this.preFeatureActivity = this.bonusFreatureMSGType == "200bets" ? true : false;
				this.postFeatureActivity = this.bonusFreatureMSGType != "200bets" ? true : false;
			}
			if (obj.current_round.bonus_games_won[i].type == "10ScatterCollect" || obj.current_round.bonus_games_won[i].type == "5WinsInARow" || obj.current_round.bonus_games_won[i].type == "3CharacterWin") {
				this.isBonusFeatureWin = true;
				this.bonusFeatureWinCount = obj.current_round.bonus_games_won[i].value;
			}
			//Unity Feature of Da Vinci
			if (obj.current_round.bonus_games_won[i].type == "unity_feature") {
				this.isUnityFeature = true;
				var lineNumbers = obj.current_round.bonus_games_won[i].betline_numbers;
				_mediator.publish('unityFeature', { lines: lineNumbers });
			}

			//Multiplier Respin of Da Vinci
			if (obj.current_round.bonus_games_won[i].feature == "random_multiplier_feature") {
				this.isRespinActive = true;
				this.isRespinTriggered = true;
				this.numRespins = obj.current_round.bonus_games_won[i].num_spins;
				this.numRespinsLeft = obj.current_round.bonus_games_won[i].spins_left;
				this.winMultiplier = obj.current_round.bonus_games_won[i].multiplier;
			}

			/*************Candy Sticky Respin Feature ************/
			if (obj.current_round.bonus_games_won[i].type == "sticky_respin") {
				this.isStickyRespinTriggered = true;
				this.isStickyRespinActive = true;
				this.stickyRSSymbols = obj.current_round.bonus_games_won[i].sticky_positions;
			}

			// if (_ng.GameConfig.gameId == 1 || _ng.GameConfig.gameId == 8 || _ng.GameConfig.gameId == 1081 || _ng.GameConfig.gameId == 1082 || _ng.GameConfig.gameId == 1083 || _ng.GameConfig.gameId == 2081) {		
			if (_ng.GameConfig.featureType == "ProgressFeature") {
				if (obj.current_round.bonus_games_won[i].type == "progress_bar") {
					this.isProgressbarActive = true;
					this.bar_value = obj.current_round.bonus_games_won[i].bar_value;
					this.current_level = obj.current_round.bonus_games_won[i].current_level;
				} else if (obj.current_round.bonus_games_won[i].type == "sticky_wilds_reel") {
					this.isStickyWildsReelActive = true;
					this.sticky_symbol = obj.current_round.bonus_games_won[i].sticky_symbol;
					this.positions = obj.current_round.bonus_games_won[i].positions;
					this.freespins = obj.current_round.bonus_games_won[i].freespins;
					this.spawningWildReelNum = this.getStickyWildsPositions(this.positions);
					this.stickyMsgArr.push(obj.current_round.bonus_games_won[i]);
				} else if (obj.current_round.bonus_games_won[i].type == "multiplier") {
					this.isMultiplierActive = true;
					this.multiplierValue = obj.current_round.bonus_games_won[i].value;
					this.freespins = obj.current_round.bonus_games_won[i].freespins;
					this.stickyMsgArr.push(obj.current_round.bonus_games_won[i]);
				} else if (obj.current_round.bonus_games_won[i].type == "win_both_ways") {
					this.isWinBothWaysActive = true;
					this.freespins = obj.current_round.bonus_games_won[i].freespins;
					this.stickyMsgArr.push(obj.current_round.bonus_games_won[i]);
				}
			}
		}
	}


	if (obj.next_round && obj.next_round.type == "respins") {
		this.isRespinActive = true;
		this.isRespinTriggered = true;
		this.numRespins = obj.next_round.num_spins;
		this.numRespinsLeft = obj.next_round.spins_left;
	}

	//Used for Candy's spawning Wild also
	if (obj.current_round.post_matrix_info) {
		this.postMatrixInfo = obj.current_round.post_matrix_info;

		if (obj.current_round.post_matrix_info.feature_name === "spawning_wild" || obj.current_round.post_matrix_info.feature_name === "random_wild_feature") {
			this.isSpawningWild = true;
			this.isExpandingWild = true;
			this.isRespinTriggered = true;
			this.postExpandingMatrix = obj.current_round.post_matrix_info.matrix;

			if (obj.current_round.post_matrix_info.expand_positions) {
				this.spawningWildReelNum = this.getExpandPositions(obj.current_round.post_matrix_info.expand_positions);
				this.expandingSymbolInfo = obj.current_round.post_matrix_info.expand_positions;
			} else {
				try {
					this.spawningWildReelNum = this.getWildsPositions(this.formatMatrix(obj.current_round.post_matrix_info.matrix));
				} catch (e) { }
			}

			if (obj.current_round.post_matrix_info.random_wild_positions) {
				this.wildPositions = obj.current_round.post_matrix_info.random_wild_positions;
			}
		} else if (obj.current_round.post_matrix_info.feature_name === "random_symbols" && obj.current_round.post_matrix_info.random_wild_positions.length > 0) {
			this.isSpawningWild = true;
			this.postExpandingMatrix = obj.current_round.post_matrix_info.matrix;
			this.postWildsPositions = obj.current_round.post_matrix_info.random_wild_positions;
			this.oldWildPos = obj.current_round.post_matrix_info.wild_symbols;
		} else {
			this.isExpandingWild = false;
		}


		if (obj.current_round.post_matrix_info.wild_symbols) {
			this.postMatrix = obj.current_round.post_matrix_info.matrix;
			this.wildSymbols = obj.current_round.post_matrix_info.wild_symbols;
		} else {
			this.wildSymbols = null;
		}

		if (obj.current_round.post_matrix_info.feature_name === "walking_wild") {
			this.isWalkingWild = true;
			this.postExpandingMatrix = obj.current_round.post_matrix_info.matrix;
			this.walkingWildReelNum = this.getWildsPositions(this.formatMatrix(obj.current_round.post_matrix_info.matrix));
		} else {
			this.isWalkingWild = false;
		}



		/**************** Da Vinci Magnum Opus ***************/
		if (obj.current_round.post_matrix_info.feature_name === "magnum_opus_feature") {
			this.isGiantFeature = true;
			this.postExpandingMatrix = obj.current_round.post_matrix_info.matrix;
			this.setMatrix(obj, this.postExpandingMatrix);
			var symbolOptions = ["aaa", "bbb", "ccc", "ddd", "eee", "fff", "ggg"];
			var firstColumn = this.postExpandingMatrix.split(";")[0];
			for (var i = 0; i < symbolOptions.length; i++) {
				if (firstColumn.indexOf(symbolOptions[i]) > -1) {
					this.giantSymbol = symbolOptions[i][0];
					this.giantReelNo = firstColumn.indexOf(symbolOptions[i]);
					break;
				}
			}
		}
		/*****************************************************/

	} else {
		this.wildSymbols = null;
		this.isExpandingWild = false;
	}

	/*************** Warrior Quest ******************/
	if (this.isRespinActive && _ng.GameConfig.isStickyRespin) {
		this.isStickyRespinTriggered = true;
		this.isStickyRespinActive = true;
		this.stickyRSSymbols = obj.current_round.bonus_games_won[0].sticky_positions;
		this.isRespinActive = false;
	} else if (!this.isRespinActive && _ng.GameConfig.isStickyRespin) {
		this.isStickyRespinTriggered = false;
		this.isStickyRespinActive = false;
		this.stickyRSSymbols = [];
	}

	// multiplier 
	if (obj.current_round.multipliers && obj.current_round.multipliers.length > 0) {
		for (let k = 0; k < obj.current_round.multipliers.length; k++) {
			const multiplier = obj.current_round.multipliers[k];
			if (multiplier.type === "wild_multiplier") {
				this.wildMultiplier = multiplier.value;
			}
			if (multiplier.type === "fs_multiplier") {
				this.fsMultiplier = multiplier.value;
			}
		}
	}
	this.saveGameSpecificData(obj);
};

spinInfo.saveGameSpecificData = function (obj) { }
spinInfo.getExpandPositions = function (obj) {
	var ary = [];
	for (const key in obj) {
		if (obj.hasOwnProperty(key) && obj[key].length > 0) {
			for (let i = 0; i < obj[key].length; i++) {
				const element = (obj[key][i] % 5);
				if (ary.indexOf(element) == -1) {
					ary.push(element);
				}
			}
		}
	}
	// console.log(ary);
	return ary;
}

spinInfo.alterTotalWin = function (obj) {
}

spinInfo.setMatrix = function (obj, postMatrix) {
	//set current round data
	this.roundId = obj.current_round.round_id;
	this.totalWin = obj.current_round.win_amount;

	this.paylineWinAmount = obj.current_round.payline_win_amount ? obj.current_round.payline_win_amount : 0;
	this.alterTotalWin(obj);
	this.totalFSWin = obj.current_round.total_fs_win_amount || 0;


	this.totalLineWins = [];
	//Payline Wins: Default Calling setTotalLineWins
	//Cluster Wins: function will replace with setTotalClusterWins
	this.setTotalLineWins(obj);
	if (obj.current_round.matrix) {
		//if Reels are required to display with PostMatrix instead of current_game.matrix 
		//currently using in davince Giant Symbol Feature
		var matrix = (postMatrix !== undefined) ? postMatrix : obj.current_round.matrix;
		this.matrix = matrix;
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
		this.reels[tempMatrix.length - 1] = obj.current_round.topreel.split("");
	}

	// if(_ng.GameConfig.gameId == 14 || _ng.GameConfig.gameId == 1141){
	if (_ng.GameConfig.featureType === "ScreenWins") {
		if (obj.current_round.bonus_games_won) {
			var bonusObj = obj.current_round.bonus_games_won;
			for (let index = 0; index < bonusObj.length; index++) {
				if (bonusObj[index].type && bonusObj[index].type === "screen_wins") {
					this.paylineWinAmount = bonusObj[index].win_amount;
					var scatterPayoutObj = this.getScatterPayoutInfo(); //[[blink], [symbols], [pos]]
					this.totalLineWins.push({ "line": 0, "win": bonusObj[index].win_amount, "blink": scatterPayoutObj[0], "repeat": 1, "symbols": scatterPayoutObj[1], "pos": scatterPayoutObj[2] });
				}
			}
		}
	}
};

spinInfo.getScatterPayoutInfo = function () {
	var mtrx = this.matrix.split(";").join("");
	var scatters = [];
	//var pos = [0,1,2];
	var pos = [];
	var blink = [];
	var isScatter = false;

	var tempMtrix = mtrx.split("");
	for (let k = 0; k < tempMtrix.length; k++) {
		if (tempMtrix[k] === "s") {
			pos.push(k);
		}
	}



	console.log(this.reels);
	for (let index = 0; index < this.reels.length; index++) {
		for (let i = 0; i < this.reels[index].length; i++) {
			if (this.reels[index][i] === "s") {
				scatters.push("s");
				isScatter = true;
				///pos.push(i+(index*5));
			}

		}
		blink.push(isScatter ? 0 : 1);
	}


	return [blink, scatters, pos];
}

spinInfo.formatMatrix = function (rawMatrix) {
	var tempMatrix = rawMatrix.split(";");
	var matrix = [];
	for (var i = 0; i < tempMatrix.length; i++) {
		for (var j = 0; j < tempMatrix[i].length; j++) {
			if (i == 0) {
				matrix[j] = [];
			}
			matrix[j].push(tempMatrix[i][j]);
		}
	}
	return matrix;
}




spinInfo.setTotalLineWins = function (obj) {
	// console.log('Debug: From Line Win');
	//line wins push to array
	this.isFiveOfKindActive = false;
	if (this.totalWin > 0 && obj.current_round.payline_wins.details.length > 0) {
		this.totalLineWinsObj = obj.current_round.payline_wins.details.split(";");
		for (var i = 0; i < this.totalLineWinsObj.length; i++) {
			var lineObj = this.totalLineWinsObj[i].split(":");
			this.totalLineWins.push({ "line": lineObj[0], "win": lineObj[1], "blink": lineObj[2].split(""), "repeat": lineObj[3], "symbols": lineObj[4].split(""), "pos": lineObj[5].split(",") });
			if(lineObj[2].indexOf("0")==-1){
				this.isFiveOfKindActive = true;
				this.fiveOfKindLineIndex = i;
				console.log("five of kind line ", i);
			}
		}
	}
}
spinInfo.setAfterExpandTotalLineWins = function (obj) {
	this.totalLineWins = [];
	this.totalLineWinsObj = obj.split(";");
	for (var i = 0; i < this.totalLineWinsObj.length; i++) {
		var lineObj = this.totalLineWinsObj[i].split(":");
		this.totalLineWins.push({ "line": lineObj[0], "win": lineObj[1], "blink": lineObj[2].split(""), "repeat": lineObj[3], "symbols": lineObj[4].split(""), "pos": lineObj[5].split(",") });
	}
}
spinInfo.setTotalClusterWins = function (obj) {
	// console.log('Debug: From Cluster Win');
	if (this.totalWin > 0 && obj.current_round.cluster_wins.length > 0) {
		var totalLineWinsObj = obj.current_round.cluster_wins;
		for (var i = 0; i < totalLineWinsObj.length; i++) {
			var lineObj = totalLineWinsObj[i];
			this.totalLineWins.push({ "clusterNo": (i + 1), "winAmount": lineObj.win_amount, "totalSymbols": lineObj.num_symbols, "symbol": lineObj.symbol, "symbolPositions": lineObj.symbol_positions });
		}
	}
}

spinInfo.saveFeatureData = function (obj) {
	this.featureObject = JSON.parse(obj);
}




spinInfo.getTotalLineWins = function (argument) {
	return this.totalLineWins;
};
spinInfo.getTotalWinAmount = function () {
	//#todo remove
	return this.totalWin;
}
spinInfo.getAllTotalWinAmount = function () {
	//#todo remove
	return this.allTotalWin;
}
spinInfo.getTotalFSWinAmount = function () {
	//#todo remove
	return this.totalFSWin;
}

spinInfo.getReels = function () {
	var reels;
	if (coreApp.gameModel.isError) {
		reels = this.defaultReels;
	} else {
		reels = this.reels;
	}
	return reels.map(row => row.filter(char => char !== 'v'));
};

spinInfo.setPostMatrix = function () {
	if (this.postMatrixReels) {
		this.preReels = this.reels;
		this.reels = (this.postMatrixReels.length !== 0) ? this.postMatrixReels : this.reels;
	}
};

spinInfo.updateReels = function (data) {
	var prefix = (data.prefix === undefined) ? "" : data.prefix;
	var suffix = (data.suffix === undefined) ? "" : data.suffix;
	if (data.type === "remove") {
		//there is no meaning of suffix and prefix when removing string.
		//It's used only for not to add an extra string
		if (this.reels && this.reels.length > 0) {
			for (var i = 0; i < this.reels.length; i++) {
				for (var j = 0; j < this.reels[i].length; j++) {
					if (prefix.length > 0) {
						this.reels[i][j] = this.reels[i][j].replace(prefix, '');
					}
					if (suffix.length > 0) {
						this.reels[i][j] = this.reels[i][j].replace(suffix, '');
					}
				}
			}
		}
		return;
	}

	if (this.reels && this.reels.length > 0) {
		for (var i = 0; i < this.reels.length; i++) {
			for (var j = 0; j < this.reels[i].length; j++) {
				this.reels[i][j] = prefix + this.reels[i][j] + suffix;
			}
		}
	}
};

spinInfo.getPostMatrix = function () {
	return this.postMatrixReels;
};
spinInfo.getIsScatterPayoutActive = function () {
	return this.scatterPayoutActive;
}

spinInfo.getIsSpawningWildActive = function () {
	return this.isSpawningWild;
}
spinInfo.getIsExpandingWildActive = function () {
	return this.isExpandingWild;
}
spinInfo.getIsRespinActive = function () {
	return this.isRespinActive;
}

spinInfo.getIsBonusTriggered = function () {
	return this.isBonusGameTriggerd;
}

spinInfo.getFeatureObject = function () {
	return this.featureObject;
}

spinInfo.setIsBonusTriggered = function (val) {
	this.isBonusGameTriggerd = val;
}

spinInfo.getIsRespinTriggered = function () {
	return this.isRespinTriggered;
}
spinInfo.setIsRespinTriggered = function (bool) {
	this.isRespinTriggered = bool;
}
spinInfo.getIsWalkingWild = function () {
	return this.isWalkingWild;
}
spinInfo.getWildReelNumber = function (matrix) {
	//TODO optimize this 
	var wild = "w";
	try {
		var res = matrix.split(";");
		var ary = [[], [], [], [], []];
		for (var i = 0; i < res.length; i++) {
			var ss = res[i].split("");
			//ary[i] = [];
			for (var j = 0; j < ss.length; j++) {
				ary[j].push(ss[j]);
			}
		}


		for (var i = 0; i < ary.length; i++) {
			var wCounter = 0;
			for (var j = 0; j < ary[i].length; j++) {
				if (ary[i][j] == "w") {
					wCounter++;
				}
				if (wCounter == 3) {
					// console.log(i);
					return i;
				}
			}
		}

	} catch (e) {
		return 0;
	}
}



spinInfo.getStickyWildsPositions = function (positions) {
	var ary = [];

	for (var i = 0; i < positions.length; i++) {

		if (positions[i] == 0) {
			ary.push(0);
		}

		if (positions[i] == 4) {
			ary.push(4);
		}

		if (positions[i] == 2) {
			ary.push(2);
		}
	}

	return ary;
}

spinInfo.getWildsPositions = function (reels) {
	var wild = _ng.GameConfig.expandingSymbol ? _ng.GameConfig.expandingSymbol : "w";
	var ary = [];
	for (var i = 0; i < reels.length; i++) {
		var reel = reels[i].sort();
		if (reel[0] == wild && reel[0] == reel[reel.length - 1]) {
			ary.push(i);
		}
	}
	return ary;
}
spinInfo.getPostMatrixInfo = function () {
	return this.postMatrixInfo;
}
spinInfo.getRespinsTotal = function () {
	return this.numRespins;
}
spinInfo.getRespinsLeft = function () {
	return this.numRespinsLeft;
}
spinInfo.getWildMultiplier = function () {
	return this.wildMultiplier;
}
spinInfo.getFeatureParentType = function () {
	return this.parentType;
}
spinInfo.getStickySymbols = function () {
	return this.stickyRSSymbols;
}
spinInfo.getIsStickyTriggered = function () {
	return this.isStickyTriggered;
}
spinInfo.setIsStickyTriggered = function (bool) {
	this.isStickyTriggered = bool;
}

spinInfo.isGambleFeatureActive = function (){
	return this.gamble_feature_active;
}