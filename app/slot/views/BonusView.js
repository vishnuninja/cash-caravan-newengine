function BonusView(argument) {
	this.parent = argument.parent;
	ViewContainer.call(this, arguments);
}

BonusView.prototype = Object.create(ViewContainer.prototype);
BonusView.prototype.constructor = BonusView;

var view = BonusView.prototype;

view.createView = function (argument) {
	// console.log("win view created ");
	/*this.viewConfig = slotConfig.BonusUiConfig;
	for (var i = 0; i <this.viewConfig.length; i++) {
		this[this.viewConfig[i].id] = this.getElement(this.viewConfig[i]);
		this.addChild(this[this.viewConfig[i].id]);
		UIUtils.setProperties(this[this.viewConfig[i].id], this.viewConfig[i].props);

		//if children exsits
		if(this.viewConfig[i].type ==="container" && this.viewConfig[i].children){
			var tempChildren = this.viewConfig[i].children;

			for (var j = 0; j < tempChildren.length; j++) {
				this[this.viewConfig[i].id][tempChildren[j].id] = UIUtils.getElement(tempChildren[j]);
				var temp = this[this.viewConfig[i].id][tempChildren[j].id];
				this[this.viewConfig[i].id].addChild(temp);
				UIUtils.setProperties(temp, tempChildren[j].props);
			}
		}
	}

	this.createAllEvents();*/
};

view.createAllEvents = function (argument) {
	// body...
};

view.resize = function (argument) {
	/*for (var i = 0; i < viewConfig.length; i++) {
		UIUtils.setProperties(this[this.viewConfig[i].id], this.viewConfig[i].props);
	}*/
};

view.show = function (argument) {
	this.visible = true;
};

view.hide = function (argument) {
	this.visible = false;
};

view.destroy = function (argument) {
	this.destroy();
};
view.onCloseBonusRound = function(){

};