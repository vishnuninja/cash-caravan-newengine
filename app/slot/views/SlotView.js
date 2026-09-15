var _ng = _ng || {};

_ng.SlotView = function (coreApp) {
    _ng.CoreView.call(this, coreApp);
    this.counter = 0;
    this.titleIndex = 2;
    this.prevGameTitleHideEffect = false;
};

_ng.SlotView.prototype = Object.create(_ng.CoreView.prototype);
_ng.SlotView.constructor = _ng.SlotView;

var p = _ng.SlotView.prototype;
var cv = _ng.CoreView.prototype;

p.soundsLoaded = function () {
    var gameWidth = _ng.GameConfig.gameLayout[this.coreApp.viewInfoUtil.viewType].width;
    var gameHeight = _ng.GameConfig.gameLayout[this.coreApp.viewInfoUtil.viewType].height;

    var containers = {
        "bgContainer": { parent: "stage" },
        "mainContainer": { parent: "stage", fluid: true, fluidParams: {}, setSize: { width: gameWidth, height: gameHeight } },
        "panelContainer": { parent: "stage" },
        "responsivePanelContainer": { parent: "panelContainer", fluid: true, fluidParams: {}, setSize: { width: gameWidth, height: gameHeight } },
        "paytableContainer": { parent: "stage" },
        "featureContainer": { parent: "stage" },
        "responsiveFeatureContainer": { parent: "featureContainer", fluid: true, fluidParams: {}, setSize: { width: gameWidth, height: gameHeight } },
        "decoratorContainer": { parent: "stage" },
        "popupContainer": { parent: "stage" },
        "responsivePopupContainer": { parent: "popupContainer", fluid: true, fluidParams: {}, setSize: { width: gameWidth, height: gameHeight } },
        "introContainer": { parent: "stage" },
        "fluidIntroContainer": { parent: "introContainer", fluid: true, fluidParams: {}, setSize: { width: gameWidth, height: gameHeight } },
    }

    for (var container in containers) {
        var cObj = containers[container];
        this[container] = pixiLib.getElement();
        this[container].name = container;
        if (cObj.fluid) {
            var params = cObj.fluidParams || {};
            _ngFluid.call(this[container], params);
            if (cObj.setSize) {
                this[container].setSize(cObj.setSize.width, cObj.setSize.height);
            }
        }
        if (cObj.parent === "stage") {
            this.stage.addChildAt(this[container], this.stage.children.length - 1);
        } else {
            this[cObj.parent].addChild(this[container]);
        }
    }

    this.viewConfig = {
        coreViews: {
            bgView: { view: "BGView", controller: "BGContoller" },
            reelView: { view: "ReelView", controller: "ReelController" },
            winView: { view: "PaylineView", controller: "PaylineController" },
            paylineView: { view: "PaylineView", controller: "PaylineController" },
            bonusView: { view: "BonusView", controller: "BonusController" },
            gambleView: { view: "GambleView", controller: "GambleController" }
        },
        deviceSpecificCoreViews: {}
    };
    this.defaultReelViewUiConfig = JSON.parse(JSON.stringify(_ng.GameConfig.ReelViewUiConfig));
    this.defaultReelSymbolConfig = JSON.parse(JSON.stringify(_ng.GameConfig.reelSymbolConfig));
    this.removeCoreErrorPopup();
    this.createGameElements();
};
p.updateReelViewUiConfig = function (data) { }
p.updateReelSymbolConfig = function (data) {
    // if(coreApp.gameModel.isFullFSActive() && _ng.GameConfig.separateSymbolsForFS){
    if (data.type == "set") {
        _ng.GameConfig.reelSymbolConfig = _ng.GameConfig.reelSymbolConfigFS;
    } else {
        _ng.GameConfig.reelSymbolConfig = this.defaultReelSymbolConfig;
    }
    // }
}
p.onStartCreatingGame = function () {
    cv.onStartCreatingGame.call(this);
    _ng.GameConfig.soundsAssets.filePath = appPath + _ng.GameConfig.soundsAssets.filePath;
    var obj = Object.assign(_ng.GameConfig.sounds, _ng.GameConfig.soundsAssets);
    // _sndLib.init(_ng.GameConfig.sounds, this.soundsLoaded.bind(this));
    _sndLib.init(obj, this.soundsLoaded.bind(this), "primary");
    // _sndLib.init(obj, this.soundsLoaded.bind(this), "secondary");
};

p.createGameViews = function () { };

