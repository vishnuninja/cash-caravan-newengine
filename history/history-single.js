

(function () {

    document.body.classList.add('single-record');

    const gameLogo = document.getElementById('gameLogo');
    const loadingLogo = document.getElementById('loadingLogo');

    const logoPath = "assets/historyLogo.png";

    if (gameLogo) gameLogo.src = logoPath;
    if (loadingLogo) loadingLogo.src = logoPath;

    if (typeof HistoryTheme !== 'undefined') {
        HistoryTheme.init();
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.addEventListener('click', () => HistoryTheme.toggle());
    }

    if (typeof HistoryLocale !== 'undefined') {
        HistoryLocale.init();
        const gameTitle = document.getElementById('gameTitle');
        if (gameTitle) {
            gameTitle.textContent = (HistoryLocale.t('singleRecordTitle') || 'Round History');
        }

        const thSessionId = document.getElementById('thSessionId');
        const thDate = document.getElementById('thDate');
        const thBalance = document.getElementById('thBalance');
        const thBet = document.getElementById('thBet');
        const thWinX = document.getElementById('thWinX');
        const thWin = document.getElementById('thWin');
        const thType = document.getElementById('thType');

        if (thSessionId) thSessionId.textContent = HistoryLocale.t('sessionId');
        if (thDate) thDate.textContent = HistoryLocale.t('date');
        if (thBalance) thBalance.textContent = HistoryLocale.t('balance');
        if (thBet) thBet.textContent = HistoryLocale.t('bet');
        if (thWinX) thWinX.textContent = HistoryLocale.t('winX');
        if (thWin) thWin.textContent = HistoryLocale.t('win');
        if (thType) thType.textContent = HistoryLocale.t('type');
    } else {
        const gameTitle = document.getElementById('gameTitle');
        if (gameTitle) gameTitle.textContent = 'Round History';
    }

    const closeBtn = document.getElementById('closeBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {

            if (window.opener) {

                window.close();
            } else {

                if (window.history.length > 1) {

                    window.history.back();
                } else {

                    const currentUrl = window.location.href;
                    const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
                    window.location.href = baseUrl + '/history.html';
                }
            }
        });
    }

    const windowWidth = window.innerWidth || 1280;
    const isMobile = windowWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const tableContainer = document.getElementById('historyTableContainer');
    const cardsContainer = document.getElementById('historyCardsContainer');

    if (isMobile) {
        if (tableContainer) tableContainer.style.display = 'none';
        if (cardsContainer) cardsContainer.style.display = 'block';
        if (typeof HistoryMobile !== 'undefined') new HistoryMobile();
    } else {
        if (tableContainer) tableContainer.style.display = 'block';
        if (cardsContainer) cardsContainer.style.display = 'none';
        if (typeof HistoryDesktop !== 'undefined') new HistoryDesktop();
    }
})();

