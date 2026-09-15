var GMsView = SettingsMobileView.prototype;
var spv = SettingsView.prototype;
GMsView.createView = function () {
    spv.createView.call(this);

    coreApp.gameView.paytableContainer.addChildAt(this.menuButton, 0);
    coreApp.gameView.paytableContainer.addChildAt(this.homeButton, 1);
    coreApp.gameView.paytableContainer.addChildAt(this.optionsContainer, 2);
    coreApp.gameView.paytableContainer.addChildAt(this.settingsMContainer, 3);
    coreApp.gameView.paytableContainer.addChildAt(this.gameSettingsTitle, 4);
    if (!this.optionsTabBase) {
        coreApp.gameView.paytableContainer.addChildAt(this.settingsCloseButton, 5);
    } else {
        coreApp.gameView.paytableContainer.addChildAt(this.settingsBg, 0);
        this.settingsBg.visible = false;
    }
    _ngFluid.call(this.testAutoSpins, {
        "HX": 670, "HY": 470, "VX": 390, "VY": 918, "landAnchorX": .5, "landAnchorY": .5, "portAnchorX": .5, "portAnchorY": .5,
        "landScaleX": 1, "landScaleY": 1, "portScaleX": 1, "portScaleY": 1,
        "landAlignX": "CENTER", "landAlignY": "BOTTOM", "portAlignX": "CENTER", "portAlignY": "BOTTOM"
    });

    this.asTxtStyle = {
        "fontStyle": "bold",
        "fontSize": 50,
        "fontFamily": "ProximaNova_Bold",
        "fill": "#FFFFFF",
        "stroke": '#391400',
        "strokeThickness": 8,
        "align": "center",
        "wordWrapWidth": 60
    };

    this.optionBg.interactive = true;
    this.optionsContainer.visible = false;
    this.optionsContainer.interactive = true;
    this.settingsMContainer.visible = false;
    this.gameSettingsTitle.visible = false;
    this.settingsCloseButton.visible = false;
    this.addEvents();
    this['settingsBg'].interactive = true;
    this.onSoundOnHandler();
    this.onResize();

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
            // "fontFamily": "ProximaNova_Bold",
            "fontFamily": "Baloo-Regular",
             "maxWidth": 100,     
        }
    this.betSetValue = pixiLib.getElement("Text",style);
    this.totalBetBox.addChild(this.betSetValue);
    this.betSetValue.anchor.set(0.5);
    this.betSetValue.position.set(0,0);
    pixiLib.setText(this.betSetValue,"1.00")
    }

    if (!this.isIntroScreenActive()) {
        _mediator.publish("setInitialintroButtonStateMobile",false);
         return; 
        }
    _mediator.publish("setInitialintroButtonStateMobile",true);
     var isAmbientMusicActive = this.isAmbientMusicActive();
      _ng.isAmbienceSoundActive = isAmbientMusicActive;

    (pixiLib.getLocalStorageItem("sound") === "false") ? _mediator.publish("soundEffectOn") : _mediator.publish("soundEffectOff");
};
GMsView.addEvents = function () {
    this.optionsSlideX = 100;
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
    // check boxes
    pixiLib.setInteraction(this.soundEffectOff, true);
    pixiLib.setInteraction(this.soundEffectOn, true);
    pixiLib.setInteraction(this.ambienceSoundOff, true);
    pixiLib.setInteraction(this.ambienceSoundOn, true);
    pixiLib.setInteraction(this.quickSpinOff, true);
    pixiLib.setInteraction(this.quickSpinOn, true);
    pixiLib.setInteraction(this.skipBigwinOff, true);
    pixiLib.setInteraction(this.skipBigwinOn, true);
    pixiLib.setInteraction(this.menuButton, true);
    pixiLib.setInteraction(this.optionsCloseBtn, true);


    pixiLib.addEvent(this.soundEffectOff, this.onSoundEffectOff.bind(this));
    pixiLib.addEvent(this.soundEffectOn, this.onSoundEffectOn.bind(this));

    pixiLib.addEvent(this.ambienceSoundOff, this.onAmbienceSoundOff.bind(this));
    pixiLib.addEvent(this.ambienceSoundOn, this.onAmbienceSoundOn.bind(this));

    pixiLib.addEvent(this.quickSpinOff, this.onQuickSpinOff.bind(this));
    pixiLib.addEvent(this.quickSpinOn, this.onQuickSpinOn.bind(this));
    pixiLib.addEvent(this.skipBigwinOff, this.onSkipBigwinOff.bind(this));
    pixiLib.addEvent(this.skipBigwinOn, this.onSkipBigwinOn.bind(this));
    pixiLib.addEvent(this.optionsCloseBtn, this.onCloseOptionsClick.bind(this));
    pixiLib.addEvent(this.menuButton, this.onMenuClick.bind(this));
    pixiLib.setInteraction(this.gameSettingTitle, true);
    pixiLib.addEvent(this.gameSettingTitle, this.onSettingsClick.bind(this));
    pixiLib.addEvent(this.settingsButton, this.onSettingsClick.bind(this));
    pixiLib.addEvent(this.settingsCloseButton, this.onSettingsCloseClick.bind(this));
    pixiLib.setInteraction(this.settingsBg, true);
    pixiLib.addEvent(this.settingsBg, this.onSettingsCloseClick.bind(this));
    pixiLib.setInteraction(this.settingsBgRect, true);

    pixiLib.setInteraction(this.gameRulesTitle, true);
    pixiLib.addEvent(this.gameRulesTitle, this.onGameRulesClick.bind(this));

    pixiLib.setInteraction(this.gameDepositBtn, true);
    pixiLib.addEvent(this.gameDepositBtn, this.onDepositClick.bind(this));
    pixiLib.setInteraction(this.gameDepositTitle, true);
    pixiLib.addEvent(this.gameDepositTitle, this.onDepositClick.bind(this));

    pixiLib.setInteraction(this.spaceClickOff, true);
    pixiLib.setInteraction(this.spaceClickOn, true);
    pixiLib.addEvent(this.spaceClickOff, this.onSpaceClickOff.bind(this));
    pixiLib.addEvent(this.spaceClickOn, this.onSpaceClickOn.bind(this));



    pixiLib.setInteraction(this.gameRulesBtn, true);
    pixiLib.addEvent(this.gameRulesBtn, this.onGameRulesClick.bind(this));
    pixiLib.addEvent(this.paytableButton, this.onPaytableClick.bind(this));
    pixiLib.setInteraction(this.paytableTitle, true);
    pixiLib.addEvent(this.paytableTitle, this.onPaytableClick.bind(this));

    pixiLib.setInteraction(this.soundOnButton, true);
    pixiLib.addEvent(this.soundOnButton, this.onSoundOnHandler.bind(this));

    pixiLib.setInteraction(this.soundOffButton, true);
    pixiLib.addEvent(this.soundOffButton, this.onSoundOffHandler.bind(this));

    pixiLib.setInteraction(this.homeButton, true);
    pixiLib.addEvent(this.homeButton, this.onHomeButtonClick.bind(this));
    pixiLib.addEvent(this.PlusBet, this.plusButtonClick.bind(this));
    pixiLib.addEvent(this.MinusBet, this.minusButtonClick.bind(this));

    this.soundOnButton.visible = true;
    this.soundOffButton.visible = false;
    /*---------   Skip BigWin Animation ---------  */
    this.skipBigwinOn.visible = false;
    this.skipBigwinOff.visible = true;
    _ng.isSkipBigwinActive = false;

    /*---------   Skip BigWin Animation ---------  */

    pixiLib.setInteraction(this.bg, true);
    pixiLib.addEvent(this.bg, this.onCloseOptionsClick.bind(this));


    if (commonConfig.hideDeposit == true) {
        this.gameDepositBtn.visible = false;
        this.gameDepositTitle.visible = false;
        // this.soundOnButton.y = 340;
        // this.soundOffButton.y = 340;
        // this.optionsContainer.y = -80;
    }
    if (commonConfig.hideHomeButtonMobile) {
        this.homeButton.visible = false;
        this.homeButton.alpha = 0;
    }

    this.onResize();
    _mediator.subscribe("showMobileAutoSpinPanel", this.onShowAutoSpinPanel.bind(this, true));
    _mediator.subscribe("showMenuBtnEvent", this.onShowMenuBtnEvent.bind(this));
    _mediator.subscribe("hideMenuBtnEvent", this.onHideMenuBtnEvent.bind(this));
    _mediator.subscribe("SHOW_SETTINGS", this.showSettingsContainer.bind(this));
    _mediator.subscribe("SHOW_RULES", this.onGameRulesClick.bind(this));
    _mediator.subscribe("SHOW_SOUND_ON", this.onSoundOnHandler.bind(this));
    _mediator.subscribe("SHOW_SOUND_OFF", this.onSoundOffHandler.bind(this));
    _mediator.subscribe("updateSetBet", this.updateSetBet.bind(this));
    _mediator.subscribe("settingsPlusBetInteractionMobile", this.settingsPlusBetInteractionMobile.bind(this));
    _mediator.subscribe("settingsMinusBetInteractionMobile", this.settingsMinusBetInteractionMobile.bind(this));
    _mediator.subscribe("setInitialintroButtonStateMobile", this.setInitialintroButtonStateMobile.bind(this));
    /*
     @VJ 31-10-2019
     onsettingInitialize making dg games, quick spin default true
     */
    _mediator.subscribe("quickSpinOnDgDefaultInit", this.onQuickSpinOnDgDefaultInit.bind(this));

    //Do not enable Quick spin by default if it's disabled by Operator
    //Returned so that quick spin is not enable even if using localstorage from previous game.
    //German Regulations
    if (commonConfig.disableQuickSpin) {
        pixiLib.setInteraction(this.quickSpinOff, false, "0x888888");
        pixiLib.setInteraction(this.quickSpinText, false, "0x888888");
    }
};
GMsView.updateSetBet = function (value) {
     var setBet = pixiLib.getFormattedAmount(value);
     pixiLib.setText(this.betSetValue,setBet);
}

