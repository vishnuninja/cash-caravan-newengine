class BuyPanelView extends PIXI.Container {

    constructor() {
        super();
        _mediator.subscribe(_events.core.onResize, this.onResize.bind(this));
    }

    createView() {
        this.HistoryArray = [];
        this.addEventListeners();
        this.createBuyButton();
        this.createTwoXButton();
        this.createHistoryBox();
        this.onResize();
    }

    addEventListeners() {
        _mediator.subscribe("UpdateBet", this.updateBuyPanelValues.bind(this));
        _mediator.subscribe("enableBuyFeature", this.enableBuyFeature.bind(this));
        _mediator.subscribe("disableBuyFeature", this.disableBuyFeature.bind(this));
        _mediator.subscribe("checkBalanceForBuyFeature", this.checkBalanceForBuyFeature.bind(this));
        _mediator.subscribe("AddHistBox", this.AddHistBox.bind(this));
        _mediator.subscribe("removeHistBox", this.removeHistBox.bind(this))
        _mediator.subscribe("_hideAndShowOfTwoXButton", this._hideAndShowOfTwoXButton.bind(this));
        _mediator.subscribe("setRemainingFSpins",this.setRemainingFSpins.bind(this));
    }

    createBuyButton() {

        this.buyButton = pixiLib.getButton("buy_feature_btn");
        this.buyButton.name = "buyButton";
        this.buyButton.anchor.set(0.5);
        this.addChild(this.buyButton);

        var freespinText = pixiLib.getElement("Text", this.getTextStyle("buyTextStyle"));
        freespinText.position.set(0, -18);
        freespinText.anchor.set(0.5);
        this.buyButton.addChild(freespinText);
        pixiLib.setText(freespinText, gameLiterals.buyText);

        this.buyFreeSpinAmount = pixiLib.getElement("Text", this.getTextStyle("buyAmountStyle"));
        this.buyFreeSpinAmount.anchor.set(0.5);
        this.buyFreeSpinAmount.name = "buyFreeSpinAmount";
        this.buyButton.addChild(this.buyFreeSpinAmount);
        this.buyFreeSpinAmount.position.set(0, 10);

        pixiLib.addEvent(this.buyButton, this.onButtonClik.bind(this, "buy"))

        if (coreApp.gameModel.obj.previous_round.coin_value) {
            pixiLib.setText(this.buyFreeSpinAmount, pixiLib.getFormattedAmount(coreApp.gameModel.obj.previous_round.coin_value * coreApp.gameModel.spinData.buyfg));
        }
        else {
            pixiLib.setText(this.buyFreeSpinAmount, pixiLib.getFormattedAmount(coreApp.gameModel.panelModel.selectedCoinValue * coreApp.gameModel.spinData.buyfg));
        }

    }

    onButtonClik(key) {
        _ng.buyFeaturePopupStatus = true;
        switch (key) {
            case "buy":
                this.disableBuyFeature();
                _ng.externalUiController.setPanelForBuyFreeSpin();
                coreApp.gameView.infoPopup.buyFreeSpinPopup();
                break;
            case "twoX":
                this.onTwoxButtonClick();
                break;

            default:
                break;
        }
    }

    onTwoxButtonClick() {
        if (_ng.twoXBetEnabled == false) {
            _ng.twoXBetEnabled = true;
            this.disableBuyFeature();
            _sndLib.play(_sndLib.sprite.btnClick);
            this.twoxoff.visible = false;
            _mediator.publish("updateTwoxbet");
        } else {
            _ng.twoXBetEnabled = false;
            this.enableBuyFeature();
            this.twoxoff.visible = true;
            _mediator.publish("updateTotalBet");
            _mediator.publish("checkBalanceForBuyFeature");
        }
    }

    createTwoXButton() {

        this.twoXBetButton = pixiLib.getButton("2xBase");
        this.twoXBetButton.name = "2XBet";
        this.twoXBetButton.anchor.set(0.5);
        this.addChild(this.twoXBetButton);
        this.twoXBetButton.position.set(100, 475);

        const style2xBuy = new PIXI.TextStyle({
            dropShadowDistance: 0,
            fill: "#fcfcfc",
            fontFamily: "Kirsty",
            fontSize: 26,
            lineJoin: "bevel",
            miterLimit: 4,
            maxWidth: 150
        });
        const doubleChanceStyle = new PIXI.TextStyle({
            dropShadowDistance: 0,
            fill: "#fcfcfc",
            fontFamily: "Kirsty",
            fontSize: 18,
            lineJoin: "bevel",
            miterLimit: 4,
            maxWidth: 150
        });
        const amountStyles = new PIXI.TextStyle({
            dropShadowDistance: 0,
            fill: "#faf434",
            fontFamily: "Kirsty",
            fontSize: 25,
            maxWidth: 165
        });

        var text1 = pixiLib.getElement("Text", style2xBuy);
        text1.anchor.set(0.5);
        pixiLib.setText(text1, gameLiterals.betText);
        this.twoXBetButton.addChild(text1)
        text1.position.set(0, -65);

        var text2 = pixiLib.getElement("Text", doubleChanceStyle);
        text2.anchor.set(0.5);
        pixiLib.setText(text2, gameLiterals.doubleText);
        text2.name = "doubleChance";
        this.twoXBetButton.addChild(text2)
        text2.position.set(0, 0);

        var text3 = pixiLib.getElement("Text", doubleChanceStyle);
        text3.anchor.set(0.5);
        text3.name = "to_win_feature"
        pixiLib.setText(text3, gameLiterals.winFeature);
        this.twoXBetButton.addChild(text3)
        text3.position.set(0, 25);

        this.twoxbetamt = pixiLib.getElement("Text", amountStyles);
        this.twoxbetamt.scale.set(1);
        this.twoxbetamt.name = "amount";
        this.twoxbetamt.position.set(0, -33);
        this.twoxbetamt.anchor.set(0.5);
        pixiLib.setText(this.twoxbetamt, "$2.8");
        this.twoXBetButton.addChild(this.twoxbetamt)

        this.twoxOn = pixiLib.getElement("Sprite", "on_btn_normal");
        this.twoxOn.position.set(0, 60);
        this.twoxOn.anchor.set(0.5);
        this.twoxOn.scale.set(0.8)
        this.twoxOn.interactive = true;
        this.twoxOn.buttonMode = true;
        this.twoXBetButton.addChild(this.twoxOn);

        this.twoxoff = pixiLib.getElement("Sprite", "off_btn_normal");
        this.twoxoff.position.set(0, 60);
        this.twoxoff.anchor.set(0.5);
        this.twoxoff.scale.set(0.8)
        this.twoxoff.interactive = true;
        this.twoxoff.buttonMode = true;
        this.twoXBetButton.addChild(this.twoxoff);

        pixiLib.addEvent(this.twoXBetButton, this.onButtonClik.bind(this, "twoX"))
        if (coreApp.gameModel.obj.previous_round.coin_value) {
            pixiLib.setText(this.twoxbetamt, pixiLib.getFormattedAmount(coreApp.gameModel.obj.previous_round.coin_value * coreApp.gameModel.spinData.antebet));
        }
        else {
            pixiLib.setText(this.twoxbetamt, pixiLib.getFormattedAmount(coreApp.gameModel.panelModel.selectedCoinValue * coreApp.gameModel.spinData.antebet));
        }
    }

    updateBuyPanelValues(amount) {

        // _mediator.publish("updateFreeSpinCost",value);//Value will update on inside the pop up(GInfoPopup);
        pixiLib.setText(this.buyFreeSpinAmount, pixiLib.getFormattedAmount(amount * coreApp.gameModel.spinData.buyfg));
        pixiLib.setText(this.twoxbetamt, pixiLib.getFormattedAmount(amount * coreApp.gameModel.spinData.antebet))
        _mediator.publish("ChangeWinValues", amount);/* PAYTABLE */

    }

    disableBuyFeature() {
        pixiLib.setInteraction(this.buyButton, false);
        pixiLib.setInteraction(this.twoxoff, false);
        pixiLib.setInteraction(this.twoxOn, false);
        pixiLib.setInteraction(this.twoXBetButton, _ng.twoXBetEnabled);
    }
    enableBuyFeature() {

        const isInHistoryMode = isHistoryMode;

        // Hide buttons and panelBase in history mode
        if (isInHistoryMode) {
            if (this.buyButton) {
                this.buyButton.visible = false;
                pixiLib.setInteraction(this.buyButton, false);
            }
            if (this.twoXBetButton) {
                this.twoXBetButton.visible = false;
                pixiLib.setInteraction(this.twoXBetButton, false);
            }
            if (this.twoxoff) {
                pixiLib.setInteraction(this.twoxoff, false);
            }
            if (this.twoxOn) {
                pixiLib.setInteraction(this.twoxOn, false);
            }
            return; // Exit early - don't enable buttons in history mode
        }

        if (coreApp.gameModel.isAutoSpinActive()) {

            if (_ng.twoXBetEnabled == true) {
                pixiLib.setInteraction(this.buyButton, false);
                _mediator.publish("enabledPanelFs");
            }
            else {
                pixiLib.setInteraction(this.buyButton, false);
                pixiLib.setInteraction(this.twoxoff, false);
                pixiLib.setInteraction(this.twoxOn, false);
                pixiLib.setInteraction(this.twoXBetButton, false);
                _mediator.publish("enabledPanelFs");
            }
        }
        else if (_ng.twoXBetEnabled == true) {
            pixiLib.setInteraction(this.buyButton, false);
            pixiLib.setInteraction(this.twoxoff, true);
            pixiLib.setInteraction(this.twoxOn, true);
            pixiLib.setInteraction(this.twoXBetButton, true);
            _mediator.publish("enabledPanelFs");
        }
        else if (coreApp.gameModel.isFreeSpinActive()) {
            _mediator.publish("disableBuyFeature");
        }
        else {
            if (this.buyButton) this.buyButton.visible = true;
            if (this.twoXBetButton) this.twoXBetButton.visible = true;
            pixiLib.setInteraction(this.buyButton, true);
            pixiLib.setInteraction(this.twoxoff, true);
            pixiLib.setInteraction(this.twoxOn, true);
            pixiLib.setInteraction(this.twoXBetButton, true);
            _mediator.publish("enabledPanelFs");
        }
    }

    checkBalanceForBuyFeature() {
        const isInHistoryMode = isHistoryMode;

        // Hide buttons and panelBase in history mode
        if (isInHistoryMode) {
            if (this.buyButton) {
                this.buyButton.visible = false;
                pixiLib.setInteraction(this.buyButton, false);
            }
            if (this.twoXBetButton) {
                this.twoXBetButton.visible = false;
                pixiLib.setInteraction(this.twoXBetButton, false);
            }
            return; // Exit early - don't check balance in history mode
        }

        if (!coreApp.gameController.allReelsStopped || coreApp.gameModel.isFreeSpinActive() ||
            coreApp.gameModel.isAutoSpinActive() || coreApp.gameModel.getIsPFSActive()) {
            return;
        }

        var userBalance = coreApp.gameModel.userModel.balance;

        var buyFsAmount = coreApp.gameModel.panelModel.selectedCoinValue * coreApp.gameModel.spinData.buyfg;
        var anteBetAmount = coreApp.gameModel.panelModel.selectedCoinValue * coreApp.gameModel.spinData.antebet;

        // Enable/disable Buy Free Game button
        const canBuyFs = buyFsAmount <= userBalance;
        pixiLib.setInteraction(this.buyButton, canBuyFs && !_ng.twoXBetEnabled);

        // Enable/disable 2x Bet button
        const canUseAnteBet = anteBetAmount <= userBalance;
        pixiLib.setInteraction(this.twoXBetButton, canUseAnteBet && !_ng.BuyFSenabled);
    }

    createHistoryBox() {
        const fsLeftStyle = {
            "type": "BitmapFont",
            "fontName": "box-Multiplier",
            "fontSize": 34,
            "align": "center",
        }
        var txtStyle = {
            align: "center",
            fill: "#ffe226",
            fontFamily: "Kirsty",
            fontSize: 24,
            lineJoin: "round",
            stroke: "#ff218c",
            strokeThickness: 4,
            dropShadow: true,
            dropShadowDistance: 6,
            dropShadowAngle: Math.PI / 2,
            dropShadowBlur: 0,
            maxWidth: 270,
        }

        this.historyBase = pixiLib.getElement("Sprite", "historybar");
        this.historyBase.name = "historyBox";
        this.addChild(this.historyBase);
        this.historyBase.anchor.set(0.5);
        this.historyBase.position.set(100, 690);

        //UP ARROW
        this.upArrow = pixiLib.getButton("upArrow");
        this.upArrow.anchor.set(0.5);
        this.upArrow.name = "UpArrow";
        this.upArrow.position.set(0, -118);
        this.upArrow.scale.set(0.8);

        this.historyBase.addChild(this.upArrow);
        pixiLib.setInteraction(this.upArrow, false);

        pixiLib.addEvent(this.upArrow, function () {
            pixiLib.setInteraction(this.upArrow, false);
            TweenMax.to(this.historyboxContainer, 0.5, {
                y: this.historyboxContainer.y - this.tumbleHistBox.height,
                ease: Power1.easeOut,
                onComplete: function () {
                    if (this.historyboxContainer.y < 21) {   /*this means first tumble history reached at the first position*/
                        pixiLib.setInteraction(this.upArrow, false);
                        pixiLib.setInteraction(this.downArrow, true);
                        return;
                    }
                    pixiLib.setInteraction(this.upArrow, true);
                    pixiLib.setInteraction(this.downArrow, true);
                }.bind(this)
            });
        }.bind(this));

        //DOWN ARROW
        this.downArrow = pixiLib.getButton("upArrow");
        this.downArrow.anchor.set(0.5);
        this.downArrow.name = "DownArrow";
        this.downArrow.position.set(0, 111);
        this.downArrow.scale.set(0.8, -0.8);

        this.historyBase.addChild(this.downArrow);
        pixiLib.setInteraction(this.downArrow, false);

        pixiLib.addEvent(this.downArrow, function () {
            pixiLib.setInteraction(this.downArrow, false);
            TweenMax.to(this.historyboxContainer, 0.5, {
                y: this.historyboxContainer.y + this.tumbleHistBox.height,
                ease: Power1.easeOut,
                onComplete: function () {
                    /*this means last tumble history reached at the top position*/
                    if (this.historyboxContainer.y > this.historyboxContainer.height - this.tumbleHistBox.height * 6) {
                        pixiLib.setInteraction(this.downArrow, false);
                        pixiLib.setInteraction(this.upArrow, true);
                        return;
                    }
                    pixiLib.setInteraction(this.upArrow, true);
                    pixiLib.setInteraction(this.downArrow, true);
                }.bind(this)
            });
        }.bind(this));

        this.historyboxContainer = pixiLib.getContainer();
        this.historyBase.addChild(this.historyboxContainer);
        this.historyboxContainer.name = "historyboxContainer";


        this.FSpinsLefttxt = pixiLib.getElement("Text", txtStyle);
        this.FSpinsLefttxt.name = "FSpinsLefttxt";
        this.FSpinsLefttxt.anchor.set(0.5);
        pixiLib.setText(this.FSpinsLefttxt, gameLiterals.freeSpinTxt);
        this.historyBase.addChild(this.FSpinsLefttxt);
        this.FSpinsLefttxt.position.set(6, -268);
        this.FSpinsLefttxt.visible = false;

        this.fsleftNum = pixiLib.getElement("Text", fsLeftStyle);
        this.fsleftNum.name = "fsleftNum";
        this.historyBase.addChild(this.fsleftNum);
        pixiLib.setText(this.fsleftNum, "");
        this.fsleftNum.anchor.set(0.5);
        this.fsleftNum.position.set(0, -208);

        this.historyMask = pixiLib.getRectangleSprite(this.historyBase.width * 1.2, this.historyBase.height * 1.4, 0x00ffff);
        this.historyBase.addChild(this.historyMask);
        this.historyMask.position.set(-80, -95);
        this.historyMask.name = "historyMask";
        this.historyMask.scale.set(0.9, 0.8);
        this.historyboxContainer.mask = this.historyMask;

    }

    AddHistBox(num, win, symbolpop, historySym) {

        var limit = coreApp.gameModel.obj.current_round.misc_prizes[num].old_reel_symbol.length;
        var sym = coreApp.gameModel.obj.current_round.misc_prizes[num].old_reel_symbol;
        for (var j = 0; j < limit; j++) {
            this.count += 1;
            this.tumbleHistBox = pixiLib.getElement("Sprite", "history_Single_Strip");
            this.tumbleHistBox.name = "tumbleHistBox";
            this.historyboxContainer.addChild(this.tumbleHistBox);
            this.tumbleHistBox.anchor.set(0.5);
            this.tumbleHistBox.scale.set(0.95);
            this.tumbleHistBox.y = -500;
            this.HistoryArray.push(this.tumbleHistBox);

            const stripStyle = new PIXI.TextStyle({
                dropShadowAlpha: 0.2,
                dropShadowColor: "#702323",
                dropShadowDistance: 0,
                fill: "#fcfcfc",
                // fontFamily: "Tahoma",
                fontSize: 24,
                fontWeight: "bold",
                lineJoin: "bevel",
                miterLimit: 4,
                stroke: "#d63d3d",
                strokeThickness: 7,
                maxWidth: 180,
            });
            this.noOfSympop = pixiLib.getElement("Text", stripStyle);
            this.noOfSympop.anchor.set(0.5);
            this.noOfSympop.position.set(-65, 0);
            this.tumbleHistBox.addChild(this.noOfSympop);
            pixiLib.setText(this.noOfSympop, symbolpop[this.count - 1]);

            this.symboltexture = pixiLib.getElement("Sprite", historySym[this.count - 1]);
            this.symboltexture.scale.set(0.12);
            this.symboltexture.anchor.set(0.5);
            this.symboltexture.position.set(-26, 0);
            this.tumbleHistBox.addChild(this.symboltexture);

            this.wingot = pixiLib.getElement("Text", stripStyle);
            this.wingot.anchor.set(1, 0.5);
            this.wingot.position.set(65, 0);
            this.tumbleHistBox.addChild(this.wingot);
            pixiLib.setText(this.wingot, pixiLib.getFormattedAmount(win[this.count - 1]))

            this.tweenHistBox(this.count - 1);
            this.stripNum += 1;

            if (this.count > 5) {
                this.removeAfter5();
                this.scrollHistoryBox();
            }
        }
    }

    scrollHistoryBox() {
        pixiLib.setInteraction(this.upArrow, true);
    }

    removeHistBox() {
        this.historyboxContainer.y = 0;
        var delay = (_ng.isQuickSpinActive && _ng.GameConfig.FastAnim) ? 0 : 0.1;
        for (let i = 0; i < this.HistoryArray.length; i++) {
            let box = this.HistoryArray[i];
            TweenMax.to(box, i * delay, {
                y: 1000,
                ease: Power1.easeOut,
                onComplete: () => {
                    if (box.parent)
                        box.parent.removeChild(box);
                }
            });
        }
        this.HistoryArray = [];
        this.flag = 0;
        this.count = 0;
        this.stripNum = 0;
        pixiLib.setInteraction(this.upArrow, false);
        pixiLib.setInteraction(this.downArrow, false);
    }

    tweenHistBox = function (num) {
        TweenMax.to(this.tumbleHistBox, 0.5, {
            y: 65 - (this.tumbleHistBox.height * num),
            ease: Sine.easeInOut,
        });
        _sndLib.play(_sndLib.sprite.Outro);
    }
    removeAfter5 = function () {
        TweenMax.to(this.historyboxContainer, 0.5, {
            y: this.historyboxContainer.y + this.tumbleHistBox.height,
            ease: Elastic.easeInOut.config(1.1, 1),
        });
    }

    _hideAndShowOfTwoXButton(bool) {
        const isInHistoryMode = isHistoryMode;
        const currentAction = bool;
        // In history mode, always hide buttons regardless of bool parameter
        if (isInHistoryMode) {
            bool = false;
        }

        this.twoXBetButton.visible = bool;
        // if(coreApp.gameView.panel.BuyBaseLeft && coreApp.gameView.panel.BuyBaseRight){
        // 	coreApp.gameView.panel.BuyBaseLeft.visible = bool;
        // 	coreApp.gameView.panel.BuyBaseRight.visible = bool;
        // }

        if (_viewInfoUtil.viewType == "VP" || (_viewInfoUtil.viewType == "VL" && !coreApp.gameModel.isFreeSpinActive())) {
            this.buyButton.visible = bool;
        }
        if (!bool) {
            if (isInHistoryMode && currentAction) {
                // this.playJarOpenClose("Idle", "Idle");
                this.FSpinsLefttxt.visible = false;
                this.fsleftNum.visible = false;
            } else {
                // this.playJarOpenClose("Opening", "Idle2");
                this.FSpinsLefttxt.visible = true;
                this.fsleftNum.visible = true;
            }
        } else {
            // this.playJarOpenClose("Closing", "Idle");

            this.FSpinsLefttxt.visible = false;
            this.fsleftNum.visible = false;
            _mediator.publish("setRemainingFSpins", "");/* Rest to null */
        }
    }
    setRemainingFSpins(count) {
        pixiLib.setText(this.fsleftNum, count);
    }
    onResize() {

        if (_viewInfoUtil.viewType === "VD") {
            this.position.set(80, -70)
            this.scale.set(0.8);

        } else if (_viewInfoUtil.viewType === "VL") {
            this.position.set(80, -70)
            this.scale.set(0.8);
        } else if (_viewInfoUtil.viewType === "VP") {
            this.position.set(0, 0);
            this.scale.set(0.8);

        }

        this.buyButton.position.set(100, 200);

    }

    hide() {

    }

    getTextStyle(type) {

        const styleObj = {
            "buyTextStyle": {
                dropShadowDistance: 0,
                fill: "#fcfcfc",
                fontFamily: "Kirsty",
                fontSize: 20,
                lineJoin: "bevel",
                miterLimit: 4,
                maxWidth: 150
            },
            "buyAmountStyle": {
                dropShadowDistance: 0,
                fill: "#faf434",
                fontFamily: "Kirsty",
                fontSize: 30,
                maxWidth: 165
            }
        }

        return styleObj[type];

    }
}

