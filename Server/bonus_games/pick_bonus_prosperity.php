<?php

class PickBonusProsperity implements iBonus {
	protected $game;
	protected $round;
	protected $accountId;
	protected $symbol;
	protected $bonusGameId;
	protected $scattersCount;

	public function __construct(&$game, &$round, $accountId,
						$bonusGameId, $symbol, $scattersCount)
	{
		$scattersCount['total'] = $scattersCount[$symbol];
		$this->game = $game;
		$this->round = $round;
		$this->accountId = $accountId;
		$this->scattersCount = $scattersCount;
		$this->symbol = $symbol;
		$this->bonusGameId = $bonusGameId;
	}

	public function getScattersCount()
	{
		$bonusConfig = $this->round->game->bonusConfig;
		$reelsLength = $bonusConfig['bonus_config'][$this->round->spinType]['reels_length'];
		$scattersCount = array('total' => 0);
		$matrixFlatten = Array();
		$matrix = $this->round->matrix;

		for($j = 0; $j < $this->round->game->numColumns; $j++) {
			for($i = 0; $i < $reelsLength[$j]; $i++) {
				array_push($matrixFlatten, $matrix[$i][$j]);
			}
		}

		foreach($this->round->game->scatters as $ind => $scatter) {
			$count = get_element_count($matrixFlatten, $scatter);
			$scattersCount[$scatter] = $count;
			$scattersCount['total'] += $count;
		}
		
		return $scattersCount;
	}

	public function getScattersPositions()
	{
		$positions = Array();
		$matrix = $this->round->matrix;

		if($this->round->spinType == 'freespin') {
			$reelLength = array_fill(0, $this->round->game->numColumns,
						$this->round->game->numRows);

			$bonusConfig = $this->round->game->bonusConfig;
			$reelLength = isset($bonusConfig['bonus_config']['freespin']['reels_length'])
				? $bonusConfig['bonus_config']['freespin']['reels_length'] : $reelLength;

			for($j = 0; $j < $this->round->game->numColumns; $j++) {
				for($i = 0; $i < $reelLength[$j]; $i++) {
					if( in_array($matrix[$i][$j], $this->round->game->scatters) ) {
						array_push($positions, $i*$this->round->game->numColumns+$j);
					}
				}
			}
		}
		else {
			$reelLength = $this->round->game->numRows;
			for($j = 0; $j < $this->round->game->numColumns; $j++) {
				for($i = 0; $i < $reelLength; $i++) {
					if(in_array($matrix[$i][$j], $this->round->game->scatters)) {
						array_push($positions, $i*$this->round->game->numColumns+$j);
					}
				}
			}
		}

		sort($positions);

		return $positions;
	}

	public function saveQueuedGame($config, $numScatters) 
	{
		$numPaylines = isset($this->game->misc['num_paylines']['freespin']) ? 
      	$this->game->misc['num_paylines']['freespin'] : $this->game->paylines;
      
    	$numPicks = $config['num_picks'];
    	$wonFeatures = Array(); 
    	$fsGameIds = Array();
      
    	$bonusGameData = Array(
	      	'prizes'  => $config['prizes'],
	      	'won_prizes'=> $wonFeatures,
	      	'fs_game_id'  => $fsGameIds,
	      	'num_scatters' => $numScatters,
	      	'fs_multiplier' => $config['fs_multiplier'],
	      	'win_ways_fs' => $numPaylines,
    	);

	$bonusGameData = encode_objects($bonusGameData);
	$base_round_id = $this->round->freeSpins['base_round_id'];

    	grant_queued_bonus($this->game->gameId, $this->game->subGameId,
            $base_round_id, $this->round->roundId,
            $this->accountId, $this->bonusGameId,
            $config['code'], $numPicks, $bonusGameData,
            1, $this->round->amountType, $this->round->coinValue,
            $this->round->numCoins, $this->game->paylines);
  	}

