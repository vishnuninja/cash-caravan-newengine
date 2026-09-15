

const HistoryTheme = {
    currentTheme: 'dark',
    
    
    init() {

        const savedTheme = localStorage.getItem('historyTheme') || 'dark';
        this.setTheme(savedTheme);
    },
    
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('historyTheme', theme);

        this.updateThemeIcon();
    },
    
    
    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    },
    
    
    updateThemeIcon() {
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HistoryTheme;
}

