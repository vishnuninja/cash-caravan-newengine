<?php
require_once 'ibonus.inc.php';

/**
 * @class ExpandBonusSymbol
 * @implements iBonus
 * @desc This class is used for the game PiratesOfTheGrandLine.
 * It generates the expanding bonus symbols and triggers bonus game in main game.
 */

class ExpandBonusSymbol implements iBonus {
    protected $game;
    protected $round;
    protected $accountId;
    protected $symbol;
    protected $bonusGameId;
    protected $scattersCount;

    public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount) {
        $this->game = $game;
        $this->round = &$round;
        $this->accountId = $accountId;
        $this->symbol = $symbol;
        $this->bonusGameId = $bonusGameId;
        $scattersCount['total'] = isset($scattersCount[$symbol]) ?  $scattersCount[$symbol] : null;
        $this->scattersCount = $scattersCount;
    }

    /**
     * @func checkAndGrantBonusGame
     */
    public function checkAndGrantBonusGame() {
        $spinType = $this->round->spinType;
        $numScatters = $this->scattersCount['total'];
        $config = $this->getBonusConfig($numScatters, $spinType);

        if(!$this->isConfigValid($config)) {
          return null;
        }

        $config = decode_object($config);
        $numPick = $config['num_picks'];
        $numPrizes = $config['num_prizes'];
        $levels = $config['levels'];
        $multiplier = 1;

        $wonPrizes = array();
        $multipliers = array();

        $count = count($levels);
        for ($i = 0; $i < $count; $i++) {

            $weights = $config['variation'][$levels[$i]];
            $result = weighted_random_number($weights, $config['values']);
            //$result = "win";
            array_push($wonPrizes, $result);

            if ($result == "win") {
                $values = $config['multipliers'][$levels[$i]];
                $mult = weighted_random_number($config['weights'], $values);
                array_push($multipliers, $mult);
            } else {
                break;
            }
        }

        $numPicks = count($wonPrizes);
        $bonusGameData = Array(
            'levels'            => $levels,
            'numPick'           => $numPick,
            'won_prizes'        => $wonPrizes,
            'multipliers'       => $multipliers,
            'fs_multiplier'     => $config['fs_multiplier'],
        );

        $bonusGameData = encode_objects($bonusGameData);

        # @todo TODO insert coin_value, num_coins, num_betlines also while awarding bonus game
        grant_bonus_game($this->game->gameId, $this->game->subGameId,
                         $this->round->roundId, $this->round->roundId,
                         $this->accountId, $this->bonusGameId,
                         $config['code'], $numPicks, $bonusGameData, $multiplier,
                         $this->round->amountType, $this->round->coinValue,
                         $this->round->numCoins, $this->round->numBetLines);

        $bonusGameWon = Array(
            'type'          => 'bonus_game',
            'bonus_game_id' => $this->bonusGameId,
            'num_picks'     => $numPick,
            'num_prizes'    => $numPrizes
        );

        array_push($this->round->bonusGamesWon, $bonusGameWon);

    }

    public function loadBonusGame() {
        $gameData = $this->round->bonusGames['game_data'];

        $this->round->nextRound = Array(
            'type'          => 'bonus_game',
            'bonus_game_id' => $this->round->bonusGames['bonus_game_id'],
            'num_picks'     => $this->round->bonusGames['game_data']['numPick'],
            'num_prizes'    => 5,
            'pick_positions'=> $this->round->bonusGames['picks_data'],
            'prize'         => $this->round->bonusGames['game_data']['fs_multiplier'],
        );
    }

    /**
     * @func playBonusGame
     */
    public function playBonusGame($pickedPosition) {

        $pickedPosition = (int)$pickedPosition;
        $this->validatePick($pickedPosition);

        $gameData = $this->round->bonusGames['game_data'];

        $levels = $gameData['levels'];
        $prizes = $gameData['won_prizes'];
        $multiplier = $gameData['fs_multiplier'];
        $multipliers = $gameData['multipliers'];

        $numUserPicks = $this->round->bonusGames['num_user_picks'];
        $prize = $prizes[$numUserPicks];
        $level = $levels[$numUserPicks];
        array_push($this->round->bonusGames['picks_data'], $pickedPosition);

        if ($prize == "win") {
            $multiplier = $multipliers[$numUserPicks];
        } elseif ($prize == "lose") {
            $multiplier = $gameData['fs_multiplier'];
        }
        $this->round->bonusGames['num_user_picks']++;

        $gameData['fs_multiplier'] = $multiplier;

        $state = $this->getState();
        $winAmount = $multiplier * $this->round->totalBet;

        $winAmt = to_base_currency($winAmount);
        update_bonus_game($this->round->bonusGames['picks_data'],
                        $this->round->bonusGames['num_user_picks'],
                        $gameData, $winAmt, $state,
                        $this->round->bonusGames['round_id'],
                        $this->round->bonusGames['game_id'],
                        $this->accountId,
                        $this->round->bonusGames['id']);

        $this->round->bonusGameRound = Array(
            'level'             => $level,
            'result'            => $prize,
            'prize'             => 'multiplier',
            'prize_value'       => $multiplier,
            // 'num_picks'         => $this->getRemainingPicks(),
            'win_amount'        => $winAmount,
            'state'             => $state,
        );

        if ($state == 1 or $state == True) {
            $this->round->winAmount += $winAmount;
        }

    }

    private function getRemainingPicks() {
        return $this->round->bonusGames['num_picks'] -
                $this->round->bonusGames['num_user_picks'];
    }

    private function validatePick($pickedPosition)
    {
        $prevPicks = $this->round->bonusGames['picks_data'];
        $userPicks = $this->round->bonusGames['num_user_picks'];
        $numPrizes = count($this->round->bonusGames['game_data']['won_prizes']);

        if(!isset($pickedPosition) or ($pickedPosition != $userPicks)
             or in_array($pickedPosition, $prevPicks)) {
                ErrorHandler::handleError(1, "POSTBONUS_0001", "Invalid pick position");
        }
    }

    public function getState() {
        return ($this->round->bonusGames['num_user_picks'] == $this->round->bonusGames['num_picks']) ?
                1 : 0;
    }

    private function getBonusConfig($numSymbols, $spinType) {
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

    protected function isConfigValid($config) {
        if(empty($config) or $config == Null or !$config) {
            return false;
        }
        return true;
    }
}
?>
