function HistoryPanelView(argument) {
	ViewContainer.call(this, arguments);
	this.historyItems = [];

	this.lastWinsPage = 1;
	this.lastWinsHasMore = true;
	this.lastWinsLoading = false;
	this.highestWinsPage = 1;
	this.highestWinsHasMore = true;
	this.highestWinsLoading = false;

	this.highestWinsData = [];

	this.currentPage = 1;
	this.hasMore = true;
	this.isLoadingMore = false;
	this.loadMoreButton = null;
	this.loaderSpinner = null;
	this.noDataMessage = null;
	this.isInfiniteScrollEnabled = false;
	this.scrollObserver = null;
}

const normalRound = [
	{
		"player": {
			"first_name": null,
			"user_name": "",
			"account_id": "",
			"balance": 100010.1,
			"balance2": null,
			"cash": 100010.1,
			"cash2": null,
			"bonus_amount": null,
			"currency": "try"
		},
		"game": {
			"game_id": "726",
			"game_name": "dede5000"
		},
		"misc": {
			"rng": null
		},
		"current_round": {
			"round_id": "2b740e12-f92a-4f3d-aa97-1f45be84ce8a",
			"matrix": "ghddch;dfbdff;eagfhe;eegfhe;eeheie",
			"payline_wins": {
				"format": "betline_number;win;blink;num_repeats;betline;matrix_positions",
				"details": "0:100::9:e:;1:40::9:h:"
			},
			"win_amount": 140,
			"screen_wins": [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			],
			"parent_type": null,
			"post_matrix_info": {
				"feature_name": null,
				"matrix": "hhdhga;baddgg;babdcd;gfgffd;dagfif"
			},
			"multipliers": [
				{
					"type": "fs_multiplier",
					"value": "0"
				}
			],
			"cluster_wins": null,
			"bonus_games_won": "",
			"payline_win_amount": 140,
			"spin_type": "normal",
			"extra_info": {
				"debit": ""
			},
			"game_extra_info": {
				"ante_bet": 1.3,
				"BuyFg": 100,
				"max_win_cap": 5000,
				"game_rtp": 94.37,
				"ante_game_rtp": 94.22,
				"buy_fg_game_rtp": 94.38,
				"max_rtp": 94.38,
				"min_rtp": 94.22,
				"paytable": {
					"a": [
						10,
						25,
						50
					],
					"b": [
						2.5,
						10,
						25
					],
					"c": [
						2,
						5,
						15
					],
					"d": [
						1.5,
						2,
						12
					],
					"e": [
						1,
						1.5,
						10
					],
					"f": [
						0.8,
						1.2,
						8
					],
					"g": [
						0.5,
						1,
						5
					],
					"h": [
						0.4,
						0.9,
						4
					],
					"i": [
						0.25,
						0.75,
						2
					],
					"s": [
						3,
						5,
						100
					]
				}
			},
			"misc_prizes": {
				"0": {
					"screenWins": [
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0
					],
					"new_reel": "hadhcd;bhbdfd;bhgdhh;gfgfhh;dahfif",
					"new_symbols": "hbb;ah;;h;;ddh;",
					"old_reel_symbol": [
						"e"
					],
					"positions": [
						12,
						17,
						18,
						19,
						23,
						24,
						25,
						27,
						29
					]
				},
				"1": {
					"screenWins": [
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0
					],
					"new_reel": "hhdhga;baddgg;babdcd;gfgffd;dagfif",
					"new_symbols": "h;ha;d;h;gg;ag;",
					"old_reel_symbol": [
						"h"
					],
					"positions": [
						0,
						3,
						7,
						13,
						16,
						17,
						22,
						23,
						26
					]
				},
				"count": 2
			},
			"positions": [
				120,
				68,
				77,
				193,
				110,
				103
			],
			"blastPosition": [],
			"scatter_win": 0,
			"num_ways": null,
			"total_fs_win_amount": null
		},
		"next_round": [],
		"promo_details": null
	}
]

HistoryPanelView.prototype = Object.create(ViewContainer.prototype);
HistoryPanelView.prototype.constructor = HistoryPanelView.prototype;

var historyView = HistoryPanelView.prototype;

historyView.createView = function (argument) {
	this.createPanelBackground();
	this.createCloseButton();
	this.createTabs();
	this.createHistoryList();
	this.hide();
};

historyView.createPanelBackground = function () {

	var gameWidth = _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].width;
	var gameHeight = _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].height;

	var actualWindowWidth = window.innerWidth || gameWidth;
	var actualWindowHeight = window.innerHeight || gameHeight;

	var overlayWidth = Math.max(actualWindowWidth, gameWidth) * 1.5;
	var overlayHeight = Math.max(actualWindowHeight, gameHeight) * 1.5;

	this.overlay = pixiLib.getRectangleSprite(overlayWidth, overlayHeight, 0x000000);
	this.overlay.alpha = 0.7;
	this.overlay.interactive = true;
	this.overlay.buttonMode = false;

	this.overlay.position.set(0, 0);

	this.overlay.hitArea = new PIXI.Rectangle(0, 0, overlayWidth, overlayHeight);

	pixiLib.addEvent(this.overlay, function (e) {

		if (e && e.stopPropagation) {
			e.stopPropagation();
		}
	});

	this.addChild(this.overlay);

	var popupWidth = 1000;
	var popupHeight = 650;

	this.panelBg = new PIXI.Graphics();
	this.panelBg.beginFill(0x2a2a2a);
	this.panelBg.drawRoundedRect(0, 0, popupWidth, popupHeight, 20);
	this.panelBg.endFill();
	this.panelBg.x = (gameWidth - popupWidth) / 2;
	this.panelBg.y = (gameHeight - popupHeight) / 2;
	this.panelBg.interactive = true;
	this.addChild(this.panelBg);

	var border = new PIXI.Graphics();
	border.beginFill(0x555555);
	border.drawRoundedRect(0, 0, popupWidth + 4, popupHeight + 4, 22);
	border.endFill();
	border.x = (gameWidth - popupWidth) / 2 - 2;
	border.y = (gameHeight - popupHeight) / 2 - 2;
	this.addChildAt(border, this.getChildIndex(this.panelBg));

	this.headerBg = new PIXI.Graphics();
	this.headerBg.beginFill(0x3a3a3a);
	this.headerBg.drawRoundedRect(0, 0, popupWidth, 60, 20);
	this.headerBg.endFill();
	this.panelBg.addChild(this.headerBg);

	var titleStyle = {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 24,
		fill: 0xffffff,
	};

	this.titleText = pixiLib.getElement("Text", titleStyle);

	const lang = (sessionStorage.getItem("Language") || sessionStorage.Language || 'en').toLowerCase();
	const titleText = gameLiterals.dedetitlereplay
	pixiLib.setText(this.titleText, titleText);
	this.titleText.x = 520;
	this.titleText.y = 30;
	this.titleText.anchor.set(0.5, 0.5);
	this.headerBg.addChild(this.titleText);

	this.panelWidth = popupWidth;
	this.panelHeight = popupHeight;
};

historyView.createCloseButton = function () {

	var closeBtnStyle = {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 30,
		fill: 0xffffff
	};

	this.closeBtn = pixiLib.getElement("Text", closeBtnStyle);
	pixiLib.setText(this.closeBtn, "×");
	this.closeBtn.x = this.panelWidth - 40;
	this.closeBtn.y = 30;
	this.closeBtn.anchor.set(0.5);
	this.closeBtn.interactive = true;
	this.closeBtn.buttonMode = true;
	this.headerBg.addChild(this.closeBtn);

	pixiLib.addEvent(this.closeBtn, this.onCloseHandler.bind(this));
};

historyView.createTabs = function () {

	this.tabsContainer = pixiLib.getContainer();
	this.tabsContainer.y = 80;
	this.panelBg.addChild(this.tabsContainer);

	var tabBg = new PIXI.Graphics();
	tabBg.beginFill(0x1a1a1a);
	tabBg.drawRoundedRect(10, 5, this.panelWidth - 20, 30, 8);
	tabBg.endFill();
	this.tabsContainer.addChild(tabBg);

	this.activeTabBg = new PIXI.Graphics();
	this.activeTabBg.beginFill(0xf59342);
	var tabWidth = (this.panelWidth - 20) / 2;
	this.activeTabBg.drawRoundedRect(0, 0, tabWidth, 30, 8);
	this.activeTabBg.endFill();
	this.activeTabBg.x = 10;
	this.activeTabBg.y = 5;
	this.tabsContainer.addChild(this.activeTabBg);

	this.lastWinsTabContainer = new PIXI.Container();
	this.lastWinsTabContainer.x = 10;
	this.lastWinsTabContainer.y = 5;
	this.lastWinsTabContainer.width = tabWidth;
	this.lastWinsTabContainer.height = 30;
	this.lastWinsTabContainer.interactive = true;
	this.lastWinsTabContainer.buttonMode = true;

	this.lastWinsTabContainer.hitArea = new PIXI.Rectangle(0, 0, tabWidth, 30);
	this.tabsContainer.addChild(this.lastWinsTabContainer);

	var lastWinsStyle = {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 16,
		fill: 0xffffff
	};

	this.lastWinsTab = pixiLib.getElement("Text", lastWinsStyle);
	pixiLib.setText(this.lastWinsTab, "LAST WINS");
	this.lastWinsTab.x = tabWidth / 2;
	this.lastWinsTab.y = 15;
	this.lastWinsTab.anchor.set(0.5);
	this.lastWinsTab.interactive = false;
	this.lastWinsTab.buttonMode = false;
	this.lastWinsTabContainer.addChild(this.lastWinsTab);

	this.highestWinsTabContainer = new PIXI.Container();
	this.highestWinsTabContainer.x = 10 + tabWidth;
	this.highestWinsTabContainer.y = 5;
	this.highestWinsTabContainer.width = tabWidth;
	this.highestWinsTabContainer.height = 30;
	this.highestWinsTabContainer.interactive = true;
	this.highestWinsTabContainer.buttonMode = true;

	this.highestWinsTabContainer.hitArea = new PIXI.Rectangle(0, 0, tabWidth, 30);
	this.tabsContainer.addChild(this.highestWinsTabContainer);

	var highestWinsStyle = {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 16,
		fill: 0x888888
	};

	this.highestWinsTab = pixiLib.getElement("Text", highestWinsStyle);
	pixiLib.setText(this.highestWinsTab, "HIGHEST WINS");
	this.highestWinsTab.x = tabWidth / 2;
	this.highestWinsTab.y = 15;
	this.highestWinsTab.anchor.set(0.5);
	this.highestWinsTab.interactive = false;
	this.highestWinsTab.buttonMode = false;
	this.highestWinsTabContainer.addChild(this.highestWinsTab);

	pixiLib.addEvent(this.lastWinsTabContainer, () => {
		this.switchToLastWins();
	});

	pixiLib.addEvent(this.highestWinsTabContainer, () => {
		this.switchToHighestWins();
	});
};

historyView.switchToLastWins = function () {

	var tabWidth = (this.panelWidth - 20) / 2;
	this.activeTabBg.x = 10;
	this.lastWinsTab.style.fill = 0xffffff;
	this.highestWinsTab.style.fill = 0x888888;

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

	this.clearHistoryItems();

	this.lastWinsPage = 1;
	this.lastWinsHasMore = true;
	this.lastWinsLoading = false;
	this.currentPage = 1;
	this.hasMore = true;
	this.isLoadingMore = false;

	this.historyRounds = null;
	this.loadHistoryFromApi(1, 20, false);

	if ((typeof isMobileDevice === 'undefined' || !isMobileDevice()) && !this.isInfiniteScrollEnabled) {
		if (typeof this.setupInfiniteScroll === 'function') {
			this.setupInfiniteScroll();
		}
	}
};

historyView.switchToHighestWins = function () {

	var tabWidth = (this.panelWidth - 20) / 2;
	var newX = 10 + tabWidth;
	this.activeTabBg.x = newX;
	this.lastWinsTab.style.fill = 0x888888;
	this.highestWinsTab.style.fill = 0xffffff;

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

	this.clearHistoryItems();

	this.hideNoDataMessage();

	this.highestWinsPage = 1;
	this.highestWinsHasMore = true;
	this.highestWinsLoading = false;
	this.currentPage = 1;
	this.hasMore = true;
	this.isLoadingMore = false;

	this.highestWinsData = [];

	this.loadHighestWinsHistory();

	if ((typeof isMobileDevice === 'undefined' || !isMobileDevice()) && !this.isInfiniteScrollEnabled) {
		if (typeof this.setupInfiniteScroll === 'function') {
			this.setupInfiniteScroll();
		}
	}
};

