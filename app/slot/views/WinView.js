function WinView(argument) {
    ViewContainer.call(this, arguments);
    if (_ng.GameConfig.isClusterWin) {
        this.showLine = this.showCluster.bind(this);
    }
}
WinView.prototype = Object.create(ViewContainer.prototype);
WinView.prototype.constructor = WinView;
var view = WinView.prototype;

view.createView = function () {
    this.reelConfig = _ng.GameConfig.ReelViewUiConfig;
    this.symConfig = this.reelConfig.data.symbolConfig;
    this.animationConfig = _ng.GameConfig.symbolAnimations;
    this.updateWinSymbolConfig();
    this.scatterLandAry = [];
    this.bonusSymbols = [];
    this.lineWinsLoopCount = 0;
    this.model = coreApp.gameModel;
    this.addGameElements();
    this.ScatterAppearArray = [];
    this.isStopSpinCalled = false;
};
view.updateWinSymbolConfig = function(symbol){
	if(coreApp.gameModel.isFullFSActive() && _ng.GameConfig.separateSymbolsForFS){
        this.animationConfig = _ng.GameConfig.symbolAnimationsFS;
	}else{
		this.animationConfig = _ng.GameConfig.symbolAnimations;
    }
}
view.updateWinViewConfigs = function(){
    this.reelConfig = _ng.GameConfig.ReelViewUiConfig;
    this.symConfig = this.reelConfig.data.symbolConfig;
}
view.addGameElements = function(){}
view.onAllReelStopped = function () {
    this.clearScatterLand();
};
view.stopSoundOnClick = function(){
    if (_ng.GameConfig.sounds.soundStopArray) {
        for(i = 0; i < _ng.GameConfig.sounds.soundStopArray.length; i++) {
            _sndLib.stop(_sndLib.sprite[_ng.GameConfig.sounds.soundStopArray[i]]);
        }
    }
};
view.clearAllWins = function () {
    
    this.isStopSpinCalled = false;
    this.clearLine();
    try {
        if (this.symbolForWinSound){
            _sndLib.stop(_sndLib.sprite[this.symbolForWinSound]);
        }
    } catch (e) {
        // console.log("win souund ", e);
    }

    clearTimeout(this.showLineTimeout);
    _mediator.publish("SHOW_TICKER_MESSAGE", "");
};

