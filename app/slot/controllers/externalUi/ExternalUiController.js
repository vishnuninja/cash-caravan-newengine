

var _ng = _ng || {};

_ng.ExternalUiController = function() {
  this.musicEui = new _ng.Music();
  this.settingsUi = new _ng.SettingsUi(this);
  this.betUi = new _ng.BetUi();
  this.turbo = new _ng.TurboEUI();
  this.autoPlay = new _ng.AutoPlayEUI();
  this.ticker = new _ng.TickerEUI(this);
  this.commonPopup = new _ng.CommonPopup();
  this.promoView = new _ng.PromoView();
  this.errorView = new _ng.ErrorViewEUI();
  this.gameInfo = new _ng.GameInfoEUI();
  this.replay = new _ng.ReplayEUI(this); 
  this.elapsedTIme = new _ng.ElapsedTimeEUI(this);
  this.setGameConfig();
  this.addEventListeners();
  this.isStopClickAllowed = false;
  this.spaceHoldCounter = 0;
  this.isSpaceBarOnHold = false;
  this.spaceBarTimeoutRef = null;
}

_ng.ExternalUiController.prototype.constructor = _ng.ExternalUiController;
var euc = _ng.ExternalUiController.prototype;
 
euc.setGameConfig = function() {
    if (!window.externalUi) return;

      const params = new URLSearchParams(window.location.search);
    
    window.externalUi.call('game_ui', 'setGameConfig', {
      width: _viewInfoUtil.getWindowWidth() * pixiLib.getRenderer().resolution * .8,
      height: _viewInfoUtil.getWindowHeight() * pixiLib.getRenderer().resolution * .8,
      lang: params.get('user_locale') || 'en',
      gameName: _ng.GameConfig.gameName,
    });
    this.resize();
}

euc.setCurrency = function() {
    window.externalUi.call('ui-help-popup', 'setCurrency', coreApp.gameModel.getCurrencyCode());
}

euc.handleUIButton = function(e){
    const {detail} = e;
    switch (detail) {
      case 'settings-button':
        this.settingsUi.syncInitialSettings();
        this.settingsUi.show();
        break;
      case 'music-on-button':
      case 'music-off-button':
        const visible = window.externalUi.call('ui-sound-range', 'isVisible');
        window.externalUi.call('ui-sound-range', visible ? 'hide' : 'show');
       
        break;

      case 'turbo-off-button':
       this.turbo.setGameSpeed('normal');
       this.settingsUi.setTurbo('normal');
        break;

      case 'turbo-fast-button':
        this.turbo.setGameSpeed('quick');
        this.settingsUi.setTurbo('quick');

        break;

      case 'turbo-on-button':
        this.turbo.setGameSpeed('turbo');
        this.settingsUi.setTurbo('turbo');
        
        break;

      case 'plus-button':
        this.betUi.increaseBet();
        this.betUi.show();
        break;

      case 'minus-button':
        this.betUi.decreaseBet();
        this.betUi.show();
        break;

      case 'plus-button-popup':
        this.betUi.increaseBet();
        break;

      case 'minus-button-popup':
        this.betUi.decreaseBet();
        break;

      case 'max-bet':
        this.betUi.maxBet();
        break;

      case 'spin-button':
        this.spinActive(true);
        _mediator.publish("spinClick");

        break;
      case 'spin-stop-button':
        this.spaceHoldCounter += 1;
        if(this.spaceBarTimeoutRef) clearTimeout(this.spaceBarTimeoutRef);
        if(this.spaceHoldCounter > 5){
          this.isSpaceBarOnHold = true;
          let startCounter = this.spaceHoldCounter;
          this.spaceBarTimeoutRef = setTimeout(() => {
            if(this.spaceHoldCounter === startCounter)  
              this.resetSpaceBarStatus();
          }, 100);
        }
        if(this.isStopClickAllowed) {
          _mediator.publish("forceStopBySpace");
          this.isStopClickAllowed = false;
        }

        break;
      case 'autoplay-button':
        this.autoPlay.click();

        break;
      case 'autoplay-stop-button':
        this.autoPlay.onStopAutoplayClick();

        break;
      default:
        break;
    }
}

euc.resetSpaceBarStatus = function() {
  this.isSpaceBarOnHold = false;
  this.spaceHoldCounter = 0;
}

euc.getSpaceBarHoldStatus = function() {
  return this.isSpaceBarOnHold;
}

