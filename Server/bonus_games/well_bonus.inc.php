<?php
require_once 'ibonus.inc.php';

/**
 * @class WellBonusGame
 * @implements iBonus
 * @desc This class is used for the game Leprechauns Loot.
 *		 Gets called for the bonus game Golden Pot Well.
 *		 At end of the bonus game, free spins are granted with multiplier
 */

class WellBonusGame implements iBonus
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
            'type'          => 'bonus_game',
            'bonus_game_id' => $this->round->bonusGames['bonus_game_id'],
            'num_picks' => $this->getRemainingPicks(), #$this->round->bonusGames['num_picks'],
            'num_prizes' => count($this->round->bonusGames['game_data']['prizes']),
            'prizes_won' => $prizesWon,
            'pick_positions' => $this->round->bonusGames['picks_data']);
    }

    private function getRemainingPicks() {
        return $this->round->bonusGames['num_picks'] -
            $this->round->bonusGames['num_user_picks'];
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

        return $prizesWon;
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

        if(!$this->isConfigValid($config)) {
            return NULL;
		}

        $config = decode_object($config);
        $numPicks = $config['num_picks'];
        $numUserPicks = 0;
        $wonFreespins = Array();

        for($i = 0; $i < $numPicks; $i++) {
            $index = get_weighted_index($config['weights']);
            array_push($wonFreespins, $config['prizes'][$index]);
        }

        $bonusGameData = Array(
            'prizes'  => $config['prizes'],
            'won_freespins' => $wonFreespins,
            'fs_game_id'  => $config['fs_game_id'],
            'fs_multiplier' => $config['fs_multiplier']);

        $bonusGameData = encode_objects($bonusGameData);
        # @todo TODO insert coin_valu, num_coins, num_betlines also while awarding bonus game
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
        $wonFreespins = $this->round->bonusGames['game_data']['won_freespins'];
        $numFreespins = $wonFreespins[$this->round->bonusGames['num_user_picks']];

        array_push($this->round->bonusGames['picks_data'], $pickedPosition);
        $this->round->bonusGames['num_user_picks']++;
        $state = $this->getState();
        $winAmount = 0;


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
            'prize' => 'freespins',
            'prize_value' => $numFreespins,
            'total_prize_value' => $this->getTotalPrizeValue(),
            'fs_multiplier' => $this->round->bonusGames['game_data']['fs_multiplier'],
            'num_picks' => $this->getRemainingPicks(),
            'state' => $state);

        if($state == 1 or $state == True) {
            $this->processPrizes($state);
        }
    }

    private function getTotalPrizeValue() {
        $totalPrizeValue = 0 ;
        $numUserPicks = $this->round->bonusGames['num_user_picks'];
        $wonFreespins = $this->round->bonusGames['game_data']['won_freespins'];

        for($i = 0; $i < $numUserPicks; $i++) {
            $totalPrizeValue += $wonFreespins[$i];
        }

        return $totalPrizeValue;
    }

    private function validatePick($pickedPosition)
    {
        $prevPicks = $this->round->bonusGames['picks_data'];
        $numPrizes = count($this->round->bonusGames['game_data']['prizes']);

        if(!isset($pickedPosition) or in_array($pickedPosition, $prevPicks) or
           $pickedPosition < 0 or $pickedPosition >= $numPrizes) {
            ErrorHandler::handleError(1, "ROADBONUS_0001", "Invalid pick position");
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
        $numFreeSpins = array_sum($gameData['won_freespins']);
		$parentType = $this->round->getParentSpinType();
        $details = Array(
            'fs_game_id'    => $gameData['fs_game_id'],
            'fs_multiplier' => $gameData['fs_multiplier'],
			'parent_type'	=> $parentType);

        $roundIds = Array($this->round->bonusGames['round_id']);
        $history = Array($numFreeSpins);
		$spinType = 2;

        award_freespins($this->game->gameId, $this->game->subGameId,
                        $this->accountId, $this->round->bonusGames['round_id'],
                        $numFreeSpins, $gameData['fs_multiplier'],
                        $this->round->coinValue, $this->round->numCoins,
                        $this->round->numBetLines, $this->round->amountType,
                        $roundIds, $history, $spinType, $details);

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
        if(empty($config) or $config == Null or !$config) {
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
        $rs = $db->runQuery($query) or ErrorHandler::handleError(1, "WELLBONUS_001");
        if($db->numRows($rs) == 0) {
            return Null;
        }

        $row = $db->fetchRow($rs);
        return $row[0];
    }
}
?>
