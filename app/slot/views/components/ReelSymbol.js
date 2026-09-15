/**
 * 
 * @param {*} symbolConfig 
 * format: "a":{symbol: {texture: "a"}, frontImage: {texture: "a"},  backImage: {texture: "a"}},
 * //---commented
 */
function ReelSymbol(symbolConfig) {
    this.config = symbolConfig;
    PIXI.Container.call(this);

    this.createView();
}

ReelSymbol.prototype = Object.create(PIXI.Container.prototype);
ReelSymbol.prototype.constructor = ReelSymbol;
var v = ReelSymbol.prototype;

v.createView = function(){
    //Provide x, y, scale etc in config if required.    
    //Added by Uday for Symbol spin Feature
    if(this.config && this.config.spineSymbol){
        this.symbol = new PIXI.spine.Spine(PIXI.Loader.shared.resources[this.config.spineSymbol + ".json"].spineData);
        pixiLib.setProperties(this.symbol, this.config.props)
        this.addChild(this.symbol);
        this.symbol.state.addListener({
        complete: function (entry) {
            if(entry.animation.name === "Start spin"){
                this.symbol.state.setAnimation(0, "Spin Loop", true);
            }
        }.bind(this)
    });
    }
    if(this.config.frontImage){
        this.frontImage = pixiLib.getElement("Sprite");
        pixiLib.setProperties(this.frontImage, {anchor: {x: 0.5, y: 0.5}});
        pixiLib.setProperties(this.frontImage, this.config.frontImage)
        this.addChild(this.frontImage);
    }
    if(this.config.symbol){
        this.symbol = pixiLib.getElement("Sprite");
        pixiLib.setProperties(this.symbol, {anchor: {x: 0.5, y: 0.5}});
        pixiLib.setProperties(this.symbol, this.config.symbol)
        this.addChild(this.symbol);
    }
    if(this.config.backImage){
        this.backImage = pixiLib.getElement("Sprite");
        pixiLib.setProperties(this.backImage, {anchor: {x: 0.5, y: 0.5}});
        pixiLib.setProperties(this.backImage, this.config.backImage)
        this.addChild(this.backImage);
    }
    // if(this.config.text){
    //     this.textField = pixiLib.getElement("Text", this.config.text.textStyle, this.config.text.text);
    //     pixiLib.setProperties(this.textField, { anchor: 0.5 });
    //     this.addChild(this.textField);
    // }
}
v.toggleVisibilitySymbol = function (bool){

    if (this.config.frontImage) {
        this.frontImage.visible = bool;
    }
    if (this.config.symbol) {
        this.symbol.visible = bool;
    }
    if (this.config.backImage) {
        this.backImage.visible = bool;
    }
}
v.changeSymbol = function(config){
   // console.log("config00", config);
    if(typeof config === "string"){
        pixiLib.setProperties(this.symbol, {texture: config});
    }else{
        if(config.symbol && config.symbol.texture){
            pixiLib.setProperties(this.symbol, {texture: config.symbol.texture});
        }
        if(config.frontImage && config.frontImage.texture){
            pixiLib.setProperties(this.frontImage, {texture: config.frontImage.texture});
        }
        if(config.backImage && config.backImage.texture){
            pixiLib.setProperties(this.backImage, {texture: config.backImage.texture});
        }
    }
}
v.applyTint = function(tintValue){
    if(tintValue == undefined){
        tintValue = 0xFFFFFF;
    }
    if(this.symbol){
        this.symbol.tint = tintValue;
    }
    if(this.frontImage){
        this.frontImage.tint = tintValue;
    }
    if(this.backImage){
        this.backImage.tint = tintValue;
    }
}