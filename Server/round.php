<?php
require_once 'line_wins_handler.inc.php';
require_once 'betlines_factory.inc.php';

class Round
{
	var $coinValue, $numCoins, $numBetLines, $amountType, $platformType,
	$reelPointers, $matrix, $matrixFlatten, $betLines, $paylineWins, $winStrings,
	$paylineWinAmount, $requestParams, $winAmount, $roundId, $matrixString,
	$totalBet, $game, $engineMode, $winLineNumbers, $spinType, $previousRound,
	$postMatrixInfo, $freeSpins, $screenWins, $bonusGamesWon, $scattersCount,
	$bonusGames, $nextRound, $sticky_win_round, $reSpin, $bonusGameRound,
	$wildMultiplier, $parentSpintype, $freespinState, $respinState, $message,
	$lineBet, $idToNameSpinType, $queuedBonusGames, $gamble, $roundEndData, $rtpSubGameId,
	$prevBonusGames, $miscPrizes, $postFreeSpinInfo, $scatterwin, $baseFeature, $blastPosition, $screenWinAmount, $sub_game, $matrixData;

	# todo change $sticky_win_round to camelcase
	var $multipliers; # todo todo handle this property

	function __construct(&$game, $player)
	{
		$this->game = $game;
		$this->player = $player;

		/**
		 * engineMode
		 *      - Simulation(0)
		 *      - Production Mode(1)
		 **/
		$this->engineMode = 1;

		/**
		 * spinType
		 *      - normal    ==> Default Spin Type. Base Game.
		 *      - freespin  ==> During Free Spins.
		 **/

		$this->spinType = 'normal';
		$this->isFreeSpin = false;
		$this->sub_game = false;
		$this->baseFeature = false;
		$this->multipliers = array();
		$this->matrixData = array();
		$this->scatterwin = 0;
		$this->screenWinAmount = 0;
		$this->wildMultiplier = 0;
		$this->screenWins = array_fill(0, $game->numRows * $game->numColumns, 0);
		$this->message = array();
		$this->prevBonusGames = array();
		$this->blastPosition = array();
		$this->miscPrizes = array();
		// $sub_game_id = getNewSubGameId($game->gameId, $_SESSION['operator_id']);
		// $game   = Game::loadGame($requestParams['game_id'],$sub_game_id);
		//$this->game->coinValues = $this->getCoinValues();
		$this->getOpCoinValues();
		$this->loadPromoDetails();
		$this->loadRTPSubGameId();
	}

	/*
	 * @fun loadRTPSubGameId()
	 * Used to load sub_game_id and rtp for a specific RTP version of a game.
	 * */
	public function loadRTPSubGameId()
	{
		// return; # todo TODO hardcoded
		global $db;
		// print_r( $_SESSION);


		$game_id = $this->game->gameId;
		$op_id = $_SESSION['operator_id'];
		#$site_id    = $_SESSION['site_id'];
		#AND frontend_id = {$site_id}
		$query = <<<QRY
                        SELECT sub_game_id, rtp
                        FROM gamelobby.var_rtp_games
                        WHERE operator_id ={$op_id}
                        AND game_id  = {$game_id} AND enabled = 1
QRY;
		$result = $db->runQuery($query) or ErrorHandler::handleError(1, "ROUND_RTPSUBGAMEID 1");

		if ($db->numRows($result) > 0) {
			$row = $db->fetchAssoc($result) or ErrorHandler::handleError(1, "ROUND_RTPSUBGAMEID 2");
			$this->rtpSubGameId = $row['sub_game_id']; // 18012021
			$this->game->rtp = $row['rtp'];
		}
	}

	/*
	 * @fun getRTPSubGameId()
	 * Returns the sub_game_id for a specific RTP
	 * */
	public function getRTPSubGameId()
	{
		if (
			isset($this->rtpSubGameId)
			&& $this->rtpSubGameId != ''
		) {

			return $this->rtpSubGameId;
		}
	}



	/*
	 * @getOpCoinValues
	 * If coin values are not found in cms.currency, coin_vaues of game.slots
	 * will be loaded. Which may not work for all currency and could be issue
	 * when sanitizing.  TODO
	 *
	 * */

	public function getOpCoinValues()
	{
		global $db;

		$game_id = $this->game->gameId;
		$op_id = $_SESSION['operator_id'];
		$site_id = $_SESSION['site_id'];
		$currency = $this->player->currency;

		if (!in_array($this->player->amountType, array(AMOUNT_TYPE_CASH, AMOUNT_TYPE_BBS))) {
			$amount_type = AMOUNT_TYPE_CASH;
		} else {
			$amount_type = $this->player->amountType;
		}

		// echo $op_id, $site_id, $amount_type;
		$query = <<<QRY
                        SELECT currency, default_coin_value
                        FROM cms.currency
                        WHERE operator_id={$op_id}
                        AND frontend_id = {$site_id}
                        AND amount_type = {$amount_type}
                        AND game_id = {$game_id}
QRY;

		if ($this->player->opCode == 'XST') {
			$query = <<<QRY
					SELECT currency, default_coin_value
						FROM cms.currency
						WHERE operator_id={$op_id}
						AND game_id = {$game_id}
						ORDER BY created ASC LIMIT 1
QRY;
		}
		if ($this->player->amountType == AMOUNT_TYPE_FUN) {
			$query = <<<QRY
					SELECT currency, default_coin_value
						FROM cms.currency
						WHERE game_id = {$game_id}
						ORDER BY created ASC LIMIT 1
				QRY;
		}

		$result = $db->runQuery($query) or ErrorHandler::handleError(1, "ROUND_COINVALUE 1");

		if ($db->numRows($result) > 0) {
			$row = $db->fetchAssoc($result) or ErrorHandler::handleError(1, "ROUND_COINVALUE 2");


			$coin_values = decode_object($row['currency']);
			$all_coin_values = $coin_values;
			$default_coin_value = decode_object($row['default_coin_value']);
			$coin_values = $coin_values[$currency];
			$coins = [];

			foreach ($coin_values as $key => $val) {
				if ($val) {
					array_push($coins, $key);
				}
			}

			if (count($coins) > 0) {

				$this->game->coinValues = $coins;
				$this->game->defaultCoinValue = $default_coin_value[$currency];
			} else if ($this->player->opCode == 'XST') {
				// If player's currency not present in coin_value-currency config, in that case
				// default currency USD will be taken.

				$defaultCurrency = 'USD';
				$defaultCurrCoinValues = $all_coin_values[$defaultCurrency];
				$coins = [];

				foreach ($defaultCurrCoinValues as $key => $val) {
					if ($val) {
						array_push($coins, $key);
					}

				}
				if (count($coins) > 0) {
					$this->game->coinValues = $coins;
					$this->game->defaultCoinValue = $default_coin_value[$defaultCurrency];
				}
			}
		}
	}



