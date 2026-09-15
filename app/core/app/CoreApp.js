var _ng = _ng || {},
    coreApp;

var filesLoaded = 0;
var filesLoadArray = [];
_ng.CoreApp = function (gameName) {
    "use strict";
    _ng.siteCode = "SCNCSSC";
    _ng.siteCode = _ng.siteCode.toUpperCase();
    this.amountType = this.getUrlVar("amount_type") || "1";
    this.isDemoMode = (this.amountType === "4") ? true : false;

    if (appPath !== "") {
        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = appPath + 'games/favicon.ico';
    }


    this.gameName = gameName;
    this.gameType = 'slots';

    this.isDesktop = this.isDesktop();
    this.device = this.isDesktop ? 'Desktop' : 'Mobile';
    this.resolution = "@1x";
    this.currency = '$';
    this.loadIndex = 0;
    this.corePath = "";
    this.slotPath = "";
    this.gamePath = "";

    //to check if both Sprites & Fonts are loaded.
    this.isLoadingAssetsLoaded = 1;
    this.isPrimaryAssetsLoaded = 1;
    this.isSecondaryAssetsLoaded = 1;

    this.documentHidden = '';
    this.visibilityChangeEvent = '';
    if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
        this.documentHidden = 'hidden';
        this.visibilityChangeEvent = 'visibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
        this.documentHidden = 'msHidden';
        this.visibilityChangeEvent = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
        this.documentHidden = 'webkitHidden';
        this.visibilityChangeEvent = 'webkitvisibilitychange';
    }

    // this.revision = commonConfig.revision || _ng.CoreConfig.revision;
    this.revision = version;

    this.setLoadingPaths();
    this.loadedAssets = {};
    //First Load all config files
    //To know if there are any overridden Lib/Core files
    this.loadJSFiles(0);
};

_ng.CoreApp.prototype.constructor = _ng.CoreApp;

