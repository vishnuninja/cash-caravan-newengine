var _ng = _ng || {};

_ng.CoreConfig = {
	appPath: "",
	corePath: "core/",
	slotPath: "slot/",
	//gameName will be added in CoreApp
	gamePath: "games/",
	coreAssetsPath: "games/common/dist/",
	coreBrandAssetsPath: "games/common/dist/",
	slotAssetsPath: "games/common/dist/",
	//gameName will be added in CoreApp
	gameAssetsPath: "games/",
	rootPath: "/sites/easy-slot/",
	//Game Dimensions for drawing canvas
	//Can be overridded in Slot/Game level
	baseGameLayout: {
        "VD": {width: 1280, height: 720},
        "VL": {width: 1280, height: 720},
        "VP": {width: 720, height: 1280}
	},
	revision: "1.1.5",
	coreSpriteSheets: {},
	
	//Preloader Assets, i.e. Loading Screen
	//Can be overridden in Slot/Game Level
	corePreloaderAssets: {
		VD: {},
		VL: {},
		VP: {}
	},
	coreFonts: {},
	corePreloaderFonts: {},
	//libraryFiles, reuired to load Game
	
	libraryFiles: [
		// "app/libs/pixi/pixi5.4.js",
		// "app/libs/pixi/pixi.js",
		// "app/libs/pixi/pixi-spine.js",
		// "app/libs/pixi/pixi-particles.js",
		// "app/libs/pixi/pixi-multistyle-text.js",
		"app/libs/pixi/pixi.min.js",
		"app/libs/pixi/pixi-legacy.min.js",
		"app/libs/howler/howler.min.js",
		"app/libs/mediator/mediator.min.js",
		"app/libs/stats/stats.min.js",
		"app/libs/impetus/impetus.min.js",
		"app/libs/greensock/TweenMax.min.js",
		"app/libs/screenfull/screenfull.js",
		"app/libs/localeplanet/translate.js",
		"app/libs/currency/currency.min.js",
		"app/libs/fontfaceobserver/fontfaceobserver.standalone.js"
	],
	coreFiles: {
		common: [
			"app/core/app/PIXIUtil.js",
			// "app/core/app/CoreApp.js",
			"app/core/app/ViewInfoUtil.js",
			"app/core/app/ngFluid.js", 
			"app/core/app/CoreEvents.js",
			"app/core/app/SoundLib.js",
			"app/core/models/CoreModel.js",
			"app/core/views/ViewContainer.js",
			"app/core/views/LoadingScreenView.js",
			"app/core/views/CoreView.js",			
			"app/core/views/CoreErrorView.js",
			"app/core/views/ErrorView.js",
			// "app/core/configs/CoreConfig.js",
			"app/core/controllers/CoreController.js",
			"app/core/controllers/LoadingScreenController.js",
			"app/core/controllers/CoreErrorController.js",			
			"app/core/controllers/ErrorController.js",			
			"app/core/services/CoreService.js"			
		],
		Desktop: [],
		Mobile: []
	},
	coreLoadingAssets: {
		common: {
			allResolutions: ["preassets.json", "common.json"],
			"@2x": []
		}
		// "Desktop": {
		//     "allResolutions": ["coreDesktop"],
		//     "@2x": ["coreDesktop2x"]
		// },
		// "Mobile": {
		//     "allResolutions": ["coreMobile"],
		//     "@2x": ["coreMobile2x"]
		// }
	},
	corePrimaryAssets: {
		common: {
			allResolutions: [],
			"@2x": []
		}
		// "Desktop": {
		//     "allResolutions": ["coreDesktop"],
		//     "@2x": ["coreDesktop2x"]
		// },
		// "Mobile": {
		//     "allResolutions": ["coreMobile"],
		//     "@2x": ["coreMobile2x"]
		// }
	}	
};
