<?php
class PickFreeGame extends BonusPickGame{
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
	public function checkAndGrantBonusGame()
	{
		$numScatters = $this->scattersCount['total'];
		$config = $this->getBonusConfig($numScatters, $this->round->spinType);

		if(!$this->isConfigValid($config)) {
			return null;
		}
		$config = decode_object($config);

		$numPicks = $config['num_picks'];
		$multiplier = $config['fs_multiplier'];
		$numPrizes = $config['num_prizes'];

		$bonusGameData = Array(
			'num_picks' => $numPicks,
			'num_prizes' => $numPrizes,
			'prizes'  => $config['prizes'],
			'num_scatters' => $numScatters,
			'fs_multiplier' => $multiplier,
			'parent_type'   => "normal",
			'pick_details'  => array()
		);

		$bonusGameData = encode_objects($bonusGameData);

		grant_bonus_game($this->game->gameId, $this->game->subGameId,
						$this->round->roundId, $this->round->roundId,
						$this->accountId, $this->bonusGameId,
						$config['code'], $numPicks, $bonusGameData,
						1, $this->round->amountType, $this->round->coinValue,
						$this->round->numCoins, $this->game->paylines);
		$bonusGameWon = Array(
			'type' => 'bonus_game',
			'bonus_game_id' => $this->bonusGameId,
			'num_picks' => $numPicks,
			'num_prizes' => $numPrizes
			);

		array_push($this->round->bonusGamesWon, $bonusGameWon);
	}
	public function calculatePrizes($state, $pickedPosition)
	{
		$gameData = $this->round->bonusGames['game_data'];

		$index = $pickedPosition;
		$wonFeatures = $gameData['prizes'][$index];

		if ($pickedPosition == 0) {
			$weights = $wonFeatures['weights'];
			$fsGameIds = $wonFeatures['fs_game_id'];
			$rndIndexes = $wonFeatures['rnd_indx'];
			$indx = get_weighted_index($weights);
			$wonFeatures['fs_game_id'] =  $fsGameIds[$indx];
			$wonFeatures['rnd_indx'] =  $rndIndexes[$indx];
			#array_splice($wonFeatures,"weights",1);
		}
		$fsGameId = $wonFeatures['fs_game_id'];
		$numSpins = $wonFeatures['freespins'];
		$wonFeatures['parent_type'] = 'normal';
		$wonFeatures['fs_multiplier'] = $gameData['fs_multiplier'];
		$wonFeatures['fs_mode'] = $pickedPosition;
		$gameData = $wonFeatures;
		$temp = array(
            "collection_count" => 0,
            "multiplier" => 1,
            "collection_pos" => "",
            "parent_type" => $pickedPosition,
        );
        $gameData["bonus_details"] = array($temp);
		$this->round->bonusGames['game_data'] = $gameData;
		$this->updateBonusGame($state);
		$this->round->bonusGameRound = Array(
							'prize' => 'freespins',
							'num_spins' => $numSpins,
							'spins_left' => $numSpins,
							"parent_type" => $index,
							'state'=> $state);
		if ($state == 1 or $state == True) {
			$this->processPrizes($state, $numSpins, $gameData);
			$this->round->nextRound = array( "type" => "freespins",
										'num_spins' => $numSpins,
										'spins_left' => $numSpins,
										'parent_type' => $index,
										'multiplier' => 1);
		}
	}
	private function processPrizes($state, $num_freespins, $gameData)
	{
		$round_ids = ''; $history = ''; $spin_type=2;
		$multiplier = $gameData['fs_multiplier'];

		// Add number of spins and number of spins left in freespins table.
		award_freespins($this->game->gameId, $this->game->subGameId,
						$this->accountId, $this->round->bonusGames['round_id'],
						$num_freespins, $multiplier,
						$this->round->coinValue, $this->round->numCoins,
						$this->game->paylines, $this->round->amountType,
						$round_ids, $history, $spin_type, $gameData);

		#$this->setNextRound($num_freespins, $multiplier);
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
}
?>