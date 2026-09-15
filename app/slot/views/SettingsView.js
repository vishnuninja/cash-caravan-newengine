function SettingsView(argument) {
    ViewContainer.call(this, arguments);
    this.elementsForResize = [];
    this.elementsForSetSize = [];
    this.winLimitMultiplier = 1;
    this.lossLimitMultiplier = 1;
}

SettingsView.prototype = Object.create(ViewContainer.prototype);
SettingsView.prototype.constructor = SettingsView;

var sView = SettingsView.prototype;
sView.setVariables = function (slotView, coreApp) {
}
sView.createView = function () {
    this.autoSpinSelNum = 10;
    this.createSettingsPanel();
    this.createMenu();
    this.addSettingsEvents();

    this.createVolumebar();
    this.createAutoSpinSliders();
    this.updateGameNameInTitle();
    this.setOperatorText();
    
};
sView.updateGameNameInTitle = function () {
    if (commonConfig.addGameNameInSettingsPage) {
        let tmString = (_ng.GameConfig.removeTMFromGame || commonConfig.removeTMFromGame) ? " " : "<tmStyle>TM</tmStyle> ";
        if (this.settingsTitle) {
            pixiLib.setText(this.settingsTitle, _ng.GameConfig.displayName.toUpperCase() + tmString + pixiLib.getLiteralText(this.settingsTitle.text));
        }
        if (this.gameSettingsTitle) {
            pixiLib.setText(this.gameSettingsTitle, _ng.GameConfig.displayName.toUpperCase() + tmString + pixiLib.getLiteralText(this.gameSettingsTitle.text));
        }
    }
}
sView.createAutoSpinSliders = function () {
    //Win Limit Sliders this.winLimitBar
    if (_viewInfoUtil.device === "Mobile") {
        this.autoPlayContainer = this.autoPlayMContainer;
        this.autoPlay = this.autoMPlay;
    }
    var asWinConfig = commonConfig.autoPlayWinLimitConfig[_viewInfoUtil.device];

    if (_ng.GameConfig.autoPlayWinLimitConfig) {
        asWinConfig = _ng.GameConfig.autoPlayWinLimitConfig[_viewInfoUtil.device];
    }
    this.getLayout(asWinConfig, this.autoPlayContainer);

    var minLimit = commonConfig.winLimit.min;
    var maxLimit = commonConfig.winLimit.max;
    var selectedValue = commonConfig.winLimit.selected;

    var winLimitOptions = [];
    for (var i = minLimit; i <= maxLimit; i++) {
        winLimitOptions.push(i);
    }

    this.winLimitBar.setValueArray(winLimitOptions, winLimitOptions.indexOf(selectedValue) + 1);
    this.winLimitBar.createView();

    //Loss Limit Sliders this.lossLimitBar
    var asLossConfig = commonConfig.autoPlayLossLimitConfig[_viewInfoUtil.device];
    if (_ng.GameConfig.autoPlayLossLimitConfig) {
        asLossConfig = _ng.GameConfig.autoPlayLossLimitConfig[_viewInfoUtil.device];
    }
    this.getLayout(asLossConfig, this.autoPlayContainer);

    var minLimit = commonConfig.lossLimit.min;
    var maxLimit = commonConfig.lossLimit.max;
    var selectedValue = commonConfig.lossLimit.selected;
    var lossLimitOptions = [];
    for (var i = minLimit; i <= maxLimit; i++) {
        lossLimitOptions.push(i);
    }

    this.lossLimitBar.setValueArray(lossLimitOptions, lossLimitOptions.indexOf(selectedValue) + 1);
    this.lossLimitBar.createView();

    this.winLimitBar.addTint(0x999999);
    this.lossLimitBar.addTint(0x999999);
    this.winLimitBar.disableSlider();
    this.lossLimitBar.disableSlider();

    pixiLib.setProperties(this.winLimitBar, this.winLimitBar.props);
    pixiLib.setProperties(this.lossLimitBar, this.lossLimitBar.props);
}

