SettingsDesktopView = function () {
    this.isMenuOpened = true;
    SettingsView.call(this);
    this.isSoundOn = true;
    this.isFullScreen = false;
};

SettingsDesktopView.prototype = Object.create(SettingsView.prototype);

var sView = SettingsDesktopView.prototype;
var spv = SettingsView.prototype;

sView.createView = function () {
    spv.createView.call(this);
    this.slideDuration = 0.5;
    this.addEvents();
    this.elements = [this["paytableButton"], this["settingsButton"]];
    this.b1 = {};
    this.b2 = {};
    this.b1.y = 560;
    this.b2.y = 515;

    this.addChild(this.menuCloseBtn);
    this.addChild(this.menuOpenBtn);
    this.addChild(this["settingsContainer"]);

    this['settingsBg'].interactive = true;

    if (_ng.GameConfig.menuButtonPos) {
        pixiLib.setProperties(this.menuOpenBtn, _ng.GameConfig.menuButtonPos);
    }

    if (commonConfig.isProviderLogo == "false" && this.providerLogo) {
        this.providerLogo.visible = false;
    }
    //--for game leavel update 
    if (commonConfig.isQuickSpin === "true" && _ng.GameConfig.ReelViewUiConfig.data.isQuickSpin != "false") {
        _mediator.publish("quickSpinOnDgDefaultInit");
    }
};
sView.addEvents = function () {
    spv.addEvents.call(this);

    pixiLib.setInteraction(this.soundEffectOff, true);
    pixiLib.setInteraction(this.soundEffectOn, true);

    pixiLib.setInteraction(this.ambienceSoundOff, true);
    pixiLib.setInteraction(this.ambienceSoundOn, true);

    pixiLib.setInteraction(this.quickSpinOff, true);
    pixiLib.setInteraction(this.quickSpinOn, true);

    pixiLib.setInteraction(this.skipBigwinOff, true);
    pixiLib.setInteraction(this.skipBigwinOn, true);

    pixiLib.setInteraction(this.spaceClickOff, true);
    pixiLib.setInteraction(this.spaceClickOn, true);

    pixiLib.addEvent(this.homeButton, this.onHomeButtonClick.bind(this));

    pixiLib.addEvent(this.soundEffectOff, this.onSoundEffectOff.bind(this));
    pixiLib.addEvent(this.soundEffectOn, this.onSoundEffectOn.bind(this));

    pixiLib.addEvent(this.ambienceSoundOff, this.onAmbienceSoundOff.bind(this));
    pixiLib.addEvent(this.ambienceSoundOn, this.onAmbienceSoundOn.bind(this));

    pixiLib.addEvent(this.quickSpinOff, this.onQuickSpinOff.bind(this));
    pixiLib.addEvent(this.quickSpinOn, this.onQuickSpinOn.bind(this));

    pixiLib.addEvent(this.skipBigwinOff, this.onSkipBigwinOff.bind(this));
    pixiLib.addEvent(this.skipBigwinOn, this.onSkipBigwinOn.bind(this));




    pixiLib.addEvent(this.spaceClickOff, this.onSpaceClickOff.bind(this));
    pixiLib.addEvent(this.spaceClickOn, this.onSpaceClickOn.bind(this));

    pixiLib.addEvent(this.menuOpenBtn, this.onMenuOpen.bind(this));
    pixiLib.addEvent(this.menuCloseBtn, this.onMenuClose.bind(this));
    pixiLib.addEvent(this.paytableBtn, this.onPaytable.bind(this));
    pixiLib.addEvent(this.settingsBtn, this.onSettings.bind(this));
    pixiLib.addEvent(this.rulesBtn, this.onRules.bind(this));
    pixiLib.addEvent(this.fullscreenBtn, this.onFullscreen.bind(this));
    pixiLib.addEvent(this.normalscreenBtn, this.onNormalscreen.bind(this));
    pixiLib.addEvent(this.volumeOnBtn, this.onVolumeOn.bind(this));
    pixiLib.addEvent(this.volumeOffBtn, this.onVolumeOff.bind(this));


    pixiLib.addEvent(this.settingsCloseBtn, this.onSettingCloseClick.bind(this));
    _mediator.subscribe("SHOW_SETTINGS", this.showSettingsContainer.bind(this));
    _mediator.subscribe("panelClick", this.closeMenu.bind(this));

    _mediator.subscribe("settingVolumeChange", this.updateMenuVolume.bind(this));

    /*
    @VJ 31-10-2019
    onLoad making dg games, quick spin default initalization
    */
    _mediator.subscribe("quickSpinOnDgDefaultInit", this.onQuickSpinOnDgDefaultInit.bind(this));

    this.btns = [this.paytableBtn, this.settingsBtn, this.rulesBtn, this.fullscreenBtn, this.volumeOnBtn, this.homeButton];

    if(commonConfig.fixDesktopHomeButton){
        this.btns.splice(this.btns.indexOf(this.homeButton), 1);
    }

    if(commonConfig.fixDesktopSoundButton){
        this.btns.splice(this.btns.indexOf(this.volumeOnBtn), 1);
    }

    if(commonConfig.hideFullScreenButton){
        this.btns.splice(this.btns.indexOf(this.fullscreenBtn), 1);
        this.fullscreenBtn.alpha = 0;
        this.fullscreenBtn.width = 0;
        this.fullscreenBtn.height = 0;
        this.normalscreenBtn.alpha = 0;
        this.normalscreenBtn.width = 0;
        this.normalscreenBtn.height = 0;
    }

    setTimeout(this.closeMenu.bind(this), 200);
    this.volumeOnBtn.visible = true;
    this.volumeOffBtn.visible = false;
    this.quickSpinOn.visible = false;
    this.skipBigwinOn.visible = false;
    _ng.isQuickSpinActive = false;
    _ng.isSkipBigwinActive = false;
    _ng.isSpaceClickToSpinActive = true;

    this.onAnyWinOn.visible = false;
    _ng.isonAnyWinActive = false;

    this.autoSpinWinLimitOn.visible = false;
    this.autoSpinLossLimitOn.visible = false;



    // //game history link 
    // if (this.historyButton) {
    //     pixiLib.setInteraction(this.historyButton, true);
    //     pixiLib.addEvent(this.historyButton, this.onGameLogsClick.bind(this));
    // }
    if(commonConfig.hideHomeButtonInDesktop){
        this.homeButton.alpha = 0;
        this.homeButton.height = 0;
    }
    //Do not enable Quick spin by default if it's disabled by Operator
    //Returned so that quick spin is not enable even if using localstorage from previous game.
    //German Regulations
    if(commonConfig.disableQuickSpin){
        pixiLib.setInteraction(this.quickSpinOff, false, "0x888888");
        pixiLib.setInteraction(this.quickSpinText, false, "0x888888");
    }
};
// sView.onGameLogsClick = function(){
//     _sndLib.play(_sndLib.sprite.btnClick); 
//     window.open("../logs/?account_id=" + coreApp.gameModel.userModel.accountId + "&language=" + lang, '_blank');
// }

