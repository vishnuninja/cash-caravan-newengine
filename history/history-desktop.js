
function getLogoPath() {
    return "assets/historyLogo.png";
}

class HistoryDesktop {
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

    getHistoryColSpan() {
        return (this.isSingleRecordPage || this.isPfrRoundsPage) ? 7 : 8;
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

        if (this.isPfrRoundsPage) {
            await this.loadPfrRounds(urlParams.transactionId);
        } else if (this.isSingleRoundMode) {
            await this.loadSingleRound(urlParams.roundId, urlParams.currency || 'try', { pushState: false });
        } else {
            await this.loadHistory();
        }

        this.hideLoading();
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
            const paginationContainer = document.getElementById('paginationContainer');
            if (paginationContainer) paginationContainer.classList.add('hidden');

            const data = await HistoryAPI.fetchFreebets(transactionId);
            this.historyData = (Array.isArray(data) ? data : []).slice().sort((a, b) => {
                const ta = new Date(a.updated_at || 0).getTime();
                const tb = new Date(b.updated_at || 0).getTime();
                return tb - ta;
            });
            this.totalPages = 1;
            this.currentPage = 1;

            this.renderHistoryTable();
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
    
    
    updateLocalizedStrings() {
        if (typeof HistoryLocale === 'undefined') return;
        
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.textContent = HistoryLocale.t('previous');
        if (nextBtn) nextBtn.textContent = HistoryLocale.t('next');
    }
    
    
    setupEventListeners() {

        const closeBtn = document.getElementById('closeBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                window.close();
            });
        }

        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.loadHistory();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
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
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();
        