	private function loadPromoDetails()
	{
		$bal_details = $this->player->balDetails;
		$promo_fs = isset($bal_details['promo_freespins']) ? $bal_details['promo_freespins'] : [];
		$promo_details = array('expired' => array(), 'alive' => array(), );
		$bfs_round_id = 0;
		global $db;
		$curr_promo_details = array();
		$total_sum = 0;
		
		
		for ($i = 0; $i < count($promo_fs); $i++) {
			if ($promo_fs[$i]['game_name'] == $this->game->gameName) {
				$end_date_obj = date("Y-m-d H:i:s", strtotime($promo_fs[$i]['end_datetime']));
				if (date("Y-m-d H:i:s") >= $end_date_obj && !$promo_fs[$i]['expired']) {
					$promo_details['expired'][] = $promo_fs[$i];
				} else if (date("Y-m-d H:i:s") <= $end_date_obj && !$promo_fs[$i]['expired']) {
					$spins_left = $promo_fs[$i]['total_rounds'] - $promo_fs[$i]['num_rounds_completed'];
					$spins_left = count($promo_fs);
					
					
					if(($_POST['request_type'] == INIT_MODE)){
					
					$amount_type = AMOUNT_TYPE_PFS;
					$limit = $promo_fs[$i]['total_rounds'] - count($promo_fs);
					
					$Promo_win = 0;
						$extra_fg_sum = 0;
					
					if($limit > 0){
						$query = <<<QRY
									
						SELECT round_id
						FROM gamelog.round
						WHERE game_id = {$this->game->gameId}   AND account_id = {$this->player->accountId} AND 
						amount_type = {$amount_type} and spin_type = 1
						ORDER BY round_id DESC
						LIMIT {$limit}
						
			QRY;
					$result = $db->runQuery($query) or ErrorHandler::handleError(1, "ROUND_COINVALUE 11");
					
					$roundIds = [];
					if ($db->numRows($result) > 0) {
						while ($row = $db->fetchAssoc($result)) {
							$roundIds[] = $row['round_id'];
						}
					}
		
					$roundIdsList = implode(',', array_map('intval', $roundIds));
							
					$query2 = <<<QRY
					SELECT Sum(win_amount) AS total_win_amount
						FROM gamelog.freespins
						WHERE state = 1 and base_round_id IN ($roundIdsList)
			QRY;
					$result2 = $db->runQuery($query2) or ErrorHandler::handleError(1, "ROUND_COINVALUE he");
							
					if (isset($result2) and count($result2) > 0 and $db->numRows($result2) > 0) {
						$row = $db->fetchAssoc($result2) or ErrorHandler::handleError(1, "ROUND_COINVALUE 2");
						$extra_fg_sum = $row['total_win_amount'];
						}
						$query3 = <<<QRY
							SELECT SUM(amount_won) AS total_amount_won
							FROM (
								SELECT amount_won
								FROM gamelog.round
								WHERE game_id = {$this->game->gameId}   AND account_id = {$this->player->accountId} AND 
								amount_type = {$amount_type} and spin_type = 1
								ORDER BY round_id DESC
								LIMIT {$limit}
							) AS recent_entries;
		QRY;
							$result3 = $db->runQuery($query3) or ErrorHandler::handleError(1, "ROUND_COINVALUE 111");
							if ($db->numRows($result3) > 0) {
								$row_1 = $db->fetchAssoc($result3) or ErrorHandler::handleError(1, "ROUND_COINVALUE 2");
								$Promo_win = $row_1['total_amount_won'];
							}
							
							$total_sum = $Promo_win + $extra_fg_sum;
							
						}
						
					}
					else{
						$total_sum =  $promo_fs[$i]['win_amount'];
					}
					// $win_amount = $total_sum;
					$promo_details['alive'][] = array(
						'type' => 'promospins',
						'amount_type' => $promo_fs[$i]['amount_type'],
						'amount' => $promo_fs[$i]['promo_freespin_bal'],
						'win_amount' => to_coin_currency($total_sum),
						'pfs_win_amount' => to_coin_currency($total_sum),
						'num_coins' => $promo_fs[$i]['num_coins'],
						'coin_value' => $promo_fs[$i]['coin_value'],
						'num_spins' => $promo_fs[$i]['total_rounds'],
						'bfs_record_id' => $promo_fs[$i]['record_id'],
						'spins_left' => count($promo_fs),
						'end_datetime' =>  strtotime($promo_fs[$i]['end_datetime']),
					);
					
				}
			}
		}
		

		if (count($promo_details['expired']) > 0) {

			$curr_promo_details['date_expired'] = 1;
			$curr_promo_details['bfs_record_id'] = $promo_details['expired'][0]['record_id'];
		} else if (count($promo_details['alive']) > 0) {

			$win_amount = strval($total_sum);
			$curr_promo_details = array(
				'type' => $promo_details['alive'][0]['type'],
				'amount_type' => $promo_details['alive'][0]['amount_type'],
				'amount' => $promo_details['alive'][0]['amount'],
				'win_amount' => $promo_details['alive'][0]['win_amount'],
				'pfs_win_amount' => $promo_details['alive'][0]['pfs_win_amount'],
				'num_coins' => $promo_details['alive'][0]['num_coins'],
				'coin_value' => $promo_details['alive'][0]['coin_value'],
				'num_spins' => $promo_details['alive'][0]['num_spins'],
				'bfs_record_id' => $promo_details['alive'][0]['bfs_record_id'],
				'spins_left' => $promo_details['alive'][0]['spins_left'],
				'end_datetime' =>  $promo_details['alive'][0]['end_datetime']
			);
		}

		$this->player->promoDetails['curr_spin'] = $curr_promo_details;
		$this->player->promoDetails['expired'] = $promo_details['expired'];
		$this->player->promoDetails['alive'] = $promo_details['alive'];
	}


	/*
	 * This function is needed only when spin type is PFS (3)
	 *
	 */
	public function setPromoFs()
	{
		if ($this->amountType != AMOUNT_TYPE_PFS  ) {
			return;
		}
		
		if(!isset($this->player->promoDetails['alive']) and !isset($this->player->promoDetails['curr_spin'])and !isset($this->player->promoDetails['expired']) ){
			return;
		}

		if (
			isset($this->player->promoDetails['curr_spin']['spins_left']) && $this->spinType != 'freespin'
			&& $this->spinType != 'respin'
			&& $this->spinType != 'bonus'
			&& $this->player->promoDetails['curr_spin']['spins_left'] > 0
		) {
			// This is a promo spin. This is not free spin or bonus awarded from promo spin

			$this->player->promoDetails['curr_spin']['spins_left'] -= 1;
			$this->player->promoDetails['curr_spin']['amount'] -= $this->totalBet;
			$this->player->promoDetails['curr_spin']['win_amount'] += $this->winAmount;
			if(isset($_SESSION['player_balance']) and isset($_SESSION['player_balance']['promo_freespins'])){
				array_shift($_SESSION['player_balance']['promo_freespins']);
			}
		}

		# $this->freeSpins['spins_left'] > 0 : Promo FS have ended but scatter
		# freespins awarded from them are remaining.
		# $round->bonusGamesWon stores bonus round win in current spin
		# $round->bonusGames used to store bonus games already present into DB
		# and loaded on game reload.
		# $this->bonusGamesWon[0]['type'] : allowed types are freespins, respin, bonus_games.
		# SO correct hardcoded 'progress_bar' TODO
		# In some cases $this->nextRound is get set in message_handler.
		# So $this->nextRound is not available here . Hence we are using $this->bonusGamesWon
		# in below if condition ***

		# For skullsgonewild bonusGamesWon is used to send other info in respin triggered case
		# This case should not be considered as bonus game. And bonusGamesWon is not
		# array of array in this case.
		// treasures of egypt => progress_bar , fruty twister => rage_meter
		$non_bonus_keys = array('progress_bar', 'rage_meter');

		if (
			(isset($this->nextRound['type']) && $this->nextRound['type'] != '')
			|| ($this->bonusGamesWon
				&& is_array($this->bonusGamesWon[0])                 # For skullsgonewild
				&& !in_array($this->bonusGamesWon[0]['type'], $non_bonus_keys))
			|| $this->player->promoDetails['curr_spin']['spins_left'] > 0
			|| (isset($this->freeSpins) && $this->freeSpins['spins_left'] > 0)
		) {

			$this->player->promoDetails['curr_spin']['next_round'] = true;
		} else {
			$this->player->promoDetails['curr_spin']['next_round'] = false;
		}

		// Pick type of bonus triggered from last PFS
		if ($this->spinType == 'bonus') {
			if (
				$this->player->promoDetails['curr_spin']['next_round'] == false
				|| $this->player->promoDetails['curr_spin']['next_round'] == ''
			) {

				if ($this->bonusGameRound['state'] == 0) {
					$this->player->promoDetails['curr_spin']['next_round'] = true;
				}

				// This will work in fruittwister. In this game details of pick round is
				// being sent to client in key current_round. Details are not coming in
				// next round.
				if (
					$this->bonusGameRound['state'] == 1
					&& $this->bonusGameRound['num_spins'] > 0
					&& isset($this->bonusGameRound['pick_details'])
					&& isset($this->bonusGameRound['pick_details']['feature'])
				) {

					$this->player->promoDetails['curr_spin']['next_round'] = true;
				}
			}
		}
	}



	public function resetRound()
	{
		$this->matrixString = '';
		$this->paylineWinAmount = 0;
		$this->winAmount = 0;
		$this->reelPointers = array();
		$this->matrix = array();
		$this->matrixFlatten = array();
		$this->postMatrixInfo = array();
		$this->blastPosition = array();
		$this->scatterwin = 0;
		$this->screenWins = array_fill(0, $this->game->numRows * $this->game->numColumns, 0);
		$this->betLines = array();
		$this->winStrings = array();
		$this->matrixData = array();
		$this->winLineNumbers = array();
		$this->bonusGamesWon = array();
		$this->bonusGames = array();
		$this->bonusGameRound = array();
		$this->nextRound = array();
		$this->scattersCount = array();
		$this->paylineWins = $this->getPaylineWinsFormat();
		$this->idToNameSpinType = $this->getIdToNameSpinType();
		$this->roundEndData = array();
		$this->prevBonusGames = array();
		$this->miscPrizes = array();
		$this->postFreeSpinInfo = array();
	}

	private function getPaylineWinsFormat()
	{
		return array(
			'format' => array(
				'betline_number',
				'win',
				'blink',
				'num_repeats',
				'betline',
				'matrix_positions'
			),
			'details' => array()
		);
	}

	private function getIdToNameSpinType()
	{
		return array(
			1 => "normal",
			2 => "freespin",
			3 => "respin"
		);
	}

	public function setBetDetails($coinValue, $numCoins, $numBetLines)
	{
		if (!valid_bet_params($coinValue, $numCoins, $numBetLines)) {
			ErrorHandler::handleError(1, "ROUND_BET_PARAMS_ISSUE_0001");
		}
		$this->coinValue = $coinValue;
		$this->numCoins = $numCoins;
		$this->numBetLines = $numBetLines;
		$this->setLineBet($coinValue, $numCoins, $numBetLines);
		$this->setTotalBet($coinValue, $numCoins, $numBetLines);
	}