view.showAlternateLineWins = function (linesObj) {
    this.alternatetriggeredOnce = false;
    this.linesObj = linesObj;
    this.linesLoopIndex = 0;
    this.lineWinsLoopCount = 0;
    this.showLine();
}; 
view.getBlinkCount = function (posAry) {
    var indexAry = [];
    for (var i = 0; i < posAry.length; i++) {
        indexAry.push(this.getSymbolFromPosition(posAry[i], "xValue"));
    }
    // console.log(" all indexes : ", indexAry);
    
    var startIndex = 0;
    var endIndex = posAry.length-1;
    var loopEnd = Math.ceil(this.reelConfig.data.eachReelPos.length/2);

    if(indexAry.indexOf(startIndex)>=0){
        // console.log("left to right====>>> line ");
        var pos=-1;
        for (var i = 0; i < loopEnd; i++) {
            if(indexAry.indexOf(i)!=-1){
                // console.log("matched : ", i);
                pos = indexAry[i];
            }else {
                break;
            }
        }
        return pos;
    }else if(indexAry.indexOf(endIndex)>=0){
        // console.log("right to left====>>> line ");
        var pos=-1;
        for (var i = endIndex; i > loopEnd; i--) {
            if(indexAry.indexOf(i)!=-1){
                // console.log("matched : ", i);
                pos = indexAry[i];
            }else {
                break;
            }
        }
        return pos;
    }
    return -1;
};
view.createWinSymbolContainer = function(){
    if (!this.winSymbolContainer) {
        this.winSymbolContainer = pixiLib.getContainer();
        this.winSymbolContainer.name = "winSymbolContainer";
        this.addChild(this.winSymbolContainer);
    }
    this.winSymbolContainer.x = coreApp.gameView.reelController.view.reelContainer.x;
    this.winSymbolContainer.y = coreApp.gameView.reelController.view.reelContainer.y;
}
view.showLine = function () {
    this.createWinSymbolContainer();
    if (this.lineSymbols) { this.clearLine(); }
    this.tweens = [];
    this.lineSymbols = [];
    var symDuration = 0, nextLineDuration = 0;
    var lineNum = this.linesObj[this.linesLoopIndex].line;
    var blinkCount = this.getBlinkCount(this.linesObj[this.linesLoopIndex].pos);
    this.symbolForWinSound = "";
    var isSoundForced = false;
    var isWildInWinLine = false;

    for (var i = 0; i < this.linesObj[this.linesLoopIndex].pos.length; i++) {
        var symbol = this.getSymbolFromPosition(this.linesObj[this.linesLoopIndex].pos[i]);
        if(symbol === "w"){
            isWildInWinLine = true;
        }
    }

    for (var i = 0; i < this.linesObj[this.linesLoopIndex].pos.length; i++) {
        //if (this.linesObj[this.linesLoopIndex].blink[i] == 1) {
            var symbol = this.getSymbolFromPosition(this.linesObj[this.linesLoopIndex].pos[i]);
            // var symbol = this.linesObj[this.linesLoopIndex].symbols[i];
            //Use this function to change symbol Animation depending on any specific feature
            //Used in Da Vinci, Unity Feature
            symbol = this.getSymbolName(symbol);
            if(isWildInWinLine && _ng.GameConfig.symbolAnimations[symbol+"_wild"]){
                symbol = symbol + "_wild";
            }
            var winSym = new WinSymbol(symbol);
            this.winSymbolContainer.addChild(winSym);
            winSym.playAnimation();
            this.lineSymbols.push(winSym);

            var xReelPos = this.getSymbolFromPosition(this.linesObj[this.linesLoopIndex].pos[i], "xValue");
            var yReelPos = this.getSymbolFromPosition(this.linesObj[this.linesLoopIndex].pos[i], "yValue");

            var symbolOffset = {x: 0, y: 0};
            if(this.animationConfig[symbol] && this.animationConfig[symbol][0].offset && _viewInfoUtil.isSecondaryAssetsLoaded){
                symbolOffset = this.animationConfig[symbol][0].offset
            }

            winSym.x = this.reelConfig.data.eachReelPos[xReelPos] + symbolOffset.x;
            var symbolTopPadding = 0;
            if (this.reelConfig.data.eachReelYPos) {
                symbolTopPadding = this.reelConfig.data.eachReelYPos[xReelPos];
            }
            //@todo server will send line win symbol position in a strip
            // console.log(Number(this.linesObj[this.linesLoopIndex].pos[i])+"asdf asdfasd fasdf asdfasf ==============>>"+Number(this.reelConfig.data.noOfReels));
            var yPos = Math.floor(Number(this.linesObj[this.linesLoopIndex].pos[i]) / Number(this.reelConfig.data.noOfReels));
            //winSym.y = this.symConfig.symbolHeight * this.linesObj[this.linesLoopIndex].blink[i];/*+(this.symConfig.symbolYGap*i)*/
            // console.log(yPos, " yPos=== >> sym :"+this.getSymbolData(this.linesObj[this.linesLoopIndex].symbols[i]), "line:"+lineNum);
            var gaps = (this.symConfig.symbolYGap * (yPos + 1));
            winSym.y = ((this.symConfig.symbolHeight) * (yPos + 1)) + gaps + symbolTopPadding + symbolOffset.y;
            if (blinkCount == xReelPos) {// todo: need to get Center position
                this.addWinAmount(winSym, this.linesObj[this.linesLoopIndex].win, winSym.x, winSym.y, yPos, Number(this.reelConfig.data.noOfSymbols));
            }
            //Updating symDuration for each symbol, whichever is higher
            if (Number(this.animationConfig[symbol][0].animationDuration) > symDuration) {
                symDuration = Number(this.animationConfig[symbol][0].animationDuration);
                nextLineDuration = Number(_ng.GameConfig.intervals.eachLineWinDelay) + symDuration;
            }

            //this.StackedReel
            if (this.stackedReels && this.stackedReels.length > 0) {
                for (var k = 0; k < this.stackedReels.length; k++) {
                    if (this.stackedReels[k] == i) { winSym.visible = false; }
                }
            }
            try {
                if (!isSoundForced && (this.animationConfig[symbol][0].winSound !== undefined)) {
                    this.symbolForWinSound = this.animationConfig[symbol][0].winSound.name;
                    if (this.animationConfig[symbol][0].winSound.forcePlay) { isSoundForced = true; }
                }
            } catch (e) {}
        //}
    }
    if (this.winAmtCtn) {         
         this.winSymbolContainer.addChild(this.winAmtCtn);
    }
    try {
        _sndLib.play(_sndLib.sprite[this.symbolForWinSound]);
    } catch (e) {}
    this.additionalAnimation();
    
    _mediator.publish("showSingleLine", lineNum, this.linesLoopIndex);
    this.linesLoopIndex++;

    if (this.linesLoopIndex == this.linesObj.length) {
        this.allwinsShownOnce = true;
        this.linesLoopIndex = 0;
        this.lineWinsLoopCount++;
    } else {
        this.allwinsShownOnce = false;
    }    

    if (this.lineWinsLoopCount === 1 && _ng.GameConfig.ReelViewUiConfig.data.showLineWinsOnce) {
        this.autoClearLineTimeout = setTimeout(this.clearLine.bind(this), symDuration); // comment this line for debug win symbos 
    } else {        
        this.autoClearLineTimeout = setTimeout(this.clearLine.bind(this), symDuration); // comment this line for debug win symbos 
        this.showLineTimeout = setTimeout(this.showLine.bind(this), nextLineDuration);
    }
};
view.additionalAnimation = function () { }
view.getSymbolName = function (symbol) { return symbol; }
view.showTotalClusterWin = function(allWinLines){
    this.createWinSymbolContainer();
    if (this.lineSymbols) { this.clearLine(); }
    this.tweens = [];
    this.lineSymbols = [];
    this.linesObj = allWinLines;
    for (let k = 0; k < this.linesObj.length; k++) {
        for (var i = 0; i < this.linesObj[k].symbolPositions.length; i++) {
            var symbol = this.getSymbolFromPosition(this.linesObj[k].symbolPositions[i]);
            var winSym = new WinSymbol(symbol);
            this.winSymbolContainer.addChild(winSym);
            winSym.playAnimation();
            this.lineSymbols.push(winSym);
            var symbolOffset = {x: 0, y: 0};
            if(this.animationConfig[symbol] && this.animationConfig[symbol][0].offset){
                symbolOffset = this.animationConfig[symbol][0].offset
            }
            var tempRowColumn = pixiLib.getRowColumn(this.linesObj[k].symbolPositions[i]);
            winSym.x = this.symConfig.symbolWidth * tempRowColumn.column + (this.symConfig.symbolXGap * tempRowColumn.column) + symbolOffset.x;
            winSym.y = this.symConfig.symbolHeight * tempRowColumn.row + (this.symConfig.symbolYGap * tempRowColumn.row) + symbolOffset.y;
        }
    }
}
view.showCluster = function () {
    if (!this.winSymbolContainer) {
        this.winSymbolContainer = pixiLib.getContainer();
        this.addChild(this.winSymbolContainer);
        this.winSymbolContainer.x = coreApp.gameView.reelController.view.reelContainer.x;
        this.winSymbolContainer.y = coreApp.gameView.reelController.view.reelContainer.y;
    }
    if (this.lineSymbols) { this.clearLine(); }
    this.tweens = [];
    this.lineSymbols = [];

    var symDuration = Number(this.animationConfig[this.linesObj[this.linesLoopIndex].symbol][0].animationDuration);
    var nextLineDuration = Number(_ng.GameConfig.intervals.eachLineWinDelay) + symDuration;

    for (var i = 0; i < this.linesObj[this.linesLoopIndex].totalSymbols; i++) {
        var symbol = this.linesObj[this.linesLoopIndex].symbol;
        var winSym = new WinSymbol(symbol);
        this.winSymbolContainer.addChild(winSym);
        winSym.playAnimation();
        this.lineSymbols.push(winSym);

        var symbolOffset = {x: 0, y: 0};
        if(this.animationConfig[symbol] && this.animationConfig[symbol][0].offset){
            symbolOffset = this.animationConfig[symbol][0].offset
        }
        var tempRowColumn = pixiLib.getRowColumn(this.linesObj[this.linesLoopIndex].symbolPositions[i]);
        winSym.x = this.symConfig.symbolWidth * tempRowColumn.column + (this.symConfig.symbolXGap * tempRowColumn.column) + symbolOffset.x;
        winSym.y = this.symConfig.symbolHeight * tempRowColumn.row + (this.symConfig.symbolYGap * tempRowColumn.row) + symbolOffset.y;
    }
    this.addWinAmount(this, this.linesObj[this.linesLoopIndex].winAmount, winSym.x, winSym.y);
    this.linesLoopIndex++;
    if (this.linesLoopIndex == this.linesObj.length) {
        //@todo alternate line wins shown once
        // _mediator.publish("AlternateLineWinShownOnce");
        this.allwinsShownOnce = true;
        this.linesLoopIndex = 0;
    } else {
        this.allwinsShownOnce = false;
    }
    this.autoClearLineTimeout = setTimeout(this.clearLine.bind(this), symDuration);
    //symbol time should be configured
    this.showLineTimeout = setTimeout(this.showLine.bind(this), nextLineDuration);
};

