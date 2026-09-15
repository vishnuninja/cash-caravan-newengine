function UserModel() {
	this.balance = 0;
	this.accountId = 0;
	this.userName = "";
	this.cash = 0;
	this.bonus = 0;
	this.dynamicRTP = "96.01%"
}
var userData = UserModel.prototype;
userData.saveUserInfo = function (obj) {
	this.userData = obj;
	this.accountId = obj.player.account_id;
	this.balance = obj.player.balance * 100;
	this.currency = obj.player.currency || 'GBP';
	this.currency = this.currency.toLowerCase();
	this.dynamicRTP = obj.game.rtp || ''
	this.dynamicRTPText = this.dynamicRTP + "%."
};




userData.getBalance = function (argument) {
	return this.balance.toFixed(2);
};
userData.setBalance = function (data) {
	if(data >= 0){
		this.balance = data;
	}
};
userData.getCurrencyCode = function() {
	return this.currency;
};
userData.getPlayerId = function(){
	return this.accountId;
};
userData.updateUserModelWithPFS = function(PFSData){
    if(PFSData.amount !== undefined){
        this.setBalance(PFSData.amount);
	}
	this.currency = "";
}