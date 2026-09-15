var _ng = _ng || {};

_ng.LoadingScreenView = function () {
    PIXI.Container.call(this);
}

_ng.LoadingScreenView.prototype = Object.create(PIXI.Container.prototype);
_ng.LoadingScreenView.prototype.constructor = _ng.LoadingScreenView;

var p = _ng.LoadingScreenView.prototype;

p.createView = function () {
    this.name = "PreloaderView";
    this.config = commonConfig.loadingScreenConfig;

    if (commonConfig.noPreloaderLogo == "true") {

    } else {

        var AudioContext = window.AudioContext // Default
            || window.webkitAudioContext // Safari and old versions of Chrome
            || false;

        if (this.config.soundFile && _sndLib.isSpecificSndLoaded && AudioContext) {
            var audioContext = new AudioContext();
            console.log("audioContext = ", audioContext.state);
            if (audioContext.state == "running") {
                _sndLib.specificSound.play();
            }
        }
    }
    // Screen disabled black bg
    this.bgCover = pixiLib.getRectangleSprite(1280, 720, 0x000000);
    this.bgCover.name = "bgCover";
    this.addChild(this.bgCover);

    if (this.config.logoBg) {
        this.logoBg = pixiLib.getElement("Sprite", this.config.logoBg.img);
        this.logoBg.name = "logoBg"
        this.addChild(this.logoBg);
    }

    // preCtnr
    this.preCtnr = pixiLib.getContainer();
    this.preCtnr.name = "preCtnr";
    this.addChild(this.preCtnr);


    // Progress bar in container
    this.barCtnr = pixiLib.getContainer();
    this.barCtnr.name = "barCtnr";
    this.preCtnr.addChild(this.barCtnr);
    this.barCtnr.visible = false;

    this.barBg = pixiLib.getElement("Sprite", this.config.barCtnr.barBg);
    this.barBg.name = "barBg";
    this.barCtnr.addChild(this.barBg);

    this.barFill = pixiLib.getElement("Sprite", this.config.barCtnr.barFill);
    this.barFill.name = "barFill";
    this.barCtnr.addChild(this.barFill);

    this.barFillMask = pixiLib.getRectangleSprite(this.barBg.width, this.barBg.height, 0x000000);
    this.barCtnr.addChild(this.barFillMask);
    this.barFill.mask = this.barFillMask;
    this.maskWidth = this.barBg.width;
    this.barFillMask.width = 1;

    if (this.config.logoType === "spineAnimation") {
        this.createLogoSpine();
    } else if (this.config.logoType === "spriteAnimation") {
        this.createLogoAnimation();
    } else {
        this.createSpriteLogo();
    }
    // if (commonConfig.noPreloaderLogo == "true") {
    //     this.preLogo.visible = false;
    // }

    this.updateLoadingPercent(0);
    this.onResize();
}

p.createSpriteLogo = function () {
    if (this.config.preLogo.img != "") {
        this.preLogo = pixiLib.getElement("Sprite", this.config.preLogo.img);
        this.preLogo.name = "preLogo";
        this.preCtnr.addChild(this.preLogo);
        this.barCtnr.visible = true;
    }
}
p.createLogoAnimation = function () {

    this.preLogo = pixiLib.getElement("AnimatedSprite", this.config.spriteAnimObj);
    this.preLogo.name = "preLogo";
    this.preCtnr.addChild(this.preLogo);
    this.preLogo.loop = false;
    this.preLogo.gotoAndPlay(0);

    this.preLogo.onFrameChange = function () {
        if (this.preLogo.currentFrame === this.config.showBarOnFrame) {
            this.barCtnr.visible = true;
        }
    }.bind(this);

    this.preLogo.onComplete = function () {
        this.onPreloaderComplete();
    }.bind(this);
    
}

p.createLogoSpine = function () {
    this.preLogo = pixiLib.getElement("Spine", this.config.spineName);
    this.preLogo.name = "preLogo";
    this.preLogo.state.setAnimation(0, 'animation', false);

    this.preLogo.state.addListener({
        complete: function (entry) {
            if (entry.trackIndex === 0) {
                this.barCtnr.visible = true;
                this.onPreloaderComplete();
            }
        }.bind(this)
    });
    this.preCtnr.addChild(this.preLogo);
}

p.updateLoadingPercent = function (percent) {
    preloaderListener(percent);
    var maskWidth = Math.min(parseInt((this.maskWidth * percent) / 100), this.maskWidth);
    this.barFillMask.width = maskWidth;
}

p.onPreloaderComplete = function () {
    _mediator.publish("preLogoAnimationCompleted");
}

p.onResize = function () {
    this.bgCover.width = _viewInfoUtil.getWindowWidth();
    this.bgCover.height = _viewInfoUtil.getWindowHeight();

    pixiLib.setProperties(this.barCtnr, this.config.barCtnr[_viewInfoUtil.viewType]);
    if (this.preLogo) {
        pixiLib.setProperties(this.preLogo, this.config.preLogo[_viewInfoUtil.viewType]);
    }

    this.preCtnr.pivot.set(0.5, 0.5);
    this.preCtnr.scale.set(_viewInfoUtil.viewScale);
    this.preCtnr.x = _viewInfoUtil.getWindowWidth() / 2;
    this.preCtnr.y = _viewInfoUtil.getWindowHeight() / 2;
}