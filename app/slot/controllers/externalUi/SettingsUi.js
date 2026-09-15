

_ng.SettingsUi= function(parent){
    this.parentExternalUI = parent;
    this.addListeners();
}

  _ng.SettingsUi.prototype.constructor = _ng.SettingsUi;
  var settings_euc = _ng.SettingsUi.prototype;

  settings_euc.addListeners= function() {
    window.addEventListener('ui-popup-settings-btns', (e) => this.handleSettingsButtons(e));
    window.addEventListener('ui-popup-settings-toggls', (e) => this.handleSettingsToggles(e));
    window.addEventListener('ui-other-buttons', (e) => this.handleOtherButtons(e));
  }

  settings_euc.syncInitialSettings = function(){
    var  settingsArr = ['music', 'sound'];
    for(var i=0; i<settingsArr.length; i++)
    {
      var status = pixiLib.getLocalStorageItem(settingsArr[i]) !== 'false';
      window.externalUi.call('ui-popup-settings', 'setToggle', settingsArr[i], status);
    }

    // window.externalUi.call('ui-popup-settings', 'setToggle', 'turbo',  'false');

    //In external ui 'intro_screen' is used and in core 'noIntro' is used...
    const noIntro = pixiLib.getLocalStorageItem("noIntro") === 'true';
    window.externalUi.call('ui-popup-settings', 'setToggle', 'intro_screen',  !noIntro);
  }

  settings_euc.show =function() {
    window.externalUi.call('ui-popup-settings', 'show');
    //this.showOverlay();
  }

  settings_euc.hide = function() {
    window.externalUi.call('ui-popup-settings', 'hide');
    this.hideOverlay();
  }

  //TODO fix overlay issue in core
  //TODO remove show and hide overlay after fix
  settings_euc.showOverlay = function() {
    window.externalUi.call('overlay', 'show');
     var el = document.querySelector('.overlay');
    if (el) {
      el.style.display = '';
    }
  }

  settings_euc.hideOverlay = function() {
    window.externalUi.call('overlay', 'hide'); //not working
     var el = document.querySelector('.overlay');
    if (el) {
      el.style.display = 'none';
    }
  }

  settings_euc.handleSettingsButtons = function(e){

    const {detail} = e;
    if (detail === 'history') {
    console.log('Opening History Choice Panel');
    this.hide();
    this.hideOverlay();
    HistoryChoicePanel.show();
    window.addEventListener('history-choice-selected', function handleChoice(event) {
      const choice = event.detail;
      if (choice === 'history') {
        // const url = `history.html?user_id=${UserModel.userId}`;
        if (coreApp.gameView.settingsPanel) {
          
          coreApp.gameView.settingsPanel.onHistoryPanelClick();
        }
      } else if (choice === 'replay') {
          if (coreApp.gameView.settingsPanel) {
          
          coreApp.gameView.settingsPanel.onHistoryTitleClick();
        }
        
      }
      window.removeEventListener('history-choice-selected', handleChoice);
    }, { once: true });
  }

    if (detail === 'paytable') {
      console.log('paytable button click');
      window.externalUi.call('ui-help-popup', 'show');
    }
  }
  settings_euc.handleSettingsToggles = function(e){
    const { detail } = e;

    var item = detail.item;
    var state = detail.state;
    pixiLib.setLocalStorageItem(item, state);
    switch (item) {
      case 'music':
        if(state) _mediator.publish("ambienceSoundOff");
        else  _mediator.publish("ambienceSoundOn");
        break;

      case 'sound':
        if(state) _mediator.publish("soundEffectOff");
        else  _mediator.publish("soundEffectOn");
        break;

      case 'turbo':
        if(state)  this.parentExternalUI.turbo.setGameSpeed('normal');
        else   this.parentExternalUI.turbo.setGameSpeed('turbo');
        break;

      case 'intro_screen':
        pixiLib.setLocalStorageItem('noIntro', !state);
        break;
    }
  }

  settings_euc.handleOtherButtons = function(e){
    const {detail} = e;
    if (detail == 'settings-close') {
      this.hideOverlay();
    }
    if (detail == 'help-page-close') {
      this.hideOverlay();
    }
  }

settings_euc.setTurbo = function(speed){
  window.externalUi.call('ui-popup-settings', 'setToggle', 'turbo', false);

    if (speed === 'normal') {
      window.externalUi.call('ui-popup-settings', 'setToggle', 'turbo', true);
    } else if (speed === 'turbo') {
    } else if (speed === 'quick') {
    }
}

