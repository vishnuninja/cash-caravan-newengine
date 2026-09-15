// "subscribeToResize": true, set it true for resizing(VP, VL, VD) of immediAte children or panel

var _ng = _ng || {};

// Check if we're in history mode (has round_id in URL)
const urlParams = new URLSearchParams(window.location.search);
const isHistoryMode = urlParams.has('round_id');

_ng.PanelConfig = {
    "panelConfig": {
        "data": {
            "autoSpinList": {
                "props": {
                    "VD": { "x": 673, "y": 462, scale: { x: 0.8, y: 0.77 } },//container
                    "VL": { "x": -536, "y": 417, scale: { x: 0.5, y: 0.5 } },//container
                    "VP": { "x": 61, "y": -391, scale: { x: 0.5, y: 0.5 } }//container
                },
                "bg": {
                    "image": "Rectangle 8",
                    "props": {
                        "VD": { "x": -320, "y": -420, scale: { x: 1, y: 1 }, rotation: 0 },
                        "VL": { "x": -600, "y": -307, scale: { x: 1, y: 1 }, rotation: 0 },
                        "VP": { "x": -405, "y": -460, scale: { x: 1.1, y: 1 }, rotation: 0 },
                    }
                },
                "greyBG":{
                    "image": "Rectangle 8",
                    "props": {
                        "VD": { "x": -2000, "y": -2000, scale: { x: 100, y: 100 }, rotation: 0 },
                        "VL": { "x":  -250, "y": 0, scale: { x: 1, y: 1 }, rotation: 0 },
                        "VP": { "x": -350, "y": 0, scale: { x: 1, y:1 }, rotation: 0 },
                    }
                },
                "autoPlayClose": {
                    "image": "bet_close",
                    "props": {
                        "VD": { "x": 575, "y": 15, scale: { x: 1, y: 1 }, rotation: 0 },
                        "VL": { "x": 575, "y": 15, scale: { x: 1, y: 1 }, rotation: 0 },
                        "VP": { "x": 575, "y": 20, scale: { x: 1, y: 1 }, rotation: 0 },
                    }
                },
                "title":{
                    "props": {
                      "VD": { "x": 314, "y": 45, scale: { x: 1, y: 1 }, anchor: { x: 0.5, y: 0.5} },
                      "VL": { "x": 320, "y": 40, scale: { x: 1, y: 1 }, anchor: { x: 0.5, y: 0.5} },
                      "VP": { "x": 320, "y": 40, scale: { x: 1, y: 1 }, anchor: { x: 0.5, y: 0.5} }, 
                       },
                    "text": "autoset",
                    "textStyle": {
                          "fill": "0xffffff",
                          "fontSize": 40,
                          "fontFamily": "ProximaNova_Bold"
                   },
                },
                "textStyles":{
                    "textStyle": {
                          "fill": "0xffffff",
                          "fontSize": 18,
                          "fontFamily": "ProximaNova_Bold"
                   },
                   "newtextStyle": {
                          "fill": "0xED4310",
                          "fontSize": 18,
                          "fontFamily": "ProximaNova_Bold"
                   },
                },
                
                "autoplayButton":{
                    "image":"Rectangle 27",
                    "props":{
                        "VD": { "x": 50, "y": 390, scale: { x: 1, y: 1 }, rotation: 0 },
                        "VL": { "x": 113, "y": 420, scale: { x: 0.8, y: 0.8 }, rotation: 0 },
                        "VP": { "x": 55, "y": 420, scale: { x: 1, y: 1 }, rotation: 0 }
                    },
                    "children":{
                        "textValue":{
                          "props": {
                            "VD": { "x": 261, "y": 42, scale: { x: 1, y: 1 }, anchor : { x:0.5, y:0.5}},
                            "VL": { "x": 253, "y": 42, scale: { x: 1, y: 1 }, anchor : { x:0.5, y:0.5} },
                            "VP": { "x": 260, "y": 43, scale: { x: 1, y: 1 }, anchor : { x:0.5, y:0.5} }, 
                            "text": "START AUTOPLAY",
                            "textStyle": {
                                "fill": "0xffffff",
                                "fontSize": 41,
                                "fontFamily": "ProximaNova_Bold"
                         },
                        },
                      },
                    }
                },
                "sliderContainer":{
                    "props": {
                            "VD": { "x": 0, "y": 0, scale: { x: 1, y: 1 }  },
                            "VL": { "x": -13.5, "y": -14.5, scale: { x: 1, y: 1 } },
                            "VP": { "x": 48, "y": 0, scale: { x: 1, y: 1 } }, 
                    }
                },
                "maxSpin":{
                          "props": {
                            "VD": { "x": 540, "y": 275, scale: { x: 1, y: 1 }  },
                            "VL": { "x": 549, "y": 272, scale: { x: 1, y: 1 } },
                            "VP": { "x": 550, "y": 258, scale: { x: 1, y: 1 } }, 
                            // "text": "Quick Spin",
                            "textStyle": {
                                "fill": "0xffffff",
                                "fontSize": 35,
                                "fontFamily": "ProximaNova_Bold"
                         },
                        },
                      },
                "sliderOff":{
                   "img":"Line 4",
                   "props": {
                        "VD": { "x": 97, "y": 290, scale: { x: 0.7, y: 1.5 }, rotation: 0 },
                        "VL": { "x": 106, "y": 281, scale: { x: 0.7, y: 2.5 }, rotation: 0 },
                        "VP": { "x": 106, "y": 269, scale: { x: 0.7, y: 2.5 }, rotation: 0 }
                    },
                },
                "sliderOn":{
                   "img":"Line 3",
                   "props": {
                        "VD": { "x": 97, "y": 288, scale: { x: 1.1, y: 5 }, rotation: 0 },
                        "VL": { "x": 120, "y": 297, scale: { x: 1.01, y: 5 }, rotation: 0 },
                        "VP": { "x": 59, "y": 270, scale: { x: 1.02, y: 5 }, rotation: 0 }
                    },
                },
                "sliderOnMask":{
                   "img":"Line 3",
                   "props": {
                        "VD": { "x": -305, "y": 287, scale: { x: 1, y: 5 }, rotation: 0 },
                        "VL": { "x": -355, "y": 297, scale: { x: 1.15, y: 5 }, rotation: 0 },
                        "VP": { "x": -420, "y": 270, scale: { x: 1.15, y: 5 }, rotation: 0 }
                    },
                },
                "sliderButton":{
                    "img":"Group 3",
                    "props": {
                         "VD": { "x": 95, "y": 275, scale: { x: 1.5, y: 1.5 }, rotation: 0 },
                         "VL": { "x": 95, "y": 268, scale: { x: 1.5, y: 1.5 }, rotation: 0 },
                         "VP": { "x": 95, "y": 255, scale: { x: 1.5, y: 1.5 }, rotation: 0 }
                     },
                 },
                "quickSpinButton": {
                    "image": "Frame 59",
                    "props": {
                        "VD": { "x": 30, "y": 110, scale: { x: 1.2, y: 1.2 }, rotation: 0 },
                        "VL": { "x": 40, "y": 105, scale: { x: 1, y: 1 }, rotation: 0 },
                        "VP": { "x": 48, "y": 90, scale: { x: 1, y: 1 }, rotation: 0 }
                    },
                    "children":{
                        "tickOn":{
                            "image": "Vector",
                            "props": {
                                 "VD": { "x": 23, "y": 25, scale: { x: 1.25, y: 1.25 }, rotation: 0 },
                                 "VL": { "x": 26, "y": 27, scale: { x: 1, y: 1 }, rotation: 0 },
                                 "VP": { "x": 25, "y": 27, scale: { x: 1, y: 1 }, rotation: 0 }
                                     }
                        },
                        "textValue":{
                          "props": {
                            "VD": { "x": 98, "y": 34, scale: { x: 1, y: 1 }, anchor: 0.5},
                            "VL": { "x": 98, "y": 34, scale: { x: 1, y: 1 }, anchor: 0.5 },
                            "VP": { "x": 98, "y": 34, scale: { x: 1, y: 1 }, anchor: 0.5}, 
                            "text": "quickspin",
                            "textStyle": {
                                "fill": "0xffffff",
                                "fontSize": 20,
                                "fontFamily": "ProximaNova_Bold",
                                "maxWidth": 90,
                                "align": "center",
                         },
                        },
                      },
                    },
                },
                "turboSpinButton": {
                    "image": "Frame 59",
                    "props": {
                        "VD": { "x":224, "y": 110, scale: { x: 1.2, y: 1.2 }, rotation: 0 },
                        "VL": { "x": 242, "y": 105, scale: { x: 1, y: 1 }, rotation: 0 },
                        "VP": { "x": 242, "y": 90, scale: { x: 1, y: 1 }, rotation: 0 }
                    },
                    "children":{
                        "tickOn":{
                            "image": "Vector",
                            "props": {
                                 "VD": { "x": 23, "y": 25, scale: { x: 1.25, y: 1.25 }, rotation: 0 },
                                 "VL": { "x": 26, "y": 27, scale: { x: 1, y: 1 }, rotation: 0 },
                                 "VP": { "x": 25, "y": 27, scale: { x: 1, y: 1 }, rotation: 0 }
                                     }
                        },
                        "textValue":{
                            "props": {
                              "VD": { "x": 98, "y": 34, scale: { x: 1, y: 1 }, anchor: 0.5},
                              "VL": { "x": 98, "y": 34, scale: { x: 1, y: 1 }, anchor: 0.5},
                              "VP": { "x": 98, "y": 34, scale: { x: 1, y: 1 }, anchor: 0.5 }, 
                              "text": "turbospin",
                              "textStyle": {
                                  "fill": "0xffffff",
                                  "fontSize": 20,
                                  "fontFamily": "ProximaNova_Bold",
                                  "maxWidth": 90,
                                  "align": "center",
                           },
                          },
                        },
                    },
                },
                "skipScreenSpinButton": {
                    "image": "Frame 59",
                    "props": {
                        "VD": { "x": 411, "y": 110, scale: { x: 1.2, y: 1.2 }, rotation: 0 },
                        "VL": { "x": 442.5, "y": 105, scale: { x: 1, y: 1 }, rotation: 0 },
                        "VP": { "x": 429.5, "y": 90, scale: { x: 1, y: 1 }, rotation: 0 }
                    },
                    "children":{
                        "tickOn":{
                            "image": "Vector",
                            "props": {
                                 "VD": { "x": 23, "y": 25, scale: { x: 1.25, y: 1.25 }, rotation: 0 },
                                 "VL": { "x": 26, "y": 27, scale: { x: 1, y: 1 }, rotation: 0 },
                                 "VP": { "x": 25, "y": 27, scale: { x: 1, y: 1 }, rotation: 0 }
                                     }
                        },
                        "textValue":{
                            "props": {
                              "VD": { "x": 98, "y": 34, scale: { x: 1, y: 1 }, anchor: 0.5},
                              "VL": { "x": 98, "y": 34, scale: { x: 1, y: 1 }, anchor: 0.5},
                              "VP": { "x": 98, "y": 34, scale: { x: 1, y: 1 }, anchor: 0.5}, 
                              "text": "skipscreen",
                              "textStyle": {
                                  "fill": "0xffffff",
                                  "fontSize": 20,
                                  "fontFamily": "ProximaNova_Bold",
                                  "maxWidth": 90,
                                  "align": "center",
                           },
                          },
                        },
                    },
                },
                "spinNum": {
                    "props": {
                        "VD": { "x": 40, "y": 30, "gap": 40, anchor: { x: 0.5, y: 0.5 } },
                        "VL": { "x": 0, "y": 55, "gap": 57, anchor: { x: 0.5, y: 0.5 } },
                        "VP": { "x": 106, "y": 38, "gap": 50, anchor: { x: 0.5, y: 0.5 } }
                    },
                    "textStyle": {
                        "fontSize": 35,
                        "fontFamily": "ProximaNova_Bold",
                        "fill": "#FFFFFF",
                        "align": "center",
                        "stroke": '#391400',
                        "strokeThickness": 6,
                    },
                }

            }
        },
        "Desktop": {
            "responsivePanelContainer": {
                
                "bottomBackground": {
                    "elementConstructor": "sprite",
                    "params": {
                        "backgroundImage": "gamePanelBg",
                        "props": { "VD": { "x": -3, "y": 637, scale: { x: 0.9, y: 1.5 } } }
                    }
                },
                "fullScreenBtn": {
                    "elementConstructor": "button",
                    "params": {
                        "backgroundImage": "mFullScreenBtn",
                        "props": { "VD": { "x": 1235, "y": 680,scale:0.42,anchor:0.5 } },
                        "hitArea": { type: "circle", params: { x: 0, y: 0, r: 40 } }
                    }
                },
                "fullScreenBtnOff": {
                    "elementConstructor": "button",
                    "params": {
                        "backgroundImage": "mNormalScreenBtn",
                        "props": { "VD": { "x": 1235, "y": 680,scale:0.42,anchor:0.5 } },
                        "hitArea": { type: "circle", params: { x: 0, y: 0, r: 40 } }
                    }
                },
                "soundOnBtn": {
                    "elementConstructor": "button",
                    "params": {
                        "backgroundImage": "mVolumeOn",
                        "props": { "VD": { "x": 154, "y": 700,scale:0.35,anchor:0.5 } },
                        "hitArea": { type: "circle", params: { x: 0, y: 0, r: 35 } }
                    }
                },
                "soundOffBtn": {
                    "elementConstructor": "button",
                    "params": {
                        "backgroundImage": "mVolumeOff",
                        "props": { "VD": { "x": 154, "y": 700,scale:0.35,anchor:0.5 } },
                        "hitArea": { type: "circle", params: { x: 0, y: 0, r: 35 } }
                    }
                },
                "settingsBtn": {
                    "elementConstructor": "button",
                    "params": {
                        "backgroundImage": "Setting",
                        "props": { "VD": { "x": 154, "y": 660, scale: isHistoryMode ? 0 : 0.35, anchor: 0.5, visible: !isHistoryMode } },
                        "hitArea": { type: "circle", params: { x: 0, y: 0, r: 35 } }
                    }
                },
                "quickSpinBtnOn": {
                    "elementConstructor": "button",
                    "params": {
                        "name" : "quickSpinBtnOn",
                        "backgroundImage": "QuickSP_OFF",
                        "props": { "VD": { "x": 905, "y": 673, scale: isHistoryMode ? 0 : 0.45, anchor: 0.5, visible: !isHistoryMode } },
                        "hitArea": { type: "circle", params: { x: 0, y: 0, r: 45 } }
                    }
                },
                "quickSpinBtnOff": {
                    "elementConstructor": "button",
                    "params": {
                        "name" : "quickSpinBtnOff",
                        "backgroundImage": "turbo",
                        "props": { "VD": { "x": 905, "y": 673, scale: isHistoryMode ? 0 : 0.45, anchor: 0.5, visible: !isHistoryMode } },
                        "hitArea": { type: "circle", params: { x: 0, y: 0, r: 45 } }
                    }
                },
                "paytableBtn": {
                    "elementConstructor": "button",
                    "params": {
                        "backgroundImage": "Help",
                        "props": { "VD": { "x": 203, "y": 679, scale: isHistoryMode ? 0 : 0.45, anchor: 0.5, visible: !isHistoryMode } },
                        "hitArea": { type: "circle", params: { x: 0, y: 0, r: 40 } }
                    }
                },
                "infoBtn": {
                    "elementConstructor": "button",
                    "params": {
                        "backgroundImage": "Paytable Button",
                        "props": { "VD": { "x": 105, "y": 679,scale:0,anchor:0.5 } },
                        "hitArea": { type: "circle", params: { x: 0, y: 0, r: 40 } }
                    }
                },
               
               
                "balanceField": {
                    "elementConstructor": "PanelValueField",
                    "params": {
                        "valueFormatter": "getFormattedAmount",
                        "makeResponsive": false,
                        "props": { "VD": { "x": 263, "y": 640 } , scale:0.8},

                        "backgroundImage": {
                            "image": "Box_balance",
                            "props": { "VD": { "x": 120, "y": 26,scale:{x:0.72,y:0.67}, anchor: 0.5  } }
                        },

                        "balance": {
                            "image": "CREDIT",
                            "props": { "VD": { "x": 120, "y": 26,scale:0.67, anchor: 0.5  } }
                        },
                        "title": {
                            "text": "credit_text",
                            "props": { "VD": { "x": 59, "y": 24, anchor: {x: 1, y: 0.5} } },
                            "style": {
                                "fontStyle": "bold",
                                "fontSize": 20,
                                "fontFamily": "Arial",
                                "lineJoin": "round",
                                "fill": "#00C2FF",
                                "stroke": '#391400',
                                "strokeThickness": 9
                            }
                        },
    

                        "value": {
                            "props": { "VD": { "x": 68, "y": 25, "anchor": { x:0,y:0.5 } } },
                            "style": {
                                "fontStyle": "bold",
                                "fontSize": 18,
                                "fontFamily": "Arial",
                                "lineJoin": "round",
                                "fill": "#FFFFFF",
                                "stroke": '#FFFFFF',
                                "strokeThickness": 1,
                                "align": "center",
                                "wordWrapWidth": 60
                            }
                        }
                    }
                },
                // "Balance": {
                //     "elementConstructor": "sprite",
                //     "params": {
                //         "backgroundImage": "Balance",
                //         "props": { "VD": { "x": 1081, "y": 640,scale:0.67, anchor: 0.5  } }
                //     }
                // },
                "betField": {
                    "elementConstructor": "PanelValueField",
                    "params": {
                        "makeResponsive": false,
                        "valueFormatter": "getFormattedAmount",
                        "props": { "VD": { "x": 23, "y": 635 } },
                        "backgroundImage": {
                            "image": "Box_balance",
                            "props": { "VD": { "x": 60, "y": 26, "anchor": 0.5,scale:0.67 } },
                        },

                        "title": {
                            "text": "bet_text",
                            "props": { "VD": { "x": 297, "y": 60, "anchor": { x:1, y: 0.5} } },
                            "style": {
                                "fontStyle": "bold",
                                "fontSize": 20,
                                "fontFamily": "Arial",
                                "lineJoin": "round",
                                "fill": "#00C2FF",
                                "stroke": '#391400',
                                "maxWidth": 100,
                                "strokeThickness": 8
                            }
                        },
                        "value": {
                            "props": { "VD": { "x": 307, "y": 61, "anchor": { y:0.5}} },
                            "style": {
                                "fontStyle": "bold",
                                "fontSize": 18,
                                "fontFamily": "Arial",
                                "lineJoin": "round",
                                "fill": "#FFFFFF",
                                "stroke": '#FFFFFF',
                                "strokeThickness": 1,
                                "align": "center",
                                "wordWrapWidth": 60
                            }
                        }
                    }
                },
                // "cash_bet": {
                //     "elementConstructor": "sprite",
                //     "params": {
                //         "backgroundImage": "cash bet",
                //         "props": { "VD": { "x": 440, "y": 653,scale:0.67, anchor: 0.5  } }
                //     }
                // },

                "winField": {
                    "elementConstructor": "PanelValueField",
                    "params": {
                        "makeResponsive": false,
                        "valueFormatter": "getFormattedAmount",
                        "props": { "VD": { "x": 670, "y": 650 },scale:{x:1.1,y:1.1}, },

                        "backgroundImage": {
                            "image": "Box_balance",
                            "props": { "VD": { "x": 87, "y": 26,scale:{x:0.72,y:0.67}, "anchor": 0.5 } },
                        },
                        // background: #00C2FF;

                        "title": {
                            "text": "WIN",
                            "props": { "VD": { "x": -75, "y": 15, "anchor": 0.5 } },
                            "style": {
                                "fontStyle": "bold",
                                "fontSize": 26,
                                "fontFamily": "Arial",
                                "lineJoin": "round",
                                "fill": "#00C2FF",
                                "stroke": '#391400',
                                "strokeThickness": 8
                            }
                        },
                        "value": {
                            "props": { "VD": { "x": -40, "y": 15, anchor: {y:0.5} } },
                            "style": {
                                "fontStyle": "bold",
                                "fontSize": 26,
                                "fontFamily": "Arial",
                                "lineJoin": "round",
                                "fill": "#FFFFFF",
                                "stroke": '#391400',
                                "strokeThickness": 8,
                                "align": "center",
                                "wordWrapWidth": 60
                            }
                        }
                    }
                },
                "win": {
                    "elementConstructor": "sprite",
                    "params": {
                        "backgroundImage": "win",
                        "props": { "VD": { "x": 900, "y": 640,scale:0.67, anchor: 0.5  } }
                    }
                },
                // "linesbg": {
                //     "elementConstructor": "sprite",
                //     "params": {
                //         "backgroundImage": "Box_Lines",
                //         "props": { "VD": { "x": 168, "y": 683,scale:0.67, anchor: 0.5  } }
                //     }
                // },
                // "lines": {
                //     "elementConstructor": "sprite",
                //     "params": {
                //         "backgroundImage": "Lines",
                //         "props": { "VD": { "x": 168, "y": 653,scale:0.67, anchor: 0.5  } }
                //     }
                // },
                "lineValue": {
                    "elementConstructor": "PanelValueSelector",
                    "params": {
                        "element": 'lineValue',
                        // "backgroundImage": "coinBetBg",
                        "props": { "VD": { "x": 120, "y": 657 }, },
                        "value": {
                            "valueStyle": {
                                "fontStyle": "bold",
                                "fontSize": 1,
                                "fontFamily": "ProximaNova_Bold",
                                "lineJoin": "round",
                                "fill": "#FFFFFF",
                                "stroke": '#391400',
                                "strokeThickness": 8,
                                "align": "center",
                                "wordWrapWidth": 60
                            },
                            "props": { "VD": { "x": 48, "y": 25, "anchor": 0.5 } }
                        },
                       
                        
                        // "title": {
                        //     "text": "LINES",
                        //     "props": {
                        //         "VD": { "x": 42, "y": -5, "anchor": 0.5 }
                        //     },
                        //     "style": {
                        //         "fontStyle": "bold",
                        //         "fontSize": 20,
                        //         "fontFamily": "ProximaNova_Bold",
                        //         "lineJoin": "round",
                        //         "fill": "#FFFFFF",
                        //         "stroke": '#391400',
                        //         "strokeThickness": 8
                        //     }
                        // }
                    }
                },
                
                "coinValuebg": {
                    "elementConstructor": "sprite",
                    "params": {
                        "backgroundImage": "Box_balance",
                        "props": { "VD": { "x": 300, "y": 675,scale:0, anchor: 0.5  } }
                    }
                },
                "coinvalue": {
                    "elementConstructor": "sprite",
                    "params": {
                        "backgroundImage": "coin value",
                        "props": { "VD": { "x": 302, "y": 640,scale:0.67, anchor: 0.5  } }
                    }
                },
                "coinValue": {
                    "elementConstructor": "PanelValueSelector",
                    "params": {
                        "element": 'coinValue',
                        // "backgroundImage": "coinBetBg",
                        "valueFormatter": "getFormattedAmount",
                        "props": { "VD": { "x": 242, "y": 650 } },
                        "value": {
                            "valueStyle": {
                                "fontStyle": "bold",
                                "fontSize": 24,
                                "fontFamily": "ProximaNova_Bold",
                                "lineJoin": "round",
                                "fill": "#FFFFFF",
                                "stroke": '#391400',
                                "strokeThickness": 8,
                                "align": "center",
                                "wordWrapWidth": 60
                            },
                            "props": { "VD": { "x": 60, "y": 25, "anchor": 0.5,"alpha":0 } }
                        },
                        // "title": {
                        //     "text": "COIN VALUE",
                        //     "props": { "VD": { "x": 59, "y": -5, "anchor": 0.5 } },
                        //     "style": {
                        //         "fontStyle": "bold",
                        //         "fontSize": 20,
                        //         "fontFamily": "ProximaNova_Bold",
                        //         "lineJoin": "round",
                        //         "fill": "#FFFFFF",
                        //         "maxWidth": 110,
                        //         "stroke": '#391400',
                        //         "strokeThickness": 8
                        //     }
                        // },
                        "minusButton": {
                            "props": { "VD": {"x": 718, "y":21 ,anchor: 0.5,scale:0.4 }},
                            "backgroundImage": "minusBtn",
                            "options":{
                                "hitArea": { "type": "polygon", "params": [
                                    -47,47,
                                    -47,-47,
                                    47,-47,
                                    47,47,
                                ] }
                            }
                        },
                        "plusButton": {
                            "props": { "VD": { "x": 900, "y": 21, anchor: 0.5, scale: { x: 0.4 ,y:0.4} } },
                            "backgroundImage": "Plus",
                            "options":{
                                "hitArea": { "type": "polygon", "params": [
                                    -45,45,
                                        -45,-45,
                                        45,-45,
                                        45,45,
                                ] }
                            }
                        }
                    }
                },
                "spinControls": {
                    "elementConstructor": "ParentContainer",
                    "params": {
                        "props": {
                            "VD": { x: 500, y: 620, visible: !isHistoryMode }
                        },
                        "children": {
                            "spinButton": {
                                "elementConstructor": "button",
                                "params": {
                                    "props": { "VD": { "x": 552, "y": 25,scale:0.4,anchor:0.5 }  },
                                    "backgroundImage": "PlaySpin",
                                    // "spineName": "Spin button 2",
                                    // "animations": "animation",
                                    // "defaultAnimation":"Stop",
                                    // "hoverAnimation":"animation",
                                    // "hoverOut":"Stop",
                                    "hitArea": { "type": "polygon", "params": [
                                        -95,90,
                                        -95,-90,
                                        95,-90,
                                        95,90,
                                    ] }

                                }
                            },
                            "stopButton": {
                                "elementConstructor": "button",
                                "params": {
                                    "props": { "VD": { "x": 552, "y": 25,scale:0.4,anchor:0.5 }   },
                                    "backgroundImage": "StopSpin",
                                    // "hitArea": { "type": "circle" }
                                    "hitArea": { "type": "polygon", "params": [
                                        -100,80,
                                        -100,-80,
                                        100,-80,
                                        100,80,
                                    ] }

                                }
                            },
                            "FreespinButton": {
                                "elementConstructor": "sprite",
                                "params": {
                                    "props": { "VD": { "x": 79, "y": 49,scale:0.5,anchor:0.5 }  },
                                    "backgroundImage": "free_Spin_normal",
                                    // "hitArea": { "type": "circle" }
                                    "hitArea": { "type": "polygon", "params": [
                                        -100,60,
                                        -100,-60,
                                        100,-60,
                                        100,60,
                                    ] }

                                }
                            },
                            "autoSpinTxt": {
                                "elementConstructor": "text",
                                "params": {
                                    text: "autospin_text",
                                    textStyle: {
                                        fill: 0xffffff,
                                        "fontSize": 18,
                                        "fontFamily": "ProximaNova_Bold"
                                    },
                                    "subscribeToResize": true,
                                    props: {
                                
                                       "VD": { "x": 552, "y": 88, anchor: 0.5 }
                                    },
                                        newTextStyle:{
                                        fill: 0xED4310,
                                        "fontSize": 18,
                                        "fontFamily": "ProximaNova_Bold"
                                        }
                                }
                            },
                            "autoSpinButton": {
                                "elementConstructor": "button",
                                "hasIcon": true,
                                "iconInfo": {
                                    "backgroundImage": ["asPlayIcon_normal", "asPlayIcon_hover", "asPlayIcon_down", "asPlayIcon_disabled"],
                                    "props": {
                                        "VD": { "x": 3, "y": 0,scale:0.67 },
                                    }
                                },
                                "params": {
                                    "props": { "VD": { "x": 551, "y": 88,scale:0.9,anchor:0.5 } },
                                    "backgroundImage": "AutoPlay_basenew",
                                    //"hitArea": {"type": "circle"}
                                    "hitArea": { "type": "polygon", "params": [
                                        -70,10,
                                        -70,-10,
                                        70,-10,
                                        70,10,
                                    ] }
                                    // "hitArea": { "type": "polygon", "params": [30 * 0.5, 0 * 0.5, 127 * 0.5, 0 * 0.5, 154 * 0.5, 12 * 0.5, 175 * 0.5, 30 * 0.5, 186 * 0.5, 57 * 0.5, 186 * 0.5, 111 * 0.5, 177 * 0.5, 137 * 0.5, 165 * 0.5, 155 * 0.5, 134 * 0.5, 168 * 0.5, 0 * 0.5, 168 * 0.5, 25 * 0.5, 147 * 0.5, 40 * 0.5, 122 * 0.5, 54 * 0.5, 88 * 0.5, 56 * 0.5, 53 * 0.5, 47 * 0.5, 25 * 0.5] }
                                }
                            },
                            "autoSpinStopButton": {
                                "elementConstructor": "button",
                                "hasIcon": true,
                                "iconInfo": {
                                    "backgroundImage": ["asStopIcon_normal", "asStopIcon_hover", "asStopIcon_press", "asStopIcon_disabled"],
                                    "props": {
                                        "VD": { "x": 3, "y": 0,scale:0.67 },
                                        "VL": { "x": 10, "y": 10 },
                                        "VP": { "x": 10, "y": 10 }
                                    }
                                },
                                "params": {
                                    "props": { "VD": { "x": 551, "y": 88,scale:0.9,anchor:0.5 } },
                                    "backgroundImage": "AutoPlay_basenew",
                                    //"hitArea": {"type": "circle"}
                                    "hitArea": { "type": "polygon", "params": [
                                        -45,40,
                                        -45,-40,
                                        45,-40,
                                        45,40,
                                    ] }
                                    //"hitArea": { "type": "polygon", "params": [30 * 0.5, 0 * 0.5, 127 * 0.5, 0 * 0.5, 154 * 0.5, 12 * 0.5, 175 * 0.5, 30 * 0.5, 186 * 0.5, 57 * 0.5, 186 * 0.5, 111 * 0.5, 177 * 0.5, 137 * 0.5, 165 * 0.5, 155 * 0.5, 134 * 0.5, 168 * 0.5, 0 * 0.5, 168 * 0.5, 25 * 0.5, 147 * 0.5, 40 * 0.5, 122 * 0.5, 54 * 0.5, 88 * 0.5, 56 * 0.5, 53 * 0.5, 47 * 0.5, 25 * 0.5] }
                                }
                            },

                            "asValueBg": {
                                "elementConstructor": "sprite",
                                "params": {
                                    "props": {
                                        "VD": { "x": 160, "y": 25, visible: false ,scale :0.2}
                                    },
                                    "backgroundImage": "tumble_",
                                }
                            },

                            "asValue": {
                                "elementConstructor": "text",
                                "params": {
                                    text: "0",
                                    textStyle: {
                                         fill: "#030303",
                                        "fontSize": 36,
                                        "fontFamily": "Arial",
                                        "fontWeight": "bold"
                                    },
                                    props: { "VD": { x: 551, y: 25, anchor: 0.5, visible: false } }
                                }
                            },
                            "betMaxButton": {
                                "elementConstructor": "button",
                                "params": {
                                    "props": { "VD": { "x": -28, "y": 51,scale:0.7,anchor:0.5} },
                                    "backgroundImage": "maxBetBtn",
                                    "hitArea": { "type": "polygon", "params": [
                                        -0,0,
                                        -0,-0,
                                        0,-0,
                                        0,0,
                                    ] }
                                }
                            },
                            "fakeButton": {            //created for multiple click recognition
                                "elementConstructor": "button",
                                "params": {
                                    "props": { "VD": { "x": 552, "y": 25, scale: 0.4, anchor: 0.5, visible: false }  },
                                    "backgroundImage": "StopSpin",
                                    // "hitArea": { "type": "circle" }
                                    "hitArea": { "type": "polygon", "params": [
                                        -95,90,
                                        -95,-90,
                                        95,-90,
                                        95,90,
                                    ] }
                                }
                            },
                        }
                    }
                }
            }
        },
        "Mobile": {
            "panelContainer": {

                "bottomStrip": {
                    "elementConstructor": "PanelBGStrip",
                    "params": {
                        "alignment": "BOTTOM",
                        "height": 0.1,
                        "backgroundColor": 0xFF0000,
                        "isStretchable": false
                    }
                },

                "bottomBackground": {
                    "elementConstructor": "sprite",
                    "params": {
                        "subscribeToResize": true,
                        "props": {
                            "VL": {
                                "x": 0,
                                "y": 0,
                                "anchor": { "y": 0.42 },
                                "landScaleX": 2,
                                "landScaleY": 2,
                                "texture": "MgamePanelBg",
                                "isStrech": true
                            },
                            "VP": {
                                "x": 0,
                                "y": 500,
                                "anchor": { "y": 1 },
                                "portScaleX": 0.8,
                                "portScaleY": 4,
                                "texture": "MgamePanelBg",
                                "isStrech": true
                            }
                        },
                        "backgroundImage": "MgamePanelBg"
                    }
                },
                // "paytableBtn": {
                //     "elementConstructor": "button",
                //     "params": {
                //         "subscribeToResize": true,
                //         "props": {
                //             "VL": { "x": 660, "y": 325,scale:0.3, "anchor": 0.5 },
                //             "VP": { "x": 28, "y": 767,scale:0.35, "anchor": 0.5 }
                //                             //         "props": {
                //             // "HX": 380,
                //             // "HY": 660,
                //             // "VX": 10,
                //             // "VY": 1210,
                //             // "landScaleX": 1,
                //             // "landScaleY": 1,
                //             // "portScaleX": 1,
                //             // "portScaleY": 1,
                //             // "landAlignX": "LEFT",
                //             // "landAlignY": "BOTTOM",
                //             // "portAlignX": "LEFT",
                //             // "portAlignY": "BOTTOM"
                        
                //         },
                //         "backgroundImage": "Help",
                //         // "hitArea": { "type": "circle", "params": { x: 0, y: -5 } }
                //     }
                // },
                "infoBtn": {
                    "elementConstructor": "button",
                    "params": {
                        "subscribeToResize": true,
                        "props": {
                            "VL": { "x": 30, "y": 325,scale:0, "anchor": 0.5 },
                            "VP": { "x": 351, "y": 596,scale:0, "anchor": 0.5 }
                        },
                        "backgroundImage": "Paytable Button",
                        "hitArea": { "type": "circle", "params": { x: 0, y: -5 } }
                    }
                },

                "soundOnButton": {
                    "elementConstructor": "button",
                    "params": {
                        "subscribeToResize": true,
                        "props": {
                           "VL": { "x": 600, "y": 325,scale:0, "anchor": 0.5 },
                            "VP": { "x": 351, "y": 838,scale:0, "anchor": 0.5 }
                        },
                        "backgroundImage": "mVolumeOn",
                        "hitArea": { "type": "circle", "params": { x: 0, y: -5 } }
                    }
                },
                "soundOffButton": {
                    "elementConstructor": "button",
                    "params": {
                        "subscribeToResize": true,
                        "props": {
                           "VL": { "x": 600, "y": 325,scale:0, "anchor": 0.5 },
                           "VP": { "x": 351, "y": 838,scale:0, "anchor": 0.5 }
                        },
                        "backgroundImage": "mVolumeOff",
                        "hitArea": { "type": "circle", "params": { x: 0, y: -5 } }
                    }
                },
                // "settingsBtn": {
                //     "elementConstructor": "button",
                //     "params": {
                //         "subscribeToResize": true,
                //         "props": {
                //             "VL": { "x": 30, "y": 325,scale:0.3, "anchor": 0.5 },
                //             "VP": { "x": 40, "y": 767,scale:0.35, "anchor": 0.5 }
                //         },
                //         "backgroundImage": "Setting",
                //         "hitArea": { "type": "circle", "params": { x: 0, y: -5 } }
                //     }
                // },
               
                "balanceField": {
                    "elementConstructor": "PanelValueField",
                    "params": {
                        "makeResponsive": true,
                        "props": {
                            "HX": 300,
                            "HY": 660,
                            "VX": 10,
                            "VY": 1210,
                            "landScaleX": 1,
                            "landScaleY": 1,
                            "portScaleX": 1,
                            "portScaleY": 1,
                            // "landAlignX": "LEFT",
                            // "landAlignY": "BOTTOM",
                            // "portAlignX": "LEFT",
                            // "portAlignY": "BOTTOM"
                        },
                        "props_german": {
                            "HX": 170,
                            "HY": 645,
                            "VX": 10,
                            "VY": 910,
                            "landScaleX": 1,
                            "landScaleY": 1,
                            "portScaleX": 1,
                            "portScaleY": 1,
                            "landAlignX": "LEFT",
                            "landAlignY": "BOTTOM",
                            "portAlignX": "LEFT",
                            "portAlignY": "BOTTOM"
                        },
                        "valueFormatter": "getFormattedAmount",
                        "backgroundImage": {
                            "image": "Box_balance",
                            "props": {
                                "VL": { "x": 5, "y": -2, "scale": { x: 0.975, y: 0.75 } },
                                "VP": { "x": 5, "y": -2, "scale": { x: 0.975, y: 0.75 } }
                            }
                        },
                        "icon": {
                            "image": "Balance",
                            "props": {
                                "VL": { "x": 47, "y": -26, "scale": 0.7 },
                                "VP": { "x": 47, "y": -26, "scale": 0.7 }
                            }
                        },
                        "title": {
                            "text": "credit_text",
                           "props": {
                                "VL": { "x": -20, "y": 3, "scale": 0.7, anchor : { x:1 , y: 0.5 } },
                                "VP": { "x": 170, "y": 35, "scale": 0.7, anchor : { x:1 , y: 0.5 }  }
                            },
                            "style": {
                                "fontStyle": "bold",
                                "fontSize": 35,
                                "fontFamily": "Arial",
                                "lineJoin": "round",
                                "fill": "#00C2FF",
                                "stroke": '#391400',
                                "strokeThickness": 9
                            }
                        },
                       
                        "value": {
                            "props": {
                                "VL": { "x": 7, "y": 8, "anchor": { y:0.5} },
                                "VP": { "x": 197, "y": 36.5, "anchor":{y:0.5}  }
                            },
                            "style": {
                                "fontStyle": "bold",
                                "fontSize": 30,
                                "fontFamily": "ProximaNova_Bold",
                                "lineJoin": "round",
                                "fill": "#FFFFFF"
                            }
                        }
                    }
                },
                "betField": {
                    "elementConstructor": "PanelValueField",
                    "params": {
                        "makeResponsive": true,
                        "props": {
                            "HX": 312,
                            "HY": 695,
                            "VX": 310,
                            "VY": 1210,
                            "landScaleX": 1,
                            "landScaleY": 1,
                            "portScaleX": 1,
                            "portScaleY": 1,
                        //   "landAlignX": "LEFT",
                        //     "landAlignY": "BOTTOM",
                        //     "portAlignX": "LEFT",
                        //     "portAlignY": "BOTTOM"
                        },
                        "props_german": {
                            "HX": 445,
                            "HY": 645,
                            "VX": 280,
                            "VY": 910,
                            "landScaleX": 1,
                            "landScaleY": 1,
                            "portScaleX": 1,
                            "portScaleY": 1,
                            "landAlignX": "CENTER",
                            "landAlignY": "BOTTOM",
                            "portAlignX": "CENTER",
                            "portAlignY": "BOTTOM"
                        },
                        "valueFormatter": "getFormattedAmount",
                        "backgroundImage": {
                            "image": "Box_balance",
                            "props": {
                                "VL": { "x": -15, "y": -3.5, "scale": { x: 1, y: 0.8 } },
                                "VP": { "x": 18, "y": -2, "scale": { x: 0.6, y: 0.75 } }
                            }
                        },
                        "icon": {
                            "image": "coin value",
                            "subscribeToResize": true,
                            "props": {
                                "VL": { "x": 68.5, "y": -28.5, "scale":{ x:0.8,y:0.75} },
                                "VP": { "x": 61, "y": -26, "scale": 0.7 }
                            }
                        },
                        "title": {
                            "text": "bet_text",
                            "props": {
                                "VL": { "x": -30, "y": 5, "scale":{ x:0.7,y:0.7}, "anchor" : {x :1, y: 0.5} },
                                "VP": { "x": 210, "y": 38, "scale": 0.7, "anchor" : {x :1, y: 0.5} }
                            },
                            "style": {
                                "fontStyle": "bold",
                                "fontSize": 35,
                                "fontFamily": "Arial",
                                "lineJoin": "round",
                                "fill": "#00C2FF",
                                "stroke": '#391400',
                                "strokeThickness": 9
                            }
                        },
                        
                        "value": {
                            "props": {
                                "VL": { "x": -10, "y": 4, "anchor": { y:0.5} },
                                "VP": { "x": 223, "y": 36.5, "anchor": { y:0.5} }
                            },
                            // "props": {
                            //     "VL": { "x": -255, "y": 40, "anchor": 0.5 },
                            //     "VP": { "x": 250, "y": 36.5, "anchor": 0.5 }
                            // },
                            "style": {
                                "fontStyle": "bold",
                                "fontSize": 30,
                                "fontFamily": "ProximaNova_Bold",
                                "lineJoin": "round",
                                "fill": "#FFFFFF"
                            }
                        }
                    }
                },
                "winField": {
                    "elementConstructor": "PanelValueField",
                    "params": {
                        "makeResponsive": true,
                        "props": {
                            "HX": 805,
                            "HY": 660,
                            "VX": 525,
                            "VY": 1212,
                            "landScaleX": 1,
                            "landScaleY": 1,
                            "portScaleX": 0.85,
                            "portScaleY": 0.95,
                            "landAlignX": "RIGHT",
                            "landAlignY": "BOTTOM",
                            "portAlignX": "RIGHT",
                            "portAlignY": "BOTTOM"
                        },
                        "props_german": {
                            "HX": 663,
                            "HY": 645,
                            "VX": 495,
                            "VY": 910,
                            "landScaleX": 1,
                            "landScaleY": 1,
                            "portScaleX": 1,
                            "portScaleY": 1,
                            "landAlignX": "RIGHT",
                            "landAlignY": "BOTTOM",
                            "portAlignX": "RIGHT",
                            "portAlignY": "BOTTOM"
                        },
                        "valueFormatter": "getFormattedAmount",
                        "backgroundImage": {
                            "image": "Box_balance",
                            "props": {
                                "VL": { "x": -15, "y": -3.5, "scale": { x: 1, y: 0.8 } },
                                "VP": { "x": 11.5, "y":-2, "scale": { x: 0.875, y: 0.75 } }
                            }
                        },
                        "icon": {
                            "image": "win",
                            "props": {
                                "VL": { "x": 70, "y": -30, "scale": 0.8 },
                                "VP": { "x": 87.5, "y": -26, "scale": 0.7 }
                            }
                        },  
                         "title": {
                            "text": "WIN",
                            "props": {
                                "VL": { "x": 0, "y": 3, "scale":{ x:0.7,y:0.7} },
                                "VP": { "x": 153, "y": 20, "scale": 0 }
                            },
                            "style": {
                                "fontStyle": "bold",
                                "fontSize": 35,
                                "fontFamily": "Arial",
                                "lineJoin": "round",
                                "fill": "#00C2FF",
                                "stroke": '#391400',
                                "strokeThickness": 9
                            }
                        },
                        "value": {
                            "text": "$12345",
                            "props": {
                                "VL": { "x": 65, "y": 19, anchor:{y:0.5}  },
                                "VP": { "x": -190, "y":-250, "anchor": 0.5 }
                            },
                            "style": {
                                "fontStyle": "bold",
                                "fontSize": 30,
                                "fontFamily": "ProximaNova_Bold",
                                "lineJoin": "round",
                                "fill": "#FFFFFF"
                            }
                        }
                    }
                },

                "BuyControl":{
                    "elementConstructor": "ParentContainer",
                    "params": {
                        "makeResponsive": true,
                        // "subscribeToResize": true,
                        "props": {
                            "HX": 1220,
                            "HY": 404,
                            "VX": 360,
                            "VY": 1017,
                            "landScaleX": 0.9,
                            "landScaleY": 0.9,
                            "portScaleX": 0.95,
                            "portScaleY": 0.95,
                            "landAlignX": "RIGHT",
                            "landAlignY": "CENTER",
                            "portAlignX": "CENTER",
                            "portAlignY": "BOTTOM"
                        },
                        "children": {
                            "BuyBaseLeft": {
                                "elementConstructor": "sprite",
                                "hasIcon": false,
                                "iconInfo": {
                                    "backgroundImage": ["asStopIconn_normal", "asStopIconn_normal", "asStopIconn_normal", "asStopIconn_disabled"],
                                    "props": {
                                        "VL": { x: 0, y: 83, rotation: 1.57, scale: { x: 1, y: 1 } },
                                        "VP": { "x": 80, "y": 0, rotation: 0, anchor: 0.5, "scale": { x: 1, y: 1 } }
                                    }
                                },
                                "params": {
                                    "subscribeToResize": true,
                                    "props": {
                                        "VL": { "x": -40, "y": 295, rotation: 0,anchor: 0.5, "scale": { x: 0.0, y: 0.0 } },
                                        "VP": { "x": -224, "y": -185, rotation: 0, anchor: 0.5, "scale": { x: 0.85, y: 0.65}}
                                    },
                                    "backgroundImage": "sidePanelBase_VP",
                                    // "hitArea": { "type": "circle", "params": { x: 0 } }
                                    "hitArea": { "type": "polygon", "params": [
                                        -180,70,
                                        -180,-70,
                                        180,-70,
                                        180,70
                                    ] }

                                },
                                
                            },
                            "BuyBaseRight": {
                                "elementConstructor": "sprite",
                                "hasIcon": false,
                                "iconInfo": {
                                    "backgroundImage": ["asStopIconn_normal", "asStopIconn_normal", "asStopIconn_normal", "asStopIconn_disabled"],
                                    "props": {
                                        "VL": { x: 0, y: 83, rotation: 1.57, scale: { x: 1, y: 1 } },
                                        "VP": { "x": 80, "y": 0, rotation: 0, anchor: 0.5, "scale": { x: 1, y: 1 } }
                                    }
                                },
                                "params": {
                                    "subscribeToResize": true,
                                    "props": {
                                        "VL": { "x": -40, "y": 295, rotation: 0,anchor: 0.5, "scale": { x: 0.0, y: 0.0 } },
                                        "VP": { "x": 207, "y": -185, rotation: 0, anchor: 0.5, "scale": { x: 0.85, y: 0.65 }}
                                    },
                                    "backgroundImage": "sidePanelBase_VP",
                                    // "hitArea": { "type": "circle", "params": { x: 0 } }
                                    "hitArea": { "type": "polygon", "params": [
                                        -180,70,
                                        -180,-70,
                                        180,-70,
                                        180,70
                                    ] }

                                },
                                
                            },
                        }

                    }
                },
                "spinControls": {
                    "elementConstructor": "ParentContainer",
                    "params": {
                        "makeResponsive": true,
                        // "subscribeToResize": true,
                        "props": {
                            // "VL": { "x": 850, "y": 350, rotation:0,anchor: 0.5, "scale": { x: 0.5, y: 0.5 } },
                            // "VP": { "x": 17, "y": 1080, rotation: 0, anchor: 0.5, "scale": { x: 0.85, y: 0.85 } },
                            "HX": 1220,
                            "HY": 404,
                            "VX": 360,
                            "VY": 1025,
                            "landScaleX": 0.9,
                            "landScaleY": 0.9,
                            "portScaleX": 0.95,
                            "portScaleY": 0.95,
                            "landAlignX": "RIGHT",
                            "landAlignY": "CENTER",
                            "portAlignX": "CENTER",
                            "portAlignY": "BOTTOM"
                        },
                        "children": {
                            // "spinCtrlBg": {
                            //     "elementConstructor": "sprite",
                            //     "params": {
                            //         "subscribeToResize": true,
                            //         "props": {
                            //             "VL": { "x": -90, "y": 330, rotation: -1.57, scale: { x: 1.1, y: 1.1 } },
                            //             "VP": { "x": -230, "y": -5, rotation: 0, scale: { x: 1.5, y: 1.5 } }
                            //         },
                            //         "backgroundImage": "mSpinCtrlBG",
                            //     }
                            // },
                            "spinButton": {
                                "elementConstructor": "button",
                                "hasIcon": false,
                                "iconInfo": {
                                    "backgroundImage": ["asSpinIcon_normal", "asSpinIcon_normal", "asSpinIcon_normal", "asSpinIcon_normal"],
                                    "props": {
                                        "VL": { x: 0, y: 83, rotation: -1.57, scale: { x: 1, y: 1 } },
                                        "VP": { x: 0, y: 90, rotation: 3.30, scale: { x: -1, y: -1 } }
                                    }
                                },
                                "params": {
                                    "subscribeToResize": true,
                                    "props": {
                                        "VL": { "x": -40, "y": 360, rotation:0,anchor: 0.5, "scale": { x: 0.62, y: 0.62 } },
                                        "VP": { "x": 17, "y": 58, rotation: 0, anchor: 0.5, "scale": { x: 0.6, y: 0.6 } }
                                    },
                                    "backgroundImage": "PlaySpin",
                                    // "spineName": "Spin button 2",
                                    // "animations": "animation",
                                    // "defaultAnimation":"Stop",
                                    // "hoverAnimation":"animation",
                                    // "hoverOut":"Stop",
                                    "hitArea": { "type": "polygon", "params": [
                                        -100,85,
                                        -100,-85,
                                        100,-85,
                                        100,85
                                    ] }


                                }
                            },
                            "stopButton": {
                                "elementConstructor": "button",
                                "hasIcon": false,
                                "iconInfo": {
                                    "backgroundImage": ["asStopIconn_normal", "asStopIconn_normal", "asStopIconn_normal", "asStopIconn_disabled"],
                                    "props": {
                                        "VL": { x: 0, y: 83, rotation: 0, scale: { x: 1, y: 1 } },
                                        "VP": { "x": 80, "y": 0, rotation: 0, anchor: 0.5, "scale": { x: 1, y: 1 } }
                                    }
                                },
                                "params": {
                                    "subscribeToResize": true,
                                    "props": {
                                        "VL": { "x": -40, "y": 360, rotation: -3.14/2,anchor: 0.5, "scale": { x: 0.63, y: 0.63 } },
                                        "VP": { "x": 17, "y": 58, rotation: 0, anchor: 0.5, "scale": { x: 0.63, y: 0.63 } }
                                    },
                                    "backgroundImage": "StopSpin",
                                    // "hitArea": { "type": "circle", "params": { x: 0 } }
                                    "hitArea": { "type": "polygon", "params": [
                                        -100,85,
                                        -100,-85,
                                        100,-85,
                                        100,85
                                    ] }

                                }
                            },
                            "FreespinButton": {
                                "elementConstructor": "button",
                                "hasIcon": false,
                                "iconInfo": {
                                    "backgroundImage": ["free_Spin_normal", "free_Spin_normal", "free_Spin_normal", "free_Spin_normal"],
                                    "props": {
                                        "VL": { x: 0, y: 83, rotation: -1.57, scale: { x: 1, y: 1 } },
                                        "VP": { x: 0, y: 90, rotation: 3.30, scale: { x: -1, y: -1 } }
                                    }
                                },
                                "params": {
                                    "subscribeToResize": true,
                                    "props": {
                                        "VL": { "x": -40, "y": 295, rotation: -6.28318531,anchor: 0.5, "scale": { x: 0.75, y: 0.75 } },
                                        "VP": { "x": 17, "y": 80, rotation: 0, anchor: 0.5, "scale": { x: 0.85, y: 0.85 } }
                                    },
                                    "backgroundImage": "free_Spin",
                                    // "hitArea": { "type": "circle", "params": { x: 0 } }
                                    "hitArea": { "type": "polygon", "params": [
                                        -120,70,
                                        -120,-70,
                                        120,-70,
                                        120,70
                                    ] }
                                    

                                }
                            },
                            // "autoSpinText": {
                            //     "elementConstructor": "text",
                            //     "params": {
                            //         text: "AUTOPLAY",
                            //         textStyle: {
                            //             fill: 0xffffff,
                            //             "fontSize": 24,
                            //             "fontFamily": "ProximaNova_Bold"
                            //         },
                            //         "subscribeToResize": true,
                            //         props: {
                            //             "VL": { "x": -39, "y": 565, anchor: 0.5 },
                            //            "VP": { "x": 17, "y": 192, anchor: 0.5 }
                            //         },
                            //         newTextStyle:{
                            //             fill: 0xED4310,
                            //             "fontSize": 18,
                            //             "fontFamily": "ProximaNova_Bold"
                            //         }
                            //     }
                            // },
                            "autoSpinButton": {
                                "elementConstructor": "button",
                                "hasIcon": true,
                                "iconInfo": {
                                    "backgroundImage": ["autospinn_normal", "autospinn_hover", "autospinn_press", "autospinn_disable"],
                                    "props": {
                                        "VD": { "x": 40, "y": 54 },
                                        "VL": { "x": 1, "y": 2.5, rotation: 0, scale: { x:1, y: 1}},
                                        "VP": { "x": 0, "y": 0, rotation: 1.57, scale: { x:1, y: 1 } }
                                    }
                                },

                                "params": {
                                    "subscribeToResize": true,
                                    "props": {
                                        "VL": { "x": -40, "y": 520, rotation: 0,anchor: 0.5, scale: { x: 1, y:1} },
                                        "VP": { "x": 188, "y": 53, rotation:0,anchor: 0.5, scale: { x: 1, y:1 } }
                                    },
                                    "backgroundImage": "autospin",
                                    "hitArea": { "type": "polygon", "params": [
                                        -50,50,
                                        -50,-50,
                                        50,-50,
                                        50,50
                                    ] },

                                    // "hitArea": { "type": "circle" }
                                }
                            },
                        
                            "autoSpinStopButton": {
                                "elementConstructor": "button",
                                "hasIcon": true,
                                "iconInfo": {
                                    "backgroundImage": ["asStopIconn_normal", "asStopIconn_normal", "asStopIconn_normal", "asStopIconn_disabled"],
                                    "props": {
                                        "VL": { x: 0, y: 83, rotation: 0, scale: { x: 1, y: 1 } },
                                        "VP": { "x": 80, "y": 0, rotation: 0, anchor: 0.5, "scale": { x: 1, y: 1 } }
                                    }
                                },
                                "params": {
                                    "subscribeToResize": true,
                                    "props": {
                                        "VL": { x: -40, y: 360, rotation: 0,anchor: 0.5, scale: { x: 0.62, y: 0.62 } },
                                        "VP": { "x": 15, "y": -20, rotation: 0, anchor: 0.5,  "scale": { x: 0.62, y: 0.62 } }
                                    },
                                    "backgroundImage": "StopSpin",
                                    // "hitArea": { "type": "circle", "params": { x: 0 } }
                                    "hitArea": { "type": "polygon", "params": [
                                        -50,50,
                                        -50,-50,
                                        50,-50,
                                        50,50
                                    ] }

                                }
                            },
                            "autoSpinStopButton2": {
                                "elementConstructor": "button",
                                "hasIcon": false,
                                "iconInfo": {
                                    "backgroundImage": ["asStopIcon_normal", "asStopIcon_normal", "asStopIcon_normal", "asStopIcon_normal"],
                                    "props": {
                                        "VD": { "x": 40, "y": 54 },
                                        "VP": { "x": 8, "y": 0, rotation: 0, scale: { x: 0.75, y: 0.75 } },
                                        "VL": { "x": 8, "y": -3, rotation: -3.14/2,scale: { x: 0.75, y: 0.75 }},
                                    }
                                },
                                "params": {
                                    "subscribeToResize": true,
                                    "props": {
                                        "VL": { "x": -30, "y": 468.5, rotation: 3.14,anchor: 0.5, scale: { x: 1.2, y: 1.2 } ,alpha:0},
                                        "VP": { "x": 163, "y": 81.5, rotation: 0,anchor: 0.5, scale: { x: 1.2, y: 1.2 },alpha:0 }
                                    },
                                    "backgroundImage": "autoSpinBg",
                                    "hitArea": { "type": "polygon", "params": [
                                        -0,0,
                                        -0,-0,
                                        0,-0,
                                        0,0
                                    ] }

                                    // "hitArea": { "type": "polygon", "params": [-15 * 0.5, -64.5 * 0.5, 50 * 0.5, -63.5 * 0.5, 62.5 * 0.5, -56 * 0.5, 64.5 * 0.5, 49 * 0.5, 57 * 0.5, 61.5 * 0.5, -61.5 * 0.5, 59 * 0.5, -65.5 * 0.5, -50 * 0.5, -52 * 0.5, -63.5 * 0.5, -16 * 0.5, -64.5 * 0.5] }

                                    // "hitArea": { "type": "circle", "params": {x: 0, y: 0}}
                                }
                            }, 
                            "asValueBg": {
                                "elementConstructor": "sprite",
                                "params": {
                                    "subscribeToResize": true,
                                    "props": {
                                        "VL": { "x": -80.5, "y": 265, scale: 0.27 },
                                        "VP": { "x": -19.5, "y": 39, scale: 0.3 }
                                    },
                                    "backgroundImage": "tumble_b",
                                }
                            },
                            "asValue": {
                                "elementConstructor": "text",
                                "params": {
                                    text: "0",
                                    textStyle: {
                                        fill: 0xffffff,
                                        "fontSize": 29,
                                        "fontFamily": "ProximaNova_Bold"
                                    },
                                    "subscribeToResize": true,
                                    props: {
                                        "VL": { "x": 2000, "y": 295, anchor: 0.5 },
                                       "VP": { "x": 2000, "y": 72, anchor: 0.5 }
                                    }
                                }
                            },
                            "betButtonParent": {
                                "elementConstructor": "button",
                                "hasIcon": true,
                                "iconInfo": {
                                    "backgroundImage": ["betButton_iconn_normal", "betButton_iconn_hover", "betButton_iconn_press", "betButton_iconn_disabled"],
                                    "props": {
                                        "VD": { "x": 40, "y": 54, scale: { x: 0, y: 0} },
                                        "VL": { "x": -4, "y":-6.5, rotation: 0, scale: { x: 1.2, y: 1.2} },
                                        "VP": { "x": 0, "y": 0, rotation: 1.57, scale: { x:1.2, y: 1.2 } }
                                    }
                                },
                                "params": {
                                    "subscribeToResize": true,
                                    "props": {
                                        "VL": { "x": -40, "y": 200, rotation: 0,anchor: 0.5 ,scale: { x:1, y: 1 } },
                                        "VP": { "x": -155, "y": 53, rotation: 0, anchor: 0.5, scale: { x:1, y: 1 } }
                                    },
                                    "backgroundImage": "betButton",
                                    "hitArea": { "type": "polygon", "params": [
                                        -41,41,
                                        -41,-41,
                                        41,-41,
                                        41,41
                                    ] }

                                    // "hitArea": { "type": "polygon", "params": [-15 * 0.5, -64.5 * 0.5, 50 * 0.5, -63.5 * 0.5, 62.5 * 0.5, -56 * 0.5, 64.5 * 0.5, 49 * 0.5, 57 * 0.5, 61.5 * 0.5, -61.5 * 0.5, 59 * 0.5, -65.5 * 0.5, -50 * 0.5, -52 * 0.5, -63.5 * 0.5, -16 * 0.5, -64.5 * 0.5] }

                                    // "hitArea": { "type": "circle" }
                                }
                            },
                           
                            "minusBtn": {
                                "elementConstructor": "button",
                                "params": {
                                    "subscribeToResize": true,
                                    "props": {
                                        "VL": { "x": 200, "y": 90,scale:0, "anchor": 0.5 },
                                        "VP": { "x": -105, "y": 122.5,scale:0, "anchor": 0.5 }
                                    },
                                    "backgroundImage": "minusBtn",
                                    "hitArea": { "type": "circle", "params": { x: 0, y: -5 } }
                                }
                            },
                            "plusBtn": {
                                "elementConstructor": "button",
                                "params": {
                                    "subscribeToResize": true,
                                    "props": {
                                        "VL": { "x": 200, "y": 90,scale:0, "anchor": 0.5 },
                                        "VP": { "x": 138, "y": 122.5,scale:0, "anchor": 0.5 }
                                    },
                                    "backgroundImage": "Plus",
                                    "hitArea": { "type": "circle", "params": { x: 0, y: -5 } }
                                }
                            },
                          
                          
                            
                         
                            // "infoBtn": {
                            //     "elementConstructor": "button",
                            //     "params": {
                            //         "subscribeToResize": true,
                            //         "props": {
                            //            "VL": { "x": -1570, "y": 750,scale:0.7, "anchor": 0.5 },
                            //             "VP": { "x": 310, "y": 150,scale:0.7, "anchor": 0.5 }
                            //         },
                            //         "backgroundImage": "Paytable Button",
                            //         "hitArea": { "type": "circle", "params": { x: 0, y: -5 } }
                            //     }
                            // },

                            "turbobtnOn": {
                                "elementConstructor": "button",
                                "params": {
                                    "subscribeToResize": true,
                                    "props": {
                                        "VL": { "x": 0, "y": 750, scale: isHistoryMode ? 0 : 0.7, "anchor": 0.5, visible: !isHistoryMode },
                                        "VP": { "x": 158, "y": 124, scale: isHistoryMode ? 0 : 0.7, "anchor": 0.5, visible: !isHistoryMode }
                                    },
                                    "backgroundImage": "QuickSP_ONn",
                                    "hitArea": { "type": "circle", "params": { x: 0, y: -5 } }
                                }
                            },
                            // "paytableBtn": {
                            //     "elementConstructor": "button",
                            //     "params": {
                            //         "subscribeToResize": true,
                            //         "props": {
                            //             "VL": { "x": -1520, "y": 750,scale:0.7, "anchor": 0.5 },
                            //             "VP": { "x": -314, "y": 115,scale:0.7, "anchor": 0.5 }
                            //         },
                            //         "backgroundImage": "Help",
                            //         "hitArea": { "type": "circle", "params": { x: 0, y: -5 } }
                            //     }
                            // },
                        }
                    }
                },

                "betPanelMobileCover": {
                    "elementConstructor": "rectangle",
                    "params": {
                        "props": {
                            "VL": { "x": 0, "y": 0, alpha: 0.95, visible: false },
                            "VP": { "x": 0, "y": 0, alpha: 0.95, visible: false }
                        },
                        "layout": {
                            "width": 1280,
                            "height": 1280,
                            "color": 0x000000
                        }
                    }
                },
                "betPanelMobile": {
                    "elementConstructor": "ParentContainer",
                    "params": {
                        "makeResponsive": true,
                        "subscribeToResize": true,
                        "props": {
                            "HX": 367,
                            "HY": 267,
                            "VX": 57,
                            "VY": 550,
                            "landScaleX": .78,
                            "landScaleY": .78,
                            "portScaleX": 0.9,
                            "portScaleY": 0.9,
                            "landAlignX": "CENTER",
                            "landAlignY": "CENTER",
                            "portAlignX": "CENTER",
                            "portAlignY": "BOTTOM",
                            "anchor": 0.5
                        },
                        "children": {
                            "betPanelBG": {
                                "elementConstructor": "sprite",
                                "params": {
                                    "props": {
                                        "VL": { x: -39.5, y: 457 ,scale:{x:0.78,y:0.78},rotation:-1.57},
                                        "VP": { x: -39.5, y: 457,scale:0.78,rotation:-1.57 }
                                    },
                                    "backgroundImage": "Buy Freespin panel"
                                }
                            },
                            "betPanelClose": {
                                "elementConstructor": "button",
                                "params": {
                                    // "subscribeToResize": true,
                                    "props": {
                                        "VL": { "x": 640, "y": 193,scale:0.9, "anchor": 0.5 },
                                        "VP": { "x": 640, "y": 193,scale:0.9, "anchor": 0.5 }
                                    },
                                    "backgroundImage": "mCloseBtn",
                                    "hitArea": { "type": "circle", "params": { x: 0, y: -5 } }
                                }
                            },
                            "betMaxButton": {
                                "elementConstructor": "button",
                                "params": {
                                    "props": {
                                        "VL": { "x": 480, "y": 324, scale: 0.8},
                                        "VP": { "x": 480, "y": 324, scale: 0.8 }
                                    },
                                    "backgroundImage": "maxBet",
                                    "hitArea": { "type": "circle" }

                                }
                            },
                            "minus": {
                                "elementConstructor": "sprite",
                                "params": {
                                    "props": {
                                        "VL": { "x": 228, "y": 264, scale: 0.8 },
                                        "VP": { "x": 222, "y": 264, scale: 0.8 }
                                    },
                                    "backgroundImage": "-"
                                }
                            },
                            "plus": {
                                "elementConstructor": "sprite",
                                "params": {
                                    "props": {
                                        "VL": { "x": 642, "y": 258, scale: 0.8 },
                                        "VP": { "x": 661, "y": 258, scale: 0.8 }
                                    },
                                    "backgroundImage": "+"
                                }
                            },
                            "coinvalue": {
                                "elementConstructor": "sprite",
                                "params": {
                                    "props": {
                                        "VL": { "x": 20, "y": 260, scale: 0.8 },
                                        "VP": { "x": 20, "y": 260, scale: 0.8 }
                                    },
                                    "backgroundImage": "COIN VALUE_"
                                }
                            },
                            
                            "lines": {
                                "elementConstructor": "sprite",
                                "params": {
                                    "props": {
                                        "VL": { "x": 20, "y": 261.5, scale: 0},
                                        "VP": { "x": 20, "y": 261.5, scale: 0 }
                                    },
                                    "backgroundImage": "LINES_"
                                }
                            },
                            "bet": {
                                "elementConstructor": "sprite",
                                "params": {
                                    "props": {
                                        "VL": { "x": 20, "y": 344, scale: 0.8 },
                                        "VP": { "x": 20, "y": 344, scale: 0.8 }
                                    },
                                    "backgroundImage": "BET_"
                                }
                            },
                            "betsettings": {
                                "elementConstructor": "sprite",
                                "params": {
                                    "props": {
                                        "VL": { "x": 155, "y": 156, scale: 0.8 },
                                        "VP": { "x": 155, "y":156, scale: 0.8 }
                                    },
                                    "backgroundImage": "Bet setting"
                                }
                            },
                            "coinValueSlider": {
                                "elementConstructor": "Slider",
                                "params": {
                                    "name": "coinValueSlider",
                                    "manualCreation": true,
                                    "isVerticalSlider": false,
                                    "props": { x: 270, y: 270, scale: 0.7 },
                                    "dotImage": "coinDot",
                                    "BGImage": "coinBarBG",
                                    "FGImage": "coinBarFG",
                                    "valueFormatter": "getFormattedAmount",
                                    "eventToPublish": "sliderCoinValueUpdated",
                                    "startingValue": 0,
                                    "endValue": 1,
                                    "currentValue": .3,
                                    "toFixedValue": 1,          //Value After Decimal, give 0 for integers
                                    "text": {
                                        "props": { x: 241.5, y: -40, anchor: 0.5 },
                                        "textStyle": { fill: 0xFFFFFF, fontSize: 40, "fontFamily": "ProximaNova_Bold" }
                                    },
                                    
                                   
                                }
                            },
                            "lineValueSlider": {
                                "elementConstructor": "Slider",
                                "params": {
                                    "name": "lineValueSlider",
                                    "manualCreation": true,
                                    "isVerticalSlider": true,
                                    "props": { x: 120, y: 353, scale: { x: 0, y: 0 } },
                                    "dotImage": "coinDot",
                                    "BGImage": "coinBarBG",
                                    "FGImage": "coinBarFG",
                                    // "valueFormatter": "getFormattedAmount",
                                    "eventToPublish": "sliderLineValueUpdated",
                                    "startingValue": 0,
                                    "endValue": 1,
                                    "currentValue": .3,
                                    "toFixedValue": 0,          //Value After Decimal, give 0 for integers
                                    "text": {
                                        "props": { x: 0, y: -184, anchor: 0.5 },
                                        "textStyle": { fill: 0xFFFFFF, fontSize: 20, "fontFamily": "ProximaNova_Bold" }
                                    },
                                    "displayForMinValue": {
                                        "elementConstructor": "text",
                                        "params": {
                                            text: "-",
                                            textStyle: {
                                                fill: 0xFFFFFF,
                                                "fontSize": 40,
                                                "fontFamily": "ProximaNova_Bold"
                                            },
                                            props: { x: 0, y: 10, anchor: 0.5 }
                                        }
                                    },
                                    "displayForMaxValue": {
                                        "elementConstructor": "text",
                                        "params": {
                                            text: "+",
                                            textStyle: {
                                                fill: 0xFFFFFF,
                                                "fontSize": 40,
                                                "fontFamily": "ProximaNova_Bold"
                                            },
                                            props: { x: 0, y: -160, anchor: 0.5 }
                                        }
                                    },
                                    "title": {
                                        "text": "LINES",
                                        "props": { x: 0, y: -210, anchor: 0.5 },
                                        "textStyle": { fill: 0xFFFFFF, fontSize: 20, "fontFamily": "ProximaNova_Bold" }
                                    }

                                }
                            },

                            // "mobilePanelBetLine": {
                            //     "elementConstructor": "text",
                            //     "params": {
                            //         "text": "LINES",
                            //         "props": {
                            //             "VL": { "x": 135, "y": 200, "anchor": 0.5 },
                            //             "VP": { "x": 135, "y": 200, "anchor": 0.5 }
                            //         },
                            //         "textStyle": {
                            //             "fontStyle": "bold",
                            //             "fontSize": 34,
                            //             "fontFamily": "ProximaNova_Bold",
                            //             "lineJoin": "round",
                            //             "fill": "#FFFFFF"
                            //         }
                            //     }
                            // },

                            "mobilePanelBetLineValue": {
                                "elementConstructor": "text",
                                "params": {
                                    "text": "",
                                    "props": {
                                        "VL": { "x": 230, "y": 280, "anchor": 0.5,"scale":0 },
                                        "VP": { "x": 230, "y": 280, "anchor": 0.5,"scale":0  }
                                    },
                                    "textStyle": {
                                        "fontStyle": "bold",
                                        "fontSize": 34,
                                        "fontFamily": "ProximaNova_Bold",
                                        "lineJoin": "round",
                                        "fill": "#FFFFFF"
                                    }
                                }
                            },

                            "mobilePanelTotalBetValue": {
                                "elementConstructor": "text",
                                "params": {
                                    "text": "$12.32",
                                    "props": {
                                        "VL": { "x": 123, "y": 357.5, "anchor": {y:0.5} },
                                        "VP": { "x": 123, "y": 357.5, "anchor": {y:0.5} }
                                    },
                                    "textStyle": {
                                        "fontStyle": "bold",
                                        "fontSize": 34,
                                        "fontFamily": "ProximaNova_Bold",
                                        "lineJoin": "round",
                                        "fill": "#FFFFFF"
                                    }
                                }
                            },
                          
                            // "mobilePanelTotalBetTitle": {
                            //     "elementConstructor": "text",
                            //     "params": {
                            //         "text": "BET",
                            //         "props": {
                            //             "VL": { "x": 358, "y": 135, "anchor": 0.5 },
                            //             "VP": { "x": 358, "y": 135, "anchor": 0.5 }
                            //         },
                            //         "textStyle": {
                            //             "fontStyle": "bold",
                            //             "fontSize": 28,
                            //             "fontFamily": "ProximaNova_Bold",
                            //             "lineJoin": "round",
                            //             "fill": "#FFFFFF"
                            //         }
                            //     }
                            // }
                        }
                    }
                },
                "leftSideButtons": {
                    "elementConstructor": "ParentContainer",
                    "params": {
                        "makeResponsive": true,
                        "subscribeToResize": true,
                        "props": {
                            "HX": 60,
                            "HY": 680,
                            "VX": 40,
                            "VY": 1150,
                            "landScaleX": 0.8,
                            "landScaleY": 0.8,
                            "portScaleX": 0.9,
                            "portScaleY": 0.9,
                            "landAlignX": "LEFT",
                            "landAlignY": "BOTTOM",
                            "portAlignX": "LEFT",
                            "portAlignY": "BOTTOM",
                            "landAnchorX" : 0.5,
                            "landAnchorY" : 0.5,
                            "anchor": 0.5
                        },
                        "children": {
                            "settingsBtn": {
                                "elementConstructor": "button",
                                "params": {
                                    "props": {
                                        "VL": { "x": 0, "y": 0, scale: isHistoryMode ? 0 : 0.7, "anchor": 0.5, visible: !isHistoryMode },
                                        "VP": { "x": 0, "y": 0, scale: isHistoryMode ? 0 : 0.7, "anchor": 0.5, visible: !isHistoryMode }
                                    },
                                    "backgroundImage": "Setting",
                                    "hitArea": { "type": "circle", "params": { x: 0, y: -5 } }
                                }
                            },
                            "quickSpinBtnOn": {
                                "elementConstructor": "button",
                                "params": {
                                    "props": {
                                        "VL": { "x": 100, "y": 0, scale: isHistoryMode ? 0 : 0.7, "anchor": 0.5, visible: !isHistoryMode },
                                        "VP": { "x": 100, "y": 0, scale: isHistoryMode ? 0 : 0.7, "anchor": 0.5, visible: !isHistoryMode }
                                    },
                                    "backgroundImage": "QuickSP_OFF",
                                    "hitArea": { "type": "circle", "params": { x: 0, y: -5 } }
                                }
                            },    
                            "quickSpinBtnOff": {
                                "elementConstructor": "button",
                                "params": {
                                    "props": {
                                        "VL": { "x": 100, "y": 0, scale: isHistoryMode ? 0 : 0.7, "anchor": 0.5, visible: !isHistoryMode },
                                        "VP": { "x": 100, "y": 0, scale: isHistoryMode ? 0 : 0.7, "anchor": 0.5, visible: !isHistoryMode }
                                    },
                                    "backgroundImage": "turbo",
                                    "hitArea": { "type": "circle", "params": { x: 0, y: -5 } }
                                }
                            },             
                        }
                    }
                },
                "rightSideButtons": {
                    "elementConstructor": "ParentContainer",
                    "params": {
                        "makeResponsive": true,
                        "subscribeToResize": true,
                        "props": {
                            "HX": 1230,
                            "HY": 680,
                            "VX": 650,
                            "VY": 1150,
                            "landScaleX": 0.8,
                            "landScaleY": 0.8,
                            "portScaleX": 0.9,
                            "portScaleY": 0.9,
                            "landAlignX": "RIGHT",
                            "landAlignY": "BOTTOM",
                            "portAlignX": "RIGHT",
                            "portAlignY": "BOTTOM",
                            "landAnchorX" : 0.5,
                            "landAnchorY" : 0.5,
                            "anchor": 0.5
                        },
                        "children": {    
                            "paytableBtn": {
                                "elementConstructor": "button",
                                "params": {
                                    "props": {
                                        "VL": { "x": 0, "y": 0, scale: isHistoryMode ? 0 : 0.7, "anchor": 0.5, visible: !isHistoryMode },
                                        "VP": { "x": 0, "y": 0, scale: isHistoryMode ? 0 : 0.7, "anchor": 0.5, visible: !isHistoryMode }
                                    },
                                    "backgroundImage": "Help",
                                }
                            },                    
                        }
                    }
                },
            }
        }

    }
};
