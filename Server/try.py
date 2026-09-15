# convet list to reel

a = {"WILD":"w",
	"H1":"a",
	"H2":"b",
	"H3":"c",
	"H4":"d",
	"H5":"e",
	"L1":"f",
	"L2":"g",
	"L3":"h",
	"L4":"i",
	"MY":"m",
    "SW":"s"}
Reel1 = [
"L2",
"L4",
"L4",
"L1",
"H4",
"L3",
"H5",
"H5",
"L2",
"L3",
"H2",
"H3",
"L1",
]
Reel2 = [
"H4",
"H4",
"L2",
"H1",
"L4",
"L4",
"H2",
"H1",
"L2",
"H4",
"L2",
"H2",
"L4",
]
Reel3 =[
"H5",
"L3",
"L3",
"H1",
"L1",
"L1",
"H5",
"H5",
"H3",
"H3",
"L3",
"H1",
"L1",
]
Reel4 = [
"L2",
"L4",
"H2",
"L1",
"H4",
"L4",
"L1",
"H5",
"L3",
"L3",
"L2",
"H1",
"H3",
]
Reel5 = [
"L3",
"H3",
"L1",
"L4",
"L4",
"H5",
"L2",
"L2",
"H4",
"L1",
"H2",
"L4",
"H1",
]
Reel6=[
"H4",
"L3",
"L4",
"L1",
"L2",
"H2",
"H4",
"H3",
"H5",
"L4",
"H1",
"L2",
"L1",
]
dic = ""
name = [Reel1,Reel2,Reel3,Reel4,Reel5,Reel6]
reel_set = ""
for item in range(len(name)):
    for item1 in range(len(name[item])):
        reel_set+=a[name[item][item1]]
    reel_set+= ","
print(reel_set)



# num_weihgts = [[],[],[],[],[],[]]
# for item in range(len(num)):
    
