class TopTumbleReelStrip extends TumbleReelStrip {
    constructor(id, parent) {
        super(id, parent);
        
    }

    createTopReelMask() {
        this.topReelMask = new PIXI.Graphics();
        this.topReelMask.beginFill(0x000000, 1);
        this.topReelMask.drawRect(-84, -24, 612, 138);
        this.topReelMask.endFill();
        this.addChild(this.topReelMask);
        this.mask = this.topReelMask;
    }

    findSymbolType(stripData){
        return "_3x";
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
            symb.x = (symb.width + this.symConfig.symbolXGap) * i;
            this.symbolsPos.push(symb.x);
        }
        this.reelWidth = (this.symConfig.symbolWidth) * (this.symbolsArray.length + 2);
        this.createTopReelMask();
    }

    startStripSpin(spinSpeed) {
        this.REEL_STATE = "reel_spin_started";
        var symbolFallDuration = ("quick" === spinSpeed) ?  0.1 : .25;
        for(let i= this.symbolsArray.length -1; i>=0; i--){
            let tween = gsap.to(this.symbolsArray[i], symbolFallDuration, { 
                x: '-=' + this.reelWidth, 
                delay: ("quick" === spinSpeed) ? 0 : (this.symbolsArray.length - i) * 0.02, 
                ease: Linear.easeIn, 
                onComplete: function () {
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
            symb.x = (symb.width * i) + this.reelWidth;
            this.symbolsPos.push(symb.x);
        }
    }

    stopStripSpin(reelAry) {
        this.REEL_STATE = "reel_stop_started";
        for (let i = 0; i < this.symbolsArray.length; i++){
            let tween = gsap.to(this.symbolsArray[i], .3, { 
                x: this.symbolsPos[i] - 25, 
                ease: Linear.easeIn,
                delay: i * 0.05,
                onComplete: function () {
                    this.reelStopEffect(i);
                    if(i == this.symbolsArray.length - 1){
                        this.playScatterLandSound(this.reelId);
                        this.stopSpinTweens = [];
                    }
                }.bind(this)
             });
            this.stopSpinTweens.push(tween);
        }
        // this.playReelStopSound();
    };

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
                x: this.symbolsPos[i] - 25,
                ease: Linear.easeIn,
                onComplete: function () {
                    this.reelStopEffect(i);
                }.bind(this)
            });
        }
    }

    reelStopEffect(index){
        let tween = gsap.to(this.symbolsArray[index], .08, { 
            x: this.symbolsPos[index], 
            ease: Linear.easeIn,
            onComplete: function () {
                if(index == this.symbolsArray.length - 1)
                    this.REEL_STATE = "reel_stopped";
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
        symbolAnim.position.set((this.symbolsPos[symbolId]), currentSymbol.height/2);
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

   addTumbleSymbolsToStrip(stripArray, tumbleIndex) {
        // var newReelSymbols = coreApp.gameModel.obj.current_round.misc_prizes[tumbleIndex].new_symbols.split(";")[this.reelId];
        // if(newReelSymbols.includes("s"))
        //      _sndLib.play(_sndLib.sprite.sLand_3);
        for(var i = 0; i<stripArray.length; i++) {
            var newSymbolConfig = _ng.GameConfig.reelSymbolConfig[stripArray[i]];
            var symb = new MegawaysSymbol();
            symb.changeSymbol(newSymbolConfig.symbol.texture, this.findSymbolType(this.symbolsPos));
            symb.symName = newSymbolConfig.symbol.texture;
            this.addChild(symb);
            symb.x = (symb.width * i) + this.reelWidth;
            this.symbolsArray.push(symb);
        }
    }

    moveSymbolsDown() {
        for (var i=0; i<this.symbolsPos.length; i++) {
            var stopDelay = (_ng.isQuickSpinActive && _ng.GameConfig.FastAnim) ? 0.1 : 0.5;
            TweenMax.to(this.symbolsArray[i], stopDelay, {
                ease: Elastic.easeInOut.config(1.1, 1),
                x: this.symbolsPos[i]
            });
        }
    }

}