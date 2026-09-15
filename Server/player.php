<?php
require_once $_SERVER['DOCUMENT_ROOT']. '/common/services/transactions.inc.php';

define("INTERNAL_TRANS", True);
$operators_config = Array(
    'round_preclosure_operators' => Array(), #Array('GMO'),
    'zero_win_operators' => Array('GMO', 'WAC', 'TNT','NJN'),
    'zero_fs_win_operators' => Array('GMO', 'RLX','NJN'),
    'zero_pfs_win_operators' => Array('RLX','NJN'),
);

class Player
{
    const PLAYER_ACCOUNT = 'users.account',
          PLAYER_DETAILS = 'users.profile',
          TRXN_LOG = 'logs.transactions';

    var $firstName, $userName, $accountId, $balance,
        $numDeposits, $isFreePlayer, $playerType, $currency, $amountType,
        $operatorId, $siteId, $cash, $bonusAmount, $gameId, $channel,
        $balDetails, $promoDetails, $opCode, $extraInfo, $operatorsConfig;

    public function __construct($amountType, $gameId, $channel)
    {
        global $operators_config;

        # todo. Handle session if not session is not valid
        $this->accountId = $_SESSION['user_id'];
        $this->amountType = $amountType;
        $this->gameId = $gameId;
    	$this->channel = $channel;
        $this->cashWagering = 0;
        $this->bonusAmountWagering = 0;
        $this->cashWageringPct = 0;
        $this->bonusAmountWageringPct = 0;
        $this->miscData = Array(); # for bonusamount
        $this->errorSource = 'operator';
        $this->cash = 0;
        $this->cash2 = 0;
        $this->bonusAmount = 0;
        $this->bonusAmountWinning = 0;
        $this->cashWinning = 0;
        $this->opCode = $_SESSION['aggregator_code'];
        
        $this->extraInfo = array('debit' => '');
        $this->operatorsConfig = $operators_config;


        $this->loadPlayerDetails();
    }

    function loadPlayerDetails()  {
        # todo TODO handle this later
        # dont want to call getBalance() during gameEnd() API Call.
        if($_POST['request_type'] == ENDROUND_MODE) {
            return;
	}

	// fun_mode
        if($this->amountType == AMOUNT_TYPE_FUN ) {

            if( !isset($_SESSION['balance' . $this->gameId]) ) {
                $_SESSION['balance' . $this->gameId] = FUN_INIT_BAL;
            }

            $this->balance = round($_SESSION['balance' . $this->gameId], 2);
            $this->userName = $this->accountId;
			$this->currency = 'USD';

            return;
        }

        if($_POST['request_type'] != INIT_MODE) {
            $this->currency = $_SESSION['player_balance']['currency'];
            $this->setBalance($_SESSION['player_balance']['cash'],
                $_SESSION['player_balance']['bonus_amount'],
                $_SESSION['player_balance']['cash2']);
            $this->balDetails = $_SESSION['player_balance']; // Get PFS details from session
            return;
        }

        $res = $this->handleGetBalance();
        // $res = array('error'=> 0, 'currency'=> 'INR', 'cash'=> 699.72, 'bonus_amount'=> 0, 'bonus_balance'=> 0, 'promo_freespins'=> 1, 'promo_freespin_all'=> 1, 'is_depositor'=> 0, 'num_deposits'=> 0, 'locale'=> 'EN', 'cash2'=> 0);
        $this->storeBalance($res);
        $_SESSION['rgs_user_id']= $res['rgs_user_id'];
        $this->balDetails = $res;
        $this->userName = $this->accountId;
        $this->currency = $res['currency'];
        $this->setBalance($res['cash'], $res['bonus_amount'], $res['cash2']);
    }

//     function updateStoredPFS($res) {
//         $_SESSION['player_balance']['promo_freespins'] = $res['promo_freespins'];
//         $this->balDetails = $_SESSION['player_balance'];
//    }

