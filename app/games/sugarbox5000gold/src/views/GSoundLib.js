var s = SoundLib.prototype.constructor;
s.prototype.playBg = function (nameObj) {
    var name = (typeof (nameObj) == "string") ? nameObj : nameObj.name;
    var volume = (nameObj.volume != undefined) ? nameObj.volume : 1;
    if (_ng.isAmbienceSoundActive == false) {
        return;
    }
    this.bgMaxVolume = volume;
    if (this.bgId) {
       if (this.bgId in this.primaryList) {
            this.primSndCtr.fade(volume, 0, 1000, this.curSndList[this.bgId]);
        } else {
            this.sndCtr.fade(volume, 0, 1000, this.curSndList[this.bgId]);
        }
    }
    if (name in this.primaryList) {
        this.bgId = name;
        this.curSndList[name] = this.primSndCtr.play(name);
        this.primSndCtr.fade(0, volume, 1000, this.curSndList[this.bgId]);
        this.primSndCtr.loop(true, this.curSndList[this.bgId]);
    } else if (name in this.secondaryList) {
        this.bgId = name;
        this.curSndList[name] = this.sndCtr.play(name);
        this.sndCtr.fade(0, volume, 1000, this.curSndList[this.bgId]);
        this.sndCtr.loop(true, this.curSndList[this.bgId]);
    }
    this.isPlaying = true;
};
s.prototype.stopBg = function () {
    if (this.bgId in this.primaryList) {
        this.primSndCtr.stop(this.curSndList[this.bgId]);
    } else if (this.bgId in this.secondaryList) {
        this.sndCtr.stop(this.curSndList[this.bgId]);
    }
};
s.prototype.focusSound = function (bool) {
    if (!bool) {
        this.setPreviousVolume(this.curVolume);
        this.onWindowChangeVolume = this.curVolume;
        this.mute(true, true);
    } else if (this.sndState) {
        var volume = (_sndLib.onWindowChangeVolume) ? _sndLib.onWindowChangeVolume : _sndLib.curVolume;
        this.setVolume(volume);
        this.mute(false);
    }
};
 
s.prototype.focusSoundOn = function() {
 
    this.setPreviousVolume(this.onWindowChangeVolume);
    if(!this.muteState){
        this.setVolume(this.previousVolume?this.previousVolume: 0.2);
    }
                                                                            
}

SoundLib.prototype.setupAudioResumeHandlers = function () {
    const self = this;

    function resumeAudioContext() {
        if (Howler.ctx && Howler.ctx.state === 'suspended') {
            Howler.ctx.resume().then(() => {
                self.focusSoundOn?.(); // Optional: only if defined
            }).catch((err) => {
                console.warn('Audio context resume failed:', err);
            });
        }
    }

    // Resume on visibility change (tab switch, screen lock)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            resumeAudioContext();
        }
    });

    // Resume on every user interaction (touch/click)
    const resumeOnInteraction = () => {
        resumeAudioContext();
    };
    document.addEventListener('touchend', resumeOnInteraction);
    document.addEventListener('click', resumeOnInteraction);
};

const _sndLib = new SoundLib();
_sndLib.setupAudioResumeHandlers();