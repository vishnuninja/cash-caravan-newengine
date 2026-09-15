var GSV = SettingsDesktopView.prototype;
GSV.createView = function () {
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
    if(this.totalBetBox){
        var style = {
            "fill": "0xffffff",
            "fontSize": 35,
            "fontFamily": "Baloo-Regular",
            // "fontFamily": "ProximaNova_Bold",
            "maxWidth": 100,    
        }
    this.betSetValue = pixiLib.getElement("Text",style);
    this.totalBetBox.addChild(this.betSetValue);
    this.betSetValue.anchor.set(0.5);
    this.betSetValue.position.set(0,0);
    pixiLib.setText(this.betSetValue,"1.00")
    }
    _mediator.subscribe("SHOW_RULES",this.onRules.bind(this));
    _mediator.subscribe("spinStart",this.onRulesclose.bind(this));
    
    /*for button hover*/
    this.addHoverInteractions();
     if (!this.isIntroScreenActive()) {
        _mediator.publish("setInitialintroButtonStateDesktop",false);
         return; 
        }
    _mediator.publish("setInitialintroButtonStateDesktop",true);
      var isAmbientMusicActive = this.isAmbientMusicActive();
      _ng.isAmbienceSoundActive = isAmbientMusicActive;

    (pixiLib.getLocalStorageItem("sound") === "false") ? _mediator.publish("soundEffectOn") : _mediator.publish("soundEffectOff");
};