    function updateStoredPFS($res) {
        if(isset($res['promo_freespins']) and count($res['promo_freespins']) >= 1 ){
            $_SESSION['player_balance']['promo_freespins'] = $res['promo_freespins'];
            $this->balDetails = $_SESSION['player_balance'];
        }
    }

    /**
    * @fun endPFSGame
    * Just before calling end game check is there any other BFS in queue ?
    * If yes, set here to send to client in key "promo_details".
    */
    public function endPFSGame($gameType, $gameId, $amountType, $expired_pfs=array(), $spinData=array())
    {
        # todo need to have dynamic ones
        $channels = Array('desktop' => 1, 'mobile' => 2);
        $operatorId = $_SESSION['operator_id'];
        $siteId     = $_SESSION['site_id'];
        $sessionId = $_REQUEST['session_id'];
        $promoFreespins = 0;
        $PfsRoundId= '';

        if( (isset($this->promoDetails['curr_spin']['next_round'])
            && !($this->promoDetails['curr_spin']['next_round']))
            || (isset($expired_pfs['pfs_round_id'])
            && $expired_pfs['pfs_round_id'] != '' ) ) {
            $PfsRoundId = $this->promoDetails['curr_spin']['bfs_record_id'];
            #$TransID = $this->getTransId('trans_id');

            if(isset($expired_pfs['pfs_round_id']) && $expired_pfs['pfs_round_id'] != '') {
                $PfsRoundId = $expired_pfs['pfs_round_id'];
                $winAmount = $expired_pfs['win_amount'];
                $gameName = $expired_pfs['game_name'];
                $gameMode = $expired_pfs['game_mode'];
                $roundId = $expired_pfs['round_id'];
                $baseRoundId = $expired_pfs['base_round_id'];
                $roundEndState = $expired_pfs['round_end_state'];
                $platform = $expired_pfs['platform'];
                $promoFreespins = $expired_pfs['promo_freespins'];
                $spinType = 'normal';
                $note = 'credit';
            } else if(isset($this->promoDetails['curr_spin'])) {
                $roundId = $spinData['round_id'];
                $baseRoundId = $spinData['base_round_id'];
                $winAmount = $this->promoDetails['curr_spin']['win_amount'];
                $gameName = $spinData['game_name'];
                $roundEndState = 1; $note = 'credit';
                $spinType = $spinData['spin_type'];
                $platform = $spinData['platform'];
            }

            $channelId = $channels[$platform];
            #$amount = to_base_currency($winAmount);
            $amount = $winAmount;

            /*$res = Transaction::endPFSGame($gameType, $gameId, $this->accountId,
                    $amountType, $_REQUEST['session_id'],
                    $PfsRoundId);*/

            $res = Transaction::debitPFSBet($gameId, $roundId, $this->accountId,
                    $gameType, $channelId, WAGERING, $amountType, $amount, $siteId,
                    $operatorId, $sessionId, $this->currency, $amount,
                    0, $gameName, $spinType, $baseRoundId,
                    $roundEndState, $note, $promoFreespins, $PfsRoundId);

            $res = Transaction::endPFSGame2($gameId, $roundId, $this->accountId,
                $gameType, $channelId, WINNING, $amountType, $amount, $siteId,
                $operatorId, $sessionId, $this->currency, $amount,
                0, $gameName, $spinType, $baseRoundId,
                $roundEndState, $note, $promoFreespins, $PfsRoundId);

            if(!isset($expired_pfs['pfs_round_id']) && count($this->promoDetails['alive']) > 1) {
                // Below code commented to load queued PFS in INIT call only.
                //$this->promoDetails['curr_spin'] = $this->promoDetails['alive'][1];
            }

        }
    }

    function storeBalance($res) {
        if($_POST['request_type'] == INIT_MODE) {
            $_SESSION['player_balance'] = $res;
        }
    }

