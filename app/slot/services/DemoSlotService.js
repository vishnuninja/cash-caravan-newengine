var _ng = _ng || {};

var _HAS_PROMO_ = false;
var _Four_scatters_;
_ng.SlotService = function () {
	_ng.CoreService.call(this);
	this.sessionId = sessionStorage.sessionId;
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

	this.spinUrl = commonConfig.serverIP + commonConfig.serverURL;
	this.callBackUrl = commonConfig.serverIP + "/gameengine/casino/casino.php";
	this.sessionId = sessionStorage.sessionId;
	this.isNewUrl = (this.sessionId || this.sessionId == "");
	_ng.superBuyEnabled = false;
	_ng.BuyFSenabled = false;
	_ng.twoXBetEnabled = false;
	_mediator.subscribe("InitRequest", this.sendInitReq.bind(this));
	_mediator.subscribe("SM_COLLECT", this.sendSMCollectReq.bind(this));
	_mediator.subscribe("callReSpinRequest", this.sendReSpinReq.bind(this));
	_mediator.subscribe("callFreeSpinRequest", this.sendFSSpinReq.bind(this));
	_mediator.subscribe("callSpinRequest", this.sendSpinReq.bind(this));
	_mediator.subscribe("callFeatureRequest", this.sendFeatureReq.bind(this));
	_mediator.subscribe("sendCoinFlipReq", this.sendCoinFlipReq.bind(this));
	_mediator.subscribe("callGambleRequest", this.sendGambleReq.bind(this));
	_mediator.subscribe("callBuyFreeSpinRequest", this.BuyFreeSpinRequest.bind(this));
	_mediator.subscribe("callSuperBuyRequest", this.superBuyFreeSpinRequest.bind(this));
	_mediator.subscribe("restartReplay", this.restartReplaySequence.bind(this));
	// _mediator.subscribe(_events.core.gameCreationCompleted, this.fetchReplayData.bind(this)),

	// Store instance globally for access from other modules
	window.slotService = this;

	this.isDemoMode = coreApp.getUrlVar("demoMode");
	if (this.isDemoMode) {
		this.demoUrl = "demoserver/" + _ng.GameConfig.gameName + ".json";
		this.loadDemoServer({});
		this.spinCounter = 0, this.featureCounter = 0, this.fsCounter = 0, this.respinCounter = 0;
	}


	this.amountType = coreApp.gameModel.amountType;

	// ========================================
	// REPLAY MODE DETECTION AND URL PARSING
	// ========================================
	this.isReplayMode = false;
	this.replayRoundId = null;
	this.replayDataArray = [];
	this.currentReplayIndex = 0;
	this.sendInitRequestForReplay = false;
	this.replayCallback = null;

	// Subscribe to init completion for replay mode
	this.onInitCompleteCallback = null;

	// Check if we're in replay mode by parsing URL parameters
	this.checkReplayMode();

	// Also check after a short delay in case URL parameters weren't available immediately
	setTimeout(() => {
		if (!this.isReplayMode) {
			this.checkReplayMode();
		}
	}, 100);

	// No early reset needed — getReplayData is now called after init, so replayDataArray
	// is intentionally empty at constructor time for both Watch and history modes.

}
_ng.SlotService.prototype = Object.create(_ng.CoreService.prototype);
_ng.SlotService.prototype.constructor = _ng.SlotService;

var v = _ng.SlotService.prototype;

v.setModel = function (model) { this.slotModel = model; };

