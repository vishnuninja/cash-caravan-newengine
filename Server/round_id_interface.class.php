<?php
/**
 * @interface IRound
 *
 * @author
 * @created 20 June 2018
 *
 * @desc
 *      Suports the following methods
 *        - new(name)
 *        - currentRoundId()
 *        - nextRoundId()
 */

interface IRound
{
    /**
     * @func __constructor
     *
     * @param string name for which round ID is requested for
     * @param int seed starting seed of the round ID
     * @param int stepUp step value of the round Id generated
     */
    function __construct($name, $seed = null, $stepUp = null);

    /**
     * @func nextRoundId
     *
     * @desc Increments the current value of the round ID by step value
     *
     * @return Returns the round ID afater the step up value
     */
    public function nextRoundId();

    /**
     * @func currentRoundId
     *
     * @return Returns the current round ID
     */
    public function currentRoundId();
}