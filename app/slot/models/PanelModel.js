PanelModel = function () {
    this.accountId = 1;
    this.balance = 0;

    this.gameId = 1;
    this.minCoinValue = 1;
    this.maxCoinValue = 1;
    this.coinArray = [1];
    this.coinDefaultIndex = 0;
    this.selectedCoinIndex = 0;
    this.selectedCoinValue = 1;
    this.currencyPrecision = 2;
    this.totalBet = 25;
    this.allTotalBet = 0;
    this.totalPaylines = 25;
    this.fsPaylines = 0;
    this.selectedPaylines = 25;

    this.totalWin = 0;
    this.totalFreespinWin = 0;
    this.totalGambleWin = 0;
};

var data = PanelModel.prototype;

data.saveInitData = function (obj) {
    //Store Values from player key
    var data = obj.player;
    if (data.account_id) {
        this.accountId = data.account_id;
    }
    if (data.balance) {
        this.balance = data.balance;
    }

    //Store Values from game key
    var data = obj.game;
    if (!data) { return; }

    if (data.game_id) {
        this.gameId = data.game_id;
    }
    if (data.coin_values) {
        this.coinArray = data.coin_values.split(';');
        this.minCoinValue = this.coinArray[0];
        this.maxCoinValue = this.coinArray[this.coinArray.length - 1];

        var decimals = pixiLib.countDecimals(this.minCoinValue);
        if (decimals > 0) {
            this.currencyPrecision += decimals;
        }
    }
    if (data.num_coins) {
        this.numCoins = (obj.previous_round && obj.previous_round.num_coins) ? obj.previous_round.num_coins : data.num_coins;
    }

    if (data.default_coin_value) {
        var coinValue = (obj.previous_round && obj.previous_round.coin_value) ? obj.previous_round.coin_value : data.default_coin_value;

        //Used in FruitTwister GData.js
        coinValue = this.updateGameCoinValue(obj, coinValue);

        coinValue = coinValue.toString();
        this.coinDefaultIndex = this.coinArray.indexOf(coinValue);
        if (this.coinDefaultIndex == -1) { this.coinDefaultIndex = 0 };
        this.selectedCoinIndex = this.coinDefaultIndex;
        this.selectedCoinValue = this.coinArray[this.selectedCoinIndex];
    }
    if (data.num_paylines) {
        this.totalPaylines = data.num_paylines;
        this.selectedPaylines = (obj.previous_round && obj.previous_round.num_paylines) ? obj.previous_round.num_paylines : data.num_paylines;
        if (this.selectedPaylines < 1) {
            this.selectedPaylines = obj.game.num_paylines;
        }
    }
    if (data.num_paylines_fs) {
        this.fsPaylines = data.num_paylines_fs;
    }
    if (data.paylines_type) {
        this.paylinesType = data.paylines_type;
    }
    this.addGameElements(data);
    this.setTotalBet();
    this.updateOperatorConfig(obj);
}
data.updateOperatorConfig = function (obj) {
}
data.updateGameCoinValue = function (obj, cValue) {
    return cValue;
}
data.updatePanelModelWithPFS = function (PFSData) {
    if (PFSData.amount !== undefined) {
        this.balance = PFSData.amount;
    }

    if (PFSData.num_coins !== undefined) {
        this.numCoins = PFSData.num_coins;
    }

    if (PFSData.coin_value !== undefined) {
        this.coinArray = [PFSData.coin_value];  //only fixed value for Promo spins
        this.minCoinValue = this.coinArray[0];
        this.maxCoinValue = this.coinArray[this.coinArray.length - 1];

        var coinValue = PFSData.coin_value;

        this.coinDefaultIndex = this.coinArray.indexOf(coinValue);
        if (this.coinDefaultIndex == -1) { this.coinDefaultIndex = 0 };
        this.selectedCoinIndex = this.coinDefaultIndex;
        this.selectedCoinValue = this.coinArray[this.selectedCoinIndex];
    }
    this.setTotalBet();
}
data.addGameElements = function (data) { }
data.setPaylineValue = function (value) {
    if (value > 0 && value <= this.totalPaylines) {
        this.selectedPaylines = value;
        this.setTotalBet();
    }
}
data.setBetIndex = function (index) {
    if (index >= 0 && index < this.coinArray.length) {
        this.selectedCoinIndex = index;
        this.selectedCoinValue = this.coinArray[this.selectedCoinIndex];
        this.setTotalBet();
    }
}
data.setTotalBet = function () {
    if (this.paylinesType == "fixed") {
        this.totalBet = this.numCoins * this.selectedCoinValue;
    } else {
        this.totalBet = this.selectedPaylines * this.selectedCoinValue * this.numCoins;
    }
}

data.getAllTotalBet = function () {
    return this.allTotalBet;
}
data.setAllTotalBet = function (totalBet) {
    this.allTotalBet += totalBet;
}
data.getTotalBet = function () {
    return this.totalBet;
}
data.getTotalWin = function () {
    return this.totalWin;
}
data.setTotalWin = function (win) {
    this.totalWin = win;
}
data.getTotalPaylines = function () {
    return this.totalPaylines;
}
data.getLineValue = function () {
    return this.selectedPaylines;
}
data.getCoinArray = function () {
    return this.coinArray;
}
data.getCoinIndex = function () {
    return this.selectedCoinIndex;
}
data.getCoinValue = function () {
    return this.selectedCoinValue;
}
/*data.getBalance = function(){
    return this.balance;
}*/
data.setNumCoins = function (coins) {
    this.numCoins = coins;
}
data.getSelectedNumCoins = function () {
    return this.numCoins;
}