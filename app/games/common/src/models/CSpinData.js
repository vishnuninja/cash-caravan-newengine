var spinInfo = SpinData.prototype;

spinInfo.saveGameSpecInitData = function (obj) {

    this.smBalance = 0;
    this.smCoinValues = [];

    if (obj.player) {
        this.smBalance = obj.player.balance2 || 0;
    }
    if (obj.game) {
        this.smCoinValues = obj.game.coin_values2 || obj.game.coin_values;
        this.smCoinValues = this.smCoinValues.split(';');
    }
    this.proMulti = 1;
}

spinInfo.saveGameSpecificData = function (obj) {

    if (obj.player) {
        this.smBalance = obj.player.balance2 || 0;
    }
    if (typeof obj.current_round.bonus_games_won) {
        arr = obj.current_round.bonus_games_won;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].type == "progressive_multiplier") {
                this.proMulti = arr[i].multiplier;
            }
        }
    }
}