sView.updateGameSettingConfig = function () {

}
sView.createSettingsPanel = function () {
    this.settingsConfig = commonConfig.settingsConfig[_viewInfoUtil.device];
    if (_ng.GameConfig.settingsConfig) {
        this.settingsConfig = _ng.GameConfig.settingsConfig[_viewInfoUtil.device];
    }
    this.updateGameSettingConfig();
    for (var i in this.settingsConfig) {
        this[i] = this.getElementByType(this.settingsConfig[i]);
        this[i].name = i;
        if (this.settingsConfig[i].parentRef) {
            this[this.settingsConfig[i].parentRef].addChild(this[i]);
        } else {
            this.addChild(this[i]);
        }
        if (this.settingsConfig[i].makeResponsive) {
            _ngFluid.call(this[i], this.settingsConfig[i].props);
        } else {
            pixiLib.setProperties(this[i], this.settingsConfig[i].props[_viewInfoUtil.viewType]);
        }

        this[i].props = this.settingsConfig[i].props;
        this[i].makeResponsive = this.settingsConfig[i].makeResponsive ? this.settingsConfig[i].makeResponsive : false;
        if (this.settingsConfig[i].subscribeToResize) {
            this.elementsForResize.push(this[i]);
        }

        for (var j in this.settingsConfig[i].children) {
            this[j] = this.getElementByType(this.settingsConfig[i].children[j]);
            this[j].name = j;
            this[i].addChild(this[j]);
            if (this.settingsConfig[i].children[j].makeResponsive) {
                _ngFluid.call(this[j], this.settingsConfig[i].children[j].props);
            } else {
                pixiLib.setProperties(this[j], this.settingsConfig[i].children[j].props[_viewInfoUtil.viewType]);
            }

            this[j].props = this.settingsConfig[i].children[j].props;
            this[j].makeResponsive = this.settingsConfig[i].children[j].makeResponsive ? this.settingsConfig[i].children[j].makeResponsive : false;
            if (this.settingsConfig[i].children[j].subscribeToResize) {
                this.elementsForResize.push(this[j]);
            }
            if (this.settingsConfig[i].children[j].children) {
                this.createChildren(this.settingsConfig[i].children[j].children, this[j]);
            }
        }
    }
}
sView.createMenu = function () {
    this.menuConfig = _ng.GameConfig.menuConfig[_viewInfoUtil.device];
    if (_ng.GameConfig.menuConfigOffset && _ng.GameConfig.menuConfigOffset[_viewInfoUtil.device]) {
        var config = _ng.GameConfig.menuConfigOffset[_viewInfoUtil.device];
        if (_viewInfoUtil.device === "Desktop") {
            if (config.menuCloseBtn) {
                this.menuConfig.menuCloseBtn = config.menuCloseBtn;
            }
            if (config.menuOpenBtn) {
                this.menuConfig.menuOpenBtn = config.menuOpenBtn;
            }
            if (config.providerLogo) {
                this.menuConfig.providerLogo = config.providerLogo;
            }
            if (config.homeButton) {
                this.menuConfig.homeButton = config.homeButton;
            }
            if (config.volumeOnBtn) {
                this.menuConfig.volumeOnBtn = config.volumeOnBtn;
            }
            if (config.volumeOffBtn) {
                this.menuConfig.volumeOffBtn = config.volumeOffBtn;
            }
        } else {
            if (config.menuButton) {
                this.menuConfig.menuButton = config.menuButton;
            }
            if (config.homeButton) {
                this.menuConfig.homeButton = config.homeButton;
            }
        }
    }

    // this.updateGameSettingConfig();
    for (var i in this.menuConfig) {
        this[i] = this.getElementByType(this.menuConfig[i]);
        this[i].name = i;
        if (this.menuConfig[i].parentRef) {
            this[this.menuConfig[i].parentRef].addChild(this[i]);
        } else {
            this.addChild(this[i]);
        }
        if (this.menuConfig[i].makeResponsive) {
            _ngFluid.call(this[i], this.menuConfig[i].props);
        } else {
            pixiLib.setProperties(this[i], this.menuConfig[i].props[_viewInfoUtil.viewType]);
        }

        this[i].props = this.menuConfig[i].props;
        this[i].makeResponsive = this.menuConfig[i].makeResponsive ? this.menuConfig[i].makeResponsive : false;
        if (this.menuConfig[i].subscribeToResize) {
            this.elementsForResize.push(this[i]);
        }

        for (var j in this.menuConfig[i].children) {
            this[j] = this.getElementByType(this.menuConfig[i].children[j]);
            this[j].name = j;
            this[i].addChild(this[j]);
            if (this.menuConfig[i].children[j].makeResponsive) {
                _ngFluid.call(this[j], this.menuConfig[i].children[j].props);
            } else {
                pixiLib.setProperties(this[j], this.menuConfig[i].children[j].props[_viewInfoUtil.viewType]);
            }

            this[j].props = this.menuConfig[i].children[j].props;
            this[j].makeResponsive = this.menuConfig[i].children[j].makeResponsive ? this.menuConfig[i].children[j].makeResponsive : false;
            if (this.menuConfig[i].children[j].subscribeToResize) {
                this.elementsForResize.push(this[j]);
            }
            if (this.menuConfig[i].children[j].children) {
                this.createChildren(this.menuConfig[i].children[j].children, this[j]);
            }
        }
    }
}
sView.addSettingsEvents = function () {
    // this.infoButton.on("click", this.onInfoButtonClick.bind(this));
    _mediator.subscribe("settingVolumeChange", this.onSettingVolumeChange);
    _mediator.subscribe("lossLimitChange", this.onLossLimitChange.bind(this));
    _mediator.subscribe("winLimitChange", this.onWinLimitChange.bind(this));
}

