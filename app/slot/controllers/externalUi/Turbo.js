_ng.TurboEUI = function() {

}

_ng.TurboEUI.prototype.constructor = _ng.TurboEUI;
var turbo = _ng.TurboEUI.prototype;


turbo.setGameSpeed = function(speed) {
    _ng.isQuickSpinActive = false;
    _ng.GameConfig.FastAnim = false;
    if (speed === 'normal') {
        _ng.isQuickSpinActive = true;

    } else if (speed === 'quick') {
        _ng.isQuickSpinActive = true;
        _ng.GameConfig.FastAnim = true;
        
    }
    this.updateTurboIcons(speed);
}


turbo.updateTurboIcons = function(speed) {
    window.externalUi.call('turbo-off-button', 'hide');
    window.externalUi.call('turbo-fast-button', 'hide');
    window.externalUi.call('turbo-on-button', 'hide');

    if (speed === 'normal') {
      window.externalUi.call('turbo-fast-button', 'show');
    } else if (speed === 'quick') {
      window.externalUi.call('turbo-on-button', 'show');
    } else if (speed === 'turbo') {
      window.externalUi.call('turbo-off-button', 'show');
    }
}

