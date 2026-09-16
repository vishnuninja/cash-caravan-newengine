var view = ReelView.prototype;

view.createView = function (argument) {
	this.forceStop = false;
	this.reelsStarted=false;
	this.reelConfig = _ng.GameConfig.ReelViewUiConfig;
	this.isAnticipateSndPlaying = false;
	this.createExtraBottomElements();
	if (this.reelConfig.reelGridBottom) {
		this.createBottomGrid();
	}
	if (this.reelConfig.fsReelGridBottom) {
		this.createFSBottomGrid();
	}
	//actual gamereels 
	this.createReels();
	if (this.reelConfig.data.maskInfo.maskType == 1) {
		this.createSingleMask();
	} else if (this.reelConfig.data.maskInfo.maskType == 2){
        this.createReelWiseMask();
	}
	if (this.reelConfig.reelGridTop) {
		this.createTopGrid();
	}
	if (this.reelConfig.fsReelGridTop) {
		this.createFSTopGrid();
	}
	this.createExtraElements();
	_mediator.subscribe("forceStopBySpace",this.forceStopBySpace.bind(this));
	this.startSpinTimeoutArr = [];
	this.stopSpinTimeoutArr = [];

    _mediator.subscribe("FadeReels",this.fadeReels.bind(this))
};

view.createExtraElements = function () {
	this.winSymbolsToRemove = {};
	this.currentTumbleIndex = 0;
	_mediator.subscribe("spinStart", () => {
		this.currentTumbleIndex = 0;
	});
}

view.createFSTopGrid = function (argument) {
	this.fsTopGrid = pixiLib.getElement("Sprite", this.reelConfig.fsReelGridTop.image);
	this.fsTopGrid.name = "fsTopGrid";
	this.addChild(this.fsTopGrid);
	pixiLib.setProperties(this.fsTopGrid, this.reelConfig.fsReelGridTop.props["VD"]);
	this.fsTopGrid.visible = false;
}
// view.addGameSpecificCondition = function () {
//     if (coreApp.gameModel.isFullFSActive()) {
//         this.isAnticipateActive = false;
//     }
// }
view.fadeReels = function (value) {
	if (this.reelConfig.data.isSymbolFadeInWins) {
		for (var i = 0; i < this.reels.length; i++) {
			this.reels[i].alpha = value;
		}
	}
};
view.startSpin = function (spinSpeed) {
	if(_ng.externalUiController.getSpaceBarHoldStatus())	spinSpeed = "quick";
	this.setSpinResponseStatus(false);
	var reelSpinSound = _sndLib.sprite.reelStart;
	reelSpinSound.volume = 1;
	_sndLib.play(reelSpinSound);
	this.startSpinTimeoutArr = [];
	var reelStartIntervalDuration = ("quick" === spinSpeed) ? 0 : 80;
	for(let i=0;i<this.reels.length;i++){
		var timeout = setTimeout(function () {
			this.reels[i].startStripSpin(spinSpeed);
		}.bind(this), i * reelStartIntervalDuration);
		this.startSpinTimeoutArr.push(timeout);
	}
};

view.quickSpinStart = function () {
	this.startSpin("quick");
};

view.setSpinResponseStatus = function (bool) {
	this.spinResponseReceived = bool;
}
view.setReelFallStatus = function (bool) {
	this.spinFallCompleted = bool;
}
view.stopSpin = function (msg) {
	// Check allreelstopped... response recieved...
	if(msg === "spinfallcompleted")
		this.setReelFallStatus(true);
	if(msg === "spinresponserecieved"){
		this.setSpinResponseStatus(true);
		_mediator.publish("showSpinStop"); // To enable stop button...
	}
	if(this.spinResponseReceived && this.spinFallCompleted){
		this.stopSpinTimeoutArr = [];
		for(let i=0;i<this.reels.length;i++){
			var timeout = setTimeout(function () {
				this.reels[i].replaceWithNewSymbols();
				this.reels[i].stopStripSpin();
			}.bind(this), i * 80);
			this.stopSpinTimeoutArr.push(timeout);
		}
	}
};

view.allStripsFallingCompleted = function () {
	_sndLib.stop(_sndLib.sprite.reelSpinning);
	_mediator.publish("allReelsStopped");
	this.reels.forEach(elem => elem.REEL_STATE = "idle");
}

view.quickSpinStop = function (matrix) {
	this.reels.forEach(function (reel) {
		reel.forceStripToStop();
	});
};
view.forceStopBySpace=function()
{
	this.startSpinTimeoutArr.forEach(function (timeout) {
		clearTimeout(timeout);
	});
	this.stopSpinTimeoutArr.forEach(function (timeout) {
		clearTimeout(timeout);
	});
	this.reels.forEach(function (reel) {
		reel.forceStripToStop();
	});
}

