// Library
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function loadJSON(url, callback, errorCallback) {

    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.overrideMimeType("application/json");
    xmlHttpRequest.open("GET", url, true); // Replace 'my_data' with the path to your file
    xmlHttpRequest.onerror = errorCallback;
    xmlHttpRequest.onreadystatechange = () => {
        // if (xmlHttpRequest.readyState === 4 && String(xmlHttpRequest.status) === "404") {
        //   errorCallback();
        // }
        if (xmlHttpRequest.readyState === 4 && String(xmlHttpRequest.status) === "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply
            // returns undefined in asynchronous mode
            callback(JSON.parse(xmlHttpRequest.responseText));
        }
    };
    xmlHttpRequest.send(null);
}

function postRequest(url, obj, callback) {
    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onreadystatechange = () => {
        if (xmlHttpRequest.readyState === 4 && String(xmlHttpRequest.status) === "200") {
            callback(JSON.parse(xmlHttpRequest.responseText));
        }
    };

    xmlHttpRequest.onerror = (e) => {
        callback({ type: "error", error_code: "001", msg: "error in server call on error" });
    };

    xmlHttpRequest.open("POST", url, true);
    xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttpRequest.send(obj);
}
var currencyFormatChange = {
    "eur": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
    "es_es": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
    "rub": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
    "sek": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
    "nok": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
    "pt_pt": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
    "lv": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
    "lt": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
    "czk": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
    "huf": { minAmount: 1000, maxAmount: 10000, indexToRemove: 1 },
    "it": { minAmount: -(Number.MAX_SAFE_INTEGER), maxAmount: Number.MAX_SAFE_INTEGER, removeFromLast: true, indexToRemove: 1 }
};

function setCurrencySymbol(curr) {
    gameCurrency = curr;
}
function getCurrencySymbol() {
    return gameCurrency;
}

function getFormattedAmount(amount, amountwithoutcurrency) {
    /* Space separator will not work for values lesser than 10000.00
     * Spanish, 1123.45 => "1123,45 €" & 11234.45 => "11 234,45 €"
     */
    amount = Number(amount);
    var removeSpace = false;
    var config = currencyFormatChange;
    if (Object.keys(config).indexOf(currencyCode) >= 0 && (amount >= config[currencyCode].minAmount && amount < config[currencyCode].maxAmount)) {
        if (currencyCode === "eur") {
            if (_lang === "pt_pt" || _lang === "es_es" || _lang === "lv" || _lang === "lt") {
                removeSpace = true;
            } else {
                removeSpace = false;
            }
        } else {
            removeSpace = true;
        }
    }

    amount = _langFormat(amount).format(true);
    if (removeSpace && config[currencyCode].removeFromLast) {
        amount = amount.split("");
        amount.splice(amount.length - 1 - config[_lang].indexToRemove, 1);
        amount = amount.join("");
    } else {
        if (removeSpace && (amount[config[currencyCode].indexToRemove] === " ")) {
            amount = amount.split("");
            amount.splice(config[currencyCode].indexToRemove, 1);
            amount = amount.join("");
        }
    }
    // if (amountwithoutcurrency && (['€', '£', '$', 'kr'].indexOf(this.getCurrencySymbol()) == -1)) {
    if (amountwithoutcurrency) {
        amount = amount.replace(this.getCurrencySymbol(), "");
    }
    return amount;
}


var lang = getParameterByName("language") || "en";
var _lang = {};
var _langFormat = "";
var currencyCode = "";
var gameCurrency = "";

