function PanelView() {
    ViewContainer.call(this, arguments);
    this.elementsForResize = [];
    this.elementsForSetSize = [];
};

PanelView.prototype = Object.create(ViewContainer.prototype);
PanelView.prototype.constructor = PanelView;

var corePanel = PanelView.prototype;

corePanel.setVariables = function (slotView, coreApp) {
    this.slotView = slotView;
    this.coreApp = coreApp;
};

corePanel.createView = function () {
    var config = _ng.GameConfig.panelConfig[_viewInfoUtil.device];
    this.pConfig = _ng.GameConfig.panelConfig[_viewInfoUtil.device];

    // this.slotPanelConfig = _ng.GameConfig.slotPanelConfig[_viewInfoUtil.device];
    this.autoSpinNums = commonConfig.autoSpinNums;
    var parent
    for (var container in config) {
        parent = this.slotView[container];
        var allElements = config[container];
        var e = null;
        for (var element in allElements) {
            var params = allElements[element];
            var config = params.params;
            if (params.elementConstructor === "sprite") {
                e = pixiLib.getElement("Sprite", config.backgroundImage);
                e.name = "" + config.backgroundImage;
                pixiLib.setProperties(e, config.props[_viewInfoUtil.viewType]);
            } else if (params.elementConstructor === "button") {
                var options = (config.hitArea) ? { "hitArea": config.hitArea } : ((config.options) ? config.options : {});
                e = pixiLib.getButton(config.backgroundImage, options);
                pixiLib.setProperties(e, config.props[_viewInfoUtil.viewType]);
            } else if (params.elementConstructor === "rectangle") {
                e = pixiLib.getRectangleSprite(config.layout.width, config.layout.height, config.layout.color);
                pixiLib.setProperties(e, config.props[_viewInfoUtil.viewType]);
                // e.props = config.props;
            } else if (params.elementConstructor === "ParentContainer") {
                e = pixiLib.getContainer();

                if (!config.makeResponsive) {
                    config.props[_viewInfoUtil.viewType].x = config.props[_viewInfoUtil.viewType].x || 0;
                    config.props[_viewInfoUtil.viewType].y = config.props[_viewInfoUtil.viewType].y || 0;
                    pixiLib.setProperties(e, config.props[_viewInfoUtil.viewType]);
                    // e.props = config.props;
                } else {
                    _ngFluid.call(e, config.props);
                    if (config.subscribeToSetSize) {
                        this.elementsForSetSize.push(element);
                        e.setSizeValues = config.subscribeToSetSize;
                    }
                    // e.props = config.props;
                }
                if (element === "spinControls") {
                    e.pivot.x = 0.5;
                    e.pivot.y = 0.5;
                    this.spinControls = e;
                    this.spinControls.name = "spinControls";
                }
                //Add all children from children Key in current container
                //children inside the container can't act as _ngFluid
                //So just set the properties
                //If required parent container should act as _ngFluid
                for (var childElement in config.children) {
                    var cParams = config.children[childElement];
                    // cParams.params = cParams.config;
                    if (cParams.elementConstructor === "button") {
                        var options = (cParams.params.hitArea) ? { "hitArea": cParams.params.hitArea } : ((cParams.params.options) ? cParams.params.options : {});
                        ce = pixiLib.getButton(cParams.params.backgroundImage, options);
                        ce.name = childElement;
                        //ce.name = cParams.params.backgroundImage;
                        pixiLib.setProperties(ce, cParams.params.props[_viewInfoUtil.viewType]);
                        ce.props = cParams.params.props;
                        ce.makeResponsive = (cParams.params.makeResponsive) ? true : false;
                        if (cParams.params.subscribeToResize) {
                            this.elementsForResize.push(childElement);
                        }

                        //check button icon
                        if (cParams.hasIcon == true) {
                            ce.hasIcon = true;
                            var iconInfo = cParams.iconInfo;
                            this[childElement + "Icon"] = pixiLib.getAnimatedSprite(iconInfo.backgroundImage);
                            ce.iconRef = this[childElement + "Icon"];
                            ce.addChild(this[childElement + "Icon"]);
                            this[childElement + "Icon"].props = iconInfo.props;
                            pixiLib.setProperties(this[childElement + "Icon"], iconInfo.props[_viewInfoUtil.viewType]);
                            this.elementsForResize.push(childElement + "Icon");
                        }

                    } else if (cParams.elementConstructor === "text") {
                        ce = pixiLib.getElement("Text", cParams.params.textStyle, cParams.params.text);
                        pixiLib.setProperties(ce, cParams.params.props[_viewInfoUtil.viewType]);
                        ce.props = cParams.params.props;
                        ce.makeResponsive = (cParams.params.makeResponsive) ? true : false;
                        if (cParams.params.subscribeToResize) {
                            this.elementsForResize.push(childElement);
                        }
                    } else if (cParams.elementConstructor === "sprite") {
                        ce = pixiLib.getElement("Sprite", cParams.params.backgroundImage);
                        ce.name = "" + cParams.params.backgroundImage;
                        pixiLib.setProperties(ce, cParams.params.props[_viewInfoUtil.viewType]);
                        ce.props = cParams.params.props;
                        ce.makeResponsive = (cParams.params.makeResponsive) ? true : false;
                        if (cParams.params.subscribeToResize) {
                            this.elementsForResize.push(childElement);
                        }

                    } else if (cParams.elementConstructor === "Spine") {
                        ce = pixiLib.getElement("Spine", cParams.params.spineName);
                        ce.name = "" + cParams.params.spineName;
                        pixiLib.setProperties(ce, cParams.params.props[_viewInfoUtil.viewType]);
                        ce.props = cParams.params.props;
                        ce.animations = cParams.params.animations;

                        ce.makeResponsive = (cParams.params.makeResponsive) ? true : false;
                        if (cParams.params.subscribeToResize) {
                            this.elementsForResize.push(childElement);
                        }

                        if (cParams.params.defaultAnimation) {
                            ce.state.setAnimation(0, cParams.params.defaultAnimation, true);
                        }
                        ce.state.addListener({
                            complete: function (elm, entry) {
                                if (entry.trackIndex != 0) {
                                    elm.alpha = 0;
                                    this.spinButton.alpha = 1;
                                    if (this.stopButton) {
                                        this.stopButton.alpha = 1;
                                    }
                                }
                            }.bind(this, ce)
                        });
                    } else if (cParams.elementConstructor === "roundRect") {
                        ce = pixiLib.getRoundRect(cParams.params.layout.width, cParams.params.layout.height, cParams.params.layout.color, cParams.params.layout.radius);
                        pixiLib.setProperties(ce, cParams.params.props[_viewInfoUtil.viewType]);
                    } else {
                        ce = new window[cParams.elementConstructor](cParams.params, parent);
                    }
                    e.addChild(ce);
                    this[childElement] = ce;

                    if (childElement === "spinButton") {
                        this[childElement].on("click", function () {
                            this.onSpinClick();
                        }.bind(this));
                        this[childElement].on("touchend", function () {
                            // _mediator.publish("spinClick");
                            // this.onHideAutoSpin();
                            this.onSpinClick();
                        }.bind(this));
                        //_sndLib.lowBg();
                        // if (!(coreApp.gameModel.isAutoSpinActive() || coreApp.gameModel.isFreeSpinActive())) {
                        //     _sndLib.play(_sndLib.sprite.spinStartBtn);
                        // }
                    }
                }
            } else {
                e = new _ng[params.elementConstructor](params, parent);
                e = e.container || e;
            }
            e.props = config.props;
            e.makeResponsive = (config.makeResponsive) ? true : false;
            parent.addChild(e);
            this[element] = e;
            if (config.subscribeToResize) {
                this.elementsForResize.push(element);
            }
        }
    }

    pixiLib.addEvent(this.autoSpinButton, this.onAutoSpinClick.bind(this));
    pixiLib.addEvent(this.autoSpinStopButton, this.onAutoSpinStopClick.bind(this));

    this.createMiniAutoSpinOptions();
    this.toggleAutoSpinOptions(false);

    this.addInteractions();
    this.addMobileInteractions();
    this.addGameView();
    this.onResize();
};
corePanel.onSpinClick = function () {
    _sndLib.play(_sndLib.sprite.spinStartBtn);
    _mediator.publish("spinClick");
    this.onHideAutoSpin();
    if (this.spinSpine) {
        this.spinSpine.alpha = 1;
        this.spinSpine.state.timeScale = this.spinSpine.animations.animationSpeed;
        this.spinSpine.state.setAnimation(1, this.spinSpine.animations.animation, false);

        this.spinButton.alpha = 0;
        if (this.stopButton) {
            this.stopButton.alpha = 0;
        }
    }
}
corePanel.createMiniAutoSpinOptions = function () {
    if (_ng.GameConfig.panelConfig.data) {
        this.asData = _ng.GameConfig.panelConfig.data.autoSpinList;
    }
    this.autoSpinList = pixiLib.getElement();
    this.autoSpinList.name = "autoSpinList";
    this.spinControls.addChildAt(this.autoSpinList, 0);

    this.asBg = pixiLib.getElement("Sprite", this.asData.bg.image);
    this.autoSpinList.addChild(this.asBg);

    var len = this.autoSpinNums.length;
    for (let i = 0; i < len; i++) {
        asBtn = pixiLib.getElement("Text", this.asData.spinNum.textStyle);
        asBtn.name = "asBtn" + i;
        pixiLib.setText(asBtn, this.autoSpinNums[i]);
        pixiLib.setInteraction(asBtn, true);
        pixiLib.addEvent(asBtn, this.onASBtnClick.bind(this, asBtn));
        this.autoSpinList.addChild(asBtn);
    }
    if (this.spinCtrlBg) {
        this.spinControls.addChildAt(this.spinCtrlBg, 0);
    }
}

