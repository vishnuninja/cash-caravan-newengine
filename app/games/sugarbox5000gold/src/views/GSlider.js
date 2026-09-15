var gslider = Slider.prototype;

gslider.createView = function () {
    this.BGImage = pixiLib.getElement("Sprite", this.config.BGImage);
    this.BGImage.name = "BGImage";
    this.BGImage.interactive = true;
    this.BGImage.buttonMode = true;
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

gslider.addEvents = function () {
    pixiLib.addEvent(this.dotImage, this.onMouseDown.bind(this), "mousedown");
    pixiLib.addEvent(this.dotImage, this.onMouseUp.bind(this), "mouseup");
    pixiLib.addEvent(this.dotImage, this.onMouseMove.bind(this), "mousemove");
    pixiLib.addEvent(coreApp.gameView.stage, this.onMouseUp.bind(this), "mouseup");
    pixiLib.addEvent(coreApp.gameView.stage, this.onMouseUp.bind(this), "mouseout");
    pixiLib.addEvent(this.BGImage, this.BGImageClicked.bind(this));
}

gslider.onMouseMove = function (e) {
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
                _mediator.publish('toggleSoundbuttons', false);
                _sndLib.mute(true);
            } else if (this.mouseData.x > this.finalX) {
                _mediator.publish('toggleSoundbuttons', true);
                this.updateDot(this.finalX - this.initX);
                _sndLib.mute(false);
            } else {
                _mediator.publish('toggleSoundbuttons', true);
                this.updateDot(this.mouseData.x - this.initX);
                _sndLib.mute(false);
            }
        }
    }
};

gslider.BGImageClicked =  function (e) {
  var clickPosition;

  if (!this.isActive) 
    return; 

  this.mouseData = e.data.global; // Get click coordinates

  if (this.isVerticalSlider) {
    clickPosition = this.mouseData.y - this.BGImage.getGlobalPosition().y;
  } else {
    clickPosition = this.mouseData.x - this.BGImage.getGlobalPosition().x;
  }

  // Calculate new dot position based on click position
  var newPosition = Math.max(0, Math.min(clickPosition, this.totalDist));

  // Update dot and slider value
  this.updateDot(newPosition);
  this.changeSoundButtonTexture();
}

gslider.changeSoundButtonTexture = function() {
    if (this.mouseData.x < this.initX) {
        this.updateDot(0);
        _mediator.publish('toggleSoundbuttons', false);
        _sndLib.mute(true);
    } else if (this.mouseData.x > this.finalX) {
        _mediator.publish('toggleSoundbuttons', true);
        this.updateDot(this.finalX - this.initX);
        _sndLib.mute(false);
    } else {
        _mediator.publish('toggleSoundbuttons', true);
        this.updateDot(this.mouseData.x - this.initX);
        _sndLib.mute(false);
    }
    if(_sndLib.curVolume == 0) {
        _mediator.publish('toggleSoundbuttons', false);
        _sndLib.mute(true);
    }
}