v.sendInitReq = function (obj) {

	// Check if we're in replay mode
	// if (this.isReplayMode && this.skipInitRequest) {

	// 	// Delay replay injection to allow UI to initialize first
	// 	setTimeout(() => {
	// 		if (this.replayDataArray && this.replayDataArray.length > 0) {
	// 			this.injectReplayData();
	// 		} else if (!this.isInHistoryMode && this.replayRoundId) {
	// 			// Skip auto-fetch in history mode — API is called only when user clicks "continue" on the history popup
	// 			this.getReplayData(() => {
	// 				if (this.replayDataArray && this.replayDataArray.length > 0) {
	// 					this.injectReplayData();
	// 				}
	// 			});
	// 		}
	// 	}, 1500); // Wait 1.5 seconds for UI to initialize

	// 	// Continue with normal init request to ensure game initializes properly
	// }

	// Get URL parameters for replay mode (when pasting URL in new tab, sessionStorage might not exist)
	const urlParams = new URLSearchParams(window.location.search);
	
	// Helper function to get value from URL params or sessionStorage
	const getParamValue = function(paramName, sessionStorageKey, defaultValue) {
		if (urlParams && urlParams.has(paramName)) {
			return urlParams.get(paramName);
		}
		if (sessionStorageKey) {
			return sessionStorage.getItem(sessionStorageKey) || sessionStorage[sessionStorageKey] || defaultValue;
		}
		return defaultValue;
	};
	// Check if we're in history mode and need to use mock API
	// Check for round_id directly in URL - if present, use mock-ask-server
	const roundId = urlParams.get('round_id');
	const isHistoryMode = !!roundId || this.isInHistoryMode || (this.isReplayMode && this.isInHistoryMode !== false);
	let apiUrl = this.spinUrl;

	if (isHistoryMode) {
		// Replace 'ask-server' with 'mock-ask-server' in the URL
		// Only replace if it's not already 'mock-ask-server' to prevent double replacement
		if (this.spinUrl.includes('mock-ask-server')) {
			// Already has mock-ask-server, use as is
			apiUrl = this.spinUrl;
		} else {
			// Replace ask-server with mock-ask-server
			apiUrl = this.spinUrl.replace(/ask-server/g, 'mock-ask-server');
		}
	}
	// Get username - try URL param first, then sessionStorage
	const userName = getParamValue('username', 'userName', '');

	
	var obj = "game_id=" + "769" + "&request_type=1&amount_type=" + this.amountType + "&username=" + userName;
	if(_ng.GameConfig.gameName === "terracottawarrior"|| _ng.GameConfig.gameName === "sugarbox5000gold"){
		var obj = "game_id=" + "769" + "&request_type=1&amount_type=" + this.amountType + "&username=" + userName+"&sub_game_id="+_ng.GameConfig.sub_game_id;
	}
// If in history mode, use values from sessionStorage but with mock API endpoint
if (isHistoryMode) {
	console.log("🎬 HISTORY MODE: Using sessionStorage values with mock API endpoint");
	// Build payload using sessionStorage values (same as normal mode but different API endpoint)
	if (this.isNewUrl) {
		obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
	}
	const userId = sessionStorage.getItem('rgsUserID');
	const operator = getParamValue('operator', 'operator', '');
	const integrator = getParamValue('integrator', 'integrator', '');
	const currency = getParamValue('currency', 'adaptor_currency', 'try');
	const userLocale = getParamValue('user_locale', 'Language', 'en');

	obj += "&user_id=" + userId;
	obj += "&operator=" + operator;
	obj += "&integrator=" + integrator;
	obj += "&currency=" + currency;
	obj += "&user_locale=" + userLocale;
	obj += "&platform=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
	obj += "&game_name=sugarbox5000gold";
	obj += "&country=TR";
	obj += "&is_demo=false";
	// Note: session_token and is_promo are added automatically in callServer function
} else {
	// Normal mode - use existing logic
	if (this.isNewUrl) {
		obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
	}
	const userId = getParamValue('user_id', 'userID', '');
	const operator = getParamValue('operator', 'operator', '');
	const integrator = getParamValue('integrator', 'integrator', '');
	const currency = getParamValue('currency', 'adaptor_currency', 'try');
	const userLocale = getParamValue('user_locale', 'Language', 'en');
	obj += "&user_id=" + userId;
	obj += "&operator=" + operator;
	obj += "&integrator=" + integrator;
	obj += "&currency=" + currency;
	obj += "&user_locale=" + userLocale;
	obj += "&platform=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
	obj += "&game_name=cash-caravan";
	obj += "&country=TR";
	obj += "&is_demo=false";
}
	this.requestType = 1;
	this.callServer(apiUrl, obj);
};

v.sendSMCollectReq = function (obj) {
	var obj = "game_id=" + "cash-caravan" + "&request_type=7&amount_type=" + this.amountType + "&username=" + sessionStorage.userName;
	if (this.isNewUrl) {
		obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
	}
	this.requestType = 7;
	this.callServer(this.spinUrl, obj);
};

v.sendCoinFlipReq = async function (actionName, color, callback) {
    var apiURL = commonConfig.serverIP + "/gambleOrCollect";
    var obj = {
        action: actionName,
		coin_side_selected: color,
        round_id: coreApp.gameModel.spinData.roundId,
		session_token: sessionStorage.sessionToken,
    };
    const response = await this.gambleRequestServer(apiURL, obj);

    if (!response) return;

    this.slotModel.gambleResultData.saveCoinTossGambleResponse(response);
    coreApp.gameModel.setBalance(
        coreApp.gameModel.gambleResultData.getBalance()
    );

    if (typeof callback === "function") {
        callback(response);
    }
};