	public function checkAndGrantBonusGame()
	{
		$numScatters = $this->scattersCount['total'];

		if($this->round->spinType == 'freespin') {
			$this->scattersCount = $this->getScattersCount();
			$numScatters = $this->scattersCount['total'];
		}

		$config = $this->getBonusConfig($numScatters);

		if(!$this->isConfigValid($config)) {
			return null;
		}

		$config = decode_object($config);
		$scatterSymWin = $this->awardScatterWinAmount($numScatters);

		//@if condition: 
	    //Queue, triggered Bonus from any freespin except last freespin in
	    //which no bonus game is already queued .
	    if(isset($this->round->freeSpins) &&
	    	(($this->round->freeSpins['spins_left'] >= 2) ||
	    	($this->round->freeSpins['spins_left'] == 1 && 
	        	isset($this->round->queuedBonusGames) && 
	        	count($this->round->queuedBonusGames) > 0))) 
	    {
	      $this->saveQueuedGame($config, $numScatters);

	      // send info to client that bonus triggered and queued.
	      $bonusGameWon = Array(
	        'bonus_game_id' => $this->bonusGameId,
	        'num_picks' => $config['num_picks'],
	        'num_prizes' => count($config['prizes']),
	        'win_amount' => $scatterSymWin,
	        'type' => 'bonus_game',
	        'is_queued' => true
	      );

	      array_push($this->round->bonusGamesWon, $bonusGameWon);     

	      return ;
	    }

		$numPicks = $config['num_picks'];
		$wonFeatures = Array(); $fsGameIds = Array();
		/// Num of ways to be used in freespins. This will be used
	    // on the time of awarding freespin when it will be saved in 
	    // num_betlines col of freespins table.
	    $numPaylines = isset($this->game->misc['num_paylines']['freespin']) ? 
	      $this->game->misc['num_paylines']['freespin'] : $this->game->paylines;

	    $bonusGameData = Array(
		    'prizes'  => $config['prizes'],
		    'won_prizes'=> $wonFeatures,
		    'fs_game_id'  => $fsGameIds,
		    'num_scatters' => $numScatters,
		    'fs_multiplier' => $config['fs_multiplier'],
		    'win_ways_fs' => $numPaylines,
	    );

		$bonusGameData = encode_objects($bonusGameData);

		grant_bonus_game($this->game->gameId, $this->game->subGameId,
				$this->round->roundId, $this->round->roundId,
				$this->accountId, $this->bonusGameId,
				$config['code'], $numPicks, $bonusGameData,
				1, $this->round->amountType, $this->round->coinValue,
				$this->round->numCoins, $this->game->paylines);

		$bonusGameWon = Array(
			'bonus_game_id' => $this->bonusGameId,
			'num_picks' => $numPicks,
			'num_prizes' => count($config['prizes']),
			'win_amount' => $scatterSymWin,
			'type' => 'bonus_game');

		// Below "if" condition is to send "is_queued" true to
		// client when bonus triggered in last freespin, not queued and
		// bonus game inserted into bonus table.
		if( isset($this->round->freeSpins) && 
			$this->round->freeSpins['spins_left'] == 1 ) 
		{
			$bonusGameWon['is_queued'] = true;
			$this->round->nextRound = $bonusGameWon;
		}

		array_push($this->round->bonusGamesWon, $bonusGameWon);
	}

	public function awardScatterWinAmount($numScatters)
	{
		$scatterPositions = $this->getScattersPositions();
		$pay_table = $this->game->payTable;
		$scatters = $this->game->scatters[0];
		$key = $numScatters.$scatters;
		$win = 0;

		if(isset($pay_table[$key])) {
			$win = ($pay_table[$key] * $this->round->coinValue * $this->round->numCoins);
			$this->round->winAmount += $win;
		}

		$screenWins = array(
			'type' => 'screen_wins',
			'screen_symbol' => $this->round->game->scatters[0],
			'num_screen_symbols' => $numScatters,
			'win_amount' => $win,
			'multipler' => $pay_table[$key],
			'symbol_positions' => $scatterPositions,
		);

		array_push($this->round->screenWins, $screenWins);

		return $win;
	}

	public function loadBonusGame()
	{
		$gameData = $this->round->bonusGames['game_data'];

		$this->round->nextRound = Array(
			'bonus_game_id' => $this->round->bonusGames['bonus_game_id'],
			'num_picks' => $this->round->bonusGames['num_picks'],
			'num_prizes' => count($this->round->bonusGames['game_data']['prizes']),
			'prizes_won' => 'Bonus Game',
			'type' => 'bonus_game',
			'pick_positions' => $this->round->bonusGames['picks_data']);

		if(isset($this->round->bonusGames['game_data']['is_queued'])) { 
        	$this->round->nextRound['is_queued'] = 
            $this->round->bonusGames['game_data']['is_queued'];
    	}
	}

	public function playBonusGame($pickedPosition)
	{
		$pickedPosition = (int)$pickedPosition;
		$this->validatePick($pickedPosition);
		array_push($this->round->bonusGames['picks_data'], $pickedPosition);
		$this->round->bonusGames['num_user_picks']++;
		$state = $this->getState();

		$this->round->bonusGameRound = Array(
							'prize' => 'freespins',
							'prize_value' => '',
							'state' => $state);

		$this->calculatePrizes($state, $pickedPosition);
	}

