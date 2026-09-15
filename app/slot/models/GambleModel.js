GambleModel = function () {
    this.gambleBet = 0;
    this.gambleWin = 0;
    this.isGambleActive = false;
    this.gambleHistoryWins = [];//{cardColor, winAmount, betAmount}
};

var gModel = GambleModel.prototype;


gModel.saveInitData = function (obj) {
	/************Gamble unfinished Feature ************/
    if (obj.next_round && obj.next_round.type === "gamble") {
        this.isGambleInitActive = true;
        this.betAmount = obj.next_round.bet_amount;
    }else{
        this.isGambleInitActive = false;
    }
    /******************************************************/ 
}

gModel.saveSpinData = function (obj) {
    //on spin response check weather gamble is enabled or not 
    if(obj.next_round && obj.next_round.type === "gamble"){
        this.isGambleActive = true;
        this.betAmount = obj.current_round.win_amount;
    }else{
        this.isGambleActive = false;
    }
};
gModel.saveGambleResponse = function(obj){
    this.winAmount = obj.current_round.win_amount;
    this.isGambleEnd = obj.current_round.state;
    this.state = obj.current_round.state;
    this.wonColor = obj.current_round.right_color;

	if(obj.current_round.state === 1){
		this.isGambleActive = false;
	}else if(obj.current_round.state === 0){
		this.isGambleActive = true;
	}
}