    /*
        @fun updateStoredBalance()
        To handle pre balance issue. After every credit and debit, latest balance
        will be updated into session, which will be used to store into DB.
    */
    function updateStoredBalance($cash, $bonus, $cash2) {
                $_SESSION['player_balance']['cash'] = $cash;
                $_SESSION['player_balance']['bonus_amount'] = $bonus;
                $_SESSION['player_balance']['cash2'] = $cash2;
    }

    function setBalance($cash, $bonusAmount, $cash2)
    {
        $this->cash = $cash;
        $this->bonusAmount = $bonusAmount;
        $this->cash2 = $cash2;

        if($this->amountType == 1 || $this->amountType == AMOUNT_TYPE_PFS) {
            $this->balance = $this->cash + $this->bonusAmount;
            $this->balance2 = $this->cash2;
        }
        
    }

    function setPromoBalance($balanceDetails)
    {
        $this->balDetails = $balanceDetails;
    }

    function setMiscData($misc) {
        $this->miscData = $misc;
    }

    function setSplitWagering($amount)
    {
        $lowBalanceOpers = array('TNT');
        if($this->amountType != 1) {
            return;
        }

        if($this->cash > 0 && $amount <= $this->cash) {
            $this->cashWagering = $amount;
            $this->bonusAmountWagering = 0;
            $this->cashWageringPct = 100;
            $this->bonusAmountWageringPct = 0;
        }
        elseif($this->cash > 0 && $amount > $this->cash) {
            $remainingAmount = $amount - $this->cash;

            if($remainingAmount <= $this->bonusAmount) {
                $this->cashWagering = $this->cash;
                $this->bonusAmountWagering = $remainingAmount;
                $this->cashWageringPct = round(($this->cashWagering / $amount) * 100, 2);
                $this->bonusAmountWageringPct = round(100 - $this->cashWageringPct, 2);
            } else {
                if(!in_array($this->opCode, $lowBalanceOpers)) {
                ErrorHandler::handleError(1, "ERR_PLYR_001", "Insufficient Balance");
            }
        }
        }
        elseif($this->cash == 0 && $this->bonusAmount > 0 && $amount <= $this->bonusAmount) {
            $this->cashWagering = 0;
            $this->bonusAmountWagering = $amount;
            $this->cashWageringPct = 0;
            $this->bonusAmountWageringPct = 100;
        }
        else {
            ErrorHandler::handleError(1, "ERR_PLYR_002", "Insufficient Balance");
        }
    }

    function setSplitWinning($amount)
    {
        if($this->amountType != 1) {
            return;
        }

        $cashWageringPct = $this->miscData['wager_split']['cash_wagering_pct'];
        $bonusAmountWageringPct = $this->miscData['wager_split']['bonus_amount_wagering_pct'];

        if($this->cashWageringPct > 0 or $this->bonusAmountWageringPct) {
            $cashWageringPct = $this->cashWageringPct;
            $bonusAmountWageringPct = $this->bonusAmountWageringPct;
        }

        $this->cashWinning = round(($cashWageringPct * $amount)/100, 2);
        $this->bonusAmountWinning = round(($bonusAmountWageringPct * $amount)/100, 2);
    }