#     sum_n = 0
#     for item1 in range(len(num[item])):
#         sum_n +=num[item][item1] 
#         num_weihgts[item].append(sum_n)
#     num_weihgts+=";"
# print(num_weihgts) 
""",
reel 1
"giifdieeggbdfhhcchegfiidibggcffiehhbgdiceefhaggbihecfgddihbfeiigbdffhecgdhfiiaeehcffbbaagedhhcaffbieehddggaficchhegdffaiggchhbieagcffibhddegahiicfeehdggafbbihheccgdiifaahgbiiddfchhgiifdieeggbdfhhcchegfiidibggcffiehhbgdiceefhaggbihecfgddihbfeiigbdffhecgdhfiiaeehcffbbaagedhhcaffbieehddggaficchhegdffaiggchhbieagcffibhddegahiicfeehdggafbbihheccgdiifaahgbiiddfchh",
"hcgaiicggdfbiahhsfeggdiccddggdhhbiicfaggaaibddecggaddiibbdcggiafidggchbffgiiddibgffhadggciidbggdciiagbbiehddgiieegciibffagiiddgehbbisggeehibgddiabbffehhibgcfheeigdhhfebgaiidbbhffeeahcgiicggdfbiahhfeggdiccddggdhhbiicfaggaaibddecggaddiibbdcggiafidggchbffgiiddibgffhadggciidbggdciiagbbiehddgiieegciibffagiiddgehbbiggaeehaibgddiabbffehhibgcfheeigdhhfebgiidbbhffeea",
"dbhaffbecchaffehhbiccfgebhaffeddcfbhhefgaeihhcffccieecaffgeiicheehffegghhaieeffhccfhheehafcggddihheffghieedffhaciifeedhggccfbhhaeiiccsffdihcgfahdiseegcfbbhaiddgffbhhcdhhaaggfbhicgeedbhffbecchaffehhbiccfgebhaffeddcfbhhefgaeihhcffccieecaffgeiicheehffegghhaieeffhccfhheehafcggddihheffghieedffhaciifeedhggccfbhhaeiiccaffdihcgfahdieegcfbbhaiddgffbhhcdhhaaggfbhicgee",
"gibfdieesggbdfhcciegfhhdibggcffiehhbgdiceefhaggbihecfgddihbfeiigadffhecgdhfiiaeehcffbbiigedhhcaffbieehddggaficchhegdffaiggchhbieagcffibhddegahiicfeehdggafbbihheccgdiifaahgbiiddfchhgibfdieeggbadfhcciegfhhdibggcffiehhbgdiceefhaggbihecfgddihbfeiigadffhecgdhfiiaeehcffbbiigedhhcaffbieehddggaficchhegdffaiggchhbieagcffibhddegahiicfeehdggafbbihheccgdiifaahgbiiddfchh",
"hcfiieggdfbiahhsfeggdicceefgdhhbiicfaggddibhhecffahdiibehcggiafhdggcibffgdhheibgffhdggichefbgdcihagbbiehddfiieegchhbffagiiddfehccigfaeehibgddiaccffehhibgcfheeigdaahhfecgiidbbhffeeahcfiieggdfbiahhfeggdicceefgdhhbiicfaggddibhhecffahdiibehcggiafhdggcibffgdhheibgffhadggichefbgdcihagbbiehddfiieegchhbffagiiddfehccigfaeehibgddiaccffehhibgcfheeigdaahhfecgiidbbhffeea",
"dhifgbdceiagfdhhbiccfgddebiaffehhcgbiiefgadihhcggbbiechaffgeiichddiffegghhaiedgghccfiieehafbggddihheffghieedffhabiifeedhggccfbhhaeiicfbgdihcgfahdieegcfbbhaiddgffbhhcdiiaaggfbhicgeedhifgbdceiagfdhhbiccfgddebiaffehhcgbiiefgadihhcggbbiechaffgeiichddiffegghhaiedgghccfiieehafbggddihheffghieedffhabiifeedhggccfbhhaeiicfbgdihcgfahdieegcfbbhaiddgffbhhcdiiaaggfbhicgee",

reel 2
giifdieeggbdfmmmmhhcchegfiidibmmmmggcffiehhbgdmmmmiceefhaggbimmmmhecfgddihbfeiigbdmmmmffhecgdhfiiaeehcffbbaagedhhcaffbieehddggaficchhegdffaiggchhbieagcffibhddegahiicfeehdggafbbihheccgdiifaahgbiiddfchh,
hcgiicggdfbiahhfemmmmggdiccddggdhhbiicmmmmfaggaaibddecggaddmmmmiibbdcggiafidggchbffgiimmmmddibgffhadmmmmggciidbggdciiagbbiehddgiieegciibffagiiddgehbbiggaeehibgddiabbffehhibgcfheeigdaahhfebgiidbbhffeea,
dbhffbecchaffehhbmmmmiccfgaaebhaffemmmmddcfbhhefgaeihhcffccieemmmmcaffgeiicheehffeggmmmmhhaieeffhccfhhmmmmeehafcggddihheffghieedffhaciifeedhggccfbhhaeiiccffdihcgfahdieegcfbbhaiddgffbhhcdhhaaggfbhicgee,
gibfdieeggbadfmmmmhcciegfhhdibggcffiemmmmhhbgdiceefhaggbihecfmmmmgddihbfeiigadffhecgmmmmdhfiiaeehcffbbmmmmiigedhhcaffbieehddggaficchhegdffaiggchhbieagcffibhddegahiicfeehdggafbbihheccgdiifaahgbiiddfchh,
hcfiieggdfbmmmmiahhfeggdicceefgdhhbiimmmmcfaggddibhhecffahdiibmmmmehcggiafhdggcibffmmmmgdhheibgffhadmmmmggichefbgdcihagbbiehddfiieegchhbffagiiddfehccigfaeehibgddiaccffehhibgcfheeigdaahhfecgiidbbhffeea,
dhifgbdceiammmmgfdhhbiccfgddebiaffehhmmmmcgbiiefgadihhcggbbiemmmmchaffgeiichddimmmmffegghhaiedgghccfmmmmiieehafbggddihheffghieedffhabiifeedhggccfbhhaeiicfbgdihcgfahdieegcfbbhaiddgffbhhcdiiaaggfbhicgee,


reel 3
"giifdieeggbdfhhcchegfiidibggcffiehhbgdiceefhaggbihecfgddihbfeiigbdffhecgdhfiiaeehcffbbaagedhhcaffbieehddggaficchhegdffaiggchhbieagcffibhddegahiicfeehdggafbbihheccgdiifaahgbiiddfchh",
"hcgiicggdsfbiahhfesggdiccddggdhhsbiicfaggaaibsddecggaddiibbdcggsiafidggchbffgiiddsibgffhadggsciidbggdciiagsbbiehddgiieegciibsffagiiddgehbbiggaeehsibgddiabbffeshhibgcfheeisgdaahhsfebgsiidbbhsffeea",
"dbhffbecchsaffehhbsiccfgaaebhaffeddcfbhhefgaeihhcffcciseecaffsgeiicheehsffegghhaieeffshccfhheehafcggsddihheffgshieedsffhaciisfeedhggccfbhhaeiiccsffdihcgfahdieegcsfbbhaiddgsffbhhcdhhsaaggfbshicgee",
"gibfdieeggsbadfhscciegfhhdsibggcffsiehhbsgdiceefshaggbsihecfgddishbfeiisgadffhecgdhfsiiaeehcffbbiigedshhcaffbiseehddggafiscchhegdffaisggchhbieagcffibhddegahiicfeehdggafbbihheccgsdiifaahgbiiddfchh",
"hcfiieggdfsbiahhfseggdiccseefgdhhsbiicfasggddibhhescffahdsiibehcggsiafhdggcibsffgdhheibgsffhadggsichefbgdscihagbbiehddfiieegschhbffagiisddfehccigfaeehibgddiaccffehhibgcfheeigdaahhsfecgiidbbhffeea",
"dhifgbdceiagfdhhbiccfgddebiaffehhcgbiiefgadihhcggbbiechaffgeiichddiffegghhaiedgghccfiieehafbggddihheffghieedffhabiifeedhggccfbhhaeiicfbgdihcgfahdieegcfbbhaiddgffbhhcdiiaaggfbhicgee",


fg
"gibfdhiefdichegbaidfehcdiegfbhhdibhcffiehbgfdicefhiaggbihecfagdeihbfeiigadfhbiefcgdhfiaehcfbigedhcafgbiefhdgafigchegdfaigchbifeagcfibghdegahicfgehdgahfbgidheichgdicfeahdgbeichdgfch",
"hcfiegidfbeiahhdfieghdfbichefbigdhbiecfaggdfeibheicffahediibfehcgiafehdgcibfgdhefibgfhadgichefbgdcihagfbiehagdfiegchbfagihdfgehcdigfaehibgchdiahcgfehdibgcfheicgdhagidhfecgidbgchfea",
"dhbifgbdhcfeiagefdchhbgdichefbgidhefbiaffdehcgbiiefgadiehcggbhdiefchaifgeichdifeghaiefdgihcfiehafbgdfihefgahiegdfhagbifgeidhgchifbhaeicfbgdihcgfahdiegcfbhaidhcgfbhecgdiaegcfbhdicge",
"gibfdhiefdichegbaidfehcdiegfbhhdibhcffiehbgfdicefhiaggbihecfagdeihbfeiigadfhbiefcgdhfiaehcfbigedhcafgbiefhdgafigchegdfaigchbifeagcfibghdegahicfgehdgahfbgidheichgdicfeahdgbeichdgfch",
"hcfiegidfbeiahhdfieghdfbichefbigdhbiecfaggdfeibheicffahediibfehcgiafehdgcibfgdhefibgfhadgichefbgdcihagfbiehagdfiegchbfagihdfgehcdigfaehibgchdiahcgfehdibgcfheicgdhagidhfecgidbgchfea",
"dhbifgbdhcfeiagefdchhbgdichefbgidhefbiaffdehcgbiiefgadiehcggbhdiefchaifgeichdifeghaiefdgihcfiehafbgdfihefgahiegdfhagbifgeidhgchifbhaeicfbgdihcgfahdiegcfbhaidhcgfbhecgdiaegcfbhdicge"

BUy_fg 
"giifdheeghbcf","ddgaiibagdgbi","ehhaffeecchaf","gibfdifehhgac","hcfiieggdfbia","dhifgbdceiagf"


{
    "reel_weights": {
        "normal": [
            {
                "0": {
                    "total_weight": 230,
                    "range": {
                        "12-16": 3,
                        "18-22": 3,
                        "35-39": 3,
                        "41-45": 3,
                        "57-61": 3,
                        "63-67": 3,
                        "78-82": 3,
                        "84-88": 3,
                        "105-109": 3,
                        "111-115": 3
                    }
                },
                "1": {
                    "total_weight": 330,
                    "range": {
                        "15-28": 12,
                        "28-30": 1,
                        "31-33": 1,
                        "33-46": 12,
                        "62-75": 12,
                        "75-77": 1,
                        "78-80": 1,
                        "80-93": 12,
                        "109-122": 12,
                        "122-124": 1,
                        "125-127": 1,
                        "127-140": 12,
                        "162-175": 12,
                        "175-177": 1,
                        "178-180": 1,
                        "180-193": 12,
                        "202-215": 12,
                        "215-217": 1,
                        "218-220": 1,
                        "220-233": 12
                    }
                },
                "2": {
                    "total_weight": 330,
                    "range": {
                        "15-28": 12,
                        "28-30": 1,
                        "31-33": 1,
                        "33-46": 12,
                        "59-72": 12,
                        "72-74": 1,
                        "75-77": 1,
                        "77-90": 12,
                        "112-125": 12,
                        "125-127": 1,
                        "128-130": 1,
                        "130-143": 12,
                        "160-173": 12,
                        "173-175": 1,
                        "176-178": 1,
                        "178-191": 12,
                        "204-217": 12,
                        "217-219": 1,
                        "220-222": 1,
                        "222-235": 12
                    }
                },
                "3": {
                    "total_weight": 380,
                    "range": {
                        "12-29": 16,
                        "29-32": 2,
                        "33-36": 2,
                        "36-53": 16,
                        "71-88": 16,
                        "88-91": 2,
                        "92-95": 2,
                        "95-112": 16,
                        "131-148": 16,
                        "148-151": 2,
                        "152-155": 2,
                        "155-172": 16,
                        "190-207": 16,
                        "207-210": 2,
                        "211-214": 2,
                        "214-231": 16,
                        "244-261": 16,
                        "261-264": 2,
                        "265-268": 2,
                        "268-285": 16
                    }
                },
                "4": {
                    "total_weight": 380,
                    "range": {
                        "9-26": 16,
                        "26-29": 2,
                        "30-33": 2,
                        "33-50": 16,
                        "71-88": 16,
                        "88-91": 2,
                        "92-95": 2,
                        "95-112": 16,
                        "132-149": 16,
                        "149-152": 2,
                        "153-156": 2,
                        "156-173": 16,
                        "189-206": 16,
                        "206-209": 2,
                        "210-213": 2,
                        "213-230": 16,
                        "242-259": 16,
                        "259-262": 2,
                        "263-266": 2,
                        "266-283": 16
                    }
                },
                "5": {
                    "total_weight": 230,
                    "range": {
                        "10-14": 3,
                        "16-20": 3,
                        "42-46": 3,
                        "48-52": 3,
                        "72-76": 3,
                        "78-82": 3,
                        "96-100": 3,
                        "102-106": 3,
                        "123-127": 3,
                        "129-133": 3
                    }
                }
            }
        ]
    }
}

{
    "reel_weights": {
        "normal": [
            {
                "0": {
                    "total_weight": 230,
                    "range": {"1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "10": 9, "11": 10, "12": 11, "16": 12, "17": 13, "18": 14, "22": 15, "23": 16, "24": 17, "25": 18, "26": 19, "27": 20, "28": 21, "29": 22, "30": 23, "31": 24, "32": 25, "33": 26, "34": 27, "35": 28, "39": 29, "40": 30, "41": 31, "45": 32, "46": 33, "47": 34, "48": 35, "49": 36, "50": 37, "51": 38, "52": 39, "53": 40, "54": 41, "55": 42, "56": 43, "57": 44, "61": 45, "62": 46, "63": 47, "67": 48, "68": 49, "69": 50, "70": 51, "71": 52, "72": 53, "73": 54, "74": 55, "75": 56, "76": 57, "77": 58, "78": 59, "82": 60, "83": 61, "84": 62, "88": 63, "89": 64, "90": 65, "91": 66, "92": 67, "93": 68, "94": 69, "95": 70, "96": 71, "97": 72, "98": 73, "99": 74, "100": 75, "101": 76, "102": 77, "103": 78, "104": 79, "105": 80, "109": 81, "110": 82, "111": 83, "115": 84, "116": 85, "117": 86, "118": 87, "119": 88, "120": 89, "121": 90, "122": 91, "123": 92, "124": 93, "125": 94, "126": 95, "127": 96, "128": 97, "129": 98, "130": 99, "131": 100, "132": 101, "133": 102, "134": 103, "135": 104, "136": 105, "137": 106, "138": 107, "139": 108, "140": 109, "141": 110, "142": 111, "143": 112, "144": 113, "145": 114, "146": 115, "147": 116, "148": 117, "149": 118, "150": 119, "151": 120, "152": 121, "153": 122, "154": 123, "155": 124, "156": 125, "157": 126, "158": 127, "159": 128, "160": 129, "161": 130, "162": 131, "163": 132, "164": 133, "165": 134, "166": 135, "167": 136, "168": 137, "169": 138, "170": 139, "171": 140, "172": 141, "173": 142, "174": 143, "175": 144, "176": 145, "177": 146, "178": 147, "179": 148, "180": 149, "181": 150, "182": 151, "183": 152, "184": 153, "185": 154, "186": 155, "187": 156, "188": 157, "189": 158, "190": 159, "191": 160, "192": 161, "193": 162, "194": 163, "195": 164, "196": 165, "197": 166, "198": 167, "199": 168, "200": 169, "201": 170, "202": 171, "203": 172, "204": 173, "205": 174, "206": 175, "207": 176, "208": 177, "209": 178, "210": 179, "211": 180, "212": 181, "213": 182, "214": 183, "215": 184, "216": 185, "217": 186, "218": 187, "219": 188, "220": 189, "221": 190, "222": 191, "223": 192, "224": 193, "225": 194, "226": 195, "227": 196, "228": 197, "229": 198, "230": 199}
                },
                "1": {
                    "total_weight": 330,
                    "range":{"1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "10": 9, "11": 10, "12": 11, "13": 12, "14": 13, "15": 14, "28": 15, "30": 16, "31": 17, "33": 18, "46": 19, "47": 20, "48": 21, "49": 22, "50": 23, "51": 24, "52": 25, "53": 26, "54": 27, "55": 28, "56": 29, "57": 30, "58": 31, "59": 32, "60": 33, "61": 34, "62": 35, "75": 36, "77": 37, "78": 38, "80": 39, "93": 40, "94": 41, "95": 42, "96": 43, "97": 44, "98": 45, "99": 46, "100": 47, "101": 48, "102": 49, "103": 50, "104": 51, "105": 52, "106": 53, "107": 54, "108": 55, "109": 56, "122": 57, "124": 58, "125": 59, "127": 60, "140": 61, "141": 62, "142": 63, "143": 64, "144": 65, "145": 66, "146": 67, "147": 68, "148": 69, "149": 70, "150": 71, "151": 72, "152": 73, "153": 74, "154": 75, "155": 76, "156": 77, "157": 78, "158": 79, "159": 80, "160": 81, "161": 82, "162": 83, "175": 84, "177": 85, "178": 86, "180": 87, "193": 88, "194": 89, "195": 90, "196": 91, "197": 92, "198": 93, "199": 94, "200": 95, "201": 96, "202": 97, "215": 98, "217": 99, "218": 100, "220": 101, "233": 102, "234": 103, "235": 104, "236": 105, "237": 106, "238": 107, "239": 108, "240": 109, "241": 110, "242": 111, "243": 112, "244": 113, "245": 114, "246": 115, "247": 116, "248": 117, "249": 118, "250": 119, "251": 120, "252": 121, "253": 122, "254": 123, "255": 124, "256": 125, "257": 126, "258": 127, "259": 128, "260": 129, "261": 130, "262": 131, "263": 132, "264": 133, "265": 134, "266": 135, "267": 136, "268": 137, "269": 138, "270": 139, "271": 140, "272": 141, "273": 142, "274": 143, "275": 144, "276": 145, "277": 146, "278": 147, "279": 148, "280": 149, "281": 150, "282": 151, "283": 152, "284": 153, "285": 154, "286": 155, "287": 156, "288": 157, "289": 158, "290": 159, "291": 160, "292": 161, "293": 162, "294": 163, "295": 164, "296": 165, "297": 166, "298": 167, "299": 168, "300": 169, "301": 170, "302": 171, "303": 172, "304": 173, "305": 174, "306": 175, "307": 176, "308": 177, "309": 178, "310": 179, "311": 180, "312": 181, "313": 182, "314": 183, "315": 184, "316": 185, "317": 186, "318": 187, "319": 188, "320": 189, "321": 190, "322": 191, "323": 192, "324": 193, "325": 194, "326": 195, "327": 196, "328": 197, "329": 198, "330": 199}
                },
                "2": {
                    "total_weight": 330,
                    "range": {"1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "10": 9, "11": 10, "12": 11, "13": 12, "14": 13, "15": 14, "28": 15, "30": 16, "31": 17, "33": 18, "46": 19, "47": 20, "48": 21, "49": 22, "50": 23, "51": 24, "52": 25, "53": 26, "54": 27, "55": 28, "56": 29, "57": 30, "58": 31, "59": 32, "72": 33, "74": 34, "75": 35, "77": 36, "90": 37, "91": 38, "92": 39, "93": 40, "94": 41, "95": 42, "96": 43, "97": 44, "98": 45, "99": 46, "100": 47, "101": 48, "102": 49, "103": 50, "104": 51, "105": 52, "106": 53, "107": 54, "108": 55, "109": 56, "110": 57, "111": 58, "112": 59, "125": 60, "127": 61, "128": 62, "130": 63, "143": 64, "144": 65, "145": 66, "146": 67, "147": 68, "148": 69, "149": 70, "150": 71, "151": 72, "152": 73, "153": 74, "154": 75, "155": 76, "156": 77, "157": 78, "158": 79, "159": 80, "160": 81, "173": 82, "175": 83, "176": 84, "178": 85, "191": 86, "192": 87, "193": 88, "194": 89, "195": 90, "196": 91, "197": 92, "198": 93, "199": 94, "200": 95, "201": 96, "202": 97, "203": 98, "204": 99, "217": 100, "219": 101, "220": 102, "222": 103, "235": 104, "236": 105, "237": 106, "238": 107, "239": 108, "240": 109, "241": 110, "242": 111, "243": 112, "244": 113, "245": 114, "246": 115, "247": 116, "248": 117, "249": 118, "250": 119, "251": 120, "252": 121, "253": 122, "254": 123, "255": 124, "256": 125, "257": 126, "258": 127, "259": 128, "260": 129, "261": 130, "262": 131, "263": 132, "264": 133, "265": 134, "266": 135, "267": 136, "268": 137, "269": 138, "270": 139, "271": 140, "272": 141, "273": 142, "274": 143, "275": 144, "276": 145, "277": 146, "278": 147, "279": 148, "280": 149, "281": 150, "282": 151, "283": 152, "284": 153, "285": 154, "286": 155, "287": 156, "288": 157, "289": 158, "290": 159, "291": 160, "292": 161, "293": 162, "294": 163, "295": 164, "296": 165, "297": 166, "298": 167, "299": 168, "300": 169, "301": 170, "302": 171, "303": 172, "304": 173, "305": 174, "306": 175, "307": 176, "308": 177, "309": 178, "310": 179, "311": 180, "312": 181, "313": 182, "314": 183, "315": 184, "316": 185, "317": 186, "318": 187, "319": 188, "320": 189, "321": 190, "322": 191, "323": 192, "324": 193, "325": 194, "326": 195, "327": 196, "328": 197, "329": 198, "330": 199}
                },
                "3": {
                    "total_weight": 380,
                    "range":  {"1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "10": 9, "11": 10, "12": 11, "29": 12, "32": 13, "33": 14, "36": 15, "53": 16, "54": 17, "55": 18, "56": 19, "57": 20, "58": 21, "59": 22, "60": 23, "61": 24, "62": 25, "63": 26, "64": 27, "65": 28, "66": 29, "67": 30, "68": 31, "69": 32, "70": 33, "71": 34, "88": 35, "91": 36, "92": 37, "95": 38, "112": 39, "113": 40, "114": 41, "115": 42, "116": 43, "117": 44, "118": 45, "119": 46, "120": 47, "121": 48, "122": 49, "123": 50, "124": 51, "125": 52, "126": 53, "127": 54, "128": 55, "129": 56, "130": 57, "131": 58, "148": 59, "151": 60, "152": 61, "155": 62, "172": 63, "173": 64, "174": 65, "175": 66, "176": 67, "177": 68, "178": 69, "179": 70, "180": 71, "181": 72, "182": 73, "183": 74, "184": 75, "185": 76, "186": 77, "187": 78, "188": 79, "189": 80, "190": 81, "207": 82, "210": 83, "211": 84, "214": 85, "231": 86, "232": 87, "233": 88, "234": 89, "235": 90, "236": 91, "237": 92, "238": 93, "239": 94, "240": 95, "241": 96, "242": 97, "243": 98, "244": 99, "261": 100, "264": 101, "265": 102, "268": 103, "285": 104, "286": 105, "287": 106, "288": 107, "289": 108, "290": 109, "291": 110, "292": 111, "293": 112, "294": 113, "295": 114, "296": 115, "297": 116, "298": 117, "299": 118, "300": 119, "301": 120, "302": 121, "303": 122, "304": 123, "305": 124, "306": 125, "307": 126, "308": 127, "309": 128, "310": 129, "311": 130, "312": 131, "313": 132, "314": 133, "315": 134, "316": 135, "317": 136, "318": 137, "319": 138, "320": 139, "321": 140, "322": 141, "323": 142, "324": 143, "325": 144, "326": 145, "327": 146, "328": 147, "329": 148, "330": 149, "331": 150, "332": 151, "333": 152, "334": 153, "335": 154, "336": 155, "337": 156, "338": 157, "339": 158, "340": 159, "341": 160, "342": 161, "343": 162, "344": 163, "345": 164, "346": 165, "347": 166, "348": 167, "349": 168, "350": 169, "351": 170, "352": 171, "353": 172, "354": 173, "355": 174, "356": 175, "357": 176, "358": 177, "359": 178, "360": 179, "361": 180, "362": 181, "363": 182, "364": 183, "365": 184, "366": 185, "367": 186, "368": 187, "369": 188, "370": 189, "371": 190, "372": 191, "373": 192, "374": 193, "375": 194, "376": 195, "377": 196, "378": 197, "379": 198, "380": 199}
                },
                "4": {
                    "total_weight": 380,
                    "range": {"1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "26": 9, "29": 10, "30": 11, "33": 12, "50": 13, "51": 14, "52": 15, "53": 16, "54": 17, "55": 18, "56": 19, "57": 20, "58": 21, "59": 22, "60": 23, "61": 24, "62": 25, "63": 26, "64": 27, "65": 28, "66": 29, "67": 30, "68": 31, "69": 32, "70": 33, "71": 34, "88": 35, "91": 36, "92": 37, "95": 38, "112": 39, "113": 40, "114": 41, "115": 42, "116": 43, "117": 44, "118": 45, "119": 46, "120": 47, "121": 48, "122": 49, "123": 50, "124": 51, "125": 52, "126": 53, "127": 54, "128": 55, "129": 56, "130": 57, "131": 58, "132": 59, "149": 60, "152": 61, "153": 62, "156": 63, "173": 64, "174": 65, "175": 66, "176": 67, "177": 68, "178": 69, "179": 70, "180": 71, "181": 72, "182": 73, "183": 74, "184": 75, "185": 76, "186": 77, "187": 78, "188": 79, "189": 80, "206": 81, "209": 82, "210": 83, "213": 84, "230": 85, "231": 86, "232": 87, "233": 88, "234": 89, "235": 90, "236": 91, "237": 92, "238": 93, "239": 94, "240": 95, "241": 96, "242": 97, "259": 98, "262": 99, "263": 100, "266": 101, "283": 102, "284": 103, "285": 104, "286": 105, "287": 106, "288": 107, "289": 108, "290": 109, "291": 110, "292": 111, "293": 112, "294": 113, "295": 114, "296": 115, "297": 116, "298": 117, "299": 118, "300": 119, "301": 120, "302": 121, "303": 122, "304": 123, "305": 124, "306": 125, "307": 126, "308": 127, "309": 128, "310": 129, "311": 130, "312": 131, "313": 132, "314": 133, "315": 134, "316": 135, "317": 136, "318": 137, "319": 138, "320": 139, "321": 140, "322": 141, "323": 142, "324": 143, "325": 144, "326": 145, "327": 146, "328": 147, "329": 148, "330": 149, "331": 150, "332": 151, "333": 152, "334": 153, "335": 154, "336": 155, "337": 156, "338": 157, "339": 158, "340": 159, "341": 160, "342": 161, "343": 162, "344": 163, "345": 164, "346": 165, "347": 166, "348": 167, "349": 168, "350": 169, "351": 170, "352": 171, "353": 172, "354": 173, "355": 174, "356": 175, "357": 176, "358": 177, "359": 178, "360": 179, "361": 180, "362": 181, "363": 182, "364": 183, "365": 184, "366": 185, "367": 186, "368": 187, "369": 188, "370": 189, "371": 190, "372": 191, "373": 192, "374": 193, "375": 194, "376": 195, "377": 196, "378": 197, "379": 198, "380": 199}
                },
                "5": {
                    "total_weight": 230,
                    "range": {"1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "10": 9, "14": 10, "15": 11, "16": 12, "20": 13, "21": 14, "22": 15, "23": 16, "24": 17, "25": 18, "26": 19, "27": 20, "28": 21, "29": 22, "30": 23, "31": 24, "32": 25, "33": 26, "34": 27, "35": 28, "36": 29, "37": 30, "38": 31, "39": 32, "40": 33, "41": 34, "42": 35, "46": 36, "47": 37, "48": 38, "52": 39, "53": 40, "54": 41, "55": 42, "56": 43, "57": 44, "58": 45, "59": 46, "60": 47, "61": 48, "62": 49, "63": 50, "64": 51, "65": 52, "66": 53, "67": 54, "68": 55, "69": 56, "70": 57, "71": 58, "72": 59, "76": 60, "77": 61, "78": 62, "82": 63, "83": 64, "84": 65, "85": 66, "86": 67, "87": 68, "88": 69, "89": 70, "90": 71, "91": 72, "92": 73, "93": 74, "94": 75, "95": 76, "96": 77, "100": 78, "101": 79, "102": 80, "106": 81, "107": 82, "108": 83, "109": 84, "110": 85, "111": 86, "112": 87, "113": 88, "114": 89, "115": 90, "116": 91, "117": 92, "118": 93, "119": 94, "120": 95, "121": 96, "122": 97, "123": 98, "127": 99, "128": 100, "129": 101, "133": 102, "134": 103, "135": 104, "136": 105, "137": 106, "138": 107, "139": 108, "140": 109, "141": 110, "142": 111, "143": 112, "144": 113, "145": 114, "146": 115, "147": 116, "148": 117, "149": 118, "150": 119, "151": 120, "152": 121, "153": 122, "154": 123, "155": 124, "156": 125, "157": 126, "158": 127, "159": 128, "160": 129, "161": 130, "162": 131, "163": 132, "164": 133, "165": 134, "166": 135, "167": 136, "168": 137, "169": 138, "170": 139, "171": 140, "172": 141, "173": 142, "174": 143, "175": 144, "176": 145, "177": 146, "178": 147, "179": 148, "180": 149, "181": 150, "182": 151, "183": 152, "184": 153, "185": 154, "186": 155, "187": 156, "188": 157, "189": 158, "190": 159, "191": 160, "192": 161, "193": 162, "194": 163, "195": 164, "196": 165, "197": 166, "198": 167, "199": 168, "200": 169, "201": 170, "202": 171, "203": 172, "204": 173, "205": 174, "206": 175, "207": 176, "208": 177, "209": 178, "210": 179, "211": 180, "212": 181, "213": 182, "214": 183, "215": 184, "216": 185, "217": 186, "218": 187, "219": 188, "220": 189, "221": 190, "222": 191, "223": 192, "224": 193, "225": 194, "226": 195, "227": 196, "228": 197, "229": 198, "230": 199}
                }
            }
        ]
    }
}
"""


