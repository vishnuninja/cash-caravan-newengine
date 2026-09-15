PanelDesktopController = function (coreApp) {
    // console.log("cp2desktop");
    PanelController.call(this, coreApp);
    this.controller = "PanelDesktopController";
}
PanelDesktopController.prototype = Object.create(PanelController.prototype);
PanelDesktopController.prototype.constructor = PanelDesktopController;

var pdc = PanelDesktopController.prototype;
var spdc = PanelController.prototype;

pdc.addEvents = function(){
    spdc.addEvents.call(this);
}

pc.setView = function(view){
    this.view = view;
    this.addEvents();
}