<?php
# todo Need to follow proper naming convention
# Need to have proper camelCase method and variable names
# todo Need to optimize this class file
class Cluster
{
	public function __construct(&$game, $round, $player)
	{
		$this->game     = $game;
		$this->round    = $round;
		$this->player   = $player;
		$this->checked_index = [];
		$this->match = [];
		$this->clusters = [];
		$this->cluster_wins = [];
		$this->indexes_included_in_cluster = [];
		$this->stickyWinRound = false;

		$this->neighbourhood_indices = Array(0 => [1,6], 1 => [0, 2, 7], 2 => [1,8,3],
			3 => [2,4,9], 4 => [3,5,10], 5 => [4, 11], 6 => [0,7,12], 7 => [6,8,1,13],
			8 => [2,7,9,14], 9 => [3,8,10,15], 10 => [4,9,11,16], 11 => [5, 10,17],
			12 => [6,13,18], 13 => [7,12,14,19], 14 => [8, 13,15,20], 15 => [9,14,16,21],
			16 => [10,15,17,22], 17 => [11,16,23], 18 => [12,19,24], 19 => [13,18,20,25],
			20 => [14,19,21,26], 21 => [15,20,22,27], 22 => [16,21,23,28], 23 => [17,22,29],
			24 => [18,25], 25 => [19,24,26], 26 => [20,25,27], 27 => [21,26,28],
			28 => [22,27,29], 29 => [23,28]);
	}

	public function handleLineWins()
	{
		$won_symbols = array();
		$this->round->sticky_win_round = false;
		$is_all_wild = true;
		$wilds = $this->game->wilds;

		$sticky_details = $this->loadRespinDetails();
		$el_list = $this->round->matrixFlatten;
		$i = 0;

		for($m = 0; $m < count($el_list); $m++) {
			$this->match = [];
			$this->checked_index = [];

			if((in_array($m, $this->indexes_included_in_cluster))
				|| (in_array($el_list[$m], $wilds))
				|| ( isset($sticky_details['symbol'])
				&& ($sticky_details['symbol'] != '')
				&& ($el_list[$m] != $sticky_details['symbol']))
				|| in_array($el_list[$m], $this->game->scatters))
			{
				continue;
			}

			$is_all_wild = false;
			$this->inner_call($m, $el_list);
			$this->match = array_unique($this->match);
			sort($this->match);
			$min_count = $this->game->bonusConfig['sticky_win']['min_count'];

			if(count($this->match) >= $min_count ) {
				$this->clusters[] = $this->match;
				$won_symbols[] = $el_list[$m];
			}

			$this->indexes_included_in_cluster =
				array_merge($this->indexes_included_in_cluster, $this->match);
		}

		// TODO  Change the naming convention of sticky_win_round.  stickyWinRound
		// TODO check the condition when to trigger sticky wins
		if(!$this->round->sticky_win_round) {
			$this->awardStickyWins($this->clusters);
		}

		if(isset($this->clusters[0])) {
			$cluster_size_ok = $this->is_size_ok($this->clusters[0]);
		}

		if( $sticky_details && isset($sticky_details['prev_cluster'])
			&& $this->round->sticky_win_round ) {
			// Means this is a sticky respin
			//ISSUE NAG-1
			$this->arrangeNewCluster($sticky_details['prev_cluster']);
		}

		//$this->round->paylineWins['details']['cluster'] = $this->clusters; //30032019

		if($sticky_details &&
			(count($sticky_details['prev_cluster']) < count($this->clusters[0]))
			&& ($cluster_size_ok)) {
			// ISSUE NAG-1
			//$this->arrangeNewCluster($sticky_details['prev_cluster']); 
			// In respin cluster not increased but a new cluster of same symbol with bigger size appeared.
			$temp_sticky_details = $sticky_details['sticky_win_details'];
			$temp_sticky_details['cluster'] = $this->clusters[0];
			$temp_sticky_details['matrix'] = $this->round->matrix;
			$this->updateStickywin($temp_sticky_details);
			// Flag to be sent to client to inform that sticky is continue.
			$this->round->otherWins['sticky_win_round'] = true; // useles to be removed // TODO
			$this->round->sticky_win_round = true; // it could be the variable of this class only TODO

			array_push($this->cluster_wins, array('symbol_positions' => $this->clusters[0]));
			$this->round->otherWins['cluster_wins'] = $this->cluster_wins; // To send message to the client// TODO remove this 31032019
			$this->setClusterMessage();
			$this->setNextRoundMessages();
			$this->setBonusWonMessages();

			return ; // No need to calculate prize if sticky win is continue
		}
		else if($this->round->sticky_win_round == true) {
			// End of respin round.
			$this->round->sticky_win_round = false;
			$this->round->otherWins['sticky_win_round'] = false;
			//$this->round->paylineWins['details']['sticky_positions'] = $this->clusters[0]; //30032019
		}

		$this->setFsMessages();
		$this->round->paylineWins['details']['cluster'] = $this->clusters; // 30032019

		// If sticky win activated in a cluster win. No need to pay for that cluster at this point.
		// Here re spin will start and on the end of respin, winnings will be paid.  18022019
		// Here we will set parameter values to be sent to client.
		if($this->stickyWinRound) {
			array_push($this->cluster_wins,
				array('symbol_positions' => $this->clusters[0]));
			$this->round->otherWins['cluster_wins'] = $this->cluster_wins;
			$this->setClusterMessage(); //31032019
			return false;
		}

		if($is_all_wild) {
			// TODO even if this condition is enough to ensure that all symbols in the
			// matrix are wild . But we can check on another level also. We can in a loop
			// all symbols of matrix are wild.
			$this->clusters[] = range(0, $this->game->numRows * $this->game->numColumns - 1);
			$won_symbols[] = $this->game->wilds[0];
		}

		$this->calculatePrizes($this->clusters, $el_list, $won_symbols);
		$this->round->otherWins['cluster_wins'] = $this->cluster_wins;
		$this->setClusterMessage(); //31032019
	}