sView.onVolumeLow = function () {
    this.volumeOnBtn.visible = true;
    this.volumeOffBtn.visible = false;
    this.isSoundOn = false;
    _sndLib.setPreviousVolume(_sndLib.curVolume);
    _mediator.publish("setVolume", 0);
    _sndLib.mute(true);
};

sView.onHomeButtonClick = function () {
    _sndLib.play(_sndLib.sprite.btnClick);
    _mediator.publish("openURL", {type: "lobby"});
};

sView.onVolumeFUll = function () {
    this.volumeOnBtn.visible = true;
    this.volumeOffBtn.visible = false;
    _mediator.publish("setVolume", (_sndLib.previousVolume) ? _sndLib.previousVolume : _sndLib.defaultVolume);
    _sndLib.setPreviousVolume(undefined);
    _sndLib.mute(false);
    this.isSoundOn = true;
};

sView.onSlider = function () {
    this.autoSpinLoseLimitOff.visible = true;
    this.autoSpinLoseLimitOn.visible = false;
};

sView.onAutoSpinLoseLimitOn = function () {
    _sndLib.play(_sndLib.sprite.sASLossBtnClick);
    this.autoSpinLoseLimitOff.visible = true;
    this.autoSpinLoseLimitOn.visible = false;
};

sView.onAutoSpinLoseLimitOff = function () {
    _sndLib.play(_sndLib.sprite.sASLossBtnClick);
    this.autoSpinLoseLimitOff.visible = false;
    this.autoSpinLoseLimitOn.visible = true;
};

sView.onSpaceClickOn = function () {
    _sndLib.play(_sndLib.sprite.sQuickSpinBtnClick);
    this.spaceClickOff.visible = true;
    this.spaceClickOn.visible = false;
    _ng.isSpaceClickToSpinActive = false;
};
sView.onSpaceClickOff = function () {
    _sndLib.play(_sndLib.sprite.sQuickSpinBtnClick);
    this.spaceClickOff.visible = false;
    this.spaceClickOn.visible = true;
    _ng.isSpaceClickToSpinActive = true;
};

