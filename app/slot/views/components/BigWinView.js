function BigWinView(gameView) {
	this.gameView = coreApp.gameView;
	this.isResponsiveCalled = false;
	ViewContainer.call(this);
	this.loopSoundHowlerIdsP = [];
	this.loopSoundHowlerIdsS = [];
	this.addSubscription();
	this.currentBigwinName = "";
	this.isBigWinRunning = false;
	this.bigWinState = "";
	this.bigWinTimer;
}

BigWinView.prototype = Object.create(ViewContainer.prototype);
BigWinView.prototype.constructor = BigWinView.prototype;

var view = BigWinView.prototype;

view.addSubscription = function () {
	_mediator.subscribe("showBigWins", this.onShowBigWin.bind(this));
	_mediator.subscribe(_events.core.onResize, this.onTotalWinResize.bind(this));
	_mediator.subscribe("showTotalWin", this.onShowTotalWin.bind(this));
	_mediator.subscribe("hideTotalWinExt", this.hideTotalWin.bind(this));





	_mediator.subscribe("hideBigWin", this.hideBigWinAnimation.bind(this));
	_mediator.subscribe("howlerId", this.setHowlerIds.bind(this));
	_mediator.subscribe("spinStart", this.stopLoopSound.bind(this));
	_mediator.subscribe("showFreeSpinEnded", this.stopLoopSound.bind(this));
	_mediator.subscribe("showBigWins", this.wrapperBigwin.bind(this));
	_mediator.subscribe("hideReelBlanket", this.hideBigWinClickBG.bind(this));
	_mediator.subscribe("hideBigWin_click", this.hideBigWin_click.bind(this));
	// _mediator.subscribe("hideBigWin_click", function () {
	// 	if (this.isBigWinRunning) {
	// 		this.isBigWinRunning = false;
	// 		this.hideBigWin_click();
	// 	}
	// }.bind(this));
};