	public function setClusterMessage() {
		$this->round->paylineWins['details']['cluster'] = $this->cluster_wins;
	}

	public function setFsMessages()
	{
		if($this->checkFreespinSets()) {
			return false;
		}

		if($this->round->freeSpins && ($this->round->freeSpins['spins_left'] == 1))
		{
			$this->round->freespinState = 1;
		}
		else {
			$this->round->freespinState = 0;
		}

		if(isset($this->round->freeSpins['details']['spin_type']) &&
			$this->round->freeSpins['details']['spin_type'] == 'respin')
		{
			$this->round->freespinState = 0;
		}
	}

	/*
	 * @fun setFsMessages
	 * On the end of free spin round, message of FS
	 * end should be sent to client side.
	 * */
	public function checkFreespinSets()
	{
		if(isset($this->round->freeSpins['details']['fs_sets']))
		{
			$fs_set = $this->round->freeSpins['details']['fs_sets'];
			$num_spins = 0; $spins_left = 0; $spins_completed = 0;

			for($i = 0; $i < count($fs_set); $i++) {
				$num_spins += $fs_set[$i][0];
				$spins_completed += $fs_set[$i][1];
			}

			$spins_left = $num_spins -$spins_completed;

			if($spins_left == 1) {
				$this->round->freespinState = 1;
			}
			else {
				$this->round->freespinState = 0;
			}

			return true;
		}

		return false;
	}

	/*
	* @ fun is_size_ok
	* It checks the cluster size. Is size equals full screen ?
	*/
	public function is_size_ok($cluster)
	{
		if(($this->game->numColumns * $this->game->numRows) == count($cluster)) {
			return false;
		}

		return true;
	}