# sym_arr = ["giifdieeggbdfmmmmhhcchegfiidibmmmmggcffiehhbgdmmmmiceefhaggbimmmmhecfgddihbfeiigbdmmmmffhecgdhfiiaeehcffbbaagedhhcaffbieehddggaficchhegdffaiggchhbieagcffibhddegahiicfeehdggafbbihheccgdiifaahgbiiddfchh",
# "hcgiicggdfbiahhfemmmmggdiccddggdhhbiicmmmmfaggaaibddecggaddmmmmiibbdcggiafidggchbffgiimmmmddibgffhadmmmmggciidbggdciiagbbiehddgiieegciibffagiiddgehbbiggaeehibgddiabbffehhibgcfheeigdaahhfebgiidbbhffeea",
# "dbhffbecchaffehhbmmmmiccfgaaebhaffemmmmddcfbhhefgaeihhcffccieemmmmcaffgeiicheehffeggmmmmhhaieeffhccfhhmmmmeehafcggddihheffghieedffhaciifeedhggccfbhhaeiiccffdihcgfahdieegcfbbhaiddgffbhhcdhhaaggfbhicgee",
# "gibfdieeggbadfmmmmhcciegfhhdibggcffiemmmmhhbgdiceefhaggbihecfmmmmgddihbfeiigadffhecgmmmmdhfiiaeehcffbbmmmmiigedhhcaffbieehddggaficchhegdffaiggchhbieagcffibhddegahiicfeehdggafbbihheccgdiifaahgbiiddfchh",
# "hcfiieggdfbmmmmiahhfeggdicceefgdhhbiimmmmcfaggddibhhecffahdiibmmmmehcggiafhdggcibffmmmmgdhheibgffhadmmmmggichefbgdcihagbbiehddfiieegchhbffagiiddfehccigfaeehibgddiaccffehhibgcfheeigdaahhfecgiidbbhffeea",
# "dhifgbdceiammmmgfdhhbiccfgddebiaffehhmmmmcgbiiefgadihhcggbbiemmmmchaffgeiichddimmmmffegghhaiedgghccfmmmmiieehafbggddihheffghieedffhabiifeedhggccfbhhaeiicfbgdihcgfahdieegcfbbhaiddgffbhhcdiiaaggfbhicgee"]

