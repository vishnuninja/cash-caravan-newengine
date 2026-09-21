
var Panel = PanelView.prototype;
Panel.createView = function () {
    // Subscribe to promo state changes
    _mediator.subscribe("promoStateChanged", this.onPromoStateChanged.bind(this));

    var config = _ng.GameConfig.panelConfig[_viewInfoUtil.device];
    this.pConfig = _ng.GameConfig.panelConfig[_viewInfoUtil.device];
    // this.slotPanelConfig = _ng.GameConfig.slotPanelConfig[_viewInfoUtil.device];
    this.autoSpinNums = commonConfig.autoSpinNums;
    this.isstopSpinSndPlaying=false;
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
                if(element=="settingsBtn")
                    {
                        pixiLib.addEvent(e, function(){
                            _mediator.publish("SHOW_SETTINGS");
                            _mediator.publish("closeBuyFSPopup");
                            _mediator.publish("toggleBetContainer",false);
                        });
                    }
                    if(element=="paytableBtn")
                        {
                            pixiLib.addEvent(e, function(){_mediator.publish("SHOW_PAYTABLE");});
                        }
                    if(element=="infoBtn")
                        {
                            pixiLib.addEvent(e, function(){_mediator.publish("SHOW_RULES"); });
                        }
            }
             else if (params.elementConstructor === "rectangle") {
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
                    this.spinControls.sortableChildren = true;
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
                        // this.spinSpine = ce;
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
                        //SPIN BUTTON SPINE
                        // pixiLib.addHoverInteraction(ce, function() {          
                        //     this.spinSpine.state.setAnimation(1, "Hover", true);
                        // }.bind(this));
 
                        // pixiLib.addOutInteraction(ce, function() {  
                        //     this.spinSpine.state.setAnimation(1, "Stop", true);
                        // }.bind(this));

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
                            // this.isstopSpinSndPlaying = false;
                            this.onSpinClick();
                        }.bind(this));
                        this[childElement].on("touchend", function () {
                            // this.isstopSpinSndPlaying = false;
                            // _mediator.publish("spinClick");
                            // this.onHideAutoSpin();
                            this.onSpinClick();
                        }.bind(this));
                        //_sndLib.lowBg();
                        // this.isstopSpinSndPlaying = false;
                        // if (!(coreApp.gameModel.isAutoSpinActive() || coreApp.gameModel.isFreeSpinActive())) {
                        //     _sndLib.play(_sndLib.sprite.spinStartBtn);
                        // }
                    }
                }
            }
             else {
                e = new _ng[params.elementConstructor](params, parent);
                e = e.container || e;
            }
            e.props = config.props;
            e.makeResponsive = (config.makeResponsive) ? true : false;

            if(e.name=="spinControls"){
                if(_viewInfoUtil.viewType=="VP" ||_viewInfoUtil.viewType=="VL"){
           
            }

                e.children[3].zIndex = 9;

            }

            parent.addChild(e);
            this[element] = e;
            if (config.subscribeToResize) {
                this.elementsForResize.push(element);
            }
        }
    }
    
    _mediator.subscribe("SpinButtonStatus",this.StopButtonStatus.bind(this));
    _mediator.subscribe("UpdateWin",this.updateWin.bind(this));
    // _mediator.subscribe("freeSpinCount",this.freeSpinCount.bind(this));
    _mediator.subscribe("bringspinbtnback",this.bringspinbtnback.bind(this));
    // _mediator.subscribe("updatePanelfs",this.updatePanelfs.bind(this));
    _mediator.subscribe("disablePanelFs",this.disablePanelFs.bind(this));
    _mediator.subscribe("removePanelFs",this.removePanelFs.bind(this));
    _mediator.subscribe("enabledPanelFs",this.enabledPanelFs.bind(this));
    _mediator.subscribe("ToggleTurbo",this.ToggleTurbo.bind(this));
    _mediator.subscribe("ToggleSpin",this.toggleSpin.bind(this));
    _mediator.subscribe("MakeTrueAtSpin",this.MakeTrueAtSpin.bind(this));
    _mediator.subscribe("moveContainerTo",this.moveContainerTo.bind(this));
    _mediator.subscribe("updateAutoSpinText",this.updateAutoSpinText.bind(this));
    _mediator.subscribe("createBetPopup",this.createBetPopup.bind(this));
    _mediator.subscribe("updatePopupBet",this.updatePopupBet.bind(this));
    _mediator.subscribe("toggleBetContainer",this.toggleBetContainer.bind(this));
    _mediator.subscribe("enablePopupMaxbet",this.enablePopupMaxbet.bind(this));
    _mediator.subscribe("disablePopupMaxbet",this.disablePopupMaxbet.bind(this));
    _mediator.subscribe("onCloseBtn",this.onCloseBtn.bind(this));
    _mediator.subscribe("setIncrement",this.callingPanelValueIncrementFn.bind(this));
    _mediator.subscribe("setDecrement",this.callingPanelValueDecrementFn.bind(this));
    _mediator.subscribe("ToggleTurboFunction",this.ToggleTurboFunction.bind(this));
    _mediator.subscribe("ToggleQuickFunction",this.ToggleQuickFunction.bind(this));
    _mediator.subscribe("adjustPosition",this.adjustPosition.bind(this));
    _mediator.subscribe("checkButtonState",this.checkButtonState.bind(this));
    _mediator.subscribe("showAutoStopBtn",this.showAutoStopBtn.bind(this));
    _mediator.subscribe("toggleStopSpinBg",this.toggleStopSpinBg.bind(this));
    // pixiLib.setInteraction(coreApp.gameView.bgContainer,true);
    // coreApp.gameView.bgContainer.buttonMode = false;
    // pixiLib.addEvent(coreApp.gameView.bgContainer, this.closeAutospinBGClicked.bind(this));
    pixiLib.addEvent(this.autoSpinButton, this.onAutoSpinClick.bind(this));
    pixiLib.addEvent(this.autoSpinButton, () => {
        _mediator.publish("closeQuickSpinInfo");
    });
    _mediator.subscribe("toggleAutoSpinOptions", this.toggleAutoSpinOptions.bind(this));
    pixiLib.addEvent(this.autoSpinStopButton, this.onAutoSpinStopClick.bind(this));
    pixiLib.addEvent(this.paytableBtn,function() {
        _mediator.publish("toggleBetContainer",false); 
    });   //added for paytable button
    pixiLib.addEvent(this.infoBtn,()=> {          //added for info button
        _mediator.publish("toggleBetContainer",false); 
    });  
    
    this.createMiniAutoSpinOptions();
    this.toggleAutoSpinOptions(false);

    this.addInteractions();
    this.addMobileInteractions();
    this.addGameView();
    this.onResize();
    this.FreespinButton.visible = false
    this.winField.visible = false;
    this.winField.name = "winField";

    this.oldCoinindex=0;
    this.oldLineindex=0;
    this.maxToggle=false;

    this.createBetPopup("init");
    if(_viewInfoUtil.device == "Mobile") {
        width = 5000;
        height = 5000;
    }
    else{
        width=_viewInfoUtil.getWindowWidth,
        height=_viewInfoUtil.getWindowHeight
    }
    this.stopSpinBg=pixiLib.getShape("rect", {
        w: width,
        h:height
    });
    this.stopSpinBg.alpha = 0;
    this.stopSpinBg.name = "stopSpin BG"
    this.stopSpinBg.interactive = true;
    this.stopSpinBg.buttonMode = true;
    this.stopSpinBg.x = -1102;
    this.stopSpinBg.y = -1400;
    this.stopSpinBg.visible=false;
    if(_viewInfoUtil.device == "Mobile"){
    coreApp.gameView.panelContainer.addChildAt(this.stopSpinBg,0);
    }
    pixiLib.addEvent(this.stopSpinBg, this.onStopSpinClicked.bind(this));
    
    /*panel*/
    coreApp.gameView.panelContainer.scale = 0;    
}

Panel.toggleStopSpinBg=function(bool){
    this.stopSpinBg.visible=bool;
}
Panel.onAutoSpinClick = function () {
    var bool = !this.autoSpinList.visible;
    // _mediator.publish("closeAutoSpinPopup");
    if(bool)
        {
            // _mediator.publish("toggleAutoplayPopup",true);
            _mediator.publish("HIDE_TICKER");
            _mediator.publish("disableBuyFeature")
            _mediator.publish("ToggleSpin",false);
        }
        else
        {
            _mediator.publish("SHOW_TICKER");
            _mediator.publish("enableBuyFeature")
            _mediator.publish("ToggleSpin",true);
            _mediator.publish("checkBalanceForBuyFeature");
        }
    _sndLib.play(_sndLib.sprite.autoSpinBtnClick);

    if (commonConfig.ukgc == "true") {
        _mediator.publish("SHOW_SETTINGS");
    } else {
        this.toggleAutoSpinOptions(bool);
    }

    _mediator.publish("clearAllWins");
    _mediator.publish("panelClick");
    _mediator.publish("closeVolBar");/* for closing vol-slider bar */
}

