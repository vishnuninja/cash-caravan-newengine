var _ng = _ng || {};

_ng.LoadingScreenController = function () {
    this.addEvents();
}

var p = _ng.LoadingScreenController.prototype;

p.setView = function (view) {
    this.view = view;
}

p.addEvents = function () {
    _mediator.subscribe(_events.core.onResize, this.onResize.bind(this));
    _mediator.subscribe(_events.core.loadProgress, this.onLoadProgress.bind(this));
    _mediator.subscribe(_events.core.primaryAssetsLoaded, this.onPrimaryAssetsLoaded.bind(this));

    this.config = commonConfig.loadingScreenConfig;
    this.isPreLogoAnimationCompleted = true;
    if (this.config.logoType === "spineAnimation" || this.config.logoType === "spriteAnimation") {
        this.isPreLogoAnimationCompleted = false;
        this.isLoadingStopped = false;
        _mediator.subscribe("preLogoAnimationCompleted", this.onPreLogoAnimationCompleted.bind(this));
    }
}
p.onPreLogoAnimationCompleted = function () {
    this.isPreLogoAnimationCompleted = true;
    if (this.isLoadingStopped) {
        _mediator.publish(_events.core.loadingCompleted);
    }
}
p.onPrimaryAssetsLoaded = function () {
    this.view.updateLoadingPercent(95);
    if (!this.isPreLogoAnimationCompleted) {
        this.isLoadingStopped = true;
        return;
    }
    //Adding 500 ms delay for loading screen to show 100% for a bit of seconds
    setTimeout(function () { _mediator.publish(_events.core.loadingCompleted); }, 500);
}
p.onLoadProgress = function (percent) {
    this.view.updateLoadingPercent(percent);
}
p.onResize = function () {
    this.view.onResize();
}