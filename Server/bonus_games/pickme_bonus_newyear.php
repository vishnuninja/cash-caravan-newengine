<?php
require_once 'ibonus.inc.php';

/**
 * @class Pick Me Bonus Game
 * @implements iBonus
 * @desc This class is used for the game Chinese New Year.
 *		 Gets called for the bonus game Pick me bonus.
 *		 At end of the bonus game, either free spins or bet multiliers will be granted
 */

class PickMeBonus implements iBonus
{
    protected $game;
    protected $round;
    protected $accountId;
    protected $symbol;
    protected $bonusGameId;
    protected $scattersCount;

    public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount)
    {
        $scattersCount['total'] = $scattersCount[$symbol];
        $this->game = $game;
        $this->round = $round;
        $this->accountId = $accountId;
        $this->scattersCount = $scattersCount;
        $this->symbol = $symbol;
        $this->bonusGameId = $bonusGameId;
    }

    /**
     * @func load
     * @desc This function takes care of sending the in-complete bonus game details
	 *		 while be required to play the bonus game. Multiple picks are awarded
	 *		 to the player. In case game is played partially, need to send the picks
	 *		 information that is done so far.
     */
    public function loadBonusGame()
    {
		    $gameData = $this->round->bonusGames['game_data'];
        $prizesWon = $this->getPrizesWon($gameData['won_freespins']);

        $this->round->nextRound = Array(
            'type'           => 'bonus_game',
            'bonus_game_id'  => $this->round->bonusGames['bonus_game_id'],
            'num_picks'      => $this->getRemainingPicks(), #$this->round->bonusGames['num_picks'],
            'num_prizes'     => count($this->round->bonusGames['game_data']['prizes']),
            'prizes_won'     => $prizesWon,
            'pick_positions' => $this->round->bonusGames['picks_data']);
    }

    private function getRemainingPicks()
    {
        return $this->round->bonusGames['num_picks'] - $this->round->bonusGames['num_user_picks'];
    }

    /**
     * @func getPrizesWon
     * @desc This method returns the prizes won by the player. It takes the
     *
     * @param $prizes
     * @return Prizes won by player.
     */
    private function getPrizesWon($prizes)
    {
        $prizesWon = Array();
        for($i = 0; $i < $this->round->bonusGames['num_user_picks']; $i++)
        {
            array_push($prizesWon, $prizes[$i]);
        }
    }

    /**
     * @func checkAndGrantBonusGame
     * @desc Gets called when there are 3 or more bonus symbols in screen.
     *       It awards free spins at the end of the bonus game
     */
    public function checkAndGrantBonusGame()
    {
        $numScatters = $this->scattersCount['total'];
        $config = $this->getBonusConfig($numScatters);

        if(!$this->isConfigValid($config))
        {
            return NULL;
		    }

        $config = decode_object($config);
        #"bonus_config":{"extra_bonus_game":1,"normal":{"w":{"bonus_game_id":9001,"min_count":2}}}}
        #{"num_picks":1,"code":"PMB","prizes":[3,10,15,20,30,40,100,200,500],
        #"weights":[6466,107759,172414,258621,215517,215517,8621,8621,6466],
        #"prize_types":["freespins","total_bet","total_bet","total_bet","total_bet","total_bet","total_bet","total_bet","total_bet"] ,"fs_game_id":2,"fs_multiplier":2}

        $numPicks = $config['num_picks'];
        $numUserPicks = 0;
        $wonPrizes = Array();

        for($i = 0; $i < $numPicks; $i++)
        {
            $index = get_weighted_index($config['weights']);
            #$index = 0; # todo TODO forcing forced. remove this line.
            $prizeType = $config['prize_types'][$index];
            $prize = $config['prizes'][$index];
            $wonPrizes = Array(
              'type'       => $prizeType,
              'num_prizes' => $prize,
              'won_index'  => $index);
        }
        #print_r($wonPrizes);

        $bonusGameData = Array(
          'prizes'     => $config['prizes'],
          'won_prizes' => $wonPrizes);

        if($prizeType == 'freespins') {
          $bonusGameData['won_prizes']['fs_game_id'] =  $config['fs_game_id'];
          $bonusGameData['won_prizes']['fs_multiplier'] =  $config['fs_multiplier'];
        }

        $bonusGameData = encode_objects($bonusGameData);
        grant_bonus_game($this->game->gameId, $this->game->subGameId,
                         $this->round->roundId, $this->round->roundId,
                         $this->accountId, $this->bonusGameId,
                         $config['code'], $numPicks, $bonusGameData,
                         1, $this->round->amountType, $this->round->coinValue,
                         $this->round->numCoins, $this->round->numBetLines);

        $bonusGameWon = Array(
            'type'          => 'bonus_game',
            'bonus_game_id' => $this->bonusGameId,
            'num_picks'     => $numPicks,
            'num_prizes'    => count($config['prizes']));

        array_push($this->round->bonusGamesWon, $bonusGameWon);

    }

    // public function totalFreeSpins()
    // {
    //
    //   $prizeType = $wonPrizes['type'];
    //   if($prizeType == freespins)
    //   {
    //     $this->updateFreeSpins();
    //   }
    // }


    /**
     * @func click
     * @desc This function is called when player plays the bonus round.
     *       On completion , this bonus round triggers the freespins. The
     *       values won here will sum up to grant freespin with multiplier.
	 *
     * @param $pickedPosition ranges between 0 to (numberofObjects -1)
     */
    public function playBonusGame($pickedPosition)
    {
        $pickedPosition = (int)$pickedPosition;
        $this->validatePick($pickedPosition);
        #game_data: {"prizes":[3,10,15,20,30,40,100,200,500],"won_prizes":{"type":"total_bet","num_prizes":20,"won_index":3}}

        $wonPrizes = $this->round->bonusGames['game_data']['won_prizes']; #"won_prizes":{"type":"total_bet","num_prizes":20,"won_index":3}

        $prizeType = $wonPrizes['type'];
        $numPrizes = $wonPrizes['num_prizes'];
        $totalPrizeValue = $numPrizes;

        array_push($this->round->bonusGames['picks_data'], $pickedPosition);
        $this->round->bonusGames['num_user_picks']++;
        $state = $this->getState();
        $winAmount = 0;

        if($prizeType == 'total_bet')
        {
          $winAmount = $this->round->totalBet * $numPrizes;
          $totalPrizeValue = $winAmount;
          $winAmount = to_base_currency($winAmount);
        }

        update_bonus_game($this->round->bonusGames['picks_data'],
                          $this->round->bonusGames['num_user_picks'],
                          $this->round->bonusGames['game_data'],
                          $winAmount, $state,
                          $this->round->bonusGames['round_id'],
                          $this->round->bonusGames['game_id'],
                          $this->accountId,
                          $this->round->bonusGames['id'],
                          $this->round->amountType);

        $this->round->bonusGameRound = Array(
            'prize'             => $prizeType,
            'prize_value'       => $numPrizes,
            'total_prize_value' => $totalPrizeValue,
            'num_picks'         => $this->getRemainingPicks(),
            'state'             => $state);

        if($prizeType == 'freespins')
        {
          $this->round->bonusGameRound['fs_multiplier'] =
            $this->round->bonusGames['game_data']['won_prizes']['fs_multiplier'];
        }

        if($state == 1 or $state == True)
        {
            $this->processPrizes($state);
        }
    }

    private function validatePick($pickedPosition)
    {
        $prevPicks = $this->round->bonusGames['picks_data'];
        $numPrizes = count($this->round->bonusGames['game_data']['prizes']);

        if(!isset($pickedPosition) or in_array($pickedPosition, $prevPicks) or
           $pickedPosition < 0 or $pickedPosition >= $numPrizes)
        {
          ErrorHandler::handleError(1, "PICKMEBONUS_0001", "Invalid pick position");
        }
    }

    public function getState()
    {
        return ($this->round->bonusGames['num_user_picks'] == $this->round->bonusGames['num_picks']) ?
            1 : 0;
    }

    private function processPrizes()
    {
      $gameData = $this->round->bonusGames['game_data'];
      if($gameData['won_prizes']['type'] == 'freespins') {
        $this->handleFreespins();
      }
      else if($gameData['won_prizes']['type'] == 'total_bet'){
        $winAmount = $this->round->totalBet * $gameData['won_prizes']['num_prizes'];
        $this->round->winAmount += $winAmount;
      }
    }

    private function handleFreespins() {
      $gameData = $this->round->bonusGames['game_data'];
      #print_r($gameData); #game_data: {"prizes":[3,10,15,20,30,40,100,200,500],"won_prizes":{"type":"total_bet","num_prizes":20," ":3}}
      $numFreeSpins = $gameData['won_prizes']['num_prizes'];
      $parentType = $this->round->getParentSpinType();
      $details = Array(
        'fs_game_id'    => $gameData['won_prizes']['fs_game_id'],
        'fs_multiplier' => $gameData['won_prizes']['fs_multiplier'],
        'parent_type'	=> $parentType);

      $roundIds = Array($this->round->bonusGames['round_id']);
      $history = Array($numFreeSpins);
      $spinType = 2;

      if(isset($this->round->freeSpins) && $this->round->freeSpins['spins_left'] > 0 &&
          $this->round->freeSpins['spins_left'] == $this->round->freeSpins['num_spins']) {
        $roundIds = $this->round->freeSpins['round_ids'];
        array_push($roundIds, $this->round->bonusGames['round_id']);
        $history = $this->round->freeSpins['history'];
        array_push($history, $numFreeSpins);

        $this->updateFreeSpins($this->round->freeSpins['id'], $this->game->gameId,
                        $this->accountId, $this->round->bonusGames['round_id'],$numFreeSpins,
                        $gameData['won_prizes']['fs_multiplier'],$this->round->amountType,
                        $roundIds, $history,
                        $details, 0);
      }
      else {
      award_freespins($this->game->gameId, $this->game->subGameId,
                    $this->accountId, $this->round->bonusGames['round_id'],
                    $numFreeSpins, $gameData['won_prizes']['fs_multiplier'],
                    $this->round->coinValue, $this->round->numCoins,
                    $this->round->numBetLines, $this->round->amountType,
                    $roundIds, $history, $spinType, $details);
      }
      $this->round->loadFreeSpins();

    }
    /**
     * @func isConfigValid
     * @desc This function verifies if bonus configuration is valid or not.
	 *
     * @param $config
     * @return true when config is valid (not null/empty) [true|false]
     */
    private function isConfigValid($config)
    {
        if(empty($config) or $config == Null or !$config)
        {
            return false;
        }

        return true;
    }

    /**
     * @func getBonusConfig
     * @desc This method returns bonus game's configuration
     *
     * @param $numSymbols Number of scatter symbols
     * @return Returns configuration if available or Null.
     */


    private function getBonusConfig($numSymbols)
    {
        global $db;

        $table = "game.bonus_config";
        $query = <<<QUERY
            SELECT configuration
              FROM $table
             WHERE game_name = "{$this->game->gameName}" AND
                   bonus_game_id = {$this->bonusGameId} AND
                   num_symbols = {$numSymbols}
QUERY;
        $rs = $db->runQuery($query) or ErrorHandler::handleError(1, "PICKMEBONUS_001");
        #print_r($rs);
        if($db->numRows($rs) <= 0)
        {
            return Null;
        }

        $row = $db->fetchRow($rs);
        #print_r($row);
        return $row[0];
    }

    private function updateFreeSpins($row_id, $game_id, $account_id, $base_round_id,
  													$num_spins, $multiplier=2, $amount_type=1, $round_ids,
  													$history, $details="", $state=0)
  	{
  		global $db;
  		$details = encode_objects($details);
  		$round_ids = encode_objects($round_ids);
  		$history = encode_objects($history);

  		$fs_query = <<<QRY
  		UPDATE gamelog.freespins
  			 SET spins_left = spins_left + {$num_spins},
  					 num_spins = num_spins + {$num_spins},
  					 details ='{$details}',
  					 round_ids = '{$round_ids}',
  					 history = '{$history}',
  					 multiplier = {$multiplier},
  					 state = 0
  		WHERE id = {$row_id} AND
  					account_id = {$account_id} AND
  					game_id = {$game_id} AND
  					amount_type = {$amount_type} AND
  					state = {$state}
QRY;


  		$result = $db->runQuery($fs_query) or ErrorHandler::handleError(1, "BONUSPICKS_003".$fs_query);
  		$this->round->loadFreeSpins();
  	}
}
?>
