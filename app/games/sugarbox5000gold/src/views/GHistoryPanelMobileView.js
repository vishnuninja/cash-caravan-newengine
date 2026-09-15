

var historyMobileView = HistoryPanelView.prototype;

function isMobileDevice() {

	const userAgent = navigator.userAgent || navigator.vendor || window.opera;
	const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());

	const viewType = _viewInfoUtil ? _viewInfoUtil.viewType : "VD";
	const isMobileViewType = viewType === "VP" || viewType === "VL";

	const actualWindowWidth = window.innerWidth || 1280;
	const actualWindowHeight = window.innerHeight || 720;
	const isSmallScreen = actualWindowWidth <= 768;
	const isPortraitMobile = actualWindowWidth <= actualWindowHeight && actualWindowWidth <= 768;

	const isMobile = isMobileUserAgent || isMobileViewType || isSmallScreen || isPortraitMobile;

	return isMobile;
}

function lockOrientationToLandscape() {
	try {

		if (screen.orientation && screen.orientation.lock) {
			screen.orientation.lock('landscape').catch(function(err) {

			});
		}

		else if (screen.lockOrientation) {
			screen.lockOrientation('landscape');
		}
		else if (screen.mozLockOrientation) {
			screen.mozLockOrientation('landscape');
		}
		else if (screen.msLockOrientation) {
			screen.msLockOrientation('landscape');
		}

	} catch (e) {

	}
}

function unlockOrientation() {
	try {
		if (screen.orientation && screen.orientation.unlock) {
			screen.orientation.unlock();
		}
		else if (screen.unlockOrientation) {
			screen.unlockOrientation();
		}
		else if (screen.mozUnlockOrientation) {
			screen.mozUnlockOrientation();
		}
		else if (screen.msUnlockOrientation) {
			screen.msUnlockOrientation();
		}

	} catch (e) {

	}
}

function closeAllPopupsOnOrientationChange() {
	let popupsClosed = false;

	if (historyMobileView.detailPopupContainer && historyMobileView.detailPopupContainer.parent) {

		if (historyMobileView.panelBg) {
			historyMobileView.panelBg.visible = false;
		}
		if (historyMobileView.visible !== undefined) {
			historyMobileView.visible = false;
		}

		return;
	}

	if (historyMobileView.mobileReplayPopupContainer && historyMobileView.mobileReplayPopupContainer.parent) {

		if (historyMobileView.panelBg) {
			historyMobileView.panelBg.visible = false;
		}
		if (historyMobileView.visible !== undefined) {
			historyMobileView.visible = false;
		}

		return;
	}

	if (historyMobileView.replayCompletionContainer && historyMobileView.replayCompletionContainer.parent) {

		historyMobileView.replayCompletionContainer.parent.removeChild(historyMobileView.replayCompletionContainer);
		historyMobileView.replayCompletionContainer = null;
		popupsClosed = true;
	}

	if (popupsClosed) {
		unlockOrientation();
	}
}

const originalOnResize = HistoryPanelView.prototype.onResize;
historyMobileView.onResize = function(argument) {

    if (!isMobileDevice()) {

        if (originalOnResize) {
            return originalOnResize.call(this, argument);
        }
        return;
    }

    if (this.detailPopupContainer && this.detailPopupContainer.parent && this._currentDetailRoundData) {

        const storedRoundData = this._currentDetailRoundData;

        if (this.detailPopupContainer.parent) {
            this.detailPopupContainer.parent.removeChild(this.detailPopupContainer);
        }
        this.detailPopupContainer = null;

        if (this.panelBg) {
            this.panelBg.visible = false;
        }
        if (this.visible !== undefined) {
            this.visible = false;
        }

        setTimeout(() => {

            this.showHistoryDetailPopup(storedRoundData);
        }, 100);
        return;
    }

    if (this.mobileReplayPopupContainer && this.mobileReplayPopupContainer.parent && this._currentReplayRoundData) {

        const storedRoundData = this._currentReplayRoundData;

        const preservedIframe = this.mobileReplayIframe;
        const preservedUrl = preservedIframe ? (preservedIframe._originalSrc || preservedIframe.src) : null;

        if (this.mobileReplayPopupContainer.parent) {
            this.mobileReplayPopupContainer.parent.removeChild(this.mobileReplayPopupContainer);
        }
        this.mobileReplayPopupContainer = null;

        this.mobileReplayIframe = null;

        if (this.panelBg) {
            this.panelBg.visible = false;
        }
        if (this.visible !== undefined) {
            this.visible = false;
        }

        setTimeout(() => {

            if (preservedIframe && preservedUrl) {

                preservedIframe._shouldReuse = true;
            }

            this.openMobileReplayPopup(storedRoundData);
        }, 100);
        return;
    }

    const wasVisible = this.visible;
    const currentTab = this.currentTab || "lastWins";
    const currentPage = this.currentPage || 1;
    const scrollPosition = this.historyListContainer ? this.historyListContainer.y : 0;

    if (this.detailPopupContainer && this.detailPopupContainer.parent) {

        return;
    }
    
    if (this.mobileReplayPopupContainer && this.mobileReplayPopupContainer.parent) {

        return;
    }
    
    if (this.replayCompletionContainer && this.replayCompletionContainer.parent) {

        return;
    }

    closeAllPopupsOnOrientationChange();

    if (this.detailPopupContainer && this.detailPopupContainer.parent) {

        return;
    }
    
    if (this.mobileReplayPopupContainer && this.mobileReplayPopupContainer.parent) {

        return;
    }

    if (!wasVisible) {

        return;
    }

    this.clearHistoryItems();

    if (this.panelBg && this.panelBg.parent) {
        this.panelBg.parent.removeChild(this.panelBg);
        this.panelBg = null;
    }

    this.createPanelBackground();
    this.createCloseButton();
    this.createTabs();
    this.createHistoryList();

    if (currentTab === "highestWins") {
        this.switchToHighestWins();
    } else {
        this.switchToLastWins();
    }

    if (this.historyListContainer) {
        this.historyListContainer.y = scrollPosition;
    }

    if (coreApp && coreApp.renderer) {
        coreApp.renderer.resize(coreApp.renderer.width, coreApp.renderer.height);
    }

    if (wasVisible) {
        if (currentTab === "highestWins") {
            this.highestWinsPage = 1;
            this.highestWinsHasMore = true;
            this.loadHighestWinsHistory();
        } else {
            this.lastWinsPage = 1;
            this.lastWinsHasMore = true;
            this.loadHistoryFromApi(1, 20, false);
        }
    }
};

let orientationChangeTimeout;
window.addEventListener('orientationchange', function() {

    clearTimeout(orientationChangeTimeout);

    orientationChangeTimeout = setTimeout(function() {

        if (historyMobileView.detailPopupContainer && historyMobileView.detailPopupContainer.parent) {

            if (historyMobileView.panelBg) {
                historyMobileView.panelBg.visible = false;
            }
            if (historyMobileView.visible !== undefined) {
                historyMobileView.visible = false;
            }

            historyMobileView.onResize();
            return;
        }

        if (historyMobileView.mobileReplayPopupContainer && historyMobileView.mobileReplayPopupContainer.parent) {

            if (historyMobileView.panelBg) {
                historyMobileView.panelBg.visible = false;
            }
            if (historyMobileView.visible !== undefined) {
                historyMobileView.visible = false;
            }

            historyMobileView.onResize();
            return;
        }

        closeAllPopupsOnOrientationChange();

        if (historyMobileView.detailPopupContainer && historyMobileView.detailPopupContainer.parent) {

            return;
        }
        
        if (historyMobileView.mobileReplayPopupContainer && historyMobileView.mobileReplayPopupContainer.parent) {

            return;
        }

        if (window.dispatchEvent) {
            const resizeEvent = new Event('resize');
            window.dispatchEvent(resizeEvent);
        }

        if (historyMobileView.visible) {

            historyMobileView.onResize();
        }
    }, 300);
});

let resizeTimeout;
window.addEventListener('resize', function() {

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {

        const width = window.innerWidth;
        const height = window.innerHeight;
        
        if (Math.abs((historyMobileView.lastWidth || 0) - width) > 50 || 
            Math.abs((historyMobileView.lastHeight || 0) - height) > 50) {

            historyMobileView.lastWidth = width;
            historyMobileView.lastHeight = height;

            if (historyMobileView.detailPopupContainer && historyMobileView.detailPopupContainer.parent) {

                if (historyMobileView.panelBg) {
                    historyMobileView.panelBg.visible = false;
                }
                if (historyMobileView.visible !== undefined) {
                    historyMobileView.visible = false;
                }

                historyMobileView.onResize();
                return;
            }

            if (historyMobileView.mobileReplayPopupContainer && historyMobileView.mobileReplayPopupContainer.parent) {

                if (historyMobileView.panelBg) {
                    historyMobileView.panelBg.visible = false;
                }
                if (historyMobileView.visible !== undefined) {
                    historyMobileView.visible = false;
                }

                historyMobileView.onResize();
                return;
            }

            if (historyMobileView.visible) {

                historyMobileView.onResize();
            }
        }
    }, 150);
});

const originalCreatePanelBackground = HistoryPanelView.prototype.createPanelBackground;
const originalCreateHistoryList = HistoryPanelView.prototype.createHistoryList;
const originalCreateTabs = HistoryPanelView.prototype.createTabs;
const originalCreateTableHeaders = HistoryPanelView.prototype.createTableHeaders;
const originalAddHistoryItem = HistoryPanelView.prototype.addHistoryItem;
const originalCreateCloseButton = HistoryPanelView.prototype.createCloseButton;
const originalUpdateLanguageTexts = HistoryPanelView.prototype.updateLanguageTexts;
const originalShowReplayCompletionPopup = HistoryPanelView.prototype.showReplayCompletionPopup;
const originalSwitchToLastWins = HistoryPanelView.prototype.switchToLastWins;
const originalSwitchToHighestWins = HistoryPanelView.prototype.switchToHighestWins;
const originalGenerateAndCopyLink = HistoryPanelView.prototype.generateAndCopyLink;
const originalUpdateScrollbarVisibility = HistoryPanelView.prototype.updateScrollbarVisibility;
const originalUpdateThumbPosition = HistoryPanelView.prototype.updateThumbPosition;
const originalShow = HistoryPanelView.prototype.show;

