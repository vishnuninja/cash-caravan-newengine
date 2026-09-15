

const HistoryAPI = {
    // baseURL: 'https://dev-h3-games.ninjagaming.com/sugarbox5000gold/api/game',

       get baseURL() {
        let hostUrl = window.location.host;
        if (location.href.indexOf('localhost') > -1) {
            hostUrl = "dev-h3-games.ninjagaming.com";
        }
        return `https://${hostUrl}/cash-caravan/api/game`;
    },
    
    /**
     * Get URL parameters
     */
    getURLParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            userLocale: params.get('user_locale') || 'en',
            userId: params.get('user_id') || params.get('userId') || '',
            user_id: params.get('user_id') || params.get('userId') || '',
            roundId: params.get('round_id') || params.get('roundId') || '',
            transactionId: params.get('transaction_id') || params.get('transactionId') || '',
            currency: params.get('currency') || '',
            page: parseInt(params.get('page')) || 1,
            limit: parseInt(params.get('limit')) || 20
        };
    },
    
    
    async fetchHistoryList(page = 1, limit = 20) {
        try {
            const urlParams = this.getURLParams();

            let userId = urlParams.userId || urlParams.user_id;
            if (!userId) {
                userId = sessionStorage.getItem('rgsUserID') || sessionStorage.rgsUserID || '';
            }
            
            if (!userId) {
                throw new Error('User ID is required');
            }
            
            const url = `${this.baseURL}/history-pagination?user_id=${encodeURIComponent(userId)}&game=sugarbox5000gold&limit=${limit}&page=${page}`;
            
            console.log('📡 Fetching history:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();

            return Array.isArray(data) ? data : [];
        } catch (error) {

            throw error;
        }
    },
    
    
    async fetchSessionDetails(roundId, currency) {
        try {
            if (!roundId) {
                throw new Error('Round ID is required');
            }
            const search = new URLSearchParams();
            search.set('round_id', roundId);
            if (currency) search.set('currency', currency);
            const url = `${this.baseURL}/history/session?${search.toString()}`;

            if (currency) {

            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();

            if (currency) {
                data._currency = currency;
            }
            
            return data;
        } catch (error) {

            throw error;
        }
    },

    
    buildRoundUrls(roundId, currency, userLocale) {
        const locale = (userLocale || this.getURLParams().userLocale || 'en').toLowerCase();
        const curr = (currency || this.getURLParams().currency || 'try');

        const local = new URL(window.location.href);
        local.search = '';
        local.searchParams.set('user_locale', locale);
        local.searchParams.set('round_id', roundId);
        local.searchParams.set('currency', curr);

        const apiSearch = new URLSearchParams();
        apiSearch.set('round_id', roundId);
        apiSearch.set('currency', curr);
        const apiUrl = `${this.baseURL}/history/session?${apiSearch.toString()}`;

        return { localUrl: local.toString(), apiUrl };
    },

    
    buildSingleRecordUrl(roundId, currency, userLocale) {
        const locale = (userLocale || this.getURLParams().userLocale || 'en').toLowerCase();

        const single = new URL('round.html', window.location.href);
        single.search = '';
        single.searchParams.set('user_locale', locale);
        single.searchParams.set('round_id', roundId);
        return single.toString();
    },

    buildPfrRoundsUrl(transactionId, userLocale) {
        const pfr = new URL('pfrRound/pfr_round.html', window.location.href);
        pfr.search = '';
        pfr.searchParams.set('transaction_id', transactionId);
        const locale = (userLocale || this.getURLParams().userLocale || '').toLowerCase();
        if (locale) {
            pfr.searchParams.set('user_locale', locale);
        }
        return pfr.toString();
    },

    async fetchFreebets(transactionId) {
        try {
            if (!transactionId) {
                throw new Error('Transaction ID is required');
            }
            const url = `${this.baseURL}/history/freebets?transaction_id=${encodeURIComponent(transactionId)}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            throw error;
        }
    },

    
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return;
            }
        } catch (e) {

        }

        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    },

    
    createHistoryItemFromSession(sessionData, currencyOverride) {

        if (sessionData && sessionData.round_info) {
            const ri = sessionData.round_info;
            return {
                ...ri,
                id: ri.id || ri.round_id || sessionData?.current_round?.round_id || '',
                currency: currencyOverride || ri.currency || sessionData?.player?.currency || 'try',
                updated_at: ri.updated_at || sessionData?.current_round?.updated_at || sessionData?.current_round?.created_at || '',
                cumulative_multiplier: ri.cumulative_multiplier || 0,
                _fromRoundInfo: true,
                _sessionData: sessionData
            };
        }

        const roundId = sessionData?.current_round?.round_id || '';
        const currency = (currencyOverride || sessionData?.player?.currency || 'try');
        const spinType = (sessionData?.current_round?.spin_type || 'normal').toLowerCase();

        const winAmountRaw = sessionData?.current_round?.win_amount ?? 0;

        const wagerRaw = sessionData?.current_round?.wager ?? 0;

        return {
            id: roundId,
            updated_at: sessionData?.current_round?.updated_at || sessionData?.current_round?.created_at || '',
            currency,
            wager: wagerRaw,
            win_amount: winAmountRaw,
            cumulative_multiplier: sessionData?.current_round?.cumulative_multiplier || sessionData?.cumulative_multiplier || 0,

            player_balance: sessionData?.player?.balance ?? sessionData?.player?.cash ?? null,

            is_normal_spin: spinType === 'normal',
            is_buy_feature: false,
            is_bonus: spinType !== 'normal',
            IsPfr: false,

            _fromSession: true,
            _sessionData: sessionData
        };
    },
    
    
    async fetchBonusSessions(roundId, currency) {
        try {
            if (!roundId) {
                throw new Error('Round ID is required');
            }
            const search = new URLSearchParams();
            search.set('round_id', roundId);
            if (currency) search.set('currency', currency);
            const url = `${this.baseURL}/history/session?${search.toString()}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();

            const sessionsArray = Array.isArray(data) ? data : [data];

            return sessionsArray;
        } catch (error) {

            throw error;
        }
    },
    
    
    formatDate(dateString) {
        if (typeof HistoryLocale !== 'undefined') {
            return HistoryLocale.formatDate(dateString);
        }

        if (!dateString) return '';
        
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    },
    
    
    formatCurrency(value, currency = 'USD', locale = null) {
        if (value === null || value === undefined) return '$ 0.00';

        const amount = value / 1000;
        
        const currencySymbols = {
            'USD': '€',
            'USD': '$',
            'GBP': '£',
            'TRY': '₺',
            'INR': '₹',
            'IDR': 'Rp',
            'THB': '฿',
            'VND': '₫',
            'BRL': 'R$',
            'PHP': '₱',
            'MYR': 'RM',
            'KRW': '₩',
            'JPY': '¥',
            'CNY': '¥',
            'AUD': 'A$',
            'CAD': 'C$',
            'RUB': '₽',
            'PLN': 'zł',
            'RON': 'lei'
        };
        
        const symbol = currencySymbols[currency.toUpperCase()] || currency.toUpperCase();

        let formatLocale = locale;
        if (!formatLocale) {
            const urlParams = this.getURLParams();
            formatLocale = urlParams.userLocale || 'en';
        }

        const normalizedLocale = formatLocale.toLowerCase() === 'tr' ? 'tr-TR' : 'en-US';

        const formatted = amount.toLocaleString(normalizedLocale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 3
        });
        
        return `${symbol} ${formatted}`;
    },
    
    
    getCurrencySymbol(currency = 'USD') {
        const currencySymbols = {
            'USD': '€',
            'USD': '$',
            'GBP': '£',
            'TRY': '₺',
            'INR': '₹',
            'IDR': 'Rp',
            'THB': '฿',
            'VND': '₫',
            'BRL': 'R$',
            'PHP': '₱',
            'MYR': 'RM',
            'KRW': '₩',
            'JPY': '¥',
            'CNY': '¥',
            'AUD': 'A$',
            'CAD': 'C$',
            'RUB': '₽',
            'PLN': 'zł',
            'RON': 'lei'
        };
        
        return currencySymbols[currency.toUpperCase()] || currency.toUpperCase();
    },
    
    
    getBaseWager(totalWager, feature) {
        let wager = totalWager / 10;
        switch (feature) {
            case 'buyFreeSpins':
                wager = wager / 100;
                break;
            case 'superBuyFreeSpins':
                wager = wager / 500;
                break;
            case 'bonus':
                wager = wager / 10;
                break;
        }
        return wager;
    },
    
    
    getTotalWager(totalWager) {
        return totalWager / 10;
    },
    
    
    getNormalizedBaseWager(totalWager, feature) {
        const baseWager = this.getBaseWager(totalWager, feature);
        let wagerStr = (baseWager / 100).toFixed(3);

        wagerStr = wagerStr.replace(/\.?0+$/, '');
        return wagerStr;
    },
    
    
    getNormalizedTotalWager(totalWager) {
        const total = this.getTotalWager(totalWager);
        let wagerStr = (total / 100).toFixed(3);

        wagerStr = wagerStr.replace(/\.?0+$/, '');
        return wagerStr;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HistoryAPI;
}