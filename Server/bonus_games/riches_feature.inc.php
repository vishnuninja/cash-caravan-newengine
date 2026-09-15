<?php
class RichesFeature {
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

    /**
     * @func checkAndGrantBonusGame
     */
    public function checkAndGrantBonusGame() {
        $spinType = $this->round->spinType;
        $matrix = $this->round->matrix;
        $details = $this->round->featureData['details'];
        $wild_symbol = array1d_to_string($this->game->wilds);
        $wild_count = get_element_count($this->round->generateFlatMatrix($matrix), $wild_symbol);
        $element_array = $details['element_array'];
        $result = array_diff($matrix[0], $this->game->wilds);
        $result = array1d_to_string($result);
        $num_spins = $details['num_spins'];
        $min_count = $details['min_count'];
        if ($spinType == 'normal' and $wild_count == $min_count and !in_array($result, $element_array)){
            $this->awardRespins($num_spins, $min_count);
        }
        $this->handleRespins($element_array);
    }

    public function handleRespins($element_array) {
        if ($this->round->spinType == 'respin') {
            $id = $this->round->freeSpins['id'];
            $rs_details = $this->round->freeSpins['details'];
            $count = $this->generateStickyMatrixForRespin($rs_details, $id, $element_array);
            $rs_details['matrix'] = $this->round->matrix;
            if ($count > 0) {
                $this->updateRespinRound($rs_details);
            }
        }
    }

    public function generateStickyMatrixForRespin($details, $id, $element_array) {
        $matrix1 = $details['matrix'];
        $matrix2 = $this->round->matrix;
        $count = 0;
        $min_count = $details['min_count'];
        $wild_symbol = array1d_to_string($this->game->wilds);
        for($i = 0; $i < $this->game->numColumns; $i++) {
            for($j = 0; $j < $this->game->numRows; $j++) {
                if ($matrix1[$j][$i] == $wild_symbol) {
                    $matrix2[$j][$i] = $matrix1[$j][$i];
                }
            }
        }
        $this->round->matrix = $matrix2;
        $wild_count = get_element_count($this->round->generateFlatMatrix($matrix2), $wild_symbol);
        $result = array_diff($matrix2[0], $this->game->wilds);
        $result = array1d_to_string($result);
        if ($wild_count == $min_count and !in_array($result, $element_array)) {
            $count += 1;
        }
        $this->round->matrixString = array2d_to_string($this->round->matrix);
        $this->round->matrixFlatten = $this->round->generateFlatMatrix($this->round->matrix);
        return $count;
    }

    public function updateRespinRound($details) {
        $num_spins = $this->round->freeSpins['details']['num_spins'];
        $multiplier = 1;
        $roundIds = $this->round->freeSpins['round_ids'];
        $spin_type = 3;
        $history = $this->round->freeSpins['history'];
        $state = 0;
        array_push($history, $num_spins);
        array_push($roundIds, $this->round->roundId);
        update_freespins($this->round->freeSpins['id'], $this->round->freeSpins['game_id'],
                         $this->round->freeSpins['sub_game_id'], $this->accountId,
                         $this->round->freeSpins['base_round_id'], $num_spins,
                         $multiplier, $this->round->amountType, $roundIds, $history, $details);
        $this->round->loadFreeSpins();
        $this->setBonusWonMessages($num_spins);

    }

    public function awardRespins($num_spins, $min_count) {
        $round_ids = Array($this->round->roundId);
        $spin_type = 3;
        $multiplier = 1;

        $details = Array(
            'spin_type' => 'respin',
            'parent_type'       => $this->round->spinType,
            'matrix'            => $this->round->matrix,
            'num_spins'         => $num_spins,
            'min_count'         => $min_count
        );

        $history = Array($num_spins);

        award_freespins($this->game->gameId, $this->game->subGameId,
            $this->accountId, $this->round->roundId, $num_spins,
            $multiplier, $this->round->coinValue, $this->round->numCoins, 
            $this->round->numBetLines, $this->round->amountType, $round_ids, 
            $history, $spin_type, $details);

        $this->setBonusWonMessages($num_spins);
    }

    public function setBonusWonMessages($num_spins) {
        $bonusGameWon = Array(
                'type'          => 'respins',
                'num_spins'     => $num_spins
        );
        array_push($this->round->bonusGamesWon, $bonusGameWon);
    }
}
?>