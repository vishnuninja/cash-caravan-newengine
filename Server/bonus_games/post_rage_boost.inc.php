<?php
require_once 'ibonus.inc.php';

/**
 * @class PostRageBoost
 * @implements iBonuss
 * @desc This class is used for the game Wrath of the Dragons.
 *       Gets called for the bonus game Spawning Wilds.
 */

class PostRageBoost extends PostMatrixFeatures {

    public function checkAndGrantBonusGame($param='', $type='')
    {
        if (!isset($this->round->previousRound['misc']["rage_meter"])) {
                $this->round->previousRound['misc'] = 
                    array("rage_meter"=>$this->game->misc["rage_meter"]);
        }

        if (isset($this->round->paylineWins["details"]) &&
            $this->round->paylineWins["details"] !== "")
        {
            $details = $this->round->paylineWins["details"];
            $winLines = explode(";", $details);

            $meters = $this->game->misc["rage_meter"]["meters"];
            $points = $this->game->misc["rage_meter"]['points'];

            foreach ($winLines as $key => $value) {
                $value = explode(":", $value);
                $str = substr($value[4], 0, $value[3]);
                
                for ($i=0; $i < count($meters); $i++) { 
                    if (strpos($str, $meters[$i]) !== false) {
                        $n = array_sum($points);
                        $this->rageMeter($points[$value[3]], $meters[$i],++$n);
                    }
                }
            }
        }
        $this->meters();
    }
}
?>