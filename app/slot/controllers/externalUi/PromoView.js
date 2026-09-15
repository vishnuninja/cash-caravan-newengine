_ng.PromoView = function() {
    this.init();
    this.addlisteners();

}

_ng.PromoView.prototype.constructor = _ng.PromoView;
var promoView = _ng.PromoView.prototype;

promoView.addlisteners = function() {
    // _mediator.subscribe("promoStateChanged", this.onPromoStateChanged.bind(this));
    _mediator.subscribe("promoFreeSpinAwarded", this.promoFreeSpinAwarded.bind(this));
    _mediator.subscribe("promoFreeSpinRewarded", this.promoFreeSpinRewarded.bind(this));
    _mediator.subscribe("unfinishedPromoFreeSpin", this.unfinishedPromoFreeSpin.bind(this));

    _mediator.subscribe("hidePromoView", this.onHidePromoView.bind(this));    /*FOR PROMO TOP STRIP VIEW*/
    _mediator.subscribe("showPromoView", this.onShowPromoView.bind(this));    /*FOR PROMO TOP STRIP VIEW*/
    _mediator.subscribe("destroyPromoView", this.onDestroyPromoView.bind(this));  

    _mediator.subscribe("updatePromoSpinLeft", this.updatePanel.bind(this));
	_mediator.subscribe("updatePromoWinText", this.onUpdatePromoWinText.bind(this));

}

/**
 * Shows popup when promo free spins are awarded
 * Displays Yes/Later buttons
 */
promoView.init = function() {
    this.topStripDiv = null;
    this.spinLeftStrip = null;
    this.totalWinAmountStrip = null;
    // True only when the user has actively accepted PFS (clicked Yes or Continue).
    // Prevents promoFreeSpinRewarded from firing spuriously after normal spins.
    this.pfsSessionActive = false;
    this.injectStyles();
    this.createDiv();
}

promoView.createDiv = function() {
    this.topStripDiv = document.createElement('div');
    this.topStripDiv.className = 'pfr';
    this.topStripDiv.style.display = 'none'; // Initially hidden

    var pfrCounterDiv = document.createElement('div');
    pfrCounterDiv.className = 'pfr_counter';
    this.topStripDiv.appendChild(pfrCounterDiv);

    var fsLeftLabel = document.createElement('span');
    pfrCounterDiv.appendChild(fsLeftLabel);
    fsLeftLabel.className = 'align_center';
    fsLeftLabel.innerHTML = gameLiterals.spinsleft_text || 'SPINS LEFT';

    var pfrLine = document.createElement('div');
    pfrLine.className = 'pfr_line';
    this.topStripDiv.appendChild(pfrLine);

    var pfrWinDiv = document.createElement('div');
    pfrWinDiv.className = 'pfr_win';
    this.topStripDiv.appendChild(pfrWinDiv);

    var fsWinLabel = document.createElement('span');
    pfrWinDiv.appendChild(fsWinLabel);
    fsWinLabel.className = 'align_center';
    fsWinLabel.innerHTML = gameLiterals.pfsText5 || 'TOTAL WIN';

    //spin left
    this.spinLeftStrip = document.createElement('span');
    pfrCounterDiv.appendChild(this.spinLeftStrip);

    //total win amount
    this.totalWinAmountStrip = document.createElement('span');
    pfrWinDiv.appendChild(this.totalWinAmountStrip);

    // Add to DOM immediately (but hidden)
    document.body.appendChild(this.topStripDiv);
}

promoView.injectStyles = function() {
    var style = document.createElement('style');
    style.innerHTML = `
.pfr {
    position: absolute;
    top: 10px;
    max-width: 90%;
    right: 50%;
    transform: translateX(50%);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    backdrop-filter: blur(1px);
    background-color: rgba(22, 22, 22, 0.5);
    border: 1px solid #f4c701;
    user-select: none;
    touch-action: manipulation;
    z-index: 4;
}

.pfr_line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    background: white;
}

.pfr span {
    font-family: Inter Medium;
    color: white;
    margin: 10px;
    font-size: 80%;
    text-align: center;
    text-transform: uppercase;
    white-space: nowrap;
}

.pfr_counter, .pfr_win {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1em;
    flex: 1 1 0;
    min-width: 0;
}

@media screen and (orientation: landscape) and (max-width: 1024px) and (max-height: 500px) {
    .pfr span {
        margin: 5px;
        font-size: 50%;
    }
    .pfr_counter, .pfr_win {
        padding: 0 0.5em;
    }
}
`;
    document.head.appendChild(style);
}

