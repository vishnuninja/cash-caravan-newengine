<?php

function handle_freespins_candyburst(&$round, $details) {
	$freespin_symbol = $details['freespin_symbol'];
	$game = $round->game;
	$fs_data = $round->freeSpins;
	$flipped_matrix = flip_2d_array($round->matrix);
	$num_freespin_symbols = get_element_count_candyburst($flipped_matrix, $freespin_symbol);

	//Scatter feature (freespin feature) is not possible in re-spin feature.Candyburst
	// TODO replace previousRound and use freespins
	if( $round->previousRound && isset($round->previousRound['sticky_win_details']) ) {
		$num_freespin_symbols = 0;
		return false;
	}

	if(!isset($details[$num_freespin_symbols])) {
		// Round in which new fs round not triggered.
		// According to the completed fs fs_game_id and freespins set will be updated for the next rounds.
		// TODO Add condition and for respin.  control will not come here.
		$next_round = update_freespin_reels($round); // 29032019
		set_next_info($round, $next_round, 1); // // 29032019
		return;
	}

	$new_freespins = 0;
	// Control will come here when a fresh bonus round(free spins) awarded.
	// Here it could be two case. 1) triggered from a free spin
	// 2) Triggered from a normal spin. In 2nd case no problem, just award it.
	// Handling 1st case in below if condition. Triggered from a free spin
	if($round->freeSpins && isset($round->freeSpins['spins_left'])
		&& ($round->freeSpins['spins_left'] > 0)) {

		$new_freespins = $details[$num_freespin_symbols]['num_freespins'];
		$next_round = update_freespin_reels($round, $new_freespins);
		set_bonus_info($round, $new_freespins);
		set_next_info($round, $next_round, 0);

		return false;
	}

	$num_freespins = $details[$num_freespin_symbols]['num_freespins'];
	# @ todo hardcoded this. Make it dynamic

	$multiplier = 1;
	$base_round_id = get_base_round_id($round);
	$round_ids = json_encode(array($round->roundId));
	$history = '';
	$award_details = get_award_details($round, $num_freespins);
	$spin_type = 2;

	award_freespins($game->gameId, $game->subGameId, $round->player->accountId,
			$base_round_id, $num_freespins, $multiplier,
			$round->coinValue, $round->numCoins, $round->numBetLines,
			$round->amountType, $round_ids, $history, $spin_type, $award_details);
	set_bonus_info($round, $num_freespins);

}

/*
* @fun get_award_details.
* @var $fs_sets structure is -
* array(array(total_spins,spins_completed), array(total_spins,spins_completed))
*/
function get_award_details($round, $num_freespins) {
	$spins_completed = 0;
	$reel_set_details = $round->game->reelsetConfig;
	$fs_game_id = $reel_set_details['freespin_reels']['reels'][$spins_completed];
	$fs_sets = array(array($num_freespins,0));
	$win_sets = array(0);
	$award_details = array('fs_game_id' => $fs_game_id, 'fs_sets' => $fs_sets,
												'fs_set_counter' => 0,
												'win_sets' => $win_sets,
												'parent_type' => $round->spinType);

	return $award_details;
}

function get_base_round_id($round) {
	return isset($round->freeSpins['base_round_id']) ?
		$round->freeSpins['base_round_id'] : $round->roundId;
}

function set_next_info(&$round, $next_round, $flage) {
	if(isset($next_round['spins_left']) && $next_round['spins_left'] <= 0) {
		return ;
	}

	$num_spins = $round->freeSpins['num_spins'];
	$spins_left = $round->freeSpins['spins_left'];

	if(count($next_round) > 0 || $flage) {
		
		if( isset($next_round['type'] ) && 
			isset($next_round['num_spins'] ) && 
			isset($next_round['spins_left'] ) ) {

			$round->nextRound['type'] = $next_round['type'];
			$round->nextRound['num_spins'] = $next_round['num_spins'];
			$round->nextRound['spins_left'] = $next_round['spins_left'];
		}
	}
	else {
		$round->nextRound['type'] = 'freespins';
		$round->nextRound['num_spins'] = $num_spins;
		$round->nextRound['spins_left'] = $spins_left;
	}
}

function set_bonus_info(&$round, $new_freespins) {
	$freespins_info = Array('type' => 'freespins', 'num_spins' => $new_freespins,
		'spins_left' => $new_freespins);
	array_push($round->bonusGamesWon, $freespins_info);
}

function update_freespin_details($round, $fs_details) {
	global $db;

	$account_id = $round->player->accountId;
	$fs_id = $round->freeSpins['id'];
	$game_id = $round->freeSpins['game_id'];
	$amountType = $round->amountType;
	$json_data = json_encode($fs_details);

	$tableName = 'gamelog.freespins';

	if($round->amountType == AMOUNT_TYPE_FUN) {
		$tableName = 'gamelog.freespins_fun';
	}

	$update_repin_win = <<<QUERY
		UPDATE {$tableName}
		SET details='$json_data'
		WHERE game_id='$game_id'
		AND account_id='$account_id'
		AND state=0 AND id='$fs_id'
		AND amount_type = {$amountType}

QUERY;

	$result = $db->runQuery($update_repin_win) or ErrorHandler::handleError(1, "CANDS002");
}