historyView.createHistoryList = function () {

	this.headerContainer = pixiLib.getContainer();
	this.headerContainer.x = 10;
	this.headerContainer.y = 130;
	this.panelBg.addChild(this.headerContainer);

	this.historyListContainer = pixiLib.getContainer();
	this.historyListContainer.x = 10;
	this.historyListContainer.y = 160;
	this.panelBg.addChild(this.historyListContainer);

	this.historyListContainer.interactive = true;
	this.historyListContainer.buttonMode = false;

	this.isDraggingScroll = false;
	this.lastDragY = 0;
	this.dragStartY = 0;
	this.scrollVelocity = 0;
	this.lastScrollTime = 0;

	this.createTableHeaders();

	this.maskHeight = this.panelHeight - 210;
	this.listMask = pixiLib.getRectangleSprite(this.panelWidth - 40, this.maskHeight, 0x000000);
	this.listMask.x = 10;
	this.listMask.y = 160;
	this.panelBg.addChild(this.listMask);
	this.historyListContainer.mask = this.listMask;

	this.scrollbar = pixiLib.getRectangleSprite(8, this.maskHeight, 0x333333);
	this.scrollbar.x = this.panelWidth - 25;
	this.scrollbar.y = 160;
	this.scrollbar.visible = false;
	this.scrollbar.interactive = true;
	this.scrollbar.buttonMode = true;
	this.panelBg.addChild(this.scrollbar);

	this.scrollThumb = pixiLib.getRectangleSprite(8, 50, 0x888888);
	this.scrollThumb.x = this.panelWidth - 25;
	this.scrollThumb.y = 160;
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

historyView.createTableHeaders = function () {

	var headerBg = pixiLib.getRectangleSprite(this.panelWidth - 20, 30, 0x333333);
	this.headerContainer.addChild(headerBg);

	var headerStyle = {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 12,
		fill: 0xffffff
	};

	var columns = [
		{ text: "Time", x: 20, width: 140 },
		{ text: "Bet ID", x: 180, width: 130 },
		{ text: "WinX", x: 330, width: 100 },
		{ text: "Bet", x: 450, width: 100 },
		{ text: "Win", x: 570, width: 130 },
		{ text: "Link", x: 720, width: 90 },
		{ text: "Watch", x: 830, width: 90 }
	];

	this.columnHeaders = [];
	this.columnInfo = columns;

	columns.forEach(function (column) {
		var headerText = pixiLib.getElement("Text", headerStyle);

		pixiLib.setText(headerText, column.text.toUpperCase());

		headerText.x = column.x + (column.width / 2);
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

function isHighestWinsTabActive(view) {
	if (!view || !view.highestWinsTab) return false;
	var fill = view.highestWinsTab.style.fill;
	return fill === 0xffffff || 
		   fill === '#ffffff' || 
		   fill === '0xffffff' ||
		   String(fill).toLowerCase() === '#ffffff' ||
		   String(fill).toLowerCase() === '0xffffff' ||
		   fill === 16777215;
}

historyView.addHistoryItem = function (roundData) {

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

	const rowHeight = 40;

	const existingRows = this.historyItems.length;

	const yPos = 25 + (existingRows * rowHeight);

	const itemBg = pixiLib.getRectangleSprite(this.panelWidth - 20, rowHeight,
		this.historyItems.length % 2 === 0 ? 0x2a2a2a : 0x333333);
	itemBg.x = 0;
	itemBg.y = yPos;
	itemBg.interactive = false;
	itemBg.buttonMode = false;
	this.historyListContainer.addChild(itemBg);

	const cellStyle = {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 11,
		fill: 0xffffff
	};

	const urlParams = new URLSearchParams(window.location.search);
	const isHistoryMode = urlParams.has('round_id');

	const currencyCode = (roundData.currency || '').toLowerCase();
	
	const currencySymbolMap = {
		'try': '₺', 'usd': '$', 'eur': '€', 'gbp': '£', 'inr': '₹', 'idr': 'Rp', 'thb': '฿', 'vnd': '₫', 'brl': 'R$', 'php': '₱', 'myr': 'RM', 'krw': '₩', 'jpy': '¥', 'cny': '¥', 'aud': 'A$', 'cad': 'C$', 'rub': '₽', 'pln': 'zł', 'ron': 'lei'
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

	const cells = [
		{ text: timeStr, x: 20, width: 140 },
		{ text: betId, x: 180, width: 130 },
		{ text: multiplierText, x: 330, width: 100 },
		{ text: wager, x: 450, width: 100 },
		{ text: winAmount, x: 570, width: 130 }
	];

	let multiplierTextElement = null;
	
	cells.forEach(function (cell) {
		const cellText = pixiLib.getElement("Text", cellStyle);
		pixiLib.setText(cellText, cell.text);

		cellText.x = cell.x + (cell.width / 2);
		cellText.y = yPos + 20;
		cellText.anchor.set(0.5, 0.5);

		if (cell.text === multiplierText) {
			cellText.style.fill = 0xf58742;
			cellText.style.fontSize = 14;
			multiplierTextElement = cellText;
		}

		if (cell.text === betId) {
			cellText.interactive = true;
			cellText.buttonMode = true;
			cellText.cursor = 'pointer';

			cellText.fullId = roundData.id;

			let tooltip = null;

			cellText.on('mouseover', function(e) {

				if (tooltip) {
					this.historyListContainer.removeChild(tooltip);
					tooltip = null;
				}

				const tooltipContainer = new PIXI.Container();

				tooltip = pixiLib.getElement("Text", {
					fontFamily: "Montserrat-regular, sans-serif",
					fontSize: 10,
					fill: 0xffffff
				});
				pixiLib.setText(tooltip, cellText.fullId);
				tooltip.anchor.set(0.5, 0.5);

				const tooltipBg = new PIXI.Graphics();
				tooltipBg.beginFill(0x000000, 0.8);
				const padding = 8;
				const tooltipWidth = tooltip.width + padding * 2;
				const tooltipHeight = tooltip.height + padding * 2;
				tooltipBg.drawRoundedRect(-tooltipWidth / 2, -tooltipHeight / 2, tooltipWidth, tooltipHeight, 4);
				tooltipBg.endFill();
				
				tooltipContainer.addChild(tooltipBg);
				tooltipContainer.addChild(tooltip);
				tooltipContainer.x = cellText.x;
				tooltipContainer.y = cellText.y - 25;
				
				this.historyListContainer.addChild(tooltipContainer);
				tooltip = tooltipContainer;
			}.bind(this));

			cellText.on('mouseout', function() {
				if (tooltip) {
					this.historyListContainer.removeChild(tooltip);
					tooltip = null;
				}
			}.bind(this));

			cellText.on('click', async function(e) {
				e.stopPropagation();
				try {
					await navigator.clipboard.writeText(cellText.fullId);

					const feedbackContainer = new PIXI.Container();
					
					const lang = (sessionStorage.getItem("Language") || sessionStorage.Language || 'en').toLowerCase();
					const feedbackText = gameLiterals.replaycopied;

					const feedback = pixiLib.getElement("Text", {
						fontFamily: "Montserrat-regular, sans-serif",
						fontSize: 10,
						fill: 0xffffff
					});
					pixiLib.setText(feedback, feedbackText);
					feedback.anchor.set(0.5, 0.5);

					const feedbackBg = new PIXI.Graphics();
					const padding = 8;
					const buttonWidth = feedback.width + padding * 2;
					const buttonHeight = feedback.height + padding * 2;
					feedbackBg.beginFill(0xf59342);
					feedbackBg.drawRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 4);
					feedbackBg.endFill();
					
					feedbackContainer.addChild(feedbackBg);
					feedbackContainer.addChild(feedback);
					feedbackContainer.x = cellText.x;
					feedbackContainer.y = cellText.y;
					
					this.historyListContainer.addChild(feedbackContainer);
					
					setTimeout(function() {
						if (feedbackContainer.parent) {
							this.historyListContainer.removeChild(feedbackContainer);
						}
					}.bind(this), 1000);
				} catch (err) {
				}
			}.bind(this));
		}

		this.historyListContainer.addChild(cellText);
	}.bind(this));

	if (multiplierTextElement) {
		const coinRadius = 8;
		const spacing = 16;

		const multiplierTextX = multiplierTextElement.x;

		const multiplierTextWidth = multiplierText.length * 8;

		const totalWidth = coinRadius * 2 + spacing + multiplierTextWidth;

		const goldCoin = new PIXI.Graphics();
		goldCoin.beginFill(0xf58742);
		goldCoin.drawCircle(0, 0, coinRadius);
		goldCoin.endFill();

		goldCoin.x = multiplierTextX - (totalWidth / 2) + coinRadius;
		goldCoin.y = yPos + 20;
		this.historyListContainer.addChild(goldCoin);
	}

	const linkBtnWidth = 70;
	const linkBtnHeight = 25;
	const linkBtnRadius = linkBtnHeight / 2;
	const linkColumnCenterX = 720 + (90 / 2);
	
	const linkBtnGraphics = new PIXI.Graphics();
	linkBtnGraphics.beginFill(0x4a4a4a);
	linkBtnGraphics.drawRoundedRect(0, 0, linkBtnWidth, linkBtnHeight, linkBtnRadius);
	linkBtnGraphics.endFill();
	const linkBtn = new PIXI.Container();
	linkBtn.addChild(linkBtnGraphics);

	linkBtn.x = linkColumnCenterX - (linkBtnWidth / 2);
	linkBtn.y = yPos + 7.5;
	linkBtn.interactive = true;
	linkBtn.buttonMode = true;

	linkBtn._buttonWidth = linkBtnWidth;
	linkBtn._buttonHeight = linkBtnHeight;
	linkBtn._borderRadius = linkBtnRadius;
	linkBtn._buttonGraphics = linkBtnGraphics;
	this.historyListContainer.addChild(linkBtn);

	const lang = (sessionStorage.getItem("Language") || sessionStorage.Language || 'en').toLowerCase();
	const linkText = pixiLib.getElement("Text", { 
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 11,
		fill: 0xffffff,
		letterSpacing: 0.5
	});
	pixiLib.setText(linkText, gameLiterals.replayGENERATE);
	linkText.x = linkColumnCenterX;
	linkText.y = yPos + 20;
	linkText.anchor.set(0.5);
	this.historyListContainer.addChild(linkText);

	pixiLib.addEvent(linkBtn, function () {
		try { _sndLib.play(_sndLib.sprite.btnClick); } catch (e) { }
		this.generateAndCopyLink(roundData, linkText, linkBtn);
	}.bind(this));

	const watchBtnSize = 30;
	const watchBtnRadius = watchBtnSize / 2;
	const watchColumnCenterX = 830 + (90 / 2);
	
	const watchBtnGraphics = new PIXI.Graphics();
	watchBtnGraphics.beginFill(0xf59342);

	watchBtnGraphics.drawCircle(watchBtnRadius, watchBtnRadius, watchBtnRadius);
	watchBtnGraphics.name= "watchBtnGraphics";
	watchBtnGraphics.endFill();
	const watchBtn = new PIXI.Container();
	watchBtn.addChild(watchBtnGraphics);

	const playIcon = pixiLib.getElement("Text", { 
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 24,
		fill: 0xffffff
	});
	pixiLib.setText(playIcon, "▶");

	playIcon.x = watchBtnGraphics.width/2;
	playIcon.y = 12;
	playIcon.anchor.set(0.5);
	watchBtn.addChild(playIcon);

	watchBtn.x = watchColumnCenterX - watchBtnRadius;
	watchBtn.y = yPos + 20 - watchBtnRadius;
	watchBtn.interactive = true;
	watchBtn.buttonMode = true;
	this.historyListContainer.addChild(watchBtn);

	pixiLib.addEvent(watchBtn, function () {

		this.createReplayUrl(roundData);
	}.bind(this));

	this.historyItems.push({
		bg: itemBg,
		data: roundData
	});

	if (this.historyListContainer) {

		itemBg.visible = true;
		itemBg.renderable = true;

		this.historyListContainer.updateTransform();
	}

	this.updateScrollbarVisibility();
};

historyView.replayRound = function (roundData) {
	_sndLib.play(_sndLib.sprite.btnClick);

	if (coreApp && coreApp.gameModel) {
		coreApp.gameModel.isReplaying = true;
		coreApp.gameModel.isError = false;
	} else if (_ng && _ng.gameModel) {
		_ng.gameModel.isReplaying = true;
		_ng.gameModel.isError = false;
	}

	this.mockResponseData = roundData;

	let isFreeSpin = false;

	if (roundData.is_ante_bet) {
		isFreeSpin = false;
	} else if (roundData.is_buy_feature) {
		isFreeSpin = true;
	} else if (roundData.is_buy_super_feature) {
		isFreeSpin = true;
	} else if (roundData.is_bonus) {
		isFreeSpin = true;
	} else {
		isFreeSpin = false;
	}

	var jsonString = JSON.stringify(this.mockResponseData);
	coreApp.gameModel.saveSpinData(jsonString);

	setTimeout(function () {

		if (coreApp && coreApp.gameView && coreApp.gameView.reelView && coreApp.gameView.reelView.updateAllReelStrips) {
			coreApp.gameView.reelView.updateAllReelStrips();
		}

		_mediator.publish("setSpaceBarEvent", "idle");
		_mediator.publish("spinStart", isFreeSpin);

		setTimeout(function () {

			_mediator.publish("onSpinResponse");
		}.bind(this), 300);
	}.bind(this), 250);
};

historyView.onCloseHandler = function (argument) {
	_sndLib.play(_sndLib.sprite.btnClick);
	window.externalUi.call("game_ui", "show");

	if (coreApp && coreApp.gameModel) {
		coreApp.gameModel.isReplaying = false;
	} else if (_ng && _ng.gameModel) {
		_ng.gameModel.isReplaying = false;
	}

	window.mockResponseData = null;

	try {
		window.__mockRounds = null;
	} catch (e) {}

	this.historyRounds = null;

	this.clearHistoryItems();

	this.hideNoDataMessage();

	if (this.loadMoreButton) {
		try {
			if (this.loadMoreButton.parent) {
				this.loadMoreButton.parent.removeChild(this.loadMoreButton);
			}
		} catch (e) {}
		this.loadMoreButton = null;
	}

	this.currentPage = 1;
	this.hasMore = true;
	this.isLoadingMore = false;
	this.lastWinsPage = 1;
	this.lastWinsHasMore = true;
	this.lastWinsLoading = false;
	this.highestWinsPage = 1;
	this.highestWinsHasMore = true;
	this.highestWinsLoading = false;

	if (this.highestWinsData) {
		this.highestWinsData = [];
	}

	this.resumeReelAnimations();

	try {

		if (_mediator) {
			_mediator.publish("SpinButtonStatus", true);
		}

		if (coreApp && coreApp.panelView && coreApp.panelView.autoSpinButton) {
			pixiLib.setInteraction(coreApp.panelView.autoSpinButton, true);
		}
	} catch (e) {
	}

	if (_mediator) {
		_mediator.publish("enableBuyFeature");
	}

	if (coreApp && coreApp.gameView && coreApp.gameView.enableBuyFeature) {
		coreApp.gameView.enableBuyFeature();
	}

	this.hide();
	_mediator.publish("onHideHistoryPanel");
};

historyView.createAllEvents = function (argument) {

	_mediator.subscribe(_events.core.onResize, this.onResize.bind(this));

	_mediator.subscribe("onReplayCompleted", this.onReplayCompleted.bind(this));

	_mediator.subscribe("onTotalWinShown", this.onTotalWinShown.bind(this));
};

historyView.onResize = function (argument) {

	if (this.visible) {

		var wasVisible = this.visible;
		var currentTab = this.currentTab || "lastWins";

		try {
			this.clearHistoryItems();
		} catch (e) {

		}

		try {

			if (this.closeButton && this.closeButton.parent) {
				this.closeButton.parent.removeChild(this.closeButton);
			}

			if (this.tabsContainer && this.tabsContainer.parent) {
				this.tabsContainer.parent.removeChild(this.tabsContainer);
			}

			if (this.headerContainer && this.headerContainer.parent) {
				this.headerContainer.parent.removeChild(this.headerContainer);
			}

			if (this.historyListContainer && this.historyListContainer.parent) {
				this.historyListContainer.parent.removeChild(this.historyListContainer);
			}
		} catch (e) {

		}

		try {
			this.createPanelBackground();
			this.createCloseButton();
			this.createTabs();
			this.createHistoryList();

			if (currentTab === "highestWins") {
				this.switchToHighestWins();
			} else {
				this.switchToLastWins();
			}

			if (wasVisible) {
				this.visible = true;

				this.currentPage = 1;
				this.hasMore = true;
				this.isLoadingMore = false;
				this.loadHistoryFromApi(1, 20, false);
			}
		} catch (e) {

		}
	}
};

historyView.show = function (argument) {

	try {
		_sndLib.play(_sndLib.sprite.btnClick);
	} catch (e) {
	}

	let lang = sessionStorage.getItem("Language");

	if (!lang) {
		lang = "en";
	}

	try {

		this.updateLanguageTexts(lang);
	} catch (e) {
	}

	this.currentPage = 1;
	this.hasMore = true;
	this.isLoadingMore = false;
	this.lastWinsPage = 1;
	this.lastWinsHasMore = true;
	this.lastWinsLoading = false;
	this.highestWinsPage = 1;
	this.highestWinsHasMore = true;
	this.highestWinsLoading = false;

	if (this.highestWinsData) {
		this.highestWinsData = [];
	}

	this.clearHistoryItems();
	this.historyRounds = null;

	this.visible = true;
	window.externalUi.call("game_ui", "hide");

	if (this.parent) {
		try {
			this.parent.setChildIndex(this, this.parent.children.length - 1);
		} catch (e) {
		}
	}

	if (this.overlay) {
		this.overlay.interactive = true;
		this.overlay.buttonMode = false;

		const gameWidth = _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].width;
		const gameHeight = _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].height;
		const actualWindowWidth = window.innerWidth || gameWidth;
		const actualWindowHeight = window.innerHeight || gameHeight;

		const overlayWidth = Math.max(actualWindowWidth, gameWidth) * 1.5;
		const overlayHeight = Math.max(actualWindowHeight, gameHeight) * 1.5;

		this.overlay.width = overlayWidth;
		this.overlay.height = overlayHeight;
		this.overlay.position.set(0, 0);
		this.overlay.hitArea = new PIXI.Rectangle(0, 0, overlayWidth, overlayHeight);

		if (pixiLib.removeAllEvents) {
			pixiLib.removeAllEvents(this.overlay);
		}
		pixiLib.addEvent(this.overlay, function (e) {

			if (e && e.stopPropagation) {
				e.stopPropagation();
			}
		});

	}

	try {

		this.pauseReelAnimations();
	} catch (e) {
	}

	try {

		setTimeout(() => {

			this.loadHistoryFromApi(1, 20, false);
		}, 50);
	} catch (e) {

	}

	try {
		if (_mediator) {
			_mediator.publish("disableBuyFeature");
		}

		if (coreApp && coreApp.gameView && coreApp.gameView.disableBuyFeature) {
			coreApp.gameView.disableBuyFeature();
		}
	} catch (e) {

	}

};

historyView.loadHistoryFromApi = function (page, limit, append) {
	try {

		var isHighestWinsTab = isHighestWinsTabActive(this);
		var isLoading = isHighestWinsTab ? this.highestWinsLoading : this.lastWinsLoading;
		if (isLoading) {

			return;
		}

		if (isHighestWinsTab) {
			this.highestWinsLoading = true;
		} else {
			this.lastWinsLoading = true;
		}
		this.isLoadingMore = true;
		if (this.loadMoreButton) {
			this.updateLoadMoreButton(true);
		}

		var base = (typeof commonConfig !== "undefined" && commonConfig["serverIP"]) ? commonConfig["serverIP"] : "";
		var userId = sessionStorage.getItem("rgsUserID") || sessionStorage.rgsUserID || "";
		var gameName = (_ng && _ng.GameConfig && _ng.GameConfig.gameName) ? _ng.GameConfig.gameName : "";

		if (!base) {
			this.isLoadingMore = false;
			this.historyRounds = null;
			this.clearHistoryItems();
			this.updateLoadMoreButton();
			return;
		}

		if (!userId || !gameName) {
			this.isLoadingMore = false;
			this.historyRounds = null;
			this.clearHistoryItems();
			this.updateLoadMoreButton();
			return;
		}

		var cleanedBase = base.endsWith("/") ? base.slice(0, -1) : base;

		var isHighestWinsTab = isHighestWinsTabActive(this);
		var highestWinsTabFill = this.highestWinsTab ? this.highestWinsTab.style.fill : null;

		var sortParam = "";
		if (isHighestWinsTab) {

		} else {

		}
		var url = cleanedBase + "/history/free-spins?user_id=" + encodeURIComponent(userId) + "&game=" + encodeURIComponent(gameName) + "&limit=" + encodeURIComponent(limit || 20) + "&page=" + encodeURIComponent(page || 1) + sortParam;

		fetch(url, { method: "GET" })
			.then(function (res) { return res.json(); })
			.then(function (data) {

				var isHighestWinsTab = isHighestWinsTabActive(this);

				var actualData = data;
				if (data && !Array.isArray(data)) {
					if (data.data && Array.isArray(data.data)) {
						actualData = data.data;

					} else if (data.records && Array.isArray(data.records)) {
						actualData = data.records;

					} else if (data.data && data.data.records && Array.isArray(data.data.records)) {
						actualData = data.data.records;

					} else {

					}
				}

				if (Array.isArray(actualData) && actualData.length > 0) {
					actualData = actualData.map(function(item) {
						if (item && typeof item === 'object') {

							if (item.balance !== undefined && item.balance !== null && (item.win_amount === undefined || item.win_amount === null)) {
								item.win_amount = item.balance;

							}

							if (!item.id && item.bet_id) {
								item.id = item.bet_id;
							}
						}
						return item;
					});

				}

				data = actualData;

				if (!isHighestWinsTab) {
					this.lastWinsLoading = false;
					this.isLoadingMore = false;

					this.hideLoader();
				}

				var firstFewWinAmounts = [];
				if (Array.isArray(data) && data.length > 0) {
					firstFewWinAmounts = data.slice(0, 5).map(function(item) {
						var winAmount = item.win_amount || (item.current_round && item.current_round.win_amount) || item.balanc || 0;
						return {
							id: item.id ? item.id.substring(0, 8) + '...' : 'N/A',
							win_amount: winAmount,
							hasId: !!item.id,
							hasWinAmount: !!item.win_amount,
							hasCurrentRound: !!item.current_round,
							hasBalanc: !!item.balanc,
							allKeys: Object.keys(item)
						};
					});
				}

				var isNullOrEmpty = data === null || data === undefined || !Array.isArray(data) || data.length === 0;
				
				if (isNullOrEmpty) {

					var isHighestWinsTab = isHighestWinsTabActive(this);

					this.hideLoader();

					if (append) {

						if (isHighestWinsTab) {

							this.highestWinsLoading = false;
							this.isLoadingMore = false;

							if (!this.highestWinsHasMore) {
								this.highestWinsHasMore = true;
							}
							this.hasMore = true;
						} else {

							this.lastWinsHasMore = false;
							this.lastWinsLoading = false;
							this.hasMore = false;
						}
						this.updateLoadMoreButton(false);
						this.checkLoadMoreVisibility();
						return;
					} else {

						this.historyRounds = null;
						this.clearHistoryItems();

						if (isHighestWinsTab) {
							this.highestWinsHasMore = false;
							this.highestWinsLoading = false;
							this.showNoDataMessage();
						} else {
							this.lastWinsHasMore = false;
							this.lastWinsLoading = false;
							this.showNoDataMessage();
						}
						this.hasMore = false;
						this.isLoadingMore = false;
						this.updateLoadMoreButton(false);
						return;
					}
				}
				
				if (Array.isArray(data)) {

					const requestLimit = limit || 20;
					const rawApiResponseLength = data.length;

					var isHighestWinsTab = isHighestWinsTabActive(this);
					if (isHighestWinsTab) {
						this.highestWinsPage = page || 1;
						this.currentPage = this.highestWinsPage;
					} else {
						this.lastWinsPage = page || 1;
						this.currentPage = this.lastWinsPage;
					}

					var previousHasMore = this.hasMore;

					var isHighestWinsTab = isHighestWinsTabActive(this);
					
					if (isHighestWinsTab) {

						if (append) {

							this.highestWinsHasMore = true;

						} else {

							this.highestWinsHasMore = rawApiResponseLength > 0;
						}
					} else {

						var shouldHaveMore = rawApiResponseLength > 0;
						this.lastWinsHasMore = shouldHaveMore;
					}

					if (isHighestWinsTab) {
						this.hasMore = this.highestWinsHasMore;
					} else {
						this.hasMore = this.lastWinsHasMore;
					}
					
					if (isHighestWinsTab) {
						if (this.highestWinsHasMore) {

						} else {

						}
					} else {
						if (this.lastWinsHasMore) {

						} else {

						}
					}

					if (previousHasMore !== this.hasMore) {

					}

					try {
						if (data.length && data[0].currency) {
							sessionStorage.setItem("adaptor_currency", String(data[0].currency).toLowerCase());
						}
					} catch (e) { /* no-op */ }
					
					if (append) {

						if (!this.historyRounds) {
							this.historyRounds = [];
						}

						var existingIds = {};
						this.historyItems.forEach(function(item) {
							if (item.data && item.data.id) {
								existingIds[item.data.id] = true;
							}
						});

						var historyRoundsIds = {};
						this.historyRounds.forEach(function(item) {
							if (item && item.id) {
								historyRoundsIds[item.id] = true;
							}
						});

						var trulyNewItems = data.filter(function(item) {
							return item && item.id && !existingIds[item.id] && !historyRoundsIds[item.id];
						});

						if (trulyNewItems.length === 0) {

						}

						var highestWinsTabFill = this.highestWinsTab ? this.highestWinsTab.style.fill : null;
						var isHighestWinsTab = this.highestWinsTab && (
							highestWinsTabFill === 0xffffff || 
							highestWinsTabFill === '#ffffff' || 
							highestWinsTabFill === '0xffffff' ||
							String(highestWinsTabFill).toLowerCase() === '#ffffff' ||
							String(highestWinsTabFill).toLowerCase() === '0xffffff' ||
							highestWinsTabFill === 16777215
						);

						if (isHighestWinsTab) {

							if (!this.loaderSpinner || !this.loaderSpinner.visible) {
								this.showLoader();
							}

							var existingIds = {};
							this.highestWinsData.forEach(function(item) {
								if (item && item.id) {
									existingIds[item.id] = true;
								}
							});
							
							var newItemsToMerge = trulyNewItems.filter(function(item) {
								return item && item.id && !existingIds[item.id];
							});
							
							this.highestWinsData = this.highestWinsData.concat(newItemsToMerge);

							this.highestWinsData.sort(function(a, b) {

								var winA = (a.win_amount !== undefined && a.win_amount !== null) ? a.win_amount : 
										   ((a.current_round && a.current_round.win_amount !== undefined && a.current_round.win_amount !== null) ? a.current_round.win_amount : 0);
								var winB = (b.win_amount !== undefined && b.win_amount !== null) ? b.win_amount : 
										   ((b.current_round && b.current_round.win_amount !== undefined && b.current_round.win_amount !== null) ? b.current_round.win_amount : 0);
								var result = winB - winA;
								return result;
							});

							if (this.highestWinsData.length >= 2) {
								var firstWin = this.highestWinsData[0].win_amount || (this.highestWinsData[0].current_round && this.highestWinsData[0].current_round.win_amount) || 0;
								var secondWin = this.highestWinsData[1].win_amount || (this.highestWinsData[1].current_round && this.highestWinsData[1].current_round.win_amount) || 0;
								if (firstWin >= secondWin) {

								} else {

								}
							}

							this.historyRounds = this.highestWinsData.slice();
							try { window.__mockRounds = this.historyRounds.slice(); } catch (e) { }

							var currentScrollPosition = this.scrollPosition;
							this.clearHistoryItems();

							this.highestWinsData.forEach(function (item) {
								this.addHistoryItem(item);
							}.bind(this));

							this.scrollPosition = currentScrollPosition;
							this.updateScrollbarVisibility();

							this.highestWinsLoading = false;
							this.isLoadingMore = false;
							this.hideLoader();

							if (this.historyItems.length > 0) {
								this.hideNoDataMessage();
							}

						} else {
							this.historyRounds = this.historyRounds.concat(trulyNewItems);
							try { window.__mockRounds = this.historyRounds.slice(); } catch (e) { }

							var addedCount = 0;
							var failedCount = 0;
							trulyNewItems.forEach(function (item, index) {
								try {
									if (!item || !item.id) {

										failedCount++;
										return;
									}

									var beforeCount = this.historyItems.length;
									this.addHistoryItem(item);
									var afterCount = this.historyItems.length;
									if (afterCount > beforeCount) {
										addedCount++;

									} else {

										failedCount++;
									}
								} catch (e) {

									failedCount++;
								}
							}.bind(this));

							if (addedCount > 0) {
								this.hideNoDataMessage();
							}

							if (addedCount > 0) {

								this.updateScrollbarVisibility();

								if (this.historyListContainer) {

									this.historyListContainer.y = 160 - Math.max(0, this.scrollPosition);

									this.historyListContainer.updateTransform();

									var itemCountInContainer = 0;
									for (var i = 0; i < this.historyListContainer.children.length; i++) {
										var child = this.historyListContainer.children[i];
										if (child.name && child.name.includes('itemBg')) {
											itemCountInContainer++;
										}
									}

								}
							}
						}

						this.updateScrollbarVisibility();

						if (!this.loadMoreButton) {
							this.createLoadMoreButton();
						}

						this.updateLoadMoreButton(false);
						this.checkLoadMoreVisibility();
					} else {

						var uniqueData = [];
						var seenIds = {};
						data.forEach(function(item) {
							if (item && item.id && !seenIds[item.id]) {
								seenIds[item.id] = true;
								uniqueData.push(item);
							}
						});

						var highestWinsTabFill = this.highestWinsTab ? this.highestWinsTab.style.fill : null;
						var isHighestWinsTab = this.highestWinsTab && (
							highestWinsTabFill === 0xffffff || 
							highestWinsTabFill === '#ffffff' || 
							highestWinsTabFill === '0xffffff' ||
							String(highestWinsTabFill).toLowerCase() === '#ffffff' ||
							String(highestWinsTabFill).toLowerCase() === '0xffffff' ||
							highestWinsTabFill === 16777215
						);

						if (isHighestWinsTab) {

							if (!this.loaderSpinner || !this.loaderSpinner.visible) {
								this.showLoader();
							}

							if (page === 1) {
								this.highestWinsData = [];

							}

							var existingIds = {};
							this.highestWinsData.forEach(function(item) {
								if (item && item.id) {
									existingIds[item.id] = true;
								}
							});
							
							var newItems = uniqueData.filter(function(item) {
								return item && item.id && !existingIds[item.id];
							});
							
							this.highestWinsData = this.highestWinsData.concat(newItems);

							this.highestWinsData.sort(function(a, b) {

								var winA = (a.win_amount !== undefined && a.win_amount !== null) ? a.win_amount : 
										   ((a.current_round && a.current_round.win_amount !== undefined && a.current_round.win_amount !== null) ? a.current_round.win_amount : 0);
								var winB = (b.win_amount !== undefined && b.win_amount !== null) ? b.win_amount : 
										   ((b.current_round && b.current_round.win_amount !== undefined && b.current_round.win_amount !== null) ? b.current_round.win_amount : 0);
								var result = winB - winA;
								return result;
							});

							if (this.highestWinsData.length >= 2) {
								var firstWin = this.highestWinsData[0].win_amount || (this.highestWinsData[0].current_round && this.highestWinsData[0].current_round.win_amount) || 0;
								var secondWin = this.highestWinsData[1].win_amount || (this.highestWinsData[1].current_round && this.highestWinsData[1].current_round.win_amount) || 0;
								if (firstWin >= secondWin) {

								} else {

								}
							}

							uniqueData = this.highestWinsData.slice();
						}

						this.historyRounds = isHighestWinsTab ? this.highestWinsData.slice() : uniqueData;

						try { window.__mockRounds = this.historyRounds.slice(); } catch (e) { }

						this.clearHistoryItems();

						var itemsToShow = uniqueData;

						if (isHighestWinsTab && itemsToShow.length > 1) {
							var firstWin = (itemsToShow[0].win_amount !== undefined && itemsToShow[0].win_amount !== null) ? itemsToShow[0].win_amount : 
										   ((itemsToShow[0].current_round && itemsToShow[0].current_round.win_amount !== undefined && itemsToShow[0].current_round.win_amount !== null) ? itemsToShow[0].current_round.win_amount : 0);
							var secondWin = (itemsToShow[1].win_amount !== undefined && itemsToShow[1].win_amount !== null) ? itemsToShow[1].win_amount : 
											((itemsToShow[1].current_round && itemsToShow[1].current_round.win_amount !== undefined && itemsToShow[1].current_round.win_amount !== null) ? itemsToShow[1].current_round.win_amount : 0);
							if (firstWin < secondWin) {

								itemsToShow.sort(function(a, b) {
									var winA = (a.win_amount !== undefined && a.win_amount !== null) ? a.win_amount : 
											   ((a.current_round && a.current_round.win_amount !== undefined && a.current_round.win_amount !== null) ? a.current_round.win_amount : 0);
									var winB = (b.win_amount !== undefined && b.win_amount !== null) ? b.win_amount : 
											   ((b.current_round && b.current_round.win_amount !== undefined && b.current_round.win_amount !== null) ? b.current_round.win_amount : 0);
									return winB - winA;
								});

							} else {

							}
						}

						if (isHighestWinsTab) {
						} else {

						}

						itemsToShow.forEach(function (item, index) {
							try {

								if (isHighestWinsTab) {
									var winAmount = item.win_amount || (item.current_round && item.current_round.win_amount) || item.balanc || 0;

								} else {

								}

								if (!item || !item.id) {

									return;
								}
								
								this.addHistoryItem(item);
							} catch (e) {

							}
						}.bind(this));

						if (itemsToShow.length > 0) {
							this.hideNoDataMessage();
						}
						
						if (isHighestWinsTab) {
							this.highestWinsLoading = false;
							this.isLoadingMore = false;
							this.hideLoader();

							this.hideNoDataMessage();

						} else {

						}

						this.updateScrollbarVisibility();

						if (!this.loadMoreButton) {
							this.createLoadMoreButton();
						}

						this.updateLoadMoreButton(false);
					}
				} else {

					this.hasMore = false;
					this.historyRounds = null;
					this.clearHistoryItems();
					this.updateLoadMoreButton(false);
				}
			}.bind(this))
			.catch(function (err) {

				var isHighestWinsTab = isHighestWinsTabActive(this);
				if (isHighestWinsTab) {
					this.highestWinsLoading = false;
				} else {
					this.lastWinsLoading = false;
				}
				this.isLoadingMore = false;

				this.hideLoader();
				
				this.hasMore = false;
				this.historyRounds = null;
				this.clearHistoryItems();
				this.updateLoadMoreButton();
			}.bind(this));
	} catch (e) {
		this.isLoadingMore = false;
		this.hasMore = false;
		this.historyRounds = null;
		this.clearHistoryItems();
		this.updateLoadMoreButton();
	}
};

historyView.loadMockHistory = function () {

	if (!this.historyRounds) {
		return;
	}

	if (!Array.isArray(this.historyRounds) || this.historyRounds.length === 0) {
		return;
	}
	const sourceRounds = this.historyRounds;

	var existingIds = {};
	this.historyItems.forEach(function(item) {
		if (item.data && item.data.id) {
			existingIds[item.data.id] = true;
		}
	});

	const filteredRounds = sourceRounds.filter(function (item) {

		if (existingIds[item.id]) {
			return false;
		}

		if (item.is_ante_bet) {
			return true;
		}

		if (item.is_buy_feature) {
			return true;
		}
		if (item.is_buy_super_feature) {
			return true;
		}
		if (item.is_bonus) {
			return true;
		}

		return false;
	});

	var addedIds = {};
	filteredRounds.forEach(function (item) {

		if (addedIds[item.id]) {
			return;
		}
		addedIds[item.id] = true;
		this.addHistoryItem(item);
	}.bind(this));

	this.updateScrollbarVisibility();

	if (!this.hasMore && this.loadMoreButton) {
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

	if (!this.loadMoreButton) {
		this.createLoadMoreButton();
	}

	this.updateLoadMoreButton();
}

historyView.clearHistoryItems = function () {

	if (this.historyListContainer) {

		const childrenToRemove = this.historyListContainer.children.slice();
		childrenToRemove.forEach(function (child) {
			try {
				if (child.parent === this.historyListContainer) {
					this.historyListContainer.removeChild(child);

					if (child.destroy && typeof child.destroy === 'function') {
						child.destroy();
					}
				}
			} catch (e) {

			}
		}.bind(this));

		while (this.historyListContainer.children.length > 0) {
			try {
				const child = this.historyListContainer.children[0];
				this.historyListContainer.removeChild(child);
				if (child.destroy && typeof child.destroy === 'function') {
					child.destroy();
				}
			} catch (e) {

				break;
			}
		}

		if (this.loadMoreButton) {
			this.loadMoreButton = null;
		}
	}

	this.historyItems.forEach(function (item) {
		try {
			if (item.bg && item.bg.parent) {
				item.bg.parent.removeChild(item.bg);
			}

			if (item.destroy && typeof item.destroy === 'function') {
				item.destroy();
			}
		} catch (e) {

		}
	});
	this.historyItems = [];

	if (this.scrollbar) {
		this.scrollbar.visible = false;
	}
	if (this.scrollThumb) {
		this.scrollThumb.visible = false;
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

	this.scrollPosition = 0;
	this.maxScroll = 0;
	if (this.historyListContainer) {
		this.historyListContainer.y = 160;
	}

	this.currentPage = 1;
	this.hasMore = true;
	this.isLoadingMore = false;

};

historyView.updateScrollbarVisibility = function () {

	var buttonHeight = (this.loadMoreButton && this.hasMore) ? 60 : 0;

	var totalContentHeight = 25 + (this.historyItems.length * 40) + buttonHeight;
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

historyView.updateThumbPosition = function () {
	if (!this.scrollThumb) return;

	var visibleHeight = this.maskHeight || (this.panelHeight - 210);
	var thumbRange = visibleHeight - this.scrollThumb.height;

	var effectiveMaxScroll = Math.max(1, this.maxScroll);
	var thumbY = 160 + (Math.max(0, this.scrollPosition) / effectiveMaxScroll) * thumbRange;

	this.scrollThumb.y = Math.max(160, Math.min(160 + thumbRange, thumbY));

	this.historyListContainer.y = 160 - Math.max(0, this.scrollPosition);

	this.updateLoadMoreButton();
};

historyView.scrollContent = function (deltaY) {
	if (this.maxScroll <= 0) return;

	var newPosition = this.scrollPosition + deltaY;

	if (newPosition < 0) {

		newPosition = newPosition * 0.3;
	} else if (newPosition > this.maxScroll) {

		var overScroll = newPosition - this.maxScroll;
		newPosition = this.maxScroll + (overScroll * 0.3);
	}

	this.scrollPosition = Math.max(-20, Math.min(this.maxScroll + 60, newPosition));
	this.updateThumbPosition();

	this.checkLoadMoreVisibility();
};

historyView.onMouseWheel = function (event) {
	event.stopPropagation();

	var delta = 0;
	if (event.deltaY) {
		delta = -event.deltaY;
	} else if (event.wheelDelta) {
		delta = event.wheelDelta / 40;
	}

	this.scrollContent(delta * 0.5);

	event.preventDefault();
	return false;
};

historyView.onScrollThumbDown = function (event) {
	event.stopPropagation();
	this.isDragging = true;
	this.dragStartY = event.data.global.y;
	this.scrollStartY = this.scrollPosition;

	if (this.scrollThumb && this.scrollThumb.parent) {
		this.scrollThumb.parent.addChild(this.scrollThumb);
	}
};

historyView.onScrollBarClick = function (event) {
	event.stopPropagation();
	if (!this.scrollThumb.visible) return;

	var clickY = event.data.global.y;
	var thumbY = this.scrollThumb.y;
	var thumbHeight = this.scrollThumb.height;

	if (clickY < thumbY) {

		this.scrollContent(-(this.maskHeight - thumbHeight));
	} else if (clickY > thumbY + thumbHeight) {

		this.scrollContent(this.maskHeight - thumbHeight);
	}
};

historyView.onMouseMove = function (event) {
	if (!this.isDragging) return;

	var deltaY = event.clientY - this.dragStartY;
	var visibleHeight = this.maskHeight || (this.panelHeight - 150);
	var thumbRange = visibleHeight - this.scrollThumb.height;

	this.scrollPosition = (this.scrollStartY + (deltaY / thumbRange) * this.maxScroll);
	this.scrollPosition = Math.max(0, Math.min(this.maxScroll, this.scrollPosition));
	this.updateThumbPosition();
};

historyView.onTouchMove = function (event) {
	if (!this.isDragging) return;
	event.preventDefault();

	var touch = event.changedTouches[0];
	if (!touch) return;

	var deltaY = touch.clientY - this.dragStartY;
	var visibleHeight = this.maskHeight || (this.panelHeight - 150);
	var thumbRange = visibleHeight - this.scrollThumb.height;

	this.scrollPosition = (this.scrollStartY + (deltaY / thumbRange) * this.maxScroll);
	this.scrollPosition = Math.max(0, Math.min(this.maxScroll, this.scrollPosition));
	this.updateThumbPosition();
};

historyView.onMouseUp = function () {
	this.isDragging = false;
};

historyView.onListMouseDown = function (event) {
	if (this.maxScroll <= 0) return;

	event.stopPropagation();
	this.isDraggingScroll = true;
	this.lastDragY = event.data.global.y;
	this.dragStartY = event.data.global.y;
	this.scrollVelocity = 0;
	this.lastScrollTime = Date.now();
};

historyView.onListTouchStart = function (event) {
	if (this.maxScroll <= 0) return;

	event.stopPropagation();
	if (event.data.originalEvent.touches.length === 1) {
		this.isDraggingScroll = true;
		this.lastDragY = event.data.global.y;
		this.dragStartY = event.data.global.y;
		this.scrollVelocity = 0;
		this.lastScrollTime = Date.now();
	}
};

historyView.onGlobalMouseMove = function (event) {
	if (this.isDraggingScroll) {
		event.preventDefault();
		this.handleDragScroll(event.data.global.y);
	} else if (this.isDragging) {

		this.onMouseMove(event);
	}
};

historyView.onGlobalTouchMove = function (event) {
	if (this.isDraggingScroll && event.changedTouches.length === 1) {
		event.preventDefault();
		var touch = event.changedTouches[0];
		this.handleDragScroll(touch.clientY);
	} else if (this.isDragging) {

		this.onTouchMove(event);
	}
};

historyView.handleDragScroll = function (currentY) {
	if (!this.isDraggingScroll) return;

	var now = Date.now();
	var deltaY = currentY - this.lastDragY;
	var deltaTime = now - this.lastScrollTime;

	this.scrollContent(deltaY);

	if (deltaTime > 0) {
		this.scrollVelocity = deltaY / deltaTime;
	}

	this.lastDragY = currentY;
	this.lastScrollTime = now;
};

historyView.onListMouseUp = function (event) {
	if (this.isDraggingScroll) {
		event.stopPropagation();
		this.isDraggingScroll = false;

		if (Math.abs(this.scrollVelocity) > 0.5) {
			this.applyMomentum();
		}
	}

	this.onMouseUp();
};

historyView.applyMomentum = function () {
	if (!this.isDraggingScroll && Math.abs(this.scrollVelocity) > 0.1) {

		var delta = this.scrollVelocity * 16;
		this.scrollContent(delta);

		this.scrollVelocity *= 0.95;

		if (Math.abs(this.scrollVelocity) > 0.1) {
			requestAnimationFrame(this.applyMomentum.bind(this));
		}
	}

	this.checkLoadMoreVisibility();
};

historyView.createLoadMoreButton = function () {

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

	var lang = (sessionStorage.getItem("Language") || sessionStorage.Language || 'en').toLowerCase();
	var buttonText = gameLiterals.replayLOADMORE

	var buttonContainer = pixiLib.getContainer();
	buttonContainer.name = "loadMoreButton";

	var buttonBg = new PIXI.Graphics();
	buttonBg.beginFill(0xf58742);
	buttonBg.drawRoundedRect(0, 0, 200, 40, 8);
	buttonBg.endFill();
	buttonBg.lineStyle(2, 0xffffff);
	buttonBg.drawRoundedRect(0, 0, 200, 40, 8);
	buttonContainer.addChild(buttonBg);

	var buttonTextElement = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 14,
		fill: 0xffffff,
		fontWeight: "bold"
	});
	pixiLib.setText(buttonTextElement, buttonText);
	buttonTextElement.x = 100;
	buttonTextElement.y = 20;
	buttonTextElement.anchor.set(0.5, 0.5);
	buttonContainer.addChild(buttonTextElement);

	buttonContainer.textElement = buttonTextElement;
	buttonContainer.bg = buttonBg;

	var buttonY = 160 + 25 + ((this.historyItems.length || 0) * 40) + 20;
	buttonContainer.x = (this.panelWidth - 200) / 2;
	buttonContainer.y = buttonY;

	buttonContainer.interactive = true;
	buttonContainer.buttonMode = true;

	pixiLib.addEvent(buttonContainer, function() {
		if (!this.isLoadingMore) {

			this.loadNextPage();
		} else {

		}
	}.bind(this));

	if (this.panelBg) {

		for (var i = this.panelBg.children.length - 1; i >= 0; i--) {
			var child = this.panelBg.children[i];
			if (child && child.name === "loadMoreButton" && child !== buttonContainer) {

				try {
					this.panelBg.removeChild(child);
					if (child.destroy && typeof child.destroy === 'function') {
						child.destroy();
					}
				} catch (e) {

				}
			}
		}

		if (buttonContainer.parent !== this.panelBg) {
			this.panelBg.addChild(buttonContainer);
		}

		try {
			this.panelBg.setChildIndex(buttonContainer, this.panelBg.children.length - 1);
		} catch (e) {

		}

	} else {

		for (var i = this.historyListContainer.children.length - 1; i >= 0; i--) {
			var child = this.historyListContainer.children[i];
			if (child && child.name === "loadMoreButton" && child !== buttonContainer) {

				try {
					this.historyListContainer.removeChild(child);
					if (child.destroy && typeof child.destroy === 'function') {
						child.destroy();
					}
				} catch (e) {

				}
			}
		}
		
		if (buttonContainer.parent !== this.historyListContainer) {
			this.historyListContainer.addChild(buttonContainer);
		}

	}
	this.loadMoreButton = buttonContainer;

	this.loadMoreButton.visible = this.hasMore;
	this.loadMoreButton.alpha = 1.0;
	this.loadMoreButton.renderable = true;

	this.loadMoreButton.mask = null;

	if (this.hasMore) {

		this.loadMoreButton.visible = true;
		this.loadMoreButton.alpha = 1.0;
		this.loadMoreButton.renderable = true;
		this.loadMoreButton.mask = null;

		var maxVisibleY = this.panelHeight - 50;
		if (buttonY > maxVisibleY) {

			buttonY = maxVisibleY;
			this.loadMoreButton.y = buttonY;
		}

		if (this.panelBg && this.loadMoreButton.parent === this.panelBg) {
			try {
				this.panelBg.setChildIndex(this.loadMoreButton, this.panelBg.children.length - 1);
			} catch (e) {

			}
		}
	}

	this.updateLoadMoreButton();
};

historyView.updateLoadMoreButton = function (isLoading) {

	
	if (!this.loadMoreButton) {

		this.createLoadMoreButton();
		return;
	}

	var isActuallyLoading = isLoading !== undefined ? isLoading : this.isLoadingMore;
	var lang = (sessionStorage.getItem("Language") || sessionStorage.Language || 'en').toLowerCase();
	
	var loadingText = gameLiterals.replayLOADING
	var normalText = gameLiterals.replayLOADMORE
	
	if (this.loadMoreButton.textElement) {
		pixiLib.setText(this.loadMoreButton.textElement, isActuallyLoading ? loadingText : normalText);

	}

	this.loadMoreButton.interactive = !isActuallyLoading;
	this.loadMoreButton.buttonMode = !isActuallyLoading;

	if (this.loadMoreButton.bg) {
		this.loadMoreButton.bg.alpha = isActuallyLoading ? 0.6 : 1.0;
	}

	var buttonY = this.panelHeight - 80;
	
	this.loadMoreButton.y = buttonY;

	if (this.panelBg && this.loadMoreButton.parent === this.panelBg) {
		try {
			this.panelBg.setChildIndex(this.loadMoreButton, this.panelBg.children.length - 1);
		} catch (e) {

		}
	}

	var isLastWinsTab = !this.highestWinsTab || this.highestWinsTab.style.fill !== 0xffffff;

	var shouldShow = !this.isLoadingMore;

	var visibleHeight = this.maskHeight || (this.panelHeight - 150);
	var buttonVisibleY = buttonY - this.scrollPosition;

	var isNearBottom = buttonVisibleY <= visibleHeight + 20;

	var shouldBeVisible = shouldShow && (isNearBottom || this.scrollPosition >= this.maxScroll - 50 || this.scrollPosition <= 0 || (this.hasMore && this.historyItems.length > 0));

	this.loadMoreButton.visible = shouldBeVisible;
	this.loadMoreButton.alpha = 1.0;
	if (this.loadMoreButton.renderable !== undefined) {
		this.loadMoreButton.renderable = true;
	}

	if (this.loadMoreButton && this.loadMoreButton.visible) {

	}

};

historyView.checkLoadMoreVisibility = function () {
	if (!this.loadMoreButton) {
		return;
	}
	
	var visibleHeight = this.maskHeight || (this.panelHeight - 210);

	var buttonY = 160 + 25 + ((this.historyItems.length || 0) * 40) + 20;

	var buttonVisibleY = buttonY - this.scrollPosition;

	var isNearBottom = buttonVisibleY <= visibleHeight + 40;

	var isHighestWinsTab = isHighestWinsTabActive(this);
	var isLastWinsTab = !isHighestWinsTab;
	var isLoading = isHighestWinsTab ? this.highestWinsLoading : this.lastWinsLoading;
	var hasMore = isHighestWinsTab ? this.highestWinsHasMore : this.lastWinsHasMore;

	this.loadMoreButton.visible = true;
	this.loadMoreButton.alpha = 1.0;
	if (this.loadMoreButton.renderable !== undefined) {
		this.loadMoreButton.renderable = true;
	}

};

historyView.loadNextPage = function () {

	var isHighestWinsTab = isHighestWinsTabActive(this);
	var isLoading = isHighestWinsTab ? this.highestWinsLoading : this.lastWinsLoading;
	var hasMore = isHighestWinsTab ? this.highestWinsHasMore : this.lastWinsHasMore;
	var currentPage = isHighestWinsTab ? this.highestWinsPage : this.lastWinsPage;

	if (isLoading) {
		return;
	}
	
	var nextPage = currentPage + 1;

	if (isHighestWinsTab) {
		this.highestWinsPage = nextPage;
	} else {
		this.lastWinsPage = nextPage;
	}
	this.currentPage = nextPage;

	this.showLoader();

	this.loadHistoryFromApi(nextPage, 20, true);
};

historyView.loadHighestWinsHistory = function () {

	this.highestWinsPage = 1;
	this.highestWinsHasMore = true;
	this.highestWinsLoading = false;
	this.currentPage = 1;
	this.hasMore = true;
	this.isLoadingMore = false;

	this.clearHistoryItems();
	this.historyRounds = null;

	this.showLoader();

	this.loadHistoryFromApi(1, 20, false);
};

historyView.showLoader = function () {
	if (this.loaderSpinner) {
		return;
	}

	var isHighestWinsTab = isHighestWinsTabActive(this);
	if (isHighestWinsTab && this.historyItems.length === 0 && (!this.highestWinsData || this.highestWinsData.length === 0)) {

		if (!this.highestWinsLoading && !this.isLoadingMore) {
			this.showNoDataMessage();
			return;
		}
	}

	if (this.loadMoreButton) {
		this.updateLoadMoreButton(true);
	}

	var spinnerContainer = pixiLib.getContainer();
	spinnerContainer.name = "loaderSpinner";

	var spinner = new PIXI.Graphics();
	spinner.lineStyle(3, 0xf58742, 1);
	spinner.arc(0, 0, 15, 0, Math.PI * 1.5);
	spinnerContainer.addChild(spinner);

	var buttonY = 160 + 25 + ((this.historyItems.length || 0) * 40) + 20;
	spinnerContainer.x = (this.panelWidth - 30) / 2;
	spinnerContainer.y = buttonY;

	if (this.panelBg) {
		this.panelBg.addChild(spinnerContainer);
		this.panelBg.setChildIndex(spinnerContainer, this.panelBg.children.length - 1);
	}
	
	this.loaderSpinner = spinnerContainer;

	var rotationSpeed = 0.1;
	var self = this;
	var animate = function() {
		if (spinnerContainer && spinnerContainer.parent && self.loaderSpinner === spinnerContainer) {
			spinner.rotation += rotationSpeed;
			requestAnimationFrame(animate);
		}
	};
	animate();
};

historyView.hideLoader = function () {
	if (this.loaderSpinner) {
		try {
			if (this.loaderSpinner.parent) {
				this.loaderSpinner.parent.removeChild(this.loaderSpinner);
			}
			if (this.loaderSpinner.destroy && typeof this.loaderSpinner.destroy === 'function') {
				this.loaderSpinner.destroy();
			}
		} catch (e) {

		}
		this.loaderSpinner = null;
	}

	if (this.loadMoreButton) {
		this.updateLoadMoreButton();
	}
};

historyView.showNoDataMessage = function () {

	var isHighestWinsTab = isHighestWinsTabActive(this);
	var isLastWinsTab = !isHighestWinsTab;

	if (this.historyItems && this.historyItems.length > 0) {

		return;
	}

	this.hideLoader();

	this.hideNoDataMessage();

	var lang = (sessionStorage.getItem("Language") || sessionStorage.Language || 'en').toLowerCase();
	var noDataText = gameLiterals.replayNODATAFOUND

	var messageContainer = pixiLib.getContainer();
	messageContainer.name = "noDataMessage";

	var messageStyle = {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 16,
		fill: 0x888888
	};
	
	var messageText = pixiLib.getElement("Text", messageStyle);
	pixiLib.setText(messageText, noDataText);
	messageText.anchor.set(0.5, 0.5);

	var messageY = 160 + 25 + 50;
	messageText.x = this.panelWidth / 2;
	messageText.y = messageY;
	
	messageContainer.addChild(messageText);

	if (this.panelBg) {
		this.panelBg.addChild(messageContainer);
		this.panelBg.setChildIndex(messageContainer, this.panelBg.children.length - 1);
	}
	
	this.noDataMessage = messageContainer;
	var tabName = isHighestWinsTab ? 'Highest Wins' : 'Last Wins';

};

historyView.hideNoDataMessage = function () {
	if (this.noDataMessage) {
		try {
			if (this.noDataMessage.parent) {
				this.noDataMessage.parent.removeChild(this.noDataMessage);
			}
			if (this.noDataMessage.destroy && typeof this.noDataMessage.destroy === 'function') {
				this.noDataMessage.destroy();
			}
		} catch (e) {

		}
		this.noDataMessage = null;
	}
};

function isMobileDeviceDesktop() {
	const viewType = _viewInfoUtil ? _viewInfoUtil.viewType : "VD";
	const actualWindowWidth = window.innerWidth || 1280;
	const isMobileViewType = viewType === "VP" || viewType === "VL";
	const isSmallScreen = actualWindowWidth <= 768;
	return isMobileViewType || isSmallScreen;
}

historyView.setupInfiniteScroll = function () {

	if (typeof isMobileDevice === 'function' && isMobileDevice()) {
		return;
	}
	if (typeof isMobileDeviceDesktop === 'function' && isMobileDeviceDesktop()) {
		return;
	}
	if (this.isInfiniteScrollEnabled) {
		return;
	}
	
	this.isInfiniteScrollEnabled = true;

	var self = this;
	var lastScrollCheck = 0;
	var scrollCheckInterval = 100;
	
	var checkScroll = function() {
		if (!self.isInfiniteScrollEnabled || !self.visible) {
			return;
		}
		
		var now = Date.now();
		if (now - lastScrollCheck < scrollCheckInterval) {
			requestAnimationFrame(checkScroll);
			return;
		}
		lastScrollCheck = now;

		var isNearBottom = self.scrollPosition >= (self.maxScroll - 50);
		
		if (isNearBottom) {

			var isHighestWinsTab = self.highestWinsTab && self.highestWinsTab.style.fill === 0xffffff;
			var isLoading = isHighestWinsTab ? self.highestWinsLoading : self.lastWinsLoading;
			var hasMore = isHighestWinsTab ? self.highestWinsHasMore : self.lastWinsHasMore;

			if (!isLoading && hasMore && self.loadMoreButton && !self.loadMoreButton.visible) {

				self.loadNextPage();
			}
		}
		
		requestAnimationFrame(checkScroll);
	};

	checkScroll();
};

historyView.openReplayPopup = function (roundData) {

	var gameWidth = _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].width;
	var gameHeight = _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].height;

	this.replayContainer = pixiLib.getContainer();
	this.replayContainer.name = "replayContainer";

	if (coreApp && coreApp.stage) {
		coreApp.stage.addChild(this.replayContainer);
	} else if (_ng && _ng.stage) {
		_ng.stage.addChild(this.replayContainer);
	} else {

		this.parent.addChild(this.replayContainer);
	}

	this.replayOverlay = pixiLib.getRectangleSprite(gameWidth, gameHeight, 0x000000);
	this.replayOverlay.alpha = 0.4;
	this.replayOverlay.interactive = true;
	this.replayOverlay.buttonMode = true;
	this.replayContainer.addChild(this.replayOverlay);

	const popupWidth = 1200;
	const popupHeight = 650;

	this.replayPanelBg = new PIXI.Graphics();
	this.replayPanelBg.beginFill(0x1a1a1a);
	this.replayPanelBg.drawRoundedRect(0, 0, popupWidth, popupHeight, 20);
	this.replayPanelBg.endFill();
	this.replayPanelBg.x = (gameWidth - popupWidth) / 2;
	this.replayPanelBg.y = (gameHeight - popupHeight) / 2;
	this.replayContainer.addChild(this.replayPanelBg);

	const border = new PIXI.Graphics();
	border.lineStyle(2, 0xf59342);
	border.drawRoundedRect(0, 0, popupWidth, popupHeight, 22);
	border.x = this.replayPanelBg.x;
	border.y = this.replayPanelBg.y;
	this.replayContainer.addChild(border);

	this.replayHeaderBg = new PIXI.Graphics();
	this.replayHeaderBg.beginFill(0x2a2a2a);
	this.replayHeaderBg.drawRoundedRect(0, 0, popupWidth, 60, 20);
	this.replayHeaderBg.x = this.replayPanelBg.x;
	this.replayHeaderBg.y = this.replayPanelBg.y;
	this.replayContainer.addChild(this.replayHeaderBg);

	this.replayTitleText = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 24,
		fill: 0xffffff
	});
	pixiLib.setText(this.replayTitleText, "🎬 Step 1: Round ID Comparison");
	this.replayTitleText.x = this.replayPanelBg.x + popupWidth / 2;
	this.replayTitleText.y = this.replayPanelBg.y + 30;
	this.replayTitleText.anchor.set(0.5, 0.5);
	this.replayContainer.addChild(this.replayTitleText);

	this.replayCloseBtn = pixiLib.getRectangleSprite(40, 40, 0xf59342);
	this.replayCloseBtn.x = this.replayPanelBg.x + popupWidth - 50;
	this.replayCloseBtn.y = this.replayPanelBg.y + 10;
	this.replayCloseBtn.interactive = true;
	this.replayCloseBtn.buttonMode = true;
	this.replayContainer.addChild(this.replayCloseBtn);

	const closeText = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 24,
		fill: 0xffffff
	});
	pixiLib.setText(closeText, "×");
	closeText.x = this.replayCloseBtn.x + 20;
	closeText.y = this.replayCloseBtn.y + 20;
	closeText.anchor.set(0.5, 0.5);
	this.replayContainer.addChild(closeText);

	pixiLib.addEvent(this.replayCloseBtn, this.closeReplayPopup.bind(this));

	this.addReelViewToReplayPopup();

	this.compareRoundId(roundData);
};