corePanel.onASBtnClick = function (btn) {
    _sndLib.play(_sndLib.sprite.btnClick);
    _mediator.publish("START_AUTOSPIN", btn.text);
    this.toggleAutoSpinOptions(false);
    this.autoSpinButton.visible = false;
    this.autoSpinStopButton.visible = true;
};

corePanel.onStartAutoSpin = function (value) {
    this["asValueBg"].visible = true;
    this["asValue"].visible = true;
    pixiLib.setText(this["asValue"], value - 1);
    _sndLib.play(_sndLib.sprite.autoSpinSelClick);
}

corePanel.onAutoSpinClick = function () {
    var bool = !this.autoSpinList.visible;
    _sndLib.play(_sndLib.sprite.autoSpinBtnClick);

    if (commonConfig.ukgc == "true") {
        _mediator.publish("SHOW_SETTINGS");
    } else {
        this.toggleAutoSpinOptions(bool);
    }

    _mediator.publish("clearAllWins");
    _mediator.publish("panelClick");
};

corePanel.onAutoSpinStopClick = function () {
    this.hideAutoSpinButton();
    _sndLib.play(_sndLib.sprite.autoSpinBtnClick)
    _mediator.publish("stopAutoSpin");
    _mediator.publish("panelClick");
}
corePanel.onCancelAutoSpin = function () {
    this.hideAutoSpinButton();
    _mediator.publish("stopAutoSpin");
}
corePanel.hideAutoSpinButton = function () {
    this.autoSpinButton.visible = true;
    this.autoSpinStopButton.visible = false;
    this["asValueBg"].visible = false;
    this["asValue"].visible = false;
}
corePanel.toggleAutoSpinOptions = function (bool) {
    if (this.autoSpinList) {
        this.autoSpinList.visible = bool;
    }
};

