var GPD = PanelDesktopView.prototype;

GPD.createView = function () {
    corePanel.createView.call(this);
    this.addEvents();
    this.addHoverInteractions();

    this.clickCount = 0;
};

GPD.addEvents = function () {

    if(this.quickSpinBtnOn){
        this.quickSpinBtnOff.visible = false;
        this.soundOffBtn.visible = false;

        pixiLib.setInteraction(this.soundOnBtn, true);
        pixiLib.addEvent(this.soundOnBtn, this.onSoundOnHandler.bind(this));
        pixiLib.setInteraction(this.soundOffBtn, true);
        pixiLib.addEvent(this.soundOffBtn, this.onSoundOffHandler.bind(this));
        _mediator.subscribe("closeVolBar",this.closeVolumeBar.bind(this));
        _mediator.subscribe("spinStart",this.closeVolumeBar.bind(this));
        _mediator.subscribe("onQuickSpinOff",this.onQuickSpinOff.bind(this));
        _mediator.subscribe("onQuickSpinOn",this.onQuickSpinOn.bind(this));
        _mediator.subscribe("onSloAnimQuickSpinOff",this.onSloAnimQuickSpinOff.bind(this));
        _mediator.subscribe("onSloAnimQuickSpinOn",this.onSloAnimQuickSpinOn.bind(this));
        pixiLib.setInteraction(this.quickSpinBtnOn, true);
        pixiLib.addEvent(this.quickSpinBtnOn, this.onPanelQuickSpinOn.bind(this));
        pixiLib.setInteraction(this.quickSpinBtnOff, true);
        pixiLib.addEvent(this.quickSpinBtnOff, this.onPanelQuickSpinOff.bind(this));

        pixiLib.setInteraction(this.fullScreenBtn, true);
        pixiLib.addEvent(this.fullScreenBtn, this.onFullscreenClick.bind(this));

        pixiLib.setInteraction(this.fullScreenBtnOff, true);
        pixiLib.addEvent(this.fullScreenBtnOff, this.onFullscreenClickOff.bind(this));

        this.fullScreenBtnOff.visible = false;
    }
    else{
        // this.quickSpinBtnOff.visible = false;
        this.soundOffBtn.visible = false;

        pixiLib.setInteraction(this.soundOnBtn, true);
        pixiLib.addEvent(this.soundOnBtn, this.onSoundOnHandler.bind(this));
        pixiLib.setInteraction(this.soundOffBtn, true);
        pixiLib.addEvent(this.soundOffBtn, this.onSoundOffHandler.bind(this));
        

        pixiLib.setInteraction(this.fullScreenBtn, true);
        pixiLib.addEvent(this.fullScreenBtn, this.onFullscreenClick.bind(this));

        pixiLib.setInteraction(this.fullScreenBtnOff, true);
        pixiLib.addEvent(this.fullScreenBtnOff, this.onFullscreenClickOff.bind(this));

        this.fullScreenBtnOff.visible = false;
    }

    pixiLib.addEvent(this.stopButton,this.stopButtonClicked.bind(this));
    pixiLib.addEvent(this.fakeButton,this.fakeButtonClicked.bind(this));
    pixiLib.addEvent(this.paytableBtn, this.paytableButtonClicked.bind(this));
    pixiLib.addEvent(this.settingsBtn, this.settingsButtonClicked.bind(this));
    pixiLib.addEvent(this.coinValue.plusButton, this.coinValuePlusClick.bind(this));
    pixiLib.addEvent(this.coinValue.minusButton, this.coinValueMinusClick.bind(this));

    if(this.gambleBtn){
        this.gambleBtn.visible = false;
        pixiLib.setInteraction(this.gambleBtn, true);
        pixiLib.addEvent(this.gambleBtn, this.onGambleClick.bind(this));
    }
    _mediator.subscribe("boolSlid",this.boolSlid.bind(this));
    _mediator.subscribe("toggleSoundbuttons",this.toggleSoundbuttons.bind(this));
    _mediator.subscribe("togglequickSpinSettingsinside",this.togglequickSpinSettingsinside.bind(this));
    _mediator.subscribe("hideFakeButton",this.hideFakeButton.bind(this));
    _mediator.subscribe("checkForQuickSpinInfo",this.checkForQuickSpinInfo.bind(this));
};

