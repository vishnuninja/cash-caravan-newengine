<?php
require_once 'ibonus.inc.php';

/**
 * @class SpawningWild
 * @implements iBonus
 * @desc This class is used for the game Wrath of the Dragons.
 *       Gets called for the bonus game Spawning Wilds.
 */

class PostWinHandler
{
    # This file is being used for InfinityBattle
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

    #function handle_prize_pool(&$round, $details)
    /**
     * @func
     * @desc
     */
    public function checkAndGrantBonusGame()
    {
        # $details = $this->round->featureData['details'];
        # If special Quest category was not won by player, just need to return
        if(!isset($this->round->freeSpins['details']['game_data']['spl_quest']) ||
           $this->round->freeSpins['details']['game_data']['spl_quest'] == "") {
            $numScatters = get_symbol_count($this->round->matrixFlatten,
                                            $this->game->scatters);

            # Must be last spin and no chance to get Pick Bonus.
            if($this->round->freeSpins['spins_left'] == 1 && $numScatters < 3) {
                $this->round->freespinState = 1;
            }
            return;
        }

        if(isset($this->round->freeSpins['details']['game_data']['reward']) &&
           $this->round->freeSpins['details']['game_data']['reward'] != "") {
            $this->grantSpecialQuestReward();
                return;
        }

        $splQuest = $this->round->freeSpins['details']['game_data']['spl_quest'];

        if($splQuest == "10ScatterCollect") {
            $this->handleScatterCollect();
        } # todo Done till here
        else if($splQuest == "5WinsInARow" ) { # todo must continue from here
            $this->handleWinsInARow();
        }
        else if($splQuest == "3CharacterWin" and $this->round->paylineWins['details']!="") {
            $betLineDetails = explode(';', $this->round->paylineWins['details']);
            foreach($betLineDetails as $key => $value) {
                $value = explode(':', $value );
                $betLine = $value[4];
                $numRepeats = $value[3];
                $this->handleCharacterWins($betLine, $numRepeats);
            }
        }

        if($this->round->freeSpins['spins_left'] == 1 and (get_element_count($this->round->matrixFlatten, 's')<3)){
            $this->grantSpecialQuestReward();
            $this->round->freespinState = 1;
        }

    }

    function handleScatterCollect()
    {
        $splQuest = $this->round->freeSpins['details']['game_data']['spl_quest'];
        $minCount = $this->round->freeSpins['details']['game_data']['min_limit'];
        $prevCount = $this->round->freeSpins['details']['game_data']['10ScatterCollect'];
        $curCollectCount = $prevCount;
        $curCollectCount += get_element_count($this->round->matrixFlatten, "s");

        if($prevCount < $minCount and $curCollectCount >= $minCount) {
            $curCollectCount = $minCount;
            $this->selectReward();
        }

        array_push($this->round->bonusGamesWon, Array("type" => $splQuest, "value" => $curCollectCount));

        $this->getUniqueSet($this->round->freeSpins['details']['feature_details'],$curCollectCount);

        if($prevCount == $curCollectCount) {
            return;
        }

        $this->round->freeSpins['details']['game_data']['10ScatterCollect'] = $curCollectCount;

        $this->updateFreeSpins();
    }

    function handleWinsInARow() 
    {
        $splQuest = $this->round->freeSpins['details']['game_data']['spl_quest'];
        $minCount = $this->round->freeSpins['details']['game_data']['min_limit'];

        $fiveWinsInARow = $this->round->freeSpins['details']['game_data']['5WinsInARow'];
        $fiveWinsInARow += ($this->round->winAmount > 0) ? 1:(-1 * $fiveWinsInARow);
        array_push($this->round->bonusGamesWon,
             Array("type" => $splQuest, "value" => $fiveWinsInARow));
        $this->getUniqueSet($this->round->freeSpins['details']['feature_details'],
                             $fiveWinsInARow);

        if($fiveWinsInARow == $minCount){
            $this->selectReward();
        }
        $this->round->freeSpins['details']['game_data']['5WinsInARow'] = $fiveWinsInARow;

        $this->updateFreeSpins();
    }

    function handleCharacterWins($betLine, $numRepeats) 
    {
        $splQuest = $this->round->freeSpins['details']['game_data']['spl_quest'];
        $prevValue = $this->round->freeSpins['details']['game_data']['3CharacterWin'];
        $chars = $this->round->freeSpins['details']['game_data']['prize_pool']['chars'];
        $minCount = $this->round->freeSpins['details']['game_data']['min_limit'];

        $bet_line = substr($betLine, 0, $numRepeats);
        $threeCharWin = $prevValue;
        $threeCharWin += (count(array_intersect(str_split($bet_line), $chars))>0) ? 1:0;

        if($threeCharWin == $minCount){
            array_push($this->round->bonusGamesWon, Array("type" => $splQuest, "value" => $threeCharWin));
            $this->selectReward();
            $this->getUniqueSet($this->round->bonusGamesWon, $threeCharWin, $splQuest);
            $this->getUniqueSet($this->round->freeSpins['details']['feature_details'], $threeCharWin);
        }else if($threeCharWin < $minCount) {
            array_push($this->round->bonusGamesWon, Array("type" => $splQuest, "value" => $threeCharWin));
            $this->getUniqueSet($this->round->bonusGamesWon, $threeCharWin, $splQuest);
            $this->getUniqueSet($this->round->freeSpins['details']['feature_details'], $threeCharWin);
        }
        if($prevValue == $threeCharWin){return;}

        $this->round->freeSpins['details']['game_data']['3CharacterWin'] = $threeCharWin;

        $this->updateFreeSpins();
    }

