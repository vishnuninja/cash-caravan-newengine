
var GPanelMob = PanelMobileView.prototype;
GPanelMob.createView = function () {
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
        _ngFluid.call(this.balanceField, this.pConfig.panelContainer.balanceField.params.props_german);
        _ngFluid.call(this.betField, this.pConfig.panelContainer.betField.params.props_german);
        _ngFluid.call(this.winField, this.pConfig.panelContainer.winField.params.props_german);
    }

    this.soundOffButton.visible = false;
    _ng.isQuickSpinActive = false;

    if(this.quickSpinBtnOn) {
        this.quickSpinBtnOff.visible = false;
    }
};

GPanelMob.mobonSoundOffHandler = function (){
    _sndLib.setVolume(1);
   _sndLib.mute(false);
   this.soundOffButton.visible = false;
   this.soundOnButton.visible = true;
}

GPanelMob.mobonSoundOnHandler = function (){
   _sndLib.mute(true);
   this.soundOffButton.visible = true;
   this.soundOnButton.visible = false;
}

GPanelMob.addMobileInteractions = function () {
    this.autoSpinStopButton.visible = false;
    this.betPanelMobileCover.interactive = true;
    this.betPanelMobileCover.buttonMode = false;
    _mediator.subscribe("ToggleMobPanel",this.ToggleSpinControls.bind(this));
    _mediator.subscribe("ToggleMaxBet",this.ToggleMaxBet.bind(this));
    _mediator.subscribe("showMobPanel",this.showMobilePanel.bind(this));
    _mediator.subscribe("hideMobPanel",this.hideMobilePanel.bind(this));
    _mediator.subscribe("onQuickSpinOff",this.onQuickSpinOff.bind(this));
    _mediator.subscribe("onQuickSpinOn",this.onQuickSpinOn.bind(this));
    _mediator.subscribe("onSloAnimQuickSpinOff",this.onSloAnimQuickSpinOff.bind(this));
    _mediator.subscribe("onSloAnimQuickSpinOn",this.onSloAnimQuickSpinOn.bind(this));
    pixiLib.addEvent(this.betButtonParent, this.showMobilePanel.bind(this));
    pixiLib.addEvent(this.betButtonParent, function() {
        _mediator.publish("toggleBetContainer",true);
    }.bind(this)
    );
    pixiLib.addEvent(this.betPanelClose, this.hideMobilePanel.bind(this));
    pixiLib.addEvent(this.autoSpinButton, this.showAutoSpinPanel.bind(this));
    pixiLib.addEvent(this.autoSpinStopButton, this.onAutoSpinStopClickM.bind(this));
    pixiLib.addEvent(this.betPanelMobileCover,function(){ 
        this.hideMobilePanel()
        _mediator.publish("closeBuyFSPopup")
    }.bind(this));
    pixiLib.addEvent(this.paytableBtn,function(){ 
        _mediator.publish("SHOW_PAYTABLE")
    }.bind(this));
    pixiLib.addEvent(this.settingsBtn,function(){ 
        _mediator.publish("SHOW_SETTINGS")
    }.bind(this));
    pixiLib.addEvent(this.infoBtn,function(){ 
        _mediator.publish("SHOW_RULES")
    }.bind(this)); 
    pixiLib.addEvent(this.soundOnButton,function(){ 
        // _mediator.publish("SHOW_SOUND_ON");
        this.mobonSoundOnHandler();
    }.bind(this)); 
    pixiLib.addEvent(this.soundOffButton,function(){ 
        // _mediator.publish("volumeincrese");
        this.mobonSoundOffHandler();
    }.bind(this)); 

    pixiLib.addEvent(this.quickSpinBtnOn, this.onPanelQuickSpinOn.bind(this));
    pixiLib.addEvent(this.quickSpinBtnOff, this.onPanelQuickSpinOff.bind(this));

    _mediator.subscribe("START_AUTOSPIN", this.onStartAutoSpin.bind(this));
};
GPanelMob.onTotalBetUpdated = function (totalBet) {
    if (this.mobilePanelTotalBetValue && _ng.twoXBetEnabled === true) {
        pixiLib.setText(this.mobilePanelTotalBetValue, pixiLib.getFormattedAmount(totalBet*coreApp.gameModel.spinData.antebet));
    }
    else if (this.mobilePanelTotalBetValue) {
        pixiLib.setText(this.mobilePanelTotalBetValue, pixiLib.getFormattedAmount(totalBet));
    }
};
GPanelMob.ToggleSpinControls=function(bool)
{
    if(!coreApp.gameModel.isAutoSpinActive())
        {
           // Don't enable spin button during PFS
           var isPFR = coreApp.gameModel.getIsPFSActive && (coreApp.gameModel.getIsPFSActive() || (coreApp.gameModel.PFSData && coreApp.gameModel.PFSData.isPFSEnded));
           if (isPFR) {
               bool = false;  // Force disable during PFS
           }
           
           this.autoSpinButton.visible = bool;
           this.betButtonParent.visible = bool;
           this.spinButton.visible = bool;
           pixiLib.setInteraction(this.spinButton, bool);  // Disable interaction during PFS
            //    this.stopButton.visible = bool;
            // this.spinControls.alpha= (bool == true)? 1 : 0;
            // this.spinControls.children[0].alpha= (bool == true)? 1 : 0; //spinstart
            this.stopButton.alpha= (bool == true)? 1 : 0; //spinstop
            // this.autoSpinButton.alpha= (bool == true)? 1 : 0.5; //autospin - visual feedback
            // Don't show autoSpinStopButton during PFS
            if (this.autoSpinStopButton && !(coreApp.gameModel.getIsPFSActive && coreApp.gameModel.getIsPFSActive())) {
                this.autoSpinStopButton.visible = false;
            }
            // this.spinControls.children[8].alpha= (bool == true)? 1 : 0; //betbuttonparent
            // this.spinControls.children[12].alpha= (bool == true)? 1 : 0;//autospinbutton
            pixiLib.setInteraction(this.paytableBtn, bool);
            pixiLib.setInteraction(this.infoBtn, bool);
            pixiLib.setInteraction(this.settingsBtn, bool);
            // pixiLib.setInteraction(this.spinControls.children[12], bool);
            // pixiLib.setInteraction(this.spinControls.children[11], bool);
            // this.spinControls.children[this.spinControls.children.length-2].visible=true;
            // this.spinControls.children[this.spinControls.children.length-2].alpha= (bool == true)? 1 : 0;
        }
  
    // if(bool==false)
    //     {
    //         for(var i=0;i<this.spinControls.children.length;i++)
    //         if(this.spinControls.children[i].name=="BuyFeature" ||this.spinControls.children[i].name=="twoxbetbtn"  )
    //             {
    //                 this.spinControls.children[i].visible=true;
    //             }
    //             else if(i<=4)
    //             {
    //                 this.spinControls.children[i].visible=bool;
    //             }
    //     }
    //     else{
    //         for(var i=0;i<this.spinControls.children.length;i++)
    //             {
    //                 if(i<=4)
    //                     {
    //                         this.spinControls.children[i].visible=bool;
    //                     }
    //             }
    //     }
}
GPanelMob.onAutoSpinStopClickM = function () {
    // _ng.currentAutoSpinCount = coreApp.gameModel.getAutoSpinCurrentCount();
    this.hideAutoSpinButton();
    _sndLib.play(_sndLib.sprite.autoSpinBtnClick)
    // _mediator.publish("stopAutoSpin");
    _mediator.publish("panelClick");
    _mediator.publish("ToggleMaxBet",true);
};
GPanelMob.ToggleMaxBet=function(bool)
{
    // this.spinControls.children[this.spinControls.children.length-2].visible=bool;
    this.spinControls.children[this.spinControls.children.length-2].alpha= (bool == true)? 1 : 0;
}
GPanelMob.hideAutoSpinButton = function () {
    // this.autoSpinButton.visible = true;
    this.autoSpinStopButton.visible = false;
    this["asValueBg"].visible = false;
    this["asValue"].visible = false;
    this.addGameView();
}

