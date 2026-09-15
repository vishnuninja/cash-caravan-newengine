PanelDesktopView = function () {
    PanelView.call(this);
}

PanelDesktopView.prototype = Object.create(PanelView.prototype);
PanelDesktopView.prototype.constructor = PanelDesktopView;

var panel = PanelDesktopView.prototype;
var corePanel = PanelView.prototype;

panel.setVariables = function (slotView, coreApp) {
    this.slotView = slotView;
    this.coreApp = coreApp;
};

panel.createView = function () {
    corePanel.createView.call(this);
    this.addEvents();
    
};

panel.addEvents = function () {

    if(this.quickSpinBtnOn){
        this.quickSpinBtnOff.visible = false;
        this.soundOffBtn.visible = false;

        pixiLib.setInteraction(this.soundOnBtn, true);
        pixiLib.addEvent(this.soundOnBtn, this.onSoundOnHandler.bind(this));
        pixiLib.setInteraction(this.soundOffBtn, true);
        pixiLib.addEvent(this.soundOffBtn, this.onSoundOffHandler.bind(this));

        pixiLib.setInteraction(this.quickSpinBtnOn, true);
        pixiLib.addEvent(this.quickSpinBtnOn, this.onQuickSpinOn.bind(this));
        pixiLib.setInteraction(this.quickSpinBtnOff, true);
        pixiLib.addEvent(this.quickSpinBtnOff, this.onQuickSpinOff.bind(this));

        pixiLib.setInteraction(this.fullScreenBtn, true);
        pixiLib.addEvent(this.fullScreenBtn, this.onFullscreenClick.bind(this));

        pixiLib.setInteraction(this.fullScreenBtnOff, true);
        pixiLib.addEvent(this.fullScreenBtnOff, this.onFullscreenClickOff.bind(this));

        this.fullScreenBtnOff.visible = false;
    }

    if(this.gambleBtn){
        this.gambleBtn.visible = false;
        pixiLib.setInteraction(this.gambleBtn, true);
        pixiLib.addEvent(this.gambleBtn, this.onGambleClick.bind(this));
    }
};
panel.onSoundOnHandler = function (){
    //_sndLib.play(_sndLib.sprite.fullScreenBtnClick);
    _sndLib.play(_sndLib.sprite.sSymLand);



    this.soundOnBtn.visible = false;
    this.soundOffBtn.visible = true;
    

    _sndLib.setPreviousVolume(_sndLib.curVolume);
    _mediator.publish("setVolume", 0);
    _sndLib.mute(true);
}
panel.onSoundOffHandler = function (){
    //_sndLib.play(_sndLib.sprite.fullScreenBtnClick);
    _sndLib.play(_sndLib.sprite.sSymLand);


    
    this.soundOnBtn.visible = true;
    this.soundOffBtn.visible = false;

    _mediator.publish("setVolume", (_sndLib.previousVolume) ? _sndLib.previousVolume : _sndLib.defaultVolume);
    _sndLib.setPreviousVolume(undefined);
    _sndLib.mute(false);
}
panel.onQuickSpinOn = function (){
    _sndLib.play(_sndLib.sprite.fullScreenBtnClick);
    this.quickSpinBtnOn.visible = false;
    this.quickSpinBtnOff.visible = true;

    _ng.isQuickSpinActive = true;
}
panel.onQuickSpinOff = function (){
    _sndLib.play(_sndLib.sprite.fullScreenBtnClick);
    this.quickSpinBtnOn.visible = true;
    this.quickSpinBtnOff.visible = false;

    _ng.isQuickSpinActive = false;
}
panel.onFullscreenClick = function (){
    _sndLib.play(_sndLib.sprite.fullScreenBtnClick);
    pixiLib.toggleFulScreen();

    
    this.fullScreenBtn.visible = false;
    this.fullScreenBtnOff.visible = true;
}
panel.onFullscreenClickOff = function (){
    _sndLib.play(_sndLib.sprite.fullScreenBtnClick);
    pixiLib.toggleFulScreen();    

    this.fullScreenBtn.visible = true;
    this.fullScreenBtnOff.visible = false;
}

panel.onGambleClick = function (){

    _mediator.publish("clearAllWins");

    _sndLib.play(_sndLib.sprite.gamble_button);
    console.log(" show gamble round=============== ");
    _mediator.publish("SHOW_GAMBLE");
    this.gambleBtn.visible = false;
}

panel.onAutoSpinCountUpdate= function(count){
    if(count == 0){
        //hide autospin stop button
        this.autoSpinButton.visible = true;
        this.autoSpinStopButton.visible = false;
        this["asValueBg"].visible = false;
        this["asValue"].visible = false;     
    }
    pixiLib.setText(this["asValue"], count);
}
panel.onAutoSpinStopClick = function () {
    this.hideAutoSpinButton();
    _sndLib.play(_sndLib.sprite.autoSpinBtnClick)
    _mediator.publish("stopAutoSpin");
    _mediator.publish("panelClick");
}
panel.onCancelAutoSpin = function(){
    this.hideAutoSpinButton();
    _mediator.publish("stopAutoSpin");
}
panel.hideAutoSpinButton = function(){
    this.autoSpinButton.visible = true;
    this.autoSpinStopButton.visible = false;
    this["asValueBg"].visible = false;
    this["asValue"].visible = false;
    this.addGameView();
}
panel.updateAutoSpinBtnStates = function (num) {
    _mediator.publish("START_AUTOSPIN", num);
    this.toggleAutoSpinOptions(false);
    this.autoSpinButton.visible = false;
    this.autoSpinStopButton.visible = true;
};

panel.onHideAutoSpin = function(){
    this.toggleAutoSpinOptions(false);
}

panel.showGambleButton = function (){
    if(this.gambleBtn){
        this.gambleBtn.visible = true;
        this.gambleYoyo = TweenMax.to(this.gambleBtn.scale, 0.6, {x:0.7, y:0.7, yoyo:true, repeat:-1} );
    }
}
panel.hideGambleButton = function (){
    if(this.gambleBtn){
        this.gambleBtn.visible = false;
        if(this.gambleYoyo){
            this.gambleYoyo.kill();
            this.gambleBtn.scale.set(0.8);
        }
    }
}