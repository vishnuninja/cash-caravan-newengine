function PTSymbol(obj) {
    PIXI.Container.call(this);

    this.bg = pixiLib.getGraphicsRect({w: 140, h: 340, color: 0xffffff});
    this.bg.name = "bg";
    this.bg.alpha = 0.02;
    this.addChild(this.bg);

    this.symbol = pixiLib.getElement("Sprite", obj.symbolName);
    this.symbol.scale.set(0.7);
    this.addChild(this.symbol);
    this.symbol.x = (this.bg.width - this.symbol.width) * 0.5;
    this.symbol.y = (80 - this.symbol.height)*0.5;

    this.line = pixiLib.getGraphicsRect({w: 2, h: 100, color: 0xffffff});
    this.line.name = "line";
    this.line.y = 100;
    this.addChild(this.line);

    this.txt = pixiLib.getElement("Text", obj.txtSty, obj.txt);
    this.addChild(this.txt);
    this.txt.x = (this.bg.width - this.txt.width) * 0.5;
    this.txt.y = 100;
}

PTSymbol.prototype = Object.create(PIXI.Container.prototype);
PTSymbol.prototype.constructor = PTSymbol;

PTSymbol.prototype.createView = function () {


};
