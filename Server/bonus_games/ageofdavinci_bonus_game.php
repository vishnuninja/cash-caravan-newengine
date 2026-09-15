<?php
	/*
	 * @function handle_base_game_random_feature
	 * This is mapped in handler. Used to award the different mode of the spin.
	 *
	 * Free spins awarded from bonus round always run with a specific mode like ,
	 * random wild feature,random miltiplier,Magnum opus feture,etc. So a free spin
	 * trtiggered from bonus round will run with a fixed mode. So in such type of
	 * free spin there is no need to use the mode randomly. Its mode is pre calculated
	 * when bonus round is triggered.
	 * */
function handle_base_game_random_feature($round, $details) {

	$new_bonus_round = false;

	if(is_new_bonus($round, $details)) {
		$new_bonus_round = true;

		// If its not a respin or freespin, means its a normal spin.
		// In this case if bonus round is triggered, below features like random
		//wild or random multiplier, etc will not be considered.
		if(!isset($round->freeSpins)) {
			return ;
		}
	}

	$weights = $details['weights'];
	$features = $details['feature_name'];
	$feature_name = weighted_random_number($weights, $features);
	#$feature_name = "magnum_opus_feature"; //"magnum_opus_feature";

	// free spins, respin already having feature mode.
	if($round->freeSpins && isset($round->freeSpins['spins_left']) &&
		$round->freeSpins['spins_left'] > 0 && isset($round->freeSpins['details']['feature']) &&
		$round->freeSpins['details']['feature'] != '' ) {

		$feature_name = $round->freeSpins['details']['feature'];
		$round->postMatrixInfo['feature_name'] = $feature_name;
	}

	if(!$feature_name) {
		return false;
	}

	$round->postMatrixInfo['feature_name'] = $feature_name;
	$feature_name($round, $details, $feature_name, $new_bonus_round);
}

function is_new_bonus($round, $details) {
	$spinType = $round->spinType;
	$conf = $round->game->bonusConfig['bonus_config'][$spinType];
	$bonus_symbol = $round->game->scatters[0];
	$min_count = $conf[$bonus_symbol]['min_count'];
	
	$count = get_element_count($round->matrixFlatten, $bonus_symbol);

	if($count >= $min_count) {
		return true;
	}
	
	return false;
}

function is_bonus_symbol($round) {
	$bonus_symbol = $round->game->scatters[0];
	$count = get_element_count($round->matrixFlatten, $bonus_symbol);

	if($count) {
		return true;
	}
	
	return false;
}  

/*
 * @  random_wild_feature
 * Used to generate wild symbols randomly on the reels. Called  after post
 * matrix generation to  play wild symbols.
 * */
function random_wild_feature($round, $details, $feature_name, $new_bonus_round) {
	$num_wild_symbols_list = $details[$feature_name]['details']['num_wild_symbols'];
	$weights = $details[$feature_name]['details']['weights'];
	$num_wild_symbols = weighted_random_number($weights, $num_wild_symbols_list);
	$flipped_matrix = flip_2d_array($round->matrix);
	$wild_positions = [];
	$is_feature_awarded = 0;

	for( $i = 0; $i < $num_wild_symbols; $i++ ) {
		/* Wilds can be placed from left to right at most 1 wild per reel
		 * Hence, ensuring not to overlap and not to place more than 1 wild
		 * on same reel
		 */
		if(in_array($round->game->wilds[0], $flipped_matrix[$i])) {
			continue;
		}

		$rand_wild_pos = get_rand_wild_pos($round->game->scatters[0],
			$flipped_matrix[$i], $round);
		$round->matrix[$rand_wild_pos][$i] = $round->game->wilds[0];
		$wild_positions[$i] = ($rand_wild_pos * $round->game->numColumns) + $i;
		$is_feature_awarded = 1;
	}

	if($is_feature_awarded) {
		$round->postMatrixInfo['random_wild_positions'] = $wild_positions;
		set_matrix($round);
	}
}

function get_rand_wild_pos($scatter, $reel, $round) {
	if(!in_array($scatter, $reel)) {
		return get_random_number(0, $round->game->numRows - 1 );
	}

	$non_scatter_pos = array();
	for($i = 0; $i < count($reel); $i++) {
		if($reel[$i] != $scatter) {
			array_push($non_scatter_pos, $i);
		}
	}

	$index = get_random_number(0, count($non_scatter_pos) - 1);

	return $non_scatter_pos[$index];

}

/*
 *  @  unity_feature
 * TODO need to be implemented.
 * */
function unity_feature($round, $details, $feature_name, $new_bonus_round) {
	$round->game->unitySymbols = $details[$feature_name]['unity_symbols'];
}

/*
 * @  random_multiplier_feature()
 * This function will generate one number randomly which will be used as a
 * multiplier . No respins(here treated as free spins) are awarded during random
 * multiplier free game.
 * */