/*Hover sound for buttons*/
GPD.addHoverInteractions = function() {

    var panelButtons = [this.spinButton, this.autoSpinButton,
                        this.fullScreenBtn, this.fullScreenBtnOff,
                        this.settingsBtn, this.soundOnBtn,
                        this.paytableBtn,
                        this.stopButton, this.coinValue.plusButton,
                        this.coinValue.minusButton,  this.maxBetButtonNew,
                        this.closeBtn, this.minusButton,
                        this.plusButton, this.autoplayButton,
                        this.closebutton
                        ];

    panelButtons.forEach(button => {
        pixiLib.addHoverInteraction(button, () => {
            if(button)
                _sndLib.play(_sndLib.sprite.btnClick);
        });
    });
}

GPD.onSoundOnHandler = function (){
    //_sndLib.play(_sndLib.sprite.fullScreenBtnClick);
    _sndLib.play(_sndLib.sprite.sSymLand);

    
    // _mediator.publish("toggleSlider");
    //  this.soundOnBtn.visible = false;
    //  this.soundOffBtn.visible = true;
    
    // this.oldVol=_sndLib.curVolume;
    // _sndLib.setPreviousVolume(_sndLib.curVolume);
    _mediator.publish("ToggleVolBox");
    // _mediator.publish("toggleGraybg",true);
    _mediator.publish("setVolume", 1);
    // _sndLib.mute(true);
}
GPD.boolSlid=function(bool)
{
    this.sliderMove=bool;
}
GPD.toggleSoundbuttons = function(value){
    this.soundOnBtn.visible = value;
    this.soundOffBtn.visible = !value;
}
GPD.onSoundOffHandler = function (val){
    //_sndLib.play(_sndLib.sprite.fullScreenBtnClick);
    _sndLib.play(_sndLib.sprite.sSymLand);
    // if (val) {
        _mediator.publish("ToggleVolBox");   
    // }
    // else{
        // _mediator.publish("toggleSlider");
    // }
    
    // this.soundOnBtn.visible = true;
    // this.soundOffBtn.visible = false;

    // console.log("old Vol: "+this.oldVol)
   _mediator.publish("SliderMoved")
    if(this.sliderMove==false)
        {
            _mediator.publish("setVolume",this.oldVol);
            // _sndLib.setPreviousVolume(this.oldVol);
            // console.log("old Vol222: "+this.oldVol)
        }
        else
        {
            _mediator.publish("setVolume", (_sndLib.previousVolume>=0) ? _sndLib.previousVolume : _sndLib.defaultVolume);
        }
        this.sliderMove=true;
    // _sndLib.setPreviousVolume(undefined);
    // _sndLib.mute(false);
}
GPD.closeVolumeBar = function(){
    _mediator.publish("ToggleVolBox",false);  
}

GPD.onSloAnimQuickSpinOff = function (){
    _sndLib.play(_sndLib.sprite.fullScreenBtnClick);
    // this.quickSpinBtnOn.visible = true;
    // this.quickSpinBtnOff.visible = false;

    _ng.isQuickSpinActive = false;
    // _ng.GameConfig.FastAnim=false;
    _mediator.publish("ToggleQuickFunction",false); 
    _mediator.publish("toggleQuickSpinSettings",false);
    this.setQuickSpinEnabledForPanel(false); 
}
GPD.onSloAnimQuickSpinOn = function (){
    // _mediator.publish("killReelAniTweens");
    if(_ng.GameConfig.TurboOn)
        {
           this.onQuickSpinOff();
        }
    _sndLib.play(_sndLib.sprite.fullScreenBtnClick);
    if(coreApp.gameController.allReelsStopped){
        _ng.isQuickSpinActive = true;
    }
    _mediator.publish("ToggleQuickFunction",true); 
    _mediator.publish("toggleQuickSpinSettings",true);
    this.setQuickSpinEnabledForPanel(true); 

    /*
    quick spin popup is considered as shown 
    if u turned on quick spin from settings or 
    autoplay menu
    */
    if(!_ng.GameConfig.quickSpinInfoPopupShown)
        _ng.GameConfig.quickSpinInfoPopupShown = true;   
}

