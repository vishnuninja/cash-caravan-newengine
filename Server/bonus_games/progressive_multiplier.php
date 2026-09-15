<?php
# todo need to cap 25 cap
# todo during FS, we should not reset mult till last free sins
# todo if there are scatter wins in any of the spins, do we need to increase the pg_mult ??

class SpinMultiplier implements iBonus {
    protected $game, $round, $accountId, $symbol, $bonusGameId, $scattersCount,
              $minMult;

    public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount) {
        $scattersCount['total'] = isset($scattersCount[$symbol]) ? $scattersCount[$symbol]:0;
        $this->game = $game;
        $this->round = $round;
        $this->accountId = $accountId;
        $this->scattersCount = $scattersCount;
        $this->symbol = $symbol;
        $this->bonusGameId = $bonusGameId;
        $this->maxMultplier = 25;
    }

	public function checkAndGrantBonusGame() {
        $spin_type  = $this->round->spinType;
        $this->minMult = $this->game->bonusConfig['post_win_handlers']
            [$spin_type][0]['details']['default_mult'];

        if(isset($this->round->paylineWins['details']) &&
           $this->round->paylineWins['details'] !='' ) {
            $this->applySpinMult();
		} else {
            $this->increaseWinMult();
        }

        if(isset($this->round->freeSpins) && $this->round->freeSpins['spins_left'] <= 1) {
            $details_json = json_encode(array('spin_mult' => Array($this->round->coinValue => 1)));
            $this->updateMultiplier($details_json);
		}
	}

	public function getStoredMult() {
		global $db;
		$account_id = $this->accountId;
		$game_id    = $this->game->gameId;
		$spin_type  = $this->round->spinType;
		$amount_type  = $this->round->amountType;

		$query =<<<QR
		SELECT id, details from gamelog.other_prizes
		WHERE game_id={$game_id} AND spin_type='{$spin_type}' AND account_id={$account_id} AND
		      amount_type = {$amount_type}
QR;
		$result 	= $db->runQuery($query) or ErrorHandler::handleError(1, "SPINMULT_ERR1");
		$row_count 	= $db->numRows($result);
		$row 		= array();

		if($row_count > 0) {
			$row    = $db->fetchAssoc($result) or ErrorHandler::handleError(1, "SPINMULT_ERR2");
		}

		return array($row_count, $row);
	}

	// spin_type, game_id, account_id
	public function increaseWinMult() {
		global $db;
		$account_id = $this->accountId;
		$game_id    = $this->game->gameId;
		$spin_type  = $this->round->spinType;
        $amount_type= $this->round->amountType;
		$details    = '';
		$min_mult   = $this->minMult;

		$query =<<<QR
		SELECT id, details from gamelog.other_prizes
		WHERE game_id={$game_id} AND spin_type='{$spin_type}' AND account_id={$account_id} AND
              amount_type = {$amount_type}
QR;
		$result = $db->runQuery($query) or ErrorHandler::handleError(1, "SPINMULT_ERR1");
		$row_count = $db->numRows($result);
        $pgMultiplier = $min_mult;

		if($row_count == 0) {
            $pgMultiplier = $min_mult + 1;
			$details = array('spin_mult' => Array((int)$this->round->coinValue => $min_mult + 1));
			$details_json = json_encode($details);
            $amount_type = $this->round->amountType;
			$ins_qr =<<<QR
			INSERT INTO gamelog.other_prizes (game_id, account_id, spin_type, details, amount_type)
			VALUES({$game_id}, {$account_id}, '{$spin_type}', '{$details_json}', {$amount_type})
QR;
			$db->runQuery($ins_qr);
		}
		else {
			$row    	= $db->fetchAssoc($result) or ErrorHandler::handleError(1, "SPINMULT_ERR2");
			$mul_detail_arr = json_decode($row['details'], true);

            if (!in_array($this->round->coinValue, array_keys($mul_detail_arr['spin_mult']))) {
                $mul_detail_arr['spin_mult'][$this->round->coinValue] = $min_mult;
            }

            if($mul_detail_arr['spin_mult'][$this->round->coinValue] >= $this->maxMultplier) {
                $this->setBonusGamesWon($mul_detail_arr['spin_mult'][$this->round->coinValue]);
                return;
            }

			$mul_detail_arr['spin_mult'][$this->round->coinValue]++;
            $pgMultiplier = $mul_detail_arr['spin_mult'][$this->round->coinValue];
			$details_json 	= json_encode($mul_detail_arr);

             $symbols_count = array_count_values($this->round->matrixFlatten);
             if(in_array($this->game->scatters[0], $this->round->matrixFlatten) &&
                $symbols_count[$this->game->scatters[0]] >= 3) {
                 $this->setBonusGamesWon($pgMultiplier);
                 return;
             }
			$this->updateMultiplier($details_json);
		}
        $this->setBonusGamesWon($pgMultiplier);
	}

        public function applySpinMult() {
            $details = explode(";", $this->round->paylineWins['details']);
            list($row_count, $row)  = $this->getStoredMult();
            $total_win		    = 0;
            $prev_line_win          = 0;
            $payline_wins	    = array();

            if($row_count > 0) {
                $mul_detail_arr = json_decode($row['details'], true);

                if(!in_array($this->round->coinValue, array_keys($mul_detail_arr['spin_mult']))) {
                    $mul_detail_arr['spin_mult'][$this->round->coinValue] = $this->minMult;
                }

                $spin_mult = $mul_detail_arr['spin_mult'][$this->round->coinValue];

                if($mul_detail_arr['spin_mult'][$this->round->coinValue] > $this->maxMultplier) { # changed here
                    $spin_mult = $this->maxMultplier;
                }

                $this->setBonusGamesWon($spin_mult);
                for ($i=0; $i < count($details) ; $i++) {
                    $temp           = explode(":", $details[$i]);
                    $prev_line_win  += $temp[1];
                    $temp[1]        = $temp[1] * $spin_mult;
                    $temp_str       = implode(':', $temp);
                    $total_win      += $temp[1];

                    array_push($payline_wins, $temp_str);
                }

                $payline_wins_str = implode(';', $payline_wins);
                $this->round->paylineWins['details'] = $payline_wins_str;
                //TODO Check if scree win is also included in old total win.
                //Subtract old line win and add new line win
                $this->round->winAmount = $this->round->winAmount - $prev_line_win + $total_win;
                //$this->round->winAmount = $total_win;
                if($this->round->spinType == 'normal') {
                    $this->resetWinMult($mul_detail_arr);
                }
            }
        }

    private function setBonusGamesWon($pgMultiplier)
    {
        #array_push($this->round->bonusGamesWon, Array("progressive_multiplier" => $pgMultiplier));
        array_push($this->round->bonusGamesWon, Array(
            "type" => "progressive_multiplier",
            "multiplier" => $pgMultiplier));
    }

	public function resetWinMult($mult_detail_arr) {
		$mult_detail_arr['spin_mult'][$this->round->coinValue] 	= 1; # Chnaged here
		$details_json    		= json_encode($mult_detail_arr);
		$this->updateMultiplier($details_json);
	}

	public function updateMultiplier($details_json) {
		global $db;

		$account_id = $this->accountId;
		$game_id    = $this->game->gameId;
		$spin_type  = $this->round->spinType;
        $amount_type= $this->round->amountType;

		$up_qr =<<<QR
		UPDATE gamelog.other_prizes SET details='{$details_json}'
		WHERE game_id={$game_id} AND spin_type='{$spin_type}' AND account_id={$account_id} AND
              amount_type = {$amount_type}
QR;

		$db->runQuery($up_qr);
	}

	public function playBonusGame($pickedPosition) {

	}

	public function loadBonusGame() {
        global $db;

        $amount_type = $this->round->amountType;
        $query =<<<QR
        SELECT id,
               spin_type,
               details
          FROM gamelog.other_prizes
         WHERE game_id={$this->game->gameId} AND
               account_id={$this->accountId} AND
               amount_type = {$amount_type}
QR;
        $result = $db->runQuery($query) or ErrorHandler::handleError(1, "SPINMULT_ERR1");
        $row_count 	= $db->numRows($result);

		if($row_count <= 0) {
			return;
		}

        $bonusGamesData = Array();

        $spin_type = 'normal';
        if($this->round->previousRound['spin_type'] == 2) {
            $spin_type = 'freespin';
        }

        while($row = $db->fetchAssoc($result)) {

            $details = json_decode($row['details'], true);
            if($row['spin_type'] != $spin_type) {
                continue;
            }

            if(!isset($details['spin_mult'][$this->round->previousRound['coin_value']])) {
                return;
            }

            array_push(
                $this->round->prevBonusGames, Array(
                    'type' => 'progressive_multiplier',
                    'multiplier' => $details['spin_mult'][$this->round->previousRound['coin_value']],
                    'spin_type' => $row['spin_type']));
        }
        #array_push($this->round->prevBonusGames, $bonusGamesData);
	}
}
?>