function random_multiplier_feature($round, $details, $feature_name, $new_bonus_round) {
	// If random multiplier feature is running in freespins.
	// Here new entry will not go inside the freespins table.
	// Just multiplier will be used in total win.
	// If current round id free spin or respin, new spin will not be awarded
	// just win amount will be paied with multiplier.
	
	 if(isset($round->freeSpins)) {

		if($round->spinType == 'respin' ||
			$round->freeSpins['details']['spin_type'] == 'respin') {
			return;
		}

		$multipliers = $details[$feature_name]['details']['multipliers'];
		$random_index = get_random_number( 0, count($multipliers) - 1 );
		$fs_multiplier = $multipliers[$random_index];
		$round->freeSpins['multiplier'] = $fs_multiplier;
		return ;
	}


	$multipliers = $details[$feature_name]['details']['multipliers'];
	$fs_game_id = $details[$feature_name]['details']['fs_game_id'];
	$random_index = get_random_number( 0, count($multipliers) - 1 );
	$respin_multiplier = $multipliers[$random_index];
	//$details_respin = ['fs_game_id' => $fs_game_id, 'fs_multiplier' => $respin_multiplier]; //08042019
	$details_respin = ['fs_game_id' => $fs_game_id, 'fs_multiplier' => $respin_multiplier,
	   'source' => $feature_name, 'spin_type' => 'respin'];
	$details_respin_json = json_encode($details_respin);
	$game_id = $round->game->gameId;
	$sub_game_id = $round->game->subGameId;
	$account_id = $round->player->accountId;
	$round_id = $round->roundId;
	$num_spins = $details[$feature_name]['details']['num_spins'];
	$coin_value = $round->coinValue;
	$num_coins = $round->numCoins;
	$num_betlines = $round->numBetLines;
	$amount_type = $round->amountType;
	$round_ids = ''; $history = ''; $spin_type = 3;

	// To handle the random multiplier feature in free spin. No respins(here treated as free spins)
	// are awarded during the random multiplier free game.
	// TODO make sure for this.
	// TODO The freespin multiplier is not in use in win calculation. So modify the core files also.
	if(isset($round->freeSpins['multiplier']) && ($round->freeSpins['multiplier'] > 0) ) {
		$round->freeSpins['multiplier'] = $respin_multiplier;

		return false;
	}

	award_freespins($game_id, $sub_game_id, $account_id, $round_id, $num_spins,
						 $respin_multiplier, $coin_value, $num_coins, $num_betlines,
						 $amount_type,$round_ids, $history, $spin_type, $details_respin);

	set_bonus_random_multiplier($round, array($respin_multiplier, $num_spins, $feature_name));
	set_next_round_random_multiplier($round, array($respin_multiplier, $num_spins, $feature_name));

}

function set_bonus_random_multiplier($round, $win_details) {
	array_push($round->bonusGamesWon, array('multiplier' => $win_details[0], 'num_spins' => $win_details[1],
				'spins_left' => $win_details[1], 'feature' => $win_details[2] ));
}

function set_next_round_random_multiplier($round, $win_details) {
	$round->nextRound = array('multiplier' => $win_details[0], 'num_spins' => $win_details[1],
			'spins_left' => $win_details[1], 'feature' => $win_details[2] );
}

function magnum_opus_feature($round, $details, $feature_name, $new_bonus_round) {
	// if $new_bonus_round is true, need to check how to replace the old $symbols
	// for blocks  TODO is_bonus_symbol
	if(is_new_bonus($round, $details)) {
		return ;
	}

	if( is_bonus_symbol($round) && ($round->spinType != 'normal') ) {
		return ;
	}



	$reels = $details[$feature_name]['details']['reels'];
	$reels_weights = $details[$feature_name]['details']['weights'];
	$elements = $details[$feature_name]['details']['symbols']['elements'];
	$elements_weights = $weights = $details[$feature_name]['details']['symbols']['weights'];
	$block_size = $details[$feature_name]['details']['block_size'];
	$block_reels = weighted_random_number($reels_weights, $reels);
	$block_ele = weighted_random_number($elements_weights, $elements);

	for( $i = 0; $i < $round->game->numRows; $i++ ) {
		for( $j = 0; $j < count($block_reels); $j++ ) {
			$reel_pos = $block_reels[$j];
			$round->matrix[$i][$reel_pos] = $block_ele;
		}
	}

	$round->postMatrixInfo['symbol'] = $block_ele;
	$round->postMatrixInfo['reel_pos'] = $block_reels;
	$round->postMatrixInfo['matrix'] =  array2d_to_string($round->matrix);//client info
	set_matrix($round);
}

function set_matrix($round) {
	//$round->matrixString = array2d_to_string($round->matrix);
	$round->matrixFlatten = $round->generateFlatMatrix($round->matrix);
	$round->postMatrixInfo['matrixString'] = array2d_to_string($round->matrix); //$round->matrixString;
}
?>
