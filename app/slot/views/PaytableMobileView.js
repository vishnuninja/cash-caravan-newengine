PaytableMobileView = function () {
    PIXI.Container.call(this);
    this.elementsForResize = [];
    this.visible = false;
    this.elementPadding = 60;
};

PaytableMobileView.constructor = PaytableMobileView;
PaytableMobileView.prototype = Object.create(PIXI.Container.prototype);

PaytableMobileView.prototype.createView = function () {
    this.config = _ng.PaytableViewUIConfig.Mobile;
    this.textConfig = _ng.PaytableViewUIConfig.textStyle;
    this.offsetConfig = (_ng.GameConfig.paytable && _ng.GameConfig.paytable.mobileOffset) ? _ng.GameConfig.paytable.mobileOffset : {}
    this.elementPadding = (this.offsetConfig.gap) ? this.offsetConfig.gap : 60;
    this.ptContainers = Object.keys(this.config.resizablePTContainer.params.children);

    this.bgCover = pixiLib.getGraphicsRect({w: 1280, h: 720, color: 0x000000});
    this.addChild(this.bgCover);
    this.bgCover.alpha = 0.95;

    this.scrollContainer = pixiLib.getContainer();
    this.addChild(this.scrollContainer);
    this.scrollContainer.interactive = true;

    this.scrollBGCover = pixiLib.getGraphicsRect({w: 1280, h: 720, color: 0x000000});
    this.scrollContainer.addChild(this.scrollBGCover);
    this.scrollBGCover.alpha = 0.001;

    // this.bgStrip = pixiLib.getGraphicsRect({w: 1280, h: 85, color: 0x000000});
    // this.addChild(this.bgStrip);
    // this.bgStrip.alpha = 1;

    this.getLayout(this.config, this.scrollContainer);
    
    if (this.paytableFrameBG) {
        this.addChildAt(this.paytableFrameBG, 1);
        this.bgCover.alpha = 1;
        this.bgCover.visible = false;
    }
    if (this.paytableCloseButton) {
        this.addChild(this.paytableCloseButton);
    }
    if (this.paytableFrame) {
        this.addChild(this.paytableFrame);
    }

    this.addScroll();

    setTimeout(function () {
        this.onResize();
    }.bind(this), 10);
    this.hide();
    if(_ng.GameConfig.hasVariableRTP){
        this.addRTPInPaytable();
    }
    this.addExtraElements();
    this.addEvents();
};
PaytableMobileView.prototype.addExtraElements = function () {};
PaytableMobileView.prototype.addRTPInPaytable = function () {
    var Lastpage = this.ptContainers.length - 1
    var str = pixiLib.getLiteralText("For this game, the long-term expected payback is") + " " + coreApp.gameModel.userModel.dynamicRTPText
    this["page"+ Lastpage].children[this["page"+ Lastpage].children.length - 1].text = this["page"+ Lastpage].children[this["page"+ Lastpage].children.length - 1].text.concat("\n"+ str);
};

PaytableMobileView.prototype.addEvents = function () {
    if (this.paytableCloseButton) {
        pixiLib.addEvent(this.paytableCloseButton, this.onPaytableCloseButton.bind(this));
    }
};
PaytableMobileView.prototype.onPaytableCloseButton = function () {
    _sndLib.play(_sndLib.sprite.pCloseBtnClick);
    _mediator.publish("onHidePaytable");
};

PaytableMobileView.prototype.show = function () {
    this.visible = true;
}
PaytableMobileView.prototype.hide = function () {
    this.visible = false;
}

PaytableMobileView.prototype.getLayout = function (config, parent) {
    for (var element in config) {
        var elemConfig = config[element];
        var e = null;
        if (elemConfig.elementConstructor == "parent") {
            e = pixiLib.getContainer();
            this.getLayout(elemConfig.params.children, e);
        } else if (elemConfig.elementConstructor == "sprite") {
            e = pixiLib.getElement("Sprite", elemConfig.params.backgroundImage);
        } else if (elemConfig.elementConstructor == "spine") {
            e = pixiLib.getElement("Spine", elemConfig.params.backgroundImage);
            e.state.setAnimation(0, elemConfig.params.defaultAnimation);
        }  else if (elemConfig.elementConstructor == "text") {
            var text = elemConfig.params.text || "";
            var textStyle = elemConfig.params.textStyle || {};
            if (typeof textStyle == "string") {
                textStyle = this.textConfig[textStyle];
            }
            e = pixiLib.getElement("Text", textStyle, text);
            pixiLib.setText(e, text);
        } else if (elemConfig.elementConstructor == "msText") {
            var text = elemConfig.params.text || "";
            var textStyle = elemConfig.params.textStyle || {};
            if (typeof textStyle == "string") {
                textStyle = this.textConfig[textStyle];
            }
            e = pixiLib.getElement("MSText", textStyle, "");
            text = pixiLib.getLiteralText(text);
            // if(_viewInfoUtil.device == "Desktop"){
            //     text = text.replace(/#br#/g, '/n');
            // }else{
            //     text = text.replace(/#br#/g, ' ');
            // }
            pixiLib.setText(e, text);
        } else if (elemConfig.elementConstructor == "GraphicsRect") {
            e = pixiLib.getGraphicsRect(elemConfig.params);
        } else if (elemConfig.elementConstructor == "button") {
            e = pixiLib.getButton(elemConfig.params.backgroundImage, elemConfig.params.options);
            if (elemConfig.isDisableByDefault) {
                pixiLib.setInteraction(e, false);
            }
        } else {
            if (elemConfig.elementConstructor == "PanelValueField" ||
                elemConfig.elementConstructor == "PanelBGStrip") {
                e = new _ng[elemConfig.elementConstructor](elemConfig, parent);
            } else if (_ng[elemConfig.elementConstructor]) {
                e = new _ng[elemConfig.elementConstructor](elemConfig.params, parent);
            } else {
                e = new window[elemConfig.elementConstructor](elemConfig.params, parent);
            }
            e = e.container || e;
        }
        e.name = element;
        e.props = elemConfig.params.props;
        if (!elemConfig.params.noResize) {
            if (elemConfig.params.makeResponsive) {
                e.makeResponsive = true;
                _ngFluid.call(e, elemConfig.params.props);
            } else if (elemConfig.params.subscribeToResize) {
                pixiLib.setProperties(e, elemConfig.params.props[_viewInfoUtil.viewType])
            } else {
                pixiLib.setProperties(e, elemConfig.params.props)
            }
        }
        if (elemConfig.params.subscribeToResize) {
            if ((elemConfig.elementConstructor == "text" || elemConfig.elementConstructor == "msText") && elemConfig.params.props.VL.textStyle) {
                e["textStyleVL"] = this.textConfig[elemConfig.params.props.VL.textStyle];
                e["textStyleVP"] = this.textConfig[elemConfig.params.props.VP.textStyle];
            }
            this.elementsForResize.push(element);
        }
        parent.addChild(e);
        this[element] = e;
    }
};

