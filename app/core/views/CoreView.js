var _ng = _ng || {};
_ng.CoreView = function (coreApp) {
	this.view = "CoreView";
	this.coreApp = coreApp;
	this.viewInfoUtil = this.coreApp.viewInfoUtil;
	this.stage = pixiLib.getContainer();

	this.createRenderer();
	this.addStageToDOM();
	this.addEvents();
	this.onResize();
};

var p = _ng.CoreView.prototype;

p.addEvents = function () {

	_mediator.subscribe(_events.core.onResize, function () {
		this.onResize();
	}.bind(this));

	_mediator.subscribe(_events.core.resizeRenderer, function () {
		this.resizeRenderer();
	}.bind(this));

	_mediator.subscribe(_events.core.startCreatingGame, function () {
		this.onStartCreatingGame();
	}.bind(this));

	this.stage.interactive = true;
	this.stage.buttonMode = false;
	pixiLib.addEvent(this.stage, this.onStageTouch);
};

p.onStageTouch = function () {
	_mediator.publish("onStageTouch");
};
p.onStartCreatingGame = function () { };

p.createRenderer = function () {
	//   if (pixiLib.isIOS()) {
	//     PIXI.settings.PRECISION_FRAGMENT = "highp";
	//   } else {
	// PIXI.settings.PRECISION_FRAGMENT = "mediump";
	//   }
	PIXI.settings.PRECISION_FRAGMENT = "highp";
	var DPR = window.devicePixelRatio > 1 ? 2 : 1;
	this.rendererOption = {
		resolution: 2,
		// antialias: true,
		autoDensity: true,
		backgroundColor: 0x000000
	};
	var w = this.coreApp.viewInfoUtil.getWindowWidth();
	var h = this.coreApp.viewInfoUtil.getWindowHeight();
	// this.renderer = new PIXI.Application(w, h, {forceCanvas:false, transparent:true, antialias: true});

	this.renderer = PIXI.autoDetectRenderer(w*2, h*2, this.rendererOption);
	globalThis.__PIXI_STAGE__ = this.stage;
    globalThis.__PIXI_RENDERER__ = this.renderer;

	this.renderer.autoDensity = true;
	this.renderer.resolution = 2;
	this.renderer.plugins.interaction.resolution = 2;
	// this.stage.interactionManager.resolution = this.renderer.resolution;
	// this.renderer.rootRenderTarget.resolution = 2;
	this.addTweenLibrary();	
};

p.addTweenLibrary = function () {
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);
}

p.removeLoadingScreen = function () {
	preloaderDestroy();
	TweenMax.to(this.loadingScreenController.view, 2, {
		alpha: 0,
		onComplete: function () {
			this.stage.removeChild(this.loadingScreenController.view);
			this.loadingScreenController.view.destroy();
			delete this.loadingScreenController;
			_mediator.publish(_events.core.loadingScreenRemoved);
		}.bind(this)
	});
};
p.createLoadingScreen = function () {
	var view = new _ng.LoadingScreenView();
	this.loadingScreenController = new _ng.LoadingScreenController(this);
	this.loadingScreenController.setView(view);
	this.stage.addChild(view);
	view.createView();
	// this.paytableController =  new PaytableController();
	// this.paytableController.setView(view);
	// this.mainContainer.addChild(view);
	// view.createView();

	//core preloader for init respose or preloading stage response 
    var gameWidth = _ng.GameConfig.gameLayout[this.coreApp.viewInfoUtil.viewType].width;
	var gameHeight = _ng.GameConfig.gameLayout[this.coreApp.viewInfoUtil.viewType].height;
	
	this.errorContainer = pixiLib.getElement();
	this.errorContainer.name = "errorContainer";
	this.stage.addChild(this.errorContainer);
	_ngFluid.call(this.errorContainer, {});
	this.errorContainer.setSize(gameWidth, gameHeight);
	this.errorContainer.onResize();
	
	var errorView = new CoreErrorView(this.errorContainer);
	this.errorControllerPre = new CoreErrorController(this);
	this.errorControllerPre.setView(errorView);
	errorView.createView();
};