historyMobileView.createPanelBackground = function () {

	if (!isMobileDevice()) {

		if (originalCreatePanelBackground) {
			return originalCreatePanelBackground.call(this);
		}
		return;
	}

	const actualWindowWidth = window.innerWidth || 1280;
	const actualWindowHeight = window.innerHeight || 720;

	var gameWidth = _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].width;
	var gameHeight = _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].height;

	const viewType = _viewInfoUtil ? _viewInfoUtil.viewType : "VD";
	const isPortrait = viewType === "VP";
	const isMobile = viewType === "VP" || viewType === "VL";

	const isSmallScreen = actualWindowWidth <= 768;
	const isVerySmallScreen = actualWindowWidth <= 480;

	const isPortraitLayout = actualWindowWidth <= actualWindowHeight && isSmallScreen;

	const useMobileLayout = isMobile || isSmallScreen || isVerySmallScreen;

	const overlayWidth = useMobileLayout ? actualWindowWidth : gameWidth;
	const overlayHeight = useMobileLayout ? actualWindowHeight : gameHeight;

	this.overlay = pixiLib.getRectangleSprite(overlayWidth, overlayHeight, 0x000000);
	this.overlay.alpha = 0.7;
	this.overlay.interactive = true;
	this.overlay.buttonMode = false;

	this.overlay.hitArea = new PIXI.Rectangle(0, 0, overlayWidth, overlayHeight);

	pixiLib.addEvent(this.overlay, function (e) {

		if (e && e.stopPropagation) {
			e.stopPropagation();
		}

	});

	this.addChild(this.overlay);

	var popupWidth, popupHeight;

	const layoutWidth = useMobileLayout ? actualWindowWidth : gameWidth;
	const layoutHeight = useMobileLayout ? actualWindowHeight : gameHeight;

	if (isPortraitLayout) {

		popupWidth = layoutWidth * 0.95;
		popupHeight = layoutHeight * 0.90;

	} else if (useMobileLayout) {

		popupWidth = layoutWidth * 0.90;
		popupHeight = layoutHeight * 0.85;

	} else {

		popupWidth = Math.min(800, gameWidth * 0.80);
		popupHeight = Math.min(600, gameHeight * 0.80);

	}

	this.panelBg = new PIXI.Graphics();
	this.panelBg.beginFill(0x1a1a1a);
	this.panelBg.drawRoundedRect(0, 0, popupWidth, popupHeight, 12);
	this.panelBg.endFill();

	this.panelBg.x = (layoutWidth - popupWidth) / 2;
	this.panelBg.y = (layoutHeight - popupHeight) / 2;
	this.panelBg.interactive = true;
	this.addChild(this.panelBg);

	var shadow = new PIXI.Graphics();
	shadow.beginFill(0x000000, 0.6);
	shadow.drawRoundedRect(0, 0, popupWidth + 20, popupHeight + 20, 14);
	shadow.endFill();
	shadow.x = (layoutWidth - popupWidth) / 2 - 10;
	shadow.y = (layoutHeight - popupHeight) / 2 - 10;
	this.addChildAt(shadow, 0);

	var border = new PIXI.Graphics();
	border.beginFill(0x555555);
	border.drawRoundedRect(0, 0, popupWidth + 4, popupHeight + 4, 14);
	border.endFill();
	border.x = (layoutWidth - popupWidth) / 2 - 2;
	border.y = (layoutHeight - popupHeight) / 2 - 2;
	this.addChildAt(border, 1);

	const modalPadding = 20;

	this.headerBg = new PIXI.Graphics();
	this.headerBg.beginFill(0x2a2a2a);
	this.headerBg.drawRoundedRect(0, 0, popupWidth, 50, 12);
	this.headerBg.endFill();
	this.headerBg.x = 0;
	this.headerBg.y = 0;
	this.panelBg.addChild(this.headerBg);

	var titleStyle = {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 15,
		fill: 0xffffff
	};

	this.titleText = pixiLib.getElement("Text", titleStyle);

	const lang = (sessionStorage.getItem("Language") || sessionStorage.Language || 'en').toLowerCase();
	const titleText = gameLiterals.dedetitlereplay
	pixiLib.setText(this.titleText, titleText);
	this.titleText.x = popupWidth / 2;
	this.titleText.y = 25;
	this.titleText.anchor.set(0.5, 0.5);
	this.headerBg.addChild(this.titleText);

	this.panelWidth = popupWidth;
	this.panelHeight = popupHeight;
	this.modalPadding = 20;
	this.isMobile = true;

	this.panelDimensions = this.panelDimensions || {};
	this.panelDimensions.width = popupWidth;
	this.panelDimensions.height = popupHeight;
	this.panelDimensions.padding = this.modalPadding;

};

historyMobileView.show = function (argument) {

	if (!isMobileDevice()) {

		if (originalShow) {
			return originalShow.call(this, argument);
		}
		return;
	}

	const actualWindowWidth = window.innerWidth || 1280;
	const actualWindowHeight = window.innerHeight || 720;
	const isSmallScreen = actualWindowWidth <= 768;
	const isPortraitLayout = actualWindowWidth <= actualWindowHeight && isSmallScreen;

	let expectedPanelWidth;
	if (isPortraitLayout) {
		expectedPanelWidth = actualWindowWidth * 0.95;
	} else if (isSmallScreen) {
		expectedPanelWidth = actualWindowWidth * 0.90;
	} else {
		expectedPanelWidth = Math.min(800, actualWindowWidth * 0.80);
	}

	const needsRecreation = this.panelBg && this.panelWidth && 
		Math.abs(this.panelWidth - expectedPanelWidth) > 50;

	if (needsRecreation) {

		const currentTab = this.currentTab || "lastWins";
		const currentPage = this.currentPage || 1;

		this.clearHistoryItems();

		if (this.panelBg && this.panelBg.parent) {
			this.panelBg.parent.removeChild(this.panelBg);
			this.panelBg = null;
		}

		if (this.overlay && this.overlay.parent) {
			this.overlay.parent.removeChild(this.overlay);
			this.overlay = null;
		}

		this.createPanelBackground();
		this.createCloseButton();
		this.createTabs();
		this.createHistoryList();

		if (currentTab === "highestWins") {
			this.switchToHighestWins();
		} else {
			this.switchToLastWins();
		}

		if (currentTab === "highestWins") {
			this.highestWinsPage = 1;
			this.highestWinsHasMore = true;
			this.loadHighestWinsHistory();
		} else {
			this.lastWinsPage = 1;
			this.lastWinsHasMore = true;
			this.loadHistoryFromApi(1, 20, false);
		}
	}

	if (originalShow) {
		return originalShow.call(this, argument);
	}
};

historyMobileView.createCloseButton = function () {

	if (!isMobileDevice()) {

		if (originalCreateCloseButton) {
			return originalCreateCloseButton.call(this);
		}
		return;
	}

	var closeBtnStyle = {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 24,
		fill: 0xffffff
	};

	this.closeBtn = pixiLib.getElement("Text", closeBtnStyle);
	pixiLib.setText(this.closeBtn, "×");
	this.closeBtn.x = this.panelWidth - 25;
	this.closeBtn.y = 25;
	this.closeBtn.anchor.set(0.5);
	this.closeBtn.interactive = true;
	this.closeBtn.buttonMode = true;
	this.headerBg.addChild(this.closeBtn);

    pixiLib.addEvent(this.closeBtn, this.onCloseHandler.bind(this));

};

historyMobileView.createTabs = function () {

    if (!isMobileDevice()) {

        if (originalCreateTabs) {
            return originalCreateTabs.call(this);
        }
        return;
    }

    const headerHeight = 50;

    const modalPadding = this.modalPadding !== undefined ? this.modalPadding : 20;
    const tabY = headerHeight + modalPadding;
    const tabHeight = 40;
    const tabSpacing = 8;
    const borderRadius = 8;
    const lang = (sessionStorage.getItem("Language") || sessionStorage.Language || 'en').toLowerCase();

    this.tabsContainer = pixiLib.getContainer();
    this.tabsContainer.y = tabY;
    this.panelBg.addChild(this.tabsContainer);

    var tabWidth = (this.panelDimensions.width - (modalPadding * 2) - tabSpacing) / 2;

    this.lastWinsTabBg = new PIXI.Graphics();
    this.lastWinsTabBg.beginFill(0xf58742);
    this.lastWinsTabBg.drawRoundedRect(0, 0, tabWidth, tabHeight, borderRadius);
    this.lastWinsTabBg.endFill();
    this.lastWinsTabBg.x = modalPadding;
    this.lastWinsTabBg.y = 5;
    this.tabsContainer.addChild(this.lastWinsTabBg);
	this.lastWinsTabBg.endFill();
	this.lastWinsTabBg.x = modalPadding;
	this.lastWinsTabBg.y = 5;
	this.tabsContainer.addChild(this.lastWinsTabBg);

	this.activeTabBg = new PIXI.Graphics();
	this.activeTabBg.beginFill(0xf58742);
	this.activeTabBg.drawRoundedRect(0, 0, tabWidth, tabHeight, borderRadius);
	this.activeTabBg.endFill();
	this.activeTabBg.x = modalPadding;
	this.activeTabBg.y = 5;
	this.tabsContainer.addChild(this.activeTabBg);

	this.highestWinsTabBg = new PIXI.Graphics();
	this.highestWinsTabBg.lineStyle(1, 0xffffff, 0.3);
	this.highestWinsTabBg.beginFill(0x000000, 0);
	this.highestWinsTabBg.drawRoundedRect(0, 0, tabWidth, tabHeight, borderRadius);
	this.highestWinsTabBg.endFill();
	this.highestWinsTabBg.x = modalPadding + tabWidth + tabSpacing;
	this.highestWinsTabBg.y = 5;
	this.tabsContainer.addChild(this.highestWinsTabBg);

	this.lastWinsTabContainer = new PIXI.Container();
	this.lastWinsTabContainer.x = modalPadding;
	this.lastWinsTabContainer.y = 5;
	this.lastWinsTabContainer.width = tabWidth;
	this.lastWinsTabContainer.height = tabHeight;
	this.lastWinsTabContainer.interactive = true;
	this.lastWinsTabContainer.buttonMode = true;

	this.lastWinsTabContainer.hitArea = new PIXI.Rectangle(0, 0, tabWidth, tabHeight);
	this.tabsContainer.addChild(this.lastWinsTabContainer);

	var lastWinsStyle = {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: lang === 'tr' ? 12 : 14,
		fill: 0xffffff,
		wordWrap: false,
		wordWrapWidth: 0
	};

	this.lastWinsTab = pixiLib.getElement("Text", lastWinsStyle);
	const lastWinsText = gameLiterals.replayLASTWINS
	pixiLib.setText(this.lastWinsTab, lastWinsText.toUpperCase());
	this.lastWinsTab.x = tabWidth / 2;
	this.lastWinsTab.y = tabHeight / 2;
	this.lastWinsTab.anchor.set(0.5, 0.5);
	this.lastWinsTab.interactive = false;
	this.lastWinsTab.buttonMode = false;
	this.lastWinsTabContainer.addChild(this.lastWinsTab);

	if (this.lastWinsTab.width > tabWidth - 16) {
		var truncatedText = lastWinsText.toUpperCase();
		while (this.lastWinsTab.width > tabWidth - 16 && truncatedText.length > 0) {
			truncatedText = truncatedText.substring(0, truncatedText.length - 1);
			pixiLib.setText(this.lastWinsTab, truncatedText + "...");
		}
	}

	this.highestWinsTabContainer = new PIXI.Container();
	this.highestWinsTabContainer.x = modalPadding + tabWidth + tabSpacing;
	this.highestWinsTabContainer.y = 5;
	this.highestWinsTabContainer.width = tabWidth;
	this.highestWinsTabContainer.height = tabHeight;
	this.highestWinsTabContainer.interactive = true;
	this.highestWinsTabContainer.buttonMode = true;

	this.highestWinsTabContainer.hitArea = new PIXI.Rectangle(0, 0, tabWidth, tabHeight);
	this.tabsContainer.addChild(this.highestWinsTabContainer);

	var highestWinsStyle = {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: lang === 'tr' ? 10 : 14,
		fill: 0x888888,
		wordWrap: false,
		wordWrapWidth: 0
	};

	this.highestWinsTab = pixiLib.getElement("Text", highestWinsStyle);
	const highestWinsText = gameLiterals.replayHIGHESTWINS;
	pixiLib.setText(this.highestWinsTab, highestWinsText.toUpperCase());
	this.highestWinsTab.x = tabWidth / 2;
	this.highestWinsTab.y = tabHeight / 2;
	this.highestWinsTab.anchor.set(0.5, 0.5);
	this.highestWinsTab.interactive = false;
	this.highestWinsTab.buttonMode = false;
	this.highestWinsTabContainer.addChild(this.highestWinsTab);

	if (this.highestWinsTab.width > tabWidth - 16) {
		var truncatedText = highestWinsText.toUpperCase();
		while (this.highestWinsTab.width > tabWidth - 16 && truncatedText.length > 0) {
			truncatedText = truncatedText.substring(0, truncatedText.length - 1);
			pixiLib.setText(this.highestWinsTab, truncatedText + "...");
		}
	}

	pixiLib.addEvent(this.lastWinsTabContainer, () => {
		this.switchToLastWins();
	});

	pixiLib.addEvent(this.highestWinsTabContainer, () => {
		this.switchToHighestWins();
	});

};