promoView.showPanel = function() {
    if (!this.topStripDiv) {
        // If panel doesn't exist, recreate it
        this.createDiv();

    }
    if (this.topStripDiv) {
        this.topStripDiv.style.display = 'flex';
    }
}

promoView.hidePanel = function() {
    if (this.topStripDiv) {
        this.topStripDiv.style.display = 'none';
    }
}

promoView.onShowPromoView = function() {
    this.showPanel();
}

promoView.onHidePromoView = function() {
    this.hidePanel();
}

promoView.onDestroyPromoView = function() {
    if (this.topStripDiv && document.body.contains(this.topStripDiv)) {
        document.body.removeChild(this.topStripDiv);
        this.topStripDiv = null;
        this.spinLeftStrip = null;
        this.totalWinAmountStrip = null;
    }
}

promoView.updatePanel = function(spinsLeft) {
    if (this.spinLeftStrip) {
        this.spinLeftStrip.innerHTML = spinsLeft;
    }
}

promoView.onUpdatePromoWinText = function(winAmount) {
    winAmount = winAmount;
    if (this.totalWinAmountStrip) {
        this.totalWinAmountStrip.innerHTML = pixiLib.getFormattedAmount(winAmount);
    }
}

promoView.promoFreeSpinAwarded = function(state) {
    // Disable ante bet and buy feature buttons when popup shows
    _mediator.publish("disableBuyFeature");
    _mediator.publish("disablePanelFs");
    // Hide autoplay button
    _mediator.publish("hideAutoPlayButton");

    var title = gameLiterals.pfs_awarded_HeadText;
    var message = gameLiterals.pfs_you_Have.replace("XXXX",coreApp.gameModel.getTotalPFS());
    

    _ng.externalUiController.commonPopup.show(
        {
            title: title,
            message: message
        },
        {
            left: {
                label: gameLiterals.pfs_play_later,
                callback: this.onLaterButtonClick.bind(this)
            },
            right: {
                label: gameLiterals.pfs_play_now,
                callback: this.onYesButtonClick.bind(this)
            }
        }
    );
}

/**
 * Shows popup when there are unfinished promo free spins
 * Displays Continue button with remaining spins count
 */
promoView.unfinishedPromoFreeSpin = function() {
    // Disable ante bet and buy feature buttons when popup shows
    _mediator.publish("disableBuyFeature");
    _mediator.publish("disablePanelFs");
    // Hide autoplay button
    _mediator.publish("hideAutoPlayButton");

    var remainingSpins = coreApp.gameModel.getRemainingPFS();
    var title = gameLiterals.pfsText7;
    var message = "<div style='font-size: 48px; font-weight: bold; color: #f7b21d; margin: 20px 0;'>" + remainingSpins + "</div>";

    _ng.externalUiController.commonPopup.show(
        {
            title: title,
            message: message
        },
  
        {
            left: {
               label: gameLiterals.pfs_play_later,
                callback: this.onLaterButtonClick.bind(this)
            },
            right: {
                label: gameLiterals.pfs_play_now,
                callback: this.onYesButtonClick.bind(this)
            }
        }
    );
}

/**
 * Shows popup when promo free spins are completed and rewarded
 * Displays Continue button with total win amount
 */