sView.setOperatorText = function () {
    if (coreApp.lang !== 'de') {
        return;
    }
    var textStyle = {
        fontFamily: "Baloo-Regular",
        // fontFamily: "ProximaNova",
        fontSize: 20,
        fill: 0xffffff,
        padding: 10
    }
    this.operatorText = pixiLib.getElement("Text", textStyle);
    this.operatorText.name = "operatorText";
    pixiLib.setText(this.operatorText, pixiLib.getLiteralText("As per German regulations, quick spin and auto-spin features have been disabled"));
    if (_viewInfoUtil.device === 'Mobile') {
        var container = "settingsMContainer";
    } else {
        var container = "settingsContainer";
    }
    this[container].addChild(this.operatorText);
    pixiLib.setProperties(this.operatorText, { x: 640, y: 689, anchor: { x: 0.5, y: 0.5 } });
}

sView.onLossLimitChange = function (value) {
    this.lossLimitMultiplier = value.value;
    var totalBet = (coreApp.gameModel.getTotalBet());
    this.lossLimit = totalBet * this.lossLimitMultiplier;
    pixiLib.setText(this["inputLossLimitText"], pixiLib.getFormattedAmount(this.lossLimit));
    //pixiLib.setText(this["inputLossLimitText"], pixiLib.getCurrency() + this.lossLimit.toFixed(2));
    if (value.isActive) {
        _mediator.publish("AS_StopOnLossLimit", true, this.lossLimit);
    }
}
sView.onWinLimitChange = function (value) {
    this.winLimitMultiplier = value.value;
    var totalBet = (coreApp.gameModel.getTotalBet());
    this.winLimit = totalBet * this.winLimitMultiplier;
    pixiLib.setText(this["inputWinLimitText"], pixiLib.getFormattedAmount(this.winLimit));
    //pixiLib.setText(this["inputWinLimitText"], pixiLib.getCurrency() + this.winLimit.toFixed(2));
    if (value.isActive) {
        _mediator.publish("AS_StopOnWinLimit", true, this.winLimit);
    }
}

