<?php
require_once "tools.lib.php";

class MessageHandler
{
	var $casinoObj, $message;

	public function __construct($game, $round, $player)
	{
		$this->game     = $game;
		$this->round    = $round;
		$this->player   = $player;
		$this->message  = Array('player'         => Array(),
								 'game'          => Array(),
								 'current_round' => Array(),
								 'next_round'    => Array(),
								 'promo_details' => Array(),
							 	 'misc'          => Array());
	}

	public static function sendMessage($game, $round, $player)
	{
		$messageHandler = new MessageHandler($game, $round, $player);
		$messageHandler->setMessage();
	}

	private function setMessage()
	{
		
		$requestType = $this->round->requestParams['request_type'];
		$this->setPromoDetails();
		if($requestType == INIT_MODE) {
			$this->setFullGameInfo();
			$this->setPreviousRoundInfo();                                                                                                          
            $this->message['rgs_user_id']=$_SESSION['rgs_user_id'];     
		}

		if($requestType == PLAY_MODE) {
			$this->setGameInfo();
			$this->setCurrentRoundInfo();
		}
		if($requestType == ExtraFSMode) {
			$this->setGameInfo();
			$this->setCurrentRoundInfo();
		}

		if($requestType == BONUS_MODE) {
			$this->setGameInfo();
			$this->setBonusRoundInfo();
		}

		if($requestType == GAMBLE_MODE) {
			$this->setGameInfo();
			$this->setBonusRoundInfo();
		}

		if($requestType == ENDROUND_MODE) {
			$this->setGameInfo();
			$this->setBonusRoundInfo();
		}
		if($requestType == OTHER_MODE) {
			$this->setGameInfo();
			$this->setBonusRoundInfo();
		}

		$this->setNextRoundInfo();
		$this->setGambleInfo();
		$this->setPlayerInfo();
		$this->overWriteMessage();
		$this->setQueuedInfo();
		$this->setMiscInfo();
		$this->dispatchMessage();
	}

	private function setPromoDetails() {
		
		if($this->round->bonusGamesWon or $this->round->freeSpins and $this->round->freeSpins["spins_left"] > 0  ) {
			return; 
		}

		$this->message['promo_details'] = $this->player->promoDetails['curr_spin'];
		# Priority of Bonus games from PFS on PFS. If there is no bonus games from PFS
		# Then only normal PFS will be eligible for next round.
		if($this->player->promoDetails['curr_spin']['spins_left'] > 0
			&& !( $this->round->amountType == AMOUNT_TYPE_PFS
			&& ($this->round->bonusGames
			|| $this->round->freeSpins))) {

			// Below if condition is specific to game skullsgonewild only.
			// In skullsgonewild when respins are being awarded respin details not
			// coming into $this->round->bonusGamesWon or $this->round->bonusGames
			// So in this case no need to change nextRound data. respin_count
			// will identify it as a response of Skull and next round respin.

			if( isset($this->round->nextRound['type'])
				&& $this->round->nextRound['type'] == 'respins'
				&& array_key_exists('respin_count',$this->round->nextRound) ) {
					return ;
			}

			$this->round->nextRound = $this->player->promoDetails['curr_spin'];
		}

	}

	/*
	 * @fun setQueuedInfo()
	 * To set details of number of fs of queued freespins.
	 * One set of freespins could be triggered from another
	 * fs-sets. For both sets there will be separet entry
	 * into the DB. So it will help in that case to send num
	 * of fs details to client.
	 * */
	private function setQueuedInfo() {

		if(!isset($this->round->freeSpins['details']['fs_sets']) ||
			!isset($this->message['next_round']['type'])) {

			return false;
		}

		$num_spins = 0; $spins_left = 0;
		$fs_sets = $this->round->freeSpins['details']['fs_sets'];

		for($i = 0; $i < count($fs_sets); $i++) {
			$num_spins += $fs_sets[$i][0];
			$spins_left += $fs_sets[$i][0] - $fs_sets[$i][1];
		}

		$this->message['next_round']['num_spins'] = $num_spins;
		$this->message['next_round']['spins_left'] = $spins_left;
	}

