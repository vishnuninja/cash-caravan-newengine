<?php
class ProgressBarDBZ implements iBonus {
	protected $game;
	protected $round;
	protected $accountId;
	protected $symbol;
	protected $bonusGameId;
	protected $scattersCount;

	public function __construct(&$game, &$round, $accountId,
						$bonusGameId, $symbol, $scattersCount)
	{
		//$scattersCount['total'] = $scattersCount[$symbol];
		$this->game = $game;
		$this->round = $round;
		$this->accountId = $accountId;
		$this->scattersCount = $scattersCount;
		$this->symbol = $symbol;
		$this->bonusGameId = $bonusGameId;
	}

	public function checkAndGrantBonusGame()
	{ 
		if($this->round->spinType == "freespin") {
			$this->progBarClient();

			return false;
		}

		$featureConfig = $this->game->bonusConfig; // From game.slots.bonus_config
		$postMatrixFeatures = $featureConfig['post_matrix_handlers'][$this->round->spinType];

		foreach($postMatrixFeatures as $index => $feature) {
			$details = $feature['details'];
		}

		// $details
		/*
		   Array
		   (
		   [sticky_symbol] => w
		   [bonus_symbol] => s
		   [range_bar] => 7
		   [prog_bar_sym] => Array
		   (
		   [0] => s
		   [1] => x
		   )

		   [level_length] => 0
		   [low_level] => 0
		   [high_level] => 0
		   )
		 */

		$bonus_symbol 		= $details['bonus_symbol'];
		$prog_bar_sym 		= $details['prog_bar_sym'];
		$bonus_sym_count 	= 0;
		$bar_range_limit	= $details['range_bar'];

		for($i = 0; $i < count($prog_bar_sym); $i++) {
			$bonus_sym_count += get_element_count($this->round->matrixFlatten, $prog_bar_sym[$i]);
		}
		/////////////////////////////////

		// handle avg coin value
		// Best player strategy. increase the coin values as raise meter increases. TODO simulation
		// first time base spin played
		// check in free spins
		// after free spin check base game spin.

		if( !isset($this->round->previousRound['misc']['rage_meter']) ) {
			// When player made first spin in this game.
			if(! is_array($this->round->previousRound['misc']) ){
				$this->round->previousRound['misc'] = array();
			}

			$this->round->previousRound['misc']['rage_meter'] = array(
							'count' => 0,
							'coin_details' => array(
								'coin_value_sum' => $this->round->coinValue,
								'coin_value_count' => 1,
							),
							
						);		
		}
		else {
			$coin_val = $this->round->previousRound['misc']['rage_meter']['coin_details'];

			if( $coin_val == 0 ) {
				// After awarding freespins ['misc']['rage_meter']['coin_details']
				// will be set to 0, in that case control will come here.
				$coin_val = array(
					'coin_value_sum' => $this->round->coinValue,
					'coin_value_count' => 1,
				);
			}
			else {
				 // Normally control will come here only.
				// Other places are to handle corner cases.
				$coin_value_sum = $coin_val['coin_value_sum'] +  $this->round->coinValue;
				$coin_count = $coin_val['coin_value_count'] + 1;
				$coin_val = array('coin_value_sum'=>$coin_value_sum, 'coin_value_count'=>$coin_count);
			}

			$this->round->previousRound['misc']['rage_meter']['coin_details'] = $coin_val;
		}
		//////////////////////////////////////////

		$this->round->previousRound['misc']['rage_meter']['count'] += $bonus_sym_count;
		$progress_bar = $this->round->previousRound['misc']['rage_meter']['count'];

		if($progress_bar >= $bar_range_limit) { 
			$remaining_points 	= $progress_bar % $bar_range_limit;
			$progress_bar 		= $remaining_points;
			$config 		= $this->getBonusConfig();
			$config 		= decode_object($config);
			$numPaylines 		= $this->round->game->paylines;      
			$numPicks 		= $config['num_picks'];
			$wonFeatures 		= Array(); 
			$fsGameIds 		= Array();
			$coin_value = ($this->round->previousRound['misc']['rage_meter']['coin_details']['coin_value_sum']) / 
    					($this->round->previousRound['misc']['rage_meter']['coin_details']['coin_value_count']) ;

			$bonusGameData = Array(
					'prizes'        => $config['prizes'],
					'won_prizes'    => $wonFeatures,
					'fs_game_id'    => $fsGameIds,
					'fs_multiplier' => $config['fs_multiplier'],
					'win_ways_fs'   => $numPaylines,
					'fs_details'    => $config['fs_details'],
					);

			$bonusGameData = encode_objects($bonusGameData);

			grant_bonus_game($this->game->gameId, $this->game->subGameId,
					$this->round->roundId, $this->round->roundId,
					$this->accountId, $this->bonusGameId,
					$config['code'], $numPicks, $bonusGameData,
					1, $this->round->amountType, $coin_value,
					$this->round->numCoins, $this->game->paylines);

			$this->round->previousRound['misc']['rage_meter']['count'] = $progress_bar;
			$this->round->previousRound['misc']['rage_meter']['coin_details'] = 0;

			$bonusGameWon = Array(
					'bonus_game_id' => $this->bonusGameId,
					'num_picks' 	=> $numPicks,
					'num_prizes' 	=> count($config['prizes']),
					'type' 		=> 'bonus_game'); 

			array_push($this->round->bonusGamesWon, $bonusGameWon);
		}

		// For client communication
		$this->progBarClient();
	}

