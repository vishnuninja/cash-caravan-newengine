

var data = PanelModel.prototype;

data.setTotalBet = function () {
    if (this.paylinesType == "fixed") {
        this.totalBet = this.numCoins * this.selectedCoinValue;
        _mediator.publish("UpdateBet",this.totalBet);
    } else {
        this.totalBet = this.selectedPaylines * this.selectedCoinValue * this.numCoins;
    }
}

