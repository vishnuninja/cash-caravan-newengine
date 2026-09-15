const FreeSpinMultipliers = 100;
const SuperFreeSpinMultipliers = 500;
const AnteBetMultiplier = 1.3;


function toProgaCoinValue(coinValue) {
    return coinValue / 10;
}

function getBaseWager(totalWager, feature) {
    let wager = toProgaCoinValue(totalWager);
    switch (feature) {
        case 'buyFreeSpins':
            wager = wager / FreeSpinMultipliers;
            break;
        case 'superBuyFreeSpins':
            wager = wager / SuperFreeSpinMultipliers;
            break;
        case 'anteBet':
            wager = wager / AnteBetMultiplier;
            break;
    }
    return wager;
}

function getTotalWager(totalWager) {
    return toProgaCoinValue(totalWager);
}

function getNormalizedBaseWager(totalWager, feature) {
    const baseWager = getBaseWager(totalWager, feature);
    let wagerStr = (baseWager / 100).toFixed(3)

    // remove trailing zeros after decimal point
    wagerStr = wagerStr.replace(/\.?0+$/, '');
    return wagerStr;
}

function getNormalizedTotalWager(totalWager) {
    const total = getTotalWager(totalWager);
    let wagerStr = (total / 100).toFixed(3)

    // remove trailing zeros after decimal point
    wagerStr = wagerStr.replace(/\.?0+$/, '');
    return wagerStr;
}