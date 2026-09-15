function WinSymbol(symbol) {
    this.config = {};
    this.updateWinSymbolConfig(symbol);
    this.animationArray = [];
    this.animationTweens = [];
    this.cAnimations = {};
    this.symbol = symbol;
    PIXI.Container.call(this);


    if (!_viewInfoUtil.isSecondaryAssetsLoaded||_viewInfoUtil.isSecondaryAssetsLoaded) {
        this.createView = this.createFinalView.bind(this);
        this.playAnimation = this.runAnimation.bind(this);
    } else {
        /*****************************
         * We are sending symbol_wild in some cases. 
         * if secondaryAssets are not loaded rename symbolName to just symbol and not symbol_wild
         */
        if(this.symbol.indexOf("_wild") >= 0){
            this.symbol = this.symbol.replace("_wild", "");
        }
        this.createView = this.createDefaultView.bind(this);
        this.playAnimation = this.defaultAnimation.bind(this);
    }
    this.createView();
}

WinSymbol.prototype = Object.create(PIXI.Container.prototype);
WinSymbol.prototype.constructor = WinSymbol;
var v = WinSymbol.prototype;

v.setCustomizedAnimations = function (i) { };

v.updateWinSymbolConfig = function(symbol){
	if(coreApp.gameModel.isFullFSActive() && _ng.GameConfig.separateSymbolsForFS){
		this.config = _ng.GameConfig.symbolAnimationsFS[symbol];
	}else if(_ng.GameConfig.symbolAnimations){
		this.config = _ng.GameConfig.symbolAnimations[symbol];
	}
}
v.createFinalView = function () {
    //Provide x, y, scale etc in config if required.
    //Starting with i = 1; i = 0 is for common config like duration
    for(var i = 1; i < this.config.length; i++){
        // if(this.config[i].type !== undefined){ continue; }
        switch(this.config[i].type){
            case "spriteAnimation":
                this['animation' + i] = pixiLib.getElement("AnimatedSprite", this.config[i]);     
                if (this.config[i].props){                    
                    pixiLib.setProperties(this['animation' + i], this.config[i].props);
                }           
            break;
            case "spriteAndTweenAnimation":
                this['animation' + i] = pixiLib.getElement("AnimatedSprite", this.config[i]);
            break;
            case "tween":
                this['animation' + i] = pixiLib.getElement("Sprite", this.config[i].prefix);
                pixiLib.setProperties(this['animation' + i], {anchor: 0.5});
            break;
            case "sprite":
                this['animation' + i] = pixiLib.getElement("Sprite", this.config[i].prefix);
                pixiLib.setProperties(this['animation' + i], {anchor: 0.5});
                if (this.config[i].props){                    
                    pixiLib.setProperties(this['animation' + i], this.config[i].props);
                }
            break;
            case "text":
                this['animation' + i] = pixiLib.getElement("Text", this.config[i].textStyle, this.config[i].text);
                pixiLib.setProperties(this['animation' + i], {anchor: 0.5});
            break;
            case "spine":
                this['animation' + i] = new PIXI.spine.Spine(PIXI.Loader.shared.resources[this.config[i].spineName + ".json"].spineData);
                if(this.config[i].props){
                    pixiLib.setProperties(this['animation' + i], this.config[i].props);
                }
                if(this.config[i].timeScale !== undefined){
                    this['animation' + i].state.timeScale = this.config[i].timeScale;
                }
                if(this.config[i].dafaultAnimation !== undefined && this.config[i].dafaultAnimation.length > 0){
                    this['animation' + i].state.setAnimation(0, this.config[i].dafaultAnimation, false);
                }
            break;
            default:
                break;
        }
        this['animation' + i].animationConfig = this.config[i];
        this.animationArray.push(this['animation' + i]);
        this.addChild(this['animation' + i]);
    }
    this.addExtraElement();
}
v.createDefaultView = function () {
    var i = 1;
    var sprite = this.symbol || "";
    this['animation' + i] = pixiLib.getElement("Sprite", sprite);
    pixiLib.setProperties(this['animation' + i], { anchor: 0.5 });

    this['animation' + i].animationConfig = { "prefix": "c", "tweenDuration": 0.9, "tween": { scaleX: 0.7, scaleY: 0.7, yoyo: true, repeat: 1 }, "type": "tween" }
    this['animation' + i].animationConfig.prefix = this.symbol;
    this.animationArray.push(this['animation' + i]);
    this.addChild(this['animation' + i]);
    this.addExtraDefaultElement();
}
v.addExtraElement = function(){};
v.addExtraDefaultElement = function(){};
v.runAnimation = function () {    
    this.animationTweens.length = 0;
    for (var i = 0; i < this.animationArray.length; i++) {
        this.setCustomizedAnimations(i);
        switch (this.animationArray[i].animationConfig.type) {
            case "spriteAnimation":
                this.animationArray[i].gotoAndPlay(0);
                break;
            case "tween":
                var tween = this.animationArray[i].animationConfig.tween;
                if (typeof tween === "string") {
                    tween = this.cAnimations[tween];
                }
                var duration = this.animationArray[i].animationConfig.tweenDuration || 0.5;
                var animTween = TweenMax.to(this.animationArray[i], duration, tween);
                this.animationTweens.push(animTween);
                break;
            case "spriteAndTweenAnimation":
                this.animationArray[i].gotoAndPlay(0);
                var tween = this.animationArray[i].animationConfig.tween;
                if (typeof tween === "string") {
                    tween = this.cAnimations[tween];
                }
                var duration = this.animationArray[i].animationConfig.tweenDuration || 0.5;
                var animTween = TweenMax.to(this.animationArray[i], duration, tween);
                this.animationTweens.push(animTween);
                break;
            case "spine":
                this.animationArray[i].state.setAnimation(0, this.animationArray[i].animationConfig.winAnimation, this.animationArray[i].animationConfig.loop);
                break;
        }
    }
}
v.defaultAnimation = function () {
    this.animationTweens.length = 0;
    for (var i = 0; i < this.animationArray.length; i++) {
        switch (this.animationArray[i].animationConfig.type) {
            case "tween":
                var tween = this.animationArray[i].animationConfig.tween;
                var animTween = TweenMax.to(this.animationArray[i], 0.5, tween);
                this.animationTweens.push(animTween);
                break;
            default:
                break;
        }
    }
}
v.removeAnimation = function () {
    for (var i = 0; i < this.animationTweens.length; i++) {
        this.animationTweens[i].kill();
    }
    for (var i = 0; i < this.animationArray.length; i++) {
        delete this['animation' + i];
    }
    this.removeChildren();
    this.animationArray.length = 0;
}