# sym_num = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 17, 18, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 39, 40, 41, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 61, 62, 63, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 82, 83, 84, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 109, 110, 111, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230], 
# [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 28, 30, 31, 33, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 75, 77, 78, 80, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 122, 124, 125, 127, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 175, 177, 178, 180, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 215, 217, 218, 220, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330], 
# [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 28, 30, 31, 33, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 72, 74, 75, 77, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 125, 127, 128, 130, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 173, 175, 176, 178, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 217, 219, 220, 222, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330], 
# [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 29, 32, 33, 36, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 88, 91, 92, 95, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 148, 151, 152, 155, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 207, 210, 211, 214, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 261, 264, 265, 268, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380], 
# [1, 2, 3, 4, 5, 6, 7, 8, 9, 26, 29, 30, 33, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 88, 91, 92, 95, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 149, 152, 153, 156, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 206, 209, 210, 213, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 259, 262, 263, 266, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380], 
# [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 15, 16, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 46, 47, 48, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 76, 77, 78, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 100, 101, 102, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 127, 128, 129, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230]
# ]
# dic = [{},{},{},{},{},{}]
# for i in range(6):
#     str_l = list(sym_arr[i])
#     for sym,j in enumerate(sym_num[i]):
#         #   print(sym,j)
#           dic[i][j] = sym

# print(dic)