historyMobileView.switchToLastWins = function () {

	if (!isMobileDevice()) {

		if (originalSwitchToLastWins) {
			return originalSwitchToLastWins.call(this);
		}
		return;
	}

	if (this.loadMoreButton) {

		try {
			if (this.loadMoreButton.parent) {
				this.loadMoreButton.parent.removeChild(this.loadMoreButton);
			}
			if (this.loadMoreButton.destroy && typeof this.loadMoreButton.destroy === 'function') {
				this.loadMoreButton.destroy();
			}
		} catch (e) {

		}
		this.loadMoreButton = null;
	}

	const modalPadding = this.modalPadding || 20;
	const tabSpacing = 8;
	const tabWidth = (this.panelWidth - (modalPadding * 2) - tabSpacing) / 2;
	const tabHeight = 40;
	const borderRadius = 8;

	if (this.lastWinsTabBg && this.activeTabBg) {

		this.activeTabBg.x = modalPadding;

		this.lastWinsTabBg.clear();
		this.lastWinsTabBg.beginFill(0xf58742);
		this.lastWinsTabBg.drawRoundedRect(0, 0, tabWidth, tabHeight, borderRadius);
		this.lastWinsTabBg.endFill();

		if (this.highestWinsTabBg) {
			this.highestWinsTabBg.clear();
			this.highestWinsTabBg.lineStyle(1, 0xffffff, 0.3);
			this.highestWinsTabBg.beginFill(0x000000, 0);
			this.highestWinsTabBg.drawRoundedRect(0, 0, tabWidth, tabHeight, borderRadius);
			this.highestWinsTabBg.endFill();
		}
	}

	if (this.lastWinsTab) {
		this.lastWinsTab.style.fill = 0xffffff;
	}
	if (this.highestWinsTab) {
		this.highestWinsTab.style.fill = 0x888888;
	}

	if (typeof this.clearHistoryItems === 'function') {
		this.clearHistoryItems();
	}

	this.lastWinsPage = 1;
	this.lastWinsHasMore = true;
	this.lastWinsLoading = false;
	this.currentPage = 1;
	this.hasMore = true;
	this.isLoadingMore = false;

	this.historyRounds = null;
	if (typeof this.loadHistoryFromApi === 'function') {
		this.loadHistoryFromApi(1, 20, false);
	} else if (typeof this.loadMockHistory === 'function') {
		this.loadMockHistory();
	}

	setTimeout(function() {
		if (!this.loadMoreButton && typeof this.createLoadMoreButton === 'function') {

			this.createLoadMoreButton();
		}
		if (this.loadMoreButton && typeof this.updateLoadMoreButton === 'function') {
			this.updateLoadMoreButton();
		}
	}.bind(this), 300);
};

historyMobileView.switchToHighestWins = function () {

	if (!isMobileDevice()) {

		if (originalSwitchToHighestWins) {
			return originalSwitchToHighestWins.call(this);
		}
		return;
	}

	const modalPadding = this.modalPadding || 20;
	const tabSpacing = 8;
	const tabWidth = (this.panelWidth - (modalPadding * 2) - tabSpacing) / 2;
	const tabHeight = 40;
	const borderRadius = 8;

	if (this.highestWinsTabBg && this.activeTabBg) {

		this.activeTabBg.x = modalPadding + tabWidth + tabSpacing;

		this.highestWinsTabBg.clear();
		this.highestWinsTabBg.beginFill(0xf58742);
		this.highestWinsTabBg.drawRoundedRect(0, 0, tabWidth, tabHeight, borderRadius);
		this.highestWinsTabBg.endFill();

		if (this.lastWinsTabBg) {
			this.lastWinsTabBg.clear();
			this.lastWinsTabBg.lineStyle(1, 0xffffff, 0.3);
			this.lastWinsTabBg.beginFill(0x000000, 0);
			this.lastWinsTabBg.drawRoundedRect(0, 0, tabWidth, tabHeight, borderRadius);
			this.lastWinsTabBg.endFill();
		}
	}

	if (this.highestWinsTab) {
		this.highestWinsTab.style.fill = 0xffffff;
	}
	if (this.lastWinsTab) {
		this.lastWinsTab.style.fill = 0x888888;
	}

	if (typeof this.clearHistoryItems === 'function') {
		this.clearHistoryItems();
	}

	this.highestWinsPage = 1;
	this.highestWinsHasMore = true;
	this.highestWinsLoading = false;
	this.currentPage = 1;
	this.hasMore = true;
	this.isLoadingMore = false;

	if (this.highestWinsData) {
		this.highestWinsData = [];
	}

	this.historyRounds = null;
	if (typeof this.loadHighestWinsHistory === 'function') {
		this.loadHighestWinsHistory();
	}

	setTimeout(function() {
		if (!this.loadMoreButton && typeof this.createLoadMoreButton === 'function') {

			this.createLoadMoreButton();
		}
		if (this.loadMoreButton && typeof this.updateLoadMoreButton === 'function') {
			this.updateLoadMoreButton();
		}
	}.bind(this), 300);
};

historyMobileView.createHistoryList = function () {

	if (!isMobileDevice()) {

		if (originalCreateHistoryList) {
			return originalCreateHistoryList.call(this);
		}
		return;
	}

	const headerHeight = 50;
	const tabHeight = 40;
	const modalPadding = this.modalPadding || 20;
	const tabsY = headerHeight + modalPadding;
	const headerStartY = tabsY + tabHeight + 15;

	this.headerContainer = pixiLib.getContainer();
	this.headerContainer.x = modalPadding;
	this.headerContainer.y = headerStartY;
	this.panelBg.addChild(this.headerContainer);

	this.historyListContainer = pixiLib.getContainer();
	this.historyListContainer.x = modalPadding;
	this.historyListContainer.y = headerStartY + 35;
	this.panelBg.addChild(this.historyListContainer);

	this.historyListContainer.interactive = true;
	this.historyListContainer.buttonMode = false;

	this.isDraggingScroll = false;
	this.lastDragY = 0;
	this.dragStartY = 0;
	this.scrollVelocity = 0;
	this.lastScrollTime = 0;

	this.createTableHeaders();

	const maskTopY = headerStartY + 35;

	const rowHeight = 45;
	const rowPadding = 10;
	const totalRowHeight = rowHeight + (rowPadding * 2);
	const buttonAreaHeight = 90;

	this.maskHeight = this.panelHeight - maskTopY - buttonAreaHeight;
	this.listMask = pixiLib.getRectangleSprite(this.panelWidth - 40, this.maskHeight, 0x000000);
	this.listMask.x = 10;
	this.listMask.y = maskTopY;
	this.panelBg.addChild(this.listMask);
	this.historyListContainer.mask = this.listMask;

	this.scrollbar = pixiLib.getRectangleSprite(8, this.maskHeight, 0x333333);
	this.scrollbar.x = this.panelWidth - 25;
	this.scrollbar.y = maskTopY;
	this.scrollbar.visible = false;
	this.scrollbar.interactive = true;
	this.scrollbar.buttonMode = true;
	this.panelBg.addChild(this.scrollbar);

	this.scrollThumb = pixiLib.getRectangleSprite(8, 50, 0x888888);
	this.scrollThumb.x = this.panelWidth - 25;
	this.scrollThumb.y = maskTopY;
	this.scrollThumb.visible = false;
	this.scrollThumb.interactive = true;
	this.scrollThumb.buttonMode = true;
	this.panelBg.addChild(this.scrollThumb);

	this.scrollPosition = 0;
	this.maxScroll = 0;
	this.isDragging = false;
	this.dragStartY = 0;
	this.scrollStartY = 0;

	this.scrollThumb.on('mousedown', this.onScrollThumbDown.bind(this));
	this.scrollThumb.on('touchstart', this.onScrollThumbDown.bind(this));
	this.scrollbar.on('mousedown', this.onScrollBarClick.bind(this));
	this.scrollbar.on('touchstart', this.onScrollBarClick.bind(this));

	window.addEventListener('mousemove', this.onMouseMove.bind(this));
	window.addEventListener('mouseup', this.onMouseUp.bind(this));
	window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
	window.addEventListener('touchend', this.onMouseUp.bind(this));

	this.historyListContainer.interactive = true;
	this.historyListContainer
		.on('wheel', this.onMouseWheel.bind(this), true)
		.on('mousedown', this.onListMouseDown.bind(this))
		.on('touchstart', this.onListTouchStart.bind(this));

	if (this.scrollbar) {
		this.scrollbar.interactive = true;
		this.scrollbar.on('wheel', this.onMouseWheel.bind(this), true);
	}

	window.addEventListener('mousemove', this.onGlobalMouseMove.bind(this));
	window.addEventListener('mouseup', this.onListMouseUp.bind(this));
	window.addEventListener('touchmove', this.onGlobalTouchMove.bind(this), { passive: false });
	window.addEventListener('touchend', this.onListMouseUp.bind(this));

	_mediator.subscribe("ADD_HISTORY_ITEM", this.addHistoryItem.bind(this));

};

const originalHandleDragScroll = HistoryPanelView.prototype.handleDragScroll;
historyMobileView.handleDragScroll = function (currentY) {

	if (!isMobileDevice()) {
		if (originalHandleDragScroll) {
			return originalHandleDragScroll.call(this, currentY);
		}
		return;
	}
	
	if (!this.isDraggingScroll) return;

	var now = Date.now();
	var deltaY = currentY - this.lastDragY;
	var deltaTime = now - this.lastScrollTime;

	var reversedDeltaY = -deltaY;

	this.scrollContent(reversedDeltaY);

	if (deltaTime > 0) {
		this.scrollVelocity = reversedDeltaY / deltaTime;
	}

	this.lastDragY = currentY;
	this.lastScrollTime = now;
};

historyMobileView.createTableHeaders = function () {

	if (!isMobileDevice()) {

		if (originalCreateTableHeaders) {
			return originalCreateTableHeaders.call(this);
		}
		return;
	}

	const modalPadding = this.modalPadding || 20;
	var headerBg = pixiLib.getRectangleSprite(this.panelWidth - (modalPadding * 2), 30, 0x333333);
	this.headerContainer.addChild(headerBg);

	const lang = (sessionStorage.getItem("Language") || sessionStorage.Language || 'en').toLowerCase();

	var headerStyle = {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 11,
		fill: 0xcccccc
	};

	const availableWidth = this.panelWidth - (modalPadding * 2);
	const rightPaddingForWin = 10;
	const usableWidth = availableWidth - rightPaddingForWin;
	
	const timeColWidth = usableWidth * 0.40;
	const winXColWidth = usableWidth * 0.30;
	const winColWidth = usableWidth * 0.30;

	const timeColX = 0;
	const winXColX = timeColWidth;
	const winColX = timeColWidth + winXColWidth;

	const totalColumnWidth = timeColWidth + winXColWidth + winColWidth;
	let finalWinColWidth = winColWidth;
	if (totalColumnWidth > usableWidth) {

		finalWinColWidth = usableWidth - timeColWidth - winXColWidth;

	}


	const timeLabel = gameLiterals.historyTime
	const winXLabel = gameLiterals.historyWinx
	const winLabel  = gameLiterals.historyWin

	var columns = [
		{ text: timeLabel, x: timeColX },
		{ text: winXLabel, x: winXColX },
		{ text: winLabel, x: winColX }
	];

	this.mobileColumnPositions = {
		time: { x: timeColX, width: timeColWidth },
		winX: { x: winXColX, width: winXColWidth },
		win: { x: winColX, width: finalWinColWidth }
	};

	this.columnHeaders = [];

	columns.forEach(function (column) {
		var headerText = pixiLib.getElement("Text", headerStyle);
		pixiLib.setText(headerText, column.text);

		let centerX = column.x;
		const rightOffset = 5;
		const winColumnRightOffset = -5;
		if (column.text === timeLabel || column.text === "Time") {
			centerX = timeColX + timeColWidth / 2;
		} else if (column.text === winXLabel || column.text === "WinX") {
			centerX = winXColX + winXColWidth / 2 + rightOffset;
		} else if (column.text === winLabel || column.text === "Win") {
			centerX = winColX + finalWinColWidth / 2 + rightOffset + winColumnRightOffset;
		}

		headerText.x = centerX;
		headerText.y = 15;
		headerText.anchor.set(0.5, 0.5);
		this.headerContainer.addChild(headerText);

		this.columnHeaders.push(headerText);
	}.bind(this));

};

