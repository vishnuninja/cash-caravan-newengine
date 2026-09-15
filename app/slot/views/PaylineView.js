function PaylineView(argument) {
	ViewContainer.call(this, arguments);
}

PaylineView.prototype = Object.create(ViewContainer.prototype);
PaylineView.prototype.constructor = PaylineView.prototype;

var view = PaylineView.prototype;

view.createView = function (argument) {
	this.paylinesAry = [];
	/*
	payline types: 
	1. static
		"lineNum": [
			{ animationDuration: 3000, winSound: { name: "sSym" } }, 
			{ "imgName":"line1", props: { scale: 1.1 }, "type": "sprite" }
		],
	2. sprites:
		"lineNum": [
			{ animationDuration: 3000, winSound: { name: "sSym" } }, 
			{ "prefix": "scatter_", "startIndex": "0", "endIndex": "49", "digit": "dual", "animationSpeed": "0.3", "loop": false, props: { scale: 1.1 }, "type": "spriteAnimation" }
		],
	3. spine:
		"lineNum": [
			{ animationDuration: 2000, winSound: { name: "cSym" }, offset: { x: 0, y: 4 } }, 
			{ spineName: "girl", defaultAnimation: "idle", winAnimation: "win", loop: false, props: { scale: 0.45 }, type: "spine" }
	],
	*/
	if(_ng.isSecondaryAssetsLoaded){
		this.createpaylines();
	}	
};
view.createpaylines = function (){
	this.paylineConfig = _ng.GameConfig.paylinesConfig ? _ng.GameConfig.paylinesConfig : [];
	this.paylinesAry = [];

	for(var k in this.paylineConfig){
		if(this.paylineConfig[k][1].type === "spine"){//spine
			this["line"+k] = pixiLib.getElement("Spine", this.paylineConfig[k][1].spineName);//winAnimation
			this["line"+k].animName = this.paylineConfig[k][1].winAnimation;
			this["line"+k].state.setAnimation(0, this.paylineConfig[k][1].winAnimation, false);
		}else if(this.paylineConfig[k][1].type === "spriteAnimation"){//spriteAnimation
			this["line"+k] = pixiLib.getElement("AnimatedSprite", this.paylineConfig[k][1]);
		}else{//imgName
			this["line"+k] = pixiLib.getElement("Sprite", this.paylineConfig[k][1].imgName);
		}

		this["line"+k].type = this.paylineConfig[k][1].type;
		this.addChild(this["line"+k]);
		pixiLib.setProperties(this["line"+k], this.paylineConfig[k][1].props);
		this.paylinesAry.push(this["line"+k]);
	}

	this.hideAllLinesNew();
	// this.visible = false;	
}

view.hideAllLinesNew = function () {
	if(this.paylinesAry.length>0){
		for (var i = 0; i < this.paylinesAry.length; i++) {
			this.paylinesAry[i].visible = false;
		}
	}
};
view.getTextures = function (obj) {
	var ary = [];
	for (var i = 1; i <= obj.end; i++) {
		var counter = i<10? "0"+i : i;
		ary.push(obj.prefix+counter);
	}
	return ary;
}


view.showAllLines = function () {
	for (var i = 0; i < this.paylinesAry.length; i++) {
		this.paylinesAry[i].visible = true;
		if(this.paylinesAry[i].type === "spine"){
			this.paylinesAry[i].state.setAnimation(0, this.paylinesAry[id-1].animName, false);
		}
	}
};

view.showMultiLines = function (winLinesAry) {
	if(this.paylinesAry.length>0){
		this.hideAllLines();
		for (var i = 0; i < this.paylinesAry.length; i++) {
			for (var j = 0; j < winLinesAry.length; j++) {
				if(winLinesAry[j] == i){
					this.paylinesAry[i].visible = true;
					if(this.paylinesAry[i].type === "spine"){
						this.paylinesAry[i].state.setAnimation(0, this.paylinesAry[id-1].animName, false);
					}	
				}
			}
			
		}
	}
};

view.showSingleLine = function (id) {
	this.hideAllLines();
	if(this.paylinesAry.length>0){
		this.paylinesAry[id-1].visible = true;
		if(this.paylinesAry[id-1].type === "spine"){
			this.paylinesAry[id-1].state.setAnimation(0, this.paylinesAry[id-1].animName, false);
		}
	}
};


view.hideAllLines = function () {
	// if(this.paylinesAry.length>0){
	// 	for (var i = 0; i < this.paylinesAry.length; i++) {
	// 		this.paylinesAry[i].visible = false;
	// 	}
	// }
};



view.resize = function (argument) {
	// for (var i = 0; i < viewConfig.length; i++) {
	// 	UIUtils.setProperties(this[this.viewConfig[i].id], this.viewConfig[i].props);
	// }
};

view.show = function () {
	this.visible = true;
};

view.hide = function () {
	this.visible = false;
};

view.destroy = function () {
	this.destroy();
};
