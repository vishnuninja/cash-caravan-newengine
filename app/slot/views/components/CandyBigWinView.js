function BigWinView(gameView) {
	this.gameView = coreApp.gameView;
	this.isResponsiveCalled = false;
	ViewContainer.call(this);
	this.loopSoundHowlerIdsP = [];
	this.loopSoundHowlerIdsS = [];
	this.addSubscription();
	this.currentBigwinName = "";
	this.isBigWinRunning = false;
}

BigWinView.prototype = Object.create(ViewContainer.prototype);
BigWinView.prototype.constructor = BigWinView.prototype;

var view = BigWinView.prototype;

view.addSubscription = function () {
	_mediator.subscribe("showBigWins", this.onShowBigWin.bind(this));
	_mediator.subscribe(_events.core.onResize, this.onTotalWinResize.bind(this));
	_mediator.subscribe("showTotalWin", this.onShowTotalWin.bind(this));
	_mediator.subscribe("hideBigWin", this.hideBigWinAnimation.bind(this));
	_mediator.subscribe("howlerId", this.setHowlerIds.bind(this));
	_mediator.subscribe("spinStart", this.stopLoopSound.bind(this));
	_mediator.subscribe("showFreeSpinEnded", this.stopLoopSound.bind(this));
};

view.createView = function (argument) { };

