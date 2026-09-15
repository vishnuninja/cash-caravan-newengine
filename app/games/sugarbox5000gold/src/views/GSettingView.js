var quickBtnSettingsStatus = false;

var GsView = SettingsView.prototype;


GsView.volumeChange = function (vol) {
    // this.volumeBar.setValue(vol);
}
GsView.createView = function () {
    this.autoSpinSelNum = 10;
    this.createSettingsPanel();
    this.createMenu();
    this.addSettingsEvents();

    this.createVolumebar();
    this.createAutoSpinSliders();
    this.updateGameNameInTitle();
    this.setOperatorText();
    _mediator.subscribe("toggleQuickSpinSettings", this.toggleQuickSpinSettings.bind(this));
    
};
GsView.toggleQuickSpinSettings = function (bool) {
    quickBtnSettingsStatus=bool;
    this.quickSpinOn.visible = bool;
    this.quickSpinOff.visible = !bool;
};

GsView.addSettingsEvents = function () {
    // this.infoButton.on("click", this.onInfoButtonClick.bind(this));
    _mediator.subscribe("settingVolumeChange", this.onSettingVolumeChange);
    _mediator.subscribe("lossLimitChange", this.onLossLimitChange.bind(this));
    _mediator.subscribe("winLimitChange", this.onWinLimitChange.bind(this));
    _mediator.subscribe("toggleQuickSpinSettings", this.toggleQuickSpinSettings.bind(this));
    
    // Subscribe to free spin state changes to update button states
    _mediator.subscribe("spinStart", this.updateHistoryButtonsState.bind(this));
    _mediator.subscribe("FreeSpinsStarted", this.updateHistoryButtonsState.bind(this));
    _mediator.subscribe("showFreeSpinEnded", function() {
        // Add small delay to ensure free spin state is updated
        setTimeout(this.updateHistoryButtonsState.bind(this), 100);
    }.bind(this));
    _mediator.subscribe("onFSEndShown", function() {
        // Add small delay to ensure free spin state is updated
        setTimeout(this.updateHistoryButtonsState.bind(this), 100);
    }.bind(this));
    _mediator.subscribe("EnablePanel", function() {
        // Add small delay to ensure free spin state is updated
        setTimeout(this.updateHistoryButtonsState.bind(this), 100);
    }.bind(this));
    _mediator.subscribe("callNextGameState", function() {
        // Add small delay to ensure free spin state is updated
        setTimeout(this.updateHistoryButtonsState.bind(this), 100);
    }.bind(this));
    
    // Update language texts for history buttons
    this.updateHistoryLanguageTexts();

    // History title text - opens history panel popup (previous functionality)
    if (this.historyTitle) {
        if (commonConfig.hideHistoryButtonForDemo && coreApp.isDemoMode) {
            this.historyTitle.visible = false;
            this.historyTitle.alpha = 0;
        } else {
            // Explicitly ensure button is visible
            this.historyTitle.visible = true;
            this.historyTitle.alpha = 1;
        }
        pixiLib.setInteraction(this.historyTitle, true);
        pixiLib.addEvent(this.historyTitle, this.onHistoryTitleClick.bind(this));
        console.log("✅ historyTitle setup complete, visible:", this.historyTitle.visible, "position:", this.historyTitle.x, this.historyTitle.y);
    } else {
        console.warn("⚠️ historyTitle not found in GSettingView!");
    }
    
    // History title icon button - also opens history panel popup
    if (this.historyTitleIcon) {
        if (commonConfig.hideHistoryButtonForDemo && coreApp.isDemoMode) {
            this.historyTitleIcon.visible = false;
            this.historyTitleIcon.alpha = 0;
        }
        pixiLib.setInteraction(this.historyTitleIcon, true);
        pixiLib.addEvent(this.historyTitleIcon, this.onHistoryTitleClick.bind(this));
    }
    
    // History icon button (arrow) - opens new history page in new tab
    if (this.historyButton) {
        if (commonConfig.hideHistoryButtonForDemo && coreApp.isDemoMode) {
            this.historyButton.visible = false;
            this.historyButton.alpha = 0;
        }
        pixiLib.setInteraction(this.historyButton, true);
        pixiLib.addEvent(this.historyButton, this.onHistoryPanelClick.bind(this));
    }
    
    // History icon sprite (seeHistoryTitle/arrow icon) - also opens new history page
    // Hide these as we're using gameHistoryButton instead
    if (this.seeHistoryTitle) {
        this.seeHistoryTitle.visible = false;
        this.seeHistoryTitle.alpha = 0;
    }
    if (this.historyButton) {
        this.historyButton.visible = false;
        this.historyButton.alpha = 0;
    }
    
    // Game History button - opens new history page in new tab
    if (this.gameHistoryButton) {
        console.log("✅ gameHistoryButton found in GSettingView, setting up...");
        if (commonConfig.hideHistoryButtonForDemo && coreApp.isDemoMode) {
            this.gameHistoryButton.visible = false;
            this.gameHistoryButton.alpha = 0;
        } else {
            // Explicitly ensure button is visible
            this.gameHistoryButton.visible = true;
            this.gameHistoryButton.alpha = 1;
        }
        pixiLib.setInteraction(this.gameHistoryButton, true);
        pixiLib.addEvent(this.gameHistoryButton, this.onHistoryPanelClick.bind(this));
        console.log("✅ gameHistoryButton setup complete, visible:", this.gameHistoryButton.visible, "position:", this.gameHistoryButton.x, this.gameHistoryButton.y);
    } else {
        console.warn("⚠️ gameHistoryButton not found in GSettingView! Check settingsConfig.");
    }
    
    // Game History icon button - also opens new history page in new tab
    if (this.gameHistoryButtonIcon) {
        if (commonConfig.hideHistoryButtonForDemo && coreApp.isDemoMode) {
            this.gameHistoryButtonIcon.visible = false;
            this.gameHistoryButtonIcon.alpha = 0;
        }
        pixiLib.setInteraction(this.gameHistoryButtonIcon, true);
        pixiLib.addEvent(this.gameHistoryButtonIcon, this.onHistoryPanelClick.bind(this));
    }
}  
GsView.toggleQuickSpinSettings = function (bool) {
    quickBtnSettingsStatus = bool;
    this.quickSpinOn.visible = bool;
    this.quickSpinOff.visible = !bool;
}
// History title text click - opens history panel popup (previous functionality)
GsView.onHistoryTitleClick = function () {
    // Check if free spins are active - prevent click if disabled
    const isFreeSpinActive = coreApp && coreApp.gameModel && coreApp.gameModel.isFreeSpinActive ? coreApp.gameModel.isFreeSpinActive() : false;
    if (isFreeSpinActive) {
        return; // Do nothing if free spins are active
    }
    
    _sndLib.play(_sndLib.sprite.btnClick);
    _mediator.publish("SHOW_HISTORY_PANEL");
    // Close settings panel when opening history
    _mediator.publish("closeSettingsPanel");
}