function formatNumberWithSeparators(num, decimalSeparator) {
	const thousandSeparator = decimalSeparator === ',' ? '.' : ',';
	const parts = num.toFixed(2).split('.');
	const integerPart = parts[0];
	const decimalPart = parts[1];

	const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
	
	return formattedInteger + decimalSeparator + decimalPart;
}

historyMobileView.addHistoryItem = function (roundData) {

	if (!isMobileDevice()) {

		if (originalAddHistoryItem) {
			return originalAddHistoryItem.call(this, roundData);
		}
		return;
	}

	if (!roundData || !roundData.id) {

		return;
	}

	var alreadyExists = false;
	for (var i = 0; i < this.historyItems.length; i++) {
		if (this.historyItems[i].data && this.historyItems[i].data.id === roundData.id) {
			alreadyExists = true;

			break;
		}
	}
	if (alreadyExists) {
		return;
	}

	let spinType = "";

	if (roundData.is_ante_bet) {
		spinType = "ANTE BET";
	}
	else if (roundData.is_buy_feature) {
		spinType = "BUY FEATURE";
	}
	else if (roundData.is_buy_super_feature) {
		spinType = "SUPER BUY FEATURE";
	}
	else if (roundData.is_normal_spin && roundData.is_bonus) {
		spinType = "BONUS";
	}
	else if (roundData.is_normal_spin) {
		spinType = "NORMAL";
	}
	else {
		spinType = "UNKNOWN";
	}

	const rowPadding = 10;
	const rowHeight = 45;
	const totalRowHeight = rowHeight + (rowPadding * 2);
	const yPos = 30 + (this.historyItems.length * totalRowHeight);

	const modalPadding = this.modalPadding || 20;

	const itemBg = pixiLib.getRectangleSprite(this.panelWidth - (modalPadding * 2), totalRowHeight,
		this.historyItems.length % 2 === 0 ? 0x2a2a2a : 0x333333);
	itemBg.x = 0;
	itemBg.y = yPos;
	itemBg.interactive = true;
	itemBg.buttonMode = true;

	itemBg.mouseover = function () {
		this.tint = 0x404040;
	};
	itemBg.mouseout = function () {
		this.tint = 0xffffff;
	};

	this.historyListContainer.addChild(itemBg);

	const separatorLine = new PIXI.Graphics();
	separatorLine.lineStyle(1, 0xffffff, 0.1);
	const separatorY = yPos + totalRowHeight - 1;
	separatorLine.moveTo(0, separatorY);
	separatorLine.lineTo(this.panelWidth - (modalPadding * 2), separatorY);
	this.historyListContainer.addChild(separatorLine);

	pixiLib.addEvent(itemBg, function () {

		_sndLib.play(_sndLib.sprite.btnClick);
		this.showHistoryDetailPopup(roundData);
	}.bind(this));

	const cellStyle = {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 10,
		fill: 0xffffff
	};

	const urlParams = new URLSearchParams(window.location.search);
	const isHistoryMode = urlParams.has('round_id');

	const currencyCode = (roundData.currency || '').toLowerCase();
	const currencySymbolMap = {
		'try': '₺', 'usd': '$', 'eur': '€', 'gbp': '£', 'inr': '₹', 'idr': 'Rp', 'thb': '฿', 'vnd': '₫', 'brl': 'R$', 'php': '₱', 'myr': 'RM', 'krw': '₩', 'jpy': '¥', 'cny': '¥', 'aud': 'A$', 'cad': 'C$', 'rub': '₽', 'pln': 'zł','ron': 'lei'
	};
	const currencyPrefix = currencySymbolMap[currencyCode] ? (currencySymbolMap[currencyCode] + " ") : (currencyCode ? (currencyCode.toUpperCase() + " ") : "");

	const userLang = (sessionStorage.getItem("Language") || sessionStorage.Language || 'en').toLowerCase();
	const decimalSeparator = userLang === 'tr' ? ',' : '.';

	let wagerDivided = 1;
	let wager = currencyPrefix + "1" + decimalSeparator + "00";
	if (isHistoryMode && urlParams.has('wager')) {

		const wagerValue = parseFloat(urlParams.get('wager'));
		if (!isNaN(wagerValue)) {
			const normalizedWagerStr = getNormalizedTotalWager(wagerValue);
			wagerDivided = parseFloat(normalizedWagerStr) || 0;
			wager = currencyPrefix + formatNumberWithSeparators(wagerDivided, decimalSeparator);
		} else {
			wagerDivided = 0;
			wager = currencyPrefix + "0" + decimalSeparator + "00";
		}
	} else if (roundData.wager) {

		const normalizedWagerStr = getNormalizedTotalWager(roundData.wager);
		wagerDivided = parseFloat(normalizedWagerStr) || 0;
		wager = currencyPrefix + formatNumberWithSeparators(wagerDivided, decimalSeparator);
	}

		const now = new Date(roundData.updated_at || Date.now());
		const timeStr = now.toLocaleDateString('tr-TR') + " " + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
		const betId = roundData.id.substring(0, 8) + "...";
		const winDivided = (roundData.win_amount || 0) / 1000;
		const multiplier = wagerDivided > 0 ? (winDivided / wagerDivided) : 0;
		const multiplierText = multiplier > 0 ? multiplier.toFixed(2).replace('.', decimalSeparator) + "x" : "0x";
		const winAmount = winDivided > 0 ? currencyPrefix + formatNumberWithSeparators(winDivided, decimalSeparator) : (currencyPrefix + "0" + decimalSeparator + "00");

	const colPos = this.mobileColumnPositions || {
		time: { x: 10, width: (this.panelWidth - 30) * 0.45 },
		winX: { x: 10 + (this.panelWidth - 30) * 0.45, width: (this.panelWidth - 30) * 0.30 },
		win: { x: 10 + (this.panelWidth - 30) * 0.75, width: (this.panelWidth - 30) * 0.25 }
	};

	const timeColX = colPos.time.x;
	const winXColX = colPos.winX.x;
	const winColX = colPos.win.x;

	const goldCoin = new PIXI.Graphics();
	goldCoin.beginFill(0xf58742);
	const coinRadius = 6;
	goldCoin.drawCircle(0, 0, coinRadius);
	goldCoin.endFill();

	const rightOffset = 5;
	const winXColumnCenter = colPos.winX.x + colPos.winX.width / 2 + rightOffset;
	const coinGap = 15;
	const coinX = winXColumnCenter - 30;
	goldCoin.x = coinX;
	goldCoin.y = yPos + rowPadding + (rowHeight / 2);
	this.historyListContainer.addChild(goldCoin);

	const multiplierTextX = coinX + coinRadius + coinGap;

	const cells = [
		{ text: timeStr, x: timeColX },
		{ text: multiplierText, x: multiplierTextX, isMultiplier: true },
		{ text: winAmount, x: winColX }
	];

	cells.forEach(function (cell) {
		const cellText = pixiLib.getElement("Text", cellStyle);
		pixiLib.setText(cellText, cell.text);

		let centerX = cell.x;
		const rightOffset = 5;
		const winColumnRightOffset = -5;
		if (cell.text === timeStr) {

			centerX = colPos.time.x + colPos.time.width / 2 + rightOffset;
		} else if (cell.isMultiplier) {

			centerX = multiplierTextX;
		} else {

			centerX = colPos.win.x + colPos.win.width / 2 + rightOffset + winColumnRightOffset;
		}

		cellText.x = centerX;
		cellText.y = yPos + rowPadding + (rowHeight / 2);

		if (cell.isMultiplier) {
			cellText.style.fill = 0xf58742;
			cellText.style.fontSize = 12;

			cellText.anchor.set(0, 0.5);
		} else {
			cellText.anchor.set(0.5, 0.5);
		}

		this.historyListContainer.addChild(cellText);
	}.bind(this));

	this.historyItems.push({
		bg: itemBg,
		data: roundData
	});

	this.updateScrollbarVisibility();

	if (!this.loadMoreButton && typeof this.createLoadMoreButton === 'function') {
		this.createLoadMoreButton();
	}
	if (this.loadMoreButton && typeof this.updateLoadMoreButton === 'function') {
		this.updateLoadMoreButton();
	}

};

historyMobileView.updateScrollbarVisibility = function () {

	if (!isMobileDevice()) {

		if (originalUpdateScrollbarVisibility) {
			return originalUpdateScrollbarVisibility.call(this);
		}
		return;
	}

	const rowHeight = 45;
	const rowPadding = 10;
	const totalRowHeight = rowHeight + (rowPadding * 2);

	var buttonHeight = (this.loadMoreButton && this.hasMore) ? 60 : 0;

	var totalContentHeight = 30 + (this.historyItems.length * totalRowHeight) + buttonHeight;
	var visibleHeight = this.maskHeight || (this.panelHeight - 210);

	this.maxScroll = Math.max(0, totalContentHeight - visibleHeight + 40);
	var thumbHeight = Math.max(30, (visibleHeight * visibleHeight) / (totalContentHeight || 1));

	var needsScrollbar = this.maxScroll > 0;
	
	if (this.scrollbar) {
		this.scrollbar.visible = needsScrollbar;
	}
	
	if (this.scrollThumb) {
		this.scrollThumb.visible = needsScrollbar;
		this.scrollThumb.height = thumbHeight;
		this.updateThumbPosition();
	}

	this.updateLoadMoreButton();

};

historyMobileView.updateThumbPosition = function () {

	if (!isMobileDevice()) {
		if (originalUpdateThumbPosition) {
			return originalUpdateThumbPosition.call(this);
		}
		return;
	}
	
	if (!this.scrollThumb) return;

	const headerHeight = 50;
	const tabHeight = 40;
	const modalPadding = this.modalPadding || 20;
	const tabsY = headerHeight + modalPadding;
	const headerStartY = tabsY + tabHeight + 15;
	const containerStartY = headerStartY + 35;
	
	var visibleHeight = this.maskHeight || (this.panelHeight - 210);
	var thumbRange = visibleHeight - this.scrollThumb.height;

	var effectiveMaxScroll = Math.max(1, this.maxScroll);
	var thumbY = containerStartY + (Math.max(0, this.scrollPosition) / effectiveMaxScroll) * thumbRange;
	
	this.scrollThumb.y = Math.max(containerStartY, Math.min(containerStartY + thumbRange, thumbY));

	this.historyListContainer.y = containerStartY - Math.max(0, this.scrollPosition);

	this.updateLoadMoreButton();
};

