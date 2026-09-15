
var preloaderConfig = [];
var pcProgressbarConfig = {};

var pcMaxWidth = 1280,
  pcMaxHeight = 720,
  pcApp,
  pcFillBar,
  pcLogo = [],
  pcBgBar,
  pcFillBar,
  pcIsLandScape,
  pcLogoSound,
  pcLogoSoundisReady = false;

function getWindowWidth() {
  if (isDesktop) {
    return pcMaxWidth;
  }
  return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
}

function getWindowHeight() {
  if (isDesktop) {
    return pcMaxHeight;
  }
  return (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
}
var preWrapper
class PreloaderApp {

  constructor() {
    this.config = preloaderConfig;

    this.w = getWindowWidth();
    this.h = getWindowHeight();

    pcIsLandScape = (this.w > this.h) ? true : false;
    this.viewType = (this.w > this.h) ? "VL" : "VP";

    var xRatio = getWindowWidth() / pcMaxWidth;
    var yRatio = getWindowHeight() / pcMaxHeight;
    this.viewScale = Math.min(xRatio, yRatio);

    pcApp = new PIXI.Application({ width: this.w, height: this.h, backgroundColor: 0x000000, autoDensity: true, resolution: 2 });
    preWrapper = document.getElementById("preloaderWrapper");
    preWrapper.appendChild(pcApp.view);

    // preCtnr
    this.preCtnr = new PIXI.Container();
    this.preCtnr.name = "preCtnr";
    pcApp.stage.addChild(this.preCtnr);

    // Progress bar in container
    this.barCtnr = new PIXI.Container();
    this.barCtnr.name = "barCtnr";
    this.preCtnr.addChild(this.barCtnr);
    this.barCtnr.visible = false;

    pcApp.loader.add('spritesheet0', appPath + this.config.preloader.path + this.config.preloader.file);
    if (this.config.brandLogo) pcApp.loader.add('spritesheet1', appPath + this.config.brandLogo.path + this.config.brandLogo.file);

    // console.log("========= preload comp called =============");
    if (this.config.sound) {
      this.pcLogoSound = new Howl({ src: [appPath + this.config.sound.path + this.config.sound.file] })
      this.pcLogoSound.once('load', function () { pcLogoSoundisReady = true; }.bind(this));
    }

    pcApp.loader.load(this.onAssetsLoaded.bind(this));

  }

  onAssetsLoaded(loader, resources) {
    console.log("assets loaded ");
    const style = new PIXI.TextStyle({
      align: "center",
      dropShadow: true,
      dropShadowAlpha: 0.1,
      dropShadowAngle: 0,
      dropShadowColor: "#5203bd",
      fill: "#ffffff",
      fontFamily: "Arial",
      fontWeight: "bold",
      letterSpacing: 1,
      lineJoin: "round",
      miterLimit: 20,
      stroke: "#ffffff",
      strokeThickness: 1,
      trim: true,
      fontSize: 20,
      });
    if (this.config.preBg) {
      this.preBg = new PIXI.Sprite(PIXI.Texture.from(this.config.preBg.img));
      this.preBg.name = "preBg";
      pcApp.stage.addChildAt(this.preBg, 0);
    }
    if (this.config.part1) {
      this.part1 = new PIXI.Sprite(PIXI.Texture.from(this.config.part1.img));
      this.part1.name = "part1";
      pcApp.stage.addChildAt(this.part1, 1);
    }
    if (this.config.part2) {
      this.part2 = new PIXI.Sprite(PIXI.Texture.from(this.config.part2.img));
      this.part2.name = "part2";
      pcApp.stage.addChildAt(this.part2, 1);
    }



    if (this.config.preTxt) {
      this.preTxt = new PIXI.Text(this.config.language[lang],style);
      this.preTxt.name = "preTxt";
      this.barCtnr.addChild(this.preTxt);

      
      this.preCounterTxt = new PIXI.Text("0%",style);
      this.preCounterTxt.name = "preCounterTxt";
      this.barCtnr.addChild(this.preCounterTxt);
    }

    if (this.config.bonusTxt) {
      this.bonusTxt = new PIXI.Sprite(PIXI.Texture.from(this.config.bonusTxt.img));
      this.bonusTxt.name = "bonusTxt";
      this.bonusTxt.x = 300;
      this.bonusTxt.y = - 450;
      this.bonusTxt.scale.set(2);
      this.barCtnr.addChild(this.bonusTxt);
    }

    if (this.config.jackpotTxt) {
      this.jackpotTxt = new PIXI.Sprite(PIXI.Texture.from(this.config.jackpotTxt.img));
      this.jackpotTxt.name = "jackpotTxt";
      this.jackpotTxt.x = - 600;
      this.jackpotTxt.y = - 450;
      this.jackpotTxt.scale.set(1.8);
      this.barCtnr.addChild(this.jackpotTxt);
    }

    this.barBg = new PIXI.Sprite(PIXI.Texture.from(this.config.preBar.barBg));
    this.barBg.name = "barBg";
    this.barCtnr.addChild(this.barBg);

    this.barFill = new PIXI.Sprite(PIXI.Texture.from(this.config.preBar.barFill))
    this.barFill.name = "barFill";
    this.barCtnr.addChild(this.barFill);

    if (gameName === "wildwestlegends") {
      this.barBg.x = - 18;
      this.barBg.y = - 19;
    }
    if (gameName === "santasleigh") {
      this.barBg.x = - 7;
      this.barBg.y = - 5;
    }
    if (gameName === "indianroyalsV2") {
      this.barBg.x = - 4;
      this.barBg.y = - 3;
    }
    if (gameName === "mysticalforestadventure") {
      this.barBg.x = - 4;
      this.barBg.y = - 3;
    }
    if (gameName === "sugarbox5000gold") {
      this.barBg.x = -1;
      // this.barBg.y = -3;
      this.barBg.scale.set(0.99);
      // this.barFill.scale.set(1,1);
    }


    this.barFillMask = new PIXI.Sprite(PIXI.Texture.from(this.config.preBar.barFill))
    this.barFillMask.name = "barFillMask";
    this.barCtnr.addChild(this.barFillMask);
    this.barFill.mask = this.barFillMask;
    this.barFillMask.x = -this.barFillMask.width;

    if (this.config.logoType === "spineAnimation") {
      this.createLogoSpine();
    } else if (this.config.logoType === "spriteAnimation") {
      this.createLogoAnimation();
    } else {
      this.createSpriteLogo();
    }

    this.onResize();
    this.preloaderListener(0);
    setTimeout(loadGameFile.bind(this), 1000);

    // if(this.config.brandLogo)
    //   {
     
    //     this.blackgraphics = new PIXI.Graphics();
    //     // begin a fill..
    //     this.blackgraphics.beginFill(0x000000);
    //     // draw a triangle using lines
    //     this.blackgraphics.drawRect(-1000, -2500, 2000, 5000);
    //     this.preCtnr.addChild(this.blackgraphics);
     
    //     this.blackBg = new PIXI.Sprite();
    //     this.brandLogoSpine = new PIXI.spine.Spine(resources.spritesheet1.spineData);
    //       this.brandLogoSpine.name = "brandLogoSpine";
    //       this.brandLogoSpine.state.setAnimation(0, 'logo_2', false);
    //       setTimeout(function () {
    //         this.preCtnr.removeChild(this.brandLogoSpine);
    //         this.preCtnr.removeChild(this.blackgraphics);
    //       }.bind(this), 1300);
     
    //        /* this.brandLogoSpine.state.addListener({
    //         complete: function (entry) {
    //           this.preCtnr.removeChild(this.brandLogoSpine);
    //           this.preCtnr.removeChild(this.blackgraphics);
    //         }.bind(this)
    //       });  */
    //       this.preCtnr.addChild(this.brandLogoSpine);
    //   }
  }


  createSpriteLogo() {
    if (!this.config.hideLogo && this.config.preLogo.img != "") {
      this.preLogo = new PIXI.Sprite(PIXI.Texture.from(this.config.preLogo.img)); //pixiLib.getElement("Sprite", this.config.preBar.barBg);
      this.preLogo.name = "preLogo";
      this.preCtnr.addChild(this.preLogo);

      if(gameName == "sugarbox_old"){
      this.preCompLogo = new PIXI.Sprite(PIXI.Texture.from(this.config.preCompLogo.img)); //pixiLib.getElement("Sprite", this.config.preBar.barBg);
      this.preCompLogo.name = "preCompLogo";
      this.preCtnr.addChild(this.preCompLogo)
      }
      this.barCtnr.visible = true;
    }
  }
  createLogoAnimation() {

    // this.preLogo = pixiLib.getElement("AnimatedSprite", this.config.spriteAnimObj);
    this.preLogo = this.createAnimatedSprite("spritesheet1", "Only Logo");
    this.preLogo.name = "preLogo";
    this.preCtnr.addChild(this.preLogo);
    this.preLogo.loop = false;
    this.preLogo.gotoAndPlay(0);
    this.preLogo.animationSpeed = 0.8;
    this.barCtnr.visible = true;

    this.preLogo.onFrameChange = function () {
      if (this.preLogo.currentFrame === this.config.showBarOnFrame) {
        this.barCtnr.visible = true;
      }
    }.bind(this);

    //this.preLogo.onComplete = function () { this.onPreloaderComplete(); }.bind(this);

  }

  createAnimatedSprite (spriteSheets, animationName){
    var frames = [], animFrames = [];
    if(Array.isArray(spriteSheets))
    {
      for(var i=0; i<spriteSheets.length; i++)
        for(var f in PIXI.Loader.shared.resources[spriteSheets[i]].data.frames)
          animFrames.push(f);
    }
    else
      animFrames= pcApp.loader.resources[spriteSheets].data.animations[animationName];

    //animFrames.sort();
    for (let i = 0; i < animFrames.length; i++)
        frames.push(PIXI.Texture.from(animFrames[i]));

    return new PIXI.AnimatedSprite(frames);
};

  createLogoSpine() {
    this.preLogo = pixiLib.getElement("Spine", this.config.spineName);
    this.preLogo.name = "preLogo";
    this.preLogo.state.setAnimation(0, 'animation', false);

    this.preLogo.state.addListener({
      complete: function (entry) {
        if (entry.trackIndex === 0) {
          this.barCtnr.visible = true;
          this.onPreloaderComplete();
        }
      }.bind(this)
    });
    this.preCtnr.addChild(this.preLogo);
  }

  preloaderListener(num) {
    if(this.preCounterTxt)
    {
    this.preCounterTxt.text = num + "%";
    }
    // this.barFillMask.x = (num * this.barFillMask.width) - this.barFillMask.width
    // if (this.barFillMask.x > 0) {
    //   this.barFillMask.x = 0;
    // }   
    this.barFillMask.x = 0;
    this.barFillMask.scale.x = num /100;
  }

  onResize() {
    if (isDesktop) {
      this.viewType = "VD";
      var canvasMargin = 0.9;
      var ratio = Math.min(window.innerWidth / pcMaxWidth, window.innerHeight / pcMaxHeight) * canvasMargin;
      var x = (window.innerWidth - ratio * pcMaxWidth) / 2;
      var y = (window.innerHeight - ratio * pcMaxHeight) / 2;

      if (window.innerWidth * canvasMargin < pcMaxWidth || window.innerHeight * canvasMargin < pcMaxHeight) {
        preWrapper.style.margin = "initial";
        preWrapper.style.transform = "translate(" + x + "px, " + y + "px) scale(" + ratio + ")";
      } else {
        preWrapper.style.margin = "auto";
        preWrapper.style.transform = "translate(0, 0)";
      }

      if (this.preBg) {

        if(gameName == "sugarbox5000gold" ){
         
          this.preBg.anchor.set(0.5);
          this.preBg.scale.set(1.45);
          this.preBg.width = 1300;
          this.preBg.height = 720;
          //var percentage  = ((1280 - getWindowWidth()) * 100)/1280;
 
          //percentage = 100 - percentage;
          //this.preBg.scale.set((percentage/100));
          this.preBg.x = (getWindowWidth()/1.45) - (this.preBg.width/5.3);
          this.preBg.y = (getWindowHeight()) - (this.preBg.height/2);

          setProperties(this.part1, this.config.part1[this.viewType]);
         // wild anim
       
        }
       
        else{

          this.preBg.scale.set(1);
          this.preBg.width = 1280;
          this.preBg.height = 720;

          this.preBg.y = 0;

          this.preBg.width = w;
          this.preBg.scale.y = this.preBg.scale.x;
          if (this.preBg.height < h) {
            this.preBg.height = h;
            this.preBg.scale.x = this.preBg.scale.y;
          }
        }

      }


      
    } else {

      if (!pcApp) return;

      var w = getWindowWidth();
      var h = getWindowHeight();

      pcApp.view.style.width = w + 'px';
      pcApp.view.style.height = h + 'px';
      pcApp.renderer.resize(w, h);

      var xRatio = getWindowWidth() / pcMaxWidth;
      var yRatio = getWindowHeight() / pcMaxHeight;
      this.viewScale = Math.min(xRatio, yRatio);

      pcIsLandScape = (w > h) ? true : false;
      this.viewType = (w > h) ? "VL" : "VP";

      if (this.preBg) {
        this.preBg.width = w;
        this.preBg.scale.y = this.preBg.scale.x;
        if (this.preBg.height < h) {
          this.preBg.height = h;
          this.preBg.scale.x = this.preBg.scale.y;
        }
      }
      //VP 
      if (this.preBg) {

        if(gameName == "sugarbox5000gold" ){
          setProperties(this.part1, this.config.part1[this.viewType]);
                   // wild anim
         this.part1.anchor.set(0.5);

        //  this.part1.scale.set(0.45);
         this.part1.x = (getWindowWidth()/2);
         this.part1.y = (getWindowHeight()/1.25);
         // wild anim
       
        }


        if(gameName == "mysticalforestadventure" && this.viewType=="VP" ){
         
        this.preBg.width = w;
        this.preBg.scale.y = this.preBg.scale.x;
        if (this.preBg.height < h) {
          this.preBg.height = h;
          this.preBg.scale.x = this.preBg.scale.y;
        }
   
       

         // wild anim
         this.part1.anchor.set(0.5);

         this.part1.scale.set(0.85);
         this.part1.x = (getWindowWidth()/1) - (this.part1.width/2);
         this.part1.y = (getWindowHeight()/1.7) - (this.part1.height/2);
          // pixie dust
          this.part2.anchor.set(0.5);

          this.part2.scale.set(1.1);
           this.part2.x = 300;
           this.part2.y = 240;
         
        }
        if(gameName == "mysticalforestadventure" && this.viewType=="VL" ){
         
          this.preBg.width = w;
          this.preBg.scale.y = this.preBg.scale.x;
          if (this.preBg.height < h) {
            this.preBg.height = h;
            this.preBg.scale.x = this.preBg.scale.y;
          }
     
         
  
           // wild anim
           this.part1.anchor.set(0.5);
  
           this.part1.scale.set(0.66);
           this.part1.x = (getWindowWidth()/1.5) - (this.part1.width/2);
           this.part1.y = (getWindowHeight()/1.45) - (this.part1.height/2);
            // pixie dust
            this.part2.anchor.set(0.5);
  
            this.part2.scale.set(1);
            this.part2.x = 400;
            this.part2.y = 100;
           
          }
  

      }

    }

    setProperties(this.barCtnr, this.config.preBar[this.viewType]);

    if (this.preLogo) {
      if(gameName == "sugarbox5000gold"){
//        setProperties(this.preCompLogo, this.config.preCompLogo[this.viewType]);
      }

      setProperties(this.preLogo, this.config.preLogo[this.viewType]);
    }
    if (this.preTxt) {
      setProperties(this.preTxt, this.config.preTxt[this.viewType]);
      setProperties(this.preCounterTxt, this.config.preCounterTxt[this.viewType]);

    }


    this.preCtnr.pivot.set(0.5, 0.5);
    this.preCtnr.scale.set(this.viewScale);
    this.preCtnr.x = getWindowWidth() / 2;
    this.preCtnr.y = getWindowHeight() / 2;
  }
}

function setProperties(element, props, isUpdateText) {
  if (props.x !== undefined) { element.x = props.x; }
  if (props.y !== undefined) { element.y = props.y; }
  if (props.scale !== undefined) {
    if (!isNaN(Number(props.scale))) {
      element.scale.set(props.scale);
    } else {
      if (props.scale.x !== undefined) { element.scale.x = props.scale.x; }
      if (props.scale.y !== undefined) { element.scale.y = props.scale.y; }
    }
  }
  if (props.pivot !== undefined && element.pivot !== undefined) {

    if (!isNaN(Number(props.pivot))) {
      element.pivot.set(props.pivot, props.pivot);
    } else {
      if (props.pivot.x !== undefined) { element.pivot.x = props.pivot.x; }
      if (props.pivot.y !== undefined) { element.pivot.y = props.pivot.y; }
    }
  }
  if (props.anchor !== undefined && element.anchor !== undefined) {
    if (!isNaN(Number(props.anchor))) {
      element.anchor.set(props.anchor);
    } else {
      if (props.anchor.x !== undefined) { element.anchor.x = props.anchor.x; }
      if (props.anchor.y !== undefined) { element.anchor.y = props.anchor.y; }
    }
  }
  if (props.skew !== undefined && element.skew !== undefined) {
    if (!isNaN(Number(props.skew))) {
      element.skew.set(props.skew);
    } else {
      if (props.skew.x !== undefined) { element.skew.x = props.skew.x; }
      if (props.skew.y !== undefined) { element.skew.y = props.skew.y; }
    }
  }
  if (props.alpha !== undefined) {
    element.alpha = props.alpha;
  }
  if (props.rotation !== undefined) {
    element.rotation = props.rotation;
  }
  if (props.visible !== undefined) {
    element.visible = props.visible;
  }
  if (props.texture !== undefined) {
    this.setTexture(element, props.texture);
  }
  if (props.tint !== undefined) {
    element.tint = props.tint
  }
  // if(element.style && props.textStyle){
  //     element.setStyle(props.textStyle);
  // }
  if (element.style && props.textStyle && isUpdateText) {
    var style = element["textStyle" + _viewInfoUtil.viewType];
    element.style = style;
    // element.style.fontSize = style.fontSize * 2;
    // element.scale.set(0.5);
    if (style.strokeThickness) {
      element.style.strokeThickness = style.strokeThickness / 2;
    }
    if (style.dropShadowDistance) {
      element.style.dropShadowDistance = style.dropShadowDistance / 2;
    }
    if (style.dropShadowBlur) {
      element.style.dropShadowBlur = style.dropShadowBlur / 2;
    }
    if (style.lineHeight) {
      element.style.lineHeight = style.lineHeight / 2;
    }
    element.style.defaultFontSize = element.style.fontSize;
    this.setText(element, element.text);
  }
  if (element.textStyles && props.textStyle && isUpdateText) {
    var style = element["textStyle" + _viewInfoUtil.viewType];
    element.styles = style;
    element.style.fontSize = style.fontSize * 2;
    element.scale.set(0.5);
    element.style.defaultFontSize = element.style.fontSize;
    this.setText(element, element.text);
  }
};

function onPreloaderConfigLoad() {
  preApp = new PreloaderApp();
}

var preApp

function onPageLoad() {
  addScript(appPath + "games/common/src/preloaderConfig.js", onPreloaderConfigLoad);
}

function preloaderListener(num) {
  preApp.preloaderListener(num);
}

function preloaderDestroy() {
  // Remove Dev, Canvas, pixi app, pcFillBar, app
  console.log("preloader Destroy");
  window.removeEventListener('resize', onResizePrelaoderComp.bind(this), true);
  preWrapper.remove();
  pcMaxWidth = pcMaxHeight = pcApp = pcFillBar = pcLogo = pcBgBar = pcFillBar = pcLogoSound = pcLogoSoundisReady = null;
}

function preloaderWindowResize() {
  if (!preWrapper) {
    return;
  }
  var w = getWindowWidth();
  var h = getWindowHeight();
  var scaleX;
  var scaleY;

  if (isDesktop) {
    var canvasMargin = 0.9;
    var ratio = Math.min(window.innerWidth / pcMaxWidth, window.innerHeight / pcMaxHeight) * canvasMargin;
    var x = (window.innerWidth - ratio * pcMaxWidth) / 2;
    var y = (window.innerHeight - ratio * pcMaxHeight) / 2;

    if (window.innerWidth * canvasMargin < pcMaxWidth || window.innerHeight * canvasMargin < pcMaxHeight) {
      preWrapper.style.margin = "initial";
      preWrapper.style.transform = "translate(" + x + "px, " + y + "px) scale(" + ratio + ")";
    } else {
      preWrapper.style.margin = "auto";
      preWrapper.style.transform = "translate(0, 0)";
    }
  } else {
    pcApp.view.style.width = w + 'px';
    pcApp.view.style.height = h + 'px';
    pcApp.renderer.resize(w, h);

    if (this.preBg) {
      this.preBg.width = w;
    }

  }
}

window.addEventListener('resize', onResizePrelaoderComp.bind(this), false);

function onResizePrelaoderComp() {
  if (preApp) {
    preApp.onResize();
  }
  //   setTimeout(function () { this.preloaderWindowResize(); }.bind(this), 50);
}