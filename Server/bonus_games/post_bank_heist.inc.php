<?php
require_once 'ibonus.inc.php';

/**
 * @desc This class is used for the game Bank Heist.
 *
 */

class BankHeist extends BonusPickGame {

    public function checkAndGrantBonusGame()
    {
        $details = $this->round->featureData['details'];
        if (isset($this->round->freeSpins)) {

            $scatters = $details['scatters'];
            #$scattersCount['total'] = 0;
            $scattersCount['spins'] = 0;
            foreach($this->game->scatters as $ind => $scatter) {
                $count = get_element_count($this->round->matrixFlatten, $scatter);
                $scattersCount[$scatter] = $count;
                $scattersCount['spins'] += ($scatters[$scatter] * $count);
                #$scattersCount['total'] += $count;
            }

            $this->getMultiplier($details);
            $multiplier = $this->round->freeSpins['multiplier'];
            $numSpins = $scattersCount['spins'];
            #==================================
            $maxSpins = $this->round->freeSpins['details']['max_respins'];
            if ($maxSpins > 0 && $numSpins > 0) {
               $temp = $maxSpins - $numSpins;
                if($temp <= 0){
                    $numSpins += $temp;
                }
                $this->round->freeSpins['details']['max_respins'] = $temp;
            }else{
                $numSpins = 0;
            }
            #+++++++++++++++++++++++++++++++++++
            if ($numSpins > 0) {
                array_push($this->round->freeSpins['round_ids'], $this->round->roundId);
                array_push($this->round->freeSpins['history'], $numSpins);
                $this->round->freeSpins['spins_left'] += $numSpins;
                $this->setNextRound($numSpins, $multiplier);
            }else{
                if ($this->round->freeSpins['spins_left'] == 1) {
                    $this->round->freespinState = 1;
                }
            }

            $this->round->freeSpins['details']["fs_multiplier"] = $multiplier;
            $this->updateFreeSpins($this->round->freeSpins['id'], $this->round->freeSpins['game_id'],
                $this->accountId, $this->round->freeSpins['base_round_id'],$numSpins, $multiplier,
                $this->round->amountType, $this->round->freeSpins['round_ids'],
                $this->round->freeSpins['history'], $this->round->freeSpins['details']);

        }else{
            $scatters = $details['scatters'];
            $scattersCount['total'] = 0;
            $scattersCount['spins'] = 0;
            foreach($this->game->scatters as $ind => $scatter) {
                $count = get_element_count($this->round->matrixFlatten, $scatter);
                $scattersCount[$scatter] = $count;
                $scattersCount['spins'] += ($scatters[$scatter] * $count);
                $scattersCount['total'] += $count;
            }
            if ( $scattersCount['total'] > 2) {
                $roundIds = Array($this->round->roundId);
                $multiplier = $spinType = 1;
                $numSpins = $details['num_spins'] + $scattersCount['spins'];
                $history = Array($numSpins);
                $details = array("fs_game_id" => 2, "parent_type" => 'normal',
					"fs_multiplier" => 1, "max_respins" => $details['max_respins']);

                award_freespins($this->game->gameId, $this->game->subGameId, $this->accountId,
                    $this->round->roundId, $numSpins, $multiplier, $this->round->coinValue,
                    $this->round->numCoins,  $this->round->numBetLines, $this->round->amountType,
                    $roundIds, $history, $spinType, $details);
                $this->setNextRound($numSpins, $multiplier);
            }
        }
    }

    public function getMultiplier($details)
    {
        $multiplier = $this->round->freeSpins['multiplier'];

        $max = $details['max_limit'];
        if ($multiplier == $max) {
            return;
        }

        $vaults = $details['valuts'];

        foreach($vaults as $vault => $value) {
            $count = get_element_count($this->round->matrixFlatten, $vault);
            $multiplier += ($value * $count);
        }
        if ($multiplier > $max) {
            $multiplier = $max;
        }
        $this->round->freeSpins['multiplier'] = $multiplier;

    }

    public function setNextRound($num_freespins, $multiplier)
    {
        $arrFS = array("type" => 'freespins',
                    "num_spins" => $num_freespins,
                    "spins_left" => $num_freespins,
                    "fs_multiplier" => $multiplier);
        array_push($this->round->bonusGamesWon, $arrFS);
    }
}
?>