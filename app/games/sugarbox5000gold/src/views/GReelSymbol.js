var v = ReelSymbol.prototype;
v.changeSymbol = function (config, winId) {
    var multiplierValueArry = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 50, 100, 250, 1000];
    // _ng.GameConfig.incrementMulArry = [];
    // if(this.multiplierText && this.multiplierText.parent)
    //     this.multiplierText.parent.removeChild(this.multiplierText);
    if(config == "m")
    {
        multiplierValue = coreApp.gameModel.userModel.userData.current_round.screen_wins[winId];
        
        /* CHANGING SYMBOL TEXTURE */
        if(multiplierValue <= 10 ){
            config = "10x";
        }
        else if(10 < multiplierValue  &&  multiplierValue <= 20){
            config = "20x";
        }
        else if(20 < multiplierValue &&  multiplierValue <= 50){
            config = "50x";
        }
        else if(multiplierValue == 100){
            config = "100x";
        }
        else if(multiplierValue == 1000){
            config = "1000x";
        }
         
    }

      if (typeof config === "string") {
          pixiLib.setProperties(this.symbol, {texture: config});
           if (coreApp.gameModel.spinData.wildSymbols && coreApp.gameModel.spinData.wildSymbols.indexOf(config) > -1) {
                this.addLabel();
            } else {
                this.removeLabel();
            }       
      } else {
          if (config.symbol && config.symbol.texture) {
              pixiLib.setProperties(this.symbol, {
                  texture: config.symbol.texture
              });
              if (coreApp.gameModel.spinData.wildSymbols && coreApp.gameModel.spinData.wildSymbols.indexOf(config.symbol.texture) > -1) {
                  this.addLabel();
              } else {
                  this.removeLabel();
              }
          }
          if (config.frontImage && config.frontImage.texture) {
              pixiLib.setProperties(this.frontImage, {
                  texture: config.frontImage.texture
              });
          }
          if (config.backImage && config.backImage.texture) {
              pixiLib.setProperties(this.backImage, {
                  texture: config.backImage.texture
              });
          }
      } 
}

v.removeLabel = function () {
    if (this.label) {
        this.removeChild(this.label);
    }
}

v.addLabel = function () {
    this.removeLabel();

    this.label = pixiLib.getElement("Sprite", "wild_label");
    pixiLib.setProperties(this.label, { x: 0, y: 60, scale:0.6,  anchor: { x: 0.5, y: 0.5} });
    this.addChild(this.label);
}