sView.createVolumebar = function () {
    if (_viewInfoUtil.device === "Mobile") {
        this.audioContainer = this.audioMContainer
    }
    var vConfig = commonConfig.volumeBarConfig[_viewInfoUtil.device];
    if (_ng.GameConfig.volumeBarConfig) {
        vConfig = _ng.GameConfig.volumeBarConfig[_viewInfoUtil.device];
    }
        // if (_viewInfoUtil.device === "Desktop") {
    this.getLayout(vConfig, this.audioContainer);
    // } else {
    // this.getLayout(commonConfig.volumeBarConfig[_viewInfoUtil.device], this.audioMContainer);
    // }
}
sView.createChildren = function (childrenObj, parent) {
    for (var j in childrenObj) {
        this[j] = this.getElementByType(childrenObj[j]);
        this[j].name = j;
        parent.addChild(this[j]);
        if (childrenObj[j].makeResponsive) {
            _ngFluid.call(this[j], childrenObj[j].props);
        } else {
            pixiLib.setProperties(this[j], childrenObj[j].props[_viewInfoUtil.viewType]);
        }

        this[j].props = childrenObj[j].props;
        this[j].makeResponsive = childrenObj[j].makeResponsive ? childrenObj[j].makeResponsive : false;
        if (childrenObj[j].subscribeToResize) {
            this.elementsForResize.push(this[j]);
        }
    }
};


sView.volumeChange = function (vol) {
    this.volumeBar.setValue(vol);
}
sView.onSettingVolumeChange = function (vol) {
    // console.log(Number(vol.value));//test added 
    _sndLib.setVolume(Number(vol.value));
}

sView.onInfoButtonClick = function () {
    _mediator.publish("onShowPaytable");
}

