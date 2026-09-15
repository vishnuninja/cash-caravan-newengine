var Slider = function (params) {
    PIXI.Container.call(this);
    this.config = params
    this.toFixedValue = 0;
    this.initX;
    this.currentX;
    this.totalDist;
    this.finalX;
    this.valueToReturn;     //Final Value which return on getting value. Equals to currentValue is no valueArray, else return valueArray[currentValue]
    this.currentValue = 1;
    this.startingValue = 1;
    this.valueArray = [];
    this.endValue = 100;
    this.defaultIndex = 0;
    this.prefix = "";
    this.postfix = "";
    this.previousValue;
    this.isManualCreation = false;
    this.isPreviousValueUpdated = false;
    this.isDotClicked = false;
    this.mouseData = pixiLib.getRenderer().plugins.interaction.eventData.global;
    this.isVerticalSlider = (this.config.isVerticalSlider) ? true : false;
    this.isActive = true;

    if (!this.config.manualCreation) {
        this.createView();
    }
    _mediator.subscribe(_events.core.onResize, this.onSliderResize.bind(this));
}

Slider.constructor = Slider;
Slider.prototype = Object.create(PIXI.Container.prototype);

Slider.prototype.createView = function () {
    this.BGImage = pixiLib.getElement("Sprite", this.config.BGImage);
    this.addChild(this.BGImage);

    this.FGImage = pixiLib.getElement("Sprite", this.config.FGImage);
    this.addChild(this.FGImage);

    this.dotImage = pixiLib.getButton(this.config.dotImage, { type: "spriteBtn", "hitArea": { type: "circle", params: { r: 30, x: 0, y: 0 } } });
    this.addChild(this.dotImage);

    if (this.isVerticalSlider) {
        pixiLib.setProperties(this.FGImage, { anchor: { x: 0.5, y: 1 } });
        pixiLib.setProperties(this.BGImage, { anchor: { x: 0.5, y: 1 } });
        pixiLib.setProperties(this.dotImage, { anchor: { x: 0.5, y: 0.5 } });
    } else {
        pixiLib.setProperties(this.BGImage, { anchor: { y: 0.5 } });
        pixiLib.setProperties(this.FGImage, { anchor: { y: 0.5 } });
        pixiLib.setProperties(this.dotImage, { anchor: { x: 0.5, y: 0.5 } });
    }

    if (this.config.text) {
        this.text = pixiLib.getElement("Text", this.config.text.textStyle, "");
        this.addChild(this.text);
        pixiLib.setProperties(this.text, this.config.text.props);
        this.prefix = this.config.text.prefix || "";
        this.postfix = this.config.text.postfix || "";
    }
    if (this.config.title) {
        this.title = pixiLib.getElement("Text", this.config.title.textStyle, "");
        this.addChild(this.title);
        pixiLib.setText(this.title, this.config.title.text);
        pixiLib.setProperties(this.title, this.config.title.props);
    }
    if (this.config.displayForMinValue) {
        if (this.config.displayForMinValue.elementConstructor == "sprite") {
            this.minValueImage = pixiLib.getElement("Sprite", this.config.displayForMinValue.params.image);
            this.addChild(this.minValueImage);
            pixiLib.setProperties(this.minValueImage, this.config.displayForMinValue.params.props);
        } else if (this.config.displayForMinValue.elementConstructor == "text") {
            this.minValueImage = pixiLib.getElement("Text", this.config.displayForMinValue.params.textStyle, "");
            this.addChild(this.minValueImage);
            pixiLib.setText(this.minValueImage, this.config.displayForMinValue.params.text);
            pixiLib.setProperties(this.minValueImage, this.config.displayForMinValue.params.props);
        }
    }
    if (this.config.displayForMaxValue) {
        if (this.config.displayForMaxValue.elementConstructor == "text") {
            this.maxValueImage = pixiLib.getElement("Text", this.config.displayForMaxValue.params.textStyle, "");
            this.addChild(this.maxValueImage);
            pixiLib.setText(this.maxValueImage, this.config.displayForMaxValue.params.text);
            pixiLib.setProperties(this.maxValueImage, this.config.displayForMaxValue.params.props);
        } else if (this.config.displayForMaxValue.elementConstructor == "sprite") {
            this.maxValueImage = pixiLib.getElement("Sprite", this.config.displayForMaxValue.params.image);
            this.addChild(this.maxValueImage);
            pixiLib.setProperties(this.maxValueImage, this.config.displayForMaxValue.params.props);
        }
    }
    pixiLib.setProperties(this, this.config.props);
    setTimeout(function () {
        this.initializeVars();
    }.bind(this), 100);
    this.addEvents();
}
Slider.prototype.addTint = function (tintValue) {
    this.BGImage.tint = tintValue;
    this.FGImage.tint = tintValue;
    this.dotImage.tint = tintValue;
    if (this.text) {
        this.text.tint = tintValue;
    }
    if (this.title) {
        this.title.tint = tintValue;
    }
    if (this.minValueImage) {
        this.minValueImage.tint = tintValue;
    }
    if (this.maxValueImage) {
        this.maxValueImage.tint = tintValue;
    }
}
Slider.prototype.disableSlider = function () {
    this.isActive = false;
    pixiLib.setInteraction(this.dotImage, false);
}
Slider.prototype.enableSlider = function () {
    this.isActive = true;
    pixiLib.setInteraction(this.dotImage, true);
}
Slider.prototype.addEvents = function () {
    pixiLib.addEvent(this.dotImage, this.onMouseDown.bind(this), "mousedown");
    pixiLib.addEvent(this.dotImage, this.onMouseUp.bind(this), "mouseup");
    pixiLib.addEvent(this.dotImage, this.onMouseMove.bind(this), "mousemove");
    pixiLib.addEvent(coreApp.gameView.stage, this.onMouseUp.bind(this), "mouseup");
    pixiLib.addEvent(coreApp.gameView.stage, this.onMouseUp.bind(this), "mouseout");
}
Slider.prototype.onMouseDown = function () {
    this.isDotClicked = true;
}
Slider.prototype.onMouseUp = function () {
    this.isDotClicked = false;
}
Slider.prototype.updateDot = function (dist) {
    dist = dist / _viewInfoUtil.viewScale;
    dist = Math.round(dist);
    this.currentX = dist;
    if (this.isVerticalSlider) {
        this.dotImage.y = -dist;
        if (this.FGImage) {
            this.FGImage.height = dist;
        }
    } else {
        this.dotImage.x = dist;
        if (this.FGImage) {
            this.FGImage.width = dist;
            this.FGImage.height = this.BGImage.height;
        }
    }
    this.updateValue();
}
Slider.prototype.updateValue = function () {
    this.currentValue = this.startingValue + (this.endValue - this.startingValue) * this.currentX / this.totalDist;
    this.currentValue = this.currentValue.toFixed(this.toFixedValue);
    if (this.isManualCreation && !this.isPreviousValueUpdated && this.config.name === "coinValueSlider") {
        this.currentValue = this.defaultIndex;
        this.isPreviousValueUpdated = true;
    }
    this.valueToReturn = this.currentValue;
    if (this.valueArray.length > 0) {
        this.valueToReturn = this.valueArray[this.currentValue];
    }
    if (this.text) {
        var valueToWrite;
        if (this.config.valueFormatter !== undefined) {
            valueToWrite = pixiLib[this.config.valueFormatter](this.valueToReturn);
        } else {
            valueToWrite = this.valueToReturn;
        }
        if (this.config.doMultiplier) {
            valueToWrite = valueToWrite * this.config.doMultiplier;
        }
        var prefix = pixiLib.getLiteralText(this.prefix);
        var postfix = pixiLib.getLiteralText(this.postfix);
        pixiLib.setText(this.text, prefix + valueToWrite + postfix);

        if (this.config.text.attachedToSlider) {
            this.text.x = this.dotImage.x;
        }
    }
    if (this.config.eventToPublish && (this.previousValue !== this.valueToReturn)) {
        _mediator.publish(this.config.eventToPublish, { value: this.valueToReturn, index: this.currentValue, isActive: this.isActive });
        this.previousValue = this.valueToReturn;
    }
}
Slider.prototype.getSliderValue = function () {
    return this.valueToReturn;
}
Slider.prototype.getCurrentIndex = function () {
    return this.currentValue;
}
Slider.prototype.getMaxIndex = function () {
    return this.valueArray.length - 1;
}
Slider.prototype.onMouseMove = function (e) {
    if (this.isDotClicked) {
        this.mouseData = coreApp.gameView.renderer.plugins.interaction.eventData.data.global;
        var mouseY = this.mouseData.y// * _viewInfoUtil.viewScale;
        var finalX = this.finalX// * _viewInfoUtil.viewScale;
        if (this.isVerticalSlider) {
            if (mouseY > this.initX) {
                this.updateDot(0);
            } else if (mouseY < finalX) {
                this.updateDot(-finalX + this.initX);
            } else {
                this.updateDot(-mouseY + this.initX);
            }
        } else {
            if (this.mouseData.x < this.initX) {
                this.updateDot(0);
            } else if (this.mouseData.x > this.finalX) {
                this.updateDot(this.finalX - this.initX);
            } else {
                this.updateDot(this.mouseData.x - this.initX);
            }
        }
    }
}
Slider.prototype.setValueArray = function (valueArray, defaultIndex) {
    if (valueArray.length > 0) {
        //We are sending directly selected lines.
        //So index will one lesser
        if (this.config.name === "lineValueSlider") {
            defaultIndex--;
        }
        this.valueArray = valueArray;
        this.startingValue = 0;
        this.endValue = this.valueArray.length - 1;
        this.currentValue = (defaultIndex !== undefined) ? defaultIndex / (this.valueArray.length - 1) : 0;
        this.toFixedValue = 0;
        this.isManualCreation = true;
        this.defaultIndex = defaultIndex;
    }
}
Slider.prototype.setMaxValue = function () {
    this.updateDot(this.totalDist * _viewInfoUtil.viewScale);
}
Slider.prototype.setMinValue = function () {
    this.updateDot(0);
}
Slider.prototype.setValue = function (index) {
    this.updateDot(this.totalDist * index * _viewInfoUtil.viewScale);
}
Slider.prototype.initializeVars = function () {
    //When creating manually(Coin Value, Line Value) call setValueArrary with proper parameters, after creating obj
    if (!this.config.manualCreation) {
        // this.setValueArray(this.valueArray, 1/this.valueArray.length);
        this.currentValue = (this.config.currentValue !== undefined) ? this.config.currentValue : 1;
        this.startingValue = (this.config.startingValue !== undefined) ? this.config.startingValue : 1;
        this.endValue = (this.config.endValue !== undefined) ? this.config.endValue : 100;
        this.toFixedValue = (this.config.toFixedValue !== undefined) ? this.config.toFixedValue : 0;
    }


    //Not changing Variable Name i.e. initX would be same in both vertical and horizontal orientation
    if (this.isVerticalSlider) {
        this.initX = this.BGImage.getGlobalPosition().y;
        this.finalX = this.initX - this.BGImage.height * _viewInfoUtil.viewScale;
        this.totalDist = this.BGImage.height;
    } else {
        this.initX = this.BGImage.getGlobalPosition().x;
        this.finalX = this.initX + this.BGImage.width * _viewInfoUtil.viewScale;
        this.totalDist = this.BGImage.width;
    }

    this.updateDot(this.currentValue * this.totalDist * _viewInfoUtil.viewScale);
}
Slider.prototype.onSliderResize = function () {
    setTimeout(function () {
        if (this.BGImage) {
            if (this.isVerticalSlider) {
                this.initX = this.BGImage.getGlobalPosition().y;
                this.finalX = this.initX - this.BGImage.height * _viewInfoUtil.viewScale;
                this.totalDist = this.BGImage.height;
            } else {
                this.initX = this.BGImage.getGlobalPosition().x;
                this.finalX = this.initX + this.BGImage.width * _viewInfoUtil.viewScale;
                this.totalDist = this.BGImage.width;
            }
        }
    }.bind(this), 500);
}