    # todo must change
    function selectReward()
    {
        if(!isset($this->round->freeSpins['details']['game_data']['reward'])) 
        {
            $rewards = $this->round->freeSpins['details']['game_data']['rewards'];
            $index = get_random_number(0, count($rewards['rewards'])-1);
            $reward = $rewards['rewards'][$index];
            $this->round->freeSpins['details']['game_data']['reward'] = $reward;
        }   
    }

    function grantSpecialQuestReward()
    {
        if($this->round->freeSpins['spins_left'] > 1 or
           get_element_count($this->round->matrixFlatten, 's') >= 3) {
            return;
        }
        if(isset($this->round->freeSpins['details']['game_data']['reward'])){
 
            $reward = $this->round->freeSpins['details']['game_data']['reward'];
            switch ($reward) {
                case '200bets':
                    $this->rewardBet($reward);
                    break;
                case 'ultraspin':
                    $this->grantUltraSpin($reward);
                    break;
                case 'free_game':
                    $this->grantFreeGame($reward);
                    break;
                default:
                    ErrorHandler::handleError(1, "POSTLINE_0001");
                    break;
            }
        }

        $this->round->freespinState = 1;
    }

    private function rewardBet($reward)
    {
        $nthBet = $this->round->freeSpins['details']['game_data']['rewards'][$reward];
        $betWin = $nthBet * $this->round->totalBet; 
        $this->round->winAmount += $betWin;

        array_push($this->round->bonusGamesWon, Array("type" => $reward, "value" => $betWin));
        array_push($this->round->winLineNumbers, Array("200Bets", $betWin));
    }

    private function grantUltraSpin($reward)
    {
        $ultraSpinsInfo = Array('type' => 'ultraspin');

        $rewards = $this->round->freeSpins['details']['game_data']['rewards'];
        $details = $rewards['ultraspin'];
        $details['feature_details'] = $ultraSpinsInfo;
        $numSpins = $details['game_data']['num_spins'];
        $multiplier = $details['game_data']['multiplier'];

        award_freespins($this->game->gameId, $this->game->subGameId,
                        $this->round->player->accountId,
                        $this->round->freeSpins['base_round_id'],
                        $numSpins, $multiplier, $this->round->coinValue,
                        $this->round->numCoins, $this->round->numBetLines,
                        $this->round->amountType, Array($this->round->roundId),
                        Array($numSpins), 3, $details);

        $freeSpinsInfo = Array(
            'type' => 'freespins', 'num_spins' => $numSpins,
            'spins_left' => $numSpins, 'win_amount' => 0);
        array_push($this->round->bonusGamesWon, $ultraSpinsInfo);
        array_push($this->round->bonusGamesWon, $freeSpinsInfo);
    }

    private function grantFreeGame($reward)
    {
        $details = Array('feature_details' => Array('type' => $reward),
                         'parent_type' => $this->round->spinType);

        $rewards = $this->round->freeSpins['details']['game_data']['rewards'];
        $gameData = $rewards['free_game']['game_data'];
        $numSpins = $gameData['num_spins'];
        $multiplier = $gameData['multiplier'];
        $fsGameId = $gameData['fs_game_id'];

        award_freespins($this->game->gameId, $fsGameId,
                        $this->round->player->accountId,
                        $this->round->freeSpins['base_round_id'],
                        $numSpins, $multiplier, $this->round->coinValue,
                        $this->round->numCoins, $this->round->numBetLines,
                        $this->round->amountType, Array($this->round->roundId),
                        Array($numSpins), 2, $details);

        
        $gameData['feature_details'] = Array('type' => $reward);
           
        $bonusGameCode = $gameData['code']; 
        $numPicks = $gameData['num_picks'];          
        $numPrizes = count($gameData['prizes']);
        $bonusGameId = $gameData['bonus_game_id'];
        
        grant_bonus_game($this->game->gameId, $fsGameId,
                         $this->round->freeSpins['base_round_id'],
                         $this->round->roundId, $this->round->player->accountId,
                         $bonusGameId, $bonusGameCode, $numPicks,
                         encode_objects($gameData), $multiplier,
                         $this->round->amountType, $this->round->coinValue,
                         $this->round->numCoins, $this->round->numBetLines);

        # todo Bala must check the bellow 3 items
        array_push($this->round->bonusGamesWon, Array('type' => $reward));

        $bonusGameWon = Array('type' => 'bonus_game', 'bonus_game_id' => $bonusGameId,
                              'num_picks' => $numPicks, 'num_prizes' => $numPrizes);

        array_push($this->round->bonusGamesWon, $bonusGameWon);
        $freespins_info = Array('type' => 'freespins', 'num_spins' => $numSpins,
                                'spins_left' => $numSpins, 'win_amount' => 0);

        array_push($this->round->bonusGamesWon, $freespins_info);
    }
    
    # todo must change
    function getUniqueSet(&$arr, $val, $splQuest="")
    {
        foreach($arr as $key => $value) {
            if($value['type'] == "special_quest"){
                $value['count'] = $val;
                $arr[$key] = $value;
            }else if($value['type'] == $splQuest){
                $value['value'] = $val;
                $arr[$key] = $value;
            }
        }
    }
    private function updateFreeSpins()
    {
        $num_spins = 0; $multiplier = 1;
        update_freespins($this->round->freeSpins['id'], $this->game->gameId,
                         $this->round->freeSpins['sub_game_id'],
                         $this->round->player->accountId, $this->round->roundId, 
                         $num_spins, $multiplier, $this->round->amountType,
                         $this->round->freeSpins['round_ids'],
                         $this->round->freeSpins['history'],
                         $this->round->freeSpins['details']);
    }
}
?>