v.sendReSpinReq = function (obj) {
	this.requestType = 5;
	var obj = "game_id=" + "cash-caravan" + "&request_type=2&coin_value=" + coreApp.gameModel.getSelectedCoinValue() + "&num_coins=" + coreApp.gameModel.getSelectedNumCoins() + "&num_betlines=" + coreApp.gameModel.getSelectedLines() + "&amount_type=" + this.amountType + "&username=" + sessionStorage.userName;
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
	// MOCK: Intercept freespin requests during PFS mock session
	if (_ng && _ng.GameConfig && _ng.GameConfig.MOCK_PFS_FREESPINS && 
	    coreApp && coreApp.gameModel && coreApp.gameModel.PFSData && 
	    coreApp.gameModel.PFSData._inMockFreespins && 
	    coreApp.gameModel.PFSData._mockFreespinResponses && 
	    coreApp.gameModel.PFSData._mockFreespinResponses.length > 0) {
		
		var mockResponse = coreApp.gameModel.PFSData._mockFreespinResponses.shift();
		
		// Check if this is the last freespin (next_round is empty array or spins_left = 0)
		var isLastFreespin = !mockResponse.next_round || 
		                     (Array.isArray(mockResponse.next_round) && mockResponse.next_round.length === 0) ||
		                     (mockResponse.next_round.spins_left && mockResponse.next_round.spins_left == "0");
		
		// Build full response with player/game data from current model
		var fullResponse = {
			player: coreApp.gameModel.userModel.userData.player,
			game: coreApp.gameModel.userModel.userData.game,
			misc: coreApp.gameModel.userModel.userData.misc,
			current_round: mockResponse.current_round,
			next_round: mockResponse.next_round,
			// During freespins: no promo_details (is_promo = false)
			// After last freespin: restore promo_details (is_promo = true)
			promo_details: isLastFreespin ? coreApp.gameModel.PFSData.PFSData : null
		};
		
		// Simulate server response
		setTimeout(function() {
			this.slotModel.saveSpinData(JSON.stringify(fullResponse));
			_mediator.publish("onSpinResponse");
		}.bind(this), 100);
		
		return; // Don't call the actual server
	}
	if (_ng.superBuyEnabled === true) { _ng.BuyFSenabled = false; }
	if (_ng.BuyFSenabled === true) { _ng.superBuyEnabled = false; }
	this.requestType = 4;
	var amountType = this.amountType;
	var obj = "game_id=" + "cash-caravan" + "&request_type=2&coin_value=" + coreApp.gameModel.getSelectedCoinValue() + "&num_coins=" + coreApp.gameModel.getSelectedNumCoins() + "&num_betlines=" + coreApp.gameModel.getSelectedLinesFS() + "&amount_type=" + this.amountType + "&username=" + sessionStorage.userName;
	if (this.isNewUrl) {
		obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
	}
	//terra
	if(_ng.GameConfig.gameName === "terracottawarrior"){
		var obj = "game_id=" + "cash-caravan" + "&request_type=2&coin_value=" + coreApp.gameModel.getSelectedCoinValue() + "&num_coins=" + coreApp.gameModel.getSelectedNumCoins() + "&num_betlines=" + coreApp.gameModel.getSelectedLines() + "&amount_type=" + amountType + "&username=" + sessionStorage.userName + "&sub_game_id="+_ng.GameConfig.sub_game_id;
		obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
	}
	if(_ng.GameConfig.gameName === "sugarbox5000gold"){
		if(_ng.BuyFSenabled===true) {
			var obj = "game_id=" + "cash-caravan" + "&request_type=2&coin_value=" + coreApp.gameModel.getSelectedCoinValue() + "&num_coins=" + coreApp.gameModel.getSelectedNumCoins() + "&num_betlines=" + coreApp.gameModel.getSelectedLines() + "&amount_type=" + amountType + "&username=" + sessionStorage.userName + "&sub_game_id="+4;
			obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
		}
		else if(_ng.GameConfig.superBuyEnabled===true){
			var obj = "game_id=" + "cash-caravan" + "&request_type=2&coin_value=" + coreApp.gameModel.getSelectedCoinValue() + "&num_coins=" + coreApp.gameModel.getSelectedNumCoins() + "&num_betlines=" + coreApp.gameModel.getSelectedLines() + "&amount_type=" + amountType + "&username=" + sessionStorage.userName + "&sub_game_id="+8;
			obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
		}
		else if(_ng.twoXBetEnabled===true){
			var obj = "game_id=" + "cash-caravan" + "&request_type=2&coin_value=" + coreApp.gameModel.getSelectedCoinValue() + "&num_coins=" + coreApp.gameModel.getSelectedNumCoins() + "&num_betlines=" + coreApp.gameModel.getSelectedLines() + "&amount_type=" + amountType + "&username=" + sessionStorage.userName + "&sub_game_id="+6;
		
			obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
		}		
		else {
			// var obj = "game_id=" + "cash-caravan" + "&request_type=2&coin_value=" + coreApp.gameModel.getSelectedCoinValue() + "&num_coins=" + coreApp.gameModel.getSelectedNumCoins() + "&num_betlines=" + coreApp.gameModel.getSelectedLines() + "&amount_type=" + amountType + "&username=" + sessionStorage.userName + "&sub_game_id=" + _ng.GameConfig.FG_sub_game_id;
			// obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
			if(_Four_scatters_ === undefined || _Four_scatters_ === false){
				var obj = "game_id=" + "cash-caravan" + "&request_type=2&coin_value=" + coreApp.gameModel.getSelectedCoinValue() + "&num_coins=" + coreApp.gameModel.getSelectedNumCoins() + "&num_betlines=" + coreApp.gameModel.getSelectedLines() + "&amount_type=" + amountType + "&username=" + sessionStorage.userName + "&sub_game_id=" + _ng.GameConfig.FG_sub_game_id;
				obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
				}
				else{
				var obj = "game_id=" + "cash-caravan" + "&request_type=2&coin_value=" + coreApp.gameModel.getSelectedCoinValue() + "&num_coins=" + coreApp.gameModel.getSelectedNumCoins() + "&num_betlines=" + coreApp.gameModel.getSelectedLines() + "&amount_type=" + amountType + "&username=" + sessionStorage.userName + "&sub_game_id=" + 2;
				obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
				}
		}



	}
	if (isGermanUI && coreApp.gameModel.spinData.smBalance > 0) {
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

	var obj = "game_id=" + "769" + "&request_type=2&coin_value=" + coreApp.gameModel.getSelectedCoinValue() + "&num_coins=" + coreApp.gameModel.getSelectedNumCoins() + "&num_betlines=" + coreApp.gameModel.getSelectedLines() + "&amount_type=" + amountType + "&username=" + sessionStorage.userName;
	if(_ng.GameConfig.gameName === "queensakura"){
		var obj = "game_id=" + "769" + "&request_type=2&coin_value=" + coreApp.gameModel.getSelectedCoinValue() + "&num_coins=40&num_betlines=40&amount_type=" + amountType + "&username=" + sessionStorage.userName;
	}
	if(_ng.GameConfig.gameName === "terracottawarrior"||_ng.GameConfig.gameName === "sugarbox5000gold"){
		if(_ng.GameConfig.gameName === "sugarbox5000gold" && _ng.twoXBetEnabled===true){
			var obj = "game_id=" + "769" + "&request_type=2&coin_value=" + coreApp.gameModel.getSelectedCoinValue() + "&num_coins=" + coreApp.gameModel.getSelectedNumCoins() + "&num_betlines=" + coreApp.gameModel.getSelectedLines() + "&amount_type=" + amountType + "&username=" + + sessionStorage.userName  + "&sub_game_id="+5;
		}
		else{
			// debugger
		var obj = "game_id=" + "769" + "&request_type=2&coin_value=" + coreApp.gameModel.getSelectedCoinValue() + "&num_coins=" + coreApp.gameModel.getSelectedNumCoins() + "&num_betlines=" + coreApp.gameModel.getSelectedLines() + "&amount_type=" + amountType + "&username=" + sessionStorage.userName + "&sub_game_id="+_ng.GameConfig.spin_sub_game_id;
		}
	
	}
	if (this.isNewUrl) {
		obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
	}

	if (isGermanUI && coreApp.gameModel.spinData.smBalance > 0) {
		obj += "&coin_value2=" + _ng.selectedCoinValue2;
	} else {
		obj += "&coin_value2=0";
	}

	this.callServer(this.spinUrl, obj);
};
v.sendFeatureReq = function (obj) {
	//terra
	this.requestType = 3;
	this.featureId = obj.id;
	var obj = "game_id=" + "cash-caravan" + "&request_type=3&amount_type=" + this.amountType + "&username=" + sessionStorage.userName + "&&bonus_game_id=" + obj.id + "&pick_position=" + obj.position + "&sub_game_id=" + obj.subGameId;
	if (this.isNewUrl) {
		obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
	}
	this.callServer(this.spinUrl, obj);
}
v.sendGambleReq = function (obj) {
	this.requestType = 6;
	var obj = "game_id=" + "cash-caravan" + "&request_type=4&amount_type=" + this.amountType + "&username=" + sessionStorage.userName + "&pick_position=" + obj.position + "&bet_amount=" + obj.betAmount;
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

function parseQueryString(query) {
	const params = {};
	query.split('&').forEach(param => {
		let [key, value] = param.split('=');
		// Handle null or boolean values appropriately
		if (value === 'null') {
			value = null;
		} else if (value === 'true') {
			value = true;
		} else if (value === 'false') {
			value = false;
		}
		params[key] = value;
	});
	return params;
}

// ========================================
// REPLAY MODE FUNCTIONS
// ========================================

v.checkReplayMode = function () {

	// Parse URL parameters
	const urlParams = new URLSearchParams(window.location.search);
	const roundId = urlParams.get('round_id');
	const userLocale = urlParams.get('user_locale');
	const replayFlag = urlParams.get('is_replay') === 'true'; // Check for replay=true flag

	// Check if we're in history mode (user clicked on history record)
	// BUT: If replay=true is present, treat it as auto-replay mode (not history mode that waits)
	const isInHistoryMode = !!roundId && !replayFlag;

	
	// Check for replay mode: just check if round_id is present
	const isReplayMode = !!roundId;

	

	// Only enter replay mode if we have round_id
	if (isReplayMode && roundId) {

		// Set replay mode properties
		this.isReplayMode = true;
		this.replayRoundId = roundId;
		this.replayUserLocale = userLocale; // Preserve user_locale from URL params
		this.isInHistoryMode = isInHistoryMode; // Store history mode flag

		// IMMEDIATELY set flag to skip init request
		this.skipInitRequest = true;

		// Never call getReplayData() here — this runs at constructor time, before init.
		// History mode: called from continue button click (onUnfinishGame).
		// Watch/auto-replay mode: called from sendInitReq timer (after init completes).
	} else {
		// Ensure normal mode flags are set
		this.isReplayMode = false;
		this.skipInitRequest = false;
		this.isInHistoryMode = false;
	}

	// Note: no early safety timeout here — getReplayData is never called at constructor time.
	// Watch mode fetches after init (sendInitReq timer). History mode fetches from continue button.
};
v.setReplayBetAndCurrency = function (record) {
  if (!record) { return; }
  console.log("setting replay bet");

  var roundInfo = record.round_info;

  var currency = roundInfo.currency.toLowerCase();
  var coinValue = roundInfo.wager / 10;

  if(roundInfo.is_buy_feature) {
    coinValue = coinValue / 100;
  } else if(roundInfo.is_buy_super_feature) {
    coinValue = coinValue / 500;
  } else if(roundInfo.is_ante_bet) {
    coinValue = coinValue / 1.3;
  }

  this.slotModel.userModel.currency = currency;
  sessionStorage.setItem("adaptor_currency", currency);

  this.slotModel.panelModel.coinArray.push(coinValue.toString());
  this.slotModel.panelModel.setBetIndex(this.slotModel.panelModel.coinArray.length - 1);

  var displayBet = this.slotModel.getTotalBet();

  if(roundInfo.is_ante_bet) {  
    displayBet = displayBet * 1.3;
  }

  const formattedBet = pixiLib.getFormattedAmount(displayBet);
  window.externalUi.call('bet-amount', 'setText', formattedBet, '');
};

v.getReplayData = function (callback) {
	this.replayDataArray = [];

	try {
		var base = (typeof commonConfig !== "undefined" && commonConfig["serverIP"]) ? commonConfig["serverIP"] : "";

		if (!base) {
			this.isReplayMode = false;
			this.skipInitRequest = false;
			return;
		}

		var cleanedBase = base.endsWith("/") ? base.slice(0, -1) : base;
		
		var url = cleanedBase + "/history/session?round_id=" + encodeURIComponent(this.replayRoundId);

		fetch(url, { method: "GET" })
			.then(function (res) { return res.json(); })
			.then(function (payload) {
				let records = [];

				if (Array.isArray(payload)) {
					records = payload;
				} else if (payload && Array.isArray(payload.records)) {
					records = payload.records;
				} else if (payload && Array.isArray(payload.data)) {
					records = payload.data;
				} else if (payload && payload.current_round) {
					// /history/session often returns a single session object
					records = [payload];
				}

				// Normalize and tag as history - ensure structure matches mockSpinRounds
				this.replayDataArray = (records || []).map(function (rec) {
					// Ensure the record has the expected structure
					const normalizedRec = Object.assign({}, rec, { isHistory: true });

					// Ensure next_round exists - API can return object or empty array []
					// Don't change it if it's already an array or object, only if it's missing/null/undefined
					if (normalizedRec.next_round === null || normalizedRec.next_round === undefined) {
						normalizedRec.next_round = [];
					}
					// If next_round is empty array [], keep it as is (this is valid from API)
					// If next_round is an object, keep it as is (this is also valid)

					// Ensure current_round exists
					if (!normalizedRec.current_round) {
						console.warn("⚠️ Record missing current_round:", normalizedRec);
					}

					return normalizedRec;
				});


				if (this.replayDataArray.length) {
					this.setReplayBetAndCurrency(this.replayDataArray[0]);
				}

				if (!this.replayDataArray.length) {
					// Fallback to mockSpinRounds
					var fallbackRecords = findReplaySequenceByRoundId ? findReplaySequenceByRoundId(this.replayRoundId) : [];
					if (fallbackRecords && fallbackRecords.length > 0) {
						this.replayDataArray = fallbackRecords.map(function (rec) {
							return Object.assign({}, rec, { isHistory: true });
						});
					} else {
						this.isReplayMode = false;
						this.skipInitRequest = false;
					}
				} 

				// Ensure replay mode is still active if we have data
				if (this.replayDataArray.length > 0) {
					this.isReplayMode = true;
					this.skipInitRequest = true;
				}

				// Call callback if provided (e.g., when called from history mode continue button)
				if (callback && typeof callback === 'function') {
					callback();
				}
			}.bind(this))
			.catch(function (err) {
				// Fallback to mockSpinRounds
				if (typeof findReplaySequenceByRoundId === 'function' && Array.isArray(mockSpinRounds)) {
					for (let i = 0; i < mockSpinRounds.length; i++) {
						const record = mockSpinRounds[i];
						if (record && record.current_round && record.current_round.round_id === this.replayRoundId) {
							const replayRecord = Object.assign({}, record, { isHistory: true });
							this.replayDataArray.push(replayRecord);
						}
					}
				}

				if (this.replayDataArray.length > 0) {
					this.isReplayMode = true;

					// Call callback if provided (e.g., when called from history mode continue button)
					if (callback && typeof callback === 'function') {
						callback();
					}
					this.skipInitRequest = true;
				} else {
					this.isReplayMode = false;
					this.skipInitRequest = false;

					// Call callback even if no data found (to continue game flow)
					if (callback && typeof callback === 'function') {
						callback();
					}
				}
			}.bind(this));
	} catch (e) {
		this.isReplayMode = false;
		this.skipInitRequest = false;

		// Call callback even on error (to continue game flow)
		if (callback && typeof callback === 'function') {
			callback();
		}
	}
};

v.injectReplayData = function () {

	if (this.replayDataArray.length === 0) {
		return;
	}

	// Reset replay index
	this.currentReplayIndex = 0;

	// Start the replay sequence
	this.startReplaySequence();
};

v.startReplaySequence = function () {

	if (this.currentReplayIndex >= this.replayDataArray.length) {
		// Publish event to show completion popup
		if (_mediator) {
			_mediator.publish("onReplayCompleted", {
				roundId: this.replayRoundId,
				userLocale: this.replayUserLocale
			});
		}
		return;
	}

	const currentRecord = this.replayDataArray[this.currentReplayIndex];

	// Convert object to JSON string for saveSpinData
	let jsonString = JSON.stringify(currentRecord);

	// Set the appropriate request type based on the data
	const dataObj = JSON.parse(jsonString);
	if (dataObj.next_round && dataObj.next_round.type === "freespins") {
		this.requestType = 4; // Free spin response
	} else {
		this.requestType = 2; // Regular spin response
	}

		//overwrite currency
	dataObj.player.currency = dataObj.round_info.currency;
	jsonString = JSON.stringify(dataObj);

	// Increment index for next call
	this.currentReplayIndex++;
	const isLastReplayRecord = this.currentReplayIndex >= this.replayDataArray.length;
	_mediator.publish("spinStart");
	if (isLastReplayRecord) {
		const roundId = this.replayRoundId;
		const hasWin = !!(currentRecord && currentRecord.current_round && Number(currentRecord.current_round.win_amount) > 0);
		if (hasWin) {
			_mediator.once("onTotalWinShown", () => {
				_mediator.publish("showHistoryModePopup", roundId);
			});
			if(currentRecord.current_round.post_matrix_info.has_gold){
				_mediator.once("showGoldCoinWinAmount", () => {
					_mediator.publish("showHistoryModePopup", roundId);
				});
			}
		} else {
			_mediator.once("AllTumbleFinish", () => {
				_mediator.publish("showHistoryModePopup", roundId);
			});
		}
	}

	// Send the response
	setTimeout(() => {
		try {
			if (dataObj.next_round === null || dataObj.next_round === undefined) {
				dataObj.next_round = [];
			}
			this.onServerResponse(jsonString);
		} catch (error) {
			console.error("❌ Error sending replay response:", error);
		}
	}, 300);
};

v.restartReplaySequence = function () {
	console.log("🎬 Restarting replay sequence");
	this.currentReplayIndex = 0;
	this.startReplaySequence();
};

v.gambleRequestServer = async function (url, obj) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            _mediator.publish(_events.core.error, { code: "SERVER_ERROR" });
            return null;
        }

        return data;

    } catch (err) {
        _mediator.publish(_events.core.error, {
            code: "NETWORK_ERROR",
            message: err.message
        });
        return null;
    }
};

