function FeatureModel() {
	this.isFeatureActive = false;
}

var feature = FeatureModel.prototype;

feature.isActive = function () {
	return this.isFeatureActive;
}

feature.setFeatureState = function (bool){
	this.isFeatureActive = bool;
}

feature.getFeatureRoundData = function () {
	return this.featureData;
}
feature.setFeatureRoundData = function (obj) {
	this.isActive = (obj) ? true : false;
	this.featureData = obj;
}