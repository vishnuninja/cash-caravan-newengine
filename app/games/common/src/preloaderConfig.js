var preType = "common";
// preType = gameName;

preloaderConfig = {
  "preloader": { "file": "preloader0.json", "path": "games/" + preType + "/dist/@1x/" },
  // "brandLogo": { "file": "preloader.json", "path": "games/" + preType + "/dist/@1x/" },
  "sound": { "file": "preloaderSnd.mp3", "path": "games/" + preType + "/dist/sounds/", "volume": 0.5 },

  "hideLogo": false,

  /*"logoConfig": {
    "type": "static", //static  //spriteAnimation  
    "showBarOnFrame": 125,
    "prefixName": "intro-logo", "startIndex": 0, "endIndex": 49, "digit": "dual", "animationSpeed": 0.5,
  },*/

  // "preBg": {
  //   "img": "preloaderBg",
  //   "VD": { x: 0, y: -50, anchor: 0.5, scale: 1 },
  //   "VL": { x: 0, y: -50, anchor: 0.5, scale: 1 },
  //   "VP": { x: 0, y: 0, anchor: 0.5, scale: 1 }
  // },

  "preLogo": {
    "img": "preloaderLogo",
    "VD": { x: 0, y: -50, anchor: 0.5, scale: 1 },
    "VL": { x: 0, y: -50, anchor: 0.5, scale: 1 },
    "VP": { x: 0, y: 0, anchor: 0.5, scale: 1.3 }
  },

  "preBar": {
    "barBg": "loadingBarBG",
    "barFill": "loadingBarFill",
    "VD": { x: -168, y: 60, scale: 1 },
    "VL": { x: -168, y: 60, scale: 1 },
    "VP": { x: -330, y: 115, scale: 2 }
  }

}


var siteCode = getUrlVar("full_site_code");
var networkCode = "";
if (siteCode) networkCode = siteCode.slice(2, 5);


switch (networkCode) {
  // case "AGM":
  //   preloaderConfig["logoConfig"] = {};
  //   break
  default:
    break
}

switch (siteCode) {
  // case "EGDEVES":
  //   preloaderConfig["logoConfig"] = {};
  //   break
  default:
    break
}