//for settings panel total bet plus and minus

GMsView.plusButtonClick =function(){
    _mediator.publish("setIncrement");
}

GMsView.minusButtonClick =function(){
    _mediator.publish("setDecrement");
}

GMsView.showSettingsContainer = function (bool) {
    _mediator.publish("toggleBetContainer",false);
    if (typeof bool !== "boolean") bool = true;
    // tempararly hiding clockview on paytable and settings view.    
    (bool) ? coreApp.gameView.clockView.hide() : coreApp.gameView.clockView.show();

    this.settingsMContainer.visible = bool;
    this.settingsBg.visible = bool;
    this.gameSettingsTitle.visible = bool;
    this.settingsCloseButton.visible = bool;
    // this.homeButton.visible = !bool;

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
}
GMsView.settingsPlusBetInteractionMobile = function(value) {
    if(this.PlusBet)
        pixiLib.setInteraction(this.PlusBet, value);
}

GMsView.settingsMinusBetInteractionMobile = function(value) {
    if(this.MinusBet)
        pixiLib.setInteraction(this.MinusBet, value);
}
GMsView.onQuickSpinOff = function () {
    //Do not enable Quick spin by default if it's disabled by Operator
    //Returned so that quick spin is not enable even if using localstorage from previous game.
    //German Regulations
    if (commonConfig.disableQuickSpin) {
        pixiLib.setInteraction(this.quickSpinOff, false, "0x888888");
    }
    _sndLib.play(_sndLib.sprite.sQuickSpinBtnClick);
    _mediator.publish("onSloAnimQuickSpinOn");
};
GMsView.onQuickSpinOn = function () {
    //Do not enable Quick spin by default if it's disabled by Operator
    //Returned so that quick spin is not enable even if using localstorage from previous game.
    //German Regulations
    if (commonConfig.disableQuickSpin) {
        pixiLib.setInteraction(this.quickSpinOff, false, "0x888888");
    }
    _sndLib.play(_sndLib.sprite.sQuickSpinBtnClick);
    _mediator.publish("onSloAnimQuickSpinOff");
};

