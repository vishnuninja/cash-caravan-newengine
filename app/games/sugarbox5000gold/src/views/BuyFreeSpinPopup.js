/**
 * ToDo in class...
 * Remove dependency of parent...
 * Change creation of class from infopopup to Popup parent...
 */

class BuyFreeSpinPopup extends PIXI.Container {
    /** 
     * @param {*} type : "normalbuy" or "superbuy" 
     */
    constructor(parent, type) {
        super();
        this.name = "BuyFreeSpinPopup";
        this.parentClass = parent;
        this.type = type;

        _mediator.subscribe("updateFreeSpinCost", this.updateFreeSpinCost.bind(this));
        _mediator.subscribe("updateSuperSpinCost", this.updateSuperSpinCost.bind(this));
        _mediator.subscribe("closeBuyFSPopup", this.hideInfoPopup.bind(this));
	    _mediator.subscribe("spinStart", this.hideInfoPopup.bind(this));
        _mediator.subscribe(_events.core.onResize, this.resize.bind(this));

    }

    create(){
        this.grayBg = pixiLib.getShape("rect", { w: _viewInfoUtil.getWindowWidth(), h: _viewInfoUtil.getWindowHeight() });
        this.addChild(this.grayBg);
        this.grayBg.name = "this.grayBg";
        this.grayBg.alpha = 0.6;
        this.grayBg.interactive = true;
        pixiLib.addEvent(this.grayBg, this.buyFeatureCancelClicked.bind(this));

        this.bg = pixiLib.getElement("Sprite", "Popup_blank");
        this.addChild(this.bg);
        this.bg.name = "popup bg";
        this.bg.anchor.set(0.5);
        // this.bg.scale.set(0.64);

        this.buyButton = pixiLib.getButton("Accept_Button");
        this.bg.addChild(this.buyButton);
        this.buyButton.name = "buyButton";
        this.buyButton.anchor.set(0.5);
        this.buyButton.position.set(190, 140);
        pixiLib.addEvent(this.buyButton, this.onBuyFeatureClick.bind(this));

        this.cancelButton = pixiLib.getButton("Reject_Button");
        this.bg.addChild(this.cancelButton);
        this.cancelButton.name = "cancelButton";
        this.cancelButton.anchor.set(0.5);
        this.cancelButton.position.set(-190, 140);
        pixiLib.addEvent(this.cancelButton, this.buyFeatureCancelClicked.bind(this));

        var textConfig = this.getTextStyle(this.type);
        this.mainText = pixiLib.getElement("Text", textConfig.style);
        this.bg.addChild(this.mainText);
        this.mainText.anchor.set(0.5);
        this.mainText.name = "Main heading";
        this.mainText.position.set(0, -150);
        if(this.type === "normalbuy"){
            var freespinCost = pixiLib.getFormattedAmount(coreApp.gameModel.panelModel.totalBet * 100);
            var updatedText = textConfig.literalTxt;//.replace("XZ", "10").replace("XY",freespinCost);
        }
        else{
            var freespinCost = pixiLib.getFormattedAmount(coreApp.gameModel.panelModel.totalBet * coreApp.gameModel.spinData.superBuyfg);
            var updatedText = textConfig.literalTxt.replace("XW", "10").replace("XY", "20X").replace("XZ", freespinCost);
        }
        pixiLib.setText(this.mainText, updatedText);

        var bg = pixiLib.getElement("Sprite", "Popup_Box Inside");
        this.addChild(bg);
        bg.anchor.set(0.5);
        this.bg.addChild(bg);
        var textConfig = this.getTextStyle(this.type);
        this.costText = pixiLib.getElement("Text", textConfig.style);
        this.costText.anchor.set(0.5);
        bg.addChild(this.costText);
        var freespinCost = pixiLib.getFormattedAmount(coreApp.gameModel.panelModel.totalBet * 100);
        this.costText.text = freespinCost;
        
        

        // var acceptTextConfig = this.getTextStyle("acceptText");
        // var acceptText = pixiLib.getElement("Text", acceptTextConfig.style);
        // this.buyButton.addChild(acceptText);
        // acceptText.anchor.set(0.5);
        // acceptText.name = "acceptText";
        // pixiLib.setText(acceptText, acceptTextConfig.literalTxt);
        
        // var cancelTextConfig = this.getTextStyle("cancelText");
        // var cancelText = pixiLib.getElement("Text", cancelTextConfig.style);
        // this.cancelButton.addChild(cancelText);
        // cancelText.anchor.set(0.5);
        // cancelText.name = "cancelText";
        // pixiLib.setText(cancelText, cancelTextConfig.literalTxt);

        this.resize();
        
        
    }

    onBuyFeatureClick() {
        if (coreApp.gameController.allReelsStopped) {
            this.parentClass.hideInfoEventType = "";
            this.hideInfoPopup();
            _ng.buyFeaturePopupStatus = false;
            this.BuyServerReq("BuyFreeSpinContent");
            _mediator.publish("ToggleSpin", false);
            _mediator.publish("setSpaceBarEvent", "idle");
            _mediator.publish("hideMobPanel")
            _mediator.publish("disableBuyFeature");
            _mediator.publish("disablePanelFs");
            if (_viewInfoUtil.viewType == "VP")
                _mediator.publish("hideAndShowBuyControlls", true);//Only for portrait   
        }
    }

    buyFeatureCancelClicked() {
        this.parentClass.hideInfoEventType = "";
        this.hideInfoPopup();
        _ng.buyFeaturePopupStatus = false;
        _mediator.publish("ToggleMobPanel", true);
        _mediator.publish("ToggleSpin", true)
        _mediator.publish("hideMobPanel")
        _mediator.publish("hideAndShowBuyControlls", true);
        _mediator.publish("checkBalanceForBuyFeature");
        _mediator.publish("setSpaceBarEvent", "spinClick");   
    }