corePanel.onHideAutoSpin = function () {
    this.toggleAutoSpinOptions(false);
}

corePanel.addGameView = function () {
    if (isGermanUI) {
        if (_viewInfoUtil.viewType == "VD") {
            this.lineValue.visible = false;
            this.coinValue.visible = false;
            this.bottomBackground.texture = pixiLib.getTexture("smPanelBg");
            this.bottomBackground.x = 0;
            this.bottomBackground.y = 626;

            pixiLib.setProperties(this.balanceField, _ng.SuperMeterConfig.panelConfig.credit[_viewInfoUtil.viewType])
            pixiLib.setProperties(this.betField, _ng.SuperMeterConfig.panelConfig.stake[_viewInfoUtil.viewType])
            pixiLib.setProperties(this.winField, _ng.SuperMeterConfig.panelConfig.win[_viewInfoUtil.viewType])

        } else {
            this.betButtonParent.visible = false;
            if (this.spinCtrlBg)
            this.spinCtrlBg.visible = false;
        }
        this.betMaxButton.visible = false;
        this.autoSpinButton.visible = false;
    }

}
corePanel.addInteractions = function () {

    _mediator.subscribe("START_AUTOSPIN", this.onStartAutoSpin.bind(this));

    // Hide + and - buttons in history mode
    try {
        var urlParams = new URLSearchParams(window.location.search);
        var isHistoryMode = urlParams && urlParams.has('round_id');
        
        if (isHistoryMode) {
            // Hide coinValue buttons
            if (this.coinValue && this.coinValue.plusButton) {
                this.coinValue.plusButton.visible = false;
            }
            if (this.coinValue && this.coinValue.minusButton) {
                this.coinValue.minusButton.visible = false;
            }
            // Hide lineValue buttons
            if (this.lineValue && this.lineValue.plusButton) {
                this.lineValue.plusButton.visible = false;
            }
            if (this.lineValue && this.lineValue.minusButton) {
                this.lineValue.minusButton.visible = false;
            }
        }
    } catch (e) { /* no-op */ }

    if (this.coinValue && this.coinValue.plusButton) {
        pixiLib.addEvent(this.coinValue.plusButton, this.coinPlus.bind(this));
    }
    if (this.coinValue && this.coinValue.minusButton) {
        pixiLib.addEvent(this.coinValue.minusButton, this.coinMinus.bind(this));
    }
    if (this.lineValue && this.lineValue.plusButton) {
        pixiLib.addEvent(this.lineValue.plusButton, this.linePlus.bind(this));
    }
    if (this.lineValue && this.lineValue.minusButton) {
        pixiLib.addEvent(this.lineValue.minusButton, this.lineMinus.bind(this));
    }
    if (this.betMaxButton) {
        pixiLib.addEvent(this.betMaxButton, this.onBetMaxClick.bind(this));
    }
    if (this.stopButton) {
        pixiLib.addEvent(this.stopButton, this.onStopSpinClicked.bind(this));
        this.stopButton.visible = false;
    }

    if (this.quickSpinPanelBtn) {
        this.autoSpinButton.alpha = 0;
        this.autoSpinButton.visible = false;
        pixiLib.addEvent(this.quickSpinPanelBtn, this.onQuickSpinClicked.bind(this));
        //this.stopButton.visible = false;
    }

    if (commonConfig.hideStopButton) {
        this.stopButton.parent.removeChild(this.stopButton);
        delete this.stopButton;
    }

    //German Regulations
    if (commonConfig.disableAutoplay) {
        pixiLib.setInteraction(this.autoSpinButton, false);
    }
};