	/**
	 * @arrangeNewCluster()
	 * This method will be called only in re-spin round. In re-spin round
	 * only one cluster, won in normal spin, is considered for the win .
	 * That one cluster is used in all re-spin rounds. If size increase another
	 * re-spin triggers. 18022019+
	 * */
	public function arrangeNewCluster($previous_cluster) {
		$current_clusters = $this->clusters;

		foreach($current_clusters as $cluster) {
			$diff_arr = array_diff($previous_cluster, $cluster);

			if( count($diff_arr) == 0 ) {
				$this->clusters =   array($cluster);

				break;
			}

		}
	}

	public function loadRespinDetails() {

		if(isset($this->round->freeSpins['details']['spin_type'])
			&& ($this->round->freeSpins['details']['spin_type'] = 'respin')) {

			$sticky_win_details = $this->round->freeSpins['details'];
			$cluster = $sticky_win_details['cluster'];
			$cols = $this->game->numColumns;
			$won_symbol = $sticky_win_details['won_symbol'];

			// Change the matrix with sticky symbols
			for($i = 0; $i < count($cluster); $i++) {
				$index = $cluster[$i];
				$x = (int)($index / $cols);
				$y = ($index % $cols);
				$this->round->matrix[$x][$y] = $won_symbol;
			}

			$this->round->sticky_win_round = true; // sticky_win_round could be the variable of this class.
			$this->round->otherWins['sticky_win_round'] = true; // useless remove this TODO
			$this->round->matrixString = array2d_to_string($this->round->matrix);
			$this->round->matrixFlatten = $this->round->generateFlatMatrix($this->round->matrix);

			return  array('prev_cluster' => $cluster, 'symbol' => $won_symbol,
				'sticky_win_details' => $sticky_win_details);

		}

		return false;
	}

	public function loadRespinReels()
	{
		$newSubGame = Game::loadGame($this->game->gameId, 2); //  TODO make sub game id dynamic.
		$this->game->reels = $newSubGame->reels;
		$this->round->generateReelPointers();
		$this->round->generateMatrix();
	}

	public function updateStickywin($sticky_win_details) {
		$game_id = $this->game->gameId;
		$sub_game_id = $this->game->bonusConfig['sticky_win']['fs_game_id']; //$this->game->subGameId; // 1704
		$account_id = $this->player->accountId;
		$amount_type = $this->round->amountType;
		$base_round_id = $this->get_base_round_id();
		$round_ids = array($this->round->roundId);
		$history = ''; 
		$spin_type = 3;
		award_freespins($game_id, $sub_game_id, $account_id, $base_round_id,
			1, 1, $this->round->coinValue, $this->round->numCoins,
			$this->round->numBetLines, $amount_type, 
			$round_ids, $history, $spin_type, $sticky_win_details);
	}

	public function placeWilds() {
		if(!isset($this->round->spawnFeature['feature'])
			|| $this->round->spawnFeature['feature'] == false) {

			return false;
		}

		$num_spawning_reels = $this->round->spawnFeature['num_spawning_reels'];
		$reel_indexes = $this->round->spawnFeature['reel_indexes'];
		$weights_num_wild_symbols = $this->round->spawnFeature['weights_num_wild_symbols'];
		$num_wild_symbols = $this->round->spawnFeature['num_wild_symbols'];
		$spawn_wild_symbol = $this->round->spawnFeature['spawning_wild_symbol'];
		$flipped_matrix = flip_2d_array($this->round->matrix);

		for($i = 0; $i < $num_spawning_reels; $i++) {
			$reel_index = $reel_indexes[$i];
			$num_spawning_wild_symbols = weighted_random_number($weights_num_wild_symbols, $num_wild_symbols);
			for($k = 0; $k < $num_spawning_wild_symbols; $k++) {
				$flipped_matrix[$reel_index][$k] = $spawn_wild_symbol;
			}
		}

		$matrix = flip_2d_array($flipped_matrix);
		$this->round->matrix = $matrix;
		$this->round->matrixFlatten = $this->round->generateFlatMatrix($this->round->matrix);
		$this->round->matrixString = array2d_to_string($this->round->matrix);

		$this->round->postMatrixInfo['matrix'] = $matrix;
		$this->round->postMatrixInfo['feature_name'] = 'spawning_wild';
		$this->round->postMatrixInfo['matrixString'] = array2d_to_string($matrix);
		$this->round->postMatrixInfo['matrixFlatten'] = $this->round->matrixFlatten;

		$this->round->spawnFeature['feature'] = true; // 20032019

	}