panel.closeAutospinBGClicked = function() {
    if (this.autoSpinList.visible == true) {
        this.autoSpinList.visible = false;
        _mediator.publish("SHOW_TICKER");
      _mediator.publish("enableBuyFeature");
      _mediator.publish("ToggleSpin",true);
    }
    _mediator.publish("sliderFalse");
    _mediator.publish("checkBalanceForBuyFeature");
}

// Panel.updatePanelfs = function(value) {
//     if(this.amtTxt){
//         pixiLib.setText(this.amtTxt,pixiLib.getFormattedAmount(value*coreApp.gameModel.spinData.buyfg));
//         var bet = value*coreApp.gameModel.spinData.antebet;
//         pixiLib.setText(this.twoxbetamt,pixiLib.getFormattedAmount(bet))
//     }
// }

panel.toggleSpin=function(bool) {
    // During PFR (active or ending), force spin off
    if (coreApp && coreApp.gameModel && (coreApp.gameModel.getIsPFSActive() || (coreApp.gameModel.PFSData && coreApp.gameModel.PFSData.isPFSEnded))) {
        bool = false;
        if (_viewInfoUtil.device === "Mobile") {
            if (_viewInfoUtil.viewType=="VP" || _viewInfoUtil.viewType=="VL") {
                _mediator.publish("toggleStopSpinBg", false)
            }
        }
    }
 
    if (_viewInfoUtil.device == 'Desktop') {
        if(bool == true && coreApp.gameModel.isFreeSpinActive() != true && _ng.BuyFSenabled != true && 
        _ng.GameConfig.superBuyEnabled != true && coreApp.gameController.allReelsStopped == true) {
            
            pixiLib.setInteraction(this.spinButton,bool);
            pixiLib.setInteraction(this.autoSpinButton,bool); 
        }  else {
            pixiLib.setInteraction(this.spinButton,false);
            pixiLib.setInteraction(this.autoSpinButton,false); 
        }
                          
    } else{
        if(bool == true && !coreApp.gameModel.getIsPFSActive()) {
            pixiLib.setInteraction(this.spinButton,bool);
            if(this.autoSpinButton) {
                this.autoSpinButton.alpha = 1;
            }
        } else {
            pixiLib.setInteraction(this.spinButton,false);
            // if(this.autoSpinButton) {
            //     this.autoSpinButton.alpha = 0.5;  // Visual feedback when disabled
            // }
        }
    }
    if(bool) {
        if (this.coinValue && coreApp.gameModel.isFreeSpinActive() != true && _ng.BuyFSenabled != true && 
            _ng.GameConfig.superBuyEnabled != true) {
            this.coinValue.checkButtonState();   
        }
    } else {
        if (this.coinValue.plusButton) {
            pixiLib.setInteraction(this.coinValue.plusButton,bool);      
        }
        if (this.coinValue.minusButton) {
            pixiLib.setInteraction(this.coinValue.minusButton,bool);   
        }   
    }

    // Extra safety check during freespins/autospin/PFS to prevent spamming
    if (coreApp.gameModel.isFreeSpinActive() || coreApp.gameModel.isAutoSpinActive() || coreApp.gameModel.getIsPFSActive() || (coreApp.gameModel.PFSData && coreApp.gameModel.PFSData.isPFSEnded)) {
        pixiLib.setInteraction(this.settingsBtn, true);
        _mediator.publish("settingsPlusBetInteraction",false);
        _mediator.publish("settingsPlusBetInteractionMobile",false);
        _mediator.publish("settingsMinusBetInteraction",false);
        _mediator.publish("settingsMinusBetInteractionMobile",false);

        if (_viewInfoUtil.device == 'Desktop') {
            pixiLib.setInteraction(this.spinButton, false);   
        }
    } else{
        if(_ng.buyFeaturePopupStatus == true) {
            pixiLib.setInteraction(this.paytableBtn,false);
            pixiLib.setInteraction(this.infoBtn,false);
            pixiLib.setInteraction(this.settingsBtn,false);
        } else {
            pixiLib.setInteraction(this.paytableBtn,true);
            pixiLib.setInteraction(this.infoBtn,true);
            pixiLib.setInteraction(this.settingsBtn,true);
        }    
    }

    if (coreApp.gameController.errorContinueClicked) {
        
        coreApp.gameController.errorContinueClicked = false;
        _ng.BuyFSenabled = false;
        _ng.GameConfig.superBuyEnabled = false;
    
        pixiLib.setInteraction(this.spinButton, bool);
        pixiLib.setInteraction(this.autoSpinButton,bool); 
        _mediator.publish("hideandShowBuyfeature", bool);
    
        if (_viewInfoUtil.device === "Mobile") {
            _mediator.publish("ToggleMobPanel", bool);
            pixiLib.setInteraction(this.betButtonParent, bool);
        }
    
        _mediator.publish(bool ? "enableBuyFeature" : "disableBuyFeature");
    
        ["plusButton", "minusButton"].forEach(button => {
            if (this.coinValue[button]) {
                pixiLib.setInteraction(this.coinValue[button], bool);
            }
        });
    
        if (this.coinValue.currentIndex === 0) {
            _mediator.publish("selectorMinusInteraction", false);
            if (this.coinValue.minusButton) {
                pixiLib.setInteraction(this.coinValue.minusButton, false);
            }
        }
    
        if (this.coinValue.currentIndex === this.coinValue.options.length - 1) {
            _mediator.publish("selectorPlusInteraction", false);
            if (this.coinValue.plusButton) {
                pixiLib.setInteraction(this.coinValue.plusButton, false);
            }
        }
        _mediator.publish("checkBalanceForBuyFeature");
    }
}

Panel.showSpinStop = function (params) {
    _mediator.publish("panelClick");
    // Don't show stop button during PFS
    if (coreApp.gameModel.getIsPFSActive && coreApp.gameModel.getIsPFSActive()) {
        return;
    }
    if (this.stopButton && !_ng.isQuickSpinActive) {
        //When spacebar is held, don't show stop button but public below event
        if (!coreApp.gameController.isSpaceBarHeld) {
            _mediator.publish("showSpinStop");
            // this.spinSpine.state.setAnimation(1, "animation", true)
            this.stopButton.visible = true;
            if(coreApp.gameModel.isFreeSpinActive()) {
                // pixiLib.setInteraction(this.stopButton,false);
                this.checkBuyFgStatus();
            }
        }
        //set Spacebar Stop event only is case of stopButton is there and set to Visible
        if(_viewInfoUtil.viewType=="VP" ||_viewInfoUtil.viewType=="VL")
            {
             _mediator.publish("toggleStopSpinBg",true)
            }
        // _mediator.publish("setSpaceBarEvent", "spaceBarStopClicked");
    }
}

Panel.disablePanelFs = function() {
    if(this.BuyFeature) {
        if(_ng.twoXBetEnabled==false) {
            pixiLib.setInteraction(this.twoxbetbtn,false);
            this.twoxbetbtn.alpha = 0.7;
        } else {
            pixiLib.setInteraction(this.twoxbetbtn,false);
            this.twoxbetbtn.alpha = 0.7; 
        }
        pixiLib.setInteraction(this.BuyFeature,false);    
        this.BuyFeature.alpha = 0.7;
    }
}

Panel.removePanelFs = function() {
    if(this.BuyFeature) {
        if(_ng.twoXBetEnabled==false){
            pixiLib.setInteraction(this.twoxbetbtn,false);
            this.twoxbetbtn.alpha = 0;
        }
        pixiLib.setInteraction(this.BuyFeature,false);    
        this.BuyFeature.alpha = 0;
    }
}

Panel.enabledPanelFs = function() {
    if(this.BuyFeature) {
        if(coreApp.gameModel.isAutoSpinActive()) {
            if(_ng.twoXBetEnabled==true) {
                pixiLib.setInteraction(this.BuyFeature,false);
                this.BuyFeature.alpha = 0.7;
                pixiLib.setInteraction(this.twoxbetbtn,true);
                this.twoxbetbtn.alpha = 1;
            } else{
                pixiLib.setInteraction(this.BuyFeature,false);
                this.BuyFeature.alpha = 0.5;
                pixiLib.setInteraction(this.twoxbetbtn,false);
                this.twoxbetbtn.alpha = 0.5;
            }
        } else if(_ng.twoXBetEnabled==true) {
                pixiLib.setInteraction(this.BuyFeature,false);
                this.BuyFeature.alpha = 0.7;
                pixiLib.setInteraction(this.twoxbetbtn,true);
                this.twoxbetbtn.alpha = 1;
        } else if(coreApp.gameModel.isFreeSpinActive()) {
                _mediator.publish("disablePanelFs");
        } else {
            pixiLib.setInteraction(this.BuyFeature,true);
            this.BuyFeature.alpha = 1;
            pixiLib.setInteraction(this.twoxbetbtn,true);
            this.twoxbetbtn.alpha = 1;
        }
      
    }
}


