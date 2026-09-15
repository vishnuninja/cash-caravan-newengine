PanelMobileView = function () {
    PanelView.call(this);
};

PanelMobileView.prototype = Object.create(PanelView.prototype);
PanelMobileView.prototype.constructor = PanelMobileView;

var panel = PanelMobileView.prototype;
var corePanel = PanelView.prototype;

panel.createView = function () {
    corePanel.createView.call(this);
    if (this.asValueBg) {
        this.asValueBg.visible = false;
    }
    if (this.asValue) {
        this.asValue.visible = false;
    }

    // this.addChild(this.spinControls);
    if (this.bg) {
        this.spinControls.addChildAt(this.bg, 0);
    }
    this.hideMobilePanel();

    if (this.betPanelBG) {
        // pixiLib.setInteraction(this.betPanelBG, true);
        this.betPanelBG.interactive = true;
    }
    if (this.gambleBtn) {
        this.gambleBtn.visible = false;
        pixiLib.setInteraction(this.gambleBtn, true);
        pixiLib.addEvent(this.gambleBtn, this.onGambleClick.bind(this));
    }

    if (isGermanUI) {
        console.log(this.balanceField)
        _ngFluid.call(this.balanceField, this.pConfig.panelContainer.balanceField.params.props_german);
        _ngFluid.call(this.betField, this.pConfig.panelContainer.betField.params.props_german);
        _ngFluid.call(this.winField, this.pConfig.panelContainer.winField.params.props_german);
    }
};
panel.onGambleClick = function () {

    _mediator.publish("clearAllWins");

    _sndLib.play(_sndLib.sprite.gamble_button);
    console.log(" show gamble round=============== ");
    _mediator.publish("SHOW_GAMBLE");
    this.gambleBtn.visible = false;
}


panel.setVariables = function (slotView, coreApp) {
    this.slotView = slotView;
    this.coreApp = coreApp;
};
panel.updateHomeMenuParent = function () {
    var indexVariable = this.slotView.panelContainer.getChildIndex(this.betPanelMobileCover);
    this.slotView.panelContainer.addChildAt(this.slotView.settingsPanel.homeButton, indexVariable);
    this.slotView.panelContainer.addChildAt(this.slotView.settingsPanel.menuButton, indexVariable);
}
panel.onAutoSpinCountUpdate = function (count) {
    if (count == 0) {
        //hide autospin stop button
        this.autoSpinButton.visible = true;
        this.autoSpinStopButton.visible = false;
        this["asValueBg"].visible = false;
        this["asValue"].visible = false;

    }
    pixiLib.setText(this["asValue"], count);
}
panel.addMobileInteractions = function () {
    this.autoSpinStopButton.visible = false;
    this.betPanelMobileCover.interactive = true;
    this.betPanelMobileCover.buttonMode = false;

    pixiLib.addEvent(this.betButtonParent, this.showMobilePanel.bind(this));
    pixiLib.addEvent(this.betPanelClose, this.hideMobilePanel.bind(this));
    pixiLib.addEvent(this.autoSpinButton, this.showAutoSpinPanel.bind(this));
    pixiLib.addEvent(this.autoSpinStopButton, this.onAutoSpinStopClick.bind(this));
    pixiLib.addEvent(this.betPanelMobileCover, this.hideMobilePanel.bind(this));

    _mediator.subscribe("START_AUTOSPIN", this.onStartAutoSpin.bind(this));
};
panel.onStartAutoSpin = function (value) {
    pixiLib.setText(this["asValue"], value - 1);
    this["asValueBg"].visible = true;
    this["asValue"].visible = true;
    this.autoSpinButton.visible = false;
    this.autoSpinStopButton.visible = true;
};
panel.showAutoSpinPanel = function () {
    _sndLib.play(_sndLib.sprite.autoSpinBtnClick);
    // _mediator.publish("SHOW_SETTINGS");
    _mediator.publish("showMobileAutoSpinPanel");
    _mediator.publish("panelClick");
};
panel.onAutoSpinStopClick = function () {
    this.hideAutoSpinButton();
    _sndLib.play(_sndLib.sprite.autoSpinBtnClick)
    _mediator.publish("stopAutoSpin");
    _mediator.publish("panelClick");
};
panel.onCancelAutoSpin = function () {
    this.hideAutoSpinButton();
    _mediator.publish("stopAutoSpin");
    _mediator.publish("panelClick");
}
panel.hideAutoSpinButton = function () {
    this.autoSpinButton.visible = true;
    this.autoSpinStopButton.visible = false;
    this["asValueBg"].visible = false;
    this["asValue"].visible = false;
    this.addGameView();
}

