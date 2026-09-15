
var _ng = _ng || {};

_ng.UIConfig = {
	"gameTitleBg": {
		"type": "Sprite",
		// "defaultAnimation": "logo",
		"Mobile": {
			additionIndex: 2,
			props: {
               "VL": {
                x: 414.5, y: -158, scale: {x:1,y:0.95}
                },
                "VP":{
                    x: 414.5, y: -158, scale: {x:1,y:0.95}
                }
				// "HX":560, "HY": 0, "VX": 450, "VY": 210,
				// "landScaleX": 0.7, "landScaleY": 0.7, "portScaleX": 0, "portScaleY":0,
				// "landAlignX": "LEFT", "landAlignY": "TOP", "portAlignX": "CENTER", "portAlignY": "TOP", "portAnchorX": 0.5,
			},
			image: ""
		},
		"Desktop": { additionIndex: 2, image: "", props: { x: 421.5, y: -149.5, scale: {x:1,y:1} } }
	},
    "gameTitle": {
		"type": "spine",
		"defaultAnimation": "animation",
		"Mobile": {
			additionIndex: 2,
			props: {
				 "HX":120, "HY": 120, "VX": 350, "VY": 85,
				 "landScaleX": 0.38, "landScaleY": 0.38, "portScaleX": 0.38, "portScaleY": 0.38,
				 "landAlignX": "CENTER", "landAlignY": "CENTER", "portAlignX": "CENTER", "portAlignY": "CENTER", 
			},
			image: "Logo"
		},
		"Desktop": { additionIndex: 2, image: "Logo", props: { x: 113, y: 110, scale:.4 } }
	},
	menuConfigOffset: {
		Desktop: {
			homeButton: {
				type: "Button",
				props: {
					img: "mHomeBtn",
					VD: { x: 40, y: 333, anchor: 0.5, scale: { x: 1, y: 1 } },
					"options": {
						hitArea: { type: "circle", params: { x: 0, y: 0, r: 20 } }
					}
				}
			},
			menuCloseBtn: {
				type: "Button",
				props: {
					img: "mCloseBtn",
					VD: { x: 34, y: 675, anchor: 0.5 },
					"options": {
						hitArea: { type: "circle", params: { x: 0, y: 0, r: 20 } }
					}
				}
			},
			menuOpenBtn: {
				type: "Button",
				props: {
					img: "mOpenBtn",
					VD: { x: 34, y: 675, anchor: 0.5 },
					"options": {
						hitArea: { type: "circle", params: { x: 0, y: 0, r: 0 } }
					}
				}
			},
			// providerLogo: {
			// 	type: "Sprite",
			// 	props: {
			// 		img: "providerLogo",
			// 		VD: { x: 1240, y: 667, anchor: 0.5 }
			// 	}
			// }
		},
		Mobile: {
			menuButton: {
				type: "Button",
				makeResponsive: true,
				props: {
					img: "mOpenBtn",
					HX: 1195, HY: 635,
					VX: 630, VY: 1180,
					landScaleX: 1.3, landScaleY: 1.3,
					portScaleX: 1.5, portScaleY: 1.5,
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
					img: "mOpenBtn",
					HX: 15, HY: 635,
					VX: 12, VY: 1178,
					landScaleX: 1.3, landScaleY: 1.3,
					portScaleX: 1.5, portScaleY: 1.5,
					landAlignX: "LEFT",
					landAlignY: "BOTTOM",
					portAlignX: "LEFT",
					portAlignY: "BOTTOM"
				}
			}
		}
	},

	volumeBarConfig: {
		Desktop: {
			volumeBar: {
				elementConstructor: "Slider",
				params: {
					name: "lineValueSlider",
					props: { x: 355, y: 205 },
					dotImage: "asSliderDot",
					BGImage: "sVolumeBarFg",
					FGImage: "sVolumeBarBg",
					isVerticalSlider: false,
					startingValue: 0,
					endValue: 0,
					currentValue: 0,
					toFixedValue: 1, //Value After Decimal, give 0 for integers
					doMultiplier: 100, //Value After Decimal, give 0 for integers
					text: {
						prefix: "",
						postfix: "",
						attachedToSlider: true,
						props: { x: 104, y: -40, anchor: { y: 0.5, x: 0.5 } },
						textStyle: { fill: 0x000000, fontSize: 1, fontFamily: "Montserrat-ExtraBold" }
					},

					displayForMinValue: {
						elementConstructor: "text",
						params: {
							props: { x: -35, y: 0, anchor: 0.5 },
							text: "",
							textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 16, fill: 0xffffff, padding: 10 }
						}
					},

					displayForMaxValue: {
						elementConstructor: "text",
						params: {
							props: { x: 250, y: 0, anchor: 0.5 },
							text: "",
							textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 16, fill: 0xffffff, padding: 10 }
						}
					},
					eventToPublish: "settingVolumeChange"
				}
			}
		},
		Mobile: {
			volumeBar: {
				elementConstructor: "Slider",
				params: {
					name: "lineValueSlider",
					props: { x: 355, y: 200 },
					dotImage: "asSliderDot",
					BGImage: "sVolumeBarFg",
					FGImage: "sVolumeBarBg",
					isVerticalSlider: false,
					startingValue: 0,
					endValue:0,
					currentValue: 0,
					toFixedValue: 1, //Value After Decimal, give 0 for integers
					doMultiplier: 100,
					text: {
						prefix: "",
						postfix: "",
						attachedToSlider: true,
						props: { x: 170, y: -40, anchor: { y: 0.5, x: 0.5 } },
						textStyle: { fill: 0xffffff, fontSize: 1, fontFamily: "Montserrat-ExtraBold" }
					},

					displayForMinValue: {
						elementConstructor: "text",
						params: {
							props: { x: -35, y: 0, anchor: 0.5 },
							text: "",
							textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 16, fill: 0xffffff, padding: 10 }
						}
					},

					displayForMaxValue: {
						elementConstructor: "text",
						params: {
							props: { x: 250, y: 0, anchor: 0.5 },
							text: "",
							textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 16, fill: 0xffffff, padding: 10 }
						}
					},
					eventToPublish: "settingVolumeChange"
				}
			}
		}
	},
	autoPlayWinLimitConfig: {
		Desktop: {
			winLimitBar: {
				elementConstructor: "Slider",
				params: {
					name: "lineValueSlider",
					manualCreation: true,
					props: { x: 60, y: 200 },
					dotImage: "asSliderDot",
					BGImage: "sVolumeBarFg",
					FGImage: "asVolumeBarFill",
					startingValue: 1,
					endValue: 200,
					currentValue: 1,
					toFixedValue: 0, //Value After Decimal, give 0 for integers
					text: {
						prefix: "x",
						props: { x: 102, y: -26, anchor: { y: 0.5, x: 0.5 } },
						textStyle: { fontSize: 20, fill: 0xffea00, fontWeight:550},
					},
					displayForMinValue: {
						elementConstructor: "text",
						params: {
							textStyle: { fontSize: 25, fill: 0xffea00, fontWeight:550},
							text: "1",
							props: { x: -23, anchor: { y: 0.5, x: 0.5 } }
						}
					},
					displayForMaxValue: {
						elementConstructor: "text",
						params: {
							textStyle: { fontSize: 25, fill: 0xffea00, fontWeight:550,fontFamily: "Helvetica"},
							text: "200",
							props: { x: 243, y: 0, anchor: 0.5 }
						}
					},
					eventToPublish: "winLimitChange"
				}
			}
		},
		Mobile: {
			winLimitBar: {
				elementConstructor: "Slider",
				params: {
					name: "lineValueSlider",
					manualCreation: true,
					props: { x: 60, y: 200 },
					dotImage: "asSliderDot",
					BGImage: "asVolumeBarBg",
					FGImage: "asVolumeBarFill",
					startingValue: 1,
					endValue: 200,
					currentValue: 1,
					toFixedValue: 0, //Value After Decimal, give 0 for integers
					text: {
						prefix: "x",

						props: { x: 104, y: -29, anchor: { y: 0.5, x: 0.5 } },
						textStyle: { fill: 0xffffff, fontSize: 18 }
					},
					displayForMinValue: {
						elementConstructor: "text",
						params: {
							textStyle: { fontSize: 20, fill: 0xffffff },
							text: "1",
							props: { x: -30, anchor: { y: 0.5, x: 0.5 } }
						}
					},
					displayForMaxValue: {
						elementConstructor: "text",
						params: {
							textStyle: { fontSize: 20, fill: 0xffffff },
							text: "200",
							props: { x: 250, y: 0, anchor: 0.5 }
						}
					},
					eventToPublish: "winLimitChange"
				}
			}
		}
	},
	autoPlayLossLimitConfig: {
		Desktop: {
			lossLimitBar: {
				elementConstructor: "Slider",
				params: {
					name: "lineValueSlider",
					manualCreation: true,
					props: { x: 60, y: 320 },
					dotImage: "asSliderDot",
					BGImage: "sVolumeBarFg",
					FGImage: "sVolumeBarBg",
					startingValue: 1,
					endValue: 200,
					currentValue: 1,
					toFixedValue: 0, //Value After Decimal, give 0 for integers
					text: {
						prefix: "x",

						props: { x: 103, y: -26, anchor: { y: 0.5, x: 0.5 } },
						// textStyle: { fill: 0xffffff, fontSize: 18 }
						textStyle: { fontSize: 20, fill: 0xffea00, fontWeight:550},
					},
					displayForMinValue: {
						elementConstructor: "text",
						params: {
							textStyle: { fontSize: 25, fill: 0xffea00, fontWeight:550},
							text: "1",
							props: { x: -23,y:-2, anchor: { y: 0.5, x: 0.5 } }
						}
					},
					displayForMaxValue: {
						elementConstructor: "text",
						params: {
							textStyle: { fontSize: 25, fill: 0xffea00, fontWeight:550},
							text: "200",
							props: { x: 243, y: 0, anchor: 0.5 }
						}
					},
					eventToPublish: "lossLimitChange"
				}
			}
		},
		Mobile: {
			lossLimitBar: {
				elementConstructor: "Slider",
				params: {
					name: "lineValueSlider",
					manualCreation: true,
					props: { x: 60, y: 320 },
					dotImage: "asSliderDot",
					BGImage: "asVolumeBarBg",
					FGImage: "asVolumeBarFill",
					startingValue: 1,
					endValue: 200,
					currentValue: 1,
					toFixedValue: 0, //Value After Decimal, give 0 for integers
					text: {
						prefix: "x",

						props: { x: 104, y: -31, anchor: { y: 0.5, x: 0.5 } },
						textStyle: { fill: 0xffffff, fontSize: 18 }
					},
					displayForMinValue: {
						elementConstructor: "text",
						params: {
							textStyle: { fontSize: 20, fill: 0xffffff },
							text: "1",
							props: { x: -30,y:-2, anchor: { y: 0.5, x: 0.5 } }
						}
					},
					displayForMaxValue: {
						elementConstructor: "text",
						params: {
							textStyle: { fontSize: 20, fill: 0xffffff },
							text: "200",
							props: { x: 250, y: 0, anchor: 0.5 }
						}
					},
					eventToPublish: "lossLimitChange"
				}
			}
		}
	},
    "settingsConfig": {
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
                            VD: { x: 0, y: 0, alpha: 0.25 },
                            layout: { w: 1280, h: 720, color: 0x000000 }
                        }
                    },
                    // settingsBgRect: {
                    //     type: "RoundRectangle",
                    //     props: {
                    //         VD: { x: 190, y: 65, alpha: 0.8 },
                    //         layout: { w: 900, h: 600, r: 6, color: 0x000000 }
                    //     }
                    // },
                    settingsBg1: {
                        type: "Sprite",
                        props: {
                            img: "SettingsBg",
                            VD: { x: 640, y: 360, anchor: 0.5, scale: 1.1,alpha:0.9 }
                        }
                    },
                    optionsTabBase: {
                        type: "RoundRectangle",
                        props: {
                            VD: { x: 278, y: 95, alpha: 0.1,scale:0 },
                            layout: { w: 448, h: 60, r: 6, color: 0xffffff }
                        }
                    },
                    autoSpinSettingsTabBase: {
                        type: "RoundRectangle",
                        props: {
                            VD: { x: 660, y: 95, alpha: 0, scale:{x:0,y:0}},
                            layout: { w: 448, h: 60, r: 6, color: 0xffffff }
                        }
                    },
                    settingsIcon: {
                        type: "Sprite",
                        props: {
                            img: "mSettingsBtn_normal",
                            VD: { x: 30, y: 33, alpha: 0 }
                        }
                    },
                    settingsTitle: {
                        type: "Text",
                        props: {
                            VD: { x: 100, y: 30, alpha: 0 },
                            text: "SETTINGS",
                            textStyle: {
                                fontFamily: "Montserrat-ExtraBold",
                                fontSize: 28,
                                fill: 0x000,
                                fontStyle: "bold",
                                padding: 10
                            }
                        }
                    },
                    SettingHeading: {
                        type: "Text",
                        props: {
                            VD: { x: 452, y: 124,scale:1.2, anchor: { x: 0, y: 0.5 } },
                            text: ["system_text"],
                            textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 33, fill:  0x0096FF, padding: 10 }
                        }
                    },
                    settingsCloseBtn: {
                        type: "Button",
                        props: {
                            // img: "btnBg",
                            img: "bet_close",
                            VD: { x: 1075, y: 107, anchor: 0.5, scale:0.8 }
                        }
                    },
                    resumeGameTitle: {
                        type: "Text",
                        props: {
                            VD: { x: 640, y: 625, anchor: 0.5 },
                            text: "",
                            textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 20, fill: 0xffc800 }
                        }//0x000000
                    },
                    optionsTab: {
                        type: "Sprite",
                        props: {
                            img: "Option_Normal",
                            VD: { x: 444, y: 125, scale:0, anchor: 0.5 },
                        }
                    },
                    // optionsTab: {
                    //     type: "Text",
                    //     props: {
                    //         VD: { x: 414, y: 125, anchor: 0.5 },
                    //         text: "Options",
                    //         textStyle: {
                    //             fontFamily: "Montserrat-ExtraBold",
                    //             fontSize: 28,
                    //             maxWidth: 240,
                    //             fill: 0xffffff,
                    //             fontStyle: "bold",
                    //             padding: 10
                    //         }
                    //     }
                    // },
                    // autoSpinSettingsTab: {
                    //     type: "Sprite",
                    //     props: {
                    //         img: "AutoSpin_Normal",
                    //         VD: { x: 828, y: 125, scale:0.8, anchor: 0.5 },
                    //     }
                    // },
                    // autoSpinSettingsTab: {
                    //     type: "Text",
                    //     props: {
                    //         VD: { x: 866, y: 125, anchor: 0.5 },
                    //         text: "Auto Spin",
                    //         textStyle: {
                    //             fontFamily: "Montserrat-ExtraBold",
                    //             fontSize: 28,
                    //             maxWidth: 440,
                    //             fill: 0xffffff,
                    //             fontStyle: "bold",
                    //             padding: 10
                    //         }
                    //     }
                    // },
                    audioContainer: {
                        type: "Container",
                        props: {
                            VD: { x: 300, y: 39 }
                        },
                        children: {
                            // volumeTextTitle: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VD: { x: 30, y: 180, anchor: { x: 0, y: 0.5 } },
                            // 		text: "Settings",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0x9a7f3f, padding: 10 }
                            // 	}
                            // },
                            // volumeText: {
                            //     type: "Text",
                            //     props: {
                            //         VD: { x: 30, y: 200,scale:1.2, anchor: { x: 0, y: 0.5 } },
                            //         text: "Volume",
                            //         textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
                            //     }
                            // },
                            // soundEffectsTextTitle: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VD: { x: 30, y: 240, anchor: { x: 0, y: 0.5 } },
                            // 		text: "Settings",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0x9a7f3f, padding: 10 }
                            // 	}
                            // },
                            soundEffectsText: {
                                type: "Text",
                                props: {
                                    VD: { x: 340, y: 410,scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    text: ["sound"],
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff, padding: 10 }
                                }
                            },
                            soundEffectSubText:{
                                type: "Text",
                                props: {
                                    VD: { x: 345, y: 440,scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    // text: "Turn on or off the Game Sound",
                                    text: ["sound1"],
                                    textStyle: { fontFamily: "ProximaNova_Bold", fontSize: 15, fill: 0x3a3a3a, padding: 10 }
                                }

                            },

                            // soundEffectsOnOffTxt: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VD: { x: 550, y: 260, anchor: { x: 1, y: 0.5 } },
                            // 		text: "Off",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, "align": "right", fill: 0xffffff, padding: 10 }
                            // 	}
                            // },

                            soundEffectOff: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 700, y: 410, scale:  0.8, anchor: 0.5, visible: false },
                                    img: "SwitchOff"
                                }
                            },
                            soundEffectOn: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 700, y: 410, scale:  0.8, anchor: 0.5 },
                                    img: "SwitchOn"
                                }
                            },

                            // ambienceSoundTextSutTitle: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VD: { x: 30, y: 300, anchor: { x: 0, y: 0.5 } },
                            // 		text: "Settings",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0xffffff, padding: 10 }
                            // 	}
                            // },
                            ambienceSoundText: {
                                type: "Text",
                                props: {
                                    VD: { x: 340, y: 350, scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    text: ["ambient"],
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff, padding: 10 }
                                }
                            },
                            ambienceSoundSubText: {
                                type: "Text",
                                props: {
                                    VD: { x: 345, y: 380, scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    // text: "Turn on or off the Game Music",
                                    text: ["ambient1"],
                                    textStyle: { fontFamily: "ProximaNova_Bold", fontSize: 15, fill: 0x3a3a3a, padding: 10 }
                                }
                            },
                            

                            // ambienceSoundOnOffTxt: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VD: { x: 550, y: 320, anchor: { x: 1, y: 0.5 } },
                            // 		text: "Off",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, "align": "right", fill: 0xffffff, padding: 10 }
                            // 	}
                            // },
                            ambienceSoundOff: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 700, y: 350, scale:  0.8, anchor: 0.5, visible: false },
                                    img: "SwitchOff"
                                }
                            },
                            ambienceSoundOn: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 700, y: 350, scale:  0.8, anchor: 0.5 },
                                    img: "SwitchOn"
                                }
                            },
                            // quickSpinTextSubTitle: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VD: { x: 30, y: 360, anchor: { x: 0, y: 0.5 } },
                            // 		text: "Settings",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0xffffff, padding: 10 }
                            // 	}
                            // },
                            quickSpinText: {
                                type: "Text",
                                props: {
                                    VD: { x: 340, y: 180, scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    text: ["quickspin"],
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
                                }
                            },
                            quickSpinSubText: {
                                type: "Text",
                                props: {
                                    VD: { x: 345, y: 210, scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    // text: "Play by reducing Total Spin time",
                                    text: ["quickspintxt1"],
                                    textStyle: { fontFamily: "ProximaNova_Bold", fontSize: 15, fill: 0x3a3a3a }
                                }
                            },

                            skipBigwinText: {
                                type: "Text",
                                props: {
                                    VD: { x: 340, y: 263, scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    text: ["battery"],
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
                                }
                            },
                            skipBigwinSubText: {
                                type: "Text",
                                props: {
                                    VD: { x: 345, y: 295, scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    // text: "Save Battery life by reducing Animation \n Speed",
                                    text: ["battery1"],
                                    textStyle: { fontFamily: "ProximaNova_Bold", fontSize: 15, fill: 0x3a3a3a }
                                }
                            },

                            // quickSpinOnOffTxt: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VD: { x: 550, y: 380, anchor: { x: 1, y: 0.5 } },
                            // 		text: "Off",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, "align": "right", fill: 0xffffff, padding: 10 }
                            // 	}
                            // },

                            quickSpinOff: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 700, y: 180, scale:  0.8, anchor: 0.5 },
                                    img: "SwitchOff"
                                }
                            },
                            quickSpinOn: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 700, y: 180, scale:  0.8, anchor: 0.5, visible: false },
                                    img: "SwitchOn"
                                }
                            },

                            skipBigwinOff: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 700, y: 263, scale:  0.8, anchor: 0.5 },
                                    img: "SwitchOff"
                                }
                            },
                            skipBigwinOn: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 700, y: 263, scale:  0.8, anchor: 0.5, visible: false },
                                    img: "SwitchOn"
                                }
                            },


                            // pressSpaceTextSubTitle: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VD: { x: 30, y: 420, anchor: { x: 0, y: 0.5 } },
                            // 		text: "Settings",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0xffffff, padding: 10 }
                            // 	}
                            // },
                            // pressSpaceText: {
                            //     type: "Text",
                            //     props: {
                            //         VD: { x: 340, y: 477, scale:1.2, anchor: { x: 0, y: 0.5 } },
                            //         text: ["introscreen"],
                            //         textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
                            //     }
                            // },
                            // pressSpaceSubText: {
                            //     type: "Text",
                            //     props: {
                            //         VD: { x: 345, y: 509, scale:1.2, anchor: { x: 0, y: 0.5 } },
                            //         text: ["introscreen1"],
                            //         textStyle: { fontFamily: "ProximaNova_Bold", fontSize: 15, fill: 0x3a3a3a }
                            //     }
                            // },

                            // spaceClickOnOffTxt: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VD: { x: 550, y: 440, anchor: { x: 1, y: 0.5 } },
                            // 		text: "Off",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, "align": "right", fill: 0xffffff, padding: 10 }
                            // 	}
                            // },

                            // spaceClickOff: {
                            //     type: "Sprite",
                            //     props: {
                            //         VD: { x: 700, y: 477, scale:0.8, anchor: 0.5, visible: false },
                            //         img: "SwitchOff"
                            //     }
                            // },
                            // spaceClickOn: {
                            //     type: "Sprite",
                            //     props: {
                            //         VD: { x: 700, y: 477, scale: 0.8, anchor: 0.5 },
                            //         img: "SwitchOn"
                            //     }
                            // },

                            // historyTextSubTitle: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VD: { x: 30, y: 480, anchor: { x: 0, y: 0.5 } },
                            // 		text: "Settings",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0xffffff, padding: 10 }
                            // 	}
                            // },
                            historyTitle: {
                                type: "Text",
                                props: {
                                    VD: { x: -30, y: 258, scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    text: ["gamehist"],
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
                                }
                            },

                            historyButton: {
                                type: "Button",
                                props: {
                                    VD: { x: 163, y: 255, anchor: 0.5, scale: { x: 1, y: 1 } },
                                    // img: "btnBg",
                                    img: "HistoryBg",
                                    // options: {
                                    //     "hitArea": { "type": "polygon", "params": [-121 * 0.5, -52 * 0.5, 120 * 0.5, -51 * 0.5, 135 * 0.5, -45 * 0.5, 168 * 0.5, -2 * 0.5, 139 * 0.5, 36 * 0.5, 121 * 0.5, 46 * 0.5, -119 * 0.5, 47 * 0.5, -167 * 0.5, - 2 * 0.5,
                                    //         -167 * 0.5, -2 * 0.5, -140 * 0.5, -41 * 0.5,
                                    //         ] }},
                                    "options": {
                        hitArea: { type: "circle", params: { x: 0, y: 0, r: 10 } }
                    },
                                }

                            },
                            seeHistoryTitle: {
                                type: "Sprite",
                                props: {
                                    img: "Historybtn",
                                    VD: { x: 163, y: 255, scale:0.8, anchor: 0.5 },
                                }
                            },
                            lineTop: {
                                type: "Sprite",
                                props: {
                                    img: "Line",
                                    VD: { x: 80, y: 237, scale:0.8, anchor: 0.5 },
                                }
                            },
                            LineBottom: {
                                type: "Sprite",
                                props: {
                                    img: "Line",
                                    VD: { x: 80, y: 283, scale:0.8, anchor: 0.5 },
                                }
                            },
                            // seeHistoryTitle: {
                            //     type: "Text",
                            //     props: {
                            //         VD: { x: 560, y: 560, anchor: 0.5 },
                            //         text: "HISTORY",
                            //         textStyle: { fontFamily: "andadaBold", fontSize: 25, fill: 0xffc800 }
                            //     }
                            // },
                            totalBet: {
                                type: "Text",
                                props: {
                                    VD: { x: 75, y: 365, scale:1.2, anchor: { x: 0.5, y: 0.5 } },
                                    text: ["totalbet"],
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
                                }
                            },
                            totalBetBox: {
                                type: "Sprite",
                                props: {
                                    img: "betBox",
                                    VD: { x: 70, y: 409, anchor: 0.5, scale: { x: 1.23 } }
                                },
                        },
                            PlusBet: {
                                type: "Button",
                                props: {
                                    // img: "btnBg",
                                    img: "Add",
                                    VD: { x: 169, y: 410, anchor: 0.5, scale:0.25 }
                                }
                            },
                            MinusBet: {
                                type: "Button",
                                props: {
                                    // img: "btnBg",
                                    img: "minus",
                                    VD: { x: -30, y: 410, anchor: 0.5, scale:0.25 }
                                }
                            },

                        }
                    },
                    autoPlayContainer: {
                        type: "Container",
                        props: {
                            VD: { x: 300, y: 125 }
                        },
                        children: {
                            // onAnyWinTextTitle: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VD: { x: 30, y: 55, anchor: { x: 0, y: 0.5 } },
                            // 		text: "Auto Spin",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0xffffff, padding: 10 }
                            // 	}
                            // },
                            onAnyWinText: {
                                type: "Text",
                                props: {
                                    VD: { x: 30, y: 75, scale:1.2,anchor: { x: 0, y: 0.5 } },
                                    text: "Stop on any win",
                                    textStyle: {
                                        fontFamily: "Montserrat-ExtraBold",
                                        fontSize: 18,
                                        fill: 0xffffff,
                                        padding: 10
                                    }
                                }
                            },

                            // onAnyWinOnOffTxt: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VD: { x: 550, y: 75, anchor: { x: 1, y: 0.5 } },
                            // 		text: "Off",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, "align": "right", fill: 0xffffff, padding: 10 }
                            // 	}
                            // },
                            onAnyWinOff: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 600, y: 75, scale: 0.8, anchor: 0.5 },
                                    img: "sCheckOff"
                                }
                            },
                            onAnyWinOn: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 600, y: 75, scale: 0.8, anchor: 0.5, visible: false },
                                    img: "sCheckOn"
                                }
                            },

                            // autoSpinWinLimitTextTitle: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VD: { x: 30, y: 115, anchor: { x: 0, y: 0.5 } },
                            // 		text: "Auto Spin",
                            // 		textStyle: {
                            // 			fontFamily: "Montserrat-Regular",
                            // 			fontSize: 13,
                            // 			fill: 0xffffff,
                            // 			padding: 10
                            // 		}
                            // 	}
                            // },
                            autoSpinWinLimitText: {
                                type: "Text",
                                props: {
                                    VD: { x: 30, y: 135,scale:1.2, anchor: { y: 0.5 } },
                                    text: "Stop on single win limit",
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff, padding: 10 }
                                }
                            },

                            // asWinLimitOnOffTxt: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VD: { x: 550, y: 135, anchor: { x: 1, y: 0.5 } },
                            // 		text: "Off",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, "align": "right", fill: 0xffffff, padding: 10 }
                            // 	}
                            // },

                            autoSpinWinLimitOff: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 600, y: 135, scale: 0.8, anchor: 0.5 },
                                    img: "sCheckOff"
                                }
                            },
                            autoSpinWinLimitOn: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 600, y: 135, scale: 0.8, anchor: 0.5, visible: false },
                                    img: "sCheckOn"
                                }
                            },


                            // autoSpinLossLimitTextTitle: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VD: { x: 30, y: 235, anchor: { x: 0, y: 0.5 } },
                            // 		text: "Auto Spin",
                            // 		textStyle: {
                            // 			fontFamily: "Montserrat-Regular",
                            // 			fontSize: 13,
                            // 			fill: 0xffffff,
                            // 			padding: 10
                            // 		}
                            // 	}
                            // },
                            autoSpinLossLimitText: {
                                type: "Text",
                                props: {
                                    VD: { x: 30, y: 255,scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    text: "Stop on session loss limit",
                                    textStyle: {
                                        fontFamily: "Montserrat-ExtraBold",
                                        fontSize: 18,
                                        fill: 0xffffff,
                                        padding: 10
                                    }
                                }
                            },

                            // asLossLimitOnOffTxt: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VD: { x: 550, y: 255, anchor: { x: 1, y: 0.5 } },
                            // 		text: "Off",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, "align": "right", fill: 0xffffff, padding: 10 }
                            // 	}
                            // },


                            autoSpinLossLimitOff: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 600, y: 255, scale: 0.8, anchor: 0.5, visible: false },
                                    img: "sCheckOff"
                                }
                            },
                            autoSpinLossLimitOn: {
                                type: "Sprite",
                                props: {
                                    VD: { x: 600, y: 255, scale: 0.8, anchor: 0.5 },
                                    img: "sCheckOn"
                                }
                            },

                            inputWinLimitBg: {
                                type: "Sprite",
                                props: {
                                    img: "textField_text",
                                    VD: { x: 585, y: 200, anchor: 0.5, scale: { x: 1.23 } }
                                }
                            },
                            inputLossLimitBg: {
                                type: "Sprite",
                                props: {
                                    img: "textField_text",
                                    VD: { x: 585, y: 320, anchor: 0.5, scale: { x: 1.23 } }
                                }
                            },

                            inputWinLimitText: {
                                type: "Text",
                                props: {
                                    VD: { x: 585, y: 200, scale:1.2,anchor: 0.5 },
                                    text: "100",
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff, maxWidth: 105 }
                                }
                            },
                            inputLossLimitText: {
                                type: "Text",
                                props: {
                                    VD: { x: 585, y: 320, scale:1.2,anchor: 0.5 },
                                    text: "",
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff, maxWidth: 105 }
                                }
                            }
                        }
                    },
                    autoPlay: {
                        type: "Container",
                        props: {
                            VD: { x: 360, y: 500 }
                        },
                        children: {
                            autoPlayTitle: {
                                type: "Text",
                                props: {
                                    VD: { x: -35, y: -20 + 15, scale:1.2,anchor: { x: 0, y: 0.5 } },
                                    text: "Auto Play",
                                    textStyle: {
                                        fontFamily: "Montserrat-ExtraBold",
                                        fontSize: 20,
                                        fill: 0xffffff,
                                        maxWidth: 350,
                                        padding: 10
                                    }
                                }
                            },

                            autoPlayNumBg1: {
                                type: "Button",
                                props: {
                                    VD: { x: 0, y: 51.5, scale: { x:0.1, y: 0.1 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "autospin_selected"
                                }
                            },
                            autoPlayNumTxt1: {
                                type: "Text",
                                props: {
                                    VD: { x: 0, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    text: "10",
                                    textStyle: {
                                        fontFamily: "Montserrat-ExtraBold",
                                        fontSize: 20,
                                        fill: 0xffffff
                                    }
                                }
                            },
                            autoPlayNumBg2: {
                                type: "Button",
                                props: {
                                    VD: { x: 75, y: 51.5, scale: { x: 1.0, y: 1.0 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "autospin_selected"
                                }
                            },
                            autoPlayNumTxt2: {
                                type: "Text",
                                props: {
                                    VD: { x: 75, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    text: "20",
                                    textStyle: {
                                        fontFamily: "Montserrat-ExtraBold",
                                        fontSize: 20,
                                        fill: 0xffffff
                                    }
                                }
                            },
                            autoPlayNumBg3: {
                                type: "Button",
                                props: {
                                    VD: { x: 150, y: 51.5, scale: { x: 1.0, y: 1.0 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "autospin_selected"
                                }
                            },
                            autoPlayNumTxt3: {
                                type: "Text",
                                props: {
                                    VD: { x: 150, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    text: "30",
                                    textStyle: {
                                        fontFamily: "Montserrat-ExtraBold",
                                        fontSize: 20,
                                        fill: 0xffffff
                                    }
                                }
                            },
                            autoPlayNumBg4: {
                                type: "Button",
                                props: {
                                    VD: { x: 225, y: 51.5, scale: { x: 1.0, y: 1.0 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "autospin_selected"
                                }
                            },
                            autoPlayNumTxt4: {
                                type: "Text",
                                props: {
                                    VD: { x: 225, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    text: "50",
                                    textStyle: {
                                        fontFamily: "Montserrat-ExtraBold",
                                        fontSize: 20,
                                        fill: 0xffffff
                                    }
                                }
                            },
                            autoPlayNumBg5: {
                                type: "Button",
                                props: {
                                    VD: { x: 293.5, y: 51.5, scale: { x: 1.0, y: 1.0 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "autospin_selected"
                                }
                            },
                            autoPlayNumTxt5: {
                                type: "Text",
                                props: {
                                    VD: { x: 295, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    text: "100",
                                    textStyle: {
                                        fontFamily: "Montserrat-ExtraBold",
                                        fontSize: 20,
                                        fill: 0xffffff
                                    }
                                }
                            },

                            autoPlayButton: {
                                type: "Button",
                                props: {
                                    VD: { x: 530, y: 50, scale: { x: 1, y: 1 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "Start",
                                    options: {
                                        // textField: {
                                        //     props: { x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } },
                                        //     text: "START",
                                        //     textStyle: { fontSize: 25, fontFamily: "andadaBold", fill: 0xffc800, align: "center", maxWidth: 175, padding: 10 }
                                        // },
                                        "hitArea": { "type": "polygon", "params": [-121 * 0.5, -52 * 0.5, 120 * 0.5, -51 * 0.5, 135 * 0.5, -45 * 0.5, 168 * 0.5, -2 * 0.5, 139 * 0.5, 36 * 0.5, 121 * 0.5, 46 * 0.5, -119 * 0.5, 47 * 0.5, -167 * 0.5, - 2 * 0.5,
                                        -167 * 0.5, -2 * 0.5, -140 * 0.5, -41 * 0.5,
                                        ] }
                                    
                                    }
                                }
                            },

                        }
                    }
                }
            }
        },
        Mobile: {
            settingsMContainer: {
                type: "Container",
                props: {
                    VL: { x: 0, y: 0, visible: false },
                    VP: { x: 0, y: 0, visible: false }
                },
                children: {
                    settingsBg: {
                        type: "Rectangle",
                        props: {
                            VL: { x: 0, y: 0, alpha: 0.5 },
                            VP: { x: 0, y: 0, alpha: 0.5 },
                            layout: { w: 1280, h: 720, color: 0x000000 }
                        }
                    },
                    settingsBg1: {
                        type: "Sprite",
                        props: {
                            img: "SettingsBg",
                            // VL: { x: 640, y: 360, anchor: 0.5, scale: 1.1 },
                            // VP: { x: 360, y: 640, anchor: 0.5, scale: 1.1 }
                            VL: { x: 0, y: 0, scale: 0 },
                            // VL: { x: 0, y: 0 },
                            VP: { x: 0, y: 0, scale: 0 }
                        }
                    },
                    settingsBgRect: {
                    	type: "RoundRectangle",
                    	props: {
                    		VL: { x: 0, y: 0, alpha: 0.9 },
                    		VP: { x: 0, y: 0, alpha: 0.9 },
                    		layout: { w: 1435, h: 900, r: 6, color: 0x000000 }
                    	}
                    },



                    gameSettingsTitle: {
                        type: "Text",
                        props: {
                            VL: { x: 100, y: 30, alpha: 0 },
                            VP: { x: 100, y: 30, alpha: 0 },
                            text: "",
                            textStyle: {
                                fontFamily: "Montserrat-ExtraBold",
                                fontSize: 30,
                                fill: 0xffffff,
                                fontStyle: "bold",
                                padding: 10
                            }
                        }
                    },
                    SettingmHeading: {
                        type: "Text",
                        props: {
                            VL: { x: 100, y: 30, alpha: 0 },
                            VP: { x: 100, y: 30, alpha: 0 },
                            text: ["system_text"],
                            textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 33, fill:  0x0096FF, padding: 10 }
                        }
                    },
                    settingsCloseButton: {
                        type: "Button",
                        props: {
                            // img: "btnBg",
                            img: "bet_close",
                            VL: { x: 1352, y: 77, anchor: 0.5, scale: { x: 2, y: 2 } },
                            VP: { x: 1352, y: 77, anchor: 0.5, scale: { x:2, y: 2 } }
                        }
                    },
                    resumeGameTitle: {
                        type: "Text",
                        props: {
                            VL: { x: 530, y: 605, anchor: 0.5 },
                            VP: { x: 530, y: 605, anchor: 0.5 },
                            text: "",
                            textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 20, fill: 0xffc800 }
                        }
                    },

                    optionsTabBase: {
                        type: "RoundRectangle",
                        props: {
                            VL: { x: 285, y: 75, scale:0,alpha: 0.0 },
                            VP: { x: 285, y: 75, scale:0,alpha: 0.0 },
                            layout: { w: 448, h: 60, r: 6, color: 0xffffff }
                        }
                    },
                    autoSpinSettingsTabBase: {
                        type: "RoundRectangle",
                        props: {
                            VL: { x: 765, y: 75,scale:0, alpha: 0.1 },
                            VP: { x: 765, y: 75,scale:0, alpha: 0.1 },
                            layout: { w: 448, h: 60, r: 6, color: 0xffffff }
                        }
                    },
                    // settingsIcon: {
                    // 	type: "Sprite",
                    // 	props: {
                    // 		img: "Option_Normal",
                    // 		VL: { x: 30, y: 33, alpha: 0 },
                    // 		VP: { x: 30, y: 33, alpha: 0 }
                    // 	}
                    // },
                    // optionsTab: {
                    //     type: "Sprite",
                    //     props: {
                    //         img: "Option_Normal",
                    //         VL: { x: 478, y: 102, anchor: 0.5 },
                    //         VP: { x: 478, y: 102, anchor: 0.5 },
                    //     }
                    // },
                    // optionsTab: {
                    //     type: "Text",
                    //     props: {
                    //         VL: { x: 270, y: 102, anchor: 0.5 },
                    //         VP: { x: 270, y: 102, anchor: 0.5 },
                    //         text: "Options",
                    //         textStyle: {
                    //             fontFamily: "Montserrat-ExtraBold",
                    //             fontSize: 28,
                    //             maxWidth: 240,
                    //             fill: 0xffffff,
                    //             fontStyle: "bold",
                    //             padding: 10
                    //         }
                    //     }
                    // },
                    // autoSpinSettingsTab: {
                    //     type: "Sprite",
                    //     props: {
                    //         img: "AutoSpin_Normal",
                    //         VL: { x: 962, y: 102, anchor: 0.5 },
                    //                 VP: { x: 962, y: 102, anchor: 0.5 },
                    //     }
                    // },
                    // autoSpinSettingsTab: {
                    //     type: "Text",
                    //     props: {
                    //         VL: { x: 720, y: 102, anchor: 0.5 },
                    //         VP: { x: 720, y: 102, anchor: 0.5 },
                    //         text: "Auto Spin",
                    //         textStyle: {
                    //             fontFamily: "Montserrat-ExtraBold",
                    //             fontSize: 28,
                    //             maxWidth: 440,
                    //             fill: 0xffffff,
                    //             fontStyle: "bold",
                    //             padding: 10
                    //         }
                    //     }
                    // },
                    audioMContainer: {
                        type: "Container",
                        props: {
                            VL: { x: 180, y: -95, scale:1.6 },
                            VP: { x: 70, y: -165 , scale:1.9}
                        },
                        children: {
                            SettingmHeading: {
                                type: "Text",
                                props: {
                                    VL: { x: 193, y: 136,scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 193, y: 136,scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    text: ["system_text"],
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 26, fill: 0x0096FF, padding: 10 }
                                }
                            },
                            // volumeTextTitle: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VL: { x: 30, y: 180, anchor: { x: 0, y: 0.5 } },
                            // 		VP: { x: 30, y: 180, anchor: { x: 0, y: 0.5 } },
                            // 		text: "Settings",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0x9a7f3f, padding: 10 }
                            // 	}
                            // },
                            // volumeText: {
                            //     type: "Text",
                            //     props: {
                            //         VL: { x: 30, y: 200, scale:1.2, anchor: { x: 0, y: 0.5 } },
                            //         VP: { x: 30, y: 200, scale:1.2 , anchor: { x: 0, y: 0.5 } },
                            //         text: "Volume",
                            //         textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
                            //     }
                            // },
                            // soundEffectsTextTitle: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VL: { x: 30, y: 240, anchor: { x: 0, y: 0.5 } },
                            // 		VP: { x: 30, y: 240, anchor: { x: 0, y: 0.5 } },
                            // 		text: "Settings",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0x9a7f3f, padding: 10 }
                            // 	}
                            // },
                            soundEffectsText: {
                                type: "Text",
                                props: {
                                    VL: { x: 360, y: 225,scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 360, y: 225,scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    text: ["sound"],
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff, padding: 10 }
                                }
                            },
                            soundEffectSubText:{
                                type: "Text",
                                props: {
                                    VL: { x: 362, y: 252,scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 362, y: 252,scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    // text: "Turn on or off the Game Sound",
                                    text: ["sound1"],
                                    textStyle: { fontFamily: "ProximaNova_Bold", fontSize: 15, fill: 0x3a3a3a, padding: 10 }
                                }

                            },
                            soundEffectOff: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 646, y: 225, scale: 0.8, anchor: 0.5, visible: false },
                                    VP: { x: 646, y: 225, scale: 0.8, anchor: 0.5, visible: false },
                                    img: "SwitchOff"
                                }
                            },
                            soundEffectOn: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 646, y: 225, scale: 0.8, anchor: 0.5 },
                                    VP: { x: 646, y: 225, scale: 0.8, anchor: 0.5 },
                                    img: "SwitchOn"
                                }
                            },

                            // ambienceSoundTextSutTitle: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VL: { x: 30, y: 300, anchor: { x: 0, y: 0.5 } },
                            // 		VP: { x: 30, y: 300, anchor: { x: 0, y: 0.5 } },
                            // 		text: "Settings",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0x9a7f3f, padding: 10 }
                            // 	}
                            // },
                            ambienceSoundText: {
                                type: "Text",
                                props: {
                                    VL: { x: 360, y: 315,scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 360, y: 315,scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    text: ["ambient"],
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff, padding: 10 }
                                }
                            },
                            ambienceSoundSubText: {
                                type: "Text",
                                props: {
                                    VL: { x: 362, y: 342,scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 362, y: 342,scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    // text: "Turn on or off the Game Music",
                                    text: ["ambient1"],
                                    textStyle: { fontFamily: "ProximaNova_Bold", fontSize: 15, fill: 0x3a3a3a, padding: 10 }
                                }
                            },
                            ambienceSoundOff: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 646, y: 315, scale: 0.8, anchor: 0.5, visible: false },
                                    VP: { x: 646, y: 315, scale: 0.8, anchor: 0.5, visible: false },
                                    img: "SwitchOff"
                                }
                            },
                            ambienceSoundOn: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 646, y: 315, scale: 0.8, anchor: 0.5 },
                                    VP: { x: 646, y: 315, scale: 0.8, anchor: 0.5 },
                                    img: "SwitchOn"
                                }
                            },
                            // quickSpinTextSubTitle: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VL: { x: 30, y: 360, anchor: { x: 0, y: 0.5 } },
                            // 		VP: { x: 30, y: 360, anchor: { x: 0, y: 0.5 } },
                            // 		text: "",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0x9a7f3f, padding: 10 }
                            // 	}
                            // },
                            quickSpinText: {
                                type: "Text",
                                props: {
                                    VL: { x: 360, y: 400, scale:1.2,anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 360, y: 400, scale:1.2,anchor: { x: 0, y: 0.5 } },
                                    text: ["quickspin"],
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
                                }
                            },
                            quickSpinSubText: {
                                type: "Text",
                                props: {
                                    VL: { x: 362, y: 427, scale:1.2,anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 362, y: 427, scale:1.2,anchor: { x: 0, y: 0.5 } },
                                    // text: "Play by reducing Total Spin time",
                                    text: ["quickspintxt1"],
                                    textStyle: { fontFamily: "ProximaNova_Bold", fontSize: 15, fill: 0x3a3a3a }
                                }
                            },


                            quickSpinOff: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 646, y: 400, scale: 0.8, anchor: 0.5 },
                                    VP: { x: 646, y: 400, scale: 0.8, anchor: 0.5 },
                                    img: "SwitchOff"
                                }
                            },
                            quickSpinOn: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 646, y: 400, scale: 0.8, anchor: 0.5, visible: false },
                                    VP: { x: 646, y: 400, scale: 0.8, anchor: 0.5, visible: false },
                                    img: "SwitchOn"
                                }
                            },

                            skipBigwinText: {
                                type: "Text",
                                props: {
                                    VL: { x: 360, y: 475, scale:1.2,anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 360, y: 475, scale:1.2,anchor: { x: 0, y: 0.5 } },
                                    text: ["battery"],
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
                                }
                            },
                            skipBigwinSubText: {
                                type: "Text",
                                props: {
                                    VL: { x: 362, y: 510, scale:1.2,anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 362, y: 510, scale:1.2,anchor: { x: 0, y: 0.5 } },
                                    // text: "Save Battery life by reducing Animation \n Speed",
                                    text: ["battery1"],
                                    textStyle: { fontFamily: "ProximaNova_Bold", fontSize: 15, fill: 0x3a3a3a }
                                }
                            },

                            skipBigwinOff: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 646, y: 475, scale: 0.8, anchor: 0.5 },
                                    VP: { x: 646, y: 475, scale: 0.8, anchor: 0.5 },
                                    img: "SwitchOff"
                                }
                            },
                            skipBigwinOn: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 646, y: 475, scale: 0.8, anchor: 0.5, visible: false },
                                    VP: { x: 646, y: 475, scale: 0.8, anchor: 0.5, visible: false },
                                    img: "SwitchOn"
                                }
                            },


                            // pressSpaceTextSubTitle: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VL: { x: 30, y: 420, anchor: { x: 0, y: 0.5 } },
                            // 		VP: { x: 30, y: 420, anchor: { x: 0, y: 0.5 } },
                            // 		text: "Settings",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0x9a7f3f, padding: 10 }
                            // 	}
                            // },
                            // pressSpaceText: {
                            //     type: "Text",
                            //     props: {
                            //         VL: { x: 30, y: 440, anchor: { x: 0, y: 0.5 } },
                            //         VP: { x: 30, y: 440, anchor: { x: 0, y: 0.5 } },
                            //         text: "INTRO SCREEN",
                            //         textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
                            //     }
                            // },
                            // pressSpaceSubText: {
                            //     type: "Text",
                            //     props: {
                            //         VL: { x: 30, y: 440, anchor: { x: 0, y: 0.5 } },
                            //         VP: { x: 30, y: 440, anchor: { x: 0, y: 0.5 } },
                            //         text: "SHOW THE INTROSCREEN BEFORE STARTING THE \n GAME",
                            //         textStyle: { fontFamily: "ProximaNova_Bold", fontSize: 15, fill: 0x3a3a3a }
                            //     }
                            // },
                            // spaceClickOff: {
                            //     type: "Sprite",
                            //     props: {
                            //         VL: { x: 600, y: 440, scale: 1, anchor: 0.5, visible: false },
                            //         VP: { x: 600, y: 440, scale: 1, anchor: 0.5, visible: false },
                            //         img: "sCheckOff"
                            //     }
                            // },
                            // spaceClickOn: {
                            //     type: "Sprite",
                            //     props: {
                            //         VL: { x: 600, y: 440, scale: 1, anchor: 0.5 },
                            //         VP: { x: 600, y: 440, scale: 1, anchor: 0.5 },
                            //         img: "sCheckOn"
                            //     }
                            // },

                            // historyTextSubTitle: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VL: { x: 30, y: 480, anchor: { x: 0, y: 0.5 } },
                            // 		VP: { x: 30, y: 480, anchor: { x: 0, y: 0.5 } },
                            // 		text: "Settings",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0x9a7f3f, padding: 10 }
                            // 	}
                            // },
                            historyTitle: {
                                type: "Text",
                                props: {
                                    VL: { x: 30, y: 280,scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 30, y: 280,scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    text: ["gamehist"],
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
                                }
                            },

                            historyButton: {
                                type: "Button",
                                props: {
                                    VL: { x: 30, y: 280, anchor: 0.5, scale: { x: 1, y: 1 } },
                                    VP: { x: 30, y: 280, anchor: 0.5, scale: { x: 1, y: 1 } },
                                    // img: "btnBg",
                                    img: "Historybtn",
                                },
                               
                            },
                            seeHistoryTitle: {
                                type: "Sprite",
                                props: {
                                    img: "Historybtn",
                                    VL: { x: 223, y: 275,scale:0.8, anchor: 0.5 },
                                    VP: { x: 223, y: 275,scale:0.8, anchor: 0.5 },
                                }
                            },
                            // seeHistoryTitle: {
                            //     type: "Text",
                            //     props: {
                            //         VL: { x: 560, y: 500, anchor: 0.5 },
                            //         VP: { x: 560, y: 500, anchor: 0.5 },
                            //         text: "HISTORY",
                            //         textStyle: { fontFamily: "andadaBold", fontSize: 25, fill: 0xffc800 }
                            //     },
                              
                            // }
                            lineTop: {
                                type: "Sprite",
                                props: {
                                    img: "Line",
                                    VL: { x: 115, y: 235, scale: 0.8, anchor: 0.5 },
                                    VP: { x: 115, y: 235, scale: 0.8, anchor: 0.5 },
                                }
                            },
                            LineBottom: {
                                type: "Sprite",
                                props: {
                                    img: "Line",
                                    VL: { x: 115, y: 322, scale: 0.8, anchor: 0.5 },
                                    VP: { x: 115, y: 322, scale: 0.8, anchor: 0.5 },
                                }
                            },
                            // seeHistoryTitle: {
                            //     type: "Text",
                            //     props: {
                            //         VD: { x: 560, y: 560, anchor: 0.5 },
                            //         text: "HISTORY",
                            //         textStyle: { fontFamily: "andadaBold", fontSize: 25, fill: 0xffc800 }
                            //     }
                            // },
                            totalBet: {
                                type: "Text",
                                props: {
                                    VL: { x: 102, y: 376, scale: 0.8, anchor: 0.5 },
                                    VP: { x: 102, y: 376, scale: 0.8, anchor: 0.5 },
                                    text: ["totalbet"],
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 25, fill: 0xffffff }
                                }
                            },
                            totalBetBox: {
                                type: "Sprite",
                                props: {
                                    img: "betBox",
                                    VL: { x: 103, y: 421, scale: 0.8, anchor: 0.5 },
                                    VP: { x: 103, y: 421, scale: 0.8, anchor: 0.5 },
                                },
                        },
                            PlusBet: {
                                type: "Button",
                                props: {
                                    // img: "btnBg",
                                    img: "Add",
                                    VL: { x: 178, y: 421, scale: 0.25, anchor: 0.5 },
                                    VP: { x: 178, y: 421, scale: 0.25, anchor: 0.5 },
                                }
                            },
                            MinusBet: {
                                type: "Button",
                                props: {
                                    // img: "btnBg",
                                    img: "minus",
                                    VL: { x: 25, y: 421, scale: 0.25, anchor: 0.5 },
                                    VP: { x: 25, y: 421, scale: 0.25, anchor: 0.5 },
                                }
                            },
                        }
                    },
                    autoPlayMContainer: {
                        type: "Container",
                        props: {
                            VL: { x: 180, y: 75,scale:1.6, },
                            VP: { x: 180, y: 75,scale:1.6, }
                        },
                        children: {
                            // onAnyWinTextTitle: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VL: { x: 30, y: 55, anchor: { x: 0, y: 0.5 } },
                            // 		VP: { x: 30, y: 55, anchor: { x: 0, y: 0.5 } },
                            // 		text: "Auto Spin",
                            // 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0x9a7f3f, padding: 10 }
                            // 	}
                            // },
                            onAnyWinText: {
                                type: "Text",
                                props: {
                                    VL: { x: 30, y: 75, scale:1.2,anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 30, y: 75,scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    text: "Stop on any win",
                                    textStyle: {
                                        fontFamily: "Montserrat-ExtraBold",
                                        fontSize: 18,
                                        fill: 0xffffff,
                                        padding: 10
                                    }
                                }
                            },
                            onAnyWinOff: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 600, y: 75, scale: 0.8, anchor: 0.5 },
                                    VP: { x: 600, y: 75, scale: 0.8, anchor: 0.5 },
                                    img: "sCheckOff"
                                }
                            },
                            onAnyWinOn: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 600, y: 75, scale: 0.8, anchor: 0.5, visible: false },
                                    VP: { x: 600, y: 75, scale: 0.8, anchor: 0.5, visible: false },
                                    img: "sCheckOn"
                                }
                            },

                            // autoSpinWinLimitTextTitle: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VL: { x: 30, y: 115, anchor: { x: 0, y: 0.5 } },
                            // 		VP: { x: 30, y: 115, anchor: { x: 0, y: 0.5 } },
                            // 		text: "Auto Spin",
                            // 		textStyle: {
                            // 			fontFamily: "Montserrat-Regular",
                            // 			fontSize: 13,
                            // 			fill: 0x9a7f3f,
                            // 			padding: 10
                            // 		}
                            // 	}
                            // },
                            autoSpinWinLimitText: {
                                type: "Text",
                                props: {
                                    VL: { x: 30, y: 135, scale:1.2,anchor: { y: 0.5 } },
                                    VP: { x: 30, y: 135, scale:1.2,anchor: { y: 0.5 } },
                                    text: "Stop on single win limit",
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff, padding: 10 }
                                }
                            },

                            autoSpinWinLimitOff: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 600, y: 135, scale: 0.8, anchor: 0.5 },
                                    VP: { x: 600, y: 135, scale: 0.8, anchor: 0.5 },
                                    img: "sCheckOff"
                                }
                            },
                            autoSpinWinLimitOn: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 600, y: 135, scale: 0.8, anchor: 0.5, visible: false },
                                    VP: { x: 600, y: 135, scale: 0.8, anchor: 0.5, visible: false },
                                    img: "sCheckOn"
                                }
                            },


                            // autoSpinLossLimitTextTitle: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VL: { x: 30, y: 235, anchor: { x: 0, y: 0.5 } },
                            // 		VP: { x: 30, y: 235, anchor: { x: 0, y: 0.5 } },
                            // 		text: "Auto Spin",
                            // 		textStyle: {
                            // 			fontFamily: "Montserrat-Regular",
                            // 			fontSize: 13,
                            // 			fill: 0x9a7f3f,
                            // 			padding: 10
                            // 		}
                            // 	}
                            // },
                            autoSpinLossLimitText: {
                                type: "Text",
                                props: {
                                    VL: { x: 30, y: 255, scale:1.2,anchor: { x: 0, y: 0.5 } },
                                    VP: { x: 30, y: 255,scale:1.2, anchor: { x: 0, y: 0.5 } },
                                    text: "Stop on session loss limit",
                                    textStyle: {
                                        fontFamily: "Montserrat-ExtraBold",
                                        fontSize: 18,
                                        fill: 0xffffff,
                                        padding: 10
                                    }
                                }
                            },
                            // asLossLimitOnOffTxt: {
                            // 	type: "Text",
                            // 	props: {
                            // 		VL: { x: 30, y: 235, anchor: 0.5 },
                            // 		VP: { x: 30, y: 235, anchor: 0.5 },
                            // 		text: "on",
                            // 		textStyle: {
                            // 			fontFamily: "Montserrat-Regular",
                            // 			fontSize: 13,
                            // 			fill: 0x9a7f3f,
                            // 			padding: 10
                            // 		}
                            // 	}
                            // },


                            autoSpinLossLimitOff: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 600, y: 255, scale: 0.8, anchor: 0.5, visible: false },
                                    VP: { x: 600, y: 255, scale: 0.8, anchor: 0.5, visible: false },
                                    img: "sCheckOff"
                                }
                            },
                            autoSpinLossLimitOn: {
                                type: "Sprite",
                                props: {
                                    VL: { x: 600, y: 255, scale: 0.8, anchor: 0.5 },
                                    VP: { x: 600, y: 255, scale: 0.8, anchor: 0.5 },
                                    img: "sCheckOn"
                                }
                            },

                            inputWinLimitBg: {
                                type: "Sprite",
                                props: {
                                    img: "textField_text",
                                    VL: { x: 575, y: 200, anchor: 0.5, scale: { x: 1 } },
                                    VP: { x: 575, y: 200, anchor: 0.5, scale: { x: 1 } }
                                }
                            },
                            inputLossLimitBg: {
                                type: "Sprite",
                                props: {
                                    img: "textField_text",
                                    VL: { x: 575, y: 320, anchor: 0.5, scale: { x: 1 } },
                                    VP: { x: 575, y: 320, anchor: 0.5, scale: { x: 1 } }
                                }
                            },

                            inputWinLimitText: {
                                type: "Text",
                                props: {
                                    VL: { x: 575, y: 200, scale:1.2,anchor: 0.5 },
                                    VP: { x: 575, y: 200, scale:1.2,anchor: 0.5 },
                                    text: "100",
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff, maxWidth: 105 }
                                }
                            },
                            inputLossLimitText: {
                                type: "Text",
                                props: {
                                    VL: { x: 575, y: 320, scale:1.2,anchor: 0.5 },
                                    VP: { x: 575, y: 320,scale:1.2, anchor: 0.5 },
                                    text: "",
                                    textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff, maxWidth: 105 }
                                }
                            }
                        }
                    },
                    autoMPlay: {
                        type: "Container",
                        props: {
                            VL: { x: 250, y: 669, scale:1.6 },
                            VP: { x: 250, y: 669, scale:1.6 }
                        },
                        children: {
                            autoPlayTitle: {
                                type: "Text",
                                props: {
                                    VL: { x: -35, y: -20 + 15, anchor: { x: 0, y: 0.5 } },
                                    VP: { x: -35, y: -20 + 15, anchor: { x: 0, y: 0.5 } },
                                    text: "Auto Play",
                                    textStyle: {
                                        fontFamily: "Montserrat-ExtraBold",
                                        fontSize: 20,
                                        fill: 0xffffff,
                                        maxWidth: 350,
                                        padding: 10
                                    }
                                }
                            },

                            autoPlayNumBg1: {
                                type: "Button",
                                props: {
                                    VL: { x: 0, y: 50, scale: { x: 1.0, y: 1.0 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 0, y: 50, scale: { x: 1.0, y: 1.0 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "autospin_selected"
                                }
                            },
                            autoPlayNumTxt1: {
                                type: "Text",
                                props: {
                                    VL: { x: 0, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 0, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    text: "10",
                                    textStyle: {
                                        fontFamily: "Montserrat-ExtraBold",
                                        fontSize: 20,
                                        fill: 0xffffff
                                    }
                                }
                            },
                            autoPlayNumBg2: {
                                type: "Button",
                                props: {
                                    VL: { x: 80, y: 50, scale: { x: 1.0, y: 1.0 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 80, y: 50, scale: { x: 1.0, y: 1.0 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "autospin_selected"
                                }
                            },
                            autoPlayNumTxt2: {
                                type: "Text",
                                props: {
                                    VL: { x: 80, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 80, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    text: "20",
                                    textStyle: {
                                        fontFamily: "Montserrat-ExtraBold",
                                        fontSize: 20,
                                        fill: 0xffffff
                                    }
                                }
                            },
                            autoPlayNumBg3: {
                                type: "Button",
                                props: {
                                    VL: { x: 155, y: 50, scale: { x: 1.0, y: 1.0 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 155, y: 50, scale: { x: 1.0, y: 1.0 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "autospin_selected"
                                }
                            },
                            autoPlayNumTxt3: {
                                type: "Text",
                                props: {
                                    VL: { x: 155, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 155, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    text: "30",
                                    textStyle: {
                                        fontFamily: "Montserrat-ExtraBold",
                                        fontSize: 20,
                                        fill: 0xffffff
                                    }
                                }
                            },
                            autoPlayNumBg4: {
                                type: "Button",
                                props: {
                                    VL: { x: 230, y: 50, scale: { x: 1.0, y: 1.0 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 230, y: 50, scale: { x: 1.0, y: 1.0 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "autospin_selected"
                                }
                            },
                            autoPlayNumTxt4: {
                                type: "Text",
                                props: {
                                    VL: { x: 230, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 230, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    text: "50",
                                    textStyle: {
                                        fontFamily: "Montserrat-ExtraBold",
                                        fontSize: 20,
                                        fill: 0xffffff
                                    }
                                }
                            },
                            autoPlayNumBg5: {
                                type: "Button",
                                props: {
                                    VL: { x: 305, y: 50, scale: { x: 1.0, y: 1.0 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 305, y: 50, scale: { x: 1.0, y: 1.0 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "autospin_selected"
                                }
                            },
                            autoPlayNumTxt5: {
                                type: "Text",
                                props: {
                                    VL: { x: 305, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 305, y: 50, anchor: { x: 0.5, y: 0.5 } },
                                    text: "100",
                                    textStyle: {
                                        fontFamily: "Montserrat-ExtraBold",
                                        fontSize: 20,
                                        fill: 0xffffff
                                    }
                                }
                            },

                            autoPlayButton: {
                                type: "Button",
                                props: {
                                    VL: { x: 530, y: 50, scale: { x: 0.8, y: 0.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    VP: { x: 530, y: 50, scale: { x: 0.8, y: 0.8 }, anchor: { x: 0.5, y: 0.5 } },
                                    img: "Start",
                                    options: {
                                        // textField: {
                                        //     props: { x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } },
                                        //     text: "START",
                                        //     textStyle: { fontSize: 28, fontFamily: "andadaBold", fill: 0xffc800, align: "center", maxWidth: 175, padding: 10 }
                                        // }
                                    }
                                }
                            },

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
                            img: "close",
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
                                fontFamily: "Montserrat-ExtraBold",
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


	"bonusSymbols": {
		"100": { "symbol": "s" },
	},

	//TODO
	"showIntro": true,
    "gameIntroScreen": {
        //DESKTOP VIEW
        "Desktop": {

            "introImg1": {
                "elementConstructor": "sprite",
                "params": {
                    "props": { "x": 620, "y": 345, anchor: 0.5, scale: { x: 1.4, y: 1.4 }, alpha : 0.5 },
                    "backgroundImage": "Background",
                }
            },
            "Transperent_Layer": {
                "elementConstructor": "sprite",
                "params": {
                   "props": { "x": 1280, "y": 608, anchor: 1, scale: 0 },
                    "backgroundImage": "Transperent_Layer",
                }
            },
            
            "indicator1": {
                "elementConstructor": "sprite",
                "params": {
                   "props": { "x": 282, "y": 530, anchor: 0.5, scale: .8 },
                    "backgroundImage": "Fill_circle",
                }
            },
            "Indicator_on1": {
                "elementConstructor": "sprite",
                "params": {
                   "props": { "x": 282, "y": 530, anchor: 0.5, scale: 0 },
                    "backgroundImage": "Fill_circle",
                }
            },
            "Indicator_off1": {
                "elementConstructor": "sprite",
                "params": {
                   "props": { "x": 282, "y": 530, anchor: 0.5, scale: .8 },
                    "backgroundImage": "Base_circle",
                }
            },
            "indiButtonHitArea1": {
                "elementConstructor": "GraphicsRect",
                "params": {
                    w: 17, h: 15.5, color: 0xff0000,
                    props: { x: 265, y: 514, scale: 2.05, visible: true }
                }
            },
            "indicator2": {
                "elementConstructor": "sprite",
                "params": {
                   "props": { "x": 396, "y": 530, anchor: 0.5, scale:.8 },
                    "backgroundImage": "Fill_circle",
                }
            },
            "Indicator_on2": {
                "elementConstructor": "sprite",
                "params": {
                   "props": { "x": 396, "y": 530, anchor: 0.5, scale: 0 },
                    "backgroundImage": "Fill_circle",
                }
            },
            "Indicator_off2": {
                "elementConstructor": "sprite",
                "params": {
                   "props": { "x": 396, "y": 530, anchor: 0.5, scale: .8 },
                    "backgroundImage": "Base_circle",
                }
            },
            "indiButtonHitArea2": {
                "elementConstructor": "GraphicsRect",
                "params": {
                    w: 17, h: 15.5, color: 0xff2500,
                    props: { x: 377, y: 514, scale: 2.05, visible: true }
                }
            },
            "indicator3": {
                "elementConstructor": "sprite",
                "params": {
                   "props": { "x": 500, "y": 530, anchor: 0.5, scale: .8 },
                    "backgroundImage": "Fill_circle",
                }
            },
            "Indicator_on3": {
                "elementConstructor": "sprite",
                "params": {
                   "props": { "x": 500, "y": 530, anchor: 0.5, scale: 0 },
                    "backgroundImage": "Fill_circle",
                }
            },
            "Indicator_off3": {
                "elementConstructor": "sprite",
                "params": {
                   "props": { "x": 500, "y": 530, anchor: 0.5, scale: .8 },
                    "backgroundImage": "Base_circle",
                }
            },
            "indiButtonHitArea3": {
                "elementConstructor": "GraphicsRect",
                "params": {
                    w: 17, h: 15.5, color: 0xff3500,
                    props: { x: 483, y: 514, scale: 2.05, visible: true }
                }
            },
            "introGameLogo": {
                "elementConstructor": "sprite",
                "params": {
                   "props": { "x": 1012, "y": 175, anchor:1, scale: 0.7 },
                    "backgroundImage": "gamelogo",
                }
            },
                   "Avatar": {
                "elementConstructor": "sprite",
                "params": {
                   "props": { "x": 1220, "y": 700, anchor:1, scale: 0.65 },
                    "backgroundImage": "character",
                }
            },
           
         
  
        "screen_3": {
            "elementConstructor": "sprite",
            "params": {
               "props": { "x": 436, "y": 276, anchor: 0.5, scale : 0.65, visible: false },
                "backgroundImage": "screen_1",
            }
        },
        "Text_screen_3": {
            "elementConstructor": "sprite",
            "params": {
                "props": { "x": 180, "y": 595, anchor: { x: 0, y: 0.5  }, visible: true, scale: 0.6 },
                "backgroundImage": "text_3",
            }
        },

        "screen_2": {
            "elementConstructor": "sprite",
            "params": {
               "props": { "x": 436, "y": 276, anchor: 0.5, scale : 0.65, visible: false},
                "backgroundImage": "screen_1",
            }
        },
        // "mSym": {
        //     "elementConstructor": "sprite",
        //     "params": {
        //        "props": { "x": 165, "y": 494, anchor: 0.5, scale: 0.2 },
        //         "backgroundImage": "100x",
        //     }
        // },
        "Text_screen_2": {
            "elementConstructor": "sprite",
            "params": {
                "props": { "x": 180, "y":595, anchor: { x: 0, y: 0.5  }, visible: true, scale: 0.6 },
               "backgroundImage": "text_2",
            }
        },

        "screen_1": {
            "elementConstructor": "sprite",
            "params": {
               "props": { "x": 436, "y": 276, anchor: 0.5, scale : 0.65 },
                "backgroundImage": "screen_1",
            }
        }, 
        "Text_screen_1": {
            "elementConstructor": "sprite",
            "params": {
                "props": { "x": 180, "y": 595, anchor: { x: 0, y: 0.5  }, visible: true, scale: 0.6 },
                "backgroundImage": "text_1",
                }
            
        },

     
        //    "Transperent_Layer2": {
        //     "elementConstructor": "sprite",
        //     "params": {
        //        "props": { "x": 1280, "y": 694, anchor: 1, scale:{x:1,y:0.9} },
        //         "backgroundImage": "Transperent_Layer 2",
        //     }
        // },
        
            "radioButtonOff": {
                "elementConstructor": "sprite",
                "params": {
                    "props": { "x": 543, "y": 676, anchor: 0.5, visible: true ,scale:.8},
                    "backgroundImage": "Tick_box",
                }
            },
            "radioButtonOn": {
                "elementConstructor": "sprite",
                "params": {
                    "props": { "x": 543, "y": 675, anchor: 0.5, visible: true ,scale:.8},
                    "backgroundImage": "Tick",
                }
            },
            "bottomText": {
                "elementConstructor": "sprite",
                "params": {
                    "props": { "x": 575, "y": 675, anchor: { x: 0, y: 0.5  }, visible: true, scale: 0.8 },
                    "backgroundImage": "dontshow",
                }
            },
            "radioButtonHitArea": {
                "elementConstructor": "GraphicsRect",
                "params": {
                    w: 35, h: 27.5, color: 0xff0000,
                    props: { x: 519, y: 657, scale: 1.3, visible: true }
                }
            },
            "continueButton": {
                "elementConstructor": "button",
                "params": {
                    "props": { "x": 1008, "y": 578, anchor: 0.5, scale: 0.7 },
                    "backgroundImage": "Play",
                    // options: {
                    //     textField: {
                    //         // text: "CONTINUE",
                    //         props: { x: 0, y: -30, anchor: 0.5 },
                    //         textStyle: {
                    //             fontSize: 38,
                    //             fontFamily: "ProximaNova_Bold",
                    //             fill: 0x5d2202,
                    //             stroke: 0xFFFFFF,
                    //             strokeThickness: 6,
                    //             align: 'center',
                    //             maxWidth: 170
                    //         }
                    //     },
                    //     "hitArea": { "type": "polygon", "params": [-179 * 0.5, -69.049 * 0.5, 178 * 0.5, -72.49 * 0.5, 178 * 0.5, 63.95099999999999 * 0.5, -178 * 0.5, 69.951 * 0.5,] }, 
                    // }
                }
            },

        },
        //MOBILE VIEW
        "Mobile": {
            // "introBG": {
            //     "elementConstructor": "sprite",
            //     "params": {
            //         "subscribeToResize": true,
            //         "props": {
            //             "VL": { "x": 0, "y": 0, anchor: 0, scale: 0 },
            //             "VP": { "x": 0, "y": -90, anchor: 0, scale:0 }
            //         },
            //         "backgroundImage": "Intro_Logo",
            //     }
            // },
        
            "Transperent_Layer": {
                "elementConstructor": "sprite",
                "params": {
                    "subscribeToResize": true,
                   "props": {
                    "VL": { "x": 640, "y": 333, anchor: 0.5, scale:{x:0,y:0} },
                    "VP": { "x": 360, "y": 540, anchor: 0.5, scale:{x:0,y:0} }
                },
                    "backgroundImage": "Transperent_Layer",
                }
            },
            "indicator1": {
                "elementConstructor": "sprite",
                "params": {
                    "subscribeToResize": true,
                   "props": {
                    "VL": { "x": 276, "y": 500, anchor: 0, scale: 0 },
                    "VP": { "x": 294, "y": 787, anchor: 0, scale:0}
                },
                    "backgroundImage": "Fill_circle",
                }
            },
            
           
            "Indicator_on1": {
                "elementConstructor": "sprite",
                "params": {
                    "subscribeToResize": true,

                   "props": { 
                    "VL": { "x": 276, "y": 500, anchor: 0,scale:0.7 },
                    "VP": { "x": 294, "y": 787, anchor: 0, scale:0.7 }
                    },
                    "backgroundImage": "Fill_circle",
                }
            },
            "Indicator_off1": {
                "elementConstructor": "sprite",
                "params": {
                    "subscribeToResize": true,

                   "props": {  
                     "VL": { "x": 276, "y": 500, anchor: 0,scale:0.7 },
                   "VP": { "x": 294, "y": 787, anchor: 0, scale:0.7 } },
                    "backgroundImage": "Base_circle",
                }
            },
            "indiButtonHitArea1": {
                "elementConstructor": "GraphicsRect",
                "params": {
                    "subscribeToResize": true,

                    w: 30, h: 30, color: 0xff0000,
                    props: { 
                        "VL": { "x":276, "y": 500, anchor: 0, scale: 1,visible:true },
                        "VP": { "x": 294, "y": 789, anchor: 0, scale:1.3,visible:true }
                     }
                }
            },
            "indicator2": {
                "elementConstructor": "sprite",
                "params": {
                    "subscribeToResize": true,
                   "props": {
                    "VL": { "x": 276, "y": 500, anchor: 0, scale: 0 },
                    "VP": { "x": 354, "y": 787, anchor: 0, scale:0 }
                },
                    "backgroundImage": "Base_circle",
                }
            },
            "Indicator_on2": {
                "elementConstructor": "sprite",
                "params": {
                    "subscribeToResize": true,

                   "props": { 
                    "VL": { "x": 357, "y": 500, anchor: 0 , scale:.7},
                    "VP": { "x": 354, "y": 787, anchor: 0, scale:0.7 }
                    },
                    "backgroundImage": "Fill_circle",
                }
            },
            "Indicator_off2": {
                "elementConstructor": "sprite",
                "params": {
                    "subscribeToResize": true,

                   "props": { 
                    "VL": { "x": 357, "y": 500, anchor: 0, scale: 0.7 },
                    "VP": { "x": 354, "y": 787, anchor: 0, scale:0.7 }
                    },
                    "backgroundImage": "Base_circle",
                }
            },
            "indiButtonHitArea2": {
                "elementConstructor": "GraphicsRect",
                "params": {
                    "subscribeToResize": true,

                    w: 30, h: 30, color: 0xff0000,
                    props: { 
                        "VL": { "x": 357, "y": 500, anchor: 0, scale: 1,visible:true },
                        "VP": { "x": 354, "y": 789, anchor: 0, scale:1.3,visible:true }
                     }
                }
            },
            "indicator3": {
                "elementConstructor": "sprite",
                "params": {
                    "subscribeToResize": true,
                   "props": {
                    "VL": { "x": 438, "y": 500, anchor: 0, scale: 0 },
                    "VP": { "x": 416, "y": 787, anchor: 0, scale:0 }
                },
                    "backgroundImage": "Base_circle",
                }
            },
            "Indicator_on3": {
                "elementConstructor": "sprite",
                "params": {
                    "subscribeToResize": true,

                   "props": {
                    "VL": { "x": 438, "y": 500, anchor: 0, scale:.7},
                    "VP": { "x": 416, "y": 787, anchor: 0, scale:0.7 }
                    },
                    "backgroundImage": "Fill_circle",
                }
            },
            "Indicator_off3": {
                "elementConstructor": "sprite",
                "params": {
                    "subscribeToResize": true,

                   "props": { 
                    "VL": { "x": 438, "y": 500, anchor: 0,scale:0.7},
                    "VP": { "x": 416, "y": 787, anchor: 0, scale:0.7 }
                    },
                    "backgroundImage": "Base_circle",
                }
            },
            "indiButtonHitArea3": {
                "elementConstructor": "GraphicsRect",
                "params": {
                    "subscribeToResize": true,

                    w: 30, h: 30, color: 0xff0000,
                    props: {
                        "VL": { "x": 438, "y": 500, anchor: 0, scale: 1,visible:true },
                        "VP": { "x": 416, "y": 789, anchor: 0, scale:1.3,visible:true }
                     }
                }
            },
            "introGameLogo": {
                "elementConstructor": "sprite",
                "params": {
                    "subscribeToResize": true,
                   "props": {
                    "VL": { "x": 634, "y": -7.5, anchor: 0, scale: 0.8 },
                    "VP": { "x": 252.5, "y": -2, anchor: 0, scale:0.6 }
                },
                    "backgroundImage": "gamelogo",
                }
            },
               "Avatar": {
                "elementConstructor": "sprite",
                "params": {
                    "subscribeToResize": true,
                   "props": {
                    "VL": { "x": 1045, "y": 152, anchor: 0, scale: 0.55 },
                    "VP": { "x": 556, "y": 850, anchor: 0, scale:0.55 }
                },
                    "backgroundImage": "character",
                }
            },
            "screen_3": {
                "elementConstructor": "sprite",
                "params": {
                    "subscribeToResize": true,
                   "props": { 
                    "VL": { "x": 71, "y": 54, anchor: 0, scale: 0.6 ,visible:false},
                    "VP": { "x": 24, "y":331, anchor: 0, scale:0.6,visible:false }
                    },
                    "backgroundImage": "screen_1",
                }
            },
            "Text_screen_3": {
                "elementConstructor": "sprite",
                "params": {
                    "subscribeToResize": true,
                    "props": {
                        "VL": { "x": 399, "y": 592, anchor: 0.5, scale: 0.5 },
                        "VP": { "x": 371, "y": 885, anchor: 0.5, scale:0.6 }
                    },
                    "backgroundImage": "text_3",
                },
            },
            "screen_2": {
                "elementConstructor": "sprite",
                "params": {
                    "subscribeToResize": true,
                   "props": { 
                    "VL": { "x": 71, "y": 54, anchor: 0, scale: 0.6,visible:false },
                    "VP": { "x":24, "y": 331, anchor: 0, scale:0.6,visible:false  }
                    },
                    "backgroundImage": "screen_1",
                }
            },
            // "mSym": {
            //     "elementConstructor": "sprite",
            //     "params": {
            //         "subscribeToResize": true,
            //        "props": {
            //         "VL": { "x": 84, "y": 474, anchor: 0.5, scale: 0.2 },
            //         "VP": { "x": 360, "y": 732, anchor: {x: 1, y: 0.5}, scale:0.2 }
            //         },
            //         "backgroundImage": "100x",
            //     }
            // },
            "Text_screen_2": {
                "elementConstructor": "sprite",
                "params": {
                    "subscribeToResize": true,
                    "props": {
                        "VL": { "x": 399, "y": 592, anchor: { x: 0.5 , y: 0.5}, scale: 0.5 },
                        "VP": { "x": 371, "y": 885, anchor: { x: 0.5 , y: 0.5}, scale:0.6 }
                    },
                         "backgroundImage": "text_2",
                },
            },
            "screen_1": {
               "elementConstructor": "sprite",
               "params": {
                  "subscribeToResize": true,
                  "props": {
                   "VL": { "x": 71, "y": 54, anchor: 0, scale: 0.6},
                   "VP": { "x": 24, "y": 331, anchor: 0, scale:0.6 }
               },
                   "backgroundImage": "screen_1",
               }
           },
           "Text_screen_1": {
            "elementConstructor": "sprite",
            "params": {
                "subscribeToResize": true,
                "props": {
                    "VL": { "x": 399, "y": 592, anchor: 0.5, scale: 0.5 },
                    "VP": { "x": 371, "y": 885, anchor: 0.5, scale:0.6 }
                },
                  "backgroundImage": "text_1",
            },
        },
           "Transperent_Layer2": {
            "elementConstructor": "sprite",
            "params": {
               "subscribeToResize": true,
               "props": {
                   "VL": { "x": 640, "y": 668, anchor: 0.5 ,scale:{x:0,y:0}},
                   "VP": { "x": 280, "y": 930, anchor: 0.5,scale:0 },
               },
                "backgroundImage": "Transperent_Layer 2",
            }
        },
            "radioButtonOff": {
                "elementConstructor": "sprite",
                "params": {
                    "subscribeToResize": true,
                    "props": {
                        "VL": { "x": 930, "y": 668, anchor: 0.5,scale:0.6 },
                        "VP": { "x": 222, "y": 1100, anchor: 0.5,scale:0.6 },
                    },
                    "backgroundImage": "Tick_box",
                }
            },
            "radioButtonOn": {
                "elementConstructor": "sprite",
                "params": {
                    "subscribeToResize": true,
                    "props": {
                        "VL": { "x": 930, "y": 668, anchor: 0.5,scale:0.6  },
                        "VP": { "x": 222, "y": 1100, anchor: 0.5,scale:0.6},
                    },
                    "backgroundImage": "Tick",
                }
            },
            "bottomText": {
                "elementConstructor": "sprite",
                "params": {                   
                    "subscribeToResize": true,
                    "props": {
                        "VL": { x: 957, y: 668, anchor: {x: 0, y: 0.5},scale:0.6 },
                        "VP": { x: 251, y: 1100, anchor: {x: 0, y: 0.5},scale:0.6 },
                    },
                     "backgroundImage": "dontshow",
                }
            },
            "radioButtonHitArea": {
                "elementConstructor": "GraphicsRect",
                "params": {
                    w: 40, h: 38, color: 0xff0000,
                    "subscribeToResize": true,
                    "props": {
                        "VL": { x: 919, y: 655, anchor: 0.5,scale:0.7 },
                        "VP": { x: 208, y: 1085, anchor: 0.5,scale:0.7 },
                    },
                    
                }
            },
            "continueButton": {
                "elementConstructor": "button",
                "params": {
                    "subscribeToResize": true,
                    "props": {
                        "VL": { "x": 1037, "y": 508, anchor: 0.5, scale: .7 },
                        "VP": { "x": 366, "y": 998, anchor: 0.5, scale: .7 }
                    },
                    "backgroundImage": "Play",
                    // options: {
                    //     textField: {
                    //         // text: "CONTINUE",
                    //         props: { x: 0, y: -30, anchor: 0.5 },
                    //         textStyle: {
                    //             fontSize: 38,
                    //             fontFamily: "ProximaNova_Bold",
                    //             fill: 0x5d2202,
                    //             stroke: 0xFFFFFF,
                    //             strokeThickness: 6,
                    //             align: 'center',
                    //             maxWidth: 170
                    //         }
                    //     },
                    //     "hitArea": { "type": "polygon", "params": [-189.5 * 0.5, -79.5 * 0.5, 125.5 * 0.5, -97.5 * 0.5, 232.5 * 0.5, -37.5 * 0.5, 220.5 * 0.5, 6.5 * 0.5, 162.5 * 0.5, 39.5 * 0.5, 191.5 * 0.5, 79.5 * 0.5, 16.5 * 0.5, 107.5 * 0.5, -209.5 * 0.5, 95.5 * 0.5, -216.5 * 0.5, 15.5 * 0.5, -223.5 * 0.5, -45.5 * 0.5] },
                    // }
                }
            }
        }
    },
	/*
	Payline4
Payline5
Payline6
Payline7
Payline8
Payline9
Payline10
Payline1_2_3

*/
	
"paylinesConfig": {
	
},
// Symbol config mentioned is duplicate of _3x cases of all symbols
//All texture NEED to be as SAME name as SYMBOL or the tumble code won't work as the texture name becomes symbol name for variable reel
"reelSymbolConfig": {
	"a": { symbol: { texture: "a", scale:{x:.7,y:.7} }, },
	"b": { symbol: { texture: "b" , scale:{x:.7,y:.7}} },
	"c": { symbol: { texture: "c" , scale:{x:.7,y:.7}} },
	"d": { symbol: { texture: "d" , scale:{x:.7,y:.7}} },
	"e": { symbol: { texture: "e" , scale:{x:.7,y:.7}} },
	
    "f": { symbol: { texture: "f", scale:{x:.7,y:.7} } },
	"g": { symbol: { texture: "g" , scale:{x:.7,y:.7}} },
	"h": { symbol: { texture: "h" , scale:{x:.7,y:.7}} },
	"i": { symbol: { texture: "i" , scale:{x:.7,y:.7}} },
    "j": { symbol: { texture: "j" , scale:{x:.7,y:.7}} },
	
    "w": { symbol: { texture: "w" , scale:{x:.7,y:.7}} },
	"s": { symbol: { texture: "s" , scale:{x:.7,y:.7}} },
    "v": { symbol: { texture: "" , scale:{x:.7,y:.7}} },
   
    // "m": { symbol: { texture: "myst_black" , scale:{x:.7,y:.7}} },
	"x": { symbol: { texture: "S3" , scale:{x:.7,y:.7}} },
   
	// "X": { symbol: { texture: "" , scale:{x:1,y:1}} },
	// "z": {symbol: {  texture:"bonus", scale:{x:1,y:1}}},
	// "q": {symbol: {  texture:"i", scale:{x:1,y:1}}}

},
// "reelSymbolConfig_vert": {
// 	"a": { symbol: { texture: "a_vert", scale:{x:0.61,y:0.61} }, },
// 	"b": { symbol: { texture: "b_vert" , scale:{x:0.61,y:0.61}} },
// 	"c": { symbol: { texture: "c_vert" , scale:{x:0.61,y:0.61}} },
// 	"d": { symbol: { texture: "d_vert" , scale:{x:0.61,y:0.61}} },
// 	"e": { symbol: { texture: "e_vert" , scale:{x:0.61,y:0.61}} },
	
//     "f": { symbol: { texture: "f_vert", scale:{x:0.61,y:0.61} } },
// 	"g": { symbol: { texture: "g_vert" , scale:{x:0.61,y:0.61}} },
// 	"h": { symbol: { texture: "h_vert" , scale:{x:0.61,y:0.61}} },
// 	"i": { symbol: { texture: "i_vert" , scale:{x:0.61,y:0.61}} },
// 	"j": { symbol: { texture: "a_vert" , scale:{x:0.61,y:0.61}} },

//     "w": { symbol: { texture: "S1" , scale:{x:0.61,y:0.61}} },
// 	"s": { symbol: { texture: "S1" , scale:{x:0.61,y:0.61}} },
//     "v": { symbol: { texture: "" , scale:{x:0.61,y:0.61}} },
 
//     "m": { symbol: { texture: "myst_black_vert" , scale:{x:0.61,y:0.61}} },
// 	"x": { symbol: { texture: "S3" , scale:{x:0.61,y:0.61}} },
// 	// "X": { symbol: { texture: "" , scale:{x:1,y:1}} },
// 	// "z": {symbol: {  texture:"bonus", scale:{x:1,y:1}}},
// 	// "q": {symbol: {  texture:"i", scale:{x:1,y:1}}}

// },
"symbolAnimations": {        
        "a": [{ animationDuration: 1500, winSound: { name: "aSym" } , offset: { x: 0, y: 0 }}, {  "animationSpeed": "0.3", "type": "spine", "winAnimation" : "guitar", "spineName" : "guitar","props": {x:0, y:0,  "scale":{x:0.4,y:0.4}}}],        
        "b": [{ animationDuration: 1500, winSound: { name: "bSym" } ,offset: { x: 0, y: 0 } }, {  "animationSpeed": "0.3", "type": "spine", "winAnimation" : "boombox", "spineName" : "boombox","props": {x:0, y:0,  "scale":{x:0.4,y:0.4}}}],        
        "c": [{ animationDuration: 1500, winSound: { name: "cSym" }, offset: { x: 0, y: 0 }  }, {  "animationSpeed": "0.3", "type": "spine", "winAnimation" : "rblade", "spineName" : "rblade_spine","props": {x:0, y:0,  "scale":{x:0.4,y:0.4}}}],      
        "d": [{ animationDuration: 1500, winSound: { name: "dSym" }, offset: { x: 0, y: 0 } },   {  "animationSpeed": "0.3", "type": "spine", "winAnimation" : "Lavalamp", "spineName" : "lavalamp_animation","props": {x:0, y:0,  "scale":{x:0.4,y:0.4}}}],      
        "e": [{ animationDuration: 1500, winSound: { name: "eSym" }, offset: { x: 0, y: 9 }}, {  "animationSpeed": "0.3", "type": "spine", "winAnimation" : "mouth", "spineName" : "mouth_animation","props": {x:0, y:0,  "scale":{x:0.4,y:0.4}}}],        
        
        "f": [{ animationDuration: 1500, winSound: { name: "fSym" }, offset: { x:0, y: 0 } }, {  "animationSpeed": "0.3", "type": "spine", "winAnimation" : "Symbol_A", "spineName" : "Symbol_A","props": {x:0, y:0,  "scale":{x:0.66,y:0.66}}}],      
        "g": [{ animationDuration: 1500, winSound: { name: "gSym" }, offset: { x:0, y: 0 } },  {  "animationSpeed": "0.3", "type": "spine", "winAnimation" : "Symbol_10", "spineName" : "Symbol_K","props": {x:0, y:0,  "scale":{x:0.66,y:0.66}}}],        
        "h": [{ animationDuration: 1500, winSound: { name: "hSym" }, offset: { x:0, y: 0 }},   {  "animationSpeed": "0.3", "type": "spine", "winAnimation" : "Symbol_Q", "spineName" : "Symbol_Q","props": {x:0, y:0,  "scale":{x:0.66,y:0.66}}}],        
        "i": [{ animationDuration: 1500, winSound: { name: "iSym" } , offset: { x:0, y: 0 }},   {  "animationSpeed": "0.3", "type": "spine", "winAnimation" : "Symbol_J", "spineName" : "Symbol_J","props": {x:0, y:0,  "scale":{x:0.66,y:0.66}}}],        
        "j": [{ animationDuration: 1500, winSound: { name: "jSym" }, offset: { x:0, y: 0 } },   {  "animationSpeed": "0.3", "type": "spine", "winAnimation" : "Symbol_10", "spineName" : "Symbol_10","props": {x:0, y:0,  "scale":{x:0.66,y:0.66}}}],                
        
        "s": [{ animationDuration: 1500, winSound: { name: "sSym" }},{  "animationSpeed": "0.3", "type": "spine", "loop":true,"winAnimation" : "bonus", "spineName" : "bonus_cash_caravan","props": {x:0, y:0,  "scale":{x:.4,y:.4}}}],  ///added loop so that the animations play in loop while winning FG
        "w": [{ animationDuration: 1500, winSound: { name: "wSym" } , offset: { x: 0, y: -4 } }, {  "animationSpeed": "0.3", "type": "spine", "winAnimation" : "wild", "spineName" : "wild","props": {x:0, y:0,  "scale":{x:0.4,y:0.4}}}],    
        "v": [{ animationDuration: 1500, winSound: { name: "jSym" } },   {  "animationSpeed": "0.3", "type": "spine", "winAnimation" : "animation", "spineName" : "NormalAnim/J","props": {x:0, y:0,  "scale":{x:0,y:0}}}],   
        // "m": [{ animationDuration: 1500, winSound: { name: "sSym" }},{  "animationSpeed": "0.3", "type": "spine", "winAnimation" : "Symbol_animation_Transition", "spineName" : "NormalAnim/mystery_symbol_square","loop":"false","props": {x:0, y:0,  "scale":{x:0.66,y:0.66}}}],     
        // "w": [{ animationDuration: 1440, winSound: { name: "wSym" } }, { "prefix": "w_", "startIndex": "1", "endIndex": "24", "digit": "dual", "animationSpeed": "0.3", "loop": false, "type": "spriteAnimation","":""  }],
        },
"tickerConfig": {
"params": {
    HX: 650, HY: 650, landAlignY: "BOTTOM", landAlignX :"CENTER", landScaleX: 1.06, landScaleY: 1.06,
    VX: 370, VY: 1170, portAlignY: "BOTTOM", portScaleX: 1.06, portScaleY: 1.06,
},
"bg": "", //commonTickerbox
"msgText": {
    "textStyle": {
        // dropShadow: true,
        // dropShadowColor: "#ef0aff",
        fill: "#E7E3EE",
        fontFamily: "Arial",
        fontSize: 23,
        fontWeight: "bolder",
        stroke: "#000000",
        strokeThickness: 4
    },
    "textStyleNew": {
        // dropShadow: true,
        // dropShadowColor: "#ef0aff",
        fill: "#E7E3EE",
        fontFamily: "Arial",
        fontSize: 18,
        fontWeight: "bolder",
        stroke: "#000000",
        strokeThickness: 4
    },
    "props": {
        "VD": { "x": 675, "y": 665, anchor: { x: 0.5, y: 0.5 } },
    }
}
},

"bigWinView": {
    spineImage: "CC_win_popup.json",
    spineImageNice: "CC_win_popup.json",
    spineImageOMG: "CC_win_popup.json",
    spineImageSuper: "CC_win_popup.json",
    spineImageFant: "CC_win_popup.json",
    spineImageMax: "CC_win_popup.json",

    setSize: true,
    params: {
        desktopParams: { x: 650, y: 360, anchor: 0.5 },
        HX: 640, HY: 360,
        VX: 360, VY: 620,landScaleX: 1.2,landScaleY:1.2,
        portScaleX: 0.9, portScaleY: 0.9
    },
    nice: {
        // params: {anchor: {x: 0.5, y: 0.5}, x: 0, y: 0},
        In: "NICE_INTRO",
        Loop: "NICE_LOOP",
        Out: "NICE_OUTRO",
    },
    omg: {
        // params: {anchor: {x: 0.5, y: 0.5}, x: 0, y: 0},
        In: "OMG_INTRO",
        Loop: "OMG_LOOP",
        Out: "OMG_OUTRO"
    },
    super_win: {
        // params: {anchor: {x: 0.5, y: 0.5}, x: 0, y: 0},
        In: "SUPERWIN_INTRO",
        Loop: "SUPERWIN_LOOP",
        Out: "SUPERWIN_OUTRO"
    },
    fantastic_win: {
        // params: {anchor: {x: 0.5, y: 0.5}, x: 0, y: -20, scale: {x: 0.8, y: 0.8}},
        In: "FANTASTICWIN_INTRO",
        Loop: "FANTASTICWIN_LOOP",
        Out: "FANTASTICWIN_OUTRO"
    },
    max_win: {
        // params: {anchor: {x: 0.5, y: 0.5}, x: 0, y: 0},
       In: "MAXWIN_INTRO",
        Loop: "MAXWIN_LOOP",
        Out: "MAXWIN_OUTRO"
    },
    totalWinAmount: {
        params: { anchor: { x: 0.5, y: 0.5 }, x: 0, y: 122 },
        finalPositionY: 41,
        textStyle: {
            fill: "#ffffff",
            fontFamily: "CashJoyDyna",
            fontSize: 30,
            fontWeight: "bold"
        }
    }
},

	"infoPopupView": {
		"errorPopup": {
			params: {
				desktopParams: { x: 640, y: 340, anchor: 0.5 },
				HX: 640, HY: 340,
				VX: 386, VY: 480, portScaleX: 1.1, portScaleY: 1.1
			},
			background: {
				bgImage: "panelBgIn",
				props: { anchor: 0.5 }
			},
			
			descriptionText: {
				props: { x: -10, y: 45, anchor: 0.5 },
				text: "Freespins Awarded",
				"textStyle": {
					"dropShadow": true,
					"dropShadowDistance": 2,
					"fontFamily": "cinzel.black",
					"fill": "#febf00",
					"fontSize": 36,
					"textTransform": "capitalize",
					"maxWidth": 540,
					"fontWeight": "bold",
					"letterSpacing": 2,
					"align": "center",
					"strokeThickness": 1
				}
			},
			
			
			continueButton: {
				props: { x: 0, y: 128, anchor: 0.5,scale: 0.6},
				bgImage: "Cntinue"
			},
			// hanging1:{
			// 	props: { x: -307, y: 87.5, anchor: 0.5 },
			// 	bgImage: "hanging"
			// },
			// hanging2:{
			// 	props: { x: 290, y: 87.5, anchor: 0.5 },
			// 	bgImage: "hanging"
			// },
			fsValue: {
				props: { x: -195, y: -100, anchor: 0.5 },
				"textStyle": {
					"dropShadow": true,
					"dropShadowDistance": 2,
					"fill": "#ffec3e",
					"fontSize": 40,
					"fontWeight": "bolder",
					"strokeThickness": 1
				}
			},

			// "continueButton": {
			// 	props: { x: 0, y: 125, anchor: 0.5 },
			// 	bgImage: "fsContinueBtn",
			// 	// options: {
			// 	// 	textField: {
			// 	// 		text: "CONTINUE",
			// 	// 		props: { x: 0, y: 0, anchor: 0.5 },
			// 	// 		textStyle: {
			// 	// 		fontSize: 28,
			// 	// 			fontFamily: "RioOroBold",
			// 	// 			fontWeight: "bolder",
			// 	// 			"letterSpacing": 3,
			// 	// 			"stroke": "#3a1a10",
			// 	// 			"strokeThickness": 6,
			// 	// 			"dropShadow": true,
			// 	// 			"dropShadowDistance": 2,
			// 	// 			fill: [0xfef200, 0xfea900],
			// 	// 			align: 'center',
			// 	// 			maxWidth: 170
			// 	// 		}
			// 	// 	}
			// 	// }
			// }

		},
		"freeSpinPopup": {
			params: {
				desktopParams: { x: 640, y: 340, anchor: 0.5 , scale : 1},
				HX: 640, HY: 340,landScaleX: 1, landScaleY :1,
				VX: 360, VY: 560, portScaleX: .6, portScaleY: .6
			},
			background: {
                spineImg: "Congratulations Pop Up",
				props: {x: 15 ,y: 0 ,anchor: 0.5}
			},
			descriptionText: {
				props: { x: 0, y: -110, anchor: 0.5 },
				text: "CONGRATULATIONS!",
				"textStyle": {
					"fontFamily": "rioOroBold",
					"strokeThickness": 2,
					"stroke": "#fff",
					"dropShadow": true,
					"fill": "#e24b12",
					"letterSpacing": 5,
					"fontSize": 48,
					"align": "center"
				}
			},
			fsValue: {
                // props: {
                //     VD: { x: -3, y: 150, anchor: 0.5 },
                //     VL: { x: -3, y: 150, anchor: 0.5 },
                //     VP: { x: -3, y: 150, anchor: 0.5 }
                // },
                props: { x: -15, y: -45, anchor: 0.5 },
				"textStyle": {
                    fill: "#ffffff",
                    fontFamily: "CashJoyDyna",
                    fontSize: 60,
                    fontWeight: 900

				}
			},
			continueButton: {
				props: { x: -16, y: 180, anchor: 0.5 },
				bgImage: "fsContinueBtn"
			},
			continueText: {
				props: { x: -16, y: 180, anchor: 0.5 },
				text: "",
				"textStyle": {
					fontSize: 28,
					fontFamily: "rioOroBold",
					fontWeight: "bolder",
					"letterSpacing": 3,
					fill: [0xfef200, 0xfea900],
					align: 'center',
					maxWidth: 170
				}
			},
		},
		"freeSpinEndPopup": {
			params: {
				desktopParams: { x: 640, y: 340, anchor: 0.5,scale : 0.9},
				HX: 640, HY: 340,portScaleX: 0.6, portScaleY: 0.6,
				VX: 360, VY: 584, portScaleX: 1, portScaleY: 1},
			// background: {
			// 	bgImage: "panelBgIn",
			// 	props: { anchor: 0.5 }
			// },
			background: {
				spineImg: "Congratulations Pop Up",
				props: { anchor: 0.5,scale:{x:0.65,y:0.65} }
			},
			fsWinValue: {
                // props: {
                //     VD: { x: 0, y: 97.5, anchor: 0.5 },
                //     VL: { x: 0, y:  97.5, anchor: 0.5 },
                //     VP: { x: 0, y:  97.5, anchor: 0.5 }
                // },
                props: { x: -15, y: -45, anchor: 0.5 },
				"textStyle": {
                    fill: "#ffffff",
                    fontFamily: "Comic Sans MS",
                    fontSize: 50,
                    fontWeight: "bold"

				}
			},
            fsValue: {
                // props_en: {
                //     VD: { x: -131, y: 221, anchor: 0.5 },
                //     VL: { x: -131, y: 216, anchor: 0.5 },
                //     VP: { x: -130.5, y: 216, anchor: 0.5 }
                // },
                // props_tr:{
                //     VD: { x: -181, y: -67, anchor: 0.5 },
                //     VL: { x: -181, y: -67, anchor: 0.5 },
                //     VP: { x: -186, y: -197, anchor: 0.5 }
                // },
                props: { x: 3, y: -2, anchor: 0.5 },
				"textStyle": {
                    fill: "#ffffff",
                    fontFamily: "CashJoyDyna",
                    fontSize: 40,
                    fontWeight: "bold"

				}
			},
            fsValue_large: {
				// props: { x: -131, y:221, anchor: 0.5 },
                // props_tr:{x:-201,y:-68,anchor:0.5},
                props: { x: -15, y: -45, anchor: 0.5 },
				"textStyle": {
                    fill: "#ffffff",
                    fontFamily: "CashJoyDyna",
                    fontSize: 60,
                    fontWeight: "bold"

				}
			},
			continueButton: {
				props: { x: -22, y: 127, anchor: 0.5 },
				bgImage: "fsContinueBtn"
			},
			// continueText: {
			// 	props: { x: 0, y: 127, anchor: 0.5 },
			// 	text: "",
			// 	"textStyle": {
			// 		fontSize: 28,
			// 		fontFamily: "rioOroBold",
			// 		fontWeight: "bolder",
			// 		"letterSpacing": 3,
			// 		fill: [0xfef200, 0xfea900],
			// 		align: 'center',
			// 		maxWidth: 170
			// 	}
			// },
		},
		"realityCheckPopup": {
			params: {
				desktopParams: { x: 640, y: 320, anchor: 0.5 },
				HX: 640, HY: 320,
				VX: 360, VY: 560, portScaleX: 1, portScaleY: 1
			},
			background: {
				bgImage: "panelBgIn",
				props: { anchor: 0.5 }
			},
			fsTitle: {
				bgImage: "txt_Congratulations_YourWon",
				props: { x: 0, y: -60, anchor: 0.5 }
			},
			fsWinValue: {
				props: { x: 0, y: 60, anchor: 0.5 },
				"textStyle": {
					"type": "BitmapFont",
					// "font": "45px bitmapFont1-export",
					"fontName": "numbers-export",
					"fontSize": 45,
					"letterSpacing": -50
				}
			},

			"continueButton": {
				props: { x: 0, y: 124, anchor: 0.5 },
				bgImage: "Rectangle 8",
				options: {
					textField: {
						text: "CONTINUE",
						props: { x: 0, y: 0, anchor: 0.5 },
						textStyle: {
							fill: "#6F4000",
							fontSize: 25,
							fontFamily: "COPRGTB"
						}
					}
				}
			},

			"closeButton": {
				props: { x: 0, y: 124, anchor: 0.5 },
				bgImage: "Rectangle 8",
				options: {
					textField: {
						text: "CONTINUE",
						props: { x: 0, y: 0, anchor: 0.5 },
						textStyle: {
							fill: "#6F4000",
							fontSize: 25,
							fontFamily: "rioOroBold"
						}
					}
				}
			},


			continueText: {
				props: { x: 0, y: 127, anchor: 0.5 },
				text: "CONTINUE",
				"textStyle": {
					fontSize: 38,
					fontFamily: "rioOroBold",
					fill: 0x5d2202,
					stroke: 0xFFFFFF,
					strokeThickness: 6,
					align: 'center'
				}
			},
		},
		"superMeterPopup": {
			params: {
				desktopParams: { x: 640, y: 340, anchor: 0.5 },
				HX: 640, HY: 340,
				VX: 360, VY: 560, portScaleX: 1, portScaleY: 1
			},
			background: {
				bgImage: "smPopupBg",
				props: { anchor: 0.5 }
			},

			contentValue: {
				bgImage: "CollectSupermeterToCreditTxt",
				props: { x: 0, y: -60, anchor: 0.5 }
			},
			// contentValueTxt: {
			// 	props: { x: 0, y: 40, anchor: 0.5},
			// 	"textStyle": {
			// 		"type": "BitmapFont",
			// 		"font": "35px bitmapFont1-export",
			// "letterSpacing": -50
			// 	}
			// },

			"yesButton": {
				props: { x: -180, y: 0, anchor: 0.5 },
				bgImage: "yesBtn"
			},

			"noButton": {
				props: { x: 180, y: 0, anchor: 0.5 },
				bgImage: "noBtn"
			}

		},
        "buyPopup":{
        params: {
            desktopParams: { x: 640, y: 340, anchor: 0.5,scale: 0.67 },
            HX: 640, HY: 340,landScaleX: 0.67, landScaleY : 0.67,
            VX: 360, VY: 480, portScaleX: 0.67, portScaleY: 0.67
        },

        background: {
            bgImage: "Popup_blank",
            props: { anchor: 0.5 }
        },
        Popup_BoxInside: {
            bgImage: "Popup_Box Inside",
            props: { anchor: 0.5 }
        },
        popupHead: {
				props: { x: 0, y: -135, anchor: 0.5 , scale:1.2},
				// text: "Freespins Awarded",
				"textStyle": {
                    "align": "center",
					"fill": "#f82d37",
					"fontFamily": "CashJoyDyna",
					"fontSize": 80,
					"fontWeight": 900,
                    "lineHeight": 100,
					"maxWidth": 540,
				}
			},
        YesButton: {
            props: { x: 146.5, y: 145, anchor: 0.5,scale:1},
            bgImage: "Accept_Button"
			},
        NoButton: {
            props: { x: -170.5, y: 145, anchor: 0.5,scale:1},
            bgImage: "Reject_Button"
			},  
        popupText: {
				props: { x: 0, y: -10, anchor: 0.5 ,scale:1},
				"textStyle": {
                    "align": "center",
					"fill": "#ea8a00",
					"fontFamily": "CashJoyDyna",
					"fontSize": 60,
					"fontWeight": 900,
                    "lineHeight": 80,
					"maxWidth": 540,
				}
			},  
        }
     

	},

    realityCheck: {
        isRealiyCheck: false,
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
        contentTxt_tr: {
            props: { x: 0, y: -90, anchor: { x: 0.5, y: 0.5 } },
            text: "Geçmişten beri oyunumuzu beğeniyordunuz\n %A1% dakika, devam etmek ister misiniz?",
            textStyle: { fontFamily: "ProximaNova", fontSize: 50, fill: "#000000", align: "center", lineHeight: 90, maxWidth: 600 }
        },
        totalBetTxt: {
            props: { x: 0, y: 4, anchor: { x: 0.5, y: 0.5 } },
            text: "total_loss",
            textStyle: { fontFamily: "ProximaNova", fontSize: 40, fill: "#000000", align: "left", lineHeight: 90, maxWidth: 600, padding: 10 }
        },
        totalWinTxt: {
            props: { x: 0, y: 52, anchor: { x: 0.5, y: 0.5 } },
            text: "total_win",
            textStyle: { fontFamily: "ProximaNova", fontSize: 40, fill: "#000000", align: "left", lineHeight: 90, maxWidth: 600, padding: 10 }
        },

        closeBtn: {
            props: { x: -140, y: 125, anchor: { x: 0.5, y: 0.5 }, scale: { x: 0.8, y: 0.8 } },
            bgImage: "alertCancelBtn",
            options: {
                textField: {
                    props: { x: 0, y: 0, anchor: { x: 0.5, y: 0.5 } },
                    text: "close_txt",
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
                    text: "continue_txt",
                    textStyle: { fontSize: 30, fontFamily: "ProximaNova_Bold", fill: 0x000000, align: "center" }
                }
            }
        }
    },

	"intervals": { "eachLineWinDelay": 1500 },

	//SOUNDS ADDING...
	"sounds": {
		"filePath": "dist/slots/treasuresofegypt/sounds/",
		"fileName": "GameSounds.json",
		"bgMinVolume": 0.4,

		"sprite": {
			"intro": { name: "Cash_Caravan_BaseGame" },
			"bg": { name: "Cash_Caravan_BaseGame", volume: 0.8 },

			"spinStartBtn": { name: "spinStartBtn" },
			"spinStopBtn": { name: "Reel_Stop_btn" },
			"reelStart": { name: "SR_Start" },
			"reelSpinning": { name: "SR_Loop", volume: 0},
			"reelStop": { name: "SR_Stop",  volume: 0.6},
			"anticipation": { name: "Anticipation", volume: 1},


			/*********** Big Win Animation ************/
			"counterLoop": { name: "CounterLoop",  volume: 0.5 },
			"counterBigWinLoop": { name: "CounterLoop" },
			"counterMegaWinLoop": { name: "CounterLoop" },
			"counterSuperMegaWinLoop": { name: "CounterLoop" },
			"counterEnd": { name: "counterEnd" },

			"totalWin": { name: "Total_win" },
			"bigWin": { name: "Big_win" },
			"megaWin": { name: "Mega_win" },
			"superMegaWin": { name: "Super_mega_win" },
			"fiveOfKind": { name: "Option_selection_fx" },

			"bigWinDisappear": { name: "Win_Disappear" },
			"megaWinDisappear": { name: "Win_Disappear" },
			"superMegaWinDisappear": { name: "Win_Disappear" },


			/********************************************/
			"SingleStarExplosion": {name: "single_star_collection_explosion_effects"},//done
			"lvlBlast": {name: "blast_4_star_collection"},//done
			"footerBombBlast": {name: "footer_bomb_BlastSound"},//done
			"flam_Move": {name: "flam_Move"},//done
			"expWildEffect": {name: "expanding_wild_Effect"},//done
			"lvlUpBulletSnd": {name: "Level up bulletSound"},
			"lvlUp": {name: "Level up"},

			/********************************************/

			//button clicks
			"btnClick": { name: "commonBtn" },

			// Panel 
			"coinValueChange": { name: "commonBtn" },
			"maxbetBtnClick": { name: "commonBtn" },
			"autoSpinBtnClick": { name: "commonBtn" },
			"autoSpinSelClick": { name: "commonBtn" },

			// Menu
			"menuBtnClick": { name: "commonBtn" },// done
			"menuBtnCloseClick": { name: "commonBtn" },    // done        
			"paytableBtnClick": { name: "commonBtn" },// done
			"settingsBtnClick": { name: "commonBtn" },// done
			"gRulesBtnClick": { name: "commonBtn" },// done
			"fullScreenBtnClick": { name: "commonBtn" },// done
			"soundBtnClick": { name: "commonBtn" },// done

			// Settings window
			"sCloseBtnClick": { name: "commonBtn" },  // done
			"sSoundSelBtnClick": { name: "commonBtn" }, // done
			"sAmbienceBtnClick": { name: "commonBtn" }, // done
			"sQuickSpinBtnClick": { name: "commonBtn" }, // done
			"sAnyWinBtnClick": { name: "commonBtn" }, // done
			"sWinLimitBtnClick": { name: "commonBtn" }, // done
			"sWinLimitSelBtnClick": { name: "commonBtn" }, // done
			"sLossLimitBtnClick": { name: "commonBtn" }, // done
			"sLossLimitSelBtnClick": { name: "commonBtn" }, // done 

			// Paytable window            
			"pArrowBtnClick": { name: "commonBtn" },  // done
			"pCloseBtnClick": { name: "commonBtn" }, // done
			"pIndicatorBtnClick": { name: "commonBtn" }, // done

			/********************************************/


			//Popup Sounds            
			"showPopup": { name: "GAwarded_In" },//done
			"hidePopup": { name: "GAwarded_Out" },//done
			"errorPopup": { name: "errorpopup" },//done

			//freespin appear
			"bgFS": { name: "Cash_Caravan_FreeGame", loop:true,volume:0.7 },
			"fsAwardPopup": { name: "Congratulations_Loop" },
			"fsWinPopup": { name: "Congratulations_Loop" },
			"Entring_into_free_game":{name:"Entering_Into_Free_Game"},
			/********************************************/
			"aSym": { name: "Guitar" },
			"bSym": { name: "Boom_Box" },
			"cSym": { name: "Roller_Skates" },

			"dSym": { name: "Lava_Lamp" },
			"eSym": { name: "Mouth" },
			"fSym": { name: "LetterNums" },
			"gSym": { name: "LetterNums" },
			"hSym": {name:"LetterNums"},
			"iSym": {name:"LetterNums"},
			"jSym": {name:"LetterNums"},
			"kSym": {name:"LetterNums"},
			"wSym": { name: "Wild_Active" },
			"sSym": { name: "Bonus_Active" },
			"sSymLand": { name: "Bonus_Land" },

			//features settings            
			"symbolsFireEnergyShots": { name: "symbolsFireEnergyShots" },
			"progressBarFill1": { name: "progressBarFill1" },
			"progressBarFill2": { name: "progressBarFill2" },
			"progressBarFill3": { name: "progressBarFill3" },
			"progressBarFill4": { name: "progressBarFill4" },
			"progressBarFill5": { name: "progressBarFill5" },
			"stickyWildReelAppear": { name: "stickyWildReelAppear" },
			"goldenFrameOnReel": { name: "goldenFrameOnReel" },
			"goldenFrameOnReel2": { name: "goldenFrameOnReel2" },

			//new Sounds
            "BuyFeature": { name: "Btn_BuySpin" },
            "BuyAll": { name: "Btn_PopUp" },
            "Scatter_1": { name: "Bonus_Active" },
            "Scatter_2": { name: "Bonus_Active" },
            "Scatter_3": { name: "Bonus_Active" },
            "Scatter_4": { name: "Bonus_Active" },
            "FG1": { name: "Kunochi_free_Spin" },
            // "FG1": { name: "Shinobi_free_Screen"},
            "FG2": { name: "Shinobi_free_Screen" },
            "cross": { name: "free_Screen_cross" },
            "tick": { name: "free_Screen_tick" },
            "Myst_normal": { name: "Scene_Transition" , volume: 0.15},
            "Myst_trans": { name: "Scene_Transition", volume: 0.15 },
            "Transition": { name: "Scene_Transition" },

            //new Win Type
            "nice": { name: "Special_NiceOMG_In" },
            "omg": { name: "Special_NiceOMG_In" },
            "super_win": { name: "Special_Super_In" },
            "fantastic_win": { name: "Special_Fantastic_In" },
            "max_win": { name: "Special_MAXWin_In" },
		}
	},
};