	private function setPreviousRoundInfo()
	{
		$matrix = $this->round->previousRound['matrix'];
		if($this->round->previousRound['matrix2'] != null) {
			$matrix = $this->round->previousRound['matrix2'];
		}
		$this->message['previous_round'] = Array(
			'round_id'      => $this->round->previousRound['round_id'],
			'matrix'        => $this->round->previousRound["matrix"],
			'matrix2'        => $this->round->previousRound["matrix2"],
			'win_amount'    => to_coin_currency($this->round->previousRound['amount_won']),
			'num_paylines'  => $this->round->previousRound['num_betlines'],
			'coin_value'    => ($this->round->previousRound['coin_value'] ? round_half($this->round->previousRound['coin_value']):''),
			// 'coin_value'    =>  round_half($this->round->previousRound['coin_value']),
			'num_coins'     => $this->round->previousRound['num_coins'],
			'sticky_win_details' => isset($this->round->previousRound['sticky_win_details']) ?
					$this->round->previousRound['sticky_win_details'] : '',
			'other_feature_win_details' => isset($this->round->previousRound['other_feature_win_details']) ?
					$this->round->previousRound['other_feature_win_details'] : '',
			'bonus_details' => isset($this->round->freeSpins['details']['bonus_details']) ?
					$this->round->freeSpins['details']['bonus_details'] : '',
			'misc_bonus_details' => Array(),
			'misc_prizes' => $this->round->miscPrizes,
			'positions'	=> $this->round->previousRound['reel_pointers'],
			'random_symbol'	=> isset($this->round->freeSpins['details']['random_symbol']) ?
			$this->round->freeSpins['details']['random_symbol'] : '',
			//'feature_details' => isset($this->round->freeSpins['details']['feature_details']) ? $this->round->freeSpins['details']['feature_details'] : $this->round->bonusGames['game_data']['feature_details']
		);
		if(isset($this->round->freeSpins['details']['feature_details'])) {
			$this->message['previous_round']['feature_details'] = $this->round->freeSpins['details']['feature_details'];
		}
		else if(isset($this->round->bonusGames['game_data']['feature_details'])) {
			$this->message['previous_round']['feature_details'] = $this->round->bonusGames['game_data']['feature_details'];
		}
		if (isset($this->round->previousRound['misc']["rage_meter"])) {
            $this->message['previous_round']['rage_meter'] = array(
                "meter_a" =>$this->round->previousRound['misc']["rage_meter"]["a"]["value"],
                "meter_b" =>$this->round->previousRound['misc']["rage_meter"]["b"]["value"],
                "meter_c" =>$this->round->previousRound['misc']["rage_meter"]["c"]["value"],
                "meter_d" =>$this->round->previousRound['misc']["rage_meter"]["d"]["value"],
                'base_coin_value'=>$this->round->previousRound['misc']['rage_meter']['base_coin_value']
            );
        }

        if( !isset($this->message['previous_round']['progress_bar']) ) {

                $this->message['previous_round']['progress_bar'] = array();
        }

        if(isset( $this->round->previousRound['misc']["rage_meter"]['count'] )) {
                $this->message['previous_round']['progress_bar']['bar_value'] = $this->round->previousRound['misc']["rage_meter"]['count'];
        }

        if(isset($this->round->freeSpins['details']['pick_details'])) {
            $this->message['previous_round']['pick_details'] = $this->round->freeSpins['details']['pick_details'];
        }
		
		$this->setPreviousBonusDetails();
	}

