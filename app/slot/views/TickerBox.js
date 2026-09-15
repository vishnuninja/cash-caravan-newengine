function TickerBox(argument) {
    ViewContainer.call(this, arguments);
}
TickerBox.prototype = Object.create(ViewContainer.prototype);
TickerBox.prototype.constructor = TickerBox.prototype;
var view = TickerBox.prototype;
view.createView = function () {
    this.tickerConfig = _ng.GameConfig.tickerConfig;
    this.ticker = pixiLib.getElement("Sprite", this.tickerConfig.bg);    
    this.addChild(this.ticker);
    this.tickerText = pixiLib.getElement("Text", this.tickerConfig.msgText.textStyle);
    this.tickerText.anchor.set(0.5, 0.5);
    this.ticker.addChild(this.tickerText);

    _ngFluid.call(this, this.tickerConfig.params);
    this.onTickerResize();
    if(_ng.GameConfig.tickerConfig.hasMGTicker){
        let msg = _ng.GameConfig.tickerConfig.launchMsg ? pixiLib.getLiteralText(_ng.GameConfig.tickerConfig.launchMsg): _ng.GameConfig.tickerConfig.idleTickerMsg[0]; 
        this.showMessage(msg);
    }else{
        this.hide();
    }
};
view.onSpinClick = function(){
    if(_ng.GameConfig.tickerConfig.spinClickMsg){
        pixiLib.setText(this.tickerText, _ng.GameConfig.tickerConfig.spinClickMsg);
    }else{
        pixiLib.setText(this.tickerText, "GOOD LUCK!");
    }
}
view.onAllReelStopped = function(){
    //this.showIdleMessage();
}
view.showIdleMessage = function(){
    if(!coreApp.gameModel.isFreeSpinActive()){
        var msg = pixiLib.getLiteralText("PLACE YOUR BET!");
        pixiLib.setText(this.tickerText, _ng.GameConfig.tickerConfig.idleTickerMsg ? _ng.GameConfig.tickerConfig.idleTickerMsg : msg);


        
        // if(_ng.GameConfig.tickerConfig.idleTickerMsg){
        //     let msg = this.getRandomMsg();
        //     pixiLib.setText(this.tickerText, msg);
        // }else{
        //     pixiLib.setText(this.tickerText, msg);
        // }
    }
};
view.getRandomMsg = function(){
    let random = Math.floor(Math.random() * _ng.GameConfig.tickerConfig.idleTickerMsg.length);
    return pixiLib.getLiteralText(_ng.GameConfig.tickerConfig.idleTickerMsg[random]);
}
view.showMessage = function (msgStr) {
    pixiLib.setText(this.tickerText, msgStr);
};
view.show = function () {
    this.visible = true;;
};
view.hide = function () {
    this.visible = false;
};
view.onTickerResize = function (argument) {
    if (this.tickerText) {
        pixiLib.setProperties(this.tickerText, this.tickerConfig.msgText.props[_viewInfoUtil.viewType]);
    }
}