const originalCreateLoadMoreButton = HistoryPanelView.prototype.createLoadMoreButton;
historyMobileView.createLoadMoreButton = function () {

	if (originalCreateLoadMoreButton) {
		originalCreateLoadMoreButton.call(this);
	}

	const isMobile = isMobileDevice();

	if (this.loadMoreButton && this.historyItems.length > 0) {

		this.loadMoreButton.visible = true;
		this.loadMoreButton.alpha = 1.0;
		this.loadMoreButton.renderable = true;
		this.loadMoreButton.mask = null;

		const fixedButtonY = this.panelHeight - 80;
		
		this.loadMoreButton.y = fixedButtonY;
		this.loadMoreButton.x = (this.panelWidth - 200) / 2;

		if (this.panelBg && this.loadMoreButton.parent !== this.panelBg) {

			if (this.loadMoreButton.parent) {
				try {
					this.loadMoreButton.parent.removeChild(this.loadMoreButton);
				} catch (e) {

				}
			}

			this.panelBg.addChild(this.loadMoreButton);
		}

		if (this.panelBg && this.loadMoreButton.parent === this.panelBg) {
			try {
				this.panelBg.setChildIndex(this.loadMoreButton, this.panelBg.children.length - 1);
			} catch (e) {

			}
		}

		this.loadMoreButton.interactive = true;
		this.loadMoreButton.buttonMode = true;

		if (!this.loadMoreButton._hasClickHandler) {

			var self = this;
			pixiLib.addEvent(this.loadMoreButton, function() {
				if (!self.isLoadingMore && !self.lastWinsLoading && !self.highestWinsLoading) {

					if (typeof self.loadNextPage === 'function') {
						self.loadNextPage();
					}
				} else {

				}
			});
			this.loadMoreButton._hasClickHandler = true;
		}

	} else {

	}
};

const originalUpdateLoadMoreButton = HistoryPanelView.prototype.updateLoadMoreButton;
historyMobileView.updateLoadMoreButton = function (isLoading) {

	if (originalUpdateLoadMoreButton) {
		originalUpdateLoadMoreButton.call(this, isLoading);
	}

	const isMobile = isMobileDevice();

	if (this.loadMoreButton) {

		this.loadMoreButton.visible = true;
		this.loadMoreButton.alpha = 1.0;
		this.loadMoreButton.renderable = true;
		this.loadMoreButton.mask = null;

		const fixedButtonY = this.panelHeight - 80;
		
		this.loadMoreButton.y = fixedButtonY;
		this.loadMoreButton.x = (this.panelWidth - 200) / 2;

		if (this.panelBg && this.loadMoreButton.parent !== this.panelBg) {

			if (this.loadMoreButton.parent) {
				try {
					this.loadMoreButton.parent.removeChild(this.loadMoreButton);
				} catch (e) {

				}
			}

			this.panelBg.addChild(this.loadMoreButton);
		}

		this.loadMoreButton.interactive = true;
		this.loadMoreButton.buttonMode = true;
		if (this.loadMoreButton.bg) {
			this.loadMoreButton.bg.alpha = 1.0;
		}

		if (this.panelBg && this.loadMoreButton.parent === this.panelBg) {
			try {
				this.panelBg.setChildIndex(this.loadMoreButton, this.panelBg.children.length - 1);
			} catch (e) {

			}
		}

	} else if (!this.loadMoreButton) {

		if (typeof this.createLoadMoreButton === 'function') {
			this.createLoadMoreButton();
		}
	}
};

const originalLoadHistoryFromApi = HistoryPanelView.prototype.loadHistoryFromApi;
historyMobileView.loadHistoryFromApi = function (page, limit, append) {

	if (originalLoadHistoryFromApi) {
		originalLoadHistoryFromApi.call(this, page, limit, append);
	}

	setTimeout(function() {
		if (!this.loadMoreButton && typeof this.createLoadMoreButton === 'function') {

			this.createLoadMoreButton();
		}
		if (this.loadMoreButton && typeof this.updateLoadMoreButton === 'function') {
			this.updateLoadMoreButton();
		}

		if (this.loadMoreButton) {
			this.loadMoreButton.visible = true;
			this.loadMoreButton.alpha = 1.0;
			this.loadMoreButton.renderable = true;
			this.loadMoreButton.interactive = true;
			this.loadMoreButton.buttonMode = true;

		}
	}.bind(this), 300);
};

const originalShowLoader = HistoryPanelView.prototype.showLoader;
historyMobileView.showLoader = function () {

	if (!isMobileDevice()) {
		if (originalShowLoader) {
			return originalShowLoader.call(this);
		}
		return;
	}

	if (this.historyItems.length === 0) {

		return;
	}

	if (originalShowLoader) {
		originalShowLoader.call(this);
	}
};

const originalLoadMockHistory = HistoryPanelView.prototype.loadMockHistory;
historyMobileView.loadMockHistory = function () {

	if (originalLoadMockHistory) {
		originalLoadMockHistory.call(this);
	}

	if (!this.loadMoreButton && typeof this.createLoadMoreButton === 'function') {

		this.createLoadMoreButton();
	}

	if (typeof this.updateLoadMoreButton === 'function') {
		this.updateLoadMoreButton();
	}

	if (this.loadMoreButton) {
		this.loadMoreButton.visible = true;
		this.loadMoreButton.alpha = 1.0;
		this.loadMoreButton.renderable = true;

	}
};