	private function setPreviousBonusDetails()
	{
		if(isset($this->round->nextRound['type']) &&
		   $this->round->nextRound['type'] == 'bonus_game') {
			$this->message['previous_round']['bonus_details'] = Array($this->round->nextRound);
		}

		if(isset($this->round->prevBonusGames)) {
			#print_r($this->round->prevBonusGames);
            foreach($this->round->prevBonusGames as $ind => $val) {
			    array_push($this->message['previous_round']['misc_bonus_details'], $val);
            }
			#array_push($this->message['previous_round']['misc_bonus_details'], $this->round->prevBonusGames);
		}
	}

	private function setPlayerInfo()
	{
		$this->message['player'] = Array(
			'first_name'  => $this->player->firstName,
			'user_name'   => $this->player->userName,
			'account_id'  => $this->player->accountId,
			'balance'     => $this->player->balance,
			'balance2'     => $this->player->balance2,
			#'bank'        => $this->player->bank,
			'cash'        => $this->player->cash,
			'cash2'        => $this->player->cash2,
			'currency'    => $this->player->currency,
			'bonus_amount' => $this->player->bonusAmount);
	}

	private function setGameInfo()
	{
		$this->message['game'] = Array(
			'game_id'   => $this->game->gameId,
			'game_name' => $this->game->gameName);
	}

private function add_pattable(){
		$payTable_arr = Array();
		try {
			foreach ($this->game->payTable as $key => $value) {
				$pays =  array_reverse(array_values( $this->game->payTable[$key]));
				$payTable_arr[$key] = $pays;
				
			}
		} catch (\Throwable $th) {
			return $this->game->payTable;
		}
		return $payTable_arr;
}

	private function setFullGameInfo()
	{
		$num_paylines_fs = isset($this->game->misc['num_paylines']['freespin']) ?
			$this->game->misc['num_paylines']['freespin'] : $this->game->paylines;

		$coins = isset($this->game->misc['extra_coins']) ?
			$this->game->misc['extra_coins'] : "";

		$buyFg = isset($this->game->misc['symbol_config']["BuyFg"]["normal"]["buy_fg"]) ? $this->game->misc['symbol_config']["BuyFg"]["normal"]["buy_fg"] : '';
		$anteBet = isset($this->game->misc['symbol_config']["anteBet"]["normal"]["ante_bet"]) ? $this->game->misc['symbol_config']["anteBet"]["normal"]["ante_bet"] : '';

		$max_win = isset($this->game->misc['max_details']) ? $this->game->misc['max_details']['max_win'] : '';
		$max_win_hit = isset($this->game->misc['max_details']) ? $this->game->misc['max_details']['max_hit_rate'] : '';
		$extra_info = isset($this->game->misc['extra_info']) ? $this->game->misc['extra_info'] : '';

		$this->message['game'] = Array(
			'game_id'            => $this->game->gameId,
			'subGameId'            => $this->game->subGameId,
			'game_name'          => $this->game->gameName,
			'num_rows'           => $this->game->numRows,
			'num_columns'        => $this->game->numColumns,
			'min_coins'          => $this->game->minCoins,
			'max_coins'          => $this->game->maxCoins,
			'default_coins'      => $this->game->defaultCoins,
			'num_coins'          => $this->game->defaultCoins,
			'default_coin_value' => $this->game->defaultCoinValue,
			'coin_values'        => array1d_to_string($this->game->coinValues),
			'coin_values2'        => array1d_to_string($this->game->coinValues),
			'fixed_coins'        => $this->game->fixedCoins,
			'paylines_type'      => $this->game->paylinesType,
			'num_paylines'       => $this->game->paylines,
			'num_paylines_fs'    => $num_paylines_fs,
			'paytable'    => $this->add_pattable(),
			'rtp'                => $this->game->rtp,
			'extra_coins'		 => $coins,
			'max_win'            => $max_win,
			'max_win_hit'        => $max_win_hit,
			'extra_info'         => $extra_info,
			'buyFg'         => $buyFg,
			'anteBet'         => $anteBet,
		);
	}

