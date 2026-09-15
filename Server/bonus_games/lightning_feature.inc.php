
<?php
/**
 * @class ConsecutiveWinsHandler
 * @desc This class is used for the game Queen Of Legends.
 *       Gets called for the Consecutive Wins Handler
 */

class LightningFeature {
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

    /**
     * @func checkAndGrantBonusGame
     */
    public function checkAndGrantBonusGame() {
        $details = $this->round->featureData['details'];
        $this->checkLightningFeature($details);    
    }

    private function checkLightningFeature($details) {
        
        $numScatters = get_element_count($this->round->matrixFlatten, $details["scatter_symbol"]);
        $spinType = $this->round->spinType;
        // $matrix_array = array();
        $princess_symbol = $details['scatter_symbol'];
        $matrix = $this->round->matrix;
        $respinState = false;
        $is_bonus = false;
        $min_scateer = $details["min_scatter"];
        $config = $this->getBonusConfig($numScatters, $min_scateer);

        if($spinType=='normal'){
            if ($config and empty($this->round->bonusGamesWon)) {
                $is_bonus = true;
                
            }
            else{
                return;
            }

            if($is_bonus){
                $respinState = true;
                
            }
            
        }
        
        elseif ($spinType == 'respin' && $this->round->freeSpins['details']['fs_game_id'] == 2  ) {
            
            // re'spin
            $fs_array = array();
            $fs_details = $this->round->freeSpins['details'];
            $parent_type = $fs_details['parent_type'];
            $princess_symbol = $fs_details['princess_symbol'];
            $symbolConfig = $this->game->symbolConfig['symbol_set'][$parent_type];
            $matrix1 = $fs_details["matrix"];
            $matrix2 =  $this->round->matrix;
            $values = $symbolConfig['values'];
            $win_positions = $fs_details['win_positions'];
            $values_fs = $details["fakespin_set"]['values'];
            $ind = 0;
            $respinWin = 0;


            $featureConfig = $this->game->symbolConfig["symbol_set"]['normal_s'];
            for($i = 0; $i < $this->game->numRows; $i++) {
                for($j = 0; $j < $this->game->numColumns; $j++) {
                    if ($princess_symbol != $matrix1[$i][$j]) {
                        $random = rand(0,count($values)-1);
                        if($values[$random] && $values[$random] == $princess_symbol){
                            $respinWin  = 1;
                            $matrix2[$i][$j] = $values[$random];
                        }
                    } 
                    else{
                        $matrix2[$i][$j] = $princess_symbol;
                    }
                    $ind++;
                }
            }
            if($respinWin  == 1){
                $respinState = true;
                $random = rand(0,count($values_fs)-1);
                $fakespins_data = Array(
                    "fakespins_count"   => $random
                );
            }
            else{
                $fakespins_data = Array(
                    "fakespins_count"   => 2
                );
            }
            array_push($fs_array,$fakespins_data);
            $this->round->matrix = $matrix2;
            $this->round->matrixString = array2d_to_string($this->round->matrix);
            $this->round->matrixFlatten = $this->round->generateFlatMatrix($this->round->matrix);
            $fs_details['matrix'] = $this->round->matrix;
            $fs_details['win_positions'] = $win_positions;
            $fs_details['num_spins'] = $details["num_spins"];
            $fs_details['multiplier'] = $details["multiplier"];
            $matrix = $matrix2;
            $details = $fs_details;
            $this->round->miscPrizes = $fs_array;
        }
        if ($respinState) {
            $this->respinInfo($details, $princess_symbol, $matrix );
            
            }
    }