view.createView = function (argument) { };
view.wrapperBigwin = function () {
	this.grayBg2 = pixiLib.getShape("rect", {
		w: _viewInfoUtil.getWindowWidth(),
		h: _viewInfoUtil.getWindowHeight()
	});
	this.grayBg2.alpha = 0.1;
	this.grayBg2.name = "grayBg2"
	this.grayBg2.interactive = true;
	this.grayBg2.buttonMode = true;
	pixiLib.addEvent(this.grayBg2, this.hideBigWin_click.bind(this), "click");
	coreApp.gameView.decoratorContainer.addChild(this.grayBg2);
}
view.hideBigWinClickBG = function () {
	if (this.grayBg2) {
		TweenMax.to(this.grayBg2, .5, {
			alpha: 0
		});
		this.grayBg2.interactive = false;
		delete grayBg2;
	}
}
view.onShowTotalWin = function () {
	_ng.isTotalWinShown = true;
	var winAmount = coreApp.gameModel.getTotalWin();
	this.x = 0, this.y = 0;
	if (!this.blackBg) {
		this.blackBg = pixiLib.getRectangleSprite(_viewInfoUtil.getWindowWidth(), _viewInfoUtil.getWindowHeight(), 0x000000);
		this.blackBg.alpha = 0.1;

		coreApp.gameView.decoratorContainer.addChild(this.blackBg);
	}
	this.blackBg.name = "blackBg";
	this.blackBg.interactive = true;
	this.blackBg.visible = true;
	if (!this.winAmountContainer) {
		this.winAmountContainer = pixiLib.getElement();
		coreApp.gameView.decoratorContainer.addChild(this.winAmountContainer);
		_ngFluid.call(this.winAmountContainer, _ng.GameConfig.specialWins.totalWin.props)
	}
	if (!this.winAmountTxt) {
		this.winTextStyle = _ng.GameConfig.specialWins.totalWin.textStyle;
		this.winAmountTxt = pixiLib.getElement("Text", this.winTextStyle, "0");
		this.winAmountContainer.addChild(this.winAmountTxt);
		this.winAmountTxt.anchor.set(0.5);
	}

	pixiLib.setText(this.winAmountTxt, pixiLib.getFormattedAmount(winAmount, true));
	_mediator.publish("SHOW_TICKER_MESSAGE", "Total win: "+pixiLib.getFormattedAmount(winAmount, true));

	this.winAmountTxt.alpha = 0;

	if (_ng.isQuickSpinActive) {
		this.winAmountTxt.alpha = 1;
		this.winAmountTxt.scale.set(1.5);
		this.onTotalWinResize();
		_sndLib.play(_sndLib.sprite.totalWin);
		//#todo only for base game it should call 
		if(_ng.GameConfig.gameName  == "queensakura"){
			if(coreApp.gameModel.spinData.spinType != "normal"){
				setTimeout(this.hideTotalWin.bind(this), 400);
			}
		}else{
			setTimeout(this.hideTotalWin.bind(this), 400);
		}
	} else {
		this.winAmountTxt.scale.set(2);
		TweenMax.to(this.winAmountTxt, 0.5, { alpha: 1 });
		TweenMax.to(this.winAmountTxt.scale, 1, { x: 1, y: 1, ease: Back.easeOut.config(1.5) });
		this.onTotalWinResize();
		_sndLib.play(_sndLib.sprite.totalWin);
		// if(_ng.GameConfig.gameName  == "queensakura" && coreApp.gameModel.spinData.spinType != "normal"){
		if(_ng.GameConfig.gameName  == "queensakura" && coreApp.gameModel.spinData.spinType == "normal"){
			setTimeout(this.hideTotalWin.bind(this), _ng.GameConfig.totalWinDuration+2000);
		}else{
			setTimeout(this.hideTotalWin.bind(this), _ng.GameConfig.totalWinDuration);
		}
		
	}
};
view.hideTotalWin = function () {
	_mediator.publish("clearAllWins", { from: "onTotalWinShown" });
	this.blackBg.visible = false;

	var winTxtDealy = (_ng.isQuickSpinActive && _ng.quickSpinType === "turbo") ? 0.1 : 0.5;
	var totalWinShownDealy = (_ng.isQuickSpinActive && _ng.quickSpinType === "turbo") ? 100 : 300;


	TweenMax.to(this.winAmountTxt, winTxtDealy, { alpha: 0 });
	setTimeout(function () {
		_mediator.publish("onTotalWinShown");
		// we already showing total win amount in autospins and freespins
		if (!(coreApp.gameModel.isFeatureActive() || coreApp.gameModel.isAutoSpinActive() || coreApp.gameModel.isFullFSActive() || coreApp.gameController.isSpaceBarHeld)) {
			_mediator.publish("showPanelWin");
		}
		_mediator.publish(_events.slot.updateBalance);
	}, totalWinShownDealy);
};
view.onShowBigWin = function () {
	_mediator.publish("HIDE_TICKER");
	this.isBigWinRunning = true;
	var winAmount = coreApp.gameModel.getTotalWin();
	var totalBet = coreApp.gameModel.getTotalBet();
	var specialWinObj = _ng.GameConfig.specialWins;
	this.bigWinConfig = _ng.GameConfig.bigWinView;

	this.grayBg = pixiLib.getShape("rect", {
		w: _viewInfoUtil.getWindowWidth(),
		h: _viewInfoUtil.getWindowHeight()
	});
	var bgAlpha = 0.8;
	if (_ng.GameConfig.bigWinView.bgAlpha) {
		bgAlpha = _ng.GameConfig.bigWinView.bgAlpha;
	}
	this.grayBg.alpha = bgAlpha;
	this.grayBg.interactive = true;
	this.grayBg.name = "grayBg";
	coreApp.gameView.decoratorContainer.addChildAt(this.grayBg, 0);

	this.winType = "";
	if (winAmount >= specialWinObj.superBigWin.multiplier * totalBet) {
		this.winType = "superBigWin";
	} else if (winAmount >= specialWinObj.megaWin.multiplier * totalBet) {
		this.winType = "megaWin";
	} else if (winAmount >= specialWinObj.bigWin.multiplier * totalBet) {
		this.winType = "bigWin";
	}



	this.winAmount = winAmount;
	this.bigWinAmount = specialWinObj.bigWin.multiplier * totalBet;
	this.megaBigWinAmount = specialWinObj.megaWin.multiplier * totalBet;
	this.superMegaWinAmount = specialWinObj.superBigWin.multiplier * totalBet;

	this.bigWinSpine = new PIXI.spine.Spine(PIXI.Loader.shared.resources[this.bigWinConfig.spineImage].spineData);
	this.bigWinSpine.visible = false;
	this.bigWinSpine.scale.set(0.5);
	this.addChild(this.bigWinSpine);
	this.bigWinSpine.state.addListener({
		complete: function (entry) {

			switch (this.bigWinState) {
				case "hideBigWin":
					this.hideBigWin();
					break
				case "bigWinIn":
					this.bigWinState = "bigWinLoop";
					this.bigWinSpine.state.setAnimation(0, this.bigWinConfig.bigWin.bigWinLoop, true);
					break
				// case "bigWinLoop":
				// 	this.bigWinState = "bigWinOut";					
				// 	break
				case "bigWinOut":
					this.bigWinState = "superBigWinIn";
					_sndLib.stop(_sndLib.sprite.counterBigWinLoop);
					if (winAmount > specialWinObj.megaWin.multiplier * totalBet) {
						if (this.isBigWinRunning) {
							_sndLib.play(_sndLib.sprite.counterMegaWinLoop);
						}
					} else {
						_sndLib.play(_sndLib.sprite.counterEnd);
					}
					_sndLib.play(_sndLib.sprite.megaWin);
					this.bigWinSpine.state.setAnimation(0, this.bigWinConfig.superBigWin.superBigWinIn, false);
					break
				case "superBigWinIn":
					this.bigWinState = "superBigWinLoop";
					this.bigWinSpine.state.setAnimation(0, this.bigWinConfig.superBigWin.superBigWinLoop, true);
					break
				// case "superBigWinLoop":
				// 	this.bigWinState = "megaWinOut";
				// 	break
				case "superBigWinOut":
					this.bigWinState = "megaWinIn";
					_sndLib.stop(_sndLib.sprite.counterMegaWinLoop);
					if (winAmount > specialWinObj.superBigWin.multiplier * totalBet) {
						if (this.isBigWinRunning) { _sndLib.play(_sndLib.sprite.counterMegaWinLoop); }
					} else {
						_sndLib.play(_sndLib.sprite.counterEnd);
					}
					_sndLib.play(_sndLib.sprite.superMegaWin);
					this.bigWinSpine.state.setAnimation(0, this.bigWinConfig.megaWin.megaWinIn, false);
					break
				case "megaWinIn":
					this.bigWinState = "megaWinLoop";
					this.bigWinSpine.state.setAnimation(0, this.bigWinConfig.megaWin.megaWinLoop, true);
					break
				// case "megaWinLoop":
				// 	this.bigWinState = "superMegaWinOut";
				// 	break
				// case "superMegaWinOut":					
				// 	break;
			}
			// this.bigWinSpine.visible = true;
			// this.bigWinSpine.state.setAnimation(0, this.bigWinConfig.superBigWin[this.bigWinState], true);
		}.bind(this)
	});

	var bigWinStyle = this.bigWinConfig.totalWinAmount.textStyle;

	this.bigWinAmtTxt = pixiLib.getElement("Text", bigWinStyle);
	this.bigWinAmtTxt.incrementalAmount = 0;
	this.addChild(this.bigWinAmtTxt);
	pixiLib.setProperties(this.bigWinAmtTxt, this.bigWinConfig.totalWinAmount.params);
	pixiLib.setText(this.bigWinAmtTxt, winAmount);
	this.bigWinAmtTxt.anchor.set(0.5);

	if (!this.isResponsiveCalled) {
		this.isResponsiveCalled = true;
		_ngFluid.call(this, this.bigWinConfig.params);
	}
	if (this.bigWinConfig.setSize) {
		this.setSize(0, 0);
	}

	this.runSpineAnimation(0, this.bigWinAmount);
	_mediator.publish("showReelBlanket");
};
view.runSpineAnimation = function () {
	if (1) {
		var winAmount = coreApp.gameModel.getTotalWin();
		var totalBet = coreApp.gameModel.getTotalBet();
		var specialWinObj = _ng.GameConfig.specialWins;

		TweenMax.to(this.bigWinAmtTxt, commonConfig.bigWinInitialDuration, {
			incrementalAmount: this.bigWinAmount,
			ease: Expo.easeOut,

			onInit: function () {
				if (this.isBigWinRunning) {
					_sndLib.play(_sndLib.sprite.counterLoop);
				}
			}.bind(this),

			onUpdate: function () {
				var amount = Math.round(this.bigWinAmtTxt.incrementalAmount);
				amount = pixiLib.getFormattedAmount(amount, true);
				pixiLib.setText(this.bigWinAmtTxt, amount);
			}.bind(this),

			onComplete: function () {
				TweenMax.to(this.bigWinAmtTxt, 0.5, {
					y: this.bigWinConfig.totalWinAmount.finalPositionY,
					ease: Back.easeOut.config(1.5),
					onComplete: function () { }
				});

				this.bigWinTimer = setTimeout(function () {
					_mediator.publish("playSpineAnimation", "bigWinAnimation");
					this.bigWinSpine.visible = true;
					this.bigWinState = "bigWinIn";
					this.bigWinSpine.state.setAnimation(0, this.bigWinConfig.bigWin.bigWinIn, false);
					_sndLib.play(_sndLib.sprite.bigWin);
					_sndLib.stop(_sndLib.sprite.counterLoop);
					if (winAmount > specialWinObj.bigWin.multiplier * totalBet) {
						if (this.isBigWinRunning) {
							_sndLib.play(_sndLib.sprite.counterBigWinLoop);
							// _sndLib.play(_sndLib.sprite.counterLoop);
						}
					} else {
						_sndLib.play(_sndLib.sprite.counterEnd);
					}
					//if Bigwin, Return from here
					if (this.winType === "bigWin") {
						TweenMax.to(this.bigWinAmtTxt, 4, {
							incrementalAmount: this.winAmount,
							ease: Expo.easeIn,
							onInit: function () { }.bind(this),
							onUpdate: function () {
								var amount = Math.round(this.bigWinAmtTxt.incrementalAmount);
								amount = pixiLib.getFormattedAmount(amount, true);
								pixiLib.setText(this.bigWinAmtTxt, amount);
							}.bind(this),
							onComplete: function () {
								_sndLib.stop(_sndLib.sprite.counterBigWinLoop);
								if (winAmount > specialWinObj.bigWin.multiplier * totalBet) {
									_sndLib.play(_sndLib.sprite.counterEnd);
								}
								if (commonConfig.holdBigWinAnimation) {
									this.currentBigwinName = "bigwin";
									this.grayBg.interactive = true;
									this.grayBg.buttonMode = true;
									pixiLib.addEvent(this.grayBg, this.hideBigWinAnimation.bind(this), "click");
									_mediator.publish("setSpaceBarEvent", "hideBigWin");
								} else {
									this.currentBigwinName = "bigwin";
									this.hideBigWinAnimation();
								}
							}.bind(this)
						});
						return;
					}

					TweenMax.to(this.bigWinAmtTxt, 4, {
						incrementalAmount: this.megaBigWinAmount,
						ease: Expo.easeInOut,

						onInit: function () {
						}.bind(this),

						onUpdate: function () {
							var amount = Math.round(this.bigWinAmtTxt.incrementalAmount);
							amount = pixiLib.getFormattedAmount(amount, true);
							pixiLib.setText(this.bigWinAmtTxt, amount);
						}.bind(this),

						onComplete: function () {
							//	_sndLib.stop(_sndLib.sprite.counterBigWinLoop);
							// this.bigWinSpine.state.setAnimation(2, this.bigWinConfig.bigWin.bigWinOut, false);
							this.bigWinState = "bigWinOut";
							this.bigWinSpine.state.setAnimation(0, this.bigWinConfig.bigWin.bigWinOut, false);
							_sndLib.stop(_sndLib.sprite.bigWin);
							_sndLib.play(_sndLib.sprite.bigWinDisappear);
							//if Super Bigwin, Return from here
							if (this.winType === "megaWin") {

								TweenMax.to(this.bigWinAmtTxt, 4, {
									incrementalAmount: this.winAmount,
									ease: Expo.easeIn,
									onInit: function () {
									}.bind(this),
									onUpdate: function () {
										var amount = Math.round(this.bigWinAmtTxt.incrementalAmount);
										amount = pixiLib.getFormattedAmount(amount, true);
										pixiLib.setText(this.bigWinAmtTxt, amount);
									}.bind(this),
									onComplete: function () {
										_sndLib.stop(_sndLib.sprite.counterMegaWinLoop);
										if (winAmount > specialWinObj.megaWin.multiplier * totalBet) {
											_sndLib.play(_sndLib.sprite.counterEnd);
										}
										if (commonConfig.holdBigWinAnimation) {
											this.currentBigwinName = "megawin";
											this.grayBg.interactive = true;
											this.grayBg.buttonMode = true;
											pixiLib.addEvent(this.grayBg, this.hideBigWinAnimation.bind(this), "click");
											_mediator.publish("setSpaceBarEvent", "hideBigWin");
										} else {
											this.currentBigwinName = "megawin";
											this.hideBigWinAnimation();
										}
									}.bind(this)
								});
								return;
							}

							TweenMax.to(this.bigWinAmtTxt, 4, {
								incrementalAmount: this.superMegaWinAmount,
								ease: Expo.easeInOut,
								onInit: function () {
								}.bind(this),
								onUpdate: function () {
									var amount = Math.round(this.bigWinAmtTxt.incrementalAmount);
									amount = pixiLib.getFormattedAmount(amount, true);
									pixiLib.setText(this.bigWinAmtTxt, amount);
								}.bind(this),
								onComplete: function () {
									_sndLib.stop(_sndLib.sprite.counterMegaWinLoop);
									// this.bigWinSpine.state.setAnimation(5, this.bigWinConfig.superBigWin.superBigWinOut, false);
									this.bigWinState = "superBigWinOut";
									this.bigWinSpine.state.setAnimation(0, this.bigWinConfig.superBigWin.superBigWinOut, false);
									_sndLib.play(_sndLib.sprite.megaWinDisappear);

									TweenMax.to(this.bigWinAmtTxt, 4, {
										incrementalAmount: this.winAmount,
										ease: Expo.easeIn,
										onInit: function () {
										}.bind(this),
										onUpdate: function () {
											var amount = Math.round(this.bigWinAmtTxt.incrementalAmount);
											amount = pixiLib.getFormattedAmount(amount, true);
											pixiLib.setText(this.bigWinAmtTxt, amount);
										}.bind(this),
										onComplete: function () {
											_sndLib.stop(_sndLib.sprite.counterSuperMegaWinLoop);
											if (winAmount > specialWinObj.superBigWin.multiplier * totalBet) {
												_sndLib.play(_sndLib.sprite.counterEnd);
											}
											if (commonConfig.holdBigWinAnimation) {
												this.currentBigwinName = "supermegawin";
												this.grayBg.interactive = true;
												this.grayBg.buttonMode = true;
												pixiLib.addEvent(this.grayBg, this.hideBigWinAnimation.bind(this), "click");
												_mediator.publish("setSpaceBarEvent", "hideBigWin");
											} else {
												this.currentBigwinName = "supermegawin";
												this.hideBigWinAnimation();
											}
										}.bind(this)
									})
								}.bind(this)
							})

						}.bind(this)
					})

				}.bind(this), 300);
			}.bind(this)
		})
	}
};
view.hideBigWinAnimation = function () {
	var BigVariable = 2000;
	if (commonConfig.holdBigWinAnimation) {
		BigVariable = 20;
		this.grayBg.interactive = false;
	}
	this.stopLoopSound();
	this.isBigWinRunning = false;
	this.bigWinTimer = setTimeout(this.playBigWinOutAnim.bind(this), BigVariable);
};