GPanelMob.showMobilePanel = function (interact=true) {
    // _mediator.publish("hideMenuBtnEvent");
    // _mediator.publish("toggleBetContainer",true);

    _mediator.publish("HIDE_TICKER");
    // this.betPanelMobile.alpha = 0;
    // this.betPanelMobile.visible = true;
    // TweenMax.to(this.betPanelMobile, 0.2, { alpha: 1 });

    // this.betPanelMobileCover.alpha = 0;
    // this.betPanelMobileCover.visible = true;
    // // if(interact)
    // //     {
    // //         this.betPanelMobileCover.interactive=interact;
    // //     }
    // //     else
    // //     {
    // //         this.betPanelMobileCover.interactive=interact;
    // //     }
    // TweenMax.to(this.betPanelMobileCover, 0.2, { alpha: 0.8 });
    this.hideGambleButton();
    _mediator.publish("panelClick");
    _sndLib.play(_sndLib.sprite.maxbetBtnClick);
    this.onHideAutoSpin();
};

GPanelMob.hideMobilePanel = function () {
    _mediator.publish("SHOW_TICKER");
    TweenMax.to(this.betPanelMobileCover, 0.2, { alpha: 0, onComplete: function () { this.betPanelMobileCover.visible = false; }.bind(this) });
    TweenMax.to(this.betPanelMobile, 0.2, { alpha: 0, onComplete: function () { this.betPanelMobile.visible = false; }.bind(this) });
    _mediator.publish("showMenuBtnEvent");
    _sndLib.play(_sndLib.sprite.maxbetBtnClick);
};