euc.addEventListeners = function() {
  window.addEventListener('ui-button-click', (e) => this.handleUIButton(e));

  _mediator.subscribe("showMainGame", this.setBalance.bind(this));
  _mediator.subscribe(_events.slot.updateBalance, this.setBalance.bind(this));
  _mediator.subscribe(_events.core.onResize, this.resize.bind(this));
  _mediator.subscribe("introScreenHidden",this.show.bind(this));
  _mediator.subscribe("setSpaceBarEvent", this.setIdle.bind(this));
  _mediator.subscribe(_events.core.initReceived,this.setCurrency.bind(this));
  _mediator.subscribe("buyFreeSpinPopup",this.setPanelForBuyFreeSpin.bind(this));
  _mediator.subscribe("buyFreeSuperSpinPopup",this.setPanelForBuyFreeSpin.bind(this));
  //_mediator.subscribe("bringBackBuyFeature",this.setPanelForNormalSpin.bind(this));
  _mediator.subscribe("onCloseBtn",this.setPanelForNormalSpin.bind(this));

  _mediator.subscribe("allReelsStopped", this.onAllReelStopped.bind(this));
  _mediator.subscribe("showSpinStop", this.onShowSpinStop.bind(this));

}

euc.show = function() {
  window.externalUi.call('game_ui', 'show');
}

euc.hide = function() {
  window.externalUi.call('game_ui', 'hide');
}

euc.spinActive = function (value){
  if(isHistoryMode) {
    return;
  }
  window.externalUi.call('spin-button', value ? 'hide' : 'show');
  window.externalUi.call('spin-button', value ? 'disable' : 'enable');
  window.externalUi.call('spin-stop-button', value ? 'show' : 'hide');
  window.externalUi.call('autoplay-button', value ? 'disable' : 'enable');
  window.externalUi.call("plus-button", value || coreApp.gameModel.getIsPFSActive()? "disable" : "enable");
  window.externalUi.call("minus-button", value || coreApp.gameModel.getIsPFSActive()? "disable" : "enable");

  const visible = window.externalUi.call('autoplay-stop-button', 'isVisible');
  if (!value && visible) {
    window.externalUi.call('info-board', 'hide');
    window.externalUi.call('autoplay-stop-button', 'hide');
    window.externalUi.call('autoplay-button', 'show');
  }
}

euc.setPanelForBuyFreeSpin = function(value, status){
  if(!_ng.buyFeaturePopupStatus)
  {
      this.setPanelForNormalSpin();
      return;
  }
  window.externalUi.call('spin-button', 'disable');
  window.externalUi.call('autoplay-button', 'disable');
}

euc.setPanelForNormalSpin = function(){
  if(_ng.BuyFSenabled) return;
  window.externalUi.call('spin-button', 'enable');
  window.externalUi.call('autoplay-button', 'enable');
}

euc.toggleTurbo = function (value){
  // GlobalStore.turbo = value;
  window.externalUi.call('ui-popup-settings', 'setToggle', 'turbo', value);
  window.externalUi.call('turbo-off-button', value ? 'hide' : 'show');
  window.externalUi.call('turbo-on-button', value ? 'show' : 'hide');
}

euc.resize = function() {
  if (_viewInfoUtil.isDesktop) return;
  window.externalUi.call('game_ui', 'setMode', 'mobile', '');
  if (_viewInfoUtil.viewType=== "VP") {
    window.externalUi.call('game_ui', 'setMode', 'mobile', 'portrait');
  } else {
    window.externalUi.call('game_ui', 'setMode', 'mobile', 'landscape');
  }
}

euc.setBalance = function() {
  if(isHistoryMode) {
    return;
  }
  window.externalUi.call('balance-amount', 'setText', pixiLib.getFormattedAmount(coreApp.gameModel.getBalance()));
}

euc.setIdle = function(data) {
  switch (data) {  
    case 'spinClick':        
      if(coreApp.gameController.allReelsStopped) {
        this.spinActive(false);
      }
      break;
    case 'idle':
      this.spinActive(true);
    default:
      break;
  }
}

euc.onAllReelStopped = function() {
  this.isStopClickAllowed = false;
}

euc.onShowSpinStop = function() {
  if(!_ng.isQuickSpinActive && !coreApp.gameController.isSpaceBarHeld) {
      this.isStopClickAllowed = true;
  }
}