function ErrorView(argument) {
	this.container = argument.popupContainer;
	this.rContainer = argument.rPopupContainer;
	this.eventToPublish;
}

var view = ErrorView.prototype;

view.createView = function (argument) {
	this.viewConfig = _ng.GameConfig.errorPopup ? _ng.GameConfig.errorPopup : {};

	this.coverAlpha = 0.95;
	this.blackCover = pixiLib.getRectangleSprite(_viewInfoUtil.getWindowWidth(), _viewInfoUtil.getWindowHeight(), 0x000000);
	this.blackCover.alpha = this.coverAlpha;
	this.blackCover.visible = false;
	this.blackCover.interactive = true;
	this.blackCover.buttonMode = false;
	this.container.addChildAt(this.blackCover, 0);

	this.createPopup();

	this.onResize();
};

view.createPopup = function () {
	this.popupParent = pixiLib.getContainer();
	this.rContainer.addChild(this.popupParent);
	this.popupParent.visible = false;

	// Forcing viewType 
	// For now keeping only one config for all views.
	var viewType = _viewInfoUtil.viewType;
	var viewType = "VD";
	if (this.viewConfig.BG) {
		var config = this.viewConfig.BG;
		this.popupBG = pixiLib.getElement("Sprite", config.image);
		this.popupParent.addChild(this.popupBG);
		pixiLib.setProperties(this.popupBG, config.props[viewType]);
	}
	if (this.viewConfig.title) {
		var config = this.viewConfig.title;
		var style = (config.textStyle) ? config.textStyle : {};
		this.title = pixiLib.getElement("Text", style, "");
		this.popupParent.addChild(this.title);
		pixiLib.setProperties(this.title, config.props[viewType]);
	}
	if (this.viewConfig.description) {
		var config = this.viewConfig.description;
		var style = (config.textStyle) ? config.textStyle : {};
		style.wordWrap = true;
		style.wordWrapWidth = 550;
		this.description = pixiLib.getElement("Text", style, "");
		this.popupParent.addChild(this.description);
		pixiLib.setProperties(this.description, config.props[viewType]);

		//Adding description 2 only for bonus freespins end popup
		var config = this.viewConfig.description;
		var style = (config.textStyle) ? config.textStyle : {};
		style.wordWrap = true;
		style.wordWrapWidth = 550;
		style.fontSize = 22;
		this.description2 = pixiLib.getElement("Text", style, "");
		this.popupParent.addChild(this.description2);
		pixiLib.setProperties(this.description2, config.props[viewType]);
		this.description2.y = 90;
		this.description2.visible = false;
	}
	if (this.viewConfig.continueBtn) {
		var config = this.viewConfig.continueBtn;

		this.continueBtn = pixiLib.getContainer();
		this.popupParent.addChild(this.continueBtn);
		this.continueBtn.interactive = true;
		this.continueBtn.buttonMode = true;

		if (config.BG) {
			var buttonBG = pixiLib.getButton(config.BG.image);
			this.continueBtn.addChild(buttonBG);
			pixiLib.setProperties(buttonBG, config.BG.props[viewType]);
		}

		var style = (config.continueText.textStyle) ? config.continueText.textStyle : {};
		this.continueText = pixiLib.getElement("Text", style, "");
		this.continueBtn.addChild(this.continueText);

		pixiLib.setProperties(this.continueText, config.continueText.props[viewType]);
		pixiLib.setProperties(this.continueBtn, config.props[viewType]);

		//Create Deposit button also with continue button configs.
		//only position will change, which will be done dynamically

		var config = this.viewConfig.continueBtn;

		this.depositBtn = pixiLib.getContainer();
		this.popupParent.addChild(this.depositBtn);
		this.depositBtn.interactive = true;
		this.depositBtn.buttonMode = true;

		if (config.BG) {
			var buttonBG = pixiLib.getButton(config.BG.image);
			this.depositBtn.addChild(buttonBG);
			pixiLib.setProperties(buttonBG, config.BG.props[viewType]);
		}

		var style = (config.continueText.textStyle) ? config.continueText.textStyle : {};
		this.depositText = pixiLib.getElement("Text", style, "");
		this.depositBtn.addChild(this.depositText);

		pixiLib.setProperties(this.depositText, config.continueText.props[viewType]);
		pixiLib.setProperties(this.depositBtn, config.props[viewType]);

	}

	pixiLib.setProperties(this.popupParent, this.viewConfig.props[viewType]);
}
view.setTitle = function (title) {
	pixiLib.setText(this.title, title);
}
view.setDescription = function (msg) {
	pixiLib.setText(this.description, msg);
}
view.setButtonText = function (text) {
	pixiLib.setText(this.continueText, text);
}
view.setAction = function (action, event) {
	this.continueBtn.removeAllListeners();
	switch (action) {
		case 'reload':
			pixiLib.addEvent(this.continueBtn, pixiLib.reloadPage);
			break;
		case 'lobby':
			pixiLib.addEvent(this.continueBtn, this.gotolobby.bind(this));
			break;
		case 'close':
			pixiLib.addEvent(this.continueBtn, this.hide.bind(this));
			break;
	}
}
	
view.gotolobby = function () {
	_mediator.publish("openURL", { type: "lobby" });
}
		
view.updatePopup = function (params) {
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
					this.setButtonText(commonConfig.insufficientBalancePopup.continue.buttonText);
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
view.onResize = function (argument) {
	if (this.blackCover) {
		this.blackCover.width = _viewInfoUtil.getWindowWidth();
		this.blackCover.height = _viewInfoUtil.getWindowHeight();
	}
	pixiLib.setProperties(this.popupParent, this.viewConfig.props[_viewInfoUtil.viewType]);
};

view.show = function () {
	this.blackCover.alpha = 0;
	this.blackCover.visible = true;
	this.popupParent.alpha = 0;
	this.popupParent.visible = true;
	_sndLib.play(_sndLib.sprite.errorPopup);
	TweenMax.to(this.blackCover, 0.5, {
		alpha: this.coverAlpha
	});
	TweenMax.to(this.popupParent, 0.5, {
		alpha: 1
	});
};

view.hide = function () {
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
};