view.performTumble = function(currentStep = 0) {
	let currentIndex = currentStep + 1;
	var numberOfTumbles = coreApp.gameModel.obj.current_round.misc_prizes.count;
	this.winSymbolsToRemove = {};

	if(currentIndex > numberOfTumbles) {
	var noOfMiscPrizes = coreApp.gameModel.obj.current_round.misc_prizes.count;
	var lastScreenWins = coreApp.gameModel.obj.current_round.misc_prizes[noOfMiscPrizes].screenWins;
	if (coreApp.gameModel.obj.current_round.spin_type == "freespin" && lastScreenWins.some(value => value !== 0)) {
		_mediator.publish("createSticky"); 
	} else {
		_mediator.publish("onAllTumblesComplete");
	}
		return;
	} 
	
	var tumbleData = coreApp.gameModel.obj.current_round.misc_prizes;
	var positions = tumbleData[currentIndex].positions;
	//normal reels
	var reelCount = _ng.GameConfig.ReelViewUiConfig.data.noOfReels;
	for (var j = 0; j < positions.length; j++) {
		var symbolPosition = positions[j];
		var reelId = (symbolPosition % reelCount);
		var symbolId = Math.floor(symbolPosition / reelCount);
		var isFirstSymbol = (j === 0);
		var isLastSymbol = (j === positions.length - 1);
		this.reels[reelId].playSymbolAnimation(symbolId, isFirstSymbol, isLastSymbol);
		if(this.winSymbolsToRemove[reelId]){
			this.winSymbolsToRemove[reelId].push(symbolId);
		} else {
			this.winSymbolsToRemove[reelId] = [];
			this.winSymbolsToRemove[reelId].push(symbolId);
		}
	}
}

view.onSymbolAnimationComplete = function() {
  _mediator.publish("showTumbleWin",this.currentTumbleIndex + 1);
  this.removeWinAnimations();
  this.removeWinSymbols(this.currentTumbleIndex);
  setTimeout(function() {
    this.addTumbleSymbols(this.currentTumbleIndex + 1);
    this.moveAllSymbols();
  }.bind(this), 10);
}

view.playSymbolSoundOnce = function (soundType){
	var currentIndex = this.currentTumbleIndex;
	var currentTumbleData = coreApp.gameModel.obj.current_round.misc_prizes[currentIndex];
	var currentWinSym = currentTumbleData.old_reel_symbol[0];
	var numberOfTumbles = coreApp.gameModel.obj.current_round.misc_prizes.count;
	// var volume = 1;
	// if (numberOfTumbles > 1) {
	// 	var step = .2;
	// 	var remainingTubles = (numberOfTumbles - currentIndex)- 1;
	// 	volume = Math.max(.4, 1 - (remainingTubles * step));
	// }
	var soundIndex = Math.max(1, (Math.min((currentIndex + 1), 5)));
	var soundObj = (soundType === "explosion") ? _sndLib.sprite.symbolAnim : _sndLib.sprite["win" + soundIndex];
	_sndLib.play(soundObj);
}

view.removeWinAnimations = function() {
  this.reels.forEach(reel => {
    reel.removeSymbolAnimation();
  });
}

view.removeWinSymbols = function(currentIndex) {
  console.log("start removing win symbols for tumble ", currentIndex);
  for(var reelId in this.winSymbolsToRemove) {
    var sortedWinSymbol = this.winSymbolsToRemove[reelId].sort(function(a, b) {return b-a});
    for(var i = 0; i < sortedWinSymbol.length; i++) {
      this.reels[reelId].removeWinSymbol(sortedWinSymbol[i]);
    }
  }
}

view.addTumbleSymbols = function(tumbleIndex) {
  var newSymbols = coreApp.gameModel.obj.current_round.misc_prizes[tumbleIndex].new_symbols.split(";");

  var stripData = {};
  for(var i = 0; i < newSymbols.length; i++) {
    for(var j = 0; j < newSymbols[i].length; j++) {
      if(stripData[i]) { 
        stripData[i].push(newSymbols[i][j]);
      } else {
        stripData[i] = [];
        stripData[i].push(newSymbols[i][j]);
      }
    }
  }

  for(var i in stripData) {
    this.reels[parseInt(i)].addTumbleSymbolsToStrip(stripData[i], tumbleIndex);
  }
}

view.moveAllSymbols = function() {
	// var moveDownSound = _sndLib.sprite.move_down;
	// moveDownSound.delay = ((_ng.isQuickSpinActive && _ng.GameConfig.FastAnim)) ? 0 : 100; 
	// _sndLib.play(moveDownSound);
	for(var i=0; i<this.reels.length; i++) 
		this.reels[i].moveSymbolsDown(this.onMoveSymbolsComplete.bind(this));
}

view.onMoveSymbolsComplete = async function() {
  this.currentTumbleIndex++;
  this.performTumble(this.currentTumbleIndex);
};

view.hideReelSymbols = function (symbolArray, type) {
	for (var i = 0; i < symbolArray.length; i++) {
		var rowColumn = pixiLib.getRowColumn(symbolArray[i]);
		this.reels[rowColumn.column].symbolsArray[rowColumn.row].visible = false;
	}
}




