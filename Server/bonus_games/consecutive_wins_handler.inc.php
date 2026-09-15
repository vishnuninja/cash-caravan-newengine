<?php
/**
 * @class ConsecutiveWinsHandler
 * @desc This class is used for the game Queen Of Legends.
 *       Gets called for the Consecutive Wins Handler
 */

class ConsecutiveWinsHandler {
    protected $game;
    protected $round;
    protected $accountId;
    protected $symbol;
    protected $bonusGameId;
    protected $scattersCount;
    protected $otherPrizeRound;

    public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount)
    {
        $scattersCount['total'] = isset($scattersCount[$symbol]) ?  $scattersCount[$symbol] : null;
        $this->game = $game;
        $this->round = &$round;
        $this->accountId = $accountId;
        $this->symbol = $symbol;
        $this->bonusGameId = $bonusGameId;
        $this->scattersCount = $scattersCount;
        $this->otherPrizeRound = Array();
    }

    public function loadBonusGame() {
        $this->loadOtherPrizes();
        if(!$this->otherPrizeRound or empty($this->otherPrizeRound))
            return;

        $coinValue = $this->round->previousRound['coin_value'];
        if(isset($this->otherPrizeRound['details']) &&
           isset($this->otherPrizeRound['details'][$coinValue]))
           {
               $seasons_data = Array(
                   #"season"   => $this->otherPrizeRound['details'][$coinValue]
                   "season"   => $this->otherPrizeRound['details']
               );
               array_push($this->round->miscPrizes, $seasons_data);
           }
    }

    /**
     * @func checkAndGrantBonusGame
     */
    public function checkAndGrantBonusGame() {
        $details = $this->round->featureData['details'];
        if ($this->round->spinType == 'normal') {
            $this->checkConsecutiveWins($details);
        }
        $this->checkMiyabiFeature($details);    
    }

    private function checkMiyabiFeature($details) {
        $spinType = $this->round->spinType;
        $princess_symbol = $details['princess_symbol'];
        $sticky_reel = $details['sticky_reel'];
        $matrix = $this->round->matrix;
        $respinState = false;
        if ($spinType == 'normal') {
            $last = $details['last'];
            $last_col = array_column($matrix, $last);
            if (count(array_unique($last_col)) == 1 and end($last_col) === $princess_symbol
             and empty($this->round->bonusGamesWon)) {
                $respinState = true;
            }
        } elseif ($spinType == 'freespin') {
            $first = $details['first'];
            $last = $details['last'];
            $first_col = array_column($matrix, $first);
            $last_col = array_column($matrix, $last);
            $qsFirstCnt = get_element_count($first_col, $princess_symbol);
            $qsLastCnt = get_element_count($last_col, $princess_symbol);
            $exReels = Array();
            if ($qsFirstCnt >= 1 and $qsLastCnt >= 1) {
                array_push($exReels, $first);
                array_push($exReels, $last);
                $this->expandingQueenSymbol($matrix, $exReels);
                $sticky_reel = $exReels;
                $respinState = true;
            }
            else if ($qsFirstCnt >= 1 or $qsLastCnt >= 1) {
                if ($qsFirstCnt >= 1) {
                    array_push($exReels, $first);
                } else {
                    array_push($exReels, $last);
                }
                $this->expandingQueenSymbol($matrix, $exReels);
                $sticky_reel = $exReels;
                $respinState = true;
            }
        }
        if ($respinState) {
            $this->respinInfo($details, $princess_symbol, $sticky_reel);
        }
    }

    private function respinInfo($details, $princess_symbol, $sticky_reel) {
        $blank_symbol = $details['blank_symbol'];
        $win_positions = $this->getWinPositions($blank_symbol, $sticky_reel, $princess_symbol);
        $respin_info = Array(
            'spin_type'         => 'respin',
            'sticky_reel'       => $sticky_reel,
            'num_spins'         => $details['num_respins'],
            'princess_symbol'   => $princess_symbol,
            'blank_symbol'      => $blank_symbol,
            'multiplier'        => $details['multiplier'],
            'parent_type'       => $this->round->spinType,
	    'matrix'            => $this->round->matrix,
            'win_positions'     => $win_positions,
	    'matrix_array'      => Array(array2d_to_string($this->round->matrix))
        );
        array_push($this->round->postFreeSpinInfo, $respin_info);
        $this->setBonusWonMessages($respin_info);
        $this->nextRound($respin_info);
    }

    private function expandingQueenSymbol($matrix, $reels) {
        for($i = 0; $i < $this->game->numRows; $i++) {
            for($j = 0; $j < $this->game->numColumns; $j++) {
                if (in_array($j, $reels)) {
                    $matrix[$i][$j] = "q";
                }
            }
        }

        $this->round->postMatrixInfo['matrix'] = $matrix;
        $this->round->postMatrixInfo['feature_name'] = 'miyabi_feature';
        $this->round->postMatrixInfo['matrixString'] = array2d_to_string($matrix);
        $this->round->postMatrixInfo['matrixFlatten'] = $this->round->generateFlatMatrix($matrix);
    }

    private function checkConsecutiveWins($details) {
        // Need to add in casino.php
        $this->loadOtherPrizes();

        $win_amount = $this->round->winAmount;
        $min_count = $details['min_count'];
        $parent_round_id = 0;

        $other_prize_details = Array();

        if (empty($this->otherPrizeRound)) {
            if ($win_amount > 0) {
                $other_prize_details = Array(
                    $this->round->coinValue => 1
                );
                // which season     
                $season = $other_prize_details[$this->round->coinValue];
                                
                $this->grant_other_prizes($this->game->gameId, $this->accountId,
                $parent_round_id, $this->round->spinType, $other_prize_details);
            }
        } else {
            $other_prize_details = $this->otherPrizeRound['details'];
            if ($win_amount > 0) {
                if (in_array($this->round->coinValue, array_keys($other_prize_details))) {
                    $other_prize_details[$this->round->coinValue] += 1;
                } else {
                    $other_prize_details[$this->round->coinValue] = 1;
                }
            } else {
                $other_prize_details[$this->round->coinValue] = 0;
            }
            // which season
            $season = $other_prize_details[$this->round->coinValue];
            
            // check consecutive wins
            foreach ($other_prize_details as $key => $value) {
                if ($other_prize_details[$key] == $min_count) {
                    $this->checkRespins($details);
                    $other_prize_details[$key] = 0;
                }
            }
            $this->updateOtherPrizes($this->otherPrizeRound['id'], $this->game->gameId,
                $this->accountId, $parent_round_id, $this->round->spinType, $other_prize_details);
        }
        // client data
        $seasons_data = Array(
            #"season"   => $season
            "season"   => $other_prize_details
        );
        array_push($this->round->miscPrizes, $seasons_data);
    }   

    private function checkRespins($details) {
        $princess_symbol = $details['princess_symbol'];
        $blank_symbol = $details['blank_symbol'];
        $sticky_reel = $details['sticky_reel'];
        if (empty($this->round->bonusGamesWon)) {
            $this->respinInfo($details, $princess_symbol, $sticky_reel);
        }
    }

    // Need to add in casino.lib.php
    public function grant_other_prizes($game_id, $account_id, $parent_round_id, $spin_type, $details) {
        global $db;
        $details = encode_objects($details);
        $table_name = 'gamelog.other_prizes';
        $amount_type  = $this->round->amountType;

        $query = <<<QUERY
        INSERT INTO {$table_name}(game_id, account_id, parent_round_id, spin_type, details, amount_type)
        VALUES ($game_id, $account_id, $parent_round_id, '$spin_type', '{$details}', {$amount_type})
QUERY;
        $result = $db->runQuery($query) or ErrorHandler::handleError(1, "STICKY_001");
    }

    // Need to add in round.php
    public function loadOtherPrizes() {
        global $db;
        $gameId = $this->game->gameId;
        $accountId = $this->accountId;
        $amount_type  = $this->round->amountType;
        $tableName = 'gamelog.other_prizes';

        $Query = <<<QUERY
            SELECT id, game_id, account_id, parent_round_id, spin_type, details
            FROM {$tableName}
            WHERE account_id = {$accountId} AND
                  game_id = {$gameId} AND amount_type = {$amount_type}
            ORDER BY id DESC LIMIT 1
QUERY;

        $result = $db->runQuery($Query) or ErrorHandler::handleError(1, "POSTWIN_001");
        if($db->numRows($result) <= 0)
            return;

        $row = $db->fetchAssoc($result) or ErrorHandler::handleError(1, "POSTWIN_002");

        $this->otherPrizeRound['id'] = $row['id'];
        $this->otherPrizeRound['game_id'] = $row['game_id'];
        $this->otherPrizeRound['account_id'] = $row['account_id'];
        $this->otherPrizeRound['parent_round_id'] = $row['parent_round_id'];
        $this->otherPrizeRound['spin_type'] = $row['spin_type'];
        $this->otherPrizeRound['details'] = decode_object($row['details']);
    }

    private function updateOtherPrizes($row_id, $game_id, $account_id,
     $parent_round_id, $spinType, $details) {
        global $db;
        $details = encode_objects($details);
        $amount_type  = $this->round->amountType;
        $query =<<<QUERY
            UPDATE gamelog.other_prizes
            SET details = '{$details}'
            WHERE id = {$row_id} AND
            game_id = {$game_id}
            AND account_id = {$account_id} AND amount_type = {$amount_type}
QUERY;

        $result = $db->runQuery($query) or ErrorHandler::handleError(1, "MIYABI_001");
    }

    private function respinData() {
        $featureConfig = $this->game->bonusConfig;
        $postMatrixFeatures = $featureConfig['post_win_handlers'][$this->round->spinType];
        foreach($postMatrixFeatures as $index => $feature) {
            $featureName = $feature['feature'];
            $details = $feature['details'];
        }
        return $details;
    }

    protected function setBonusWonMessages($details) {
        $bonusGameWon = Array(
            'type'              => 'respins',
            'num_spins'         => $details['num_spins'],
            'spins_left'        => $details['num_spins'],
            "win_amount"        => 0,
            "parent_type"       => $details['parent_type'],
            "sticky_positions"  => $details['win_positions']
        );
        array_push($this->round->bonusGamesWon, $bonusGameWon);
    }

    private function nextRound($details) {
        $this->round->nextRound = Array(
            'type'              => "respins",
            'num_spins'         => $details['num_spins'],
            'spins_left'        => $details['num_spins'],
            'win_amount'        => 0,
            'parent_type'       => $details['parent_type'],
            "sticky_positions"  => $details['win_positions']
        );
    }

    private function getWinPositions($blank_symbol, $reels, $princess_symbol) {
        $win_positions = Array();
        $ind = 0;
        for($i = 0; $i < $this->game->numRows; $i++) {
            for($j = 0; $j < $this->game->numColumns; $j++) {
                if (!in_array($j, $reels)) {
                    $this->round->matrix[$i][$j] = $blank_symbol;
                } else {
                    $this->round->matrix[$i][$j] = $princess_symbol;
                    array_push($win_positions, $ind);
                }
                $ind++;
            }
        }
        return $win_positions;
    }
}
?>