p.removeCoreErrorPopup = function (){
	if(this.errorControllerPre.view.blackCover){
		this.stage.removeChild(this.errorControllerPre.view.blackCover);
	}
	this.stage.removeChild(this.errorContainer);
	this.errorContainer = null;
	this.errorControllerPre = null;
};
var tapedTwice = false;
function stopDoubleTapInRules(event) {
    if(!tapedTwice) {
        tapedTwice = true;
        setTimeout( function() { tapedTwice = false; }, 700 );
        return false;
    }
    event.preventDefault();
}
p.addStageToDOM = function () {
	var view = this.renderer.view;
	var canvasContainer = document.createElement("div");
	canvasContainer.setAttribute("id", "canvasContainer");
	document.body.appendChild(canvasContainer);

	canvasContainer.appendChild(view);

	var rulesFrame = document.getElementById("gameRules");
	rulesFrame.addEventListener("touchstart", stopDoubleTapInRules);
	// var paytableFrame = document.getElementById("gamePaytable");
	// iframe.src = "rules/treasuresofegypt.html";
	// iframe.name = "frame"
	// iframe.id = "rulesFrame"
	
	if (this.coreApp.isDesktop) {
		canvasContainer.appendChild(rulesFrame);
		// canvasContainer.appendChild(paytableFrame);
		canvasContainer.style.position = "absolute";
		canvasContainer.style.left = 0;
		canvasContainer.style.top = 0;
		view.style.position = "absolute";
		view.style.left = 0;
		view.style.top = 0;
		canvasContainer.style["box-shadow"] = "0px 3px 25px -2px rgba(0,0,0,0.75)";

		// iframe.style.width = "calc(100% - 100px)";
		// iframe.style.height = "calc(100% - 100px)";
		// iframe.style.position  = "relative";
		// iframe.style.top =  "5%";
		// iframe.style.left =  "5%";

		// canvasContainer.style.margin ="auto";
		//canvasContainer.style["margin-top"] ="80px";
		// canvasContainer.style.width ="1280px";
		// canvasContainer.style.height ="720px";
		// canvasContainer.style.padding ="0px";
	} else {
		canvasContainer.style.position = "absolute";
		view.style.position = "absolute";
		document.getElementsByTagName("head")[0].style.margin = "0px";
	}
	//view.style.

	// frames["frame"].location.host;

	view.webkitImageSmoothingEnabled = false;

	// if (pixiLib.getIsLocalSystem()) {
	// 	this.stats = new Stats();
	// 	this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
	// 	document.body.appendChild(this.stats.dom);
	// 	this.tickerRenderer = this.tickerRendererWithStats;
	// }
};
p.tickerRenderer = function () {
	this.renderer.render(this.stage);
};
p.tickerRendererWithStats = function () {
	this.stats.begin();
	this.renderer.render(this.stage);
	this.stats.end();
}
p.onResize = function () { };
p.resizeRenderer = function () {
	var w = this.coreApp.viewInfoUtil.getWindowWidth();
	var h = this.coreApp.viewInfoUtil.getWindowHeight();
	this.renderer.resize(w, h, this.rendererOption);
	
	this.renderer.resolution = 2;
	// if(this.renderer && this.renderer.rootRenderTarget) {
	// 	this.renderer.rootRenderTarget.resolution = 2;
	// }
	// this.renderer.resize(w-1, h);
	// this.renderer.resize(w, h);
	
	this.resizeCanvasContainer();

	if(this.errorContainer){
		var baseWidth = _ng.GameConfig.gameLayout[this.coreApp.viewInfoUtil.viewType].width;
		var baseHeight = _ng.GameConfig.gameLayout[this.coreApp.viewInfoUtil.viewType].height;
        this.errorContainer.setSize(baseWidth, baseHeight);
        this.errorContainer.onResize();
	}
};
p.resizeCanvasContainer = function () {
	if (this.coreApp.isDesktop && document.getElementById("canvasContainer") != null && this.coreApp) {
		var maxWidth = _ng.GameConfig.gameLayout["VD"].width;
		var maxHeight = _ng.GameConfig.gameLayout["VD"].height;
		var wWidth = window.innerWidth;
		var wHeight = window.innerHeight;
		var canvasMargin = 0.9;
		var ratio = Math.min(window.innerWidth / maxWidth, window.innerHeight / maxHeight) * canvasMargin;
		var x = (window.innerWidth - ratio * maxWidth) / 2;
		var y = (window.innerHeight - ratio * maxHeight) / 2;

		if (window.innerWidth * canvasMargin < maxWidth || window.innerHeight * canvasMargin < maxHeight) {
			document.getElementById("canvasContainer").style.margin = "initial";
			document.getElementById("canvasContainer").style.transform = "translate(" + x + "px, " + y + "px) scale(" + ratio + ")";
		} else {
			document.getElementById("canvasContainer").style.margin = "auto";
			document.getElementById("canvasContainer").style.transform = "translate(0, 0)";
		}
		
	}
	if (desktopFullScreen == true || desktopFullScreen == "true") {
		document.getElementById("canvasContainer").style.margin = "auto";
		document.getElementById("canvasContainer").style.transform = "translate(0, 0)";
		setupFullscreenMode();
	}
	setupFullscreenMode();
};

function animate() {
	coreApp.gameView.tickerRenderer();
	requestAnimationFrame(animate);
}

// $(window).on("blur focus", function (e) {
//     var prevType = $(this).data("prevType");

//     if (prevType != e.type) {   //  reduce double fire issues
//         switch (e.type) {
//             case "blur":
//                 console.log("blur");
//                 break;
//             case "focus":
//                 console.log("Focused");
//                 break;
//         }
//     }

//     $(this).data("prevType", e.type);
// })