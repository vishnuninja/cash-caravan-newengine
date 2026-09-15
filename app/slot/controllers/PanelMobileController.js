PanelMobileController = function (coreApp) {
    console.log("cp3mobile");
    PanelController.call(this, coreApp);
    this.controller = "PanelDesktopController";
    //this.addEvents();
}
PanelMobileController.prototype = Object.create(PanelController.prototype);
PanelMobileController.constructor = PanelMobileController.prototype;

var pmc = PanelMobileController.prototype;
var spmc = PanelController.prototype;

pc.setView = function(view){
    this.view = view;
    this.slotModel = coreApp.gameModel;
    this.addEvents();
}

pmc.addEvents = function(){
    spmc.addEvents.call(this);
    _mediator.subscribe("totalBetUpdated", this.updateMobilePanelBet.bind(this));
    _mediator.subscribe("sliderCoinValueUpdated", this.onSliderCoinValueUpdated.bind(this));
    _mediator.subscribe("sliderLineValueUpdated", this.onSliderLineValueUpdated.bind(this));
    _mediator.subscribe(_events.core.gameCreationCompleted, this.updateHomeMenuParent.bind(this));
}
pmc.onSliderCoinValueUpdated = function(data){
    _mediator.publish("coinValueUpdated", {index: data.index});
    _mediator.publish("totalBetUpdated");
}
pmc.onSliderLineValueUpdated = function(data){
    _mediator.publish("lineValueUpdated", {index: data.index});
    _mediator.publish("totalBetUpdated");
}
pmc.updateMobilePanelBet = function(){    
    var totalBet = this.slotModel.getTotalBet();
    this.view.onTotalBetUpdated(totalBet);
}
pmc.updateHomeMenuParent = function(){
    this.view.updateHomeMenuParent();
}