Panel.enablePanel = function () {
    // Check if we're in promo mode
    const isPromo = window._HAS_PROMO_ === true;

    if (_viewInfoUtil.device === "Desktop") {
        var isPFR = coreApp.gameModel.getIsPFSActive() || (coreApp.gameModel.PFSData && coreApp.gameModel.PFSData.isPFSEnded);
        if (!isPromo && !isPFR) {
            this.coinValue.enableAll();
            this.lineValue.enableAll();

            pixiLib.setInteraction(this.autoSpinButton, true);
            //pixiLib.setInteraction(this.autoSpinStopButton, true);
            // pixiLib.setInteraction(this.betMaxButton, true);
            pixiLib.setInteraction(this.spinButton, true);
            
            // Make sure buttons are visible when not in promo
            if (this.spinButton) {
            this.spinButton.visible = true;
            }
            if (this.autoSpinButton) this.autoSpinButton.visible = true;
            if (this.quickSpinPanelBtn) this.quickSpinPanelBtn.visible = true;
        } else if (isPromo && _viewInfoUtil.device === "Mobile") {
            // Hide and disable buttons during promo (Mobile only)
            pixiLib.setInteraction(this.spinButton, false);
            pixiLib.setInteraction(this.autoSpinButton, false);
            if (this.spinButton) this.spinButton.visible = false;
            if (this.autoSpinButton) this.autoSpinButton.visible = false;
            if (this.quickSpinPanelBtn) this.quickSpinPanelBtn.visible = false;
        }
        
        this.checkMaxBetState();        //For enabling maxbet
        
        if (this.quickSpinPanelBtn) {
            this.autoSpinButton.alpha = 0;
            this.autoSpinButton.visible = isPromo ? false : this.autoSpinButton.visible;
            pixiLib.setInteraction(this.quickSpinPanelBtn, !isPromo);
            pixiLib.setInteraction(this.autoSpinButton, false);
        }
    } else if (_viewInfoUtil.device === "Mobile") {
        const isPromo = window._HAS_PROMO_ === true;
        
        // Force update button states based on promo status
        if (isPromo) {
            // Hide and disable all buttons during promo
            if (this.spinButton) {
                this.spinButton.visible = false;
                this.spinButton.interactive = false;
                this.spinButton.buttonMode = false;
                pixiLib.setInteraction(this.spinButton, false);
            }
            if (this.autoSpinButton) {
                this.autoSpinButton.visible = false;
                this.autoSpinButton.interactive = false;
                this.autoSpinButton.buttonMode = false;
                pixiLib.setInteraction(this.autoSpinButton, false);
            }
            if (this.autoSpinStopButton) {
                this.autoSpinStopButton.visible = false;
                this.autoSpinStopButton.interactive = false;
                this.autoSpinStopButton.buttonMode = false;
                pixiLib.setInteraction(this.autoSpinStopButton, false);
            }
            if (this.betButtonParent) {
                this.betButtonParent.visible = false;
                this.betButtonParent.interactive = false;
                this.betButtonParent.buttonMode = false;
                pixiLib.setInteraction(this.betButtonParent, false);
            }
            if (this.stopButton) {
                this.stopButton.visible = false;
                this.stopButton.interactive = false;
                this.stopButton.buttonMode = false;
            }
        } 
        else if(coreApp.gameModel.isAutoSpinActive() == true) {
            var isPFR = coreApp.gameModel.getIsPFSActive() || (coreApp.gameModel.PFSData && coreApp.gameModel.PFSData.isPFSEnded);
            // Avoid flashing spin button during PFS
            this.spinButton.visible = !isPFR;
            this.stopButton.visible = true;
            this.stopButton.alpha = 1;
            // Don't show autoSpinButton during PFR
            if (!isPFR) {
                this.autoSpinButton.visible = true;
            }
            this.betButtonParent.visible = true;
        } 
        else {
            var isPFR = coreApp.gameModel.getIsPFSActive() || (coreApp.gameModel.PFSData && coreApp.gameModel.PFSData.isPFSEnded);
            // Don't enable buttons during PFS
            if (!isPFR) {
                pixiLib.setInteraction(this.spinButton, true);
                pixiLib.setInteraction(this.autoSpinButton, true);
                pixiLib.setInteraction(this.autoSpinStopButton, true);
                pixiLib.setInteraction(this.betButtonParent, true);

                this.spinButton.visible=true;
                this.autoSpinButton.visible=true;
                this.betButtonParent.visible=true;
            } else {
                // Keep buttons disabled and hidden during PFS
                pixiLib.setInteraction(this.spinButton, false);
                pixiLib.setInteraction(this.autoSpinButton, false);
                this.spinButton.visible=false;
                this.autoSpinButton.visible=false;
            }
        }
      
       
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

Panel.disablePanel = function () {
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
        if(coreApp.gameModel.isAutoSpinActive() == true)
        {
            this.spinButton.visible=false;
            this.stopButton.visible=false;
            this.stopButton.alpha=0;
            this.autoSpinButton.visible=false;
            this.betButtonParent.visible=false;
        }
        if (this.quickSpinPanelBtn) {
            this.autoSpinButton.alpha = 0;
            this.autoSpinButton.visible = false;
            pixiLib.setInteraction(this.quickSpinPanelBtn, false);
        }

    }
    this.addGameView();
};
// Panel.moveVisiblebuyFeature = function(bool){
//     // if(this.BuyFeature){
//         this.BuyFeature.visible = bool;
//     // }
//     // if(this.twoxbetbtn){
//         this.twoxbetbtn.visible = bool;
        
//     // }
// }


Panel.onASBtnClick = function (btn) {
    _mediator.publish("SHOW_TICKER");
    _sndLib.play(_sndLib.sprite.btnClick);
    _mediator.publish("START_AUTOSPIN", btn.text);
    this.toggleAutoSpinOptions(false);
    this.autoSpinButton.visible = false;
    this.autoSpinStopButton.visible = true;
    _mediator.publish("disableBuyFeature");
    if(_viewInfoUtil.viewType!="VD")
        {
            _mediator.publish("ToggleMaxBet",false);
        }
};
panel.quickSpinClick = function(btn){
    _sndLib.play(_sndLib.sprite.btnClick);
    // this.quickEnable.visible = ! this.quickEnable.visible;
    if ( _ng.isQuickSpinActive == true) {
        _mediator.publish("onSloAnimQuickSpinOff");
      
    }
    else if(_ng.isQuickSpinActive == false){
        _mediator.publish("onSloAnimQuickSpinOn");
  
    }
}
panel.turboClick = function(btn){
    _sndLib.play(_sndLib.sprite.btnClick);
    if (_ng.GameConfig.TurboOn) {
        _mediator.publish("onQuickSpinOff");
      
    }
    else if(_ng.isQuickSpinActive == true )
    {
        _mediator.publish("onQuickSpinOn");
    }
    else if(_ng.isQuickSpinActive == false){
        _mediator.publish("onQuickSpinOn");
  
    }
    // this.ToggleTurboFunction();
}

panel.skipScreenClick = function(btn){
    _sndLib.play(_sndLib.sprite.btnClick);
    // btn.children[1].visible = !btn.children[1].visible;
    this.skipScreenEnable.visible = ! this.skipScreenEnable.visible;
    _ng.isSkipBigwinActive = !_ng.isSkipBigwinActive;
    console.log("Skip Big wins: "+ _ng.isSkipBigwinActive);
}
panel.ToggleTurboFunction = function(bool){
    this.turboEnable.visible = bool;
}
panel.ToggleQuickFunction = function(bool){
    this.quickEnable.visible = bool;
}
panel.autoPlayBClick = function(btn){

    // btn.children[1].visible = !btn.children[1].visible;
    // this.hideAutoSpinButton();
    this.onAutoSpinClick();
    _mediator.publish("SHOW_TICKER");
    _sndLib.play(_sndLib.sprite.btnClick);
    _mediator.publish("START_AUTOSPIN",this.value);
    _mediator.publish("updateAutoSpinText",true);
    this.toggleAutoSpinOptions(false);
    this.autoSpinButton.visible = false;
    this.autoSpinStopButton.visible = true;
    _mediator.publish("disableBuyFeature");
    if(_viewInfoUtil.viewType!="VD")
        {
            _mediator.publish("ToggleMaxBet",false);
        }
}
panel.closeAutoSpinPopup= function(btn){
    this.onAutoSpinClick();
    // _mediator.publish("toggleAutoplayPopup",false);
}
Panel.hideAutoSpinButton = function () {
    _mediator.publish("SHOW_TICKER");
    this.autoSpinButton.visible = true;
    this.autoSpinStopButton.visible = false;
    this["asValueBg"].visible = false;
    this["asValue"].visible = false;
    _mediator.publish("enableBuyFeature");
    _mediator.publish("ToggleSpin",true);

}
panel.toggleAutoSpinOptions = function (bool) {
    if (this.autoSpinList) {
        this.autoSpinList.visible = bool;
        if (bool == true) {
            _mediator.publish("toggleBetContainer",false);
            _mediator.publish("HIDE_TICKER");
            _mediator.publish("disableBuyFeature");
        }
        else{
            // _mediator.publish("toggleBetContainer",true);
            _mediator.publish("SHOW_TICKER");
            // _mediator.publish("ToggleSpin",true);
            // _mediator.publish("enableBuyFeature")
        }
    }
};

Panel.ToggleTurbo=function(toggle)
{
    if(this.quickSpinBtnOn){
        // pixiLib.setInteraction(this.quickSpinBtnOn,toggle);
    }
}
Panel.StopButtonStatus=function(active)
{
    if(coreApp.gameModel.isFreeSpinActive())
        {
            //pixiLib.setInteraction(this.stopButton, false);
        }
        else{
    pixiLib.setInteraction(this.stopButton, active);
        }
}

Panel.updateWin = function (win) {
    if (this.winField && win >= 0) {
        // this.winField.setValue(win);
        // this.updateTextWithCountUp(win,250,this.winField.value);
        _mediator.publish("updateTextWithCountUp",win,250,this.winField.value);
    }

    if (win === "") {
        pixiLib.setText(this.winField.value, "");
    }

};
// Panel.freeSpinCount = function (num) {
//     this.FreespinButton.visible = true;
//     if(this.fscount){
//         pixiLib.setText(this.fscount,num); 
//     }
//     else{
//         var style = {
//             dropShadow: true,
//             dropShadowColor: "#ef0aff",
//             fill: "#ffffff",
//             fontFamily: "Arial",
//             fontSize: 45,
//             fontWeight: "bold",
//             stroke: "#700067",
//             strokeThickness: 3
//         }
//         this.fscount = pixiLib.getElement("Text",style);
//         this.fscount.anchor.set(0.5);
//         this.fscount.x=1;
//         this.fscount.y =23;
//         pixiLib.setText(this.fscount,num);
//         this.FreespinButton.addChild(this.fscount);
//     }
    
// }
Panel.bringspinbtnback = function(){
    this.FreespinButton.visible = false;
}
Panel.onBetMaxClicked = function () {
    _mediator.publish("panelClick");
    if(this.maxToggle==false)
        {this.maxToggle=true;
            this.oldCoinindex=this.coinValue.getCurrentIndex();
            this.oldLineindex=this.lineValue.getCurrentIndex();
            if (this.coinValue) {
                this.coinValue.setMaxIndex();
            }
            if (this.lineValue) {
                this.lineValue.setMaxIndex();
            }
            _sndLib.play(_sndLib.sprite.maxbetButtonNewClick);
            // pixiLib.setInteraction(this.betMaxButton, false);
            _mediator.publish("coinValueUpdated", { index: this.coinValue.getCurrentIndex() });
            _mediator.publish("lineValueUpdated", { index: this.lineValue.getCurrentIndex() });
            _mediator.publish("hideGambleButtonOnClick");
            _mediator.publish("totalBetUpdated");
            this.onHideAutoSpin();
        }
        else{
            this.maxToggle=false;
            this.coinValue.setDefaultIndex(this.oldCoinindex);
            this.lineValue.setDefaultIndex(this.oldLineindex);
            this.coinValue.setValue();
            this.lineValue.setValue();
            _sndLib.play(_sndLib.sprite.maxbetButtonNewClick);
            _mediator.publish("coinValueUpdated", { index: this.coinValue.getCurrentIndex() });
            _mediator.publish("lineValueUpdated", { index: this.lineValue.getCurrentIndex() });
            _mediator.publish("hideGambleButtonOnClick");
            _mediator.publish("totalBetUpdated");
        }
   
};

Panel.checkMaxBetState = function () {
    if (this.betMaxButton) {
        var isMaxBet = true;
        this.maxToggle=true;
        if (this.coinValue && (this.coinValue.getCurrentIndex() !== this.coinValue.getMaxIndex())) {
            isMaxBet = false;
            this.maxToggle=false;
        }
        if (this.lineValue && (this.lineValue.getCurrentIndex() !== this.lineValue.getMaxIndex())) {
            isMaxBet = false;
            this.maxToggle=false;
        }
        pixiLib.setInteraction(this.betMaxButton,true);
    }
};


Panel.createMiniAutoSpinOptions = function () {
    if (_ng.GameConfig.panelConfig.data) {
        this.asData = _ng.GameConfig.panelConfig.data.autoSpinList;
    }
    this.autoSpinList = pixiLib.getElement();
    this.autoSpinList.name = "autoSpinList";
    this.autoSpinList.interactive=true;
    // this.autoSpinList.pivot.set(-266, -31);

    
    // this.spinControls.addChildAt(this.autoSpinList, 7);
    coreApp.gameView.panelContainer.addChild(this.autoSpinList);

    this.asBg = pixiLib.getElement("Sprite", this.asData.bg.image);
    this.autoSpinList.addChild(this.asBg);
    
    this.closebutton = pixiLib.getButton(this.asData.autoPlayClose.image);
    this.asBg.addChild(this.closebutton);
    pixiLib.addEvent(this.closebutton,this.closeAutoSpinPopup.bind(this, this.closebutton));

    this.title = pixiLib.getElement("Text",this.asData.title.textStyle);
    pixiLib.setText(this.title,this.asData.title.text);
    this.asBg.addChild(this.title);
    this.value = 10;

    this.autoplayButton = pixiLib.getElement("Sprite",this.asData.autoplayButton.image);
    this.asBg.addChild(this.autoplayButton);
    pixiLib.setInteraction(this.autoplayButton, true);
    pixiLib.addEvent(this.autoplayButton, this.autoPlayBClick.bind(this, this.autoplayButton));

    this.autoplayText = pixiLib.getElement("Text",this.asData.autoplayButton.children.textValue.props.textStyle);
    this.autoplayButton.addChild(this.autoplayText);
    pixiLib.setText(this.autoplayText, gameLiterals.startauto + "(" + this.value + ")");

    this.sliderOff = pixiLib.getElement("Sprite",this.asData.sliderOff.img);
    this.asBg.addChild(this.sliderOff);
    this.sliderOff.name = "SliderOff";
    this.sliderOff.interactive = true;
    this.sliderOff.buttonMode = true;
    this.sliderOff.on("pointerdown", function(event)
    {
        var positions = event.data.getLocalPosition(this.parent);
        console.log(positions.x);
        
        _mediator.publish("adjustPosition",positions.x);
        
    });

    this.sliderContainer = pixiLib.getContainer();
    this.asBg.addChild(this.sliderContainer);

    this.sliderOn = pixiLib.getElement("Sprite",this.asData.sliderOn.img);
    this.sliderContainer.addChild(this.sliderOn);
    this.sliderOn.name = "SliderOn";

    //this.sliderOnMask = pixiLib.getElement("Sprite",this.asData.sliderOn.img);
    this.sliderOnMask =  pixiLib.getShape("rect", { w: this.sliderOn.width, h: this.sliderOn.height });
    this.sliderContainer.addChild(this.sliderOnMask);
    this.sliderOnMask.name = "SliderOnMask";
    this.sliderContainer.mask = this.sliderOnMask;

    this.sliderButton = pixiLib.getElement("Sprite",this.asData.sliderButton.img);
    this.asBg.addChild(this.sliderButton);
    pixiLib.setInteraction(this.sliderButton,true);
    this.sliderX = this.asData.sliderButton.props[_viewInfoUtil.viewType].x;

    this.sliderButton.on("pointerdown", function(event)
        {
            this.startDrag = true;
            this.data = event.data;
            this.alpha = .9;
        });
    this.sliderButton.on("pointerup", function()
        {
            this.startDrag = false;
            this.data = null;
            this.alpha = 1;
        });
    this.sliderButton.on("pointerupoutside", function()
        {
            this.startDrag = false;
            this.data = null;
            this.alpha = 1;
        });
    this.sliderButton.on("pointercancel", function()
        {
            this.startDrag = false;
            this.data = null;
            this.alpha = 1;
        });
    this.sliderButton.on("pointermove", function(event)
        {
            if(this.startDrag)
            {
                var newPosition = event.data.getLocalPosition(this.parent);
                if(newPosition.x < 495 && newPosition.x > 95)
                {   
                    _mediator.publish("adjustPosition",newPosition.x);
                }
                
                if( newPosition.x <= (95))
                {
                    // self.moveContainerTo(0);
                    _mediator.publish("moveContainerTo",0);
                    this.x = 95;
                    // this.sliderOnMask.x = -313;
                }
                if( newPosition.x >= 495)
                {
                    // self.moveContainerTo(415);
                    _mediator.publish("moveContainerTo",505);
                    this.x = 495;
                    // this.sliderOnMask.x = 102;
                }
            }
        });

    this.maxSpin = pixiLib.getElement("Text",this.asData.maxSpin.props.textStyle);
    this.asBg.addChild(this.maxSpin);
    pixiLib.setText(this.maxSpin,this.autoSpinNums[0]);

    this.quickSpinButton = pixiLib.getElement("Sprite", this.asData.quickSpinButton.image);
    this.asBg.addChild(this.quickSpinButton);
    pixiLib.setInteraction(this.quickSpinButton, true);
    pixiLib.addEvent(this.quickSpinButton, this.quickSpinClick.bind(this, this.quickSpinButton));

    this.turboSpinButton = pixiLib.getElement("Sprite", this.asData.quickSpinButton.image);
    this.asBg.addChild(this.turboSpinButton);
    pixiLib.setInteraction(this.turboSpinButton, true);
    pixiLib.addEvent(this.turboSpinButton, this.turboClick.bind(this, this.turboSpinButton));
    this.turboSpinButton.hitArea = new PIXI.Rectangle(0,10, 150, 50);

    this.skipScreenSpinButton = pixiLib.getElement("Sprite", this.asData.quickSpinButton.image);
    this.asBg.addChild(this.skipScreenSpinButton);
    pixiLib.setInteraction(this.skipScreenSpinButton, true);
    pixiLib.addEvent(this.skipScreenSpinButton, this.skipScreenClick.bind(this, this.skipScreenSpinButton));
    this.skipScreenSpinButton.hitArea = new PIXI.Rectangle(0,10, 150, 50);

    this.quickspintxt = pixiLib.getElement("Text",this.asData.quickSpinButton.children.textValue.props.textStyle);
    pixiLib.setText(this.quickspintxt,this.asData.quickSpinButton.children.textValue.props.text);
    this.quickSpinButton.addChild(this.quickspintxt);
    // this.quickSpinButton.visible =false;

    this.turbospintxt = pixiLib.getElement("Text",this.asData.turboSpinButton.children.textValue.props.textStyle);
    pixiLib.setText(this.turbospintxt,this.asData.turboSpinButton.children.textValue.props.text);
    this.turboSpinButton.addChild(this.turbospintxt);

    this.skipspintxt = pixiLib.getElement("Text",this.asData.skipScreenSpinButton.children.textValue.props.textStyle);
    pixiLib.setText(this.skipspintxt,this.asData.skipScreenSpinButton.children.textValue.props.text);
    this.skipScreenSpinButton.addChild(this.skipspintxt);
    // this.skipScreenSpinButton.visible =false;

    this.quickEnable = pixiLib.getElement("Sprite",this.asData.quickSpinButton.children.tickOn.image);
    this.quickSpinButton.addChild(this.quickEnable);
    this.quickEnable.visible = false;

    this.turboEnable = pixiLib.getElement("Sprite",this.asData.quickSpinButton.children.tickOn.image);
    this.turboSpinButton.addChild(this.turboEnable);
    this.turboEnable.visible = false;

    this.skipScreenEnable = pixiLib.getElement("Sprite",this.asData.quickSpinButton.children.tickOn.image);
    this.skipScreenSpinButton.addChild(this.skipScreenEnable);
    this.skipScreenEnable.visible = false;

    if (this.spinCtrlBg) {
        this.spinControls.addChildAt(this.spinCtrlBg, 0);
    }
}
panel.adjustPosition = function(newPositionX) {
    const steps = [95,152, 209, 266, 323, 380, 437,495];
    let closestStep = steps[0];
    for (let i = 0; i < steps.length; i++) {
        if (Math.abs(newPositionX - steps[i]) < Math.abs(newPositionX - closestStep)) {
            closestStep = steps[i];
        }
    }
    if (newPositionX > 95 && newPositionX < 495) {
        this.sliderButton.x = closestStep;
        _mediator.publish("moveContainerTo", this.sliderButton.x);
    }
    if (newPositionX <= 95) {
        this.sliderButton.x = closestStep;
        _mediator.publish("moveContainerTo", this.sliderButton.x);
    }
    if (newPositionX >= 495) {
        this.sliderButton.x = closestStep;
        _mediator.publish("moveContainerTo", this.sliderButton.x);
    }
    this.sliderX = this.sliderButton.x;
}
panel.updateAutoSpinText = function(active){
    if (active == true && this.autoSpinTxt) {

        this.autoSpinTxt.style = new PIXI.TextStyle({
            fontFamily: 'ProximaNova_Bold',
            fontSize: 18,
            fill: '#ED4310',
        }); 
        // this.spinControls.children[9].visible = false;
    }
    else if(this.autoSpinTxt){
        this.autoSpinTxt.style = new PIXI.TextStyle({
            fontFamily: 'ProximaNova_Bold',
            fontSize: 18,
            fill: '#ffffff',
        }); 
        // this.spinControls.children[9].visible = true;
    }
}
panel.moveContainerTo = function(x) {
    if(_viewInfoUtil.viewType == "VD"){
        this.sliderOnMask.x = x - 410;
    }
    else if(_viewInfoUtil.viewType == "VL"){
        this.sliderOnMask.x = x - 425;
    }
    else if(_viewInfoUtil.viewType == "VP"){
        this.sliderOnMask.x = x - 487;
    }

    if (x <= 95) {
        pixiLib.setText(this.maxSpin, this.autoSpinNums[0]);
        pixiLib.setText(this.autoplayText, gameLiterals.startauto + "(" + this.autoSpinNums[0] + ")");
        this.value = this.autoSpinNums[0];
    }
    else if (x > 95   && x <= 161) {
        pixiLib.setText(this.maxSpin, this.autoSpinNums[1]);
        pixiLib.setText(this.autoplayText, gameLiterals.startauto + "(" + this.autoSpinNums[1] + ")");
        this.value = this.autoSpinNums[1];
    }
    else if (x > 161 && x <= 227) {
        pixiLib.setText(this.maxSpin, this.autoSpinNums[2]);
        pixiLib.setText(this.autoplayText, gameLiterals.startauto + "(" + this.autoSpinNums[2] + ")");
        this.value = this.autoSpinNums[2];
    }
    else if (x > 227 && x <= 293) {
        pixiLib.setText(this.maxSpin, this.autoSpinNums[3]);
        pixiLib.setText(this.autoplayText, gameLiterals.startauto + "(" + this.autoSpinNums[3] + ")");
        this.value = this.autoSpinNums[3];
    }
    else if (x > 293 && x <= 359) {
        pixiLib.setText(this.maxSpin, this.autoSpinNums[4]);
        pixiLib.setText(this.autoplayText, gameLiterals.startauto + "(" + this.autoSpinNums[4] + ")");
        this.value = this.autoSpinNums[4];
    }
    else if (x > 359 && x <= 425) {
        pixiLib.setText(this.maxSpin, this.autoSpinNums[5]);
        pixiLib.setText(this.autoplayText, gameLiterals.startauto + "(" + this.autoSpinNums[5] + ")");
        this.value = this.autoSpinNums[5];
    }
    else if (x > 425 && x < 495) {
        pixiLib.setText(this.maxSpin, this.autoSpinNums[6]);
        pixiLib.setText(this.autoplayText, gameLiterals.startauto + "(" + this.autoSpinNums[6] + ")");
        this.value = this.autoSpinNums[6];
    }
    else if (x >= 495 ) {
        pixiLib.setText(this.maxSpin, this.autoSpinNums[7]);
        pixiLib.setText(this.autoplayText, gameLiterals.startauto + "(" + this.autoSpinNums[7] + ")");
        this.value = this.autoSpinNums[7];
    }
};
Panel.onResize = function () {
    pixiLib.setText(this.maxSpin, 10);
    if (_viewInfoUtil.viewType === "VD") {
        if (this.betPopupContainer) {
            this.betPopupContainer.position.set(540,320);    
        }     
    }
    else if(_viewInfoUtil.viewType === "VL"){
        if (this.betPopupContainer) {
            this.betPopupContainer.position.set(360,200);    
        } 
        if(this.grayBgbetPopup)
            this.grayBgbetPopup.y = -1350; 
    }
    else if (_viewInfoUtil.viewType === "VP") {
        if (this.betPopupContainer) {
            this.betPopupContainer.position.set(200,640);    
        }  
        if(this.grayBgbetPopup)
            this.grayBgbetPopup.y = -2000; 
    }
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
        pixiLib.setProperties(this.closebutton, this.asData.autoPlayClose.props[_viewInfoUtil.viewType]);
        pixiLib.setProperties(this.title, this.asData.title.props[_viewInfoUtil.viewType]);
        pixiLib.setProperties(this.autoplayButton, this.asData.autoplayButton.props[_viewInfoUtil.viewType]);
        pixiLib.setProperties(this.autoplayText, this.asData.autoplayButton.children.textValue.props[_viewInfoUtil.viewType]);

        pixiLib.setProperties(this.sliderOff, this.asData.sliderOff.props[_viewInfoUtil.viewType]);
        pixiLib.setProperties(this.sliderOn, this.asData.sliderOn.props[_viewInfoUtil.viewType]);
        pixiLib.setProperties(this.sliderOnMask, this.asData.sliderOnMask.props[_viewInfoUtil.viewType]);
        pixiLib.setProperties(this.sliderButton, this.asData.sliderButton.props[_viewInfoUtil.viewType]);

        pixiLib.setProperties(this.quickspintxt,this.asData.quickSpinButton.children.textValue.props[_viewInfoUtil.viewType]);
        pixiLib.setProperties(this.turbospintxt,this.asData.turboSpinButton.children.textValue.props[_viewInfoUtil.viewType]);
        pixiLib.setProperties(this.skipspintxt,this.asData.skipScreenSpinButton.children.textValue.props[_viewInfoUtil.viewType]);
        pixiLib.setProperties(this.quickSpinButton,this.asData.quickSpinButton.props[_viewInfoUtil.viewType]);
        pixiLib.setProperties(this.turboSpinButton,this.asData.turboSpinButton.props[_viewInfoUtil.viewType]);
        pixiLib.setProperties(this.skipScreenSpinButton,this.asData.skipScreenSpinButton.props[_viewInfoUtil.viewType]);
        pixiLib.setProperties(this.quickEnable,this.asData.quickSpinButton.children.tickOn.props[_viewInfoUtil.viewType]);
        pixiLib.setProperties(this.turboEnable,this.asData.turboSpinButton.children.tickOn.props[_viewInfoUtil.viewType]);
        pixiLib.setProperties(this.skipScreenEnable,this.asData.skipScreenSpinButton.children.tickOn.props[_viewInfoUtil.viewType]);
        pixiLib.setProperties(this.maxSpin,this.asData.maxSpin.props[_viewInfoUtil.viewType]);
        pixiLib.setProperties(this.sliderContainer,this.asData.sliderContainer.props[_viewInfoUtil.viewType]);
        this.sliderButton.x = this.sliderX;
        _mediator.publish("moveContainerTo", this.sliderX);
    }
    this.onGameSpecificResize();



        if(_viewInfoUtil.viewType=="VP" ){
        // this.amtTxt.visible =true;
    
        // this.twoxbetamt.visible =true;
      
        // this.tickOn.visible =true;
        
        // this.twoxOn.visible =true;
        
        // this.offIcon.visible =true;
       
        // this.twoxoff.visible =true;
        this.enabledPanelFs();
        // if(_ng.twoXBetEnabled){
        //     this.twoxoff.visible = false;
        // }

  
    }
    else if(_viewInfoUtil.viewType=="VL"){
        // _mediator.publish("toggleLand");
        // this.amtTxt.visible =false;
        // this.twoxbetamt.visible =false;
        // this.tickOn.visible =false;
        // this.twoxOn.visible =false;
        // this.offIcon.visible =false;
        // this.twoxoff.visible =false;
    }
    _mediator.publish("onTickerResize");
};

