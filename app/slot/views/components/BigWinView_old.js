function BigWinView(gameView) {
    this.gameView = coreApp.gameView;
    ViewContainer.call(this);
    this.pivot.x = 0.5;
    this.pivot.y = 0.5;
    this.addSubscription();
}

BigWinView.prototype = Object.create(ViewContainer.prototype);
BigWinView.prototype.constructor = BigWinView.prototype;

var view = BigWinView.prototype;


view.addSubscription = function () {
    _mediator.subscribe("showBigWins", this.onShowBigWin.bind(this));
    _mediator.subscribe("showTotalWin", this.onShowTotalWin.bind(this));
    _mediator.subscribe(_events.core.onResize, this.onResize.bind(this));
};

view.createView = function (argument) {

};

view.onShowTotalWin = function () {

    var winAmount = coreApp.gameModel.spinData.getTotalWinAmount();

    if (!this.blackBg) {
        this.blackBg = pixiLib.getRectangleSprite(_ng.GameConfig.gameLayout.VD.width, _ng.GameConfig.gameLayout.VD.height, 0x000000);
        this.blackBg.alpha = 0.6;
        this.addChild(this.blackBg);
    }

    this.blackBg.visible = true;
    if (!this.winAmountTxt) {
        this.winTextStyle = _ng.GameConfig.specialWins.totalWin.textStyle;

        this.winAmountTxt = pixiLib.getElement("Text", this.winTextStyle);
        pixiLib.setText(this.winAmountTxt, pixiLib.getFormattedAmount(winAmount));
        this.winAmountTxt.anchor.set(0.5, 0.5);
        this.addChild(this.winAmountTxt);
        this.winAmountTxt.x = _ng.GameConfig.gameLayout.VD.width / 2;
        this.winAmountTxt.y = _ng.GameConfig.gameLayout.VD.height / 2;
        this.winAmountTxt.scale.set(0.5);
    }
    this.winAmountTxt.alpha = 0;
    TweenMax.to(this.winAmountTxt, 0.5, {alpha: 1});
    TweenMax.to(this.winAmountTxt.scale, 1.2, {x: 1, y: 1, ease: Back.easeOut.config(1.5)});
    this.onResize();
    setTimeout(this.hideTotalWin.bind(this), 2000);
};

view.hideTotalWin = function () {
    TweenMax.to(this.winAmountTxt, 0.5, {alpha: 0});
    TweenMax.to(this.winAmountTxt.scale, 1, {x: 0, y: 0, ease: Back.easeOut.config(1.7)});
    this.blackBg.visible = false;

    setTimeout(function () {
        _mediator.publish("onTotalWinShown");
        _mediator.publish(_events.slot.updateBalance);
    }, 1000);
};

view.onShowBigWin = function () {
    var winAmount = coreApp.gameModel.getTotalWin();
    var totalBet = coreApp.gameModel.getTotalBet();
    var bigWinConfig = _ng.GameConfig.bigWinView;
    var specialWinObj = _ng.GameConfig.specialWins;

    this.grayBg = pixiLib.getShape("rect", {w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight()});
    this.grayBg.alpha = 0.6;
    this.grayBg.name = "grayBg";
    this.grayBg.interactive = true;
    coreApp.gameView.decoratorContainer.addChildAt(this.grayBg, 0);

    var winType = "";
    if (winAmount >= specialWinObj.megaWin.multiplier * totalBet) {
        winType = "megaWin";
    } else if (winAmount >= specialWinObj.superBigWin.multiplier * totalBet) {
        winType = "superBigWin";
    } else if (winAmount >= specialWinObj.bigWin.multiplier * totalBet) {
        winType = "bigWin";
    }

    this.winTitle = pixiLib.getElement('Sprite', bigWinConfig[winType].sprite);
    this.addChild(this.winTitle);
    pixiLib.setProperties(this.winTitle, bigWinConfig[winType].params);


    // this.winSpine.state.setAnimation(0, "cogs_loop", true);

    var bigWinStyle = bigWinConfig.totalWinAmount.textStyle;
    this.bigWinAmtTxt = pixiLib.getElement("Text", bigWinStyle);
    this.addChild(this.bigWinAmtTxt);
    pixiLib.setProperties(this.bigWinAmtTxt, bigWinConfig.totalWinAmount.params);
    pixiLib.setText(this.bigWinAmtTxt, winAmount);

    this.winTitle.alpha = 0;
    TweenMax.to(this.winTitle, 1, {alpha: 1});
    TweenMax.from(this.winTitle.scale, 1, {x: 1.2, y: 1.2});

    _ngFluid.call(this, bigWinConfig.params);
    setTimeout(this.hideBigWin.bind(this), 3000);

};

view.hideBigWin = function () {
    coreApp.gameView.decoratorContainer.removeChild(this.grayBg);
    this.removeChild(this.winTitle);
    this.removeChild(this.bigWinAmtTxt);

    _mediator.publish("onBigWinShown");
};

view.onResize = function () {
    if (this.grayBg) {
        this.grayBg.width = _viewInfoUtil.getWindowWidth();
        this.grayBg.height = _viewInfoUtil.getWindowHeight();
    }

    if (this.blackBg) {
        this.blackBg.width = _viewInfoUtil.getWindowWidth();
        this.blackBg.height = _viewInfoUtil.getWindowHeight();
    }
    if(this.winAmountTxt){
        this.winAmountTxt.x = this.blackBg.width * 0.5;
        this.winAmountTxt.y = this.blackBg.height  * 0.5;
    }
    this.x = (_viewInfoUtil.getWindowWidth() - this.width)*0.5;
    this.y = (_viewInfoUtil.getWindowHeight() - this.height)*0.5
};
