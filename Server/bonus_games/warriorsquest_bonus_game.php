<?php
		
/*
	 * @func handle_freespins_chinesedynasty()
	 * This function will be called to AWARD THE FREESPINS, if conditions satisfied.
	 * This will be called in normal spin and freespin. It will not be called in respin
	 * round. Since respin can not triggere freespins.
	 * */
	function handle_freespins_chinesedynasty(&$round, $details) {
		$central_reels = ['central_reels_index' => '', 'central_reels_length'=>''];
		$freespin_symbol = $details['freespin_symbol'];
		$central_reels['central_reels_index'] = $details['central_reels_index'];
		$central_reels['central_reels_length'] =
			isset($details['central_reels_length']) ? $details['central_reels_length'] : 0;
		$game = $round->game;
		$num_freespin_symbols = get_element_count_chinesedynasty($round->matrix, 																						$freespin_symbol, $central_reels);

		if(!isset($details[$num_freespin_symbols])) {
			return;
		}

		$num_freespins = $details[$num_freespin_symbols]['num_freespins'];
		# @ todo hardcoded this. Make it dynamic
		$multiplier = 1;
		$game = $round->game;
                $fs_details = array('fs_game_id' => $round->game->reelsetConfig['fs_sub_game_id']);
                $spin_type = 2;

		award_freespins($game->gameId, $game->subGameId, $round->player->accountId,
			$round->roundId, $num_freespins, $multiplier,
			$round->coinValue, $round->numCoins, $round->numBetLines,
			$round->amountType, '', '', $spin_type, $fs_details);

		$freespins_info = Array('type' => 'freespins', 'num_spins' => $num_freespins,
	                          'spins_left' => $num_freespins, "win_amount" => 0);

		array_push($round->bonusGamesWon, $freespins_info);
	}

	function get_element_count_chinesedynasty($matrix, $element, $central_reels) {
		$flip_matrix = flip_2d_array($matrix);
		$temp_array = [];
		$central_reels_index = $central_reels['central_reels_index'];
                $central_reels_length = $central_reels['central_reels_length'];

                if( count($central_reels_index) <= 0 ) {
                    return 0;
                }

		foreach($central_reels_index as $i) {
			array_push($temp_array, $flip_matrix[$i]);
		}

		$flat_matrix = generate_flat_matrix_chinesedynasty($temp_array, $central_reels_length);
		return get_element_count($flat_matrix, $element);
	}

	function generate_flat_matrix_chinesedynasty($matrix, $central_reels_length) {
		$tempArray = Array();

		for($i = 0; $i < count($matrix); $i++) {
			for($j = 0; $j < $central_reels_length[$i]; $j++) {
				array_push($tempArray, $matrix[$i][$j]);
			}
		}

		return $tempArray;
	}

    function check_bonus_round($round) {
        $bonusConfig = $round->game->bonusConfig;

        if(!$bonusConfig) {
            return false;
        }

        $details = $bonusConfig['freespins']['normal'][0]['details'];
        $central_reels = ['central_reels_index' => '', 'central_reels_length'=>''];
        $freespin_symbol = $details['freespin_symbol'];
        $central_reels['central_reels_index'] = $details['central_reels_index'];
        $central_reels['central_reels_length'] = $details['central_reels_length'];
        $game = $round->game;
        $num_freespin_symbols = get_element_count_chinesedynasty($round->matrix, 
            $freespin_symbol, $central_reels);

        if(!isset($details[$num_freespin_symbols])) {
            return false;
        }
        else {
            return true;
        }


    }

	/**
	 * @func handle_respin_chinesedynasty.
	 * AWARD THE RESPIN.
         * According to the line win of current round, check 
         * (1) Is new respin triggered ? OR 
	 * (2) Should previous respin be continued ?
	 * **/
    function handle_respin_chinesedynasty($round, $details) {
        global $paylines_config, $db;
        $temp = []; $won_symbols = []; $won_symbol = null;

        // If bonus feature and single symbol line win in same spin, 
        // respin will not be awarded.
        if( check_bonus_round($round) ) {
            return ;
        }

        $payLinesWinDetails = $round->paylineWins['details'];

        // @var $payLinesWinDetails
        // "format": "betline_number;win;blink;num_repeats;betline;matrix_positions"
        if( isset($payLinesWinDetails) && ($payLinesWinDetails != '') ) {
            $payLinesWinDetailsArray = explode(';',$payLinesWinDetails);
            $cluster_position = [];
            $triggered_round_win = 0;

            foreach($payLinesWinDetailsArray as $val) {
                $valArray = explode(':',$val);  // TODO  $valArray[4]  is a string but we are using it as array below
                array_push($temp, array('betline_number' => $valArray[0], 
                    'win' => $valArray[1], 'num_repeats' => $valArray[3],
                    'symbol' => $valArray[4][0], 'status' => 0, 
                    'betline' => $valArray[4]));

                $won_symbols[] = $valArray[4][0];
                $triggered_round_win += $valArray[1];

                $won_positions = explode(',',$valArray[5]);
                $cluster_position = array_merge($cluster_position, $won_positions);
            }
        }

        // TODO  TODO  here in else we should return the fubction. If there is no any win 
        // respin not possible. So just return.

        // TO CHECK IF MULTIPLE TYPE OF ELEMENTS COMPRISES THE WINNINGS
        // Here access the old win paylines details. And compare them with new payline wins.
        //If any old payline's size increased continue the respin.Otherwise end the respin.
        // Old (previous) round's payline wins could be found in function
        //handle_respin_round_chinesedynasty().Access them any how here.
        $distinct_elements = array_unique($won_symbols);
        $won_amount = 0;
        set_parent_type($round);

        // Below if condition . Its checking - is current round is re spin round ?
        // If current round is respin round just update the existing respin round.
        // If further respin is continued just insert another fresh record for reSpin
        // and update state 1 for old one.
        if( ( isset($round->freeSpins['details']['win_positions']) ) &&
            ( count($round->freeSpins['details']['win_positions']) > 0 ) ) {

            // This block for a respin only.
            $new_cluster_details = check_cluster_size($payLinesWinDetailsArray, $round);
            $round->parentSpintype =  $round->freeSpins['details']['client_parent_type'];

            if(full_screen_cluster($round, $new_cluster_details)) {
                return false;
            }

            if(!$new_cluster_details['continue_respin']) {
                $status = 1;
            // It will ensure win from elements other than respin element, 
            // not sent to player balance.
                $round->winAmount = $new_cluster_details['total_win'];

            // Set flag for end of respin of last freespin.
            // Set flag for end of respin of last freespin.
            // Control will go inside the below if condition if this
            // is the end of respin triggered from the last freespin.
                if(isset($round->freeSpins['details']['parent_spins_left']) 
                    && ($round->freeSpins['details']['parent_spins_left'] == 0)
                    && isset($round->freeSpins['details']['spin_type']) 
                    && ($round->freeSpins['details']['spin_type'] == 'respin') 
                    && isset($round->freeSpins['details']['parent_type']) 
                    && ($round->freeSpins['details']['parent_type'] != 'normal')) {

                    $round->freespinState = 1;
                    $round->respinState = 1;
                    // $round->freeSpins['win_amount'] will be set in total_fs_win_amount and sent to client.
                    // freeSpins['win_amount'] stores win amount upto previous round. So add current round win also.
                    // But now code in core file has been modified to add win of current round also in this variable.
                    // So no need to add here. // 06042019
                    //$round->freeSpins['win_amount'] = $round->winAmount + $round->freeSpins['details']['parent_fs_win_amount'];
                    $round->freeSpins['win_amount'] = $round->freeSpins['details']['parent_fs_win_amount'];// 06042019
                }

                // Since this is end of respin =>  update state of re-spin record to 1.
                // Update win amount of respin round in last respin row.
                // Add win amount of respin into the parent freespin.
                // respin round into parent freespin.
                $detail = $round->freeSpins['details'];
                $detail['total_win'] = $new_cluster_details['total_win'];
                $detail_js = json_encode($detail);
                update_respin_state($round, $status, $new_cluster_details['total_win'], 
                    $new_cluster_details['won_pos'], $detail_js) ;
                update_parent_freespin($round, $new_cluster_details['total_win']);
                set_next_round_msg($round);
            }
            else {
                $status = 0;
                $win_positions = $new_cluster_details['won_pos'];   // 01042019

                $symbol = $round->freeSpins['details']['symbol'];

                $fs_detail_data = prepare_fs_details($round, $symbol,#$won_symbols[0], 
                    $triggered_round_win, $win_positions);

                $fs_detail_data['win_positions'] = $win_positions; // 01042019
                $win_positions = $fs_detail_data['win_positions'];
                $parent = $round->freeSpins['details']['parent_type'];
                $fs_detail_data['client_parent_type'] = $parent;

                if(($parent == 'freespin') || ($parent == 'freespins') 
                    || ($parent == 'respin') || ($parent == 'respins') ) {

                    $fs_detail_data['client_parent_type'] = 'freespins';
                }

                // Below if condition is to ensure that a respin having parent
                // normal spin will not store parent_spins_left, 
                // Reason: To manage freespin_state issue caused due to the 
                // introduction of method setFreespinState() in round.php 
                if($round->freeSpins &&
                    !isset($round->freeSpins['details']['parent_spins_left'])) {

                    if(isset($fs_detail_data['parent_spins_left'])) {
                        unset($fs_detail_data['parent_spins_left']);
                    }

                }

                $fs_detail_data_json = json_encode($fs_detail_data);
                
                // Award a respin from a respin.
                award_respin($round, $fs_detail_data_json, $win_positions, $fs_detail_data['fs_game_id']);
            }

        }
        else {
            // This else block for new respin from a freespin AND normal spin only.
            // In case of respin control will not come here.
            // If normal spin is having full screen, respin will not be awarded.
            // If multiple symbols are envolved in win respin will not be awarded.
            if( (count($distinct_elements) != 1) || (is_full_screen($round)) ) {
                // No respin is triggered
                // On the end of normal freespin round set the state.
                if( isset($round->freeSpins['spins_left'])
                    && ($round->freeSpins['spins_left'] == 1)
                    && !isset($round->freeSpins['details']['parent_id_primary']) ) {
                    // control will come here if this is last spin of freespin round
                    // AND respin is not triggered from the last freespin.
                    // In this case send flag of end of freespin round.
                    $round->freespinState = 1;
                }

                return false;
            }

            // New respin is triggered from fs or normal
            $won_betline_info = [];
            $won_betline_info['in_process_index'] = '';
            $won_betline_info['multiplier'] = 1;
            $won_betline_info['parent_type'] = $round->spinType;
            $won_betline_info['parent_type'] = ($round->spinType == "freespin" ? "freespins" : $round->spinType);

            // If this is freespin round, body of this function(save_freespin_in_respin)
            // will execute. Its body will not be executed in normal spins. It will
            // save the details of a fs into the details column in freespins table
            // of a respin record.
            save_freespin_in_respin($round, $won_betline_info);

            $won_betline_info['spin_type'] = 'respin';
            $won_betline_info['win_positions'] = [];
            $won_betline_info['win_positions'] = array_values(array_unique(array_merge($cluster_position, 
                $won_betline_info['win_positions'])));
            $won_betline_info['total_win'] = $triggered_round_win;
            $won_betline_info['symbol'] = $won_symbols[0];
            $won_betline_info['fs_game_id'] = $round->game->reelsetConfig['respin_reels']['sub_game_id'][$won_symbols[0]];
            $won_betline_info['client_parent_type'] = ($round->spinType == "freespin" ? "freespins" : 'normal');

            // Below if condition is to ensure that a respin triggered
            // from a normal spin will not store parent_spins_left,
            // Reason: To manage freespin_state issue caused due to the
            // introduction of method setFreespinState() in round.php

            if(!$round->freeSpins) {
                if(isset($won_betline_info['parent_spins_left'])) {
                    unset($won_betline_info['parent_spins_left']);
                }
            }

            $temp_json = json_encode($won_betline_info);
            // Award a respin from a normal spin or freespin.
            award_respin($round, $temp_json, $won_betline_info['win_positions'], $won_betline_info['fs_game_id']);
        }

    }

	function full_screen_cluster($round, $new_cluster_details) {

			// Full screen cluster
			if(is_full_screen($round)) {
				$state = 1;
				$round->winAmount = $new_cluster_details['total_win'];
				$details = $round->freeSpins['details'];
				$details['won_pos'] = array_values($new_cluster_details['won_pos']);
				$details_json = json_encode($details);
				update_respin_state($round, $state, $new_cluster_details['total_win'], 
					$new_cluster_details['won_pos'], $details_json) ;
				update_parent_freespin($round, $new_cluster_details['total_win']);  
				set_next_round_msg($round);

				return true;
			}

			return false;
	}

        function is_full_screen($round) {
            $flipped_matrix = flip_2d_array($round->matrix);
            $flat_matrix = []; $reel_length = $round->game->bonusConfig['reels_length'];

            for($i = 0; $i < count($flipped_matrix); $i++) {
                $temp = array_slice($flipped_matrix[$i], 0, $reel_length[$i]);
                $flat_matrix = array_merge($temp, $flat_matrix);
            }

            $distinct_elements = array_unique($flat_matrix);    

            //$distinct_elements = array_unique($round->matrixFlatten);

		if( count($distinct_elements) == 1 ) {
			return true;
		}
		else{
			return false;
		}
	}

	function set_next_round_msg($round) {

		if(isset($round->freeSpins['details']['parent_spins_left']) && 
			$round->freeSpins['details']['parent_spins_left'] > 0) {

			$round->nextRound['num_spins'] = $round->freeSpins['details']['total_parent_spins'];
			$round->nextRound['spins_left'] = $round->freeSpins['details']['parent_spins_left'];
			$round->nextRound['type'] = 'freespins';
		}

		$round->bonusGamesWon = array();
	}

	function prepare_fs_details(&$round, $symbol, $triggered_round_win, $cluster_position) {
		$won_betline_info = $round->freeSpins['details'];

		if(isset($won_betline_info['parent_type']) && $won_betline_info['parent_type'] == 'normal') {
			// For respins triggered from the normal spin.
		}
		else {
			$won_betline_info['parent_type'] = ($round->spinType == "freespin" ? "freespins" : $round->spinType);
		}

		save_freespin_in_respin($round, $won_betline_info);

		$won_betline_info['spin_type'] = 'respin';
		$won_betline_info['win_positions'] = [];
		$won_betline_info['win_positions'] = array_values(array_unique(array_merge($cluster_position, 
			$won_betline_info['win_positions'])));
		$won_betline_info['total_win'] = $triggered_round_win;
		$won_betline_info['symbol'] = $symbol; // $won_symbols[0];
		$won_betline_info['fs_game_id'] = $round->game->reelsetConfig['respin_reels']['sub_game_id'][$symbol];

		$won_betline_info['multiplier'] = $round->freeSpins['details']['multiplier'];

                if( $round->freeSpins['details']['parent_type'] != 'normal' ) {
                    $max_mutliplier = $round->game->bonusConfig['max_respin_multiplier'];

                    if($won_betline_info['multiplier'] < $max_mutliplier) {
                        $won_betline_info['multiplier'] = 1 + (int)$round->freeSpins['details']['multiplier'];
                    }
		}

		return $won_betline_info;
	}

        /*
         * @ fun save_freespin_in_respin
         * This function is useful when respin is triggered from a freespin.
         * @ parent_id_primary , It will store the value of id column in freespins table.
         * freespins.id will be saved into the key parent_id_primary in details of a
         * @var parent_fs_round_id, not in use. Could be removed ! check ! TODO
         * respin.
         * */
        function save_freespin_in_respin($round, &$won_betline_info) {

            if($round->freeSpins && $round->freeSpins['spins_left'] > 0) {

                $won_betline_info['total_parent_spins'] =
                    isset($won_betline_info['total_parent_spins']) ? $won_betline_info['total_parent_spins'] : 
                    $round->freeSpins['num_spins'];
                 
                $won_betline_info['parent_spins_left'] = 
                    isset($won_betline_info['parent_spins_left']) ? $won_betline_info['parent_spins_left'] :  
                    $round->freeSpins['spins_left'] - 1;
                 
                // when respin triggered from freespin // TODO review this if condition ****
                if(isset($round->freeSpins['base_round_id'])
                    && ($round->freeSpins['base_round_id'])) {

                    $won_betline_info['parent_fs_round_id'] = $round->roundId;
                    $won_betline_info['parent_fs_win_amount'] = $round->freeSpins['win_amount'];
                    $won_betline_info['parent_id_primary'] = $round->freeSpins['id'];
                }

                // when respin triggered from respin
                if(isset($round->freeSpins['details']['parent_id_primary'])) {
                    $won_betline_info['parent_id_primary'] = $round->freeSpins['details']['parent_id_primary'];
                    $won_betline_info['parent_fs_round_id'] = $round->freeSpins['details']['parent_fs_round_id'];
                    $won_betline_info['parent_fs_win_amount'] = $round->freeSpins['details']['parent_fs_win_amount'];
                }

            }

        }

	// TODO remove if and else condition present in this function.
	//$details will always have some value.
	function update_respin_state($round, $status, $win, $win_pos, $details='') {
		global $db;

		$game_id = $round->game->gameId;
		$sub_game_id = $round->game->subGameId;
		$account_id = $round->player->accountId;
		$round_id = $round->freeSpins['id'];
		$win = to_base_currency($win);
		//$win = $win * $round->freeSpins['details']['multiplier'];

		$tableName = 'gamelog.freespins';

		if($round->amountType == AMOUNT_TYPE_FUN) {
			$tableName = 'gamelog.freespins_fun';
		}

		if($details) {
			$update_repin_win = <<<QUERY
				UPDATE {$tableName} SET state=1, win_amount = $win, details='{$details}'
				WHERE game_id='$game_id' AND sub_game_id='$sub_game_id' AND account_id='$account_id' AND state=0 AND id='$round_id'

QUERY;
		}
		else {

		$update_repin_win = <<<QUERY
			UPDATE {$tableName} SET state=1, win_amount = $win
			WHERE game_id='$game_id' AND sub_game_id='$sub_game_id' AND account_id='$account_id' AND state=0 AND id='$round_id'

QUERY;
		}

		$result = $db->runQuery($update_repin_win) or ErrorHandler::handleError(1, "CHN_DYNS001");
        }

	/*
	 * @fun check_cluster_size()
	 * Used in a respin to check the size of cluster.
	 * Size of new cluster, finds the position of new
	 * added symbols if any. Decides new respin should be awarded 
	 * or not on the basis of new cluster's size, returns all
	 * sticky positions.
	 * */
    function check_cluster_size($payLinesWinDetailsArray, $round) {
        $pre_win_positions = $round->freeSpins['details']['win_positions'];
        $new_win_positions_array = [];
        $win_amount = 0;
        $paylines = [];

        // To handle blik matrix in sticky respin
        // For other symbols not included in cluster, will
        // not be part of blink mtrix.
        $cluster_symbols_details = array(); 

        foreach($payLinesWinDetailsArray as $temp1) {
            $temp2 = explode(':', $temp1);
            $payline_win_indices_str = $temp2[5]; // $payline_win_indices_str   22:30:11110:4:ccccb:5,6,12,8
            $payline_win_indices_arr = explode(',', $payline_win_indices_str);

            for($i = 0; $i <count($payline_win_indices_arr); $i++) {

                if( in_array($payline_win_indices_arr[$i], $pre_win_positions) ) {
                    $new_win_positions_array = array_values(array_unique(
                        array_merge($new_win_positions_array, $payline_win_indices_arr)));
                    $win_amount += $temp2[1];
                    array_push($paylines, $temp2[0]);
                    array_push($cluster_symbols_details, $temp1);

                    break;
                }
            }
        }

        $round->paylineWins['details'] = implode(';', $cluster_symbols_details);

        if(count($new_win_positions_array) > count($pre_win_positions)) {
            // reward respin
            $continue_respin = true;
        }
        else {
            // End of respin
            $continue_respin = false;
        }

        $win_amount = $win_amount * (int)$round->freeSpins['details']['multiplier']; // 25032019
        set_win_lines_log($cluster_symbols_details, $round);

        return array('continue_respin' => $continue_respin, 'total_win' => $win_amount, 'won_pos' => $new_win_positions_array,
            'paylines' => $paylines);
    }

    /*
     * @fun set_win_lines_log
     * In Respin round winning combination due to other symbols
     * should not be logged in slot_round.win_lines in database. 
     * This function will ensure only win lines containing one 
     * symbol(which triggered respin) will be present and if any 
     * other, will be removed.
     * */
    function set_win_lines_log($cluster_symbols_details, $round) {
        $multiplier = (int)$round->freeSpins['details']['multiplier'];
        $symbol = $round->freeSpins['details']['symbol'];
        $temp_winlines = array();

        for($i = 0; $i < count($round->winLineNumbers); $i++) {
            $win_symbol_set = str_split($round->winLineNumbers[$i][1]);

            if($win_symbol_set[0] == $symbol) {
                $round->winLineNumbers[$i][4] = $multiplier;
                array_push($temp_winlines, $round->winLineNumbers[$i]);
            }
        }

        $round->winLineNumbers = $temp_winlines;

    }

	function get_respin_game_id($round) {
		$symbol = $round->freeSpins['details']['symbol'];
		return $round->game->reelsetConfig['respin_reels']['sub_game_id'][$symbol];
	}

	// @ fun handle_last_freespin. Used to set flag when respin triggered from the last freeSpins
	//
	function handle_last_freespin($round, $json_data, $win_positions) {
		$data = json_decode($json_data, true);

		if( ($round->spinType == 'freespin') && ($round->freeSpins['spins_left'] == 1)
				&& ($data['parent_spins_left'] == 0) && ($data['spin_type'] == 'respin') && ($data['parent_type'] != 'respin')  ) {

			$round->respinState = 0;
		}
	}

        function award_respin($round, $json_data, $win_positions, $fs_game_id) {
            global $db;
            $game_id = $round->game->gameId;
            $sub_game_id = $fs_game_id;
            $account_id = $round->player->accountId;
            $amount_type = $round->amountType;
            //$round_id =  $round->roundId;
            $round_ids = json_encode(array($round->roundId));
            $coin_value = $round->coinValue;
            $num_coins = $round->numCoins;
            $num_betlines = $round->numBetLines;
            $multiplier = 1;
            $num_spins = 1;
            $spins_left = 1;
            $details = $json_data;
            $state = 0;

            set_win_amount($round);
            $win_amount = to_base_currency($round->winAmount); // BBB
            handle_last_freespin($round, $json_data, $win_positions);

            // parent_id should be the id of normal spin which triggred the parent freespin or respin.
            // for respin from respin -> take parent_id from the detail column.
            // Actually in this case controle will not come here. So no need to do any thing
            // for respin from respin. In this case just update will happen. // TODO BBB
            //$base_round_id = isset($round->freeSpins['round_id']) ? $round->freeSpins['round_id'] : $round->id;  // 25032019
            $base_round_id = isset($round->freeSpins['base_round_id']) ? $round->freeSpins['base_round_id'] : $round->roundId; 
	    $spin_type = 3;

	    $tableName = 'gamelog.freespins';

	    if($round->amountType == AMOUNT_TYPE_FUN) {
		    $tableName = 'gamelog.freespins_fun';
	    }

            $log_respin_wins = <<<QRY
                        INSERT INTO {$tableName}(game_id, sub_game_id, amount_type,
                                account_id, coin_value, num_coins, num_betlines, num_spins,
                                spins_left, win_amount,multiplier, details, state, base_round_id, spin_type)
                        VALUES ($game_id, $sub_game_id, $amount_type, $account_id,
                                $coin_value, $num_coins, $num_betlines, $num_spins, $spins_left,
                                $win_amount, $multiplier, '{$details}', $state, $base_round_id, $spin_type)
QRY;

            $result = $db->runQuery($log_respin_wins) or ErrorHandler::handleError(1, "CHN_DYNS002 ");
            $respin_data_arr = json_decode($json_data, true);

            set_bonus_win($round, array($num_spins, $spins_left, 'respins', $win_positions, $respin_data_arr['multiplier']));

            $round->nextRound['num_spins'] =  $num_spins;
            $round->nextRound['spins_left'] =  $spins_left;
            $round->nextRound['multiplier'] =  $respin_data_arr['multiplier']; //  $multiplier; // 10032019
            //$round->nextRound['win_positions'] =  $win_positions; // 31032019
            $round->nextRound['sticky_positions'] =  $win_positions; // 31032019
            $round->nextRound['type'] =  'respins';
        }

	function set_parent_type($round) {
		if($round->freeSpins) {
			// If a respin triggered from the freespin round. Means parent_type of current round(FS) will be normal.
			$round->parentSpintype = 'normal'; // TODO freespin and freespins
			if( isset($round->freeSpins['details']['client_parent_type']) ) {
				$round->parentSpintype = $round->freeSpins['details']['client_parent_type']; // 18032019
			}
		}

	}

	function set_bonus_win($round, $bonus_win) {
		$round->reSpin['num_spins'] =  $bonus_win[0];
		$round->reSpin['spins_left'] =  $bonus_win[1];
		$round->reSpin['type'] =  $bonus_win[2];
                //$round->reSpin['win_positions'] =  $bonus_win[3]; // 31032019
                $round->reSpin['sticky_positions'] =  $bonus_win[3]; // 31032019
		$round->reSpin['multiplier'] =  $bonus_win[4];
		$respin_info = $round->reSpin;
		array_push($round->bonusGamesWon, $respin_info);
	}

	/**
	 * @ fun update_parent_freespin
	 * On the end of respins triggered from a freespin, all win amount in respin round
	 * will be added into freespin.
	 * */
	function update_parent_freespin($round, $new_won_amount) {
		global $db;
                $round_id = isset($round->freeSpins['details']['parent_id_primary']) ? 
                    $round->freeSpins['details']['parent_id_primary'] : '';

                if(!$round_id) {
                    return ;
                }
		$new_won_amount = to_base_currency($new_won_amount);

		// Below if block is to send win amount to client in total_fs_win_amount
		// This is needed for respins triggered from a normal spin.
		if($round->freeSpins['details']['parent_type'] == 'normal') {
			$round->freeSpins['win_amount'] = $new_won_amount;
		}

		if(!$new_won_amount) {
			return false;
		}

		$tableName = 'gamelog.freespins';

		if($round->amountType == AMOUNT_TYPE_FUN) {
			$tableName = 'gamelog.freespins_fun';
		}

		$update_spin_win = <<<QUERY
			UPDATE {$tableName} SET win_amount = win_amount + $new_won_amount
			WHERE id='$round_id'

QUERY;

		$result = $db->runQuery($update_spin_win) or ErrorHandler::handleError(1, "CHN_DYNS004");
	}

	/*
	 * @fun set_win_amount
	 * In respin mode amount will not be paid. It will be just collected from every respin.
	 * Once respin will end amount will be paid. This amount will include the win amount
	 * in parent round (normal spin) which triggered the respin.
	 * $round->winAmount is used to update the player balance.
	 * */
	function set_win_amount($round) {
		$round->winAmount = 0;
	}

	/*
	 * @fun handle_respin_round_chinesedynasty.
	 * PLAY RESPIN ROUND
	 * This will be called from the post matrix handler. handlePostMatrixFeatures() is called from the
	 * doSpin() of spin_handler.php
	 * Here winning combinations of the previous round will be placed on their position and respin.
	 * This function will just place the won elemnts of a payline of prev round in the current matrix.
	 *
	 * Check if this is respin round then in respin all elements of matrix will be generatedd
	 * To check a spin is respin or not , we can get some flag from the client side and decide otherwise
	 * but elements for the won pay lines will be fixed.
	 * We could query from the db to check is there any respin remaining ?  TODO ***
	 *
	 * */
	function handle_respin_round_chinesedynasty($round, $details) {
		global $paylines_config;

		$num_of_betlines = isset($round->freeSpins['details']['win_positions']) ? count($round->freeSpins['details']['win_positions'])  :  0;

		// Below if condition is to ensure that current spin is re-spin round.
		if( !(isset($round->freeSpins['details']['spin_type']) && ($round->freeSpins['details']['spin_type'] == 'respin') )
							|| ($num_of_betlines < 1) ) {
			return false;
		}

		$betline_data = $round->freeSpins['details'];
		$respin_element = $betline_data['symbol'];
		$sub_game_id = $round->game->reelsetConfig['respin_reels']['sub_game_id'][$respin_element];
		$paylinesKey = $round->game->paylines."_".$round->game->numRows.'x'.$round->game->numColumns;

		if( !isset($paylines_config[$paylinesKey]) ) {
			print "Paylines not configured to this machine";
		}

		$payLines = $paylines_config[$paylinesKey];
		place_cluster_symbols($round, $betline_data);
	}

	/*
	* @fun place_cluster_symbols
	* Used in a respin round. It will place the cluster symbols of respin round on their position.
	* And then line win is cakculated.
	* */
	function place_cluster_symbols($round, $betline_data) {
		$symbol = $betline_data['symbol'];
		$cols = $round->game->numColumns;

		for($i = 0; $i < count($betline_data['win_positions']); $i++) {
			$ind = $betline_data['win_positions'][$i];
			$round->matrixFlatten[$ind] = $symbol;
			$quotient = (int)($ind / $cols);
			$reminder = ($ind % $cols);
			$round->matrix[$quotient][$reminder] = $symbol;
		}

		$round->matrixString = array2d_to_string($round->matrix);
		$round->matrixFlatten = $round->generateFlatMatrix($round->matrix);
	}
?>