    # todo original function
    public function updateBalance($gameType, $amount, $gameId, $transType,
        $amountType, $roundId, $gameName, $spinType, $baseRoundId,
        $roundEndState, $channel='desktop', $context=Array())
    {
        # todo modify this function's body
        global $db;

        
        if($transType == WINNING and $amount < 0 &&
        !in_array($this->opCode, $this->operatorsConfig['zero_win_operators'])) {
         return;
        }

        # todo if trans_type is credit and amoun < 0 only need to handle
        # Sedning credit even for 0 win amount also. Needed for Dench.
        # todo TODO have the condition for network code
        #if($transType == WINNING and $amount <= 0)  {
        if($transType == WINNING and $amount < 0 and $amountType != 3)  {
            return;
        }

        if($transType == WINNING and $amount < 0 and $amountType == 3 and
           !in_array($this->opCode, $this->operatorsConfig['zero_pfs_win_operators'])) {
            return;
        }
        
        if($transType == WAGERING and $amount <= 0)  {
            ErrorHandler::handleError(1,"Zero as debit amount(PLYR_001)");
        }

        if($spinType != 'normal' && $amount < 0 and
        !in_array($this->opCode, $this->operatorsConfig['zero_fs_win_operators'])) {
            return;
        }

        if(defined('ENGINE_MODE_SIMULATION') && ENGINE_MODE_SIMULATION) { // simcode
			global $total_bet_simulation, $total_win_simulation, $win_amounts_sim,
					$round_win_amount, $round_bet_amount; // simcode

			if($transType == WAGERING) {
				$round_bet_amount = $amount;
				$total_bet_simulation += $amount; // simcode
			}

			if($transType == WINNING) {
				$round_win_amount = $amount;
				$total_win_simulation += $amount; // simcode
			}
			return;
        }
        
        # todo set players amount_type during the game play properly
        # todo need to debit/credit as money type
        # todo TODO be sure about $this->cash or $this->cash2 or $this->balance in if condition
        $amount = to_base_currency($amount);
	$amount = round_half($amount);
    
        // TODO amount type 3, remove hardcoded number. $amount and $this->balance are not compared for amount_type=3
        $lowBalanceOpers = array('TNT');
        if(!in_array($this->opCode, $lowBalanceOpers) && ($transType == WAGERING and $amount > $this->balance and
           !in_array($this->opCode, Array('RNG')) and $amountType != 3)) {
            ErrorHandler::handleError(1, "INSUF_BALL_001", "Insufficient Balance");
	}
	// fun_mode
        if($this->amountType == AMOUNT_TYPE_FUN) {

            if($transType == WAGERING) {
                $this->balance -= $amount;
            }

            if($transType == WINNING) {
                $this->balance += $amount;
            }

            $_SESSION['balance' . $this->gameId] = $this->balance;

            return;
        }

        
        #todo TODO need to have dynamic gameCatId 'slots' and channel_id
        $channels = Array('desktop' => 1, 'mobile' => 2);
        $operatorId = $_SESSION['operator_id'];
        $siteId     = $_SESSION['site_id'];
        $sessionId = $_REQUEST['session_id'];
        $channelId = $channels[$channel];

        if($transType == WAGERING) {
            
            #todo TODO need to have dynamic gameCatId 'slots' and channel_id
            $note = 'debit';
            if(empty($context)) {
                $context = Array('supermeter' => 0, 'cash' => $amount);
            }
            $promo_freespins = 0;
            $record_id       = '';

            if($amountType == AMOUNT_TYPE_PFS) {
                $promo_freespins = 1;
                $record_id       = $this->promoDetails['curr_spin']['bfs_record_id'];
            }
            
            $this->setSplitWagering($amount);
            
            $this->handleWagering($gameId, $roundId, $gameType, $channelId,
                $transType, $amountType, $amount, $siteId, $operatorId,
                $sessionId, $note, $gameName, $spinType, $baseRoundId, $roundEndState,
                $promo_freespins, $record_id,$context);
        }
        else if($transType == WINNING) {
            #todo TODO need to have dynamic gameCatId 'slots' and channel_id
	    $note = 'credit';
	    $promo_freespins = 0;
            $record_id       = '';

            if($amountType == AMOUNT_TYPE_PFS) {
                $promo_freespins = 1;
                $record_id       = $this->promoDetails['curr_spin']['bfs_record_id'];
            }

            if($context && isset($context['super_meter_collect']) && $context['super_meter_collect'] == 1) {
                $transType = 6; # for collect super meter # todo TODO need to define it
            }

            $this->setSplitWinning($amount);
            $this->handleWinning($gameId, $roundId, $gameType, $channelId,
                $transType, $amountType, $amount, $siteId, $operatorId,
		$sessionId, $note, $gameName, $spinType, $baseRoundId, $roundEndState,
	    	$promo_freespins, $record_id, $context);
        }
    }
    public function preCloseRound($gameType, $amount, $gameId, $transType,
        $amountType, $roundId, $gameName, $spinType, $baseRoundId,
        $roundEndState, $channel='desktop', $context=Array())
    {
        if($transType == WINNING and $amount < 0 and $amountType != 3)  {
            return;
        }

        if($transType == WINNING and $amount <= 0 and $amountType == 3 and
           !in_array($this->opCode, $this->operatorsConfig['zero_pfs_win_operators'])) {
            return;
        }

        if($spinType != 'normal' && $amount <= 0 and
            !in_array($this->opCode, $this->operatorsConfig['zero_fs_win_operators'])) {
            return;
        }

        $amount = to_base_currency($amount);
	    $amount = round_half($amount);

        $channels = Array('desktop' => 1, 'mobile' => 2);
        $operatorId = $_SESSION['operator_id'];
        $siteId     = $_SESSION['site_id'];
        $sessionId = $_REQUEST['session_id'];
        $channelId = $channels[$channel];

	    $note = 'credit';
	    $promo_freespins = 0;
        $record_id = '';

        if($amountType == AMOUNT_TYPE_PFS) {
            $promo_freespins = 1;
            $record_id       = $this->promoDetails['curr_spin']['bfs_record_id'];
        }

        if($context && isset($context['super_meter_collect']) && $context['super_meter_collect'] == 1) {
            $transType = 6; # for collect super meter # todo TODO need to define it
        }

        $this->setSplitWinning($amount);
        $this->handleWinning($gameId, $roundId, $gameType, $channelId,
            $transType, $amountType, $amount, $siteId, $operatorId,
	        $sessionId, $note, $gameName, $spinType, $baseRoundId, $roundEndState,
    	    $promo_freespins, $record_id, $context);
    }

