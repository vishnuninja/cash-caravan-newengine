SettingsModel = function () {
    this.accountId = 1;
    this.balance = 0;

    this.gameId = 1;
    this.minCoinValue = 1;
    this.maxCoinValue = 1;
    this.coinArray = [1];
    this.coinDefaultIndex = 0;
    this.selectedCoinIndex = 0;
    this.selectedCoinValue = 1;
    this.totalBet = 25;
    this.totalPaylines = 25;
    this.selectedPaylines = 25;

    this.totalWin = 0;
    this.totalFreespinWin = 0;
    this.totalGambleWin = 0;
};

var data = SettingsModel.prototype;