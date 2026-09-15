<?php

class PostwinOneJackpot {
    protected $game;
    protected $round;
    protected $accountId;
    protected $symbol;
    protected $bonusGameId;
    protected $scattersCount;
    protected $jackpotDetails;

    public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount) {
        $scattersCount['total'] = isset($scattersCount[$symbol]) ?  $scattersCount[$symbol] : null;
        $this->game = $game;
        $this->round = $round;
        $this->accountId = $accountId;
        $this->scattersCount = $scattersCount;
        $this->symbol = $symbol;
        $this->bonusGameId = $bonusGameId;
        $this->jackpotDetails = array();
    }

    public function checkAndGrantBonusGame() {
        $details = $this->round->featureData['details'];
        if ($this->round->freeSpins) {
            $elements = $details['elements'];
            $fs_details = $this->round->freeSpins['details'];
            $prizes = $fs_details['prizes'];
            $jackpotPool = $fs_details['jackpot_pool'];
            $matrix = $this->round->matrix;
            $jackpotReward = $fs_details['jackpot_reward'];
	    $total_jackpot_win = 0;
            $symbolCount = Array(
                "a" => 0,
                "b" => 0,
                "c" => 0,
                "d" => 0,
                "e" => 0
            );
            for($i = 0; $i < $this->game->numColumns; $i++) {
                for($j = 0; $j < $this->game->numRows; $j++) {
                    if (in_array($matrix[$j][$i], $elements)) {
                        $symbolCount[$matrix[$j][$i]] += 1;
                        $prizeValue = $this->checkPrize($jackpotPool, $matrix[$j][$i]);
                        $jackpotPool[$prizeValue]['starting_count'] += 1;
                    }
                }
            }

            $jackpotDetailsArray = array(
                'symbol_count'          => $symbolCount,
                'jackpot_pool'          => $jackpotPool,
            );

            $numScatters = get_element_count($this->round->matrixFlatten, $this->game->scatters[0]);
            if($this->round->freeSpins['spins_left'] == 1 && $numScatters < 3) {
                foreach ($prizes as $prize) {
                    if (!empty($jackpotPool[$prize]) and $jackpotPool[$prize]['starting_count'] > 0) {
                        $win = $jackpotPool[$prize]['base'] * $jackpotPool[$prize]['starting_count'];
                        $total_jackpot_win += $win;
                        // For Client Communication
                        $prizesArray = Array(
                            'prize'             => $prize,
                            'symbol'            => $jackpotPool[$prize]['element'],
                            'base'              => $jackpotPool[$prize]['base'],
                            'starting_count'    => $jackpotPool[$prize]['starting_count'],
                            'jackpot_winamount' => $win
                        );
                        array_push($jackpotReward, $prizesArray);
                    }
                }
                $this->round->winAmount += $total_jackpot_win;
                $jackpotDetailsArray['jackpot_reward'] = $jackpotReward;
		$jackpotDetailsArray['total_jackpot_win'] = $total_jackpot_win;
            }

            $id = $this->round->freeSpins['id'];
            $fs_details['jackpot_pool'] = $jackpotPool;
            $fs_details['jackpot_reward'] = $jackpotReward;
	    $fs_details['feature_details'] = $jackpotPool;
            $this->updateDetails($id, $fs_details);

            array_push($this->jackpotDetails, $jackpotDetailsArray);

            // For client communication.
            $this->round->miscPrizes = $this->jackpotDetails;
        }

        $maxWinCapping = $details['max_win_capping'];
        $winCapping = $maxWinCapping * $this->round->totalBet;
        if ($this->round->winAmount > $winCapping) {
            $this->round->winAmount = $winCapping;
        }
    }

    private function checkPrize($jackpotPool, $element) {
        $prizeValue = "";
        foreach ($jackpotPool as $prize => $value) {
            if ($value['element'] === $element) {
                $prizeValue = $prize;       
            }
        }        
        return $prizeValue;
    }

    private function updateDetails($row_id, $fs_details) {
    
        global $db;

        $fs_details = encode_objects($fs_details);

        $tableName = 'gamelog.freespins';

        $fsc_query = <<<QRY
        UPDATE {$tableName} 
            SET details ='{$fs_details}'
        WHERE id = {$row_id}
        QRY;
        $result = $db->runQuery($fsc_query) or ErrorHandler::handleError(1, "MIYABI_002");
        $this->round->loadFreeSpins();
    }

}
?>