view.addWinAmount = function (parent, winAmount, symXPos, symYPos, cRow, numOfRows) {
    this.lineWinTextStyle = _ng.GameConfig.specialWins.lineWin.textStyle;

    this.winAmtCtn = pixiLib.getContainer();    
    this.winSymbolContainer.addChild(this.winAmtCtn);

    this.winAmtBox = pixiLib.getElement("Sprite", "winAmtBg");
    this.winAmtCtn.addChild(this.winAmtBox);    
    this.winAmtBox.anchor.set(0.5, 0.5);
    this.winAmtCtn.x = symXPos + this.reelConfig.data.lineWinAmtPos.x;
    if((cRow+1) == numOfRows && this.reelConfig.data.lineWinAmtLastRowPos){//last row
        this.winAmtCtn.y = symYPos + this.reelConfig.data.lineWinAmtLastRowPos.y;
    }else{
        this.winAmtCtn.y = symYPos + this.reelConfig.data.lineWinAmtPos.y;
    }
    //this.winAmtCtn.y = symYPos + this.reelConfig.data.lineWinAmtPos.y;

    if (commonConfig.winAmountBgHeight){
        this.winAmtBox.height = commonConfig.winAmountBgHeight;
    }
    if(_ng.GameConfig.winAmountBoxHeight !== undefined){
        this.winAmtBox.height = _ng.GameConfig.winAmountBoxHeight;
    }
    this.lineWinAmountTxt = pixiLib.getElement("Text", this.lineWinTextStyle);
    pixiLib.setText(this.lineWinAmountTxt, pixiLib.getFormattedAmount(winAmount));  
    this.winAmtBox.width = this.lineWinAmountTxt.width+60;

    this.lineWinAmountTxt.anchor.set(0.5, 0.5);     
    if (this.reelConfig.data.lineWinAmountTextPos) {
        pixiLib.setProperties(this.lineWinAmountTxt, this.reelConfig.data.lineWinAmountTextPos);
    }
    //else{
    //     this.lineWinAmountTxt.y = 15;
    // }
    
    this.winAmtCtn.addChild(this.lineWinAmountTxt);
};
view.clearLine = function () {
    _mediator.publish("clearLineWins");
    if (this.allwinsShownOnce && this.alternatetriggeredOnce == false) {
        this.alternatetriggeredOnce = true;
        _mediator.publish("AlternateLineWinShownOnce");
    }
    if (this.lineSymbols) {
        for (var i = 0; i < this.lineSymbols.length; i++) {
            this.winSymbolContainer.removeChild(this.lineSymbols[i]);
            this.lineSymbols[i].removeAnimation();
        }
        this.lineSymbols.length = 0;
    }
    if (this.lineWinAmountTxt) {
        this.winSymbolContainer.removeChild(this.lineWinAmountTxt);
        this.winSymbolContainer.removeChild(this.winAmtCtn);
    }
    //_mediator.publish("SHOW_TICKER_MESSAGE", "");
};

