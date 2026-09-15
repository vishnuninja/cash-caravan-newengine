function PaytableView(argument) {
	ViewContainer.call(this, arguments);
}

PaytableView.prototype = Object.create(ViewContainer.prototype);
PaytableView.prototype.constructor = PaytableView.prototype;

var view = PaytableView.prototype;

view.createView = function (argument) {
	this.createPaytablePages();
	this.createControls();
	this.hide();
};

view.createPaytablePages = function (argument) {

	// this.bg = pixiLib.getElement("Sprite", "info_bg")
	// this.addChild(this.bg);

	this.paytablePages =  pixiLib.getAnimatedSprite(["page_01","page_02","page_03"]);
	this.addChild(this.paytablePages);
	this.paytablePages.x = 634;
	this.paytablePages.y = 380;
	this.counter = 0;
};

view.createControls = function (argument) {
	this.controlpanelbg = pixiLib.getElement("Sprite", "controlpanelbg");
	this.addChild(this.controlpanelbg);

	this.controlpanelbg.x = 124;
	this.controlpanelbg.y = 614;	  

	this.prevBtn = pixiLib.getButton("paytablePreviousBtn");
	this.controlpanelbg.addChild(this.prevBtn);
	this.prevBtn.x = 350;
	this.prevBtn.y = 13;
	pixiLib.setInteraction(this.prevBtn, true);
	pixiLib.addEvent(this.prevBtn,  this.onPrevHandler.bind(this));

	this.nextBtn = pixiLib.getButton("paytableNextBtn");
	this.controlpanelbg.addChild(this.nextBtn);
	this.nextBtn.x = 621;
	this.nextBtn.y = 13;
	pixiLib.setInteraction(this.nextBtn, true);
	pixiLib.addEvent(this.nextBtn,  this.onNextHandler.bind(this));
	this.closeBtn = pixiLib.getButton("paytableCloseBtn");
	this.controlpanelbg.addChild(this.closeBtn);
	this.closeBtn.x = 489;
	this.closeBtn.y = 13;
	pixiLib.setInteraction(this.closeBtn, true);
	pixiLib.addEvent(this.closeBtn,  this.onCloseHandler.bind(this));
};


view.onCloseHandler = function (argument) {
	this.hide();
	_mediator.publish("onHidePaytable");
};

view.onNextHandler = function (argument) {
	this.counter++;
	/*if(this.counter>=2){
		pixiLib.setInteraction(this.closeBtn, false);
	}else{

	}*/
	this.paytablePages.gotoAndStop(this.counter);
};

view.onPrevHandler = function (argument) {
	this.counter--;
	this.paytablePages.gotoAndStop(this.counter);
};

view.createAllEvents = function (argument) {
	// body...
};

view.resize = function (argument) {
	for (var i = 0; i < viewConfig.length; i++) {
		UIUtils.setProperties(this[this.viewConfig[i].id], this.viewConfig[i].props);
	}
};

view.show = function (argument) {
	this.visible = true;
	this.paytablePages.gotoAndStop(0);
};

view.hide = function (argument) {
	this.visible = false;
};

view.destroy = function (argument) {
	this.destroy();
};