Panel.onStopSpinClicked = function () {
    _mediator.publish("panelClick");
    // this.spinSpine.state.setAnimation(1, "Stop", true);
    if(_viewInfoUtil.viewType=="VP" ||_viewInfoUtil.viewType=="VL")
        {
            console.log("Force Stop on click");
         _mediator.publish("toggleStopSpinBg",false)
        }
       //SID UNCOMMIT
   _mediator.publish("toggleForce",true);
    if (this.isstopSpinSndPlaying) {
        // _sndLib.stop(_sndLib.sprite.spinStopBtn);
        _sndLib.play(_sndLib.sprite.spinStopBtn);
        this.isstopSpinSndPlaying = false;
    }
    _mediator.publish("STOP_SPIN_NOW");
    this.stopButton.visible = false;
    this.onHideAutoSpin();
};
Panel.onSpinClick = function () {
    // Block spin if PFS is active or ended (waiting for user to close popup)
    if (coreApp && coreApp.gameModel && (coreApp.gameModel.getIsPFSActive() || (coreApp.gameModel.PFSData && coreApp.gameModel.PFSData.isPFSEnded))) {
        return;
    }
   
    _sndLib.play(_sndLib.sprite.spinStartBtn);
    _mediator.publish("spinClick");
    this.onHideAutoSpin();
    // if (this.spinSpine) {
    //     this.spinSpine.state.setAnimation(1, "animation", true);

    // }
}
Panel.MakeTrueAtSpin = function(){
    this.isstopSpinSndPlaying=true;
}

