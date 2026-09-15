SettingsMobileView = function () {
    'use strict';
    this.isMenuOpened = false;
    SettingsView.call(this);
    this.isAnimationRunning = false;
};

SettingsMobileView.prototype = Object.create(SettingsView.prototype);
var sView = SettingsMobileView.prototype;
var spv = SettingsView.prototype;

sView.createView = function () {
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
};

sView.addEvents = function () {
    this.optionsSlideX = 100;
    spv.addEvents.call(this);
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

    pixiLib.setInteraction(this.gameRulesTitle, true);
    pixiLib.addEvent(this.gameRulesTitle, this.onGameRulesClick.bind(this));

    pixiLib.setInteraction(this.gameDepositBtn, true);
    pixiLib.addEvent(this.gameDepositBtn, this.onDepositClick.bind(this));
    pixiLib.setInteraction(this.gameDepositTitle, true);
    pixiLib.addEvent(this.gameDepositTitle, this.onDepositClick.bind(this));



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

    //game history link 
    // if (this.historyButton) {
    //     pixiLib.setInteraction(this.historyButton, true);
    //     pixiLib.addEvent(this.historyButton, this.onGameLogsClick.bind(this));
    // }
};

// sView.onGameLogsClick = function(){
//     _sndLib.play(_sndLib.sprite.btnClick); 
//     window.open("../logs/?account_id=" + coreApp.gameModel.userModel.accountId + "&language=" + lang, '_blank');
// }

sView.onShowMenuBtnEvent = function () {
    this.menuButton.visible = true;
};
sView.onHideMenuBtnEvent = function () {
    this.menuButton.visible = false;
};

sView.onCancelClick = function () {
    this.toggleAutoSpinOptions(false);
};
sView.onStartClick = function () {
    _sndLib.play(_sndLib.sprite.btnClick);
    this.toggleAutoSpinOptions(false);
};
sView.onShowAutoSpinPanel = function () {
    this.toggleAutoSpinOptions(true);
};

sView.toggleAutoSpinOptions = function (bool) {
    // this.autoSpinSelection.visible = bool;
};


sView.onAsBtnClick = function (val) {
    _sndLib.play(_sndLib.sprite.autoSpinSelClick);
    _mediator.publish("START_AUTOSPIN", val);
    this.toggleAutoSpinOptions(false);
};
sView.onDepositClick = function () {
    _mediator.publish("openURL", { type: "deposit" })
}
sView.onHomeButtonClick = function () {
    _sndLib.play(_sndLib.sprite.btnClick);
    _mediator.publish("openURL", { type: "lobby" })
}

sView.onAmbienceSoundOff = function () {
    this.ambienceSoundOff.visible = false;
    this.ambienceSoundOn.visible = true;
    _ng.isAmbienceSoundActive = true;
    _sndLib.play(_sndLib.sprite.sAmbienceBtnClick);
    _sndLib.setVolumeById(_sndLib.sprite.bg.volume, _sndLib.sprite.bg);
};

sView.onAmbienceSoundOn = function () {
    this.ambienceSoundOn.visible = false;
    this.ambienceSoundOff.visible = true;
    _ng.isAmbienceSoundActive = false;
    _sndLib.play(_sndLib.sprite.sAmbienceBtnClick);
    _sndLib.setVolumeById(0, _sndLib.sprite.bg);
};


// sView.onQuickSpinOn = function () {
//     this.quickSpinOff.visible = true;
//     this.quickSpinOn.visible = false;
// };

// sView.onQuickSpinOff = function () {
//     this.quickSpinOff.visible = false;
//     this.quickSpinOn.visible = true;
// };
/*
@VJ 31-10-2019
onLoad making dg games, quick spin default initalization
*/
sView.onQuickSpinOnDgDefaultInit = function () {
    //Do not enable Quick spin by default if it's disabled by Operator
    //Returned so that quick spin is not enable even if using localstorage from previous game.
    //German Regulations
    if (commonConfig.disableQuickSpin) {
        pixiLib.setInteraction(this.quickSpinOff, false, "0x888888");
    }
    this.quickSpinOff.visible = false;
    this.quickSpinOn.visible = true;
    _ng.isQuickSpinActive = true;
};