	public function generateReelPointers()
	{
		for ($i = 0; $i < $this->game->numColumns; $i++) {
			$symbolConfig = $this->game->symbolConfig;
			// $featureConfig['post_matrix_handlers'][$this->spinType]);
			if (
				!$symbolConfig or !isset($symbolConfig['reel_weights']) or
				!isset($symbolConfig['reel_weights'][$this->spinType])
			) {
				$reelLength = strlen($this->game->reels[$i]);
				$reelPointer = get_random_number(0, $reelLength - 1);
				array_push($this->reelPointers, $reelPointer);
			} else {
				$rellWeigght = $symbolConfig['reel_weights'][$this->spinType][0];
				// $reelPointer = get_random_number(0, $rellWeigght[$i]["total_weight"] - 1);
				// // $reelPointer = 2;
				// $reelPointerValue = $this->getValueFromWeight($reelPointer, $rellWeigght[$i]["range"]);
				$reelPointerValue = $this->getMultiplierValue($rellWeigght[$i]["total_weight"], $rellWeigght[$i]["range"]);

				array_push($this->reelPointers, $reelPointerValue);
				// $reelLength = strlen($rellWeigght);
			}
		}
		
		
		handle_forced_outcome($this);
	}


	private function getValueFromWeight($reelPointer, $range)
	{
		$weight_diff = 0;
		$is_break = false;
		foreach ($range as $key => $value) {
			$str_split = explode('-', $key);
			$from = $str_split[0];
			$to = $str_split[1];
			if ($reelPointer > $from and $reelPointer <= $to) {
				$reelPointer = $from;
				$reelPointer = $reelPointer - $weight_diff;
				// $weight_diff += $value;
				$is_break = true;
				break;
			} elseif ($reelPointer <= $from) {
				$reelPointer = $reelPointer - $weight_diff;
				$reelPointer -= 1;
				$is_break = true;
				break;
			}
			$weight_diff += $value;
		}
		if ($is_break == false) {
			$reelPointer = $reelPointer - $weight_diff;
			$reelPointer -= 1;
		}
		// reelPointer = reelPointer-1
		return $reelPointer;
	}

	public function getMultiplierValue($total_weight, $win_amount)
	{
		$rand = rand(1, $total_weight);
		foreach ($win_amount as $key => $value) {
			if ($key >= $rand) {
				return $value;
			}
		}
	}


	public function generateMatrix()
	{
		$numRows = $this->game->numRows;
		$pointer = array();
		// $this->postMatrixInfo['reel_pos'] = $this->game->subGameId;
		$offset = ($numRows % 2 != 0) ? ($numRows - 1) / 2 : $numRows / 2;
		for ($i = 0; $i < $this->game->numColumns; $i++) {
			$reel = $this->game->reels[$i];

			// $symbolConfig = $this->game->symbolConfig;
			$reelsetConfig = $this->game->reelsetConfig;
			if ($reelsetConfig or isset($reelsetConfig[$this->spinType]) or isset($reelsetConfig[$this->spinType]["is_mega"])or $reelsetConfig[$this->spinType]["is_mega"] == true) {
				$reelPointer = $this->reelPointers[$i];
			}else{
				$reelPointer = $this->reelPointers[$i] - $offset;

			}
			$reelLength = strlen($reel);
			// $reelPointer = $this->reelPointers[$i] ;
			array_push($pointer, $reelPointer);
			for ($j = 0; $j < $this->game->numRows; $j++) {
				// echo ($reelPointer + $reelLength) % $reelLength;
				$this->matrix[$j][$i] = $reel[($reelPointer + $reelLength) % $reelLength];
				$reelPointer++;
			}
		}
		// print_r($this->reelPointers);
		$this->reelPointers = $pointer;
		// print_r($this->reelPointers);
		/** Hard code for LOTR Lightning Feature luckoftherainbow
		 *
		 * $this->matrix = Array(
		 * 	Array('c', 'e', 's', 's', 'w'),
		 *	Array('s', 'a', 's', 'b', 's'),
		 *	Array('b', 'k', 'k', 'c', 'w'));
		 *
		 */
		// $this->matrix = Array(
		// 	 	Array('c', 'e', 'e', 'b', 'd'),
		// 		Array('a', 'a', 'a', 'a', 'w'),
		// 		Array('b', 'k', 'k', 'c', 'a'));
		# todo comment the follwoing line

		# below for candy burst game

		#ANimCheck
		// $this->matrix=Array(
		// Array('k', 'h', 'k', 'j', 'b'),
		// Array('g', 'g', 'g', 'g', 'g'),
		// Array('c', 'i', 'd', 'e', 's')
		// );
		#edge Cases
		// $this->matrix=Array(
		// Array('w', 'a', 'b', 'a', 'd'),
		// Array('a', 'a', 'w', 'b', 'a'),
		// Array('w', 'b', 'a', 'd', 'a'));
		#3 scatter
		// $this->matrix = Array(
		// // 	//without win
		// 	Array('c', 'a', 'a', 'a', 'a', 'a'),
		// 	Array('a', 'a', 'a', 'a', 'a', 'a'),
		// 	Array('a', 'a', 's', 'a', 'a', 'a'),
		// 	Array('s', 'a', 's', 'a', 'a', 'a'));

		// 6*4 matric

		// $this->matrix = Array(
		// 		//Bonus 2           
		// 		Array('c', 'b', 'd', 'b', 'b','c'),
		// 		Array('c', 'd', 's', 's', 'd', 'c'),
		// 		Array('b', 's', 'd', 'c', 'f',"b"),
		// 		Array('b', 'b', 'a', 's', 'g',"a"));
		// eibgfe;iihgfi;ibfwai;xwfbgx"
		// $this->matrix = array(
		// 	//Bonus 2           
		// 	array('c', 'c', 'c', 's', 'e', 'e'),
		// 	array('a', 's', 'a', 'a', 'd', 'c'),
		// 	array('d', 'a', 's', 's', 'b', "c"),
		// 	array('d', 'c', 'd', 'e', 'e', "d")	
		// );


		// "hhb;ggd;fbb;iic;bbi;ccf
		// $this->matrix = Array(
		// 		//Bonus 2           
		// 		Array('c', 'b', 'd', 'b', 'b','c'),
		// 		Array('a', 'c', 'a', 'a', 'a', 'c'),
		// 		Array('b', 'b', 'c', 'a', 'g',"b"));
		$this->matrixString = array2d_to_string($this->matrix);
		$this->generateMatrixData($this->matrix);
		$this->matrixFlatten = $this->generateFlatMatrix($this->matrix);
	}

	public function generateFlatMatrix($matrix)
	{
		$tempArray = array();
		for ($i = 0; $i < $this->game->numRows; $i++) {
			for ($j = 0; $j < $this->game->numColumns; $j++) {
				array_push($tempArray, $matrix[$i][$j]);
			}
		}
		return $tempArray;
	}

	/*
	 *  @fun generateBetLines
	 *  It uses the class BetLinesFactory present in file betlines_factory.inc.php
	 *  From the class BetLinesFactory an object specific to a game type will
	 *  be returned which will be used for betlines generation.
	 * */
	public function generateBetLines()
	{

		$betlines_object = BetLinesFactory::getBetLinesObject($this->game, $this);
		$betlines_object->generateBetLines();
		return;
	}

	public function getFlattenMatrix()
	{
		if (isset($this->postMatrixInfo['matrixFlatten'])) {
			return $this->postMatrixInfo['matrixFlatten'];
		}

		return $this->matrixFlatten;
	}
	public function generateMatrixData($matrix)
	{
		$this->matrixData = array();
		for ($i = 0; $i < $this->game->numRows; $i++) {
			for ($j = 0; $j < $this->game->numColumns; $j++) {
				// array_push($this->matrixData[$i][$j]["symbol"], $matrix[$i][$j]);
				// array_push($this->matrixData[$i][$j]["data"], 0);
				$this->matrixData[$i][$j] = array("symbol" => $matrix[$i][$j], "data" => 0);
			}
		}
		// return $this->matrixData;
	}

	public function calculatePaylineWins()
	{
		# todo check why player object is needed in below line.
		$line_win_factory = LineWinFactory::getLineWinObject($this->game, $this, $this->player);
		if ($line_win_factory) {
			$line_win_factory->handleLineWins();
			return;
		} else {
			$lineWinsObject = new LineWinsHandler($this->game, $this, $this->player);
			$lineWinsObject->calculatePaylineWins();
		}

		// if($this->spinType != 'normal' && $this->freeSpins['multiplier'] > 1) {
		// 	$this->paylineWinAmount *= $this->freeSpins['multiplier'];
		// 	array_push($this->multipliers, Array(
		// 		"type" => "fs_multiplier",
		// 		"value" => $this->freeSpins['multiplier'],
		// 	));
		// }
		$this->winAmount += $this->paylineWinAmount;
	}

