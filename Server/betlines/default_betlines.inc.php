<?php

require_once 'ibetlines.inc.php';

/**
 * @class DefaultBetLines
 * @implements iBetLines
 * @desc This class implements the iBetLines interface. This class is for all
 *       the machines whose bet lines are generated using paylines.
 */
class DefaultBetLines implements iBetLines
{
    private $game;
    private $round;

    public function __construct(&$game, &$round)
    {
        $this->game = $game;
        $this->round = $round;
    }

    public function generateBetLines()
    {
        
        global $paylines_config;

        if(isset($this->game->misc) && isset($this->game->misc['paylines_key'])) {
            $paylinesKey = $this->game->misc['paylines_key'];
        } else {
            $paylinesKey = $this->game->paylines."_".$this->game->numRows.'x'.
            $this->game->numColumns;
        }

        # @ todo need to get the payline key from db Config.
        if(!isset($paylines_config[$paylinesKey])) {
            ErrorHandler::handleError(1, "ROUND_PAYLINES_NOT_FOUND_0001");
        }
        # @  todo Need to change this paylines to paylines factory
        $payLines = $paylines_config[$paylinesKey];
        $this->game->paylinesConfig = $payLines;

        # Generate only the betlines for what the player has bet on
        for($i = 0; $i < $this->round->numBetLines; ++$i) {
            $gameBetLine  = $payLines[$i];
            $roundBetLine = '';
            $fMatrix = $this->round->getFlattenMatrix();

            for($j = 0; $j < $this->game->numColumns; $j++) {
                $roundBetLine .= $fMatrix[$gameBetLine[$j]];
            }
            array_push($this->round->betLines, $roundBetLine);
            
        }
        return ;
    }

    /*
     * @fun generateLines. TODO if not needed remove this. 08052019
    */
    public function generateLines()
    {
        $paylines = get_paylines_cfg($this->machine->pay_lines,
                $this->machine->lines,
                $this->machine->num_reels,
                $this->machine->mname,
                $this->machine->game_type);

        if(!$paylines or $paylines == null or $paylines == "") {
            $paylines = get_paylines_cfg2($this->machine->pay_lines,
                    $this->machine->lines,
                    $this->machine->num_reels,
                    $this->machine->mname,
                    $this->machine->game_type);
        }

        return $paylines;
    }
}