sView.getLayout = function (config, parent) {
    for (var element in config) {
        var elemConfig = config[element];
        // elemConfig.params = elemConfig.config;
        var e = null;
        if (elemConfig.elementConstructor == "parent") {
            e = pixiLib.getContainer();
            this.getLayout(elemConfig.params.children, e);
        } else if (elemConfig.elementConstructor == "sprite") {
            e = pixiLib.getSprite(elemConfig.params.backgroundImage);
        } else if (elemConfig.elementConstructor == "text") {
            var text = elemConfig.params.text || "";
            var textStyle = elemConfig.params.textStyle || {};
            if (typeof textStyle == "string") {
                textStyle = this.textConfig[textStyle];
            }
            e = pixiLib.getElement("Text", textStyle, text);
        } else if (elemConfig.elementConstructor == "GraphicsRect") {
            e = pixiLib.getGraphicsRect(elemConfig.params);
        } else if (elemConfig.elementConstructor == "button") {
            e = pixiLib.getButton(elemConfig.params.backgroundImage, elemConfig.params.options);
            if (elemConfig.isDisableByDefault) {
                pixiLib.setInteraction(e, false);
            }
        } else if (elemConfig.elementConstructor == "spriteBtn") {
            e = pixiLib.getButton(elemConfig.params.backgroundImage, { type: "spriteBtn" });
            if (elemConfig.isDisableByDefault) {
                pixiLib.setInteraction(e, false);
            }
        } else {
            if (elemConfig.elementConstructor == "PanelValueField" ||
                elemConfig.elementConstructor == "PanelBGStrip") {
                e = new _ng[elemConfig.elementConstructor](elemConfig, parent);
            } else if (_ng[elemConfig.elementConstructor]) {
                e = new _ng[elemConfig.elementConstructor](elemConfig.params, parent);
            } else {
                e = new window[elemConfig.elementConstructor](elemConfig.params, parent);
            }
            e = e.container || e;
        }
        e.name = element;
        e.props = elemConfig.params.props;
        if (!elemConfig.params.noResize) {
            if (elemConfig.params.makeResponsive) {
                e.makeResponsive = true;
                _ngFluid.call(e, elemConfig.params.props);
            } else if (elemConfig.params.subscribeToResize) {
                pixiLib.setProperties(e, elemConfig.params.props[_viewInfoUtil.viewType])
            } else {
                pixiLib.setProperties(e, elemConfig.params.props)
            }
        }
        if (elemConfig.params.subscribeToResize) {
            this.elementsForResize.push(element);
        }
        parent.addChild(e);
        this[element] = e;
    }
}
sView.initializePanel = function () { }
sView.onAmbienceSoundClick = function (bool) { }
sView.onSoundEffectClick = function (bool) { }
sView.addEvents = function () {
    pixiLib.setInteraction(this.onAnyWinOff, true);
    pixiLib.setInteraction(this.onAnyWinOn, true);

    pixiLib.setInteraction(this.autoSpinWinLimitOff, true);
    pixiLib.setInteraction(this.autoSpinWinLimitOn, true);

    pixiLib.setInteraction(this.autoSpinLossLimitOff, true);
    pixiLib.setInteraction(this.autoSpinLossLimitOn, true);

    pixiLib.addEvent(this.onAnyWinOff, this.onAnyWinStop.bind(this, true));
    pixiLib.addEvent(this.onAnyWinOn, this.onAnyWinStop.bind(this, false));

    pixiLib.addEvent(this.autoSpinWinLimitOff, this.onAutoSpinWinLimitClick.bind(this, true));
    pixiLib.addEvent(this.autoSpinWinLimitOn, this.onAutoSpinWinLimitClick.bind(this, false));

    pixiLib.addEvent(this.autoSpinLossLimitOff, this.onAutoSpinLossLimitClick.bind(this, true));
    pixiLib.addEvent(this.autoSpinLossLimitOn, this.onAutoSpinLossLimitClick.bind(this, false));

    pixiLib.setInteraction(this.autoPlayButton, true);
    pixiLib.addEvent(this.autoPlayButton, this.onAutoPlayButton.bind(this, false));

    for (let i = 1; i < 6; i++) {
        pixiLib.setInteraction(this["autoPlayNumBg" + i], true);
        pixiLib.addEvent(this["autoPlayNumBg" + i], this.onAutoPlayNumClick.bind(this, i));
        pixiLib.setText(this["autoPlayNumTxt" + i], commonConfig.autoSpinNums[i - 1]);
    }

    this.textStyle = {
        "fontFamily": "ProximaNova",
        "fontSize": 20,
        "fill": 0xFFFFFF
    };

    //game history link 
    if (this.historyButton) {
        if (commonConfig.hideHistoryButtonForDemo && coreApp.isDemoMode) {
            this.historyButton.visible = false;
            this.historyButton.alpha = 0;
        }
        pixiLib.setInteraction(this.historyButton, true);
        pixiLib.addEvent(this.historyButton, this.onGameLogsClick.bind(this));
    }

    if (this.optionsTabBase) {
        pixiLib.setInteraction(this.optionsTabBase, true);
        pixiLib.addEvent(this.optionsTabBase, this.onOptionsTabClick.bind(this));
        pixiLib.setInteraction(this.autoSpinSettingsTabBase, true);
        pixiLib.addEvent(this.autoSpinSettingsTabBase, this.onAutoSpinTabClick.bind(this));


        this.audioContainer.visible = true;
        this.autoPlayContainer.visible = false;
        this.autoPlay.visible = false;

        for (var i = 1; i <= 5; i++) {
            this["autoPlayNumBg" + i].alpha = 0.01;
            this["autoPlayNumTxt" + i].style.fill = "0xffffff";
        }


        this["autoPlayNumBg" + 1].alpha = 1;
        this["autoPlayNumTxt" + 1].style.fill = "0x000000";



    } else {
        this["autoPlayNumTxt" + 1].style.fill = "0xffeb3b";
        this["autoPlayNumTxt" + 1].scale.x = 1;
        this["autoPlayNumTxt" + 1].scale.y = 1;
        this["autoPlayNumBg" + 1].scale.x = 1;
        this["autoPlayNumBg" + 1].scale.y = 1;
    }

    this.autoSpinSelNum = Number(this["autoPlayNumTxt" + 1].text);
    this.onASLossLimitToggle(false);
    this.onASWinLimitToggle(false);
    this.onAutoPlayEnable(false);

    if (commonConfig.disableAutoplay) {
        pixiLib.setInteraction(this.onAnyWinText, false, "0x888888");
        pixiLib.setInteraction(this.onAnyWinOff, false, "0x888888");
        pixiLib.setInteraction(this.autoSpinWinLimitText, false, "0x888888");
        pixiLib.setInteraction(this.autoSpinWinLimitOff, false, "0x888888");
        pixiLib.setInteraction(this.autoSpinLossLimitText, false, "0x888888");
        pixiLib.setInteraction(this.autoSpinLossLimitOff, false, "0x888888");
        pixiLib.setInteraction(this.autoPlayTitle, false, "0x888888");
        pixiLib.setInteraction(this.autoPlayButton, false, "0x888888");
        pixiLib.setInteraction(this.inputWinLimitBg, false, "0x888888");
        pixiLib.setInteraction(this.inputLossLimitBg, false, "0x888888");

        for (let i = 1; i < 6; i++) {
            pixiLib.setInteraction(this["autoPlayNumBg" + i], false, "0x888888");
            pixiLib.setInteraction(this["autoPlayNumTxt" + i], false, "0x888888");
        }

        this["autoPlayNumTxt" + 1].style.fill = "0xFFFFFF";
        this["autoPlayNumTxt" + 1].scale.x = 1;
        this["autoPlayNumTxt" + 1].scale.y = 1;

        this["autoPlayNumBg" + 1].scale.x = 1;
        this["autoPlayNumBg" + 1].scale.y = 1;
    }

    this.onAutoPlayNumTxtClick(1);
};
sView.onOptionsTabClick = function () {
    _sndLib.play(_sndLib.sprite.btnClick);
    this.audioContainer.visible = true;
    this.autoPlayContainer.visible = false;
    this.autoPlay.visible = false;
    this.optionsTabBase.alpha = 0.0;
    this.autoSpinSettingsTabBase.alpha = 0.1;
}
sView.onAutoSpinTabClick = function () {
    _sndLib.play(_sndLib.sprite.btnClick);
    this.audioContainer.visible = false;
    this.autoPlayContainer.visible = true;
    this.autoPlay.visible = true;
    this.optionsTabBase.alpha = 0.1;
    this.autoSpinSettingsTabBase.alpha = 0.0;
}
sView.onGameLogsClick = function () {
    _sndLib.play(_sndLib.sprite.btnClick);
    var path = commonConfig.logsPath + "/session/" + sessionStorage.rgsUserID + "?game=sugarbox5000gold";
    // if (env !== "") path += "&env=" + env;
    window.open(path, '_blank');
}

