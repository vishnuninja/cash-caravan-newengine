var BGViewUiConfig = [
  {
    "image": "BG_cash_caravan",
    "id": "bgImg",
    "type": "Spine",
    "defaultAnimation": "BASE_GAME",
    "isSizeDoubled": false,
    "isAnchored": false,
    "isSeparatePortraitImage": true,
    "portraitAnimation":"BASE_MOBILE",
        //only for text
    //"textStyle":"winAmountStyle",
    //only for containerjs
    //has chilren
    //only for buttons
    //default state  disable/enable
    //only for text
    //defautl text
    //"alignment" to be used only for mobiles: 
    //0: CENTER CENTER, 1: TOP LEFT 2: TOP CENTER, 3: TOP RIGHT 4: RIGHT CENTER
    //5: BOTTOM RIGHT 6: BOTTOM CENTER 7: BOTTOM LEFT 8: LEFT CENTER
    "props": {
      "VD": { x:640, y:354 ,anchor: { x: 0.5, y: 0.5 }, scale: { x: 0.67, y: 0.68} },
      "VL": { alignment:12 ,scale: { x:0, y: 0} },
      "VP": { alignment:12 ,scale: { x:0, y: 0} },
    }
  },
  
  {
    "image": "BG_cash_caravan",
    "id": "fsImg",
    "type": "Spine",
    "defaultAnimation":"FREE_GAME",
    "isSeparatePortraitImage": true,
    "portraitAnimation":"FREE_MOBILE",
    // "type": "Spine",
    // "defaultAnimation": "FreeGameAnim",
    "isSizeDoubled": false,
    "isAnchored": true,
    //"alignment" to be used only for mobiles: 
    //0: CENTER CENTER, 1: TOP LEFT 2: TOP CENTER, 3: TOP RIGHT 4: RIGHT CENTER
    //5: BOTTOM RIGHT 6: BOTTOM CENTER 7: BOTTOM LEFT 8: LEFT CENTER
    "props": {
      "VD": { x:640, y:354 ,anchor: { x: 0.5, y: 0.5 }, scale: { x: 0.67, y: 0.68} },
      "VL": { alignment:12 ,scale: { x:0, y: 0} },
      "VP": { alignment:12 ,scale: { x:0, y: 0} },
    }
  },

  // {
  //   "image": "Bonus_bg",
  //   "id": "bonusWHALLAbg",
  //   "type": "Spine",
  //   "defaultAnimation":"free_game",
  //   "isSizeDoubled": false,
  //   "isAnchored": true,
  //   "props": {
  //     "VD": { x:640, y:360 ,anchor: { x: 0.5, y: 0.5 }, scale: { x: 0.67, y: 0.67} },
  //     "VL": { "y": 0, alignment:13, scale: { x:0.53, y: 0.53} },
  //     "VP": { "x": 201,"y": 342,alignment:12 ,scale: { x:0.7, y: 1} },
  //   }
  // },

  // {
  //   "image": "freeGameBg",
  //   "id": "bonus_bg",
  //   "type": "sprite",
  //   "isSizeDoubled": false,
  //   "isAnchored": true,
  //   "props": {
  //     "VD": { x:640, y:360 ,anchor: { x: 0.5, y: 0.5 }, scale: { x: 0.67, y: 0.67} },
  //     "VL": { "y": 0, alignment:11, scale: { x:0.53, y: 0.53} },
  //     "VP": { "x": 201,"y": 342,alignment:12 ,scale: { x:0.7, y: 1} },
  //   }
  // }
 
];
