var _ng = _ng || {};

_ng.LoadConfig = {
    "gameFiles": {
        "common": [
            // "libs/pixi-spine3.7v5.js",
            "libs/pixi-spine4.1.js",
            "libs/gsap.min.js",
            "libs/PixiPlugin.min.js",
            "configs/BGUIConfig.js",
            "configs/SuperMeterConfig.js",
            "controllers/GSlotController.js",
            "controllers/GWinController.js",
            "controllers/GPanelController.js",
            "configs/ReelViewUIConfig.js",
            "configs/PaytableViewUIConfig.js",
            "views/MegawaysSymbol.js",
            "views/GView.js",
            "views/GReelView.js",
            "views/GPanelView.js",
            "views/GWinView.js",
            "views/TumbleReelStrip.js",
            "model/gSpinData.js",
            "model/GCoreApp.js",
            "model/GPanelModel.js",
            "model/GfsModel.js",
            "model/GCSpinData.js",
            "views/GInfoPopupView.js",
            "views/GBGView.js",
            "views/GSoundLib.js",
            "views/GBigWinView.js",
            "views/GIntroView.js",

             "views/GSettingView.js",
             "views/GTickerBox.js",
             "views/GSlider.js",
 
             "controllers/GTickerViewController.js",
             "model/GSlotModel.js",
             "controllers/GreelController.js",
             "controllers/GErrorController.js",
             "views/GErrorView.js",
             "utils/wagerNormalization.js",
             "views/GHistoryPanelView.js",
             "controllers/GHistoryPanelController.js",
         
        ],
        "Desktop": [
            "views/GPanelDesktopView.js",
            "views/GPaytableDesktopView.js",
            "views/GSettingsDesktopView.js",
        ],
        "Mobile": [
            "views/GPanelMobileView.js",
            "views/GSettingsMobileView.js",
            "views/GPaytableMobileView.js",
            "views/GHistoryPanelMobileView.js",
        ]
    },
    'gameLoadingAssets': {
    },
      "gamePrimaryAssets": {
        "common": {
            "allResolutions": [
                "Loading_Circle.json",
                "BG_cash_caravan.json",
                "Logo.json",
                "ReelFrame.json",
                "ReelElements.json",
                "buyFeatureBitmap.xml",
                "totalMultiFont.xml",
                "numbers-export.xml",
                "autoplay.json",
                "autoplaybase.json",
                "autoplayPopup.json",
                "autoSpin.json",
                "autoSpinBase.json",
                "betPopup.json",
                "closesetting.json",
                "extraAssets.json",
                "menu0.json",
                "newGamePanel.json",
                "newSetting.json",
                "panelButtons.json",
                "stopButtonAssets.json",
                "turboActive.json",
                "volumeBar.json",
                "yellowAssets_1.json",
                "Congratulations Pop Up.json",
                "paytableAssets.json",
                "playstpbtn.json",
                "Ticks.json",
                "continuebtn.json",

                "symbols.json",
                "SymbolsBlur.json",
                "CC_character_spine.json",
                "Transition.json",


                // "Tiger.json",
                // "Bear.json",
                // "Lemur.json",
                // "Parrot.json",
                // "FrogSymb.json",
                // "Low_value.json",
                // "Wild&Bonus.json",
                // "Low_value_blur.json",
                // "wild&Bonus_Blur.json",
                "AUTOPLAY_new.json",
                // "AllWin/frog.json",
                // "AllWin/Bear.json",
                // "AllWin/Parot.json",
                // "AllWin/monkey.json",
                // "AllWin/tiger.json",
                "CC_win_popup.json",
                "IntroScreen.json",
                "ReelElements.json",
            ],
            "@2x": []
        },
        "Desktop": {
            "allResolutions": ["newGamePanel.json"],
            "@2x": []
        },
        "Mobile": {
            "allResolutions": [
                "newGamePanel.json",
                "PortraitAssets/baseGameVP.json",
                "PortraitAssets/Transition_Protrait.json",
                "PortraitAssets/buy screen_Potrait.json"
            ],
            "@2x": []
        }
    },
    "secondaryAssets": [
        {
            "assets": {
                "common": {
                    "allResolutions": [
                        "Reel_FX.json",
                        "guitar.json",
                        "boombox.json",
                        "rblade_spine.json",
                        "lavalamp_animation.json",
                        "mouth_animation.json",
                        "Symbol_A.json",
                        "Symbol_K.json",
                        "Symbol_Q.json",
                        "Symbol_J.json",
                        "Symbol_10.json",
                        "bonus_cash_caravan.json",
                        "wild.json"
                    ],
                    "@2x": []
                },
                "Desktop": {
                    "allResolutions": [],
                    "@2x": []
                },
                "Mobile": {
                    "allResolutions": [],
                    "@2x": []
                }
            }
        }
    ],
    "fontsToLoad": {
        "primaryFonts": {
            "ProximaNova_Bold": "ProximaNova_XtraConmdcensedBold.woff",
            "ProximaNova": "ProximaNova_XtraConmdcensedRegular.woff",
            "rioOroBold": "rioOroBold.otf",
            "BadaBoom BB":"BadaBoom BB.ttf",
            "cinzel.black":"cinzel.black.ttf",
            "CashJoyDyna" : "DynaPuff_SemiCondensed-Bold.ttf"  
        }
    }
};