// History icon/arrow click - opens new history page in new tab
GsView.onHistoryPanelClick = function () {
    // Check if free spins are active - prevent click if disabled
    const isFreeSpinActive = coreApp && coreApp.gameModel && coreApp.gameModel.isFreeSpinActive ? coreApp.gameModel.isFreeSpinActive() : false;
    if (isFreeSpinActive) {
        return; // Do nothing if free spins are active
    }
    
    _sndLib.play(_sndLib.sprite.btnClick);
    
    // Get user locale and user ID from sessionStorage
    const userLocale = sessionStorage.getItem("Language") || sessionStorage.Language || 'en';
    const userId = sessionStorage.getItem("rgsUserID") || sessionStorage.rgsUserID || '';
    
    // Build history page URL
    const baseUrl = window.location.origin + window.location.pathname;
    const historyPath = baseUrl.replace(/\/[^\/]*$/, '/history/index.html');
    const historyUrl = new URL(historyPath);
    
    // Add query parameters
    historyUrl.searchParams.set('user_locale', userLocale);
    if (userId) {
        historyUrl.searchParams.set('internal_user_id', userId);
    }
    
    console.log("📋 Opening history page:", historyUrl.toString());
    
    // Open history page in new tab
    window.open(historyUrl.toString(), '_blank');
    
    // Close settings panel
    _mediator.publish("closeSettingsPanel");
}
GsView.volumeChange = function (vol) {
    // this.volumeBar.setValue(vol);
}