historyView.addReelViewToReplayPopup = function () {

	this.replayReelContainer = pixiLib.getContainer();
	this.replayReelContainer.name = "replayReelContainer";

	const popupWidth = 1200;
	const popupHeight = 650;
	const reelContainerWidth = 600;
	const reelContainerHeight = 400;

	this.replayReelContainer.x = (popupWidth - reelContainerWidth) / 2;
	this.replayReelContainer.y = (popupHeight - reelContainerHeight) / 2 + 50;

	const reelBg = new PIXI.Graphics();
	reelBg.beginFill(0x0a0a0a);
	reelBg.drawRoundedRect(0, 0, reelContainerWidth, reelContainerHeight, 15);
	reelBg.endFill();
	this.replayReelContainer.addChild(reelBg);

	const reelBorder = new PIXI.Graphics();
	reelBorder.lineStyle(2, 0xf59342);
	reelBorder.drawRoundedRect(0, 0, reelContainerWidth, reelContainerHeight, 15);
	this.replayReelContainer.addChild(reelBorder);

	const reelTitle = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 18,
		fill: 0xffffff
	});
	pixiLib.setText(reelTitle, "🎰 Game Reels");
	reelTitle.x = reelContainerWidth / 2;
	reelTitle.y = 20;
	reelTitle.anchor.set(0.5, 0.5);
	this.replayReelContainer.addChild(reelTitle);

	this.replayContainer.addChild(this.replayReelContainer);

};