    private function respinInfo($details, $princess_symbol, $sticky_reel ) {
        $win_positions = $this->getWinPositions( $sticky_reel, $princess_symbol );
        $respin_info = Array(
            'spin_type'         => 'respin',
            'num_spins'         => $details['num_spins'],
            'princess_symbol'   => $princess_symbol,
            'multiplier'        => $details['multiplier'],
            'parent_type'       => "normal",
	        'matrix'            => $this->round->matrix,
	        'scatter_win'            => $this->round->screenWins,
            'win_positions'     => $win_positions,
	        'matrix_array'      => "",
	        'total_win'      => 0,
            'fs_game_id' =>2
        );
        array_push($this->round->postFreeSpinInfo, $respin_info);
        $this->setBonusWonMessages($respin_info);
        $this->nextRound($respin_info);
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
            "parent_type"       => "normal",
            "sticky_positions"  => $details['win_positions'],
            "feature_name"  => "lightning_feature",
        );
        array_push($this->round->bonusGamesWon, $bonusGameWon);
    }

    private function nextRound($details) {
        $this->round->nextRound = Array(
            'type'              => "respins",
            'num_spins'         => $details['num_spins'],
            'spins_left'        => $details['num_spins'],
            'win_amount'        => 0,
            'parent_type'       => "normal",
            "sticky_positions"  => $details['win_positions']
        );
    }

    private function getWinPositions( $reels, $princess_symbol ) {
        $win_positions = Array();
        $ind = 0;
        for($i = 0; $i < $this->game->numRows; $i++) {
            for($j = 0; $j < $this->game->numColumns; $j++) {
                if ($this->round->matrix[$i][$j] == $princess_symbol) {
                    array_push($win_positions, $ind);
                    
                }
                $ind++;
            }
        }
        return $win_positions;
    }
    
        private function getBonusConfig($numScatters, $min_scateer) {
            if($numScatters >= $min_scateer){
                return true;
            }
            else{
                return null;
            }
        }

    // private function checkConsecutiveWins($details) {
    //     // Need to add in casino.php
    //     $this->loadOtherPrizes();

    //     $win_amount = $this->round->winAmount;
    //     $min_count = $details['min_count'];
    //     $parent_round_id = 0;

    //     $other_prize_details = Array();

    //     if (empty($this->otherPrizeRound)) {
    //         if ($win_amount > 0) {
    //             $other_prize_details = Array(
    //                 $this->round->coinValue => 1
    //             );
    //             // which season     
    //             $season = $other_prize_details[$this->round->coinValue];
                                
    //             $this->grant_other_prizes($this->game->gameId, $this->accountId,
    //             $parent_round_id, $this->round->spinType, $other_prize_details);
    //         }
    //     } else {
    //         $other_prize_details = $this->otherPrizeRound['details'];
    //         if ($win_amount > 0) {
    //             if (in_array($this->round->coinValue, array_keys($other_prize_details))) {
    //                 $other_prize_details[$this->round->coinValue] += 1;
    //             } else {
    //                 $other_prize_details[$this->round->coinValue] = 1;
    //             }
    //         } else {
    //             $other_prize_details[$this->round->coinValue] = 0;
    //         }
    //         // which season
    //         $season = $other_prize_details[$this->round->coinValue];
            
    //         // check consecutive wins
    //         foreach ($other_prize_details as $key => $value) {
    //             if ($other_prize_details[$key] == $min_count) {
    //                 $this->checkRespins($details);
    //                 $other_prize_details[$key] = 0;
    //             }
    //         }
    //         $this->updateOtherPrizes($this->otherPrizeRound['id'], $this->game->gameId,
    //             $this->accountId, $parent_round_id, $this->round->spinType, $other_prize_details);
    //     }
    //     // client data
    //     $seasons_data = Array(
    //         #"season"   => $season
    //         "season"   => $other_prize_details
    //     );
    //     array_push($this->round->miscPrizes, $seasons_data);
    // }   

    // private function checkRespins($details) {
    //     $princess_symbol = $details['princess_symbol'];
    //     $blank_symbol = $details['blank_symbol'];
    //     $sticky_reel = $details['sticky_reel'];
    //     if (empty($this->round->bonusGamesWon)) {
    //         $this->respinInfo($details, $princess_symbol, $sticky_reel);
    //     }
    // }


}

?>