view.onShowTotalWin = function () {
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
	if(!this.winAmountContainer){
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

	pixiLib.setText(this.winAmountTxt, pixiLib.getFormattedAmount(winAmount,true));

	this.winAmountTxt.alpha = 0;

	if(_ng.isQuickSpinActive){
		this.winAmountTxt.alpha = 1;
		this.winAmountTxt.scale.set(1.5);
		this.onTotalWinResize();
		_sndLib.play(_sndLib.sprite.totalWin);
		setTimeout(this.hideTotalWin.bind(this), 400);
	}else{
		this.winAmountTxt.scale.set(2);
		TweenMax.to(this.winAmountTxt, 0.5, { alpha: 1 });
		TweenMax.to(this.winAmountTxt.scale, 1, { x: 1, y: 1, ease: Back.easeOut.config(1.5) });
		this.onTotalWinResize();
		_sndLib.play(_sndLib.sprite.totalWin);
		setTimeout(this.hideTotalWin.bind(this), _ng.GameConfig.totalWinDuration);
	}	
};
view.hideTotalWin = function () {
	_mediator.publish("clearAllWins", { from: "onTotalWinShown" });
	this.blackBg.visible = false;

	var winTxtDealy = (_ng.isQuickSpinActive && _ng.quickSpinType==="turbo") ? 0.1 : 0.5;
	var totalWinShownDealy = (_ng.isQuickSpinActive && _ng.quickSpinType==="turbo") ? 100 : 300;
	

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
			if (entry.trackIndex === 100) { 

			} else if (entry.trackIndex === 1) {
				this.bigWinSpine.state.setAnimation(2, this.bigWinConfig.bigWin.bigWinLoop, true);
			} else if (entry.trackIndex === 3) {
				_sndLib.stop(_sndLib.sprite.counterBigWinLoop);
				//If amount is equal to Megawin value. Don't play couter loop sound. (there is nothing to count next)
				if (winAmount > specialWinObj.megaWin.multiplier * totalBet) {
					if(this.isBigWinRunning){
						_sndLib.play(_sndLib.sprite.counterMegaWinLoop);
						// _sndLib.play(_sndLib.sprite.counterLoop);
					}
				}else{
					_sndLib.play(_sndLib.sprite.counterEnd);
				}
				_sndLib.play(_sndLib.sprite.megaWin);
				this.bigWinSpine.state.setAnimation(4, this.bigWinConfig.superBigWin.superBigWinIn, false);
			} else if (entry.trackIndex === 4) {
				this.bigWinSpine.state.setAnimation(5, this.bigWinConfig.superBigWin.superBigWinLoop, true);
			} else if (entry.trackIndex === 6) {
				_sndLib.stop(_sndLib.sprite.counterMegaWinLoop);
				//If amount is equal to Megawin value. Don't play couter loop sound. (there is nothing to count next)
				if (winAmount > specialWinObj.superBigWin.multiplier * totalBet) {
					if(this.isBigWinRunning){
						_sndLib.play(_sndLib.sprite.counterMegaWinLoop);
						// _sndLib.play(_sndLib.sprite.counterLoop);
					}
				}else{
					_sndLib.play(_sndLib.sprite.counterEnd);
				}
				_sndLib.play(_sndLib.sprite.superMegaWin);
				this.bigWinSpine.state.setAnimation(7, this.bigWinConfig.megaWin.megaWinIn, false);
			} else if (entry.trackIndex === 7) {
				this.bigWinSpine.state.setAnimation(8, this.bigWinConfig.megaWin.megaWinLoop, true);
			} else if (entry.trackIndex === 9) {
				this.hideBigWin();
			}
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

		TweenMax.to(this.bigWinAmtTxt, 2, {
			incrementalAmount: this.bigWinAmount,
			ease: Expo.easeOut,

			onInit: function () {
				if(this.isBigWinRunning){
					_sndLib.play(_sndLib.sprite.counterLoop);
				}
			}.bind(this),

			onUpdate: function () {
				var amount = Math.round(this.bigWinAmtTxt.incrementalAmount);
				amount = pixiLib.getFormattedAmount(amount,true);
				pixiLib.setText(this.bigWinAmtTxt, amount);
			}.bind(this),

			onComplete: function () {
				TweenMax.to(this.bigWinAmtTxt, 0.5, {
					y: this.bigWinConfig.totalWinAmount.finalPositionY,
					ease: Back.easeOut.config(1.5),
					onComplete: function () { }
				});

				setTimeout(function () {
					_mediator.publish("playSpineAnimation", "bigWinAnimation");
					this.bigWinSpine.visible = true;
					this.bigWinSpine.state.setAnimation(1, this.bigWinConfig.bigWin.bigWinIn, false);
					_sndLib.play(_sndLib.sprite.bigWin);
					_sndLib.stop(_sndLib.sprite.counterLoop);
					if (winAmount > specialWinObj.bigWin.multiplier * totalBet) {
						if(this.isBigWinRunning){
							_sndLib.play(_sndLib.sprite.counterBigWinLoop);
							// _sndLib.play(_sndLib.sprite.counterLoop);
						}
					}else{
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
								amount = pixiLib.getFormattedAmount(amount,true);
								pixiLib.setText(this.bigWinAmtTxt, amount);
							}.bind(this),
							onComplete: function () {
								_sndLib.stop(_sndLib.sprite.counterBigWinLoop);
								if (winAmount > specialWinObj.bigWin.multiplier * totalBet) {
									_sndLib.play(_sndLib.sprite.counterEnd);
								}
								if(commonConfig.holdBigWinAnimation){
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
							amount = pixiLib.getFormattedAmount(amount,true);
							pixiLib.setText(this.bigWinAmtTxt, amount);
						}.bind(this),

						onComplete: function () {
						//	_sndLib.stop(_sndLib.sprite.counterBigWinLoop);
							this.bigWinSpine.state.setAnimation(2, this.bigWinConfig.bigWin.bigWinOut, false);
							this.bigWinSpine.state.setAnimation(3, this.bigWinConfig.bigWin.bigWinOut, false);
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
										amount = pixiLib.getFormattedAmount(amount,true);
										pixiLib.setText(this.bigWinAmtTxt, amount);
									}.bind(this),
									onComplete: function () {
										_sndLib.stop(_sndLib.sprite.counterMegaWinLoop);
										if (winAmount > specialWinObj.megaWin.multiplier * totalBet) {
											_sndLib.play(_sndLib.sprite.counterEnd);
										}
										if(commonConfig.holdBigWinAnimation){
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
									amount = pixiLib.getFormattedAmount(amount,true);
									pixiLib.setText(this.bigWinAmtTxt, amount);
								}.bind(this),
								onComplete: function () {
								//	_sndLib.stop(_sndLib.sprite.counterMegaWinLoop);
									this.bigWinSpine.state.setAnimation(5, this.bigWinConfig.superBigWin.superBigWinOut, false);
									this.bigWinSpine.state.setAnimation(6, this.bigWinConfig.superBigWin.superBigWinOut, false);
									_sndLib.play(_sndLib.sprite.megaWinDisappear);

									TweenMax.to(this.bigWinAmtTxt, 4, {
										incrementalAmount: this.winAmount,
										ease: Expo.easeIn,
										onInit: function () {
										}.bind(this),
										onUpdate: function () {
											var amount = Math.round(this.bigWinAmtTxt.incrementalAmount);
											amount = pixiLib.getFormattedAmount(amount,true);
											pixiLib.setText(this.bigWinAmtTxt, amount);
										}.bind(this),
										onComplete: function () {
											_sndLib.stop(_sndLib.sprite.counterSuperMegaWinLoop);
											if (winAmount > specialWinObj.superBigWin.multiplier * totalBet) {
												_sndLib.play(_sndLib.sprite.counterEnd);
											}
											if(commonConfig.holdBigWinAnimation){
												this.currentBigwinName = "supermegawin";
												this.grayBg.interactive = true;
												this.grayBg.buttonMode = true;
												pixiLib.addEvent(this.grayBg, this.hideBigWinAnimation.bind(this), "click");
												_mediator.publish("setSpaceBarEvent", "hideBigWin");
											}else{
												this.currentBigwinName = "supermegawin";
												this.hideBigWinAnimation();}
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
view.hideBigWinAnimation = function(){
	var BigVariable = 2000;
	if(commonConfig.holdBigWinAnimation) {
		BigVariable = 20;
		this.grayBg.interactive = false
	}
	this.stopLoopSound();
	this.isBigWinRunning = false;
	setTimeout(this.playBigWinOutAnim.bind(this), BigVariable);
};
view.stopLoopSound = function(){
	for(var i = 0; i < this.loopSoundHowlerIdsP.length; i++){
		_sndLib.primSndCtr.stop(this.loopSoundHowlerIdsP[i]);
	}
	for(var i = 0; i < this.loopSoundHowlerIdsS.length; i++){
		_sndLib.sndCtr.stop(this.loopSoundHowlerIdsS[i]);
	}
	this.loopSoundHowlerIdsP = [];
	this.loopSoundHowlerIdsS = [];
}
view.setHowlerIds = function(data){
	if(data.idName === "counterLoop" || data.idName === "counterBigWinLoop" || data.idName === "counterMegaWinLoop" || data.idName === "counterSuperMegaWinLoop"){
		this.stopLoopSound();
		if(data.type === "primary"){
			this.loopSoundHowlerIdsP.push(data.id);
		}else if(data.type === "secondary"){
			this.loopSoundHowlerIdsS.push(data.id);
		}
	}


}
view.playBigWinOutAnim = function(){
	if(this.currentBigwinName === "bigwin"){	
		this.bigWinSpine.state.setAnimation(2, this.bigWinConfig.bigWin.bigWinOut, false);
		this.bigWinSpine.state.setAnimation(9, this.bigWinConfig.bigWin.bigWinOut, false);
	}else if(this.currentBigwinName === "megawin"){	
		this.bigWinSpine.state.setAnimation(5, this.bigWinConfig.superBigWin.superBigWinOut, false);
		this.bigWinSpine.state.setAnimation(9, this.bigWinConfig.superBigWin.superBigWinOut, false);
	}else if(this.currentBigwinName === "supermegawin"){	
		this.bigWinSpine.state.setAnimation(8, this.bigWinConfig.megaWin.megaWinOut, false);
		this.bigWinSpine.state.setAnimation(9, this.bigWinConfig.megaWin.megaWinOut, false);
	}
	_mediator.publish("playSpineAnimation", "idleAnimation");
	_sndLib.play(_sndLib.sprite.superMegaWinDisappear);
};
view.hideBigWin = function () {
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
view.hideBigAnimationComplete = function () {
	coreApp.gameView.decoratorContainer.removeChild(this.grayBg);
	this.removeChild(this.bigWinAmtTxt);
	this.removeChild(this.bigWinSpine);

	delete this.grayBg;
	delete this.bigWinAmtTxt;
	delete this.bigWinSpine;

	this.isResponsiveCalled = false;
	_mediator.publish("onBigWinShown");
};
view.onTotalWinResize = function () {
	if (this.grayBg) {
		this.grayBg.width = _viewInfoUtil.getWindowWidth();
		this.grayBg.height = _viewInfoUtil.getWindowHeight();
	}
	if (this.blackBg) {
		this.blackBg.width = _viewInfoUtil.getWindowWidth();
		this.blackBg.height = _viewInfoUtil.getWindowHeight();
	}
	if (this.bigWinConfig && this.bigWinConfig.setSize) {
		this.setSize(0, 0);
	}
};