    private function handleWagering($gameId, $roundId, $gameCatId, $channelId,
        $transType, $amountType, $amount, $siteId, $operatorId, $sessionId, $note,
        $gameName, $spinType, $baseRoundId, $roundEndState,$promo_freespins, $record_id, $context) {
            
            $res = Transaction::debitAmount($gameId, $roundId, $this->accountId,
            $gameCatId, $channelId, $transType, $amountType, $amount, $siteId,
            $operatorId, $sessionId, $this->currency, $this->cashWagering,
            $this->bonusAmountWagering, $gameName, $spinType, $baseRoundId,
            $roundEndState, $note,$promo_freespins, $record_id, $context);
            if(isset($res['error']) && $res['error'] == 1) {
            if(isset($res['error_detail']['code']) || isset($res['error_detail']['message'])) {
                ErrorHandler::handleError(1, $res['error_detail']['code'],
                    $res['error_detail']['message'], array('error_source' => $this->errorSource));
            } else {
                ErrorHandler::handleError(1, $res['error_code'],
                $res['error_message'], array('error_source' => $this->errorSource));
            }
        }
        
       
        $this->setBalance($res['cash'], $res['bonus_amount'], $res['cash2']);
        $this->setPromoBalance($res);
        
        $this->updateStoredBalance($res['cash'], $res['bonus_amount'], $res['cash2']);
        $this->updateStoredPFS($res);
        $this->extraInfo['debit'] = isset( $res['extra_info'] ) ? $res['extra_info'] : '';
        $this->updateBonusAmount($amount, $res['bonus_bet'], $res['transaction_id']);

        return $res;
    }