/*
@VJ 31-10-2019
onsettingInitialize making dg games, quick spin true
*/
sView.onQuickSpinOnDgDefaultInit = function () {
    //Do not enable Quick spin by default if it's disabled by Operator
    //Returned so that quick spin is not enable even if using localstorage from previous game.
    //German Regulations
    if(commonConfig.disableQuickSpin){ return; }
    //_sndLib.play(_sndLib.sprite.sQuickSpinBtnClick);
    this.quickSpinOff.visible = false;
    this.quickSpinOn.visible = true;
    _ng.isQuickSpinActive = true;
};
sView.onQuickSpinOn = function () {
    //Do not enable Quick spin by default if it's disabled by Operator
    //Returned so that quick spin is not enable even if using localstorage from previous game.
    //German Regulations
    if(commonConfig.disableQuickSpin){ return; }
    _sndLib.play(_sndLib.sprite.sQuickSpinBtnClick);
    this.quickSpinOff.visible = true;
    this.quickSpinOn.visible = false;
    _ng.isQuickSpinActive = false;
};
sView.onQuickSpinOff = function () {
    //Do not enable Quick spin by default if it's disabled by Operator
    //Returned so that quick spin is not enable even if using localstorage from previous game.
    //German Regulations
    if(commonConfig.disableQuickSpin){ return; }
    _sndLib.play(_sndLib.sprite.sQuickSpinBtnClick);
    this.quickSpinOff.visible = false;
    this.quickSpinOn.visible = true;
    _ng.isQuickSpinActive = true;
};
sView.onSkipBigwinOn = function () {
    _sndLib.play(_sndLib.sprite.sQuickSpinBtnClick);
    this.skipBigwinOff.visible = true;
    this.skipBigwinOn.visible = false;
    _ng.isSkipBigwinActive = false;

};
sView.onSkipBigwinOff = function () {
    //if(commonConfig.disableSkipBigwin){ return; }
    _sndLib.play(_sndLib.sprite.sQuickSpinBtnClick);
    this.skipBigwinOff.visible = false;
    this.skipBigwinOn.visible = true;
    _ng.isSkipBigwinActive = true;
};
sView.onMenuOpen = function () {
    _sndLib.play(_sndLib.sprite.menuBtnClick);
    _mediator.publish("clearAllWins");
    this.openMenu();
};
sView.onMenuClose = function () {
    _sndLib.play(_sndLib.sprite.menuBtnCloseClick);
    this.closeMenu();
};
sView.onPaytable = function () {
    _sndLib.play(_sndLib.sprite.paytableBtnClick);
    this.closeMenu();
    _sndLib.play(_sndLib.sprite.paytableBtnClick);
    // if(_ng.GameConfig.paytableType == "HTML"){
    //     onGamePaytableToggle(true);
    // }else{
        _mediator.publish("SHOW_PAYTABLE");
    // }
};
sView.onSettings = function () {
    _sndLib.play(_sndLib.sprite.settingsBtnClick);
    this.closeMenu();
    _mediator.publish("SHOW_SETTINGS");
    this.showSettingsContainer(true);
};
sView.onRules = function () {
    // _sndLib.play(_sndLib.sprite.gRulesBtnClick);
    this.closeMenu();
    onGameRulesToggle(true);
};
sView.onFullscreen = function () {
    _sndLib.play(_sndLib.sprite.fullScreenBtnClick);
    this.fullscreenBtn.visible = false;
    this.normalscreenBtn.visible = true;
    this.closeMenu();
    this.isFullScreen = true;
    pixiLib.toggleFulScreen();
};

sView.onNormalscreen = function () {
    _sndLib.play(_sndLib.sprite.fullScreenBtnClick);
    this.fullscreenBtn.visible = true;
    this.normalscreenBtn.visible = false;
    this.closeMenu();
    this.isFullScreen = false;
    pixiLib.toggleFulScreen();
};

sView.onToggleScreen = function (val) {
    if (val === 0) {
        _sndLib.play(_sndLib.sprite.fullScreenBtnClick);
        this.fullscreenBtn.visible = true;
        this.normalscreenBtn.visible = false;
        this.closeMenu();
        this.isFullScreen = false;
    } else if (val === 1) {
        _sndLib.play(_sndLib.sprite.fullScreenBtnClick);
        this.fullscreenBtn.visible = false;
        this.normalscreenBtn.visible = true;
        this.isFullScreen = true;
        this.closeMenu();
    }
}

