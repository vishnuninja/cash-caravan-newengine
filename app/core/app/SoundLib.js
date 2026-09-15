function SoundLib() {
    this.filePath = "";
    this.fileName = "";
    this.sprite = {};
    this.curSndList = {};
    this.primSndCtr = {};
    this.primaryList = {};
    this.secondaryList = {};
    this.sndCtr = {};
    this.callback = {};

    this.sndState = true;
    this.focusState = true;
    this.isLowBg = true;
    this.defaultVolume = 0.8;
    this.bgMaxVolume = 0.6;
    this.bgMinVolume = 0.2;
    this.curVolume = 0.8;
    this.previousVolume = 0.8;
    this.isSpecificSndLoaded = false;
    _ng.isSoundEffectsActive = true;
    _ng.isAmbienceSoundActive = true;
}

_sndLib = new SoundLib();

SoundLib.prototype.constructor = SoundLib;

//_sndLib.primSndCtr._sounds[0]._loop

SoundLib.prototype.loadJSON = function (path, callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var resp = JSON.parse(xhr.responseText);
            callback(resp);
        } else if (xhr.readyState === 2 && xhr.status === 404) {
            callback({});
        }
    };
    xhr.open('GET', path, true);
    xhr.send();
};

SoundLib.prototype.loadSpecificSound = function (file){
    this.specificSound = new Howl({ src: [file] }); // 'loadingLogo.mp3'
    // Clear listener after first call.
    this.specificSound.once('load', function () {
        this.isSpecificSndLoaded = true;
    }.bind(this));
}

SoundLib.prototype.init = function (obj, callback, type) {
    this.filePath = obj.filePath.replace("%A1%", coreApp.gameName);
    if (type == "primary") {
        this.fileName = obj.primary.fileName;
        this.sprite = obj.sprite;
        this.isLowBg = (obj.isLowBg == false) ? false : true;
        this.bgMinVolume = obj.bgMinVolume ? obj.bgMinVolume : this.bgMinVolume;
        this.callback = callback;
        this.loadJSON(this.filePath + "" + this.fileName, this.onPrimarySoundsLoaded.bind(this));
    } else if (type == "secondary") {
        this.fileName = obj.secondary.fileName;
        // this.sprite = obj.sprite;
        // this.isLowBg = (obj.isLowBg == false) ? false : true;
        // this.bgMinVolume = obj.bgMinVolume ? obj.bgMinVolume : this.bgMinVolume;
        this.callback = callback;
        this.loadJSON(this.filePath + "" + this.fileName, this.onGameSoundsLoaded.bind(this));
    }

};

SoundLib.prototype.onPrimarySoundsLoaded = function (data) {
    var tempArr = [];
    for (var i = 0; i < data.urls.length; i++) {
        tempArr.push(this.filePath + data.urls[i]);
    }
    data.src = tempArr;
    this.primaryList = data.sprite;
    this.primSndCtr = new Howl(data);
    this.primSndCtr.on("load", this.onLoaded.bind(this));
}
SoundLib.prototype.onGameSoundsLoaded = function (data) {
    var tempArr = [];
    if (!data.urls) {
        this.callback();
        return;
    }
    for (var i = 0; i < data.urls.length; i++) {
        tempArr.push(this.filePath + data.urls[i]);
    }
    data.src = tempArr;
    this.secondaryList = data.sprite;
    this.sndCtr = new Howl(data);
    this.sndCtr.on("load", this.onLoaded.bind(this));
};


SoundLib.prototype.onLoaded = function (e) {
    this.callback();
};

SoundLib.prototype.playBg = function (nameObj) {

    var name = (typeof (nameObj) == "string") ? nameObj : nameObj.name;
    var volume = (nameObj.volume != undefined) ? nameObj.volume : 1;

    if (_ng.isAmbienceSoundActive == false) {
        return;
    }

    this.bgMaxVolume = volume;

     if (this.bgId) {
           if (this.bgId in this.primaryList) {
                this.primSndCtr.fade(volume, 0, 1000, this.curSndList[this.bgId]);
           }else {
               this.sndCtr.fade(volume, 0, 1000, this.curSndList[this.bgId]);
           }
     }
    console.log("BG Volume = ", volume, nameObj);

    if (name in this.primaryList) {
        // if (this.bgId) {            
        //     this.primSndCtr.fade(volume, 0, 1000, this.curSndList[this.bgId]);
        // }
        this.bgId = name;
        this.curSndList[name] = this.primSndCtr.play(name);
        this.primSndCtr.fade(0, volume, 1000, this.curSndList[this.bgId]);
    } else if (name in this.secondaryList) {       
        this.bgId = name;
        this.curSndList[name] = this.sndCtr.play(name);
        this.sndCtr.fade(0, volume, 1000, this.curSndList[this.bgId]);
    }
};

SoundLib.prototype.stopBg = function () {
    console.log(this.bgId);
    if (this.bgId in this.primaryList) {
        this.primSndCtr.stop(this.curSndList[this.bgId]);
    } else if (this.bgId in this.secondaryList) {
        this.sndCtr.stop(this.curSndList[this.bgId]);
    }
};