historyView.restoreGameState = function () {

	if (coreApp && coreApp.gameModel) {

		coreApp.gameModel.isReplaying = false;
		coreApp.gameModel.isSpinning = false;
		coreApp.gameModel.isFreeSpin = false;

		if (coreApp.gameModel.spinTimer) {
			clearTimeout(coreApp.gameModel.spinTimer);
			coreApp.gameModel.spinTimer = null;
		}

	}

	if (coreApp && coreApp.gameController) {

		coreApp.gameController.allReelsStopped = true;
	}

	if (coreApp && coreApp.gameView) {

		if (coreApp.gameView.reelView) {
			coreApp.gameView.reelView.isSpinning = false;
			coreApp.gameView.reelView.isAnimating = false;

			if (coreApp.gameView.reelView.spinTimer) {
				clearTimeout(coreApp.gameView.reelView.spinTimer);
				coreApp.gameView.reelView.spinTimer = null;
			}
		}

	}

	if (window.gameState) {
		window.gameState.isReplaying = false;
		window.gameState.isSpinning = false;
	}

	window.mockResponseData = null;
	window.mockSpinData = null;

	if (_mediator) {

		_mediator.publish("setSpaceBarEvent", "idle");

		_mediator.publish("resetGameState");

		_mediator.publish("EnablePanel");

		_mediator.publish("checkBalanceForBuyFeature");

	}

};