panel.setUpCoinValue = function (selectedIndex, coinArray) {
    this.coinValueSlider.setValueArray(coinArray, selectedIndex);
    this.coinValueSlider.createView();
    if (this.coinValue) {
        this.coinValue.setOptionsArray(coinArray);
        this.coinValue.setDefaultIndex(selectedIndex);
    }
};

panel.onResize = function () {
    const isDeviceIpad = pixiLib.isIpad();
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
GPanelMob.onSloAnimQuickSpinOff = function (){
    _sndLib.play(_sndLib.sprite.fullScreenBtnClick);
    _ng.isQuickSpinActive = false;
    _mediator.publish("ToggleQuickFunction",false);
    // _ng.GameConfig.FastAnim=false;
    _mediator.publish("toggleQuickSpinSettings",false);  
    this.setQuickSpinEnabledForPanel(false); 
}

GPanelMob.onSloAnimQuickSpinOn = function (){
    _sndLib.play(_sndLib.sprite.fullScreenBtnClick);
    if(_ng.GameConfig.TurboOn)
        {
           this.onQuickSpinOff();
        }
    if(coreApp.gameController.allReelsStopped){
        _ng.isQuickSpinActive = true;
    }
    _mediator.publish("ToggleQuickFunction",true);
    _mediator.publish("toggleQuickSpinSettings",true);  
    this.setQuickSpinEnabledForPanel(true); 
}
//for quick spin mobile

GPanelMob.onQuickSpinOff = function (){
    _sndLib.play(_sndLib.sprite.fullScreenBtnClick);
    _ng.isQuickSpinActive = false;
    _mediator.publish("ToggleTurboFunction",false);
    _ng.GameConfig.FastAnim=false;
    _ng.GameConfig.TurboOn=false;
    // _mediator.publish("toggleQuickSpinSettings",false);  
}

GPanelMob.onQuickSpinOn = function (){
    _sndLib.play(_sndLib.sprite.fullScreenBtnClick);
    if(_ng.isQuickSpinActive)
        {
            this.onSloAnimQuickSpinOff();
        }
    // _ng.isQuickSpinActive = true;
    _mediator.publish("ToggleTurboFunction",true);
    // _ng.GameConfig.FastAnim=true;
    _ng.GameConfig.TurboOn=true
    // _mediator.publish("toggleQuickSpinSettings",true);  

}
GPanelMob.togglequickSpinSettingsinsidemobile = function(bool){
    this.quickSpinBtnOn.visible = bool;
    this.quickSpinBtnOff.visible = !bool;
    _mediator.publish("ToggleTurboFunction",bool); 
}

/*
*For Turning on Quick spin
*quickSpinBtnOff - button with quick spin turned ON texture
*quickSpinBtnOn - button with quick spin turned OFF texture
*/

GPanelMob.onPanelQuickSpinOn = function() {

    if(commonConfig.disableQuickSpin) {  /*for GERMAN regulations*/
        return; 
    }
    _mediator.publish("onSloAnimQuickSpinOn");
}

/*For Turning off Quick spin*/
GPanelMob.onPanelQuickSpinOff = function() {

    if(commonConfig.disableQuickSpin) {  /*for GERMAN regulations*/
        return; 
    }
    _mediator.publish("onSloAnimQuickSpinOff");
}

/*
*For changing Texture of QUICK SPIN button in panel
*
*This function will be called from 2 places 
* 1 - when user turned on/off QUICK SPIN from SETTINGS 
* 2 - when user turned on/off QUICK SPIN from AUTOPLAY
*
* isEnabled - will be true/false
*
*/

GPanelMob.setQuickSpinEnabledForPanel = function(isEnabled) {

    this.quickSpinBtnOff.visible = isEnabled;  
    this.quickSpinBtnOn.visible = !isEnabled;
}