

function getLogoPath() {
    return "assets/historyLogo.png";
}

class HistoryMobile {
    constructor() {
        this.currentPage = 1;
        this.limit = 20;
        this.totalPages = 1;
        this.historyData = [];
        this.isLoading = false;
        this.isSingleRoundMode = false;
        this.isSingleRecordPage = !!window.HISTORY_SINGLE_RECORD;
        this.isPfrRoundsPage = !!window.HISTORY_PFR_ROUNDS;
        
        this.init();
    }
    
    
    getLocale() {
        if (typeof HistoryLocale !== 'undefined' && HistoryLocale.currentLocale) {
            return HistoryLocale.currentLocale;
        }
        const urlParams = HistoryAPI.getURLParams();
        return urlParams.userLocale || 'en';
    }
    
    
    async init() {

        if (typeof HistoryLocale !== 'undefined') {
            HistoryLocale.init();
        }

        const urlParams = HistoryAPI.getURLParams();
        this.currentPage = urlParams.page || 1;
        this.isSingleRoundMode = !!urlParams.roundId;
        this.isPfrRoundsPage = !!window.HISTORY_PFR_ROUNDS;
        this.isSingleRecordPage = !!window.HISTORY_SINGLE_RECORD || (this.isSingleRoundMode && !this.isPfrRoundsPage);

        this.setupEventListeners();

        this.updateLocalizedStrings();

        this.setupIOSTouchHandling();

        if (this.isPfrRoundsPage) {
            await this.loadPfrRounds(urlParams.transactionId);
        } else if (this.isSingleRoundMode) {
            await this.loadSingleRound(urlParams.roundId, urlParams.currency || 'try', { pushState: false });
        } else {
            await this.loadHistory();
        }

        this.hideLoading();
    }

    
    async loadSingleRound(roundId, currency, options = {}) {
        if (!roundId) return;
        if (this.isLoading) return;

        this.isSingleRoundMode = true;
        this.isLoading = true;
        this.showLoading();

        try {
            const urlParams = HistoryAPI.getURLParams();
            const localUrl = (this.isSingleRecordPage && HistoryAPI.buildSingleRecordUrl)
                ? HistoryAPI.buildSingleRecordUrl(roundId, currency, urlParams.userLocale)
                : HistoryAPI.buildRoundUrls(roundId, currency, urlParams.userLocale).localUrl;
            if (options.pushState) {
                window.history.pushState({}, '', localUrl);
            }

            const paginationContainer = document.getElementById('mobilePaginationContainer');
            if (paginationContainer) paginationContainer.classList.add('hidden');

            const sessionData = await HistoryAPI.fetchSessionDetails(roundId, currency);
            const isArray = Array.isArray(sessionData);
            const primary = isArray ? (sessionData[0] || null) : sessionData;
            const item = HistoryAPI.createHistoryItemFromSession(primary, currency);
            if (isArray) {
                item._sessionsArray = sessionData;
            }

            this.historyData = [item];
            this.totalPages = 1;
            this.currentPage = 1;

            this.renderHistoryCards();

            if (!this.isSingleRecordPage && !this.isPfrRoundsPage) {
                const card = document.querySelector('#historyCards .history-card');
                if (card) {
                    const isBonusOrBuy = item.is_bonus || item.is_buy_feature;
                    if (isBonusOrBuy) {

                        await this.expandCard(card, item);
                    } else {
                        await this.expandNormalCard(card, item, item._sessionData || sessionData);
                    }
                }
            }
        } catch (error) {

            this.showError('Failed to load round. Please try again.');
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }
    
    async loadPfrRounds(transactionId) {
        if (!transactionId) {
            this.showError('Transaction ID is required.');
            return;
        }
        if (this.isLoading) return;

        this.isLoading = true;
        this.showLoading();

        try {
            const paginationContainer = document.getElementById('mobilePaginationContainer');
            if (paginationContainer) paginationContainer.classList.add('hidden');

            const data = await HistoryAPI.fetchFreebets(transactionId);
            this.historyData = (Array.isArray(data) ? data : []).slice().sort((a, b) => {
                const ta = new Date(a.updated_at || 0).getTime();
                const tb = new Date(b.updated_at || 0).getTime();
                return tb - ta;
            });
            this.totalPages = 1;
            this.currentPage = 1;

            this.renderHistoryCards();
        } catch (error) {
            const msg = typeof HistoryLocale !== 'undefined'
                ? (HistoryLocale.t('failedToLoadPfrRounds') || HistoryLocale.t('failedToLoad'))
                : 'Failed to load PFR details. Please try again.';
            this.showError(msg);
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }
    
    setupIOSTouchHandling() {

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        if (!isIOS) return;

        document.body.classList.add('ios-device');

        document.addEventListener('touchmove', (e) => {

            const scrollableElement = this.findScrollableParent(e.target);
            if (!scrollableElement) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    
    findScrollableParent(element) {
        while (element && element !== document.body) {
            const style = window.getComputedStyle(element);
            const overflowY = style.overflowY || style.overflow;
            
            if (element.scrollHeight > element.clientHeight && 
                (overflowY === 'auto' || overflowY === 'scroll')) {
                return element;
            }
            
            element = element.parentNode;
        }
        return null;
    }
    
    
    updateLocalizedStrings() {
        if (typeof HistoryLocale === 'undefined') return;
        
        const mobilePrevBtn = document.getElementById('mobilePrevBtn');
        const mobileNextBtn = document.getElementById('mobileNextBtn');
        
        if (mobilePrevBtn) mobilePrevBtn.textContent = HistoryLocale.t('previous');
        if (mobileNextBtn) mobileNextBtn.textContent = HistoryLocale.t('next');
    }
    
    
    setupEventListeners() {

        const closeBtn = document.getElementById('closeBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                window.close();
            });
        }

        const mobilePrevBtn = document.getElementById('mobilePrevBtn');
        const mobileNextBtn = document.getElementById('mobileNextBtn');
        
        if (mobilePrevBtn) {
            mobilePrevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.loadHistory();
                }
            });
        }
        
        if (mobileNextBtn) {
            mobileNextBtn.addEventListener('click', () => {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                    this.loadHistory();
                }
            });
        }
        
    }
    
    
    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
        }
    }
    
    
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }
    
    
    async loadHistory() {

        if (this.isLoading) {

            return;
        }

        if (this._loadHistoryTimeout) {
            clearTimeout(this._loadHistoryTimeout);
            this._loadHistoryTimeout = null;
        }

        const page = this.currentPage;
        const limit = this.limit;

        this._loadHistoryTimeout = setTimeout(async () => {
            this._loadHistoryTimeout = null;
            
            if (this.isLoading) {

                return;
            }
        
        this.isLoading = true;
        this.showLoading();
        
        try {

                const paginationContainer = document.getElementById('mobilePaginationContainer');
                if (paginationContainer) paginationContainer.classList.remove('hidden');

                const data = await HistoryAPI.fetchHistoryList(page, limit);
            this.historyData = data;

                this.totalPages = data.length < limit ? page : page + 1;

            this.renderHistoryCards();

            this.updatePagination();
            
        } catch (error) {
            console.log(error);
            this.showError('Failed to load history. Please try again.');
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
        }, 300);
    }
    
    
    renderHistoryCards() {
        const cardsContainer = document.getElementById('historyCards');
        const cardsParentContainer = document.getElementById('historyCardsContainer');
        const paginationContainer = document.getElementById('mobilePaginationContainer');

        if (!cardsContainer) {

            return;
        }

        if (cardsParentContainer) {

            if (window.innerWidth <= 768) {
                cardsParentContainer.style.display = 'flex';
                cardsParentContainer.style.flexDirection = 'column';
                cardsParentContainer.style.overflow = 'visible';
            } else {
                cardsParentContainer.style.display = 'block';
            }
        }

        if (paginationContainer) {
            paginationContainer.style.display = 'flex';
            paginationContainer.style.visibility = 'visible';
            paginationContainer.style.opacity = '1';
            paginationContainer.style.position = 'relative';
            paginationContainer.style.zIndex = '10';
            paginationContainer.style.overflow = 'visible';
            paginationContainer.style.maxHeight = 'none';
            paginationContainer.style.flexShrink = '0';
            paginationContainer.style.flexGrow = '0';

        } else {

        }
        
        cardsContainer.innerHTML = '';
        
        if (!this.historyData || this.historyData.length === 0) {

            const emptyCard = document.createElement('div');
            emptyCard.className = 'history-card';
            emptyCard.innerHTML = '<div style="text-align: center; padding: 40px; color: #888;">No history found</div>';
            cardsContainer.appendChild(emptyCard);

            if (paginationContainer) {
                paginationContainer.style.display = 'flex';
            }
            return;
        }

        this.historyData.forEach((item, index) => {
            const card = this.createHistoryCard(item);
            if (card) {
                cardsContainer.appendChild(card);

            } else {

            }
        });

        if (cardsContainer && window.innerWidth <= 768) {

            void cardsContainer.offsetHeight;

            const scrollTop = cardsContainer.scrollTop;
            cardsContainer.scrollTop = 1;
            cardsContainer.scrollTop = scrollTop;

            cardsContainer.style.overflowY = 'scroll';
            cardsContainer.style.webkitOverflowScrolling = 'touch';
        }

        this.updatePagination();
    }
    
    
    updateCardMultiplier(card, sessionData) {

        const multiplierValueEl = card.querySelector('.history-card-value.multiplier');
        if (!multiplierValueEl) {

            return;
        }

        const cumulativeMultiplier = sessionData.current_round?.cumulative_multiplier || 
                                     sessionData.cumulative_multiplier || 0;
        const multiplierText = cumulativeMultiplier > 0 ? cumulativeMultiplier + 'X' : '-';
        multiplierValueEl.textContent = multiplierText;

        if (cumulativeMultiplier > 0) {
            multiplierValueEl.style.color = '#f58742';
            multiplierValueEl.style.fontWeight = 'bold';
        } else {
            multiplierValueEl.style.color = 'var(--text-secondary)';
            multiplierValueEl.style.fontWeight = 'normal';
        }

    }
    
    
    async updateMultipliersForVisibleCards() {
        const cardsContainer = document.getElementById('historyCards');
        if (!cardsContainer) return;
        
        const cards = cardsContainer.querySelectorAll('.history-card');

        const updatePromises = Array.from(cards).map(async (card) => {
            const roundId = card.dataset.roundId;
            if (!roundId) return;
            
            try {

                const item = this.historyData.find(i => i.id === roundId);
                if (!item) return;
                
                const currency = item.currency || 'try';

                const sessionData = await HistoryAPI.fetchSessionDetails(roundId, currency);

                this.updateCardMultiplier(card, sessionData);
            } catch (error) {

            }
        });

        Promise.all(updatePromises).then(() => {

        }).catch(error => {

        });
    }
    
    
    createHistoryCard(item) {
        const card = document.createElement('div');
        card.className = 'history-card';
        card.dataset.roundId = item.id;
        card.dataset.expanded = 'false';

        const cumulativeMultiplier = item.cumulative_multiplier || item.cumulativeMultiplier || 0;
        const multiplier = cumulativeMultiplier > 0 ? cumulativeMultiplier.toString() : '-';

        const header = document.createElement('div');
        header.className = 'history-card-header';
        
        const date = document.createElement('div');
        date.className = 'history-card-date';
        date.textContent = HistoryAPI.formatDate(item.updated_at);
        
        const roundId = document.createElement('div');
        roundId.className = 'history-card-round-id';
        roundId.textContent = `ID: ${item.id.substring(0, 16)}...`;
        roundId.style.position = 'relative';
        roundId.style.cursor = 'pointer';
        roundId.title = item.id;

        let tooltip = null;
        const showTooltip = () => {

            if (tooltip) {
                tooltip.remove();
            }

            tooltip = document.createElement('div');
            tooltip.className = 'session-id-tooltip';
            tooltip.textContent = item.id;
            tooltip.style.position = 'absolute';
            tooltip.style.bottom = '100%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.background = 'var(--bg-tertiary)';
            tooltip.style.color = 'var(--text-primary)';
            tooltip.style.padding = '8px 12px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '12px';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.zIndex = '1000';
            tooltip.style.border = '1px solid var(--border-color)';
            tooltip.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
            tooltip.style.marginBottom = '5px';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.maxWidth = '400px';
            tooltip.style.overflow = 'hidden';
            tooltip.style.textOverflow = 'ellipsis';
            
            roundId.appendChild(tooltip);
        };
        
        const hideTooltip = () => {
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
        };

        roundId.addEventListener('mouseenter', showTooltip);
        roundId.addEventListener('mouseleave', hideTooltip);
        roundId.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            showTooltip();
        });
        roundId.addEventListener('touchend', (e) => {
            e.stopPropagation();

            setTimeout(hideTooltip, 2000);
        });

        roundId.addEventListener('click', async (e) => {
            e.stopPropagation();
            hideTooltip();
            try {
                await navigator.clipboard.writeText(item.id);

                const feedback = document.createElement('div');
                const copiedText = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('copied') : 'Copied!';
                feedback.textContent = copiedText;
                feedback.style.position = 'absolute';

                const clickY = e.offsetY || (e.clientY - roundId.getBoundingClientRect().top);
                const clickX = e.offsetX || (e.clientX - roundId.getBoundingClientRect().left);
                feedback.style.top = (clickY - 30) + 'px';
                feedback.style.left = clickX + 'px';
                feedback.style.transform = 'translateX(-50%)';
                feedback.style.background = 'var(--accent-color)';
                feedback.style.color = 'var(--text-primary)';
                feedback.style.padding = '4px 8px';
                feedback.style.borderRadius = '4px';
                feedback.style.fontSize = '11px';
                feedback.style.zIndex = '1001';
                feedback.style.pointerEvents = 'none';
                feedback.style.whiteSpace = 'nowrap';
                roundId.appendChild(feedback);
                
                setTimeout(() => {
                    feedback.remove();
                }, 1000);
            } catch (err) {

            }
        });
        
        header.appendChild(date);
        header.appendChild(roundId);

        const body = document.createElement('div');
        body.className = 'history-card-body';

        const betItem = document.createElement('div');
        betItem.className = 'history-card-item history-card-item-bet';
        const betLabel = document.createElement('div');
        betLabel.className = 'history-card-label';
        betLabel.textContent = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('betLabel') : 'Bet';
        const betValue = document.createElement('div');
        betValue.className = 'history-card-value';

        if (item.IsPfr) {
            betValue.textContent = '_';
        } else {

            const normalizedWagerStr = HistoryAPI.getNormalizedTotalWager(item.wager || 0);
            const normalizedWager = parseFloat(normalizedWagerStr) || 0;
            const wagerAmount = normalizedWager * 1000;
            betValue.textContent = normalizedWager > 0 ? HistoryAPI.formatCurrency(wagerAmount, item.currency, this.getLocale()) : '-';
        }
        betItem.appendChild(betLabel);
        betItem.appendChild(betValue);

        const winItem = document.createElement('div');
        winItem.className = 'history-card-item';
        const winLabel = document.createElement('div');
        winLabel.className = 'history-card-label';
        winLabel.textContent = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('winLabel') : 'Win';
        const winValue = document.createElement('div');
        winValue.className = 'history-card-value win';
        if (item._fromSession) {
            const winBase = (item.win_amount || 0) / 100;
            winValue.textContent = HistoryAPI.formatCurrency(winBase * 1000, item.currency, this.getLocale());
        } else {
            winValue.textContent = HistoryAPI.formatCurrency(item.win_amount || 0, item.currency, this.getLocale());
        }
        winItem.appendChild(winLabel);
        winItem.appendChild(winValue);

        const multiplierItem = document.createElement('div');
        multiplierItem.className = 'history-card-item';
        const multiplierLabel = document.createElement('div');
        multiplierLabel.className = 'history-card-label';
        multiplierLabel.textContent = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('winX') : 'WinX';
        const multiplierValueEl = document.createElement('div');
        multiplierValueEl.className = 'history-card-value multiplier';

        const multiplierDisplay = multiplier === '-' ? '-' : `${multiplier}X`;
        multiplierValueEl.textContent = multiplierDisplay;
        multiplierItem.appendChild(multiplierLabel);
        multiplierItem.appendChild(multiplierValueEl);

        const balanceItem = document.createElement('div');
        balanceItem.className = 'history-card-item history-card-item-balance';
        const balanceLabel = document.createElement('div');
        balanceLabel.className = 'history-card-label';
        balanceLabel.textContent = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('balanceLabel') : 'Balance';
        const balanceValue = document.createElement('div');
        balanceValue.className = 'history-card-value';

        if (this.isSingleRecordPage) {

            balanceValue.textContent = '_';
        } else if (item._fromSession) {
            const currency = item.currency || 'try';
            const playerBalance = typeof item.player_balance === 'number' ? item.player_balance : null;
            const winBase = (item.win_amount || 0) / 100;
            let betBase = 0;
            try {
                const normalizedWagerStr = HistoryAPI.getNormalizedTotalWager(item.wager || 0);
                betBase = parseFloat(normalizedWagerStr) || 0;
            } catch (e) {
                betBase = 0;
            }
            if (playerBalance !== null) {
                const finalBalance = playerBalance + winBase - betBase;
                balanceValue.textContent = HistoryAPI.formatCurrency(finalBalance * 1000, currency, this.getLocale());
            } else {
                balanceValue.textContent = '-';
            }
        } else {
            balanceValue.textContent = HistoryAPI.formatCurrency(item.final_award || item.balance, item.currency, this.getLocale());
        }
        balanceItem.appendChild(balanceLabel);
        balanceItem.appendChild(balanceValue);

        const typeItem = document.createElement('div');
        typeItem.className = 'history-card-item';
        const typeLabel = document.createElement('div');
        typeLabel.className = 'history-card-label';
        typeLabel.textContent = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('type') : 'Type';
        const typeValue = document.createElement('div');
        typeValue.className = 'history-card-value';
        let typeText = 'NORMAL';
        if (item.IsPfr) {
            typeText = 'PFR';
        }
        else if (item.is_buy_feature) {

            typeText = 'BUY';
        }
        else if (item.features) {
            typeText = 'GOLD-REWARD';/* gold */
        }
        else if (item.is_normal_spin) {
            typeText = 'NORMAL';
        } 
        else if(item.is_buy_super_feature) {
            typeText = 'SUPER-BUY';
        }
        else if (item.is_bonus && !item.is_normal_spin && !item.is_buy_feature) {
            typeText = 'BONUS';
        }
        typeValue.textContent = typeText;
        typeValue.classList.add(`type-${typeText.toLowerCase()}`);

        if (typeText === 'PFR') {
            typeValue.style.color = '#4CAF50';
        } else if (typeText === 'BONUS') {
            typeValue.style.color = '#FF9800';
        }
        else if (typeText === 'BUY') {
            typeValue.style.color = '#FF9800';
        }

        typeItem.appendChild(typeLabel);
        typeItem.appendChild(typeValue);

        body.appendChild(betItem);
        body.appendChild(winItem);
        body.appendChild(multiplierItem);
        body.appendChild(balanceItem);
        body.appendChild(typeItem);

        if (!this.isSingleRecordPage && !this.isPfrRoundsPage) {
            const linkItem = document.createElement('div');
            linkItem.className = 'history-card-item link';

            const linkLabel = document.createElement('div');
            linkLabel.className = 'history-card-label';
            linkLabel.textContent = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('link') : 'Link';

            const linkValue = document.createElement('div');
            linkValue.className = 'history-card-value';

            const generateBtn = document.createElement('button');
            generateBtn.className = 'history-card-action';
            const generateText = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('generate') : 'Generate';
            generateBtn.textContent = generateText;

            generateBtn.dataset.originalText = generateText;
            generateBtn.dataset.isProcessing = 'false';

            const stop = (e) => e.stopPropagation();
            generateBtn.addEventListener('pointerdown', stop);
            generateBtn.addEventListener('touchstart', stop, { passive: true });

            const handleClick = async (e) => {
                e.stopPropagation();
                e.preventDefault();

                if (generateBtn.dataset.isProcessing === 'true') {
                    return;
                }
                await this.handleGenerateClick(item, generateBtn);
            };

            generateBtn.addEventListener('pointerup', handleClick, { passive: false });
            generateBtn.addEventListener('touchend', handleClick, { passive: false });
            generateBtn.addEventListener('click', handleClick);

            linkValue.appendChild(generateBtn);
            linkItem.appendChild(linkLabel);
            linkItem.appendChild(linkValue);
            body.appendChild(linkItem);
        }

        if (this.isSingleRecordPage && !this.isPfrRoundsPage) {
            const replayItem = document.createElement('div');
            replayItem.className = 'history-card-item replay';

            const replayLabel = document.createElement('div');
            replayLabel.className = 'history-card-label';
            replayLabel.textContent = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('replay') : 'Replay';

            const replayValue = document.createElement('div');
            replayValue.className = 'history-card-value';

            const replayBtn = document.createElement('button');
            replayBtn.className = 'history-card-action replay-btn';
            replayBtn.type = 'button';
            replayBtn.setAttribute('aria-label', typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('replay') : 'Replay');
            replayBtn.innerHTML = '<span class="replay-btn-icon">▶</span>';

            const stop = (e) => e.stopPropagation();
            replayBtn.addEventListener('pointerdown', stop);
            replayBtn.addEventListener('touchstart', stop, { passive: true });
            const onReplay = (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.handleReplayClick(item);
            };
            replayBtn.addEventListener('pointerup', onReplay, { passive: false });
            replayBtn.addEventListener('touchend', onReplay, { passive: false });
            replayBtn.addEventListener('click', onReplay);

            replayValue.appendChild(replayBtn);
            replayItem.appendChild(replayLabel);
            replayItem.appendChild(replayValue);
            body.appendChild(replayItem);
        }

        card.appendChild(header);
        card.appendChild(body);

        let touchStartY = 0;
        let touchStartTime = 0;
        let hasMoved = false;
        let touchStartScrollTop = 0;
        let clickTimeout = null;
        let lastClickTime = 0;
        
        const handleCardClick = (e) => {

            const clickedElement = e.target;
            const isSubCard = clickedElement.closest('.bonus-sub-card');
            const isSubCardExpanded = clickedElement.closest('.expanded-card-content.bonus-sub-expanded');
            const isBonusSessionsContainer = clickedElement.closest('.bonus-sessions-container');
            
            if (isSubCard || isSubCardExpanded || isBonusSessionsContainer) {

                return;
            }

            if (hasMoved) {

                hasMoved = false;
                return;
            }

            const scrollContainer = card.closest('.history-cards');
            if (scrollContainer) {
                const currentScrollTop = scrollContainer.scrollTop;
                if (Math.abs(currentScrollTop - touchStartScrollTop) > 1) {

                    return;
                }
            }

            e.stopPropagation();

            const now = Date.now();
            if (now - lastClickTime < 300) {

                return;
            }
            lastClickTime = now;

            if (clickTimeout) {
                clearTimeout(clickTimeout);
            }

            clickTimeout = setTimeout(() => {

                this.toggleCardExpansion(card, item);
                clickTimeout = null;
            }, 50);
        };
        
        card.addEventListener('click', handleCardClick);

        card.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            hasMoved = false;

            const scrollContainer = card.closest('.history-cards');
            if (scrollContainer) {
                touchStartScrollTop = scrollContainer.scrollTop;
            }
        }, { passive: true });
        
        card.addEventListener('touchmove', (e) => {

            if (touchStartY !== 0) {
                const deltaY = Math.abs(e.touches[0].clientY - touchStartY);

                if (deltaY > 5) {
                    hasMoved = true;
                }

                const scrollContainer = card.closest('.history-cards');
                if (scrollContainer) {
                    const currentScrollTop = scrollContainer.scrollTop;

                    if (Math.abs(currentScrollTop - touchStartScrollTop) > 1) {
                        hasMoved = true;
                    }
                }
            }
        }, { passive: true });
        
        card.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);

            const scrollContainer = card.closest('.history-cards');
            let parentScrolled = false;
            if (scrollContainer) {
                const currentScrollTop = scrollContainer.scrollTop;

                parentScrolled = Math.abs(currentScrollTop - touchStartScrollTop) > 1;
            }

            if (!hasMoved && !parentScrolled && deltaY < 5 && touchDuration < 300) {
                e.preventDefault();
                handleCardClick(e);
            } else {

            }

            touchStartY = 0;
            touchStartTime = 0;
            touchStartScrollTop = 0;
            hasMoved = false;
        }, { passive: false });

        card.style.cursor = 'pointer';
        card.style.touchAction = 'manipulation';
        
        return card;
    }

    handleReplayClick(item) {
        const roundId = item && (item.id || item.round_id);
        if (!roundId) return;
        const urlParams = HistoryAPI.getURLParams();
        const locale = urlParams.userLocale || (typeof this.getLocale === 'function' ? this.getLocale() : null) || (typeof HistoryLocale !== 'undefined' && HistoryLocale.currentLocale) || 'en';
        var origin = window.location.origin;
        if (!origin.includes("localhost")) {
          origin = origin + "/" +  window.location.pathname.split('/')[1];
        }
        var url = origin + "/?user_locale=" + locale + "&round_id=" + roundId + "&is_replay=" + true;

        const openReplay = () => window.open(url, '_blank');
        const stashAndOpen = (data) => {
            try {
                if (data) {
                    localStorage.setItem('ng_replay_prefetch', JSON.stringify({
                        roundId: String(roundId),
                        fetchedAt: Date.now(),
                        data: data
                    }));
                }
            } catch (e) { /* ignore quota / private mode */ }
            openReplay();
        };

        if (HistoryAPI && typeof HistoryAPI.fetchSessionDetails === 'function') {
            HistoryAPI.fetchSessionDetails(roundId, item.currency)
                .then(stashAndOpen)
                .catch(openReplay);
        } else {
            openReplay();
        }
    }

    
    async handleGenerateClick(item, btn) {
        if (!btn) return;

        if (btn.dataset.isProcessing === 'true') {
            return;
        }
        
        btn.dataset.isProcessing = 'true';
        
        const roundId = item.id;
        const urlParams = HistoryAPI.getURLParams();
        const currency = item.currency || urlParams.currency || 'try';

        const toCopy = (HistoryAPI.buildSingleRecordUrl)
            ? HistoryAPI.buildSingleRecordUrl(roundId, currency, urlParams.userLocale)
            : HistoryAPI.buildRoundUrls(roundId, currency, urlParams.userLocale).localUrl;

        const originalText = btn.dataset.originalText || (typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('generate') : 'Generate');
        const copiedText = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('copied') : 'Copied!';

        if (btn._resetTimeout) {
            clearTimeout(btn._resetTimeout);
            btn._resetTimeout = null;
        }
        
        try {
            btn.disabled = true;
            await HistoryAPI.copyToClipboard(toCopy);
            btn.textContent = copiedText;
        } catch (e) {

            btn.textContent = originalText;
            btn.disabled = false;
            btn.dataset.isProcessing = 'false';
            return;
        }

        btn._resetTimeout = setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.dataset.isProcessing = 'false';
            btn._resetTimeout = null;
        }, 2000);
    }
    
    
    async toggleCardExpansion(card, item) {

        if (card.dataset.isToggling === 'true') {

            return;
        }
        
        const isExpanded = card.dataset.expanded === 'true';
        const isExpanding = card.dataset.isExpanding === 'true';

        if (isExpanded || isExpanding) {

            card.dataset.isToggling = 'true';
            this.collapseCard(card);

            setTimeout(() => {
                card.dataset.isToggling = 'false';
            }, 600);
        } else {

            const existingExpanded = card.querySelector('.expanded-card-content');
            if (existingExpanded) {

                return;
            }

            const allCards = document.querySelectorAll('#historyCards .history-card');
            allCards.forEach(c => {
                if (c !== card && c.dataset.expanded === 'true') {
                    this.collapseCard(c);
                }
            });

            card.dataset.isToggling = 'true';
            card.dataset.isExpanding = 'true';

            this.removeExpandedCardContents(card);
            await this.expandCard(card, item);
            card.dataset.isToggling = 'false';
        }
    }

    
    removeExpandedCardContents(card) {
        if (!card) return;
        const expandedContents = card.querySelectorAll('.expanded-card-content');
        if (expandedContents.length) {
            expandedContents.forEach(el => el.remove());
            if (typeof HistoryReplay !== 'undefined' && HistoryReplay.stop) {
                HistoryReplay.stop();
            }
        }
    }
    
    
    async expandCard(card, item) {

        if (card.dataset.expanded === 'true') {

            card.dataset.isExpanding = 'false';
            return;
        }

        const existingExpanded = card.querySelector('.expanded-card-content:not(.loading-logo)');
        if (existingExpanded && existingExpanded.classList.contains('active')) {

            card.dataset.expanded = 'true';
            card.dataset.isExpanding = 'false';
            return;
        }

        const isBonusOrBuy = item.is_bonus || item.is_buy_feature;

        try {
            if (isBonusOrBuy) {

                await this.expandBonusCard(card, item);
            } else {

                await this.expandNormalCard(card, item);
            }
        } catch (error) {

            card.dataset.isExpanding = 'false';
            throw error;
        }
    }
    
    
    async expandNormalCard(card, item, sessionDataOverride = null) {

        if (card.dataset.expanded === 'true') {

            card.dataset.isExpanding = 'false';
            return;
        }

        const existingExpanded = card.querySelector('.expanded-card-content.active');
        if (existingExpanded && !existingExpanded.querySelector('.loading-logo')) {

            card.dataset.expanded = 'true';
            card.dataset.isExpanding = 'false';
            return;
        }

        this.removeExpandedCardContents(card);

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'expanded-card-content';
        const logoPath = getLogoPath();
        loadingDiv.innerHTML = `<img src="${logoPath}" alt="SUGARBOX 5000 GOLD Logo" class="loading-logo">`;
        card.appendChild(loadingDiv);

        setTimeout(() => {
            loadingDiv.classList.add('active');
        }, 10);
        
        try {

            const sessionData = sessionDataOverride || await HistoryAPI.fetchSessionDetails(item.id, item.currency);

            if (card.dataset.expanded === 'true' || !card.parentNode) {

                if (loadingDiv.parentNode) {
                    loadingDiv.remove();
                }
                card.dataset.isExpanding = 'false';
                return;
            }

            if (loadingDiv.parentNode) {
                loadingDiv.classList.remove('active');
                setTimeout(() => {
                    if (loadingDiv.parentNode) {
                        loadingDiv.parentNode.removeChild(loadingDiv);
                    }
                }, 500);
            }

            if (card.dataset.expanded === 'true') {

                card.dataset.isExpanding = 'false';
                return;
            }

            const expandedContent = this.createExpandedCardContent(sessionData, item);
            card.appendChild(expandedContent);

            card.dataset.expanded = 'true';
            card.dataset.isExpanding = 'false';

            setTimeout(() => {
                expandedContent.classList.add('active');
            }, 10);

            HistoryReplay.init(sessionData, item.currency);

            const reelsContainer = expandedContent.querySelector('.reels-container');
            HistoryReplay.startInlineDual(reelsContainer);
            
        } catch (error) {

            card.dataset.isExpanding = 'false';

            if (loadingDiv.parentNode) {
                loadingDiv.classList.remove('active');
                setTimeout(() => {
                    if (loadingDiv.parentNode) {
                        loadingDiv.parentNode.removeChild(loadingDiv);
                    }
                }, 500);
            }

            if (card.parentNode && card.dataset.expanded !== 'true') {

                const expandedContent = this.createExpandedCardContent(null, item, error);
                card.appendChild(expandedContent);
                card.dataset.expanded = 'true';

                setTimeout(() => {
                    expandedContent.classList.add('active');
                }, 10);
            }
        }
    }
    
    
    async expandBonusCard(card, item) {

        if (card.dataset.expanded === 'true') {

            card.dataset.isExpanding = 'false';
            return;
        }

        const existingExpanded = card.querySelector('.expanded-card-content.bonus-sessions-container.active');
        if (existingExpanded) {

            card.dataset.expanded = 'true';
            card.dataset.isExpanding = 'false';
            return;
        }

        this.removeExpandedCardContents(card);

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'expanded-card-content';
        const logoPath = getLogoPath();
        loadingDiv.innerHTML = `<img src="${logoPath}" alt="SUGARBOX 5000 GOLD Logo" class="loading-logo">`;
        card.appendChild(loadingDiv);

        setTimeout(() => {
            loadingDiv.classList.add('active');
        }, 10);
        
        try {

            const sessionsArray = Array.isArray(item._sessionsArray)
                ? item._sessionsArray
                : await HistoryAPI.fetchBonusSessions(item.id, item.currency);

            if (card.dataset.expanded === 'true' || !card.parentNode) {

                if (loadingDiv.parentNode) {
                    loadingDiv.remove();
                }
                card.dataset.isExpanding = 'false';
                return;
            }

            if (loadingDiv.parentNode) {
                loadingDiv.classList.remove('active');
                setTimeout(() => {
                    if (loadingDiv.parentNode) {
                        loadingDiv.parentNode.removeChild(loadingDiv);
                    }
                }, 500);
            }

            if (card.dataset.expanded === 'true') {

                card.dataset.isExpanding = 'false';
                return;
            }

            const expandedContent = this.createBonusExpandedCardContent(sessionsArray, item);
            card.appendChild(expandedContent);

            card.dataset.expanded = 'true';
            card.dataset.isExpanding = 'false';

            setTimeout(() => {
                expandedContent.classList.add('active');

                const subCardsContainer = expandedContent.querySelector('.bonus-sub-cards-container');
                if (subCardsContainer) {

                    setTimeout(() => {
                        this.fixIOSTouchScrolling(subCardsContainer);
                    }, 100);
                }
            }, 10);
            
        } catch (error) {

            card.dataset.isExpanding = 'false';

            if (loadingDiv.parentNode) {
                loadingDiv.classList.remove('active');
                setTimeout(() => {
                    if (loadingDiv.parentNode) {
                        loadingDiv.parentNode.removeChild(loadingDiv);
                    }
                }, 500);
            }

            if (card.parentNode && card.dataset.expanded !== 'true') {

                const expandedContent = this.createExpandedCardContent(null, item, error);
                card.appendChild(expandedContent);
                card.dataset.expanded = 'true';

                setTimeout(() => {
                    expandedContent.classList.add('active');
                }, 10);
            }
        }
    }
    
    
    createBonusExpandedCardContent(sessionsArray, item) {
        const expandedContent = document.createElement('div');
        expandedContent.className = 'expanded-card-content bonus-sessions-container';

        const subCardsContainer = document.createElement('div');
        subCardsContainer.className = 'bonus-sub-cards-container';

        const parentCurrency = item.currency || 'try';

        const isParentBuyOrBonus = item.is_buy_feature || (item.is_bonus && !item.is_normal_spin);
        sessionsArray.forEach((sessionData, index) => {

            const subCard = this.createBonusSubCard(sessionData, index, parentCurrency, isParentBuyOrBonus);

            subCard._parentItem = item;
            subCardsContainer.appendChild(subCard);
        });

        expandedContent.appendChild(subCardsContainer);

        this.fixIOSTouchScrolling(subCardsContainer);
        
        return expandedContent;
    }
    
    
    createBonusSubCard(sessionData, index, parentCurrency, isParentBuyOrBonus = false) {
        const card = document.createElement('div');
        card.className = 'history-card bonus-sub-card';

        if (isParentBuyOrBonus) {
            card.classList.add('is-buy-spin');
        }
        card.dataset.sessionIndex = index;
        card.dataset.expanded = 'false';
        
        const roundId = sessionData.current_round?.round_id || '';

        const currency = parentCurrency || 
            sessionData.player?.currency || 
            sessionData.current_round?.game_extra_info?.currency || 
            'try';
        const winAmountInCents = sessionData.current_round?.win_amount || 0;
        const winAmount = winAmountInCents / 100;
        const wager = sessionData.current_round?.wager || 0;

        let multiplier = 0;

        if (sessionData.current_round?.cumulative_multiplier) {
            multiplier = sessionData.current_round.cumulative_multiplier;
        } else if (sessionData.cumulative_multiplier) {
            multiplier = sessionData.cumulative_multiplier;
        } else {

            if (typeof HistoryReplay !== 'undefined' && HistoryReplay.getMultiplier) {
                multiplier = HistoryReplay.getMultiplier(sessionData);
            } else {

                if (sessionData.current_round?.post_matrix_info?.multiplier) {
                    const postMatrixInfo = sessionData.current_round.post_matrix_info;
                    if (Array.isArray(postMatrixInfo.multiplier)) {
                        multiplier = postMatrixInfo.multiplier.reduce((sum, val) => sum + (parseInt(val) || 0), 0);
                    } else {
                        multiplier = parseInt(postMatrixInfo.multiplier) || 0;
                    }
                }
            }

            if (multiplier === 0 && wager > 0) {
                multiplier = winAmountInCents / wager;
            }
        }

        const multiplierInt = Math.round(multiplier);
        const multiplierText = multiplierInt > 0 ? multiplierInt.toString() : '-';
        
        const balance = sessionData.player?.balance || sessionData.player?.cash || 0;

        const header = document.createElement('div');
        header.className = 'history-card-header';
        
        const date = document.createElement('div');
        date.className = 'history-card-date';
        date.textContent = `Spin ${index + 1}`;
        
        header.appendChild(date);

        const body = document.createElement('div');
        body.className = 'history-card-body';

        const betItem = document.createElement('div');
        betItem.className = 'history-card-item history-card-item-bet';
        const betLabel = document.createElement('div');
        betLabel.className = 'history-card-label';
        betLabel.textContent = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('betLabel') : 'Bet';
        const betValue = document.createElement('div');
        betValue.className = 'history-card-value';

        const normalizedWagerStr = HistoryAPI.getNormalizedTotalWager(wager);
        const normalizedWager = parseFloat(normalizedWagerStr) || 0;
        const wagerAmount = normalizedWager * 1000;
        betValue.textContent = HistoryAPI.formatCurrency(wagerAmount, currency, this.getLocale());
        betItem.appendChild(betLabel);
        betItem.appendChild(betValue);

        const winItem = document.createElement('div');
        winItem.className = 'history-card-item';
        const winLabel = document.createElement('div');
        winLabel.className = 'history-card-label';
        winLabel.textContent = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('winLabel') : 'Win';
        const winValue = document.createElement('div');
        winValue.className = 'history-card-value win';
        winValue.textContent = HistoryAPI.formatCurrency(winAmount * 1000, currency, this.getLocale());
        winItem.appendChild(winLabel);
        winItem.appendChild(winValue);

        const multiplierItem = document.createElement('div');
        multiplierItem.className = 'history-card-item';
        const multiplierLabel = document.createElement('div');
        multiplierLabel.className = 'history-card-label';
        multiplierLabel.textContent = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('winX') : 'WinX';
        const multiplierValueEl = document.createElement('div');
        multiplierValueEl.className = 'history-card-value multiplier';

        const multiplierDisplay = multiplierText === '-' ? '-' : `${multiplierText}X`;
        multiplierValueEl.textContent = multiplierDisplay;
        multiplierItem.appendChild(multiplierLabel);
        multiplierItem.appendChild(multiplierValueEl);

        const balanceItem = document.createElement('div');
        balanceItem.className = 'history-card-item history-card-item-balance';
        const balanceLabel = document.createElement('div');
        balanceLabel.className = 'history-card-label';
        balanceLabel.textContent = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('balanceLabel') : 'Balance';
        const balanceValue = document.createElement('div');
        balanceValue.className = 'history-card-value';
        balanceValue.textContent = HistoryAPI.formatCurrency(balance * 1000, currency, this.getLocale());
        balanceItem.appendChild(balanceLabel);
        balanceItem.appendChild(balanceValue);
        
        body.appendChild(betItem);
        body.appendChild(winItem);
        body.appendChild(multiplierItem);
        body.appendChild(balanceItem);

        card.appendChild(header);
        card.appendChild(body);

        let lastSubCardClickTime = 0;
        let touchStartTime = 0;
        let touchStartY = 0;
        let hasMoved = false;
        
        const handleSubCardToggle = (e) => {

            e.stopPropagation();
            e.preventDefault();

            const now = Date.now();
            if (now - lastSubCardClickTime < 300) {

                return;
            }
            lastSubCardClickTime = now;

                this.toggleBonusSubCardExpansion(card, sessionData);
        };

        card.addEventListener('click', handleSubCardToggle);

        card.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartY = e.touches[0].clientY;
            hasMoved = false;

        }, { passive: true });
        
        card.addEventListener('touchmove', (e) => {
            if (touchStartY !== 0) {
                const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
                if (deltaY > 10) {
                    hasMoved = true;
                }
            }
        }, { passive: true });
        
        card.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);

            if (!hasMoved && deltaY < 10 && touchDuration < 300) {
                e.preventDefault();
                e.stopPropagation();
                handleSubCardToggle(e);
            }

            touchStartTime = 0;
            touchStartY = 0;
            hasMoved = false;
        }, { passive: false });

        card.style.cursor = 'pointer';

        card.style.touchAction = 'manipulation';
        card.style.pointerEvents = 'auto';
        card.style.webkitTapHighlightColor = 'transparent';
        card.style.position = 'relative';
        card.style.zIndex = '2';

        card._sessionData = sessionData;
        
        return card;
    }
    
    
    async toggleBonusSubCardExpansion(card, sessionData) {

        if (card.dataset.isToggling === 'true') {

            return;
        }

        const existingActiveExpanded = card.querySelector('.expanded-card-content.bonus-sub-expanded.active');
        const hasActiveExpanded = !!existingActiveExpanded;

        const isExpanded = card.dataset.expanded === 'true';
        const isExpanding = card.dataset.isExpanding === 'true';

        if (hasActiveExpanded || (isExpanded && !isExpanding)) {

            card.dataset.isToggling = 'true';
            this.collapseBonusSubCard(card);
            setTimeout(() => {
                card.dataset.isToggling = 'false';
            }, 600);
        } else {

            const existingInactive = card.querySelectorAll('.expanded-card-content.bonus-sub-expanded:not(.active)');
            existingInactive.forEach(el => {

                el.remove();
            });

            const allSubCards = document.querySelectorAll('.bonus-sub-card');
            allSubCards.forEach(c => {
                if (c !== card) {
                    const otherHasActive = c.querySelector('.expanded-card-content.bonus-sub-expanded.active');
                    const otherIsExpanded = c.dataset.expanded === 'true';
                    if (otherHasActive || otherIsExpanded) {

                    this.collapseBonusSubCard(c);
                    }
                }
            });

            card.dataset.isToggling = 'true';
            card.dataset.isExpanding = 'true';
            await this.expandBonusSubCard(card, sessionData);
            card.dataset.isToggling = 'false';
        }
    }
    
    
    async expandBonusSubCard(card, sessionData) {

        if (card.dataset.expanded === 'true') {

            card.dataset.isExpanding = 'false';
            return;
        }

        const existingExpanded = card.querySelector('.expanded-card-content.bonus-sub-expanded.active');
        if (existingExpanded) {

            card.dataset.expanded = 'true';
            card.dataset.isExpanding = 'false';
            return;
        }

        const existingContent = card.querySelectorAll('.expanded-card-content');
        existingContent.forEach(el => el.remove());

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'expanded-card-content bonus-sub-expanded';
        const logoPath = getLogoPath();
        loadingDiv.innerHTML = `<img src="${logoPath}" alt="SUGARBOX 5000 GOLD Logo" class="loading-logo">`;
        card.appendChild(loadingDiv);

        setTimeout(() => {
            loadingDiv.classList.add('active');
        }, 10);
        
        try {

            if (card.dataset.expanded === 'true' || !card.parentNode) {

                if (loadingDiv.parentNode) {
                    loadingDiv.remove();
                }
                card.dataset.isExpanding = 'false';
                return;
            }

            if (loadingDiv.parentNode) {
                loadingDiv.classList.remove('active');
                setTimeout(() => {
                    if (loadingDiv.parentNode) {
                        loadingDiv.parentNode.removeChild(loadingDiv);
                    }
                }, 500);
            }

            if (card.dataset.expanded === 'true') {

                card.dataset.isExpanding = 'false';
                return;
            }

            const expandedContent = this.createExpandedCardContent(sessionData, null);
            expandedContent.classList.add('bonus-sub-expanded');
            card.appendChild(expandedContent);

            card.dataset.expanded = 'true';
            card.dataset.isExpanding = 'false';

            setTimeout(() => {
                expandedContent.classList.add('active');
            }, 10);

            const currency = card._parentItem?.currency || 
                           sessionData?.player?.currency || 
                           sessionData?.current_round?.game_extra_info?.currency || 
                           'try';
            HistoryReplay.init(sessionData, currency);

            const reelsContainer = expandedContent.querySelector('.reels-container');
            HistoryReplay.startInlineDual(reelsContainer);
            
        } catch (error) {

            card.dataset.isExpanding = 'false';

            if (loadingDiv.parentNode) {
                loadingDiv.classList.remove('active');
                setTimeout(() => {
                    if (loadingDiv.parentNode) {
                        loadingDiv.parentNode.removeChild(loadingDiv);
                    }
                }, 500);
            }

            if (card.parentNode && card.dataset.expanded !== 'true') {

                const expandedContent = this.createExpandedCardContent(null, null, error);
                expandedContent.classList.add('bonus-sub-expanded');
                card.appendChild(expandedContent);
                card.dataset.expanded = 'true';

                setTimeout(() => {
                    expandedContent.classList.add('active');
                }, 10);
            }
        }
    }
    
    
    collapseBonusSubCard(card) {

        card.dataset.expanded = 'false';
        card.dataset.isExpanding = 'false';
        card.dataset.isToggling = 'false';

        const expandedContents = card.querySelectorAll('.expanded-card-content.bonus-sub-expanded');
        expandedContents.forEach(expandedContent => {

            expandedContent.classList.remove('active');

            setTimeout(() => {
                if (expandedContent.parentNode) {
                    expandedContent.remove();
                }
            }, 500);
        });

        HistoryReplay.stop();

    }
    
    
    collapseCard(card) {

        card.dataset.expanded = 'false';
        card.dataset.isExpanding = 'false';
        card.dataset.isToggling = 'false';

        const expandedContents = card.querySelectorAll('.expanded-card-content');
        expandedContents.forEach(expandedContent => {
            expandedContent.classList.remove('active');
            setTimeout(() => {
                if (expandedContent.parentNode) {
                    expandedContent.remove();
                }
            }, 500);
        });

        HistoryReplay.stop();

    }
    
    
    createExpandedCardContent(sessionData, item, error = null) {
        const expandedContent = document.createElement('div');
        expandedContent.className = 'expanded-card-content';
        
        if (error) {
            const errorText = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('failedToLoadSpin') : 'Failed to load spin details. Please try again.';
            expandedContent.innerHTML = `<div style="padding: 20px; color: #ff4444;">${errorText}</div>`;
        } else {

            const spinSection = document.createElement('div');
            spinSection.className = 'spin-section';
            
            const spinLabel = document.createElement('div');
            spinLabel.className = 'spin-label';
            spinLabel.textContent = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('spin') : 'Spin';
            spinSection.appendChild(spinLabel);

            const reelsContainer = document.createElement('div');
            reelsContainer.className = 'reels-container';
            if (item && item.id) {
                reelsContainer.dataset.roundId = item.id;
            } else if (sessionData && sessionData.current_round && sessionData.current_round.round_id) {
                reelsContainer.dataset.roundId = sessionData.current_round.round_id;
            }

            
            spinSection.appendChild(reelsContainer);

            
            expandedContent.appendChild(spinSection);
        }
        
        return expandedContent;
    }
    
    
    updatePagination() {
        const mobilePrevBtn = document.getElementById('mobilePrevBtn');
        const mobileNextBtn = document.getElementById('mobileNextBtn');
        const mobilePageNumbers = document.getElementById('mobilePageNumbers');
        const paginationContainer = document.getElementById('mobilePaginationContainer');

        if (paginationContainer) {
            paginationContainer.style.display = 'flex';
            paginationContainer.style.visibility = 'visible';
            paginationContainer.style.opacity = '1';
            paginationContainer.style.position = 'relative';
            paginationContainer.style.zIndex = '10';
            paginationContainer.style.overflow = 'visible';
            paginationContainer.style.maxHeight = 'none';
            paginationContainer.style.flexShrink = '0';
            paginationContainer.style.flexGrow = '0';
            paginationContainer.style.width = '100%';

            paginationContainer.style.webkitTransform = 'translateZ(0)';
            paginationContainer.style.transform = 'translateZ(0)';

        } else {

        }

        if (this.totalPages <= 1) {
            if (paginationContainer) {
                paginationContainer.style.display = 'none';
            }
            return;
        }
        
        if (mobilePrevBtn) {
            mobilePrevBtn.disabled = this.currentPage === 1;
        }
        
        if (mobileNextBtn) {
            mobileNextBtn.disabled = this.currentPage >= this.totalPages;
        }
        
        if (mobilePageNumbers) {
            mobilePageNumbers.innerHTML = '';

            const startPage = Math.max(1, this.currentPage - 1);
            const endPage = Math.min(this.totalPages, this.currentPage + 1);
            
            for (let i = startPage; i <= endPage; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = 'page-number';
                if (i === this.currentPage) {
                    pageBtn.classList.add('active');
                }
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', () => {
                    this.currentPage = i;
                    this.loadHistory();
                });
                mobilePageNumbers.appendChild(pageBtn);
            }
        }

    }
    
    
    fixIOSTouchScrolling(scrollableContainer) {
        if (!scrollableContainer) return;

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        
        if (!isIOS) return;

        scrollableContainer.style.webkitOverflowScrolling = 'touch';
        scrollableContainer.style.touchAction = 'pan-y';
        scrollableContainer.style.position = 'relative';

        scrollableContainer.style.webkitTransform = 'translateZ(0)';
        scrollableContainer.style.transform = 'translateZ(0)';

        scrollableContainer.addEventListener('touchstart', (e) => {

            const isCard = e.target.closest('.bonus-sub-card');
            if (isCard) {

                return;
            }

            const isDirectContainerTouch = e.target === scrollableContainer || 
                                          e.target.classList.contains('bonus-sub-cards-container');
            if (isDirectContainerTouch) {
                e.stopPropagation();
            }

            if (scrollableContainer.scrollHeight > scrollableContainer.clientHeight) {
                scrollableContainer.style.overflowY = 'scroll';
                scrollableContainer.style.webkitOverflowScrolling = 'touch';
            }
        }, { passive: true });

        scrollableContainer.addEventListener('click', (e) => {

            if (e.target === scrollableContainer) {
                e.stopPropagation();
            }
        });

        void scrollableContainer.offsetHeight;

        const originalScrollTop = scrollableContainer.scrollTop;
        scrollableContainer.scrollTop = 1;
        scrollableContainer.scrollTop = originalScrollTop;

        scrollableContainer.setAttribute('data-scrollable', 'true');

        const maintainScrollCapability = () => {

            if (scrollableContainer.scrollHeight > scrollableContainer.clientHeight) {
                scrollableContainer.style.overflowY = 'scroll';
                scrollableContainer.style.webkitOverflowScrolling = 'touch';
            }
        };

        const checkInterval = setInterval(() => {
            if (scrollableContainer.parentElement && scrollableContainer.offsetHeight > 0) {
                maintainScrollCapability();
            } else {
                clearInterval(checkInterval);
            }
        }, 500);

        const observer = new MutationObserver(() => {
            if (!scrollableContainer.parentElement) {
                clearInterval(checkInterval);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    
    showError(message) {

        const errorMsg = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('failedToLoad') : message;
        alert(errorMsg);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HistoryMobile;
}

