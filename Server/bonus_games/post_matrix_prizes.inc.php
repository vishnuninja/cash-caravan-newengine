<?php
require_once 'ibonus.inc.php';

/**
 * @class SpawningWild
 * @implements iBonus
 * @desc This class is used for the game Wrath of the Dragons.
 *       Gets called for the bonus game Spawning Wilds.
 */

class PostMatrixPrizes {
    # This file is being used for InfinityBattle
    protected $game;
    protected $round;
    protected $accountId;
    protected $symbol;
    protected $bonusGameId;
    protected $scattersCount;

    public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount)
    {
        $this->game = $game;
        $this->round = &$round;
        $this->accountId = $accountId;
        $this->symbol = $symbol;
        $this->bonusGameId = $bonusGameId;
        $scattersCount['total'] = isset($scattersCount[$symbol]) ?  $scattersCount[$symbol] : null;
        $this->scattersCount = $scattersCount;
    }

    #function handle_prize_pool(&$round, $details)
    /**
     * @func
     * @desc
     */
    public function checkAndGrantBonusGame()
    {
        $details = $this->round->featureData['details'];
        $this->setWilds();
        $this->setExpandingSymbols();
    }

    private function setWilds()
    {
        if(isset($this->round->freeSpins['details']['game_data']['wilds']) &&
           count($this->round->freeSpins['details']['game_data']['wilds']) > 0) {
               $this->round->setWilds(
                   $this->round->freeSpins['details']['game_data']['wilds']);
            $this->round->postMatrixInfo['wild_symbols'] = $this->round->game->wilds;
        }
    }

    private function setExpandingSymbols() 
    {
        $expandSymbols = $this->round->freeSpins['details']['game_data']['exp_sys'];
        $expandIndexes = Array();
        $flippedMatrix = flip_2d_array($this->round->matrix);
        $isMatrixExpanded = False;

        for($i = 0; $i < count($expandSymbols); $i++) {
            if(!in_array($expandSymbols[$i], $this->round->matrixFlatten)) {
                continue;
            }

            $indexes =Array();
            for($j = 0; $j < $this->round->game->numColumns; $j++) {
                if(!in_array($expandSymbols[$i], $flippedMatrix[$j])) {
                    continue;
                }

                $isMatrixExpanded = True;
                $indexes = array_merge(
                    $indexes, get_matrix_indexes($this->round, $indexes, $j));
                $flippedMatrix[$j] = array_fill(0, count($flippedMatrix[$j]), $expandSymbols[$i]);
            }

            $expandIndexes[$expandSymbols[$i]] = $indexes;
        }
        if($isMatrixExpanded == True) {
            $matrix = flip_2d_array($flippedMatrix);
            $this->round->postMatrixInfo['matrix'] = $matrix;
            $this->round->postMatrixInfo['feature_name'] = 'spawning_wild';
            $this->round->postMatrixInfo['matrixString'] = array2d_to_string($matrix);
            $this->round->postMatrixInfo['matrixFlatten'] = $this->round->generateFlatMatrix($matrix);
            $this->round->postMatrixInfo['expand_positions'] = $expandIndexes;

        }
        else if($isMatrixExpanded == False){
            $matrix = flip_2d_array($flippedMatrix);
            $this->round->postMatrixInfo['matrix'] = $matrix;
            $this->round->postMatrixInfo['feature_name'] = '';
            $this->round->postMatrixInfo['matrixString'] = array2d_to_string($matrix);
        }
        #$this->setWilds();   
    }
}
?>