    private function handleWinning($gameId, $roundId, $gameCatId, $channelId,
        $transType, $amountType, $amount, $siteId, $operatorId, $sessionId, $note,
        $gameName, $spinType, $baseRoundId, $roundEndState, $promo_freespins, $record_id, $context) {
        if(empty($context)) {
                $context = Array("collect" => 0);
            }
        $res = Transaction::creditAmount($gameId, $roundId, $this->accountId,
            $gameCatId, $channelId, $transType, $amountType, $amount, $siteId,
            $operatorId, $sessionId, $this->currency, $this->cashWinning,
            $this->bonusAmountWinning, $gameName, $spinType, $baseRoundId,
            $roundEndState, $note, $promo_freespins, $record_id, $context);

        if(isset($res['error']) && $res['error'] == 1) {
            if(isset($res['error_detail']['code']) || isset($res['error_detail']['message'])) {
                ErrorHandler::handleError(1, $res['error_detail']['code'],
                    $res['error_detail']['message'], array('error_source' => $this->errorSource));
            }
            else {
                ErrorHandler::handleError(1, $res['error_code'],
                    $res['error_message'], array('error_source' => $this->errorSource));
            }
        }

        if($res['cash'] == null) {
            $res['cash'] = $_SESSION['player_balance']['cash'];
        }
        if($res['bonus_amount'] == null) {
            $res['bonus_amount'] = $_SESSION['player_balance']['bonus_amount'];
        }
        if($res['cash2'] == null) {
            $res['cash2'] = $_SESSION['player_balance']['cash2'];
        }

        $this->setBalance($res['cash'], $res['bonus_amount'], $res['cash2']);
        $this->setPromoBalance($res);
        $this->updateStoredBalance($res['cash'], $res['bonus_amount'], $res['cash2']);
        $this->updateStoredPFS($res);
        $this->updateBonusAmount($amount, $res['bonus_win'], $res['transaction_id']);

        return $res;
    }

    public function updateBonusAmount($amount, $bonusAmount, $transId)
    {
        global $db;

        $bonusAmountOperators = Array('BCM');
        if(!in_array($this->opCode, $bonusAmountOperators)) {
            return;
        }

        if($bonusAmount > $amount) {
            ErrorHandler::handleError(1, "INVALID_BONUS_AMOUNT1", "Invalid Bonus Amount");
        }

        $cashAmount = $amount - $bonusAmount;

        $transactions_table  = self::TRXN_LOG;
        $query =<<<QRY
         UPDATE {$transactions_table}
            SET cash_amount = {$cashAmount},
                bonus_amount = {$bonusAmount},
                processed = 1
          WHERE trans_id = {$transId}
QRY;
        $db->runQuery($query) or ErrorHandler::handleError(1,
            "INVALID_BONUS_AMOUNT1", "Invalid Bonus Amount");
    }

    private function handleGetBalance() {
        $context = null;
        $channels = Array('desktop' => 1, 'mobile' => 2);
        $channel = $this->channel;
        $channelId = $channels[$channel];

        $res = Transaction::getBalance($this->accountId, $this->amountType, $context, $_REQUEST['session_id'],
		                               $this->gameId, $channelId);

        if(isset($res['error']) && $res['error'] == 1) {
            if(isset($res['error_detail']['code']) || isset($res['error_detail']['message'])) {
                ErrorHandler::handleError(1, $res['error_detail']['code'], $res['error_detail']['message'], $this->errorSource);
            } else {
                ErrorHandler::handleError(1, $res['error_code'], $res['error_message'], $this->errorSource);
            }
        }

        return $res;
    }

    private static function getTransId($category='trans_id') {
        $roundIdObj = new RoundId($category);
        $round_id = $roundIdObj->nextRoundId();
        unset($roundIdObj);

        return $round_id;
    }

    public function endGameRound($roundEndState, $roundId) {
        if($roundEndState == 0) {
            return;
        }

        $res = Transaction::endGameRound($roundId, $_REQUEST['session_id']);

        if(isset($res['error']) && $res['error'] == 0) {
            $this->currency = $res['currency'];
            $this->setBalance($res['cash'], $res['bonus_amount'], $res['cash2']);
        }

        return $res;
    }
    
    public function ResetDemoBalance($round)
    {
        if ($round->amountType == AMOUNT_TYPE_FUN) {
            $_SESSION['balance' . $this->gameId] = FUN_INIT_BAL;
            $this->balance = round($_SESSION['balance' . $this->gameId], 2);
        }
    }
}
?>
