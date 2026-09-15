_ng.BetUi = function (){
 
    this.addListeners();
    // this.updateUi(GameModel.getWagerValues(), GameModel.getWagerIndex());
  }

    _ng.BetUi.prototype.constructor = _ng.BetUi;
    var betUi = _ng.BetUi.prototype;

  betUi.addListeners = function () {
     _mediator.subscribe("updateSetBet", this.updateUi.bind(this));
  }

  betUi.show = function() {
    window.externalUi.call('ui-bet-popup', 'show');
  }

  betUi.updateUi = function (betAmount) {
    if(isHistoryMode) {
      return;
    }
    const currentBetIndex = coreApp.gameModel.getCoinIndex();
    const minIndex = 0, maxIndex = coreApp.gameModel.getCoinArray().length - 1;
    const formatted = pixiLib.getFormattedAmount(betAmount);
    const disableMinus = (currentBetIndex <= minIndex) ? 'disable' : 'enable';
    const disablePlus = (currentBetIndex >= maxIndex) ? 'disable' : 'enable';
    
    window.externalUi.call('bet-amount', 'setText', formatted, '');
    window.externalUi.call('bet-amount-popup', 'setText', formatted, '');
    window.externalUi.call('minus-button', disableMinus);
    window.externalUi.call('plus-button', disablePlus);
    window.externalUi.call('minus-button-popup', disableMinus);
    window.externalUi.call('plus-button-popup', disablePlus);

    if(_ng.twoXBetEnabled) {
      betAmount = betAmount / coreApp.gameModel.spinData.antebet;
    }
    
    window.externalUi.call('ui-help-popup', 'setBet', betAmount * 10);
  }

  betUi.increaseBet = function() {
     _mediator.publish("setIncrement");
  }

  betUi.decreaseBet= function() {
    _mediator.publish("setDecrement");
  }

  betUi.maxBet = function() {
    coreApp.gameView.panel.onBetMaxClick();
    coreApp.gameView.panel.coinValue.setMaxIndex()
  }

