

const HistoryReplay = {
    currentSession: null,
    currency: 'try',
    isPlaying: false,
    isPaused: false,
    speed: 1,
    animationFrame: null,
    currentTumble: 0,
    tumbleData: [],

    
    getLocale() {
        if (typeof HistoryLocale !== 'undefined' && HistoryLocale.currentLocale) {
            return HistoryLocale.currentLocale;
        }
        try {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('user_locale') || 'en';
        } catch (e) {
            return 'en';
        }
    },

    
    init(sessionData, currency = null) {
        this.currentSession = sessionData;
        this.isPlaying = false;
        this.isPaused = false;
        this.speed = 1;
        this.currentTumble = 0;
        this.tumbleData = [];

        if (currency) {
            this.currency = currency;
        } else {

            this.currency = sessionData?._currency ||
                           sessionData?.player?.currency ||
                           sessionData?.current_round?.game_extra_info?.currency ||
                           (() => {
                               try {
                                   const urlParams = new URLSearchParams(window.location.search);
                                   return urlParams.get('currency') || 
                                          sessionStorage.getItem("adaptor_currency") || 
                                          sessionStorage.adaptor_currency;
                               } catch (e) {
                                   return null;
                               }
                           })() ||
                           'try';
        }

        this.parseSessionData(sessionData);

        this.initializeReelGrid();
    },

    
    getMultiplier(sessionData = null) {
        const data = sessionData || this.currentSession;
        if (!data || !data.current_round) {
            return 0;
        }

        const postMatrixInfo = data.current_round.post_matrix_info;
        if (!postMatrixInfo) {
            return 0;
        }

        if (postMatrixInfo.multiplier) {
            if (Array.isArray(postMatrixInfo.multiplier)) {

                return postMatrixInfo.multiplier.reduce((sum, val) => sum + (parseInt(val) || 0), 0);
            } else {

                return parseInt(postMatrixInfo.multiplier) || 0;
            }
        }

        if (postMatrixInfo.win) {
            return parseInt(postMatrixInfo.win) || 0;
        }

        return 0;
    },

    
    parseSessionData(sessionData) {

        const initialMatrix = this.parseMatrix(sessionData.current_round?.matrix || '');

        const postMatrixInfo = sessionData.current_round?.post_matrix_info;
        const finalMatrix = postMatrixInfo?.matrix
            ? this.parseMatrix(postMatrixInfo.matrix)
            : null;

        this.tumbleData.push({
            matrix: postMatrixInfo.has_gold ? finalMatrix :initialMatrix,/* gold */
            positions: [],
            winAmount: 0,
            symbols: '',
            isTumble: false,
            goldMultiplier: 0 || postMatrixInfo.gold_multiplier/* gold */
        });

        if (sessionData.current_round?.misc_prizes) {
            const miscPrizes = sessionData.current_round.misc_prizes;
            const count = miscPrizes.count || 0;

            for (let i = 0; i < count; i++) {
                const tumble = miscPrizes[String(i)];
                if (tumble && tumble.new_reel) {
                    const tumbleMatrix = this.parseMatrix(tumble.new_reel);

                    const tumbleData = {
                        matrix: tumbleMatrix,
                        positions: [],
                        initialPositions: tumble.positions || [],
                        winAmount: 0,
                        nextTumbleWinAmount: 0,
                        symbols: tumble.new_symbols || '',
                        old_reel_symbol: tumble.old_reel_symbol || [],
                        isTumble: true
                    };

                    tumbleData.winAmount = this.calculateTumbleWin(tumbleData, sessionData, i);

                    if (i < count - 1) {
                        const nextTumble = miscPrizes[String(i + 1)];
                        if (nextTumble) {

                            const nextTumbleData = {
                                old_reel_symbol: nextTumble.old_reel_symbol || []
                            };
                            tumbleData.nextTumbleWinAmount = this.calculateTumbleWin(nextTumbleData, sessionData, i + 1);

                            if (nextTumble.positions) {
                                tumbleData.positions = nextTumble.positions || [];
                            }
                        }
                    } else {

                        let scatterWinAmount = 0;
                        if (sessionData.current_round?.scatter_win) {
                            const scatterWin = Array.isArray(sessionData.current_round.scatter_win) 
                                ? sessionData.current_round.scatter_win.reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
                                : parseFloat(sessionData.current_round.scatter_win) || 0;

                            scatterWinAmount = scatterWin / 100;
                        }

                        if (sessionData.current_round?.payline_wins?.details) {
                            try {
                                const details = sessionData.current_round.payline_wins.details;
                                const winEntries = details.split(';').filter(e => e && e.trim());
                                for (const entry of winEntries) {
                                    if (entry.includes(':')) {
                                        const parts = entry.split(':');

                                        if (parts.length > 4 && parts[4] && parts[4].toLowerCase() === 's') {
                                            const scatterWinInCents = parseFloat(parts[1]) || 0;
                                            scatterWinAmount = scatterWinInCents / 100;
                                            break;
                                        }
                                    }
                                }
                            } catch (e) {

                            }
                        }

                        tumbleData.nextTumbleWinAmount = scatterWinAmount;
                        tumbleData.positions = [];
                    }
                    
                    this.tumbleData.push(tumbleData);
                }
            }
        }

        // if (finalMatrix && finalMatrix.length > 0) {
        //     this.tumbleData.push({
        //         matrix: finalMatrix,
        //         positions: [],
        //         winAmount: 0,
        //         symbols: '',
        //         isTumble: false
        //     });
        // }

        if (this.tumbleData.length > 1 && this.tumbleData[1].isTumble) {

            const firstTumble = this.tumbleData[1];
            if (firstTumble.initialPositions && firstTumble.initialPositions.length > 0) {
                this.tumbleData[0].positions = firstTumble.initialPositions;
            }
        }

        if (this.tumbleData.length === 1 || (this.tumbleData.length === 2 && !this.tumbleData[1].isTumble)) {

            let winAmountInCents = sessionData.current_round?.win_amount || 0;

            if (sessionData.current_round?.scatter_win) {
                const scatterWin = Array.isArray(sessionData.current_round.scatter_win) 
                    ? sessionData.current_round.scatter_win.reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
                    : parseFloat(sessionData.current_round.scatter_win) || 0;

                const scatterWinInCents = scatterWin * 100;
                winAmountInCents += scatterWinInCents;
            }
            
            this.tumbleData[0].winAmount = winAmountInCents / 100;

            if (sessionData.current_round?.positions && sessionData.current_round.positions.length > 0) {
                this.tumbleData[0].positions = sessionData.current_round.positions;
            }
        }
    },

    
    parseMatrix(matrixStr) {
        if (!matrixStr) return [];

        return matrixStr.split(';').map(row => row.split(''));
    },

    
    calculateTumbleWin(tumble, sessionData = null, tumbleIndex = 0) {

        if (tumble.screenWins && Array.isArray(tumble.screenWins)) {
            const screenWinSum = tumble.screenWins.reduce((sum, win) => sum + (parseFloat(win) || 0), 0);
            if (screenWinSum > 0) {

                return screenWinSum;
            }
        }

        if (sessionData && sessionData.current_round?.payline_wins?.details) {
            try {
                const details = sessionData.current_round.payline_wins.details;

                const winEntries = details.split(';').filter(e => e && e.trim());
                let totalWin = 0;

                const tumbleSymbols = tumble.old_reel_symbol && Array.isArray(tumble.old_reel_symbol) && tumble.old_reel_symbol.length > 0
                    ? tumble.old_reel_symbol.map(s => s.toLowerCase())
                    : (tumble.old_reel_symbol && tumble.old_reel_symbol.length > 0
                        ? [tumble.old_reel_symbol[0].toLowerCase()]
                        : []);

                const symbolWinsList = {};

                for (let i = 0; i < winEntries.length; i++) {
                    const entry = winEntries[i].trim();
                    if (entry && entry.includes(':')) {
                        const parts = entry.split(':');

                        if (parts.length > 1 && parts[1]) {

                            const winInCents = parseFloat(parts[1]) || 0;
                            const win = winInCents / 100;

                            const winSymbol = parts.length > 4 && parts[4] ? parts[4].toLowerCase() : null;

                            if (winSymbol && tumbleSymbols.includes(winSymbol)) {
                                if (!symbolWinsList[winSymbol]) symbolWinsList[winSymbol] = [];
                                symbolWinsList[winSymbol].push(win);
                            }
                        }
                    }
                }

                for (const wins of Object.values(symbolWinsList)) {
                    const idx = Math.min(tumbleIndex, wins.length - 1);
                    totalWin += wins[idx];
                }
                
                if (totalWin > 0) {

                    return totalWin;
                } else {

                }
            } catch (e) {

            }
        }

        return 0;
    },

    
    initializeReelGrid(reelGrid = null) {
        const targetGrid = reelGrid || document.getElementById('reelGrid');
        if (!targetGrid) return;

        targetGrid.innerHTML = '';

        const firstTumble = this.tumbleData[0];
        if (!firstTumble || !firstTumble.matrix) {

            this.createDefaultGrid(targetGrid, 5, 5);
            return;
        }

        const matrix = firstTumble.matrix;
        const rows = matrix.length;
        const cols = matrix[0]?.length || 5;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const symbol = document.createElement('div');
                symbol.className = targetGrid && targetGrid.classList.contains('inline-reel-grid') ? 'inline-reel-symbol' : 'reel-symbol';
                symbol.dataset.row = row;
                symbol.dataset.col = col;
                symbol.textContent = matrix[row]?.[col] || '';

                symbol.style.overflow = 'hidden';
                symbol.style.boxSizing = 'border-box';
                symbol.style.position = 'relative';
                targetGrid.appendChild(symbol);
            }
        }

        targetGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    },

    
    createDefaultGrid(container, rows = 5, cols = 5, isInline = false) {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const symbol = document.createElement('div');
                symbol.className = isInline ? 'inline-reel-symbol' : 'reel-symbol';
                symbol.dataset.row = row;
                symbol.dataset.col = col;
                symbol.textContent = '?';

                symbol.style.overflow = 'hidden';
                symbol.style.boxSizing = 'border-box';
                symbol.style.position = 'relative';
                container.appendChild(symbol);
            }
        }
        container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    },

    
    startInline(reelGrid) {
        if (!reelGrid) return;

        this.currentReelGrid = reelGrid;
        this.isPlaying = true;
        this.isPaused = false;
        this.currentTumble = 0;

        this.initializeReelGrid(reelGrid);

        this.showTumbleInline(0);

        this.animateInline();
    },

    
    startInlineDual(reelsContainer) {
        if (!reelsContainer) return;

        this.reelsContainer = reelsContainer;
        this.isPlaying = false;
        this.isPaused = false;

        reelsContainer.innerHTML = '';

        const tumbleStates = this.tumbleData.filter(t => t.isTumble === true);
        const finalState = this.tumbleData.find(t => t.isTumble === false && t !== this.tumbleData[0]);
        const initialState = this.tumbleData[0];

        const winAmountInCents = this.currentSession?.current_round?.win_amount || 0;
        const totalWinAmount = winAmountInCents / 100;

        const hasWinning = totalWinAmount > 0;

        if (tumbleStates.length > 0 && initialState) {

            const firstTumble = tumbleStates[0];
            const initialLabel = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('initial') : 'Initial';

            const firstTumbleWin = firstTumble.winAmount || 0;
            this.createReelContainer(
                reelsContainer,
                initialLabel,
                initialState.matrix,
                firstTumble.initialPositions || [],
                true,
                'initial',
                firstTumbleWin,
                0,
                false,
                false
            );
        }

        if (tumbleStates.length > 0) {
            tumbleStates.forEach((tumbleState, index) => {

                const tumbleWin = tumbleState.nextTumbleWinAmount !== undefined 
                    ? tumbleState.nextTumbleWinAmount 
                    : (tumbleState.winAmount || 0);
                const tumbleLabel = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('tumble') : 'Tumble';
                const isLastTumble = index === tumbleStates.length - 1;

                const hasWinningPositions = tumbleState.positions && tumbleState.positions.length > 0;
                const shouldHighlight = tumbleWin > 0 && hasWinningPositions;
                
                const tumbleReelContainer = this.createReelContainer(
                    reelsContainer,
                    `${tumbleLabel} ${index + 1}`,
                    tumbleState.matrix,
                    tumbleState.positions || [],
                    shouldHighlight,
                    'tumble',
                    tumbleWin,
                    totalWinAmount,
                    index === 0,
                    isLastTumble
                );
            });
        }

        const finalLabel = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('final') : 'Final';

        if (tumbleStates.length > 0) {

            if (finalState) {

                const lastTumble = tumbleStates[tumbleStates.length - 1];
                const finalMatrixStr = finalState.matrix.map(row => row.join('')).join(';');
                const lastTumbleMatrixStr = lastTumble.matrix.map(row => row.join('')).join(';');
                
                if (finalMatrixStr !== lastTumbleMatrixStr) {

                    this.createReelContainer(
                        reelsContainer,
                        finalLabel,
                        finalState.matrix,
                        [],
                        false,
                        'final',
                        0,
                        totalWinAmount
                    );
                }
            }
        } else if (hasWinning && finalState) {

            if (initialState) {
                const initialLabel = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('initial') : 'Initial';
                let initialWin = 0;

                if (this.currentSession?.current_round?.scatter_win) {
                    if (Array.isArray(this.currentSession.current_round.scatter_win)) {

                        initialWin = this.currentSession.current_round.scatter_win.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
                    } else {

                        const scatterWin = parseFloat(this.currentSession.current_round.scatter_win) || 0;

                        initialWin = scatterWin >= 100 ? scatterWin / 100 : scatterWin;
                    }
                } else {

                    initialWin = initialState.winAmount || totalWinAmount || 0;
                }

                this.createReelContainer(
                    reelsContainer,
                    initialLabel,
                    initialState.matrix,
                    initialState.positions || [],
                    false,
                    'initial',
                    initialWin,
                    0,
                    false,
                    false
                );
            }
        } else if (finalState) {

            const initialMatrixStr = initialState?.matrix.map(row => row.join('')).join(';') || '';
            const finalMatrixStr = finalState.matrix.map(row => row.join('')).join(';');

            if (initialMatrixStr !== finalMatrixStr) {

                if (initialState) {
                    this.createReelContainer(
                        reelsContainer,
                        initialLabel,
                        initialState.matrix,
                        initialState.positions || [],
                        false,
                        'initial',
                        0,
                        0
                    );
                }
                this.createReelContainer(
                    reelsContainer,
                    finalLabel,
                    finalState.matrix,
                    [],
                    false,
                    'final',
                    0,
                    0
                );
            } else {

                this.createReelContainer(
                    reelsContainer,
                    finalLabel,
                    finalState.matrix,
                    [],
                    false,
                    'final',
                    0,
                    0
                );
            }
        } else if (initialState) {

            this.createReelContainer(
                reelsContainer,
                finalLabel,
                initialState.matrix,
                [],
                false,
                'final',
                0,
                0
            );
        }

        this.updateWinDisplayDual();
    },

    
    createReelContainer(parentContainer, label, matrix, winningPositions = [], showHighlights = false, reelType = 'tumble', winAmount = 0, totalWin = 0, isFirstTumble = false, isLastTumble = false) {
        const reelContainer = document.createElement('div');
        reelContainer.className = 'reel-container';

        const currency = this.currency ||
            this.currentSession?.player?.currency ||
            this.currentSession?._currency ||
            this.currentSession?.current_round?.game_extra_info?.currency ||
            'USD';

        const mainSection = document.createElement('div');
        mainSection.className = 'reel-main-section';

        const leftSection = document.createElement('div');
        leftSection.className = 'reel-left-section';

        const reelGrid = document.createElement('div');
        reelGrid.className = `inline-reel-grid ${reelType}-reel`;
        reelGrid.dataset.reelType = reelType;

        this.renderReelGrid(reelGrid, matrix, winningPositions, showHighlights);

        leftSection.appendChild(reelGrid);

        if (winningPositions.length > 0 && showHighlights) {
            const winningTextElement = document.createElement('div');
            winningTextElement.className = 'winning-positions-text';
            const winningText = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('winningPositions') : 'Winning Positions';
            winningTextElement.textContent = winningText;
            leftSection.appendChild(winningTextElement);
        }

        mainSection.appendChild(leftSection);

        const rightSection = document.createElement('div');
        rightSection.className = 'reel-right-section';

        const winInfoContainer = document.createElement('div');
        winInfoContainer.className = 'win-info-container';

        const winItem = document.createElement('div');
        winItem.className = 'win-info-item';
        const winLabel = document.createElement('div');
        winLabel.className = 'win-info-label';
        const winLabelText = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('winLabel') : 'WIN';
        winLabel.textContent = winLabelText;
        const winAmountEl = document.createElement('div');
        winAmountEl.className = 'win-info-amount';

        let displayWin = 0;
        if (reelType === 'tumble') {

            displayWin = winAmount || 0;
        } else if (reelType === 'initial') {

            displayWin = winAmount || 0;
        } else {

            displayWin = 0;
        }

        var data = this.tumbleData;
        if (data[0].goldMultiplier)
            displayWin = data[0].winAmount;/* gold */

        winAmountEl.textContent = HistoryAPI.formatCurrency(displayWin * 1000, currency, this.getLocale());
       
        
        winItem.appendChild(winLabel);
        winItem.appendChild(winAmountEl);
        winInfoContainer.appendChild(winItem);

        if (this.currentSession && this.currentSession.current_round && this.currentSession.current_round.post_matrix_info) {
            const multiplier = this.getMultiplier();

            const shouldShowMultiplier = multiplier > 0 && (
                reelType === 'final' || 
                displayWin > 0
            );
            
            if (shouldShowMultiplier) {
                const multiplierItem = document.createElement('div');
                multiplierItem.className = 'win-info-item';
                const multiplierLabel = document.createElement('div');
                multiplierLabel.className = 'win-info-label';
                const multiplierLabelText = typeof HistoryLocale !== 'undefined' ? HistoryLocale.t('winX') : 'WinX';
                multiplierLabel.textContent = multiplierLabelText;
                const multiplierAmountEl = document.createElement('div');
                multiplierAmountEl.className = 'win-info-amount multiplier';

                const multiplierInt = Math.round(multiplier);
                multiplierAmountEl.textContent = multiplierInt + 'x';
                multiplierAmountEl.style.color = '#f58742';
                multiplierAmountEl.style.fontWeight = 'bold';
                multiplierItem.appendChild(multiplierLabel);
                multiplierItem.appendChild(multiplierAmountEl);
                winInfoContainer.appendChild(multiplierItem);

            } else {

            }
        }

        rightSection.appendChild(winInfoContainer);

        mainSection.appendChild(rightSection);
        reelContainer.appendChild(mainSection);
        parentContainer.appendChild(reelContainer);

        return reelContainer;
    },

    
    getSymbolBasePath() {
        return "assets/";
    },

    
    renderSymbol(symbol, letter, position = null) {
        if (!symbol || !letter) return;
        const tumbledata = this.tumbleData[0];
        const symbolName = letter.toLowerCase();
        const basePath = this.getSymbolBasePath();
        let symbolPath = '';
        let multiplierVariant = 'blue';

        if (symbolName === 'm') {

            multiplierVariant = 'blue';

            symbolPath = `${basePath}multipliers/blue.png`;
        } else if(symbolName === "z"){
           symbolPath = `${basePath}${symbolName}${tumbledata.goldMultiplier}.png`;/* gold */
        }else{

            symbolPath = `${basePath}${symbolName}.png`;
        }

        symbol.innerHTML = '';
        symbol.textContent = '';

        const img = document.createElement('img');
        img.src = symbolPath;
        img.alt = `Symbol ${letter}`;

        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.display = 'block';

        img.onload = () => {

            if (symbolName === 'm') {
                this.addMultiplierOverlay(symbol, position, letter);
            }
        };

        symbol.style.background = 'transparent';
        symbol.style.padding = '0';
        symbol.appendChild(img);
    },

    
    getMultiplierPositions(matrix) {
        const multiplierPositions = [];
        if (!matrix || matrix.length === 0) return multiplierPositions;
        
        const rows = matrix.length;
        const cols = matrix[0]?.length || 5;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const symbol = matrix[row]?.[col];
                if (symbol && symbol.toLowerCase() === 'm') {
                    const position = row * cols + col;
                    multiplierPositions.push(position);
                }
            }
        }
        
        return multiplierPositions;
    },

    
    addMultiplierOverlay(symbol, position, letter) {
        if (!symbol || position === null || !this.currentSession || !this.currentSession.current_round) {
            return;
        }

        if (!letter || letter.toLowerCase() !== 'm') {
            return;
        }

        let multiplierValue = 0;

        const postInfo = this.currentSession.current_round.post_matrix_info;
        let matrix = null;
        if (postInfo && postInfo.matrix) {
            matrix = this.parseMatrix(postInfo.matrix);
        } else if (this.currentSession.current_round.matrix) {
            matrix = this.parseMatrix(this.currentSession.current_round.matrix);
        }

        if (this.currentSession.current_round.screen_wins && 
            this.currentSession.current_round.screen_wins[position] !== undefined) {
            multiplierValue = parseInt(this.currentSession.current_round.screen_wins[position]) || 0;
        }

        if (multiplierValue === 0 && postInfo) {
            if (postInfo.multiplier && Array.isArray(postInfo.multiplier)) {

                if (matrix && matrix.length > 0) {
                    const multiplierPositions = this.getMultiplierPositions(matrix);
                    const multiplierIndex = multiplierPositions.indexOf(position);
                    
                    if (multiplierIndex >= 0 && multiplierIndex < postInfo.multiplier.length) {

                        multiplierValue = parseInt(postInfo.multiplier[multiplierIndex]) || 0;
                    } else if (postInfo.multiplier[position] !== undefined && postInfo.multiplier[position] !== null) {

                        multiplierValue = parseInt(postInfo.multiplier[position]) || 0;
                    }
                } else {

                    if (postInfo.multiplier[position] !== undefined && postInfo.multiplier[position] !== null) {
                        multiplierValue = parseInt(postInfo.multiplier[position]) || 0;
                    }
                }
            } else if (postInfo.multiplier && !Array.isArray(postInfo.multiplier)) {

                multiplierValue = parseInt(postInfo.multiplier) || 0;
            }
        }

        if (multiplierValue > 0) {

        } else {

        }

        if (multiplierValue > 0) {

            const existingOverlay = symbol.querySelector('.multiplier-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }

            const multiplierInt = Math.round(multiplierValue);

            const multiplierOverlay = document.createElement('div');
            multiplierOverlay.className = 'multiplier-overlay';
            multiplierOverlay.textContent = multiplierInt + 'x';
            multiplierOverlay.style.position = 'absolute';
            multiplierOverlay.style.top = '50%';
            multiplierOverlay.style.left = '50%';

            multiplierOverlay.style.transform = 'translate(-50%, -50%) translateZ(0)';
            multiplierOverlay.style.webkitTransform = 'translate(-50%, -50%) translateZ(0)';
            multiplierOverlay.style.color = '#f58742';
            multiplierOverlay.style.fontWeight = 'bold';
            multiplierOverlay.style.fontSize = '22px';
            multiplierOverlay.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.9), -1px -1px 2px rgba(255, 255, 255, 0.3)';
            multiplierOverlay.style.zIndex = '100';
            multiplierOverlay.style.pointerEvents = 'none';
            multiplierOverlay.style.fontFamily = 'Arial, sans-serif';
            multiplierOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            multiplierOverlay.style.padding = '4px 8px';
            multiplierOverlay.style.borderRadius = '4px';
            multiplierOverlay.style.whiteSpace = 'nowrap';

            multiplierOverlay.style.overflow = 'visible';
            multiplierOverlay.style.willChange = 'transform';
            multiplierOverlay.style.backfaceVisibility = 'hidden';

            if (getComputedStyle(symbol).position === 'static') {
                symbol.style.position = 'relative';
            }

            symbol.style.overflow = 'visible';
            symbol.style.boxSizing = 'border-box';

            symbol.style.isolation = 'isolate';
            symbol.style.willChange = 'transform';

            symbol.appendChild(multiplierOverlay);

            void multiplierOverlay.offsetHeight;

        }
    },

    
    renderReelGrid(reelGrid, matrix, winningPositions = [], showHighlights = false) {
        if (!reelGrid || !matrix || matrix.length === 0) return;

        reelGrid.innerHTML = '';

        const rows = matrix.length;
        const cols = matrix[0]?.length || 5;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const symbol = document.createElement('div');
                symbol.className = 'inline-reel-symbol';
                symbol.dataset.row = row;
                symbol.dataset.col = col;

                symbol.style.overflow = 'visible';
                symbol.style.boxSizing = 'border-box';
                symbol.style.position = 'relative';
                symbol.style.isolation = 'isolate';

                const matrixRow = matrix[row];
                if (matrixRow && matrixRow[col]) {
                    const letter = matrixRow[col];

                    const symbolPosition = row * cols + col;

                    this.renderSymbol(symbol, letter, symbolPosition);

                    symbol.setAttribute('aria-label', `Symbol ${letter}`);
                }

                if (showHighlights && winningPositions.length > 0) {
                    const position = row * cols + col;
                    if (winningPositions.includes(position)) {
                        symbol.classList.add('winning');
                    }
                }

                reelGrid.appendChild(symbol);
            }
        }

        reelGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    },

    
    updateWinDisplayDual() {

        const expandedRow = this.reelsContainer?.closest('.expanded-row-content') ||
            this.reelsContainer?.closest('.expanded-card-content');
        if (!expandedRow) return;

        const winAmountEl = expandedRow.querySelector('.inline-win-amount');
        const totalWinAmountEl = expandedRow.querySelectorAll('.inline-win-amount')[1];

        const currency = this.currency ||
            this.currentSession?.player?.currency ||
            this.currentSession?._currency ||
            this.currentSession?.current_round?.game_extra_info?.currency ||
            'USD';

        if (winAmountEl) {

            const tumbleStates = this.tumbleData.filter(t => t.isTumble === true);
            if (tumbleStates.length > 0) {

                const currentWin = tumbleStates[0].winAmount || 0;
                const winAmount = HistoryAPI.formatCurrency(currentWin * 1000, currency, this.getLocale());
                winAmountEl.textContent = winAmount;
            } else {

                const winAmountInCents = this.currentSession?.current_round?.win_amount || 0;
                const totalWin = winAmountInCents / 100;
                const winAmount = HistoryAPI.formatCurrency(totalWin * 1000, currency, this.getLocale());
                winAmountEl.textContent = winAmount;
            }
        }

        if (totalWinAmountEl) {

            const winAmountInCents = this.currentSession?.current_round?.win_amount || 0;
            const totalWin = winAmountInCents / 100;
            const totalWinFormatted = HistoryAPI.formatCurrency(totalWin * 1000, currency, this.getLocale());
            totalWinAmountEl.textContent = totalWinFormatted;
        }
    },

    
    animateInline() {
        if (!this.isPlaying || this.isPaused || !this.currentReelGrid) return;

        this.showTumbleInline(this.currentTumble);

        const currentTumble = this.tumbleData[this.currentTumble];
        const delay = currentTumble?.isTumble ? 2000 : 1000;

        setTimeout(() => {
            if (this.currentTumble < this.tumbleData.length - 1) {
                this.currentTumble++;
                this.animateInline();
            } else {

                this.completeInline();
            }
        }, delay);
    },

    
    showTumbleInline(tumbleIndex) {
        const tumble = this.tumbleData[tumbleIndex];
        if (!tumble || !this.currentReelGrid) return;

        const symbols = this.currentReelGrid.querySelectorAll('.inline-reel-symbol');
        const matrix = tumble.matrix;
        const winningPositions = tumble.positions || [];

        const rows = matrix.length;
        const cols = matrix[0]?.length || 5;

        symbols.forEach((symbol) => {
            const row = parseInt(symbol.dataset.row);
            const col = parseInt(symbol.dataset.col);
            const matrixRow = matrix[row];

            if (matrixRow && matrixRow[col]) {
                const letter = matrixRow[col];

                const position = row * cols + col;

                this.renderSymbol(symbol, letter, position);
            }

            if (tumble.isTumble) {

                const position = row * cols + col;
                const isWinner = winningPositions.includes(position);

                if (isWinner) {
                    symbol.classList.add('winning');
                } else {
                    symbol.classList.remove('winning');
                }
            } else {

                symbol.classList.remove('winning');
            }
        });

        this.updateWinDisplayInline(tumbleIndex);
    },

    
    updateWinDisplayInline(tumbleIndex) {
        const tumble = this.tumbleData[tumbleIndex];
        if (!tumble) return;

        const expandedRow = this.currentReelGrid?.closest('.expanded-row-content');
        if (!expandedRow) return;

        const winAmountEl = expandedRow.querySelector('.inline-win-amount');
        const totalWinAmountEl = expandedRow.querySelectorAll('.inline-win-amount')[1];

        let currency = this.currency ||
            this.currentSession?._currency ||
            this.currentSession?.player?.currency ||
            this.currentSession?.current_round?.game_extra_info?.currency;

        if (!currency) {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                currency = urlParams.get('currency') || 
                    sessionStorage.getItem("adaptor_currency") || 
                    sessionStorage.adaptor_currency;
            } catch (e) {

            }
        }

        if (!currency) {
            currency = 'try';
        }

        if (winAmountEl) {

            let currentWin = 0;
            if (tumble.isTumble) {

                currentWin = tumble.winAmount;
            } else {

                let winAmountInCents = this.currentSession?.current_round?.win_amount || 0;

                if (this.currentSession?.current_round?.scatter_win) {
                    const scatterWin = Array.isArray(this.currentSession.current_round.scatter_win) 
                        ? this.currentSession.current_round.scatter_win.reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
                        : parseFloat(this.currentSession.current_round.scatter_win) || 0;

                    let scatterWinInCents;
                    if (scatterWin >= 100) {

                        scatterWinInCents = scatterWin;

                    } else {

                        scatterWinInCents = scatterWin * 100;

                    }
                    
                    winAmountInCents += scatterWinInCents;

                }
                
                currentWin = winAmountInCents / 100;

            }

            const winAmount = HistoryAPI.formatCurrency(currentWin * 1000, currency, this.getLocale());
            winAmountEl.textContent = winAmount;

            if (currentWin > 0) {
                winAmountEl.style.color = '#4CAF50';
            } else {
                winAmountEl.style.color = '';
            }
        }

        if (totalWinAmountEl) {

            let winAmountInCents = this.currentSession?.current_round?.win_amount || 0;

            if (this.currentSession?.current_round?.scatter_win) {
                const scatterWin = Array.isArray(this.currentSession.current_round.scatter_win) 
                    ? this.currentSession.current_round.scatter_win.reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
                    : parseFloat(this.currentSession.current_round.scatter_win) || 0;

                let scatterWinInCents;
                if (scatterWin >= 100) {

                    scatterWinInCents = scatterWin;

                } else {

                    scatterWinInCents = scatterWin * 100;

                }
                
                winAmountInCents += scatterWinInCents;

            }
            
            const totalWin = winAmountInCents / 100;

            const totalWinFormatted = HistoryAPI.formatCurrency(totalWin * 1000, currency, this.getLocale());
            totalWinAmountEl.textContent = totalWinFormatted;

            if (totalWin > 0) {
                totalWinAmountEl.style.color = '#4CAF50';
            } else {
                totalWinAmountEl.style.color = '';
            }
        }
    },

    
    completeInline() {
        this.isPlaying = false;
        this.isPaused = false;

        if (this.tumbleData.length > 0 && this.currentReelGrid) {
            this.showTumbleInline(this.tumbleData.length - 1);
        }
    },

    
    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTumble = 0;
        this.currentReelGrid = null;
    },

    
    start() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.isPaused = false;
        this.currentTumble = 0;

        this.showTumble(0);

        this.animate();
    },

    
    togglePause() {
        this.isPaused = !this.isPaused;

        if (!this.isPaused) {
            this.animate();
        } else {
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            }
        }
    },

    
    setSpeed(speed) {
        this.speed = speed;
    },

    
    animate() {
        if (!this.isPlaying || this.isPaused) return;

        this.showTumble(this.currentTumble);

        const delay = (2000 / this.speed);

        setTimeout(() => {
            if (this.currentTumble < this.tumbleData.length - 1) {
                this.currentTumble++;
                this.animate();
            } else {

                this.complete();
            }
        }, delay);
    },

    
    showTumble(tumbleIndex) {
        const tumble = this.tumbleData[tumbleIndex];
        if (!tumble) return;

        const reelGrid = document.getElementById('reelGrid') || this.currentReelGrid;
        if (!reelGrid) return;

        const symbols = reelGrid.querySelectorAll('.reel-symbol, .inline-reel-symbol');
        const matrix = tumble.matrix;
        const winningPositions = tumble.positions || [];

        symbols.forEach((symbol, index) => {
            const row = parseInt(symbol.dataset.row);
            const col = parseInt(symbol.dataset.col);
            const matrixRow = matrix[row];

            if (matrixRow && matrixRow[col]) {
                symbol.textContent = matrixRow[col];
            }

            const position = row * (matrix[0]?.length || 5) + col;
            const isWinner = winningPositions.includes(position);

            if (isWinner) {
                symbol.classList.add('winning');
            } else {
                symbol.classList.remove('winning');
            }
        });

        if (this.currentReelGrid) {
            this.updateWinDisplayInline(tumbleIndex);
        } else {
            this.updateWinDisplay(tumbleIndex);
        }
    },

    
    updateWinDisplay(tumbleIndex) {
        const tumble = this.tumbleData[tumbleIndex];
        if (!tumble) return;

        const winAmountEl = document.getElementById('winAmount');
        const totalWinAmountEl = document.getElementById('totalWinAmount');

        if (winAmountEl) {

            const winAmount = HistoryAPI.formatCurrency(tumble.winAmount * 1000, this.currency || 'USD', this.getLocale());
            winAmountEl.textContent = winAmount;
        }

        if (totalWinAmountEl) {

            let totalWin = 0;
            for (let i = 0; i <= tumbleIndex; i++) {
                totalWin += this.tumbleData[i]?.winAmount || 0;
            }
            const totalWinFormatted = HistoryAPI.formatCurrency(totalWin * 1000, this.currency || 'USD', this.getLocale());
            totalWinAmountEl.textContent = totalWinFormatted;
        }
    },

    
    complete() {
        this.isPlaying = false;
        this.isPaused = false;

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        if (this.tumbleData.length > 0) {
            this.showTumble(this.tumbleData.length - 1);
        }
    },

    
    reset() {
        this.stop();

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        this.initializeReelGrid();

        const winAmountEl = document.getElementById('winAmount');
        const totalWinAmountEl = document.getElementById('totalWinAmount');

        if (winAmountEl) winAmountEl.textContent = '€0.00';
        if (totalWinAmountEl) totalWinAmountEl.textContent = '€0.00';
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HistoryReplay;
}

