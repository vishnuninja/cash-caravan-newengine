class MegawaysSymbol extends PIXI.Sprite {
    constructor() {
        super();
        this.anchor.set(0.5, 0);
    }

    //symbolType can be "_1x", "_2x", "_3x", "_4x", "_5x", "_6x".
    changeSymbol(texture, symbolType){
        this.texture = pixiLib.getTexture(texture + symbolType);
        var scale = _ng.GameConfig.reelSymbolConfig[texture].symbol.scale;
        this.scale.set(scale.x, scale.y);
    }
}