//new

Panel.createBetPopup = function(status){

    var width = 1400;
    var height = 800;

    if (this.betPopupContainer) {
        this.betPopupContainer.visible = true;

    }else{
        
        this.popupContainerArr = [];
        var betPanelContentArr = [gameLiterals.totalbet]; //if need, add COIN VALUE AND TOTAL BET field here
       
        this.betPopupContainer = pixiLib.getContainer();
        this.betPopupContainer.name = "betPopupContainer";
        this.slotView.panelContainer.addChild(this.betPopupContainer);

        if(_viewInfoUtil.device == "Mobile") {
            width = 5000;
            height = 5000;
        }

        this.grayBgbetPopup = pixiLib.getShape("rect", { w: width, h: height});
        this.grayBgbetPopup.alpha = 0.3;
        this.grayBgbetPopup.x = -1102;
        this.grayBgbetPopup.y = -626;
        this.grayBgbetPopup.interactive = true;
        this.grayBgbetPopup.buttonMode = true;
        this.grayBgbetPopup.name = "grayBgbetPopup";
        this.betPopupContainer.addChild(this.grayBgbetPopup);

        pixiLib.addEvent(this.grayBgbetPopup, function() {
            this.betPopupContainer.visible = false;
            _mediator.publish("enableBuyFeature");     //After closing bet popup -enabling buy feature container.
            _mediator.publish("closeBuyFSPopup");
            _mediator.publish("ToggleSpin",true);
            _mediator.publish("checkBalanceForBuyFeature");
        }.bind(this)
        );

        if (_viewInfoUtil.viewType === "VD") {
            this.betPopupContainer.position.set(1050,465);
            this.betPopScaleX = 1;
            this.betPopScaleY = 1;
        }
        else if(_viewInfoUtil.viewType === "VL"){
            this.betPopScaleX = 0.8;
            this.betPopScaleY = 0.8;
            this.betPopupContainer.scale.set(0.5);
            this.betPopupContainer.position.set(_viewInfoUtil.getWindowWidth() / 2,_viewInfoUtil.getWindowHeight()/2);
        }
        else if (_viewInfoUtil.viewType === "VP") {
            this.betPopScaleX = 0.8;
            this.betPopScaleY = 0.8;
            this.betPopupContainer.scale.set(0.5);
            this.betPopupContainer.position.set(_viewInfoUtil.getWindowWidth() / 2,_viewInfoUtil.getWindowHeight()/2);
        }
        if(pixiLib.isIpad())
            this.betPopupContainer.scale.set(0.8);
     
        this.betBaseBg = pixiLib.getElement("Sprite","betpanel_bg");
        this.betBaseBg.anchor.set(0.5);
        this.betPopupContainer.addChild(this.betBaseBg);
        this.betBaseBg.scale.set(1 ,0.5);
        this.betBaseBg.interactive = true;
     
        this.closeBtn = pixiLib.getButton("betclose");
        this.closeBtn.anchor.set(0.5);
        this.betPopupContainer.addChild(this.closeBtn);
        this.closeBtn.position.set(111,-93);
        pixiLib.addEvent(this.closeBtn,this.onCloseBtn.bind(this));
        
     
        for (let index = 0; index < betPanelContentArr.length; index++) {
            var popupContainerData = this.createContainerData(index, betPanelContentArr[index]);
            this.betPopupContainer.addChild(popupContainerData);
            popupContainerData.position.set(0,index*200);
            this.popupContainerArr.push(popupContainerData);
           
        }
        if(this.coinValue.plusButton)
        {
            pixiLib.addEvent(this.coinValue.plusButton, this.toggleBetContainer.bind(this, true));
            pixiLib.addEvent(this.coinValue.minusButton, this.toggleBetContainer.bind(this, true));
        }
        this.betPopupContainer.scale.set(this.betPopScaleX,this.betPopScaleY);
        // TweenMax.to(this.betPopupContainer.scale,.2, {
        // /* width: this.BuypopupPanelCon.width+550,
        // height: this.BuypopupPanelCon.height+450, */
        // x: this.betPopScaleX,
        // y: this.betPopScaleY,
        // ease: "none",
        // });
    }
    if(status)
        this.betPopupContainer.visible = false;
}
panel.toggleBetContainer = function(value){
    if (this.betPopupContainer) {
        this.betPopupContainer.visible = value;
    }
}
Panel.createContainerData = function(index , dataVal){
    var betContainer = pixiLib.getContainer();
    betContainer.name = "Panel Bet Container";
   
    var style = {
        "fill": "0xffffff",
        "fontSize": 30,
        "fontFamily": "ProximaNova_Bold",
         "maxWidth": 110,     
    }
    this.betText = pixiLib.getElement("Text",style);
    betContainer.addChild(this.betText);
    this.betText.anchor.set(0.5);
    this.betText.position.set(0,-49);
    pixiLib.setText(this.betText,dataVal);
 
 
    this.minusButton = pixiLib.getButton("betMinus");
    this.minusButton.anchor.set(0.5);
    this.minusButton.position.set(-105,0);
    this.minusButton.scale.set(0.5);
    betContainer.addChild(this.minusButton);
    if(!this.coinValue)
    {
        var valumeParams = {params :{
            "element": "coinValue",
            "props": {
                "VD": {
                    "x": 120,
                    "y": 657
                },
                "VP": {
                    "x": 120,
                    "y": 657
                },
                "VL": {
                    "x": 120,
                    "y": 657
                }
            },
            "value": {
                "valueStyle": {
                    "fontStyle": "bold",
                    "fontSize": 1,
                    "fontFamily": "ProximaNova_Bold",
                    "lineJoin": "round",
                    "fill": "#FFFFFF",
                    "stroke": "#391400",
                    "strokeThickness": 8,
                    "align": "center",
                    "wordWrapWidth": 60
                },
                "props": {
                    "VD": {
                        "x": 48,
                        "y": 25,
                        "anchor": 0.5
                    },
                    "VL": {},
                    "VP": {}
                }
            }
        }
        }
        this.coinValue = new _ng["PanelValueSelector"](valumeParams, betContainer);
    }
    if(this.coinValue)
    {
        pixiLib.addEvent(this.minusButton, this.coinValue.selectPrevious.bind(this.coinValue));
        pixiLib.addEvent(this.minusButton, this.coinMinus.bind(this));
    }
 
    this.betBase = pixiLib.getElement("Sprite","betValueBase");
    this.betBase.anchor.set(0.5);
    this.betBase.position.set(0,0);
    betContainer.addChild(this.betBase);
 
    this.betBaseValue = pixiLib.getElement("Text",style);
    this.betBase.addChild(this.betBaseValue);
    this.betBaseValue.anchor.set(0.5);
    this.betBaseValue.position.set(0,0);
    if(dataVal == "TOTAL BET")
    pixiLib.setText(this.betBaseValue,coreApp.gameModel.getTotalBet());
    else
    pixiLib.setText(this.betBaseValue,"1");
 
    this.plusButton = pixiLib.getButton("betPlus");
    this.plusButton.name = "plusButton";
    this.plusButton.anchor.set(0.5);
    this.plusButton.position.set(105,0);
    this.plusButton.scale.set(0.5);
    betContainer.addChild(this.plusButton);
    pixiLib.setInteraction(this.plusButton,true);
    if(this.coinValue)
    {
        pixiLib.addEvent(this.plusButton, this.coinValue.selectNext.bind(this.coinValue));
        pixiLib.addEvent(this.plusButton, this.coinPlus.bind(this));
    }
 
    this.maxBetButtonNew = pixiLib.getButton("betMax");
    this.maxBetButtonNew.name = "maxBetButtonNew";
    this.maxBetButtonNew.anchor.set(0.5);
    this.maxBetButtonNew.position.set(0,88);
    this.maxBetButtonNew.scale.set(1);
    this.betPopupContainer.addChild(this.maxBetButtonNew);
    pixiLib.addEvent(this.maxBetButtonNew, this.onBetMaxClick.bind(this));
    pixiLib.addEvent(this.maxBetButtonNew, function(){this.coinValue.setMaxIndex()}.bind(this));
    /**
     * For toggle, use this.checkMaxBetState
     * To Disable. use this.disablePopupMaxbet
     */
    pixiLib.addEvent(this.maxBetButtonNew, this.disablePopupMaxbet.bind(this));
 
    this.maxBetText = pixiLib.getElement("Text",style);
    this.maxBetButtonNew.addChild(this.maxBetText);
    this.maxBetText.anchor.set(0.5);
    this.maxBetText.position.set(0,0);
    pixiLib.setText(this.maxBetText,gameLiterals.maxbetText);
 
    betContainer._betBaseValue = this.betBaseValue;
    betContainer._plus = this.plusButton;
 
    return betContainer;
 
}