PaytableMobileView.prototype.onResize = function () {
    var scaleX, scaleY;
    if (!this.elementsForResize) {
        return;
    }

    for (var i = 0; i < this.elementsForResize.length; i++) {
        if (this[this.elementsForResize[i]].makeResponsive) {
            this[this.elementsForResize[i]].setAlignment(this[this.elementsForResize[i]].props);
            // if(_viewInfoUtil.viewType === "VL" || _viewInfoUtil.viewType === "VD"){
            //     scaleX = this[this.elementsForResize[i]].props.landScaleX || 1;
            //     scaleY = this[this.elementsForResize[i]].props.landScaleY || 1;
            // }else{
            //     scaleX = this[this.elementsForResize[i]].props.portScaleX || 1;
            //     scaleY = this[this.elementsForResize[i]].props.portScaleY || 1;
            // }
            // this[this.elementsForResize[i]].setScale(scaleX, scaleY);
        } else {
            pixiLib.setProperties(this[this.elementsForResize[i]], this[this.elementsForResize[i]].props[_viewInfoUtil.viewType], true);
        }
    }
    if (this.scrollBGCover) {
        setTimeout(function(){
            this.scrollBGCover.width = _viewInfoUtil.getWindowWidth();
            this.scrollBGCover.height = Math.max(_viewInfoUtil.getWindowHeight(), this.resizablePTContainer.height);
        }.bind(this), 100);
    }
    if (this.bgCover) {
        this.bgCover.width = _viewInfoUtil.getWindowWidth();
        this.bgCover.height = _viewInfoUtil.getWindowHeight();
    }

    if (this.paytableFrameBG) {
        this.paytableFrameBG.x = 0;
        this.paytableFrameBG.y = 0;
        this.paytableFrameBG.width = _viewInfoUtil.getWindowWidth();
        this.paytableFrameBG.height = _viewInfoUtil.getWindowHeight();
    }

    if (this.paytableFrame) {
        this.paytableFrame.x = 0;
        this.paytableFrame.y = 0;
        this.paytableFrame.width = _viewInfoUtil.getWindowWidth();
        this.paytableFrame.height = _viewInfoUtil.getWindowHeight();
    }
    if (this.scroller) {
        setTimeout(function(){
            var bottomOffset = (this.offsetConfig.bottom) ? this.offsetConfig.bottom : 0;
            this.scroller.updateBoundY([-this.scrollBGCover.height + _viewInfoUtil.getWindowHeight() - ((100 + bottomOffset) * _viewInfoUtil.viewScaleY), 0]);
            if(this.y < (-this.scrollBGCover.height + _viewInfoUtil.getWindowHeight())){
                this.y = -this.scrollBGCover.height + _viewInfoUtil.getWindowHeight();
            }
        }.bind(this), 200);
    }
    if (this.resizablePTContainer) {
        for(var i = 0; i < this.ptContainers.length; i++){
            if(i == 0 && this.ptContainers[i].toLowerCase().indexOf("logo") != -1){
                var topOffset = (this.offsetConfig.top) ? this.offsetConfig.top : 0;
                if(this[this.ptContainers[i]].anchor.y == 0.5){
                    this[this.ptContainers[i]].y = this.elementPadding + this[this.ptContainers[i]].height/2 + topOffset;
                }else{
                    this[this.ptContainers[i]].y = this.elementPadding + topOffset;
                }
            }else if(i >= 1){
                this[this.ptContainers[i]].y = this.elementPadding + this[this.ptContainers[i-1]].y + this[this.ptContainers[i-1]].height;
            }
        }
        this.resizablePTContainer.setSize(_ng.GameConfig.gameLayout[_viewInfoUtil.viewType].width, 0);
    }
};

PaytableMobileView.prototype.addScroll = function () {
    this.scroller = new Impetus({
        source: this.scrollContainer,
        isPixiElement: true,
        multiplier: 1,
        friction: 0.97,
        boundY: [-this.scrollBGCover.height + _viewInfoUtil.getWindowHeight(), 0],
        initialValues: [0, 0],
        update: function (x, y) {
            this.y = y;
        }
    });
};
