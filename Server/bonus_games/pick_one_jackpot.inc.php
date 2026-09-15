<?php
require_once 'ibonus.inc.php';

class PickOneJackpot extends BonusPickGame implements iBonus {
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
        $symbol = $config['symbol'];
        $count = get_element_count($this->round->matrixFlatten, $symbol);
        if($count < 3){
            return;
        }
        $numPicks = $config['num_picks'];
        $prizes = $config['prizes'];
        $jackpotPool = $config['jackpot_pool'];
        $startFreegames = $prizes[0];
        $minPicks = $config['min_picks'];

        $id = $roundIds = $history = Null;
        $baseRoundId = $this->round->roundId;

        $won_prizes = Array();
        $bonusGameData = Array(
            'id'                    => $id,
            'num_picks'             => $numPicks, // 10
            'prizes'                => $prizes,
            'won_prizes'            => $won_prizes,
            'jackpotPool'           => $jackpotPool,
            'fs_multiplier'         => $config['fs_multiplier'],
            'fs_game_id'            => $config['fs_game_id'],
            'num_spins'             => $config['num_spins'],
            'wild_positions'        => "",
            'round_ids'             => $roundIds,
            'history'               => $history,
            'total_picks'           => $numPicks
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
    }

    public function loadBonusGame() {
        $gameData = decode_object( $this->round->bonusGames['game_data']);
        $this->round->nextRound = Array(
            'type'          => 'freespins',
            'bonus_game_id' => $this->round->bonusGames['bonus_game_id'],
            'num_picks'     => $gameData['num_picks'],
            'num_prizes'    => count($gameData['prizes']),
            'pick_positions'=> $this->round->bonusGames['picks_data'],
	        'num_freespins' => $gameData['num_spins'],
            'jackpotPool'   => $gameData['jackpotPool'],
            'wild_positions'   => $gameData['wild_positions']
        );

        if(!isset($gameData['jackpot_reward'])){
            $this->round->nextRound["subtype"] = 'showsoldiers';
        }
        else{
            $this->round->nextRound["subtype"] = 'freespins';
        }
    }
    public function playBonusGame($pickedPosition)
    {
        $prizeValue = 0;
        $pickedPosition = (int)$pickedPosition;
        $this->validatePick($pickedPosition);
        $gameData = $this->round->bonusGames['game_data'];
        
        $gameData = decode_object($gameData);
        $pickedInfo = $gameData['jackpotPool'][$pickedPosition];
        $cases = $gameData['jackpotPool'][$pickedPosition]['case'];
        $freq = $gameData['jackpotPool'][$pickedPosition]['frequency'];
        $numSpins = $pickedInfo['freespins'];
        $won_prizes = $pickedInfo;
        $winAmount = 0;
        $jackpotPool = $gameData['jackpotPool'];
        if($pickedInfo['multiplier'] > 1){
            $prizeValue = $pickedInfo['multiplier'] * $this->round->totalBet;
            $this->round->winAmount = $prizeValue; 
            $winAmount = $prizeValue; 
        }
        

        $gameData['num_spins']      = $numSpins;
        $gameData['jackpotPool']    = $jackpotPool;
        $gameData['bonus_game_id']    = $this->bonusGameId;
        $gameData['wild_positions']    = "";
        $state = 0;
        $winAmount = 0;
        $this->processPrizes($gameData, $state, $pickedPosition);
        $state = 1;

        
        update_bonus_game($pickedPosition,
                        $this->round->bonusGames['num_user_picks'],
                        $gameData, $winAmount, $state,
                        $this->round->bonusGames['round_id'],
                        $this->round->bonusGames['game_id'],
                        $this->accountId,
                        $this->round->bonusGames['id'],$this->round->amountType);
            if($pickedPosition == 5){
                $this->round->loadFreeSpins();
                $this->round->freeSpins['spins_left'] = 1;
                $this->round->decrementAndLoadFreeSpins();
            
            
        }
        $this->round->bonusGameRound = Array(
            'prize_value'   => $prizeValue,
            'num_spins'     => $gameData['num_spins'],
            'picked_position'     => $pickedPosition,
            'fs_multiplier' => $prizeValue,
            'state'         => $state,
            'prize'             => 'multiplier',
            'bonus_game_id'=> $this->round->bonusGames['bonus_game_id'],
            'wild_positions'=> ""
        );
        
    }

    private function processPrizes($gameData, $state, $pickedPosition)
    {
        $pickedInfo = $gameData['jackpotPool'][$pickedPosition];
        $numSpins = $pickedInfo['freespins'];
        $parentType = $this->round->getParentSpinType();
        $round_id = $this->round->bonusGames['round_id'];
        $details = Array(
            'id'                    => $gameData['id'],
            'parent_type'           => $parentType,
            'fs_game_id'            => $pickedPosition+1,
            'fs_multiplier'         => $pickedInfo['multiplier'],
            'prizes'                => $gameData['prizes'],
            'jackpot_pool'          => $gameData['jackpotPool'],
	        'feature_details'       => $gameData['jackpotPool'][$pickedPosition],
            'jackpot_reward'        => $pickedPosition,
        );
        
        $roundIds = Array($round_id);
        $history = $pickedPosition;
        $spinType = 2;
        
            update_freespins($this->round->freeSpins['id'],$this->game->gameId, $this->game->subGameId,
            $this->accountId, $round_id, $numSpins, $pickedInfo['multiplier'], 
            $this->round->amountType, $roundIds, $history, $details);
        
        $this->nextRound($details, $numSpins, $numSpins);
    }


    private function nextRound($details, $numSpins, $spinsLeft)
    {

            $this->round->nextRound= Array(
                'type'       => "freespins",
                'num_spins'  => $numSpins,
                'spins_left' => $spinsLeft,
                'multiplier' => $details['fs_multiplier'],
                'parent_type'=> $details['parent_type'],
            );
        
    }

    private function getRemainingPicks() {
        return $this->round->bonusGames['num_picks'] -
                $this->round->bonusGames['num_user_picks'];
    }
    
    private function validatePick($pickedPosition)
    {

        $prevPicks = $this->round->bonusGames['picks_data'];
        if(!isset($pickedPosition) or in_array($pickedPosition, $prevPicks) or
            $pickedPosition < 0 or count($prevPicks) >= 1 ) {
                ErrorHandler::handleError(1, "POSTBONUS_0001", "Invalid pick position");
        }
    }


    private function getBonusConfig($numSymbols, $spinType) {
        global $db;
        $table = "game.bonus_config";
        $query = <<<QUERY
                SELECT configuration
                FROM $table
                WHERE game_name = "{$this->game->gameName}" AND
                 bonus_game_id = {$this->bonusGameId} AND
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