historyMobileView.showHistoryDetailPopup = function (roundData) {

	this._currentDetailRoundData = roundData;

	if (this.panelBg) {
		this.panelBg.visible = false;

	}
	if (this.visible !== undefined) {
		this.visible = false;
	}

	const isAndroid = /Android/i.test(navigator.userAgent || '');
	const shouldLockOrientation = !isAndroid;

	if (shouldLockOrientation) {
		lockOrientationToLandscape();
	}

	setTimeout(function() {

		const actualWindowWidth = window.innerWidth || 375;
		const actualWindowHeight = window.innerHeight || 667;
		const isSmallScreen = actualWindowWidth <= 768;

		const layoutWidth = actualWindowWidth;
		const layoutHeight = actualWindowHeight;

		const isPortraitLayout = actualWindowWidth <= actualWindowHeight;

		const useMobileLayout = isSmallScreen;

		const lang = (sessionStorage.getItem("Language") || sessionStorage.Language || 'en').toLowerCase();

		if (this.detailPopupContainer) {
			if (coreApp && coreApp.stage && this.detailPopupContainer.parent === coreApp.stage) {
				coreApp.stage.removeChild(this.detailPopupContainer);
			} else if (_ng && _ng.stage && this.detailPopupContainer.parent === _ng.stage) {
				_ng.stage.removeChild(this.detailPopupContainer);
			} else if (this.parent && this.detailPopupContainer.parent === this.parent) {
				this.parent.removeChild(this.detailPopupContainer);
			}
			this.detailPopupContainer = null;
		}

		this.detailPopupContainer = pixiLib.getContainer();
		this.detailPopupContainer.name = "historyDetailPopupContainer";
		this.detailPopupContainer.visible = true;
		this.detailPopupContainer.alpha = 1.0;

		let targetContainer = null;
		if (coreApp && coreApp.stage) {
			targetContainer = coreApp.stage;
		} else if (_ng && _ng.stage) {
			targetContainer = _ng.stage;
		} else if (this.parent) {
			targetContainer = this.parent;
		}

		if (!targetContainer) {

			return;
		}

		targetContainer.addChild(this.detailPopupContainer);
		targetContainer.setChildIndex(this.detailPopupContainer, targetContainer.children.length - 1);

		const overlay = pixiLib.getRectangleSprite(layoutWidth, layoutHeight, 0x000000);
		overlay.alpha = 0.8;
		overlay.interactive = true;
		overlay.buttonMode = false;
		overlay.hitArea = new PIXI.Rectangle(0, 0, layoutWidth, layoutHeight);
		pixiLib.addEvent(overlay, function (e) {
			if (e && e.stopPropagation) {
				e.stopPropagation();
			}
		});
		this.detailPopupContainer.addChild(overlay);

		const popupWidth = layoutWidth * (isPortraitLayout ? 0.95 : 0.90);
		const popupHeight = layoutHeight * (isPortraitLayout ? 0.90 : 0.90);

		const popupBg = new PIXI.Graphics();
		popupBg.beginFill(0x1a1a1a);
		popupBg.drawRoundedRect(0, 0, popupWidth, popupHeight, 15);
		popupBg.endFill();
		popupBg.x = (layoutWidth - popupWidth) / 2;
		popupBg.y = (layoutHeight - popupHeight) / 2;
		popupBg.interactive = true;
		this.detailPopupContainer.addChild(popupBg);

		const headerBg = new PIXI.Graphics();
		headerBg.beginFill(0x2a2a2a);
		headerBg.drawRoundedRect(0, 0, popupWidth, 50, 15);
		headerBg.endFill();
		popupBg.addChild(headerBg);

		const backBtn = pixiLib.getElement("Text", {
			fontFamily: "Montserrat-regular, sans-serif",
			fontSize: 24,
			fill: 0xffffff
		});
		pixiLib.setText(backBtn, "←");
		backBtn.x = 25;
		backBtn.y = 25;
		backBtn.anchor.set(0.5);
		backBtn.interactive = true;
		backBtn.buttonMode = true;
		headerBg.addChild(backBtn);

		const backToHistory = () => {

			_sndLib.play(_sndLib.sprite.btnClick);
			closeDetailPopup();
		};

		pixiLib.addEvent(backBtn, backToHistory);

		const closeBtn = pixiLib.getElement("Text", {
			fontFamily: "Montserrat-regular, sans-serif",
			fontSize: 24,
			fill: 0xffffff
		});
		pixiLib.setText(closeBtn, "×");
		closeBtn.x = popupWidth - 25;
		closeBtn.y = 25;
		closeBtn.anchor.set(0.5);
		closeBtn.interactive = true;
		closeBtn.buttonMode = true;
		headerBg.addChild(closeBtn);

		const closeDetailPopup = () => {

			_sndLib.play(_sndLib.sprite.btnClick);

			unlockOrientation();

			this._currentDetailRoundData = null;

			if (this.panelBg) {
				this.panelBg.visible = true;

			}
			if (this.visible !== undefined) {
				this.visible = true;
			}
			if (this.detailPopupContainer && this.detailPopupContainer.parent) {
				this.detailPopupContainer.parent.removeChild(this.detailPopupContainer);
				this.detailPopupContainer = null;
			}
		};

		pixiLib.addEvent(closeBtn, closeDetailPopup);

		const titleText = pixiLib.getElement("Text", {
			fontFamily: "Montserrat-regular, sans-serif",
			fontSize: 15,
			fill: 0xffffff
		});
		const titleLabel = gameLiterals.dedetitlereplay
		pixiLib.setText(titleText, titleLabel);
		titleText.x = popupWidth / 2;
		titleText.y = 25;
		titleText.anchor.set(0.5, 0.5);
		headerBg.addChild(titleText);

		const contentStartY = 70;
		const contentWidth = popupWidth - 40;
		const leftMargin = 20;

		const currencyCode = (roundData.currency || '').toLowerCase();
		const currencySymbolMap = {
			'try': '₺', 'usd': '$', 'eur': '€', 'gbp': '£', 'inr': '₹', 'idr': 'Rp', 'thb': '฿', 'vnd': '₫', 'brl': 'R$', 'php': '₱', 'myr': 'RM', 'krw': '₩', 'jpy': '¥', 'cny': '¥', 'aud': 'A$', 'cad': 'C$', 'rub': '₽', 'pln': 'zł','ron': 'lei'
		};
		const currencyPrefix = currencySymbolMap[currencyCode] ? (currencySymbolMap[currencyCode] + " ") : (currencyCode ? (currencyCode.toUpperCase() + " ") : "");

		const userLang = (sessionStorage.getItem("Language") || sessionStorage.Language || 'en').toLowerCase();
		const decimalSeparator = userLang === 'tr' ? ',' : '.';

		const date = new Date(roundData.updated_at || Date.now());
		const dateStr = date.toLocaleDateString('tr-TR');
		const timeStr = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
		const betId = roundData.id.substring(0, 16);

		let wagerDivided = 0;
		if (roundData.wager) {

			const normalizedWagerStr = getNormalizedTotalWager(roundData.wager);
			wagerDivided = parseFloat(normalizedWagerStr) || 0;
		}
		const betAmount = wagerDivided > 0 ? (currencyPrefix + formatNumberWithSeparators(wagerDivided, decimalSeparator)) : (currencyPrefix + "0" + decimalSeparator + "00");
		const winDivided = (roundData.win_amount || 0) / 1000;
		const winAmount = winDivided > 0 ? (currencyPrefix + formatNumberWithSeparators(winDivided, decimalSeparator)) : (currencyPrefix + "0" + decimalSeparator + "00");
		const multiplier = wagerDivided > 0 ? (winDivided / wagerDivided) : 0;

		const labelStyle = {
			fontFamily: "Montserrat-regular, sans-serif",
			fontSize: 12,
			fill: 0x888888
		};

		const valueStyle = {
			fontFamily: "Montserrat-regular, sans-serif",
			fontSize: 12,
			fill: 0xffffff
		};

		const labels = [gameLiterals.replaydate, gameLiterals.replaytime, gameLiterals.replaybetId, gameLiterals.replaybet, gameLiterals.replaywin]

		const values = [dateStr, timeStr, betId, betAmount, winAmount];

		let labelY = contentStartY;
		const rowSpacing = 30;
		const labelX = leftMargin;
		const valueX = popupWidth / 2 + 10;

		labels.forEach((label, index) => {

			const labelText = pixiLib.getElement("Text", labelStyle);
			pixiLib.setText(labelText, label);
			labelText.x = labelX;
			labelText.y = labelY;
			labelText.anchor.set(0, 0.5);
			popupBg.addChild(labelText);

			const valueText = pixiLib.getElement("Text", valueStyle);
			pixiLib.setText(valueText, values[index]);
			valueText.x = valueX;
			valueText.y = labelY;
			valueText.anchor.set(0, 0.5);
			popupBg.addChild(valueText);

			labelY += rowSpacing;
		});

		const rightMargin = 20;
		const isSmallDevice = actualWindowWidth <= 480 || actualWindowHeight <= 600;
		const buttonHeight = isSmallDevice ? 36 : 40;
		const buttonSpacing = isSmallDevice ? 12 : 15;

		const availableWidth = popupWidth - valueX - rightMargin;
		const buttonWidth = Math.min(isSmallDevice ? 140 : 170, availableWidth - 10);

		const labelsEndY = contentStartY + (labels.length * rowSpacing);
		const spacingAfterLabels = 20;
		const multiplierSize = isSmallDevice ? 50 : 60;

		const portraitExtraSpacing = isPortraitLayout ? 80 : 0;
		const coinTopY = labelsEndY + spacingAfterLabels + portraitExtraSpacing;

		const coinRadius = multiplierSize / 2;
		const coinCenterX = labelX + coinRadius + 30;
		const coinCenterY = coinTopY + coinRadius;

		const buttonAreaY = coinTopY;

		const buttonRightX = popupWidth - buttonWidth - rightMargin;

		const multiplierContainer = pixiLib.getContainer();
		multiplierContainer.x = 0;
		multiplierContainer.y = 0;
		popupBg.addChild(multiplierContainer);

		const largeCoin = new PIXI.Graphics();
		largeCoin.beginFill(0xf58742);
		largeCoin.drawCircle(0, 0, coinRadius);
		largeCoin.endFill();

		largeCoin.x = coinCenterX;
		largeCoin.y = coinCenterY;
		multiplierContainer.addChild(largeCoin);

		const multiplierText = pixiLib.getElement("Text", {
			fontFamily: "Montserrat-regular, sans-serif",
			fontSize: 28,
			fill: 0xffd700
		});
		const formattedMultiplier = multiplier > 0 ? multiplier.toFixed(2).replace('.', decimalSeparator) + "x" : "0x";
		pixiLib.setText(multiplierText, formattedMultiplier);
		multiplierText.x = coinCenterX;
		multiplierText.y = coinCenterY + coinRadius + 20;
		multiplierText.anchor.set(0.5, 0.5);
		multiplierContainer.addChild(multiplierText);

		const replayBtn = new PIXI.Graphics();
		replayBtn.beginFill(0x000000);
		replayBtn.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 8);
		replayBtn.endFill();
		replayBtn.lineStyle(2, 0xffffff);
		replayBtn.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 8);
		replayBtn.x = buttonRightX;
		replayBtn.y = buttonAreaY;
		replayBtn.interactive = true;
		replayBtn.buttonMode = true;
		popupBg.addChild(replayBtn);

		const iconSize = isSmallDevice ? 16 : 18;
		const iconOffsetX = isSmallDevice ? 10 : 12;
		const playIcon = pixiLib.getElement("Text", {
			fontFamily: "Montserrat-regular, sans-serif",
			fontSize: iconSize,
			fill: 0xffffff
		});
		pixiLib.setText(playIcon, "▶");
		playIcon.x = buttonRightX + iconOffsetX;
		playIcon.y = buttonAreaY + buttonHeight / 2;
		playIcon.anchor.set(0.5, 0.5);
		popupBg.addChild(playIcon);

		const textFontSize = isSmallDevice ? 11 : 13;
		const textOffsetX = isSmallDevice ? 22 : 25;
		const replayText = pixiLib.getElement("Text", {
			fontFamily: "Montserrat-regular, sans-serif",
			fontSize: textFontSize,
			fill: 0xffffff
		});
		const replayLabel = gameLiterals.replayWatchReplay;
		pixiLib.setText(replayText, replayLabel);
		replayText.x = buttonRightX + textOffsetX + (buttonWidth - textOffsetX) / 2;
		replayText.y = buttonAreaY + buttonHeight / 2;
		replayText.anchor.set(0.5, 0.5);
		popupBg.addChild(replayText);

		pixiLib.addEvent(replayBtn, () => {
			_sndLib.play(_sndLib.sprite.btnClick);

			closeDetailPopup();

			this.openMobileReplayPopup(roundData);
		});

		const linkBtn = new PIXI.Graphics();
		linkBtn.beginFill(0x000000);
		linkBtn.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 8);
		linkBtn.endFill();
		linkBtn.lineStyle(2, 0xffffff);
		linkBtn.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 8);
		linkBtn.x = buttonRightX;
		linkBtn.y = buttonAreaY + buttonHeight + buttonSpacing;
		linkBtn.interactive = true;
		linkBtn.buttonMode = true;
		linkBtn.width = buttonWidth;
		linkBtn.height = buttonHeight;
		linkBtn._originalColor = 0x000000;
		popupBg.addChild(linkBtn);

		const chainIconSize = isSmallDevice ? 16 : 18;
		const chainIconOffsetX = isSmallDevice ? 10 : 12;
		const chainIcon = pixiLib.getElement("Text", {
			fontFamily: "Montserrat-regular, sans-serif",
			fontSize: chainIconSize,
			fill: 0xffffff
		});
		pixiLib.setText(chainIcon, "🔗");
		chainIcon.x = buttonRightX + chainIconOffsetX;
		chainIcon.y = buttonAreaY + buttonHeight + buttonSpacing + buttonHeight / 2;
		chainIcon.anchor.set(0.5, 0.5);
		popupBg.addChild(chainIcon);

		const linkTextFontSize = isSmallDevice ? 11 : 13;
		const linkTextOffsetX = isSmallDevice ? 22 : 25;
		const linkText = pixiLib.getElement("Text", {
			fontFamily: "Montserrat-regular, sans-serif",
			fontSize: linkTextFontSize,
			fill: 0xffffff
		});
		const linkLabel = gameLiterals.replayGENERATELink
		pixiLib.setText(linkText, linkLabel);
		linkText.x = buttonRightX + linkTextOffsetX + (buttonWidth - linkTextOffsetX) / 2;
		linkText.y = buttonAreaY + buttonHeight + buttonSpacing + buttonHeight / 2;
		linkText.anchor.set(0.5, 0.5);
		popupBg.addChild(linkText);

		pixiLib.addEvent(linkBtn, () => {
			_sndLib.play(_sndLib.sprite.btnClick);

			if (typeof this.generateAndCopyLink === 'function') {
				const tempLinkText = pixiLib.getElement("Text", { fontSize: 10 });
				const tempLinkBtn = pixiLib.getRectangleSprite(1, 1, 0x000000);
				this.generateAndCopyLink(roundData, linkText, linkBtn);

				const originalText = linkLabel;
				const copiedText = gameLiterals.replaycopied
				pixiLib.setText(linkText, copiedText);
				setTimeout(() => {
					pixiLib.setText(linkText, originalText);
				}, 2000);
			}
		});

	}.bind(this), 300);
};

