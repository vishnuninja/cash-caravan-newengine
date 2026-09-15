_ng.AutoPlayEUI = function() {
  this.addEvents();
  this.autoplayActive = false;
  this.totalAutoSpinCount = 0;
  this.remainingAutoSpinCount = 0;
}

_ng.AutoPlayEUI.prototype.constructor = _ng.AutoPlayEUI;
var autoplayUi = _ng.AutoPlayEUI.prototype;

autoplayUi.addEvents = function() {
  window.addEventListener('ui-start-autoplay', (e) => this.handleAutoplayStart(e));

  _mediator.subscribe("UPDATE_AUTOSPIN_COUNT", this.updateAutoSpinCount.bind(this));
  _mediator.subscribe("stopAutoSpin", this.reset.bind(this));
  _mediator.subscribe("cancelAutoSpin", this.reset.bind(this));
  _mediator.subscribe(_events.core.error, this.reset.bind(this));
  _mediator.subscribe("continueAutoSpin", this.continueAutoSpin.bind(this));
}

autoplayUi.click = function() {
  const visible = window.externalUi.call('ui-popup-autoplay', 'isVisible');
  window.externalUi.call('ui-popup-autoplay', visible || coreApp.gameModel.getIsPFSActive() ? 'hide' : 'show');
  if(coreApp.gameModel.getIsPFSActive()){
    this.pfsAutoPlay();
  }
}

autoplayUi.handleAutoplayStart = function(e) {
    if (coreApp.gameModel.getTotalBet() > Number(coreApp.gameModel.getBalance())) {
      //TODO show popup
      console.log('[AutoplayEUI] - insufficient balance');
      return;
    }

    const { detail } = e;  //count sending from ui

    _ng.externalUiController.spinActive(true);
    coreApp.gameModel.autoSpinData.startAutoSpin(detail - 1);
    this.autoplayActive = true;
    this.totalAutoSpinCount = detail;
    this.remainingAutoSpinCount = detail - 1;

    this.showAutoPlayPanel();
    this.startSpin();
}

autoplayUi.showAutoPlayPanel = function() {
    window.externalUi.call('info-board', coreApp.gameModel.getIsPFSActive() ? 'hide' : 'show');
    window.externalUi.call('info-board', 'setText', 'autoplay activated');
    window.externalUi.call('autoplay-stop-button', 'show');
    window.externalUi.call('autoplay-button', 'hide');
    window.externalUi.call('auto-amount', 'setText', this.remainingAutoSpinCount);
    window.externalUi.call('auto-amount', 'show');
    window.externalUi.call('auto-text', 'show');
}

autoplayUi.hideAutoPlayPanel = function() {
    window.externalUi.call('info-board', 'hide');
    window.externalUi.call('autoplay-stop-button', 'hide');
    window.externalUi.call('autoplay-button', 'show');
    window.externalUi.call('auto-amount', 'hide');
    window.externalUi.call('auto-text', 'hide');
}

autoplayUi.startSpin = function() {
  _mediator.publish("spinClick");
}

autoplayUi.onStopAutoplayClick = function() {
  this.deactivateAutoplay();
  this.reset();
}

autoplayUi.deactivateAutoplay = function() {
  coreApp.gameModel.autoSpinData.stopAutoSpin();
}

autoplayUi.updateAutoSpinCount = function(count) {  
  this.remainingAutoSpinCount -= 1;
  window.externalUi.call('auto-amount', 'setText',  count);
}

//reset if any error happens
autoplayUi.reset = function() {
  if(isHistoryMode) {
    return;
  }
  this.hideAutoPlayPanel();
  this.autoplayActive = false;
  this.totalAutoSpinCount = 0;
  this.remainingAutoSpinCount = 0;
}

autoplayUi.continueAutoSpin = function() {
  this.remainingAutoSpinCount = _ng.autoPlayPrevCount;
  setTimeout(() => {
    this.showAutoPlayPanel();
  }, 1000);
}

autoplayUi.pfsAutoPlay = function (){
  var spinCount = coreApp.gameModel.PFSData.remainingPromoFreeSpins;
  this.handleAutoplayStart({ detail: spinCount });  
}