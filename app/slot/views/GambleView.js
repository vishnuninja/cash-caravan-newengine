function GambleView(argument) {
	ViewContainer.call(this, arguments);
}

GambleView.prototype = Object.create(ViewContainer.prototype);
GambleView.prototype.constructor = GambleView.prototype;

var view = GambleView.prototype;

view.createView = function (argument) {
	console.log(" core gamble ");
	this.hide();
};
view.onCollectClick = function (){
	//close bonus round 
	this.toggleWinButtons(false);
	this.hide();
	//trigger to show win from gamble and update balance 
}
view.onContinueClick = function (){
	this.msgTxt.text = "CHOOSE RED OR BLUE SCARAB TO GAMBLE OR TAKE WIN";
	this.toggleOption(true);
	this.currentBet = coreApp.gameModel.gambleData.winAmount;
	this.betAmountTxt.text = pixiLib.getFormattedAmount(this.currentBet);
	this.winAmountTxt.text = "";
	this.toggleWinButtons(false);
}

view.toggleWinButtons = function(bool){
	this.continueBtn.visible = bool;
	this.collectBtn.visible = bool;
	pixiLib.setInteraction(this.collectBtn, bool);
	pixiLib.setInteraction(this.continueBtn, bool);
}

view.onGambleResponse = function (){
	setTimeout(this.delayResult.bind(this), 1200);
}
view.delayResult = function(){
}
view.toggleOption = function (bool){
	
	pixiLib.setInteraction(this.redBtn, bool);
	pixiLib.setInteraction(this.blueBtn, bool);
	if(bool == true){
		this.msgTxt.text = "CHOOSE RED OR BLUE SCARAB TO GAMBLE OR TAKE WIN";
		this.redYoyo = TweenMax.to(this.redBtn.scale, 0.5, {x:0.8, y:0.8, yoyo:true, repeat:-1} );
		this.blueYoyo = TweenMax.to(this.blueBtn.scale, 0.5, {x:0.8, y:0.8, yoyo:true, repeat:-1} );
	}else{
		if(this.redYoyo){
			this.redYoyo.kill();
			this.blueYoyo.kill();	
		}
	}
	
}

view.onPickGamble = function(){
	this.msgTxt.text = "GOOD LUCK";
	console.log(" ==== picked ==== ");

	_mediator.publish("callGambleRequest", {
		"position": 1,
		"betAmount": this.currentBet 
	});

	this.toggleOption(false);

	//play card rotation animations here 
	this.cardRotationAnim(true);
}

view.createAllEvents = function (argument) {
	// body...
};

view.resize = function (argument) {
};

view.show = function (argument) {
};

view.hide = function (argument) {
};

view.destroy = function (argument) {
};
