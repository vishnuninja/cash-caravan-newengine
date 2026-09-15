var gCoreApp = _ng.CoreApp.prototype;

gCoreApp.loadLoadingAssets = function () {
    var loadingAssets = [];
    var tempLoadingAssets = [];
    var loadingAssetsObject = {};

    //get coreloading assets name
    tempLoadingAssets = [];
    //Seperate PFS assets is loading
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
        loadingAssetsObject[assetName] = this.gameAssetsPath + this.lang + "/"+this.resolution + "/" + assetName;
        assetName = this.gameAssetsPath + this.lang + "/"+ this.resolution + "/" + assetName;
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

gCoreApp.loadSecondaryAssetGroup = function (counter) {
    var assets = _ng.GameConfig.secondaryAssets || [];
    if (counter < assets.length) {
        var assetGroupObject = {};
        var assetGroup = this.getAssetsToLoadList(assets[counter].assets);
        assetGroup.forEach(function (assetName, index) {
            assetGroupObject[assetName] = this.gameAssetsPath + this.lang + "/"+ this.resolution + "/" + assetName;
            assetName = this.gameAssetsPath + this.lang + "/"+ this.resolution + "/" + assetName;
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

gCoreApp.onLoadPrimaryAssets = function () {
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
        primaryAssetsObject[assetName] = this.gameAssetsPath + this.lang + "/"+ this.resolution + "/" + assetName;
        assetName = this.gameAssetsPath + this.lang + "/"+ this.resolution + "/" + assetName;
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
 
    // totalAssets = primaryAssets.length;
    totalAssets = _ng.GameConfig.totalAssets? _ng.GameConfig.totalAssets: primaryAssets.length ;


         // loader.on("progress", function (o, resource) {
            //     loadedAssets++;
            //     PIXI.Loader.shared.resources[resource.name] = resource;
            //     loadPercent = Math.min(Math.round((loadedAssets * 50) / totalAssets), 95);
            //     _mediator.publish(_events.core.loadProgress, loadPercent);
            // }.bind(this));
            loader.onProgress.add((o, resource) => {
                // console.log("Loading Primary Asests");
                
                loadedAssets++;
                ///// Uncomment this and write the final loaded assets as total assets in game config
                // console.log("assets: "+loadedAssets+"/"+totalAssets)


        if (resource && resource.textures) {
            
            pixiLib.allLoadedTextures = pixiLib.allLoadedTextures.concat(Object.keys(resource.textures));
            pixiLib.allLoadedTextures = pixiLib.allLoadedTextures.filter(function (value) {
                if (value.indexOf('_normal') > 0 || value.indexOf('_down') > 0 || value.indexOf('_hover') > 0 || value.indexOf('_disabled') > 0) {
                    return value;
                }
            })
        }
        PIXI.Loader.shared.resources[resource.name] = resource;
        loadPercent = Math.min(Math.round((loadedAssets * 100) / totalAssets), 95);
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