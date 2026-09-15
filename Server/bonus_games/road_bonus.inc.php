<?php
require_once 'ibonus.inc.php';

/**
 * @class RoadBonus
 * @implements iBonus
 * @desc This class is used for the game Leprechaun's Loot,
 *		 Rainbow Raod Bonus Game.This can act as a base class
 *		 as well that can be extened by other similar classes.
 */

class RoadBonus implements iBonus
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
     * @fun loadBonusGame()
     * @desc This function is used to load bonus game data which will be sent
     *       to the client for initializing Rainbow road Bonus Game.
     *       This bonus round will be having the multipliers and wheel values.
     */
    public function loadBonusGame()
    {
        $numUserPicks = $this->round->bonusGames['num_user_picks'];
        $gameData = $this->round->bonusGames['game_data'];

        $this->buildBonusData($numUserPicks, $gameData['picked_wheel_values']);
    }

    protected function buildBonusData($numUserPicks, $pickedValues)
    {
        $this->round->nextRound['picked_wheel_values'] = Array();

        for($i = 0; $i < $numUserPicks; $i++) {
            $this->round->nextRound['picked_wheel_values'][]
                = $this->getWheelValue($pickedValues[$i]);
        }

        $gameData = $this->round->bonusGames['game_data'];
        $this->round->nextRound['type'] = 'bonus_game';
        $this->round->nextRound['bonus_game_id'] = $this->round->bonusGames['bonus_game_id'];
        $this->round->nextRound['num_picks'] = $this->round->bonusGames['num_picks'];
        $this->round->nextRound['num_prizes'] = count($gameData['prizes']);
        $this->round->nextRound['prizes'] = $gameData['prizes'];
    }

    private function getWheelValue($pickedValue) {
        if($pickedValue >= 1 && $pickedValue <= 3) {
            return $pickedValue - 1;
        }

        return $pickedValue;
    }

	/**
     * @fun checkAndGrantBonusGame()
     * @desc This function is called to check if bonus game can be granted.
     *       This bonus round will be having the multipliers and wheel values.
     */
    public function checkAndGrantBonusGame()
    {
        $totalScatters = $this->scattersCount['total'];
        $conf = $this->getBonusGameConfig($totalScatters);
        if(!$this->isConfigValid($conf)) {
            return null;
		}

        $conf = decode_object($conf);

		/**
		 * Wheel Values are indexes of the wheel positions starting from 0 to 7.
		 * index-0: Value-1, index-1: Value-2, index-2: Value-3
		 * index-3: Value-collect, index-4: Value-4, index-5: Value-5,
		 * index-6: Value-6, index-7: Value-collect
		 */
        $wheelValues = $conf['wheel_config'];
        $multiplier = to_base_currency($this->round->totalBet);

        $rainbowConfig = $this->getRoadConfig($conf);
        $winIndex = $this->getWinningIndex($rainbowConfig); # getWinningIndex
        $numTotalPrizes = count($rainbowConfig['prizes']);
        $winPosition = $winIndex + 1;
        $optedWheelValues = $this->getWheelValues($wheelValues, $winPosition, $numTotalPrizes);

		/**
		 * Number of clicks awarded to the player will be equal to the
		 * number of optedWheelValues.
		**/
        $numPicks = count($optedWheelValues);
        $code = $conf['code'];

        $configuration = $this->buildConfig($rainbowConfig,
                                             $wheelValues,
                                             $winIndex,
                                             $optedWheelValues);

        $game_data = encode_objects($configuration);

        grant_bonus_game($this->game->gameId, $this->game->subGameId,
                         $this->round->roundId, $this->round->roundId,
                         $this->accountId, $this->bonusGameId, $code,
                         $numPicks, $game_data, $multiplier, $this->round->amountType,
                         $this->round->coinValue, $this->round->numCoins,
                         $this->round->numBetLines);

        $bonusGameData = Array(
            'type'          => 'bonus_game',
            'bonus_game_id' => $this->bonusGameId,
            'num_picks'     => $numPicks,
            'num_prizes'    => $numTotalPrizes,
            'prizes'        => $rainbowConfig['prizes']);

        array_push($this->round->bonusGamesWon, $bonusGameData);
    }

	/**
    * @fun 	playBonusGame()
    * @desc This function is called during bonus game play.
    *       to the client for initializing Rainbow road Bonus Game.
    *       This bonus round will be having the multipliers and wheel values.
	* @param $pickedPosition
	*
    * @return Winnings in current pick play
    */
    public function playBonusGame($pickedPosition)
    {
        $this->validatePick($pickedPosition);

        $numUserPicks = $this->round->bonusGames['num_user_picks'];
        $objects = $this->round->bonusGames['game_data'];
        $winIndex = $objects['winning_index'];

        $multiplier = $this->getWinnings($winIndex, $objects['prizes']);
        array_push($this->round->bonusGames['picks_data'], $pickedPosition);
        $this->round->bonusGames['num_user_picks']++;
        $state = $this->getState();
        $winAmount = $this->getWinAmount($state, $multiplier);

        update_bonus_game($this->round->bonusGames['picks_data'],
                          $this->round->bonusGames['num_user_picks'],
                          $this->round->bonusGames['game_data'],
                          $winAmount, $state,
                          $this->round->bonusGames['round_id'],
                          $this->round->bonusGames['game_id'],
                          $this->accountId,
                          $this->round->bonusGames['id'],
                          $this->round->amountType);

        $wheelValues = $objects['wheel_config'];
        $numUserPicks = $this->round->bonusGames['num_user_picks'];
        $wheelValue = $this->getCurrentWheelValue($numUserPicks - 1,
												  $objects['picked_wheel_values']);
        $wheelValueIndex = $this->getWheelValueIndex($wheelValues[$wheelValue]);

        // getting the current road position and current multiplier on the road.
        $currentRainbowIndex = $this->getCurrentRainbowPosition($numUserPicks, $objects['picked_wheel_values']);

        // currentRainbowIndex is the sum of all prev wheel values
        $currentRainbowIndex = $currentRainbowIndex - 1;
        $multiplier = $this->getWinnings($currentRainbowIndex, $objects['prizes']);

        # Wheel value to be shown in the game client
        $this->round->bonusGameRound['wheel_value'] = $wheelValueIndex;

        # indicates, what kind of `prize` is awarded
        $this->round->bonusGameRound['prize'] = 'multiplier';

        # indicates the value of the `prize`
        $this->round->bonusGameRound['prize_value'] = $multiplier;

        # indicates the monetary value of the `prize` awarded.
        $winAmount = to_coin_currency($this->getWinAmount(1, $multiplier));
        $this->round->bonusGameRound['win_amount'] = $winAmount;
        $this->round->bonusGameRound['state'] = $state;

        if($state === 1) {
            $this->round->winAmount += $winAmount;
            array_push($this->round->winLineNumbers, 
                    Array("road_bonus", $this->round->winAmount, $multiplier));
        }
    }

	/**
     * @fun  validatePick()
     * @desc Verifies if the pick position sent by player is valid one
     * @param $pickedPosition
     */
    private function validatePick($pickedPosition)
    {
        if($pickedPosition != -1) {
            ErrorHandler::handleError(1, "ROADBONUS_0001", "Invalid pick position");
        }
    }

    public function getState()
    {
        return ($this->round->bonusGames['num_user_picks'] == $this->round->bonusGames['num_picks']) ?
            1 : 0;
    }

    public function getWinAmount($state, $multiplier)
    {
        if($state == 1 or $state == True)
        {
            return $this->round->getBonusGameWinAmount($multiplier);
        }

        return 0;
    }

    /**
     * @fun getWinnings
     * @desc This function returns multiplier on the current road position
	 *
     * @return The multiplier on current position.
     */
    protected function getWinnings($current_road_index, $values)
    {
        return $values[$current_road_index];
    }

    /**
     * @fun getCurrentRainbowPosition
     * @desc This protected function will return the current position of player
     *       on the road feature. It does by adding all the wheel values selected
     *       for player so far.
     * @param $user_clicks
     * @param $selected_wheel_values The wheel values selected for player.
     * @return The current position of player on road.
     */
    protected function getCurrentRainbowPosition($user_clicks, $selected_wheel_values)
    {
        $current_road_index = 0;

        for($i = 0; $i < $user_clicks; $i++)
            $current_road_index += $selected_wheel_values[$i];

        return $current_road_index;
    }

    /**
     * @fun getRoadConfig
     * @desc This protected function is used to select the values to be used by
     *       the bonus round based on the flag index.
     * @param $conf
     * @param $feature_type Flag index selected for bonus round.
     * @return The values to be used by client.
     */
    protected function getRoadConfig($conf)
    {
        return $conf['config'];
    }

    /**
     * @fun getWinningIndex
     * @desc This function selects the index of the value which is the prize
     *       won by player. The values are based on weight. Hence,
     *       values are selected randomly bases on the given weights.
	 *
     * @param $config The values selected for player.
	 *
     * return WinningIndex
     */
    protected function getWinningIndex($config)
    {
        return get_weighted_index($config['weights']);
    }

    /**
     * @fun buildConfig
     * @desc This function builds the array of the values which will
     *       be used during bonus game play
	 *
     * @param $config
     * @param $wheelValues
     * @param $winningIndex
     * @param $optedWheelValues
     * @return The array containing all the values which will be required during
     *         game play.
     */
    protected function buildConfig($config, $wheelValues, $winningIndex, $optedWheelValues)
    {
        return Array('prizes' => $config['prizes'],
                     'wheel_config' => $wheelValues,
                     'winning_index' => $winningIndex,
                     'picked_wheel_values' => $optedWheelValues);
    }

    /**
     * @fun getWheelValues
     * @desc This function generates the indexes on wheel which are used to
     *       determin the winning index. When non zero indexes lead to
     *       the winning index then an additional zero index will be inserted so
     *       as to show the player that bonus has ended as zero indicates the end
	 *		 of the bonus game
     *
     */
    protected function getWheelValues($wheelValues, $winPosition, $numObjects)
    {
        $newWheelValues = array();
        $currentIndex = 0;
        $numValues = count($wheelValues);
        $numValues--;
        $wheelValue = 0;

        while($currentIndex < $winPosition)
        {
            $wheelValue = get_random_number(1, $numValues);
            $currentIndex += $wheelValue;
            $newWheelValues[] = $wheelValue;
        }

		# If current index goes beyond the winning index, then need to
		# get new index such that current index would reach the winning inde
        if($currentIndex > $winPosition)
        {
            array_pop($newWheelValues);
            $newValue = $winPosition - $currentIndex + $wheelValue;
            $newWheelValues[] = $newValue;
        }

		# When both currentIndex and winning_index are same, then need to
		# inform client that bonus came to end by sending zero index value
        if($winPosition < $numObjects)
            $newWheelValues[] = 0;

        return $newWheelValues;
    }

    /**
     * @fun getWheelValueIndex
     * @desc This function selects an index of wheel value on the
     *       wheel. Same value can be generate more than once on wheel.
     *       Hence, indexes are selected with equal chance.
     *
     */
    protected function getWheelValueIndex($indexes)
    {
        $num = count($indexes);
        $r = get_random_number(0, $num - 1);

        return $indexes[$r];
    }

    /**
     * @fun getCurrentWheelValue
     * @desc This function returns the current wheel value selected for player.
	 *
     * @return The current wheel value for current road play.
     */
    protected function getCurrentWheelValue($userClicks, $optedWheelValues)
    {
        return $optedWheelValues[$userClicks];
    }

    /**
     * @fun		getBonusGameConfig
     * @desc 	This function retrieves the feature configuration for the bonus round
     *       	based on the feature id , gamename and bonus occurrence.
	 *
     * @param 	$occurrence It is count of the scatter symbol.
     * @return 	If there is any configuration then it will return that array else NULL.
     */
    protected function getBonusGameConfig($occurrence)
    {
        global $db;

        $table = "game.bonus_config";
        $sql = <<<SQL
            SELECT configuration
              FROM $table
             WHERE game_name = "{$this->game->gameName}" AND
				   bonus_game_id = {$this->bonusGameId} AND
				   num_symbols = {$occurrence}
SQL;

        $rs = $db->runQuery($sql) or ErrorHandler::handleError(1, "BONUS_CONFIG_ERR1");
        $data = $db->fetchRow($rs);
        return $data[0];
    }

    /**
     * @fun	 isConfigValid
     * @desc Verifies if the configuration is available or valid
     *
     * @param $config
     * @return true if config is valid [true|false]
     */
    protected function isConfigValid($config)
    {
        if(empty($config) or !isset($config) or $config == '')
            return false;

        return true;
    }
}
?>
