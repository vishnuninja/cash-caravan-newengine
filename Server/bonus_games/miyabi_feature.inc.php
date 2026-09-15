<?php
require_once "consecutive_wins_handler.inc.php";    # QS

/**
 * @class MiyabiFeature
 * @desc This class is used for the game Queen Of Legends.
 *       Gets called for the Miyabi Feature
 */

class MiyabiFeature extends ConsecutiveWinsHandler {
    protected $game;
    protected $round;
    protected $accountId;
    protected $symbol;
    protected $bonusGameId;
    protected $scattersCount;
    protected $respinDetails;

    public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount) {
        $this->game = $game;
        $this->round = &$round;
        $this->accountId = $accountId;
        $this->symbol = $symbol;
        $this->bonusGameId = $bonusGameId;
        $scattersCount['total'] = isset($scattersCount[$symbol]) ?  $scattersCount[$symbol] : null;
        $this->scattersCount = $scattersCount;
        $this->respinDetails = array();
    }

    /**
     * @func checkAndGrantBonusGame
     */
    public function checkAndGrantBonusGame() {
        $spinType = $this->round->spinType;
        $details = $this->round->featureData['details'];
        if ($spinType == 'respin') {
            $each_princess_pay = $details['each_princess_pay'];
            $this->handleRespins($each_princess_pay);
        }
        $this->round->miscPrizes = $this->respinDetails;
    }

    private function handleRespins($each_princess_pay) {
        $id = $this->round->freeSpins['id'];
        $rs_details = $this->round->freeSpins['details'];
        $princess_symbol = $rs_details['princess_symbol'];
        $rs_sticky_reel = $rs_details['sticky_reel'];
	    $matrixArray = $rs_details['matrix_array'];

        list($queensCount, $win_positions) = $this->restoreStickyMatrix($rs_details, $princess_symbol);

        $rs_details['matrix'] = $this->round->matrix;
        $rs_details['win_positions'] = $win_positions;
        array_push($matrix_array, array2d_to_string($this->round->matrix));
        $rs_details['matrix_array'] = $matrix_array;
	if ($queensCount) {
            $rs_details['id'] = $id;
            array_push($this->round->postFreeSpinInfo, $rs_details);
            $this->setBonusWonMessages($rs_details);
            $this->generateFakeSpinCount();
        } else {
            // client data
            $fakespins_data = Array(
                "fakespins_count"   => 2
            );
            array_push($this->respinDetails, $fakespins_data);
            $this->round->winAmount = $this->miyabiPayout($rs_details, $each_princess_pay);
        }

    }

    private function restoreStickyMatrix($details, $princess_symbol) {
        $matrix1 = $details['matrix'];
        $matrix2 = $this->round->matrix;
        $parent_type = $details['parent_type'];
        $symbolConfig = $this->game->symbolConfig['symbol_set'][$parent_type];
        $weights = $symbolConfig['weights'];
        $values = $symbolConfig['values'];
        $win_positions = $details['win_positions'];
        $queensCount = false;

        $ind = 0;
        for($i = 0; $i < $this->game->numRows; $i++) {
            for($j = 0; $j < $this->game->numColumns; $j++) {
                if ($matrix1[$i][$j] == $princess_symbol) {
                    $matrix2[$i][$j] = $matrix1[$i][$j];
                } else {
                    $matrix2[$i][$j] = weighted_random_number($weights, $values);
                    if ($matrix2[$i][$j] == $princess_symbol) {
                        array_push($win_positions, $ind);
                        $queensCount = true;
                    }
                }
                $ind++;
            }
        }
        $this->round->matrix = $matrix2;
        $this->round->matrixString = array2d_to_string($this->round->matrix);
        $this->round->matrixFlatten = $this->round->generateFlatMatrix($this->round->matrix);

        return Array($queensCount, $win_positions);
    }

    private function miyabiPayout($details, $each_princess_pay) {
        $fMatrix = $this->round->matrixFlatten;
        $princess_symbol = $details['princess_symbol'];
        $total_princess_count = get_element_count($fMatrix, $princess_symbol);
        $payOut = ($total_princess_count * $each_princess_pay) * $this->round->totalBet;
        return $payOut;
    }

    protected function generateFakeSpinCount() {
        $fakespinConfig = $this->round->featureData['details']['fakespin_set'];
        $weights = $fakespinConfig['weights'];
        $values = $fakespinConfig['values'];
        $fake_spin_count = weighted_random_number($weights, $values);

        // client data
        $fakespins_data = Array(
            "fakespins_count"   => $fake_spin_count
        );
        array_push($this->respinDetails, $fakespins_data);
    }
}
?>
