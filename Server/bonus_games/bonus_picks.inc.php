<?php
require_once 'ibonus.inc.php';

class BonusPickGame implements iBonus
{
	protected $game;
	protected $round;
	protected $accountId;
	protected $symbol;
	protected $bonusGameId;
	protected $scattersCount;

	public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount) {
		$scattersCount['total'] = $scattersCount[$symbol];
		$this->game = $game;
		$this->round = $round;
		$this->accountId = $accountId;
		$this->scattersCount = $scattersCount;
		$this->symbol = $symbol;
		$this->bonusGameId = $bonusGameId;
	}

	public function loadBonusGame() {
		$gameData = $this->round->bonusGames['game_data'];

		$this->round->nextRound = Array(
			'type' => 'bonus_game',
			'bonus_game_id' => $this->round->bonusGames['bonus_game_id'],
			'num_picks' => $this->getRemainingPicks(),
			'num_prizes' => $this->round->bonusGames['game_data']['num_prizes'],
			'parent_type' => $this->round->bonusGames['game_data']['parent_type'],
			'pick_positions' => $this->round->bonusGames['picks_data'],
			'pick_details' => $this->round->bonusGames['game_data']['pick_details']
		);
	}

	private function getRemainingPicks() {
        return $this->round->bonusGames['num_picks'] -
            $this->round->bonusGames['num_user_picks'];
    }

	/**
	 * @method fsModeBonusPrizes
	 * This method will handle the bonus rounds triggered in a freespin.
	 * Bonus rounds triggered from the free spins will not be played with pick
	 * feature. Directly freespins will be provided. Here new freespins will be
	 *  added with running freespins.
	 * TODO check how to update num_spins in freespins table.Because  its not working.
	 * */

	public function checkAndGrantBonusGame() {

		$numScatters = $this->scattersCount['total'];
		$config = $this->getBonusConfig($numScatters, $this->round->spinType);

		if(!$this->isConfigValid($config)) {
			return null;
		}

		$config = decode_object($config);

		$multiplier =1;
		$extra_spins = 0;
		$pickDetails = Array();
		$rewards =$config['rewards'];
		$numPicks = $config['num_picks'];
		$fsGameId = $config['fs_game_id'];

		$bonusGameData = Array(
					'parent_type' => "normal",
					'fs_game_id' => $fsGameId,
					'num_picks' => $numPicks,
					'num_prizes' => $config['num_prizes'],
					'prizes'  => $config['prizes'],
					'prize_pool' => $config['prize_pool'],
					'multiplier' => $multiplier,
					'extra_spins' => $extra_spins,
					'wilds' => Array(),
					'exp_sys' => Array(),
					'rewards' => $rewards,
                    'pick_details'=>  $pickDetails);

		$baseRoundId = $this->round->roundId;
		if($this->round->spinType == "freespin"){
			$bonusGameData = $this->round->freeSpins['details']['game_data'];
			$bonusGameData['num_picks'] = $numPicks;
			$bonusGameData['extra_spins'] = $extra_spins;
			$bonusGameData['feature_details'] = $this->round->freeSpins['details']['feature_details'];
            $bonusGameData['pick_details'] = $pickDetails;
            $bonusGameData['parent_type'] = "freespin";
            $baseRoundId = $this->round->freeSpins['base_round_id'];
		}
		$bonusGameData = encode_objects($bonusGameData);
		grant_bonus_game($this->game->gameId, $this->game->subGameId,
						$baseRoundId, $this->round->roundId,
						$this->accountId, $this->bonusGameId,
						$config['code'], $numPicks, $bonusGameData,
						$multiplier, $this->round->amountType, $this->round->coinValue,
						$this->round->numCoins, $this->round->numBetLines);

		$bonusGameWon = Array(
						'type' => 'bonus_game',
						'bonus_game_id' => $this->bonusGameId,
						'num_picks' => $numPicks,
						'num_prizes' => $config['num_prizes']);

		array_push($this->round->bonusGamesWon, $bonusGameWon);
		$this->round->nextRound = $bonusGameWon;
	}

	public function playBonusGame($pickedPosition) {

		$pickedPosition = (int)$pickedPosition;
		$this->validatePick($pickedPosition);

		array_push($this->round->bonusGames['picks_data'], $pickedPosition);
		$this->round->bonusGames['num_user_picks']++;
		$state = $this->getState();
		$this->round->bonusGameRound['state'] = $state;

		$this->calculatePrizes($state, $pickedPosition);

	}

	private function processPrizes($numFreeSpins, $gameData, $state=0)
	{
	   // Add number of spins and number of spins left in freespins table.
		$row_id = $this->round->freeSpins['id'];
		$base_round_id = $this->round->freeSpins['base_round_id'];
		$parent_type = "";
        if(isset($gameData['row_id'])){
        	$parent_type = "freespin";
            $row_id = $gameData['row_id'];
        }else if(!isset($gameData['row_id'])){
            $gameData['row_id'] = $row_id;
            $gameData['base_round_id'] = $base_round_id;
            $parent_type = "normal";
            $gameData['feature_details'] = Array();
        }
        $fDetails = array_merge($gameData['feature_details'], $gameData['pick_details']);
        $details = Array("fs_game_id" => $gameData['fs_game_id'],
						 "parent_type" => $parent_type,
						 "pick_details" => $gameData['pick_details'],
                         "feature_details" => $fDetails,
						 "game_data" => $gameData);

        $this->updateFreeSpins( $gameData['row_id'], $this->game->gameId,
                        $this->accountId, $this->round->bonusGames['round_id'],$numFreeSpins,
                        $gameData['multiplier'],$this->round->amountType,
                        $this->round->freeSpins['round_ids'], $this->round->freeSpins['history'],
                        $details, $state);

		// TODO set here for client communication that next round is the freespin round
	}

	public function calculatePrizes($state, $pickedPosition) {

		$gameData = $this->round->bonusGames['game_data'];
		$num_picks = $gameData['num_picks'];

		$wonFeature = '';

		$wilds = $gameData['wilds'];
		$exp_sys = $gameData['exp_sys'];
		$extraSpins = $gameData['extra_spins'];

		$index = get_random_number(0, count($gameData['prizes'])-1);
		$feature = $gameData['prizes'][$index];

		$prize_index = get_random_number(0, count($gameData['prize_pool'][$feature])-1);
		$wonFeature = $gameData['prize_pool'][$feature][$prize_index];

		$pick_details = Array("type" => $feature, "value" => $wonFeature, "position" => $pickedPosition);

		$this->round->bonusGameRound['prize_value'] = $pick_details;

		switch ($feature) {
			case 'multiplier':
				$gameData['multiplier'] = $wonFeature ;
				array_splice($gameData['prizes'], $index, 1);
				break;
			case 'additional_freespins':
				$gameData['extra_spins'] += $wonFeature;
				break;
			case 'wild_symbol':
				array_push($wilds, $wonFeature);
				array_splice($gameData['prize_pool'][$feature], $prize_index, 1);
				$gameData['wilds'] = $wilds;
				if(empty($gameData['prize_pool'][$feature])){
					array_splice($gameData['prizes'], $index, 1);
				}
				$wonFeature = $wilds;
				break;
			case 'expanding_symbol':
				array_push($exp_sys, $wonFeature);
				array_splice($gameData['prize_pool'][$feature], $prize_index, 1);
				$gameData['exp_sys'] = $exp_sys;
				if(empty($gameData['prize_pool'][$feature])){
					array_splice($gameData['prizes'], $index, 1);
				}
				$wonFeature = $exp_sys;
				break;
			case 'special_quest':
				$pick_details['count'] = 0;
				$gameData['spl_quest'] = $wonFeature;
				$gameData[$wonFeature] = 0;
				$gameData['min_limit'] = $gameData['prize_pool']['min_count'][$prize_index];
				array_splice($gameData['prizes'], $index, 1);
				break;
		}
		array_push($gameData['pick_details'], $pick_details);

		$this->round->bonusGames['game_data'] = $gameData;

		$this->updateBonusGame($state);

		if($state == 1 or $state == True) {
			if($gameData['parent_type'] == "freespin"){
				$this->round->bonusGameRound['total_add_fs'] = $gameData['extra_spins'];
			}
            if(!isset($this->round->freeSpins) and  $gameData['extra_spins'] > 0) {
                $this->processPrizes($gameData['extra_spins'], $this->round->bonusGames['game_data'],
                					 $state);
            }else if(isset($this->round->freeSpins) and $this->round->freeSpins['spins_left'] >0){
                $this->processPrizes($gameData['extra_spins'], $this->round->bonusGames['game_data']);
            }else if(!isset($this->round->freeSpins)  and  $gameData['extra_spins'] == 0){
            	$this->grantSpecialQuestReward($gameData);
            }
        }else{
            $this->round->nextRound = Array(
                        'type' => 'bonus_game',
                        'bonus_game_id' => $this->bonusGameId,
                        'num_picks' => $this->getRemainingPicks(),
                        'num_prizes' => $gameData['num_prizes'],
                        'state' => $state
                      );

        }
	}

	public function updateBonusGame($state, $winAmount = 0) {
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

	public function getState()
	{
		return ($this->round->bonusGames['num_user_picks'] == $this->round->bonusGames['num_picks']) ?
			1 : 0;
	}

	private function validatePick($pickedPosition)
	{
		$prevPicks = $this->round->bonusGames['picks_data'];
		$numPrizes = $this->round->bonusGames['game_data']['num_prizes'];
		if(!isset($pickedPosition) or in_array($pickedPosition, $prevPicks) or
			($pickedPosition < 0 or $pickedPosition >$numPrizes)
		) {
			ErrorHandler::handleError(1, "BONUSPICKS_00011", "Invalid pick position");
		}
	}

	protected function isConfigValid($config)
	{
		if(empty($config) or $config == Null or !$config) {
			return false;
		}
		return true;
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

	protected function updateFreeSpins($row_id, $game_id, $account_id, $base_round_id,
													$num_spins, $multiplier=1, $amount_type=1, $round_ids,
													$history, $details="", $state=0)
	{
		global $db;

		$details = encode_objects($details);
		$round_ids = encode_objects($round_ids);
		$history = encode_objects($history);

		$tableName = 'gamelog.freespins';

		if($this->round->amountType == AMOUNT_TYPE_FUN) {
			$tableName = 'gamelog.freespins_fun';
		}


		$fs_query = <<<QRY
		UPDATE {$tableName}
			 SET spins_left = spins_left + {$num_spins},
					 num_spins = num_spins + {$num_spins},
					 details ='{$details}',
					 round_ids = '{$round_ids}',
					 history = '{$history}',
					 multiplier = {$multiplier},
					 state = 0
		WHERE id = {$row_id} AND
					account_id = {$account_id} AND
					game_id = {$game_id} AND
					amount_type = {$amount_type} AND
					state = {$state}
QRY;

		$result = $db->runQuery($fs_query) or ErrorHandler::handleError(1, "BONUSPICKS_003");
		$this->round->loadFreeSpins();
	}

	private function updateFsTotalWinAmount($rowId, $winAmount) {
        global $db;

	$winAmount = to_base_currency($winAmount);

	$tableName = 'gamelog.freespins';

        if($this->round->amountType == AMOUNT_TYPE_FUN) {
            $tableName = 'gamelog.freespins_fun';
        }

        $fsQuery = <<<QUERY
        UPDATE {$tableName}
           SET total_win_amount = total_win_amount + {$winAmount}
          WHERE id = {$rowId}
QUERY;
        $db->runQuery($fsQuery) or ErrorHandler::handleError(1, "BONUSPICKS_004");
    }

    private function getFsTotalWinAmount($rowId) {
        global $db;

	$tableName = 'gamelog.freespins';

        if($this->round->amountType == AMOUNT_TYPE_FUN) {
            $tableName = 'gamelog.freespins_fun';
        }

        $fsQuery = "
        SELECT total_win_amount
        FROM {$tableName}
        WHERE id = {$rowId}";
        $result = $db->runQuery($fsQuery) or ErrorHandler::handleError(1, "BONUSPICKS_004");
        $row =  $db->fetchAssoc($result)  or ErrorHandler::handleError(1, "BONUSPICKS_005");

        return to_coin_currency(floatval($row['total_win_amount']));
    }

    function grantSpecialQuestReward($gameData)
    {
		if(isset($gameData['reward'])){
            $reward = $gameData['reward'];
            $this->round->bonusGameRound['bonus_games_won'] = Array();
            switch ($reward) {
                case '200bets':
                    $this->rewardBet($reward, $gameData);
                    break;
                case 'ultraspin':
                    $this->grantUltraSpin($reward, $gameData);
                    break;
                case 'free_game':
                    $this->grantFreeGame($reward, $gameData);
                    break;
                default:
                    ErrorHandler::handleError(1, "POSTLINE_0001");
                    break;
            }
            $this->round->bonusGamesWon = $this->round->bonusGameRound['bonus_games_won'];
        }
        $this->round->bonusGameRound['freespin_state'] = 1;

		$this->round->bonusGameRound['total_fs_win_amount'] = $this->getFsTotalWinAmount($gameData['row_id']);
    }

    private function rewardBet($reward, $gameData)
    {
    	$this->round->winLineNumbers = Array();
    	$row_id = $gameData['row_id'];
        $nthBet = $gameData['rewards'][$reward];
        $betWin = $nthBet * $this->round->totalBet;
        $this->updateFsTotalWinAmount($row_id, $betWin);
        $this->round->winAmount += $betWin;

        array_push($this->round->bonusGameRound['bonus_games_won'],
        					Array("type" => $reward, "value" => $betWin));
        array_push($this->round->winLineNumbers, Array($reward, $betWin));
    }

    private function grantUltraSpin($reward, $gameData)
    {
        $ultraSpinsInfo = Array('type' => 'ultraspin');

        $fsGameId = $gameData['fs_game_id'];
        $baseRoundId = $gameData['base_round_id'];
        $details = $gameData['rewards']['ultraspin'];
    	$details['feature_details'] = $ultraSpinsInfo;
        $numSpins = $details['game_data']['num_spins'];
        $multiplier = $details['game_data']['multiplier'];

    	award_freespins($this->game->gameId, $fsGameId,
                        $this->round->player->accountId,
                        $baseRoundId, $numSpins, $multiplier,
                        $this->round->coinValue, $this->round->numCoins,
                        $this->round->numBetLines, $this->round->amountType,
                        Array($baseRoundId), Array($numSpins),
                        $fsGameId, $details);

        $freeSpinsInfo = Array(
            'type' => 'freespins', 'num_spins' => $numSpins,
            'spins_left' => $numSpins, 'win_amount' => 0);
        array_push($this->round->bonusGameRound['bonus_games_won'], $ultraSpinsInfo);
    	array_push($this->round->bonusGameRound['bonus_games_won'], $freeSpinsInfo);
    	$this->round->nextRound = $freeSpinsInfo;
    }

    private function grantFreeGame($reward, $gameData)
    {
    	$details = Array('feature_details' => Array('type' => $reward),
                         'parent_type' => $this->round->spinType);

    	$baseRoundId = $gameData['base_round_id'];
        $gameData = $gameData['rewards']['free_game']['game_data'];
        $numSpins = $gameData['num_spins'];
        $multiplier = $gameData['multiplier'];
        $fsGameId = $gameData['fs_game_id'];

    	award_freespins($this->game->gameId, $fsGameId,
                        $this->round->player->accountId,
                        $baseRoundId, $numSpins, $multiplier,
                        $this->round->coinValue, $this->round->numCoins,
                        $this->round->numBetLines, $this->round->amountType,
                        Array($baseRoundId), Array($numSpins),
                        $fsGameId, $details);

    	$gameData['feature_details'] = Array('type' => $reward);

        $numPicks = $gameData['num_picks'];
        $numPrizes = count($gameData['prizes']);
        $bonusGameId = $gameData['bonus_game_id'];
        $bonusGameCode = $gameData['code'];

    	grant_bonus_game($this->game->gameId, $fsGameId, $baseRoundId,
                         $baseRoundId, $this->round->player->accountId,
                         $bonusGameId, $bonusGameCode, $numPicks,
                         encode_objects($gameData), $multiplier,
                         $this->round->amountType, $this->round->coinValue,
                         $this->round->numCoins, $this->round->numBetLines);

        # todo Bala must check the bellow 3 items
    	array_push($this->round->bonusGameRound['bonus_games_won'], Array('type' => $reward));

    	$bonusGameWon = Array('type' => 'bonus_game', 'bonus_game_id' => $bonusGameId,
                              'num_picks' => $numPicks, 'num_prizes' => $numPrizes);

    	array_push($this->round->bonusGameRound['bonus_games_won'], $bonusGameWon);
    	$freespins_info = Array('type' => 'freespins', 'num_spins' => $numSpins,
                                'spins_left' => $numSpins, 'win_amount' => 0);

    	array_push($this->round->bonusGameRound['bonus_games_won'], $freespins_info);
    }
}
?>