historyView.closeReplayPopup = function () {

	if (this.replayContainer) {
		if (coreApp && coreApp.stage) {
			coreApp.stage.removeChild(this.replayContainer);
		} else if (_ng && _ng.stage) {
			_ng.stage.removeChild(this.replayContainer);
		} else if (this.parent) {
			this.parent.removeChild(this.replayContainer);
		}
		this.replayContainer = null;
	}

	this.replayData = null;
	this.currentReplayRound = 0;
	this.isReplayPlaying = false;

	if (coreApp && coreApp.gameModel) {
		coreApp.gameModel.isReplaying = false;
	} else if (_ng && _ng.gameModel) {
		_ng.gameModel.isReplaying = false;
	}

	window.mockResponseData = null;

	this.historyRounds = null;
	this.clearHistoryItems();

	this.currentPage = 1;
	this.hasMore = true;
	this.isLoadingMore = false;

	this.restoreGameState();

	this.resumeReelAnimations();

	try {

		if (_mediator) {
			_mediator.publish("SpinButtonStatus", true);
		}

		if (coreApp && coreApp.panelView && coreApp.panelView.autoSpinButton) {
			pixiLib.setInteraction(coreApp.panelView.autoSpinButton, true);
		}
	} catch (e) {
	}

	if (_mediator) {
		_mediator.publish("enableBuyFeature");
	}

	if (coreApp && coreApp.gameView && coreApp.gameView.enableBuyFeature) {
		coreApp.gameView.enableBuyFeature();
	}

	this.hide();

	if (_mediator) {
		_mediator.publish(_events.onHideHistoryPanel);
	}

};