panel.setUpCoinValue = function (selectedIndex, coinArray) {
    this.coinValueSlider.setValueArray(coinArray, selectedIndex);
    this.coinValueSlider.createView();
};

panel.setUpLineValue = function (selectedLines, totalLines) {
    if (!_ng.GameConfig.fixedPaylines) {
        var lineOptions = [];
        for (var i = 1; i <= totalLines; i++) {
            lineOptions[i - 1] = i;
        }
        this.lineValueSlider.setValueArray(lineOptions, selectedLines);
        this.lineValueSlider.createView();
    } else {

    }
};

panel.updateAutoSpinBtnStates = function (num) {
    _mediator.publish("START_AUTOSPIN", num);
    this.toggleAutoSpinOptions(false);
    this.autoSpinButton.visible = false;
    this.autoSpinStopButton.visible = true;
};
panel.onTotalBetUpdated = function (totalBet) {
    if (this.mobilePanelTotalBetValue) {
        pixiLib.setText(this.mobilePanelTotalBetValue, pixiLib.getFormattedAmount(totalBet));
    }
};
panel.onBetMaxClick = function () {
    if (this.coinValueSlider) {
        this.coinValueSlider.setMaxValue();
    }
    if (this.lineValueSlider && !_ng.GameConfig.fixedPaylines) {
        this.lineValueSlider.setMaxValue();
    }
    _sndLib.play(_sndLib.sprite.maxbetBtnClick);
    pixiLib.setInteraction(this.betMaxButton, false);
    _mediator.publish("coinValueUpdated", { index: this.coinValueSlider.getCurrentIndex() });
    _mediator.publish("lineValueUpdated", { index: this.lineValueSlider.getCurrentIndex() });
    _mediator.publish("totalBetUpdated");
    _mediator.publish("panelClick");
};
panel.checkMaxBetState = function () {
    if (this.betMaxButton) {
        var isMaxBet = true;
        if (this.coinValueSlider && (this.coinValueSlider.getCurrentIndex() == this.coinValueSlider.getMaxIndex())) {
            isMaxBet = false;
        }
        if (!isMaxBet && ((this.lineValueSlider && (this.lineValueSlider.getCurrentIndex() == this.lineValueSlider.getMaxIndex())) || (coreApp.gameModel.panelModel.paylinesType === "fixed"))) {
            isMaxBet = false;
        } else {
            isMaxBet = true;
        }
        pixiLib.setInteraction(this.betMaxButton, isMaxBet);
    }
};

panel.showMobilePanel = function () {
    // _mediator.publish("hideMenuBtnEvent");
    this.betPanelMobile.alpha = 0;
    this.betPanelMobile.visible = true;
    TweenMax.to(this.betPanelMobile, 0.2, { alpha: 1 });

    this.betPanelMobileCover.alpha = 0;
    this.betPanelMobileCover.visible = true;
    TweenMax.to(this.betPanelMobileCover, 0.2, { alpha: 0.8 });
    this.hideGambleButton();
    _mediator.publish("panelClick");
    _sndLib.play(_sndLib.sprite.maxbetBtnClick);
    this.onHideAutoSpin();
};