sView.onQuickSpinOn = function () {
    //Do not enable Quick spin by default if it's disabled by Operator
    //Returned so that quick spin is not enable even if using localstorage from previous game.
    //German Regulations
    if (commonConfig.disableQuickSpin) {
        pixiLib.setInteraction(this.quickSpinOff, false, "0x888888");
    }
    _sndLib.play(_sndLib.sprite.sQuickSpinBtnClick);
    this.quickSpinOff.visible = true;
    this.quickSpinOn.visible = false;
    _ng.isQuickSpinActive = false;
};
sView.onQuickSpinOff = function () {
    //Do not enable Quick spin by default if it's disabled by Operator
    //Returned so that quick spin is not enable even if using localstorage from previous game.
    //German Regulations
    if (commonConfig.disableQuickSpin) {
        pixiLib.setInteraction(this.quickSpinOff, false, "0x888888");
    }
    _sndLib.play(_sndLib.sprite.sQuickSpinBtnClick);
    this.quickSpinOff.visible = false;
    this.quickSpinOn.visible = true;
    _ng.isQuickSpinActive = true;
};
/*---------   Skip BigWin Animation ---------  */
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
/*---------   Skip BigWin Animation ---------  */

// sView.onShowInCoinsOn = function () {
//     this.showInCoinsOff.visible = true;
//     this.showInCoinsOn.visible = false;
// };

// sView.onShowInCoinsOff = function () {
//     this.showInCoinsOff.visible = false;
//     this.showInCoinsOn.visible = true;
// };


sView.onSoundOnHandler = function () {
    this.soundOnButton.visible = false;
    this.soundOffButton.visible = true;

    _sndLib.setPreviousVolume(_sndLib.curVolume);
    _mediator.publish("setVolume", 0);
    _sndLib.mute(true);

};
sView.onSoundOffHandler = function () {
    _mediator.publish("setVolume", (_sndLib.previousVolume) ? _sndLib.previousVolume : _sndLib.defaultVolume);
    _sndLib.setPreviousVolume(undefined);
    _sndLib.mute(false);

    this.soundOnButton.visible = true;
    this.soundOffButton.visible = false;
};

sView.onCloseOptionsClick = function () {
    _sndLib.play(_sndLib.sprite.menuBtnCloseClick);
    this.closeMenu();
};

sView.onSettingsClick = function () {
    this.closeMenu();
    // _mediator.publish("SHOW_SETTINGS");
    this.showSettingsContainer(true);
    _sndLib.play(_sndLib.sprite.settingsBtnClick);
};
sView.onGameRulesClick = function () {
    this.closeMenu();
    onGameRulesToggle(true);
    // _sndLib.play(_sndLib.sprite.gRulesBtnClick);
};

sView.closeSettingsPanel = function () {
    _mediator.publish("HIDE_SETTINGS");
    this.showSettingsContainer(false);
}

sView.onSettingsCloseClick = function () {
    _mediator.publish("HIDE_SETTINGS");
    this.showSettingsContainer(false);
    _sndLib.play(_sndLib.sprite.settingsBtnClick);
};

sView.onFullscreenClick = function () {
    this.closeMenu();
    pixiLib.toggleFulScreen(true);
};

sView.onPaytableClick = function () {
    this.closeMenu();
    _sndLib.play(_sndLib.sprite.paytableBtnClick);
    // if(_ng.GameConfig.paytableType == "HTML"){
    //     onGamePaytableToggle(true);
    // }else{
    _mediator.publish("SHOW_PAYTABLE");
    // }
};

sView.showSettingsContainer = function (bool) {
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
}

sView.onInfoClick = function () {
    // _mediator.publish("onShowPaytable");
};