view.createStickySymbols = function (data) {
    if (!this.stickySymbolContainer) {
        this.stickySymbolContainer = pixiLib.getElement();
        this.stickySymbolContainer.x = coreApp.gameView.reelController.view.reelContainer.x;
        this.stickySymbolContainer.y = coreApp.gameView.reelController.view.reelContainer.y;
        this.addChild(this.stickySymbolContainer);
    }
    this.stickySymbolContainer.removeChildren();
    if (data.type === "stickyRespin") {
        var symbolPositions = data.symbolPositions;
        var reelMatrix = data.matrix;
        for (var i = 0; i < symbolPositions.length; i++) {
            var tempRowColumn = pixiLib.getRowColumn(symbolPositions[i]);
            var symbolTopPadding = 0;
            if (this.reelConfig.data.eachReelYPos) {
                symbolTopPadding = this.reelConfig.data.eachReelYPos[i];
            }
            var symBG = pixiLib.getGraphicsRect({ w: 128, h: 113, color: 0x540404 });
            this.stickySymbolContainer.addChild(symBG);            
			symBG.x = this.symConfig.symbolWidth * tempRowColumn.column + (this.symConfig.symbolXGap * tempRowColumn.column);
			symBG.y = this.symConfig.symbolHeight * tempRowColumn.row + (this.symConfig.symbolYGap * tempRowColumn.row-1);
            symBG.pivot.set(64, 56.5);
			var winSym = pixiLib.getElement("Sprite", reelMatrix[tempRowColumn.column][tempRowColumn.row]);
            this.stickySymbolContainer.addChild(winSym);
            winSym.x = this.symConfig.symbolWidth * tempRowColumn.column + (this.symConfig.symbolXGap * tempRowColumn.column);
            winSym.y = this.symConfig.symbolHeight * tempRowColumn.row + (this.symConfig.symbolYGap * tempRowColumn.row - 1) + symbolTopPadding;
            winSym.anchor.set(0.5, 0.5);
        }
    }
}
view.playBonusSymbolAnimation = function (data) {
    var bonusID = data.bonusID;
    var reelMatrix = data.reelMatrix;
    var bonusSymbol = _ng.GameConfig.bonusGames[bonusID].symbol;
    var animationDuration = this.animationConfig[bonusSymbol][0].animationDuration;
    var symbolArray = [];
    this.createWinSymbolContainer();
    for(var i = 0; i < reelMatrix.length; i++){
        for(var j = 0; j < reelMatrix[i].length; j++){
            if(reelMatrix[i][j] === bonusSymbol){
                symbolArray.push(pixiLib.getPosition(j, i));
            }
        }
    }
    _mediator.publish("hideReelSymbols", symbolArray);
    for (var i = 0; i < reelMatrix.length; i++) {
        for (var j = 0; j < reelMatrix[i].length; j++) {
            if (reelMatrix[i][j] === bonusSymbol) {
                var symbol = bonusSymbol;
                symbol = this.getSymbolName(symbol);
                var winSym = new WinSymbol(symbol);
                this.winSymbolContainer.addChild(winSym);
                this.bonusSymbols.push(winSym);
                var symbolTopPadding = 0;
                if (this.reelConfig.data.eachReelYPos) {
                    symbolTopPadding = this.reelConfig.data.eachReelYPos[i];
                }
                var symbolOffset = {x: 0, y: 0};
                if (this.animationConfig[symbol] && this.animationConfig[symbol][0].offset && _viewInfoUtil.isSecondaryAssetsLoaded){
                    symbolOffset = this.animationConfig[symbol][0].offset
                }
                if (this.reelConfig.data.eachReelPos && this.reelConfig.data.eachReelPos[i] !== undefined) {
                    winSym.x = this.reelConfig.data.eachReelPos[i] + symbolOffset.x;
                } else {
                    winSym.x = this.symConfig.symbolWidth * i + (this.symConfig.symbolXGap * i) + symbolOffset.x;
                }
                winSym.y = this.symConfig.symbolHeight * (j + 1) + (this.symConfig.symbolYGap * j) + symbolTopPadding + symbolOffset.y;
                winSym.playAnimation();
            }
        }
    }
    try {
        if (this.animationConfig[symbol] !== undefined) {
            var symbolForWinSound = this.animationConfig[symbol][0].winSound.name;
            _sndLib.play(_sndLib.sprite[symbolForWinSound]);
        }
    } catch (e) { }
    setTimeout(function () {
        _mediator.publish("showReelSymbols");
        this.clearBonusSymbols();
        _mediator.publish("bonusSymbolAnimationCompleted");
    }.bind(this), animationDuration);
};
view.clearBonusSymbols = function(){
    for(var i = 0; i < this.bonusSymbols.length; i++){
        this.winSymbolContainer.removeChild(this.bonusSymbols[i]);
        delete this.bonusSymbols[i];
    }
    this.bonusSymbols.length = 0;
};
view.removeStickySymbols = function(){
    if(this.stickySymbolContainer){
        this.stickySymbolContainer.removeChildren();
        this.removeChild(this.stickySymbolContainer);
        delete this.stickySymbolContainer;
    }
};
view.showEachReelStopAction = function (reelId, reelStrip) {
    //#todo if this reel is not expanded 
    if(!_ng.GameConfig.ReelViewUiConfig.showScatterLand || this.isStopSpinCalled || !_viewInfoUtil.isSecondaryAssetsLoaded){
        return;
    }
    this.createWinSymbolContainer();

    var symbolArray = [];
    
    if (!_ng.isQuickSpinActive){
        for (i = 0; i < reelStrip.length; i++) {
            for(j = 0; j < _ng.GameConfig.aniticipateSymbol.length; j++){
                if (reelStrip[i] === _ng.GameConfig.aniticipateSymbol[j]) {
                    var winSym = new WinSymbol(_ng.GameConfig.aniticipateSymbol[j] + "_land");
                    this.winSymbolContainer.addChild(winSym);
                    var symbolTopPadding = 0;
                    if (this.reelConfig.data.eachReelYPos) {
                        symbolTopPadding = this.reelConfig.data.eachReelYPos[i];
                    }
                    var symbolOffset = {x: 0, y: 0};
                    if (this.animationConfig[_ng.GameConfig.aniticipateSymbol[j]] && this.animationConfig[_ng.GameConfig.aniticipateSymbol[j]].offset){
                        symbolOffset = this.animationConfig[_ng.GameConfig.aniticipateSymbol[j]].offset
                    }
                    if (this.reelConfig.data.eachReelPos && this.reelConfig.data.eachReelPos[i] !== undefined) {
                        winSym.x = this.reelConfig.data.eachReelPos[reelId] + symbolOffset.x;
                    } else {
                        winSym.x = this.symConfig.symbolWidth * reelId + (this.symConfig.symbolXGap * i) + symbolOffset.x;
                    }
                    winSym.y = this.symConfig.symbolHeight * (i + 1) + (this.symConfig.symbolYGap * i) + symbolTopPadding + symbolOffset.y;
                    
                    _sndLib.play(_sndLib.sprite.additonsound5)
                    winSym.playAnimation();
                    this.ScatterAppearArray.push(winSym);
                    symbolArray.push([reelId, i]);
                }
            }
        }
        if(symbolArray.length>0){ _mediator.publish("hideReelSymbols", symbolArray, "eachReel"); }
    } 

    
};

