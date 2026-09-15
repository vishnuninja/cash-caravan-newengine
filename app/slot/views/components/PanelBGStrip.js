var _ng = _ng || {};

_ng.PanelBGStrip = function(params, parent) {
    PIXI.Container.call(this);

    this.params = params.params;
    this.params.margin = this.params.margin || 0;
    this.params.opacity = this.params.opacity || 1;

    this.initialWidth = this.params.width || _viewInfoUtil.getWindowWidth();
    this.initialHeight = this.params.height || _viewInfoUtil.getWindowHeight();

    // var canvas = document.createElement('canvas');
    // canvas.width  = 200;
    // canvas.height = 60;
    // var ctx = canvas.getContext('2d');
    // var gradient = ctx.createLinearGradient(0, 0, 0, 50);
    // gradient.addColorStop(0, "#D3872A");
    // gradient.addColorStop(1, "#CFB732");
    // ctx.fillStyle = gradient;
    // var sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas));
    // sprite.x = 341;
    // sprite.y = 5;
    // this.addChild(sprite);


    // If background color is specified, then draw rectangle filled with the color
    if(this.params.backgroundColor !== undefined &&
       this.params.backgroundColor !== '') {
        this.backgroundColor = new PIXI.Graphics();
        this.addChild(this.backgroundColor);
        this.backgroundColor.beginFill(this.params.backgroundColor, this.params.opacity);
        this.backgroundColor.drawRect(0, 0, this.initialWidth, this.initialHeight);
        this.backgroundColor.endFill();
    }

    // If background image is specified, then create sprite with the given image
    if(this.params.backgroundImage !== undefined &&
       this.params.backgroundImage !== '') {
        this.backgroundImage = pixiLib.getElement("Sprite", this.params.backgroundImage);
        this.addChild(this.backgroundImage);

        if(this.params.width === undefined) {
            this.initialWidth = this.backgroundImage.width;
        }
        if(this.params.height === undefined) {
            this.initialHeight = this.backgroundImage.height;
        }
    }

    parent.addChild(this);
    _mediator.subscribe(_events.core.onResize, function () {
        this.onResize();
    }.bind(this));

    this.onResize();
}

_ng.PanelBGStrip.constructor = _ng.PanelBGStrip;
_ng.PanelBGStrip.prototype = Object.create(PIXI.Container.prototype);
var p = _ng.PanelBGStrip.prototype;

p.onResize = function() {
    var windowWidth = _viewInfoUtil.getWindowWidth();
    var windowHeight = _viewInfoUtil.getWindowHeight();
    var xRatio = _viewInfoUtil.viewScaleX;
    var yRatio = _viewInfoUtil.viewScaleY;
    var scaleFactor = _viewInfoUtil.viewScale;

    if(this.params.heightArray !== undefined && this.params.heightArray.length ===2){
        if(_viewInfoUtil.orientation === "landscape"){
            this.initialHeight = this.params.heightArray[0];
        }else{
            this.initialHeight = this.params.heightArray[1];
        }
    }

    this.x = 0;
    this.y = 0;

    if(this.params.alignment === 'TOP' ||
       this.params.alignment === 'BOTTOM') {
        if(!this.params.isStretchable) {
            this.x = (windowWidth - this.initialWidth * scaleFactor) / 2;
        }
        if(this.backgroundColor !== undefined) {
            if(this.params.isStretchable) {
                this.backgroundColor.width = windowWidth;
            } else {
                this.backgroundColor.width = this.initialWidth * scaleFactor;
            }
            this.backgroundColor.height = this.initialHeight * scaleFactor;
        }
        if(this.backgroundImage !== undefined) {
            if(this.params.isStretchable) {
                this.backgroundImage.width = windowWidth;
                this.backgroundImage.scale.y = scaleFactor;
            } else {
                pixiLib.setProperties(this.backgroundImage, {scale: scaleFactor});
                this.backgroundImage.x = (this.width - this.backgroundImage.width) / 2;
            }
        }

        this.y = (this.params.alignment === 'TOP') ?
                    (this.params.margin * yRatio) :
                    (windowHeight - this.params.margin * yRatio - this.initialHeight * scaleFactor);
    } else if(this.params.alignment === 'LEFT' ||
            this.params.alignment === 'RIGHT') {
        if(!this.params.isStretchable) {
            this.y = (windowHeight - this.initialHeight * scaleFactor) / 2;
        }
        if(this.backgroundColor !== undefined) {
            if(this.params.isStretchable) {
                this.backgroundColor.height = windowHeight;
            }
            this.backgroundColor.width = this.initialWidth * scaleFactor;
        }

        this.x = (this.params.alignment === 'LEFT') ?
                    (this.params.margin * xRatio) :
                    (windowWidth - this.params.margin * xRatio - this.initialWidth * scaleFactor);
    }
}