sView.onMenuClick = function (bool) {

    _mediator.publish("clearAllWins");

    if (this.isAnimationRunning) {
        return;
    }
    this.isAnimationRunning = true;

    if (!this.isMenuOpened) {
        this.openMenu();
        coreApp.gameView.clockView.hide()
        _sndLib.play(_sndLib.sprite.menuBtnClick);
    } else {
        coreApp.gameView.clockView.show();
        _sndLib.play(_sndLib.sprite.menuBtnCloseClick);
        this.closeMenu();
    }
};

sView.openMenu = function () {
    /*var gW = _viewInfoUtil.viewType=== "VL" ? 1280 : 720;
   this.optionsContainer.x = _viewInfoUtil.getWindowWidth();*/
    //this.onResize();



    if (_sndLib.curVolume === 0) {
        this.soundOnButton.visible = false;
        this.soundOffButton.visible = true;
    } else {
        this.soundOnButton.visible = true;
        this.soundOffButton.visible = false;
    }
    this.optionsContainer.visible = true;

    TweenMax.to(this.optionsContainer, 0.6, {
        alpha: 1, /*x: this.optionsContainer.x - this.optionsSlideX,*/ onComplete: function () {
            this.isAnimationRunning = false;

            _mediator.publish(_events.core.onResize);
        }.bind(this)
    });
    this.isMenuOpened = true;

    /*pixiLib.setInteraction(this.menuButton, false);
    this.isMenuOpened = true;
    this.optionBGCover.visible = true;
    this.optionContainer.visible = true;
    // this.optionBGCover.x = this.optionBGCover.x + this.optionBGCover.width;
    // this.op
    // this.optionBGCover.x = _viewInfoUtil.getWindowWidth();
    TweenMax.to(this.optionBGCover, 0.5, {
        x: this.optionBGCover.x - this.optionBGCover.width,
        onComplete: function(){
            pixiLib.setInteraction(this.menuButton, true);
            this.isAnimationRunning = false;
        }.bind(this)
    })
    TweenMax.to(this.optionContainer, 0.5, {
        x: this.optionContainer.x - this.optionBGCover.width
    })*/
};

sView.closeMenu = function () {

    this.isMenuOpened = false;
    coreApp.gameView.clockView.show();
    TweenMax.to(this.optionsContainer, 0.6, {
        alpha: 0, /*x: this.optionsContainer.x + this.optionsSlideX,*/ onComplete: function () {
            this.optionsContainer.visible = false;
            this.isAnimationRunning = false;
        }.bind(this)
    });


    /* pixiLib.setInteraction(this.menuButton, false);
     this.isMenuOpened = false;
     TweenMax.to(this.optionBGCover, 0.5, {
         x: this.optionBGCover.x + this.optionBGCover.width,
         onComplete: function(){
             this.optionBGCover.visible = false;
             this.optionContainer.visible = false;
             pixiLib.setInteraction(this.menuButton, true);
             this.isAnimationRunning = false;
         }.bind(this)
     })
     TweenMax.to(this.optionContainer, 0.5, {
         x: this.optionContainer.x + this.optionBGCover.width
     })*/
};

sView.onSoundEffectOff = function () {
    // _sndLib.play(_sndLib.sprite.sSoundSelBtnClick);
    this.soundEffectOn.visible = true;
    this.soundEffectOff.visible = false;
    _ng.isSoundEffectsActive = true;
};

sView.onSoundEffectOn = function () {
    _sndLib.play(_sndLib.sprite.sSoundSelBtnClick);
    this.soundEffectOn.visible = false;
    this.soundEffectOff.visible = true;
    _ng.isSoundEffectsActive = false;
};

