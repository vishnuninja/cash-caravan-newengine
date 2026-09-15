function PaytableDesktopView() {
    ViewContainer.call(this);
    this.ctnCount = 1;
    this.curIndex = 1;
}

PaytableDesktopView.prototype = Object.create(ViewContainer.prototype);
PaytableDesktopView.prototype.constructor = PaytableDesktopView;

PaytableDesktopView.prototype.createView = function () {
    // this.bg1 = PIXI.Sprite.fromImage("dist/slots/cleopatra/page5.jpg");
    // this.bg1.scale.set(0.5);
    // this.addChild(this.bg1); 

    this.ptConfig = _ng.PaytableViewUIConfig[_viewInfoUtil.device];
    ViewContainer.prototype.createView.call(this, this.ptConfig.containerList);   
    
    this.ctnCount = this.ptConfig.containerCount;
    this.createEvents();

    this["bg"].interactive = true;
    this.visible = false;
    if(commonConfig.addGameNameInPaytable){
        if(_ng.GameConfig.removeTMFromGame || commonConfig.removeTMFromGame){
            pixiLib.setText(this.txt, _ng.GameConfig.displayName.toUpperCase() + " " + this.txt.text);
        }else{
            pixiLib.setText(this.txt, _ng.GameConfig.displayName.toUpperCase() + " TM " + this.txt.text);
        }
    }
    if( _ng.GameConfig.hasVariableRTP){
        this.addRTPInPaytable();
    }
    this.addExtraElements();
};
PaytableDesktopView.prototype.addExtraElements = function(){}
PaytableDesktopView.prototype.addRTPInPaytable = function(){
    var str = pixiLib.getLiteralText("For this game, the long-term expected payback is") + " " + coreApp.gameModel.userModel.dynamicRTPText
    this["container"+ this.ctnCount].children[this["container"+ this.ctnCount].children.length - 1].text = this["container"+ this.ctnCount].children[this["container"+ this.ctnCount].children.length - 1].text.concat("\n"+ str);
}
PaytableDesktopView.prototype.update = function () {
    for (var i = 1; i <= this.ctnCount; i++) {
        this["container" + i].visible = false;
    }
    this["container" + this.curIndex].visible = true;
    this["selIndicator"].x = this["indicator" + this.curIndex].x;
};

PaytableDesktopView.prototype.createEvents = function () {
    if (this["leftArrow"]) {
        this["leftArrow"].on("pointerdown", function () {
            _sndLib.play(_sndLib.sprite.pArrowBtnClick);
            this.curIndex = (this.curIndex > 1) ? this.curIndex - 1 : this.ctnCount;
            this.update();
        }.bind(this))
    }
    if (this["rightArrow"]) {
        this["rightArrow"].on("pointerdown", function () {
            _sndLib.play(_sndLib.sprite.pArrowBtnClick);
            this.curIndex = (this.curIndex < this.ctnCount) ? this.curIndex + 1 : 1;
            this.update();
        }.bind(this))
    }
    if (this["closeBtn"]) {
        this["closeBtn"].on("pointerdown", function () {
            _sndLib.play(_sndLib.sprite.pCloseBtnClick);
            this.hide();
            _mediator.publish("onHidePaytable");
        }.bind(this))
    }

    for (var i = 1; i <= this.ctnCount; i++) {
        this["indicator" + i].interactive = true;
        this["indicator" + i].buttonMode = true;
        this["indicator" + i].on("pointerdown", function (i) {
            _sndLib.play(_sndLib.sprite.pIndicatorBtnClick);
            this.curIndex = i;
            this.update();
        }.bind(this, i))
    }

};
