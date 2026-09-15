<?php
require_once 'ibonus.inc.php';

class PickJackpotFeature extends BonusPickGame implements iBonus {
    protected $game;
    protected $round;
    protected $accountId;
    protected $symbol;
    protected $bonusGameId;
    protected $scattersCount;

    public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount) {
        $scattersCount['total'] = isset($scattersCount[$symbol]) ?  $scattersCount[$symbol] : null;
        $this->game = $game;
        $this->round = $round;
        $this->accountId = $accountId;
        $this->scattersCount = $scattersCount;
        $this->symbol = $symbol;
        $this->bonusGameId = $bonusGameId;
    }

    public function checkAndGrantBonusGame() {
        $spinType = $this->round->spinType;
        $numScatters = $this->scattersCount['total'];
        $config = $this->getBonusConfig($numScatters, $spinType);

        if(!$this->isConfigValid($config)) {
          return null;
        }

        $config = decode_object($config);

        $numPicks = $config['num_picks'];
        $prizes = $config['prizes'];
        $jackpotPool = $config['jackpot_pool'];
        $startFreegames = $prizes[0];
        $minPicks = $config['min_picks'];

        foreach ($prizes as $prize) {
            if (array_key_exists($prize, $jackpotPool)) {
                $jackpotPool[$prize]['base'] *= $this->round->totalBet;
            } 
        }

        $id = $roundIds = $history = Null;
        $baseRoundId = $this->round->roundId;

        $won_prizes = Array();
        for ($i = 0; $i < $numPicks; $i++) {
            $prizeValue = weighted_random_number($config['weights'], $prizes);
            if($i >= $minPicks) {
                $prizeValue = $startFreegames;
            }
            array_push($won_prizes, $prizeValue);
            if ($prizeValue == $startFreegames) {
                break;
            }
        }
	
	$won_prizes = Array("boost_jackpot_3", "boost_jackpot_4", "additional_freespins", "start_free_games");

        $bonusGameData = Array(
            'id'                    => $id,
            'num_picks'             => $numPicks, // 10
            'prizes'                => $prizes,
            'won_prizes'            => $won_prizes,
            'jackpotPool'           => $jackpotPool,
            'fs_multiplier'         => $config['fs_multiplier'],
            'fs_game_id'            => $config['fs_game_id'],
            'num_spins'             => $config['num_spins'],
            'num_freespins'         => $config['num_freespins'][$numScatters],
            'additional_freespins'  => $config['additional_freespins'],
            'start_free_games'      => $startFreegames,
            'round_ids'             => $roundIds,
            'history'               => $history
        );

        $bonusGameData = encode_objects($bonusGameData);

        # @todo TODO insert coin_value, num_coins, num_betlines also while awarding bonus game
        grant_bonus_game($this->game->gameId, $this->game->subGameId,
                         $baseRoundId, $this->round->roundId,
                         $this->accountId, $this->bonusGameId,
                         $config['code'], count($won_prizes), $bonusGameData,
                         $config['fs_multiplier'], $this->round->amountType,
                         $this->round->coinValue, $this->round->numCoins,
                         $this->round->numBetLines);

        $bonusGameWon = Array(
                'type'          => 'bonus_game',
                'bonus_game_id' => $this->bonusGameId,
                'num_picks'     => $numPicks,   // 10
                'num_prizes'    => count($prizes)
        );

        array_push($this->round->bonusGamesWon, $bonusGameWon);
        $this->setFreeSpinState();
    }

    public function loadBonusGame() {
        $gameData = $this->round->bonusGames['game_data'];

        $this->round->nextRound = Array(
            'type'          => 'bonus_game',
            'bonus_game_id' => $this->round->bonusGames['bonus_game_id'],
            'num_picks'     => $this->round->bonusGames['game_data']['num_picks'],
            'num_prizes'    => count($this->round->bonusGames['game_data']['prizes']),
            'pick_positions'=> $this->round->bonusGames['picks_data'],
	    'num_freespins' => $this->round->bonusGames['game_data']['num_spins'],
            'jackpotPool'   => $this->round->bonusGames['game_data']['jackpotPool']
        );
    }

    public function playBonusGame($pickedPosition)
    {
        $pickedPosition = (int)$pickedPosition;
        $this->validatePick($pickedPosition);

        $gameData = $this->round->bonusGames['game_data'];
        $numSpins = $gameData['num_spins'];
        $numFreespins = $gameData['num_freespins'];
        $additionalFreespins = $gameData['additional_freespins'];
        $won_prizes = $gameData['won_prizes'];
        $jackpotPool = $gameData['jackpotPool'];
        $startFreegames = $gameData['start_free_games'];
        
        $prize = $won_prizes[$this->round->bonusGames['num_user_picks']];
        array_push($this->round->bonusGames['picks_data'], $pickedPosition);
        $this->round->bonusGames['num_user_picks']++;

        // Client Information
        $numPicks = $gameData['num_picks'];
        $numPicks--;

        if (array_key_exists($prize, $jackpotPool)) {   
            $jackpotPool[$prize]['base'] += ($jackpotPool[$prize]['multiplier'] * $this->round->totalBet);
            $jackpotPool[$prize]['starting_count'] += 1;
        } elseif ($prize == "additional_freespins") {
            $numSpins += $additionalFreespins;
        } else {
            $numSpins += $numFreespins;
        }

        $gameData['num_spins']      = $numSpins;
        $gameData['jackpotPool']    = $jackpotPool;
        $gameData['num_picks']      = $numPicks;

        $state = $this->getState();
        $winAmount = 0;

        update_bonus_game($this->round->bonusGames['picks_data'],
                        $this->round->bonusGames['num_user_picks'],
                        $gameData, $winAmount, $state,
                        $this->round->bonusGames['round_id'],
                        $this->round->bonusGames['game_id'],
                        $this->accountId,
                        $this->round->bonusGames['id']);
        
        $this->round->bonusGameRound = Array(
            'prize'         => $prize,
            'num_spins'     => $gameData['num_spins'],
            'jackpot_pool'  => $gameData['jackpotPool'],
            'fs_multiplier' => $gameData['fs_multiplier'],
            'state'         => $state,
        );
        
        if($state == 1 or $state == True) {
            $this->processPrizes($gameData, $state);
        }
    }

    private function processPrizes($gameData, $state)
    {
        $numSpins = $gameData['num_spins'];
        $parentType = $this->round->getParentSpinType();
        $round_id = $this->round->bonusGames['round_id'];

        $details = Array(
            'id'                    => $gameData['id'],
            'parent_type'           => $parentType,
            'fs_game_id'            => $gameData['fs_game_id'],
            'fs_multiplier'         => $gameData['fs_multiplier'],
            'prizes'                => $gameData['prizes'],
            'jackpot_pool'          => $gameData['jackpotPool'],
	    'feature_details'       => $gameData['jackpotPool'],
            'jackpot_reward'        => 0
        );
        
        if (isset($this->round->freeSpins) or isset($details['id'])) {
            $id = $details['id'];
            $roundIds = $gameData['round_ids'];
            $history = $gameData['history'];
            array_push($roundIds, $round_id);
            array_push($history, $numSpins);

            if (isset($this->round->freeSpins)) {
                $id = $this->round->freeSpins['id'];
                $state = 0;
            }
            
            $this->updateFreeSpins( $id, $this->game->gameId, $this->accountId,
             $round_id, $numSpins, $details['fs_multiplier'], $this->round->amountType, 
             $roundIds, $history, $details, $state);

            $this->nextRound($details, $this->round->freeSpins['num_spins'],
                    $this->round->freeSpins['spins_left']);
        }
        else {
            $roundIds = Array($round_id);
            $history = Array($numSpins);
            $spinType = 2;

            award_freespins($this->game->gameId, $this->game->subGameId,
                    $this->accountId, $round_id, $numSpins, $gameData['fs_multiplier'], 
                    $this->round->coinValue, $this->round->numCoins, $this->round->numBetLines,
                    $this->round->amountType, $roundIds, $history, $spinType, $details);
            $this->nextRound($details, $numSpins, $numSpins);
        }
    }

    private function nextRound($details, $numSpins, $spinsLeft)
    {
        $this->round->nextRound= Array(
                    'type'       => "freespins",
                    'num_spins'  => $numSpins,
                    'spins_left' => $spinsLeft,
                    'multiplier' => $details['fs_multiplier'],
                    'parent_type'=> $details['parent_type']
                );
    }

    private function getRemainingPicks() {
        return $this->round->bonusGames['num_picks'] -
                $this->round->bonusGames['num_user_picks'];
    }

    private function validatePick($pickedPosition)
    {
        $prevPicks = $this->round->bonusGames['picks_data'];
        $numPrizes = count($this->round->bonusGames['game_data']['won_prizes']);

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
    private function setFreeSpinState() {
        if (count($this->round->bonusGamesWon) > 0) {
            $this->game->misc['fs_state'] = null;
        }
    }
}
?>