corePanel.onQuickSpinClicked = function () {
    if (!_ng.isQuickSpinActive) {
        _ng.singleQuickSpin = true;
    }
    _ng.isQuickSpinActive = true;
    this.onSpinClick();
}

corePanel.showSpinStop = function (params) {
    _mediator.publish("panelClick");
    if (this.stopButton && !_ng.isQuickSpinActive) {
        //When spacebar is held, don't show stop button but public below event
        if (!coreApp.gameController.isSpaceBarHeld) {
            this.stopButton.visible = true;
        }
        //set Spacebar Stop event only is case of stopButton is there and set to Visible
        // _mediator.publish("setSpaceBarEvent", "spaceBarStopClicked");
    }
}
corePanel.hideSpinStop = function (params) {
    if (this.stopButton) {
        //set spacebar event to Idle when allReels are stopped.
        _mediator.publish("setSpaceBarEvent", "idle");
        this.stopButton.visible = false;
    }
}

corePanel.onStopSpinClicked = function () {
    _mediator.publish("panelClick");
    _sndLib.play(_sndLib.sprite.spinStopBtn);
    _mediator.publish("STOP_SPIN_NOW");
    this.stopButton.visible = false;
    this.onHideAutoSpin();
};

corePanel.addMobileInteractions = function () {
};

