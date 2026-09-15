var _ng = _ng || {};

_ng.SuperMeterConfig = {
    makeResponsive: true,
    "props": {
        "VD": { x: 1035, y: 685, visible: true },
        HX: 960, HY: 677,
        VX: 120, VY: 1110,
        landScaleX: 1, landScaleY: 1,
        portScaleX: 1, portScaleY: 1,
        landAlignX: "RIGHT", landAlignY: "BOTTOM",
        portAlignX: "RIGHT", portAlignY: "BOTTOM"
    },

    "smCoinValueCtrn": {
        "props": { x: -48, y: 290 },
        "txtStyle": {
            "fontFamily": "ProximaNova_Bold",
            fill: 0xd4edda,
            "strokeThickness": 2,
            "stroke": '#3d8750',
            align: 'center',
            fontSize: 25,
            lineHeight: 90,
            "maxWidth": 650
        }
    },

    "containerList": {

        "smCoinList": {
            "type": "Container",
            "props": {
                "VD": { x: 5, y: -475, scale: 1 },
                "VL": { x: 22, y: -475, scale: 1 },
                "VP": { x: 30, y: -655, scale: 1.4 }
            },
            "children": {
                "smBetBg": {
                    type: "Sprite",
                    props: {
                        img: "smListBg",
                        VD: { x: -22, y: 375, anchor: 0.5 },
                        VL: { x: -22, y: 375, anchor: 0.5 },
                        VP: { x: -22, y: 375, anchor: 0.5 }
                    }
                },
                "smSelectBg": {
                    type: "Button",
                    props: {
                        img: "smSelectBg",
                        VD: { x: -22, y: 440, anchor: 0.5 },
                        VL: { x: -22, y: 440, anchor: 0.5 },
                        VP: { x: -22, y: 440, anchor: 0.5 }
                    }
                }
            }
        },

        "superMeterBtn": {
            "type": "Container",
            "props": {
                "VD": { x: -20, y: 0, visible: true, scale: 1  },
                "VL": { x: 0, y: 0, visible: true, scale: 1  },
                "VP": { x: 0, y: 0, visible: true, scale: 1.4  }
            },
            "children": {
                // "smBetBg": {
                //     type: "Sprite",
                //     props: {
                //         img: "smBg",
                //         VD: { x: 0, y: 0, anchor: 0.5 },
                //         VL: { x: 0, y: 0, anchor: 0.5 },
                //         VP: { x: 0, y: 0, anchor: 0.5 }
                //     }
                // },

                "smBetBtn": {
                    type: "Button",
                    props: {
                        img: "smBtn",
                        VD: { x: 0, y: 0, anchor: 0.5 },
                        VL: { x: 0, y: 0, anchor: 0.5 },
                        VP: { x: 0, y: 0, anchor: 0.5 }
                    }
                },

                "smBalanceTxt": {
                    "type": "Text",
                    "props": {
                        "text": "0.01",
                        "VD": { x: 0, y: 6, anchor: 0.5 },
                        "VL": { x: 0, y: 6, anchor: 0.5 },
                        "VP": { x: 0, y: 6, anchor: 0.5 },
                        "style": {
                            "fontWeight": "bold",
                            "fontSize": 22,
                            "fontFamily": "ProximaNova_Bold",
                            "fill": "0xd4edda",
                            "strokeThickness": 2,
                            "stroke": '#3d8750',
                            "lineJoin": "round",
                            "align": 'center',
                            "maxWidth": 300
                        }
                    }
                },
                "smArrowBtn": {
                    type: "Button",
                    props: {
                        img: "smArrow",
                        VD: { x: 45, y: 10, anchor: 0.5 },
                        VL: { x: 45, y: 10, anchor: 0.5 },
                        VP: { x: 45, y: 10, anchor: 0.5 }
                    }
                },
            }
        },

        "smCollectBgBtn": {
            "type": "Container",
            "props": {
                VD: { x: 130, y: 0, anchor: 0.5, scale: 1  },
                VL: { x: 145, y: 0, anchor: 0.5, scale: 1  },
                VP: { x: 480, y: 0, anchor: 0.5, scale: 1.4  }
            },
            "children": {
                // "smCollectBg": {
                //     type: "Sprite",
                //     props: {
                //         img: "smCollectBg",
                //         VD: { x: 0, y: 0, anchor: 0.5 },
                //         VL: { x: 0, y: 0, anchor: 0.5 },
                //         VP: { x: 0, y: 0, anchor: 0.5 }
                //     }
                // },

                "smCollectBtn": {
                    type: "Button",
                    props: {
                        img: "smCollect",
                        VD: { x: 0, y: 0, anchor: 0.5 },
                        VL: { x: 0, y: 0, anchor: 0.5 },
                        VP: { x: 0, y: 0, anchor: 0.5 }
                    }
                }

            }
        },


        // "smCollectBgBtn": {
        //     type: "Button",
        //     props: {
        //         img: "smCollect",
        //         VD: { x: 130, y: 0, anchor: 0.5 },
        //         VL: { x: 130, y: 0, anchor: 0.5 },
        //         VP: { x: 130, y: 0, anchor: 0.5 }
        //     }
        // }
    },

    "panelConfig": {
        "credit": {
            "VD": { x: 170, y: 660, visible: true },
            "VL": { x: 170, y: 640, visible: true },
            "VP": { x: 170, y: 660, visible: true }
        },
        "stake": {
            "VD": { x: 410, y: 660, visible: true },
            "VL": { x: 455, y: 640, visible: true },
            "VP": { x: 410, y: 660, visible: true }
        },
        "win": {
            "VD": { x: 725, y: 660, visible: true },
            "VL": { x: 675, y: 640, visible: true },
            "VP": { x: 750, y: 660, visible: true }
        }

    }
};