function setCurrency(curcyCode) {
    var code = curcyCode.toLowerCase();
    currencyCode = code;
    switch (code) {
        case "es_es":
            _langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',' });
            setCurrencySymbol('€');
            break;
        case "de":
            _langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: '.', decimal: ',' });
            setCurrencySymbol('€');
            break;
        case "pln":
            _langFormat = value => currency(value, { symbol: 'zł', pattern: `# !`, separator: ' ', decimal: ',' });
            setCurrencySymbol('zł');
            break;
        case "fr":
            _langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',' });
            setCurrencySymbol('€');
            break;
        case "krw":
            _langFormat = value => currency(value, { symbol: '₩', separator: ',', decimal: '.' });
            setCurrencySymbol('₩');
            break;
        case "rub":
            _langFormat = value => currency(value, { symbol: '₽', pattern: `# !`, separator: ' ', decimal: ',' });
            setCurrencySymbol('₽');
            break;
        case "jpy":
            _langFormat = value => currency(value, { symbol: '￥', separator: ',', decimal: '.' });
            setCurrencySymbol('￥');
            break;
        case "sek":
            _langFormat = value => currency(value, { symbol: 'kr', pattern: `# !`, separator: ' ', decimal: ',' });
            setCurrencySymbol('kr');
            break;
        case "dkk":
            _langFormat = value => currency(value, { symbol: 'kr', pattern: `# !`, separator: '.', decimal: ',' });
            setCurrencySymbol('kr');
            break;
        case "nok":
            _langFormat = value => currency(value, { symbol: 'kr', pattern: `# !`, separator: ' ', decimal: ',' });
            setCurrencySymbol('kr');
            break;
        case "pt_pt":
            _langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',' });
            setCurrencySymbol('€');
            break;
        case "myr":
            _langFormat = value => currency(value, { symbol: '‎RM ', separator: ',', decimal: '.' });
            setCurrencySymbol('‎RM');
            break;
        case "thb":
            _langFormat = value => currency(value, { symbol: '฿', pattern: `# !`, separator: ',', decimal: '.' });
            setCurrencySymbol('฿');
            break;
        case "sr_la":
            _langFormat = value => currency(value, { symbol: '£', pattern: `# !`, separator: '.', decimal: ',' });
            setCurrencySymbol('£');
            break;
        case "try":
            _langFormat = value => currency(value, { symbol: '₺', separator: '.', decimal: ',' });
            setCurrencySymbol('₺');
            break;
        case "ron":
            _langFormat = value => currency(value, { symbol: 'lei', pattern: `# !`, separator: '.', decimal: ',' });
            setCurrencySymbol('lei');
            break;
        case "vnd":
            _langFormat = value => currency(value, { symbol: '₫', pattern: `# !`, separator: '.', decimal: ',' });
            setCurrencySymbol('₫');
            break;
        case "lv":
            _langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',' });
            setCurrencySymbol('€');
            break;
        case "lt":
            _langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',' });
            setCurrencySymbol('€');
            break;
        case "idr":
            _langFormat = value => currency(value, { symbol: 'Rp ', separator: '.', decimal: ',' });
            setCurrencySymbol('Rp');
            break;
        case "it":
            _langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: '.', decimal: ',' });
            setCurrencySymbol('€');
            break;
        case "bgn":
            _langFormat = value => currency(value, { symbol: 'Лв', pattern: `# !`, separator: ' ', decimal: ',' });
            setCurrencySymbol('Лв');
            break;
        case "fi":
            _langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',' });
            setCurrencySymbol('€');
            break;
        case "twd":
            _langFormat = value => currency(value, { symbol: 'NT$', separator: ',', decimal: ',' });
            setCurrencySymbol('NT$');
            break;
        case "cny":
            _langFormat = value => currency(value, { symbol: '¥ ', separator: ',', decimal: ',' });
            setCurrencySymbol('¥');
            break;
        case "ar":
            _langFormat = value => currency(value, { symbol: 'د.إ ', separator: '', decimal: ',' });
            setCurrencySymbol('د.إ ');
            break;
        case "czk":
            _langFormat = value => currency(value, { symbol: 'Kč', pattern: `# !`, separator: ' ', decimal: '.' });
            setCurrencySymbol('Kč');
            break;
        case "nl":
            _langFormat = value => currency(value, { symbol: '€', separator: '.', decimal: ',' });
            setCurrencySymbol('€');
            break;
        case "gbp":
            if (this.lang === "sr_la") {
                _langFormat = value => currency(value, { symbol: 'RSD ', pattern: `# !`, separator: '.', decimal: ',' });
                setCurrencySymbol('RSD');
            } else {
                _langFormat = value => currency(value, { symbol: '£', separator: ',', decimal: '.' });
                setCurrencySymbol('£');
            }
            break;
        case "el_gr":
            _langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: '.', decimal: ',' });
            setCurrencySymbol('€');
            break;
        case "huf":
            _langFormat = value => currency(value, { symbol: 'Ft', pattern: `# !`, separator: ' ', decimal: ',' });
            setCurrencySymbol('Ft');
            break;
        case "pt_br":
            _langFormat = value => currency(value, { symbol: '$', separator: '.', decimal: ',' });
            setCurrencySymbol('$');
            break;
        case "uah":
            _langFormat = value => currency(value, { symbol: '₴', separator: '.', decimal: ',' });
            setCurrencySymbol('₴');
            break;
        case "ars":
            _langFormat = value => currency(value, { symbol: '$', separator: '.', decimal: ',' });
            setCurrencySymbol('$');
            break;
        case "aud":
            _langFormat = value => currency(value, { symbol: '$', separator: ',', decimal: '.' });
            setCurrencySymbol('$');
            break;
        case "brl":
            _langFormat = value => currency(value, { symbol: 'R$', separator: '.', decimal: ',' });
            setCurrencySymbol('R$');
            break;
        case "cad":
            _langFormat = value => currency(value, { symbol: '$', separator: ',', decimal: '.' });
            setCurrencySymbol('$');
            break;
        case "hrk":
            _langFormat = value => currency(value, { symbol: 'kn', pattern: `# !`, separator: '.', decimal: ',' });
            setCurrencySymbol('kn');
            break;
        case "gel":
            _langFormat = value => currency(value, { symbol: 'ლ', pattern: `# !`, separator: ' ', decimal: ',' });
            setCurrencySymbol('ლ');
            break;
        case "ghs":
            _langFormat = value => currency(value, { symbol: 'GH¢', separator: ',', decimal: '.' });
            setCurrencySymbol('GH¢');
            break;
        case "hkd":
            _langFormat = value => currency(value, { symbol: 'HK$', separator: ',', decimal: '.' });
            setCurrencySymbol('HK$');
            break;
        case "isk":
            _langFormat = value => currency(value, { symbol: 'kr', separator: '.', decimal: ',' });
            setCurrencySymbol('kr');
            break;
        case "mxn":
            _langFormat = value => currency(value, { symbol: '$', separator: ',', decimal: '.' });
            setCurrencySymbol('$');
            break;
        case "nzd":
            _langFormat = value => currency(value, { symbol: '$', separator: ',', decimal: '.' });
            setCurrencySymbol('$');
            break;
        case "pen":
            _langFormat = value => currency(value, { symbol: 'S/', separator: ',', decimal: '.' });
            setCurrencySymbol('S/');
            break;
        case "php":
            _langFormat = value => currency(value, { symbol: '₱', separator: ',', decimal: '.' });
            setCurrencySymbol('₱');
            break;
        case "sgd":
            _langFormat = value => currency(value, { symbol: 'S$', separator: ',', decimal: '.' });
            setCurrencySymbol('S$');
            break;
        case "zar":
            _langFormat = value => currency(value, { symbol: 'R', separator: ',', decimal: '.' });
            setCurrencySymbol('R');
            break;
        case "chf":
            _langFormat = value => currency(value, { symbol: 'CHf ', separator: ' ', decimal: '.' });
            setCurrencySymbol('CHf');
            break;
        case "usd":
            _langFormat = value => currency(value, { symbol: '$', separator: ',', decimal: '.' });
            setCurrencySymbol('$');
            break;
        case "eur":
            if (this.lang === "pt_pt") {
                _langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',' });
                setCurrencySymbol('€');
            } else if (this.lang === "lv") {
                _langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',' });
                setCurrencySymbol('€');
            } else if (this.lang === "lt") {
                _langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',' });
                setCurrencySymbol('€');
            } else if (this.lang === "en") {
                _langFormat = value => currency(value, { symbol: '€', separator: ',', decimal: '.' });
                setCurrencySymbol('€');
            } else if (this.lang === "es_es") {
                _langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',' });
                setCurrencySymbol('€');
            } else if (this.lang === "de") {
                _langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: '.', decimal: ',' });
                setCurrencySymbol('€');
            } else if (this.lang === "fr") {
                _langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',' });
                setCurrencySymbol('€');
            } else if (this.lang === "it") {
                _langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: '.', decimal: ',' });
                setCurrencySymbol('€');
            } else if (this.lang === "fi") {
                _langFormat = value => currency(value, { symbol: '€', pattern: `# !`, separator: ' ', decimal: ',' });
                setCurrencySymbol('€');
            } else {
                _langFormat = value => currency(value, { symbol: '€', separator: ',', decimal: '.' });
                setCurrencySymbol('€');
            }
            break;
        default:
            _langFormat = value => currency(value, { symbol: currencyCode, separator: ',', decimal: '.' });
    }
}