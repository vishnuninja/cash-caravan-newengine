function PIXIUtil() {
    this.gamecurrency = "";
    return {}
}
var pixiLib = PIXIUtil.prototype;
pixiLib.allLoadedTextures = [];
pixiLib.getToNumbers = function (num) {
    const toNumbers = arr => arr.map(Number);
    return toNumbers(num);
}
pixiLib.removeDuplicates = function (data) {
    return data.filter((value, index) => data.indexOf(value) === index);
}
pixiLib.getSymbolFromPos = function (num) {
    let matrix = coreApp.gameModel.spinData.matrix.split(";").join("");
    let allSymbols = matrix.split("");
    return allSymbols[num];
}
pixiLib.getSymXYFromPos = function (pos) {
    let reelConfig = _ng.GameConfig.ReelViewUiConfig;
    let symConfig = reelConfig.data.symbolConfig;
    var matrix = coreApp.gameModel.getReelMatrix();
    var symbol = this.getSymbolFromPos(pos);
    var xV = pos % _ng.GameConfig.ReelViewUiConfig.data.noOfReels;
    var yV = Math.floor(pos / _ng.GameConfig.ReelViewUiConfig.data.noOfReels);
    var winSym = {};

    let animationConfig = (coreApp.gameModel.isFullFSActive() && _ng.GameConfig.separateSymbolsForFS) ? _ng.GameConfig.symbolAnimationsFS : _ng.GameConfig.symbolAnimations;

    var symbolOffset = (animationConfig[symbol] && animationConfig[symbol][0].offset) ? animationConfig[symbol][0].offset : { x: 0, y: 0 };
    winSym.x = reelConfig.data.eachReelPos[xV] + symbolOffset.x;
    var symbolTopPadding = (reelConfig.data.eachReelYPos) ? reelConfig.data.eachReelYPos[xV] : 0;
    var yPos = yV;
    var gaps = (symConfig.symbolYGap * (yPos + 1));
    winSym.y = ((symConfig.symbolHeight) * (yPos + 1)) + gaps + symbolTopPadding + symbolOffset.y;
    return winSym;
}