	public function updateStickywinStatus() {
		global $db;

		$game_id = $this->game->gameId;
		$account_id = $this->player->accountId;
		$sticky_win_id = $this->round->sticky_win_id;

		$query =<<<QUERY
			UPDATE gamelog.sticky_wins
			set status=1
			WHERE game_id='$game_id'
			AND account_id='$account_id'
			AND status=0
			AND id=$sticky_win_id
QUERY;

		$result = $db->runQuery($query) or ErrorHandler::handleError(1, "ROUND_00012");
	}

	public function awardStickyWins($won_clusters) {
		global $db;

		$screen_symbol = $this->game->scatters[0];  //18022019
		$flipped_matrix = flip_2d_array($this->round->matrix);
		# todo Change the following game name specific function name
		$num_screen_symbols = get_element_count_candyburst($flipped_matrix, $screen_symbol);
		$cluster = isset($this->clusters[0]) ? $this->clusters[0] : '';
		$is_spawn_feature = '';

		if(property_exists($this->round, 'spawnFeature')) {
			$is_spawn_feature = isset($this->round->spawnFeature['feature']) ?
				$this->round->spawnFeature['feature'] : false;
		}

		$eligible_num_symbols = $this->game->bonusConfig['sticky_win']['min_bonus_symbols'];

		# todo need to avoid checking spint_type. Instaed, maintain
		# spin_type configuration
		if((count($won_clusters) == 1) && ($this->round->spinType != SPINTYPE_FREESPIN) && 
			($num_screen_symbols < $eligible_num_symbols) && (!$is_spawn_feature))
		{
			$is_win_chance = $this->checkWinProbability();
	
			$cluster_size_ok = $this->is_size_ok($cluster);
			$fs_game_id = $this->game->bonusConfig['sticky_win']['fs_game_id'];

			if(!$is_win_chance || !$cluster_size_ok) {
				return false;
			}

			$this->stickyWinRound = true;
			$game_id = $this->game->gameId;
			$sub_game_id = $fs_game_id; //$this->game->subGameId;
			$account_id = $this->player->accountId;
			$won_symbol_index = $cluster[0];
			$won_symbol = $this->round->matrixFlatten[$won_symbol_index];

			// @ var $parent_row_id, row id of free spin-set on top .
			// It will be same in all children sets of freespins and respin
			// of that freespin. // START FROM HERE TODO TODO
			$parent_row_id = isset($this->round->freeSpins['id']) ?
				$this->round->freeSpins['id'] : '';
			$sticky_win_details = array(
				'fs_game_id' => $fs_game_id,
				'matrix' => $this->round->matrix,
				'cluster' => $cluster,
				'original_matrix' => $this->round->matrix,
				'original_cluster' => $cluster,
				'won_symbol' => $won_symbol,
				'spin_type' => 'respin',
				'parent_row_id' => $parent_row_id);
			$amount_type = $this->round->amountType;
			$base_round_id = $this->get_base_round_id();
			$round_ids = array($this->round->roundId);
			$history = '';
			$spin_type = 3;

			award_freespins($game_id, $sub_game_id, $account_id, $base_round_id,
				1, 1, $this->round->coinValue, $this->round->numCoins, 
				$this->round->numBetLines, $amount_type, $round_ids, 
				$history, $spin_type, $sticky_win_details);

			$this->setNextRoundMessages();
			$this->setBonusWonMessages();

		}
	}

