function SuperMeterView() {
    ViewContainer.call(this);
}

SuperMeterView.prototype = Object.create(ViewContainer.prototype);
SuperMeterView.prototype.constructor = SuperMeterView;

var view = SuperMeterView.prototype;

view.createView = function () {

    this.smConfig = _ng.SuperMeterConfig;
    ViewContainer.prototype.createView.call(this, this.smConfig.containerList);

    pixiLib.setInteraction(this.smCollectBtn, true);
    pixiLib.addEvent(this.smCollectBtn, this.onSMCollectBtn.bind(this, true));

    pixiLib.setInteraction(this.smBetBtn, true);
    pixiLib.addEvent(this.smBetBtn, this.onSuperMeterBtn.bind(this, true));

    this.smCoinList.visible = false;

    var smCoinValues = coreApp.gameModel.spinData.smCoinValues;

    this.smCoinValueCtrn = pixiLib.getContainer();
    this.smCoinValueCtrn.name = "smCoinValueCtrn";
    this.smCoinList.addChild(this.smCoinValueCtrn);
    this.smCoinValueCtrn.x = this.smConfig.smCoinValueCtrn.props.x;
    this.smCoinValueCtrn.y = this.smConfig.smCoinValueCtrn.props.y;

    var txtStyle = this.smConfig.smCoinValueCtrn.txtStyle;

    for (let i = 0; i < smCoinValues.length; i++) {
        const element = smCoinValues[i]; // console.log("element = ", element)
        txt = pixiLib.getElement("Text", txtStyle);
        var txtStr = pixiLib.getFormattedAmount(element);
        txt.chip = element;
        pixiLib.setText(txt, txtStr);
        pixiLib.setInteraction(txt, true);
        pixiLib.addEvent(txt, this.onBetSelectBtn.bind(this, txt));
        pixiLib.addEvent(txt, this.onBetHoverBtn.bind(this, txt), "mousedown");
        txt.y = i * 31;
        this.smCoinValueCtrn.addChild(txt);
    }

    _mediator.subscribe(_events.core.onResize, this.onResize.bind(this));

    if (_viewInfoUtil.viewType != "VD") {
        _ngFluid.call(this, this.smConfig.props);
    }
    _ng.selectedCoinValue2 = 0;
    // this.smSelectBg.y = 320;
    this.smSelectBg.y = this.smConfig.smCoinValueCtrn.props.y +  12;
    this.updateBalance();

    _mediator.subscribe(_events.slot.updateBalance, this.updateBalance.bind(this));
    _mediator.subscribe("onSMCollectResponse", this.updateBalance.bind(this));
    _mediator.subscribe("DisablePanel", this.onDisablePanel.bind(this));
    _mediator.subscribe("EnablePanel", this.onEnablePanel.bind(this));
    this.onResize();
}

view.onBetSelectBtn = function (val) {
    
    this.smCoinList.visible = false;
    _ng.selectedCoinValue2 = val.chip;
    
}
view.onBetHoverBtn = function (val) {
    console.log(val.y)
    _sndLib.play(_sndLib.sprite.btnClick);
    this.smSelectBg.y = this.smConfig.smCoinValueCtrn.props.y + val.y + 12;
    // this.smCoinList.visible = false;
    // _ng.selectedCoinValue2 = val.chip;

    // this.smCoinValueCtrn.x = this.smConfig.smCoinValueCtrn.props.x;
    // this.smCoinValueCtrn.y = this.smConfig.smCoinValueCtrn.props.y;
    // this.smSelectBg.y = this.smConfig.smCoinValueCtrn.props.y + val.y;
}

view.updateBalance = function () {
    var txtStr = pixiLib.getCurrency() + coreApp.gameModel.spinData.smBalance.toFixed(2); //pixiLib.getFormattedAmount(coreApp.gameModel.spinData.smBalance);
    pixiLib.setText(this.smBalanceTxt, txtStr);
    if (coreApp.gameModel.spinData.smBalance <= 0) {
        this.onDisablePanel();
    } else {
        this.onEnablePanel();
    }
}
view.onDisablePanel = function () {
    pixiLib.setInteraction(this.smCollectBtn, false);
    pixiLib.setInteraction(this.smBetBtn, false);
}
view.onEnablePanel = function () {
    if (coreApp.gameModel.spinData.smBalance > 0) {
        pixiLib.setInteraction(this.smCollectBtn, true);
        pixiLib.setInteraction(this.smBetBtn, true);
    }
}
view.updateSuperMeter = function (val) {
    // smValue1Txt
    // var txtStr = pixiLib.getFormattedAmount(coreApp.gameModel.spinData.smBalance);
    // pixiLib.setText(this.smBgTxt, txtStr);

    // var txtStr = pixiLib.getFormattedAmount(coreApp.gameModel.spinData.smBalance);
    // pixiLib.setText(this.smTotalCashBetTxt, txtStr);

    // if (this.smBgTxt) {
    // this.smBgTxt.setValue(coreApp.gameModel.spinData.smBalance);
    // }
}
view.onResize = function () {
    // UIUtils.setProperties(this, this.smConfig.props)
    if (_viewInfoUtil.viewType == "VD") {
        pixiLib.setProperties(this, this.smConfig.props[_viewInfoUtil.viewType])
    }
    pixiLib.setProperties(this.smCollectBgBtn, this.smConfig.containerList.smCollectBgBtn.props[_viewInfoUtil.viewType])
    pixiLib.setProperties(this.superMeterBtn, this.smConfig.containerList.superMeterBtn.props[_viewInfoUtil.viewType])
    pixiLib.setProperties(this.smCoinList, this.smConfig.containerList.smCoinList.props[_viewInfoUtil.viewType])

}
view.onSMCollectBtn = function () {
    _sndLib.play(_sndLib.sprite.btnClick);
    _mediator.publish("showSuperMeterPopup");
    this.smCoinList.visible = false;
}

view.onSuperMeterBtn = function () {
    _sndLib.play(_sndLib.sprite.btnClick);
    // this.updateSuperMeter();
    if (coreApp.gameModel.spinData.smBalance <= 0) {
        return;
    }
    this.smCoinList.visible = !this.smCoinList.visible;
    this.smArrowBtn.scale.y = !this.smCoinList.visible ? -1 : 1;
}