	public function getRandomSymbol()
	{
		$symbol_list = ["a", "b", "c", "d", "e"];
		$random_num = rand(0, 4);
		$random_symbol = "";
		/** Hard code for katanawarrior Freespin special symbol 
		 * 
		 * $random_num = 0;  // for a as special symbol
		 * $random_num = 1;  // for b as special symbol
		 * $random_num = 2;  // for c as special symbol
		 * $random_num = 3;  // for d as special symbol
		 * $random_num = 4;  // for e as special symbol
		 * 
		 */
		for ($i = 0; $i < count($symbol_list); $i++) {
			if ($random_num == $i) {
				$random_symbol = $symbol_list[$i];
				return $random_symbol;
			}
		}
		return $random_symbol;
	}

public function generate_freespins($fs_reel_size, $bonus_details){
	$str = explode("X",$fs_reel_size);
	$fs_matrix = array();
	$total_fs = 0;
	for ($i=0; $i < $str[0]; $i++) { 
		for ($j=0; $j <$str[1] ; $j++) {
			$val =  $this->getMultiplierValue($bonus_details["total_weight"], $bonus_details["weight_table"]);
			$fs_matrix[$i][$j] =$val;
			$total_fs+= $val;
		}
	}
	return array($fs_matrix, $total_fs);

}


	public function getAnteBetPrize()
	{
		// echo "2";
		$featureConfig = $this->game->symbolConfig;

		// print_r($featureConfig['anteBet'][$this->round->spinType]);
		if (
			!$featureConfig or !isset($featureConfig['anteBet']) or
			!isset($featureConfig['anteBet'][$this->spinType])
		) {
			return;
		}

		$ante_bet = $featureConfig['anteBet'][$this->spinType]["ante_bet"]; // 1.4
		$this->lineBet = $this->lineBet * $ante_bet[0];
		$this->totalBet = $this->totalBet * $ante_bet[0];
	}

	public function getBuyFgBetPrize()
	{
		$featureConfig = $this->game->symbolConfig;
		if (
			!$featureConfig or !isset($featureConfig['BuyFg']) or
			!isset($featureConfig['BuyFg'][$this->spinType])
		) {
			return;
		}

		$buy_fg_bet = $featureConfig['BuyFg'][$this->spinType]["buy_fg"]; // 1.4
		$this->lineBet = $this->lineBet * $buy_fg_bet[0];
		$this->totalBet = $this->totalBet * $buy_fg_bet[0];
	}

	public function setRequestParams($requestParams)
	{
		$this->requestParams = $requestParams;
		$this->amountType = $requestParams['amount_type'];

		if (isset($requestParams['engine_mode'])) {
			$this->engineMode = $requestParams['engine_mode'];
		}
		$this->loadFreeSpins();
		if(isset($this->freeSpins) and $this->freeSpins['amount_type']  ){
			$this->amountType = $this->freeSpins['amount_type'];
			return;
		}
		$this->loadBonusGames();     # simcode
		if(isset($this->bonusGames) and $this->bonusGames['amount_type']  ){
			$this->amountType = $this->bonusGames['amount_type'];
			return;
		}
		if ($this->player->amountType != AMOUNT_TYPE_PFS && $_POST['request_type'] != INIT_MODE && !isset($this->freeSpins) ) {
			$this->player->promoDetails = array();
		}

		if (
			isset($this->player->promoDetails['curr_spin']['spins_left']) &&
			isset($this->player->promoDetails['curr_spin']['spins_left']) > 0
		) {
			$this->amountType = AMOUNT_TYPE_PFS;
		}
	}

	public function loadPreviousRound($gameId, $accountId)
	{
		global $db;

		$prevQry = "
			SELECT game_id, sub_game_id, account_id, round_id, coin_value, num_coins,
				   num_betlines, reel_pointers, matrix, win_lines, amount_won,
				   amount_type, spin_type, currency, timestamp, matrix2, misc
			  FROM gamelog.prev_round
			 WHERE account_id = {$accountId} AND
				   game_id ={$gameId} AND
				   amount_type = {$this->amountType}";

		$this->previousRound = array();
		$result = $db->runQuery($prevQry) or ErrorHandler::handleError(1, "ROUND_0001");
		if ($db->numRows($result) <= 0) {
			$this->previousRound['round_id'] = 0;
			$this->previousRound['coin_value'] = '';
			$this->previousRound['num_coins'] = '';
			$this->previousRound['num_betlines'] = '';
			$this->previousRound['reel_pointers'] = '';
			$this->previousRound['matrix'] = '';
			$this->previousRound['win_lines'] = '';
			$this->previousRound['amount_won'] = '';
			$this->previousRound['spin_type'] = '';
			$this->previousRound['matrix2'] = '';
			$this->previousRound['misc'] = '';
			return;
		}

		$row = $db->fetchAssoc($result) or ErrorHandler::handleError(1, "ROUND_0002");

		$this->previousRound['round_id'] = $row['round_id'];
		$this->previousRound['coin_value'] = $row['coin_value'];
		$this->previousRound['num_coins'] = $row['num_coins'];
		$this->previousRound['num_betlines'] = $row['num_betlines'];
		$this->previousRound['reel_pointers'] = $row['reel_pointers'];
		$this->previousRound['matrix'] = $row['matrix'];
		$this->previousRound['win_lines'] = $row['win_lines'];
		$this->previousRound['amount_won'] = $row['amount_won'];
		$this->previousRound['spin_type'] = $row['spin_type'];
		$this->previousRound['matrix2'] = $row['matrix2'];
		$this->previousRound['misc'] = decode_object($row['misc']);
	}

	public function getNewSubGameId()
	{
		# if freespins need to be played on a specific reelsets
		if (
			isset($this->freeSpins) and
			isset($this->freeSpins['details']['fs_game_id'])
		) {
			return $this->freeSpins['details']['fs_game_id'];
		}
		
		if (
			isset($this->game->misc['variable_rtp'])
			&& $this->game->misc['variable_rtp'] == 1
		) {
			$new_sub_game_id = $this->getRTPSubGameId();
			if ($new_sub_game_id != '') {
				return $new_sub_game_id;
			}
		}

		$reelsetConfig = $this->game->reelsetConfig;

		// {"normal":"default":1,"unwanted_sub_game_id":[2,4,6]}
		if (
			isset($reelsetConfig) and
			isset($reelsetConfig[$this->spinType]['unwanted_sub_game_id'])
		) {
			if(in_array($this->game->subGameId,$reelsetConfig[$this->spinType]['unwanted_sub_game_id'])){
				return $reelsetConfig[$this->spinType]['default'];
			}
		}
		if (!$reelsetConfig or $reelsetConfig == null or $reelsetConfig == '') {
			return $this->game->subGameId;
		}
		if (isset($this->game->reelsetConfig["reel_set"])) {
			return $this->getReels();
		}
		if (isset($this->game->reelsetConfig["num_coins"])) {
			return $this->getReelsOnBetCoins();
		}
		$reelWeights = $this->getReelWeights();

		if (is_null($reelWeights) or !$reelWeights or $reelWeights == '') {
			return $this->game->subGameId;
		}

		$spinType = $this->spinType;
		$subGameIds = $this->game->reelsetConfig[$spinType]['sub_game_ids'];
		return weighted_random_number($reelWeights, $subGameIds);
	}

	private function getReelWeights()
	{
		$spinType = $this->spinType;

		if (isset($this->game->reelsetConfig[$spinType])) {
			$weightsInfo = $this->game->reelsetConfig[$spinType]['reel_weights'];
			$betAmount = $this->getBetAmountForReels();

			foreach ($weightsInfo as $betRange => $weights) {
				# minBet and maxBet are inclusive
				$minBet = $betRange['min'];
				$maxBet = $betRange['max'];

				# max bet 'n' means. Any amount. There is no limit
				if ($betAmount >= $minBet && ($maxBet == 'n' || $betAmount <= $maxBet))
					return $weights;
			}
		}

		return null;
	}

	private function getReelsOnBetCoins()
	{
		$config = $this->game->reelsetConfig["num_coins"][$this->spinType];
		return $config[$this->numCoins];
	}

	private function getBetAmountForReels()
	{
		# todo return bet amount as per the game cofniguration for reels
		return $this->coinValue * $this->numCoins;
	}

	public function handlePostMatrixFeatures()
	{
		global $game_handlers;
		$featureConfig = $this->game->bonusConfig;
		//$featureConfig['post_matrix_handlers'][$this->spinType]);
		if (
			!$featureConfig or !isset($featureConfig['post_matrix_handlers']) or
			!isset($featureConfig['post_matrix_handlers'][$this->spinType])
		) {
			return;
		}
		$postMatrixFeatures = $featureConfig['post_matrix_handlers'][$this->spinType];
		foreach ($postMatrixFeatures as $index => $feature) {
			// echo $featureName;
			$featureName = $feature['feature'];
			$details = $feature['details'];
			# todo added here for review
			if (isset($feature['bonus_game_id']) && $feature['bonus_game_id'] > 0) {
				$bonusGameId = $feature['bonus_game_id'];
				$this->featureData = $feature;
				$factoryObject = new BonusFactory($this->game, $this);
				$bonusObject = $factoryObject->getObjectFromId($bonusGameId);
				if ($bonusObject != null and !empty($bonusObject)) {
					$bonusObject->checkAndGrantBonusGame();
				}
			} else {
				# todo added here for review
				$handler = isset($game_handlers[$featureName]) ?
					$game_handlers[$featureName] : $game_handlers['default_handler'];
				$handler($this, $details);
			}
		}
	}