historyMobileView.openMobileReplayPopup = function (roundData) {

	if (this.panelBg) {
		this.panelBg.visible = false;

	}
	if (this.visible !== undefined) {
		this.visible = false;
	}

	if (this.detailPopupContainer && this.detailPopupContainer.parent) {

		if (this.detailPopupContainer.parent) {
			this.detailPopupContainer.parent.removeChild(this.detailPopupContainer);
		}
		this.detailPopupContainer = null;
		this._currentDetailRoundData = null;
	}

	this._currentReplayRoundData = roundData;

	const isAndroid = /Android/i.test(navigator.userAgent || '');
	const shouldLockOrientation = !isAndroid;

	if (shouldLockOrientation) {
		lockOrientationToLandscape();
	}

	setTimeout(function() {

		const actualWindowWidth = window.innerWidth || 375;
		const actualWindowHeight = window.innerHeight || 667;
		const isSmallScreen = actualWindowWidth <= 768;

		const layoutWidth = actualWindowWidth;
		const layoutHeight = actualWindowHeight;

		const isPortraitLayout = actualWindowWidth <= actualWindowHeight;

		const useMobileLayout = isSmallScreen;

		const lang = (sessionStorage.getItem("Language") || sessionStorage.Language || 'en').toLowerCase();

		const sessionId = sessionStorage.getItem("sessionId") || sessionStorage.sessionId;
		const userLocale = sessionStorage.getItem("Language") || sessionStorage.Language || 'en';

		const wager = roundData.wager ? String(roundData.wager) : '1.00';

		let currency = null;
		try {
			const urlParams = new URLSearchParams(window.location.search);
			if (urlParams && urlParams.has('currency')) {
				currency = urlParams.get('currency');
			} else if (roundData && roundData.currency) {
				currency = roundData.currency;
			} else {
				currency = sessionStorage.getItem("adaptor_currency") || sessionStorage.adaptor_currency || null;
			}
		} catch (e) {

		}

		let isAnteBet = false;
		let isBuyFeature = false;
		let isSuperBuyFeature = false;
		let isNormalSpin = false;

		if (roundData.is_ante_bet) {
			isAnteBet = true;
		} else if (roundData.is_buy_feature) {
			isBuyFeature = true;
		} else if (roundData.is_buy_super_feature) {
			isSuperBuyFeature = true;
		} else if (roundData.is_bonus) {
			isNormalSpin = true;
		}

		const baseUrl = window.location.origin + window.location.pathname;
		const replayUrl = new URL(baseUrl);

		replayUrl.searchParams.set('user_locale', userLocale);
		replayUrl.searchParams.set('round_id', roundData.id);
		replayUrl.searchParams.set('is_replay', 'true');

		if (this.mobileReplayPopupContainer) {
			if (coreApp && coreApp.stage && this.mobileReplayPopupContainer.parent === coreApp.stage) {
				coreApp.stage.removeChild(this.mobileReplayPopupContainer);
			} else if (_ng && _ng.stage && this.mobileReplayPopupContainer.parent === _ng.stage) {
				_ng.stage.removeChild(this.mobileReplayPopupContainer);
			} else if (this.parent && this.mobileReplayPopupContainer.parent === this.parent) {
				this.parent.removeChild(this.mobileReplayPopupContainer);
			}
			this.mobileReplayPopupContainer = null;
		}

		this.mobileReplayPopupContainer = pixiLib.getContainer();
		this.mobileReplayPopupContainer.name = "mobileReplayPopupContainer";
		this.mobileReplayPopupContainer.visible = true;
		this.mobileReplayPopupContainer.alpha = 1.0;

		let targetContainer = null;
		if (coreApp && coreApp.stage) {
			targetContainer = coreApp.stage;
		} else if (_ng && _ng.stage) {
			targetContainer = _ng.stage;
		} else if (this.parent) {
			targetContainer = this.parent;
		}

		if (!targetContainer) {

			return;
		}

		targetContainer.addChild(this.mobileReplayPopupContainer);
		targetContainer.setChildIndex(this.mobileReplayPopupContainer, targetContainer.children.length - 1);

		const overlay = pixiLib.getRectangleSprite(layoutWidth, layoutHeight, 0x000000);
		overlay.alpha = 0.8;
		overlay.interactive = true;
		overlay.buttonMode = false;
		overlay.hitArea = new PIXI.Rectangle(0, 0, layoutWidth, layoutHeight);
		pixiLib.addEvent(overlay, function (e) {
			if (e && e.stopPropagation) {
				e.stopPropagation();
			}
		});
		this.mobileReplayPopupContainer.addChild(overlay);

		const popupWidth = layoutWidth * (isPortraitLayout ? 0.95 : 0.90);
		const popupHeight = layoutHeight * (isPortraitLayout ? 0.90 : 0.90);

		const popupBg = new PIXI.Graphics();
		popupBg.beginFill(0x1a1a1a);
		popupBg.drawRoundedRect(0, 0, popupWidth, popupHeight, 15);
		popupBg.endFill();
		popupBg.x = (layoutWidth - popupWidth) / 2;
		popupBg.y = (layoutHeight - popupHeight) / 2;
		popupBg.interactive = true;
		this.mobileReplayPopupContainer.addChild(popupBg);

		const headerBg = new PIXI.Graphics();
		headerBg.beginFill(0x2a2a2a);
		headerBg.drawRoundedRect(0, 0, popupWidth, 50, 15);
		headerBg.endFill();
		popupBg.addChild(headerBg);

		const titleText = pixiLib.getElement("Text", {
			fontFamily: "Montserrat-regular, sans-serif",
			fontSize: 18,
			fill: 0xffffff,
		});
		const titleLabel = gameLiterals.replayGameReplay;
		pixiLib.setText(titleText, titleLabel);
		titleText.x = popupWidth / 2;
		titleText.y = 25;
		titleText.anchor.set(0.5, 0.5);
		titleText.visible = false;
		headerBg.addChild(titleText);

		const closeBtn = pixiLib.getElement("Text", {
			fontFamily: "Montserrat-regular, sans-serif",
			fontSize: 24,
			fill: 0xffffff
		});
		pixiLib.setText(closeBtn, "×");
		closeBtn.x = popupWidth - 25;
		closeBtn.y = 25;
		closeBtn.anchor.set(0.5);
		closeBtn.interactive = true;
		closeBtn.buttonMode = true;
		headerBg.addChild(closeBtn);

			const closeMobileReplayPopup = () => {

				_sndLib.play(_sndLib.sprite.btnClick);

				unlockOrientation();

				this._currentReplayRoundData = null;

				if (this.panelBg) {
					this.panelBg.visible = true;

				}
				if (this.visible !== undefined) {
					this.visible = true;
				}

				if (this.mobileReplayIframe) {
					try {
						if (document.body.contains(this.mobileReplayIframe)) {
							document.body.removeChild(this.mobileReplayIframe);
						}
					} catch (e) {

					}
					this.mobileReplayIframe = null;
				}

				if (this.mobileReplayPopupContainer && this.mobileReplayPopupContainer.parent) {
					this.mobileReplayPopupContainer.parent.removeChild(this.mobileReplayPopupContainer);
					this.mobileReplayPopupContainer = null;
				}
			};

		pixiLib.addEvent(closeBtn, closeMobileReplayPopup);

		let iframe = this.mobileReplayIframe;

		if (!iframe || !document.body.contains(iframe)) {

			const allIframes = document.querySelectorAll('iframe');
			for (let i = 0; i < allIframes.length; i++) {
				const checkIframe = allIframes[i];
				if (checkIframe._shouldReuse && checkIframe._originalSrc === replayUrl.toString()) {
					iframe = checkIframe;
					checkIframe._shouldReuse = false;

					break;
				}
			}
		}
		
		const isNewIframe = !iframe || !document.body.contains(iframe);
		
		if (isNewIframe) {

			iframe = document.createElement('iframe');
			iframe.src = replayUrl.toString();
			iframe.scrolling = 'no';
			iframe.setAttribute('scrolling', 'no');

			iframe._originalSrc = replayUrl.toString();

			document.body.appendChild(iframe);
		} else {

			if (iframe.src !== iframe._originalSrc && iframe._originalSrc) {
				iframe.src = iframe._originalSrc;
			}

			iframe.style.display = 'block';
			iframe.style.visibility = 'visible';
			iframe.style.opacity = '1';
		}

		iframe.style.width = popupWidth + 'px';
		iframe.style.height = (popupHeight - 50) + 'px';
		iframe.style.border = 'none';
		iframe.style.position = 'fixed';
		iframe.style.top = (popupBg.y + 50) + 'px';
		iframe.style.left = popupBg.x + 'px';
		iframe.style.zIndex = '10000';
		iframe.style.backgroundColor = '#000';
		iframe.style.borderRadius = '0 0 15px 15px';
		iframe.style.pointerEvents = 'auto';
		iframe.style.overflow = 'hidden';
		iframe.style.overflowX = 'hidden';
		iframe.style.overflowY = 'hidden';
		iframe.style.display = 'block';
		iframe.style.visibility = 'visible';
		iframe.style.opacity = '1';

		iframe.style.willChange = 'transform';
		iframe.style.transform = 'translateZ(0)';

		this.mobileReplayIframe = iframe;

		iframe._preventReload = true;

		let originalSrc = iframe.src || iframe._originalSrc;
		if (!iframe._srcOverride) {
			iframe._srcOverride = true;
			Object.defineProperty(iframe, 'src', {
				get: function() {
					return originalSrc;
				},
				set: function(newSrc) {

					if (!this._preventReload || newSrc === originalSrc) {
						originalSrc = newSrc;
						iframe.setAttribute('src', newSrc);
					} else {

					}
				}
			});
		}

		iframe.onload = function () {
			try {

				const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
				if (iframeDoc) {

					const style = iframeDoc.createElement('style');
					style.textContent = `
						* {
							scrollbar-width: none !important; /* Firefox */
							-ms-overflow-style: none !important; /* IE and Edge */
						}
						*::-webkit-scrollbar {
							display: none !important; /* Chrome, Safari, Opera */
							width: 0 !important;
							height: 0 !important;
						}
						body {
							overflow: hidden !important;
							overflow-x: hidden !important;
							overflow-y: hidden !important;
						}
						html {
							overflow: hidden !important;
							overflow-x: hidden !important;
							overflow-y: hidden !important;
						}
					`;
					iframeDoc.head.appendChild(style);
				}
			} catch (e) {

			}
		};

	}.bind(this), 300);
};

historyMobileView.updateLanguageTexts = function (lang) {

	if (!isMobileDevice()) {

		if (originalUpdateLanguageTexts) {
			return originalUpdateLanguageTexts.call(this, lang);
		}
		return;
	}

	if (this.lastWinsTab) {
	
			pixiLib.setText(this.lastWinsTab, gameLiterals.replayLASTWINS);
	}

	if (this.highestWinsTab) {
	
		pixiLib.setText(this.highestWinsTab, gameLiterals.replayHIGHESTWINS);
	}

	if (this.titleText) {
		
			pixiLib.setText(this.titleText, gameLiterals.dedetitlereplay);
	}

	if (this.columnHeaders && this.columnHeaders.length > 0) {
		var columnTexts = [];
		columnTexts = [gameLiterals.historyTime, gameLiterals.historyWinx, gameLiterals.historyWin];

		for (var i = 0; i < this.columnHeaders.length && i < columnTexts.length; i++) {
			if (this.columnHeaders[i]) {
				pixiLib.setText(this.columnHeaders[i], columnTexts[i]);
			}
		}
	}

};