sView.onVolumeOn = function () {
    this.volumeOnBtn.visible = false;
    this.volumeOffBtn.visible = true;

    _sndLib.setPreviousVolume(_sndLib.curVolume);
    _mediator.publish("setVolume", 0);
    _sndLib.mute(true);
    this.closeMenu();
    this.isSoundOn = false;
};
sView.onVolumeOff = function () {
    _sndLib.play(_sndLib.sprite.soundBtnClick);
    _mediator.publish("setVolume", (_sndLib.previousVolume) ? _sndLib.previousVolume : _sndLib.defaultVolume);
    _sndLib.setPreviousVolume(undefined);
    _sndLib.mute(false);

    this.volumeOnBtn.visible = true;
    this.volumeOffBtn.visible = false;
    this.closeMenu();
    this.isSoundOn = true;
};
sView.onSettingCloseClick = function () {
    _sndLib.play(_sndLib.sprite.sCloseBtnClick);
    this.showSettingsContainer(false);
    _mediator.publish("HIDE_SETTINGS");
};
sView.showSettingsContainer = function (bool) {
    if (typeof bool !== "boolean") bool = true;
    // tempararly hiding clockview on paytable and settings view.    
    (bool) ? coreApp.gameView.clockView.hide() : coreApp.gameView.clockView.show();
    this.settingsContainer.visible = bool;

    if (this.autoSpinWinLimitOff.visible) {
        pixiLib.setText(this["inputWinLimitText"], "");
        _mediator.publish("AS_StopOnWinLimit", false, 1);
    } else {
        var obj = { value: this.winLimitMultiplier ? this.winLimitMultiplier : 1, isActive: true }
        this.onWinLimitChange(obj);
    }

    if (this.autoSpinLossLimitOff.visible) {
        pixiLib.setText(this["inputLossLimitText"], "");
        _mediator.publish("AS_StopOnLossLimit", false, 1);
    } else {
        var obj = { value: this.lossLimitMultiplier ? this.lossLimitMultiplier : 1, isActive: true }
        this.onLossLimitChange(obj);
    }


};
sView.closeSettingsPanel = function () {
    this.showSettingsContainer(false);
}
sView.onSoundEffectOff = function () {
    this.soundEffectOff.visible = false;
    this.soundEffectOn.visible = true;
    _ng.isSoundEffectsActive = true;
    // _sndLib.play(_sndLib.sprite.sSoundSelBtnClick);
};
sView.onSoundEffectOn = function () {
    _sndLib.play(_sndLib.sprite.sSoundSelBtnClick);
    this.soundEffectOn.visible = false;
    this.soundEffectOff.visible = true;
    _ng.isSoundEffectsActive = false;
};
sView.onSoundOffHandler = function () {
};
sView.onAmbienceSoundOff = function () {
    _sndLib.play(_sndLib.sprite.sAmbienceBtnClick);
    this.ambienceSoundOff.visible = false;
    this.ambienceSoundOn.visible = true;
    _ng.isAmbienceSoundActive = true;
    _sndLib.setVolumeById(_sndLib.sprite.bg.volume, _sndLib.sprite.bg);
};
sView.onAmbienceSoundOn = function () {
    _sndLib.play(_sndLib.sprite.sAmbienceBtnClick);
    this.ambienceSoundOn.visible = false;
    this.ambienceSoundOff.visible = true;
    _ng.isAmbienceSoundActive = false;
    _sndLib.setVolumeById(0, _sndLib.sprite.bg);
};
sView.openMenu = function () {
    _mediator.publish("HIDE_AUTOSPIN_WINDOW");
    this.isFullScreen = pixiLib.isFullScreen();
    this.menuCloseBtn.visible = true;
    this.menuOpenBtn.visible = false;



    /*this.normalscreenBtn.visible = this.isFullScreen;
    this.fullscreenBtn.visible = !this.isFullScreen;
    this.volumeOnBtn.visible = this.isSoundOn;
    this.volumeOffBtn.visible = !this.isSoundOn;*/

    this.normalscreenBtn.visible = false;
    this.fullscreenBtn.visible = false;
    this.volumeOnBtn.visible = false;
    this.volumeOffBtn.visible = false;



    if(this.btns.indexOf(this.fullscreenBtn) >= 0 || this.btns.indexOf(this.normalscreenBtn) >= 0){
        var FSButtonIndex = Math.max(this.btns.indexOf(this.fullscreenBtn), this.btns.indexOf(this.normalscreenBtn));
        this.btns[FSButtonIndex] = (this.isFullScreen) ? this.normalscreenBtn : this.fullscreenBtn;
    }
    if(this.btns.indexOf(this.volumeOnBtn) >= 0 || this.btns.indexOf(this.volumeOffBtn) >= 0){
        var soundIndex = Math.max(this.btns.indexOf(this.volumeOnBtn), this.btns.indexOf(this.volumeOffBtn));
        this.btns[soundIndex] = (this.isSoundOn) ? this.volumeOnBtn : this.volumeOffBtn;
    }
    for (var i = 0; i < this.btns.length; i++) {
        this.btns[i].visible = true;
        this.btns[i].y = this.menuOpenBtn.y;
        this.btns[i].x = this.menuOpenBtn.x;
        TweenMax.to(this.btns[i], this.slideDuration * (i / 5), { y: this.menuOpenBtn.y - (58 * (i + 1)), ease: Power2.easeOut, onComplete: this.onTweenComplete.bind(this, this.btns[i], true) });
    }

    this.normalscreenBtn.visible = false;
    this.fullscreenBtn.visible = false;
    this.volumeOnBtn.visible = false;
    this.volumeOffBtn.visible = false;

    this.isMenuOpened = true;
};