GSV.addEvents = function () {
    spv.addEvents.call(this);
      /**
     * ToDo: For externalUI, needs to create soundmanager to handle...
     */
    _mediator.subscribe("soundEffectOff", this.onSoundEffectOff.bind(this));
    _mediator.subscribe("soundEffectOn", this.onSoundEffectOn.bind(this));
    _mediator.subscribe("ambienceSoundOff", this.onAmbienceSoundOff.bind(this));
    _mediator.subscribe("ambienceSoundOn", this.onAmbienceSoundOn.bind(this));
    _mediator.subscribe("quickSpinOff", this.onQuickSpinOff.bind(this));
    _mediator.subscribe("quickSpinOn", this.onQuickSpinOn.bind(this));
    
    // Call addSettingsEvents from GSettingView to set up historyTitle button
    // This sets up the "Game Replay" button click handler
    if (spv.addSettingsEvents) {
        spv.addSettingsEvents.call(this);
    }

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
    pixiLib.setInteraction(this.settingsBg, true);
    pixiLib.setInteraction(this.settingsBg1,true);

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
    pixiLib.addEvent(this.PlusBet, this.onPlusBtnClick.bind(this));
    pixiLib.addEvent(this.MinusBet, this.onMinusBtnClick.bind(this));
    pixiLib.addEvent(this.settingsCloseBtn, this.onSettingCloseClick.bind(this));
    pixiLib.addEvent(this.settingsCloseBtn, () => {
        _sndLib.play(_sndLib.sprite.sCloseBtnClick);
    });
    pixiLib.addEvent(this.settingsBg, this.onSettingCloseClick.bind(this));
    _mediator.subscribe("SHOW_SETTINGS", this.showSettingsContainer.bind(this));
    _mediator.subscribe("spinStart", this.onSettingCloseClick.bind(this));
    _mediator.subscribe("panelClick", this.closeMenu.bind(this));

    _mediator.subscribe("settingVolumeChange", this.updateMenuVolume.bind(this));
    _mediator.subscribe("updateSetBet", this.updateSetBet.bind(this));
    _mediator.subscribe("settingsPlusBetInteraction", this.settingsPlusBetInteraction.bind(this));
    _mediator.subscribe("settingsMinusBetInteraction", this.settingsMinusBetInteraction.bind(this));
    _mediator.subscribe("setInitialintroButtonStateDesktop", this.setInitialintroButtonStateDesktop.bind(this));
    


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



    //game history link 
    if (this.historyButton) {
        pixiLib.setInteraction(this.historyButton, true);
        pixiLib.addEvent(this.historyButton, this.onGameLogsClick.bind(this));
    }
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

GSV.addHoverInteractions = function() {

    var settingsButtons = [this.soundEffectOff, this.soundEffectOn, 
                        this.ambienceSoundOff, this.ambienceSoundOn,
                        this.quickSpinOff, this.quickSpinOn,
                        this.skipBigwinOff, this.skipBigwinOn,
                        this.spaceClickOff, this.spaceClickOn,
                        this.PlusBet, this.MinusBet,
                        this.settingsCloseBtn];

    settingsButtons.forEach(button => {
        pixiLib.addHoverInteraction(button, () => {
            if(button)
                _sndLib.play(_sndLib.sprite.btnClick);
        });
    });
}

GSV.onSettingCloseClick = function () {
    this.settingsContainer.scale.set(1);
    TweenMax.to(this.settingsContainer.scale,.15, {
    x:0, y:0,
    ease: "none",
    onComplete: function() {
        this.showSettingsContainer(false);
        _mediator.publish("HIDE_SETTINGS");
        _mediator.publish("toggleBetContainer",false);
    }.bind(this)
    });

};
GSV.showSettingsContainer = function (bool) {
    _mediator.publish("toggleBetContainer",false);
    if (typeof bool !== "boolean") bool = true;
    // tempararly hiding clockview on paytable and settings view.    
    (bool) ? coreApp.gameView.clockView.hide() : coreApp.gameView.clockView.show();

    this.settingsContainer.visible = bool;

    this.settingsContainer.scale.set(0);
    TweenMax.to(this.settingsContainer.scale,.15, {
    x:1, y:1,
    ease: "none",
    // onComplete: function() {
    //     this.BuypopupCon.visible = false;
    //     this.BuypopupPanel.visible = false;
    //     this.grayBgbuy.visible = false;
    // }.bind(this)
    });
    _mediator.publish("setVolume", (_sndLib.previousVolume>=0) ? _sndLib.previousVolume : _sndLib.defaultVolume);
    _mediator.publish("closeVolBar",true);
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

    // Update history buttons state based on free spin status when settings panel is shown
    if (bool && this.updateHistoryButtonsState) {
        // Add small delay to ensure free spin state is properly checked
        setTimeout(function() {
            this.updateHistoryButtonsState();
        }.bind(this), 50);
    }

};
GSV.onRules = function () {
    // _sndLib.play(_sndLib.sprite.gRulesBtnClick);
    this.closeMenu();
    onGameRulesToggle(true);
};
GSV.onRulesclose = function () {
    // _sndLib.play(_sndLib.sprite.gRulesBtnClick);
   
    onGameRulesToggle(false);
};
GSV.updateMenuVolume = function (vol) {
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
    
    _sndLib.setPreviousVolume(_sndLib.curVolume);
}

GSV.updateSetBet = function (value) {
  var setBet = pixiLib.getFormattedAmount(value);
  pixiLib.setText(this.betSetValue,setBet);
}

//setting Total bet plus and minus

GSV.onPlusBtnClick = function() {
    _mediator.publish("setIncrement");
}

GSV.onMinusBtnClick = function() {
    _mediator.publish("setDecrement");
}

GSV.settingsPlusBetInteraction = function(value) {
    if(this.PlusBet)
        pixiLib.setInteraction(this.PlusBet, value);
}

GSV.settingsMinusBetInteraction = function(value) {
    if(this.MinusBet)
        pixiLib.setInteraction(this.MinusBet, value);
}
GSV.onQuickSpinOn = function () {
    //Do not enable Quick spin by default if it's disabled by Operator
    //Returned so that quick spin is not enable even if using localstorage from previous game.
    //German Regulations
    if(commonConfig.disableQuickSpin){ return; }
    _sndLib.play(_sndLib.sprite.sQuickSpinBtnClick);
    // this.quickSpinOff.visible = true;
    // this.quickSpinOn.visible = false;
    // _ng.isQuickSpinActive = false;
    _mediator.publish("onSloAnimQuickSpinOff");
    // _mediator.publish("togglequickSpinSettingsinside", true);
};
GSV.onQuickSpinOff = function () {
    //Do not enable Quick spin by default if it's disabled by Operator
    //Returned so that quick spin is not enable even if using localstorage from previous game.
    //German Regulations
    if(commonConfig.disableQuickSpin){ return; }
    _sndLib.play(_sndLib.sprite.sQuickSpinBtnClick);
    // this.quickSpinOff.visible = false;
    // this.quickSpinOn.visible = true;
    // _ng.isQuickSpinActive = true;
    _mediator.publish("onSloAnimQuickSpinOn");
    // _mediator.publish("togglequickSpinSettingsinside",false);
};

GSV.onAmbienceSoundOff = function () {
    _sndLib.play(_sndLib.sprite.sAmbienceBtnClick);
    this.ambienceSoundOff.visible = false;
    this.ambienceSoundOn.visible = true;
    _ng.isAmbienceSoundActive = true;
    this.setAmbientMusicToLocalStorage(true);

    if(coreApp.gameModel.isFreeSpinActive()) {
        _sndLib.playBg(_sndLib.sprite.bgFS);
        _sndLib.setVolumeById(_sndLib.sprite.bgFS.volume, _sndLib.sprite.bgFS);
    } else {
         if(!_sndLib.isPlaying)
            _sndLib.playBg(_sndLib.sprite.bg);/* play bg after reload */
        _sndLib.setVolumeById(_sndLib.sprite.bg.volume, _sndLib.sprite.bg);
    }
};

GSV.onAmbienceSoundOn = function () {
    _sndLib.play(_sndLib.sprite.sAmbienceBtnClick);
    this.ambienceSoundOn.visible = false;
    this.ambienceSoundOff.visible = true;
    _ng.isAmbienceSoundActive = false;
    _sndLib.setVolumeById(0, _sndLib.sprite.bg);
    _sndLib.setVolumeById(0, _sndLib.sprite.bgFS);
};
GSV.setAmbientMusicToLocalStorage = function (bool) {
    pixiLib.setLocalStorageItem("music", bool);
};
GSV.isAmbientMusicActive = function () {
    var localStorageValue = pixiLib.getLocalStorageItem("music");
    if (localStorageValue === null || localStorageValue === undefined || localStorageValue === "true") {
        return true;
    }
    return false;
};

GSV.isIntroScreenActive = function () {
    var localStorageValue = pixiLib.getLocalStorageItem("noIntro");
    if (_ng.GameConfig.showIntro && localStorageValue !== "true") {
        return true;
    }
    return false;
};

GSV.toggleIntroScreen = function (bool) {
    var newLocal = pixiLib.setLocalStorageItem("noIntro" ,bool);
};
GSV.onSpaceClickOn = function () {
    _sndLib.play(_sndLib.sprite.sQuickSpinBtnClick);
    this.spaceClickOff.visible = true;
    this.spaceClickOn.visible = false;
    this.toggleIntroScreen(true);
};
GSV.onSpaceClickOff = function () {
    _sndLib.play(_sndLib.sprite.sQuickSpinBtnClick);
    this.spaceClickOff.visible = false;
    this.spaceClickOn.visible = true;
    this.toggleIntroScreen(false);
};
GSV.setInitialintroButtonStateDesktop = function (bool) {
    this.spaceClickOn.visible = bool;
    this.spaceClickOff.visible =!bool;
};