p.createGameElements = function () {

    this.gameRules = document.getElementById('grContent');
    if (_viewInfoUtil.isDesktop) {
        this.gameRules.setAttribute('style', 'height:640px; padding:40px;');
    }

    /*******************************/
    var view = new BGView();
    this.bgController = new BGController();
    this.bgController.setView(view);
    this.bgContainer.addChild(view);
    view.createView();
    /*******************************/
    var view = new ReelView();
    this.reelController = new ReelController();
    this.reelController.setView(view);
    this.mainContainer.addChild(view);
    view.createView();
    view.name = "reelView";
    this.reelView = view;
    /*******************************/
    var view = new WinView();
    this.winController = new WinController();
    this.winController.setView(view);
    this.mainContainer.addChild(view);
    view.createView();
    view.name = "winView";
    /*******************************/
    var view = new PaylineView();
    view.name = "paylines";
    this.paylineController = new PaylineController();
    this.paylineController.setView(view);
    this.mainContainer.addChild(view);
    view.createView();
    /*******************************/
    this.settingsPanel = (_viewInfoUtil.device === "Desktop") ? new SettingsDesktopView() : new SettingsMobileView();
    this.settingsPanel.name = "SettingsPanelView";
    this.settingsPanel.createView();
    this.paytableContainer.addChild(this.settingsPanel);

    this.SPController = new _ng.SettingsController();
    this.SPController.setView(this.settingsPanel);

    var view = new window["Paytable" + _viewInfoUtil.device + "View"](this);
    view.name = "paytable";
    this.paytableController = new PaytableController();
    this.paytableController.setView(view);
    this.paytableContainer.addChild(view);
    view.createView();
    /*******************************/
    this.panel = (_viewInfoUtil.device === "Desktop") ? new PanelDesktopView() : new PanelMobileView();
    this.panel.setVariables(this, this.coreApp);
    this.panel.createView();

    this.CPController = (_viewInfoUtil.device === "Desktop") ? new PanelDesktopController() : new PanelMobileController();
    this.CPController.setView(this.panel);
    this.CPController.setVariables(this.coreApp);
    /*******************************/
    if (_ng.GameConfig.tickerConfig) {
        var view = new TickerBox();
        this.tickerController = new TickerViewController();
        this.tickerController.setView(view);
        view.name = "TickerView";
         if(_ng.GameConfig.gameName == "queensakura"||  (_viewInfoUtil.viewType!="VD"&&_ng.GameConfig.gameName == "mysticalforestadventure")){
            this.panelContainer.addChildAt(view,5);
         }else{
            this.panelContainer.addChild(view);
         }
        
        view.createView();
    }
    /*******************************/
    if (_ng.SuperMeterConfig && isGermanUI == true) {
        this.superMeterView = new SuperMeterView();
        this.superMeterController = new SuperMeterController();
        this.superMeterController.setView(this.superMeterView);
        this.superMeterView.createView();
        this.superMeterView.name = "superMeterView";
        this.panelContainer.addChild(this.superMeterView);
    }    var view = new ClockView();
    this.clockView = view;
    view.name = "ClockView";
    var ind = this.stage.getChildIndex(this.featureContainer)
    this.stage.addChildAt(view, ind + 1);

    view.createView();

    if (commonConfig.isServerTime === "true") {
        this.clockView.alpha = 0;
        this.clockView.visible = false;
    }

    /*******************************/
    var view = new BigWinView();
    this.bigWinView = view;
    view.name = "bigWinView";
    this.decoratorContainer.addChild(view);
    /*******************************/
    var view = new InfoPopupView();
    this.infoPopup = view;
    view.name = "infoPopup";
    this.popupContainer.addChild(view);
    /*******************************/
    var view = new BonusView({ parent: this.featureContainer });
    this.bonusController = new BonusController();
    this.bonusController.setView(view);
    this.featureContainer.addChild(view);
    view.createView();
    view.name = "gameBonus";
    /*******************************/
    var view = new IntroView(this.introContainer, this.fluidIntroContainer);
    // this.introController = new IntroController();
    // this.introController.setView(view);
    this.fluidIntroContainer.addChild(view);
    this.introView = view;
    view.createView();
    view.name = "introView";
    /*******************************/
    var view = new ErrorView({ popupContainer: this.popupContainer, rPopupContainer: this.responsivePopupContainer });
    view.name = "ErrorView";
    this.errorController = new ErrorController();
    this.errorController.setView(view);
    view.createView();
    /*******************************/
    this.createTitle();

    var view = new GambleView();
    view.name = "gambleContainer";
    this.gambleController = new GambleController();
    this.gambleController.setView(view);
    this.featureContainer.addChild(view);
    view.createView();
    /*******************************/

    this.createSwipeScreen();
    this.createExtraElements();
    this.gameCreationCompleted();


    //just for logs
    var textStyle = {
        "fill": "#efff0f",
        "fontFamily": "Verdana",
        "fontSize": 25,
        "stroke": "white",
        "strokeThickness": 1
    };
    this.logTxt = pixiLib.getElement("Text", textStyle, "");
    this.mainContainer.addChild(this.logTxt);
    this.logTxt.visible = false;
    this.logTxt.x = 200;
    this.logTxt.y = 200;
};
p.createSwipeScreen = function () {
    // if (_viewInfoUtil.viewType !== "VD" && window.location.href.indexOf('localhost') === -1) { // enable swipeup image in local
    if (_viewInfoUtil.checkForSwipeUp()) {
        if (_viewInfoUtil.isAndroid()) {
            this.createSwipeScreenForAndroid();
        } else if (!_viewInfoUtil.isIpad() && _viewInfoUtil.isIOS() && !_viewInfoUtil.isIOSChrome()) {
            this.iosSwipeScreen = document.createElement('div');
            document.body.appendChild(this.iosSwipeScreen);

            this.iosImage = document.createElement("img");
            this.iosSwipeScreen.appendChild(this.iosImage);
            this.iosImage.setAttribute("src", appPath + _ng.GameConfig.coreAssetsPath + "@1x/iosSwipeUp.png");
            this.iosImage.setAttribute("id", "iosSwipeHand");
            this.iosImage.style = "transform: scale(0.5, 0.5);"

            this.iosSwipeScreen.style = "width: 100%; height: 140%; background-color: black; position: absolute; opacity: 0.8; left: 0px; top: 0px; z-index: 100000";
            this.iosSwipeScreen.style.display = 'none';

            window.addEventListener('touchstart', function () {
                this.onTouchStart();
            }.bind(this));
        }
    }
};
p.onTouchStart = function () {
    setTimeout(function () {
        window.scrollTo(0, 1);
    }, 500);
}
p.createSwipeScreenForAndroid = function () {
    this.swipeScreen = pixiLib.getRectangleSprite(1280, 720, 0x000000);
    this.stage.addChild(this.swipeScreen);

    this.swipeParent = pixiLib.getElement();
    this.stage.addChild(this.swipeParent);

    this.swipeScreen.alpha = 0.8;
    this.swipeScreen.interactive = true;
    pixiLib.addEvent(this.swipeScreen, this.onSwipeUp.bind(this));
    screenfull.on('error', event => {
        this.swipeScreen.visible = false;
        this.swipeParent.visible = false;
    });
    screenfull.on('change', event => {
        if (screenfull.isFullscreen) {
            this.swipeScreen.visible = false;
            this.swipeParent.visible = false;
        } else {
            this.swipeScreen.visible = true;
            this.swipeParent.visible = true;
        }
    });

    var circle = pixiLib.getElement('Sprite', 'swipeCircle');
    this.swipeParent.addChild(circle);
    pixiLib.setProperties(circle, { x: 125, y: 125, anchor: { x: 0.5, y: 0.5 }, scale: 0.8 });

    var hand = pixiLib.getElement('Sprite', 'swipeHand');
    pixiLib.setProperties(hand, { x: 270, y: 290 });
    this.swipeParent.addChild(hand);

    this.handTimer = false;
    TweenMax.to(hand, 1, {
        x: 80,
        y: 100,
        repeat: -1,
        onUpdate: function () {
            // console.log(hand.x);
            if (hand.x <= 81) {
                if (!this.handTimer) {
                    this.handTimer = true;
                    // setTimeout(function(){
                    TweenMax.to(circle.scale, 0.25, {
                        x: 0.5,
                        y: 0.5,
                        repeat: 1,
                        yoyo: true,
                        onComplete: function () {
                            this.handTimer = false;
                        }.bind(this)
                    })
                    // }, 50);
                }
            }
        }
    })
}
p.onSwipeUp = function () {
    if (screenfull.enabled) {
        screenfull.request();
    } else {
        this.swipeScreen.visible = false;
        this.swipeParent.visible = false;
    }
}
p.createClock = function (view) {
    // view.name = "ClockView";
    // // this.responsivePanelContainer.addChild(view);
    // this.panelContainer.addChild(view);
    // view.createView();
};
p.showFreezeWindow = function () {
    if (!this.freezeWindowScreen) {
        this.freezeWindowScreen = pixiLib.getRectangleSprite(1280, 720, 0x000000);
        this.freezeWindowScreen.alpha = 0.6;
        this.freezeWindowScreen.interactive = true;
        this.popupContainer.addChild(this.freezeWindowScreen);

        this.resizeFreezeWindow();
    }
}
p.hideFreezeWindow = function () {
    if (this.freezeWindowScreen) {
        this.popupContainer.removeChild(this.freezeWindowScreen);
        delete this.freezeWindowScreen;
    }
}
p.showNotificationWindow = function (options) {
    options = options || {};
    this.notificationScreen = pixiLib.getRectangleSprite(1280, 720, 0x000000);
    this.popupContainer.addChild(this.notificationScreen);

    var text = (options.text !== undefined) ? options.text : "Please wait Loading assets...";
    text = pixiLib.getLiteralText(text);
    var textStyle = {
        fontFamily: "arial",
        fontSize: 30,
        fill: 0xFFFFFF,
        align: "center",
        maxWidth: 700
    }
    textStyle.maxWidth = Math.min(_viewInfoUtil.getWindowHeight(), _viewInfoUtil.getWindowWidth()) - 20;
    this.msgText = pixiLib.getElement("Text", textStyle, text);
    pixiLib.setText(this.msgText, text);
    this.msgText.anchor.set(0.5, 0.5);
    this.popupContainer.addChild(this.msgText);

    if (options.alpha) {
        this.notificationScreen.alpha = options.alpha;
    }
    this.resizeNotificationWindow();
}
p.hideNotificationWindow = function () {
    TweenMax.to(this.notificationScreen, 0.5, {
        alpha: 0,
        onComplete: function () {
            this.popupContainer.removeChild(this.notificationScreen);
            delete this.notificationScreen;
        }.bind(this)
    })
    TweenMax.to(this.msgText, 0.5, {
        alpha: 0,
        onComplete: function () {
            this.popupContainer.removeChild(this.msgText);
            delete this.msgText;
        }.bind(this)
    })
}
p.resizeFreezeWindow = function () {
    if (this.freezeWindowScreen) {
        this.freezeWindowScreen.width = _viewInfoUtil.getWindowWidth();
        this.freezeWindowScreen.height = _viewInfoUtil.getWindowHeight();
    }
}
p.resizeNotificationWindow = function () {
    if (this.notificationScreen) {
        this.msgText.x = _viewInfoUtil.getWindowWidth() / 2;
        this.msgText.y = _viewInfoUtil.getWindowHeight() / 2;

        this.notificationScreen.width = _viewInfoUtil.getWindowWidth();
        this.notificationScreen.height = _viewInfoUtil.getWindowHeight();
    }
}
p.createExtraElements = function () { };
p.createTitle = function () {
    try {
        if (_ng.GameConfig.gameTitle.type === "spine") {
            var config = _ng.GameConfig.gameTitle[_viewInfoUtil.device];
            this.gameTitle = new PIXI.spine.Spine(PIXI.Loader.shared.resources[config.image + ".json"].spineData);
            this.stage.addChildAt(this.gameTitle, config.additionIndex + 1);
            this.gameTitle.state.setAnimation(0, _ng.GameConfig.gameTitle.defaultAnimation, true);
            if (_viewInfoUtil.device === "Desktop") {
                pixiLib.setProperties(this.gameTitle, config.props);
            } else {
                _ngFluid.call(this.gameTitle, config.props);
            }
            var isIPad = navigator.userAgent.match(/iPad/i);
            if (isIPad && config.iPadProps) {
                _ngFluid.call(this.gameTitle, config.iPadProps);
            }
        }
        else {
            var config = _ng.GameConfig.gameTitle[_viewInfoUtil.device];
            this.gameTitle = pixiLib.getElement("Sprite", config.image);
            this.stage.addChildAt(this.gameTitle, config.additionIndex + 1);

            if (config.isLandScapeLogo) {
                this.gameTitle2 = pixiLib.getElement("Sprite", config.isLandScapeLogo.image);
                this.stage.addChildAt(this.gameTitle2, config.additionIndex + 1);
            }


            if (_viewInfoUtil.device === "Desktop") {
                pixiLib.setProperties(this.gameTitle, config.props);
            } else {
                _ngFluid.call(this.gameTitle, config.props);
                _ngFluid.call(this.gameTitle2, config.props);
            }
            var isIPad = navigator.userAgent.match(/iPad/i);
            if (isIPad && config.iPadProps) {
                _ngFluid.call(this.gameTitle, config.iPadProps);
                _ngFluid.call(this.gameTitle2, config.iPadProps);
            }
        }
    } catch (e) { }
    this.addExtraTitle();
};
p.addExtraTitle = function () { }
p.gameCreationCompleted = function (argument) {
    this.onResize();
    //in response of init we will check the session and show login 
    // this.callGameinit();
    this.destroyPreloader();
    _mediator.publish("showIntroScreen");
    _mediator.publish(_events.core.gameCreationCompleted);

    if (_ng.GameConfig.isIntro === true) {
        _sndLib.play(_sndLib.sprite.intro);
    } else {
        _sndLib.playBg(_sndLib.sprite.bg);
    }
    _mediator.publish("DisablePanel");
    _mediator.publish("setSpaceBarEvent", "idle");


    //defaultMute
    // if (_ng.GameConfig.defaultMute) {
    //     _sndLib.mute(true, true);
    // }
    this.addDocumentVisibilityEvent();
};
p.onHideGameTitle = function (data) {
    if (this.gameTitle) {
        if (data && data.noEffect) {
            this.gameTitle.visible = false;
            this.prevGameTitleHideEffect = false;
            this.gameTitle.alpha = 0;
        } else {
            this.prevGameTitleHideEffect = true;
            TweenMax.to(this.gameTitle, 0.5, {
                alpha: 0,
                onComplete: function () {
                    this.gameTitle.visible = false;
                }.bind(this)
            })
        }
    }
    if (this.gameTitle2) {
        if (data && data.noEffect) {
            this.prevGameTitleHideEffect = false;
            this.gameTitle2.visible = false;
            this.gameTitle2.alpha = 0;
        } else {
            this.prevGameTitleHideEffect = true;
            TweenMax.to(this.gameTitle2, 0.5, {
                alpha: 0,
                onComplete: function () {
                    this.gameTitle2.visible = false;
                }.bind(this)
            })
        }
    }
}
p.onShowGameTitle = function () {
    if (this.gameTitle) {
        if (this.prevGameTitleHideEffect) {
            this.gameTitle.visible = true;
            TweenMax.to(this.gameTitle, 0.5, {
                alpha: 1,
                onComplete: function () {
                    this.gameTitle.visible = true;
                    this.setGameTitleVisibility();
                }.bind(this)
            });
        } else {
            this.gameTitle.visible = true;
            this.gameTitle.alpha = 1;
        }
    }
    if (this.gameTitle2) {
        if (this.prevGameTitleHideEffect) {
            this.gameTitle2.visible = true;
            TweenMax.to(this.gameTitle2, 0.5, {
                alpha: 1,
                onComplete: function () {
                    this.gameTitle2.visible = true;
                    this.setGameTitleVisibility();
                }.bind(this)
            });
        } else {
            this.gameTitle2.visible = true;
            this.gameTitle2.alpha = 1;
        }
    }
    this.setGameTitleVisibility();
}
p.setGameTitleVisibility = function () {
    var viewType = this.coreApp.viewInfoUtil.viewType;
    var config = _ng.GameConfig.gameTitle[_viewInfoUtil.device];
    if (config.isLandScapeLogo && this.gameTitle2) {
        if (viewType === "VL") {
            this.gameTitle.visible = false;
            this.gameTitle2.visible = true;
        } else if (viewType === "VP") {
            this.gameTitle.visible = true;
            this.gameTitle2.visible = false;
        }
    }
}
p.onHideMainContainer = function (data) {
    if (data && data.noEffect) {
        this.mainContainer.visible = false;
    } else {
        TweenMax.to(this.mainContainer, 0.5, {
            alpha: 0,
            onComplete: function () {
                this.mainContainer.visible = false;
            }.bind(this)
        })
    }

}
p.onShowMainContainer = function () {
    if (this.mainContainer.alpha == 0) {
        this.mainContainer.visible = true;
        TweenMax.to(this.mainContainer, 0.5, {
            alpha: 1,
            onComplete: function () {
                this.mainContainer.visible = true;
            }.bind(this)
        });
    } else {
        this.mainContainer.visible = true;
    }
}
p.onHidePanel = function (data) {
    if (data && data.noEffect) {
        this.panelContainer.visible = false;
    } else {
        TweenMax.to(this.panelContainer, 0.5, {
            alpha: 0,
            onComplete: function () {
                this.panelContainer.visible = false;
            }.bind(this)
        })
    }
}
p.onShowPanel = function () {
    if (this.panelContainer.alpha == 0) {
        this.panelContainer.visible = true;
        TweenMax.to(this.panelContainer, 0.5, {
            alpha: 1,
            onComplete: function () {
                this.panelContainer.visible = true;
            }.bind(this)
        });
    } else {
        this.panelContainer.visible = true;
    }
}
p.onHidePaytableContainer = function (data) {
    if (data && data.noEffect) {
        this.paytableContainer.visible = false;
    } else {
        TweenMax.to(this.paytableContainer, 0.5, {
            alpha: 0,
            onComplete: function () {
                this.paytableContainer.visible = false;
            }.bind(this)
        })
    }
}
p.onShowPaytableContainer = function () {
    if (this.paytableContainer.alpha == 0) {
        this.paytableContainer.visible = true;
        TweenMax.to(this.paytableContainer, 0.5, {
            alpha: 1,
            onComplete: function () {
                this.paytableContainer.visible = true;
            }.bind(this)
        });
    } else {
        this.paytableContainer.visible = true;
    }
}
p.onHideClockView = function (data) {
    if (data && data.noEffect) {
        this.clockView.visible = false;
    } else {
        TweenMax.to(this.clockView, 0.5, {
            alpha: 0,
            onComplete: function () {
                this.clockView.visible = false;
            }.bind(this)
        })
    }
}
p.onShowClockView = function () {

    if (commonConfig.isServerTime === "true") {

        if (this.clockView.alpha == 0) {
            this.clockView.visible = true;
            TweenMax.to(this.clockView, 0.5, {
                alpha: 1,
                onComplete: function () {
                    this.clockView.visible = true;
                }.bind(this)
            });
        } else {
            this.clockView.visible = true;
        }
    } else {
        this.clockView.alpha = 0;
        this.clockView.visible = false;
    }
}
p.onHideReelView = function (data) {
    if (data && data.noEffect) {
        this.reelView.visible = false;
    } else {
        TweenMax.to(this.reelView, 0.5, {
            alpha: 0,
            onComplete: function () {
                this.reelView.visible = false;
            }.bind(this)
        })
    }
}
p.onShowReelView = function () {
    if (this.reelView.alpha == 0) {
        this.reelView.visible = true;
        TweenMax.to(this.reelView, 0.5, {
            alpha: 1,
            onComplete: function () {
                this.reelView.visible = true;
            }.bind(this)
        });
    } else {
        this.reelView.visible = true;
    }
}
p.onHideWinView = function (data) {
    if (data && data.noEffect) {
        this.winController.view.visible = false;
    } else {
        TweenMax.to(this.winController.view, 0.5, {
            alpha: 0,
            onComplete: function () {
                this.winController.view.visible = false;
            }.bind(this)
        })
    }
}
p.onShowWinView = function () {
    if (this.winController.view.alpha == 0) {
        this.winController.view.visible = true;
        TweenMax.to(this.winController.view, 0.5, {
            alpha: 1,
            onComplete: function () {
                this.winController.view.visible = true;
            }.bind(this)
        });
    } else {
        this.winController.view.visible = true;
    }
}
p.onHidePopupContainer = function (data) {
    if (data && data.noEffect) {
        this.popupContainer.visible = false;
    } else {
        TweenMax.to(this.popupContainer, 0.5, {
            alpha: 0,
            onComplete: function () {
                this.popupContainer.visible = false;
            }.bind(this)
        })
    }
}
p.onShowPopupContainer = function () {
    if (this.popupContainer.alpha == 0) {
        this.popupContainer.visible = true;
        TweenMax.to(this.popupContainer, 0.5, {
            alpha: 1,
            onComplete: function () {
                this.popupContainer.visible = true;
            }.bind(this)
        });
    } else {
        this.popupContainer.visible = true;
    }
}
p.callGameinit = function (argument) {
    // console.log(" on game creation called game init!");
    // _mediator.publish("InitRequest");
    _mediator.publish("onGameCreated");

};

