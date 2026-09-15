SuperMeterController = function () {
}

var smc = SuperMeterController.prototype;
smc.constructor = SuperMeterController;


smc.setView = function (view) {
    this.view = view;
    this.createListeners();
}

smc.createListeners = function () {
    console.log(coreApp.gameModel.spinData);
    // _mediator.subscribe("onSpinResponse", this.onSpinReceivedHandler.bind(this));
    _mediator.subscribe(_events.core.initReceived, this.onInitResponceHandler.bind(this));
}

smc.onInitResponceHandler = function (val) {
    console.log(val)
    // this.view.updateSuperMeter(val);

}
smc.onSpinReceivedHandler = function () {

}