	/*
	 *  @fun calculatePrizes.
	 *  There are seven prizes and out of them 1 will be selected by player.
	 *  All 7 prizes will be made available to the player with their features.
	 *  And its player's choice what player selects. Means selection is not 
	 *  random.
	 * */
	public function calculatePrizes($state, $picked_position)
	{
		$game_data = $this->round->bonusGames['game_data'];
		$numScatters = $game_data['num_scatters'];
		$won_features = ''; $fs_game_id = '';

		if(!$this->isConfigValid($game_data)) {
			return null;
		}

		$index = $picked_position;
		$won_features = $game_data['prizes'][$index]; 
		$fs_game_id = $won_features['fs_game_id'];
		$num_freespins = $won_features['freespins'];
		$multipliers = $won_features['multipliers'];
		$mult_weights = $won_features['weights'];

		if($multipliers == 'avg') {
			$details = $this->getMultimplier($game_data, $index);
			$multiplier = $details['multiplier'];
			$num_freespins = $details['num_freespins'];
			$fs_game_id = $details['fs_game_id'];
		}
		else if(is_array($mult_weights) && is_array($multipliers)) {
			$multiplier = weighted_random_number($mult_weights, $multipliers);
		}
		else {
			ErrorHandler::handleError(1, "FSPICKBONUS_0001", "Invalid Prize Config. Use dict");
		}

		$queued_bonus = isset($game_data['queued_bonus']) ? $game_data['queued_bonus'] : array();

		$fs_details = array('fs_game_id' => $fs_game_id,
							'fs_multiplier' => $multiplier,
							'queued_bonus' => $queued_bonus);

		$this->setCurrentRoundMessage($won_features, $multiplier, $num_freespins);
		$this->updateBonusGame($state);

		if($state == 1 or $state == True) {
			$this->processPrizes($state, $num_freespins, $game_data, $fs_details);
		}
	}

	public function setCurrentRoundMessage($won_features, $multiplier, $num_freespins)
	{
		$this->round->bonusGameRound['num_free_spins'] = $num_freespins;
		$this->round->bonusGameRound['fs_game_id'] = $won_features['fs_game_id'];
		$this->round->bonusGameRound['fs_multiplier'] = $multiplier;
	}

	public function updateBonusGame($state, $winAmount = 0)
	{
		update_bonus_game($this->round->bonusGames['picks_data'],
						$this->round->bonusGames['num_user_picks'],
						$this->round->bonusGames['game_data'],
						$winAmount, $state,
						$this->round->bonusGames['round_id'],
						$this->round->bonusGames['game_id'],
						$this->accountId,
						$this->round->bonusGames['id'],
						$this->round->amountType);
	}

	private function processPrizes($state, $num_freespins, $gameData, $details)
	{
		if($num_freespins <= 0) { return; }

		$round_ids = ''; $history = ''; $spin_type=2;
		$multiplier = $details['fs_multiplier'];
		$numWinWays = $gameData['win_ways_fs'];
		$base_round_id = $this->round->bonusGames['base_round_id'];

		// Add number of spins and number of spins left in freespins table.
		award_freespins($this->game->gameId, $this->game->subGameId,
						$this->accountId, $base_round_id,
						$num_freespins, $multiplier,
						$this->round->coinValue, $this->round->numCoins,
						$numWinWays, $this->round->amountType,
						$round_ids, $history, $spin_type, $details);

		$this->setNextRound($num_freespins, $multiplier);
	}

	public function setNextRound($num_freespins, $multiplier)
	{
		if($num_freespins) {
			$this->round->nextRound['num_spins'] = $num_freespins;
			$this->round->nextRound['spins_left'] = $num_freespins;
			$this->round->nextRound['fs_multiplier'] = $multiplier;
			$this->round->nextRound['type'] = 'freespins';
		}
	}

	public function getMultimplier($game_data, $index)
	{
		$prizes = $game_data['prizes'];
		$fs_game_id = $prizes[$index]['fs_game_id'];
		unset($prizes[$index]);
		$rand = get_random_number(0, count($prizes) - 1);
		$prize_set = $prizes[$rand];
		$multipliers = $prize_set['multipliers'];
		$mult_weights = $prize_set['weights'];
		$multiplier = weighted_random_number($mult_weights, $multipliers);
		$rand2 = get_random_number(0, count($prizes) - 1);
		$prize_set2 = $prizes[$rand2];
		$num_freespins = $prize_set2['freespins'];

		return array('multiplier' => $multiplier,
			'num_freespins' => $num_freespins,
			'fs_game_id' => $fs_game_id);
	}

	public function getState()
	{
		return ($this->round->bonusGames['num_user_picks'] ==
			$this->round->bonusGames['num_picks']) ? 1 : 0;
	}

	private function validatePick($pickedPosition)
	{
		$prevPicks = $this->round->bonusGames['picks_data'];
		$numPrizes = count($this->round->bonusGames['game_data']['prizes']);

		if(!isset($pickedPosition) or in_array($pickedPosition, $prevPicks) or
			$pickedPosition < 0 or $pickedPosition >= $numPrizes) {
			ErrorHandler::handleError(1, "FSPICKBONUS_0002", "Invalid pick position");
		}
	}

	private function isConfigValid($config)
	{
		if(empty($config) or $config == Null or !$config) {
			return false;
		}

		return true;
	}

	/*
	 * @fun getBonusConfig().
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
				   num_symbols = {$numSymbols} AND 
				   spin_type = "{$this->round->spinType}"
QUERY;
		$rs = $db->runQuery($query) or ErrorHandler::handleError(1, "FSPICKBONUS_0003");
		if($db->numRows($rs) == 0) {
			return Null;
		}

		$row = $db->fetchRow($rs);
		return $row[0];
	}
}
?>