	public function calculatescattersymbolwin()
	{
		if ($this->bonusGamesWon and isset($this->bonusGamesWon[0]['feature_name']) and $this->bonusGamesWon[0]['feature_name'] == "basegameFeature" and isset($this->bonusGamesWon[0]['mystry_symbol'])) {
			$this->winAmount = 0;
			$this->paylineWinAmount = 0;
		}
		$featureConfig = $this->game->symbolConfig;
		if (
			!$featureConfig or !isset($featureConfig["symbol_set"]) && !isset($featureConfig["symbol_set"]['normal_s'])
			&& !isset($featureConfig["scatter"])
		) {
			return;
		}

		$featureConfig = $this->game->symbolConfig["symbol_set"]['normal_s'];
		$win_symbol = $featureConfig['symbol'];
		$numScatters = get_element_count($this->matrixFlatten, $win_symbol);
		if ($numScatters < 5) {
			return;
		}
		$win_amt = $featureConfig['win_amount'];
		$win_wght = $featureConfig['win_wieght'];
		$win_total_weight = $featureConfig['total_weight'];

		$sc_featureConfig = $this->game->symbolConfig["scatter"];
		$symbol_sc = $sc_featureConfig['total_weight'];
		$win_weight_sc = $sc_featureConfig['win_wieght'];
		$win_value_sc = $sc_featureConfig['win_val'];
		$this->winAmount = 0;
		if (isset($this->postFreeSpinInfo) && isset($this->postFreeSpinInfo[0]['win_positions'])) {
			$win_pos = $this->postFreeSpinInfo[0]["win_positions"];
		} else {
			$win_pos = $this->freeSpins['details']["win_positions"];
		}
		if (isset($this->freeSpins["details"])) {
			$matrix_array = $this->freeSpins['details']['matrix_array'];
			$matrix_arr = explode(";", $matrix_array);

		}
		for ($i = 0; $i < $this->game->numRows; $i++) {
			for ($j = 0; $j < $this->game->numColumns; $j++) {
				if ($this->matrix[$i][$j] == $win_symbol) {
					if ($numScatters >= 5 && $this->spinType == "respin") {
						$this->screenWins = $this->freeSpins['details']['scatter_win'];
						$position_val = $this->random_wegiht_check($symbol_sc, $win_weight_sc);
						if ($matrix_arr[$i][$j] != "z") {
							$this->matrix[$i][$j] = $win_value_sc[$position_val];
							/** Hard code for LOTR trigger Free game luckoftherainbow
							 *
							 * $this->matrix[$i][$j] = "z"
							 *
							 */
						} else {
							$this->matrix[$i][$j] = "z";
						}

						for ($sc = 0; $sc < count($this->screenWins); $sc++) {
							if ($this->screenWins[$sc] == 0 && in_array($sc, $win_pos)) {
								$win_val = $this->random_wegiht_check($win_total_weight, $win_wght);
								$this->screenWins[$sc] = $win_amt[$win_val];
							}
						}


					} elseif ($this->spinType == "normal") {
						$win_val = $this->random_wegiht_check($win_total_weight, $win_wght);
						$this->screenWins[(($i * 5) + $j)] = $win_amt[$win_val];
						$position_val = $this->random_wegiht_check($symbol_sc, $win_weight_sc);
						$this->matrix[$i][$j] = $win_value_sc[$position_val];
					}
				}
			}
		}
		if ($numScatters >= 5 && ($this->spinType == "normal" || $this->spinType == "respin")) {
			if ($this->postFreeSpinInfo) {

				$this->postFreeSpinInfo[0]["scatter_win"] = $this->screenWins;
				$this->postFreeSpinInfo[0]["matrix_array"] = array2d_to_string($this->matrix);
				// array_push($matrix_array, array2d_to_string($this->matrix));
			} elseif ($this->spinType == "respin") {
				$this->matrixFlatten = $this->generateFlatMatrix($this->matrix);
				$this->winAmount = to_coin_currency(array_sum($this->freeSpins['details']['scatter_win']));
			}
		}
		$this->matrixString = array2d_to_string($this->matrix);
	}


	public function mystFeature()
	{
		$featureConfig = $this->game->bonusConfig;
		if (
			!$featureConfig or !isset($featureConfig['base_game_feature']) or
			!isset($featureConfig['base_game_feature'][$this->spinType])
		) {
			return;
		}
		$base_game_config = $featureConfig['base_game_feature'][$this->spinType][0];
		$total_weightage = $base_game_config['total_weight_base_feature'];
		$base_feature_call = rand(1, $total_weightage);
		/** Hard code for LOTR Basegamefeature luckoftherainbow
		 *
		 * $base_feature_call = 1;
		 *
		 */
		// $base_feature_call = 999;
		$this->sub_game = 1;

		$weights = $base_game_config['weights_basefeature'];
		$values = $base_game_config['values_basefeature'];
		for ($i = 0; $i < count($weights); $i++) {
			if ($base_feature_call <= $weights[$i]) {
				$base_f_call = $values[$i];
				break;
			}
		}
		$number = $this->game->subGameId;
		// $base_f_call = "bg2";
		if (preg_match('/bg(\d+)/', $base_f_call, $matches)) {
			$number = $matches[1];  
		}

		if ($base_f_call == "base_game_feature") {
			$this->baseFeature = true;
			$sub_game = 3;
		} 
		$sub_game = $number;
		$this->sub_game = $number;
		
		$this->postMatrixInfo['reel_pos'] = $sub_game;

		$newSubGame = Game::loadGame($this->game->gameId, $sub_game);
		$this->game = $newSubGame;

	}
	public function random_wegiht_check($random_num, $weight)
	{
		$random_win = rand(1, $random_num);
		for ($k = 0; $k < count($weight); $k++) {
			if ($random_win <= $weight[$k]) {
				return $k;
			}
		}
	}

	public function handlePostWinCalculations()
	{
		global $game_handlers;
		$featureConfig = $this->game->bonusConfig;
		if (
			!$featureConfig or !isset($featureConfig['post_win_handlers']) or
			!isset($featureConfig['post_win_handlers'][$this->spinType])
		) {
			return;
		}

		$postPaylineFeatures = $featureConfig['post_win_handlers'][$this->spinType];
		// print_r($postPaylineFeatures);
		foreach ($postPaylineFeatures as $index => $feature) {
			$featureName = $feature['feature'];
			$details = $feature['details'];
			if (isset($feature['bonus_game_id']) && $feature['bonus_game_id'] > 0) {
				$bonusGameId = $feature['bonus_game_id'];
				$this->featureData = $feature;
				$factoryObject = new BonusFactory($this->game, $this);
				$bonusObject = $factoryObject->getObjectFromId($bonusGameId);
				if ($bonusObject != null and !empty($bonusObject)) {
					$bonusObject->checkAndGrantBonusGame();
				}
			} else {
				$handler = isset($game_handlers[$featureName]) ?
					$game_handlers[$featureName] : $game_handlers['default_handler'];
				$handler($this, $details);
			}
		}
	}

	// for terraCotta
	public function handleAfterWinBonus()
	{

	}


	public function loadBonusGames()
	{
		global $db;

		$gameId = $this->game->gameId;
		$amountType = $this->amountType;
		$accountId = $this->player->accountId;
		$tableName = 'gamelog.bonus_games';

		if ($this->amountType == AMOUNT_TYPE_FUN) {
			$tableName = 'gamelog.bonus_games_fun';
		}

		$bonusQuery = <<<QUERY
			SELECT id, game_id, sub_game_id, base_round_id, round_id,
				   account_id, bonus_game_id, bonus_game_code, amount_type,
				   num_picks, num_user_picks, picks_data, game_data, multiplier,
				   win_amount, state, coin_value, num_coins, num_betlines
			 FROM {$tableName}
			WHERE game_id = {$gameId} AND account_id = {$accountId} AND
				  amount_type = {$amountType} AND state = 0
			ORDER BY round_id DESC LIMIT 1
QUERY;
		$result = $db->runQuery($bonusQuery) or ErrorHandler::handleError(1, 'ROUND_0007');
		if ($db->numRows($result) <= 0)
			return;

		$row = $db->fetchAssoc($result) or ErrorHandler::handleError(1, "ROUND_0008");
		$this->bonusGames['id'] = $row['id'];
		$this->bonusGames['game_id'] = $row['game_id'];
		$this->bonusGames['sub_game_id'] = $row['sub_game_id'];
		$this->bonusGames['base_round_id'] = $row['base_round_id'];
		$this->bonusGames['round_id'] = $row['round_id'];
		$this->bonusGames['account_id'] = $row['account_id'];
		$this->bonusGames['bonus_game_id'] = $row['bonus_game_id'];
		$this->bonusGames['bonus_game_code'] = $row['bonus_game_code'];
		$this->bonusGames['amount_type'] = $row['amount_type'];
		$this->bonusGames['num_picks'] = $row['num_picks'];
		$this->bonusGames['num_user_picks'] = $row['num_user_picks'];
		$this->bonusGames['picks_data'] = decode_object($row['picks_data']);
		$this->bonusGames['game_data'] = $row['game_data'];
		$this->bonusGames['multiplier'] = $row['multiplier'];
		$this->bonusGames['win_amount'] = $row['win_amount'];
		$this->bonusGames['state'] = $row['state'];
		$this->bonusGames['coin_value'] = $row['coin_value'];
		$this->bonusGames['num_coins'] = $row['num_coins'];
		$this->bonusGames['num_betlines'] = $row['num_betlines'];

		/**
		 * @todo Be carefull here. previousRound can be normal / free spins.
		 *       There would be bonus games, from which free spins are awarded
		 *       for which below details are required.
		 *       Ex: LeprechaunsLoot awards free spins from Well bonus game
		 */
		$this->setBetDetails(
			$this->bonusGames['coin_value'],
			$this->bonusGames['num_coins'],
			$this->bonusGames['num_betlines']
		);

	}

