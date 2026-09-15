function ClockView(argument) {
    ViewContainer.apply(this, arguments);
}

ClockView.prototype = Object.create(ViewContainer.prototype);
ClockView.prototype.constructor = ClockView;

ClockView.prototype.createView = function () {
    var obj = {
        "fontStyle": "bold",
        "fontSize": 25,
        "fontFamily": "ProximaNova_Bold",
        "fill": "#FFFFFF",
        "stroke": '#000000',
        "lineJoin": "round",
        "strokeThickness": 6
    };

    this.curTimeTxt = pixiLib.getElement("Text", obj, "");
    this.curTimeTxt.anchor.set(1);
    this.addChild(this.curTimeTxt);

    this.myClockInterval = setInterval(function () {
        var hours = new Date().getHours();
        var minutes = new Date().getMinutes();
        var realTime = (hours < 10 ? '0' : '') + hours + ' : ' + (minutes < 10 ? '0' : '') + minutes; // + ' : ' + (seconds < 10 ? '0' : '') + seconds;

        pixiLib.setText(this.curTimeTxt, "" + realTime);
        this.resize();
    }.bind(this), 1000);
    this.resize();

    _mediator.subscribe(_events.core.onResize, this.resize.bind(this));

};

ClockView.prototype.hide = function () {
    this.visible = false;
}

ClockView.prototype.show = function () {
    this.visible = true;
}
ClockView.prototype.destroy = function () {
    clearInterval(this.myClockInterval);
}
ClockView.prototype.resize = function () {
    // console.log("_viewInfoUtil.viewScale = ", _viewInfoUtil.viewScale);
    if (_viewInfoUtil.device === "Desktop") {
        // this.curTimeTxt.style.fontSize = 20 * 2;
        // this.curTimeTxt.scale.set(0.5);
        this.x = _viewInfoUtil.getWindowWidth() - 10;
        this.y = 30;
    } else {
        // this.curTimeTxt.style.fontSize = 18 * 2;
        this.curTimeTxt.scale.set(_viewInfoUtil.viewScale);
        this.x = _viewInfoUtil.getWindowWidth() - 10;
        this.y = 40 * _viewInfoUtil.viewScale;
        // this.scale.set(_viewInfoUtil.scale);
    }

};
