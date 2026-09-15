var _ng = _ng || {};

_ng.ReelViewUiConfig = {
    "data": {
        "noOfReels": 6,
        "noOfSymbols": 7,
        "minSpeed":5,
        "maxSpeed":60,
        "spinSpeed":20,
        "anticipationMaxSpeed":50,//reel spinning speed 
        "anticipationDelay":3000, // reel spin duration  
        "anticipationSpine":{
            "spineName":"Reel_FX.json",
            "animationName":"animation",
            // "frames": ["Anticipation_00.png","Anticipation_01.png","Anticipation_02.png","Anticipation_03.png","Anticipation_04.png","Anticipation_05.png","Anticipation_06.png","Anticipation_07.png" ],
           // "frames2": ["Front_side_00", "Front_side_01", "Front_side_02", "Front_side_03", "Front_side_04", "Front_side_05", "Front_side_06", "Front_side_07", "Front_side_08", "Front_side_09", "Front_side_10", "Front_side_11", "Front_side_12", "Front_side_13", "Front_side_14", "Front_side_15", "Front_side_16", "Front_side_17", "Front_side_18", "Front_side_19", "Front_side_20", "Front_side_21", "Front_side_22", "Front_side_23", "Front_side_24"],
            
            props : {x: 240, y:385, scale:{x:0.7}},
            //"props2" : {x: 300, y:355, scale:{x:1}, animationSpeed: 0.3 }
            
        },
        //uncomment this to get height width of reel
        "reelViewFixedDimensions":true,
        "defaultReels": ["dgfcca", "fecfdb", "ecddcd","abcdec","abcdec","fecfdb","dgfcca"],
        "extraAddSymbols": ["a", "b", "c", "d", "e", "f", "g","h","i","j","w","s"],
        "ReelSymbolType": ["_6x","_5x","_4x","_3x","_2x","_1x"],  //The type of symbols which will be used in the reel during variable reel
        // "ReelHeightType":[0,40,45,22.5,40,35],//The position of the reel to accomodate the new reel size
        "ReelHeightType":[-36 , 8, 30, 50, 50, 50, 10],//The position of the reel to accomodate the new reel size
        "topReelYPos":0,
        // "symbolConfig": {"symbolWidth": 114, "symbolHeight": 110, "symbolXGap": 3, "symbolYGap": 1},
        "symbolConfig": {"symbolWidth": 114, "symbolHeight": 110, "symbolXGap": 0, "symbolYGap": 0},
        "eachReelPos": [725, -20, 125, 275, 425, 578, 742],
        "eachReelYPos": [10, 10, 10, 10, 10, 10, 10], //Overwriting by reelHeightType...
        //Adding mask to reels ,reel wise instead of whole due to top reel
        "maskInfo": {
            "maskType": "1",
            "maskPosition": {x: 139, y: 176.5, width: 931, height:455},
            "maskPositionTop": {x: 296, y: 48, width: 625, height:116.5}//top reel mask
            // "maskType": "2",
            // "reelMaskPosition": [
            // {x: 297, y: 46, width: 618.5, height: 110.5},
            // {x: 148, y: 175, width: 151.5, height: 460.5},
            // {x: 298, y: 175, width: 151.5, height: 460.5},
            // {x: 450, y: 175, width: 151.5, height: 460.5},
            // {x: 602, y: 175, width: 151.5, height: 460.5},
            // {x: 753, y: 175, width: 151.5, height: 460.5},
            // {x: 910, y: 175, width: 151.5, height: 460.5}
            // ]
        },
        "reelPositionsWRTGrid": {x: 178, y: 182, scale:{x:1,y:1} },//width: 868 , height:872
        "reelPositionsWRTGridFG": {x: 310, y: 20, scale:{x:1,y:1} },
        "reelSpinConfig":{
            "useBlur": true,
            "startJerk":true,  //start jerk needed to math buffalo kking spin
            "startJerkSpeed":300,
            "startJerkDistance":30,

            "endJerk":true,
            "endJerkSpeed":5,
            "endJerkDistance":20,

            "reelSpinStartGap":50,
            "reelStopGap":300,

            "scatterAccelerationDelay":1000,
            "scatterAccelarion":true,

            "reelStopAfterResponseDelay":1,
            "hideTopSymbol":true,  //hide top symbol on reels for top reel
        },
        "lineWinAmtPos":{ x:0, y:50 },
        "lineWinAmountTextPos": { y: 11 },
        "isSymbolFadeInWins": true
    },
    "showScatterLand":true,
    "layout": {
        "VD": {"marginLeft": 48, "marginTop": 0, "scale": .85,"w":1038.84,"h":658.45},
        "VL": {"marginLeft": 60, "marginTop": 10, "scale": .85,"w":1038.84,"h":658.45},
        "VP": { "marginLeft": -55 , "marginTop": 0, "scale": .75,"w":795.04,"h":925.92}
    },
    "iPadLayout": {
        "VD": {
            "marginLeft": 0,
            "marginTop": 0,
            "scale": 1
        },
        "VL":{
            "marginLeft": -50,
            "marginTop": -10,
            "scale": 1
        },
        "VP": {
            "marginLeft": -137+30,
            "marginTop": -70,
            "scale": 0.9
        }
    },
    "reelGridBottom": {
        "image": "frame",
        "id": "reelGridBottom",
        "type": "sprite",
        // "image": "reels",
        // "type": "Spine",
        "defaultAnimation": "animation",
        "props": {
            "VD": { x: 131, y: 14, scale: { x:.98, y:.95 } },
            "VL": { x: 660, y: 308, scale: 0.5},
            "VP": { x: 0, y: 0, scale: 0.5}
        }
    },
    // "fsReelGridBottom": {
    //     "image": "reelBg_6x6",
    //     "id": "fsReelGridBottom",
    //     "type": "sprite",        
    //     "props": {
    //         "VD": { x: 238, y: 63, scale: { x: 1, y: 1 } },
    //         "VL": {x: 133, y: 0},
    //         "VP": {x: 10, y: -70}
    //     }
    // },
    // "reelGridTop": {
    //     "image": "ReelFrame",
    //     "id": "reelGridTop",
    //     "type": "sprite",        
    //     "props": {
    //         "VD": {x:71.5, y: 34.5, scale: { x:0.65, y:0.65 }},
    //         "VL": {x: 133, y: 0},
    //         "VP": {x: 10, y: -70}
    //     }
    // },
    // "reelDivider": {
    //     "image": "Divider",
    //     "type": "sprite",        
    //     "props": {
    //         "VD": {x:286, y: 134, scale: { x:0.675, y:0.66 }},
    //         "VL": {x: 133, y: 0},
    //         "VP": {x: 10, y: -70}
    //     }
    // },

};