	private function setCurrentRoundInfo()
	{
		$extra_info = isset($this->game->misc['extra_info']) ? $this->game->misc['extra_info'] : '';

		$this->message['current_round'] = Array(
			'round_id'      => $this->round->roundId,
			'matrix'        => $this->round->matrixString,
			// 'payline_wins'  =>json_encode( $this->round->paylineWins),
			'payline_wins'  => $this->round->paylineWins,
			'win_amount'    => $this->round->winAmount,
			'screen_wins'   => $this->round->screenWins,
			'parent_type'   => $this->round->parentSpintype,
			// 'post_matrix_info'  => $this->getPostMatrixInfo()==null ? '':json_encode($this->getPostMatrixInfo()),
			'post_matrix_info'  => $this->getPostMatrixInfo()==null ? '': $this->getPostMatrixInfo(),
			'multipliers'   => $this->getMultipliersInfo(),
			'cluster_wins'  => $this->getClusterWins(),
			// 'bonus_games_won'   => $this->getBonusGamesWon()!=null ? json_encode($this->getBonusGamesWon()),
			// 'bonus_games_won'   => $this->getBonusGamesWon()==null? '':json_encode($this->getBonusGamesWon()),
			'bonus_games_won'   => $this->getBonusGamesWon()==null? '': $this->getBonusGamesWon(),
			'payline_win_amount'    => $this->round->paylineWinAmount,
			'spin_type'     => $this->round->spinType,
			'extra_info'    => $this->player->extraInfo,
			'game_extra_info'    => $extra_info,
			// 'misc_prizes'	=> $this->round->miscPrizes==null ? '':json_encode($this->round->miscPrizes),
			'misc_prizes'	=> $this->round->miscPrizes==null ? '': $this->round->miscPrizes,
			// 'positions'	=>json_encode( $this->round->reelPointers),
			'positions'	=> $this->round->reelPointers,
			'blastPosition'	=> $this->round->blastPosition,
			'scatter_win'	=> $this->round->scatterWin,
			
		);

		# todo todo todotodo change this. It is hardcoded
		$this->message['current_round']['cluster_wins'] = $this->getClusterWins();
		if($this->getStickyWins()) {
			$this->message['current_round']['trigger_sticky_win'] = $this->getStickyWins();
		}
		if(isset($this->round->sticky_win_round)) {
			$this->message['current_round']['sticky_win_round'] = isset($this->round->sticky_win_round) ? $this->round->sticky_win_round : false;
		}

		if($this->round->freeSpins and $this->round->freeSpins['win_amount']) {
			$this->message['current_round']['total_fs_win_amount'] =
				$this->round->freeSpins['win_amount'];
		}

		if($this->round->freeSpins and $this->round->freeSpins['total_win_amount']) {
			$this->message['current_round']['total_fs_win_amount'] =
				$this->round->freeSpins['total_win_amount'];
		}
		// if(isset($this->round->freeSpins['details']['feature_details'])){
//              $this->message['current_round']['feature_details'] = $this->round->freeSpins['details']['feature_details'];
//          }

		$this->setRespinInfo();
		#$this->setMiscInfo();
	}

	// To handle the respin triggered from the last freespin
	public function setRespinInfo() {
		if(isset($this->round->freespinState)) {
			$this->message['current_round']['freespin_state'] = $this->round->freespinState;
		}

		if(isset($this->round->respinState)) {
			$this->message['current_round']['respin_state'] = $this->round->respinState;
		}
	}

	private function setMiscInfo() {
		global $misc_info;
		$this->message['misc']['rng'] = $misc_info['rng_type'];

		if(!isset($this->round->unityFeature) or !$this->round->unityFeature) {
			return;
		}

		array_push($this->message['current_round']['bonus_games_won'],
				   $this->round->unityFeature);
	}

	private function setBonusRoundInfo()
	{
		$this->message['current_round'] = $this->round->bonusGameRound;
	}

	# todo need to have this file in stickyWins class file
	private function getStickyWins() {
		if(isset($this->round->otherWins['trigger_sticky_win'])) {
			return $this->round->otherWins['trigger_sticky_win'];
		}

		return false;
	}