	public function progBarClient() {
		$progress_bar_status = Array(
		   	'type'		=> 'progress_bar',
		    'bar_value'	=> $this->round->previousRound['misc']['rage_meter']['count'],
		);

		array_push($this->round->bonusGamesWon, $progress_bar_status);
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

	private function validatePick($pickedPosition)
	{
		$prevPicks = $this->round->bonusGames['picks_data'];
		$numPrizes = count($this->round->bonusGames['game_data']['prizes']);

		if(!isset($pickedPosition) or in_array($pickedPosition, $prevPicks) or
				$pickedPosition < 0 or $pickedPosition >= $numPrizes) {
			ErrorHandler::handleError(1, "FSPICKBONUS_0002", "Invalid pick position");
		}
	}

	public function getState()
	{
		return ($this->round->bonusGames['num_user_picks'] ==
			$this->round->bonusGames['num_picks']) ? 1 : 0;
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
		$won_features = ''; $fs_game_id = '';

		if(!$this->isConfigValid($game_data)) {
			return null;
		}

		$index = $picked_position;
		$won_features = $game_data['prizes'][$index]; 
		$fs_game_id = $won_features['fs_game_id'];
		$num_freespins = $won_features['freespins'];
		$multiplier = $won_features['multiplier'];

		if($multiplier == 'avg') {
			$details = $this->getMultimplier($game_data, $index);
			$multiplier = $details['multiplier'];
			$num_freespins = $details['num_freespins'];
			$fs_game_id = $details['fs_game_id'];
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

	private function isConfigValid($config)
	{
		if(empty($config) or $config == Null or !$config) {
			return false;
		}

		return true;
	}

	public function getMultimplier($game_data, $index)
	{
		$prizes = $game_data['prizes'];
		$fs_game_id = $prizes[$index]['fs_game_id'];
		unset($prizes[$index]);
		$rand = get_random_number(0, count($prizes) - 1);
		$prize_set = $prizes[$rand];
		$multiplier = $prize_set['multiplier'];
		$rand2 = get_random_number(0, count($prizes) - 1);
		$prize_set2 = $prizes[$rand2];
		$num_freespins = $prize_set2['freespins'];

		return array('multiplier' => $multiplier,
				'num_freespins' => $num_freespins,
				'fs_game_id' => $fs_game_id);
	}

	private function processPrizes($state, $num_freespins, $gameData, $details)
	{
		if($num_freespins <= 0) { return; }


		$history = Array($num_freespins);
		$spin_type=2;
		$multiplier = $details['fs_multiplier'];
		$base_round_id = $this->round->bonusGames['base_round_id'];
		$round_ids = Array($base_round_id);

		$game_data = $this->round->bonusGames['game_data'];
		$parent_type = $this->round->getParentSpinType();
		$fs_details = $game_data['fs_details'];

		if(!isset($game_data['fs_details'])) {
			print "FS details not available";
		}

		$fs_details['parent_type'] = $parent_type;
		$fs_details['parent_spins_left'] = 0;
		$fs_details['fs_multiplier'] = $details['fs_multiplier'];
		$fs_details['fs_game_id'] = $details['fs_game_id'];  
		$fs_details['progress_bar'] = 0;
		$coin_value = $this->round->bonusGames['coin_value'];

		// Add number of spins and number of spins left in freespins table.
		award_freespins($this->game->gameId, $this->game->subGameId,
				$this->accountId, $base_round_id,
				$num_freespins, $multiplier,
				$coin_value, $this->round->numCoins,
				$this->round->numBetLines, $this->round->amountType,
				$round_ids, $history, $spin_type, $fs_details);


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
				$this->round->bonusGames['id']);
	}

	function getBonusConfig() 
  	{
    		global $db;

	    	$table = "game.bonus_config";
	    	$query = <<<QUERY
	      		SELECT configuration
	        	FROM $table
	       		WHERE game_name = "{$this->game->gameName}" AND
	           	bonus_game_id = {$this->bonusGameId} AND
	           	spin_type = "{$this->round->spinType}"
	           	LIMIT 1
QUERY;
		
	    	$rs = $db->runQuery($query) or ErrorHandler::handleError(1, "PROGRESSBAR_0001");
	    	
		if($db->numRows($rs) == 0) {
	      		return Null;
	    	}

	    	$row = $db->fetchRow($rs);
	   	 return $row[0];
  	}

}

?>
