<?php
class Player
{
	const PLAYER_ACCOUNT = 'users.account',
		  PLAYER_DETAILS = 'users.profile';

	var $firstName, $userName, $accountId, $balance,
		$numDeposits, $isFreePlayer, $playerType, $currency, $amountType,
		$operatorId, $siteId,$gameId;

	public function __construct($amountType,$gameId)
	{
		# todo. Handle session if not session is not valid
		$this->accountId = $_SESSION['account_id'];
		$this->amountType = $amountType;
		$this->cashWagering = 0;
		$this->bonusAmountWagering = 0;
		$this->cashWageringPct = 0;
		$this->bonusAmountWageringPct = 0;
		$this->miscData = Array(); # for bonusamount
		// $this->promoDetails = Array(); # for bonusamount
		// $this->balDetails = Array(); # for bonusamount
		$this->opCode = $_SESSION['aggregator_code'];
        $this->extraInfo = array('debit' => '');
        $this->gameId = $gameId;

		$this->loadPlayerDetails();
	}

	function loadPlayerDetails()  {
		global $db;
		$playerAccount = Player::PLAYER_ACCOUNT;
		$playerDetails = Player::PLAYER_DETAILS;

		if(defined('ENGINE_MODE_SIMULATION') && ENGINE_MODE_SIMULATION) {
			global $username_sim;

			$this->firstName    = $username_sim;
			$this->userName     = $username_sim;
			$this->bank         = 2.00;
			$this->cash         = 82533.26;
			$this->bonusAmount	= 1000.00;
			$this->winnings     = 3400.00;
			$this->currency     = "DUMM"; # todo load this from player's table

			if($this->amountType == 1) {
				$this->balance = 82533.26;
			} else {
				ErrorHandler::handleError(1, "PLAYER_ERR3");
			}

			return ;
		}
		if($this->amountType == AMOUNT_TYPE_FUN ) {
			// print_r($_SESSION);
            if( !isset($_SESSION['balance' . $this->gameId]) ) {
                $_SESSION['balance' . $this->gameId] = FUN_INIT_BAL;
            }
			// print_r($_SESSION);
		    $_SESSION['operator_id'] = $this->operatorId;
			$_SESSION['site_id'] = $this->siteId;
			
            $this->balance = round($_SESSION['balance'.$this->gameId], 2);
            $this->userName = $this->accountId;
			$this->currency = 'USD';
            return;
        }

		#$this->resetBalance();

		$query  = "
			SELECT first_name, username, bank, cash, winning, currency,
				   sc.site_id, sc.operator_id, bonus_amount
			  FROM {$playerAccount} ua, {$playerDetails} pas,
			  	   services.sites ss, services.site_configurations sc
			 WHERE ua.id = {$this->accountId} AND
				   ua.id = pas.user_id AND
				   ua.full_site_code = ss.full_site_code AND
				   ss.id = sc.site_id";
		$result = $db->runQuery($query) or ErrorHandler::handleError(1, "PLAYER_ERR1");
		$row    = $db->fetchAssoc($result) or ErrorHandler::handleError(1, "PLAYER_ERR2");

		$this->firstName = $row['first_name'];
		$this->userName = $row['username'];
		$this->bank = $row['bank'];
		$this->cash = $row['cash'];
		$this->cash2 = 10;
		$this->bonusAmount = $row['bonus_amount'];
		$this->winnings = $row['winning'];
		$this->currency = $row['currency'];
		$this->operatorId = $row['operator_id'];
		$this->siteId = $row['site_id'];
		
		$_SESSION['operator_id'] = $this->operatorId;
		$_SESSION['site_id'] = $this->siteId;
		if($this->amountType == 1) {
			$this->balance = $this->cash + $this->bonusAmount;
		}
		else {
			ErrorHandler::handleError(1, "PLAYER_ERR3");
		}
		// $res = array('error'=> 0, 'currency'=> 'INR', 'cash'=> 699.72, 'bonus_amount'=> 0, 'bonus_balance'=> 0, 'promo_freespins'=> 1, 'promo_freespin_all'=> 1, 'is_depositor'=> 0, 'num_deposits'=> 0, 'locale'=> 'EN', 'cash2'=> 0);

        // $this->balDetails = $res;
	}

