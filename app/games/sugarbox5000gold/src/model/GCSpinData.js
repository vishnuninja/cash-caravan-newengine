var spinInfo = SpinData.prototype;

spinInfo.saveGameSpecInitData = function (obj) {

    this.smBalance = 0;
    this.smCoinValues = [];
    this.antebet = 0;
    this.buyfg = 0;
    this.superBuyfg = 0;

    if (obj.player) {
        this.smBalance = obj.player.balance2 || 0;
    }
    if (obj.game) {
        this.smCoinValues = obj.game.coin_values2 || obj.game.coin_values;
        this.smCoinValues = this.smCoinValues.split(';');
        this.antebet = obj.game.extra_info.ante_bet;
        this.buyfg = obj.game.extra_info.BuyFg;
        this.superBuyfg = obj.game.extra_info.SuperBuyFg;

        /*GAME RTP*/
        this.game_rtp = obj.game.extra_info.game_rtp;

        /*ANTE BET RTP*/
        this.ante_game_rtp = obj.game.extra_info.ante_game_rtp;
  
        /*BUY FREE GAME RTP*/
        this.buy_fg_game_rtp = obj.game.extra_info.buy_fg_game_rtp;

        /*SUPE BUY FREE GAME RTP*/
        this.Super_buy_fg_game_rtp = obj.game.extra_info.Super_buy_fg_game_rtp;

        /*MINIMUM RTP*/
        this.min_rtp = obj.game.extra_info.min_rtp;

        /*MAXIMUM RTP*/
        this.max_rtp = obj.game.extra_info.max_rtp;

        /*MAXIMUM WIN CAP*/
        this.max_win_cap = obj.game.extra_info.max_win_cap;
        
        /*paytable symbol payout values sending from backend*/
        this.paytableValues =  obj.game.paytable;
    }
    this.proMulti = 1;
}