	private function getClusterWins() {
		if(isset($this->round->otherWins) and $this->round->otherWins['cluster_wins']) {
			$operatorCodes = Array('RLX');

			if( in_array($this->player->opCode, $operatorCodes)
				&& ($this->round->amountType == AMOUNT_TYPE_PFS) ) {
				$clusterData = $this->round->otherWins['cluster_wins'];

				for($i = 0; $i < count($clusterData); $i++) {
					$this->round->otherWins['cluster_wins'][$i]['player_balance'] =
						$this->player->balance;
				}
			}

			return $this->round->otherWins['cluster_wins'];
		}
		return;
	}

	private function getMultipliersInfo() {
		return $this->round->multipliers;
	}

	private function getFreeSpinsInfo()
	{
		if(!$this->round->freeSpins){
			return null;
		}

		$parentType = "";
		if(isset($this->round->freeSpins['details']['parent_type'])) {
			$parentType = $this->round->freeSpins['details']['parent_type'];
		}
		$random_symbol = "";
		if(isset($this->round->freeSpins['details']['random_symbol'])) {
			$random_symbol = $this->round->freeSpins['details']['random_symbol'];
		}
		$additional_fs = "";
		if(isset($this->round->freeSpins['details']['additional_fs'])) {
			$additional_fs = $this->round->freeSpins['details']['additional_fs'];
		}
		$type = "";
		if(isset($this->round->freeSpins['details']['type'])) {
			$type = $this->round->freeSpins['details']['type'];
		}
		// $multiplie_box = "";
		$multipler_arr = [];
		if(isset($this->round->freeSpins['details']['multiplier_reel'])) {
			for ($i=0; $i < count($this->round->freeSpins['details']['multiplier_reel'] ); $i++) { 
				array_push($multipler_arr, count($this->round->freeSpins['details']['multiplier_reel'][$i]));
			}
		}
		if(isset($this->round->freeSpins['details']['jackpot_reward'])) {
			$sub_type = "freespin";
		}
		else{
			$sub_type = "select_soldiers";
		}
		return Array("num_spins"   => $this->round->freeSpins['num_spins'],
						 "spins_left"  => $this->round->freeSpins['spins_left'],
						 "multiplier"  => $this->round->freeSpins['multiplier'],
						 "win_amount"  => $this->round->freeSpins['win_amount'],
						 "fs_game_id"  => $this->round->freeSpins["details"]['fs_game_id'],
						 "parent_type" => $parentType,
						 "random_symbol" => $random_symbol,
						 "type" => $type,
						 "multipler_arr" => $multipler_arr,
						 "additional_fs" => $additional_fs,
						 "coin_value"  => $this->round->freeSpins['coin_value'],
						 "sub_type"  => $sub_type,
						 "total_win_amount"  => $this->round->freeSpins['total_win_amount'],

				);
}

