var gEW = ErrorView.prototype;

gEW.hide = function () {
	if(coreApp.gameController.allReelsStopped) {
		TweenMax.to(this.blackCover, 0.5, {
			alpha: 0,
			onComplete: function () {
				this.blackCover.visible = false;
			}.bind(this)
		});
		TweenMax.to(this.popupParent, 0.5, {
			alpha: 0,
			onComplete: function () {
				this.popupParent.visible = false;
			}.bind(this)
		});
		_sndLib.play(_sndLib.sprite.hidePopup);
		_mediator.publish("errorClose", {event: this.eventToPublish});
	}
};

gEW.updatePopup = function (params) {
	this.description2.visible = false;
	if(params.code === "PROMO_FREE_SPINS"){
		if(params.message){
			params.message = params.message.replace("XXX", coreApp.gameModel.getTotalPFS());
		}	
	}
	if(params.code === "PROMO_FREE_SPINS_ENDED"){
		if(coreApp.gameModel.getTotalPFSWin() > 0){
			this.description2.visible = true;
			pixiLib.setText(this.description2, pixiLib.getLiteralText("Total Bonus free spins win:") + " " + pixiLib.getFormattedAmount(coreApp.gameModel.getTotalPFSWin()));
		}
	}
	if (params.title) {
		this.setTitle(params.title);
	}
	if (params.message) {
		this.setDescription(params.message);
	}
	if (params.action) {
		this.setAction(params.action);
	}
	if (params.buttonText) {
		this.setButtonText(params.buttonText);
	}
	if (params.event){
		this.eventToPublish = params.event;
	}

	pixiLib.setProperties(this.continueBtn, this.viewConfig.continueBtn.props["VD"]);
	this.depositBtn.visible = false;


	if(params.code === "INSUF_BALL_001"){
		if(commonConfig.insufficientBalancePopup){
			this.depositBtn.visible = false;
			this.continueBtn.visible = false;
			if(commonConfig.insufficientBalancePopup.deposit){
				this.depositBtn.visible = true;
				pixiLib.setText(this.depositText, "DEPOSIT");
				if(commonConfig.insufficientBalancePopup.deposit.buttonText !== undefined){
					pixiLib.setText(this.depositBtn, commonConfig.insufficientBalancePopup.deposit.buttonText);
				}

				//Position to be centered but if continue button is also there move it accordingly.
				if(commonConfig.insufficientBalancePopup.continue){
					this.depositBtn.x = 137;
				}else{
					this.depositBtn.x = 0;
				}
			}
			if(commonConfig.insufficientBalancePopup.continue){
				this.continueBtn.visible = true;
				if(commonConfig.insufficientBalancePopup.continue.buttonText !== undefined){
					this.setButtonText(params.buttonText);
				}

				//Position to be centered but if deposit button is also there move it accordingly.
				if(commonConfig.insufficientBalancePopup.deposit){
					this.continueBtn.x = -137;		
				}else{
					this.continueBtn.x = 0;
				}
			}
		}else{
			this.depositBtn.visible = true;
			pixiLib.setText(this.depositText, "DEPOSIT");
		
			this.continueBtn.x = -137;
			this.depositBtn.x = 137;
		}

		pixiLib.addEvent(this.depositBtn, function () {
			_mediator.publish("openURL", { type: "deposit" });
		});

	}
}