sView.onResize = function () {
    this.bg.width = _viewInfoUtil.getWindowWidth();
    this.bg.height = _viewInfoUtil.getWindowHeight();
    this.optionBg.scale.x = 1;
    this.optionBg.x = _viewInfoUtil.getWindowWidth() - this.optionBg.width;
    this.optionBg.height = _viewInfoUtil.getWindowHeight();
    this.optionBg.scale.x = ((_viewInfoUtil.getWindowWidth() / 1280) * 100) / 100;
    this.optionBg.x = _viewInfoUtil.getWindowWidth() - this.optionBg.width;
    this.optionBg.height = _viewInfoUtil.getWindowHeight();
    this.optionButtonContainer.scale.y = this.optionButtonContainer.scale.x = ((_viewInfoUtil.getWindowWidth() / 1280) * 100) / 100;
    this.optionButtonContainer.x = this.optionBg.x + (20 * this.optionButtonContainer.scale.y);
    this.optionButtonContainer.y = _viewInfoUtil.getWindowHeight() - (this.optionButtonContainer.height + (300 * this.optionButtonContainer.scale.y));
    if (_viewInfoUtil.viewType == "VP") {
        this.optionBg.scale.x = ((_viewInfoUtil.getWindowWidth() / 720) * 100) / 100;
        this.optionBg.x = _viewInfoUtil.getWindowWidth() - this.optionBg.width;
        this.optionBg.height = _viewInfoUtil.getWindowHeight();
        this.optionButtonContainer.scale.y = this.optionButtonContainer.scale.x = ((_viewInfoUtil.getWindowWidth() / 720) * 100) / 100;
        this.optionButtonContainer.x = this.optionBg.x + (20 * this.optionButtonContainer.scale.y);
        this.optionButtonContainer.y = _viewInfoUtil.getWindowHeight() - (this.optionButtonContainer.height + (300 * this.optionButtonContainer.scale.y));
    }

    pixiLib.setProperties(this.audioMContainer, this.audioMContainer.props[_viewInfoUtil.viewType]);
    pixiLib.setProperties(this.autoPlayMContainer, this.autoPlayMContainer.props[_viewInfoUtil.viewType]);
    pixiLib.setProperties(this.autoMPlay, this.autoMPlay.props[_viewInfoUtil.viewType]);

    if (this.autoPlayButton) {
        pixiLib.setProperties(this.autoPlayButton, this.autoPlayButton.props[_viewInfoUtil.viewType]);
    }
    if (this.historyButton) {
        pixiLib.setProperties(this.historyButton, this.historyButton.props[_viewInfoUtil.viewType]);
    }

    if (this.optionsTabBase) {
        this.settingsMContainer.width = _viewInfoUtil.getWindowWidth() - 10;
        this.settingsMContainer.scale.y = this.settingsMContainer.scale.x;

        if (this.settingsMContainer.height > _viewInfoUtil.getWindowHeight()) {
            this.settingsMContainer.height = _viewInfoUtil.getWindowHeight() - 40;
            this.settingsMContainer.scale.x = this.settingsMContainer.scale.y;
        }
        if (this.settingsMContainer.scale.y > 1) {
            this.settingsMContainer.scale.set(1);
        }

        if (_viewInfoUtil.viewType == "VP") {
            this.settingsMContainer.x = (_viewInfoUtil.getWindowWidth() - this.settingsMContainer.width) / 2;
            this.settingsMContainer.y = (_viewInfoUtil.getWindowHeight() - this.settingsMContainer.height) / 2;
        } else {
            this.settingsMContainer.x = (_viewInfoUtil.getWindowWidth() - this.settingsMContainer.width) / 2;
            this.settingsMContainer.y = (_viewInfoUtil.getWindowHeight() - this.settingsMContainer.height) / 2;
        }

        this.settingsBg.visible = this.settingsMContainer.visible;
        this.settingsBg.width = _viewInfoUtil.getWindowWidth();
        this.settingsBg.height = _viewInfoUtil.getWindowHeight();

    }
    if (this.operatorText) {
        if (_viewInfoUtil.viewType === "VP") {
            this.operatorText.visible = false;
        } else {
            this.operatorText.visible = true;
            this.operatorText.x = 0;
            this.operatorText.y = 340;
        }
    }
}