sView.updateMenuVolume = function (vol) {
    // console.log(Number(vol.value));
    _sndLib.setVolume(Number(vol.value));
    
    if(this.volumeOnBtn){
        if (_sndLib.curVolume === 0) {
            //Modify visibility only when volume button is not in menu
            if(!(this.btns.indexOf(this.volumeOnBtn) >= 0 || this.btns.indexOf(this.volumeOffBtn) >= 0)){
                this.volumeOnBtn.visible = false;
                this.volumeOffBtn.visible = true;
            }
            this.isSoundOn = false;
        } else {
            if(!(this.btns.indexOf(this.volumeOnBtn) >= 0 || this.btns.indexOf(this.volumeOffBtn) >= 0)){
                this.volumeOnBtn.visible = true;
                this.volumeOffBtn.visible = false;
            }
            this.isSoundOn = true;
        }
    }
}
sView.closeMenu = function () {
    if (!this.isMenuOpened) { return; }
    this.menuOpenBtn.visible = true;
    this.menuCloseBtn.visible = false;
    this.normalscreenBtn.visible = this.isFullScreen;
    this.fullscreenBtn.visible = !this.isFullScreen;
    this.volumeOnBtn.visible = this.isSoundOn;
    this.volumeOffBtn.visible = !this.isSoundOn;
    if(this.btns.indexOf(this.fullscreenBtn) >= 0 || this.btns.indexOf(this.normalscreenBtn) >= 0){
        var FSButtonIndex = Math.max(this.btns.indexOf(this.fullscreenBtn), this.btns.indexOf(this.normalscreenBtn));
        console.log(FSButtonIndex);
        this.btns[FSButtonIndex] = (this.isFullScreen) ? this.normalscreenBtn : this.fullscreenBtn;
    }
    //If sound button in Not in menu then it should not be added in this.btns
    if(this.btns.indexOf(this.volumeOnBtn) >= 0 || this.btns.indexOf(this.volumeOffBtn) >= 0){
        var soundIndex = Math.max(this.btns.indexOf(this.volumeOnBtn), this.btns.indexOf(this.volumeOffBtn));
        this.btns[soundIndex] = (this.isSoundOn) ? this.volumeOnBtn : this.volumeOffBtn;
    }

    for (var i = 0; i < this.btns.length; i++) {
        this.btns[i].x = this.menuOpenBtn.x;
        TweenMax.to(this.btns[i], this.slideDuration * (i / 5), { y: this.menuOpenBtn.y, ease: Power2.easeOut, onComplete: this.onTweenComplete.bind(this, this.btns[i], false) });
    }
    this.isMenuOpened = false;

    // if (_sndLib.curVolume === 0) {
    //     this.volumeOnBtn.visible = false;
    //     this.volumeOffBtn.visible = true;
    // } else {
    //     this.volumeOnBtn.visible = true;
    //     this.volumeOffBtn.visible = false;
    // }
};
sView.onTweenComplete = function (el, val) {
    el.visible = val;

    this.normalscreenBtn.visible = false;
    this.fullscreenBtn.visible = false;
    this.volumeOnBtn.visible = false;
    this.volumeOffBtn.visible = false;

};


