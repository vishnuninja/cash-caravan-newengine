var _ng = _ng || {};

_ng.SuperMeterConfig = {
    makeResponsive: true,
    "props": {
        "VD": { x: 1200, y: -15, visible: true },
        "VL": { x: 1193, y: -100, visible: true },
        "VP": { x: 630, y: 450, visible: true },

        HX: 1195, HY: 642,
        VX: 615, VY: 1181,
        landScaleX: 0.8, landScaleY: 0.8,
        portScaleX: 1, portScaleY: 1,
        landAlignX: "RIGHT", landAlignY: "BOTTOM",
        portAlignX: "RIGHT", portAlignY: "BOTTOM"
    },
    "containerList": {
        // "bg1": {
        //     "type": "Sprite",
        //     "props": {
        //         "img": "info_bg",
        //         "VD": {"x": 0,"y": 0,},
        //     }
        //  },

        "options": {
            "type": "Container",
            "props": {
                "VD": { x: 0, y: 0, visible: false },
                "VL": { x: 0, y: 0, visible: false },
                "VP": { x: 0, y: 0, visible: false }
            },
            "children": {

                "smBetBg": {
                    type: "Sprite",
                    props: {
                        img: "smBetBg",
                        VD: { x: -45, y: 364, anchor: { x: 0.5, y: 0.5 } },
                        VL: { x: -45, y: 364, anchor: { x: 0.5, y: 0.5 } },
                        VP: { x: -45, y: 364, anchor: { x: 0.5, y: 0.5 } }
                    }
                },

                smTotalBetBtn: {
                    type: "Sprite",
                    props: {
                        img: "smTotalBetBtn_normal",
                        VD: { x: 40, y: 480, anchor: { x: 0.5, y: 0.5 } },
                        VL: { x: 40, y: 480, anchor: { x: 0.5, y: 0.5 } },
                        VP: { x: 40, y: 480, anchor: { x: 0.5, y: 0.5 } }
                    }
                },
                "smTotalBetBgBtn": {
                    type: "Button",
                    props: {
                        img: "smTotalBetBgBtn",
                        VD: { x: -50, y: 470, anchor: { x: 0.5, y: 0.5 } },
                        VL: { x: -50, y: 470, anchor: { x: 0.5, y: 0.5 } },
                        VP: { x: -50, y: 470, anchor: { x: 0.5, y: 0.5 } }
                    }
                },
                "smTotalCashBetTxt": {
                    "type": "Text",
                    "props": {
                        "text": "0.01",
                        "VD": { x: -75, y: 481, anchor: 0.5 },
                        "VL": { x: -75, y: 481, anchor: 0.5 },
                        "VP": { x: -75, y: 481, anchor: 0.5 },
                        "style": {
                            "fontWeight": "bold",
                            "fontSize": 20,
                            "fontFamily": "ProximaNova_Bold",
                            "fill": "#ffffff",
                            "strokeThickness": 2,
                            "lineJoin": "round",
                            "align": 'left',
                            "maxWidth": 300
                        }
                    }
                },
                "smTotalBetPlusTxt": {
                    "type": "Text",
                    "props": {
                        "text": "+",
                        "VD": { x: -45, y: 481, anchor: 0.5 },
                        "VL": { x: -45, y: 481, anchor: 0.5 },
                        "VP": { x: -45, y: 481, anchor: 0.5 },
                        "style": {
                            "fontWeight": "bold",
                            "fontSize": 20,
                            "fontFamily": "ProximaNova_Bold",
                            "fill": "#ffffff",
                            "strokeThickness": 2,
                            "lineJoin": "round",
                            "align": 'left',
                            "maxWidth": 300
                        }
                    }
                },
                "smTotalSMBetTxt": {
                    "type": "Text",
                    "props": {
                        "text": "0.01",
                        "VD": { x: -15, y: 481, anchor: 0.5 },
                        "VL": { x: -15, y: 481, anchor: 0.5 },
                        "VP": { x: -15, y: 481, anchor: 0.5 },
                        "style": {
                            "fontWeight": "bold",
                            "fontSize": 20,
                            "fontFamily": "ProximaNova_Bold",
                            "fill": "0xd8a10d",
                            "strokeThickness": 2,
                            "lineJoin": "round",
                            "align": 'left',
                            "maxWidth": 300
                        }
                    }
                },

                smCollectBtn: {
                    type: "Sprite",
                    props: {
                        img: "smCollectBtn_normal",
                        VD: { x: 40, y: 540, anchor: { x: 0.5, y: 0.5 } },
                        VL: { x: 40, y: 540, anchor: { x: 0.5, y: 0.5 } },
                        VP: { x: 40, y: 540, anchor: { x: 0.5, y: 0.5 } }
                    }
                },
                "smCollectBgBtn": {
                    type: "Button",
                    props: {
                        img: "smCollectBgBtn",
                        VD: { x: -50, y: 540, anchor: { x: 0.5, y: 0.5 } },
                        VL: { x: -50, y: 540, anchor: { x: 0.5, y: 0.5 } },
                        VP: { x: -50, y: 540, anchor: { x: 0.5, y: 0.5 } }
                    }
                },

                smBtn: {
                    type: "Sprite",
                    props: {
                        img: "smBtn_normal",
                        VD: { x: 40, y: 600, anchor: { x: 0.5, y: 0.5 } },
                        VL: { x: 40, y: 600, anchor: { x: 0.5, y: 0.5 } },
                        VP: { x: 40, y: 600, anchor: { x: 0.5, y: 0.5 } }
                    }
                },

                "smBgBtn": {
                    type: "Button",
                    props: {
                        img: "smBgBtn",
                        VD: { x: -50, y: 598, anchor: { x: 0.5, y: 0.5 } },
                        VL: { x: -50, y: 598, anchor: { x: 0.5, y: 0.5 } },
                        VP: { x: -50, y: 598, anchor: { x: 0.5, y: 0.5 } }
                    }
                },
                "smBgTxt": {
                    "type": "Text",
                    "props": {
                        "text": "0.01",
                        "VD": { x: -50, y: 608, anchor: 0.5 },
                        "VL": { x: -50, y: 608, anchor: 0.5 },
                        "VP": { x: -50, y: 608, anchor: 0.5 },
                        "style": {
                            "fontWeight": "bold",
                            "fontSize": 20,
                            "fontFamily": "ProximaNova_Bold",
                            "fill": "#ffffff",
                            "strokeThickness": 2,
                            "lineJoin": "round",
                            "align": 'left',
                            "maxWidth": 300
                        }
                    }
                },


                // "smLabel": {
                //     type: "Sprite",
                //     props: {
                //         img: "smTxt",
                //         VD: { x: -50, y: 590, anchor: 0.5, scale:0.8},
                //         VL: { x: -50, y: 590, anchor: 0.5, scale:0.8},
                //         VP: { x: -50, y: 590, anchor: 0.5, scale:0.8}
                //     }
                // },

                // "smCollectBgBtn": {
                //     type: "Sprite",
                //     props: {
                //         img: "smCollectBgBtn",
                //         VD: { x: 40, y: 540, anchor: { x: 0.5, y: 0.5 } },
                //         VL: { x: 40, y: 540, anchor: { x: 0.5, y: 0.5 } },
                //         VP: { x: 40, y: 540, anchor: { x: 0.5, y: 0.5 } }
                //     }
                // },


                // "smLabel1": {
                //     type: "Sprite",
                //     props: {
                //         img: "smTxt",
                //         VD: { x: -50, y: 473, anchor: 0.5, scale:0.8},
                //         VL: { x: -50, y: 473, anchor: 0.5, scale:0.8},
                //         VP: { x: -50, y: 473, anchor: 0.5, scale:0.8}
                //     }
                // },




            }
        },
        smCloseBtn: {
            type: "Button",
            props: {
                img: "smCloseBtn",
                VD: { x: 40, y: 682, anchor: { x: 0.5, y: 0.5 } },
                VL: { x: 40, y: 682, anchor: { x: 0.5, y: 0.5 } },
                VP: { x: 40, y: 682, anchor: { x: 0.5, y: 0.5 } }
            }
        },
        smOpenBtn: {
            type: "Button",
            props: {
                img: "smOpenBtn",
                VD: { x: 40, y: 682, anchor: { x: 0.5, y: 0.5 } },
                VL: { x: 40, y: 682, anchor: { x: 0.5, y: 0.5 } },
                VP: { x: 40, y: 682, anchor: { x: 0.5, y: 0.5 } }
            }
        },

        //  "smCollectBg": {
        //     type: "Button",
        //     props: {
        //         img: "smCollectBg",
        //         VD: { x: -50, y: 545, anchor: { x: 0.5, y: 0.5 } }
        //     }
        // },

    }
};

