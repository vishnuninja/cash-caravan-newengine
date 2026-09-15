<?php
require_once 'ibonus.inc.php';
/**
 * @class PostVegasBonus
 * @implements iBonus
 * @desc This class is used for the game Vegas Time.
 *       Gets called for the bonus game Vegas Time.
 */

class PostVegasBonus extends BonusPickGame
{
    protected $game;
    protected $round;
    protected $accountId;
    protected $symbol;
    protected $bonusGameId;
    protected $scattersCount;

    public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount)
    {
        $scattersCount['total'] = isset($scattersCount[$symbol]) ?  $scattersCount[$symbol] : null;
        $this->game = $game;
        $this->round = &$round;
        $this->accountId = $accountId;
        $this->symbol = $symbol;
        $this->bonusGameId = $bonusGameId;
        $this->scattersCount = $scattersCount;
    }
    /**
    * @func checkAndGrantBonusGame
    * @desc Gets called when there are 3 or more bonus symbols in screen.
    *       It awards free spins at the end of the bonus game
    */
    public function checkAndGrantBonusGame()
    { 
        $spinType = $this->round->spinType;
        $numScatters = $this->scattersCount['total'];

        $config = $this->getBonusConfig($numScatters, $spinType);

        if(!$this->isConfigValid($config)) {
          return null;
        }

        $config = decode_object($config);

        $numSpins = $config['num_spins'];

        if (isset($this->round->freeSpins) and !isset($this->round->game->misc["cap_bet"]))
        {
            $details = $this->round->freeSpins['details'];
            array_push($this->round->freeSpins['round_ids'], $this->round->roundId);
            array_push($this->round->freeSpins['history'], $numSpins);

            $this->updateFreeSpins( $this->round->freeSpins['id'],
                    $this->game->gameId, $this->accountId,
                    $this->round->freeSpins['base_round_id'],
                    $numSpins, $details['fs_multiplier'],
                    $this->round->amountType, $this->round->freeSpins['round_ids'],
                    $this->round->freeSpins['history'], $details);
            $fsGameWon = Array(
                    'type'       => "freespins",
                    'num_spins'  => $numSpins,
                    'spins_left' => $numSpins,
                    'multiplier' => $details['fs_multiplier'],
                    'parent_type'=> 'freespin');
            array_push($this->round->bonusGamesWon, $fsGameWon);
            return;
        } elseif (isset($this->round->game->misc["cap_bet"])) {
            return;
        }

        $bonusPool = Array();
        $prizeArray = Array();
        $prizes = $config['prizes'];
        $numPicks = $config['num_picks'];
        $multiplier = $config['fs_multiplier'];

        $rnd_keys = array_rand($prizes, $numPicks);

        $value1 = $prizes[$rnd_keys[0]];
        $value2 = $prizes[$rnd_keys[1]];

        if ($value1 < 4) {
            $multiplier += $value1;
            array_push($prizeArray, 'multiplier');
        } else {
            $numSpins += $value1;
            array_push($prizeArray, 'freespins');
        }
        if ($value2 < 4) {
            $multiplier += $value2;
            array_push($prizeArray, 'multiplier');
        } else {
            $numSpins += $value2;
            array_push($prizeArray, 'freespins');
        }
        array_push($bonusPool, $value1, $value2);

        $cap_amount = $config['cap_value'] * $this->round->totalBet;
        $bonusGameData = Array(
                'prizes'        => $prizes,
                'prizeArray'    => $prizeArray,
                'bonusPool'     => $bonusPool,
                'fs_multiplier' => $multiplier,
                'num_spins'     => $numSpins,
                'base_amount'   => $this->round->winAmount,
                'cap_amount'    => $cap_amount,
                'picked_prizes' => array(),
                'picked_values' => array(),
        );

        $bonusGameData = encode_objects($bonusGameData);

        // # @todo TODO insert coin_valu, num_coins, num_betlines also while awarding bonus game
        grant_bonus_game($this->game->gameId, $this->game->subGameId,
                            $this->round->roundId, $this->round->roundId,
                            $this->accountId, $this->bonusGameId,
                            $config['code'], $numPicks, $bonusGameData, $multiplier, 
                            $this->round->amountType, $this->round->coinValue,
                            $this->round->numCoins, $this->round->numBetLines);

        $bonusGameWon = Array(
                'type'          => 'bonus_game',
                'bonus_game_id' => $this->bonusGameId,
                'num_picks'     => $numPicks,
                'num_prizes'    => count($prizes));

        array_push($this->round->bonusGamesWon, $bonusGameWon); 
    }

    /**
    * @func load
    * @desc This function takes care of sending the in-complete bonus game details
    *   while be required to play the bonus game. Multiple picks are awarded
    *   to the player. In case game is played partially, need to send the picks
    *   information that is done so far.
    */
    public function loadBonusGame() {
        $gameData = $this->round->bonusGames['game_data'];

        $this->round->nextRound = Array(
                'type'          => 'bonus_game',
                'bonus_game_id' => $this->round->bonusGames['bonus_game_id'],
                'num_picks' => $this->getRemainingPicks(),
                'num_prizes' => count($this->round->bonusGames['game_data']['prizes']),
                'pick_positions' => $this->round->bonusGames['picks_data'],
                'picked_prizes' => $gameData['picked_prizes'],
                'picked_values' => $gameData['picked_values']);
    }

    public function playBonusGame($pickedPosition)
    {
        $pickedPosition = (int)$pickedPosition;
        $this->validatePick($pickedPosition);

        $gameData = $this->round->bonusGames['game_data'];
        $bonusPool = $gameData['bonusPool'];
        $prizeArray = $gameData['prizeArray'];

        $pool = $bonusPool[$this->round->bonusGames['num_user_picks']];
        $prize = $prizeArray[$this->round->bonusGames['num_user_picks']]; 

        array_push($this->round->bonusGames['picks_data'], $pickedPosition);
        array_push($gameData['picked_prizes'], $prize);
        array_push($gameData['picked_values'], $pool);
        $this->round->bonusGames['num_user_picks']++;
        $state = $this->getState();
        $winAmount = 0;

        update_bonus_game($this->round->bonusGames['picks_data'],
                            $this->round->bonusGames['num_user_picks'],
                            $gameData, $winAmount, $state,
                            $this->round->bonusGames['round_id'],
                            $this->round->bonusGames['game_id'],
                            $this->accountId,
                            $this->round->bonusGames['id'],
                            $this->round->amountType);
        
        $this->round->bonusGameRound = Array(
                'prize' => $prize,
                'prize_value' => $pool,
                'fs_multiplier' => $gameData['fs_multiplier'],
                'num_picks' => $this->getRemainingPicks(),
                'state' => $state);
        

        $parentType = $this->round->getParentSpinType();

        $details = Array(
            'parent_type' => $parentType,
            'fs_multiplier' => $gameData['fs_multiplier'],
            'base_amount' => $gameData['base_amount'],
            'cap_amount' => $gameData['cap_amount']
        );

        if($state == 1 or $state == True) {
            $this->processPrizes($state, $gameData, $details);
        }
    }

    private function processPrizes($state, $gameData, $details)
    {
        $numSpins = $gameData['num_spins'];
        $roundIds = Array($this->round->bonusGames['round_id']);
        $history = Array($numSpins);
        $spinType = 2;

        award_freespins($this->game->gameId, $this->game->subGameId,
                $this->accountId, $this->round->bonusGames['round_id'],
                $numSpins, $gameData['fs_multiplier'], $this->round->coinValue,
                $this->round->numCoins, $this->round->numBetLines,
                $this->round->amountType, $roundIds, $history, $spinType, $details);
        $this->nextRound($details, $numSpins, $numSpins);
    }

    private function nextRound($details, $numSpins, $spinsLeft)
    {
        $this->round->nextRound= Array(
                    'type'       => "freespins",
                    'num_spins'  => $numSpins,
                    'spins_left' => $spinsLeft,
                    'multiplier' => $details['fs_multiplier'],
                    'parent_type'=> $details['parent_type']);
    }

    private function getBonusConfig($numSymbols, $spinType)
    {
        global $db;

        $table = "game.bonus_config";
        $query = <<<QUERY
                SELECT configuration
                FROM $table
                WHERE game_name = "{$this->game->gameName}" AND
                 bonus_game_id = {$this->bonusGameId} AND
                 num_symbols = {$numSymbols} AND
                 spin_type = "{$spinType}"
QUERY;
        
        $rs = $db->runQuery($query) or ErrorHandler::handleError(1, "BONUSPICKS_001");
        if($db->numRows($rs) == 0) {
            return Null;
        }
        $row = $db->fetchRow($rs);
        return $row[0];
    }

    protected function isConfigValid($config)
    {
        if(empty($config) or $config == Null or !$config) {
            return false;
        }
        return true;
    }

    private function getRemainingPicks() {
        return $this->round->bonusGames['num_picks'] -
                $this->round->bonusGames['num_user_picks'];
    }

    private function validatePick($pickedPosition)
    {
        $prevPicks = $this->round->bonusGames['picks_data'];
        $numPrizes = count($this->round->bonusGames['game_data']['prizes']);

        if(!isset($pickedPosition) or in_array($pickedPosition, $prevPicks) or
             $pickedPosition < 0 or $pickedPosition >= $numPrizes) {
                ErrorHandler::handleError(1, "POSTBONUS_0001", "Invalid pick position");
        }
    }

    public function getState()
    {
        return ($this->round->bonusGames['num_user_picks'] == $this->round->bonusGames['num_picks']) ?
                1 : 0;
    }
}
?>