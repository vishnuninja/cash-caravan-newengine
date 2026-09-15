_ng.ElapsedTimeEUI = function(parent) {
    this.parentExternalUI = parent;
    if(!_ng.GameConfig.showElapsedTime || isHistoryMode) return;
    this.setConfig();
    this.addEvents();
    this.show();
}

_ng.ElapsedTimeEUI.prototype.constructor = _ng.ElapsedTimeEUI;
var elapsedTime = _ng.ElapsedTimeEUI.prototype;

elapsedTime.setConfig = function() {
    if(!_ng.GameConfig.elapsedTimeConfig) return;
    window.externalUi.call('elapsed-time', "setPosition", _ng.GameConfig.elapsedTimeConfig[_viewInfoUtil.viewType]);
}

elapsedTime.addEvents = function() {
    _mediator.subscribe(_events.core.onResize, this.resize.bind(this));
}

elapsedTime.show = function() {
   window.externalUi.call('elapsed-time', "show");
}

elapsedTime.hide = function() {
   window.externalUi.call('elapsed-time', "hide");
}

elapsedTime.resize = function() {
    if(_viewInfoUtil.device == 'Desktop') return;
     window.externalUi.call('elapsed-time', "setPosition", _ng.GameConfig.elapsedTimeConfig[_viewInfoUtil.viewType]);
}