promoView.promoFreeSpinRewarded = function() {
 
    if (!this.pfsSessionActive) {
        console.log('[PFS] promoFreeSpinRewarded skipped – no active PFS session');
        return;
    }

    try { 
        console.log('[PFS] Rewarded popup show'); 
        _mediator.publish('SHOW_LOG', '[PFS] Rewarded popup show'); 
    } catch(e) {}

    // Disable ante bet and buy feature buttons when popup shows
    _mediator.publish("disableBuyFeature");
    _mediator.publish("disablePanelFs");
    // Hide autoplay button
    _mediator.publish("hideAutoPlayButton");

    var totalWinAmount = coreApp.gameModel.getTotalPFSWin();
    var title = gameLiterals.pfsText4;
    var message = gameLiterals.pfsText5 + "<br><div style='font-size: 36px; font-weight: bold; color: #f7b21d; margin: 10px 0;'>" + pixiLib.getFormattedAmount(totalWinAmount) + "</div>";

    _ng.externalUiController.commonPopup.show(
        {
            title: title,
            message: message
        },
        {
            middle: {
                label: gameLiterals.pfsText6,
                callback: this.rewardedContinueClick.bind(this)
            }
        }
    );

    // While popup is visible, ensure spin is disabled on mobile too
    _mediator.publish("ToggleSpin", false);
    if (_viewInfoUtil.device === 'Mobile') {
        _mediator.publish("ToggleMobPanel", false);
    }
    // Mark PFSEnded in model so controllers keep spin hidden until this popup closes
    if (coreApp && coreApp.gameModel && coreApp.gameModel.PFSData) {
        coreApp.gameModel.PFSData.isPFSEnded = true;
    }
}

/**
 * Handler for Yes button click in promo free spin awarded popup
 */
promoView.onYesButtonClick = function() {
    this.pfsSessionActive = true;
    _ng.externalUiController.commonPopup.hide();
    _mediator.publish("runGameInit");
    coreApp.gameModel.updatePanelModelPFS(); /**pfs coin value,coin value index, current bet updation */
    _mediator.publish("showPromoView");   /*FOR SHOWING TOP STRIP*/
    // Keep ante bet and buy feature disabled during PFR
    _mediator.publish("disableBuyFeature");
    _mediator.publish("disablePanelFs");
    // Hide autoplay button during PFR
    _mediator.publish("hideAutoPlayButton");
    _ng.externalUiController.spinActive(true);

}

/**
 * Handler for Later button click in promo free spin awarded popup
 */
promoView.onLaterButtonClick = function() {
    _ng.externalUiController.commonPopup.hide();
    coreApp.gameModel.PFSData = new PromoFreeSpinModel();
    _ng.GameConfig.PFSUseLater = true;
    
    // Reset the controller's PFS running flag so it is fully back to normal state
    if (coreApp.gameController) {
        coreApp.gameController.isPFSRunning = false;
    }
    _mediator.publish("runGameInit");
    _mediator.publish("ToggleSpin", true);
    _mediator.publish("EnablePanel");
    // Re-enable ante bet and buy feature when closing
    _mediator.publish("enableBuyFeature");
    _mediator.publish("enabledPanelFs");
    // Show autoplay button
    _mediator.publish("showAutoPlayButton");
}

/**
 * Handler for Continue button click in unfinished promo free spin popup
 */
promoView.unFinishedContinueButtonClick = function() {
    this.pfsSessionActive = true;
    _ng.externalUiController.commonPopup.hide();
    _mediator.publish("runGameInit");
    coreApp.gameModel.updatePanelModelPFS(); /**pfs coin value,coin value index, current bet updation */
    _mediator.publish("showPromoView");   /*FOR SHOWING TOP STRIP*/
    // Keep ante bet and buy feature disabled during PFR
    _mediator.publish("disableBuyFeature");
    _mediator.publish("disablePanelFs");
    _ng.externalUiController.spinActive(true);

}

/**
 * Handler for Continue button click in rewarded promo free spin popup
 */
promoView.rewardedContinueClick = function() {
    try { 
        console.log('[PFS] Rewarded continue clicked'); 
        _mediator.publish('SHOW_LOG', '[PFS] Rewarded continue clicked'); 
    } catch(e) {}
    
    // Mark session as done BEFORE anything else so no spurious re-fires
    this.pfsSessionActive = false;
    
    _ng.externalUiController.commonPopup.hide();
    coreApp.gameModel.PFSData.isPFSEnded = false;
    _mediator.publish("hidePromoView");
    coreApp.gameModel.updatePanelModelPFS(); //Setting Previous Bet
    // Re-enable controls after closing
    _mediator.publish("EnablePanel");
    _mediator.publish("ToggleSpin", true);
    if (_viewInfoUtil.device === 'Mobile') {
        _mediator.publish("ToggleMobPanel", true);
    }
   
    _ng.externalUiController.spinActive(false);
    coreApp.gameController.isPFSRunning = false;
    _mediator.publish("runGameInit");
    _mediator.publish("enableBuyFeature");
    _mediator.publish("enabledPanelFs");
    _mediator.publish(_events.slot.updateBalance);

}