function update_freespin_reels($round, $new_freespins=0) {

	if(!$round->freeSpins || !isset($round->freeSpins['spins_left'])
		|| ($round->freeSpins['spins_left'] < 1)) {

		return false;
	}


	$spins_completed_config =
	$round->game->reelsetConfig['freespin_reels']['spins_completed'];
	$fs_reels_config =
	$round->game->reelsetConfig['freespin_reels']['reels'];
	$fs_completed = $round->freeSpins['num_spins'] - $round->freeSpins['spins_left'] + 1;
	$fs_details = $round->freeSpins['details'];
	$fs_set_counter = $fs_details ['fs_set_counter'];
	$fs_details['fs_sets'][$fs_set_counter][1] = $fs_completed;
	$fs_details['win_sets'][$fs_set_counter] += $round->winAmount;

	if(in_array($fs_completed, $spins_completed_config)) {
		$reel_index = array_search($fs_completed, $spins_completed_config);
		$fs_game_id = $fs_reels_config[$reel_index];
		$fs_details['fs_game_id'] = $fs_game_id;
	}

	$next_round = array();
	$win_details = $fs_details;

	if($new_freespins) {
		// freespins triggered from a freespin
		// store it in details col in fs_sets.

		$fs_details['fs_sets'][0][0] += $new_freespins;
		$round->freeSpins['spins_left'] += $new_freespins;
		$round->freespinState = 0;

		$next_round = prepare_next($fs_details);
		$win_details = $fs_details;
	}
	else {
		// No new freespins awarded from a freespin.
		$next_round = prepare_next($fs_details);
	}

	$fs_multiplier = $round->freeSpins['multiplier'];
	$num_freespins = $new_freespins;
	$history = $round->freeSpins['history'];
	$round_ids = $round->freeSpins['round_ids'];

	update_freespins($round->freeSpins['id'], $round->freeSpins['game_id'],
                     $round->freeSpins['sub_game_id'], $round->player->accountId,
                     $round->freeSpins['base_round_id'], $num_freespins,
                     $fs_multiplier, $round->amountType, $round_ids, $history,
                     $fs_details);

	set_fs_win($round, $fs_details);

	return $next_round;
}

/**
 * @fun set_fs_win
 *  To set the total win amount from a freespin round.
 */
function set_fs_win($round, $details) {
	$wins = $details['win_sets'];
	$win = 0;

	for($i = 0; $i < count($wins); $i++) {
		$win += $wins[$i];
    }

    $win -= $round->winAmount;
	$round->freeSpins['win_amount'] = $win;
	$round->freeSpins['total_win_amount'] = $win;
}

/*
 * @fun prepare_next
 * Used to set next round info for the normal freespin.
 * If a new fs-set triggered from a fs then next round set
 * at different place
 * */
function prepare_next($fs_details) {
	$spins = 0; $spins_left = 0; $next = array();

	for($i = 0; $i < count($fs_details['fs_sets']); $i++) {
		$set = $fs_details['fs_sets'][$i];
		$spins += $set[0];
		$spins_left += $set[0] - $set[1];
	}

	$next['type'] = 'freespins';
	$next['num_spins'] = $spins;
	$next['spins_left'] = $spins_left;

	return $next;
}


/**
 * @fun update_parent_set_win
 * On the end of current fs-set,
 * update the balance of this fs-set into the parent fs.
 *  win amount of upto (n-1) th spin is available here.
 *  So on the completion of win calculation of last round (nth spin) of fs win, amount should be updated.
 *  Win amount of previous fs-set could be saved into the new fs-sets entry.
 * */
function update_parent_set_win($round) {
	global $db;

	if(!isset($round->freeSpins['details']['parent_fs_id'])) {
		return false;
	}

	$win = current_fs_set_win($round); // TODO $round->winAmount + $round->freeSpins['win']
	$win = to_base_currency($win);
	$id = $round->freeSpins['details']['parent_fs_id'];

	$tableName = 'gamelog.freespins';

	if($round->amountType == AMOUNT_TYPE_FUN) {
		$tableName = 'gamelog.freespins_fun';
	}

	$update_spin_win = <<<QUERY
		UPDATE {$tableName} SET win_amount = win_amount + $win
		WHERE id='$id'

QUERY;

	$result = $db->runQuery($update_spin_win) or ErrorHandler::handleError(1, "CHN_DYNS004");
}

function current_fs_set_win($round) {
	return $current_fs_set_win = $round->winAmount + $round->freeSpins['win_amount'];
}

function get_parent_fs_id($round) {
	return isset($round->freeSpins['details']['parent_fs_id']) ?
		$round->freeSpins['details']['parent_fs_id'] : $round->freeSpins['id'];
}

function next_fs_set($round, $new_freespins, $fs_details) {
    $game_id = $round->game->gameId;
    $sub_game_id = $round->game->subGameId;
    $account_id = $round->player->accountId;
    $base_round_id = get_base_round_id($round);
    $round_ids = json_encode(array($round->roundId));
    $history = '';
    $amount_type = $round->amountType;
    $spin_type = 2;
    award_freespins($game_id, $sub_game_id, $account_id, $base_round_id,
        $new_freespins, 1, 1, 1, 1, $amount_type, $round_ids, $history,
        $spin_type, $fs_details);

    // To ensure if one new set of fs which was triggered from another FS
    // is going to start, freespinState should be 0. Because end of parent spins
    // does not mean end of round. Some children fs is remaining.
    $round->freespinState = 0;
}


 ?>
