var GTicker =  TickerBox.prototype;

GTicker.createView = function () {
    this.tickerConfig = _ng.GameConfig.tickerConfig;
    this.ticker = pixiLib.getElement("Sprite", this.tickerConfig.bg);
    this.addChild(this.ticker);

    this.tickerText = pixiLib.getElement("Text", this.tickerConfig.msgText.textStyle);
    this.tickerText.anchor.set(0.5, 0.5);
    this.ticker.name = "TickerConfig";
    this.ticker.addChild(this.tickerText);
    this.tickerText.name = "ticker1";
    
    this.tickerTextNew = pixiLib.getElement("Text", this.tickerConfig.msgText.textStyleNew);
    this.tickerTextNew.anchor.set(0.5, 0.5);
    this.ticker.addChild(this.tickerTextNew);
    this.tickerTextNew.x = 0; this.tickerTextNew.y = 30;
    this.tickerTextNew.name = "ticker2";
    
    this.symbol = pixiLib.getElement("Sprite","");
    this.ticker.addChild(this.symbol);
    this.symbol.anchor.set(0,0);
    this.symbol.scale.set(0.15);
    this.symbol.x=  -71; this.symbol.y = -5;
    this.symbol.name = "BurstSymbol";
    // this.symbol.visible = t;
    // pixiLib.setText(this.tickerTextNew, "FreeSpins Left : 10")


    // _ngFluid.call(this, this.tickerConfig.params);
    this.onTickerResize();
    if(_ng.GameConfig.tickerConfig.hasMGTicker){
        let msg = _ng.GameConfig.tickerConfig.launchMsg ? pixiLib.getLiteralText(_ng.GameConfig.tickerConfig.launchMsg): _ng.GameConfig.tickerConfig.idleTickerMsg[0]; 
        this.showMessage(msg);
    }else{
        this.hide();
    }
    _mediator.subscribe("showNewMessage",this.showNewMessage.bind(this));
    _mediator.subscribe("onTickerResize",this.onTickerResize.bind(this));
    _mediator.subscribe("updateSymbol",this.updateSymbol.bind(this));
}

GTicker.showIdleMessage = function(){
    if(!coreApp.gameModel.isFreeSpinActive()){
        var num=pixiLib.getRandomNumber(0,3);
        // console.log("Here are the numbers: " +num);
        if(num<1)
        {
            var msg = pixiLib.getLiteralText("placeurbet_text");
        }
        else if (num<2 && _viewInfoUtil.viewType=="VD")
        {
            var msg = pixiLib.getLiteralText("tickertext3");
        }
        else{
            var msg = pixiLib.getLiteralText("spinwin_text");
        }
        pixiLib.setText(this.tickerText, _ng.GameConfig.tickerConfig.idleTickerMsg ? _ng.GameConfig.tickerConfig.idleTickerMsg : msg);


        
        // if(_ng.GameConfig.tickerConfig.idleTickerMsg){
        //     let msg = this.getRandomMsg();
        //     pixiLib.setText(this.tickerText, msg);
        // }else{
        //     pixiLib.setText(this.tickerText, msg);
        // }
    }
}

GTicker.showMessage = function (msgStr) {
    pixiLib.setText(this.tickerText, msgStr);
    // let parts = msgStr.split(' ');
    // this.tickerText.removeChildren();
    // let cumulativeX = 0;
    // parts.forEach((part, index) => {
    //     let textStyle = this.tickerConfig.msgText.textStyle; 
    //     if (index === 0) {
    //         textStyle = { ...textStyle, fill: 0x87CEEB };
    //     }

    //     let textObject = new PIXI.Text(part, textStyle);
    //     textObject.anchor.set(0.5,0.5);
    //     textObject.x = cumulativeX;
    //     cumulativeX += textObject.width + 5; // Adjust for spacing between words
    //     this.tickerText.addChild(textObject);
    // });
};

GTicker.showNewMessage = function(str){
    pixiLib.setText(this.tickerTextNew, str);
}

GTicker.updateTextWithCountUp = function(endValue, totalTime, obj){
	let startValue = parseFloat(obj.text.replace(/[^0-9.-]/g, '')) * 100 || 0;
    if (endValue == 0) {
        startValue =0;
    }
    let increment = (endValue - startValue) / totalTime;
    let startTime = new Date().getTime();
    let timer = setInterval(function() {
        let elapsedTime = new Date().getTime() - startTime;
        if (elapsedTime >= totalTime) {
            obj.text = pixiLib.getFormattedAmount(endValue); 
            clearInterval(timer);
        } else {
            let currentValue = startValue + increment * elapsedTime;
            obj.text = pixiLib.getFormattedAmount(currentValue);
        }
    }, 10);
}


GTicker.updateSymbol = function(symbolName){
    pixiLib.setTexture(this.symbol, symbolName);
}

GTicker.onSpinClick = function(){
    if(_ng.GameConfig.tickerConfig.spinClickMsg){
        pixiLib.setText(this.tickerText, _ng.GameConfig.tickerConfig.spinClickMsg);
    }else{
        pixiLib.setText(this.tickerText, gameLiterals.goodluck_text);
    }
}

GTicker.onTickerResize = function (argument) {
    
    if (this.ticker) {
        if (_viewInfoUtil.device === "Desktop")
            pixiLib.setProperties(this.ticker, this.tickerConfig.msgText.props[_viewInfoUtil.viewType]);
        else 
            _ngFluid.call(this.ticker, this.tickerConfig.params);
    }
 
}