p.destroyPreloader = function (argument) { };

p.onResize = function (argument) {
    cv.onResize.call(this);

    var viewType = this.coreApp.viewInfoUtil.viewType;
    var scaleFactor = this.coreApp.viewInfoUtil.viewScale;
    var baseWidth = _ng.GameConfig.gameLayout[this.coreApp.viewInfoUtil.viewType].width;
    var baseHeight = _ng.GameConfig.gameLayout[this.coreApp.viewInfoUtil.viewType].height;

    if (this.fluidIntroContainer !== undefined) {
        this.fluidIntroContainer.setSize(baseWidth, baseHeight);
        this.fluidIntroContainer.onResize();
    }
    if (this.mainContainer !== undefined) {
        this.mainContainer.setSize(baseWidth, baseHeight);
        this.mainContainer.onResize();
        this.repositionReelView();
    }
    if (this.responsivePanelContainer !== undefined) {
        this.responsivePanelContainer.setSize(baseWidth, baseHeight);
        this.responsivePanelContainer.onResize();
    }
    // if(this.responsiveDecoratorContainer !== undefined){
    //     this.responsiveDecoratorContainer.setSize(baseWidth, baseHeight);
    //     this.responsiveDecoratorContainer.onResize();
    // }
    if (this.responsivePopupContainer !== undefined) {
        this.responsivePopupContainer.setSize(baseWidth, baseHeight);
        this.responsivePopupContainer.onResize();
    }
    if (this.responsivePaytableContainer !== undefined) {
        this.responsivePaytableContainer.setSize(baseWidth, baseHeight);
        this.responsivePaytableContainer.onResize();
    }
    if (this.swipeScreen) {
        this.swipeScreen.width = _viewInfoUtil.getWindowWidth();
        this.swipeScreen.height = _viewInfoUtil.getWindowHeight();

        this.swipeParent.scale.set(_viewInfoUtil.viewScale);
        this.swipeParent.x = (_viewInfoUtil.getWindowWidth() - this.swipeParent.width) / 2 + 40;
        this.swipeParent.y = (_viewInfoUtil.getWindowHeight() - this.swipeParent.height) / 2 + 40;
    }
    if (this.iosSwipeScreen) {
        this.iosImage.style = "left: " + (_viewInfoUtil.getWindowWidth() / 2 - 128) + "px; position: absolute; top: " + (_viewInfoUtil.getWindowHeight() - 320) / 2 + "px;";
    }
    //title handle for landscape and portraite 
    try {
        if (this.gameTitle || this.gameTitle2) {
            var config = _ng.GameConfig.gameTitle[_viewInfoUtil.device];
            if (config.isLandScapeLogo && this.gameTitle2) {
                if (viewType === "VL") {
                    this.gameTitle.visible = false;
                    this.gameTitle2.visible = true;
                } else if (viewType === "VP") {
                    this.gameTitle.visible = true;
                    this.gameTitle2.visible = false;
                }
            }
            if (this.gameTitle && _viewInfoUtil.device !== "Desktop") {
                setTimeout(function () {
                    if (this.gameTitle.anchor) {
                        if (this.gameTitle.anchor.x == 0.5) {
                            this.gameTitle.setSize(0, 0);
                        } else if (this.gameTitle.anchor.x == 0) {
                            this.gameTitle.updateSize();
                        }
                    } else {
                        this.gameTitle.setSize(0, 0);
                    }
                }.bind(this), 0);
            }
            if (this.gameTitle2 && _viewInfoUtil.device !== "Desktop") {
                setTimeout(function () {
                    if (this.gameTitle2.anchor.x == 0.5) {
                        this.gameTitle2.setSize(0, 0)
                    } else if (this.gameTitle2.anchor.x == 0) {
                        this.gameTitle2.updateSize();
                    }
                }.bind(this), 0);
            }
        }
    } catch (e) { }

    if (this.iosSwipeScreen) {

        this.gameRules.style.webkitOverflowScrolling = "touch";

        if (this.swipeScreenTimer) {
            clearTimeout(this.swipeScreenTimer);
        }
        this.swipeScreenTimer = setTimeout(function () {
            if (this.coreApp.viewInfoUtil.viewType === "VL") {
                if (window.innerHeight >= window.screen.width) {
                    this.iosSwipeScreen.style.display = 'none';
                    window.scrollTo(0, 0);
                } else {
                    this.iosSwipeScreen.style.display = 'block';
                    this.gameRules.style.webkitOverflowScrolling = "unset";
                }
            }
            if (this.coreApp.viewInfoUtil.viewType === "VP") {
                this.iosSwipeScreen.style.display = 'none';
            }
            window.scrollTo(0, 0);
        }.bind(this), 500);
    }

    /************************
     * iPhoneX
     * Rotate the device after reaching on last of Game Rules
     * Sometimes Address bar will get minimized 
     * because of that Rules page height was reducing and game was visible
     */
    if (this.iosSwipeScreen) {
        if (!_viewInfoUtil.isIpad() && _viewInfoUtil.isIOS() && !_viewInfoUtil.isIOSChrome()) {
            if (this.coreApp.viewInfoUtil.viewType === "VP") {
                setTimeout(function () {
                    window.scrollTo(1, 0);
                }, 300);
            }
        }
    }

    var isIPad = navigator.userAgent.match(/iPad/i);
    if (isIPad && this.gameRules) {
        this.gameRules.style.webkitOverflowScrolling = "touch";
    }

    this.resizeFreezeWindow();
    this.resizeNotificationWindow();
    this.gameSpecificOnResize();
};
p.gameSpecificOnResize = function () { };
p.removeReelView = function () {
    for (var i = 0; i < this.reelView.length; i++) {
        delete this.reelView.children[i];
    }
    this.reelView.removeChildren();
}
p.repositionReelView = function () {
    if (this.reelController && this.reelView) {
        var isIPad = navigator.userAgent.match(/iPad/i);
        var reelLayout = _ng.GameConfig.ReelViewUiConfig.layout[_viewInfoUtil.viewType];
        if (isIPad) {
            reelLayout = _ng.GameConfig.ReelViewUiConfig.iPadLayout[_viewInfoUtil.viewType];
        }

        var baseWidth = _ng.GameConfig.gameLayout[this.coreApp.viewInfoUtil.viewType].width;
        var baseHeight = _ng.GameConfig.gameLayout[this.coreApp.viewInfoUtil.viewType].height;

        this.reelView.scale.set(reelLayout.scale);
        this.winController.view.scale.set(reelLayout.scale);
        this.paylineController.view.scale.set(reelLayout.scale);


        //to be used when reelview have some dynamic w/h element
        //using in DaVinci because of spine attached to ReelView
        if (_ng.GameConfig.ReelViewUiConfig.reelViewFixedDimensions) {
            var reelViewContainerX = (baseWidth - _ng.GameConfig.ReelViewUiConfig.reelViewFixedDimensions.w * reelLayout.scale) / 2;
            var reelViewContainerY = (baseHeight - _ng.GameConfig.ReelViewUiConfig.reelViewFixedDimensions.h * reelLayout.scale) / 2;
        } else {
            var reelViewContainerX = (baseWidth - this.reelView.width) / 2;
            var reelViewContainerY = (baseHeight - this.reelView.height) / 2;
        }

        var reelViewContainerMarginLeft = reelLayout.marginLeft;
        var reelViewContainerMarginTop = reelLayout.marginTop;

        this.reelView.x = reelViewContainerX + reelViewContainerMarginLeft;
        this.reelView.y = reelViewContainerY + reelViewContainerMarginTop;

        this.winController.view.x = reelViewContainerX + reelViewContainerMarginLeft;
        this.winController.view.y = reelViewContainerY + reelViewContainerMarginTop;


        this.paylineController.view.x = reelViewContainerX + reelViewContainerMarginLeft;
        this.paylineController.view.y = reelViewContainerY + reelViewContainerMarginTop;
    }
};
p.addDocumentVisibilityEvent = function () {
    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }
    document.addEventListener(visibilityChange, this.handleVisibilityChange.bind(this, hidden), false);
}
p.handleVisibilityChange = function (hiddenVar) {
    /********************************
     * Utility: to stop callNextGameState from executing if window is not fucused
     * return from the function and run again when window is coming into focus.
     * Not needed for local symtems
     * because with the functionality game will stop(for autospin, freespin, respin etc) even if we click on chrome inspector
     * windowFocusChanged is used in slotController
     * 
     */
    if (document[hiddenVar]) {
        _mediator.publish("windowFocusChanged", false);
    } else {
        _mediator.publish("windowFocusChanged", true);
    }
}
function onUnfocus() {
    if (_sndLib.curVolume > 0) {
        _sndLib.focusSound(false);
        _sndLib.focusSoundOff();
    }
};
function onFocus() {
    if (_sndLib.curVolume == 0) {
        _sndLib.focusSound(true);
        _sndLib.focusSoundOn();
    }
    if (isMobile && _mediator) {
        _mediator.publish(_events.core.onResize);
    }
};
if ( /*@cc_on!@*/ false) { // check for Internet Explorer
    document.onfocusin = onFocus;
    document.onfocusout = onUnfocus;
} else {
    window.onfocus = onFocus;
    window.onblur = onUnfocus;
};