v.callServer = function (url, obj) {

	// Check if we're in replay/history mode and should use API response data instead of API call
	if (this.isReplayMode && this.replayDataArray && this.replayDataArray.length > 0) {

		// Parse the request to determine which response to use
		const queryObject = parseQueryString(obj);
		const requestType = queryObject.request_type;


		// Find the appropriate API response based on request type and index
		let apiResponse = null;

		// For spin requests (request_type=2 or 4 for free spins)
		if (requestType === "2" || requestType === "4") {
			// Use the current index in replayDataArray (contains API responses)
			if (this.currentReplayIndex < this.replayDataArray.length) {
				apiResponse = this.replayDataArray[this.currentReplayIndex];
				// IMPORTANT: Increment index AFTER getting the response but BEFORE sending it
				// This ensures the next call will use the next record
				const currentIndex = this.currentReplayIndex;
				this.currentReplayIndex++; // Move to next for next request
			} else {
				console.warn("⚠️ Replay index out of bounds:", this.currentReplayIndex, ">=", this.replayDataArray.length);
			}
		}

		if (apiResponse) {
			// Delay to simulate network request
			setTimeout(() => {
				try {
					// Ensure next_round exists - API can return object or empty array []
					// Only set to [] if it's null/undefined, not if it's already an empty array
					if (apiResponse.next_round === null || apiResponse.next_round === undefined) {
						apiResponse.next_round = [];
					}
					// Empty array [] from API is valid and should be kept as is

					const jsonString = JSON.stringify(apiResponse);

					this.onServerResponse(jsonString);
				} catch (error) {
					console.error("❌ Response object:", apiResponse);
				}
			}, 300);

			return; // Don't make actual API call - using pre-fetched API responses
		}
	}

	obj += "&session_token=" + sessionStorage.sessionToken;
	if (this.isDemoMode) {
		setTimeout(this.callDemoServer.bind(this, obj), 500);
		return;
	}
	const queryObject = parseQueryString(obj);

	queryObject.is_promo = coreApp.gameModel.getIsPFSActive();

	const jsonString = JSON.stringify(queryObject, null, 2);
	var parent = this;
	fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: jsonString
	})
		.then(response => {
			if (response.ok) {
				return response.text();
			} else {
				_mediator.publish(_events.core.error, { code: "ERROR_OCCURED" });
				throw new Error("Server error");
			}
		})
		.then(data => {
			parent.onServerResponse(data);
		})
		.catch(error => {
			_mediator.publish(_events.core.error, { code: "NO_INTERNET" });
		});
};
//time reduce call back method  
v.callServerAfterSpin = function () {
	if (commonConfig.isGameEndService !== "true") {
		return;
	}
	if (this.isDemoMode) {
		return;
	}

	var url = this.callBackUrl;
	var obj = {
		game_id: "cash-caravan",
		amount_type: this.amountType,
		request_type: 5,
		session_id: this.sessionId,
		username: sessionStorage.userName
	};

	var parent = this;

	fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: obj
	})
		.then(response => {
			if (response.ok) {
				return response.text();
			}
		})
		.then(data => {
			if (data) {
				parent.onServerResCallBackEvent(data);
			}
		})
		.catch(error => {
			// Skip error publishing as in original code
		});
};
v.onServerResCallBackEvent = function () {
}


