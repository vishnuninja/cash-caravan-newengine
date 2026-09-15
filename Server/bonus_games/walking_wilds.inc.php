<?php
require_once 'ibonus.inc.php';

/**
 * @class WalkingWilds
 * @implements iBonus
 * @desc This class is used for the game Wrath of the Dragons. Gets called for
 *       the bonus game Walking Wilds
 */


class WalkingWilds implements iBonus
{
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
     * @desc Nothing happens here.
     */
    public function checkAndGrantBonusGame()
    {
      return;
    }

    /**
     * @func playBonusGame
     * @desc Nothing happens here
     * @param $pickedPosition value ranges between 0 and total_objects -1.
     */
    public function playBonusGame($pickedPosition)
    {
      return;
    }

    /**
     * @func loadBonusGame
     * @desc This function is used to load bonus Walking wild details.
	 *		 Sets some values at run time which will be used for
	 *		 line wins calculation.
     */
    public function loadBonusGame()
    {
        $wildsData = $this->round->freeSpins['details']['moving_wilds_data'];
        $numSpinsDone = $this->round->freeSpins['num_spins'] - $this->round->freeSpins['spins_left'];
        $reelIndexes = $wildsData[$numSpinsDone];
        $maxReelIndex = max($reelIndexes);
        $reelCount = count($reelIndexes);
        $subGameId = $this->getSubGameId($numSpinsDone);
        $this->round->freeSpins['details']['fs_game_id'] = $subGameId;
        $this->round->wildMultiplier = $maxReelIndex + 1;
        $this->round->multipliers = Array(
            Array(
                "type" => "wild_multiplier",
                "id"  => $this->round->freeSpins['details']['bonus_game_id'],
                "value" => $maxReelIndex + 1));
        if($this->round->freeSpins['spins_left'] == 1 &&
           isset($this->round->freeSpins['details']['parent_spins_left'])) {
           if($this->round->freeSpins['details']['parent_spins_left'] > 0) {
                   $this->round->freespinState = 0;
           }
           else {
               $this->round->freespinState = 1;
           }
        }

        if($this->round->freeSpins['spins_left'] == 1) {
            $this->round->respinState = 1;
        }
    }

    private function getSubGameId($index) {
        return $this->round->freeSpins['details']['fs_game_ids'][$index];
    }
}
?>
