class BuyPanelView extends PIXI.Container {

    constructor() {
        super();
        _mediator.subscribe(_events.core.onResize, this.onResize.bind(this));
    }

    createView() {
        this.addEventListeners();
        this.createGameLogo();
        this.createBuyButton();
        this.createTwoXButton();
        this.onResize();
    }

    addEventListeners() {
        _mediator.subscribe("UpdateBet", this.updateBuyPanelValues.bind(this));
        _mediator.subscribe("enableBuyFeature", this.enableBuyFeature.bind(this));
        _mediator.subscribe("disableBuyFeature", this.disableBuyFeature.bind(this));
        _mediator.subscribe("checkBalanceForBuyFeature", this.checkBalanceForBuyFeature.bind(this));
        // _mediator.subscribe("AddHistBox", this.AddHistBox.bind(this));
        // _mediator.subscribe("removeHistBox", this.removeHistBox.bind(this))
        _mediator.subscribe("_hideAndShowOfTwoXButton", this._hideAndShowOfTwoXButton.bind(this));
        _mediator.subscribe("setRemainingFSpins",this.setRemainingFSpins.bind(this));
    }

    createGameLogo() {
        this.gameLogo = pixiLib.getElement("Spine", "Logo");
        this.gameLogo.state.setAnimation(0, "animation", true);
        this.gameLogo.scale.set(0.5);
        this.addChild(this.gameLogo);
    }

    createBuyButton() {
        this.buyButton = pixiLib.getButton("FS_btn");
        this.buyButton.name = "buyButton";
        this.buyButton.anchor.set(0.5);
        this.addChild(this.buyButton);

        var freespinText = pixiLib.getElement("Text", this.getTextStyle("buyTextStyle"));
        freespinText.position.set(0, -18);
        freespinText.anchor.set(0.5);
        this.buyButton.addChild(freespinText);
        pixiLib.setText(freespinText, gameLiterals.buyText);

        var buyAmountBg = pixiLib.getElement("Sprite","Earning_box");
        this.buyButton.addChild(buyAmountBg);
        buyAmountBg.position.set(-140, 110);
        this.buyFreeSpinAmount = pixiLib.getElement("Text", this.getTextStyle("buyAmountStyle"));
        this.buyFreeSpinAmount.anchor.set(0.5);
        this.buyFreeSpinAmount.name = "buyFreeSpinAmount";
        buyAmountBg.addChild(this.buyFreeSpinAmount);
        this.buyFreeSpinAmount.position.set(140, 40);

        pixiLib.addEvent(this.buyButton, this.onButtonClik.bind(this, "buy"))

        if (coreApp.gameModel.obj.previous_round.coin_value)
            pixiLib.setText(this.buyFreeSpinAmount, pixiLib.getFormattedAmount(coreApp.gameModel.obj.previous_round.coin_value * coreApp.gameModel.spinData.buyfg));
        else 
            pixiLib.setText(this.buyFreeSpinAmount, pixiLib.getFormattedAmount(coreApp.gameModel.panelModel.selectedCoinValue * coreApp.gameModel.spinData.buyfg));
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

        this.twoXBetButton = pixiLib.getButton("double_bet_button");
        this.twoXBetButton.name = "2XBet";
        this.twoXBetButton.anchor.set(0.5);
        this.addChild(this.twoXBetButton);
        this.twoXBetButton.position.set(0, 648);

        var text2 = pixiLib.getElement("Text", this.getTextStyle("doubleChanceStyle"));
        text2.anchor.set(0.5);
        pixiLib.setText(text2, gameLiterals.doubleText);
        text2.name = "doubleChance";
        this.twoXBetButton.addChild(text2)
        text2.position.set(0, 0);

        var twoXAmountBg = pixiLib.getElement("Sprite","Bet_Field_box");
        this.twoXBetButton.addChild(twoXAmountBg);
        twoXAmountBg.position.set(-140, -244);
        this.twoxbetamt = pixiLib.getElement("Text", this.getTextStyle("amountStyles"));
        this.twoxbetamt.scale.set(1);
        this.twoxbetamt.name = "amount";
        this.twoxbetamt.position.set(140, 50);
        this.twoxbetamt.anchor.set(0.5);
        pixiLib.setText(this.twoxbetamt, "$2.8");
        twoXAmountBg.addChild(this.twoxbetamt)

        this.twoxOn = pixiLib.getElement("Sprite", "ON_Button_normal");
        this.twoxOn.position.set(0, 60);
        this.twoxOn.anchor.set(0.5);
        this.twoxOn.scale.set(0.8)
        this.twoxOn.interactive = true;
        this.twoxOn.buttonMode = true;
        this.twoXBetButton.addChild(this.twoxOn);

        this.twoxoff = pixiLib.getElement("Sprite", "OFF_Button_normal");
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
            this.position.set(-25, 88)
            this.scale.set(0.8);

        } else if (_viewInfoUtil.viewType === "VL") {
            this.position.set(80, -70)
            this.scale.set(0.8);
        } else if (_viewInfoUtil.viewType === "VP") {
            this.position.set(0, 0);
            this.scale.set(0.8);

        }

        this.buyButton.position.set(0, 200);

    }

    hide() {

    }

    getTextStyle(type) {

        const styleObj = {
            "buyTextStyle": {
                dropShadowDistance: 0,
                fill: "#fcfcfc",
                // fontFamily: "Kirsty",
                fontSize: 20,
                lineJoin: "bevel",
                miterLimit: 4,
                maxWidth: 150
            },
            "buyAmountStyle": {
                dropShadowDistance: 0,
                fill: "#faf434",
                // fontFamily: "Kirsty",
                fontSize: 30,
                maxWidth: 165
            },
            "style2xBuy": {
                dropShadowDistance: 0,
                fill: "#fcfcfc",
                // fontFamily: "Kirsty",
                fontSize: 26,
                lineJoin: "bevel",
                miterLimit: 4,
                maxWidth: 150
            },
            "doubleChanceStyle": {
                dropShadowDistance: 0,
                fill: "#fcfcfc",
                // fontFamily: "Kirsty",
                fontSize: 18,
                lineJoin: "bevel",
                miterLimit: 4,
                maxWidth: 150
            },
            "amountStyles": {
                dropShadowDistance: 0,
                fill: "#faf434",
                // fontFamily: "Kirsty",
                fontSize: 25,
                maxWidth: 165
            },
            "fsLeftStyle":{
                // "type": "BitmapFont",
                // "fontName": "box-Multiplier",
                "fontSize": 34,
                "align": "center",
            },
            "historyTxtStyle": {
                align: "center",
                fill: "#ffe226",
                // fontFamily: "Kirsty",
                fontSize: 24,
                lineJoin: "round",
                stroke: "#ff218c",
                strokeThickness: 4,
                dropShadow: true,
                dropShadowDistance: 6,
                dropShadowAngle: Math.PI / 2,
                dropShadowBlur: 0,
                maxWidth: 270,
            },
            "stripStyle": {
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
            }
        }

        return styleObj[type];

    }
}