	private function getPostMatrixInfo()
	{
		$matrixInfo = Array();
		/*
		foreach($this->round->postMatrixInfo as $key => $value) {
			$matrixInfo[$key] = $value;
		}

		return $matrixInfo;

		*/
		// print_r($this->round->postMatrixInfo);

		if(isset($this->round->postMatrixInfo['matrixString'])) {
			$matrixInfo['feature_name'] = $this->round->postMatrixInfo['feature_name'];
			$matrixInfo['matrix'] = $this->round->postMatrixInfo['matrixString'];

			if(isset($this->round->postMatrixInfo['random_wild_positions'])) {
				$matrixInfo['random_wild_positions'] = $this->round->postMatrixInfo['random_wild_positions']; // Davincy
			}
			if(isset($this->round->postMatrixInfo['expand_positions'])) {
				$matrixInfo['expand_positions'] = $this->round->postMatrixInfo['expand_positions'];
			}
			if(isset($this->round->postMatrixInfo['wild_symbols'])) {
				$matrixInfo['wild_symbols'] = $this->round->postMatrixInfo['wild_symbols'];
			}
			if(isset($this->round->postMatrixInfo['mystery_config'])) {
				$matrixInfo['mystery_config'] = $this->round->postMatrixInfo['mystery_config'];
			}
			if(isset($this->round->postMatrixInfo['payline_details'])) {
				$matrixInfo['payline_details'] = $this->round->postMatrixInfo['payline_details'];
			}
			if(isset($this->round->postMatrixInfo['exp_symbol'])) {
				$matrixInfo['exp_symbol'] = $this->round->postMatrixInfo['exp_symbol'];
			}
			if(isset($this->round->postMatrixInfo['exp_amount'])) {
				$matrixInfo['exp_amount'] = $this->round->postMatrixInfo['exp_amount'];
			}
			if(isset($this->round->postMatrixInfo['matrix_info'])) {
                $matrixInfo['matrixes_info'] = $this->round->postMatrixInfo['matrix_info'];
            }
		}
		if(isset($this->round->postMatrixInfo['reel_pos'])) {
			$matrixInfo['reel_pos'] = $this->round->postMatrixInfo['reel_pos'];
		}
		if(isset($this->round->postMatrixInfo['symbol'])) {
			$matrixInfo['symbol'] = $this->round->postMatrixInfo['symbol'];
		}
		if(isset($this->round->postMatrixInfo['wild_positions'])) {
			$matrixInfo['wild_positions'] = $this->round->postMatrixInfo['wild_positions'];
		}
		if (isset($this->round->postMatrixInfo['win'])) {
			$matrixInfo['win'] = $this->round->postMatrixInfo['win'];
		}
		if (isset($this->round->postMatrixInfo['multiplier'])) {
			$matrixInfo['multiplier'] = $this->round->postMatrixInfo['multiplier'];
		}
		if (isset($this->round->postMatrixInfo['count'])) {
			$matrixInfo['count'] = $this->round->postMatrixInfo['count'];
		}
		if (isset($this->round->postMatrixInfo['extra_fs'])) {
			$matrixInfo['extra_fs'] = $this->round->postMatrixInfo['extra_fs'];
		}
		return $matrixInfo;
	}

	private function getBonusGamesWon()
	{

		return $this->round->bonusGamesWon;
	}

