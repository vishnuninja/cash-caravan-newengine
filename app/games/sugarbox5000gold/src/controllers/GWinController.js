var gWC = WinController.prototype;

gWC.addExtraListeners = function () {

    _mediator.subscribe("unfinishedFreeSpins", this.onShowBonusGame.bind(this));
    _mediator.subscribe("FreeSpinsStarted", this.onShowBonusGame.bind(this));
    // _mediator.subscribe("setProgressBar", this.onSetProgressBar.bind(this));
    // _mediator.subscribe("onFSEndShown", this.removeStickyBg.bind(this));
    // _mediator.subscribe("showPostSpawningWild", this.onShowPostSpawningWild.bind(this));
    // _mediator.subscribe(_events.core.onResize, this.onResize.bind(this));
    // _mediator.subscribe('showMultipler', this.onShowMultipler.bind(this));

}

// gWC.onShowMultipler = function (val) {
//     this.view.updateMultipler(val);
// }
// gWC.onShowTotalWin = function () {
//     if (!_ng.GameConfig.noTotalWinSymbols) {
//         this.view.showAllWins(coreApp.gameModel.spinData.getTotalLineWins());
//     }
// }

// gWC.onShowPostSpawningWild = function () {
//     this.view.showPostSpawningWild(coreApp.gameModel.spinData.spawningWildReelNum);
// }

// gWC.removeStickyBg = function () {
//     this.view.removeStickyBg();
// }

// gWC.onShowBigWin = function () {

//     if (coreApp.gameModel.obj.current_round.post_matrix_info && coreApp.gameModel.obj.current_round.post_matrix_info.multiplier && coreApp.gameModel.obj.current_round.post_matrix_info.multiplier.length > 0)
//         { 
//             setTimeout(function(){
//             this.view.showBigWin(coreApp.gameModel.getTotalWin(), _ng.GameConfig.specialWins);
//         }.bind(this), (1700 * (coreApp.gameModel.obj.current_round.misc_prizes.count)) + (800 * (coreApp.gameModel.obj.current_round.post_matrix_info.multiplier.length))); }
//    else {
//     setTimeout(function(){
//         this.view.showBigWin(coreApp.gameModel.getTotalWin(), _ng.GameConfig.specialWins);
//     }.bind(this),(1600 * (coreApp.gameModel.obj.current_round.misc_prizes.count)));
//    }
    
	
// }
gWC.onShowTotalWin = function () {
    
    var flag=0;
	if (!_ng.GameConfig.noTotalWinSymbols){

        var bonus_wins=coreApp.gameModel.userModel.userData.current_round.screen_wins;

	    for(var i=0;i<15;i++)
	    {
		    if(bonus_wins[i]>0)
		    {
                flag=1;
                break;
            }
        }
        // if(flag==1)
        // {
        //     this.view.showAllWins(coreApp.gameModel.spinData.getTotalLineWins());
           
        //     _mediator.publish("DisablePanel");
        //     _mediator.publish(_events.slot.updateBalance);
        //     setTimeout(function(){
        //         _mediator.publish("TweenBonusSym"); 
        //         //_mediator.publish("EnablePanel");
        //     }.bind(this),1500
        //     );
        //     this.view.CreateWinBg();
        //             setTimeout(
        //                 function(){
        //                     this.view.removeWinBg();
        //         }.bind(this), (_ng.isQuickSpinActive && _ng.quickSpinType === "turbo") ? 500:_ng.GameConfig.totalWinDuration);
        // }
        // else
        // {
            this.view.CreateWinBg();
                    setTimeout(
                        function(){
                            this.view.removeWinBg();
                }.bind(this), (_ng.isQuickSpinActive && _ng.quickSpinType === "turbo") ? 500:_ng.GameConfig.totalWinDuration);
            // _mediator.publish(_events.slot.updateBalance);
		// this.view.showAllWins(coreApp.gameModel.spinData.getTotalLineWins());
        // }
	}
}
gWC.onShowBonusGame = function () {
    _mediator.publish('showMultipler', 0);
   // this.view.showFSTransitionAnimation();
}

// gWC.onSetProgressBar = function(val, level, noCall){
//     this.view.setProgressbar(val, level, noCall);
// }
// gWC.onSpinStart = function (argument) {
// 	this.view.onSpinStart(coreApp.gameModel.isFreeSpinActive());
// 	this.view.clearAllWins();
// }
// gWC.onResize = function(){
//     this.view.onResize();
// }