	/*
	 *  @fun loadQueuedBonusGames
	 *  To load the bonus games queued in gamelog.queued_games.
	 *  Queued games will be played in LIFO manner.
	 */
	public function loadQueuedBonusGames()
	{
		global $db;

		$gameId = $this->game->gameId;
		$amountType = $this->amountType;
		$accountId = $this->player->accountId;

		$tableName = 'gamelog.queued_bonus_games';

		if ($this->amountType == AMOUNT_TYPE_FUN) {
			$tableName = 'gamelog.queued_bonus_games_fun';
		}


		$queuedQuery = <<<QUERY
			SELECT id, game_id, sub_game_id, base_round_id, round_id,
				account_id, bonus_game_id, bonus_game_code, amount_type,
				num_picks, num_user_picks, picks_data, game_data, multiplier,
				win_amount, state, coin_value, num_coins, num_betlines
			FROM {$tableName}
			WHERE game_id = {$gameId} AND account_id = {$accountId} AND
				amount_type = {$amountType} AND state = 0
			ORDER BY round_id DESC
QUERY;
		$result = $db->runQuery($queuedQuery) or ErrorHandler::handleError(1, 'ROUND_00016');
		$rowsCount = $db->numRows($result);

		if ($rowsCount <= 0) {
			return;
		}

		$this->queuedBonusGames = array();

		while ($rows = $db->fetchAssoc($result)) {
			array_push($this->queuedBonusGames, $rows);
		}

		return;
	}

	public function loadFreeSpins()
	{
		global $db;

		$gameId = $this->game->gameId;
		$amountType = $this->amountType;
		$accountId = $this->player->accountId;
		$tableName = 'gamelog.freespins';

		if ($this->amountType == AMOUNT_TYPE_FUN) {
			$tableName = 'gamelog.freespins_fun';
		}

		$fsQuery = <<<QUERY
			SELECT id, game_id, base_round_id, round_ids, history, coin_value,
				   num_coins, num_betlines, num_spins, spins_left, multiplier,
				   amount_type, win_amount, details, sub_game_id, spin_type,
				   total_win_amount
			  FROM  {$tableName}
			  WHERE account_id = {$accountId} AND
					game_id = {$gameId} AND
					amount_type = {$amountType} AND
					state = 0
			  ORDER BY id DESC LIMIT 1
QUERY;

		$result = $db->runQuery($fsQuery) or ErrorHandler::handleError(1, "ROUND_0004");
		if ($db->numRows($result) <= 0)
			return;

		$row = $db->fetchAssoc($result) or ErrorHandler::handleError(1, "ROUND_0005");

		$this->freeSpins['id'] = $row['id'];
		$this->freeSpins['game_id'] = $row['game_id'];
		$this->freeSpins['base_round_id'] = $row['base_round_id'];
		$this->freeSpins['round_ids'] = decode_object($row['round_ids']);
		$this->freeSpins['history'] = decode_object($row['history']);
		$this->freeSpins['coin_value'] = $row['coin_value'];
		$this->freeSpins['num_coins'] = $row['num_coins'];
		$this->freeSpins['num_betlines'] = $row['num_betlines'];
		$this->freeSpins['num_spins'] = $row['num_spins'];
		$this->freeSpins['spins_left'] = $row['spins_left'];
		$this->freeSpins['multiplier'] = $row['multiplier'];
		$this->freeSpins['amount_type'] = $row['amount_type'];
		$this->freeSpins['win_amount'] = to_coin_currency($row['win_amount']);
		# todo need to de-serialize the following details spin_type
		$this->freeSpins['details'] = decode_object($row['details']);
		$this->freeSpins['sub_game_id'] = $row['sub_game_id'];
		$this->freeSpins['spin_type'] = $row['spin_type'];
		$this->freeSpins['total_win_amount'] = to_coin_currency($row['total_win_amount']);
		$this->loadTotalWinAmount();
	}

	private function loadTotalWinAmount()
	{
		global $db;

		if (!isset($this->freeSpins['details']['parent_id_primary'])) {
			return;
		}
		$parentRowId = $this->freeSpins['details']['parent_id_primary'];
		$tableName = 'gamelog.freespins';

		if ($this->amountType == AMOUNT_TYPE_FUN) {
			$tableName = 'gamelog.freespins_fun';
		}

		$fsQuery = <<<QUERY
			SELECT total_win_amount
			  FROM  {$tableName}
			  WHERE id = {$parentRowId}
QUERY;

		$result = $db->runQuery($fsQuery) or ErrorHandler::handleError(1, "ROUND_00014");
		if ($db->numRows($result) <= 0)
			ErrorHandler::handleError(1, "ROUND_00015");

		$row = $db->fetchAssoc($result) or ErrorHandler::handleError(1, "ROUND_0005");
		$this->freeSpins['total_win_amount'] = to_coin_currency($row['total_win_amount']);
	}

	public function loadFreeSpinsData()
	{
		$this->setFreeSpinParams();

		// if(isset($this->freeSpins['details']['parent_type'])) {
		//     $this->parentSpintype = $this->freeSpins['details']['parent_type'];
		// }

		if (!isset($this->freeSpins['details']['bonus_game_id'])) {
			return;
		}

		$bonusGameId = $this->freeSpins['details']['bonus_game_id'];
		$factoryObject = new BonusFactory($this->game, $this);

		$bonusObject = $factoryObject->getObjectFromId($bonusGameId);
		if ($bonusObject != null and !empty($bonusObject)) {
			$bonusObject->loadBonusGame();
		}
	}

	public function loadStickywinData($account_id)
	{
		global $db;

		$game_id = $this->game->gameId;
		$sub_game_id = $this->game->subGameId;

		$query = <<<QUERY
			SELECT id, sticky_win_details
			  FROM gamelog.sticky_wins
			 WHERE game_id = $game_id AND
				   sub_game_id = $sub_game_id AND
				   account_id = $account_id AND
				   status = 0
			 ORDER BY timestamp DESC
			 LIMIT 1
QUERY;

		$result = $db->runQuery($query) or ErrorHandler::handleError(1, "ROUND_00011");

		if ($db->numRows($result) > 0) {
			$row = $db->fetchAssoc($result) or ErrorHandler::handleError(1, "ROUND_0002");
			$sticky_win_details = $row['sticky_win_details'];
			$sticky_win_details = json_decode($sticky_win_details, true);
			$sticky_win_details['sticky_win_round'] = true;
			$this->nextRound['sticky_win_details'] = $sticky_win_details;
			$this->spinType = 'respin';
		}
	}

	private function setFreeSpinParams()
	{
		if (!$this->freeSpins)
			return;

		if ($this->freeSpins['spins_left'] > 0) {
			$this->setFreespinType();
			$this->setBetDetails(
				$this->freeSpins['coin_value'],
				$this->freeSpins['num_coins'],
				$this->freeSpins['num_betlines']
			);
		}
	}

	private function setFreespinType()
	{
		$this->isFreeSpin = true;
		$this->setSpinType('freespin');

		if (
			isset($this->freeSpins['details']) and
			isset($this->freeSpins['details']['spin_type'])
		) {
			$this->setSpinType($this->freeSpins['details']['spin_type']);
		}
	}

	public function setSpinType($spinType)
	{
		$this->spinType = $spinType;
	}

	public function handleScreenWins()
	{
		global $game_handlers;

		$bonusConfig = $this->game->bonusConfig;
		if (
			!$bonusConfig or !isset($bonusConfig['screen_win_handlers']) or
			!isset($bonusConfig['screen_win_handlers'][$this->spinType])
		) {
			return;
		}

		// echo "2";
		$screenWinFeatures = $bonusConfig['screen_win_handlers'][$this->spinType];
		foreach ($screenWinFeatures as $index => $feature) {
			$featureName = $feature['feature'];
			// echo $featureName;
			$details = $feature['details'];
			$handler = isset($game_handlers[$featureName]) ?
				$game_handlers[$featureName] : $game_handlers['default_handler'];

			$handler($this, $details);
		}
	}

	/* @fun handleQueuedBonus()
	 * To handle the bonus rounds in queue.
	 * Like, one or more bonus round triggered from
	 * a freespin and will be played after completion of
	 * current fs set. All these bonus games will be in
	 * queued.
	 */
	public function handleQueuedBonus()
	{
		$bonusConfig = isset($this->game->bonusConfig['bonus_config']) ?
			$this->game->bonusConfig['bonus_config'] : '';

		if (
			!$bonusConfig or !isset($bonusConfig[$this->spinType]['queued_bonus_id'])
			or $bonusConfig[$this->spinType]['queued_bonus_id'] <= 0
		) {
			return;
		}

		$bonusFactoryObj = new BonusFactory($this->game, $this);
		$queuedBonusId = $bonusConfig[$this->spinType]['queued_bonus_id'];
		$bonusObject = $bonusFactoryObj->getObjectFromId($queuedBonusId);
		$bonusObject->checkAndGrantBonusGame();
	}