    updateFreeSpinCost(Updatevalue) {
        if (!this.mainText || this.type !== "normalbuy")
            return;
        var freespinCost = pixiLib.getFormattedAmount(coreApp.gameModel.panelModel.totalBet * 100);
        var updatedText = this.getTextStyle(this.type).literalTxt.replace("XY", freespinCost);
        pixiLib.setText(this.mainText, updatedText);
    }

    updateSuperSpinCost(Updatevalue) {
        if (!this.mainText || this.type !== "superbuy")
            return;
        var freespinCost = pixiLib.getFormattedAmount(coreApp.gameModel.panelModel.totalBet * coreApp.gameModel.spinData.superBuyfg);
        var updatedText = this.getTextStyle(this.type).literalTxt.replace("XW", "10").replace("XY", "20X").replace("XZ", freespinCost);
        pixiLib.setText(this.mainText, updatedText);

    }

    BuyServerReq(){
        switch (this.type) {
            case "normalbuy":
                _ng.BuyFSenabled = true;
                _mediator.publish("callBuyFreeSpinRequest");
                break;
            case "superbuy":
                _ng.GameConfig.superBuyEnabled = true;
                _mediator.publish("callSuperBuyRequest");
                break;
        }
        _mediator.publish("spinStart");
    }

    hideInfoPopup() {
        _sndLib.play(_sndLib.sprite.hidePopup);
        if (this.grayBg)
            TweenMax.to(this.grayBg, 0.3, { alpha: 0 });
        if(this.bg)
            TweenMax.to(this.bg.scale, 0.3, { x: 0, y: 0, onComplete: function () { 
                if(this.parent){
                    this.parent.removeChild(this); 
                    this.destroy();
                }
                }.bind(this) 
            });
    }

    getTextStyle(textType) {
        var textStyles = {
            "normalbuy": {
                literalTxt : "BUY FREE SPIN",//gameLiterals.buy_feature_maintext, //ToDo: Do for tr...
                style :{
                    "fontFamily": "Exo-Bold",
                    "fontSize": 35,
                    "fill": "#fffef9",
                    "align": "center",
                    "leading": 11.72,
                    "stroke": "#1c156b",
                    "strokeThickness": 5,
                    "wordWrap": true,
                    "wordWrapWidth": 750,
                    "letterSpacing": 4,
                    "fontWeight": "bold",
                    "dropShadow": true,
                    "dropShadowAngle": 1.8,
                    "dropShadowColor": "#d43b06",
                    "dropShadowDistance": 6
                }

            },
            "superbuy": {
                literalTxt : gameLiterals.super_buy_feature_text1,
                style :{
                    "fontFamily": "Exo-Bold",
                    "fontSize": 35,
                    "fill": "#fffef9",
                    "align": "center",
                    "leading": 11.72,
                    "stroke": "#1c156b",
                    "strokeThickness": 5,
                    "wordWrap": true,
                    "wordWrapWidth": 750,
                    "letterSpacing": 4,
                    "fontWeight": "bold",
                    "dropShadow": true,
                    "dropShadowAngle": 1.8,
                    "dropShadowColor": "#d43b06",
                    "dropShadowDistance": 6
                }

            },
            "acceptText": {
                literalTxt : gameLiterals.buy_feature_accept,
                style :{
                    "fontFamily": "Exo-Bold",
                    "fontSize": 30,
                    "fill": "#fffef9",
                    "align": "center",
                    "leading": 11.72,
                    "stroke": "#1c156b",
                    "strokeThickness": 5,
                    "wordWrap": true,
                    "wordWrapWidth": 750,
                    "letterSpacing": 4,
                    "fontWeight": "bold",
                    "dropShadow": true,
                    "dropShadowAngle": 1.8,
                    "dropShadowColor": "#d43b06",
                    "dropShadowDistance": 6
                }
            },
            "cancelText": {
                literalTxt : gameLiterals.buy_feature_cancel,
                style :{
                    "fontFamily": "Exo-Bold",
                    "fontSize": 30,
                    "fill": "#fffef9",
                    "align": "center",
                    "leading": 11.72,
                    "stroke": "#1c156b",
                    "strokeThickness": 5,
                    "wordWrap": true,
                    "wordWrapWidth": 750,
                    "letterSpacing": 4,
                    "fontWeight": "bold",
                    "dropShadow": true,
                    "dropShadowAngle": 1.8,
                    "dropShadowColor": "#d43b06",
                    "dropShadowDistance": 6
                }
            }
        }

        return textStyles[textType];
    }

    resize(){
        this.bg.position.set(_viewInfoUtil.getWindowWidth() / 2, _viewInfoUtil.getWindowHeight() / 2);
        // this.grayBg.setSize(_viewInfoUtil.getWindowWidth(), _viewInfoUtil.getWindowHeight() );
        this.grayBg.width = _viewInfoUtil.getWindowWidth();
        this.grayBg.height = _viewInfoUtil.getWindowHeight();
        this.bg.scale.set(1);
        
        if (_viewInfoUtil.viewType === "VP"){
            this.bg.scale.set(_viewInfoUtil.getWindowWidth()* 0.8/ this.bg.width );
        }
        else if (_viewInfoUtil.viewType === "VL"){
            this.bg.scale.set(_viewInfoUtil.getWindowWidth()* 0.6/ this.bg.width );
        }
        else{ 
            this.bg.scale.set(0.64);
        }
        var scaleToZoom = this.bg.scale.x + 0.01;
        TweenMax.to(this.bg.scale, 1, { x: scaleToZoom , y:  scaleToZoom , repeat: -1, yoyo: true, ease: Power1.easeInOut });
    }
}