	/*
	 * @fun setNextRoundMessages
	 * To set the nerxt round info of client message.
	 * */
	public function setNextRoundMessages() {
		$this->round->nextRound['num_spins'] = 1;
		$this->round->nextRound['spins_left'] = 1;
		$this->round->nextRound['type'] = 'sticky_respin';
		$this->round->nextRound['sticky_positions'] = $this->clusters[0];
	}

	/*
	 * @fun setBonusWonMessages
	 * To set bonus information for new sticky respin
	 * For client message.
	 * */
	public function setBonusWonMessages() {
		$bonusGamesWon['num_spins'] = 1;
		$bonusGamesWon['spins_left'] = 1;
		$bonusGamesWon['type'] = 'sticky_respin';
		$bonusGamesWon['sticky_positions'] = $this->clusters[0];

		array_push($this->round->bonusGamesWon, $bonusGamesWon);
	}

	public function get_base_round_id() {
		return isset($this->round->freeSpins['base_round_id']) ?
			$this->round->freeSpins['base_round_id'] : $this->round->roundId;
	}

	public function checkWinProbability()
	{
		$win = $this->game->bonusConfig['sticky_win']['win'];
		$weights = $this->game->bonusConfig['sticky_win']['weights'];

		return weighted_random_number($weights, $win);
	}

	function calculatePrizes($won_clusters, $el_list, $won_symbols)
	{
		$prize = []; $m = 0;

		foreach($won_clusters as $cluster) {

			$matched_symbol = $won_symbols[$m] ;
			$num = count($cluster);
			$temp_index = $num.$matched_symbol;
			$win_amount = $this->game->payTable[$temp_index] * $this->round->coinValue;
			$this->round->winAmount += $win_amount;
			$prize[$matched_symbol] = $win_amount; // TODO remove this statement
			$cluster_win = Array('symbol' => $matched_symbol,
				'num_symbols' => $num,
				'win_amount' => $win_amount,
				'symbol_positions' => $cluster);

			array_push($this->cluster_wins, $cluster_win);

			// To save in rounds, will be used in logs
			array_push($this->round->winLineNumbers, array($temp_index, $win_amount));
			$m++;
		}
	}

	/*
	 *@func inner_call. This is the function to traverse the 1D array of all randomly generated elements.
	 * It traverses all the elemnets and find the won clusters.
	 * Params: $i is the index to be matched with adjacent indices.
	 *  $el_list is the 1D array containing all elements generated randomly.
	 *  TODO Suitable name of this function could be found.
	 *
	 ***/
	function inner_call($i, $el_list) {
		array_push($this->checked_index, $i);
		$curr_val = $el_list[$i];
		$index = $this->neighbourhood_indices[$i];
		$wilds = $this->game->wilds;
		$wild = $wilds[0];

		foreach($index as $k => $v) {

			if($el_list[$v] == $wild) {
				$el_list[$v] = $curr_val;
			}

			if($curr_val == $el_list[$v] ) {
				$this->match[] = $v;

				if(!in_array($v, $this->checked_index)) {
					$this->inner_call($v, $el_list);
				}

			}
		}

		return 'cycle';
	}

	/**
	 * @func get_won_matrix_indices. To find the indices of elements of the won clusters
	 * It gives the index of an elemnt on a 2D array. Like 1,2 => 2nd row 3rd column.
	 * $clusters contains the array of matched indices from a 1D. For this game 1D will contain 30 elements.
	 * This array is created from the randomly generated matrix of 30 elements. This 1D array is used for the traversing.
	 *
	 * **/
	function get_won_matrix_indices($cols) {
		$index_array = [];

		if(count($this->clusters)) {

			foreach($this->clusters as $k => $cluster) {
				$temp_array = [];

				foreach($cluster as $v) {
					$quotient = (int)($v / $cols);
					$reminder = ($v % $cols);
					$temp_array[] = $quotient.",".$reminder;
				}

				$index_array[] = $temp_array;
			}
		}
	}
}
?>