Panel.onCloseBtn = function(){
    this.betPopupContainer.visible = false;
    _mediator.publish("enableBuyFeature");     //After closing bet popup -enabling buy feature container.
    _mediator.publish("closeBuyFSPopup");
    _mediator.publish("ToggleSpin",true);
    _mediator.publish("checkBalanceForBuyFeature");
}

Panel.updatePopupBet = function (value) {
  var popupBet = pixiLib.getFormattedAmount(value);
  if (this.betBaseValue) {
    pixiLib.setText(this.betBaseValue,popupBet); 
  }
  this.checkButtonState();
}

Panel.checkButtonState = function(){
    if(this.minusButton){
        pixiLib.setInteraction(this.minusButton, true);
    }
    if(this.plusButton){
        pixiLib.setInteraction(this.plusButton, true);
    }
    if(this.maxBetButtonNew) {
        _mediator.publish("enablePopupMaxbet");
    }
    _mediator.publish("settingsPlusBetInteraction",true);
    _mediator.publish("settingsMinusBetInteraction",true);
    _mediator.publish("settingsPlusBetInteractionMobile",true);
    _mediator.publish("settingsMinusBetInteractionMobile",true);
    _mediator.publish("selectorPlusInteraction",true);
    _mediator.publish("selectorMinusInteraction",true);
    
    if(this.coinValue.currentIndex === 0){
        if(this.minusButton){
            pixiLib.setInteraction(this.minusButton, false);
        }
        _mediator.publish("selectorMinusInteraction",false);
        _mediator.publish("settingsMinusBetInteraction",false);
        _mediator.publish("settingsMinusBetInteractionMobile",false);

    }
    if(this.coinValue.currentIndex === this.coinValue.options.length - 1){
        _mediator.publish("disablePopupMaxbet");
        if(this.plusButton){
		    pixiLib.setInteraction(this.plusButton, false);
        }
        _mediator.publish("selectorPlusInteraction",false);
        _mediator.publish("settingsPlusBetInteraction",false);
        _mediator.publish("settingsPlusBetInteractionMobile",false);
    }
}