historyView.compareRoundId = function (roundData) {

	const sourceRounds = (this.historyRounds && this.historyRounds.length) ? this.historyRounds : [];
	const matchingRecord = sourceRounds.find(item => item.id === roundData.id);

	if (matchingRecord) {

		this.getReplayRecords(matchingRecord);
	}
};

historyView.getReplayRecords = function (matchingRecord) {

	let replayRecords = [];
	let recordType = "mockSpinRounds";

	const mockSpinRounds = window.mockSpinRounds || [];

	for (let i = 0; i < mockSpinRounds.length; i++) {
		const record = mockSpinRounds[i];
		if (record && record.current_round && record.current_round.round_id === matchingRecord.id) {
			replayRecords.push(record);
		}
	}

	if (replayRecords.length > 0) {

		this.displayReplayRecords(replayRecords, recordType);
	} else {
	}
};

historyView.createReplayUrl = function (roundData) {

	const sessionId = sessionStorage.getItem("sessionId") || sessionStorage.sessionId;

	const userLocale = sessionStorage.getItem("Language") || sessionStorage.Language || 'en';
	const wager = roundData.wager || '1.00';

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
	let isNormalSpin = false;
	let isSuperBuyFeature = false

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

	this.openReplayIframe(replayUrl.toString());
};

