<?php

/**
 * @interface iBonus
 * @desc This interface will be implemented by all the Feature Classes. It contains
 *       three methods which will be publicly available. These methods will be used
 *       in the slots.php file to handle the Feature Round. The three methods are:
 *       - checkAndGrantBonusGame
 *       - load
 *       - click
 */
interface iBonus
{
    /**
     * @func checkAndGrantBonusGame
     * @desc This method will be used initializing the bonus round. This method
     *       will handle the triggering of the feature round. Hence inserting
     *       in the feature table.
     */
    public function checkAndGrantBonusGame();

    /**
     * @func loadBonusGame
     * @desc This method will be used for loading the current feature round
     *       values. These values will be send to client for initializing
     *       the bonus round.
     */
    public function loadBonusGame();

    /**
     * @func playBonusGame
     * @desc This method will be used when the bonus round is being played. It
     *       will take the position clicked by the player and send the winning
     *       information to player. This function will be used for playing the
     *       game
     * @param $pickedPosition position picked by the player
     */
    public function playBonusGame($pickedPosition);
}