pixiLib.updateTextWithCountup = function (element, obj) {
    var isAmount = obj.isAmount || false;
    var startValue;
    if (obj.startValue !== undefined) {
        startValue = obj.startValue;
    } else {
        startValue = element.text;
        if (isAmount) {
            // startValue = startValue.split(this.getCurrency()).join("");
            startValue = this.getAmountInCents(startValue);
        }
    }

    var endValue = 0;
    if (obj.endValue !== undefined) {
        endValue = obj.endValue;
    }
    if (isAmount) {
        endValue = this.getAmountInCents(endValue.toString());
    }
    var duration = obj.duration || 4;

    element.value = startValue

    TweenMax.to(element, duration, {
        value: endValue,
        onUpdate: function () {
            element.text = this.getFormattedAmount(element.value);
        }.bind(this),
        onComplete: function () {
            element.text = this.getFormattedAmount(endValue);
        }.bind(this)
    })
}
pixiLib.moveLetters = function (element1, element2) {
    element2 = coreApp.gameView.panel.balanceField.children[2];
    element1 = coreApp.gameView.panel.winField.children[2];
}
pixiLib.getElement = function (type, props, textString) {
    if (type === "Sprite") {
        if (props && props.length > 0) {
            try {
                return new PIXI.Sprite(this.getTexture(props));
            }
            catch (e) {
                return new PIXI.Sprite();
            }
        } else {
            return new PIXI.Sprite();
        }
    } else if (type === "AnimatedSprite") {
        var frames = [];
        var len = props.length;
        var prefix = "";
        var suffix = "";
        var startIndex = 0;
        var endIndex = len;
        var repeat = (props.repeat === undefined) ? 1 : props.repeat;

        if (len === undefined) {
            // props = {prefix: "prefix_", suffix: "_suffix", startIndex: 0, endIndex: 1}
            prefix = (props.prefix !== undefined) ? props.prefix : "";
            suffix = (props.suffix !== undefined) ? props.suffix : "";
            startIndex = (props.startIndex !== undefined) ? props.startIndex : 0;
            endIndex = (props.endIndex !== undefined) ? props.endIndex : 0;

            while (repeat > 0) {
                for (var i = startIndex; i <= endIndex; i++) {
                    var tempPrefix = prefix;
                    if (props.digit === "dual" && i <= 9) {
                        tempPrefix += "0";
                    }
                    if (props.digit === "triple" && i <= 99) {
                        tempPrefix += "0";
                        if (i <= 9) {
                            tempPrefix += "0";
                        }
                    }
                    frames.push(this.getTexture(tempPrefix + i + suffix, type));
                }
                repeat--;
            }
        } else {
            for (var i = startIndex; i < endIndex; i++) {
                frames.push(this.getTexture(props[i], type));
            }
        }
        var movie = new PIXI.AnimatedSprite(frames);
        movie.animationSpeed = props.animationSpeed || 1;
        if (props.loop !== undefined) {
            movie.loop = props.loop;
        }
        movie.anchor.set(0.5, 0.5);
        return movie;
    } else if (type === "Text" || type == "MSText") {
        if (type == "MSText") {
            props = props.default;
        }
        textString = textString || "";
        var txt;

        if (props.maxWidth !== undefined) {
            props.gMaxWidth = props.maxWidth;
            delete props.maxWidth;
        }
        if (props && props.type == "BitmapFont") {
            if (props.font && !props.fontSize) {
                var tm = props.font.split(" ");
                props.fontSize = tm[0].replace("px", "");;
                props.fontName = tm[1];
                delete props.font;
            }
            txt = new PIXI.BitmapText(textString, props);
            txt.style = props;
            txt.style.defaultFontSize = txt.style.fontSize;
        } else {
            if (lang === "ko" && (props.padding == undefined || props.padding == 0)) {
                props.padding = 15;
            }
            txt = new PIXI.Text(textString, props);
            // txt.style.fontSize = props.fontSize * 2;
            // txt.scale.set(0.5);
            if (props.strokeThickness) {
                txt.style.strokeThickness = props.strokeThickness / 2;
            }
            if (props.dropShadowDistance) {
                txt.style.dropShadowDistance = props.dropShadowDistance / 2;
            }
            if (props.dropShadowBlur) {
                txt.style.dropShadowBlur = props.dropShadowBlur / 2;
            }
            if (props.lineHeight) {
                // debugger;
                txt.style.lineHeight = props.lineHeight / 2;
            }
            txt.style.defaultFontSize = txt.style.fontSize;
        }
        this.setText(txt, textString);
        return txt;
    } else if (type === "MSText") {
        // txt.style.defaultFontSize = txt.style.fontSize;
        textString = textString || "";
        var txt;
        txt = new MultiStyleText(textString, props);
        return txt;
    } else if (type === "Spine") {
        var spine = new PIXI.spine.Spine(PIXI.Loader.shared.resources[props + ".json"].spineData);
        return spine;
    } else if (type === "Graphics") {
        var x = props.x || 0;
        var y = props.y || 0;
        var color = props.color || 0x000000;
        var alpha = (props.alpha === undefined) ? 1 : props.alpha;

        var graphics = new PIXI.Graphics();
        graphics.beginFill(color);
        if (props.type === "polygon") {
            graphics.drawPolygon(props.pointsArray);
        } else if (props.type === "RoundRectangle") {
            graphics.drawRoundedRect(x, y, props.w, props.h, props.r);
        } else {
            graphics.drawRect(x, y, props.w, props.h);
        }
        graphics.alpha = alpha;
        graphics.endFill();
        return graphics;
    } else if (type === "inputField") {
        var textStyle = (props && props.textStyle) || { fontSize: '20px', padding: '12px', color: '#26272E' };
        var boxStyle = (props && props.boxStyle) || { default: { fill: 0xE8E9F3, rounded: 12, stroke: { color: 0xCBCEE0, width: 3 } }, focused: { fill: 0xE1E3EE, rounded: 12, stroke: { color: 0xABAFC6, width: 3 } }, disabled: { fill: 0xDBDBDB, rounded: 12 } };
        var ph = (props && props.placeHolder) || "Enter your text...";

        var field = new PIXI.TextInput({
            input: textStyle,
            box: boxStyle
        })

        field.placeholder = ph;
        return field;
    } else {
        return new PIXI.Container();
    }
}
pixiLib.getLiteralText = function (textString, dynamicRTP) {
    textString = _(textString);

    if (dynamicRTP) {
        for (i = 0; i < dynamicRTP.length; i++) {
            textString = textString.replace("XXXX" + i, dynamicRTP[i])
        }
    }
    try {
        if (_viewInfoUtil.device === "Desktop") {
            textString = textString.replace(/#br#/g, '\n');
            if (commonConfig.languageWithNoSpace && coreApp.lang && commonConfig.languageWithNoSpace.indexOf(coreApp.lang) > -1) {
                textString = textString.replace(/#brm#/g, '');
            } else {
                textString = textString.replace(/#brm#/g, ' ');
            }
        } else {
            textString = textString.replace(/#brm#/g, '\n');
            if (commonConfig.languageWithNoSpace && coreApp.lang && commonConfig.languageWithNoSpace.indexOf(coreApp.lang) > -1) {
                textString = textString.replace(/#br#/g, '');
            } else {
                textString = textString.replace(/#br#/g, ' ');
            }
        }
    } catch (e) { }
    return textString;
}
pixiLib.setText = function (obj, textString) {
    if (Array.isArray(textString)) {
        var fString = "";
        for (var i = 0; i < textString.length - 1; i++) {
            fString += this.getLiteralText(textString[i]) + "\n";
        }
        fString += this.getLiteralText(textString[textString.length - 1]);
        textString = fString;
    }
    obj.text = this.getLiteralText(textString);
    try {
        obj.scale.set(1, 1);
        if (obj.style && obj.style.gMaxWidth && !obj.textStyles) {
            if (obj.style.type === "BitmapFont") {
                // obj._font.size = obj.style.defaultFontSize;
                // obj.style.fontSize = obj.style.defaultFontSize;
                obj._fontSize = obj.style.defaultFontSize;
                obj.updateText(textString);
            } else {
                obj.style.fontSize = obj.style.defaultFontSize;
            }
            this.resetTheFontSize(obj, textString);
        }
    } catch (e) {
        console.log(e);
    }
}

/* function to maintain the maxSize of text field, without breaking text in lines
17-09-2019 @Vj 16-10-2019 added text for updating the bitmap font also
*/
pixiLib.resetTheFontSize = function (obj, textString) {
    if (obj.width > obj.style.gMaxWidth) {
        if (obj.style.type === "BitmapFont") {
            //obj._font.size -= 1; "_font" property is not defined in Bitmap obj, So changing it to "_fontSize". 
            obj._fontSize -= 1;
            obj.updateText(textString);
        } else {
            obj.style.fontSize -= 1;
        }
        this.resetTheFontSize(obj, textString)

    }
}
pixiLib.addEvent = function (element, callback, type) {
    if (type === undefined || type === 'click' || type === 'tap') {
        element.on('pointertap', callback);
    } else if (type === 'mousedown' || type === 'touchstart') {
        element.on('pointerdown', callback);
    } else if (type === 'mouseup' || type === 'touchend') {
        element.on('pointerup', callback);
    } else if (type === 'mousemove' || type === 'touchmove') {
        element.on('pointermove', callback);
    } else if (type === 'mouseout' || type === 'pointerout') {
        element.on('pointerout', callback);
    }
}
pixiLib.addHoverInteraction = function (btn, callback, params) {
    btn.on('mouseover', callback, params);
    btn.on('touchstart', callback, params);
}

pixiLib.addOutInteraction = function (btn, callback, params) {
    btn.on('mouseout', callback, params);
    btn.on('touchend', callback, params);
}
pixiLib.getTexture = function (name) {
    if (name != "") {
        return PIXI.Texture.from(name);
    }
};
pixiLib.getShape = function (type, obj) {
    if (type === "rect" || type === "roundRect") {
        var graphics = new PIXI.Graphics();
        if (obj.border) {
            obj.borderW = obj.borderW || 1;
            obj.borderColor = obj.borderColor || 0xFFFFFF;
            obj.borderAlpha = obj.borderAlpha || 1;
            graphics.lineStyle(obj.borderW, obj.borderColor, obj.borderAlpha);
        }
        graphics.beginFill(obj.color);
        if (type === "roundRect") { graphics.drawRect(0, 0, obj.w, obj.h, obj.r); } else { graphics.drawRect(0, 0, obj.w, obj.h); }
        return graphics;
    } else if (type === "circle") {
        var graphics = new PIXI.Graphics(obj.nativeLines);
        graphics.beginFill(obj.color);
        graphics.drawCircle(obj.x, obj.y, obj.r);
        return graphics;
    }
};
pixiLib.setProperties = function (element, props, isUpdateText) {
    if (props.x !== undefined) { element.x = props.x; }
    if (props.y !== undefined) { element.y = props.y; }
    if (props.scale !== undefined) {
        if (!isNaN(Number(props.scale))) {
            element.scale.set(props.scale);
        } else {
            if (props.scale.x !== undefined) { element.scale.x = props.scale.x; }
            if (props.scale.y !== undefined) { element.scale.y = props.scale.y; }
        }
    }
    if (props.pivot !== undefined && element.pivot !== undefined) {

        if (!isNaN(Number(props.pivot))) {
            element.pivot.set(props.pivot, props.pivot);
        } else {
            if (props.pivot.x !== undefined) { element.pivot.x = props.pivot.x; }
            if (props.pivot.y !== undefined) { element.pivot.y = props.pivot.y; }
        }
    }
    if (props.anchor !== undefined && element.anchor !== undefined) {
        if (!isNaN(Number(props.anchor))) {
            element.anchor.set(props.anchor);
        } else {
            if (props.anchor.x !== undefined) { element.anchor.x = props.anchor.x; }
            if (props.anchor.y !== undefined) { element.anchor.y = props.anchor.y; }
        }
    }
    if (props.skew !== undefined && element.skew !== undefined) {
        if (!isNaN(Number(props.skew))) {
            element.skew.set(props.skew);
        } else {
            if (props.skew.x !== undefined) { element.skew.x = props.skew.x; }
            if (props.skew.y !== undefined) { element.skew.y = props.skew.y; }
        }
    }
    if (props.alpha !== undefined) {
        element.alpha = props.alpha;
    }
    if (props.rotation !== undefined) {
        element.rotation = props.rotation;
    }
    if (props.visible !== undefined) {
        element.visible = props.visible;
    }
    if (props.texture !== undefined) {
        this.setTexture(element, props.texture);
    }
    if (props.tint !== undefined) {
        element.tint = props.tint
    }
    // if(element.style && props.textStyle){
    //     element.setStyle(props.textStyle);
    // }
    if (element.style && props.textStyle && isUpdateText) {
        var style = element["textStyle" + _viewInfoUtil.viewType];
        element.style = style;
        // element.style.fontSize = style.fontSize * 2;
        // element.scale.set(0.5);
        if (style.strokeThickness) {
            element.style.strokeThickness = style.strokeThickness / 2;
        }
        if (style.dropShadowDistance) {
            element.style.dropShadowDistance = style.dropShadowDistance / 2;
        }
        if (style.dropShadowBlur) {
            element.style.dropShadowBlur = style.dropShadowBlur / 2;
        }
        if (style.lineHeight) {
            element.style.lineHeight = style.lineHeight / 2;
        }
        element.style.defaultFontSize = element.style.fontSize;
        this.setText(element, element.text);
    }
    // if(element.style && props.textStyle){
    //     var style = element["textStyle" + _viewInfoUtil.viewType];
    //     element.setStyle(style);
    // }
    if (element.textStyles && props.textStyle && isUpdateText) {
        var style = element["textStyle" + _viewInfoUtil.viewType];
        element.styles = style;
        element.style.fontSize = style.fontSize * 2;
        element.scale.set(0.5);
        // if(style.strokeThickness){
        //     element.style.strokeThickness = style.strokeThickness/2;
        // }
        // if(style.dropShadowDistance){
        //     element.style.dropShadowDistance = style.dropShadowDistance/2;
        // }
        // if(style.dropShadowBlur){
        //     element.style.dropShadowBlur = style.dropShadowBlur/2;
        // }
        // if(style.lineHeight){
        //     element.style.lineHeight = style.lineHeight/2;
        // }
        element.style.defaultFontSize = element.style.fontSize;
        this.setText(element, element.text);
    }
};
pixiLib.getRenderer = function () {
    if (coreApp.gameView.renderer.renderer) {
        return coreApp.gameView.renderer.renderer;
    } else {
        return coreApp.gameView.renderer;
    }
}
pixiLib.setTexture = function (obj, image) {
    if (image === "") {
        obj.texture = PIXI.Texture.EMPTY;
    } else {
        var texture = this.getTexture(image);
        obj.texture = texture;
    }
}
pixiLib.getRowColumn = function (positionOnReel) {
    var totalRows = _ng.GameConfig.ReelViewUiConfig.data.noOfSymbols;
    var totalColumns = _ng.GameConfig.ReelViewUiConfig.data.noOfReels;
    return { row: Math.floor(positionOnReel / totalColumns), column: positionOnReel % totalColumns };
}
pixiLib.getPosition = function (r, c) {
    var totalRows = _ng.GameConfig.ReelViewUiConfig.data.noOfSymbols;
    var totalColumns = _ng.GameConfig.ReelViewUiConfig.data.noOfReels;
    return ((totalColumns) * r + c);
}
pixiLib.getSymbolPosition = function (symbol) {
    var matrix = coreApp.gameModel.spinData.matrix;
    matrix = matrix.split(";").join("");
    var indexes = this.getAllIndexes(matrix, symbol);
    return indexes;
}
pixiLib.getSymbolPositionFromPostmatrix = function (symbol) {
    var matrix = coreApp.gameModel.spinData.postMatrixReels;
    if(matrix){
        matrix = matrix.join(",").split(",");
        var indexes = matrix.indexOf(symbol);//this.getAllIndexes(matrix, symbol);
        return indexes;
    }
}
pixiLib.getNeighbourPositions = function (position) {
    var rowColumn = this.getRowColumn(position);
    var neighbourPosition = { "t": -1, "l": -1, "b": -1, "r": -1 };
    var leftColumn = rowColumn.column - 1;
    if (leftColumn !== -1) {
        neighbourPosition.l = this.getPosition(rowColumn.row, leftColumn);
    }
    var rightColumn = rowColumn.column + 1;
    if (rightColumn !== _ng.GameConfig.ReelViewUiConfig.data.noOfReels) {
        neighbourPosition.r = this.getPosition(rowColumn.row, rightColumn);
    }
    var topRow = rowColumn.row - 1;
    if (topRow !== -1) {
        neighbourPosition.t = this.getPosition(topRow, rowColumn.column);
    }
    var bottomRow = rowColumn.row + 1;
    if (bottomRow !== _ng.GameConfig.ReelViewUiConfig.data.noOfSymbols) {
        neighbourPosition.b = this.getPosition(bottomRow, rowColumn.column);
    }
    return neighbourPosition;
}
pixiLib.getCurrency = function () {
    return this.gamecurrency;
}
pixiLib.setCurrency = function (currency) {
    this.gamecurrency = currency;
}
pixiLib.getCurrencyMultiplier = function () {
    return 0.01;
}

pixiLib.getCurrency = function () {
    const currencyCode = sessionStorage.getItem("adaptor_currency") // Default to "USD" if not set
    const currencyMap = {
        "usd": "$",
        "eur": "€",
        "gbp": "£",
        "dkk": "kr",
        "try": "₺"
        // Add more mappings as needed
    };
    return currencyMap[currencyCode] || "$"; // Default to "$" if code is unrecognized
};

pixiLib.getFormattedAmount = function (amount, amountwithoutcurrency) {
    // Get language from coreApp.lang or sessionStorage as fallback
    const lang = coreApp.lang || sessionStorage.getItem("Language") || "en"; // Default to "en" if not set

    // Apply currency multiplier
    amount = amount * this.getCurrencyMultiplier();
    const baseCurrency = this.getCurrency();
    // Language-specific number formatting

    const locale = lang === "tr" ? "tr-TR" : "en-US";

    let formattedNumber = Intl.NumberFormat(locale, { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(amount);

    formattedString = formattedNumber.toString();

    formattedString[formattedString.length - 1] === '0' ? formattedNumber = formattedNumber.slice(0, -1) : formattedNumber = formattedNumber;

    // Combine number and currency symbol
    let formattedAmount = `${baseCurrency} ${formattedNumber}`;

    // Remove currency symbol if requested and not in the specified list
    if (amountwithoutcurrency && ['€', '£', '$', 'kr', '₺'].indexOf(baseCurrency) === -1) {
        formattedAmount = formattedNumber;
    }

    return formattedAmount;
}


pixiLib.getAmountInCents = function (amount) {
    var amount = amount.split(this.getCurrency()).join("");
    return (amount / this.getCurrencyMultiplier());
}
pixiLib.getAllIndexes = function (arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i + 1)) != -1) {
        indexes.push(i);
    }
    return indexes;
}
pixiLib.getRandomNumber = function (min, max) {
    return Math.random() * (max - min) + min;
}
pixiLib.getRandomInteger = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
pixiLib.countDecimals = function (value) {
    if (Math.floor(value) == value) return 0;
    return value.toString().split(".")[1].length || 0;
}
/*************************************************************/
var getButtonObjects = [];
pixiLib.onStageTouch = function () {
    // console.log("Stage TouchEnd");
    for (var i = 0; i < getButtonObjects.length; i++) {
        if (getButtonObjects[i]) {
            if (getButtonObjects[i].isTouchStart) {
                getButtonObjects[i].gotoAndStop(0);
                getButtonObjects[i].isTouchStart = false;
                if (getButtonObjects[i].textObj) {
                    if (getButtonObjects[i].textObj.textTints) {
                        getButtonObjects[i].textObj.tint = getButtonObjects[i].textObj.textTints[0];
                    }

                    if (getButtonObjects[i].textObj && getButtonObjects[i].textObj.tStyles) {
                        getButtonObjects[i].textObj.style = getButtonObjects[i].textObj.tStyles[0];
                    }
                }
            }
        }
    }
    // getButtonObjects.gotoAndStop(0)
}
pixiLib.getGraphicsRect = function (params) {
    var x = params.x || 0;
    var y = params.y || 0;
    var color = params.color || 0x000000;
    var alpha = (params.alpha === undefined) ? 1 : params.alpha;

    var graphics = new PIXI.Graphics();
    graphics.beginFill(color);
    graphics.drawRect(x, y, params.w, params.h);
    graphics.alpha = alpha;

    return graphics;
}

pixiLib.getRectangleSprite = function (wid, ht, col, isBorder, borderWid, borderCol, borderAlp) {
    var graphics = new PIXI.Graphics();
    if (isBorder) {
        borderWid = borderWid || 1;
        borderCol = borderCol || 0xFFFFFF;
        borderAlp = borderAlp || 1;
        graphics.lineStyle(borderWid, borderCol, borderAlp);
    }
    // begin a fill..
    graphics.beginFill(col);

    // draw a triangle using lines
    graphics.drawRect(0, 0, wid, ht);
    return graphics;
}

pixiLib.getRoundRect = function (wid, ht, col, rad, isBorder, borderWid, borderCol, borderAlp) {
    var graphics = new PIXI.Graphics();
    if (isBorder) {
        borderWid = borderWid || 2;
        borderCol = borderCol || 0xFFFFFF;
        borderAlp = borderAlp || 1;
        graphics.lineStyle(borderWid, borderCol, borderAlp);
    }
    // begin a fill..
    graphics.beginFill(col);

    // draw a triangle using lines
    graphics.drawRoundedRect(0, 0, wid, ht, rad);
    return graphics;
},

    // pixiLib.getTexture = function (name) {
    //     return PIXI.Texture.fromFrame(name);
    // }

    pixiLib.getContainer = function () {
        return new PIXI.Container();
    }
pixiLib.getAnimatedSprite = function (arr, type) {
    var frames = [];
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        frames.push(this.getTexture(arr[i], type));
    }
    var movie = new PIXI.AnimatedSprite(frames);
    movie.anchor.set(0.5, 0.5);

    return movie;
}
pixiLib.getButton = function (name, options) {
    if (options && options.type === "spine") {
        var sprite = this.getElement("Spine", options.spineName);
        sprite.interactive = true;
        sprite.buttonMode = true;

        if (options.animations.idle) {
            sprite.state.setAnimation(0, options.animations.idle, true);
        }

        if (options.animations.click) {
            this.addEvent(sprite, function (sprite, options) {
                sprite.state.setAnimation(0, options.animations.click, false);
            }.bind(this, sprite, options), "click");
        }

        if (options.animations.hover) {
            this.addEvent(sprite, function (sprite, options) {
                sprite.state.setAnimation(2, options.animations.hover, true);
            }.bind(this, sprite, options), "mousemove");
        }
        if (options.animations.down) {
            this.addEvent(sprite, function (sprite, options) {
                sprite.state.setAnimation(2, options.animations.down, false);
            }.bind(this, sprite, options), "mousedown");
        }
        return sprite;
    }

    var arr = [];
    arr.push(this.getTexture(name + "_normal"));

    if (options && options.type === "spriteBtn") {
        arr.push(this.getTexture(name + "_normal"));
        arr.push(this.getTexture(name + "_normal"));
        arr.push(this.getTexture(name + "_normal"));
    } else {

        try {
            if (pixiLib.allLoadedTextures.indexOf(name + "_hover") >= 0) {
                arr.push(this.getTexture(name + "_hover", true));
            } else {
                arr.push(this.getTexture(name + "_normal"));
            }
        } catch (e) {
            arr.push(this.getTexture(name + "_normal"));
        }
        try {
            if (pixiLib.allLoadedTextures.indexOf(name + "_down") >= 0) {
                arr.push(this.getTexture(name + "_down", true));
            } else {
                arr.push(this.getTexture(name + "_normal"));
            }
        } catch (e) {
            arr.push(this.getTexture(name + "_normal"));
        }
        try {
            if (pixiLib.allLoadedTextures.indexOf(name + "_disabled") >= 0) {
                arr.push(this.getTexture(name + "_disabled", true));
            } else {
                arr.push(this.getTexture(name + "_normal"));
            }
        } catch (e) {
            arr.push(this.getTexture(name + "_normal"));
        }
    }

    var sprite = new PIXI.AnimatedSprite(arr);
    sprite.interactive = true;
    sprite.buttonMode = true;
    var abc;
    if (options !== undefined) {
        if (options.hitArea) {
            if (options.hitArea.type === 'rectangle') {
                sprite.hitArea = new PIXI.Rectangle(options.hitArea.params.x, options.hitArea.params.y, options.hitArea.params.w, options.hitArea.params.h);
                abc = this.getElement("Graphics", { type: "rectangle", pointsArray: options.hitArea.params, color: 0xFF0000 });
            } else if (options.hitArea.type === 'polygon') {
                //'params': [10, 10, 10, 50, 50, 50, 50, 10]

                sprite.hitArea = new PIXI.Polygon(options.hitArea.params);
                abc = this.getElement("Graphics", { type: "polygon", pointsArray: options.hitArea.params, color: 0xFF0000 });
            } else if (options.hitArea.type === 'circle') {
                var x = (options.hitArea.params === undefined || options.hitArea.params.x === undefined) ? sprite.width / 2 : options.hitArea.params.x;
                var y = (options.hitArea.params === undefined || options.hitArea.params.y === undefined) ? sprite.height / 2 : options.hitArea.params.y;
                var r = (options.hitArea.params === undefined || options.hitArea.params.r === undefined) ? sprite.width / 2 : options.hitArea.params.r;
                sprite.hitArea = new PIXI.Circle(x, y, r);
                abc = this.getShape("circle", { x: x, y: y, r: r, color: 0xFF00000 });
            }
        }
        if (abc) {
            abc.alpha = 0//.5;
            sprite.addChild(abc);            //To check hitArea rectangle, uncomment this
        }
        if (options.textField) {
            var text = options.textField.text;
            var textStyle = options.textField.textStyle;
            if (Array.isArray(textStyle)) {
                var textObj = this.getElement("Text", textStyle[0], text);
                textObj.tStyles = textStyle;
                textObj.style = textStyle[0];
            } else {
                var textObj = this.getElement("Text", textStyle, text);
            }

            this.setProperties(textObj, options.textField.props);
            sprite.addChild(textObj);
            this.setText(textObj, text);
            sprite.textObj = textObj;
            sprite.textObj.textTints = (options.textField.tints) ? options.textField.tints : [0xffffff, 0xffffff, 0xffffff, 0xffffff];
            textObj.tint = sprite.textObj.textTints[0];
        }
        if (options.icon) {
            var icon = this.getElement("Sprite", options.icon.img);
            this.setProperties(icon, options.icon.props);
            sprite.addChild(icon);
        }
    }
    sprite.mousedown = function (data) {
        sprite.gotoAndStop(2);
        if (sprite.hasIcon) {
            sprite.iconRef.gotoAndStop(0);
        }
        if (sprite.textObj) {
            sprite.textObj.tint = sprite.textObj.textTints[2];
        }
        if (sprite.textObj && sprite.textObj.tStyles) {
            sprite.textObj.style = sprite.textObj.tStyles[2];
        }
    };
    sprite.mouseover = function (data) {
        sprite.gotoAndStop(1);
        if (sprite.hasIcon) {
            sprite.iconRef.gotoAndStop(1);
        }
        if (sprite.textObj) {
            sprite.textObj.tint = sprite.textObj.textTints[1];
        }
        if (sprite.textObj && sprite.textObj.tStyles) {
            sprite.textObj.style = sprite.textObj.tStyles[1];
        }
    }
    sprite.mouseout = function (data) {
        sprite.gotoAndStop(0);
        if (sprite.hasIcon) {
            sprite.iconRef.gotoAndStop(0);
        }
        if (sprite.textObj) {
            sprite.textObj.tint = sprite.textObj.textTints[0];
        }
        if (sprite.textObj && sprite.textObj.tStyles) {
            sprite.textObj.style = sprite.textObj.tStyles[0];
        }
    }
    sprite.touchstart = function (data) {
        sprite.isTouchStart = true;
        sprite.gotoAndStop(2);
        if (sprite.hasIcon) {
            sprite.iconRef.gotoAndStop(2);
        }
        if (sprite.textObj) {
            sprite.textObj.tint = sprite.textObj.textTints[2];
        }
        if (sprite.textObj && sprite.textObj.tStyles) {
            sprite.textObj.style = sprite.textObj.tStyles[2];
        }
    }
    sprite.touchend = function (data) {
        sprite.isTouchStart = false;
        if (sprite.interactive) {
            sprite.gotoAndStop(0);
            if (sprite.hasIcon) {
                sprite.iconRef.gotoAndStop(0);
            }
            if (sprite.textObj) {
                sprite.textObj.tint = sprite.textObj.textTints[0];
            }
            if (sprite.textObj && sprite.textObj.tStyles) {
                sprite.textObj.style = sprite.textObj.tStyles[0];
            }
        }
    }
    getButtonObjects.push(sprite);
    return sprite;
}

pixiLib.setInteraction = function (btn, flag, tint) {
    btn.interactive = flag;
    btn.buttonMode = flag;
    if (flag && btn.totalFrames) {
        btn.gotoAndStop(0);
        if (btn.hasIcon) {
            btn.iconRef.gotoAndStop(0);
        }
        if (btn.textObj) {
            btn.textObj.tint = btn.textObj.textTints[2];
        }
        if (btn.textObj && btn.textObj.tStyles) {
            btn.textObj.style = btn.textObj.tStyles[0];
        }
    } else if (!flag && btn.totalFrames > 2) {
        btn.gotoAndStop(3);
        if (btn.hasIcon) {
            btn.iconRef.gotoAndStop(3);
        }
        if (btn.textObj) {
            btn.textObj.tint = btn.textObj.textTints[3];
        }
        if (btn.textObj && btn.textObj.tStyles) {
            btn.textObj.style = btn.textObj.tStyles[3];
        }
    }
    if (tint !== undefined) {
        btn.tint = tint;
    }
}
pixiLib.reloadPage = function () {
    window.location.reload();
}

pixiLib.isFullScreen = function () {
    var isInFullScreen = false;

    isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
        isInFullScreen = true;
    }

    return isInFullScreen;
}
pixiLib.toggleFulScreen = function (bol) {
    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    var docElm = document.documentElement;
    if (bol) {
        isInFullScreen = false;
    }
    if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}
pixiLib.isIpad = function () {
    return (navigator.userAgent.match(/iPad/i));
}
pixiLib.isIOS = function () {
    return (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
}
pixiLib.isIOSChrome = function () {
    return (navigator.userAgent.match(/CriOS/i));
}
pixiLib.getUrlVar = function (requestedKey) {
    var vars = [], hashes, hash,
        temp_hashes = window.location.href.slice(window.location.href.indexOf('?') + 1),
        i;
    temp_hashes = temp_hashes.replace("#", "");
    hashes = temp_hashes.split('&');
    for (i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    if (typeof requestedKey === 'undefined') {
        return vars;
    } else {
        return vars[requestedKey];
    }
}
pixiLib.getIsLocalSystem = function () {
    return (location.href.indexOf('localhost') > -1 || (location.href.indexOf('192.168') > -1))
}
/*
 *Local Storage Storing Format: {accountId-gameName-itemString: "value"}
 *e.g.  18-candybearssweetwins-noIntro: false
 */
pixiLib.getLocalStorageItem = function (item) {
    try {
        var value = localStorage.getItem(coreApp.gameModel.userModel.accountId + "-" + coreApp.gameName + "-" + item);
        return value;
    } catch (e) {
        console.log("Local Storage permission denied.");
    }
}
pixiLib.setLocalStorageItem = function (item, value) {
    try {
        localStorage.setItem(coreApp.gameModel.userModel.accountId + "-" + coreApp.gameName + "-" + item, value.toString());
    } catch (e) {
        console.log("Local Storage permission denied.");
    }
}
/*************************************************************/

pixiLib.loadJSON = function (url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // data = JSON.parse(this.responseText).text;
            callback(JSON.parse(this.responseText));
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

pixiLib.attachToSlot = function (spine, slotName, element) {
    var slotIndex = spine.spineData.findSlotIndex(slotName);
    var placeholderSlot = spine.slotContainers[slotIndex];
    if(!placeholderSlot) {

        return;
    }
    element.rotation = Math.PI;
    element.skew.y = Math.PI;
    placeholderSlot.addChild(element);
}