	public function handleFreeSpins()
	{
		global $game_handlers;
		$bonusConfig = $this->game->bonusConfig;
		if (
			!$bonusConfig or !isset($bonusConfig['freespins']) or
			!isset($bonusConfig['freespins'][$this->spinType])
		) {
			return;
		}
		$screenWinFeatures = $bonusConfig['freespins'][$this->spinType];
		foreach ($screenWinFeatures as $index => $feature) {
			$featureName = $feature['feature'];
			$details = $feature['details'];
			$handler = isset($game_handlers[$featureName]) ?
				$game_handlers[$featureName] : $game_handlers['default_handler'];
			$handler($this, $details);
		}
	}

	public function handlePostFreeSpinPrizes()
	{
		global $game_handlers;
		$miscInfo = $this->game->misc;
		if (!isset($miscInfo) && !isset($miscInfo['post_freespin_info'][0]['state'])) {
			return;
		}

		if (!empty($this->postFreeSpinInfo)) {
			$featureName = $miscInfo['post_freespin_info'][0]['feature_name'];
			$details = $this->postFreeSpinInfo[0];
			$handler = isset($game_handlers[$featureName]) ?
				$game_handlers[$featureName] : $game_handlers['default_handler'];

			$handler($this, $details);
		}
	}

	///// // chinesedynasty
	public function handleReSpins()
	{
		global $game_handlers;

		$bonusConfig = $this->game->bonusConfig;
		if (
			!$bonusConfig or !isset($bonusConfig['respin']) or
			!isset($bonusConfig['respin'][$this->spinType])
		) {
			return;
		}

		$reSpinWinFeatures = $bonusConfig['respin'][$this->spinType];
		foreach ($reSpinWinFeatures as $index => $feature) {
			$featureName = $feature['feature'];
			$details = $feature['details'];
			$handler = isset($game_handlers[$featureName]) ?
				$game_handlers[$featureName] : $game_handlers['default_handler'];

			$handler($this, $details);
		}
	}

	public function handleBonusGames()
	{
		$this->scattersCount['total'] = 0;
		foreach ($this->game->scatters as $ind => $scatter) {
			$count = get_element_count($this->matrixFlatten, $scatter);
			$this->scattersCount[$scatter] = $count;
			$this->scattersCount['total'] += $count;

		}
		$bonusObject = BonusFactory::getBonusObject($this->game, $this);
		if ($bonusObject != null and !empty($bonusObject)) {
			$bonusObject->checkAndGrantBonusGame();
		}
		$this->handleExtraBonusGames();
	}



	public function handleExtraBonusGames()
	{
		if (
			!isset($this->game->bonusConfig['bonus_config']) or
			!isset($this->game->bonusConfig['bonus_config']['extra_bonus_game']) or
			$this->game->bonusConfig['bonus_config']['extra_bonus_game'] != 1
		) {
			return;
		}


		if (!isset($this->game->bonusConfig['bonus_config'][$this->spinType])) {
			return;
		}

		$config = $this->game->bonusConfig['bonus_config'][$this->spinType];
		$this->scattersCount = array('total' => 0);
		#{"w":{"bonus_game_id":9001,"min_count":2}

		foreach ($config as $symbol => $symbolConfig) {
			$count = get_element_count($this->matrixFlatten, $symbol);
			$this->scattersCount[$symbol] = $count;
			$this->scattersCount['total'] += $count;

			$bonusObject = BonusFactory::getBonusObject($this->game, $this);
			if ($bonusObject != null and !empty($bonusObject)) {
				$bonusObject->checkAndGrantBonusGame();
			}
		}


	}

	public function decrementAndLoadFreeSpins()
	{

		global $db;
		if (!$this->freeSpins or $this->freeSpins['spins_left'] <= 0) {
			return;
		}
		$this->freeSpins['spins_left']--;
		$spinsLeft = $this->freeSpins['spins_left'];
		$winAmount = ($this->freeSpins['win_amount'] > 0) ? $this->freeSpins['win_amount'] : 0;
		$winAmount += $this->winAmount;
		$winAmount = to_base_currency($winAmount);
		$totalWinAmount = ($this->freeSpins['total_win_amount'] > 0) ? $this->freeSpins['total_win_amount'] : 0;
		$totalWinAmount += $this->winAmount;
		$totalWinAmount = to_base_currency($totalWinAmount);

		# todo TODO. Below line needed ??
		$this->freeSpins['win_amount'] += $this->winAmount;

		$state = ($spinsLeft === 0) ? 1 : 0;
		$id = $this->freeSpins['id'];
		$accountId = $this->player->accountId;
		$gameId = $this->game->gameId;
		$amountType = $this->amountType;
		$tableName = 'gamelog.freespins';

		if ($this->amountType == AMOUNT_TYPE_FUN) {
			$tableName = 'gamelog.freespins_fun';
		}
		$fsQuery = <<<QUERY
		UPDATE {$tableName}
		   SET spins_left = {$spinsLeft},
			   win_amount = {$winAmount},
			   total_win_amount = {$totalWinAmount},
			   state = {$state}
		  WHERE id = {$id} AND
				account_id = {$accountId} AND
				game_id = {$gameId} AND
				amount_type = {$amountType} AND
				state = 0
QUERY;

		$result = $db->runQuery($fsQuery) or ErrorHandler::handleError(1, "ROUND_0006");
		# following wont be set if if is the last free spins. Hence setting here
		$this->freeSpins['win_amount'] = to_coin_currency($winAmount);
		$this->message['current_round']['total_fs_win_amount'] = to_coin_currency($winAmount);

		if (
			isset($this->game->misc) &&
			isset($this->game->misc['fs_state'])
			&& ($this->freeSpins['spins_left'] == 0)
		) {
			if ($this->spinType == 'respin') {
				$this->respinState = 1;
			}
			if ($this->spinType == 'freespin') {
				$this->freespinState = 1;
			}
		}

		if ($totalWinAmount > 0) {
			$this->message['current_round']['total_fs_win_amount'] = to_coin_currency($totalWinAmount);
		}

		$this->updateTotalWinAmount();
		$this->loadFreeSpins();
		$this->setFreespinState();
	}

	private function updateTotalWinAmount()
	{
		if (
			!isset($this->freeSpins['details']) ||
			!isset($this->freeSpins['details']['parent_id_primary'])
		) {
			return;
		}

		$this->updateFsTotalWinAmount(
			$this->freeSpins['details']['parent_id_primary'],
			$this->winAmount
		);
	}

	private function updateFsTotalWinAmount($rowId, $winAmount)
	{
		global $db;

		$winAmount = to_base_currency($winAmount);

		$tableName = 'gamelog.freespins';

		if ($this->amountType == AMOUNT_TYPE_FUN) {
			$tableName = 'gamelog.freespins_fun';
		}


		$fsQuery = <<<QUERY
		UPDATE {$tableName}
		   SET total_win_amount = total_win_amount + {$winAmount}
		  WHERE id = {$rowId}
QUERY;
		$db->runQuery($fsQuery) or ErrorHandler::handleError(1, "ROUND_0009");
	}

	private function setFreespinState()
	{
		if (
			$this->freeSpins['spins_left'] == 0 &&
			isset($this->freeSpins['details']['parent_spins_left']) &&
			$this->freeSpins['details']['parent_spins_left'] <= 0
		) {
			$this->freespinState = 1;
		}
	}

	public function getBonusGameWinAmount($multiplier)
	{
		return $this->bonusGames['multiplier'] * $multiplier;
	}

	private function setTotalBet($coinValue, $numCoins, $numBetLines)
	{
		$this->totalBet = $coinValue * $numCoins * $numBetLines;

		if ($this->game->paylinesType == "fixed") {
			$this->totalBet = $coinValue * $numCoins;
		}
	}

	private function setLineBet($coinValue, $numCoins, $numBetLines)
	{

		$this->lineBet = $coinValue * $numCoins;

		if ($this->game->paylinesType == "fixed") {
			$this->lineBet = $coinValue;
		}
	}

	public function getParentSpinType()
	{
		$parentSpintypes = array(
			'normal' => 'normal',
			'freespin' => 'freespins',
			'respin' => 'respins',
			'bonus' => 'bonus'
		);

		if (isset($parentSpintypes[$this->spinType])) {
			return $parentSpintypes[$this->spinType];
		}

		ErrorHandler::handleError(1, "ROUND_NO_SPINTYPE_0006");
	}

	public function setWilds($wilds)
	{
		$this->game->wilds = $wilds;
	}

	public function getCoinValues()
	{
		global $db;

		$query = "SELECT coin_values, default_coin_value
				 FROM game.currency
				  WHERE game_name = '{$this->game->gameName}'
				  AND currency = '{$this->player->currency}'";

		$result = $db->runQuery($query) or ErrorHandler::handleError(1, "CURRENCY_ERR1");
		if ($db->numRows($result) == 0) {
			return $this->game->coinValues;
		}
		$row = $db->fetchAssoc($result);
		$this->game->defaultCoinValue = $row['default_coin_value'];
		return decode_object($row['coin_values']);
	}

