var _ngFluid = (function () {
    function fluidConstructor(params) {
        if (params == undefined) {
            params = {};
        }

        this.HX = params.HX || 0;
        this.HY = params.HY || 0;
        this.VX = params.VX || 0;
        this.VY = params.VY || 0;
        this.xAlignLandscape = params.landAlignX || 'CENTER';
        this.yAlignLandscape = params.landAlignY || 'CENTER';
        this.xAlignPortrait = params.portAlignX || 'CENTER';
        this.yAlignPortrait = params.portAlignY || 'CENTER';
        this.xAnchorLandscape = params.landAnchorX || 0;
        this.yAnchorLandscape = params.landAnchorY || 0;
        this.xAnchorPortrait = params.portAnchorX || 0;
        this.yAnchorPortrait = params.portAnchorY || 0;

        this.initialWidth = this.width;
        this.initialHeight = this.height;
        this.initialXScale = 1;
        this.initialYScale = 1;

        this.initialVLScaleX = (params.landScaleX !== undefined) ? params.landScaleX : this.initialXScale;
        this.initialVLScaleY = (params.landScaleY !== undefined) ? params.landScaleY : this.initialYScale;
        
        this.initialVPScaleX = (params.portScaleX !== undefined) ? params.portScaleX : this.initialXScale;
        this.initialVPScaleY = (params.portScaleY !== undefined) ? params.portScaleY : this.initialYScale;

        if(_viewInfoUtil.device === "Desktop" && params.desktopParams){
            pixiLib.setProperties(this, params.desktopParams);
        }else{
            this.onResizeReference = this.onResize.bind(this);
            _mediator.subscribe(_events.core.onResize, this.onResizeReference);
    
            this.onResize();
        }
    }

    function onResize() {
        var width = _viewInfoUtil.getWindowWidth();
        var height = _viewInfoUtil.getWindowHeight();
        this.xRatio = 1;
        this.yRatio = 1;
        this.xRatio = _viewInfoUtil.getWindowWidth() / _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].width;
        this.yRatio = _viewInfoUtil.getWindowHeight() / _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].height;

        this.scaleFactor = Math.min(this.xRatio, this.yRatio);

        try{
            this.scale.set(this.scaleFactor * this.initialXScale, this.scaleFactor * this.initialYScale);
            var x = 0, y = 0, xAlignment = 'CENTER', yAlignment = 'CENTER';
            if (_viewInfoUtil.orientation == 'landscape') {
                x = this.HX;
                y = this.HY;
                xAlignment = this.xAlignLandscape;
                yAlignment = this.yAlignLandscape;
                this.scale.set(this.scaleFactor * this.initialVLScaleX, this.scaleFactor * this.initialVLScaleY);
                if(this.anchor){
                    this.anchor.set(this.xAnchorLandscape, this.yAnchorLandscape);
                }
            } else {
                x = this.VX;
                y = this.VY;
                xAlignment = this.xAlignPortrait;
                yAlignment = this.yAlignPortrait;
                this.scale.set(this.scaleFactor * this.initialVPScaleX, this.scaleFactor * this.initialVPScaleY);
                if(this.anchor){
                    this.anchor.set(this.xAnchorPortrait, this.yAnchorPortrait);
                }
            }

            switch (xAlignment) {
                case 'CENTER':
                    this.x = x * this.xRatio + (this.initialWidth * (this.xRatio - this.scaleFactor)) / 2;
                    break;
                case 'LEFT':
                    this.x = x * this.scaleFactor;
                    break;
                case 'RIGHT':
                    this.x = width - (width / this.xRatio - x) * this.scaleFactor;
                    break;
            }
            switch (yAlignment) {
                case 'CENTER':
                    this.y = y * this.yRatio + (this.initialHeight * (this.yRatio - this.scaleFactor)) / 2;
                    break;
                case 'TOP':
                    this.y = y * this.scaleFactor;
                    break;
                case 'BOTTOM':
                    this.y = height - (height / this.yRatio - y) * this.scaleFactor;
                    break;
            }
        }catch(e){
            this.onResize = null;
        }
    }

    function setAlignment(params) {
        if ('landAlignX' in params) {
            this.xAlignLandscape = params.landAlignX;
        }
        if ('landAlignY' in params) {
            this.yAlignLandscape = params.landAlignY;
        }
        if ('portAlignX' in params) {
            this.xAlignPortrait = params.portAlignX;
        }
        if ('portAlignY' in params) {
            this.yAlignPortrait = params.portAlignY;
        }
        this.onResize();
    }

    function setPosition(params) {
        if ('HX' in params) {
            this.HX = params.HX;
        }
        if ('HY' in params) {
            this.HY = params.HY;
        }
        if ('VX' in params) {
            this.VX = params.VX;
        }
        if ('VY' in params) {
            this.VY = params.VY;
        }
        this.onResize();
    }

    function setSize(width, height) {
        this.initialWidth = width;
        this.initialHeight = height;
        this.onResize();
    }

    function setScale(xScale, yScale) {
        this.initialXScale = xScale;
        this.initialYScale = yScale;
        this.initialVLScaleX = this.initialVPScaleX = this.initialXScale;
        this.initialVLScaleY = this.initialVPScaleY = this.initialYScale;
        
        this.onResize();
        this.updateSize();
    }
    function updateSize() {
        this.initialWidth = this.width / this.scaleFactor;
        this.initialHeight = this.height / this.scaleFactor;

        this.onResize();
    }

    return function (params) {
        this.onResize = onResize;
        this.setAlignment = setAlignment;
        this.setPosition = setPosition;
        this.setSize = setSize;
        this.updateSize = updateSize;
        this.setScale = setScale;
        if(_viewInfoUtil.isDesktop){
            this.setAlignment = function(){};
            this.setPosition = function(){};
            this.setSize = function(){};
            this.updateSize = function(){};
            this.setScale = function(){};
        }

        fluidConstructor.call(this, params);
    }
})();