corePanel.onBetMaxClick = function () {
    _mediator.publish("panelClick");
    if (this.coinValue) {
        this.coinValue.setMaxIndex();
    }
    if (this.lineValue) {
        this.lineValue.setMaxIndex();
    }
    _sndLib.play(_sndLib.sprite.maxbetBtnClick);

    pixiLib.setInteraction(this.betMaxButton, false);
    _mediator.publish("coinValueUpdated", { index: this.coinValue.getCurrentIndex() });
    _mediator.publish("lineValueUpdated", { index: this.lineValue.getCurrentIndex() });
    _mediator.publish("hideGambleButtonOnClick");
    _mediator.publish("totalBetUpdated");
    this.onHideAutoSpin();
};

corePanel.checkMaxBetState = function () {
    if (this.betMaxButton) {
        var isMaxBet = true;
        if (this.coinValue && (this.coinValue.getCurrentIndex() !== this.coinValue.getMaxIndex())) {
            isMaxBet = false;
        }
        if (this.lineValue && (this.lineValue.getCurrentIndex() !== this.lineValue.getMaxIndex())) {
            isMaxBet = false;
        }
        pixiLib.setInteraction(this.betMaxButton, !isMaxBet);
    }
};

corePanel.coinPlus = function () {
    _sndLib.play(_sndLib.sprite.btnClick);
    _mediator.publish("hideGambleButtonOnClick");
    _mediator.publish("coinValueUpdated", { index: this.coinValue.getCurrentIndex() });
    _mediator.publish("totalBetUpdated");
    _mediator.publish("panelClick");

};

corePanel.coinMinus = function () {
    _sndLib.play(_sndLib.sprite.btnClick);
    _mediator.publish("hideGambleButtonOnClick");
    _mediator.publish("coinValueUpdated", { index: this.coinValue.getCurrentIndex() });
    _mediator.publish("totalBetUpdated");
    _mediator.publish("panelClick");
};

corePanel.linePlus = function () {
    _sndLib.play(_sndLib.sprite.btnClick);
    _mediator.publish("hideGambleButtonOnClick");
    _mediator.publish("lineValueUpdated", { index: this.lineValue.getCurrentIndex() });
    _mediator.publish("totalBetUpdated");
    _mediator.publish("panelClick");
};

corePanel.lineMinus = function () {
    _sndLib.play(_sndLib.sprite.btnClick);
    _mediator.publish("hideGambleButtonOnClick");
    _mediator.publish("lineValueUpdated", { index: this.lineValue.getCurrentIndex() });
    _mediator.publish("totalBetUpdated");
    _mediator.publish("panelClick");
};

