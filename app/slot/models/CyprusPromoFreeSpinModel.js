PromoFreeSpinModel = function () {
	this.isPFSTriggered = false;
	this.isPFSEnded = false;
	this.isPFSActive = false;
	this.isFullPFSActive = false;		//will be set false only on listening on onFSEndShown

	this.totalPromoFreeSpins = 0;
	this.totalFSTriggered = 0;
	this.remainingPromoFreeSpins = 0;

	this.totalPFSWins = 0;

	this.PFSData = {};
	// this.totalFSWin = 0;
	// this.multiplier = 0;
};

var pfsModel = PromoFreeSpinModel.prototype;

//"{"amount_type":3,"amount":200,"num_coins":10,"coin_value":1,"num_spins":20,"spins_left":20}"
pfsModel.saveInitData = function (obj) {

	if(isHistoryMode || obj.gamble_recovery_data.gamble_feature_active) return;

	if (obj.meta_data && obj.meta_data.pfr && obj.promo_details.type == "promospins") {
		this.isPFSTriggered = true;
		this.isPFSEnded = false;
		this.isPFSActive = true;
		this.isFullPFSActive = true;

		if (obj.meta_data && obj.meta_data.pfr) {
			this.totalPromoFreeSpins = obj.meta_data.pfr.total_pfr_count || 0;
			this.remainingPromoFreeSpins = obj.meta_data.pfr.remain_pfr_count || 0;
			this.totalPFSWins = obj.meta_data.pfr.total_pfr_win || 0;
			this.PFSData = obj.meta_data.pfr;

		} else if (obj.promo_details) {
			this.totalPromoFreeSpins = obj.promo_details.num_spins || 0;
			this.remainingPromoFreeSpins = obj.promo_details.spins_left || 0;
			this.totalPFSWins = obj.promo_details.pfs_win_amount || obj.promo_details.win_amount || 0;
			this.PFSData = obj.promo_details;
		}
	}
	if(obj.previous_round)
		this.previousData = obj;
}
pfsModel.saveSpinData = function (obj) {
	// User chose to play PFS later – ignore all server PFS data for this session
	// so the spin state machine, balance deduction, and spin button stay in normal mode.
	if(isHistoryMode) return;
	if (_ng.GameConfig.PFSUseLater) {
		return;
	}

	var pfsData = null;
	var spinsLeft = 0;
	
	if (obj.meta_data && obj.meta_data.pfr) {
		pfsData = obj.meta_data.pfr;
		spinsLeft = obj.meta_data.pfr.remain_pfr_count || 0;
	} else if (obj.promo_details && obj.promo_details.spins_left !== undefined) {
		pfsData = obj.promo_details;
		spinsLeft = obj.promo_details.spins_left;
	}
	
	if (pfsData !== null && spinsLeft !== undefined) {
		// Only update PFS state when we were already in a PFS round, or when response shows active PFS (remaining > 0).
		// This prevents normal spins from setting isPFSEnded when server sends meta_data.pfr with remain_pfr_count: 0.
		var wasInPFS = this.isPFSActive && this.remainingPromoFreeSpins > 0;
		var responseHasRemaining = (spinsLeft > 0);

		if (!wasInPFS && !responseHasRemaining) {
			// Normal spin or stale pfr data with 0 remaining - don't touch PFS state
			return;
		}

		this.isPFSTriggered = false;
		this.isPFSEnded = false;
		this.isPFSActive = true;
		this.isFullPFSActive = true;

		if (obj.meta_data && obj.meta_data.pfr) {
			this.totalPromoFreeSpins = obj.meta_data.pfr.total_pfr_count || 0;
			this.remainingPromoFreeSpins = obj.meta_data.pfr.remain_pfr_count || 0;
			this.totalPFSWins = obj.meta_data.pfr.total_pfr_win || 0;
			this.PFSData = obj.meta_data.pfr;
		} else {
			this.totalPromoFreeSpins = obj.promo_details.num_spins || 0;
			this.remainingPromoFreeSpins = obj.promo_details.spins_left || 0;
			this.totalPFSWins = obj.promo_details.pfs_win_amount || obj.promo_details.win_amount || 0;
			this.PFSData = obj.promo_details;
		}
		
		// Only set isPFSEnded when we actually just finished a PFS round (had spins and now 0)
		if (wasInPFS && spinsLeft == 0) {
			this.isPFSEnded = true;
			this.isPFSActive = false;
		}
	}
}
pfsModel.getPFSData = function(){
	return this.PFSData;
}
pfsModel.getPreviousInitData = function () {
    return this.previousData.previous_round;
}