	private function setNextRoundInfo()
	{
		if($this->round->bonusGamesWon) {
			foreach($this->round->bonusGamesWon as $key => $value) {
				if(isset($value['type']) && $value['type'] == "bonus_game"
					&& !isset($value['is_queued'])) {
					$this->round->nextRound = $value;
					break;
				}
				else if(isset($value['type']) && $value['type'] == "freespins") {
					$this->message['next_round'] = $value;
					if(isset($value['parent_type']) &&
						preg_match('/meter/',$value['parent_type'])) {
						continue;
					}
					break;
				}
			}
			//$this->message['next_round'] = $this->round->bonusGamesWon[0];
		}


		
		if($this->round->freeSpins and $this->round->freeSpins['spins_left'] > 0) {
			$spinType = "freespins";
			if(isset($this->round->freeSpins['details']['spin_type'])) {
				if($this->round->freeSpins['details']['spin_type'] == 'respin') {
					$spinType = 'respins';
				}
			}

			$freeSpinsInfo = $this->getFreeSpinsInfo();
			$this->message['next_round'] = Array(
				'type'       => $spinType,
				'num_spins'  => $freeSpinsInfo['num_spins'],
				'spins_left' => $freeSpinsInfo['spins_left'],
				'multiplier' => $freeSpinsInfo['multiplier'],
				'parent_type'=> $freeSpinsInfo['parent_type'],
				'additional_fs'=> $freeSpinsInfo['additional_fs'],
				'coin_value' => $freeSpinsInfo['coin_value'],
				'symbol' => $freeSpinsInfo['random_symbol'],
				'total_fs_win_amount' => $freeSpinsInfo['win_amount'],
				'sub_type' => $freeSpinsInfo['sub_type'],
				'fg_type' => $freeSpinsInfo['type'],
				'multipler_arr' => $freeSpinsInfo['multipler_arr'],
				'fs_game_id' => $freeSpinsInfo['fs_game_id'],

			);

			if(isset($freeSpinsInfo['total_win_amount']) &&
			   $freeSpinsInfo['total_win_amount'] > 0) {
				$this->message['next_round']['total_fs_win_amount'] = $freeSpinsInfo['total_win_amount'];
			}

			if(isset($this->round->freeSpins['details']['win_positions']) ||
				isset($this->round->freeSpins['details']['cluster']) ) {

				$win_positions = isset($this->round->freeSpins['details']['win_positions']) ?
					$this->round->freeSpins['details']['win_positions'] :
					$this->round->freeSpins['details']['cluster'];

				$this->message['next_round']['sticky_positions'] = $win_positions; // 30032019
				// parent_type will be used in onload in chinese dynasty specially
				$this->message['next_round']['parent_type'] = isset($this->round->freeSpins['details']['client_parent_type']) ?
					$this->round->freeSpins['details']['client_parent_type'] : '';

				if(isset($this->round->freeSpins['details']['cluster'])) {
					$this->message['next_round']['type'] = 'sticky_respin';
				}
			}

			if(isset($this->round->freeSpins['details']['multiplier'])) { // if block 10032019
				$multiplier = $this->round->freeSpins['details']['multiplier'];
				$this->message['next_round']['multiplier'] = $multiplier;
			}
		}

		if($this->round->nextRound) {
			$this->message['next_round'] = $this->round->nextRound;
		}

		if(isset($this->round->freeSpins['details']['source']) &&
			isset($this->round->freeSpins['details']['source']) &&
			$this->round->freeSpins['spins_left'] > 0  ) {
			$this->message['next_round']['source'] = $this->round->freeSpins['details']['source']; // 08042019
			# $this->message['next_round']['type'] = $this->round->freeSpins['details']['source'];
		}
	}

	private function setGambleInfo()
	{
		$spinType = $this->round->spinType;
		if(isset($this->game->bonusConfig['gamble_config']) &&
			isset($this->game->bonusConfig['gamble_config'][$spinType]) &&
			empty($this->message['next_round']) && $this->round->winAmount >0 &&
			$this->round->requestParams['amount_type'] == COLOR_1)
		{
			$this->message['next_round'] = Array('type' => 'gamble',
							'bet_amount' => $this->round->winAmount);
		}else if (isset($this->round->gamble) &&
			$this->round->requestParams['request_type'] == INIT_MODE)
		{
			$this->message['next_round'] = array(
				'type' => 'gamble',
				'bet_amount' => $this->round->gamble['winAmount'],
				'previous_choice' => $this->round->gamble['playerChoice']);
		}
	}

	private function overWriteMessage() {
		if(!isset($this->round->message)) {
			return;
		}

		foreach($this->round->message as $key1 => $value1) {
			foreach($value1 as $key2 => $value2) {
				$this->message[$key1][$key2] = $value2;
			}
		}
	}

	protected function dispatchMessage()
	{
		dispatch_message($this->message);
	}
}

class ErrorHandler
{
	public static function handleError($errorNumber=1, $errorCode="SOME_ERROR",
									   $errorMessage='', $extraInfo=array('error_source' => 'rgs'))
	{
		dispatch_message(Array(
			'error_number'  => $errorNumber,
			'error_code'    => $errorCode,
			'error_message' => $errorMessage,
			'extra_info'    => $extraInfo));
	}
}

function dispatch_message($message) {
	if(defined('ENGINE_MODE_SIMULATION') && ENGINE_MODE_SIMULATION) {
		global $server_response;         # simcode
		$server_response = $message;     # simcode
		return;                          # simcode
	}

	#header('<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">');
	header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');

	print encode_objects($message);
	exit;
}
?>