switch (gameName) {
  case "wildwestlegends":
    preloaderConfig = {
      "preloader": { "file": "preloader0.json", "path": "games/" + gameName + "/dist/@1x/" },
      // "brandLogo": { "file": "preloader.json", "path": "games/" + gameName + "/dist/@1x/" },
      // "sound": { "file": "preloaderSnd.mp3", "path": "games/" + gameName + "/dist/sounds/", "volume": 0.5 },

      "hideLogo": false,

      "logoConfig": {
        "type": "static", //static  //spriteAnimation  
        "showBarOnFrame": 125,
        "prefixName": "intro-logo", "startIndex": 0, "endIndex": 49, "digit": "dual", "animationSpeed": 0.5,
      },

      "preBg": {
        "img": "preloaderBg",
        "VD": { x: 0, y: -50, anchor: 0.5, scale: 1 },
        "VL": { x: 0, y: -50, anchor: 0.5, scale: 1 },
        "VP": { x: 0, y: 0, anchor: 0.5, scale: 1 }
      },

      "preLogo": {
        "img": "preloaderLogo",
        "VD": { x: 0, y: 0, anchor: 0.5, scale: 0.7 },
        "VL": { x: 0, y: 0, anchor: 0.5, scale: 0.7 },
        "VP": { x: 0, y: 0, anchor: 0.5, scale: 1 }
      },

      "preTxt": {
        "img": "loadingTxt",
        "VD": { x: 60, y: -50, scale: 1 },
        "VL": { x: 60, y: -50, scale: 1 },
        "VP": { x: 35, y: -50, scale: 1.5 }
      },

      "preBar": {
        "barBg": "loadingBarBG",
        "barFill": "loadingBarFill",
        "VD": { x: -100, y: 280, scale: 1 },
        "VL": { x: -100, y: 280, scale: 1 },
        "VP": { x: -150, y: 360, scale: {x:1.5, } }
      }

    }
    break;

    case "terracottawarrior":
      preloaderConfig = {
        // "preloader": { "file": "introLoading-0.json", "path": "games/" + gameName + "/dist/@1x/" },
        "preloader": { "file": "Loading.json", "path": "games/" + gameName + "/dist/@1x/" },
     //  "image": { "file": "background_Portrait.json", "path": "games/" + gameName + "/dist/@1x/" },
        //  "brandLogo": { "file": "preloader.json", "path": "games/" + gameName + "/dist/@1x/" },
        // "sound": { "file": "preloaderSnd.mp3", "path": "games/" + gameName + "/dist/sounds/", "volume": 0.5 },
  
        "hideLogo": false,
  
        // "logoConfig": {
        //   "type": "static", //static  //spriteAnimation  
        //   "showBarOnFrame": 125,
        //   "prefixName": "intro-logo", "startIndex": 0, "endIndex": 49, "digit": "dual", "animationSpeed": 0.5,
        // },
  
        "preBg": {
          "img": "BG",
          "VD": { x: 0, y: 0, anchor: 0.5, scale: 1 },
          "VL": { x: 0, y: 0, anchor: 0.5, scale: 1 },
          "VP": { x: 0, y: 0, scale: 0}
        },

        // "preBg1":{
        //   "img": "background_Portrait",
        //   "VP": { x: 0, y: 0, scale: 1}

        // },
  
        "preLogo": {
          "img": "title",
          "VD": { x: 0, y: 0, anchor: 0.5, scale: 1 },
          "VL": { x: 0, y: 0, anchor: 0.5, scale: 1 },
          "VP": { x: 0, y: 0, anchor: 0.5, scale: 1.2 }
        },
  
        // "logoAni": {
        //   "img": "Loading_Base",
        //   "VD": { x: -3, y: 100, anchor: 0.5, scale: 1 },
        //   "VL": { x: 0, y: 0, anchor: 0.5, scale: 1 },
        //   "VP": { x: 0, y: 0, anchor: 0.5, scale: 1 }
     //   },

        "preTxt": {
          "img": "Loading",
          "VD": { x: 120, y: 50},
          "VL": { x: 90, y: 50, scale: 1 },
          "VP": { x: 50, y: 50, scale: {x:1.4,y:1.4} }
        },

        "preCounterTxt": {
          "VD": { x: 260, y: 49 },
          "VL": { x: 230, y: 50, scale: 1 },
          "VP": { x: 250, y: 50, scale:{x:1.4,y:1.4} }
        },
  
        "preBar": {
          "barBg": "Loading_Base",
          "barFill": "Loading_Filling",
          "VD": { x: -220, y: 150, scale: 1 },
          "VL": { x: -220, y: 160, scale: 1 },
          "VP": { x: -350, y: 250, scale: {x:1.8,y:1.8 } }
        }
  
      }
      break;
  case "mysticalforestadventure":
    preloaderConfig = {
      "preloader": { "file": "loading.json", "path": "games/" + gameName + "/dist/@1x/" },
      // "brandLogo": { "file": "preloader.json", "path": "games/" + gameName + "/dist/@1x/" },
      // "sound": { "file": "preloaderSnd.mp3", "path": "games/" + gameName + "/dist/sounds/", "volume": 0.5 },

      // "hideLogo": false,

      // "logoConfig": {
      //   "type": "static", //static  //spriteAnimation  
      //   "showBarOnFrame": 125,
      //   "prefixName": "intro-logo", "startIndex": 0, "endIndex": 49, "digit": "dual", "animationSpeed": 0.5,
      // },

      "preBg": {
        "img": "Loading_BG",
        "VD": { x: 0, y: 0, anchor: 0.5, scale: 1},
        "VL": { x: 0, y: -50, anchor: 0.5, scale: 1 },
        "VP": { x: 0, y: -50, anchor: 0.5, scale: 1 }
      },

      "preLogo": {
        "img": "Mystical_Foreset",
        "VD": { x: 0, y: 80, anchor: 0.5, scale: 1 },
        "VL": { x: 0, y: 80, anchor: 0.5, scale: 1 },
        "VP": { x: 0, y: 100, anchor: 0.5, scale: 1.8 }
      },
      "part1": {
        "img": "Wild_amimation",
        "VD": { x: 0, y: 0, anchor: 0.5, scale: 1 },
        "VL": { x: 0, y: -80, anchor: 0.5, scale: 1 },
        "VP": { x: 0, y: 0, anchor: 0.5, scale: 1 }
      },
      "part2": {
        "img": "Pixie_Dust",
        "VD": { x: 0, y: 0, anchor: 0.5, scale: 1 },
        "VL": { x: 0, y: -80, anchor: 0.5, scale: 1 },
        "VP": { x: 0, y: 0, anchor: 0.5, scale: 1}
      },

      "preTxt": {
        "img": "Loading",
        "VD": { x: 50, y: 42, scale: 1.1 },
        "VL": { x: 40, y: 40, scale: 1.2 },
        "VP": { x: 45, y: 40, scale: 1.25 }
      },

      "preCounterTxt": {
        "VD": { x: 180, y: 43 },
        "VL": { x: 182, y: 40, scale: 1.15 },
        "VP": { x: 185, y: 40, scale:{x:1.2,y:1.2} }
      },
      "preBar": {
        "barBg": "Base",
        "barFill": "Filling",
        "VD": { x: -130, y: 225, scale: 1 },
        "VL": { x: -170, y: 225, scale: 1.4 },
        "VP": { x: -310, y: 380, scale: 2.4 }
      }

    }
    break;
    case "sugarbox5000gold":
      preloaderConfig = {
        "preloader": { "file": "loading.json","path": "games/" + gameName + "/dist/"+lang+"/@1x/" },
        // "brandLogo": { "file": "preloader.json", "path": "games/" + gameName + "/dist/@1x/" },
        // "sound": { "file": "preloaderSnd.mp3", "path": "games/" + gameName + "/dist/sounds/", "volume": 0.5 },
  
        // "hideLogo": false,
  
        // "logoConfig": {
        //   "type": "static", //static  //spriteAnimation  
        //   "showBarOnFrame": 125,
        //   "prefixName": "intro-logo", "startIndex": 0, "endIndex": 49, "digit": "dual", "animationSpeed": 0.5,
        // },
  
        "preBg": {
          "img": "Bg",
          "VD": { x: 0, y: 0, anchor: 0.5, scale: 1},
          "VL": { x: 0, y: -50, anchor: 0.5, scale: 1 },
          "VP": { x: 0, y: -50, anchor: 0.5, scale: 1 }
        },
  
        "preLogo": {
          "img": "ninjaLogo",
          "VD": { x: 0, y: 0, anchor: 0.5, scale: 0.6},
          "VL": { x: 0, y: -50, anchor: 0.5, scale: 0.6 },
          "VP": { x: 0, y: 0, anchor: 0.5, scale: 1 }
        },
        "part1": {
          "img": "Logo2",
          "VD": { x: 650, y: 650, anchor: 0.5, scale: 0.6, visible : false },
          "VL": { x: 0, y: -80, anchor: 0.5, scale: 0.35, visible : false },
          "VP": { x: 300, y: 600, anchor: 0.5, scale: 0.4, visible : false }
        },
      
        "preTxt": {
          // "img": "LOADING_",
          "VD": { x: 140, y: 120, scale: 0 },
          "VL": { x: 115, y: 120, scale: 0 },
          "VP": { x: 120, y: 120, scale: 0 }
        },
  
        "preCounterTxt": {
          "VD": { x: 180, y: 43, scale: 0 },
          "VL": { x: 182, y: 40, scale: 0 },
          "VP": { x: 185, y: 40, scale:{x:0,y:0} }
        },
        "preBar": {
          "barBg": "bar",
          "barFill": "fill",
          "VD": { x: -300, y: 145, scale: 0.6 },
          "VL": { x: -270, y: 125, scale:0.55},
          "VP": { x: -440, y: 320, scale: 0.9 }
        },
        "language": {
          "en": "Loading...",
          "tr": "Yükleniyor..."
        }
  
      }
      break;
   
  case "thedragonwarriors":
    preloaderConfig = {
      "preloader": { "file": "preloader0.json", "path": "games/" + gameName + "/dist/@1x/" },
      // "brandLogo": { "file": "preloader.json", "path": "games/" + gameName + "/dist/@1x/" },
      // "sound": { "file": "preloaderSnd.mp3", "path": "games/" + gameName + "/dist/sounds/", "volume": 0.5 },

      "hideLogo": false,

      /*"logoConfig": {
        "type": "static", //static  //spriteAnimation  
        "showBarOnFrame": 125,
        "prefixName": "intro-logo", "startIndex": 0, "endIndex": 49, "digit": "dual", "animationSpeed": 0.5,
      },*/

      "preBg": {
        "img": "preloaderBg",
        "VD": { x: 0, y: -50, anchor: 0.5, scale: 1 },
        "VL": { x: 0, y: -50, anchor: 0.5, scale: 1 },
        "VP": { x: 0, y: 0, anchor: 0.5, scale: 1 }
      },

      "preLogo": {
        "img": "preloaderLogo",
        "VD": { x: 240, y: -70, anchor: 0.5, scale: 0.91 },
        "VL": { x: 280, y: -70, anchor: 0.5, scale: 0.91 },
        "VP": { x: 0, y: -70, anchor: 0.5, scale: 1.3 }
      },

      "preTxt": {
        "img": "loadingTxt",
        "VD": { x: 110, y: -50, scale: 1 },
        "VL": { x: 110, y: -50, scale: 1 },
        "VP": { x: 80, y: -50, scale: 1.5}
      },

      "preBar": {
        "barBg": "loadingBarBG",
        "barFill": "loadingBarFill",
        "VD": { x: -160, y: 185, scale: 1 },
        "VL": { x: -160, y: 185, scale: 1 },
        "VP": { x: -310, y: 340, scale: 2 }
      }

    }
    break
  case "queensakura":
    preloaderConfig = {
      "preloader": { "file": "preloader0.json", "path": "games/" + gameName + "/dist/@1x/" },
      "hideLogo": false,
      "logoConfig": {
        "type": "static",
        "showBarOnFrame": 125,
        "prefixName": "intro-logo", "startIndex": 0, "endIndex": 49, "digit": "dual", "animationSpeed": 0.5,
      },

      "preBg": {
        "img": "preloaderBg",
        "VD": { x: 0, y: -50, anchor: 0.5, scale: 1 },
        "VL": { x: 0, y: -50, anchor: 0.5, scale: 1 },
        "VP": { x: 0, y: 0, anchor: 0.5, scale: 1 }
      },

      "preLogo": {
        "img": "preloaderLogo",
        "VD": { x: 0, y: -100, anchor: 0.5, scale: 1.2 },
        "VL": { x: -20, y: -70, anchor: 0.5, scale: 1.2 },
        "VP": { x: 10, y: -360, anchor: 0.5, scale: 4 }
      },

      "preTxt": {
        "img": "loadingTxt",
        "VD": { x: 100, y: -50, scale: 1 },
        "VL": { x: 100, y: -50, scale: 1 },
        "VP": { x: 70, y: -50, scale: 1.5 }
      },

      "preBar": {
        "barBg": "loadingBarBG",
        "barFill": "loadingBarFill",
        "VD": { x: -150, y: 145, scale: 1 },
        "VL": { x: -160, y: 180, scale: 1 },
        "VP": { x: -180, y: -10, scale: 1.3 }
      }

    }
    break;
    case "ninjagold":
    preloaderConfig = {
      "preloader": { "file": "preloader0.json", "path": "games/" + gameName + "/dist/@1x/" },
      // "brandLogo": { "file": "preloader.json", "path": "games/" + gameName + "/dist/@1x/" },
      // "sound": { "file": "preloaderSnd.mp3", "path": "games/" + gameName + "/dist/sounds/", "volume": 0.5 },
      "hideLogo": false,
      "logoConfig": {
        "type": "static", //static  //spriteAnimation  
        "showBarOnFrame": 125,
        "prefixName": "intro-logo", "startIndex": 0, "endIndex": 49, "digit": "dual", "animationSpeed": 0.5,
      },

      "preBg": {
        "img": "introImg2",
        "VD": { x: 0, y: -50, anchor: 0.5, scale: 1 },
        "VL": { x: 0, y: -360, anchor: 0.5, scale: 1 },
        "VP": { x: -200, y: 0, anchor: 0.5, scale: 1.5 }
      },

      "preLogo": {
        "img": "",
        "VD": { x: -20, y: -250, anchor: 0.5, scale: 0.6 },
        "VL": { x: -20, y: -250, anchor: 0.5, scale: 0.6 },
        "VP": { x: 0, y: -880, anchor: 0.5, scale: 1.5 }
      },

      "preTxt": {
        "img": "loadingTxt",
        "VD": { x: 135, y: -50, scale: 1 },
        "VL": { x: 135, y: -50, scale: 1 },
        "VP": { x: 120, y: -50, scale: 1.3 }
      },

      "preBar": {
        "barBg": "loadingBarBG",
        "barFill": "loadingBarFill",
        "VD": { x: -140, y: 180, scale: 0.8 },
        "VL": { x: -140, y: 180, scale: 0.8 },
        "VP": { x: -180, y: 450, scale: 1.3 }
      }

    }
    break;
  case "raiden":
      preloaderConfig = {
        "preloader": { "file": "preloader0.json", "path": "games/" + gameName + "/dist/@1x/" },
        // "brandLogo": { "file": "preloader.json", "path": "games/" + gameName + "/dist/@1x/" },
        // "sound": { "file": "preloaderSnd.mp3", "path": "games/" + gameName + "/dist/sounds/", "volume": 0.5 },
  
        "hideLogo": false,
  
        "logoConfig": {
          "type": "static", //static  //spriteAnimation  
          "showBarOnFrame": 125,
          "prefixName": "intro-logo", "startIndex": 0, "endIndex": 49, "digit": "dual", "animationSpeed": 0.5,
        },
  
        "preBg": {
          "img": "preloaderBg",//preloaderBg
          "VD": { x: 0, y: -50, anchor: 0.5, scale: 1 },
          "VL": { x: 0, y: -50, anchor: 0.5, scale: 1 },
          "VP": { x: 0, y: 0, anchor: 0.5, scale: 0.5 }
        },
  
        "preLogo": {
          "img": "preloaderLogo",
          "VD": { x: 0, y: -70, anchor: 0.5, scale: 1.9 },
          "VL": { x: 0, y: -70, anchor: 0.5, scale: 1.9 },
          "VP": { x:-50, y: -70, anchor: 0.5, scale: 3.8 }
        },

        "Img": {
          "img": "preloaderBg",
          "VD": { x: 160, y: -180, anchor: 0.5, scale: {x: 1, y: 1} },
          "VL": { x: 160, y: -180, anchor: 0.5, scale: {x: 1, y: 1} },
          "VP": { x: 0, y:  0, anchor: 0.5, scale: 3.8, alpha: 0 }
        },

        "Img1": {
          "img": "preloaderBgP",
          "VD": { x: 0, y: -70, anchor: 0.5, scale: 1.9, alpha: 0 },
          "VL": { x: 0, y: -70, anchor: 0.5, scale: 1.9, alpha: 0 },
          "VP": { x: 175, y: -185, anchor: 0.5, scale: {x: 1.37, y: 1.38} }
        },
  
        "preTxt": {
          "img": "loadingTxt",
          "VD": { x: 110, y: -50, scale: 1 },
          "VL": { x: 110, y: -50, scale: 1 },
          "VP": { x: 100, y: -50, scale: 1.3 }
        },
  
        "preBar": {
          "barBg": "loadingBarBG",
          "barFill": "loadingBarFill",
          "VD": { x: -160, y: 180, scale: 1 },
          "VL": { x: -160, y: 180, scale: 1 },
          "VP": { x: -228, y: 230, scale: 1.3 }
        }
  
    }
    break;
  case "wildstarstacks":
    preloaderConfig = {
      "preloader": { "file": "preloader0.json", "path": "games/" + gameName + "/dist/@1x/" },
      // "brandLogo": { "file": "preloader.json", "path": "games/" + gameName + "/dist/@1x/" },
      // "sound": { "file": "preloaderSnd.mp3", "path": "games/" + gameName + "/dist/sounds/", "volume": 0.5 },

      "hideLogo": false,

      "logoConfig": {
        "type": "static", //static  //spriteAnimation  
        "showBarOnFrame": 125,
        "prefixName": "intro-logo", "startIndex": 0, "endIndex": 49, "digit": "dual", "animationSpeed": 0.5,
      },

      "preBg": {
        "img": "preloaderBg",
        "VD": { x: 0, y: -50, anchor: 0.5, scale: 1 },
        "VL": { x: 0, y: -50, anchor: 0.5, scale: 1 },
        "VP": { x: 0, y: 0, anchor: 0.5, scale: 1 }
      },

      "preLogo": {
        "img": "preloaderLogo",
        "VD": { x: 0, y: -70, anchor: 0.5, scale: 1.9 },
        "VL": { x: 0, y: -70, anchor: 0.5, scale: 1.9 },
        "VP": { x: 0, y: -150, anchor: 0.5, scale: 1.9 }
      },

      "preTxt": {
        "img": "loadingTxt",
        "VD": { x: 110, y: -50, scale: 1 },
        "VL": { x: 110, y: -50, scale: 1 },
        "VP": { x: 90, y: -50, scale: 1.3 }
      },

      "preBar": {
        "barBg": "loadingBarBG",
        "barFill": "loadingBarFill",
        "VD": { x: -160, y: 180, scale: 1 },
        "VL": { x: -160, y: 180, scale: 1 },
        "VP": { x: -200, y: 230, scale: 1.3 }
      }

    }
    case "prosperousbloom":
    preloaderConfig = {
      "preloader": { "file": "preloader0.json", "path": "games/" + gameName + "/dist/@1x/" },
      // "brandLogo": { "file": "preloader.json", "path": "games/" + gameName + "/dist/@1x/" },
      // "sound": { "file": "preloaderSnd.mp3", "path": "games/" + gameName + "/dist/sounds/", "volume": 0.5 },

      "hideLogo": false,

      "logoConfig": {
        "type": "static", //static  //spriteAnimation  
        "showBarOnFrame": 125,
        "prefixName": "intro-logo", "startIndex": 0, "endIndex": 49, "digit": "dual", "animationSpeed": 0.5,
      },

      "preBg": {
        "img": "preloaderBg",
        "VD": { x: 0, y: -50, anchor: 0.5, scale: 1 },
        "VL": { x: 0, y: -50, anchor: 0.5, scale: 1 },
        "VP": { x: 0, y: 0, anchor: 0.5, scale: 1 }
      },

      "preLogo": {
        "img": "preloaderLogo",
        "VD": { x: 0, y: -70, anchor: 0.5, scale: 1.9 },
        "VL": { x: 0, y: -70, anchor: 0.5, scale: 1.9 },
        "VP": { x: 0, y: -150, anchor: 0.5, scale: 1.9 }
      },

      "preTxt": {
        "img": "loadingTxt",
        "VD": { x: 110, y: -50, scale: 1 },
        "VL": { x: 110, y: -50, scale: 1 },
        "VP": { x: 90, y: -50, scale: 1.3 }
      },

      "preBar": {
        "barBg": "loadingBarBG",
        "barFill": "loadingBarFill",
        "VD": { x: -160, y: 180, scale: 1 },
        "VL": { x: -160, y: 180, scale: 1 },
        "VP": { x: -200, y: 230, scale: 1.3 }
      }

    }
    break;
    case "magicalwings":
    preloaderConfig = {
      "preloader": { "file": "preloader0.json", "path": "games/" + gameName + "/dist/@1x/" },
      // "brandLogo": { "file": "preloader.json", "path": "games/" + gameName + "/dist/@1x/" },
      // "sound": { "file": "preloaderSnd.mp3", "path": "games/" + gameName + "/dist/sounds/", "volume": 0.5 },

      "hideLogo": false,

      "logoConfig": {
        "type": "static", //static  //spriteAnimation  
        "showBarOnFrame": 125,
        "prefixName": "intro-logo", "startIndex": 0, "endIndex": 49, "digit": "dual", "animationSpeed": 0.5,
      },

      "preBg": {
        "img": "background",
        "VD": { x: 0, y: -50, anchor: 0.5, scale: 1 },
        "VL": { x: 0, y: -50, anchor: 0.5, scale: 1 },
        "VP": { x: 0, y: 0, anchor: 0.5, scale: 1 }
      },

      "preLogo": {
        "img": "preloaderLogo",
        "VD": { x: 0, y: -70, anchor: 0.5, scale: 1 },
        "VL": { x: 0, y: -70, anchor: 0.5, scale: 1.1 },
        "VP": { x: 0, y: -70, anchor: 0.5, scale: 1.75 }
      },

      "preTxt": {
        "img": "loadingTxt",
        "VD": { x: 110, y: -50, scale: 1 },
        "VL": { x: 110, y: -50, scale: 1 },
        "VP": { x: 100, y: -50, scale: 1.5 }
      },

      "preBar": {
        "barBg": "loadingBarBG",
        "barFill": "loadingBarFill",
        "VD": { x: -160, y: 180, scale: 1 },
        "VL": { x: -160, y: 180, scale: 1 },
        "VP": { x: -228, y: 230, scale: 1.5 }
      }

    }
    break;

  default:
    break
}