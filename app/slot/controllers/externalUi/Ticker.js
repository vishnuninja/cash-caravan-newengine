_ng.TickerEUI = function(parent) {
    this.parentExternalUI = parent;
    this.addEventListeners();
}

_ng.TickerEUI.prototype.constructor = _ng.TickerEUI;
var ticker = _ng.TickerEUI.prototype;

ticker.addEventListeners = function() {
    _mediator.subscribe("ScatterWin", this.showScatterWin.bind(this));
    _mediator.subscribe("spinStart", this.onSpinClickHandler.bind(this));
    _mediator.subscribe("showFreeSpinAwarded", this.onFreeSpinAward.bind(this));
    _mediator.subscribe("showFreeSpinEnded", this.onFreeSpinEnded.bind(this));
    _mediator.subscribe("continueUnfinishedGame", this.onUnfinishGame.bind(this));
    _mediator.subscribe("SHOW_TICKER_MESSAGE", this.updateTextWithCountUp.bind(this));
    _mediator.subscribe("showGoldCoinWinAmount", this.showGoldCoinWinAmount.bind(this));
}


ticker.showWinText = function(text) {
    window.externalUi.call('win-amount', 'setText', text, '');
}

ticker.allTumbleFinish = function() {
    this.showWinText(pixiLib.getFormattedAmount(coreApp.gameModel.getTotalWin()));
}


ticker.showScatterWin = function() {
    this.showWinText(pixiLib.getFormattedAmount(coreApp.gameModel.obj.current_round.scatter_win));
}

ticker.onSpinClickHandler = function(isFreeSpin) {

    if (coreApp.gameModel.userModel.userData.previous_round
        && coreApp.gameModel.userModel.userData.previous_round
            .bonus_details) {
        let winAmount = coreApp.gameModel.userModel.userData.next_round.total_fs_win_amount;
        if (winAmount > 0) {
            this.showWinText(winAmount);
        } else {
            this.showWinText('');
        }
    }

    if (isFreeSpin == true) {
        if (coreApp.gameModel.obj && coreApp.gameModel.obj.next_round && coreApp.gameModel.obj.next_round.type === "freespins") {
            var fsCount = coreApp.gameModel.obj.next_round.spins_left - 1;
            this.setFreeSpinsLeft(fsCount);
        } else if (coreApp.gameModel.isFreeSpinActive()) {
            var fsCount = coreApp.gameModel.getFreeSpinCurrentCount() -1;
            this.setFreeSpinsLeft(fsCount);
        }
    }

    if (coreApp.gameModel.obj.current_round.spin_type != "freespin" && !coreApp.gameModel.getIsPFSActive()) {
        this.showWinText('');
    }

    if (coreApp.gameModel.isFullFSActive()) {
        this.setTotalFreeSpinWin(coreApp.gameModel.getTotalFSWin())
    }

    if (!coreApp.gameModel.isFreeSpinActive()) {
        this.showWinText('');
    }
    if(coreApp.gameModel.getIsPFSActive()){
        _mediator.publish("updatePromoSpinLeft",coreApp.gameModel.getRemainingPFS() -1);
    }
}

ticker.onFreeSpinAward = function() {
    this.showFreeGameUi();
    this.setTotalFreeSpinWin(coreApp.gameModel.getTotalFSWin());
    this.setFreeSpinsLeft(coreApp.gameModel.getFreeSpinTotalCount())
}

ticker.onFreeSpinEnded = function() {
    this.setTotalFreeSpinWin(coreApp.gameModel.getTotalFSWin());
    this.hideFreeGameUi();
}

ticker.showFreeGameUi = function() {
    window.externalUi.call('fs-text', 'show');
    window.externalUi.call('fs-amount', 'show');
    window.externalUi.call('win-text', 'setText', 'TOTAL WIN');
}

ticker.hideFreeGameUi = function() {
    window.externalUi.call('fs-text', 'hide');
    window.externalUi.call('fs-amount', 'hide');
    window.externalUi.call('win-text', 'setText', 'WIN');
}

ticker.setFreeSpinsLeft = function(value) {
    window.externalUi.call('fs-amount', 'setText', `${value}`);
}

ticker.setTotalFreeSpinWin = function(amount) {
    window.externalUi.call('win-amount', 'setText', pixiLib.getFormattedAmount(amount), '');
}

ticker.onUnfinishGame = function() {
    if (coreApp.gameModel.isFreeSpinActive()) {
        this.showFreeGameUi();
        this.setTotalFreeSpinWin(coreApp.gameModel.getTotalFSWin());
        this.setFreeSpinsLeft(coreApp.gameModel.getFreeSpinCurrentCount() - 1)
    }
}

ticker.updateTextWithCountUp = function(data) {
    var winTxt = gameLiterals.win_text;
    let words = data.trim().split(/\s+/).map(w => w.replace(":", ""));
    if (words.includes(winTxt)) {
        let lastTwo = words.slice(-2);
        let combined = lastTwo.join("");
        this.showWinText(combined);
    }
}


ticker.showGoldCoinWinAmount = function(winAmount){
    this.showWinText(pixiLib.getFormattedAmount(winAmount));
}