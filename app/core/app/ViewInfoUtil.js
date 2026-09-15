var _ng = _ng || {};
_ng.ViewInfoUtil = function (coreApp) {
    this.coreApp = coreApp;
    this.viewType = "VD";
    this.viewScale = 1;
    this.viewScaleX = 1;
    this.viewScaleY = 1;
    this.operator = "netGaming";
    this.DPR = Math.min(window.devicePixelRatio || 1, 2);
    this.orientation = "landscape";
    this.isDesktop = this.coreApp.isDesktop;
    this.device = this.coreApp.device;
    this.isPrimaryAssetsLoaded = false;
    this.isSecondaryAssetsLoaded = false;
    this.publishResizeGame = true;

    _mediator.subscribe(_events.core.primaryAssetsLoaded, function(){
        this.isPrimaryAssetsLoaded = true;
    }.bind(this));
    
    _mediator.subscribe(_events.core.secondaryAssetsLoaded, function(){
        this.isSecondaryAssetsLoaded = true;
    }.bind(this));

    window.addEventListener('resize', function(){
        setTimeout(function(){
            this.resize();
        }.bind(this), 50);
    }.bind(this), false);

    this.resize();
}
var p = _ng.ViewInfoUtil.prototype;

p.getWindowWidth = function(){
    if(this.coreApp.isDesktop){
        return _ng.GameConfig.gameLayout["VD"].width;
    }
    return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
}

p.getWindowHeight = function(){
    if(this.coreApp.isDesktop){
        return _ng.GameConfig.gameLayout["VD"].height;
    }
	return (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
}
p.getGameWidth = function(){
    return _ng.GameConfig.gameLayout[this.viewType].width;
}
p.getGameHeight = function(){
    return _ng.GameConfig.gameLayout[this.viewType].height;
}
p.setViewType = function(w, h){
    if(this.coreApp.isDesktop) {
        this.viewType = "VD";
        this.orientation = "landscape";
    } else if(w > h) {
        this.viewType = "VL";
        this.orientation = "landscape";
    } else {
        this.viewType = "VP";
        this.orientation = "portrait";
    }
}
p.isAndroid = function(){
    var ua = navigator.userAgent.toLowerCase();
    return (ua.indexOf("android") > -1);
}
p.isIpad = function(){
    return (navigator.userAgent.match(/iPad/i));
}
p.isIOS = function(){
    return (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
}
p.isIOSChrome = function(){
    return (navigator.userAgent.match(/CriOS/i));
}
p.isRunningStandalone = function(){
    if(this.isAndroid()){
        return (window.matchMedia('(display-mode: standalone)').matches);
    }else if(this.isIOS()){
        if(window.navigator.standalone == true){
            return true;
        }
    }
    return false;
}
p.checkForSwipeUp = function(){
    if(_viewInfoUtil.viewType == "VD" || commonConfig.noSwipeUp || this.isRunningStandalone()){
        return false;
    }
    return true;
}
p.resize = function(viewSize){
    var w,
        h,
        xRatio,
        yRatio,
        gameWidth,
        gameHeight;
    w = (viewSize && viewSize.hasOwnProperty("width")) ? viewSize.width : this.getWindowWidth();
    h = (viewSize && viewSize.hasOwnProperty("height")) ? viewSize.height : this.getWindowHeight();

    this.setViewType(w, h);

    gameWidth = _ng.GameConfig.gameLayout[this.viewType].width;
    gameHeight = _ng.GameConfig.gameLayout[this.viewType].height;

    xRatio = w / gameWidth;
    yRatio = h / gameHeight;

    this.viewScaleX = xRatio;
    this.viewScaleY = yRatio;
    this.viewScale = Math.min(xRatio, yRatio);

    this.coreApp.addDeviceClassToHTML(this.viewType);

    setTimeout(function(){
        if(this.isDesktop){
            _mediator.publish(_events.core.resizeRenderer);
        }else{
            _mediator.publish(_events.core.resizeRenderer);
            _mediator.publish(_events.core.onResize);
        }
    }.bind(this), 0);

}