//Initialize translate.js for Localization Literals
_ng.CoreApp.prototype.setLiteralTranslations = function () {
    var literals = {};
    if (coreLiterals) {
        Object.assign(literals, coreLiterals);
    }
    // if (slotLiterals) {
    //     Object.assign(literals, slotLiterals);
    // }
    if (gameLiterals) {
        Object.assign(literals, gameLiterals);
    }

    _.setTranslation(literals);


    this.rulesData = Object.assign(coreRules, gameRules);
    // this.paytableData = Object.assign({}, gamePaytable);
}
_ng.CoreApp.prototype.setCurrency = function () {
    // const USD = value => currency(value);
    // const JPY = value => currency(value, { precision: 0, symbol: '¥' });
    // const EURO = value => currency(value, { symbol: '€', decimal: ',', separator: '.' });

    var currencyCode = (commonConfig.isForceCurrency) ? commonConfig.isForceCurrency : this.gameModel.getCurrencyCode();
    var cPrecision = this.gameModel.panelModel.currencyPrecision;

    switch (currencyCode) {
        case "es_es":
            this.langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('€');
            break;
        case "de":
            this.langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: '.', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('€');
            break;
        case "pln":
            this.langFormat = value => currency(value, { symbol: 'zł', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('zł');
            break;
        case "fr":
            this.langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('€');
            break;
        case "krw":
            this.langFormat = value => currency(value, { symbol: '₩', separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('₩');
            break;
        case "rub":
            this.langFormat = value => currency(value, { symbol: '₽', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('₽');
            break;
        case "jpy":
            this.langFormat = value => currency(value, { symbol: '￥', separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('￥');
            break;
        case "sek":
            this.langFormat = value => currency(value, { symbol: 'kr', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('kr');
            break;
        case "dkk":
            this.langFormat = value => currency(value, { symbol: 'kr', pattern: `# !`, separator: '.', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('kr');
            break;
        case "nok":
            this.langFormat = value => currency(value, { symbol: 'kr', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('kr');
            break;
        case "pt_pt":
            this.langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('€');
            break;
        case "myr":
            this.langFormat = value => currency(value, { symbol: '‎RM ', separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('‎RM');
            break;
        case "thb":
            this.langFormat = value => currency(value, { symbol: '฿', pattern: `# !`, separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('฿');
            break;
        case "sr_la":
            this.langFormat = value => currency(value, { symbol: '£', pattern: `# !`, separator: '.', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('£');
            break;
        case "try":
            this.langFormat = value => currency(value, { symbol: '₺', separator: '.', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('₺');
            break;
        case "ron":
            this.langFormat = value => currency(value, { symbol: 'lei', pattern: `# !`, separator: '.', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('lei');
            break;
        case "vnd":
            this.langFormat = value => currency(value, { symbol: '₫', pattern: `# !`, separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('₫');
            break;
        case "lv":
            this.langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('€');
            break;
        case "lt":
            this.langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('€');
            break;
        case "idr":
            this.langFormat = value => currency(value, { symbol: 'Rp ', separator: '.', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('Rp');
            break;
        case "it":
            this.langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: '.', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('€');
            break;
        case "bgn":
            this.langFormat = value => currency(value, { symbol: 'Лв', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('Лв');
            break;
        case "fi":
            this.langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('€');
            break;
        case "twd":
            this.langFormat = value => currency(value, { symbol: 'NT$', separator: ',', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('NT$');
            break;
        case "cny":
            this.langFormat = value => currency(value, { symbol: '¥ ', separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('¥');
            break;
        case "ar":
            this.langFormat = value => currency(value, { symbol: 'د.إ ', separator: '', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('د.إ');
            break;
        case "czk":
            this.langFormat = value => currency(value, { symbol: 'Kč', pattern: `# !`, separator: ' ', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('Kč');
            break;
        case "nl":
            this.langFormat = value => currency(value, { symbol: '€', separator: '.', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('€');
            break;
        case "gbp":
            if (this.lang === "sr_la") {
                this.langFormat = value => currency(value, { symbol: 'RSD ', pattern: `# !`, separator: '.', decimal: ',', precision: cPrecision });
                pixiLib.setCurrency('RSD');
            } else {
                this.langFormat = value => currency(value, { symbol: '£', separator: ',', decimal: '.', precision: cPrecision });
                pixiLib.setCurrency('£');
            }
            break;
        case "el_gr":
            this.langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: '.', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('€');
            break;
        case "huf":
            this.langFormat = value => currency(value, { symbol: 'Ft', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('Ft');
            break;
        case "pt_br":
            this.langFormat = value => currency(value, { symbol: '$', separator: '.', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('$');
            break;
        case "uah":
            this.langFormat = value => currency(value, { symbol: '₴', separator: '.', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('₴');
            break;
        case "ars":
            this.langFormat = value => currency(value, { symbol: '$', separator: '.', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('$');
            break;
        case "aud":
            this.langFormat = value => currency(value, { symbol: '$', separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('$');
            break;
        case "brl":
            this.langFormat = value => currency(value, { symbol: 'R$', separator: '.', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('R$');
            break;
        case "cad":
            this.langFormat = value => currency(value, { symbol: '$', separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('$');
            break;
        case "hrk":
            this.langFormat = value => currency(value, { symbol: 'kn', pattern: `# !`, separator: '.', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('kn');
            break;
        case "gel":
            this.langFormat = value => currency(value, { symbol: 'ლ', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('ლ');
            break;
        case "ghs":
            this.langFormat = value => currency(value, { symbol: 'GH¢', separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('GH¢');
            break;
        case "hkd":
            this.langFormat = value => currency(value, { symbol: 'HK$', separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('HK$');
            break;
        case "isk":
            this.langFormat = value => currency(value, { symbol: 'kr', separator: '.', decimal: ',', precision: cPrecision });
            pixiLib.setCurrency('kr');
            break;
        case "mxn":
            this.langFormat = value => currency(value, { symbol: '$', separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('$');
            break;
        case "nzd":
            this.langFormat = value => currency(value, { symbol: '$', separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('$');
            break;
        case "pen":
            this.langFormat = value => currency(value, { symbol: 'S/', separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('S/');
            break;
        case "php":
            this.langFormat = value => currency(value, { symbol: '₱', separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('₱');
            break;
        case "sgd":
            this.langFormat = value => currency(value, { symbol: 'S$', separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('S$');
            break;
        case "zar":
            this.langFormat = value => currency(value, { symbol: 'R', separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('R');
            break;
        case "chf":
            this.langFormat = value => currency(value, { symbol: 'CHf ', separator: ' ', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('CHf');
            break;
        case "usd":
            this.langFormat = value => currency(value, { symbol: '$', separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('$');
            break;
        case "amd":
            this.langFormat = value => currency(value, { symbol: '֏', separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('֏');
            break;
        case "ubtc":
            this.langFormat = value => currency(value, { symbol: 'μBTC', separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('μBTC');
            break;
        case "trx":
            this.langFormat = value => currency(value, { symbol: 'TRX', separator: ',', decimal: '.', precision: cPrecision });
            pixiLib.setCurrency('TRX');
            break;
        case "eur":
            if (this.lang === "pt_pt") {
                this.langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
                pixiLib.setCurrency('€');
            } else if (this.lang === "lv") {
                this.langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
                pixiLib.setCurrency('€');
            } else if (this.lang === "lt") {
                this.langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
                pixiLib.setCurrency('€');
            } else if (this.lang === "en") {
                this.langFormat = value => currency(value, { symbol: '€', separator: ',', decimal: '.', precision: cPrecision });
                pixiLib.setCurrency('€');
            } else if (this.lang === "es_es") {
                this.langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
                pixiLib.setCurrency('€');
            } else if (this.lang === "de") {
                this.langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: '.', decimal: ',', precision: cPrecision });
                pixiLib.setCurrency('€');
            } else if (this.lang === "fr") {
                this.langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
                pixiLib.setCurrency('€');
            } else if (this.lang === "it") {
                this.langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: '.', decimal: ',', precision: cPrecision });
                pixiLib.setCurrency('€');
            } else if (this.lang === "fi") {
                this.langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',', precision: cPrecision });
                pixiLib.setCurrency('€');
            } else {
                this.langFormat = value => currency(value, { symbol: '€', separator: ',', decimal: '.', precision: cPrecision });
                pixiLib.setCurrency('€');
            }
            break;
        default:
            this.langFormat = value => currency(value, { symbol: this.gameModel.getCurrencyCode(), separator: ',', decimal: '.', precision: cPrecision });
    }
}
_ng.CoreApp.prototype.setLanguage = function () {
    this.lang = sessionStorage.Language.toLowerCase();
    if (commonConfig.languageCodeMapping && commonConfig.languageCodeMapping[this.lang]) {
        this.lang = commonConfig.languageCodeMapping[this.lang];
    }
    if (commonConfig.availableLanguages && commonConfig.availableLanguages.indexOf(this.lang) >= 0) {
        // this.lang = "en";
    } else {
        this.lang = "en";
    }
    this.lang = this.lang.toLowerCase();
    lang = this.lang;
    this.gameLangAssetsPath = _ng.GameConfig.gameAssetsPath + "lang/" + this.lang + "/";

    this.setLangDisplayName();
}
_ng.CoreApp.prototype.setLangDisplayName = function () {
    if (_ng.GameConfig.langDisplayName) {
        if (_ng.GameConfig.langDisplayName[this.lang]) {
            _ng.GameConfig.displayName = _ng.GameConfig.langDisplayName[this.lang];
        }
    }
}
_ng.CoreApp.prototype.setLoadingPaths = function () {
    this.coreBrandAssetsPath = appPath + _ng.CoreConfig.coreBrandAssetsPath + "/";
    this.corePath = appPath + _ng.CoreConfig.corePath;
    this.slotPath = appPath + _ng.CoreConfig.slotPath;
    this.gamePath = appPath + _ng.CoreConfig.gamePath + this.gameName + "/src/";
    _ng.CoreConfig.gamePath = this.gamePath;

    this.coreAssetsPath = appPath + _ng.CoreConfig.coreAssetsPath;
    this.slotAssetsPath = appPath + _ng.CoreConfig.slotAssetsPath;
    this.gameAssetsPath = appPath + _ng.CoreConfig.gameAssetsPath + this.gameName + "/dist/";

    _ng.CoreConfig.gameAssetsPath = this.gameAssetsPath;
}

_ng.CoreApp.prototype.isDesktop = function () {
    return !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent));
};

_ng.CoreApp.prototype.loadJSFiles = function (loadingIndex) {

    filesLoadArray.push(this.slotPath + "configs/SlotConfig.js");
    filesLoadArray.push(this.gamePath + "configs/GameConfig.js");
    filesLoadArray.push(this.gamePath + "configs/LoadConfig.js");
    filesLoadArray.push(this.gamePath + "configs/PanelConfig.js");
    filesLoadArray.push(this.gamePath + "configs/UIConfig.js");
    filesLoadArray.push(this.gamePath + "configs/ReelViewUIConfig.js");

    this.loadSingleScript(filesLoadArray[filesLoaded], this.onConfigJSFileLoad.bind(this));

}

_ng.CoreApp.prototype.onConfigJSFileLoad = function () {
    if (filesLoaded < filesLoadArray.length - 1) {
        filesLoaded++;
        this.loadSingleScript(filesLoadArray[filesLoaded], this.onConfigJSFileLoad.bind(this));
    } else {

        var mergedConfig = {};
        mergedConfig.ReelViewUiConfig = {};
        Object.assign(mergedConfig, _ng.CoreConfig);
        Object.assign(mergedConfig, _ng.SlotConfig);
        Object.assign(mergedConfig, _ng.GameConfig);
        Object.assign(mergedConfig, _ng.LoadConfig);
        Object.assign(mergedConfig, _ng.PanelConfig);
        Object.assign(mergedConfig, _ng.UIConfig);
        Object.assign(mergedConfig.ReelViewUiConfig, _ng.ReelViewUiConfig)

        delete _ng.CoreConfig;
        delete _ng.SlotConfig;
        delete _ng.GameConfig;
        delete _ng.LoadConfig;
        delete _ng.PanelConfig;
        delete _ng.UIConfig;
        delete _ng.ReelViewUiConfig;

        _ng.GameConfig = {};
        Object.assign(_ng.GameConfig, mergedConfig);


        filesLoaded = 0;
        filesLoadArray = [];
        filesLoadArray = filesLoadArray.concat(_ng.GameConfig.libraryFiles);
        filesLoadArray = filesLoadArray.concat(_ng.GameConfig.coreFiles.common);
        filesLoadArray = filesLoadArray.concat(_ng.GameConfig.coreFiles[this.device]);
        
        /*FOR LOADING CYPRUS SPECIFIC CORE FILES*/
        if(_ng.GameConfig.CyprusCore){
                filesLoadArray = filesLoadArray.concat(_ng.GameConfig.slotFiles.CyprusCommon);
                filesLoadArray = filesLoadArray.concat(_ng.GameConfig.slotFiles["Cyprus"+this.device]);
        } else{
            filesLoadArray = filesLoadArray.concat(_ng.GameConfig.slotFiles.common);
            filesLoadArray = filesLoadArray.concat(_ng.GameConfig.slotFiles[this.device]);
        }
        var tempArr = _ng.GameConfig.gameFiles.common;
        tempArr = tempArr.concat(_ng.GameConfig.gameFiles[this.device]);
        for (let i = 0; i < tempArr.length; i++) {
            tempArr[i] = this.gamePath + tempArr[i];
        }
        filesLoadArray = filesLoadArray.concat(tempArr);
        this.loadSingleScript(filesLoadArray[filesLoaded], this.onJSFileLoad.bind(this));
    }

}
_ng.CoreApp.prototype.onJSFileLoad = function () {

    if (filesLoaded < filesLoadArray.length - 1) {
        filesLoaded++;
        this.loadSingleScript(filesLoadArray[filesLoaded], this.onJSFileLoad.bind(this));
    } else {
        this.setLanguage();
        this.initializeGame();
    }
}

_ng.CoreApp.prototype.mergeConfig = function () {
    var mergedConfig = {};
    mergedConfig.ReelViewUiConfig = {};
    Object.assign(mergedConfig, _ng.CoreConfig);
    Object.assign(mergedConfig, _ng.SlotConfig);
    Object.assign(mergedConfig, _ng.GameConfig);
    Object.assign(mergedConfig, _ng.LoadConfig);
    Object.assign(mergedConfig, _ng.PanelConfig);
    Object.assign(mergedConfig, _ng.UIConfig);
    Object.assign(mergedConfig.ReelViewUiConfig, _ng.ReelViewUiConfig)

    delete _ng.CoreConfig;
    delete _ng.SlotConfig;
    delete _ng.GameConfig;
    delete _ng.LoadConfig;
    delete _ng.PanelConfig;
    delete _ng.UIConfig;
    delete _ng.ReelViewUiConfig;

    _ng.GameConfig = {};
    Object.assign(_ng.GameConfig, mergedConfig);
    this.setLanguage();
}


_ng.CoreApp.prototype.setURLs = function () {
    var gameURL = new URL(window.location.href);
    _ng.GameConfig.urls.lobbyURL = gameURL.searchParams.get("lobby_url") || commonConfig.lobbyURL; //"../lobby";
    _ng.GameConfig.urls.depositURL = gameURL.searchParams.get("deposit_url") || _ng.GameConfig.urls.lobbyURL;
    _ng.GameConfig.urls.depositURL = _ng.GameConfig.urls.depositURL.replace("::", "&");
    _ng.GameConfig.urls.lobbyURL = _ng.GameConfig.urls.lobbyURL.replace("::", "&");
}
_ng.CoreApp.prototype.onSiteConfigLoaded = function () {

    if (commonConfig.loadingScreenConfig.soundFile) {
        _sndLib.loadSpecificSound(appPath + commonConfig.loadingScreenConfig.soundFile);
    }

    this.setLanguage();
    this.setURLs();
    this.loadLiteralFiles();
    // this.startAssetsLoading();
}
_ng.CoreApp.prototype.loadLiteralFiles = function () {
    var files = [
        appPath + "games/rules/" + this.lang + "/data/common.js",
        appPath + "games/rules/" + this.lang + "/data/" + this.gameName + ".js"
    ];
    this.counter = 0;
    for (var i = 0; i < files.length; i++) {
        this.loadSingleScript(files[i] + '?ver=' + this.revision, this.onLoadLiteralFiles.bind(this));
    }
}
_ng.CoreApp.prototype.onLoadLiteralFiles = function () {
    this.counter++;
    if (this.counter === 2) {
        this.startAssetsLoading();
    }
}
_ng.CoreApp.prototype.initializeGame = function () {
    if (_ng.siteCode.length > 0) {
        this.loadSingleScript([appPath + "games/common/src/addon.js" + '?ver=' + this.revision], this.onAddonConfigLoad.bind(this), this.onSiteConfigLoadError.bind(this));
    } else {
        this.onSiteConfigLoaded();
    }
}
_ng.CoreApp.prototype.onAddonConfigLoad = function (data) {
    if (commonConfig.availableSiteCodes.length > 0 && commonConfig.availableSiteCodes.includes(_ng.siteCode)) {
        this.loadSingleScript([appPath + "games/common/src/siteConfig/" + _ng.siteCode + ".js" + '?ver=' + this.revision], this.onSiteConfigLoaded.bind(this), this.onSiteConfigLoadError.bind(this));
    } else {
        this.onSiteConfigLoaded();
    }
}
_ng.CoreApp.prototype.onSiteConfigLoadError = function (data) {
    //Loading game normally if even if SiteConfig is not loaded.
    this.onSiteConfigLoaded();
}
_ng.CoreApp.prototype.startAssetsLoading = function () {
    document.title = _ng.GameConfig.displayName+"-"+version;;
    this.initLibsClasses();
    this.initializeCoreClasses();
    this.addEvents();
    animate();

    this.loadLoadingAssets();
}

/*
 * Function to get the files list for assets downloding
 */
_ng.CoreApp.prototype.getAssetsToLoadList = function (fileList) {
    var fetchResolutionFiles = function (resolutionFileList) {
        var resolutionAssetsList = [];
        if ("allResolutions" in resolutionFileList) {
            resolutionAssetsList = resolutionAssetsList.concat(resolutionFileList["allResolutions"]);
        }
        if (this.resolution in resolutionFileList) {
            resolutionAssetsList = resolutionAssetsList.concat(resolutionFileList[this.resolution]);
        }
        return resolutionAssetsList;
    };

    var assetsList = [];
    if (fileList !== undefined) {
        if ("common" in fileList) {
            assetsList = assetsList.concat(fetchResolutionFiles.apply(this, [fileList["common"]]));
        }
        if (this.device in fileList) {
            assetsList = assetsList.concat(fetchResolutionFiles.apply(this, [fileList[this.device]]));
        }
    }
    return assetsList;
}

_ng.CoreApp.prototype.loadLoadingAssets = function () {
    var loadingAssets = [];
    var tempLoadingAssets = [];
    var loadingAssetsObject = {};

    //get coreloading assets name
    tempLoadingAssets = [];
    if(_ng.GameConfig.CyprusCore){
        _ng.GameConfig.coreLoadingAssets.common.allResolutions.push("promoFreeSpin.json");
    }
    tempLoadingAssets = this.getAssetsToLoadList(_ng.GameConfig.coreLoadingAssets);

    //Update asset name with asset address
    //update loadingAssetsObject with key as asset name and value as asset path
    tempLoadingAssets.forEach(function (assetName, index) {
        loadingAssetsObject[assetName] = this.coreAssetsPath + this.resolution + "/" + assetName;
        assetName = this.coreAssetsPath + this.resolution + "/" + assetName;
        tempLoadingAssets[index] = assetName;
    }.bind(this));
    //Append loading assets with existing assets
    loadingAssets = loadingAssets.concat(tempLoadingAssets);

    tempLoadingAssets = [];
    tempLoadingAssets = this.getAssetsToLoadList(_ng.GameConfig.slotLoadingAssets);
    tempLoadingAssets.forEach(function (assetName, index) {
        loadingAssetsObject[assetName] = this.slotAssetsPath + this.resolution + "/" + assetName;
        assetName = this.slotAssetsPath + this.resolution + "/" + assetName;
        tempLoadingAssets[index] = assetName;
    }.bind(this));
    loadingAssets = loadingAssets.concat(tempLoadingAssets);

    tempLoadingAssets = [];
    tempLoadingAssets = this.getAssetsToLoadList(_ng.GameConfig.gameLoadingAssets);
    tempLoadingAssets.forEach(function (assetName, index) {
        loadingAssetsObject[assetName] = this.gameAssetsPath + this.resolution + "/" + assetName;
        assetName = this.gameAssetsPath + this.resolution + "/" + assetName;
        tempLoadingAssets[index] = assetName;
    }.bind(this));
    loadingAssets = loadingAssets.concat(tempLoadingAssets);

    /*********Adding Brand Assets to load with Loading Assets********/
    tempLoadingAssets = [];
    tempLoadingAssets = commonConfig.preloaderFiles;

    tempLoadingAssets.forEach(function (assetName, index) {
        loadingAssetsObject[assetName] = this.coreBrandAssetsPath + this.resolution + "/" + assetName;
        assetName = this.coreBrandAssetsPath + this.resolution + "/" + assetName;
        tempLoadingAssets[index] = assetName;
    }.bind(this));
    loadingAssets = loadingAssets.concat(tempLoadingAssets);
    /*****************************************************************/

    var loader = new PIXI.Loader();
    for (var asset in loadingAssetsObject) {
        loader.add(asset, loadingAssetsObject[asset]);
    }


    // loader.once('complete', function (o, resource) {
    //     PIXI.Loader.shared.resources = resource;
    //     _mediator.publish("checkForLoadingAssetsLoaded", 1);
    // });

    loader.onComplete.add((o, resource) => {
        // console.log("Loading assets loaded.");

        if (resource && resource.textures) {
            pixiLib.allLoadedTextures = pixiLib.allLoadedTextures.concat(Object.keys(resource.textures));
            pixiLib.allLoadedTextures = pixiLib.allLoadedTextures.filter(function (value) {
                if (value.indexOf('_normal') > 0 || value.indexOf('_down') > 0 || value.indexOf('_hover') > 0 || value.indexOf('_disabled') > 0) {
                    return value;
                }
            })
        }
        PIXI.Loader.shared.resources = resource;
        _mediator.publish("checkForLoadingAssetsLoaded", 1);
    })

    loader.load(this.revision);
    this.loadFonts("preloaderFonts");
}
_ng.CoreApp.prototype.loadFonts = function (loadType) {
    var fontsToLoad = undefined;
    var fontObj;

    if (loadType === "preloaderFonts") {
        fontsToLoad = _ng.GameConfig.fontsToLoad && _ng.GameConfig.fontsToLoad.preloaderFonts ? _ng.GameConfig.fontsToLoad.preloaderFonts : undefined;
        if (!fontsToLoad) {
            _mediator.publish("checkForLoadingAssetsLoaded", 1);
            return;
        }
    } else if (loadType === "primaryFonts") {
        fontsToLoad = _ng.GameConfig.fontsToLoad && _ng.GameConfig.fontsToLoad.primaryFonts ? _ng.GameConfig.fontsToLoad.primaryFonts : undefined;

        if (commonConfig.fontsToLoad) {
            fontsToLoad = { ...fontsToLoad, ...commonConfig.fontsToLoad };
        }

        if (!fontsToLoad) {
            _mediator.publish("checkForPrimaryAssetsLoaded", 1);
            return;
        }
    } else if (loadType === "secondaryFonts") {
        fontsToLoad = _ng.GameConfig.fontsToLoad && _ng.GameConfig.fontsToLoad.secondaryFonts ? _ng.GameConfig.fontsToLoad.secondaryFonts : undefined;
        if (!fontsToLoad) {
            _mediator.publish("checkForSecondaryAssetsLoaded", 1);
            return
        }
    }

    this.loadedFonts = 0;
    this.totalFonts = Object.keys(fontsToLoad).length;

    if (_ng.GameConfig.changeFonts) {
        var langNotSupport = [];
        for (var font in _ng.GameConfig.changeFonts) {
            langNotSupport = _ng.GameConfig.changeFonts[font];
            if (langNotSupport.indexOf(lang) != -1) {
                fontsToLoad[font] = fontsToLoad["ProximaNova_Bold"];
            }
        }
    }

    for (var font in fontsToLoad) {
        var fontStyle = document.createElement('style');
        // var fontPath = this.gameAssetsPath + "fonts/" + fontsToLoad[font];
        var fontPath = this.slotAssetsPath + "fonts/" + fontsToLoad[font];
        fontStyle.appendChild(document.createTextNode(
            '@font-face { ' +
            'font-family: "' + font + '"; ' +
            'src: url("' + fontPath + '"); ' +
            ' }'
        ))
        document.head.appendChild(fontStyle);

        var hiddenText = document.createElement('span');
        hiddenText.style.fontFamily = font;
        hiddenText.style.visibility = 'hidden';
        document.body.appendChild(hiddenText);

        fontObj = new FontFaceObserver(font);
        fontObj.load().then(function (e) {
            ++this.loadedFonts;
            if (this.loadedFonts === this.totalFonts) {
                if (loadType === "preloaderFonts") {
                    _mediator.publish("checkForLoadingAssetsLoaded", 1);
                } else if (loadType === "primaryFonts") {
                    _mediator.publish("checkForPrimaryAssetsLoaded", 1);
                } else if (loadType === "secondaryFonts") {
                    _mediator.publish("checkForSecondaryAssetsLoaded", 1);
                }
            }
        }.bind(this)).catch(function (e) {
            console.error(e.family, 'Font Not Loaded.');
            ++this.loadedFonts;
            if (this.loadedFonts === this.totalFonts) {
                if (loadType === "preloaderFonts") {
                    _mediator.publish("checkForLoadingAssetsLoaded", 1);
                } else if (loadType === "primaryFonts") {
                    _mediator.publish("checkForPrimaryAssetsLoaded", 1);
                } else if (loadType === "secondaryFonts") {
                    _mediator.publish("checkForSecondaryAssetsLoaded", 1);
                }
            }
        }.bind(this));
    }
}
_ng.CoreApp.prototype.addEvents = function () {
    _mediator.subscribe("checkForLoadingAssetsLoaded", this.checkForLoadingAssetsLoaded.bind(this));
    _mediator.subscribe("checkForPrimaryAssetsLoaded", this.checkForPrimaryAssetsLoaded.bind(this));
    _mediator.subscribe("checkForSecondaryAssetsLoaded", this.checkForSecondaryAssetsLoaded.bind(this));
    _mediator.subscribe(_events.core.loadPrimaryAssets, this.onLoadPrimaryAssets.bind(this));
    _mediator.subscribe(_events.core.loadSecondaryAssets, this.onLoadSecondaryAssets.bind(this));
    _mediator.subscribe(_events.core.initReceived, this.setCurrency.bind(this));
    _mediator.subscribe(_events.core.initReceived, function () {
        setTimeout(function () {
            callOperatorAPIs({ currency: this.gameModel.getCurrencyCode() });
        }.bind(this), 0);
    }.bind(this));
    _mediator.subscribe(_events.core.gameCreationCompleted, function () {
        this.updateGameSpecificRules(this.rulesData);
        updateGameRules(this.rulesData);

        // if(_ng.GameConfig.paytableType === "HTML"){
        //     updateHTMLPage(this.paytableData, "ptContent");
        //     var paytableCloseBtn = document.getElementById("paytableCloseBtn");
        //     paytableCloseBtn.src = appPath + "games/rules/en/images/" + gameName + "/closeBtn.png";
        // }else{
        // var paytableCloseBtn = document.getElementById("paytableCloseBtn");
        // paytableCloseBtn.style.display = "none";
        // }
    }.bind(this))
}
function callOperatorAPIs() { }
_ng.CoreApp.prototype.checkForLoadingAssetsLoaded = function (count) {
    this.isLoadingAssetsLoaded = this.isLoadingAssetsLoaded ^ count;
    if (this.isLoadingAssetsLoaded) {
        _mediator.publish(_events.core.loadingAssetsLoaded);
        _mediator.publish("loadingFontsLoaded");
    }
}
_ng.CoreApp.prototype.checkForPrimaryAssetsLoaded = function (count) {
    this.isPrimaryAssetsLoaded = this.isPrimaryAssetsLoaded ^ count;
    if (this.isPrimaryAssetsLoaded) {
        _mediator.publish(_events.core.primaryAssetsLoaded);
        _mediator.publish("primaryFontsLoaded");
    }
}
_ng.CoreApp.prototype.checkForSecondaryAssetsLoaded = function (count) {
    this.isSecondaryAssetsLoaded = this.isSecondaryAssetsLoaded ^ count;
    if (this.isSecondaryAssetsLoaded) {
        _sndLib.init(_ng.GameConfig.soundsAssets, this.secondarySoundsLoaded.bind(this), "secondary");
        // this.secondarySoundsLoaded();
    }
}
_ng.CoreApp.prototype.secondarySoundsLoaded = function () {
    _mediator.publish(_events.core.secondaryAssetsLoaded);
    _mediator.publish("secondaryFontsLoaded");
    _ng.isSecondaryAssetsLoaded = true;
}
_ng.CoreApp.prototype.onLoadSecondaryAssets = function () {
    this.loadFonts("secondaryFonts");
    this.loadSecondaryAssetGroup(0);
}
_ng.CoreApp.prototype.loadSecondaryAssetGroup = function (counter) {
    var assets = _ng.GameConfig.secondaryAssets || [];
    if (counter < assets.length) {
        var assetGroupObject = {};
        var assetGroup = this.getAssetsToLoadList(assets[counter].assets);
        assetGroup.forEach(function (assetName, index) {
            assetGroupObject[assetName] = this.gameAssetsPath + this.resolution + "/" + assetName;
            assetName = this.gameAssetsPath + this.resolution + "/" + assetName;
            assetGroup[index] = assetName;
        }.bind(this));


        var loader = new PIXI.Loader();
        for (var asset in assetGroupObject) {
            loader.add(asset, assetGroupObject[asset]);
        }

        // loader.on("progress", function (o, resource) {
        //     PIXI.Loader.shared.resources[resource.name] = resource;
        // }.bind(this));
        loader.onProgress.add((o, resource) => {
            // console.log("Loading Secondary Assets");

            if (resource && resource.textures) {
                pixiLib.allLoadedTextures = pixiLib.allLoadedTextures.concat(Object.keys(resource.textures));
                pixiLib.allLoadedTextures = pixiLib.allLoadedTextures.filter(function (value) {
                    if (value.indexOf('_normal') > 0 || value.indexOf('_down') > 0 || value.indexOf('_hover') > 0 || value.indexOf('_disabled') > 0) {
                        return value;
                    }
                })
            }
            PIXI.Loader.shared.resources[resource.name] = resource;
        });

        // loader.on("error", function (o, resource) {
        loader.onError.add((o, resource) => {

            _mediator.publish(_events.core.error, {
                code: "SECONDARY_ASSET_LOADING_ERROR",
                action: "reload",
                type: "error"
            });
        });


        loader.onComplete.add((a, c) => {
            // console.log("Secondary assets loaded.");
            // _mediator.publish(a[c].onLoadEvent);
            this.loadSecondaryAssetGroup(++c);
        })

        // loader.once('complete', function (a, c) {
        // _mediator.publish(a[c].onLoadEvent);
        // this.loadSecondaryAssetGroup(++c);
        // }.bind(this, assets, counter));

        loader.load(this.revision);
    } else {
        _mediator.publish("checkForSecondaryAssetsLoaded", 1);
    }
}

_ng.CoreApp.prototype.onLoadPrimaryAssets = function () {
    var primaryAssets = [];
    var tempPrimaryAssets = [];
    var primaryAssetsObject = {};
    var loadedAssets = 0;
    var totalAssets = 0;
    var loadPercent = 0;

    //get coreloading assets name
    tempPrimaryAssets = [];
    tempPrimaryAssets = this.getAssetsToLoadList(_ng.GameConfig.corePrimaryAssets);
    //Update asset name with asset address
    //update primaryAssetsObject with key as asset name and value as asset path
    tempPrimaryAssets.forEach(function (assetName, index) {
        primaryAssetsObject[assetName] = this.coreAssetsPath + this.resolution + "/" + assetName;
        assetName = this.coreAssetsPath + this.resolution + "/" + assetName;
        tempPrimaryAssets[index] = assetName;
    }.bind(this));
    //Append loading assets with existing assets
    primaryAssets = primaryAssets.concat(tempPrimaryAssets);

    tempPrimaryAssets = [];
    tempPrimaryAssets = this.getAssetsToLoadList(_ng.GameConfig.slotPrimaryAssets);
    tempPrimaryAssets.forEach(function (assetName, index) {
        primaryAssetsObject[assetName] = this.slotAssetsPath + this.resolution + "/" + assetName;
        assetName = this.slotAssetsPath + this.resolution + "/" + assetName;
        tempPrimaryAssets[index] = assetName;
    }.bind(this));
    primaryAssets = primaryAssets.concat(tempPrimaryAssets);

    tempPrimaryAssets = [];
    tempPrimaryAssets = this.getAssetsToLoadList(_ng.GameConfig.gamePrimaryAssets);
    tempPrimaryAssets.forEach(function (assetName, index) {
        primaryAssetsObject[assetName] = this.gameAssetsPath + this.resolution + "/" + assetName;
        assetName = this.gameAssetsPath + this.resolution + "/" + assetName;
        tempPrimaryAssets[index] = assetName;
    }.bind(this));
    primaryAssets = primaryAssets.concat(tempPrimaryAssets);

    tempPrimaryAssets = [];
    tempPrimaryAssets = this.getAssetsToLoadList(_ng.GameConfig.gamePrimaryLangAssets);
    tempPrimaryAssets.forEach(function (assetName, index) {
        primaryAssetsObject[assetName] = this.gameLangAssetsPath + this.resolution + "/" + assetName;
        assetName = this.gameLangAssetsPath + this.resolution + "/" + assetName;
        tempPrimaryAssets[index] = assetName;
    }.bind(this));
    primaryAssets = primaryAssets.concat(tempPrimaryAssets);


    var loader = new PIXI.Loader();
    for (var asset in primaryAssetsObject) {
        loader.add(asset, primaryAssetsObject[asset]);
    }

    totalAssets = primaryAssets.length;
    // loader.on("progress", function (o, resource) {
    //     loadedAssets++;
    //     PIXI.Loader.shared.resources[resource.name] = resource;
    //     loadPercent = Math.min(Math.round((loadedAssets * 50) / totalAssets), 95);
    //     _mediator.publish(_events.core.loadProgress, loadPercent);
    // }.bind(this));
    loader.onProgress.add((o, resource) => {
        // console.log("Loading Primary Asests");

        loadedAssets++;
        if (resource && resource.textures) {
            pixiLib.allLoadedTextures = pixiLib.allLoadedTextures.concat(Object.keys(resource.textures));
            pixiLib.allLoadedTextures = pixiLib.allLoadedTextures.filter(function (value) {
                if (value.indexOf('_normal') > 0 || value.indexOf('_down') > 0 || value.indexOf('_hover') > 0 || value.indexOf('_disabled') > 0) {
                    return value;
                }
            })
        }
        PIXI.Loader.shared.resources[resource.name] = resource;
        loadPercent = Math.min(Math.round((loadedAssets * 50) / totalAssets), 95);
        _mediator.publish(_events.core.loadProgress, loadPercent);
    });

    // loader.on("error", function (o, resource) {
    loader.onError.add((o, resource) => {
        _mediator.publish(_events.core.error, {
            code: "PRIMARY_ASSET_LOADING_ERROR",
            action: "reload",
            type: "error"
        });
        // }.bind(this));
    })

    // loader.once('complete', function () {
    //     _mediator.publish("checkForPrimaryAssetsLoaded", 1);
    // }.bind(this));
    loader.onComplete.add((a, c) => {
        // console.log("Primary assets loaded.");
        _mediator.publish("checkForPrimaryAssetsLoaded", 1);
    })

    loader.load(this.revision);

    this.loadFonts("primaryFonts");
}
_ng.CoreApp.prototype.initLibsClasses = function () {
    var libsClasses = _ng.GameConfig.classes.libs;
    for (var lib in libsClasses) {
        this[lib] = new window[libsClasses[lib]];
    }
    _mediator = this._mediator;
    _pixiUtil = PIXIUtil;
    // _slotModel = new SlotModel();
    // _slotService = new SlotService(_slotModel);
    _mediator.subscribe('onStageTouch', pixiLib.onStageTouch);
    this.setLiteralTranslations();
    //Adding scaleX & scaleY in pixi.Sprite class 
    //for easy use in TweenMax
    Object.defineProperties(PIXI.Sprite.prototype, {
        scaleX: {
            get: function () {
                return this.scale.x;
            },
            set: function (v) {
                this.scale.x = v;
            }
        },
        scaleY: {
            get: function () {
                return this.scale.y;
            },
            set: function (v) {
                this.scale.y = v;
            }
        }
    });
}

_ng.CoreApp.prototype.initializeCoreClasses = function () {
    var coreClasses = _ng.GameConfig.classes.core;
    if (coreClasses.separateClasses !== undefined) {
        coreClasses = coreClasses.separateClasses;
        for (var className in coreClasses) {
            this[className] = new window["_ng"][coreClasses[className]](this);
        }
    }
    this.gameController.setView(this.gameView);
    this.gameController.setModel(this.gameModel);
    coreClasses = _ng.GameConfig.classes.core;
    this.gameService.setModel(this.gameModel);
    /*  if(coreClasses.viewControllers !== undefined){
          coreClasses = coreClasses.viewControllers;
          for(var className in coreClasses){
              this[className + "View"] = new window["_ng"][coreClasses[className][0]](this);
              this[className + "Controller"] = new window["_ng"][coreClasses[className][1]](this);
              this[className + "View"].createView();
              this[className + "Controller"].setView(this[className + "View"]);
          }
      }*/
    _viewInfoUtil = this.viewInfoUtil;
}
_ng.CoreApp.prototype.addDeviceClassToHTML = function (viewType) {
    var HTMLElement = document.getElementsByTagName('html')[0];
    HTMLElement.classList.remove("VD");
    HTMLElement.classList.remove("VL");
    HTMLElement.classList.remove("VP");
    HTMLElement.classList.add(viewType);
}
_ng.CoreApp.prototype.loadSingleScript = function (path, callback, eCallback) {
    var el = document.createElement("script");
    document.getElementsByTagName("body")[0].appendChild(el);
    el.onload = function (data) {
        if (callback) {
            callback(data);
        }
    };
    el.onerror = function (data) {
        if (eCallback) {
            eCallback(data);
        }
    }
    el.src = path + '?ver=' + this.revision;
    el.type = 'text/javascript';
}
/*_ng.CoreApp.prototype.loadSingleScript = function (fileName, callback) {
    "use strict";
    var script = document.createElement('script');
    script.type = 'text/javascript';

    if (script.readyState) {
        // Internet Explorer
        script.onreadystatechange = function () {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
                script.onreadystatechange = null;
                if (callback != undefined && typeof callback == 'function') {
                    callback();
                }
            }
        };
    } else {
        // Others browsers
        script.onload = function () {
            if (callback != undefined && typeof callback == 'function') {
                callback();
            }
        };
    }

    script.src = fileName + '?r=' + this.revision;
    document.getElementsByTagName('body')[0].appendChild(script);
};*/

_ng.CoreApp.prototype.addToLoadedAssets = function (assetName) {
    this.loadedAssets[assetName] = true;
};
_ng.CoreApp.prototype.getUrlVar = function (requestedKey) {
    "use strict";
    var vars = [],
        hashes, hash,
        temp_hashes = window.location.href.slice(window.location.href.indexOf('?') + 1),
        i;
    temp_hashes = temp_hashes.replace("#", "");
    hashes = temp_hashes.split('&');
    for (i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    if (typeof requestedKey === 'undefined') {
        return vars;
    } else {
        return vars[requestedKey];
    }
}
_ng.CoreApp.prototype.updateGameSpecificRules = function (data) {
    if (_ng.GameConfig.hasVariableRTP) {
        this.addVariableRTPRulesText(data);
    }
    if (commonConfig["jurisdiction"] === "DE") {
        delete data["c3"]; //delete elements in the array
        delete data["c4"];
        delete data["c5"];
        delete data["c6"];
        delete data["c7"];
        delete data["c8"];
        //Addding the required text at the top element(c3)
        data["c3"] = { "type": "p", "className": "", "extra": "", "innerHTML": "As per German regulations, quick spin and auto-spin features have been disabled." };

        for (k = 0; k < coreApp.gameModel.userModel.maxWinProbability.length; k++) {
            var defaultNameP = "The probability of winning the top prize (5 of the same top prize symbols) on all spins is XXXX0.";
            // Below function can be used to override the text at game level.
            defaultNameP = this.updateWinSentence(defaultNameP, k, coreApp.gameModel.userModel.maxWinProbability[k]);
            data["a6"].innerHTML.push(defaultNameP);
        }
        for (j = 0; j < coreApp.gameModel.userModel.averagePayout.length; j++) {
            var defaultNameA = "The max win for 5 of the same high paying symbols is XXXX0 EUR.";
            defaultNameA = this.updateWinSentence(defaultNameA, j, coreApp.gameModel.userModel.averagePayout[j]);
            data["a6"].innerHTML.push(defaultNameA);
        }
    }
}
_ng.CoreApp.prototype.updateWinSentence = function (text, index, data) {
    if (data.default) {
        text = pixiLib.getLiteralText(text, [data.default]);
    }
    return text;
}

function updateGameRules(data) {
    var keys = Object.keys(data);
    keys.sort();

    var i = 0;
    var len = keys.length;

    var tag = document.getElementById("grContent");

    for (let o = 0; o < len; o++) {

        i = keys[o];
        // console.log(i);
        var el

        if (data[i].type === "UL") {
            el = document.createElement(data[i].type);
            var k = 0
            if (!data[i].innerHTML) {
                data[i].innerHTML = (isMobile) ? data[i].innerHTML_Mobile : data[i].innerHTML_Desktop;
            }

            if (data[i].innerHTML && Array.isArray(data[i].innerHTML)) {
                for (k = 0; k < data[i].innerHTML.length; k++) {
                    var y = document.createElement("LI");

                    if (data[i].noPoints) {
                        y.setAttribute("type", "none");
                        el.style.marginTop = data[i].noPoints + "px";
                    }

                    var tString = _(data[i].innerHTML[k]);
                    tString = tString.replace(/#br#/g, " ");
                    tString = tString.replace(/#brm#/g, " ");
                    // y.appendChild(document.createTextNode(_([tString])));
                    y.innerHTML = _([tString]);
                    el.appendChild(y);
                }
            } else {
                var y = document.createElement("LI");
                var tString = _(data[i].innerHTML[k]);
                tString = tString.replace(/#br#/g, " ");
                tString = tString.replace(/#brm#/g, " ");
                // y.appendChild(document.createTextNode(_([tString])));
                y.innerHTML = _([tString]);
                el.appendChild(y);
            }
        } else if (data[i].type === "img") {
            el = document.createElement("div");
            el.className = data[i].className;
            var y = document.createElement("img");
            var strImgPath = "";

            if (el.className == "common" || el.className === "autoSpinSettings") {
                if (data[i].from == "game") {
                    strImgPath = appPath + "games/rules/" + lang + "/images/" + gameName + "/" + data[i].imgPath;
                } else {
                    strImgPath = appPath + "games/rules/" + lang + "/images/common/" + data[i].imgPath;
                }

            } else {
                strImgPath = appPath + "games/rules/en/images/" + gameName + "/" + data[i].imgPath;
            }
            if (el.className === "autoSpinSettings" && commonConfig.ukgc == "true") {
                strImgPath = strImgPath.split(".png").join("_UKGC.png");
            }
            y.src = strImgPath;
            el.appendChild(y);
        } else if (data[i].type === "dataTable") {
            //Overflow is forced for Shelby online.
            //check with @kaushik, if need to use in any other game.
            el = document.createElement("div");
            el.style.overflowX = "auto";
            var elementTable = document.createElement("table");
            el.appendChild(elementTable);

            if (!data[i].data) {
                data[i].data = (isMobile) ? data[i].data_Mobile : data[i].data_Desktop;
            }
            var arr = data[i].data;
            for (var k = 0; k < arr.length; k++) {
                var tr = document.createElement("tr");

                var rowData = arr[k];

                for (var q = 0; q < rowData.length; q++) {
                    let tableCell = document.createElement("td");
                    if (k === 0) {
                        tableCell = document.createElement("th");
                    }
                    var tString = _(rowData[q].innerHTML);
                    tString = tString.replace(/#br#/g, " ");
                    tString = tString.replace(/#brm#/g, " ");
                    tableCell.innerText = tString;
                    tr.appendChild(tableCell);
                    if (rowData[q].style) {
                        for (var textStyle in rowData[q].style) {
                            tableCell.style[textStyle] = rowData[q].style[textStyle];
                        }
                    }
                }
                el.appendChild(tr);
            }
        } else if (data[i].type === "table") {
            el = document.createElement(data[i].type);

            if (!data[i].data) {
                data[i].data = (isMobile) ? data[i].data_Mobile : data[i].data_Desktop;
            }
            var arr = data[i].data;
            for (k = 0; k < arr.length; k++) {
                var tr = document.createElement("tr");
                var col1;
                var col2;
                if (k == 0) {
                    col1 = document.createElement("th");
                    var tString = _(arr[k].title1);
                    tString = tString.replace(/#br#/g, " ");
                    tString = tString.replace(/#brm#/g, " ");
                    col1.innerText = tString;

                    col2 = document.createElement("th");
                    var tString = _(arr[k].title2);
                    tString = tString.replace(/#br#/g, " ");
                    tString = tString.replace(/#brm#/g, " ");
                    col2.innerText = tString;
                } else {
                    var img = document.createElement("img");
                    if (arr[k].type == "common") {
                        img.src = appPath + "games/rules/en/images/common/" + arr[k].imgPath;
                    } else {
                        img.src = appPath + "games/rules/en/images/" + gameName + "/" + arr[k].imgPath;
                    }

                    col1 = document.createElement("td");
                    col1.className = arr[k].className;
                    col1.appendChild(img)

                    col2 = document.createElement("td");
                    var tString = _(arr[k].innerHTML);
                    tString = tString.replace(/#br#/g, " ");
                    tString = tString.replace(/#brm#/g, " ");
                    col2.innerText = _(tString);
                    // col2.innerText = arr[k].innerHTML;
                }
                tr.appendChild(col1);
                tr.appendChild(col2);
                el.appendChild(tr);
            }
        } else {
            el = document.createElement(data[i].type);
            el.className = data[i].className
            // el.innerText = data[i].innerHTML;
            var tString = _(data[i].innerHTML);
            tString = tString.replace(/#br#/g, " ");
            tString = tString.replace(/#brm#/g, " ");
            el.innerHTML = _(tString);

        }
        tag.appendChild(el);

        if (data[i].extra == "br") {
            tag.appendChild(document.createElement("br"));
        }
    }

    var tag = document.getElementById("content");
}

_ng.CoreApp.prototype.addVariableRTPRulesText = function (data) {
    data["a6"].innerHTML[data["a6"].innerHTML.length] = pixiLib.getLiteralText("gameRulesTxtDynamic", [coreApp.gameModel.userModel.dynamicRTPText])
}
function updateHTMLPage(data, type) {

    var keys = Object.keys(data);
    keys.sort();

    var i = 0;
    var len = keys.length;

    // var tag = document.getElementById("grContent");
    var tag = document.getElementById(type);
    var str;

    if (isMobile) {
        str = appPath + "games/" + gameName + "/dist/images/ptBgP.png";
    } else {
        str = appPath + "games/" + gameName + "/dist/images/ptBgL.png";
    }

    tag.parentElement.style.backgroundImage = "url('" + str + "')";
    ;
    for (let o = 0; o < len; o++) {

        i = keys[o];
        // console.log(i);
        var el

        if (data[i].type === "UL") {
            el = document.createElement(data[i].type);
            var k = 0
            if (!data[i].innerHTML) {
                data[i].innerHTML = (isMobile) ? data[i].innerHTML_Mobile : data[i].innerHTML_Desktop;
            }

            if (data[i].innerHTML && Array.isArray(data[i].innerHTML)) {
                for (k = 0; k < data[i].innerHTML.length; k++) {
                    var y = document.createElement("LI");

                    if (data[i].noPoints) {
                        y.setAttribute("type", "none");
                        el.style.marginTop = data[i].noPoints + "px";
                    }

                    var tString = _(data[i].innerHTML[k]);
                    tString = tString.replace(/#br#/g, " ");
                    tString = tString.replace(/#brm#/g, " ");
                    // y.appendChild(document.createTextNode(_([tString])));
                    y.innerHTML = _([tString]);
                    el.appendChild(y);
                }
            } else {
                var y = document.createElement("LI");
                var tString = _(data[i].innerHTML[k]);
                tString = tString.replace(/#br#/g, " ");
                tString = tString.replace(/#brm#/g, " ");
                // y.appendChild(document.createTextNode(_([tString])));
                y.innerHTML = _([tString]);
                el.appendChild(y);
            }
        } else if (data[i].type === "img") {
            el = document.createElement("div");
            el.className = data[i].className;
            var y = document.createElement("img");
            var strImgPath = "";



            if (type == "grContent") {
                if (el.className == "common" || el.className === "autoSpinSettings") {
                    if (data[i].from == "game") {
                        strImgPath = appPath + "games/rules/" + lang + "/images/" + gameName + "/" + data[i].imgPath;
                    } else {
                        strImgPath = appPath + "games/rules/" + lang + "/images/common/" + data[i].imgPath;
                    }
                } else {
                    strImgPath = appPath + "games/rules/en/images/" + gameName + "/" + data[i].imgPath;
                }
            } else {
                // if (el.className == "common" || el.className === "autoSpinSettings") {
                //     strImgPath = appPath + "games/rules/" + lang + "/images/common/" + data[i].imgPath;
                // } else {
                strImgPath = appPath + "games/" + gameName + "/dist/images/" + data[i].imgPath;
                // }
            }

            if (el.className === "autoSpinSettings" && commonConfig.ukgc == "true") {
                strImgPath = strImgPath.split(".png").join("_UKGC.png");
            }
            y.src = strImgPath;
            y.style.maxWidth = '90%';
            el.appendChild(y);
        } else if (data[i].type === "table") {
            el = document.createElement(data[i].type);

            if (!data[i].data) {
                data[i].data = (isMobile) ? data[i].data_Mobile : data[i].data_Desktop;
            }
            var arr = data[i].data;
            for (k = 0; k < arr.length; k++) {
                var tr = document.createElement("tr");
                var col1;
                var col2;
                if (k == 0) {
                    col1 = document.createElement("th");
                    var tString = _(arr[k].title1);
                    tString = tString.replace(/#br#/g, " ");
                    tString = tString.replace(/#brm#/g, " ");
                    col1.innerText = tString;

                    col2 = document.createElement("th");
                    var tString = _(arr[k].title2);
                    tString = tString.replace(/#br#/g, " ");
                    tString = tString.replace(/#brm#/g, " ");
                    col2.innerText = tString;
                } else {
                    var img = document.createElement("img");
                    if (arr[k].type == "common") {
                        img.src = appPath + "games/rules/en/images/common/" + arr[k].imgPath;
                    } else {
                        img.src = appPath + "games/rules/en/images/" + gameName + "/" + arr[k].imgPath;
                    }

                    col1 = document.createElement("td");
                    col1.className = arr[k].className;
                    col1.appendChild(img)

                    col2 = document.createElement("td");
                    var tString = _(arr[k].innerHTML);
                    tString = tString.replace(/#br#/g, " ");
                    tString = tString.replace(/#brm#/g, " ");
                    col2.innerText = _(tString);
                    // col2.innerText = arr[k].innerHTML;
                }
                tr.appendChild(col1);
                tr.appendChild(col2);
                el.appendChild(tr);
            }
        } else if (data[i].type === "paytableText") {
            el = document.getElementsByClassName("paytableText")[0];
            el.style.fontFamily = data[i].fontFamily;
            var tString = _(data[i].innerHTML);
            el.innerHTML = _(tString);
        } else if (data[i].type === "imgText") {
            el = document.createElement("div");
            el.className = data[i].className;
            el.style.backgroundImage = 'url(' + appPath + "games/" + gameName + "/dist/images/" + data[i].imgPath + ')';

            elSpan = document.createElement("span");
            elSpan.innerHTML = _(data[i].innerHTML);
            el.appendChild(elSpan);




        } else if (data[i].type === "parent") {
            el = document.createElement("div");
            el.className = data[i].className;



            for (var j = 0; j < data[i].children.length; j++) {
                child = document.createElement("div");
                child.className = data[i].children[j].className;
                child.style.backgroundImage = 'url(' + appPath + "games/" + gameName + "/dist/images/" + data[i].children[j].imgPath + ')';

                elSpan = document.createElement("span");
                elSpan.innerHTML = _(data[i].children[j].innerHTML);
                child.appendChild(elSpan);

                el.appendChild(child);
            }
            //rent
        } else {
            el = document.createElement(data[i].type);
            el.className = data[i].className;
            el.style.fontFamily = data[i].fontFamily;
            // el.innerText = data[i].innerHTML;
            var tString = _(data[i].innerHTML);
            tString = tString.replace(/#br#/g, " ");
            tString = tString.replace(/#brm#/g, " ");
            el.innerHTML = _(tString);

        }



        tag.appendChild(el);

        if (data[i].extra == "br") {
            tag.appendChild(document.createElement("br"));
        }
    }

    var tag = document.getElementById("content");
}