view.stopLoopSound = function () {
	for (var i = 0; i < this.loopSoundHowlerIdsP.length; i++) {
		_sndLib.primSndCtr.stop(this.loopSoundHowlerIdsP[i]);
	}
	for (var i = 0; i < this.loopSoundHowlerIdsS.length; i++) {
		_sndLib.sndCtr.stop(this.loopSoundHowlerIdsS[i]);
	}
	this.loopSoundHowlerIdsP = [];
	this.loopSoundHowlerIdsS = [];
}
view.setHowlerIds = function (data) {
	if (data.idName === "counterLoop" || data.idName === "counterBigWinLoop" || data.idName === "counterMegaWinLoop" ||
		data.idName === "counterSuperMegaWinLoop" || data.idName === "big_win_countUp_loop" || data.idName === "mad&extreme_win_countUp_loop") {
		this.stopLoopSound();
		if (data.type === "primary") {
			this.loopSoundHowlerIdsP.push(data.id);
		} else if (data.type === "secondary") {
			this.loopSoundHowlerIdsS.push(data.id);
		}
	}


}
view.playBigWinOutAnim = function () {
	if (this.currentBigwinName === "bigwin") {
		this.bigWinState = "hideBigWin";
		this.bigWinSpine.state.setAnimation(0, this.bigWinConfig.bigWin.bigWinOut, false);
	} else if (this.currentBigwinName === "megawin") {
		this.bigWinState = "hideBigWin";
		this.bigWinSpine.state.setAnimation(0, this.bigWinConfig.superBigWin.superBigWinOut, false);
	} else if (this.currentBigwinName === "supermegawin") {
		this.bigWinState = "hideBigWin";
		this.bigWinSpine.state.setAnimation(0, this.bigWinConfig.megaWin.megaWinOut, false);
	}
	_sndLib.play(_sndLib.sprite.superMegaWinDisappear);
	_mediator.publish("SHOW_TICKER");
};
view.hideBigWin = function () {
	_mediator.publish("playSpineAnimation", "idleAnimation");
	_mediator.publish("totalWinShownOnBigWinSettled");
	_mediator.publish("hideReelBlanket");
	TweenMax.to(this.grayBg, .5, {
		alpha: 0
	});
	TweenMax.to(this.bigWinAmtTxt.scale, .3, {
		x: 0,
		y: 0,
		onComplete: this.hideBigAnimationComplete.bind(this)
	});
};
view.hideBigWin_click = function () {
	if (this.bigWinTimer) {
		clearTimeout(this.bigWinTimer);
	}
	_sndLib.stop(_sndLib.sprite.bigWin);
	_sndLib.stop(_sndLib.sprite.megaWin);
	_sndLib.stop(_sndLib.sprite.superMegaWin);
	this.isBigWinRunning = false;
	this.grayBg2.interactive = false;
	this.grayBg2.buttonMode = false;
	var winAmount = coreApp.gameModel.getTotalWin();
	winAmount = pixiLib.getFormattedAmount(winAmount, true);
	pixiLib.setText(this.bigWinAmtTxt, winAmount);
	TweenMax.killTweensOf(this.bigWinAmtTxt);
	TweenMax.to(this.grayBg2, 0.01, {
		alpha: 0,
		onComplete: this.hideBigAnimationComplete_click.bind(this)
	});
	this.removeChild(this.bigWinSpine);
	this.stopLoopSound();
	coreApp.gameModel.isBigWin = false;
	_mediator.publish("showPanelWin");
	_mediator.publish("playSpineAnimation", "idleAnimation");
};

