function IntroController() {
    // this.addEvents();
}
var ic = IntroController.prototype;
ic.setView = function (view) {
	this.view = view;
	this.createListeners();
};
ic.createListeners = function (argument) {
};