sView.onAutoPlayEnable = function (val) {

    if (commonConfig.ukgc == "false") {
        val = true;
    }
    pixiLib.setInteraction(this.autoPlayButton, val);
    this.autoPlayButton.alpha = val ? 1 : 0.5;
}


sView.onAutoPlayNumTxtClick = function (index) {
    //@this is only for DG //test
    if (this.autospinSelectionBase) {
        for (var i = 1; i <= 5; i++) {
            this["autoPlayNumBg" + i].alpha = 0.01;
            this["autoPlayNumTxt" + i].style.fill = "0xffffff";
        }
        this["autoPlayNumBg" + index].alpha = 1;
        this["autoPlayNumTxt" + index].style.fill = "0x000000";
        return;
    }

    for (let i = 1; i < 6; i++) {
        this["autoPlayNumTxt" + i].style.fill = "0xFFFFFF";
        this["autoPlayNumTxt" + i].scale.x = 1;
        this["autoPlayNumTxt" + i].scale.y = 1;

        this["autoPlayNumBg" + i].scale.x = 1;
        this["autoPlayNumBg" + i].scale.y = 1;
        this["autoPlayNumBg" + i].alpha = 1;
        this["autoPlayNumTxt" + i].alpha = 1;
    }
    this["autoPlayNumTxt" + index].style.fill = "0xffeb3b";
    this["autoPlayNumBg" + index].scale.x = 1;
    this["autoPlayNumBg" + index].scale.y = 1;
    this["autoPlayNumTxt" + index].scale.x = 1;
    this["autoPlayNumTxt" + index].scale.y = 1;
}
sView.onAutoPlayNumClick = function (index) {
    _sndLib.play(_sndLib.sprite.sAnyWinBtnClick);
    this.onAutoPlayNumTxtClick(index);
    this.autoSpinSelNum = Number(this["autoPlayNumTxt" + index].text);
}
sView.onAnyWinStop = function (bool) {
    this.onAnyWinOff.visible = !bool;
    this.onAnyWinOn.visible = bool;
    _sndLib.play(_sndLib.sprite.sAnyWinBtnClick);
    _mediator.publish("AS_StopOnAnyWin", bool);

    if (this.autoSpinLossLimitOn.visible || this.autoSpinWinLimitOn.visible || this.onAnyWinOn.visible) {
        this.onAutoPlayEnable(true);
    } else {
        this.onAutoPlayEnable(false);
    }
};
sView.onASValuesReset = function (type) {

    // if (type == "loss") {
    //     var name = "valueLoss";
    //     var yPos = (_viewInfoUtil.device === "Desktop") ? 410 : 260;
    // } else {
    //     var name = "valueWin";
    //     var yPos = (_viewInfoUtil.device === "Desktop") ? 300 : 160;
    // }
    // for (var i = 1; i < 6; i++) {
    //     this[name + "Btn" + i].alpha = 0.7;
    //     this[name + "Btn" + i].scale.y = 1;
    //     this[name + "Btn" + i].y = yPos;
    //     this[name + "Text" + i].style.fontWeight = "normal";
    //     this[name + "Text" + i].style.fontSize = 45;
    // }
}