Panel.setValue = function(str){
    _ng._currentBetAmount = str;
    if(str !== undefined){
        pixiLib.setText(this.value, str);
    }else{
        var optionValue = this.options[this.currentIndex];
        if(this.params.valueFormatter !== undefined){
            optionValue = pixiLib[this.params.valueFormatter](optionValue);
        }
        pixiLib.setText(this.value, optionValue);
        this.checkButtonState();
    }
}

panel.enablePopupMaxbet = function() {
    pixiLib.setInteraction(this.maxBetButtonNew, true);
}

panel.disablePopupMaxbet = function() {
    
    pixiLib.setInteraction(this.maxBetButtonNew, false);
    pixiLib.setInteraction(this.plusButton, false);    //disabling plus button.
    pixiLib.setInteraction(this.minusButton, true);    //enabling minus button.
}

Panel.onGameSpecificResize = function () {

    if (this.betPopupContainer) {
        let scale = 0.8;
        let divY,divX;

        if(pixiLib.isIpad())
            scale = 0.9;
        if (_viewInfoUtil.viewType === "VL") {
          divX = 2;
          divY = 2;
        } else if (_viewInfoUtil.viewType === "VP") {
          divX = 2;
          divY = 2;
        } else {
          return;
        }
      
        this.betPopupContainer.scale.set(scale);
        this.betPopupContainer.position.set(_viewInfoUtil.getWindowWidth() / divX, _viewInfoUtil.getWindowHeight()/divY);
    }

    if(_viewInfoUtil.viewType === "VL") {
        if(this.autoSpinList) {
            this.autoSpinList.pivot.set(-266, -31);
            this.autoSpinList.position.set(_viewInfoUtil.getWindowWidth() / 2 , _viewInfoUtil.getWindowHeight() / 2);
        }
    } else if(_viewInfoUtil.viewType === "VP") {
        if(this.autoSpinList) {
            this.autoSpinList.pivot.set(-61, -183);
            this.autoSpinList.position.set(_viewInfoUtil.getWindowWidth() / 2 , _viewInfoUtil.getWindowHeight() / 2);
        }
    }
}

