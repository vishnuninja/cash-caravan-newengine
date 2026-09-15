function ViewContainer() {
    PIXI.Container.call(this);
}

ViewContainer.prototype = Object.create(PIXI.Container.prototype);
ViewContainer.prototype.constructor = ViewContainer;

ViewContainer.prototype.createView = function (ctnList) {

    //creating containers
    for (var i in ctnList) {
        this[i] = this.getElementByType(ctnList[i]);
        this[i].name = i;
        this.addChild(this[i]);
        if(ctnList[i].makeResponsive){
            _ngFluid.call(e, ctnList[i].props);
        }else{
            pixiLib.setProperties(this[i], ctnList[i].props[_viewInfoUtil.viewType]);
        }

        //for children
        for (var j in ctnList[i].children) {
            this[j] = this.getElementByType(ctnList[i].children[j]);
            this[j].name = j;
            this[i].addChild(this[j]);
            if (ctnList[i].children[j].makeResponsive) {
                _ngFluid.call(e, ctnList[i].props);
            }else{
                pixiLib.setProperties(this[j], ctnList[i].children[j].props[_viewInfoUtil.viewType]);
            }
        }
    }
};

ViewContainer.prototype.getElement = function (config) {
    if (config.type === "sprite") {
        return pixiLib.getElement("Sprite", config.image);
    } else if (config.type === "button") {
        return pixiLib.getButton(config.image);
    } else if (config.type === "text") {
        var textStyle = config.textStyle;
        if (typeof config.textStyle == "string" && _ng.PaytableViewUIConfig.textStyle) {
            textStyle = _ng.PaytableViewUIConfig.textStyle[textStyle];
        }
        return pixiLib.getElement("Text", textStyle);
    } else if (config.type === "container") {
        return pixiLib.getContainer();
    } else if (config.type === "rect") {
        return pixiLib.getRectangleSprite();
    } else if (config.type === "circle") {
        return pixiLib.getCircle();
    } else if (config.type === "Spine"){
        return pixiLib.getElement("Spine", config.image);
    } else if (config.type === "MSText"){
        var textStyle = config.textStyle;
        if (typeof config.textStyle == "string" && _ng.PaytableViewUIConfig.textStyle) {
            textStyle = _ng.PaytableViewUIConfig.textStyle[textStyle];
        }
        return pixiLib.getElement("MSText", textStyle, config.style);
    }
};

ViewContainer.prototype.getElementByType = function (obj) {
    if (obj.type === "Sprite") {
        return pixiLib.getElement("Sprite", obj.props.img);
    } else if (obj.type === "Text") {
        var textStyle = obj.props.style;
        if (typeof obj.props.style == "string" && _ng.PaytableViewUIConfig.textStyle) {
            textStyle = _ng.PaytableViewUIConfig.textStyle[textStyle];
        }
        return pixiLib.getElement("Text", textStyle, obj.props.text);
    } else if (obj.type === "Rectangle") {
        return pixiLib.getRectangleSprite(obj.props.layout.w, obj.props.layout.h, obj.props.layout.color);
    } else if (obj.type === "Circle") {
        return pixiLib.getRectangleSprite(obj.props.layout.w, obj.props.layout.h, obj.props.layout.color);
    } else if (obj.type === "AnimatedSprite") {
        return pixiLib.getRectangleSprite(obj.props.layout.w, obj.props.layout.h, obj.props.layout.color);
    } else if (obj.type === "Container") {
        return pixiLib.getContainer();
    } else if (obj.type === "Button") {
        var options = (obj.props.hitArea) ? {"hitArea": obj.props.hitArea} : ((obj.props.options) ? obj.props.options : {});
        return pixiLib.getButton(obj.props.img, options);
    } else if (obj.type === "MSText"){
        var textStyle = obj.props.style;
        if (typeof obj.props.style == "string" && _ng.PaytableViewUIConfig.textStyle) {
            textStyle = _ng.PaytableViewUIConfig.textStyle[textStyle];
        }
        var text = pixiLib.getElement("MSText", textStyle, obj.props.text);
        pixiLib.setText(text, obj.props.text);
        return text;

    }
};

ViewContainer.prototype.show = function () {
    this.visible = true;
};

ViewContainer.prototype.hide = function () {
    this.visible = false;
};