sView.onBtnSelectApplyStyle = function (btn, txt) {
    btn.alpha = 1;
    btn.scale.y = 1.4;
    btn.y = btn.y - 5;
    txt.style.fontWeight = "bold";
    txt.style.fontSize = 50;
}
sView.onAutoSpinLossLimitClick = function (bool) {
    _sndLib.play(_sndLib.sprite.sLossLimitBtnClick);
    this.onASLossLimitToggle(bool);
}
sView.onASLossLimitToggle = function (bool) {
    this.autoSpinLossLimitOff.visible = !bool;
    this.autoSpinLossLimitOn.visible = bool;
    if (bool) {
        this.lossLimitBar.addTint(0xFFFFFF);
        this.lossLimitBar.enableSlider();
    } else {
        this.lossLimitBar.addTint(0x999999);
        this.lossLimitBar.disableSlider();
    }
    if (this.autoSpinLossLimitOn.visible || this.autoSpinWinLimitOn.visible || this.onAnyWinOn.visible) {
        this.onAutoPlayEnable(true);
    } else {
        this.onAutoPlayEnable(false);
    }
    _mediator.publish("updateASLossLimit");

    if (this.autoSpinLossLimitOff.visible) {
        pixiLib.setText(this["inputLossLimitText"], "");
        _mediator.publish("AS_StopOnLossLimit", false, 1);
    } else {
        var obj = { value: this.lossLimitMultiplier ? this.lossLimitMultiplier : 1, isActive: true }
        this.onLossLimitChange(obj);
    }

};
sView.onAutoSpinWinLimitClick = function (bool) {
    _sndLib.play(_sndLib.sprite.sWinLimitBtnClick);
    this.onASWinLimitToggle(bool);
}
sView.onASWinLimitToggle = function (bool) {
    this.autoSpinWinLimitOff.visible = !bool;
    this.autoSpinWinLimitOn.visible = bool;
    this.onAutoPlayEnable();
    if (bool) {
        this.winLimitBar.addTint(0xFFFFFF);
        this.winLimitBar.enableSlider();
    }
    else {
        this.winLimitBar.addTint(0x999999);
        this.winLimitBar.disableSlider();
    }

    if (this.autoSpinLossLimitOn.visible || this.autoSpinWinLimitOn.visible || this.onAnyWinOn.visible) {
        this.onAutoPlayEnable(true);
    } else {
        this.onAutoPlayEnable(false);
    }
    _mediator.publish("updateASWinLimit");

    if (this.autoSpinWinLimitOff.visible) {
        pixiLib.setText(this["inputWinLimitText"], "");
        _mediator.publish("AS_StopOnWinLimit", false, 1);
    } else {
        var obj = { value: this.winLimitMultiplier ? this.winLimitMultiplier : 1, isActive: true }
        this.onWinLimitChange(obj);
    }

};