//for Setting total bet plus and minus
panel.callingPanelValueIncrementFn = function () {
    this.coinValue.selectNext();
    this.coinPlus();
}

panel.callingPanelValueDecrementFn = function () {
    this.coinValue.selectPrevious();
    this.coinMinus();
};

panel.onAutoSpinStopClick = function () {
    this.hideAutoSpinButton();
    _sndLib.play(_sndLib.sprite.autoSpinBtnClick)
    if(_ng.GameConfig.TurboOn)
        {
            _ng.GameConfig.FastAnim=false;
            _ng.isQuickSpinActive = false;
        }
    _mediator.publish("stopAutoSpin");
    _mediator.publish("panelClick");
    _ng.autoPlayBeforeFg = false;
    _ng.autoPlayPrevCount = 0;
    if (coreApp.gameController.allReelsStopped != true) {
        if (this.autoSpinButton) {
            pixiLib.setInteraction(this.autoSpinButton, false);
        }
    }
}

panel.showAutoStopBtn = function() {
    if(this.autoSpinButton)
        this.autoSpinButton.visible = false;
    // Don't show autoSpinStopButton during PFS
    if (coreApp.gameModel.getIsPFSActive && coreApp.gameModel.getIsPFSActive()) {
        return;
    }
    if(this.autoSpinStopButton) {
        this.autoSpinStopButton.visible = true;
        pixiLib.setInteraction(this.autoSpinStopButton, true);
    }
}

panel.checkBuyFgStatus = function() {
   if(coreApp.gameModel.isFreeSpinActive()) {
        pixiLib.setInteraction(this.spinButton, false);
   }
}

panel.createBuyPanel_VP = function(e) {

    const superstyle0 = new PIXI.TextStyle({
		dropShadowAlpha: 0.2,
		dropShadowColor: "#702323",
		dropShadowDistance: 0,
		fill: "#fcfcfc",
		fontFamily: "Tahoma",
		fontSize: 26,
		fontWeight: "bold",
		lineJoin: "bevel",
		miterLimit: 4,
		stroke: "#d63d3d",
		strokeThickness: 7
	 });

     const superstyle1 = new PIXI.TextStyle({
		dropShadowAlpha: 0.2,
		dropShadowColor: "#702323",
		dropShadowDistance: 0,
		fill: "#fcfcfc",
		fontFamily: "Tahoma",
		fontSize: 34,
		fontWeight: "bold",
		lineJoin: "bevel",
		miterLimit: 4,
		stroke: "#d63d3d",
		strokeThickness: 7
	 });

    this.buyText_VP = pixiLib.getElement("Text",superstyle0);
	this.buyText_VP.position.set(0,-35);
	e.children[1].addChild(this.buyText_VP);
	this.buyText_VP.anchor.set(0.5);
	pixiLib.setText(this.buyText_VP,"BUY")

	this.freespinText_VP = pixiLib.getElement("Text",superstyle0);
	this.freespinText_VP.position.set(0,-3);
	e.children[1].addChild(this.freespinText_VP);
	this.freespinText_VP.anchor.set(0.5);
	pixiLib.setText(this.freespinText_VP,"FREE SPIN");
   
    this.amtTxt = pixiLib.getElement("Text",superstyle1);
    this.amtTxt.name = "buy amount";
    this.amtTxt.position.set(0,30);
    this.amtTxt.anchor.set(0.5);
    pixiLib.setText(this.amtTxt,"1000000")
    e.children[1].addChild(this.amtTxt);
   
    

    this.twoxbetamt = pixiLib.getElement("Text",superstyle1);
    this.twoxbetamt.x=74
    this.twoxbetamt.y=-62.5
    this.twoxbetamt.scale.set(1);
    this.twoxbetamt.anchor.set(0.5);
    pixiLib.setText(this.twoxbetamt,"$2.8");
    e.children[3].addChild(this.twoxbetamt);

    this.tickOn = pixiLib.getElement("Sprite","tick_icon");
    this.tickOn.x=27
    this.tickOn.y=0.5
    this.tickOn.scale.set(1);
    this.twoxOn = pixiLib.getElement("Sprite","on");
    this.twoxOn.x=0
    this.twoxOn.y=67
    this.twoxOn.scale.set(1.5)
    this.twoxOn.interactive = true;
    this.twoxOn.buttonMode = true;
    e.children[3].addChild(this.twoxOn);
    this.twoxOn.addChild(this.tickOn);

    this.offIcon = pixiLib.getElement("Sprite","on_icon");
    this.offIcon.x=-27
    this.offIcon.y=-0.5
    this.offIcon.scale.set(1)
    this.twoxoff = pixiLib.getElement("Sprite","off")
    this.twoxoff.x=0
    this.twoxoff.y=67
    this.twoxoff.scale.set(1.5)
    this.twoxoff.interactive = true;
    this.twoxoff.buttonMode = true;
    e.children[3].addChild(this.twoxoff);
    this.twoxoff.addChild(this.offIcon);

}

panel.hideSpinStop = function (params) {
    if (this.stopButton) {
        //set spacebar event to Idle when allReels are stopped.
        // this.spinSpine.state.setAnimation(1, "Stop", true)
        _mediator.publish("setSpaceBarEvent", "idle");
        this.stopButton.visible = false;
    }
}

// Handle promo state changes to update UI
panel.onPromoStateChanged = function(data) {
    const isPromo = data && data.isPromo === true;
    
    // Update desktop buttons
    if (this.spinButton) {
        this.spinButton.visible = !isPromo;
        this.spinButton.interactive = !isPromo;
        this.spinButton.buttonMode = !isPromo;
        pixiLib.setInteraction(this.spinButton, !isPromo);
    }
    if (this.autoSpinButton) {
        // Don't show autoSpinButton during PFR even when promo state changes
        var isPFR = coreApp.gameModel.getIsPFSActive() || (coreApp.gameModel.PFSData && coreApp.gameModel.PFSData.isPFSEnded);
        this.autoSpinButton.visible = !isPromo && !isPFR;
        this.autoSpinButton.interactive = !isPromo;
        this.autoSpinButton.buttonMode = !isPromo;
        pixiLib.setInteraction(this.autoSpinButton, !isPromo && !isPFR);
    }
    if (this.quickSpinPanelBtn) {
        this.quickSpinPanelBtn.visible = !isPromo;
        this.quickSpinPanelBtn.interactive = !isPromo;
        this.quickSpinPanelBtn.buttonMode = !isPromo;
        pixiLib.setInteraction(this.quickSpinPanelBtn, !isPromo);
    }
    
    // Additional mobile-specific handling
    if (_viewInfoUtil.device === "Mobile") {
        if (this.betButtonParent) {
            this.betButtonParent.visible = !isPromo;
            this.betButtonParent.interactive = !isPromo;
            this.betButtonParent.buttonMode = !isPromo;
        }
        if (this.autoSpinStopButton) {
            // Don't show during PFS even when promo state changes
            var isPFR = coreApp.gameModel.getIsPFSActive() || (coreApp.gameModel.PFSData && coreApp.gameModel.PFSData.isPFSEnded);
            this.autoSpinStopButton.visible = !isPromo && !isPFR;
            this.autoSpinStopButton.interactive = !isPromo;
            this.autoSpinStopButton.buttonMode = !isPromo;
        }
    }
    
    if (this.stopButton) {
        this.stopButton.visible = false;
    }
}