GPD.onQuickSpinOff = function (){
    _sndLib.play(_sndLib.sprite.fullScreenBtnClick);
    _ng.isQuickSpinActive = false;
    _ng.GameConfig.TurboOn = false;
    _ng.GameConfig.FastAnim = false;
    _mediator.publish("ToggleTurboFunction",false); 
    // _mediator.publish("toggleQuickSpinSettings",false);  
}
GPD.onQuickSpinOn = function (){
    _sndLib.play(_sndLib.sprite.fullScreenBtnClick);
    if(_ng.isQuickSpinActive)
    {
        this.onSloAnimQuickSpinOff();
    }

    // _ng.isQuickSpinActive = true;
    _ng.GameConfig.TurboOn=true;
    _mediator.publish("ToggleTurboFunction",true); 
    // _mediator.publish("toggleQuickSpinSettings",true);  

}
GPD.togglequickSpinSettingsinside = function(bool){
    if (this.quickSpinBtnOn) {
        this.quickSpinBtnOn.visible = bool;   
    }
    if (this.quickSpinBtnOff) {
        this.quickSpinBtnOff.visible = !bool;   
    }
    _mediator.publish("ToggleTurboFunction",!bool); 
}

/* set the fake button visible on stop button click */
GPD.stopButtonClicked = function() {

    clearInterval(this.clickInterval);

    if(!_ng.GameConfig.quickSpinInfoPopupShown && !coreApp.gameModel.isAutoSpinActive() && 
        !coreApp.gameModel.isFreeSpinActive() && !_ng.BuyFSenabled && !_ng.GameConfig.superBuyEnabled) {
        this.fakeButton.visible = true;         
        this.clickInterval = setInterval(() => {
            this.clickCount = 0;
        }, 3000);  // Reset after 3 seconds
    }
}

GPD.paytableButtonClicked = function() {
    _mediator.publish("closeQuickSpinInfo");
    _mediator.publish("closeVolBar");/* for closing vol-slider bar */
}

GPD.settingsButtonClicked = function() {
    _mediator.publish("closeQuickSpinInfo");
}

GPD.coinValuePlusClick = function() {
    _mediator.publish("closeQuickSpinInfo");
    _mediator.publish("closeVolBar");/* for closing vol-slider bar */
}

GPD.coinValueMinusClick = function() {
    _mediator.publish("closeQuickSpinInfo");
    _mediator.publish("closeVolBar");/* for closing vol-slider bar */
}

GPD.hideFakeButton = function() {
    this.fakeButton.visible = false;
}

/*created for detecting multiple click*/
GPD.fakeButtonClicked = function() {

    this.clickCount++; 
    if(this.clickCount == 6) {
        this.fakeButton.visible = false;
        clearInterval(this.clickInterval);
        _ng.GameConfig.quickSpinInfoTriggered = true;
    }
}

/*check for tumble finish at each 1 sec */
GPD.checkForQuickSpinInfo = function() {
    const checkIntervalForPopup = setInterval(() => {
        if(_ng.GameConfig.quickSpinInfoPopupShown) {
            clearInterval(checkIntervalForPopup);
            return;
        }
        if(coreApp.gameController.allTumbleFinished) {
            _mediator.publish("quickSpinInfoPopup");  //for displaying popup if all tumble is finished
            clearInterval(checkIntervalForPopup);
        }
    }, 1000);
}

/*
*For Turning on Quick spin
*quickSpinBtnOff - button with quick spin turned ON texture
*quickSpinBtnOn - button with quick spin turned OFF texture
*/

GPD.onPanelQuickSpinOn = function() {

    if(commonConfig.disableQuickSpin) {  /*for GERMAN regulations*/
        return; 
    }
    _mediator.publish("closeQuickSpinInfo");  /*for closing QUICK SPIN INFO popup - if visible*/
    _mediator.publish("onSloAnimQuickSpinOn");
    _mediator.publish("closeVolBar");/* for closing vol-slider bar */
}

/*For Turning off Quick spin*/
GPD.onPanelQuickSpinOff = function() {

    if(commonConfig.disableQuickSpin) {  /*for GERMAN regulations*/
        return; 
    }
    _mediator.publish("closeQuickSpinInfo");  /*for closing QUICK SPIN INFO popup - if visible*/
    _mediator.publish("onSloAnimQuickSpinOff");
}

/*
*For changing Texture of QUICK SPIN button in panel
*
*This function will be called from 3 places 
* 1 - when user turned on/off QUICK SPIN from SETTINGS 
* 2 - when user turned on/off QUICK SPIN from AUTOPLAY
* 3 - when user turned on/off QUICK SPIN from QUICK SPIN INFO POPUP
* isEnabled - will be true/false
*
*/

GPD.setQuickSpinEnabledForPanel = function(isEnabled) {

    this.quickSpinBtnOff.visible = isEnabled;  
    this.quickSpinBtnOn.visible = !isEnabled;
}