sView.onAutoPlayButton = function () {
    _sndLib.play(_sndLib.sprite.btnClick);
    _mediator.publish("updateAutoSpinBtnStates", this.autoSpinSelNum);
    _mediator.publish("closeSettingsPanel");
}
sView.onSettingsClose = function () { }
sView.openSettingsPanel = function () { }
sView.closeSettingsPanel = function () { }
sView.onResize = function () {
    var scaleX, scaleY;
    for (var i = 0; i < this.elementsForResize.length; i++) {
        if (this.elementsForResize[i] && this.elementsForResize[i].makeResponsive) {
            this.elementsForResize[i].setAlignment(this.elementsForResize[i].props);
            if (_viewInfoUtil.viewType === "VL" || _viewInfoUtil.viewType === "VD") {
                scaleX = this.elementsForResize[i].props.landScaleX || 1;
                scaleY = this.elementsForResize[i].props.landScaleY || 1;
            } else {
                scaleX = this.elementsForResize[i].props.portScaleX || 1;
                scaleY = this.elementsForResize[i].props.portScaleY || 1;
            }
            this.elementsForResize[i].setScale(scaleX, scaleY);
        } else {
            pixiLib.setProperties(this.elementsForResize[i], this.elementsForResize[i].props[_viewInfoUtil.viewType]);
        }
    }
    for (var i = 0; i < this.elementsForSetSize.length; i++) {
        this[this.elementsForSetSize[i]].setSize(this.elementsForSetSize[i].setSizeValues[_viewInfoUtil.viewType].w, this.elementsForSetSize[i].setSizeValues[_viewInfoUtil.viewType].h);
    }
};
sView.getElementByType = function (obj) {
    /*Sprite,  Text, Rectangle, Container, Button, AnimatedSprite*/
    if (obj.type === "Sprite") {
        return pixiLib.getElement("Sprite", obj.props.img);
    } else if (obj.type === "Container") {
        return pixiLib.getContainer();
    } else if (obj.type === "AnimatedSprite") {
        return pixiLib.getContainer();
    } else if (obj.type === "Button") {
        return pixiLib.getButton(obj.props.img, obj.props.options);
    } else if (obj.type === "Rectangle") {
        return pixiLib.getRectangleSprite(obj.props.layout.w, obj.props.layout.h, obj.props.layout.color);
    } else if (obj.type === "RoundRectangle") {
        return pixiLib.getRoundRect(obj.props.layout.w, obj.props.layout.h, obj.props.layout.color, obj.props.layout.r);
    } else if (obj.type === "Text") {
        var txt = pixiLib.getElement("Text", obj.props.textStyle, obj.props.text);
        // var txt =new PIXI.Text("Ameer", {"fontSize": "40","fontFamily": "Arial", "fill": "#ffFFFF"});
        // var txt = pixiLib.getElement("Text", {type:"BitmapFont", font:"40px test-export"}, "1000");
        return txt;
    } else if (obj.type === "MSText") {
        var textStyle = obj.props.textStyle;
        if (typeof obj.props.textStyle == "string" && _ng.PaytableViewUIConfig.textStyle) {
            textStyle = _ng.PaytableViewUIConfig.textStyle[textStyle];
        }
        var text = pixiLib.getElement("MSText", textStyle, obj.props.text);
        pixiLib.setText(text, obj.props.text);
        return text;
    }
}
sView.enableMenu = function (bool) {
    if (this.menuButton)
        pixiLib.setInteraction(this.menuButton, bool);
    if (this.menuOpenBtn)
        pixiLib.setInteraction(this.menuOpenBtn, bool);
}
