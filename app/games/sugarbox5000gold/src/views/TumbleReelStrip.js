class TumbleReelStrip extends PIXI.Container{
    reelId;
    parentView; //ReelView...
    reelConfig = _ng.GameConfig.ReelViewUiConfig;
    reelSymbolConfig = _ng.GameConfig.reelSymbolConfig;
    symConfig = _ng.GameConfig.ReelViewUiConfig.data.symbolConfig;
    stripData;
    symbolsArray = [];
    symbolsPos = [];
    startSpinTweens = [];
    stopSpinTweens = [];
    symbolAnimations = [];
    actualSymbolHeight = 0;
    REEL_STATE = "idle"; //idle, reel_spin_started, reel_stop_started, reel_stopped
    constructor(id, parent){
        super();
        this.reelId = id;
        this.parentView = parent;
        this.stripData = _ng.GameConfig.defaultReels[this.reelId].split("");
        _mediator.subscribe("showExtraSpins",this.animateAllScatterOnReel.bind(this));
        this.createStrip();
    }

    //ToDo: find better method...
    findSymbolType(stripData){
        var symType = _ng.GameConfig.ReelViewUiConfig.data.ReelSymbolType[stripData.length-2];
        return symType;
    }

    createStrip() {
        var symType = this.findSymbolType(this.stripData);
        for (var i = 0; i < this.stripData.length; i++) {
            var stripData = this.reelSymbolConfig[this.stripData[i]];
            var symb = new MegawaysSymbol();
            symb.changeSymbol(stripData.symbol.texture, symType);
            symb.name = this.stripData[i] + "_" + i;
            symb.symName = this.stripData[i];
            this.addChild(symb);
            this.symbolsArray.push(symb);
            symb.y = (symb.height + this.symConfig.symbolYGap) * i;
            this.symbolsPos.push(symb.y);
        }
        this.reelHeight = (this.symConfig.symbolHeight + this.symConfig.symbolYGap) * this.symbolsArray.length;
    }

    startStripSpin(spinSpeed) {
        this.REEL_STATE = "reel_spin_started";
        this.parentView.setReelFallStatus(false);
        var symbolFallDuration = ("quick" === spinSpeed) ?  0.1 : .25;
        for(let i= this.symbolsArray.length -1; i>=0; i--){
            let tween = gsap.to(this.symbolsArray[i], symbolFallDuration, { 
                y: '+=' + this.reelHeight, 
                delay: ("quick" === spinSpeed) ? 0 : (this.symbolsArray.length - i) * 0.02, 
                ease: Linear.easeIn, 
                onComplete: function () {
                    if(this.reelId == 3 && i == 0)
                        this.parentView.stopSpin("spinfallcompleted");
                    if(i == 0)
                       this.startSpinTweens = [];
                }.bind(this)
             });
            this.startSpinTweens.push(tween);
        }
    };

     replaceWithNewSymbols() {
        this.symbolsArray.forEach(function (symbol) {
            symbol.parent.removeChild(symbol);
        });
        this.symbolsArray = [];
        this.symbolsPos = [];
        var newReels = coreApp.gameModel.spinData.getReels();
        var newSymbols = newReels[this.reelId];
        var symType = this.findSymbolType(newSymbols);
        for(let i=0; i<newSymbols.length; i++){
            var symb = new MegawaysSymbol();
            symb.changeSymbol(newSymbols[i], symType);
            symb.name = newSymbols[i] + "_" + i;
            symb.symName = newSymbols[i];
            this.addChild(symb);
            this.symbolsArray.push(symb);
            var yPos = (symb.height + this.symConfig.symbolYGap) * i;
            symb.y =  yPos - this.reelHeight;
            this.symbolsPos.push(yPos);
        }
    }

    stopStripSpin(reelAry) {
        this.REEL_STATE = "reel_stop_started";
        for (let i = this.symbolsArray.length - 1; i >= 0; i--){
            let tween = gsap.to(this.symbolsArray[i], .3, { 
                y: this.symbolsPos[i] + 25, 
                ease: Linear.easeIn,
                delay: (this.symbolsArray.length - i) * 0.05,
                onComplete: function () {
                    this.reelStopEffect(i);
                    if(i == 0){
                        this.playScatterLandSound(this.reelId);
                        this.stopSpinTweens = [];
                    }
                }.bind(this)
             });
            this.stopSpinTweens.push(tween);
        }
        this.playReelStopSound();
    };

   

    playReelStopSound(stopType) {
        var reelStopSound = _sndLib.sprite.reelStop;
        reelStopSound.volume = 1;
        reelStopSound.delay = stopType === "forcedreelstop" ? 0 : 300;
        _sndLib.play(reelStopSound);
    }

    //stopping by space button... 
   forceStripToStop() {
        if (this.REEL_STATE === "reel_stopped") return;
        if (this.REEL_STATE === "idle") this.replaceWithNewSymbols();
        if (this.REEL_STATE === "reel_stop_started") {
            this.stopSpinTweens.forEach(function (tween) { tween.kill(); });
            this.stopSpinTweens = [];
        }
        if (this.REEL_STATE === "reel_spin_started") {
            this.startSpinTweens.forEach(function (tween) { tween.kill(); });
            this.startSpinTweens = [];
            this.replaceWithNewSymbols();
        }
        this.playReelStopSound("forcedreelstop");
        for (let i = this.symbolsArray.length - 1; i >= 0; i--) {
            gsap.to(this.symbolsArray[i], .2, {
                y: this.symbolsPos[i] + 25,
                ease: Linear.easeIn,
                onComplete: function () {
                    this.reelStopEffect(i);
                }.bind(this)
            });
        }
    }

    reelStopEffect(index){
        let tween = gsap.to(this.symbolsArray[index], .08, { 
            y: this.symbolsPos[index], 
            ease: Linear.easeIn,
            onComplete: function () {
                if(index == this.symbolsArray.length - 1)
                    this.REEL_STATE = "reel_stopped";
                if(this.reelId == 5 && index == 0)
                    this.parentView.allStripsFallingCompleted();
            }.bind(this)
        });
   }

    playSymbolAnimation = function(symbolId, isFirstSymbol = false, isLastSymbol = false) {
        let currentSymbol = this.symbolsArray[symbolId];
        let duration = ((_ng.isQuickSpinActive && _ng.GameConfig.FastAnim) || _ng.externalUiController.getSpaceBarHoldStatus()) ? 3 : 1.7;   
        let symbolName = currentSymbol.symName;
        let symAnimConfig = _ng.GameConfig.symbolAnimations[symbolName][1];
        let symbolAnim = pixiLib.getElement("Spine", symAnimConfig.spineName);
        symbolAnim.name = symbolName;
        symbolAnim.scale.set(symAnimConfig.props.scale.x, symAnimConfig.props.scale.y);
        symbolAnim.position.set(0, (this.symbolsPos[symbolId] + currentSymbol.height/2));
        symbolAnim.state.timeScale = duration;/* TODO: */
        this.addChild(symbolAnim);
        this.symbolAnimations.push(symbolAnim);
        // if(isFirstSymbol)    this.parentView.playSymbolSoundOnce("symbolAnim");
        currentSymbol.alpha = 0;

        let entry = symbolAnim.state.setAnimation(0, symAnimConfig.winAnimation + this.findSymbolType(this.symbolsArray), true);
        entry.listener = {
            complete: function () {
                currentSymbol.alpha = 1;
                symbolAnim.visible = false;
                if (isLastSymbol) this.parentView.onSymbolAnimationComplete();
                //_sndLib.play(_sndLib.sprite.pop1)
                // if(isFirstSymbol)    this.parentView.playSymbolSoundOnce("explosion");
            }.bind(this)
        };
    }

    removeSymbolAnimation () {
        this.symbolAnimations.forEach(function(animation) {
            setTimeout(() => { animation.parent.removeChild(animation) }, 10);
        });
        this.symbolAnimations = [];
    }

    removeWinSymbol(currentIndex) {
        this.symbolsArray[currentIndex].parent.removeChild(this.symbolsArray[currentIndex]);
        this.symbolsArray = this._popArrAtIndex(this.symbolsArray, currentIndex);
    }

    addTumbleSymbolsToStrip(stripArray, tumbleIndex) {
        // var newReelSymbols = coreApp.gameModel.obj.current_round.misc_prizes[tumbleIndex].new_symbols.split(";")[this.reelId];
        // if(newReelSymbols.includes("s"))
        //      _sndLib.play(_sndLib.sprite.sLand_3);
        stripArray = stripArray.reverse();
        for(var i = 0; i<stripArray.length; i++) {
            var newSymbolConfig = _ng.GameConfig.reelSymbolConfig[stripArray[i]];
            var symb = new MegawaysSymbol();
            symb.changeSymbol(newSymbolConfig.symbol.texture, this.findSymbolType(this.symbolsPos));
            symb.symName = newSymbolConfig.symbol.texture;
            this.addChild(symb);
            symb.y = (i * symb.height) - this.reelHeight;
            this.symbolsArray.unshift(symb);
        }
    }

    moveSymbolsDown(callback) {
        for (var i=0; i<this.symbolsPos.length; i++) {
            var stopDelay = (_ng.isQuickSpinActive && _ng.GameConfig.FastAnim) ? 0.1 : 0.5;
            TweenMax.to(this.symbolsArray[i], stopDelay, {
                ease: Elastic.easeInOut.config(1.1, 1),
                y: this.symbolsPos[i],
                onComplete: function (index) {
                    if (index == this.symbolsPos.length - 1 && this.reelId == this.reelConfig.data.noOfReels - 1)
                        callback();
                }.bind(this),
                onCompleteParams: [i]
            });
        }
    }

    animateAllScatterOnReel()
    {
        for(let i=0; i< this.symbolsArray.length; i++)
        {
            if(this.symbolsArray[i].symName == "s")
            {
                var prevScale = this.symbolsArray[i].scale.x;
                gsap.to(this.symbolsArray[i].scale, 0.3,{
                    x: prevScale + .1, y: prevScale + .1, yoyo:true, repeat:2,
                    onComplete: function () {
                        gsap.to(this.symbolsArray[i].scale,0.3,{
                            x: prevScale,y: prevScale});
                    }.bind(this)    
                });
            }
        }
    }

    //........................................................
    _popArrAtIndex(Arr, index)
    {
        var newArr = [];
        for(var i=0;i<Arr.length; i++)
            if(i!= index)   newArr.push(Arr[i]);
        return newArr;
    }

    playScatterLandSound = function (reelId) {
          for(let i=0; i<this.symbolsArray.length; i++){
            if (this.symbolsArray[i].symName == 's') {
                // var landingSound = "scatter_land" + reelId;
                _sndLib.play(_sndLib.sprite.sLand_3);
                break;
            }
        }
    }
}