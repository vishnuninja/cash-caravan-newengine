
var sIntroView = IntroView.prototype;

sIntroView.createView= function () {
    //this.createIndiButton();
    if (!this.isIntroScreen()) { return; }
    this.config = _ng.GameConfig.gameIntroScreen;

    var alpha = (this.config.overlayAlpha !== undefined) ? this.config.overlayAlpha : 0.9;
    this.rectBG = pixiLib.getElement("Graphics", { w: 1280, h: 720, alpha: alpha });
    this.bgParent.addChildAt(this.rectBG, 0);
    this.rectBG.visible = false;
    this.setTimeoutsArr =[];
    this.intervelTime = 3000;
    this.srcHitTime = 6000;
    this.addBG();
    this.addElements();
    this.createContinueButton();

    this.visible = false;
    this.onIntroResize();
    // Initialize a property to keep track of the current step
    this.currentStep = 1;
    //hit area of indi button is turned into button for interactivity
    if (this.indiButtonHitArea1) {
        this.indiButtonHitArea1.alpha = 0;
        this.indiButtonHitArea1.interactive = true;
        this.indiButtonHitArea1.buttonMode = true;
        pixiLib.addEvent(this.indiButtonHitArea1, () => this.onClickIndicator(1));
    }
    
    if (this.indiButtonHitArea2) {
        this.indiButtonHitArea2.alpha = 0;
        this.indiButtonHitArea2.interactive = true;
        this.indiButtonHitArea2.buttonMode = true;
        pixiLib.addEvent(this.indiButtonHitArea2, () => this.onClickIndicator(2));
    }
    if (this.indiButtonHitArea3) {
        this.indiButtonHitArea3.alpha = 0;
        this.indiButtonHitArea3.interactive = true;
        this.indiButtonHitArea3.buttonMode = true;
        pixiLib.addEvent(this.indiButtonHitArea3, () => this.onClickIndicator(3));
       
    }
    this.Indicator_off1.visible=false;
    this.Text_screen_1.visible = true;
    this.Text_screen_2.visible= false;
    // this.mSym.visible = false;
    this.Text_screen_3.visible= false;
    this.callTime();
}

sIntroView.onClickRadioButton = function () {
    _sndLib.play(_sndLib.sprite.btnClick);
    if (this.dontShowNextTime) {
        this.radioButtonOn.visible = false;
        this.radioButtonOff.visible = true;
        this.dontShowNextTime = false;
        pixiLib.setLocalStorageItem("noIntro", "false");
    } else {
        this.radioButtonOn.visible = true;
        // this.radioButtonOff.visible = false;
        this.dontShowNextTime = true;
        pixiLib.setLocalStorageItem("noIntro", "true");
    }
}

sIntroView.callTime = function () {
    this.timer = 1;
    if (this.interval) {
        clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
        this.src1Active();
        setTimeout(() => this.src2Active(), this.intervelTime);
        setTimeout(() => this.src3Active(), 2 * this.intervelTime);
        // Updating the current step
        this.currentStep = (this.currentStep % 3) + 1;
    }, this.intervelTime * 3);
}

//function for onCick on indicator buttons
sIntroView.onClickIndicator = function (indicatorNumber) {
    clearInterval(this.interval);
    this.currentStep = indicatorNumber;

    if (indicatorNumber === 1) {
        this.src1Active();
    } else if (indicatorNumber === 2) {
        this.src2Active();
    } else {
        this.src3Active();
    }

    setTimeout(() => {
        this.callTime();
    }, this.srcHitTime);
}

sIntroView.src1Active = function () {
    this.screen_1.alpha = 0;
    TweenMax.to(this.screen_1, 2, { alpha: 1 });
    this.screen_1.visible = true;
    this.screen_2.visible= false;
    this.screen_3.visible= false;
    this.Text_screen_1.visible = true;
    this.Text_screen_2.visible= false;
    // this.mSym.visible = false;
    this.Text_screen_3.visible= false;
    this.check1=true;
    this.Indicator_off1.visible= false;
    this.Indicator_off2.visible= true;
    this.Indicator_off3.visible= true;

};

sIntroView.src2Active = function () {  
    this.screen_2.alpha=0;
    TweenMax.to(this.screen_2, 2, { alpha: 1 });
    this.screen_2.visible = true;
    this.screen_1.visible= false;
    this.screen_3.visible= false;
    this.Text_screen_1.visible = false;
    this.Text_screen_2.visible= true;
    // this.mSym.visible = true;
    this.Text_screen_3.visible= false;
    this.check2=true;
    this.Indicator_off2.visible= false;
    this.Indicator_off1.visible= true;
    this.Indicator_off3.visible= true;

};

sIntroView.src3Active = function () {  
    this.screen_3.alpha=0;
    TweenMax.to(this.screen_3, 2, { alpha: 1 });
    this.screen_3.visible = true;
    this.screen_2.visible= false;
    this.screen_1.visible= false;
    this.Text_screen_1.visible = false;
    this.Text_screen_2.visible= false;
    // this.mSym.visible = false;
    this.Text_screen_3.visible= true;
    this.check3=true;
    this.Indicator_off3.visible= false;
    this.Indicator_off1.visible= true;
    this.Indicator_off2.visible= true;

};

sIntroView.specificResizeLayout = function () { 
    if(!this.isIntroScreen()) return;
    if (this.currentStep === 1) {
        this.src1Active();
    } else if (this.currentStep === 2) {
        this.src2Active();
    } else {
        this.src3Active();
    }
}