SoundLib.prototype.play = function (nameObj, options) {
    try {
        if (_ng.isSoundEffectsActive == false) {
            return;
        }

        var name = (nameObj.name !== undefined) ? nameObj.name : "";
        var volume = (nameObj.volume != undefined) ? nameObj.volume : 1;
        var delay = (nameObj.delay !== undefined) ? nameObj.delay : 0;
        var fadeIn = (nameObj.fadeIn !== undefined) ? nameObj.fadeIn : false;
        var fadeInTime = (nameObj.fadeInTime !== undefined) ? nameObj.fadeInTime : 1000;

        if(options){
            fadeIn = (options.fadeIn !== undefined) ? options.fadeIn : fadeIn;
            fadeInTime = (options.fadeInTime !== undefined) ? options.fadeInTime : fadeInTime;
            delay = (options.delay !== undefined) ? options.delay : delay;
        }

        setTimeout(function () {
            if (name in this.primaryList) {
                this.curSndList[name] = this.primSndCtr.play(name);
                this.primSndCtr.volume(volume, this.curSndList[name]);
                if (nameObj.fadeIn) {
                    this.primSndCtr.fade(0, volume, 1000, this.curSndList[name]);
                }
                _mediator.publish("howlerId", {idName: name, id: this.curSndList[name], type: "primary"});
            } else if (name in this.secondaryList) {
                this.curSndList[name] = this.sndCtr.play(name);
                this.sndCtr.volume(volume, this.curSndList[name]);
                if (nameObj.fadeIn) {
                    this.sndCtr.fade(0, volume, 1000, this.curSndList[name]);
                }
                _mediator.publish("howlerId", {idName: name, id: this.curSndList[name], type: "secondary"});
            }
        }.bind(this), delay);
    } catch (e) {
        //console.log("Play ==> soundName ==  ", e, " not there");
    }

};

SoundLib.prototype.stop = function (nameObj, options) {
    try {
        var name = (typeof (nameObj) == "string") ? nameObj : nameObj.name;
        if (this.curSndList[name]) {
            if (name in this.primaryList) {
                if (nameObj.fadeOut === true && this.curSndList[name]) {
                    this.primSndCtr.fade(1, 0, 1000, this.curSndList[name]);
                } else {
                    this.primSndCtr.stop(this.curSndList[name]);
                }
            } else if (name in this.secondaryList) {
                if (nameObj.fadeOut === true && this.curSndList[name]) {
                    this.sndCtr.fade(1, 0, 1000, this.curSndList[name]);
                } else {
                    this.sndCtr.stop(this.curSndList[name]);
                }
            }
        }
    } catch (e) {
        console.log("Stop ==> soundName ==  ", e, " not there");
    }
};

SoundLib.prototype.highBg = function () {
    if (_ng.isAmbienceSoundActive == false) {
        return;
    }
    if (this.bgId in this.primaryList) {
        this.primSndCtr.fade(this.bgMinVolume, this.bgMaxVolume, 200, this.curSndList[this.bgId]);
    } else if (this.bgId in this.secondaryList) {
        this.sndCtr.fade(this.bgMinVolume, this.bgMaxVolume, 200, this.curSndList[this.bgId]);
    }
};

SoundLib.prototype.lowBg = function () {
    if (_ng.isAmbienceSoundActive == false) {
        return;
    }
    if (this.bgId in this.primaryList) {
        this.primSndCtr.fade(this.bgMaxVolume, this.bgMinVolume, 200, this.curSndList[this.bgId]);
    } else if (this.bgId in this.secondaryList) {
        this.sndCtr.fade(this.bgMaxVolume, this.bgMinVolume, 200, this.curSndList[this.bgId]);
    }
};


SoundLib.prototype.focusSoundOn = function(){
    // var volume = (_sndLib.onWindowChangeVolume) ? _sndLib.onWindowChangeVolume : _sndLib.curVolume;
    // this.setVolume(volume);
    // this.onWindowChangeVolume = undefined;
    // this.mute(false);
    if(!this.muteState){
        this.setVolume(this.previousVolume?this.previousVolume:1);
    }
    try{
        _mediator.publish("SHOW_LOG", "focus on");
    }catch(e){}
}
SoundLib.prototype.focusSoundOff = function(){
    // if (this.onWindowChangeVolume === undefined) {
    //     this.onWindowChangeVolume = this.curVolume;
    // }
    // this.mute(true, true);
    this.setPreviousVolume(this.curVolume);
    this.setVolume(0);
    try{
        _mediator.publish("SHOW_LOG", "focus off");
    }catch(e){}
}

SoundLib.prototype.focusSound = function (bool) {
    if (!bool) {
        this.setPreviousVolume(this.curVolume);
        if (this.onWindowChangeVolume === undefined) {
            this.onWindowChangeVolume = this.curVolume;
        }
        this.mute(true, true);
    } else if (this.sndState) {
        var volume = (_sndLib.onWindowChangeVolume) ? _sndLib.onWindowChangeVolume : _sndLib.curVolume;
        this.setVolume(volume);
        this.onWindowChangeVolume = undefined;
        this.mute(false);
    }
};

SoundLib.prototype.mute = function (bool, noStateUpdate) {
    this.muteState = bool;
    if (bool) {
        this.curVolume = 0
        Howler.volume(this.curVolume);
        if (!noStateUpdate) {
            this.sndState = false;
        }
    } else {
        Howler.volume(this.curVolume);
        this.sndState = true;
    }
};
SoundLib.prototype.setPreviousVolume = function (vol) {
    this.previousVolume = vol;
};
SoundLib.prototype.setVolume = function (vol) {
    this.curVolume = vol;
    Howler.volume(vol);
};

SoundLib.prototype.setVolumeById = function (vol, nameObj) {
    if (nameObj.name in this.primaryList) {
        this.primSndCtr.volume(vol, this.curSndList[nameObj.name]);
    } else if (nameObj.name in this.secondaryList) {
        this.sndCtr.volume(vol, this.curSndList[nameObj.name]);
    }
};