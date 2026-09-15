<?php
// require_once 'ibonus.inc.php';

/**
 * @class RandomWild
 * @implements iBonus
 * @desc This class is used for the game Guardianofprosperity.
 * It generates the wild multiplier in main game randomly.
 */

class WildMultiplierPay
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
    public function checkAndGrantBonusGame($betline = "")
    {
        $spin_type = $this->round->spinType;
        $conf = isset($this->game->misc['wild_multiplier_handler'][$spin_type]) ?
                $this->game->misc['wild_multiplier_handler'][$spin_type] : false;
        $multipler = 0;
        if(!$conf) {
            return $this->game->wildMultiplier;
        }
        

        // echo "win1";
        $payline_num = $this->game->paylinesConfig[$this->symbol  - 1];
        for ($i=0; $i < count($payline_num); $i++) {
            // echo $payline_num[$i];
            // print_r($this->round->screenWins);
            if( $this->round->screenWins[$payline_num[$i]]>0)  {
                $multipler+=$this->round->screenWins[$payline_num[$i]];
            }
        }
        // echo "win2";
        $this->round->multipliers = Array(
            Array(
                "type" => "wild_multiplier",
                "id"  => $this->bonusGameId,
                "value" => array_sum($this->round->screenWins)
                )
            );
            
            // echo "win3";
        if($multipler> 0){
            return $multipler;
            }
        return 1;
    }
}


?>
