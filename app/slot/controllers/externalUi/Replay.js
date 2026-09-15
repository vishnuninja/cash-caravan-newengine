_ng.ReplayEUI = function(parent) {
    this.parentExternalUI = parent;
    this.addEventListeners();
}

_ng.ReplayEUI.prototype.constructor = _ng.ReplayEUI;
var replay = _ng.ReplayEUI.prototype;

replay.addEventListeners = function() {
    if(isHistoryMode) {
        _mediator.subscribe(_events.core.initReceived,this.setPanelView.bind(this));
        _mediator.subscribe('onGameCreated',this.setBetAmount.bind(this));
        _mediator.subscribe('onGameCreated',this.disableBetButtons.bind(this));
    }
    _mediator.subscribe("resetGameState",this.resetGameState.bind(this));
}

replay.setPanelView = function() {
    if(isHistoryMode) {
        this.hideTurboButton();
        this.hidePlayButton();
        this.hideAutoplayButton();
        this.hideSettingsButton();
        this.setBalance();
    }
}

replay.hideTurboButton = function() {
    window.externalUi.call('turbo-off-button', 'hide');
    window.externalUi.call('turbo-fast-button', 'hide');
    window.externalUi.call('turbo-on-button', 'hide');
}

replay.hidePlayButton = function() {
    window.externalUi.call('spin-button', 'hide');
}

replay.hideAutoplayButton = function() {
    window.externalUi.call('autoplay-button', 'hide');
}

replay.hideBetText = function() {
    const betAmountText = document.querySelector(".bet-amount");
    if (betAmountText) {
        betAmountText.style.display = "none";
    }
}

replay.hideBetButton = function() {
  window.externalUi.call('ui-bet-popup', 'hide');
  window.externalUi.call("plus-button", 'hide');
  window.externalUi.call("minus-button", 'hide');
}

replay.hideBackgroundPlate = function () {
    const uiPlate = document.querySelector(".ui-plate");
    if (uiPlate) {
        uiPlate.style.display = "none";
    }
};

replay.hideSettingsButton = function() {
    window.externalUi.call('settings-button', 'hide');
}

replay.setBalance = function() {
    window.externalUi.call('balance-amount', 'setText', '*****');
}

replay.setBetAmount = function() {
    
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams && urlParams.has('round_id') && urlParams.has('wager')) {
        var totalWager = parseFloat(urlParams.get('wager'));
        if (!isNaN(totalWager)) {
            // Determine feature type
            var feature = '';
            var isBuyFeature = urlParams.get('is_buy_feature');
            var isNormalSpin = urlParams.get('is_normal_spin');
            var isSuperBuy = urlParams.get('is_buy_super_feature');
            
            if (isBuyFeature && isBuyFeature === 'true') {
                feature = 'buyFreeSpins';
            }else if(isSuperBuy && isSuperBuy === 'true'){
                feature = 'superBuyFreeSpins';
            }
             else if (isNormalSpin && isNormalSpin === 'true') {
                feature = 'normalSpin';
            }
            
            // Use getBaseWager if available, otherwise fallback to division by 10
            var wagerValue;
            if (typeof getBaseWager !== 'undefined') {
                wagerValue = getBaseWager(totalWager, feature);
            } else {
                // Fallback: divide by 10
                wagerValue = totalWager / 10;
            }
            var formatted = pixiLib.getFormattedAmount(wagerValue);
            window.externalUi.call('bet-amount', 'setText', formatted, '');           
        }
    }
}

replay.disableBetButtons = function() {
    window.externalUi.call('minus-button', "disable");
    window.externalUi.call('plus-button', "disable");
}

replay.resetGameState = function() {
    this.parentExternalUI.spinActive(false);
}

