var commonConfig = {
    "handleOperatorErrorCodes":true,
	"showOperatorErrors" : true,
	"serverIP": "",
	"serverURL": "/gameengine/casino/casino.php",
	
	"logsPath": "logs/",
	"lobbyURL": "../lobby",

	"preloaderFiles": ["preloader0.json"], // dg spriteAnimation added comment 
	"availableLanguages": ["en", "ch", "ko", "ru", "zh_tw", "zh_cn", "sv_se", "no", "pl", "pt_pt", "jp", "my", "th", "sr_la", "tr", "ro", "vi", "lv", "de", "es_es", "fr", "lt", "id", "it", "bg", "fi", "da", "ar", "cs_cz", "nl", "en_gb", "el_gr", "hu", "pt_br", "uk", "vn", "nl"],
	"languageWithNoSpace": ["jp"],
	"availableSiteCodes": ["XYZXYZ", "GMGMOOP"],

	"fontsToLoad": {
		"Montserrat-ExtraBold": "Montserrat-ExtraBold.ttf",
		"Montserrat-Regular": "Montserrat-Regular.ttf"
	},
	"revision": 20210121170360,
	"holdBigWinAnimation": true,
	"fixDesktopHomeButton": false,
	"fixDesktopSoundButton": false,
	"addGameNameInPaytable": false,
	"hideHomeButtonInDesktop": false,
	"isQuickSpin": "false",
	"isProviderLogo": "false",
	"hideGameOnPaytable": true,
	"hideGameOnPaytableFor": ["Desktop"],
	"hideFullScreenButton": false,		//For Desktop
	"noSwipeUp": true,
	"noRCPPopup": true,
	"addGameNameInSettingsPage": false,
	"isGameEndService": "false",
	// "isForceCurrency":"usd",

	"winAmountBgHeight": 35,
	"isServerTime": "false",
	"quickSpinType": "turbo", // "normal"
	"ukgc": "false",
	// "autoSpinNums": ["10", "50", "100", "500", "1000"], // non-ukgc
	// "autoSpinNums": ["10", "20", "30", "50", "100"], // ukgc
	"autoSpinNums": ["10","20","30","50","70","100","500","1000"],
	"winLimit": { min: 1, max: 200, selected: 2 },
	"lossLimit": { min: 1, max: 200, selected: 2 },
	"minCardRotationGamble": 1,
	"hideHistoryButtonForDemo": true,

	"insufficientBalancePopup": {
		// "deposit": {
		// 	"buttonText": "DEPOSIT"
		// },
		"continue": {
			"buttonText": "CONTINUE"
		}
	},

	"hideDeposit": false,

	"loadingScreenConfig": {
		"logoType": "sprite", // spriteAnimation // sprite // spineAnimation
		"spineName": "",
		// "soundFile": "games/common/dist/sounds/preloaderSnd.mp3",

		// "spriteAnimObj": { "prefix": "NG-Export2", "startIndex": "0", "endIndex": "130", "digit": "triple", "animationSpeed": "0.6", "type": "spriteAnimation" },
		"showBarOnFrame": 125,

		"logoBg1": {
			"img": "preloaderLogoBg"
		},

		"preLogo": {
			"img": "preloaderLogo",
			"VD": { x: 0, y: -50, anchor: 0.5, scale: 0.8 },
			"VL": { x: 0, y: -50, anchor: 0.5, scale: 0.8 },
			"VP": { x: 0, y: 0, anchor: 0.5, scale: 0.8 }
		},

		"barCtnr": {
			"barBg": "loadingBarBG",
			"barFill": "loadingBarFill",
			"VD": { x: -168, y: 60 },
			"VL": { x: -168, y: 60 },
			"VP": { x: -168, y: 60 }
		}
	},

	// volumeBarConfig1: {
	// 	Desktop: {
	// 		volumeBar: {
	// 			elementConstructor: "Slider",
	// 			params: {
	// 				name: "lineValueSlider",
	// 				// props: { x: 360, y: 216 },
	// 				props: { x: 360, y: 203 },
	// 				dotImage: "asSliderHandle",
	// 				BGImage: "sVolumeBarBg",
	// 				FGImage: "sVolumeBarFg",
	// 				startingValue: 0,
	// 				endValue: 1,
	// 				currentValue: 0.7,
	// 				toFixedValue: 1, //Value After Decimal, give 0 for integers
	// 				displayForMinValue: {
	// 					elementConstructor: "sprite",
	// 					params: {
	// 						image: "sAudioMin",
	// 						props: { x: -45, y: -10, scale: { x: 1.5, y: 1.5 } }
	// 					}
	// 				},
	// 				displayForMaxValue: {
	// 					elementConstructor: "sprite",
	// 					params: {
	// 						image: "sAudioMax",
	// 						// props: { x: 135, y: -10, scale: { x: 1.5, y: 1.5 } }
	// 						props: { x: 235, y: -10, scale: { x: 1.5, y: 1.5 } }
	// 					}
	// 				},
	// 				eventToPublish: "settingVolumeChange"
	// 			}
	// 		}
	// 	},
	// 	Mobile: {
	// 		volumeBar: {
	// 			elementConstructor: "Slider",
	// 			params: {
	// 				name: "lineValueSlider",
	// 				props: { x: 360, y: 203 },
	// 				dotImage: "asSliderHandle",
	// 				BGImage: "sVolumeBarBg",
	// 				FGImage: "sVolumeBarFg",
	// 				startingValue: 0,
	// 				endValue: 1,
	// 				currentValue: 0,
	// 				toFixedValue: 1, //Value After Decimal, give 0 for integers
	// 				displayForMinValue: {
	// 					elementConstructor: "sprite",
	// 					params: {
	// 						image: "sAudioMin",
	// 						props: { x: -45, y: -10, scale: { x: 1.5, y: 1.5 } }
	// 					}
	// 				},
	// 				displayForMaxValue: {
	// 					elementConstructor: "sprite",
	// 					params: {
	// 						image: "sAudioMax",
	// 						props: { x: 235, y: -10, scale: { x: 1.5, y: 1.5 } }
	// 					}
	// 				},
	// 				eventToPublish: "settingVolumeChange"
	// 			}
	// 		}
	// 	}
	// },
	volumeBarConfig: {
		Desktop: {
			volumeBar: {
				elementConstructor: "Slider",
				params: {
					name: "lineValueSlider",
					props: { x: 355, y: 205 },
					dotImage: "asSliderHandle",
					BGImage: "sVolumeBarBg",
					FGImage: "sVolumeBarFg",
					isVerticalSlider: false,
					startingValue: 0,
					endValue: 1,
					currentValue: 0.7,
					toFixedValue: 1, //Value After Decimal, give 0 for integers
					doMultiplier: 100, //Value After Decimal, give 0 for integers
					text: {
						prefix: "",
						postfix: "%",
						attachedToSlider: true,
						props: { x: 104, y: -32, anchor: { y: 0.5, x: 0.5 } },
						textStyle: { fill: 0xffffff, fontSize: 16 }
					},

					displayForMinValue: {
						elementConstructor: "text",
						params: {
							props: { x: -35, y: 0, anchor: 0.5 },
							text: "0%",
							textStyle: { fontFamily: "Montserrat-Regular", fontSize: 16, fill: 0xffffff, padding: 10 }
						}
					},

					displayForMaxValue: {
						elementConstructor: "text",
						params: {
							props: { x: 250, y: 0, anchor: 0.5 },
							text: "100%",
							textStyle: { fontFamily: "Montserrat-Regular", fontSize: 16, fill: 0xffffff, padding: 10 }
						}
					},
					// displayForMinValue: {
					// 	elementConstructor: "sprite",
					// 	params: {
					// 		image: "sAudioMin",
					// 		props: { x: -35, y: 0, anchor: 0.5, scale: 1 }
					// 	}
					// },
					// displayForMaxValue: {
					// 	elementConstructor: "sprite",
					// 	params: {
					// 		image: "sAudioMax",
					// 		props: { x: 235, y: 0, anchor:0.5, scale: 1 }
					// 	}
					// },
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
					dotImage: "asSliderHandle",
					BGImage: "sVolumeBarBg",
					FGImage: "sVolumeBarFg",
					isVerticalSlider: false,
					startingValue: 0,
					endValue: 1,
					currentValue: 0.7,
					toFixedValue: 1, //Value After Decimal, give 0 for integers
					doMultiplier: 100,
					text: {
						prefix: "",
						postfix: "%",
						attachedToSlider: true,
						props: { x: 104, y: -29, anchor: { y: 0.5, x: 0.5 } },
						textStyle: { fill: 0xffffff, fontSize: 16 }
					},

					displayForMinValue: {
						elementConstructor: "text",
						params: {
							props: { x: -35, y: 0, anchor: 0.5 },
							text: "0%",
							textStyle: { fontFamily: "Montserrat-Regular", fontSize: 16, fill: 0xffffff, padding: 10 }
						}
					},

					displayForMaxValue: {
						elementConstructor: "text",
						params: {
							props: { x: 250, y: 0, anchor: 0.5 },
							text: "100%",
							textStyle: { fontFamily: "Montserrat-Regular", fontSize: 16, fill: 0xffffff, padding: 10 }
						}
					},
					// displayForMinValue: {
					// 	elementConstructor: "sprite",
					// 	params: {
					// 		image: "sAudioMin",
					// 		props: { x: -45, y: -10, scale: 1 }
					// 	}
					// },
					// displayForMaxValue: {
					// 	elementConstructor: "sprite",
					// 	params: {
					// 		image: "sAudioMax",
					// 		props: { x: 135, y: -10, scale: 2.0 }
					// 	}
					// },
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
					dotImage: "asSliderHandle",
					BGImage: "asVolumeBarBg",
					FGImage: "asVolumeBarFill",
					startingValue: 1,
					endValue: 200,
					currentValue: 1,
					toFixedValue: 0, //Value After Decimal, give 0 for integers
					text: {
						prefix: "x",
						props: { x: 102, y: -26, anchor: { y: 0.5, x: 0.5 } },
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
		},
		Mobile: {
			winLimitBar: {
				elementConstructor: "Slider",
				params: {
					name: "lineValueSlider",
					manualCreation: true,
					props: { x: 60, y: 200 },
					dotImage: "asSliderHandle",
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
					dotImage: "asSliderHandle",
					BGImage: "asVolumeBarBg",
					FGImage: "asVolumeBarFill",
					startingValue: 1,
					endValue: 200,
					currentValue: 1,
					toFixedValue: 0, //Value After Decimal, give 0 for integers
					text: {
						prefix: "x",

						props: { x: 103, y: -26, anchor: { y: 0.5, x: 0.5 } },
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
					dotImage: "asSliderHandle",
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
							VD: { x: 0, y: 0, alpha: 0.5 },
							layout: { w: 1280, h: 720, color: 0x000000 }
						}
					},
					settingsBgRect: {
						type: "RoundRectangle",
						props: {
							VD: { x: 190, y: 65, alpha: 0.8 },
							layout: { w: 900, h: 600, r: 6, color: 0x000000 }
						}
					},
					settingsBg1: {
						type: "Sprite",
						props: {
							//img: "settingsBg",
							VD: { x: 640, y: 360, anchor: 0.5, scale: 1.1 }
						}
					},
					optionsTabBase: {
						type: "RoundRectangle",
						props: {
							VD: { x: 190, y: 95, alpha: 0.0 },
							layout: { w: 448, h: 60, r: 6, color: 0xffffff }
						}
					},
					autoSpinSettingsTabBase: {
						type: "RoundRectangle",
						props: {
							VD: { x: 642, y: 95, alpha: 0.1 },
							layout: { w: 448, h: 60, r: 6, color: 0xffffff }
						}
					},
					settingsIcon: {
						type: "Sprite",
						props: {
							//img: "mSettingsBtn_normal",
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
								fill: 0xffffff,
								fontStyle: "bold",
								padding: 10
							}
						}
					},
					settingsCloseBtn: {
						type: "Button",
						props: {
							img: "btnBg",
							//img: "see_history",
							VD: { x: 640, y: 625, anchor: 0.5, scale: 1.2 }
						}
					},
					resumeGameTitle: {
						type: "Text",
						props: {
							VD: { x: 585, y: 625, anchor: { x: 0, y: 0.5 } },
							//text: "RESUME GAME",
							textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14, fill: 0xffffff }
						}
					},
					optionsTab: {
						type: "Text",
						props: {
							VD: { x: 414, y: 125, anchor: 0.5 },
							text: "Options",
							textStyle: {
								fontFamily: "Montserrat-ExtraBold",
								fontSize: 28,
								maxWidth: 240,
								fill: 0xffffff,
								fontStyle: "bold",
								padding: 10
							}
						}
					},
					autoSpinSettingsTab: {
						type: "Text",
						props: {
							VD: { x: 866, y: 125, anchor: 0.5 },
							text: "Auto Spin",
							textStyle: {
								fontFamily: "Montserrat-ExtraBold",
								fontSize: 28,
								maxWidth: 440,
								fill: 0xffffff,
								fontStyle: "bold",
								padding: 10
							}
						}
					},
					audioContainer: {
						type: "Container",
						props: {
							VD: { x: 300, y: 0 }
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
							volumeText: {
								type: "Text",
								props: {
									VD: { x: 30, y: 200, anchor: { x: 0, y: 0.5 } },
									text: "Volume",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
								}
							},
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
									VD: { x: 30, y: 260, anchor: { x: 0, y: 0.5 } },
									text: "Sound Effects",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff, padding: 10 }
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
									VD: { x: 600, y: 260, scale: 1, anchor: 0.5, visible: false },
									img: "sCheckOff"
								}
							},
							soundEffectOn: {
								type: "Sprite",
								props: {
									VD: { x: 600, y: 260, scale: 1, anchor: 0.5 },
									img: "sCheckOn"
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
									VD: { x: 30, y: 320, anchor: { x: 0, y: 0.5 } },
									text: "Ambience Sound",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff, padding: 10 }
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
									VD: { x: 600, y: 320, scale: 1, anchor: 0.5, visible: false },
									img: "sCheckOff"
								}
							},
							ambienceSoundOn: {
								type: "Sprite",
								props: {
									VD: { x: 600, y: 320, scale: 1, anchor: 0.5 },
									img: "sCheckOn"
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
									VD: { x: 30, y: 380, anchor: { x: 0, y: 0.5 } },
									text: "Quick Spin",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
								}
							},

							skipBigwinText: {
								type: "Text",
								props: {
									VD: { x: 30, y: 560, anchor: { x: 0, y: 0.5 } },
									text: "Skip Bigwin Animations",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
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
									VD: { x: 600, y: 380, scale: 1, anchor: 0.5 },
									img: "sCheckOff"
								}
							},
							quickSpinOn: {
								type: "Sprite",
								props: {
									VD: { x: 600, y: 380, scale: 1, anchor: 0.5, visible: false },
									img: "sCheckOn"
								}
							},

							skipBigwinOff: {
								type: "Sprite",
								props: {
									VD: { x: 600, y: 560, scale: 1, anchor: 0.5 },
									img: "sCheckOff"
								}
							},
							skipBigwinOn: {
								type: "Sprite",
								props: {
									VD: { x: 600, y: 560, scale: 1, anchor: 0.5, visible: false },
									img: "sCheckOn"
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
							pressSpaceText: {
								type: "Text",
								props: {
									VD: { x: 30, y: 440, anchor: { x: 0, y: 0.5 } },
									text: "Press space bar to spin/stop",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
								}
							},

							// spaceClickOnOffTxt: {
							// 	type: "Text",
							// 	props: {
							// 		VD: { x: 550, y: 440, anchor: { x: 1, y: 0.5 } },
							// 		text: "Off",
							// 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, "align": "right", fill: 0xffffff, padding: 10 }
							// 	}
							// },

							spaceClickOff: {
								type: "Sprite",
								props: {
									VD: { x: 600, y: 440, scale: 1, anchor: 0.5, visible: false },
									img: "sCheckOff"
								}
							},
							spaceClickOn: {
								type: "Sprite",
								props: {
									VD: { x: 600, y: 440, scale: 1, anchor: 0.5 },
									img: "sCheckOn"
								}
							},

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
									VD: { x: 30, y: 500, anchor: { x: 0, y: 0.5 } },
									text: "History",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
								}
							},

							historyButton: {
								type: "Button",
								props: {
									VD: { x: 560, y: 500, anchor: 0.5 },
									// img: "btnBg",
									img: "see_history",
								}
							},
							seeHistoryTitle: {
								type: "Text",
								props: {
									VD: { x: 510, y: 500, anchor: { x: 0, y: 0.5 } },
									text: "SEE HISTORY",
									textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14, fill: 0xffffff }
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
									VD: { x: 30, y: 75, anchor: { x: 0, y: 0.5 } },
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
									VD: { x: 600, y: 75, scale: 1, anchor: 0.5 },
									img: "sCheckOff"
								}
							},
							onAnyWinOn: {
								type: "Sprite",
								props: {
									VD: { x: 600, y: 75, scale: 1, anchor: 0.5, visible: false },
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
									VD: { x: 30, y: 135, anchor: { y: 0.5 } },
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
									VD: { x: 600, y: 135, scale: 1, anchor: 0.5 },
									img: "sCheckOff"
								}
							},
							autoSpinWinLimitOn: {
								type: "Sprite",
								props: {
									VD: { x: 600, y: 135, scale: 1, anchor: 0.5, visible: false },
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
									VD: { x: 30, y: 255, anchor: { x: 0, y: 0.5 } },
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
									VD: { x: 600, y: 255, scale: 1, anchor: 0.5, visible: false },
									img: "sCheckOff"
								}
							},
							autoSpinLossLimitOn: {
								type: "Sprite",
								props: {
									VD: { x: 600, y: 255, scale: 1, anchor: 0.5 },
									img: "sCheckOn"
								}
							},

							inputWinLimitBg: {
								type: "Sprite",
								props: {
									img: "textField_text",
									VD: { x: 575, y: 200, anchor: 0.5, scale: 1 }
								}
							},
							inputLossLimitBg: {
								type: "Sprite",
								props: {
									img: "textField_text",
									VD: { x: 575, y: 320, anchor: 0.5, scale: 1 }
								}
							},

							inputWinLimitText: {
								type: "Text",
								props: {
									VD: { x: 575, y: 200, anchor: 0.5 },
									text: "100",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0x000000, maxWidth: 105 }
								}
							},
							inputLossLimitText: {
								type: "Text",
								props: {
									VD: { x: 575, y: 320, anchor: 0.5 },
									text: "",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0x000000, maxWidth: 105 }
								}
							}
						}
					},
					autoPlay: {
						type: "Container",
						props: {
							VD: { x: 300, y: 500 }
						},
						children: {
							// autoPlayTitleSubTitle: {
							// 	type: "Text",
							// 	props: {
							// 		VD: { x: 30, y: -20, anchor: { x: 0, y: 0.5 } },
							// 		text: "Auto Spin",
							// 		textStyle: {
							// 			fontFamily: "Montserrat-Regular",
							// 			fontSize: 13,
							// 			fill: 0x9a7f3f,
							// 			padding: 10
							// 		}
							// 	}
							// },
							autoPlayTitle: {
								type: "Text",
								props: {
									VD: { x: 30, y: 0, anchor: { x: 0, y: 0.5 } },
									text: "Auto Play",
									textStyle: {
										fontFamily: "Montserrat-ExtraBold",
										fontSize: 17,
										fill: 0xffffff,
										maxWidth: 350
									}
								}
							},
							autospinSelectionBase: {
								type: "Sprite",
								props: {
									VD: { x: 30, y: 40, anchor: { x: 0, y: 0.5 }, scale: 1 },
									img: "auto_count_bar_bg"
								}
							},
							autoPlayNumBg1: {
								type: "Button",
								props: {
									VD: { x: 60, y: 40, anchor: 0.5, scale: 1 },
									img: "autospin_selected"
								}
							},
							autoPlayNumTxt1: {
								type: "Text",
								props: {
									VD: { x: 60, y: 40, anchor: 0.5 },
									text: "10",
									textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0xffffff }
								}
							},
							autoPlayNumBg2: {
								type: "Button",
								props: {
									VD: { x: 130, y: 40, scale: 1, anchor: 0.5 },
									img: "autospin_selected"
								}
							},
							autoPlayNumTxt2: {
								type: "Text",
								props: {
									VD: { x: 130, y: 40, anchor: 0.5 },
									text: "20",
									textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0xffffff }
								}
							},
							autoPlayNumBg3: {
								type: "Button",
								props: {
									VD: { x: 200, y: 40, scale: 1, anchor: 0.5 },
									img: "autospin_selected"
								}
							},
							autoPlayNumTxt3: {
								type: "Text",
								props: {
									VD: { x: 200, y: 40, anchor: 0.5 },
									text: "30",
									textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0xffffff }
								}
							},
							autoPlayNumBg4: {
								type: "Button",
								props: {
									VD: { x: 270, y: 40, scale: 1, anchor: 0.5 },
									img: "autospin_selected"
								}
							},
							autoPlayNumTxt4: {
								type: "Text",
								props: {
									VD: { x: 270, y: 40, anchor: 0.5 },
									text: "50",
									textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0xffffff }
								}
							},
							autoPlayNumBg5: {
								type: "Button",
								props: {
									VD: { x: 340, y: 40, scale: 1, anchor: 0.5 },
									img: "autospin_selected"
								}
							},
							autoPlayNumTxt5: {
								type: "Text",
								props: {
									VD: { x: 340, y: 40, anchor: 0.5 },
									text: "100",
									textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0xffffff }
								}
							},

							autoPlayButton: {
								type: "Button",
								props: {
									VD: { x: 560, y: 40, anchor: 0.5, scale: 1.1 },
									img: "see_history",
								}
							},
							startAutoSpinTitle: {
								type: "Text",
								props: {
									VD: { x: 495, y: 40, anchor: { x: 0, y: 0.5 } },
									text: "START AUTO SPINS",
									textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0xffffff, maxWidth: 130 }
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
							img: "settingsBg",
							// VL: { x: 640, y: 360, anchor: 0.5, scale: 1.1 },
							// VP: { x: 360, y: 640, anchor: 0.5, scale: 1.1 }
							VL: { x: 0, y: 0, scale: 1.1 },
							// VL: { x: 0, y: 0 },
							VP: { x: 0, y: 0, scale: 1.1 }
						}
					},
					// settingsBgRect: {
					// 	type: "RoundRectangle",
					// 	props: {
					// 		VL: { x: 0, y: 0, alpha: 0.8 },
					// 		VP: { x: 0, y: 0, alpha: 0.8 },
					// 		layout: { w: 900, h: 580, r: 6, color: 0x000000 }
					// 	}
					// },



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
					settingsCloseButton: {
						type: "Button",
						props: {
							// img: "btnBg",
							img: "see_history",
							VL: { x: 560, y: 605, anchor: 0.5, scale: 1.2 },
							VP: { x: 560, y: 605, anchor: 0.5, scale: 1.2 }
						}
					},
					resumeGameTitle: {
						type: "Text",
						props: {
							VL: { x: 560, y: 605, anchor: 0.5 },
							VP: { x: 560, y: 605, anchor: 0.5 },
							text: "RESUME GAME",
							textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14, fill: 0xffffff }
						}
					},

					optionsTabBase: {
						type: "RoundRectangle",
						props: {
							VL: { x: 115, y: 75, alpha: 0.0 },
							VP: { x: 115, y: 75, alpha: 0.0 },
							layout: { w: 448, h: 60, r: 6, color: 0xffffff }
						}
					},
					autoSpinSettingsTabBase: {
						type: "RoundRectangle",
						props: {
							VL: { x: 565, y: 75, alpha: 0.1 },
							VP: { x: 565, y: 75, alpha: 0.1 },
							layout: { w: 448, h: 60, r: 6, color: 0xffffff }
						}
					},
					// settingsIcon: {
					// 	type: "Sprite",
					// 	props: {
					// 		img: "mSettingsBtn_normal",
					// 		VL: { x: 30, y: 33, alpha: 0 },
					// 		VP: { x: 30, y: 33, alpha: 0 }
					// 	}
					// },

					optionsTab: {
						type: "Text",
						props: {
							VL: { x: 340, y: 102, anchor: 0.5 },
							VP: { x: 340, y: 102, anchor: 0.5 },
							text: "Options",
							textStyle: {
								fontFamily: "Montserrat-ExtraBold",
								fontSize: 28,
								maxWidth: 240,
								fill: 0xffffff,
								fontStyle: "bold",
								padding: 10
							}
						}
					},
					autoSpinSettingsTab: {
						type: "Text",
						props: {
							VL: { x: 790, y: 102, anchor: 0.5 },
							VP: { x: 790, y: 102, anchor: 0.5 },
							text: "Auto Spin",
							textStyle: {
								fontFamily: "Montserrat-ExtraBold",
								fontSize: 28,
								maxWidth: 440,
								fill: 0xffffff,
								fontStyle: "bold",
								padding: 10
							}
						}
					},
					audioMContainer: {
						type: "Container",
						props: {
							VL: { x: 220, y: -10 },
							VP: { x: 220, y: -10 }
						},
						children: {
							// volumeTextTitle: {
							// 	type: "Text",
							// 	props: {
							// 		VL: { x: 30, y: 180, anchor: { x: 0, y: 0.5 } },
							// 		VP: { x: 30, y: 180, anchor: { x: 0, y: 0.5 } },
							// 		text: "Settings",
							// 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0x9a7f3f, padding: 10 }
							// 	}
							// },
							volumeText: {
								type: "Text",
								props: {
									VL: { x: 30, y: 200, anchor: { x: 0, y: 0.5 } },
									VP: { x: 30, y: 200, anchor: { x: 0, y: 0.5 } },
									text: "Volume",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
								}
							},
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
									VL: { x: 30, y: 260, anchor: { x: 0, y: 0.5 } },
									VP: { x: 30, y: 260, anchor: { x: 0, y: 0.5 } },
									text: "Sound Effects",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff, padding: 10 }
								}
							},

							soundEffectOff: {
								type: "Sprite",
								props: {
									VL: { x: 600, y: 260, scale: 1, anchor: 0.5, visible: false },
									VP: { x: 600, y: 260, scale: 1, anchor: 0.5, visible: false },
									img: "sCheckOff"
								}
							},
							soundEffectOn: {
								type: "Sprite",
								props: {
									VL: { x: 600, y: 260, scale: 1, anchor: 0.5 },
									VP: { x: 600, y: 260, scale: 1, anchor: 0.5 },
									img: "sCheckOn"
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
									VL: { x: 30, y: 320, anchor: { x: 0, y: 0.5 } },
									VP: { x: 30, y: 320, anchor: { x: 0, y: 0.5 } },
									text: "Ambience Sound",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff, padding: 10 }
								}
							},
							ambienceSoundOff: {
								type: "Sprite",
								props: {
									VL: { x: 600, y: 320, scale: 1, anchor: 0.5, visible: false },
									VP: { x: 600, y: 320, scale: 1, anchor: 0.5, visible: false },
									img: "sCheckOff"
								}
							},
							ambienceSoundOn: {
								type: "Sprite",
								props: {
									VL: { x: 600, y: 320, scale: 1, anchor: 0.5 },
									VP: { x: 600, y: 320, scale: 1, anchor: 0.5 },
									img: "sCheckOn"
								}
							},
							// quickSpinTextSubTitle: {
							// 	type: "Text",
							// 	props: {
							// 		VL: { x: 30, y: 360, anchor: { x: 0, y: 0.5 } },
							// 		VP: { x: 30, y: 360, anchor: { x: 0, y: 0.5 } },
							// 		text: "Settings",
							// 		textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0x9a7f3f, padding: 10 }
							// 	}
							// },
							quickSpinText: {
								type: "Text",
								props: {
									VL: { x: 30, y: 380, anchor: { x: 0, y: 0.5 } },
									VP: { x: 30, y: 380, anchor: { x: 0, y: 0.5 } },
									text: "Quick Spin",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
								}
							},

							skipBigwinText: {
								type: "Text",
								props: {
									VL: { x: 30, y: 550, anchor: { x: 0, y: 0.5 } },
									VP: { x: 30, y: 550, anchor: { x: 0, y: 0.5 } },
									text: "Skip Bigwin Animations",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
								}
							},

							quickSpinOff: {
								type: "Sprite",
								props: {
									VL: { x: 600, y: 380, scale: 1, anchor: 0.5 },
									VP: { x: 600, y: 380, scale: 1, anchor: 0.5 },
									img: "sCheckOff"
								}
							},
							quickSpinOn: {
								type: "Sprite",
								props: {
									VL: { x: 600, y: 380, scale: 1, anchor: 0.5, visible: false },
									VP: { x: 600, y: 380, scale: 1, anchor: 0.5, visible: false },
									img: "sCheckOn"
								}
							},

							skipBigwinOff: {
								type: "Sprite",
								props: {
									VL: { x: 600, y: 550, scale: 1, anchor: 0.5 },
									VP: { x: 600, y: 550, scale: 1, anchor: 0.5 },
									img: "sCheckOff"
								}
							},
							skipBigwinOn: {
								type: "Sprite",
								props: {
									VL: { x: 600, y: 550, scale: 1, anchor: 0.5, visible: false },
									VP: { x: 600, y: 550, scale: 1, anchor: 0.5, visible: false },
									img: "sCheckOn"
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
							pressSpaceText: {
								type: "Text",
								props: {
									VL: { x: 30, y: 440, anchor: { x: 0, y: 0.5 } },
									VP: { x: 30, y: 440, anchor: { x: 0, y: 0.5 } },
									text: "Press space bar to spin/stop",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
								}
							},

							spaceClickOff: {
								type: "Sprite",
								props: {
									VL: { x: 600, y: 440, scale: 1, anchor: 0.5, visible: false },
									VP: { x: 600, y: 440, scale: 1, anchor: 0.5, visible: false },
									img: "sCheckOff"
								}
							},
							spaceClickOn: {
								type: "Sprite",
								props: {
									VL: { x: 600, y: 440, scale: 1, anchor: 0.5 },
									VP: { x: 600, y: 440, scale: 1, anchor: 0.5 },
									img: "sCheckOn"
								}
							},

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
									VL: { x: 30, y: 500, anchor: { x: 0, y: 0.5 } },
									VP: { x: 30, y: 500, anchor: { x: 0, y: 0.5 } },
									text: "History",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff }
								}
							},

							historyButton: {
								type: "Button",
								props: {
									VL: { x: 560, y: 500, anchor: 0.5 },
									VP: { x: 560, y: 500, anchor: 0.5 },
									// img: "btnBg",
									img: "see_history"
								}
							},
							seeHistoryTitle: {
								type: "Text",
								props: {
									VL: { x: 515, y: 500, anchor: { x: 0, y: 0.5 } },
									VP: { x: 515, y: 500, anchor: { x: 0, y: 0.5 } },
									text: "SEE HISTORY",
									textStyle: { fontFamily: "Montserrat-Regular", fontSize: 14, fill: 0xffffff }
								}
							}
						}
					},
					autoPlayMContainer: {
						type: "Container",
						props: {
							VL: { x: 220, y: 110 },
							VP: { x: 220, y: 110 }
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
									VL: { x: 30, y: 75, anchor: { x: 0, y: 0.5 } },
									VP: { x: 30, y: 75, anchor: { x: 0, y: 0.5 } },
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
									VL: { x: 600, y: 75, scale: 1, anchor: 0.5 },
									VP: { x: 600, y: 75, scale: 1, anchor: 0.5 },
									img: "sCheckOff"
								}
							},
							onAnyWinOn: {
								type: "Sprite",
								props: {
									VL: { x: 600, y: 75, scale: 1, anchor: 0.5, visible: false },
									VP: { x: 600, y: 75, scale: 1, anchor: 0.5, visible: false },
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
									VL: { x: 30, y: 135, anchor: { y: 0.5 } },
									VP: { x: 30, y: 135, anchor: { y: 0.5 } },
									text: "Stop on single win limit",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0xffffff, padding: 10 }
								}
							},

							autoSpinWinLimitOff: {
								type: "Sprite",
								props: {
									VL: { x: 600, y: 135, scale: 1, anchor: 0.5 },
									VP: { x: 600, y: 135, scale: 1, anchor: 0.5 },
									img: "sCheckOff"
								}
							},
							autoSpinWinLimitOn: {
								type: "Sprite",
								props: {
									VL: { x: 600, y: 135, scale: 1, anchor: 0.5, visible: false },
									VP: { x: 600, y: 135, scale: 1, anchor: 0.5, visible: false },
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
									VL: { x: 30, y: 255, anchor: { x: 0, y: 0.5 } },
									VP: { x: 30, y: 255, anchor: { x: 0, y: 0.5 } },
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
									VL: { x: 600, y: 255, scale: 1, anchor: 0.5, visible: false },
									VP: { x: 600, y: 255, scale: 1, anchor: 0.5, visible: false },
									img: "sCheckOff"
								}
							},
							autoSpinLossLimitOn: {
								type: "Sprite",
								props: {
									VL: { x: 600, y: 255, scale: 1, anchor: 0.5 },
									VP: { x: 600, y: 255, scale: 1, anchor: 0.5 },
									img: "sCheckOn"
								}
							},

							inputWinLimitBg: {
								type: "Sprite",
								props: {
									img: "textField_text",
									VL: { x: 575, y: 200, anchor: 0.5, scale: 1 },
									VP: { x: 575, y: 200, anchor: 0.5, scale: 1 }
								}
							},
							inputLossLimitBg: {
								type: "Sprite",
								props: {
									img: "textField_text",
									VL: { x: 575, y: 320, anchor: 0.5, scale: 1 },
									VP: { x: 575, y: 320, anchor: 0.5, scale: 1 }
								}
							},

							inputWinLimitText: {
								type: "Text",
								props: {
									VL: { x: 575, y: 200, anchor: 0.5 },
									VP: { x: 575, y: 200, anchor: 0.5 },
									text: "100",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0x000000, maxWidth: 105 }
								}
							},
							inputLossLimitText: {
								type: "Text",
								props: {
									VL: { x: 575, y: 320, anchor: 0.5 },
									VP: { x: 575, y: 320, anchor: 0.5 },
									text: "",
									textStyle: { fontFamily: "Montserrat-ExtraBold", fontSize: 18, fill: 0x000000, maxWidth: 105 }
								}
							}
						}
					},
					autoMPlay: {
						type: "Container",
						props: {
							VL: { x: 220, y: 480 },
							VP: { x: 220, y: 480 }
						},
						children: {
							// autoPlayTitleSubTitle: {
							// 	type: "Text",
							// 	props: {
							// 		VL: { x: 30, y: -20, anchor: { x: 0, y: 0.5 } },
							// 		VP: { x: 30, y: -20, anchor: { x: 0, y: 0.5 } },
							// 		text: "Auto Spin",
							// 		textStyle: {
							// 			fontFamily: "Montserrat-Regular",
							// 			fontSize: 15,
							// 			fill: 0x9a7f3f,
							// 			padding: 10
							// 		}
							// 	}
							// },
							autoPlayTitle: {
								type: "Text",
								props: {
									VL: { x: 30, y: 0, anchor: { x: 0, y: 0.5 } },
									VP: { x: 30, y: 0, anchor: { x: 0, y: 0.5 } },
									text: "Auto Play",
									textStyle: {
										fontFamily: "Montserrat-ExtraBold",
										fontSize: 18,
										fill: 0xffffff,
										maxWidth: 350
									}
								}
							},
							autospinSelectionBase: {
								type: "Sprite",
								props: {
									VL: { x: 30, y: 40, anchor: { x: 0, y: 0.5 }, scale: 1 },
									VP: { x: 30, y: 40, anchor: { x: 0, y: 0.5 }, scale: 1 },
									img: "auto_count_bar_bg"
								}
							},
							autoPlayNumBg1: {
								type: "Button",
								props: {
									VL: { x: 60, y: 40, anchor: 0.5, scale: 1 },
									VP: { x: 60, y: 40, anchor: 0.5, scale: 1 },
									img: "autospin_selected"
								}
							},
							autoPlayNumTxt1: {
								type: "Text",
								props: {
									VL: { x: 60, y: 40, anchor: 0.5 },
									VP: { x: 60, y: 40, anchor: 0.5 },
									text: "10",
									textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0xffffff }
								}
							},
							autoPlayNumBg2: {
								type: "Button",
								props: {
									VL: { x: 130, y: 40, scale: 1, anchor: 0.5 },
									VP: { x: 130, y: 40, scale: 1, anchor: 0.5 },
									img: "autospin_selected"
								}
							},
							autoPlayNumTxt2: {
								type: "Text",
								props: {
									VL: { x: 130, y: 40, anchor: 0.5 },
									VP: { x: 130, y: 40, anchor: 0.5 },
									text: "20",
									textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0xffffff }
								}
							},
							autoPlayNumBg3: {
								type: "Button",
								props: {
									VL: { x: 200, y: 40, scale: 1, anchor: 0.5 },
									VP: { x: 200, y: 40, scale: 1, anchor: 0.5 },
									img: "autospin_selected"
								}
							},
							autoPlayNumTxt3: {
								type: "Text",
								props: {
									VL: { x: 200, y: 40, anchor: 0.5 },
									VP: { x: 200, y: 40, anchor: 0.5 },
									text: "30",
									textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0xffffff }
								}
							},
							autoPlayNumBg4: {
								type: "Button",
								props: {
									VL: { x: 270, y: 40, scale: 1, anchor: 0.5 },
									VP: { x: 270, y: 40, scale: 1, anchor: 0.5 },
									img: "autospin_selected"
								}
							},
							autoPlayNumTxt4: {
								type: "Text",
								props: {
									VL: { x: 270, y: 40, anchor: 0.5 },
									VP: { x: 270, y: 40, anchor: 0.5 },
									text: "50",
									textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0xffffff }
								}
							},
							autoPlayNumBg5: {
								type: "Button",
								props: {
									VL: { x: 340, y: 40, scale: 1, anchor: 0.5 },
									VP: { x: 340, y: 40, scale: 1, anchor: 0.5 },
									img: "autospin_selected"
								}
							},
							autoPlayNumTxt5: {
								type: "Text",
								props: {
									VL: { x: 340, y: 40, anchor: 0.5 },
									VP: { x: 340, y: 40, anchor: 0.5 },
									text: "100",
									textStyle: { fontFamily: "Montserrat-Regular", fontSize: 13, fill: 0xffffff }
								}
							},

							autoPlayButton: {
								type: "Button",
								props: {
									VL: { x: 580, y: 40, anchor: 0.5, scale: 1.3 },
									VP: { x: 580, y: 40, anchor: 0.5, scale: 1.3 },
									img: "start_Auto_spin",
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
	}

}


