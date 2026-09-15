<?php

/**
 * @class RandomWildCombination
 * @desc This class is used for the game PiratesOfTheGrandLine.
 * It generates the random wild multiplier in free game randomly.
 */

class RandomWildCombination {
    protected $game;
    protected $round;
    protected $accountId;
    protected $symbol;
    protected $bonusGameId;
    protected $scattersCount;

    public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount) {
        $this->game = $game;
        $this->round = &$round;
        $this->accountId = $accountId;
        $this->symbol = $symbol;
        $this->bonusGameId = $bonusGameId;
        $scattersCount['total'] = isset($scattersCount[$symbol]) ?  $scattersCount[$symbol] : null;
        $this->scattersCount = $scattersCount;
    }

    /**
     * @func checkAndGrantBonusGame
     */
    public function checkAndGrantBonusGame() {
        // to generate random wild multipliers to matrix in the freegame mode
        $details = $this->round->featureData['details'];
        $matrix = $this->round->matrix;
        if (isset($this->round->freeSpins)) {
            $checkGame = $this->getRandomElement($details['freegame']);
            if ($checkGame == "randomwild") {
                $randomWildCount = $this->getRandomElement($details['random_wild']);
                $fMatrix = $this->round->matrixFlatten;
                $rnd_keys = $this->getRandomKeys($fMatrix, $randomWildCount);
                
                $ind = 0;
                for ($i = 0; $i < $this->game->numRows; $i++) {
                    for ($j = 0; $j < $this->game->numColumns; $j++) {
                        if (in_array($ind, $rnd_keys)) {
                            $matrix[$i][$j] = $this->game->wilds[0];
                        }
                        $ind++;
                    }
                }

                $this->round->postMatrixInfo['matrix']          = $matrix;
                $this->round->postMatrixInfo['feature_name']    = 'random_wild';
                $this->round->postMatrixInfo['matrixString']    = array2d_to_string($matrix);
                $this->round->postMatrixInfo['matrixFlatten']   = $this->round->generateFlatMatrix($matrix);
                $this->round->postMatrixInfo['random_wild_positions']   = $rnd_keys;
            }
        }
    }

    private function getRandomKeys($fMatrix, $randomWildCount) {
        $rnd_keys = array_keys($fMatrix);
        shuffle($rnd_keys);
        return array_slice($rnd_keys, 0, $randomWildCount);
    }

    private function getRandomElement($details) {
        return weighted_random_number($details['weights'], $details['values']);
    }
}
?>
