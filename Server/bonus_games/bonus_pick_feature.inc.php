<?php
require_once 'ibonus.inc.php';

class BonusPickFeature extends BonusPickGame implements iBonus
{
	public function checkAndGrantBonusGame($param='scatter', $type='')
	{
		global $summary;

		$numScatters = $this->scattersCount['total'];
		$config = $this->getBonusConfig($numScatters, $this->round->spinType);

		if(!$this->isConfigValid($config)) {
			return null;
		}

		$config = decode_object($config);

		$numSpins = $config['num_spins'];
		$multiplier = $config['multiplier'];
		$addFeatures = $config['add_features'];
		$weights = $config['weights'];
		$reelSet = $config['reel_set'];
		$values = $config['values'];
		$index = get_weighted_index($weights); 
		$feature = $addFeatures[$index];
		$value = $values[$index];
		$chance = $config['chance'];

		$stickyWld = array();
		$wildReel = array();
		$indexes = array();
		if($feature == "extra_spins") {
			$numSpins = $numSpins + $value;
		} else if($feature == "sticky_wild") {
			$n = $this->game->numRows * $this->game->numColumns;
			$value = get_random_number(0, $n-1);
			array_push($stickyWld, $value);
		} else if($feature == "wild_reel"){
			array_push($wildReel, $value);
			$indexes = get_matrix_indexes($this->round, $indexes, $value);
		} else if($feature == "ragnarok"){
			$chance = $config['rgnk_chance'];
		}

		$numPicks = $config['num_picks'];
		$fsGameId = $reelSet[$index];
		$pickDetails = array("feature" => $feature,
							 "value" => $value,
							 "wilds" => $stickyWld,
							 "reels" => $wildReel,
							"wild_index" => array(),
							"reel_index" => $indexes,
							"type" => $param);

		$bonusGameData = Array(
					'parent_type' => "normal",
					'fs_game_id' => $fsGameId,
					'num_picks' => $numPicks,
					'num_prizes' => $config['num_prizes'],
					'chance' => $chance,
					'num_spins' => $numSpins,
					'multiplier' => $multiplier,
                    'pick_details'=>  $pickDetails,
                );

		$bonusGameData = encode_objects($bonusGameData);
		if (isset($type) && $type == "chest") {
            grant_queued_bonus($this->game->gameId, $this->game->subGameId,
                    $this->round->roundId, $this->round->roundId,
                    $this->accountId, $this->bonusGameId,
                    $config['code'], $numPicks, $bonusGameData,
                    $multiplier, $this->round->amountType, $this->round->coinValue,
                    $this->round->numCoins, $this->game->paylines);
        }else{
			grant_bonus_game($this->game->gameId, $this->game->subGameId,
							$this->round->roundId, $this->round->roundId,
							$this->accountId, $this->bonusGameId,
							$config['code'], $numPicks, $bonusGameData,
							$multiplier, $this->round->amountType, $this->round->coinValue,
							$this->round->numCoins, $this->round->numBetLines);

			$bonusGameWon = Array(
							'type' => 'bonus_game',
							'bonus_game_id' => $this->bonusGameId,
							'num_picks' => $numPicks,
							'num_prizes' => $config['num_prizes'],
							'parent_type' => $param);

			array_push($this->round->bonusGamesWon, $bonusGameWon);
			$this->round->nextRound = $bonusGameWon;
		}
	}

	public function playBonusGame($pickedPosition)
	{
		$pickedPosition = (int)$pickedPosition;
		$this->validatePick($pickedPosition);

		array_push($this->round->bonusGames['picks_data'], $pickedPosition);
		$this->round->bonusGames['num_user_picks']++;
		$state = $this->getState();
		$this->round->bonusGameRound['state'] = $state;

		$this->calculatePrizes($state, $pickedPosition);
	}

	public function calculatePrizes($state, $pickedPosition)
	{
		$gameData = $this->round->bonusGames['game_data'];

		$this->updateBonusGame($state);

		if($state == 1 or $state == True) {
			$this->processPrizes($gameData);
			$this->round->bonusGameRound['num_spins'] = $gameData['num_spins'];
			$this->round->bonusGameRound['pick_details'] = $gameData['pick_details'];
			$this->round->nextRound = array();
        }
	}

	protected function processPrizes($gameData)
	{
	   // Add number of spins and number of spins left in freespins table.
		$round_ids = ''; $history = ''; $spin_type=2;
        $multiplier = $gameData['multiplier'];
        award_freespins($this->game->gameId, $this->game->subGameId,
                        $this->accountId, $this->round->bonusGames['round_id'],
                        $gameData['num_spins'], $multiplier,
                        $this->round->bonusGames['coin_value'], $this->round->numCoins,
                        $this->round->numBetLines, $this->round->amountType,
                        $round_ids, $history, $spin_type, $gameData);
		// TODO set here for client communication that next round is the freespin round
	}

	private function validatePick($pickedPosition)
	{
		if($pickedPosition !== 1) {
			ErrorHandler::handleError(1, "PICK_0001", "Invalid pick position");
		}
	}

	private function getBonusConfig($numSymbols, $spinType)
	{
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
 