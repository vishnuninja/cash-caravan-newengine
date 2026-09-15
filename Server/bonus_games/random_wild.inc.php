<?php
require_once 'ibonus.inc.php';

/**
 * @class RandomWild
 * @implements iBonus
 * @desc This class is used for the game Guardianofprosperity.
 * It generates the wild multiplier in main game randomly.
 */

class RandomWild implements iBonus
{
    protected $game;
    protected $round;
    protected $accountId;
    protected $symbol;
    protected $bonusGameId;
    protected $scattersCount;
    public static $wildMultiplier = 0;

    public function __construct(&$game, &$round, $accountId,
        $bonusGameId, $symbol, $scattersCount)
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
    public function checkAndGrantBonusGame()
    {
        $spin_type = $this->round->spinType;
        $conf = isset($this->game->misc['wild_multiplier_handler'][$spin_type]) ?
                $this->game->misc['wild_multiplier_handler'][$spin_type] : false;

        if(!$conf) {
            return $this->game->wildMultiplier;;
        }

        if($this->round->wildMultiplier > 0) {
            return $this->round->wildMultiplier;
        }

        $details = $conf['details'];
        $weights = $details['weights'];
        $multipliers = $details['multipliers'];
        $rand_mult  = weighted_random_number($weights, $multipliers);
        $this->round->wildMultiplier = $rand_mult;

        $this->round->multipliers = Array(
            Array(
                "type" => "wild_multiplier",
                "id"  => $this->bonusGameId,
                "value" => $rand_mult
            )
        );

        return $rand_mult;
    }

    /**
     * @func playBonusGame
     * @desc Nothing happens here
     */
    public function playBonusGame($pickedPosition)
    {
      return;
    }

    public function loadBonusGame()
    {
        return ;
    }

    private function getSubGameId($index) {

    }
}
?>