        try {

            const paginationContainer = document.getElementById('paginationContainer');
            if (paginationContainer) paginationContainer.classList.remove('hidden');

            const data = await HistoryAPI.fetchHistoryList(this.currentPage, this.limit);
            this.historyData = data;

            this.totalPages = data.length < this.limit ? this.currentPage : this.currentPage + 1;

            this.renderHistoryTable();

            this.updatePagination();
            
        } catch (error) {

            this.showError('Failed to load history. Please try again.');
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
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

            const paginationContainer = document.getElementById('paginationContainer');
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

            this.renderHistoryTable();

            if (!this.isSingleRecordPage) {
                const tbody = document.getElementById('historyTableBody');
                const row = tbody ? tbody.querySelector('tr') : null;
                if (row) {
                    const isBonusOrBuy = (item.is_bonus && !item.is_normal_spin) || item.is_buy_feature;
                    if (isBonusOrBuy) {
                        await this.expandBonusRow(row, item);
                    } else {
                        await this.expandNormalRow(row, item, item._sessionData || sessionData);
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
    
    
    renderHistoryTable() {
        const tbody = document.getElementById('historyTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (this.historyData.length === 0) {
            const row = document.createElement('tr');
            const noHistoryText = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('noHistoryFound') : 'No history found';
            const colSpan = this.isSingleRecordPage ? 7 : 8;
            row.innerHTML = `<td colspan="${colSpan}" style="text-align: center; padding: 40px;">${noHistoryText}</td>`;
            tbody.appendChild(row);
            return;
        }
        
        this.historyData.forEach((item) => {
            const row = this.createHistoryRow(item);
            tbody.appendChild(row);
        });
    }
    
    
    updateRowMultiplier(row, sessionData) {

        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
            const multiplierCell = cells[4];

            const cumulativeMultiplier = sessionData.current_round?.cumulative_multiplier || 
                                         sessionData.cumulative_multiplier || 0;
            const multiplierText = cumulativeMultiplier > 0 ? cumulativeMultiplier + 'X' : '-';
            multiplierCell.textContent = multiplierText;
            if (cumulativeMultiplier > 0) {
                multiplierCell.style.color = '#f58742';
                multiplierCell.style.fontWeight = 'bold';
            } else {
                multiplierCell.style.color = 'var(--text-secondary)';
                multiplierCell.style.fontWeight = 'normal';
            }

        }
    }
    
    
    async updateMultipliersForVisibleRows() {
        const tbody = document.getElementById('historyTableBody');
        if (!tbody) return;
        
        const rows = tbody.querySelectorAll('tr');

        const updatePromises = Array.from(rows).map(async (row) => {
            const roundId = row.dataset.roundId;
            if (!roundId) return;
            
            try {

                const item = this.historyData.find(i => i.id === roundId);
                if (!item) return;
                
                const currency = item._sessionData.round_info.currency || 'try';

                const sessionData = await HistoryAPI.fetchSessionDetails(roundId, currency);

                this.updateRowMultiplier(row, sessionData);
            } catch (error) {

            }
        });

        Promise.all(updatePromises).then(() => {

        }).catch(error => {

        });
    }
    
    
    createHistoryRow(item) {
        const row = document.createElement('tr');
        row.dataset.roundId = item.id;
        row.dataset.expanded = 'false';

        const sessionIdCell = document.createElement('td');
        sessionIdCell.textContent = item.id.substring(0, 16) + '...';
        sessionIdCell.style.position = 'relative';
        sessionIdCell.style.cursor = 'pointer';
        sessionIdCell.title = item.id;

        let tooltip = null;
        sessionIdCell.addEventListener('mouseenter', (e) => {

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
            
            sessionIdCell.appendChild(tooltip);
        });
        
        sessionIdCell.addEventListener('mouseleave', () => {
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
        });

        sessionIdCell.addEventListener('click', async (e) => {
            e.stopPropagation();
            try {
                await navigator.clipboard.writeText(item.id);

                const feedback = document.createElement('div');
                const copiedText = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('copied') : 'Copied!';
                feedback.textContent = copiedText;
                feedback.style.position = 'absolute';

                const clickY = e.offsetY || (e.clientY - sessionIdCell.getBoundingClientRect().top);
                const clickX = e.offsetX || (e.clientX - sessionIdCell.getBoundingClientRect().left);
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
                sessionIdCell.appendChild(feedback);
                
                setTimeout(() => {
                    feedback.remove();
                }, 1000);
            } catch (err) {

            }
        });

        const dateCell = document.createElement('td');
        dateCell.textContent = HistoryAPI.formatDate(item.updated_at) || '-';

        const balanceCell = document.createElement('td');
        if (this.isSingleRecordPage) {

            balanceCell.textContent = '_';
        } else if (item._fromSession) {

            const currency = item._sessionData.round_info.currency || 'try';
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
                balanceCell.textContent = HistoryAPI.formatCurrency(finalBalance * 1000, currency, this.getLocale());
            } else {
                balanceCell.textContent = '-';
            }
        } else {
            balanceCell.textContent = HistoryAPI.formatCurrency(item.final_award || item.balance, item.currency, this.getLocale());
        }

        const betCell = document.createElement('td');

        if (item.IsPfr) {
            betCell.textContent = '_';
        } else if(item._sessionData){
            var betAmount = HistoryAPI.getNormalizedTotalWager(item.wager || 0);
            var wagerAmount = parseFloat(betAmount)*1000;
            betCell.textContent = HistoryAPI.formatCurrency(wagerAmount, item._sessionData.round_info.currency, this.getLocale())
        }
        else{

            const normalizedWagerStr = HistoryAPI.getNormalizedTotalWager(item.wager || 0);
            const normalizedWager = parseFloat(normalizedWagerStr) || 0;
            const wagerAmount = normalizedWager * 1000;
            betCell.textContent = normalizedWager > 0 ? HistoryAPI.formatCurrency(wagerAmount, item.currency, this.getLocale()) : '-';
        }

        const multiplierCell = document.createElement('td');
        const cumulativeMultiplier = item.cumulative_multiplier || item.cumulativeMultiplier || 0;
        const multiplierText = cumulativeMultiplier > 0 ? cumulativeMultiplier + 'X' : '-';
        multiplierCell.textContent = multiplierText;

        if (cumulativeMultiplier > 0) {
            multiplierCell.style.color = '#f58742';
            multiplierCell.style.fontWeight = 'bold';
        } else {
            multiplierCell.style.color = 'var(--text-secondary)';
            multiplierCell.style.fontWeight = 'normal';
        }

        const winCell = document.createElement('td');
        let winAmountText = '';
        let winAmountNumeric = 0;
        if (item._sessionData) {

            winAmountNumeric = (item.win_amount || 0);
            winAmountText = HistoryAPI.formatCurrency(winAmountNumeric, item._sessionData.round_info.currency, this.getLocale());
        } else {
            winAmountNumeric = item.win_amount || 0;
            winAmountText = HistoryAPI.formatCurrency(winAmountNumeric, item.currency, this.getLocale());
        }
        winCell.textContent = winAmountText;
        if ((item._fromSession ? winAmountNumeric : (item.win_amount || 0)) > 0) {
            winCell.style.color = '#4CAF50';
        }

        const typeCell = document.createElement('td');
        let typeText = 'NORMAL';
        if (item.IsPfr) {
            typeText = 'PFR';
        }
        else if (item.is_buy_feature) {

            typeText = 'BUY';
        }
        else if (item.features) {
            typeText = 'GOLD REWARD';/* gold */
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
        typeCell.textContent = typeText;
        typeCell.className = `type-${typeText}`;

        if (typeText === 'PFR') {
            typeCell.style.color = '#4CAF50';
        } else if (typeText === 'BONUS') {
            typeCell.style.color = '#FF9800';
        }
        else if (typeText === 'BUY') {
            typeCell.style.color = '#FF9800';
        }

        row.addEventListener('click', () => {
            this.toggleRowExpansion(row, item);
        });
        
        row.appendChild(sessionIdCell);
        row.appendChild(dateCell);
        row.appendChild(balanceCell);
        row.appendChild(betCell);
        row.appendChild(multiplierCell);
        row.appendChild(winCell);
        row.appendChild(typeCell);
        if (!this.isSingleRecordPage && !this.isPfrRoundsPage) {

            const generateCell = document.createElement('td');
            const generateBtn = document.createElement('button');
            generateBtn.className = 'generate-btn';
            generateBtn.textContent = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('generate') : 'Generate';
            generateBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                await this.handleGenerateClick(item, generateBtn);
            });
            generateCell.appendChild(generateBtn);
            row.appendChild(generateCell);
        }

        if (this.isSingleRecordPage && !this.isPfrRoundsPage) {
            const replayCell = document.createElement('td');
            replayCell.className = 'replay-cell';
            const replayBtn = document.createElement('button');
            replayBtn.className = 'replay-btn';
            replayBtn.type = 'button';
            replayBtn.setAttribute('aria-label', typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('replay') : 'Replay');
            replayBtn.title = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('replay') : 'Replay';
            replayBtn.innerHTML = '<span class="replay-btn-icon">▶</span>';
            replayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleReplayClick(item);
            });
            replayCell.appendChild(replayBtn);
            row.appendChild(replayCell);
        }
        
