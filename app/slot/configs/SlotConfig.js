var _ng = _ng || {};
_ng.SlotConfig = {
    slotFiles: {
        common: [
            "app/slot/configs/BGUiConfig.js",
            "app/slot/models/UserModel.js",
            "app/slot/models/SlotModel.js",
            "app/slot/models/PanelModel.js",
            "app/slot/models/SettingsModel.js",
            "app/slot/models/SpinData.js",
            "app/slot/models/AutoSpinModel.js",
            "app/slot/models/FreeSpinModel.js",
            "app/slot/models/PromoFreeSpinModel.js",
            "app/slot/models/GambleModel.js",
            "app/slot/models/FeatureModel.js",
            "app/slot/views/SlotView.js",
            "app/slot/services/DemoSlotService.js",
            "app/slot/views/BGView.js",
            "app/slot/controllers/BGController.js",
            "app/slot/views/components/ClockView.js",
            "app/slot/views/components/ReelStrip.js",
            "app/slot/views/components/WinSymbol.js",
            "app/slot/views/components/ReelSymbol.js",
            "app/slot/views/components/Slider.js",
            "app/slot/views/ReelView.js",
            "app/slot/controllers/ReelController.js",
            "app/slot/controllers/IntroController.js",
            "app/slot/views/IntroView.js",
            "app/slot/views/PaylineView.js",
            "app/slot/controllers/PaylineController.js",
            "app/slot/views/WinView.js",
            "app/slot/controllers/WinController.js",
            "app/slot/views/BonusView.js",
            "app/slot/controllers/BonusController.js",
            "app/slot/views/PaytableView.js",
            "app/slot/views/PaytableDesktopView.js",
            "app/slot/controllers/PaytableController.js",
            "app/slot/controllers/SlotController.js",
            "app/slot/controllers/SettingsController.js",
            "app/slot/controllers/TickerViewController.js",
            "app/slot/controllers/GambleController.js",
            "app/slot/views/components/PanelValueField.js",
            "app/slot/views/components/PanelValueSelector.js",
            "app/slot/views/components/PanelBGStrip.js",
            "app/slot/views/components/InfoPopupView.js",
            "app/slot/app/SlotEvents.js",
            "app/slot/views/PaytableMobileView.js",
            "app/slot/views/TickerBox.js",
            "app/slot/views/SettingsView.js",
            "app/slot/views/PanelView.js",
            "app/slot/views/GambleView.js",
            "app/slot/controllers/PanelController.js",
            "app/slot/views/components/BigWinView.js",
            "app/slot/views/SuperMeterView.js",
            "app/slot/controllers/SuperMeterController.js",
            "app/games/common/src/models/CSpinData.js",
            "app/games/common/src/commonConfig.js"
        ],
        Desktop: [
            "app/slot/views/PanelDesktopView.js",
            "app/slot/controllers/PanelDesktopController.js",
            "app/slot/views/SettingsDesktopView.js",
            "app/slot/controllers/SettingsDesktopController.js"
        ],
        Mobile: [
            "app/slot/views/PanelMobileView.js",
            "app/slot/controllers/PanelMobileController.js",
            "app/slot/views/SettingsMobileView.js",
            "app/slot/controllers/SettingsMobileController.js"
        ],
        CyprusCommon: [
            "app/slot/configs/BGUiConfig.js",
            "app/slot/models/UserModel.js",
            "app/slot/models/CyprusSlotModel.js",
            "app/slot/models/CyprusPanelModel.js",
            "app/slot/models/SettingsModel.js",
            "app/slot/models/SpinData.js",
            "app/slot/models/AutoSpinModel.js",
            "app/slot/models/FreeSpinModel.js",
            "app/slot/models/CyprusPromoFreeSpinModel.js",
            "app/slot/models/CyprusGambleModel.js",
            "app/slot/models/GambleModel.js",
            "app/slot/models/FeatureModel.js",
            "app/slot/views/CyprusSlotView.js",
            "app/slot/services/DemoSlotService.js",
            "app/slot/views/BGView.js",
            "app/slot/controllers/BGController.js",
            "app/slot/views/components/ClockView.js",
            "app/slot/views/components/CyprusPromoView.js",    
            "app/slot/views/components/ReelStrip.js",
            "app/slot/views/components/WinSymbol.js",
            "app/slot/views/components/ReelSymbol.js",
            "app/slot/views/components/Slider.js",
            "app/slot/views/ReelView.js",
            "app/slot/controllers/ReelController.js",
            "app/slot/controllers/IntroController.js",
            "app/slot/views/IntroView.js",
            "app/slot/views/PaylineView.js",
            "app/slot/controllers/PaylineController.js",
            "app/slot/views/WinView.js",
            "app/slot/controllers/WinController.js",
            "app/slot/views/BonusView.js",
            "app/slot/controllers/BonusController.js",
            "app/slot/views/PaytableView.js",
            "app/slot/views/PaytableDesktopView.js",
            "app/slot/controllers/PaytableController.js",
            "app/slot/controllers/CyprusSlotController.js",
            "app/slot/controllers/CyprusSlotController.js",
            "app/slot/controllers/externalUi/BetUi.js", //
            "app/slot/controllers/externalUi/Music.js",
            "app/slot/controllers/externalUi/SettingsUi.js",
            "app/slot/controllers/externalUi/AutoPlay.js",
            "app/slot/controllers/externalUi/Turbo.js",
            "app/slot/controllers/externalUi/Ticker.js",
            "app/slot/controllers/externalUi/CommonPopup.js",
            "app/slot/controllers/externalUi/history-choice-panel.js",
            "app/slot/controllers/externalUi/ErrorView.js",
            "app/slot/controllers/externalUi/Replay.js",
            "app/slot/controllers/externalUi/ElapsedTime.js",
            "app/slot/controllers/externalUi/game-info/GameInfo.js", //
            "app/slot/controllers/externalUi/ExternalUiController.js", //
            "app/slot/controllers/externalUi/PromoView.js",
            "app/slot/controllers/SettingsController.js",
            "app/slot/controllers/TickerViewController.js",
            "app/slot/controllers/GambleController.js",
            "app/slot/views/components/PanelValueField.js",
            "app/slot/views/components/PanelValueSelector.js",
            "app/slot/views/components/PanelBGStrip.js",
            "app/slot/views/components/CyprusInfoPopupView.js",
            "app/slot/app/SlotEvents.js",
            "app/slot/views/PaytableMobileView.js",
            "app/slot/views/TickerBox.js",
            "app/slot/views/SettingsView.js",
            "app/slot/views/PanelView.js",
            "app/slot/views/GambleView.js",
            "app/slot/controllers/PanelController.js",
            "app/slot/views/components/BigWinView.js",
            "app/slot/views/SuperMeterView.js",
            "app/slot/controllers/SuperMeterController.js",
            "app/games/common/src/models/CSpinData.js",
            "app/games/common/src/commonConfig.js"
        ],
        CyprusDesktop: [
            "app/slot/views/PanelDesktopView.js",
            "app/slot/controllers/PanelDesktopController.js",
            "app/slot/views/SettingsDesktopView.js",
            "app/slot/controllers/SettingsDesktopController.js"
        ],
        CyprusMobile: [
            "app/slot/views/PanelMobileView.js",
            "app/slot/controllers/PanelMobileController.js",
            "app/slot/views/SettingsMobileView.js",
            "app/slot/controllers/SettingsMobileController.js"
        ]
    },
    bigWinFile: "app/slot/views/components/BigWinView.js",
    urls: {
        depositURL: "",
        lobbyURL: ""
    },
    'soundsAssets': {
        "filePath": "games/%A1%/dist/sounds/",
        primary: {
            "fileName": "PrimarySounds.json",
        },
        secondary: {
            "fileName": "SecondarySounds.json",
        },
    },
    currencyFormatChange: {
        "eur": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
        "es_es": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
        "rub": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
        "sek": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
        "nok": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
        "pt_pt": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
        "lv": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
        "lt": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
        "czk": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
        "huf": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
        "it": { minAmount: -(Number.MAX_SAFE_INTEGER), maxAmount: Number.MAX_SAFE_INTEGER, removeFromLast: true, indexToRemove: 1 }
    },
    slotLoadingAssets: {
        common: {
            allResolutions: [],
            "@2x": []
        }
        // "Desktop": {
        //     "allResolutions": ["slotDesktop"],
        //     "@2x": ["slotDesktop2x"]
        // },
        // "Mobile": {
        //     "allResolutions": ["slotMobile"],
        //     "@2x": ["slotMobile2x"]
        // }
    },
    slotPrimaryAssets: {
        common: {
            allResolutions: [],
            "@2x": []
        }
        // "Desktop": {
        //     "allResolutions": ["slotDesktop"],
        //     "@2x": ["slotDesktop2x"]
        // },
        // "Mobile": {
        //     "allResolutions": ["slotMobile"],
        //     "@2x": ["slotMobile2x"]
        // }
    },
    featuresWithSecondaryAssets: [],
    'gameLayout': {
        "VD": { width: 1280, height: 720 },
        "VL": { width: 1280, height: 720 },
        "VP": { width: 720, height: 1280 }
    },
    "spaceBarHoldTimeout": 1000,
    // "availableLanguages": ["en", "ko", "ru", "zh_tw", "zh_cn", "sv_se", "no", "pl", "pt_pt", "jp", "my", "th", "sr_la", "tr", "ro", "vi", "lv", "de", "es_es", "fr", "lt", "id", "it", "bg", "fi", "da","ar","cs_cz","nl","en_gb","el_gr","hu","pt_br","uk"],
    errorPopup: {
        BG: {
            image: "msgBoxBg",
            props: {
                VD: { x: 0, y: 0, anchor: { x: 0.5, y: 0.5 }, scale: { x: 1, y: 1.2 } }
            }
        },
        title: {
            props: { VD: { x: 0, y: -100, anchor: { x: 0.5, y: 0.5 } } },
            textStyle: {
                fontFamily: "Verdana",
                fill: "#FFFFFF",
                align: "center",
                fontWeight: "bold",
                fontSize: 45,
                maxWidth: 300,
                padding: 10
            }
        },
        description: {
            props: { VD: { x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } } },
            textStyle: {
                fontFamily: "Verdana",
                fill: "#FFFFFF",
                fontSize: 30,
                maxWidth: 600,
                align: "center",
                padding: 10
            }
        },
        continueBtn: {
            props: { VD: { x: 0, y: 146 } },
            BG: { image: "errorPopupButton", props: { VD: { x: 0, y: 0, anchor: { x: 0.5, y: 0.5 }, scale: { x: 1.3, y: 1.2 } } } },
            continueText: {
                props: { VD: { x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } } },
                textStyle: {
                    fill: "#000000",
                    fontSize: 28,
                    fontWeight: "bolder",
                    // lineHeight: 100,
                    maxWidth: 180,
                    padding: 10
                }
            }
        },
        props: {
            VD: { x: 640, y: 330 },
            VL: { x: 640, y: 330 },
            VP: { x: 360, y: 560, scale: 0.9 }
        }
    },
    // volumeBarConfig: {
    //     Desktop: {
    //         volumeBar: {
    //             elementConstructor: "Slider",
    //             params: {
    //                 name: "lineValueSlider",
    //                 props: { x: 360, y: 216 },
    //                 dotImage: "asSliderHandle",
    //                 BGImage: "sVolumeBarBg",
    //                 FGImage: "sVolumeBarFg",
    //                 startingValue: 0,
    //                 endValue: 1,
    //                 currentValue: 0.7,
    //                 toFixedValue: 1, //Value After Decimal, give 0 for integers
    //                 displayForMinValue: {
    //                     elementConstructor: "sprite",
    //                     params: {
    //                         image: "sAudioMin",
    //                         props: { x: -45, y: -10, scale: { x: 1.5, y: 1.5 } }
    //                     }
    //                 },
    //                 displayForMaxValue: {
    //                     elementConstructor: "sprite",
    //                     params: {
    //                         image: "sAudioMax",
    //                         props: { x: 135, y: -10, scale: { x: 1.5, y: 1.5 } }
    //                     }
    //                 },
    //                 eventToPublish: "settingVolumeChange"
    //             }
    //         }
    //     },
    //     Mobile: {
    //         volumeBar: {
    //             elementConstructor: "Slider",
    //             params: {
    //                 name: "lineValueSlider",
    //                 props: { x: 287, y: 86 },
    //                 dotImage: "asSliderHandle",
    //                 BGImage: "sVolumeBarBg",
    //                 FGImage: "sVolumeBarFg",
    //                 startingValue: 0,
    //                 endValue: 1,
    //                 currentValue: 0,
    //                 toFixedValue: 1, //Value After Decimal, give 0 for integers
    //                 displayForMinValue: {
    //                     elementConstructor: "sprite",
    //                     params: {
    //                         image: "sAudioMin",
    //                         props: { x: -45, y: -10, scale: { x: 1.5, y: 1.5 } }
    //                     }
    //                 },
    //                 displayForMaxValue: {
    //                     elementConstructor: "sprite",
    //                     params: {
    //                         image: "sAudioMax",
    //                         props: { x: 135, y: -10, scale: { x: 1.5, y: 1.5 } }
    //                     }
    //                 },
    //                 eventToPublish: "settingVolumeChange"
    //             }
    //         }
    //     }
    // },
    // autoPlayWinLimitConfig: {
    //     Desktop: {
    //         winLimitBar: {
    //             elementConstructor: "Slider",
    //             params: {
    //                 name: "lineValueSlider",
    //                 manualCreation: true,
    //                 props: { x: 60, y: 185 },
    //                 dotImage: "asSliderHandle",
    //                 BGImage: "asVolumeBarBg",
    //                 FGImage: "asVolumeBarFill",
    //                 startingValue: 1,
    //                 endValue: 200,
    //                 currentValue: 1,
    //                 toFixedValue: 0, //Value After Decimal, give 0 for integers
    //                 text: {
    //                     prefix: "x",
    //                     props: { x: 102, y: -26, anchor: { y: 0.5, x: 0.5 } },
    //                     textStyle: { fill: 0xffffff, fontSize: 18 }
    //                 },
    //                 displayForMinValue: {
    //                     elementConstructor: "text",
    //                     params: {
    //                         textStyle: { fontSize: 20, fill: 0xffffff },
    //                         text: "1",
    //                         props: { x: -30, anchor: { y: 0.5, x: 0.5 } }
    //                     }
    //                 },
    //                 displayForMaxValue: {
    //                     elementConstructor: "text",
    //                     params: {
    //                         textStyle: { fontSize: 20, fill: 0xffffff },
    //                         text: "200",
    //                         props: { x: 250, y: 0, anchor: 0.5 }
    //                     }
    //                 },
    //                 eventToPublish: "winLimitChange"
    //             }
    //         }
    //     },
    //     Mobile: {
    //         winLimitBar: {
    //             elementConstructor: "Slider",
    //             params: {
    //                 name: "lineValueSlider",
    //                 manualCreation: true,
    //                 props: { x: 40, y: 217 },
    //                 dotImage: "asSliderHandle",
    //                 BGImage: "asVolumeBarBg",
    //                 FGImage: "asVolumeBarFill",
    //                 startingValue: 1,
    //                 endValue: 200,
    //                 currentValue: 1,
    //                 toFixedValue: 0, //Value After Decimal, give 0 for integers
    //                 text: {
    //                     prefix: "x",

    //                     props: { x: 104, y: -29, anchor: { y: 0.5, x: 0.5 } },
    //                     textStyle: { fill: 0xffffff, fontSize: 18 }
    //                 },
    //                 displayForMinValue: {
    //                     elementConstructor: "text",
    //                     params: {
    //                         textStyle: { fontSize: 20, fill: 0xffffff },
    //                         text: "1",
    //                         props: { x: -30, anchor: { y: 0.5, x: 0.5 } }
    //                     }
    //                 },
    //                 displayForMaxValue: {
    //                     elementConstructor: "text",
    //                     params: {
    //                         textStyle: { fontSize: 20, fill: 0xffffff },
    //                         text: "200",
    //                         props: { x: 250, y: 0, anchor: 0.5 }
    //                     }
    //                 },
    //                 eventToPublish: "winLimitChange"
    //             }
    //         }
    //     }
    // },
    // autoPlayLossLimitConfig: {
    //     Desktop: {
    //         lossLimitBar: {
    //             elementConstructor: "Slider",
    //             params: {
    //                 name: "lineValueSlider",
    //                 manualCreation: true,
    //                 props: { x: 60, y: 305 },
    //                 dotImage: "asSliderHandle",
    //                 BGImage: "asVolumeBarBg",
    //                 FGImage: "asVolumeBarFill",
    //                 startingValue: 1,
    //                 endValue: 200,
    //                 currentValue: 1,
    //                 toFixedValue: 0, //Value After Decimal, give 0 for integers
    //                 text: {
    //                     prefix: "x",

    //                     props: { x: 103, y: -26, anchor: { y: 0.5, x: 0.5 } },
    //                     textStyle: { fill: 0xffffff, fontSize: 18 }
    //                 },
    //                 displayForMinValue: {
    //                     elementConstructor: "text",
    //                     params: {
    //                         textStyle: { fontSize: 20, fill: 0xffffff },
    //                         text: "1",
    //                         props: { x: -30, anchor: { y: 0.5, x: 0.5 } }
    //                     }
    //                 },
    //                 displayForMaxValue: {
    //                     elementConstructor: "text",
    //                     params: {
    //                         textStyle: { fontSize: 20, fill: 0xffffff },
    //                         text: "200",
    //                         props: { x: 250, y: 0, anchor: 0.5 }
    //                     }
    //                 },
    //                 eventToPublish: "lossLimitChange"
    //             }
    //         }
    //     },
    //     Mobile: {
    //         lossLimitBar: {
    //             elementConstructor: "Slider",
    //             params: {
    //                 name: "lineValueSlider",
    //                 manualCreation: true,
    //                 props: { x: 40, y: 342 },
    //                 dotImage: "asSliderHandle",
    //                 BGImage: "asVolumeBarBg",
    //                 FGImage: "asVolumeBarFill",
    //                 startingValue: 1,
    //                 endValue: 200,
    //                 currentValue: 1,
    //                 toFixedValue: 0, //Value After Decimal, give 0 for integers
    //                 text: {
    //                     prefix: "x",

    //                     props: { x: 104, y: -31, anchor: { y: 0.5, x: 0.5 } },
    //                     textStyle: { fill: 0xffffff, fontSize: 18 }
    //                 },
    //                 displayForMinValue: {
    //                     elementConstructor: "text",
    //                     params: {
    //                         textStyle: { fontSize: 20, fill: 0xffffff },
    //                         text: "1",
    //                         props: { x: -30, anchor: { y: 0.5, x: 0.5 } }
    //                     }
    //                 },
    //                 displayForMaxValue: {
    //                     elementConstructor: "text",
    //                     params: {
    //                         textStyle: { fontSize: 20, fill: 0xffffff },
    //                         text: "200",
    //                         props: { x: 250, y: 0, anchor: 0.5 }
    //                     }
    //                 },
    //                 eventToPublish: "lossLimitChange"
    //             }
    //         }
    //     }
    // },

    realityCheck: {
        isRealiyCheck: true,
        timeOut: 60,                 //in Minutes
        homePath: "../",
        params: {
            desktopParams: { x: 640, y: 300, anchor: { x: 0.5, y: 0.5 } },
            HX: 640,
            HY: 350,
            VX: 360,
            VY: 560,
            portScaleX: 0.8,
            portScaleY: 0.8
        },
        background: {
            bgImage: "alertBox",
            props: { anchor: { x: 0.5, y: 0.5 } }
        },
        contentTxt: {
            props: { x: 0, y: -90, anchor: { x: 0.5, y: 0.5 } },
            text: "You have been enjoying our game for the past %A1% minutes, would you like to continue?",
            textStyle: { fontFamily: "ProximaNova", fontSize: 40, fill: "#000000", align: "center", lineHeight: 90, maxWidth: 600 }
        },
        totalBetTxt: {
            props: { x: 0, y: 4, anchor: { x: 0.5, y: 0.5 } },
            text: "TOTAL LOSS: %A1%",
            textStyle: { fontFamily: "ProximaNova", fontSize: 40, fill: "#000000", align: "left", lineHeight: 90, maxWidth: 600, padding: 10 }
        },
        totalWinTxt: {
            props: { x: 0, y: 52, anchor: { x: 0.5, y: 0.5 } },
            text: "TOTAL WIN: %A1%",
            textStyle: { fontFamily: "ProximaNova", fontSize: 40, fill: "#000000", align: "left", lineHeight: 90, maxWidth: 600, padding: 10 }
        },

        closeBtn: {
            props: { x: -140, y: 125, anchor: { x: 0.5, y: 0.5 }, scale: { x: 0.8, y: 0.8 } },
            bgImage: "alertCancelBtn",
            options: {
                textField: {
                    props: { x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } },
                    text: "Close",
                    textStyle: { fontSize: 30, fontFamily: "ProximaNova_Bold", fill: 0x000000, align: "center" }
                }
            }
        },
        historyBtn: { //UKGC
            props: { x: 0, y: 125, anchor: { x: 0.5, y: 0.5 }, scale: { x: 0.8, y: 0.8 } },
            bgImage: "alertOkBtn",
            options: {
                textField: {
                    props: { x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } },
                    text: "History",
                    textStyle: { fontSize: 30, fontFamily: "ProximaNova_Bold", fill: 0x000000, align: "center", maxWidth: 150 }
                }
            }
        },
        continueBtn: {
            bgImage: "alertOkBtn",
            props: { x: 140, y: 125, anchor: { x: 0.5, y: 0.5 }, scale: { x: 0.8, y: 0.8 } },
            options: {
                textField: {
                    props: { x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } },
                    text: "Continue",
                    textStyle: { fontSize: 30, fontFamily: "ProximaNova_Bold", fill: 0x000000, align: "center" }
                }
            }
        }
    },

    "tickerConfig": {
        "params": {
            desktopParams: { x: 640, y: 610, anchor: { x: 0.5, y: 0.5 } },
            HX: 640, HY: 610, landAlignY: "BOTTOM",
            VX: 360, VY: 870, portAlignY: "BOTTOM",
        },
        "bg": "commonTickerbox",
        "msgText": {
            "textStyle": {
                "fontSize": 22,
                "fontFamily": "ProximaNova_Bold",
                "fill": "#ffffff"
            },
            "props": {
                "VD": { "x": 0, "y": 0, anchor: { x: 0.5, y: 0.5 } },
                "VL": { "x": 0, "y": 0, anchor: { x: 0.5, y: 0.5 } },
                "VP": { "x": 0, "y": 0, anchor: { x: 0.5, y: 0.5 } }
            }
        }
    },

    // ""
    // DESKTOP VIEW SETTINGS RELATED  //
    //Netgaming...
    settingPanelConfig: {
        Desktop: {
            settingsContainer: {
                type: "Container",
                props: {
                    VD: { x: 0, y: 0, visible: false }
                },
                children: {
                    settingsBg: {
                        type: "Rectangle",
                        props: {
                            VD: { x: 0, y: 0, alpha: 0.9 },
                            layout: {
                                w: 1280,
                                h: 720,
                                color: 0x000000
                            }
                        }
                    },
                    settingsIcon: {
                        type: "Sprite",
                        props: {
                            img: "mSettingsBtn_normal",
                            VD: { x: 30, y: 33 }
                        }
                    },
                    settingsTitle: {
                        type: "Text",
                        props: {
                            VD: { x: 100, y: 30 },
                            text: "GAME SETTINGS",
                            textStyle: {
                                fontFamily: "ProximaNova_Bold",
                                fontSize: 50,
                                fill: 0xffffff,
                                fontStyle: "bold",
                                padding: 10
                            }
                        }
                    },
                    settingsCloseBtn: {
                        type: "Button",
                        props: {
                            img: "mCloseBtn",
                            VD: { x: 1195, y: 32 }
                        }
                    },
                    audioContainer: {
                        type: "Container",
                        props: {
                            VD: { x: 40, y: 0 }
                        },
                        children: {
                            audioBg: {
                                type: "Sprite",
                                props: {
                                    img: "sLabelBg",
                                    VD: { x: 150, y: 130, scale: { x: 1.2, y: 1.2 } }
                                }
                            },
                            audioTitle: {
                                type: "Text",
                                props: {
                                    VD: { x: 180, y: 137 }, anchor: { x: 0, y: 0.5 },
                                    text: "OPTIONS",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold",
                                        fontSize: 30,
                                        fill: 0x0d506b,
                                        maxWidth: 242,
                                        fontStyle: "bold",
                                        padding: 10
                                    }
                                }
                            },

                            //audio
                            volumeText: {
                                type: "Text",
                                props: {
                                    VD: { x: 180, y: 204 }, anchor: { x: 0, y: 0.5 },
                                    text: "Volume",
                                    textStyle: {
                                        fontFamily: "ProximaNova",
                                        fontSize: 30,
                                        maxWidth: 120,
                                        fill: 0xffffff,
                                        padding: 10
                                    }
                                }
                            },

                            soundEffectsText: {
                                type: "Text",
                                props: {
                                    VD: { x: 180, y: 252 }, anchor: { x: 0, y: 0.5 },
                                    text: "Sound Effects",
                                    textStyle: {
                                        fontFamily: "ProximaNova",
                                        fontSize: 30,
                                        fill: 0xffffff,
                                        padding: 10,
                                    }
                                }
                            },

                            ambienceSoundText: {
                                type: "Text",
                                props: {
                                    VD: { x: 180, y: 302 }, anchor: { x: 0, y: 0.5 },
                                    text: "Ambience Sound",
                                    textStyle: {
                                        fontFamily: "ProximaNova",
                                        fontSize: 30,
                                        fill: 0xffffff,
                                        padding: 10
                                    }
                                }
                            },

                            soundEffectOff: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 500, y: 266, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    img: "sCheckOff"
                                }
                            },
                            soundEffectOn: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 500, y: 266, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "sCheckOn"
                                }
                            },

                            ambienceSoundOff: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 500, y: 314, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    img: "sCheckOff"
                                }
                            },
                            ambienceSoundOn: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 500, y: 314, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "sCheckOn"
                                }
                            },
                            quickSpinText: {
                                type: "Text",
                                props: {
                                    VD: { x: 180, y: 432 }, anchor: { x: 0, y: 0.5 },
                                    text: "Quick Spin",
                                    textStyle: {
                                        fontFamily: "ProximaNova",
                                        fontSize: 30,
                                        fill: 0xffffff,
                                        padding: 10
                                    }
                                }
                            },
                            pressSpaceText: {
                                type: "Text",
                                props: {
                                    VD: { x: 180, y: 494, anchor: { x: 0, y: 0.5 } },
                                    text: "Press space bar to spin/stop",
                                    textStyle: {
                                        fontFamily: "ProximaNova",
                                        fontSize: 30,
                                        fill: 0xffffff,
                                        maxWidth: 280,
                                        padding: 10
                                    }
                                }
                            },

                            quickSpinOff: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 500, y: 446, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "sCheckOff"
                                }
                            },
                            quickSpinOn: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 500, y: 446, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    img: "sCheckOn"
                                }
                            },

                            spaceClickOff: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 500, y: 496, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    img: "sCheckOff"
                                }
                            },
                            spaceClickOn: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 500, y: 496, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "sCheckOn"
                                }
                            }
                        }
                    },
                    autoPlayContainer: {
                        type: "Container",
                        props: {
                            VD: { x: 660, y: 130 }
                        },
                        children: {
                            autoPlayBg: {
                                type: "Sprite",
                                props: {
                                    img: "sLabelBg",
                                    VD: { x: 0, y: 0, scale: { x: 1.2, y: 1.2 } }
                                }
                            },
                            autoPlayTitle: {
                                type: "Text",
                                props: {
                                    VD: { x: 30, y: 22, anchor: { x: 0, y: 0.5 } },
                                    text: "AUTO SPIN SETTINGS",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold",
                                        fontSize: 30,
                                        maxWidth: 240,
                                        fill: 0x0d506b,
                                        fontStyle: "bold",
                                        padding: 10
                                    }
                                }
                            },
                            onAnyWinText: {
                                type: "Text",
                                props: {
                                    VD: { x: 30, y: 75, anchor: { x: 0, y: 0.5 } },
                                    text: "Stop on any win",
                                    textStyle: {
                                        fontFamily: "ProximaNova",
                                        fontSize: 30,
                                        fill: 0xffffff,
                                        padding: 10
                                    }
                                }
                            },

                            onAnyWinOff: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 420, y: 74, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "sCheckOff"
                                }
                            },
                            onAnyWinOn: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 420, y: 74, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    img: "sCheckOn"
                                }
                            },

                            autoSpinWinLimitText: {
                                type: "Text",
                                props: {
                                    VD: { x: 30, y: 125, anchor: { x: 0, y: 0.5 } },
                                    text: "Stop on single win limit",
                                    textStyle: {
                                        fontFamily: "ProximaNova",
                                        fontSize: 30,
                                        fill: 0xffffff,
                                        maxWidth: 350,
                                        padding: 10
                                    }
                                }
                            },
                            autoSpinWinLimitOff: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 420, y: 124, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "sCheckOff"
                                }
                            },
                            autoSpinWinLimitOn: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 420, y: 124, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    img: "sCheckOn"
                                }
                            },

                            // slider

                            inputWinLimitBg: {
                                type: "Sprite",
                                props: {
                                    img: "sInputBg",
                                    VD: { x: 360, y: 163, scale: { x: 1, y: 1 } }
                                }
                            },

                            inputWinLimitText: {
                                type: "Text",
                                props: {
                                    VD: { x: 420, y: 185, anchor: { x: 0.5, y: 0.5 } },
                                    text: "",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold",
                                        fontSize: 22,
                                        fill: 0xffffff,
                                        padding: 10,
                                        maxWidth: 105
                                    }
                                }
                            },

                            autoSpinLossLimitText: {
                                type: "Text",
                                props: {
                                    VD: { x: 30, y: 225 + 15, anchor: { x: 0, y: 0.5 } },
                                    text: "Stop on session loss limit",
                                    textStyle: { fontFamily: "ProximaNova", fontSize: 30, fill: 0xffffff, maxWidth: 350, padding: 10 }
                                }
                            },

                            autoSpinLossLimitOff: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 420, y: 240, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    img: "sCheckOff",
                                    hitArea: { type: "rectangle", params: { x: 0, y: 0, w: 20, h: 20 } }
                                }
                            },
                            autoSpinLossLimitOn: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 420, y: 240, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "sCheckOn",
                                    hitArea: { type: "rectangle", params: { x: 0, y: 0, w: 20, h: 20 } }
                                }
                            },

                            inputLossLimitBg: {
                                type: "Sprite",
                                props: {
                                    img: "sInputBg",
                                    VD: { x: 360, y: 278, scale: { x: 1, y: 1 } }
                                }
                            },
                            inputLossLimitText: {
                                type: "Text",
                                props: {
                                    VD: { x: 420, y: 301, anchor: { x: 0.5, y: 0.5 } },
                                    text: "",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold",
                                        fontSize: 22,
                                        fill: 0xffffff,
                                        padding: 10,
                                        maxWidth: 105
                                    }
                                }
                            }
                        }
                    },

                    autoPlay: {
                        type: "Container",
                        props: {
                            VD: { x: 725, y: 490 }
                        },
                        children: {
                            autoPlayTitle: {
                                type: "Text",
                                props: {
                                    VD: { x: -35, y: -20 + 15, anchor: { x: 0, y: 0.5 } },
                                    text: "Auto Play",
                                    textStyle: {
                                        fontFamily: "ProximaNova",
                                        fontSize: 30,
                                        fill: 0xffffff,
                                        maxWidth: 350,
                                        padding: 10
                                    }
                                }
                            },

                            autoPlayNumBg1: {
                                type: "Button",
                                props: {
                                    VD: { x: 0, y: 50, scale: { x: 1.0, y: 1.3 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "valueBtn"
                                }
                            },
                            autoPlayNumTxt1: {
                                type: "Text",
                                props: {
                                    VD: { x: 0, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    text: "10",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold",
                                        fontSize: 30,
                                        fill: 0xffffff
                                    }
                                }
                            },
                            autoPlayNumBg2: {
                                type: "Button",
                                props: {
                                    VD: { x: 90, y: 50, scale: { x: 1.0, y: 1.3 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "valueBtn"
                                }
                            },
                            autoPlayNumTxt2: {
                                type: "Text",
                                props: {
                                    VD: { x: 90, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    text: "20",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold",
                                        fontSize: 30,
                                        fill: 0xffffff
                                    }
                                }
                            },
                            autoPlayNumBg3: {
                                type: "Button",
                                props: {
                                    VD: { x: 180, y: 50, scale: { x: 1.0, y: 1.3 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "valueBtn"
                                }
                            },
                            autoPlayNumTxt3: {
                                type: "Text",
                                props: {
                                    VD: { x: 180, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    text: "30",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold",
                                        fontSize: 30,
                                        fill: 0xffffff
                                    }
                                }
                            },
                            autoPlayNumBg4: {
                                type: "Button",
                                props: {
                                    VD: { x: 270, y: 50, scale: { x: 1.0, y: 1.3 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "valueBtn"
                                }
                            },
                            autoPlayNumTxt4: {
                                type: "Text",
                                props: {
                                    VD: { x: 270, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    text: "50",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold",
                                        fontSize: 30,
                                        fill: 0xffffff
                                    }
                                }
                            },
                            autoPlayNumBg5: {
                                type: "Button",
                                props: {
                                    VD: { x: 360, y: 50, scale: { x: 1.0, y: 1.3 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "valueBtn"
                                }
                            },
                            autoPlayNumTxt5: {
                                type: "Text",
                                props: {
                                    VD: { x: 360, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    text: "100",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold",
                                        fontSize: 30,
                                        fill: 0xffffff
                                    }
                                }
                            },

                            autoPlayButton: {
                                type: "Button",
                                props: {
                                    VD: { x: 180, y: 144, scale: { x: 1, y: 1 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "alertOkBtn",
                                    options: {
                                        textField: {
                                            props: { x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } },
                                            text: "START",
                                            textStyle: { fontSize: 40, fontFamily: "ProximaNova_Bold", fill: 0x000000, align: "center", maxWidth: 175, padding: 10 }
                                        }
                                    }
                                }
                            },
                            historyButton: {
                                type: "Button",
                                props: {
                                    VD: { x: -360, y: 144, scale: { x: 1, y: 1 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "alertOkBtn",
                                    options: {
                                        textField: {
                                            props: { x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } },
                                            text: "HISTORY",
                                            textStyle: { fontSize: 40, fontFamily: "ProximaNova_Bold", fill: 0x000000, align: "center", maxWidth: 175, padding: 10 }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        Mobile: {
            settingsMContainer: {
                type: "Sprite",
                makeResponsive: true,
                props: {
                    HX: 640,
                    HY: 360,
                    VX: 360,
                    VY: 640,
                    landAnchorX: 0.5,
                    landAnchorY: 0.5,
                    portAnchorX: 0.5,
                    portAnchorY: 0.5,
                    landScaleX: 1,
                    landScaleY: 1,
                    portScaleX: 1,
                    portScaleY: 1,
                    landAlignX: "CENTER",
                    landAlignY: "CENTER",
                    portAlignX: "CENTER",
                    portAlignY: "CENTER"
                },
                children: {
                    settingsBg: {
                        type: "Rectangle",
                        props: {
                            VL: { x: -800, y: -800, alpha: 0.95 },
                            VP: { x: -800, y: -800, alpha: 0.95 },
                            layout: {
                                w: 1600,
                                h: 1600,
                                color: 0x000000
                            }
                        }
                    },

                    gameSettingsTitle: {
                        type: "Text",
                        makeResponsive: true,

                        props: {
                            VL: { x: 640, y: 30, anchor: { x: 0.5, y: 0 } },
                            VP: { x: 360, y: 30, anchor: { x: 0.5, y: 0 } },
                            text: "GAME SETTINGS",
                            textStyle: {
                                fontFamily: "ProximaNova_Bold",
                                fontSize: 35,
                                fill: 0xffffff,
                                fontStyle: "bold",
                                padding: 10

                            },
                            HX: 640,
                            HY: 30,
                            VX: 360,
                            VY: 30,
                            landAnchorX: 0.5,
                            portAnchorX: 0.5,
                            landScaleX: 1,
                            landScaleY: 1,
                            portScaleX: 1,
                            portScaleY: 1,
                            landAlignX: "CENTER",
                            landAlignY: "TOP",
                            portAlignX: "CENTER",
                            portAlignY: "TOP"
                        }
                    },

                    settingsCloseButton: {
                        type: "Button",
                        makeResponsive: true,
                        props: {
                            img: "mCloseBtn",
                            HX: 1200,
                            HY: 30,
                            VX: 640,
                            VY: 30,
                            landScaleX: 1,
                            landScaleY: 1,
                            portScaleX: 1,
                            portScaleY: 1,
                            landAlignX: "RIGHT",
                            landAlignY: "TOP",
                            portAlignX: "RIGHT",
                            portAlignY: "TOP"
                        }
                    },
                    audioMContainer: {
                        type: "Container",
                        props: {
                            VL: { x: -500, y: -240, scale: { x: 1, y: 1 } },
                            VP: { x: -330, y: -553, scale: { x: 1.4, y: 1.4 } }
                        },
                        children: {
                            audioBg: {
                                type: "Sprite",
                                props: {
                                    img: "sLabelBg",
                                    VL: { x: 0, y: 0, scale: { x: 1.2, y: 1.2 } },
                                    VP: { x: 0, y: 0, scale: { x: 1.2, y: 1.2 } }
                                }
                            },
                            audioTitle: {
                                type: "Text",
                                props: {
                                    VL: { x: 30, y: 22, anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 30, y: 22, anchor: { x: 0, y: 0.5 } },
                                    text: "OPTIONS",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold",
                                        fontSize: 30,
                                        fill: 0x0d506b,
                                        fontStyle: "bold",
                                        maxWidth: 240,
                                        padding: 10
                                    }
                                }
                            },
                            audioText: {
                                type: "Text",
                                // "parentRef": "audioBg",
                                props: {
                                    VL: { x: 30, y: 150, anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 30, y: 150, anchor: { x: 0, y: 0.5 } },
                                    text: "Volume Sound Effects Ambience Sound",
                                    textStyle: {
                                        fontFamily: "ProximaNova",
                                        fontSize: 30,
                                        fill: 0xffffff,
                                        lineHeight: 110,
                                        maxWidth: 180,
                                        padding: 10
                                    }
                                }
                            },
                            soundEffectOff: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 390, y: 130, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    VP: { x: 421, y: 130, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    img: "sCheckOff"
                                }
                            },
                            soundEffectOn: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 390, y: 130, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 421, y: 130, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "sCheckOn"
                                }
                            },
                            ambienceSoundOff: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 390, y: 190, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    VP: { x: 421, y: 190, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    img: "sCheckOff"
                                }
                            },
                            ambienceSoundOn: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 390, y: 190, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 421, y: 190, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "sCheckOn"
                                }
                            },
                            quickSpinOff: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 390, y: 248, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 421, y: 248, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "sCheckOff"
                                }
                            },
                            quickSpinOn: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 390, y: 248, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    VP: { x: 421, y: 248, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    img: "sCheckOn"
                                }
                            },

                            optionsText: {
                                type: "Text",
                                props: {
                                    VL: { x: 30, y: 262, anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 30, y: 262, anchor: { x: 0, y: 0.5 } },
                                    text: "Quick Spin",
                                    textStyle: {
                                        fontFamily: "ProximaNova",
                                        fontSize: 30,
                                        fill: 0xffffff,
                                        lineHeight: 100,
                                        maxWidth: 305,
                                        padding: 10
                                    }
                                }
                            }
                        }
                    },
                    optionsMContainer: {
                        type: "Container",
                        props: {
                            VL: { x: -500, y: 20, alpha: 0 },
                            VP: { x: -330, y: -202, alpha: 0 }
                        },
                        children: {
                            optionsBg: {
                                type: "Sprite",
                                props: {
                                    img: "sLabelBg",
                                    VL: { x: 0, y: 0, scale: { x: 1.2, y: 1.2 } },
                                    VP: { x: 0, y: 0, scale: { x: 1.2, y: 1.2 } }
                                }
                            },
                            optionsTitle: {
                                type: "Text",
                                props: {
                                    VL: { x: 30, y: 22, anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 30, y: 22, anchor: { x: 0, y: 0.5 } },
                                    text: "OPTIONS",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold",
                                        fontSize: 30,
                                        maxWidth: 240,
                                        fill: 0x0d506b,
                                        fontStyle: "bold",
                                        padding: 10
                                    }
                                }
                            }
                        }
                    },
                    autoPlayMContainer: {
                        type: "Container",
                        props: {
                            VL: { x: 0, y: -240, scale: { x: 1, y: 1 } },
                            VP: { x: -330, y: -161, scale: { x: 1.4, y: 1.4 } }
                        },
                        children: {
                            autoPlayBg: {
                                type: "Sprite",
                                props: {
                                    img: "sLabelBg",
                                    VL: { x: 0, y: 0, scale: { x: 1.2, y: 1.2 } },
                                    VP: { x: 0, y: 0, scale: { x: 1.2, y: 1.2 } }
                                }
                            },
                            autoPlayTitle: {
                                type: "Text",
                                props: {
                                    VL: { x: 30, y: 22, anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 30, y: 22, anchor: { x: 0, y: 0.5 } },
                                    text: "AUTO SPIN SETTINGS",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold",
                                        fontSize: 30,
                                        maxWidth: 240,
                                        fill: 0x0d506b,
                                        fontStyle: "bold",
                                        padding: 10
                                    }
                                }
                            },

                            onAnyWinText: {
                                type: "Text",
                                props: {
                                    VL: { x: 30, y: 87, anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 30, y: 87, anchor: { x: 0, y: 0.5 } },
                                    text: "Stop on any win",
                                    textStyle: {
                                        fontFamily: "ProximaNova",
                                        fontSize: 30,
                                        fill: 0xffffff,
                                        maxWidth: 305,
                                        padding: 10
                                    }
                                }
                            },
                            onAnyWinOff: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 390, y: 85, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 421, y: 85, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "sCheckOff"
                                }
                            },
                            onAnyWinOn: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 390, y: 85, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    VP: { x: 421, y: 85, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    img: "sCheckOn"
                                }
                            },

                            autoSpinWinLimitText: {
                                type: "Text",
                                props: {
                                    VL: { x: 30, y: 137 + 17, anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 30, y: 120 + 17, anchor: { x: 0, y: 0.5 } },
                                    text: "Stop on single win limit",
                                    textStyle: {
                                        fontFamily: "ProximaNova",
                                        fontSize: 30,
                                        fill: 0xffffff,
                                        maxWidth: 314,
                                        padding: 10
                                    }
                                }
                            },
                            autoSpinWinLimitOff: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 390, y: 152, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 421, y: 135, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "sCheckOff"
                                }
                            },
                            autoSpinWinLimitOn: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 390, y: 152, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    VP: { x: 421, y: 135, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    img: "sCheckOn"
                                }
                            },

                            inputWinLimitBg: {
                                type: "Sprite",
                                props: {
                                    img: "sInputBg",
                                    VL: { x: 330, y: 197, scale: { x: 1, y: 1 } },
                                    VP: { x: 361, y: 180, scale: { x: 1, y: 1 } }
                                }
                            },

                            inputWinLimitText: {
                                type: "Text",
                                props: {
                                    VL: { x: 390, y: 219, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 421, y: 201, anchor: { x: 0.5, y: 0.5 } },
                                    text: "",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold",
                                        fontSize: 25,
                                        fill: 0xffffff,
                                        padding: 10,
                                        maxWidth: 105
                                    }
                                }
                            },

                            autoSpinLossLimitText: {
                                type: "Text",
                                props: {
                                    VL: { x: 30, y: 260 + 17, anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 30, y: 245 + 17, anchor: { x: 0, y: 0.5 } },
                                    text: "Stop on session loss limit",
                                    textStyle: { fontFamily: "ProximaNova", fontSize: 30, fill: 0xffffff, maxWidth: 314, padding: 10 }
                                }
                            },
                            autoSpinLossLimitOff: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 390, y: 274, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 421, y: 259, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "sCheckOff"
                                }
                            },
                            autoSpinLossLimitOn: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 390, y: 274, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    VP: { x: 421, y: 259, scale: { x: 1.8, y: 1.8 }, anchor: { x: 0.5, y: 0.5 }, visible: false },
                                    img: "sCheckOn"
                                }
                            },

                            inputLossLimitBg: {
                                type: "Sprite",
                                props: {
                                    img: "sInputBg",
                                    VL: { x: 330, y: 321, scale: { x: 1, y: 1 } },
                                    VP: { x: 361, y: 300, scale: { x: 1, y: 1 } }
                                }
                            },

                            inputLossLimitText: {
                                type: "Text",
                                props: {
                                    VL: { x: 390, y: 343, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 421, y: 322, anchor: { x: 0.5, y: 0.5 } },
                                    text: "",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold",
                                        fontSize: 25,
                                        fill: 0xffffff,
                                        padding: 10,
                                        maxWidth: 105
                                    }
                                }
                            }
                        }
                    },
                    autoMPlay: {
                        type: "Container",
                        props: {
                            VL: { x: 60, y: 150, scale: { x: 1, y: 1 } },
                            VP: { x: -246, y: 374, scale: { x: 1.4, y: 1.4 } }
                        },
                        children: {
                            autoPlayTitle: {
                                type: "Text",
                                props: {
                                    VL: { x: -30, y: 0, anchor: { y: 0.5 } },
                                    VP: { x: -30, y: 0, anchor: { y: 0.5 } },
                                    text: "Auto Play",
                                    textStyle: {
                                        fontFamily: "ProximaNova",
                                        fontSize: 30,
                                        fill: "#FFFFFF",
                                        maxWidth: 250,
                                        padding: 10
                                    }
                                }
                            },

                            autoPlayNumBg1: {
                                type: "Button",
                                props: {
                                    VL: { x: 0, y: 60, scale: { x: 1.0, y: 1.3 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 0, y: 60, scale: { x: 1.0, y: 1.3 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "valueBtn"
                                }
                            },
                            autoPlayNumTxt1: {
                                type: "Text",
                                props: {
                                    VL: { x: 0, y: 60, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 0, y: 60, anchor: { x: 0.5, y: 0.5 } },
                                    text: "10",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold",
                                        fontSize: 30,
                                        fill: 0xffffff,
                                        padding: 10
                                    }
                                }
                            },
                            autoPlayNumBg2: {
                                type: "Button",
                                props: {
                                    VL: { x: 90, y: 60, scale: { x: 1.0, y: 1.3 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 90, y: 60, scale: { x: 1.0, y: 1.3 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "valueBtn"
                                }
                            },
                            autoPlayNumTxt2: {
                                type: "Text",
                                props: {
                                    VL: { x: 90, y: 60, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 90, y: 60, anchor: { x: 0.5, y: 0.5 } },
                                    text: "20",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold",
                                        fontSize: 30,
                                        fill: 0xffffff,
                                        padding: 10
                                    }
                                }
                            },
                            autoPlayNumBg3: {
                                type: "Button",
                                props: {
                                    VL: { x: 180, y: 60, scale: { x: 1.0, y: 1.3 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 180, y: 60, scale: { x: 1.0, y: 1.3 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "valueBtn"
                                }
                            },
                            autoPlayNumTxt3: {
                                type: "Text",
                                props: {
                                    VL: { x: 180, y: 60, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 180, y: 60, anchor: { x: 0.5, y: 0.5 } },
                                    text: "30",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold",
                                        fontSize: 30,
                                        fill: 0xffffff,
                                        padding: 10
                                    }
                                }
                            },
                            autoPlayNumBg4: {
                                type: "Button",
                                props: {
                                    VL: { x: 270, y: 60, scale: { x: 1.0, y: 1.3 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 270, y: 60, scale: { x: 1.0, y: 1.3 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "valueBtn"
                                }
                            },
                            autoPlayNumTxt4: {
                                type: "Text",
                                props: {
                                    VL: { x: 270, y: 60, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 270, y: 60, anchor: { x: 0.5, y: 0.5 } },
                                    text: "50",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold", fontSize: 30, fill: 0xffffff,
                                        padding: 10
                                    }
                                }
                            },
                            autoPlayNumBg5: {
                                type: "Button",
                                props: {
                                    VL: { x: 360, y: 60, scale: { x: 1.0, y: 1.3 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 360, y: 60, scale: { x: 1.0, y: 1.3 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "valueBtn"
                                }
                            },
                            autoPlayNumTxt5: {
                                type: "Text",
                                props: {
                                    VL: { x: 360, y: 60, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 360, y: 60, anchor: { x: 0.5, y: 0.5 } },
                                    text: "100",
                                    textStyle: {
                                        fontFamily: "ProximaNova_Bold", fontSize: 30, fill: 0xffffff,
                                        padding: 10
                                    }
                                }
                            },

                            autoPlayButton: {
                                type: "Button",
                                props: {
                                    VL: { x: 180, y: 140, scale: { x: 1.0, y: 1.0 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 294, y: 140, scale: { x: 1.0, y: 1.0 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "alertOkBtn",
                                    options: {
                                        textField: {
                                            props: { x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } },
                                            text: "START",
                                            textStyle: {
                                                fontSize: 40,
                                                fontFamily: "ProximaNova_Bold",
                                                fill: 0x0d506b,
                                                align: "center",
                                                maxWidth: 175,
                                                padding: 10
                                            }
                                        }
                                    }
                                }
                            },
                            historyButton: {
                                type: "Button",
                                props: {
                                    VL: { x: -360, y: 144, scale: { x: 1.0, y: 1.0 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 56, y: 140, scale: { x: 1.0, y: 1.0 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "alertOkBtn",
                                    options: {
                                        textField: {
                                            props: { x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } },
                                            text: "HISTORY",
                                            textStyle: {
                                                fontSize: 35,
                                                fontFamily: "ProximaNova_Bold",
                                                fill: 0x0d506b,
                                                align: "center",
                                                maxWidth: 175,
                                                padding: 10
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },

            autoSpinSelection: {
                type: "Container",
                props: {
                    img: "buttonsImg",
                    VL: { x: 0, y: 0, visible: false },
                    VP: { x: 0, y: 0, visible: false }
                },
                children: {
                    autoSpinsLabelBg: {
                        type: "Rectangle",
                        props: {
                            VL: { x: 0, y: 0, alpha: 0.001 },
                            VP: { x: 0, y: 0, alpha: 0.001 },
                            layout: {
                                w: 2500,
                                h: 1000,
                                color: 0x000000
                            }
                        }
                    },
                    autoSelectBg: {
                        type: "Rectangle",
                        makeResponsive: true,
                        props: {
                            VL: { x: 0, y: 406, alpha: 0.6 },
                            VP: { x: 0, y: 978, alpha: 0.6 },
                            layout: {
                                w: 2500,
                                h: 1000,
                                color: 0x000000
                            },
                            HX: 0,
                            HY: 320,
                            VX: 0,
                            VY: 600,
                            landScaleX: 1,
                            landScaleY: 1,
                            portScaleX: 1,
                            portScaleY: 1,
                            landAlignX: "LEFT",
                            landAlignY: "CENTER",
                            portAlignX: "LEFT",
                            portAlignY: "CENTER"
                        }
                    },
                    asCancelASBtn: {
                        type: "Button",
                        makeResponsive: true,
                        props: {
                            img: "ptClose",
                            VL: { x: 10, y: 344 },
                            VP: { x: 10, y: 916 },
                            HX: 1200,
                            HY: 350,
                            VX: 650,
                            VY: 630,
                            landScaleX: 1,
                            landScaleY: 1,
                            portScaleX: 1,
                            portScaleY: 1,
                            landAlignX: "RIGHT",
                            landAlignY: "TOP",
                            portAlignX: "RIGHT",
                            portAlignY: "TOP"
                        }
                    },
                    asStartBtn: {
                        type: "Button",
                        /*"makeResponsive":true,*/
                        props: {
                            img: "valueBtn",
                            VL: { x: 1069, y: 344, visible: false },
                            VP: { x: 513, y: 916, visible: false }
                            /*"HX": 1080, "HY": 360, "VX": 518, "VY": 640,
                                          "landScaleX": 1, "landScaleY": 1, "portScaleX": 1, "portScaleY": 1,
                                          "landAlignX": "RIGHT", "landAlignY": "BOTTOM", "portAlignX": "RIGHT", "portAlignY": "BOTTOM"*/
                        }
                    },
                    autoSpinTitle: {
                        type: "Text",
                        makeResponsive: true,
                        props: {
                            img: "confirmBetSelBtn",
                            VL: { x: 543, y: 348 },
                            VP: { x: 260, y: 920 },
                            text: "AUTO SPIN",
                            textStyle: {
                                fontFamily: "ProximaNova_Bold",
                                fontSize: 35,
                                fill: 0xffffff,
                                fontStyle: "bold"
                            },
                            HX: 640,
                            HY: 383,
                            VX: 360,
                            VY: 663,
                            landAnchorX: 0.5,
                            landAnchorY: 0.5,
                            portAnchorX: 0.5,
                            portAnchorY: 0.5,
                            landScaleX: 1,
                            landScaleY: 1,
                            portScaleX: 1,
                            portScaleY: 1,
                            landAlignX: "CENTER",
                            landAlignY: "BOTTOM",
                            portAlignX: "CENTER",
                            portAlignY: "BOTTOM"
                        }
                    }
                }
            }
        }
    },

    menuConfig: {
        Desktop: {
            homeButton: {
                type: "Button",
                props: {
                    img: "mHomeBtn",
                    VD: { x: 40, y: 333, anchor: { x: 0.5, y: 0.5 }, scale: { x: 0.65, y: 0.65 } },
                    "options": {
                        hitArea: { type: "circle", params: { x: 0, y: 0, r: 20 } }
                    }
                }
            },
            volumeOnBtn: {
                type: "Button",
                props: {
                    img: "mVolumeOn",
                    VD: { x: 40, y: 392, anchor: { x: 0.5, y: 0.5 } }, //390
                    "options": {
                        hitArea: { type: "circle", params: { x: 0, y: 0, r: 20 } }
                    }
                },

            },
            volumeOffBtn: {
                type: "Button",
                props: {
                    img: "mVolumeOff",
                    VD: { x: 40, y: 392, anchor: { x: 0.5, y: 0.5 } }, //390
                    "options": {
                        hitArea: { type: "circle", params: { x: 0, y: 0, r: 20 } }
                    }
                },

            },
            fullscreenBtn: {
                type: "Button",
                props: {
                    img: "mFullScreenBtn",
                    VD: { x: 40, y: 450, anchor: { x: 0.5, y: 0.5 } }, //448,
                    "options": {
                        hitArea: { type: "circle", params: { x: 0, y: 0, r: 20 } }
                    }
                }
            },
            normalscreenBtn: {
                type: "Button",
                props: {
                    img: "mNormalScreenBtn",
                    VD: { x: 40, y: 450, anchor: { x: 0.5, y: 0.5 } }, //448
                    "options": {
                        hitArea: { type: "circle", params: { x: 0, y: 0, r: 20 } }
                    }
                }
            },
            rulesBtn: {
                type: "Button",
                props: {
                    img: "mRulesBtn",
                    VD: { x: 40, y: 508, anchor: { x: 0.5, y: 0.5 } },
                    "options": {
                        hitArea: { type: "circle", params: { x: 0, y: 0, r: 20 } }
                    }
                }
            },
            settingsBtn: {
                type: "Button",
                props: {
                    img: "mSettingsBtn",
                    VD: { x: 40, y: 566, anchor: { x: 0.5, y: 0.5 } },
                    "options": {
                        hitArea: { type: "circle", params: { x: 0, y: 0, r: 20 } }
                    }
                }
            },
            paytableBtn: {
                type: "Button",
                props: {
                    img: "mInfoBtn",
                    VD: { x: 40, y: 624, anchor: { x: 0.5, y: 0.5 } },
                    "options": {
                        hitArea: { type: "circle", params: { x: 0, y: 0, r: 20 } }
                    }
                }
            },
            menuCloseBtn: {
                type: "Button",
                props: {
                    img: "mCloseBtn",
                    VD: { x: 40, y: 682, anchor: { x: 0.5, y: 0.5 } },
                    "options": {
                        hitArea: { type: "circle", params: { x: 0, y: 0, r: 20 } }
                    }
                }
            },
            menuOpenBtn: {
                type: "Button",
                props: {
                    img: "mOpenBtn",
                    VD: { x: 40, y: 682, anchor: { x: 0.5, y: 0.5 } },
                    "options": {
                        hitArea: { type: "circle", params: { x: 0, y: 0, r: 20 } }
                    }
                }
            },
            // providerLogo: {
            //     type: "Sprite",
            //     props: {
            //         img: "providerLogo",
            //         VD: { x: 1240, y: 675, anchor: { x: 0.5, y: 0.5 } }
            //     }
            // }
        },
        Mobile: {
            menuButton: {
                type: "Button",
                makeResponsive: true,
                props: {
                    img: "mMenu",
                    HX: 1195,
                    HY: 642,
                    VX: 615,
                    VY: 1181,
                    landScaleX: 0.8,
                    landScaleY: 0.8,
                    portScaleX: 1,
                    portScaleY: 1,
                    landAlignX: "RIGHT",
                    landAlignY: "BOTTOM",
                    portAlignX: "RIGHT",
                    portAlignY: "BOTTOM"
                }
            },

            homeButton: {
                type: "Button",
                makeResponsive: true,
                props: {
                    img: "mHomeBtn",
                    HX: 9,
                    HY: 642,
                    VX: 12,
                    VY: 1180,
                    landScaleX: 0.8,
                    landScaleY: 0.8,
                    portScaleX: 1,
                    portScaleY: 1,
                    landAlignX: "LEFT",
                    landAlignY: "BOTTOM",
                    portAlignX: "LEFT",
                    portAlignY: "BOTTOM"
                }
            },

            optionsContainer: {
                type: "Container",
                // "makeResponsive": true,
                /*"subscribeToResize":true,*/
                props: {
                    VL: { x: 0, y: 0 },
                    VP: { x: 0, y: 0 },
                    HX: 880,
                    HY: 0,
                    VX: 320,
                    VY: 0,
                    landScaleX: 1,
                    landScaleY: 1,
                    portScaleX: 1,
                    portScaleY: 1,
                    landAlignX: "RIGHT",
                    landAlignY: "CENTER",
                    portAlignX: "RIGHT",
                    portAlignY: "CENTER"
                },
                children: {
                    bg: {
                        type: "Rectangle",
                        props: {
                            VL: { x: 0, y: 0, alpha: 0.6, width: 1280, height: 720 },
                            VP: { x: 0, y: 0, alpha: 0.6, width: 720, height: 1280 },
                            layout: {
                                w: 720,
                                h: 1280,
                                color: 0x000000
                            }
                        }
                    },

                    optionBg: {
                        type: "Rectangle",
                        props: {
                            VL: { x: 0, y: 0, alpha: 0.9, width: 400, height: 720 },
                            VP: { x: 0, y: 0, alpha: 0.9, width: 400, height: 1280 },
                            layout: {
                                w: 400,
                                h: 1280,
                                color: 0x000000
                            }
                        }
                    },
                    optionButtonContainer: {
                        type: "Container",
                        props: {
                            VL: { x: 0, y: 0 },
                            VP: { x: 0, y: 0 }
                        },
                        children: {
                            optionsCloseBtn: {
                                type: "Button",
                                props: {
                                    img: "mCloseBtn",
                                    VL: { x: 170, y: 730, anchor: 0.5, scale: 1.4 },
                                    VP: { x: 170, y: 730, anchor: 0.5, scale: 1.4 }
                                }
                            },

                            // providerLogo: {
                            //     type: "Sprite",
                            //     props: {
                            //         img: "providerLogoM",
                            //         VL: { x: 170, y: 270, anchor: 0.5, scale: 1 },
                            //         VP: { x: 170, y: 270, anchor: 0.5, scale: 1 }
                            //     }
                            // },

                            soundOnButton: {
                                type: "Button",
                                props: {
                                    img: "mVolumeOn",
                                    VL: { x: 170, y: 320, anchor: 0.5, scale: 1 },
                                    VP: { x: 170, y: 320, anchor: 0.5, scale: 1 }
                                }
                            },
                            soundOffButton: {
                                type: "Button",
                                props: {
                                    img: "mVolumeOff",
                                    VL: { x: 170, y: 320, anchor: 0.5, visible: false, scale: 1 },
                                    VP: { x: 170, y: 320, anchor: 0.5, visible: false, scale: 1 }
                                }
                            },

                            gameDepositBtn: {
                                type: "Button",
                                props: {
                                    img: "mDepositBtn",
                                    VL: { x: 50, y: 410, anchor: 0.5, },
                                    VP: { x: 50, y: 410, anchor: 0.5, }
                                }
                            },
                            gameDepositTitle: {
                                type: "Text",
                                props: {
                                    VL: { x: 100, y: 410, anchor: { y: 0.5 } },
                                    VP: { x: 100, y: 410, anchor: { y: 0.5 } },
                                    text: "DEPOSIT",
                                    textStyle: {
                                        fontSize: 40,
                                        fontFamily: "ProximaNova_Bold",
                                        fill: "#ffffff",
                                        maxWidth: 260
                                    }
                                }
                            },

                            gameRulesBtn: {
                                type: "Button",
                                props: {
                                    img: "mRulesBtn",
                                    VL: { x: 50, y: 490, anchor: 0.5 },
                                    VP: { x: 50, y: 490, anchor: 0.5 }
                                }
                            },
                            gameRulesTitle: {
                                type: "Text",
                                props: {
                                    VL: { x: 100, y: 490, anchor: { y: 0.5 } },
                                    VP: { x: 100, y: 490, anchor: { y: 0.5 } },
                                    text: "GAME RULES",
                                    textStyle: {
                                        fontSize: 40,
                                        fontFamily: "ProximaNova_Bold",
                                        fill: "#ffffff",
                                        maxWidth: 260
                                    }
                                }
                            },
                            settingsButton: {
                                type: "Button",
                                props: {
                                    img: "mSettingsBtn",
                                    VL: { x: 50, y: 570, anchor: 0.5 },
                                    VP: { x: 50, y: 570, anchor: 0.5 }
                                }
                            },
                            gameSettingTitle: {
                                type: "Text",
                                props: {
                                    VL: { x: 100, y: 570, anchor: { y: 0.5 } },
                                    VP: { x: 100, y: 570, anchor: { y: 0.5 } },
                                    text: "GAME SETTINGS",
                                    textStyle: {
                                        fontSize: 40,
                                        fontFamily: "ProximaNova_Bold",
                                        fill: "#ffffff",
                                        maxWidth: 260,
                                        padding: 10
                                    }
                                }
                            },
                            paytableButton: {
                                type: "Button",
                                props: {
                                    img: "mInfoBtn",
                                    VL: { x: 50, y: 650, anchor: 0.5 },
                                    VP: { x: 50, y: 650, anchor: 0.5 }
                                }
                            },
                            paytableTitle: {
                                type: "Text",
                                props: {
                                    VL: { x: 100, y: 650, anchor: { y: 0.5 } },
                                    VP: { x: 100, y: 650, anchor: { y: 0.5 } },
                                    text: "PAYTABLE",
                                    textStyle: {
                                        fontSize: 40,
                                        fontFamily: "ProximaNova_Bold",
                                        fill: "#ffffff",
                                        maxWidth: 260
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

};
