/**
 * History Page Localization
 * Provides translations for English and Turkish
 */

const HistoryLocale = {
    currentLocale: 'en',
    
    /**
     * Initialize locale from URL parameter
     */
    init() {
        const urlParams = HistoryAPI.getURLParams();
        this.currentLocale = (urlParams.userLocale || 'en').toLowerCase();
        
        // Normalize locale (en, tr)
        if (this.currentLocale === 'tr' || this.currentLocale === 'turkish') {
            this.currentLocale = 'tr';
        } else if (this.currentLocale === 'ro' || this.currentLocale === 'romanian') {
            this.currentLocale = 'ro';
        } else {
            this.currentLocale = 'en';
        }
    },
    
    /**
     * Get translated string
     * @param {string} key - Translation key
     * @returns {string} Translated string
     */
    t(key) {
        const translations = this.translations[this.currentLocale] || this.translations['en'];
        return translations[key] || key;
    },
    
    /**
     * Translations for all supported languages
     */
    translations: {
        en: {
            // Page title
            pageTitle: 'History',
            
            // Table headers
            sessionId: 'Round ID',
            date: 'Date',
            balance: 'Balance',
            bet: 'Bet',
            win: 'Win',
            winningAmount: 'Win',
            type: 'Type',
            link: 'Link',
            generate: 'Generate',
            singleRecordTitle: 'Round History',
            pfrRoundsTitle: 'PFR Rounds',
            failedToLoadPfrRounds: 'Failed to load PFR rounds. Please try again.',
            
            // Buttons
            previous: 'Previous',
            next: 'Next',
            close: 'Close',
            
            // Loading messages
            loadingHistory: 'Loading History...',
            loadingSpin: 'Loading Spin...',
            replayingSpin: 'Replaying Spin...',
            
            // Error messages
            noHistoryFound: 'No history found',
            failedToLoad: 'Failed to load history. Please try again.',
            failedToLoadSpin: 'Failed to load spin details. Please try again.',
            
            // Spin section
            spin: 'Spin',
            winLabel: 'Win',
            totalWin: 'Total Win',
            tumble: 'Tumble',
            initial: 'Initial',
            final: 'Final',
            winningPositions: 'Winning Positions',
            tumbleWin: 'Tumble Win',
            
            // Card labels (mobile)
            betLabel: 'Bet',
            winLabel: 'Win',
            winX: 'Multiplier',
            balanceLabel: 'Balance',
            
            // Bonus sub-table headers
            gameSessionId: 'Round ID',
            date: 'Date',
            newBalance: 'New Balance',
            bet: 'Bet',
            multiplier: 'Multiplier',
            amountWon: 'Amount Won',
            
            // Copy feedback
            copied: 'Copied!',
            
            // Date format
            dateFormat: 'DD/MM/YYYY HH:mm:ss'
        },
        
        tr: {
            // Page title
            pageTitle: 'Geçmiş',
            
            // Table headers
            sessionId: 'Tur ID',
            date: 'Tarih',
            balance: 'Yeni Bakiye',
            bet: 'Bahis',
            win: 'Kazanılan Tutar',
            winningAmount: 'Kazanılan Tutar',
            winX: 'KazançX',
            type: 'Tür',
            link: 'Bağlantı',
            generate: 'Oluştur',
            singleRecordTitle: 'Tur Geçmişi',
            pfrRoundsTitle: 'PFR Turları',
            failedToLoadPfrRounds: 'PFR turları yüklenemedi. Lütfen tekrar deneyin.',
            
            // Buttons
            previous: 'Önceki',
            next: 'Sonraki',
            close: 'Kapat',
            
            // Loading messages
            loadingHistory: 'Geçmiş Yükleniyor...',
            loadingSpin: 'Spin Yükleniyor...',
            replayingSpin: 'Spin Tekrar Oynatılıyor...',
            
            // Error messages
            noHistoryFound: 'Geçmiş bulunamadı',
            failedToLoad: 'Geçmiş yüklenemedi. Lütfen tekrar deneyin.',
            failedToLoadSpin: 'Spin detayları yüklenemedi. Lütfen tekrar deneyin.',
            
            // Spin section
            spin: 'Spin',
            winLabel: 'Kazanç',
            totalWin: 'Toplam kazanç',
            tumble: 'Takla',
            initial: 'Başlangıç',
            final: 'Final',
            winningPositions: 'Kazanan Pozisyonlar',
            tumbleWin: 'Takla Kazancı',
            
            // Card labels (mobile)
            betLabel: 'Bahis',
            winLabel: 'Kazanç',
            winX: 'Çarpan',
            balanceLabel: 'Bakiye',
            
            // Bonus sub-table headers
            gameSessionId: 'Tur ID',
            date: 'Tarih',
            newBalance: 'Yeni Bakiye',
            bet: 'Bahis',
            multiplier: 'Çarpan',
            amountWon: 'Kazanılan Tutar',
            
            // Copy feedback
            copied: 'Kopyalandı!',
            
            // Date format
            dateFormat: 'DD.MM.YYYY HH:mm:ss'
        },

        ro: {
            pageTitle: 'Istoric',
            sessionId: 'ID Runda',
            date: 'Data',
            balance: 'Sold Nou',
            bet: 'Pariu',
            win: 'Câștig',
            winningAmount: 'Câștig',
            winX: 'Multiplicator',
            type: 'Tip',
            link: 'Link',
            generate: 'Generează',
            singleRecordTitle: 'Istoric Runda',
            pfrRoundsTitle: 'Runde PFR',
            failedToLoadPfrRounds: 'Încărcarea rundelor PFR a eșuat. Te rugăm să încerci din nou.',
            previous: 'Anterior',
            next: 'Următor',
            close: 'Închide',
            loadingHistory: 'Se încarcă istoricul...',
            loadingSpin: 'Se încarcă spinul...',
            replayingSpin: 'Se reia spinul...',
            noHistoryFound: 'Nu s-a găsit niciun istoric',
            failedToLoad: 'Încărcarea istoricului a eșuat. Te rugăm să încerci din nou.',
            failedToLoadSpin: 'Încărcarea detaliilor spinului a eșuat. Te rugăm să încerci din nou.',
            spin: 'Spin',
            winLabel: 'Câștig',
            totalWin: 'Câștig Total',
            tumble: 'Răsturnare',
            initial: 'Inițial',
            final: 'Final',
            winningPositions: 'Poziții câștigătoare',
            tumbleWin: 'Câștig Răsturnare',
            betLabel: 'Pariu',
            winX: 'Multiplicator',
            balanceLabel: 'Sold',
            gameSessionId: 'ID Runda',
            newBalance: 'Sold Nou',
            multiplier: 'Multiplicator',
            amountWon: 'Câștig',
            copied: 'Copiat!',
            dateFormat: 'DD/MM/YYYY HH:mm:ss'
        }
    },
    
    /**
     * Format date based on locale
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        const format = this.t('dateFormat');
        
        if (format === 'DD.MM.YYYY HH:mm:ss') {
            // Turkish format
            return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
        } else {
            // English format (DD/MM/YYYY)
            return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        }
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HistoryLocale;
}