historyMobileView.showReplayCompletionPopup = function (roundData, userLocale) {

	if (!isMobileDevice()) {

		if (originalShowReplayCompletionPopup) {
			return originalShowReplayCompletionPopup.call(this, roundData, userLocale);
		}
		return;
	}

	if (!roundData) {

		return;
	}

	_sndLib.play(_sndLib.sprite.btnClick);

	const actualWindowWidth = window.innerWidth || 375;
	const actualWindowHeight = window.innerHeight || 667;
	const isSmallScreen = actualWindowWidth <= 768;

	let layoutWidth, layoutHeight;
	if (actualWindowWidth <= actualWindowHeight) {

		layoutWidth = actualWindowHeight;
		layoutHeight = actualWindowWidth;
	} else {

		layoutWidth = actualWindowWidth;
		layoutHeight = actualWindowHeight;
	}
	const isPortraitLayout = false;

	const useMobileLayout = isSmallScreen;

	const lang = (userLocale || sessionStorage.getItem("Language") || sessionStorage.Language || 'en').toLowerCase();

	let gameWidth = layoutWidth;
	let gameHeight = layoutHeight;

	if (_ng && _ng.GameConfig && _ng.GameConfig.gameLayout && _ng.GameConfig.gameLayout[_viewInfoUtil.viewType]) {
		gameWidth = _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].width;
		gameHeight = _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].height;
	}

	if (this.replayCompletionContainer) {

		if (coreApp && coreApp.stage) {
			coreApp.stage.removeChild(this.replayCompletionContainer);
		} else if (_ng && _ng.stage) {
			_ng.stage.removeChild(this.replayCompletionContainer);
		}
	}

	this.replayCompletionContainer = pixiLib.getContainer();
	this.replayCompletionContainer.name = "mobileReplayCompletionContainer";

	let targetStage = null;
	if (coreApp && coreApp.gameView && coreApp.gameView.popupContainer) {
		targetStage = coreApp.gameView.popupContainer;
		targetStage.addChild(this.replayCompletionContainer);
		targetStage.setChildIndex(this.replayCompletionContainer, targetStage.children.length - 1);

	} else if (coreApp && coreApp.stage) {
		targetStage = coreApp.stage;
		targetStage.addChild(this.replayCompletionContainer);
		targetStage.setChildIndex(this.replayCompletionContainer, targetStage.children.length - 1);

	} else if (_ng && _ng.stage) {
		targetStage = _ng.stage;
		targetStage.addChild(this.replayCompletionContainer);
		targetStage.setChildIndex(this.replayCompletionContainer, targetStage.children.length - 1);

	} else {

		return;
	}

	const overlay = pixiLib.getRectangleSprite(gameWidth, gameHeight, 0x000000);
	overlay.alpha = 0.01;
	overlay.interactive = false;
	overlay.buttonMode = false;
	this.replayCompletionContainer.addChild(overlay);

	const userLang = (lang || sessionStorage.getItem("Language") || sessionStorage.Language || 'en').toLowerCase();
	const decimalSeparator = userLang === 'tr' ? ',' : '.';

	let wagerDivided = 1;
	if (roundData.wager) {

		const normalizedWagerStr = getNormalizedTotalWager(roundData.wager);
		wagerDivided = parseFloat(normalizedWagerStr) || 1;
	}
	const winDivided = (roundData.win_amount || 0) / 1000;
	const multiplier = wagerDivided > 0 ? (winDivided / wagerDivided) : 0;

	const popupWidth = layoutWidth * (isPortraitLayout ? 0.95 : 0.90);
	const popupHeight = layoutHeight * (isPortraitLayout ? 0.90 : 0.90);

	const popupBg = new PIXI.Graphics();
	popupBg.beginFill(0x1a1a1a);
	popupBg.drawRoundedRect(0, 0, popupWidth, popupHeight, 15);
	popupBg.endFill();
	popupBg.x = (layoutWidth - popupWidth) / 2;
	popupBg.y = (layoutHeight - popupHeight) / 2;
	popupBg.interactive = true;
	this.replayCompletionContainer.addChild(popupBg);

	const leftMargin = 20;
	const rightMargin = 20;
	const isSmallDevice = layoutWidth <= 480 || layoutHeight <= 600;
	const buttonHeight = isSmallDevice ? 36 : 40;
	const buttonSpacing = isSmallDevice ? 12 : 15;

	const labelX = leftMargin;
	const valueX = popupWidth / 2 + 10;

	const availableWidth = popupWidth - valueX - rightMargin;
	const buttonWidth = Math.min(isSmallDevice ? 140 : 170, availableWidth - 10);

	const multiplierSize = isSmallDevice ? 50 : 60;
	const coinRadius = multiplierSize / 2;
	const coinCenterX = labelX + coinRadius + 30;

	const portraitExtraSpacing = isPortraitLayout ? 80 : 0;
	const coinTopY = 120 + portraitExtraSpacing;
	const coinCenterY = coinTopY + coinRadius;

	const buttonAreaY = coinTopY;

	const buttonRightX = popupWidth - buttonWidth - rightMargin;

	const multiplierContainer = pixiLib.getContainer();
	multiplierContainer.x = 0;
	multiplierContainer.y = 0;
	popupBg.addChild(multiplierContainer);

	const largeCoin = new PIXI.Graphics();
	largeCoin.beginFill(0xf58742);
	largeCoin.drawCircle(0, 0, coinRadius);
	largeCoin.endFill();

	largeCoin.x = coinCenterX;
	largeCoin.y = coinCenterY;
	multiplierContainer.addChild(largeCoin);

	const multiplierText = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 28,
		fill: 0xffd700
	});
	const formattedMultiplier = multiplier > 0 ? multiplier.toFixed(2).replace('.', decimalSeparator) + "x" : "0x";
	pixiLib.setText(multiplierText, formattedMultiplier);
	multiplierText.x = coinCenterX;
	multiplierText.y = coinCenterY + coinRadius + 20;
	multiplierText.anchor.set(0.5, 0.5);
	multiplierContainer.addChild(multiplierText);

	const replayBtn = new PIXI.Graphics();
	replayBtn.beginFill(0x000000);
	replayBtn.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 8);
	replayBtn.endFill();
	replayBtn.lineStyle(2, 0xffffff);
	replayBtn.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 8);
	replayBtn.x = buttonRightX;
	replayBtn.y = buttonAreaY;
	replayBtn.interactive = true;
	replayBtn.buttonMode = true;
	popupBg.addChild(replayBtn);

	const iconSize = isSmallDevice ? 16 : 18;
	const iconOffsetX = isSmallDevice ? 10 : 12;
	const playIcon = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: iconSize,
		fill: 0xffffff
	});
	pixiLib.setText(playIcon, "▶");
	playIcon.x = buttonRightX + iconOffsetX;
	playIcon.y = buttonAreaY + buttonHeight / 2;
	playIcon.anchor.set(0.5, 0.5);
	popupBg.addChild(playIcon);

	const textFontSize = isSmallDevice ? 11 : 13;
	const textOffsetX = isSmallDevice ? 22 : 25;
	const replayText = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: textFontSize,
		fill: 0xffffff
	});
	const replayLabel = gameLiterals.replayWatchReplay;
	pixiLib.setText(replayText, replayLabel);
	replayText.x = buttonRightX + textOffsetX + (buttonWidth - textOffsetX) / 2;
	replayText.y = buttonAreaY + buttonHeight / 2;
	replayText.anchor.set(0.5, 0.5);
	popupBg.addChild(replayText);

	pixiLib.addEvent(replayBtn, () => {
		_sndLib.play(_sndLib.sprite.btnClick);

		this.closeReplayCompletionPopup();

		setTimeout(() => {

			let slotService = null;

			if (window.slotService) {
				slotService = window.slotService;

			}

			else if (coreApp && coreApp.slotService) {
				slotService = coreApp.slotService;

			}

			else if (_ng && _ng.slotService) {
				slotService = _ng.slotService;

			}

			if (slotService && typeof slotService.restartReplaySequence === 'function') {

				slotService.restartReplaySequence();
			} else {

				if (_mediator) {
					_mediator.publish("restartReplay");

				}
			}
		}, 100);
	});

	const linkBtn = new PIXI.Graphics();
	linkBtn.beginFill(0x000000);
	linkBtn.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 8);
	linkBtn.endFill();
	linkBtn.lineStyle(2, 0xffffff);
	linkBtn.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 8);
	linkBtn.x = buttonRightX;
	linkBtn.y = buttonAreaY + buttonHeight + buttonSpacing;
	linkBtn.interactive = true;
	linkBtn.buttonMode = true;
	linkBtn.width = buttonWidth;
	linkBtn.height = buttonHeight;
	linkBtn._originalColor = 0x000000;
	popupBg.addChild(linkBtn);

	const chainIconSize = isSmallDevice ? 16 : 18;
	const chainIconOffsetX = isSmallDevice ? 10 : 12;
	const chainIcon = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: chainIconSize,
		fill: 0xffffff
	});
	pixiLib.setText(chainIcon, "🔗");
	chainIcon.x = buttonRightX + chainIconOffsetX;
	chainIcon.y = buttonAreaY + buttonHeight + buttonSpacing + buttonHeight / 2;
	chainIcon.anchor.set(0.5, 0.5);
	popupBg.addChild(chainIcon);

	const linkTextFontSize = isSmallDevice ? 11 : 13;
	const linkTextOffsetX = isSmallDevice ? 22 : 25;
	const linkText = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: linkTextFontSize,
		fill: 0xffffff
	});
	const linkLabel = gameLiterals.replayGENERATELink;
	pixiLib.setText(linkText, linkLabel);
	linkText.x = buttonRightX + linkTextOffsetX + (buttonWidth - linkTextOffsetX) / 2;
	linkText.y = buttonAreaY + buttonHeight + buttonSpacing + buttonHeight / 2;
	linkText.anchor.set(0.5, 0.5);
	popupBg.addChild(linkText);

	pixiLib.addEvent(linkBtn, () => {
		_sndLib.play(_sndLib.sprite.btnClick);

		if (typeof this.generateAndCopyLink === 'function') {
			const tempLinkText = pixiLib.getElement("Text", { fontSize: 10 });
			const tempLinkBtn = pixiLib.getRectangleSprite(1, 1, 0x000000);
			this.generateAndCopyLink(roundData, linkText, linkBtn);

			const originalText = linkLabel;
			const copiedText = gameLiterals.replaycopied;
			pixiLib.setText(linkText, copiedText);
			setTimeout(() => {
				pixiLib.setText(linkText, originalText);
			}, 2000);
		}
	});

	this.completionRoundData = roundData;

};

historyMobileView.closeReplayCompletionPopup = function () {

	unlockOrientation();

	if (this.replayCompletionContainer) {

		if (coreApp && coreApp.gameView && coreApp.gameView.popupContainer && this.replayCompletionContainer.parent === coreApp.gameView.popupContainer) {
			coreApp.gameView.popupContainer.removeChild(this.replayCompletionContainer);
		} else if (coreApp && coreApp.stage && this.replayCompletionContainer.parent === coreApp.stage) {
			coreApp.stage.removeChild(this.replayCompletionContainer);
		} else if (_ng && _ng.stage && this.replayCompletionContainer.parent === _ng.stage) {
			_ng.stage.removeChild(this.replayCompletionContainer);
		} else if (this.replayCompletionContainer.parent) {

			this.replayCompletionContainer.parent.removeChild(this.replayCompletionContainer);
		}

		this.replayCompletionContainer = null;

	}
};

historyMobileView.restartReplay = function () {

	if (this.closeReplayCompletionPopup && typeof this.closeReplayCompletionPopup === 'function') {
		this.closeReplayCompletionPopup();
	}

	setTimeout(() => {

		let slotService = null;

		if (window.slotService) {
			slotService = window.slotService;

		}

		else if (coreApp && coreApp.slotService) {
			slotService = coreApp.slotService;

		}

		else if (_ng && _ng.slotService) {
			slotService = _ng.slotService;

		}

		else if (coreApp && coreApp.service) {
			slotService = coreApp.service;

		}

		if (slotService && typeof slotService.restartReplaySequence === 'function') {

			slotService.restartReplaySequence();
		} else {

			if (_mediator) {
				_mediator.publish("restartReplay");

			}
		}
	}, 100);
};

historyMobileView.generateAndCopyLink = function (roundData, linkTextElement, linkBtn) {

	if (!isMobileDevice()) {

		if (originalGenerateAndCopyLink) {
			return originalGenerateAndCopyLink.call(this, roundData, linkTextElement, linkBtn);
		}
		return;
	}

	const userLocale = sessionStorage.getItem("Language") || sessionStorage.Language || 'en';
	const sessionId = sessionStorage.getItem("sessionId") || sessionStorage.sessionId;

	const wager = roundData.wager ? String(roundData.wager) : '1.00';

	let currency = null;
	try {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams && urlParams.has('currency')) {
			currency = urlParams.get('currency');
		} else if (roundData && roundData.currency) {
			currency = roundData.currency;
		} else {
			currency = sessionStorage.getItem("adaptor_currency") || sessionStorage.adaptor_currency || null;
		}
	} catch (e) {

	}

	let isAnteBet = false;
	let isBuyFeature = false;
	let isSuperBuyFeature = false;
	let isNormalSpin = false;

	if (roundData.is_ante_bet) {
		isAnteBet = true;
	} else if (roundData.is_buy_feature) {
		isBuyFeature = true;
	} else if (roundData.is_buy_super_feature) {
		isSuperBuyFeature = true;	
	} else if (roundData.is_bonus) {
		isNormalSpin = true;
	}

	const baseUrl = window.location.origin + window.location.pathname;
	const replayUrl = new URL(baseUrl);

	replayUrl.searchParams.set('user_locale', userLocale);
	replayUrl.searchParams.set('round_id', roundData.id || roundData.round_id || '');
	replayUrl.searchParams.set('is_replay', 'true');

	const replayUrlString = replayUrl.toString();

	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard.writeText(replayUrlString).then(() => {

			if (linkBtn) {
				if (linkBtn instanceof PIXI.Graphics) {

					if (!linkBtn._originalColor) {
						linkBtn._originalColor = 0x000000;
					}

					const btnWidth = linkBtn.width || 200;
					const btnHeight = linkBtn.height || 50;

					linkBtn.clear();
					linkBtn.beginFill(0xf58742);
					linkBtn.drawRoundedRect(0, 0, btnWidth, btnHeight, 10);
					linkBtn.endFill();
					linkBtn.lineStyle(2, 0xffffff);
					linkBtn.drawRoundedRect(0, 0, btnWidth, btnHeight, 10);

					setTimeout(() => {
						linkBtn.clear();
						linkBtn.beginFill(linkBtn._originalColor);
						linkBtn.drawRoundedRect(0, 0, btnWidth, btnHeight, 10);
						linkBtn.endFill();
						linkBtn.lineStyle(2, 0xffffff);
						linkBtn.drawRoundedRect(0, 0, btnWidth, btnHeight, 10);
					}, 2000);
				} else if (linkBtn.tint !== undefined) {

					linkBtn.tint = 0xf58742;
					setTimeout(() => {
						linkBtn.tint = 0xFFFFFF;
					}, 2000);
				}
			}
		}).catch((err) => {

			this.fallbackCopyToClipboard(replayUrlString);
		});
	} else {

		this.fallbackCopyToClipboard(replayUrlString);
	}
};

historyMobileView.fallbackCopyToClipboard = function (text) {

	const textArea = document.createElement("textarea");
	textArea.value = text;
	textArea.style.position = "fixed";
	textArea.style.left = "-999999px";
	textArea.style.top = "-999999px";
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		const successful = document.execCommand('copy');
		if (successful) {

		} else {

		}
	} catch (err) {

	}

	document.body.removeChild(textArea);
};