	private function resetBalance()
	{
		global $db;

		if($_POST['request_type'] == 1) {
			$playerDetails = Player::PLAYER_DETAILS;
			$balanceQuery = <<<QUERY
				UPDATE $playerDetails
				   SET cash = 10000
				 WHERE user_id = $this->accountId
QUERY;

			$result = $db->runQuery($balanceQuery) or
				ErrorHandler::handleError(1, "PLAYER_TRANS_ERR2" . $db->error());
		}
	}

	function setMiscData($misc) {
		$this->miscData = $misc;
	}
	public function preCloseRound($gameType, $amount, $gameId, $transType,
	$amountType, $roundId, $gameName, $spinType, $baseRoundId,
	$roundEndState, $channel='desktop', $context=Array())
{
	
}
	function setSplitWagering($amount)
    {
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
                ErrorHandler::handleError(1, "ERR_PLYR_001", "Error in split amount(PLYR_001)");
            }
        }
        elseif($this->cash == 0 && $this->bonusAmount > 0 && $amount <= $this->bonusAmount) {
            $this->cashWagering = 0;
            $this->bonusAmountWagering = $amount;
            $this->cashWageringPct = 0;
            $this->bonusAmountWageringPct = 100;
        }
        else {
            ErrorHandler::handleError(1, "ERR_PLYR_002", "Error in split amount(PLYR_002)");
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
	public function updateBalance($gameCatId, $amount, $gameId, $transType,
		$amountType, $roundId, $gameName, $spinType, $baseRoundId,
		$roundEndState, $channel='desktop')
	{


		# update_user_balance($user['id'], $machine->game_type, $game->total_bet, $machine->id, CASINO_WAGER, $game->money_type, $game->id);
		# todo modify this function's body
		global $db;
		# todo if trans_type is credit and amoun < 0 only need to handle
		if($transType == WINNING and $amount <= 0) {
						return;
		}
		
		if($transType == WAGERING and $amount <= 0) {
						ErrorHandler::handleError(1,"Zero as debit amount(PLYR_001)");
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
		
		# todo need to debit/credit as money type
		# todo TODO be sure about $this->cash or $this->cash2 or $this->balance in if condition
				$amount = to_base_currency($amount);
		if($transType == WAGERING and $amount > $this->balance) {
						ErrorHandler::handleError(1, "INSUF_BALL_001", "Insufficient Balance");
		}
		
		
		// fun_mode
		if($this->amountType == AMOUNT_TYPE_FUN) {

			if($transType == WAGERING) {
				$note = "debit";
				$this->balance -= $amount;
				$_SESSION['balance' . $this->gameId] -= $amount;
			}

			if($transType == WINNING) {
				$note = "credit";
				$this->balance += $amount;
				$_SESSION['balance' . $this->gameId] += $amount;
			}
			$cashAmount = $amount;
			$bonusAmount = 0.00;
			return;
		} else {

			$note = 'debit';
			# todo added from here to handle player balances update
			if ($transType == WAGERING) {
				// echo $this->cash;
				$this->setSplitWagering($amount);
				if($this->cash - $amount > 0){
                    $update_condition = "cash = cash - {$amount}, bonus_amount = bonus_amount - {$this->bonusAmountWagering}";
                }
                else{
                    $update_condition = "cash = 0, bonus_amount = bonus_amount - {$this->bonusAmountWagering}";
                }
				// $update_condition = "cash = cash - {$amount}, bonus_amount = bonus_amount - {$this->bonusAmountWagering}";
				$note = 'debit';
			}

			if ($transType == WINNING) {
				$update_condition = "cash = cash + {$amount}";
				$note = 'credit';
				$this->setSplitWinning($amount);
			}

			$playerDetails = Player::PLAYER_DETAILS;
			$balanceQuery = <<<QUERY
			UPDATE $playerDetails
			   SET $update_condition
			 WHERE user_id = $this->accountId
QUERY;

			$result = $db->runQuery($balanceQuery) or
				ErrorHandler::handleError(1, "PLAYER_TRANS_ERR2" . $db->error());

			
			# todo TODO
			

			# $this->cashWagering; $this->bonusAmountWagering;
			$cashAmount = $this->cashWagering;
			$bonusAmount = $this->bonusAmountWagering;

			if ($transType == WINNING) {
				$trans_type = $this->fetchDebitTransactionId($gameId, $roundId, $this->accountId);
				$cashAmount = $this->cashWinning;
				$bonusAmount = $this->bonusAmountWinning;
			}

		}

		$transId = Player::getTransId('trans_id');
		$channels = array("desktop" => 1, "mobile" => 2);
		$operatorId = $_SESSION['operator_id'];
		$siteId = $_SESSION['site_id'];
		$channelId = $channels[$channel];
		$sessionId = '';
		# $gameCatId, $amount, $gameId, $transType, $amountType, $roundId)
		// print_r(array($gameId, $roundId, $this->accountId,
		// $gameCatId, $channelId, $transType, $amountType, $amount, $siteId,
		// $operatorId, $sessionId, $this->currency, $note,
		// $cashAmount, $bonusAmount, $transId));
		Player::logTransaction($gameId, $roundId, $this->accountId,
            $gameCatId, $channelId, $transType, $amountType, $amount, $siteId,
            $operatorId, $sessionId, $this->currency, $note,
			$cashAmount, $bonusAmount, $transId, 0, 1);
		$this->loadPlayerDetails();
	}

	private function fetchDebitTransactionId($gameId, $roundId, $accountId){
        global $db;
		// echo $accountId , $roundId, $gameId;
        $query = <<<QUERY
                  select trans_id
                  FROM logs.transactions
                  WHERE account_id = {$accountId} AND round_id={$roundId}
                  AND game_id = '{$gameId}' AND trans_type = 1
QUERY;

        $rows_data = $db->runQuery($query);
        if ($db->numRows($rows_data) > 0) {
            $row_data = $db->fetchAssoc($rows_data);
            if ($row_data) {
                return $row_data['trans_id'];
            }
        }
        return false;
    }
	public static function logTransaction($gameId, $roundId, $accountId, $gameCatId,
		$channelId, $transType, $amountType, $amount, $siteId, $operatorId,
		$sessionId, $currency, $note, $cashAmount, $bonusAmount, $transId,
		$error=0, $processed=1)
	{
		global $db;
		$transactions_table  = 'logs.transactions';

		$qry = <<<QRY
		INSERT INTO {$transactions_table} (trans_id, game_id, round_id, account_id,
					game_category_id, channel_id, trans_type, amount_type,
					amount, site_id, operator_id, session_id, currency, error,
					processed, note, cash_amount, bonus_amount)
			 VALUES($transId, $gameId, $roundId, $accountId, '$gameCatId', $channelId,
					$transType, $amountType, $amount, $siteId, $operatorId,
					'{$sessionId}', '{$currency}', $error, $processed, '{$note}',
					$cashAmount, $bonusAmount)
QRY;

		$db->runQuery($qry)  or ErrorHandler::handleError(1, "TRANS_ERR001",
			"Error: Transaction log");
		}

	private static function getTransId($category='trans_id') {
		$roundIdObj = new RoundId($category);
		$round_id = $roundIdObj->nextRoundId();
		unset($roundIdObj);

		return $round_id;
	}

	public function endPFSGame($gameType, $gameId, $amountType)
	{
    }
	public function ResetDemoBalance($round)
	{
		if($round->amountType == AMOUNT_TYPE_FUN){
			$_SESSION['balance' . $this->gameId] = FUN_INIT_BAL;
			$this->balance = round($_SESSION['balance' . $this->gameId], 2);
		}
	}
}
?>
