
_ng.Music = function() {
    localStorageVolume = window.localStorage.getItem(_ng.GameConfig.gameName+"_SoundsVolume");

    const initialVolume = this.localStorageVolume ? `${+this.localStorageVolume * 100}` : '20';

    // 1. Initialize the Volume
    this.updateSounds(initialVolume);
    
    window.externalUi.call('ui-sound-range', 'setValue', initialVolume);

    if (this.localStorageVolume === '0') {
      window.externalUi.call('music-on-button', 'hide');
      window.externalUi.call('music-off-button', 'show');
    }

    window.addEventListener('ui-sound-range', (e) => {
      const customEvent = e;
      this.updateSounds(customEvent.detail);

      if (customEvent.detail === 0) {
        window.externalUi.call('music-on-button', 'hide');
        window.externalUi.call('music-off-button', 'show');
      } else {
        window.externalUi.call('music-off-button', 'hide');
        window.externalUi.call('music-on-button', 'show');
      }
    });
  }

    _ng.Music.prototype.constructor = _ng.Music;
    var music_eui = _ng.Music.prototype;

  music_eui.updateSounds = function(value) {
    const volume = +value / 100;
    window.localStorage.setItem(_ng.GameConfig.gameName+"_SoundsVolume", `${volume}`);
    
    _sndLib.setVolume(volume);

    if (_sndLib.curVolume == 0) {
      _sndLib.mute(true);
    } else {
      _sndLib.mute(false);
    }
  }

  music_eui.show = function(){
    const visible = window.externalUi.call('ui-sound-range', 'isVisible');
    window.externalUi.call('ui-sound-range', visible ? 'hide' : 'show');
  }