corePanel.onResize = function () {
    var scaleX, scaleY;
    for (var i = 0; i < this.elementsForResize.length; i++) {
        if (this[this.elementsForResize[i]]) {
            if (this[this.elementsForResize[i]] && this[this.elementsForResize[i]].makeResponsive) {
                this[this.elementsForResize[i]].setAlignment(this[this.elementsForResize[i]].props);
                if (_viewInfoUtil.viewType === "VL" || _viewInfoUtil.viewType === "VD") {
                    scaleX = this[this.elementsForResize[i]].props.landScaleX || 1;
                    scaleY = this[this.elementsForResize[i]].props.landScaleY || 1;
                } else {
                    scaleX = this[this.elementsForResize[i]].props.portScaleX || 1;
                    scaleY = this[this.elementsForResize[i]].props.portScaleY || 1;
                }
                this[this.elementsForResize[i]].setScale(scaleX, scaleY);
            } else {
                pixiLib.setProperties(this[this.elementsForResize[i]], this[this.elementsForResize[i]].props[_viewInfoUtil.viewType]);
            }
        }
    }
    for (var i = 0; i < this.elementsForSetSize.length; i++) {
        if (this[this.elementsForResize[i]]) {
            this[this.elementsForSetSize[i]].setSize(this[this.elementsForSetSize[i]].setSizeValues[_viewInfoUtil.viewType].w, this[this.elementsForSetSize[i]].setSizeValues[_viewInfoUtil.viewType].h);
        }
    }




    if (this.asData) {
        pixiLib.setProperties(this.autoSpinList, this.asData.props[_viewInfoUtil.viewType]);
        pixiLib.setProperties(this.asBg, this.asData.bg.props[_viewInfoUtil.viewType]);
        // pixiLib.setProperties(this.autoSpinList, this.asData);
        // this.asBg.rotation = asData.props[_viewInfoUtil.viewType].rotation;
        // this.asBg.scale.x = asData.props[_viewInfoUtil.viewType].scale.x;
        // this.asBg.scale.y = asData.props[_viewInfoUtil.viewType].scale.y;

        // this.autoSpinList.x = asData.props[_viewInfoUtil.viewType].x;
        // this.autoSpinList.y = asData.props[_viewInfoUtil.viewType].y;


        // if (_viewInfoUtil.viewType === "VP") {
        //     this.asBg.scale.x = 1.6;
        //     this.asBg.scale.y = 1.7;       
        // } else if (_viewInfoUtil.viewType === "VL") {
        //     this.asBg.rotation = -1.58;
        //     this.asBg.scale.x = -1.2;
        //     this.asBg.scale.y = 2;        
        // }

        var len = this.autoSpinList.children.length - 1;
        var i = 0
        for (i = 0; i < len; i++) {
            var asBtn = this.autoSpinList.children[i + 1];
            var props = this.asData.spinNum.props[_viewInfoUtil.viewType];
            pixiLib.setProperties(asBtn, props);

            if (_viewInfoUtil.viewType === "VL") {
                asBtn.x = 20 + props.x + i * props.gap;
                asBtn.y = props.y;
            } else if (_viewInfoUtil.viewType === "VD") {
                asBtn.x = props.x;
                asBtn.y = 10 + props.y + i * props.gap;
            } else {
                asBtn.x = props.x;
                asBtn.y = props.y + i * props.gap;
            }
        }
    }
    this.onGameSpecificResize();

};

corePanel.onGameSpecificResize = function () { }

corePanel.updateTotalBet = function (totalBet) {
    if (this.betField) {
        this.betField.setValue(totalBet);
    }
};

corePanel.updateWin = function (win) {
    if (this.winField && win > 0) {
        this.winField.setValue(win);
    }

    if (win === "") {
        pixiLib.setText(this.winField.value, "");
    }

};

corePanel.updateBalance = function (balance) {
    if (this.balanceField) {
        // In history mode, show ***** instead of balance
        try {
            var urlParams = new URLSearchParams(window.location.search);
            if (urlParams && urlParams.has('round_id')) {
                // Show ***** in history mode
                if (this.balanceField.value) {
                    pixiLib.setText(this.balanceField.value, "*****");
                    return;
                }
            }
        } catch (e) { /* no-op */ }
        this.balanceField.setValue(balance);
    }
};