	public function getReels()
	{
		$config = $this->game->reelsetConfig["reel_set"][$this->spinType];
		$weights = $config['weights'];
		$values = $config['values'];
		$feature = weighted_random_number($weights, $values);
		while (isset($config[$feature])) {
			$config = $config[$feature];
			$weights = $config['weights'];
			$values = $config['values'];
			$feature = weighted_random_number($weights, $values);
		}
		return $feature;
	}

	public function loadGamble()
	{
		global $db;

		$gameId = $this->game->gameId;
		$amountType = $this->amountType;
		$accountId = $this->player->accountId;

		$tableName = 'gamelog.gamble';

		if ($this->amountType == AMOUNT_TYPE_FUN) {
			$tableName = 'gamelog.gamble_fun';
		}

		$gbQuery = <<<QRY
		SELECT id, game_id, round_id, account_id,
			   bet_amount, win_amount, amount_type,
			   choice_type, player_choice, config,
			   multiplier, status
		FROM   {$tableName}
		WHERE  game_id = {$gameId} AND
			   account_id = {$accountId} AND
			   amount_type = {$amountType} AND
			   status = 0
		ORDER BY id DESC LIMIT 1
QRY;
		$result = $db->runQuery($gbQuery);

		if (is_bool($result) or $db->numRows($result) <= 0)
			return;

		$row = $db->fetchAssoc($result) or ErrorHandler::handleError(1, "ROUND_0005");

		$this->gamble['id'] = $row['id'];
		$this->gamble['gameId'] = $row['game_id'];
		$this->gamble['baseroundId'] = $row['base_round_id'];
		$this->gamble['roundId'] = $row['round_id'];
		$this->gamble['accountId'] = $row['account_id'];
		$this->gamble['betAmount'] = $row['bet_amount'];
		$this->gamble['winAmount'] = $row['win_amount'];
		$this->gamble['amountType'] = $row['amount_type'];
		$this->gamble['choiceType'] = $row['choice_type'];
		$this->gamble['playerChoice'] = $row['player_choice'];
		$this->gamble['config'] = decode_object($row['config']);
		$this->gamble['multiplier'] = $row['multiplier'];
		$this->gamble['status'] = $row['status'];
	}

	public function getBaseRoundId()
	{
		if ($this->spinType == 'normal') {
			$baseRoundId = $this->roundId;
		} else if ($this->spinType == 'freespin' || $this->spinType == 'respin') {
			$baseRoundId = $this->freeSpins['base_round_id'];
		} else if ($this->spinType == 'bonus') {
			$baseRoundId = $this->bonusGames['base_round_id'];
		} else {
			ErrorHandler::handleError(1, "BASE_ROUND_ID_ERR1");
		}

		return $baseRoundId;
	}

	public function getRoundStatePostDebit()
	{
		if (!in_array($this->player->opCode, array('RLX', 'TNT', 'GMO', 'NJN'))) {
			return 0;
		}

		$spin_type_list = array('freespin', 'respin');
		$base_round_id = 0;

		if ($this->spinType == 'normal') {
			$base_round_id = $this->roundId;
		} elseif (in_array($this->spinType, $spin_type_list)) {
			$base_round_id = $this->freeSpins['base_round_id'];
		} else if ($this->spinType == 'bonus') {
			$base_round_id = $this->bonusGames['base_round_id'];
		}

		$flag = $this->isBonusGameExists($base_round_id);
		if ($flag == 1) {
			return 0;
		} else {
			return 1;
		}

		return 1;
	}

	public function isBonusGameExists($base_round_id)
	{
		global $db;
		$query_fs = <<<QR
	         SELECT id FROM gamelog.freespins
	         WHERE state=0 and base_round_id={$base_round_id}
QR;
		$res_fs = $db->runQuery($query_fs);
		$fs_count = $db->numRows($res_fs);

		if ($fs_count > 0) {
			return 1;
		}

		$query_bonus = <<<QR
	        SELECT id FROM gamelog.bonus_games
	        WHERE state=0 and base_round_id={$base_round_id}
QR;
		$res_bonus = $db->runQuery($query_bonus);
		$bonus_count = $db->numRows($res_bonus);

		if ($bonus_count > 0) {
			return 1;
		}


		$query_qu = <<<QR
	          SELECT id FROM gamelog.queued_bonus_games
	          WHERE state=0 and base_round_id={$base_round_id}
QR;
		$res_qu = $db->runQuery($query_qu);
		$qu_count = $db->numRows($res_qu);

		if ($qu_count > 0) {
			return 1;
		}

		return 0;
	}

	public function getRoundEndState()
	{
		return 0; # dont remove. Bala

		if ($this->spinType == 'normal') {
			if (empty($this->bonusGamesWon) || count($this->bonusGamesWon) <= 0) {
				return 1;
			}
			return 0;
		}

		if (
			($this->freeSpins && $this->freeSpins['spins_left'] > 0) ||
			($this->bonusGames && $this->bonusGameRound['state'] == 0)
		) {
			return 0;
		}

		return 1;
	}

	public function getRecentBaseRoundId($gameId, $accountId)
	{
		global $db;

		$prevQry = "
			SELECT round_id, closed
			  FROM gamelog.round
			 WHERE account_id = {$accountId} AND
				   game_id ={$gameId} AND
				   amount_type = {$this->amountType} AND
				   spin_type = 1
		  ORDER BY round_id desc limit 1";

		$result = $db->runQuery($prevQry) or ErrorHandler::handleError(1, "ROUND_0001");

		if ($db->numRows($result) <= 0) {
			ErrorHandler::handleError(1, "BASE_ROUND_ID_NOT_FOUND", "Base Round ID not found.");
		}

		$row = $db->fetchAssoc($result) or ErrorHandler::handleError(1, "ROUND_0002");

		return $row;
	}

	public function setRoundEndData($data)
	{
		if (isset($data['error']) && $data['error'] == 0) {
			$this->roundEndData = $data;
		}
	}

	public function closeRoundId($roundId, $state)
	{
		global $db;

		if (!$roundId || $state == 0) {
			return;
		}

		$query = "
		   UPDATE gamelog.round
		      SET closed = 1
			WHERE round_id = {$roundId}";

		$db->runQuery($query) or ErrorHandler::handleError(1, "ROUND_0001");
	}

	function getPrevBaseRoundId()
	{
		global $db;

		/*if($this->previousRound['spin_type'] == 'normal') {
						return $this->previousRound['round_id'];
					}*/

		$gameId = $this->game->gameId;
		$amountType = $this->amountType;
		$accountId = $this->player->accountId;

		$query = <<<QR
			  SELECT round_id, closed
			    FROM gamelog.round
			   WHERE game_id = {$this->game->gameId} AND
			   		 amount_type = {$this->amountType} AND
					 account_id = {$this->player->accountId} AND
					 spin_type = 1 AND
                     closed = 0
			ORDER BY timestamp DESC LIMIT 1
QR;
		$res = $db->runQuery($query);
		if ($db->numRows($res) <= 0) {
			return 0;
		}

		$row = $db->fetchAssoc($res);

		if ($row['closed'] == 1) {
			return 0;
		}

		return $row['round_id'];
	}

	public function check_symbol_win($reel_pos, $sticky_symbol)
	{
		$feture_value = [];
		$pay_table = $this->game->payTable;
		if ($pay_table[count($reel_pos) . $sticky_symbol]) {
			$symbol_pay = $pay_table[count($reel_pos) . $sticky_symbol];
			$paylines = $this->game->paylines;
			$symbol_win = $symbol_pay * $paylines;
			// $this->winAmount += $symbol_win;
			$feture_value['special_symbol_positions'] = $reel_pos;
			$feture_value['symbol'] = $sticky_symbol;
			$feture_value['win'] = $symbol_win;

			// $winAmount += $this->winAmount;
			$this->multipliers = $this->freeSpins['multiplier'];
		}
		return $feture_value;
	}

	public function changeBet()
	{
		$featureConfig = $this->game->symbolConfig;
		if (
			(!$featureConfig or !isset($featureConfig['anteBet']) or
				!isset($featureConfig['anteBet'][$this->spinType])) and

			(!$featureConfig or !isset($featureConfig['BuyFg']) or
				!isset($featureConfig['BuyFg'][$this->spinType]))
		) {
			return $this->totalBet;
		}
		if (isset($featureConfig['anteBet'][$this->spinType])) {
			$buy_fg_bet = $featureConfig['anteBet'][$this->spinType]["ante_bet"]; // 1.4
			$baseBet = $this->totalBet / $buy_fg_bet[0];
			return $baseBet;
		} elseif (isset($featureConfig['BuyFg'][$this->spinType])) {
			$buy_fg_bet = $featureConfig['BuyFg'][$this->spinType]["buy_fg"]; // 1.4
			$baseBet = $this->totalBet / $buy_fg_bet[0];
			return $baseBet;
		}
		return $this->totalBet;
	}
}
?>