view.hideBigAnimationComplete_click = function () {
	coreApp.gameView.decoratorContainer.removeChild(this.grayBg);
	coreApp.gameView.decoratorContainer.removeChild(this.grayBg2);
	this.removeChild(this.bigWinAmtTxt);
	this.removeChild(this.bigWinSpine);

	delete this.grayBg;
	delete this.grayBg2;
	delete this.bigWinAmtTxt;
	delete this.bigWinSpine;

	this.isResponsiveCalled = false;
	_mediator.publish("onBigWinShown");
};
view.hideBigAnimationComplete = function () {
	coreApp.gameView.decoratorContainer.removeChild(this.grayBg);
	this.removeChild(this.bigWinAmtTxt);
	this.removeChild(this.bigWinSpine);

	delete this.grayBg;
	delete this.bigWinAmtTxt;
	delete this.bigWinSpine;

	this.isResponsiveCalled = false;
	coreApp.gameModel.isBigWin = false;
	_mediator.publish("onBigWinShown");
};
view.onTotalWinResize = function () {
	if (this.grayBg) {
		this.grayBg.width = _viewInfoUtil.getWindowWidth();
		this.grayBg.height = _viewInfoUtil.getWindowHeight();
	}
	if (this.grayBg2) {
		this.grayBg2.width = _viewInfoUtil.getWindowWidth();
		this.grayBg2.height = _viewInfoUtil.getWindowHeight();
	}
	if (this.blackBg) {
		this.blackBg.width = _viewInfoUtil.getWindowWidth();
		this.blackBg.height = _viewInfoUtil.getWindowHeight();
	}
	if (this.bigWinConfig && this.bigWinConfig.setSize) {
		this.setSize(0, 0);
	}
};