
(function (global) {
  'use strict';

  const STYLES = `
    .history-choice-overlay {
      position: fixed;
      inset: 0;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 32px;
      background: rgba(0,0,0,0.55);
      z-index: 10050;
    }
    .history-choice-overlay.active {
      display: flex;
    }
    .history-choice-card {
      width: min(520px, 92vw);
      background: rgba(0,0,0,0.8);
      border-radius: 26px;
      border: 1px solid rgba(255,255,255,0.12);
      padding: 36px;
      box-shadow: 0 30px 60px rgba(0,0,0,0.4);
      font-family: 'Montserrat', sans-serif;
      color: #fff;
      text-align: center;
      position: relative;
    }
    .history-choice-title {
      font-size: 24px;
      letter-spacing: 0.3em;
      margin-bottom: 10px;
    }
    .history-choice-desc {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: rgba(255,255,255,0.6);
      margin-bottom: 24px;
    }
    .history-choice-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    @media (min-width: 600px) {
      .history-choice-actions {
        flex-direction: row;
      }
    }
    .history-choice-btn {
      flex: 1;
      border-radius: 18px;
      border: 1px solid rgba(255,255,255,0.2);
      padding: 18px;
      background: rgba(18,18,28,0.9);
      color: #fff;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 14px;
      font-weight: 600;
      transition: transform 0.15s, border-color 0.15s;
    }
    .history-choice-btn:hover {
      transform: translateY(-2px);
      border-color: rgba(255,255,255,0.45);
    }
    .history-choice-btn.primary {
      background: #f7c746;
      color: #1d1407;
      border: none;
      box-shadow: 0 16px 36px rgba(247,199,70,0.35);
    }
    .history-choice-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(0,0,0,0.4);
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      z-index: 1;
    }
  `;

  function createPanel() {
    if (document.getElementById('history-choice-panel')) return;

    const style = document.createElement('style');
    style.id = 'history-choice-panel-styles';
    style.textContent = STYLES;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'history-choice-panel';
    overlay.className = 'history-choice-overlay';


  let panelHtml = `
    <div class="history-choice-card">
      <button class="history-choice-close" aria-label="Close">×</button>
      <div class="history-choice-title" localize="game_history_title"></div>
      <p class="history-choice-desc" localize="game_history_desc">
      </p>
      <div class="history-choice-actions">
        <button class="history-choice-btn primary" data-choice="replay">
          <span class="history-choice-btn-label" localize="replay_panel_btn"></span>
        </button>
        <button class="history-choice-btn" data-choice="history">
          <span class="history-choice-btn-label" localize="history_tab_btn">History Tab</span>
        </button>
      </div>
    </div>
  `;


  function getTranslation(key) {
    return gameLiterals[key] || key; 
  }

  // Replace all `localize` attributes with the actual translated text
  panelHtml = panelHtml.replace(
    /(<[^>]*localize=["']([^"']+)["'][^>]*>)[^<]*?(<\/[^>]*>)/gi,
    function (match, tag, key, closingTag) {
      return tag + getTranslation(key) + closingTag;
    }
  );

  overlay.innerHTML = panelHtml;

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) hide();
  });

  overlay.querySelector('.history-choice-close').addEventListener('click', hide);

  overlay.querySelectorAll('[data-choice]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const choice = btn.dataset.choice;
      hide();
      window.dispatchEvent(new CustomEvent('history-choice-selected', { detail: choice }));
    });
  });

  document.body.appendChild(overlay);
}

  function show() {
    createPanel();
    const el = document.getElementById('history-choice-panel');
    if (el) {
      el.classList.add('active');
    }
  }

  function hide() {
    const el = document.getElementById('history-choice-panel');
    if (el) {
      el.classList.remove('active');
    }
  }

  global.HistoryChoicePanel = { show, hide};
})(typeof window !== 'undefined' ? window : this);


