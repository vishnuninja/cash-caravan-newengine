<?php

require_once 'road_bonus.inc.php';

/**
 * @class RoadBonusGame
 * @extends RoadBonus
 * @desc This class handles the Leprechaun's Loot's Rainbow Road Bonus Game
 *       bonus round. In this round, win value for the bonus game will be decided
 *       intially. Wheel is spun during bonus game play. Every time wheel is spun,
 *       wheel stops at a specifi number. Then the player will move forward as per the
 *       the wheel value. Playe keeps moving until he reaches the final position or
 *       wheel stops on 'collect'. Initially, player does not know how many steps
 *       he will move forward
 */

class RoadBonusGame extends RoadBonus
{
    public function __construct(&$machine, &$round, $accountId, $feature_id, $symbol, $scattersCount)
    {
        parent::__construct($machine, $round, $accountId, $feature_id, $symbol, $scattersCount);
    }
}
?>