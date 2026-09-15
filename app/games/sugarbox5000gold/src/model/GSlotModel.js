var gSlotModel = _ng.SlotModel.prototype;

gSlotModel.checkBigwinAvailable = function () {
	if (this.getTotalWin() > 0) {
		if (_ng.GameConfig.specialWins.nice.multiplier * this.getTotalBet() <= this.getTotalWin()) {
			this.isBigWin = true;
		} else {
			this.isBigWin = false;
		}
	}
}