// Update history button texts based on language
GsView.updateHistoryLanguageTexts = function () {
    // Get current language from sessionStorage
    const lang = (sessionStorage.getItem("Language") || sessionStorage.Language || 'en').toLowerCase();
    
    // Update Game Replay text (historyTitle)
    if (this.historyTitle) {
        const replayText = lang === 'tr' ? 'OYUN TEKRARI' : 'GAME REPLAY';
        pixiLib.setText(this.historyTitle, replayText);
        // Update font size to match other settings text
        if (this.historyTitle.style) {
            this.historyTitle.style.fontSize = 20;
        }
        // Explicitly ensure button is visible after text update
        if (!(commonConfig.hideHistoryButtonForDemo && coreApp.isDemoMode)) {
            this.historyTitle.visible = true;
            this.historyTitle.alpha = 1;
        }
        console.log("✅ Updated historyTitle text to:", replayText, "visible:", this.historyTitle.visible);
    } else {
        console.warn("⚠️ historyTitle not found in updateHistoryLanguageTexts!");
    }
    
    // Update Game History text (gameHistoryButton)
    if (this.gameHistoryButton) {
        const historyText = lang === 'tr' ? 'OYUN GEÇMİŞİ' : 'GAME HISTORY';
        pixiLib.setText(this.gameHistoryButton, historyText);
        // Update font size to match other settings text
        if (this.gameHistoryButton.style) {
            this.gameHistoryButton.style.fontSize = 20;
        }
        // Explicitly ensure button is visible after text update
        if (!(commonConfig.hideHistoryButtonForDemo && coreApp.isDemoMode)) {
            this.gameHistoryButton.visible = true;
            this.gameHistoryButton.alpha = 1;
        }
        console.log("✅ Updated gameHistoryButton text to:", historyText, "visible:", this.gameHistoryButton.visible);
    } else {
        console.warn("⚠️ gameHistoryButton not found in updateHistoryLanguageTexts!");
    }
}

// Update history buttons state based on free spin status
GsView.updateHistoryButtonsState = function () {
    // Check if free spins are active - use multiple checks to be sure
    let isFreeSpinActive = false;
    if (coreApp && coreApp.gameModel) {
        if (typeof coreApp.gameModel.isFreeSpinActive === 'function') {
            isFreeSpinActive = coreApp.gameModel.isFreeSpinActive();
        } else if (coreApp.gameModel.isFreeSpinActive === true) {
            isFreeSpinActive = true;
        }
    }
    
    // Disable/enable Game Replay button (historyTitle)
    if (this.historyTitle) {
        if (isFreeSpinActive) {
            // Disable button when free spins are active
            pixiLib.setInteraction(this.historyTitle, false, "0x888888");
            if (this.historyTitle.style) {
                this.historyTitle.style.fill = "0x888888"; // Gray color for disabled state
            }
            this.historyTitle.alpha = 0.5; // Make it visually disabled
            this.historyTitle.tint = 0x888888; // Apply gray tint
        } else {
            // Enable button when free spins are not active
            pixiLib.setInteraction(this.historyTitle, true);
            if (this.historyTitle.style) {
                this.historyTitle.style.fill = "0xFFFFFF"; // White color for enabled state
            }
            this.historyTitle.alpha = 1; // Make it fully visible
            this.historyTitle.tint = 0xFFFFFF; // Reset tint to white
        }
    }
    
    // Disable/enable Game History button (gameHistoryButton)
    if (this.gameHistoryButton) {
        if (isFreeSpinActive) {
            // Disable button when free spins are active
            pixiLib.setInteraction(this.gameHistoryButton, false, "0x888888");
            if (this.gameHistoryButton.style) {
                this.gameHistoryButton.style.fill = "0x888888"; // Gray color for disabled state
            }
            this.gameHistoryButton.alpha = 0.5; // Make it visually disabled
            this.gameHistoryButton.tint = 0x888888; // Apply gray tint
        } else {
            // Enable button when free spins are not active
            pixiLib.setInteraction(this.gameHistoryButton, true);
            if (this.gameHistoryButton.style) {
                this.gameHistoryButton.style.fill = "0xFFFFFF"; // White color for enabled state
            }
            this.gameHistoryButton.alpha = 1; // Make it fully visible
            this.gameHistoryButton.tint = 0xFFFFFF; // Reset tint to white
        }
    }
    
    // Also handle icon buttons if they exist
    if (this.historyTitleIcon) {
        if (isFreeSpinActive) {
            pixiLib.setInteraction(this.historyTitleIcon, false, "0x888888");
            this.historyTitleIcon.alpha = 0.5;
            this.historyTitleIcon.tint = 0x888888;
        } else {
            pixiLib.setInteraction(this.historyTitleIcon, true);
            this.historyTitleIcon.alpha = 1;
            this.historyTitleIcon.tint = 0xFFFFFF;
        }
    }
    
    if (this.gameHistoryButtonIcon) {
        if (isFreeSpinActive) {
            pixiLib.setInteraction(this.gameHistoryButtonIcon, false, "0x888888");
            this.gameHistoryButtonIcon.alpha = 0.5;
            this.gameHistoryButtonIcon.tint = 0x888888;
        } else {
            pixiLib.setInteraction(this.gameHistoryButtonIcon, true);
            this.gameHistoryButtonIcon.alpha = 1;
            this.gameHistoryButtonIcon.tint = 0xFFFFFF;
        }
    }
}