v.loadDemoServer = function (obj) {
	var parent = this;
	fetch(this.demoUrl, {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		}
	})
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error("Failed to load demo data");
			}
		})
		.then(data => {
			parent.demoData = data;
		})
		.catch(error => {
			console.error("Error loading demo server:", error);
		});
};


// Track promo_free_spin state in the _ng object
if (!_ng.promoState) {
	_ng.promoState = {
		nextRequestPromoFreeSpin: false
	};
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

	// Only set _Four_scatters_ = true when entering freespins from normal game or PFS (4 scatter trigger)
	// Do NOT set it for returning to promospins
	// 4 scatters during normal game OR during PFS should trigger sub_game_id=2
	if ((jsonObj.next_round.parent_type === "normal" || jsonObj.next_round.parent_type === "promospins") 
	     && jsonObj.next_round.type === "freespins") {
		_Four_scatters_ = true;
	} else {
		_Four_scatters_ = false;
	}
	
	switch (this.requestType) {
		case 1:
			try {
				this.slotModel.saveInitData(resObj);

				_mediator.publish(_events.core.initReceived);

				const isHistoryMode = this.isInHistoryMode;
				if (!isHistoryMode && jsonObj.state) {
					if (jsonObj.state.session_token) {
						sessionStorage.sessionToken = jsonObj.state.session_token;
					}
					if (jsonObj.state.user_id) {
						sessionStorage.rgsUserID = jsonObj.state.user_id;
					}
				} else {

				}
			} catch (error) {
				_mediator.publish(_events.core.error, {
					code: "ERROR_OCCURED",
					message: "Error processing game initialization. Please reload the game."
				});
				return;
			}
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
		case 8:
			this.slotModel.saveSpinData(resObj);
			_mediator.publish("onSpinResponse");
			this.callServerAfterSpin();
			break;
		default:
			break;
	};
};
v.BuyFreeSpinRequest = function (obj) {
	this.requestType = 8;
	var amountType = this.amountType;
	_ng.BuyFSenabled = true;
	_ng.superBuyEnabled = false
	if (coreApp.gameModel.getIsPFSActive()) {
		amountType = 3;
	}
	if(_ng.GameConfig.gameName === "sugarbox5000gold"){
		var obj = "game_id=" + "cash-caravan" + "&request_type=8&coin_value=" + coreApp.gameModel.getSelectedCoinValue() + "&num_coins=" + coreApp.gameModel.getSelectedNumCoins() + "&num_betlines=" + coreApp.gameModel.getSelectedLines() + "&amount_type=" + amountType + "&username=" + + sessionStorage.userName  + "&sub_game_id="+3;
			obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
		
	
		if (isGermanUI && coreApp.gameModel.spinData.smBalance > 0) {
			obj += "&coin_value2=" + _ng.selectedCoinValue2;
		} else {
			obj += "&coin_value2=0";
		}
	}
	this.callServer(this.spinUrl, obj);
};
v.superBuyFreeSpinRequest = function (obj) {
	this.requestType = 8;
	var amountType = this.amountType;
	_ng.superBuyEnabled = true;
	_ng.BuyFSenabled = false
	if (coreApp.gameModel.getIsPFSActive()) {
		amountType = 3;
	}
	if(_ng.GameConfig.gameName === "sugarbox5000gold"){
		var obj = "game_id=" + "cash-caravan" + "&request_type=8&coin_value=" + coreApp.gameModel.getSelectedCoinValue() + "&num_coins=" + coreApp.gameModel.getSelectedNumCoins() + "&num_betlines=" + coreApp.gameModel.getSelectedLines() + "&amount_type=" + amountType + "&username=" + + sessionStorage.userName  + "&sub_game_id="+7;
			obj += "&session_id=" + this.sessionId + "&platform_type=" + (_viewInfoUtil.isDesktop ? "desktop" : "mobile");
		
	
		if (isGermanUI && coreApp.gameModel.spinData.smBalance > 0) {
			obj += "&coin_value2=" + _ng.selectedCoinValue2;
		} else {
			obj += "&coin_value2=0";
		}
	}
	this.callServer(this.spinUrl, obj);
};

v.fetchReplayData = function () {

	this.getReplayData(() => {
		if (this.replayDataArray && this.replayDataArray.length > 0) {
			this.injectReplayData();
		}
	});

}