GMsView.onAmbienceSoundOff = function () {
     this.ambienceSoundOff.visible = false;
    this.ambienceSoundOn.visible = true;
    _ng.isAmbienceSoundActive = true;
     this.setAmbientMusicToLocalStorage(true);
    _sndLib.play(_sndLib.sprite.sAmbienceBtnClick);

    if(coreApp.gameModel.isFreeSpinActive()) {
        _sndLib.playBg(_sndLib.sprite.bgFS);
        _sndLib.setVolumeById(_sndLib.sprite.bgFS.volume, _sndLib.sprite.bgFS);
    } else {
          if(!_sndLib.isPlaying)
            _sndLib.playBg(_sndLib.sprite.bg);/* play bg after reload */
        _sndLib.setVolumeById(_sndLib.sprite.bg.volume, _sndLib.sprite.bg);
    }
};

GMsView.onAmbienceSoundOn = function () {
    _sndLib.play(_sndLib.sprite.sAmbienceBtnClick);
    this.ambienceSoundOn.visible = false;
    this.ambienceSoundOff.visible = true;
    _ng.isAmbienceSoundActive = false;
    _sndLib.setVolumeById(0, _sndLib.sprite.bg);
    _sndLib.setVolumeById(0, _sndLib.sprite.bgFS);
};
GMsView.isIntroScreenActive = function () {
    var localStorageValue = pixiLib.getLocalStorageItem("noIntro");
    if (_ng.GameConfig.showIntro && localStorageValue !== "true") {
        return true;
    }
    return false;
};
GMsView.toggleIntroScreen = function (bool) {
    var newLocal = pixiLib.setLocalStorageItem("noIntro" ,bool);
};
GMsView.onSpaceClickOn = function () {
    _sndLib.play(_sndLib.sprite.sQuickSpinBtnClick);
    this.spaceClickOff.visible = true;
    this.spaceClickOn.visible = false;
    this.toggleIntroScreen(true);
};
GMsView.onSpaceClickOff = function () {
    _sndLib.play(_sndLib.sprite.sQuickSpinBtnClick);
    this.spaceClickOff.visible = false;
    this.spaceClickOn.visible = true;
    this.toggleIntroScreen(false);
};
GMsView.setInitialintroButtonStateMobile = function (bool) {
    this.spaceClickOn.visible = bool;
    this.spaceClickOff.visible =!bool;
};
GMsView.isAmbientMusicActive = function () {
   var localStorageValue = pixiLib.getLocalStorageItem("music");
    if (localStorageValue === null || localStorageValue === undefined || localStorageValue === "true") {
        return true;
    }
    return false;
};

GMsView.setAmbientMusicToLocalStorage = function (bool) {
    pixiLib.setLocalStorageItem("music", bool);
};