historyView.createReplayPageUrl = function (roundData, sessionId, isBuyFeature, isNormalSpin) {

	const replayData = this.getReplayDataForRound(roundData);

	const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Game Replay</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: #1a1a1a;
            color: white;
            font-family: Arial, sans-serif;
        }
        .replay-container {
            max-width: 800px;
            margin: 0 auto;
        }
        .replay-header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: #2a2a2a;
            border-radius: 10px;
            border: 2px solid #f59342;
        }
        .replay-title {
            font-size: 24px;
            color: #f59342;
            margin: 0;
        }
        .replay-info {
            margin: 20px 0;
            padding: 15px;
            background: #333;
            border-radius: 8px;
        }
        .replay-record {
            margin: 15px 0;
            padding: 15px;
            background: #444;
            border-radius: 8px;
            border-left: 4px solid #f59342;
        }
        .record-title {
            font-weight: bold;
            color: #f59342;
            margin-bottom: 10px;
        }
        .record-details {
            font-size: 14px;
            line-height: 1.4;
        }
        .loading {
            text-align: center;
            padding: 50px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="replay-container">
        <div class="replay-header">
            <h1 class="replay-title">🎬 Game Replay</h1>
            <p>Round ID: ${roundData.id}</p>
            <p>Session ID: ${sessionId}</p>
            <p>Type: ${isBuyFeature ? 'Buy Feature' : isNormalSpin ? 'Normal Spin' : 'Unknown'}</p>
        </div>
        
        <div class="replay-info">
            <h3>Replay Data Found:</h3>
            <p>Records: ${replayData.length}</p>
        </div>
        
        ${replayData.length > 0 ? replayData.map((record, index) => `
            <div class="replay-record">
                <div class="record-title">Record ${index + 1}</div>
                <div class="record-details">
                    <p><strong>Round ID:</strong> ${record.current_round?.round_id || 'N/A'}</p>
                    <p><strong>Win Amount:</strong> ${record.current_round?.win_amount || 0}</p>
                    <p><strong>Matrix:</strong> ${record.current_round?.matrix || 'N/A'}</p>
                    <p><strong>Spin Type:</strong> ${record.current_round?.spin_type || 'N/A'}</p>
                    ${record.current_round?.bonus_games_won ? `<p><strong>Bonus Games:</strong> ${JSON.stringify(record.current_round.bonus_games_won)}</p>` : ''}
                </div>
            </div>
        `).join('') : '<div class="loading">No replay data found for this round.</div>'}
    </div>
</body>
</html>`;

	const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);

	return dataUrl;
};

historyView.getReplayDataForRound = function (roundData) {

	let replayRecords = [];

	const mockSpinRounds = window.mockSpinRounds || [];

	for (let i = 0; i < mockSpinRounds.length; i++) {
		const record = mockSpinRounds[i];
		if (record && record.current_round && record.current_round.round_id === roundData.id) {
			replayRecords.push(record);
		}
	}

	return replayRecords;
};

historyView.injectReplayDataDirectly = function (roundData) {

	this.hide();

	var gameWidth = _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].width;
	var gameHeight = _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].height;

	this.replayContainer = pixiLib.getContainer();
	this.replayContainer.name = "replayContainer";

	if (coreApp && coreApp.stage) {
		coreApp.stage.addChild(this.replayContainer);
	} else if (_ng && _ng.stage) {
		_ng.stage.addChild(this.replayContainer);
	} else {
		this.parent.addChild(this.replayContainer);
	}

	this.replayOverlay = pixiLib.getRectangleSprite(gameWidth, gameHeight, 0x000000);
	this.replayOverlay.alpha = 0.7;
	this.replayOverlay.interactive = true;
	this.replayOverlay.buttonMode = true;
	this.replayContainer.addChild(this.replayOverlay);

	const popupWidth = 1200;
	const popupHeight = 800;

	this.replayPanelBg = new PIXI.Graphics();
	this.replayPanelBg.beginFill(0x1a1a1a);
	this.replayPanelBg.drawRoundedRect(0, 0, popupWidth, popupHeight, 20);
	this.replayPanelBg.endFill();
	this.replayPanelBg.x = (gameWidth - popupWidth) / 2;
	this.replayPanelBg.y = (gameHeight - popupHeight) / 2;
	this.replayContainer.addChild(this.replayPanelBg);

	const border = new PIXI.Graphics();
	border.lineStyle(2, 0xf59342);
	border.drawRoundedRect(0, 0, popupWidth, popupHeight, 22);
	border.x = this.replayPanelBg.x;
	border.y = this.replayPanelBg.y;
	this.replayContainer.addChild(border);

	this.replayHeaderBg = new PIXI.Graphics();
	this.replayHeaderBg.beginFill(0x2a2a2a);
	this.replayHeaderBg.drawRoundedRect(0, 0, popupWidth, 60, 20);
	this.replayHeaderBg.x = this.replayPanelBg.x;
	this.replayHeaderBg.y = this.replayPanelBg.y;
	this.replayContainer.addChild(this.replayHeaderBg);

	this.replayTitleText = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 24,
		fill: 0xffffff
	});
	pixiLib.setText(this.replayTitleText, gameLiterals.replayGameReplay);
	this.replayTitleText.x = this.replayPanelBg.x + popupWidth / 2;
	this.replayTitleText.y = this.replayPanelBg.y + 30;
	this.replayTitleText.anchor.set(0.5, 0.5);
	this.replayTitleText.visible = false;
	this.replayContainer.addChild(this.replayTitleText);

	this.replayCloseBtn = pixiLib.getRectangleSprite(40, 40, 0xf59342);
	this.replayCloseBtn.x = this.replayPanelBg.x + popupWidth - 50;
	this.replayCloseBtn.y = this.replayPanelBg.y + 10;
	this.replayCloseBtn.interactive = true;
	this.replayCloseBtn.buttonMode = true;
	this.replayContainer.addChild(this.replayCloseBtn);

	const closeText = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 24,
		fill: 0xffffff
	});
	pixiLib.setText(closeText, "×");
	closeText.x = this.replayCloseBtn.x + 20;
	closeText.y = this.replayCloseBtn.y + 20;
	closeText.anchor.set(0.5, 0.5);
	this.replayContainer.addChild(closeText);

	pixiLib.addEvent(this.replayCloseBtn, this.closeReplayPopup.bind(this));

	this.processReplayData(roundData);

};

historyView.processReplayData = function (roundData) {

	let replayRecords = [];
	let recordType = "mockSpinRounds";

	const mockSpinRounds = window.mockSpinRounds || [];

	for (let i = 0; i < mockSpinRounds.length; i++) {
		const record = mockSpinRounds[i];
		if (record && record.current_round && record.current_round.round_id === roundData.id) {
			replayRecords.push(record);
		}
	}

	if (replayRecords.length > 0) {

		this.startReplaySequence(replayRecords);
	} else {
		this.showNoReplayDataMessage();
	}
};

historyView.startReplaySequence = function (replayRecords) {

	this.replayRecords = replayRecords;
	this.currentReplayIndex = 0;
	this.isReplayPlaying = true;

	this.playNextReplayRecord();
};

historyView.playNextReplayRecord = function () {
	if (this.currentReplayIndex >= this.replayRecords.length) {
		this.showReplayCompleteMessage();
		return;
	}

	const currentRecord = this.replayRecords[this.currentReplayIndex];

	if (coreApp && coreApp.gameModel) {
		coreApp.gameModel.isReplaying = true;
	}

	const jsonString = JSON.stringify(currentRecord);
	coreApp.gameModel.saveSpinData(jsonString);

	_mediator.publish("onSpinResponse");

	this.currentReplayIndex++;

	setTimeout(() => {
		this.playNextReplayRecord();
	}, 3000);
};

historyView.showNoReplayDataMessage = function () {

	const messageText = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 18,
		fill: 0xff0000
	});
	pixiLib.setText(messageText, "❌ No replay data found for this round");
	messageText.x = this.replayPanelBg.x + 500;
	messageText.y = this.replayPanelBg.y + 350;
	messageText.anchor.set(0.5, 0.5);
	this.replayContainer.addChild(messageText);
};

historyView.showReplayCompleteMessage = function () {

	const messageText = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 18,
		fill: 0x00ff00
	});
	pixiLib.setText(messageText, "✅ Replay sequence completed");
	messageText.x = this.replayPanelBg.x + 500;
	messageText.y = this.replayPanelBg.y + 350;
	messageText.anchor.set(0.5, 0.5);
	this.replayContainer.addChild(messageText);
};

historyView.openReplayIframe = function (replayUrl) {

	this.hide();

	var gameWidth = _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].width;
	var gameHeight = _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].height;

	this.replayContainer = pixiLib.getContainer();
	this.replayContainer.name = "replayContainer";

	if (coreApp && coreApp.stage) {
		coreApp.stage.addChild(this.replayContainer);
	} else if (_ng && _ng.stage) {
		_ng.stage.addChild(this.replayContainer);
	} else {
		this.parent.addChild(this.replayContainer);
	}

	this.replayOverlay = pixiLib.getRectangleSprite(gameWidth, gameHeight, 0x000000);
	this.replayOverlay.alpha = 0.7;
	this.replayOverlay.interactive = true;
	this.replayOverlay.buttonMode = true;
	this.replayContainer.addChild(this.replayOverlay);

	const popupWidth = 1200;
	const popupHeight = 650;

	this.replayPanelBg = new PIXI.Graphics();
	this.replayPanelBg.beginFill(0x1a1a1a);
	this.replayPanelBg.drawRoundedRect(0, 0, popupWidth, popupHeight, 20);
	this.replayPanelBg.endFill();
	this.replayPanelBg.x = (gameWidth - popupWidth) / 2;
	this.replayPanelBg.y = (gameHeight - popupHeight) / 2;
	this.replayContainer.addChild(this.replayPanelBg);

	const border = new PIXI.Graphics();
	border.lineStyle(2, 0xf59342);
	border.drawRoundedRect(0, 0, popupWidth, popupHeight, 22);
	border.x = this.replayPanelBg.x;
	border.y = this.replayPanelBg.y;
	this.replayContainer.addChild(border);

	this.replayHeaderBg = new PIXI.Graphics();
	this.replayHeaderBg.beginFill(0x2a2a2a);
	this.replayHeaderBg.drawRoundedRect(0, 0, popupWidth, 60, 20);
	this.replayHeaderBg.x = this.replayPanelBg.x;
	this.replayHeaderBg.y = this.replayPanelBg.y;
	this.replayContainer.addChild(this.replayHeaderBg);

	this.replayTitleText = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 24,
		fill: 0xffffff
	});
	pixiLib.setText(this.replayTitleText, gameLiterals.replayGameReplay);
	this.replayTitleText.x = this.replayPanelBg.x + popupWidth / 2;
	this.replayTitleText.y = this.replayPanelBg.y + 30;
	this.replayTitleText.anchor.set(0.5, 0.5);
	this.replayTitleText.visible = false;
	this.replayContainer.addChild(this.replayTitleText);

	this.replayCloseBtn = pixiLib.getRectangleSprite(40, 40, 0xf59342);
	this.replayCloseBtn.x = this.replayPanelBg.x + popupWidth - 50;
	this.replayCloseBtn.y = this.replayPanelBg.y + 10;
	this.replayCloseBtn.interactive = true;
	this.replayCloseBtn.buttonMode = true;
	this.replayContainer.addChild(this.replayCloseBtn);

	const closeText = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 24,
		fill: 0xffffff
	});
	pixiLib.setText(closeText, "×");
	closeText.x = this.replayCloseBtn.x + 20;
	closeText.y = this.replayCloseBtn.y + 20;
	closeText.anchor.set(0.5, 0.5);
	this.replayContainer.addChild(closeText);

	pixiLib.addEvent(this.replayCloseBtn, this.closeReplayIframe.bind(this));

	const iframeContainerWidth = popupWidth - 60;
	const iframeContainerHeight = popupHeight - 120;

	const iframe = document.createElement('iframe');
	iframe.src = replayUrl;
	iframe.style.width = 'calc(100% - 180px)';
	iframe.style.height = 'calc(100% - 180px)';
	iframe.style.border = 'none';
	iframe.style.position = 'fixed';
	iframe.style.top = '120px';
	iframe.style.left = '30px';
	iframe.style.right = '30px';
	iframe.style.bottom = '50px';
	iframe.style.zIndex = '10000';
	iframe.style.backgroundColor = '#000';
	iframe.style.borderRadius = '10px';
	iframe.style.pointerEvents = 'auto';
	iframe.style.objectFit = 'contain';
	iframe.style.maxWidth = 'calc(100vw - 180px)';
	iframe.style.maxHeight = 'calc(100vh - 180px)';
	iframe.style.margin = '0 auto';
	iframe.style.display = 'block';

	const handleResize = () => {
		const containerWidth = window.innerWidth - 60;
		const containerHeight = window.innerHeight - 180;
		const containerRatio = containerWidth / containerHeight;

		try {
			const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
			const gameContainer = iframeDoc.querySelector('.game-container') || iframeDoc.body;
			const gameWidth = gameContainer.offsetWidth || containerWidth;
			const gameHeight = gameContainer.offsetHeight || containerHeight * 0.8;
			const gameRatio = gameWidth / gameHeight;

			if (gameRatio > containerRatio) {

				iframe.style.width = 'auto';
				iframe.style.height = 'auto';
			} else {

				iframe.style.width = '84%';
				iframe.style.height = 'calc(100vh - 180px)';
			}
		} catch (e) {

			iframe.style.width = 'calc(100% - 60px)';
			iframe.style.height = 'calc(100vh - 180px)';
		}
	};

	iframe.onload = function () {

		handleResize();
	};

	iframe.onerror = function () {
	};

	window.addEventListener('resize', handleResize);

	iframe._resizeHandler = handleResize;

	document.body.appendChild(iframe);

	this.replayIframe = iframe;

};

historyView.closeReplayIframe = function () {
	window.externalUi.call("game_ui", "show");

	if (coreApp && coreApp.gameModel) {
		coreApp.gameModel.isReplaying = false;
	} else if (_ng && _ng.gameModel) {
		_ng.gameModel.isReplaying = false;
	}

	window.mockResponseData = null;

	this.historyRounds = null;
	this.clearHistoryItems();

	this.currentPage = 1;
	this.hasMore = true;
	this.isLoadingMore = false;

	this.restoreGameState();

	if (this.replayIframe) {

		if (this.replayIframe._resizeHandler) {
			window.removeEventListener('resize', this.replayIframe._resizeHandler);
			this.replayIframe._resizeHandler = null;
		}

		try {
			if (document.body.contains(this.replayIframe)) {
				document.body.removeChild(this.replayIframe);
			}
		} catch (e) {
		}
		this.replayIframe = null;
	}

	if (this.replayContainer) {
		if (coreApp && coreApp.stage) {
			coreApp.stage.removeChild(this.replayContainer);
		} else if (_ng && _ng.stage) {
			_ng.stage.removeChild(this.replayContainer);
		} else if (this.parent) {
			this.parent.removeChild(this.replayContainer);
		}
		this.replayContainer = null;
	}

	this.resumeReelAnimations();

	try {

		if (_mediator) {
			_mediator.publish("SpinButtonStatus", true);
		}

		if (coreApp && coreApp.panelView && coreApp.panelView.autoSpinButton) {
			pixiLib.setInteraction(coreApp.panelView.autoSpinButton, true);
		}
	} catch (e) {
	}

};

historyView.hide = function (argument) {
	this.visible = false;

	this.resumeReelAnimations();

};

historyView.pauseReelAnimations = function () {

	if (coreApp && coreApp.gameView && coreApp.gameView.reelView && coreApp.gameView.reelView.reels) {
		for (var i = 0; i < coreApp.gameView.reelView.reels.length; i++) {
			var reel = coreApp.gameView.reelView.reels[i];
			if (reel && reel.symbolsArray) {

				for (var j = 0; j < reel.symbolsArray.length; j++) {
					var symbol = reel.symbolsArray[j];
					if (symbol && symbol.children && symbol.children[0] && symbol.children[0].state) {

						symbol.children[0].state.timeScale = 0;
					}
				}

				if (reel.loopTimeout) {
					clearTimeout(reel.loopTimeout);
					reel.loopTimeout = null;
				}
			}
		}
	}
};

historyView.resumeReelAnimations = function () {

	if (coreApp && coreApp.gameView && coreApp.gameView.reelView && coreApp.gameView.reelView.reels) {
		for (var i = 0; i < coreApp.gameView.reelView.reels.length; i++) {
			var reel = coreApp.gameView.reelView.reels[i];
			if (reel && reel.symbolsArray) {

				for (var j = 0; j < reel.symbolsArray.length; j++) {
					var symbol = reel.symbolsArray[j];
					if (symbol && symbol.children && symbol.children[0] && symbol.children[0].state) {

						symbol.children[0].state.timeScale = 1;
					}
				}
			}
		}
	}
};

historyView.shiftGameUI = function (shiftLeft) {
	var shiftAmount = shiftLeft ? -(this.panelWidth / 2) : 0;
	var duration = 0.3;

	if (coreApp.gameView.mainContainer) {
		TweenMax.to(coreApp.gameView.mainContainer, duration, { x: shiftAmount });
	}
	if (coreApp.gameView.panelContainer) {
		TweenMax.to(coreApp.gameView.panelContainer, duration, { x: shiftAmount });
	}
	if (coreApp.gameView.paytableContainer) {
		TweenMax.to(coreApp.gameView.paytableContainer, duration, { x: shiftAmount });
	}
	if (coreApp.gameView.bgContainer) {
		TweenMax.to(coreApp.gameView.bgContainer, duration, { x: shiftAmount });
	}
	if (coreApp.gameView.featureContainer) {
		TweenMax.to(coreApp.gameView.featureContainer, duration, { x: shiftAmount });
	}
	if (coreApp.gameView.decoratorContainer) {
		TweenMax.to(coreApp.gameView.decoratorContainer, duration, { x: shiftAmount });
	}
	if (coreApp.gameView.popupContainer) {
		TweenMax.to(coreApp.gameView.popupContainer, duration, { x: shiftAmount });
	}
	if (coreApp.gameView.clockView) {
		TweenMax.to(coreApp.gameView.clockView, duration, { x: shiftAmount });
	}
};

historyView.updateLanguageTexts = function (lang) {

	if (this.titleText) {
		pixiLib.setText(this.titleText, gameLiterals.dedetitlereplay);
	}

	if (this.lastWinsTab) {
			pixiLib.setText(this.lastWinsTab, gameLiterals.dedetitlereplay);
	}

	if (this.highestWinsTab) {
			pixiLib.setText(this.highestWinsTab,gameLiterals.replayHIGHESTWINS);
	}

	if (this.columnHeaders && this.columnHeaders.length > 0) {
		var columnTexts = [];
		
	columnTexts = [ gameLiterals.historyTime, gameLiterals.historyBetid, gameLiterals.historyWinx, gameLiterals.historyBet, gameLiterals.historyWin, gameLiterals.historyLink, gameLiterals.historyWatch];



		if (this.columnInfo && this.columnInfo.length > 0) {
			for (var i = 0; i < this.columnHeaders.length && i < columnTexts.length && i < this.columnInfo.length; i++) {
				if (this.columnHeaders[i]) {
					pixiLib.setText(this.columnHeaders[i], columnTexts[i]);

					var column = this.columnInfo[i];
					this.columnHeaders[i].x = column.x + (column.width / 2);
					this.columnHeaders[i].anchor.set(0.5, 0.5);
				}
			}
		} else {

			for (var i = 0; i < this.columnHeaders.length && i < columnTexts.length; i++) {
				if (this.columnHeaders[i]) {
					pixiLib.setText(this.columnHeaders[i], columnTexts[i]);
					this.columnHeaders[i].anchor.set(0.5, 0.5);
				}
			}
		}
	}
};

historyView.destroy = function (argument) {
	this.destroy();
};

historyView.onReplayCompleted = function (data) {

	this.pendingReplayCompletion = {
		roundId: data.roundId,
		userLocale: data.userLocale
	};

};

historyView.onTotalWinShown = function () {

	if (this.pendingReplayCompletion) {

		const sourceRounds = (this.historyRounds && this.historyRounds.length) ? this.historyRounds : [];
		const roundData = sourceRounds.find(item => item.id === this.pendingReplayCompletion.roundId);

		if (!roundData) {
			this.pendingReplayCompletion = null;
			return;
		}

		this.showReplayCompletionPopup(roundData, this.pendingReplayCompletion.userLocale);

		this.pendingReplayCompletion = null;
	}
};

historyView.showReplayCompletionPopup = function (roundData, userLocale) {

	_sndLib.play(_sndLib.sprite.btnClick);

	const gameWidth = _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].width;
	const gameHeight = _ng.GameConfig.gameLayout[_viewInfoUtil.viewType].height;

	const lang = (userLocale || sessionStorage.getItem("Language") || sessionStorage.Language || 'en').toLowerCase();

	if (this.replayCompletionContainer) {

		if (coreApp && coreApp.stage) {
			coreApp.stage.removeChild(this.replayCompletionContainer);
		} else if (_ng && _ng.stage) {
			_ng.stage.removeChild(this.replayCompletionContainer);
		}
	}

	this.replayCompletionContainer = pixiLib.getContainer();
	this.replayCompletionContainer.name = "replayCompletionContainer";

	if (coreApp && coreApp.gameView && coreApp.gameView.popupContainer) {
		coreApp.gameView.popupContainer.addChild(this.replayCompletionContainer);
	} else if (coreApp && coreApp.stage) {
		coreApp.stage.addChild(this.replayCompletionContainer);
	} else if (_ng && _ng.stage) {
		_ng.stage.addChild(this.replayCompletionContainer);
	}

	const overlay = pixiLib.getRectangleSprite(gameWidth, gameHeight, 0x000000);
	overlay.alpha = 0.01;
	overlay.interactive = false;
	overlay.buttonMode = false;
	this.replayCompletionContainer.addChild(overlay);

	const buttonSpacing = 20;
	const buttonWidth = 180;
	const buttonHeight = 60;
	const borderRadius = buttonHeight / 2;
	const totalWidth = (buttonWidth * 2) + buttonSpacing;

	const startX = (gameWidth - totalWidth) / 2;
	const buttonY = gameHeight * 0.75;

	const copyBtnGraphics = new PIXI.Graphics();
	copyBtnGraphics.beginFill(0x4a4a4a);
	copyBtnGraphics.drawRoundedRect(0, 0, buttonWidth, buttonHeight, borderRadius);
	copyBtnGraphics.endFill();
	const copyBtn = new PIXI.Container();
	copyBtn.addChild(copyBtnGraphics);
	copyBtn.x = startX;
	copyBtn.y = buttonY;
	copyBtn.interactive = true;
	copyBtn.buttonMode = true;
	this.replayCompletionContainer.addChild(copyBtn);

	const copyBtnContainer = pixiLib.getContainer();
	copyBtnContainer.x = copyBtn.x;
	copyBtnContainer.y = copyBtn.y;
	this.replayCompletionContainer.addChild(copyBtnContainer);

	const chainIcon = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 26,
		fill: 0xffffff
	});
	pixiLib.setText(chainIcon, "🔗");
	chainIcon.x = 30;
	chainIcon.y = buttonHeight / 2;
	chainIcon.anchor.set(0.5, 0.5);
	copyBtnContainer.addChild(chainIcon);

	const copyBtnText = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 20,
		fill: 0xffffff
	});
	pixiLib.setText(copyBtnText, gameLiterals.replaycopy);
	copyBtnText.x = buttonWidth / 2 + 15;
	copyBtnText.y = buttonHeight / 2;
	copyBtnText.anchor.set(0.5, 0.5);
	copyBtnContainer.addChild(copyBtnText);

	const replayBtnGraphics = new PIXI.Graphics();
	replayBtnGraphics.beginFill(0xf59342);
	replayBtnGraphics.drawRoundedRect(0, 0, buttonWidth, buttonHeight, borderRadius);
	replayBtnGraphics.endFill();
	const replayBtn = new PIXI.Container();
	replayBtn.addChild(replayBtnGraphics);
	replayBtn.x = startX + buttonWidth + buttonSpacing;
	replayBtn.y = buttonY;
	replayBtn.interactive = true;
	replayBtn.buttonMode = true;
	this.replayCompletionContainer.addChild(replayBtn);

	const replayBtnContainer = pixiLib.getContainer();
	replayBtnContainer.x = replayBtn.x;
	replayBtnContainer.y = replayBtn.y;
	this.replayCompletionContainer.addChild(replayBtnContainer);

	const playIcon = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 26,
		fill: 0xffffff
	});
	pixiLib.setText(playIcon, "▶");
	playIcon.x = 30;
	playIcon.y = buttonHeight / 2;
	playIcon.anchor.set(0.5, 0.5);
	replayBtnContainer.addChild(playIcon);

	const replayBtnText = pixiLib.getElement("Text", {
		fontFamily: "Montserrat-regular, sans-serif",
		fontSize: 20,
		fill: 0xffffff
	});
	pixiLib.setText(replayBtnText, gameLiterals.replayREPLAY);
	replayBtnText.x = buttonWidth / 2 + 15;
	replayBtnText.y = buttonHeight / 2;
	replayBtnText.anchor.set(0.5, 0.5);
	replayBtnContainer.addChild(replayBtnText);

	const copyButtonClickHandler = () => {
		_sndLib.play(_sndLib.sprite.btnClick);

		const tempLinkBtn = pixiLib.getRectangleSprite(1, 1, 0x000000);
		const tempLinkText = pixiLib.getElement("Text", { fontSize: 10, fill: 0xffffff });

		this.generateAndCopyLink(roundData, tempLinkText, tempLinkBtn);

		const originalCopyText = copyBtnText.text;
		pixiLib.setText(copyBtnText, gameLiterals.replayCOPIED);

		copyBtnGraphics.clear();
		copyBtnGraphics.beginFill(0x4CAF50);
		copyBtnGraphics.drawRoundedRect(0, 0, buttonWidth, buttonHeight, borderRadius);
		copyBtnGraphics.endFill();

		setTimeout(() => {
			pixiLib.setText(copyBtnText, originalCopyText);

			copyBtnGraphics.clear();
			copyBtnGraphics.beginFill(0x4a4a4a);
			copyBtnGraphics.drawRoundedRect(0, 0, buttonWidth, buttonHeight, borderRadius);
			copyBtnGraphics.endFill();
		}, 2000);
	};

	pixiLib.addEvent(copyBtn, copyButtonClickHandler);

	copyBtnContainer.interactive = true;
	copyBtnContainer.buttonMode = true;
	copyBtnContainer.hitArea = new PIXI.Rectangle(0, 0, buttonWidth, buttonHeight);
	pixiLib.addEvent(copyBtnContainer, copyButtonClickHandler);

	pixiLib.addEvent(replayBtn, () => {
		_sndLib.play(_sndLib.sprite.btnClick);
		this.closeReplayCompletionPopup();
		this.restartReplay();
	});

	this.completionRoundData = roundData;

};

historyView.closeReplayCompletionPopup = function () {
	if (this.replayCompletionContainer) {
		window.externalUi.call("game_ui", "show");
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
	this.completionRoundData = null;
};

historyView.restartReplay = function () {

	let slotService = null;

	if (coreApp && coreApp.slotService) {
		slotService = coreApp.slotService;
	}

	else if (_ng && _ng.slotService) {
		slotService = _ng.slotService;
	}

	else if (window.slotService) {
		slotService = window.slotService;
	}

	else if (coreApp && coreApp.service) {
		slotService = coreApp.service;
	}

	if (slotService) {

		if (slotService.replayCallback) {

			if (_mediator && typeof _mediator.unsubscribe === 'function') {
				_mediator.unsubscribe("callNextGameState", slotService.replayCallback);
			}
			slotService.replayCallback = null;
		}

		if (slotService.replayFallbackTimeout) {
			clearTimeout(slotService.replayFallbackTimeout);
			slotService.replayFallbackTimeout = null;
		}

		slotService.currentReplayIndex = 0;

		if (slotService.replayDataArray && slotService.replayDataArray.length > 0) {
			slotService.injectReplayData();
		} else {
		}
	} else {

		if (_mediator) {
			_mediator.publish("restartReplay");
		}
	}
};

historyView.generateAndCopyLink = function (roundData, linkTextElement, linkBtn) {

	const userLocale = sessionStorage.getItem("Language") || sessionStorage.Language || 'en';

	const baseUrl = window.location.origin + window.location.pathname;
	const shareUrl = new URL(baseUrl);

	shareUrl.searchParams.set('user_locale', userLocale);
	shareUrl.searchParams.set('round_id', roundData.id);
	shareUrl.searchParams.set('is_replay', 'true');

	const linkString = shareUrl.toString();

	this.copyToClipboard(linkString);

	const originalText = linkTextElement.text;
	const lang = userLocale.toLowerCase();

	const copiedText = gameLiterals.replayCOPIED

	pixiLib.setText(linkTextElement, copiedText);

	if (linkBtn && linkBtn._buttonGraphics) {

		const btnWidth = linkBtn._buttonWidth || 70;
		const btnHeight = linkBtn._buttonHeight || 25;
		const btnRadius = linkBtn._borderRadius || btnHeight / 2;
		linkBtn._buttonGraphics.clear();
		linkBtn._buttonGraphics.beginFill(0xf59342);
		linkBtn._buttonGraphics.drawRoundedRect(0, 0, btnWidth, btnHeight, btnRadius);
		linkBtn._buttonGraphics.endFill();
	} else if (linkBtn) {

		linkBtn.tint = 0xf59342;
	}

	setTimeout(function () {
		pixiLib.setText(linkTextElement, originalText);
		if (linkBtn && linkBtn._buttonGraphics) {

			const btnWidth = linkBtn._buttonWidth || 70;
			const btnHeight = linkBtn._buttonHeight || 25;
			const btnRadius = linkBtn._borderRadius || btnHeight / 2;
			linkBtn._buttonGraphics.clear();
			linkBtn._buttonGraphics.beginFill(0x4a4a4a);
			linkBtn._buttonGraphics.drawRoundedRect(0, 0, btnWidth, btnHeight, btnRadius);
			linkBtn._buttonGraphics.endFill();
		} else if (linkBtn) {

			linkBtn.tint = 0xFFFFFF;
		}
	}.bind(this), 2000);

};

historyView.copyToClipboard = function (text) {

	if (navigator.clipboard && window.isSecureContext) {
		navigator.clipboard.writeText(text).then(function () {
		}).catch(function (err) {

			this.fallbackCopyToClipboard(text);
		}.bind(this));
	} else {

		this.fallbackCopyToClipboard(text);
	}
};

historyView.fallbackCopyToClipboard = function (text) {

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

