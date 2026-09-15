var _events = {};
_events.core = {
    "loadingAssetsLoaded": "loadingAssetsLoaded",   //Dispatched when loading assets are loaded
    "loadProgress": "loadProgress",                 //Dispatched when primary assets loading is in progress. Contains 'loading percentage'
    "error": "error",                               //Published on Error, Contains 'Error Code', 'action to be taken', 'message type'
    "primaryAssetsLoaded": "primaryAssetsLoaded",   //Dispatched when primary Assets Loading is Completed
    "onResize": "onResize",
    "createLoadingScreen": "createLoadingScreen",
    "requestToServer": "requestToServer",           //To send request to server, should contain type parameter
    "loadPrimaryAssets": "loadPrimaryAssets",       //To start loading of primary assets
    "loadFonts": "loadFonts",
    "startCreatingGame": "startCreatingGame",       //To Initialize game, when primary assets loading Completed
    "initReceived": "initReceived",
    "gameCreationCompleted": "gameCreationCompleted",
    "loadSecondaryAssets": "loadSecondaryAssets",
    "secondaryAssetsLoaded": "secondaryAssetsLoaded",
    "loadingScreenRemoved": "loadingScreenRemoved", //Start loading Secondary assets after receing this
    "loadingCompleted": "loadingCompleted",         //Will be triggered after 500m of primaryAssetsLoaded
    "resizeRenderer": "resizeRenderer"
}