        return row;
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
        const roundId = item.id;
        const urlParams = HistoryAPI.getURLParams();
        const currency = item.currency || urlParams.currency || 'try';

        const toCopy = (HistoryAPI.buildSingleRecordUrl)
            ? HistoryAPI.buildSingleRecordUrl(roundId, currency, urlParams.userLocale)
            : HistoryAPI.buildRoundUrls(roundId, currency, urlParams.userLocale).localUrl;

        const originalText = btn ? btn.textContent : '';
        try {
            if (btn) {
                btn.disabled = true;
            }
            await HistoryAPI.copyToClipboard(toCopy);
            if (btn) {
                btn.textContent = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('copied') : 'Copied!';
            }
        } catch (e) {

        } finally {
            if (btn) {
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 900);
            }
        }
    }
    
    
    async toggleRowExpansion(row, item) {

        if (row.dataset.isToggling === 'true') return;
        row.dataset.isToggling = 'true';

        const isExpanded = row.dataset.expanded === 'true';
        
        if (isExpanded) {

            this.collapseRow(row);
        } else {

            const allRows = document.querySelectorAll('#historyTableBody tr');
            allRows.forEach(r => {
                if (r !== row && r.dataset.expanded === 'true') {
                    this.collapseRow(r);
                }
            });

            this.removeExpandedRowsAfter(row);

            await this.expandRow(row, item);
        }

        setTimeout(() => {
            row.dataset.isToggling = 'false';
        }, 600);
    }

    
    removeExpandedRowsAfter(row) {
        let next = row.nextElementSibling;
        let removedAny = false;
        while (next && next.classList && next.classList.contains('expanded-row-content')) {
            const toRemove = next;
            next = next.nextElementSibling;
            if (toRemove.parentNode) {
                toRemove.remove();
                removedAny = true;
            }
        }
        if (removedAny && typeof HistoryReplay !== 'undefined' && HistoryReplay.stop) {
            HistoryReplay.stop();
        }
    }
    
    
    async expandRow(row, item) {

        const isBonusOrBuy = (item.is_bonus && !item.is_normal_spin) || item.is_buy_feature;
        
        if (isBonusOrBuy) {

            await this.expandBonusRow(row, item);
        } else {

            await this.expandNormalRow(row, item);
        }
    }
    
    
    async expandNormalRow(row, item, sessionDataOverride = null) {

        this.removeExpandedRowsAfter(row);

        const loadingRow = this.createLoadingRow();
        row.parentNode.insertBefore(loadingRow, row.nextSibling);
        
        try {

            const sessionData = sessionDataOverride || await HistoryAPI.fetchSessionDetails(item.id, item.currency);

            if (loadingRow.parentNode) {
                loadingRow.parentNode.removeChild(loadingRow);
            }

            const expandedRow = this.createExpandedContentRow(sessionData, item);
            row.parentNode.insertBefore(expandedRow, row.nextSibling);

            row.dataset.expanded = 'true';

            setTimeout(() => {
                expandedRow.classList.add('active');
            }, 10);

            HistoryReplay.init(sessionData, item.currency);

            const reelsContainer = expandedRow.querySelector('.reels-container');
            HistoryReplay.startInlineDual(reelsContainer);
            
        } catch (error) {

            if (loadingRow.parentNode) {
                loadingRow.parentNode.removeChild(loadingRow);
            }

            const expandedRow = this.createExpandedContentRow(null, item, error);
            row.parentNode.insertBefore(expandedRow, row.nextSibling);
            row.dataset.expanded = 'true';

            setTimeout(() => {
                expandedRow.classList.add('active');
            }, 10);
        }
    }
    
    
    async expandBonusRow(row, item) {

        this.removeExpandedRowsAfter(row);

        const loadingRow = this.createLoadingRow();
        row.parentNode.insertBefore(loadingRow, row.nextSibling);
        
        try {

            const sessionsArray = Array.isArray(item._sessionsArray)
                ? item._sessionsArray
                : await HistoryAPI.fetchBonusSessions(item.id, item.currency);

            if (loadingRow.parentNode) {
                loadingRow.parentNode.removeChild(loadingRow);
            }

            const expandedRow = this.createBonusExpandedContentRow(sessionsArray, item);
            row.parentNode.insertBefore(expandedRow, row.nextSibling);

            row.dataset.expanded = 'true';

            setTimeout(() => {
                expandedRow.classList.add('active');
            }, 10);
            
        } catch (error) {

            if (loadingRow.parentNode) {
                loadingRow.parentNode.removeChild(loadingRow);
            }

            const expandedRow = document.createElement('tr');
            expandedRow.className = 'expanded-row-content';
            const expandedCell = document.createElement('td');
            expandedCell.colSpan = this.isSingleRecordPage ? 8 : 8;
            const errorText = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('failedToLoadSpin') : 'Failed to load spin details. Please try again.';
            expandedCell.innerHTML = `<div style="padding: 20px; color: #ff4444;">${errorText}</div>`;
            expandedRow.appendChild(expandedCell);
            row.parentNode.insertBefore(expandedRow, row.nextSibling);
            row.dataset.expanded = 'true';

            setTimeout(() => {
                expandedRow.classList.add('active');
            }, 10);
        }
    }
    
    
    createBonusExpandedContentRow(sessionsArray, item) {

        if (!Array.isArray(sessionsArray) || sessionsArray.length === 0) {

            const expandedRow = document.createElement('tr');
            expandedRow.className = 'expanded-row-content';
            const expandedCell = document.createElement('td');
            expandedCell.colSpan = this.isSingleRecordPage ? 8 : 8;
            expandedCell.innerHTML = '<div style="padding: 20px; color: #ff4444;">No session data available.</div>';
            expandedRow.appendChild(expandedCell);
            return expandedRow;
        }
        
        const expandedRow = document.createElement('tr');
        expandedRow.className = 'expanded-row-content';
        const expandedCell = document.createElement('td');
        expandedCell.colSpan = this.isSingleRecordPage ? 8 : 8;
        
        const expandedContent = document.createElement('div');
        expandedContent.className = 'expanded-row-content-inner bonus-sessions-container';

        const subTable = document.createElement('table');
        subTable.className = 'history-table bonus-sessions-table';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const headers = [
            typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('gameSessionId') : 'Round ID',
            typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('spin') : 'Spin',
            typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('multiplier') : 'Multiplier',
            typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('amountWon') : 'Amount Won'
        ];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.textAlign = 'center';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        subTable.appendChild(thead);

        const tbody = document.createElement('tbody');
        tbody.id = 'bonusSessionsTableBody';

        const parentCurrency = item.currency || 'try';

        sessionsArray.forEach((sessionData, index) => {
            if (!sessionData || !sessionData.current_round) {

                return;
            }

            const subRow = this.createBonusSubRow(sessionData, index, parentCurrency);
            tbody.appendChild(subRow);
        });

        if (tbody.children.length === 0) {

            const errorRow = document.createElement('tr');
            const errorCell = document.createElement('td');
            errorCell.colSpan = 4;
            errorCell.style.padding = '20px';
            errorCell.style.color = '#ff4444';
            errorCell.textContent = 'No valid session data found.';
            errorRow.appendChild(errorCell);
            tbody.appendChild(errorRow);
        }
        
        subTable.appendChild(tbody);
        expandedContent.appendChild(subTable);
        expandedCell.appendChild(expandedContent);
        expandedRow.appendChild(expandedCell);
        
        return expandedRow;
    }
    
    
    createBonusSubRow(sessionData, index, parentCurrency) {
        const row = document.createElement('tr');
        row.className = 'bonus-sub-row';
        row.dataset.sessionIndex = index;
        row.dataset.expanded = 'false';

        row._sessionData = sessionData;

        row._parentCurrency = parentCurrency;
        
        const roundId = sessionData.current_round?.round_id || '';

        const currency = parentCurrency || 
            sessionData.player?.currency || 
            sessionData.current_round?.game_extra_info?.currency || 
            'try';

        const sessionIdCell = document.createElement('td');
        sessionIdCell.textContent = roundId.substring(0, 16) + '...';
        sessionIdCell.style.textAlign = 'center';

        const dateCell = document.createElement('td');
        dateCell.textContent = `Spin ${index + 1}`;
        dateCell.style.textAlign = 'center';

        const multiplierCell = document.createElement('td');
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

            if (multiplier === 0) {
                const wager = sessionData.current_round?.wager || 0;
                const winAmountInCents = sessionData.current_round?.win_amount || 0;
                if (wager > 0) {
                    multiplier = winAmountInCents / wager;
                }
            }
        }

        const multiplierInt = Math.round(multiplier);
        const multiplierText = multiplierInt > 0 ? multiplierInt + 'X' : '-';
        multiplierCell.textContent = multiplierText;
        multiplierCell.style.textAlign = 'center';
        if (multiplierInt > 0) {
            multiplierCell.style.color = '#f58742';
            multiplierCell.style.fontWeight = 'bold';
        } else {
            multiplierCell.style.color = 'var(--text-secondary)';
            multiplierCell.style.fontWeight = 'normal';
        }

        const winCell = document.createElement('td');
        const winAmountInCents = sessionData.current_round?.win_amount || 0;
        const winAmount = winAmountInCents / 100;
        const winAmountFormatted = HistoryAPI.formatCurrency(winAmount * 1000, currency, this.getLocale());
        winCell.textContent = winAmountFormatted;
        winCell.style.textAlign = 'center';
        if (winAmount > 0) {
            winCell.style.color = '#4CAF50';
        }

        row.addEventListener('click', () => {

            const rowSessionData = row._sessionData || sessionData;
            this.toggleBonusSubRowExpansion(row, rowSessionData);
        });
        
        row.appendChild(sessionIdCell);
        row.appendChild(dateCell);
        row.appendChild(multiplierCell);
        row.appendChild(winCell);
        
        return row;
    }
    
    
    async toggleBonusSubRowExpansion(row, sessionData) {
        const isExpanded = row.dataset.expanded === 'true';
        
        if (isExpanded) {

            this.collapseBonusSubRow(row);
        } else {

            const allSubRows = document.querySelectorAll('.bonus-sub-row');
            allSubRows.forEach(r => {
                if (r !== row && r.dataset.expanded === 'true') {
                    this.collapseBonusSubRow(r);
                }
            });

            await this.expandBonusSubRow(row, sessionData);
        }
    }
    
    
    async expandBonusSubRow(row, sessionData) {

        const rowSessionData = row._sessionData || sessionData;

        if (!rowSessionData || !rowSessionData.current_round) {

            return;
        }

        const loadingRow = document.createElement('tr');
        loadingRow.className = 'expanded-row-content bonus-sub-expanded';
        const loadingCell = document.createElement('td');
        loadingCell.colSpan = 4;
        loadingCell.style.padding = '40px';
        loadingCell.style.textAlign = 'center';
        const logoPath = getLogoPath();
        loadingCell.innerHTML = `<img src="${logoPath}" alt="SUGARBOX 5000 GOLD Logo" class="loading-logo">`;
        loadingRow.appendChild(loadingCell);
        row.parentNode.insertBefore(loadingRow, row.nextSibling);
        
        try {

            if (loadingRow.parentNode) {
                loadingRow.parentNode.removeChild(loadingRow);
            }

            const expandedRow = this.createExpandedContentRow(rowSessionData, null);
            expandedRow.classList.add('bonus-sub-expanded');
            const expandedCell = expandedRow.querySelector('td');
            if (expandedCell) {
                expandedCell.colSpan = 4;
            }
            row.parentNode.insertBefore(expandedRow, row.nextSibling);

            row.dataset.expanded = 'true';

            setTimeout(() => {
                expandedRow.classList.add('active');
            }, 10);

            const currency = row._parentCurrency || 
                            rowSessionData?.player?.currency || 
                            rowSessionData?._currency ||
                            rowSessionData?.current_round?.game_extra_info?.currency ||
                            'try';
            HistoryReplay.init(rowSessionData, currency);

            const reelsContainer = expandedRow.querySelector('.reels-container');
            HistoryReplay.startInlineDual(reelsContainer);
            
        } catch (error) {

            if (loadingRow.parentNode) {
                loadingRow.parentNode.removeChild(loadingRow);
            }

            const expandedRow = this.createExpandedContentRow(null, null, error);
            expandedRow.classList.add('bonus-sub-expanded');
            const expandedCell = expandedRow.querySelector('td');
            if (expandedCell) {
                expandedCell.colSpan = 5;
            }
            row.parentNode.insertBefore(expandedRow, row.nextSibling);
            row.dataset.expanded = 'true';

            setTimeout(() => {
                expandedRow.classList.add('active');
            }, 10);
        }
    }
    
    
    collapseBonusSubRow(row) {
        const expandedRow = row.nextElementSibling;
        if (expandedRow && expandedRow.classList.contains('expanded-row-content')) {

            expandedRow.classList.remove('active');

            setTimeout(() => {
                if (expandedRow.parentNode) {
                    expandedRow.remove();
                }
            }, 500);
        }
        row.dataset.expanded = 'false';

        HistoryReplay.stop();
    }
    
    
    collapseRow(row) {

        let next = row.nextElementSibling;
        while (next && next.classList && next.classList.contains('expanded-row-content')) {
            const expandedRow = next;
            next = next.nextElementSibling;

            expandedRow.classList.remove('active');

            setTimeout(() => {
                if (expandedRow.parentNode) {
                    expandedRow.remove();
                }
            }, 500);
        }
        row.dataset.expanded = 'false';

        HistoryReplay.stop();
    }
    
    
    createLoadingRow() {
        const loadingRow = document.createElement('tr');
        loadingRow.className = 'expanded-row-content';
        const loadingCell = document.createElement('td');
        loadingCell.colSpan = this.isSingleRecordPage ? 7 : 8;
        loadingCell.style.padding = '40px';
        loadingCell.style.textAlign = 'center';
        const logoPath = getLogoPath();
        loadingCell.innerHTML = `<img src="${logoPath}" alt="SUGARBOX 5000 GOLD Logo" class="loading-logo">`;
        loadingRow.appendChild(loadingCell);
        return loadingRow;
    }
    
    
    createExpandedContentRow(sessionData, item, error = null) {
        const expandedRow = document.createElement('tr');
        expandedRow.className = 'expanded-row-content';
        const expandedCell = document.createElement('td');
        expandedCell.colSpan = this.isSingleRecordPage ? 8 : 8;
        
        const expandedContent = document.createElement('div');
        expandedContent.className = 'expanded-row-content-inner';
        
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
        
        expandedCell.appendChild(expandedContent);
        expandedRow.appendChild(expandedCell);
        
        return expandedRow;
    }
    
    
    updatePagination() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const pageNumbers = document.getElementById('pageNumbers');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= this.totalPages;
        }
        
        if (pageNumbers) {
            pageNumbers.innerHTML = '';

            const startPage = Math.max(1, this.currentPage - 2);
            const endPage = Math.min(this.totalPages, this.currentPage + 2);
            
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
                pageNumbers.appendChild(pageBtn);
            }
        }
    }
    
    
    
    showError(message) {

        const errorMsg = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('failedToLoad') : message;
        alert(errorMsg);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HistoryDesktop;
}