panel.hideMobilePanel = function () {
    TweenMax.to(this.betPanelMobileCover, 0.2, { alpha: 0, onComplete: function () { this.betPanelMobileCover.visible = false; }.bind(this) });
    TweenMax.to(this.betPanelMobile, 0.2, { alpha: 0, onComplete: function () { this.betPanelMobile.visible = false; }.bind(this) });
    _mediator.publish("showMenuBtnEvent");
    _sndLib.play(_sndLib.sprite.maxbetBtnClick);
};

panel.onResize = function () {
    corePanel.onResize.call(this);
    if (this.betPanelMobileCover) {
        this.betPanelMobileCover.width = _viewInfoUtil.getWindowWidth();
        this.betPanelMobileCover.height = _viewInfoUtil.getWindowHeight();
    }
    if (this.bottomBackground) {
        this.bottomBackground.scale.y = _viewInfoUtil.viewScale;
        var bottomGap = this.pConfig.panelContainer.bottomBackground.params.props[_viewInfoUtil.viewType].bottomGap ? this.pConfig.panelContainer.bottomBackground.params.props[_viewInfoUtil.viewType].bottomGap : 0;
        this.bottomBackground.y = _viewInfoUtil.getWindowHeight() + bottomGap;

        if (this.pConfig.panelContainer.bottomBackground.params.props[_viewInfoUtil.viewType].isStrech) {
            this.bottomBackground.width = _viewInfoUtil.getWindowWidth();
            this.bottomBackground.isStreched = true;
        } else if (this.pConfig.panelContainer.bottomBackground.params.props[_viewInfoUtil.viewType].isStrech == false) {
            this.bottomBackground.isStreched = false;
            this.bottomBackground.scale.x = _viewInfoUtil.viewScale;
            this.bottomBackground.scale.y = _viewInfoUtil.viewScale;

            this.bottomBackground.x = (_viewInfoUtil.getWindowWidth() - this.bottomBackground.width) * 0.5;
            var bottomGap = this.pConfig.panelContainer.bottomBackground.params.props[_viewInfoUtil.viewType].bottomGap;
            bottomGap = bottomGap ? bottomGap : 0;
            this.bottomBackground.y = _viewInfoUtil.getWindowHeight() - bottomGap;

        } else {

            if (this.bottomBackground.isStreched) {
                this.bottomBackground.scale.x = 1;
                this.bottomBackground.scale.y = _viewInfoUtil.viewScale;
            }
            this.bottomBackground.x = (_viewInfoUtil.getWindowWidth() - this.bottomBackground.width) * 0.5;
            var bottomGap = this.pConfig.panelContainer.bottomBackground.params.props[_viewInfoUtil.viewType].bottomGap;
            bottomGap = bottomGap ? bottomGap : 0;
            this.bottomBackground.y = _viewInfoUtil.getWindowHeight() - bottomGap;
        }
    }

    if (this.spinControls && this.coreApp.viewInfoUtil.viewType === "VL") {
        var gap = this.pConfig.panelContainer.spinControls.params.props.gap || 40;
        this.spinControls.y = (_viewInfoUtil.getWindowHeight() - this.spinControls.height) / 2 - (gap * _viewInfoUtil.viewScaleY);
        if (isGermanUI) {
            this.spinControls.y = (_viewInfoUtil.getWindowHeight() - this.spinControls.height) / 2;
        }
    }
};
panel.showGambleButton = function () {
    if (this.gambleBtn) {
        this.gambleBtn.visible = true;
        this.gambleYoyo = TweenMax.to(this.gambleBtn.scale, 0.6, { x: 0.7, y: 0.7, yoyo: true, repeat: -1 });
    }
}
panel.hideGambleButton = function () {
    if (this.gambleBtn) {
        this.gambleBtn.visible = false;
        if (this.gambleYoyo) {
            this.gambleYoyo.kill();
            this.gambleBtn.scale.set(0.8);
        }
    }
}
