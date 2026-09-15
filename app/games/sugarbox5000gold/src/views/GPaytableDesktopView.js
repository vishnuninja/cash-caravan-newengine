
var GPD=PaytableDesktopView.prototype 

GPD.addExtraElements = function (argument) {

    _mediator.subscribe("ChangeWinValues",this.changeWinValues.bind(this));
    this.symbols = ["a","b","c","d","e","f","g","h","i","scatter"];
    // this.symbolPays=[[10,25,50],[2.5,10,25],[2,5,15],[1.5,2,12],[1,1.5,10],[0.8,1.2,8],[0.5,1,5],[0.4,0.9,4],[0.25,0.75,2],[3,5,100]];
   
    this.symbolPays = coreApp.gameModel.spinData.paytableValues; 
    
    /*removing key values from the array and storing only array values*/
    this.symbolPays = Object.values(this.symbolPays);

    if(coreApp.gameModel.obj.previous_round.coin_value)
        _mediator.publish("ChangeWinValues",coreApp.gameModel.obj.previous_round.coin_value);
    else
        _mediator.publish("ChangeWinValues",100);

    this.updatePaytableText();
};

GPD.changeWinValues = function(value) {
    
    this.formattedSymbolsPay = [];

    this.formatedPayAmount = this.symbolPays.map(innerArray => 
        innerArray.map(innerValue => pixiLib.getFormattedAmount(innerValue * value) )
    );  
    
        for (var j = 0; j < this.symbols.length; j++) {
            for (var i = 0; i < (this["container1"].children.length); i++) {
                if (this["container1"].children[i].name == (this.symbols[j] + "SymTxt")) {
                    this["container1"].children[i].text = "8-9:    " + (this.formatedPayAmount[j][0]) + "\n10-11:   " + (this.formatedPayAmount[j][1]) + "\n12+:    " + (this.formatedPayAmount[j][2]);
                    break;
                }
                else if (this["container1"].children[i].name === "scatterValueText") {
                    this["container1"].children[i].text = "4 Scatter:  " + (this.formatedPayAmount[this.symbols.length - 1][0]) + "\n5 Scatter:  " + (this.formatedPayAmount[this.symbols.length - 1][1]) + "\n6+ Scatter:  " + (this.formatedPayAmount[this.symbols.length - 1][2]);
                    break;
                }

            }
        }
}

GPD.updatePaytableText = function() {

    /*coin values are sending from backend on init server call*/
    var numberOfCoins = coreApp.gameModel.spinData.smCoinValues.length;
    var minimumCoinValue = coreApp.gameModel.spinData.smCoinValues[ 0 ];   //first coin value
    var maximumCoinValue = coreApp.gameModel.spinData.smCoinValues[ numberOfCoins - 1 ];  //last coin value

    /*minimum bet and Maximum bet values*/
    var updatedText = this.minimumBetText.text.replace("XX", pixiLib.getFormattedAmount(minimumCoinValue))
    pixiLib.setText(this.minimumBetText, updatedText);

    var updatedText = this.maximumBetText.text.replace("XX", pixiLib.getFormattedAmount(maximumCoinValue))
    pixiLib.setText(this.maximumBetText, updatedText);
   

    /*minimum and maximum rtp of the game*/
    var updatedText = this.minimumRtpText.text.replace("XX", coreApp.gameModel.spinData.min_rtp + "%")
    pixiLib.setText(this.minimumRtpText, updatedText);

    var updatedText = this.maximumRtpText.text.replace("XX", coreApp.gameModel.spinData.max_rtp + "%")
    pixiLib.setText(this.maximumRtpText, updatedText);

    /*Buy Free game rtp*/
    var updatedText = this.buyFreeGameRtpText.text.replace("XX", coreApp.gameModel.spinData.buy_fg_game_rtp + "%")
    pixiLib.setText(this.buyFreeGameRtpText, updatedText);

    /*Super Free game rtp*/
    var updatedText = this.superFreeSpinRtpText.text.replace("XX", "94.37%")
    pixiLib.setText(this.superFreeSpinRtpText, updatedText);



}

 