var _ng = _ng || {};
_ng.CoreController = function (coreApp) {
    this.coreApp = coreApp;
    this.controller = "CoreController";
    // this.addEvents();
    this.isPrimaryAssetsLoaded = false;
    this.isInitReceived = false;
}

var p = _ng.CoreController.prototype;

p.setModel = function(model){
    this.model = model;
}
p.setView = function(view){
    this.view = view;
}
p.addEvents = function(){
    _mediator.subscribe(_events.core.loadingAssetsLoaded, this.onLoadingAssetsLoaded.bind(this));
    _mediator.subscribe(_events.core.loadingCompleted, this.onloadingCompleted.bind(this));
    _mediator.subscribe(_events.core.initReceived, this.onInitReceived.bind(this));
    _mediator.subscribe(_events.core.gameCreationCompleted, this.onGameCreationCompleted.bind(this));
    _mediator.subscribe(_events.core.loadingScreenRemoved, this.onLoadingScreenRemoved.bind(this));
}

p.onLoadingScreenRemoved = function(){
    //Loading Secondary assets after, removing of Loading Screen
    //Doing both together will slow down the alpha tweening for loading screen
    _mediator.publish(_events.core.loadSecondaryAssets);
}
p.onGameCreationCompleted = function(){
    this.view.loadingScreenController.view.updateLoadingPercent(100);
    setTimeout(function () {
        this.view.removeLoadingScreen();
    }.bind(this), 500);
}
p.onLoadingAssetsLoaded = function(){
    _mediator.publish(_events.core.createLoadingScreen);
    this.view.createLoadingScreen();
    // _mediator.publish(_events.core.requestToServer, 'init');
    _mediator.publish("InitRequest");
    _mediator.publish(_events.core.loadPrimaryAssets);
    // _mediator.publish(_events.core.loadFonts);
}

p.onloadingCompleted = function(){
    this.isPrimaryAssetsLoaded = true;
    if(this.isInitReceived){
        _mediator.publish(_events.core.startCreatingGame);
    }
}

p.onInitReceived = function(){
    this.isInitReceived = true;
    if(this.isPrimaryAssetsLoaded){
        _mediator.publish(_events.core.startCreatingGame);
    }
}