corePanel.setUpLineValue = function (selectedLines, totalLines) {
    if (this.lineValue) {
        var lineOptions = [];
        for (var i = 1; i <= totalLines; i++) {
            lineOptions[i - 1] = i;
        }
        this.lineValue.setOptionsArray(lineOptions);
        this.lineValue.setDefaultIndex(selectedLines - 1);
    }
};
corePanel.updateLines = function (str) {
    if (this.lineValue) {
        this.lineValue.setValue(str);
    }
};
corePanel.setUpCoinValue = function (selectedIndex, coinArray) {
    if (this.coinValue) {
        this.coinValue.setOptionsArray(coinArray);
        this.coinValue.setDefaultIndex(selectedIndex);
    }
};
corePanel.updateCoinValue = function () {
    if (this.coinValue) {
        // _sndLib.play(_sndLib.sprite.coinValueChange);
        this.coinValue.setValue();
    }
};
corePanel.enablePanel = function () {
    // Guard: do not enable controls during or after PFS
    var isPFR = coreApp && coreApp.gameModel && (coreApp.gameModel.getIsPFSActive && coreApp.gameModel.getIsPFSActive());
    var isPFSEnded = coreApp && coreApp.gameModel && coreApp.gameModel.PFSData && coreApp.gameModel.PFSData.isPFSEnded;
    if (isPFR || isPFSEnded) {
        if (this.spinButton) pixiLib.setInteraction(this.spinButton, false);
        if (this.autoSpinButton) pixiLib.setInteraction(this.autoSpinButton, false);
        if (this.autoSpinStopButton) pixiLib.setInteraction(this.autoSpinStopButton, false);
        if (this.betButtonParent) pixiLib.setInteraction(this.betButtonParent, false);
        return;
    }

    // Hide + and - buttons in history mode
    try {
        var urlParams = new URLSearchParams(window.location.search);
        var isHistoryMode = urlParams && urlParams.has('round_id');
        
        if (isHistoryMode) {
            // Hide coinValue buttons
            if (this.coinValue && this.coinValue.plusButton) {
                this.coinValue.plusButton.visible = false;
            }
            if (this.coinValue && this.coinValue.minusButton) {
                this.coinValue.minusButton.visible = false;
            }
            // Hide lineValue buttons
            if (this.lineValue && this.lineValue.plusButton) {
                this.lineValue.plusButton.visible = false;
            }
            if (this.lineValue && this.lineValue.minusButton) {
                this.lineValue.minusButton.visible = false;
            }
        }
    } catch (e) { /* no-op */ }

    if (_viewInfoUtil.device === "Desktop") {
        this.coinValue.enableAll();
        this.lineValue.enableAll();

        pixiLib.setInteraction(this.autoSpinButton, true);
        //pixiLib.setInteraction(this.autoSpinStopButton, true);
        // pixiLib.setInteraction(this.betMaxButton, true);
        this.checkMaxBetState();        //For enabling maxbet
        pixiLib.setInteraction(this.spinButton, true);
        if (this.quickSpinPanelBtn) {
            this.autoSpinButton.alpha = 0;
            this.autoSpinButton.visible = false;
            pixiLib.setInteraction(this.quickSpinPanelBtn, true);
            pixiLib.setInteraction(this.autoSpinButton, false);
        }
    } else if (_viewInfoUtil.device === "Mobile") {
        pixiLib.setInteraction(this.spinButton, true);
        pixiLib.setInteraction(this.autoSpinButton, true);
        pixiLib.setInteraction(this.autoSpinStopButton, true);
        pixiLib.setInteraction(this.betButtonParent, true);
        if (this.quickSpinPanelBtn) {
            this.autoSpinButton.alpha = 0;
            this.autoSpinButton.visible = false;
            pixiLib.setInteraction(this.quickSpinPanelBtn, true);
            pixiLib.setInteraction(this.autoSpinButton, false);
        }
    }

    //German Regulations
    if (commonConfig.disableAutoplay) {
        pixiLib.setInteraction(this.autoSpinButton, false);
    }

    this.addGameView();
};
corePanel.hidePanel = function () {
    this.visible = false;
}
corePanel.showPanel = function () {
    this.visible = true;
}
corePanel.disablePanel = function () {
    if (_viewInfoUtil.device === "Desktop") {
        this.coinValue.disableAll();
        this.lineValue.disableAll();
        pixiLib.setInteraction(this.autoSpinButton, false);
        //pixiLib.setInteraction(this.autoSpinStopButton, false);
        pixiLib.setInteraction(this.betMaxButton, false);
        pixiLib.setInteraction(this.spinButton, false);
        if (this.autoSpinList && this.autoSpinList.visible) {
            this.autoSpinList.visible = false;
        }
        if (this.quickSpinPanelBtn) {
            this.autoSpinButton.alpha = 0;
            this.autoSpinButton.visible = false;
            pixiLib.setInteraction(this.quickSpinPanelBtn, false);
        }
    } else if (_viewInfoUtil.device === "Mobile") {
        pixiLib.setInteraction(this.spinButton, false);
        pixiLib.setInteraction(this.autoSpinButton, false);
        // pixiLib.setInteraction(this.autoSpinStopButton, false);
        pixiLib.setInteraction(this.betButtonParent, false);
        if (this.quickSpinPanelBtn) {
            this.autoSpinButton.alpha = 0;
            this.autoSpinButton.visible = false;
            pixiLib.setInteraction(this.quickSpinPanelBtn, false);
        }

    }
    this.addGameView();
};


corePanel.updatePanelBg = function(){};