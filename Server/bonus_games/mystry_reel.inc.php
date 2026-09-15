<?php

class BaseGameMystryFeature
{

    protected $game;
    protected $round;
    protected $accountId;
    protected $symbol;
    protected $bonusGameId;
    protected $scattersCount;
    protected $respinDetails;
    protected $otherPrizeRound;

    public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount)
    {
        $this->game = $game;
        $this->round = &$round;
        $this->accountId = $accountId;
        $this->symbol = $symbol;
        $this->bonusGameId = $bonusGameId;
        $scattersCount['total'] = isset($scattersCount[$symbol]) ? $scattersCount[$symbol] : null;
        $this->scattersCount = $scattersCount;
        $this->respinDetails = array();
    }

    /**
     * @func checkAndGrantBonusGame
     */
    public function checkAndGrantBonusGame()
    {
        $spinType = $this->round->spinType;
        $details = $this->round->featureData['details'];
        if ($this->round->spinType == 'normal') {
            $numScatters = get_element_count($this->round->matrixFlatten, "s");
            if(!$this->round->baseFeature & $this->game->sub_game_id != 3 & $numScatters <= 5){
                return;
            }
            
            $this->checkbaseGameFeature($details);
        }
        elseif ($spinType == 'respin' && $this->round->freeSpins['details']['random_symbol']) {
            $this->handleRespins();
        }

    }

    private function checkbaseGameFeature($details)
    {
        $respinState = false;
        // $myst = $details['random_symbol']; // ISSUE TO CHECK
        $myst = $details['mystery_symbol']; // ISSUE TO CHECK
        $total_weightage = $details['total_weightage'];
        
        $values = $details['symbols'];
        $weights = $details["weights"];
        $random = rand(1, $total_weightage);
        $myst_symbol = "";

        for ($i = 0; $i < count($weights); $i++) {
            if ($random <= $weights[$i]) {
                $myst_symbol = $values[$i];
                break;
            }

        }

        for ($i = 0; $i < $this->game->numRows; $i++) {
            for ($j = 0; $j < $this->game->numColumns; $j++) {
                if ($myst == $this->round->matrix[$i][$j]) {
                    $this->round->matrix[$i][$j] = $myst_symbol;
                }
            }
        }

        $this->round->matrixString = array2d_to_string($this->round->matrix);
        $this->round->matrixFlatten = $this->round->generateFlatMatrix($this->round->matrix);
        $respinState = true;

        if ($respinState) {
            $this->respinInfo($details, $myst_symbol);
        }
    }

    private function respinInfo($details, $myst_symbol)
    {
        $win_positions = $this->getWinPositions($myst_symbol);
        $respin_info = array(
            'fs_game_id' => 4,
            'spin_type' => 'respin',
            'num_spins' => 1,
            'random_symbol' => $myst_symbol,
            'multiplier' => 1,
            'parent_type' => $this->round->spinType,
            'matrix' => $this->round->matrix,
            'win_positions' => $win_positions,
            'matrix_array' => array(array2d_to_string($this->round->matrix)),
        );
        array_push($this->round->postFreeSpinInfo, $respin_info);
        $this->setBonusWonMessages($respin_info,$myst_symbol);
        $this->nextRound($respin_info);

    }


    protected function setBonusWonMessages($details,$myst_symbol)
    {
       
        $bonusGameWon = array(
            'type' => 'respins',
            'num_spins' => 1,
            'spins_left' => 1,
            "win_amount" => 0,
            "mystry_symbol" => $myst_symbol,
            "parent_type" => $details['parent_type'],
            "sticky_positions" => $details['win_positions'],
            "feature_name" => "basegameFeature",
        );
       
    
        array_push($this->round->bonusGamesWon, $bonusGameWon);

    }

    private function nextRound($details)
    {
        $this->round->nextRound = array(
            'type' => "respins",
            'num_spins' => 1,
            'spins_left' => 1,
            'win_amount' => 0,
            'parent_type' => $details['parent_type'],
            "sticky_positions" => $details['win_positions'],
        );
    }

    private function getWinPositions($myst_symbol)
    {
        $win_positions = array();
        $ind = 0;
        for ($i = 0; $i < $this->game->numRows; $i++) {
            for ($j = 0; $j < $this->game->numColumns; $j++) {
                if ($this->round->matrix[$i][$j] == $myst_symbol) {
                    array_push($win_positions, $ind);
                }
                $ind++;
            }
        }
        return $win_positions;
    }

    private function handleRespins()
    {   
        $matrix_array = [];
        $id = $this->round->freeSpins['id'];
        $sub_game_id = $this->round->freeSpins["details"]['fs_game_id'];
        $rs_details = $this->round->freeSpins['details'];
        $myst_symbol = $rs_details['random_symbol'];
        $win_positions = $rs_details['win_positions'];
        // for($i=0;$i<count($win_positions);$i++){
        //     $r=$win_positions[$i]/5;
        //     $c=$win_positions[$i]%5;
        //     $this->round->matrix[$r][$c]=$myst_symbol;
        //    }
        list($prev_sym_count, $pres_sym_cpunt, $win_positions) =
        $this->generateStickyMatrixForRespin($rs_details, $id, $myst_symbol, $sub_game_id);
        $rs_details['matrix'] = $this->round->matrix;
        $rs_details['win_positions'] = $win_positions;
        array_push($matrix_array, array2d_to_string($this->round->matrix));
        $rs_details['matrix_array'] = $matrix_array;
        if ($pres_sym_cpunt > $prev_sym_count) {
            $rs_details['id'] = $id;
            array_push($this->round->postFreeSpinInfo, $rs_details);
            $this->setBonusWonMessages($rs_details,$myst_symbol);
            $this->nextRound($rs_details);
        }
    }



    private function generateStickyMatrixForRespin($details, $id, $myst_symbol, $sub_game_id)
    {
        $this->game->subGameId = $sub_game_id;
        $matrix1 = $details['matrix'];
        $symbol_count1 = get_element_count($this->round->generateFlatMatrix($matrix1), $myst_symbol);
        $parent_type = $this->round->freeSpins['details']['parent_type'];
        $symbolConfig = $this->game->symbolConfig['symbol_set'][$parent_type];
        $win_positions = $details['win_positions'];
        $ind = 0;
        for ($i = 0; $i < $this->game->numRows; $i++) {
            for ($j = 0; $j < $this->game->numColumns; $j++) {
                if (in_array($ind, $win_positions)) {
                    $this->round->matrix[$i][$j] = $myst_symbol;
                } else {
                    if ($this->round->matrix[$i][$j] == $myst_symbol) {
                        array_push($win_positions, $ind);
                    }
                }
                $ind++;
            }
        }
        $symbol_count2 = get_element_count($this->round->generateFlatMatrix($this->round->matrix), $myst_symbol);
        $this->round->matrixString = array2d_to_string($this->round->matrix);
        $this->round->matrixFlatten = $this->round->generateFlatMatrix($this->round->matrix);
        return array($symbol_count1, $symbol_count2, $win_positions);
    }


}
?>