view.removeBonusLand = function(){
    for (let i = 0; i < this.ScatterAppearArray.length; i++) {
        this.winSymbolContainer.removeChild(this.ScatterAppearArray[i]);
        this.ScatterAppearArray[i] = null;
    }
    this.ScatterAppearArray = [];
};
view.showSpawningWild = function () {};
view.hideAlternateWins = function () {};
view.showBonusAwarded = function () {};
view.hideBonusAwarded = function () {};
view.showWildMultiplier = function(){};
view.showSpawningWild = function(){};
view.onGameResize = function () {};
view.show = function () { this.visible = true; };
view.hide = function () { this.visible = false; };
view.destroy = function () { this.destroy();};
view.showScatterLand = function (sym, pos) {};
view.clearScatterLand = function () {};
view.showWalkingWild = function () {};
view.clearWalkingWild = function () {};
view.addWildExpanding = function (reelId) {};
view.clearWildExpanding = function () {};
view.addRandomWilds = function (posAry) {};
view.clearRandomWilds = function (posAry) {};
view.onSpinStart = function(){};
view.showStickySymobolsOnInit = function () {};

view.showAllWins = function (allWinLines) {
    this.createWinSymbolContainer();
    if (this.lineSymbols) { this.clearLine(); }
    this.tweens = [];
    this.lineSymbols = [];
    this.linesObj = allWinLines;
    var isWildInWinLine = false;

    for (let k = 0; k < this.linesObj.length; k++) {
        var lineNum = this.linesObj[k].line;
        for (var i = 0; i < this.linesObj[k].pos.length; i++) {
            var symbol = this.getSymbolFromPosition(this.linesObj[k].pos[i]);
            if(symbol === "w"){
                isWildInWinLine = true;
            }
        }
    }

    for (let k = 0; k < this.linesObj.length; k++) {
        var lineNum = this.linesObj[k].line;
        for (var i = 0; i < this.linesObj[k].pos.length; i++) {
            var symbol = this.getSymbolFromPosition(this.linesObj[k].pos[i]);
            symbol = this.getSymbolName(symbol);
            if(isWildInWinLine && _ng.GameConfig.symbolAnimations[symbol+"_wild"]){
                symbol = symbol + "_wild";
            }
            var winSym = new WinSymbol(symbol);
            this.winSymbolContainer.addChild(winSym);
            winSym.playAnimation();           
            this.lineSymbols.push(winSym);

            var symbolOffset = {x: 0, y: 0};
            if(this.animationConfig[symbol] && this.animationConfig[symbol][0].offset && _viewInfoUtil.isSecondaryAssetsLoaded){
                symbolOffset = this.animationConfig[symbol][0].offset
            }
            var xReelPos = this.getSymbolFromPosition(this.linesObj[k].pos[i], "xValue");
            var yReelPos = this.getSymbolFromPosition(this.linesObj[k].pos[i], "yValue");
            winSym.x = this.reelConfig.data.eachReelPos[xReelPos] + symbolOffset.x;
            var symbolTopPadding = (this.reelConfig.data.eachReelYPos) ? this.reelConfig.data.eachReelYPos[xReelPos] : 0;
            var yPos = Math.floor(Number(this.linesObj[k].pos[i]) / Number(this.reelConfig.data.noOfReels));
            var gaps = (this.symConfig.symbolYGap * (yPos + 1));
            winSym.y = ((this.symConfig.symbolHeight) * (yPos + 1)) + gaps + symbolTopPadding + symbolOffset.y;

            if (this.stackedReels && this.stackedReels.length > 0) {
                for (var j = 0; j < this.stackedReels.length; j++) {
                    if (this.stackedReels[j] == i) {
                        winSym.visible = false;
                        this.playExpandingSymbol(i);
                    }
                }
            }
            this.updateSymbolProps(winSym, k, i);
        }
        //_mediator.publish("showSingleLine", lineNum, k);
    }
    this.allWinsAdditionalAnimation();
};
view.allWinsAdditionalAnimation = function(){}
view.updateSymbolProps = function(winSym, k, i){}
view.playExpandingSymbol = function (reeId) {}
view.getSymbolFromPosition = function (pos, type) {
    var matrix = coreApp.gameModel.getReelMatrix();
    var xV = pos % _ng.GameConfig.ReelViewUiConfig.data.noOfReels;
    var yV = Math.floor(pos / _ng.GameConfig.ReelViewUiConfig.data.noOfReels);
    if (type === "xValue") {
        return xV;
    } else if (type === "yValue") {
        return yV;
    } else { return matrix[xV][yV]; }
}	
view.stopSpinNow = function(){
    this.isStopSpinCalled = true;
    this.removeBonusLand();
}