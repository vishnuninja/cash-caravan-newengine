<?php
require_once 'ibonus.inc.php';

class PickBonusSym extends BonusPickGame implements iBonus
{
	/**
	 * @fun checkAndGrantBonusGame()
	 * @desc This function is called to check if bonus game can be granted.
	 *       This bonus round will be having the multipliers and wheel values.
	 */
	public function checkAndGrantBonusGame()
	{
		$numScatters = $this->scattersCount['total'];
		$conf = $this->getBonusConfig($numScatters);

		if(!$this->isConfigValid($conf)) {
			return null;
		}

		$conf = decode_object($conf);

		$numSpins = $conf['num_spins'];
		$index = get_random_number(0, count($numSpins)-1);
		$numOfFS = $numSpins[$index];

		$symbols = $conf['symbols'];
		$weights = $conf['weights'];
		$index = get_weighted_index($weights);
		$selectedSym = $symbols[$index];

		$code = $conf['code'];
		$numPicks = $conf['num_picks'];
		$multiplier = $conf['multiplier'];
		
		$minArr = $conf['min_arr'];
		$minCount = $conf['min_count'];
		
		if($index > $minCount) {
			$minCount = $minArr[1];
		}
		else {
			$minCount = $minArr[0];
		}

		$id = $roundIds = $history= Null;
		$baseRoundId = $this->round->roundId;
		if(isset($this->round->freeSpins)) {
			$details = $this->round->freeSpins['details'];
			$selectedSym = $details['exp_symbol'];
			$minCount = $details['min_count'];
			$id = $this->round->freeSpins['id'];
			$roundIds = $this->round->freeSpins['round_ids'];
			$history = $this->round->freeSpins['history'];
			$baseRoundId = $this->round->freeSpins['base_round_id'];
		}
		
		$bonusGameData = Array(
					'id' => $id,
					'symbols'   => $symbols,
					'num_picks' => $numPicks,
					'num_spins' => $numOfFS,
					'min_count' => $minCount,
					'max_count' => $conf['min_count'],
					'multiplier'    => $multiplier,
					'exp_symbol'    => $selectedSym,
					'parent_type'   => $conf['parent_type'],
					'num_prizes'    => $conf['num_prizes'],
					'pick_details'  => "",
					'round_ids'     => $roundIds,
					'history'       => $history
				);

		$game_data = encode_objects($bonusGameData);

		grant_bonus_game($this->game->gameId, $this->game->subGameId,
						 $baseRoundId, $this->round->roundId,
						 $this->accountId, $this->bonusGameId, $code,
						 $numPicks, $game_data, $multiplier, $this->round->amountType,
						 $this->round->coinValue, $this->round->numCoins,
						 $this->round->numBetLines);

		$bonusGameData = Array(
			'type'          => 'bonus_game',
			'bonus_game_id' => $this->bonusGameId,
			'num_picks'     => $numPicks,
			'num_prizes'    => count($numSpins));

		array_push($this->round->bonusGamesWon, $bonusGameData);
		$this->round->nextRound = $bonusGameData;
	}

	private function validatePick($pickedPosition)
	{
		if($pickedPosition !== 1) {
			ErrorHandler::handleError(1, "PICK_0001", "Invalid pick position");
		}
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

	public function calculatePrizes($state, $pickedPosition) {

		$gameData = $this->round->bonusGames['game_data'];

		$this->round->bonusGameRound['num_free_spins'] = $gameData['num_spins'];
		$this->round->bonusGameRound['exp_symbol'] =  $gameData['exp_symbol'];
		$this->round->bonusGameRound['symbols'] =  $gameData['symbols'];

		$this->updateBonusGame($state);
		$details = Array(
						 'id' =>  $gameData['id'],
						 'fs_game_id'=> 2,
						 'min_count' => $gameData['min_count'],
						 'max_count' => $gameData['max_count'],
						 'parent_type' => $gameData['parent_type'],
						 'fs_multiplier' => $gameData['multiplier'],
						 'exp_symbol' => $gameData['exp_symbol'],
						 'bonus_details'=>array(
							'exp_symbol' => $gameData['exp_symbol'],
							'min_count' => $gameData['min_count']
						 )
					 );
		$this->processPrizes($state, $gameData, $details );
		
	}

	private function processPrizes($state, $gameData, $details)
	{
		$numFreeSpins = $gameData['num_spins'];
		$round_id = $this->round->bonusGames['round_id'];
		if (isset($this->round->freeSpins) or isset($details['id'])) {
			$id = $details['id'];
			$roundIds = $gameData['round_ids'];
			$history = $gameData['history'];
			array_push($roundIds, $round_id);
			array_push($history, $numFreeSpins);

			if (isset($this->round->freeSpins)) {
				$id = $this->round->freeSpins['id'];
				$state =0;
			}
			$this->updateFreeSpins( $id,
						$this->game->gameId, $this->accountId,
						$round_id,
						$numFreeSpins, $details['fs_multiplier'],
						$this->round->amountType, $roundIds,
						$history, $details, $state);
			$this->nextRound($details,
						$this->round->freeSpins['num_spins'],
						$this->round->freeSpins['spins_left']);
		}
		else {
			$round_ids = array($round_id);
			$history = array($numFreeSpins);
			$spin_type=2;
			award_freespins($this->game->gameId, $this->game->subGameId,
						$this->accountId, $round_id,
						$numFreeSpins, $details['fs_multiplier'],
						$this->round->coinValue, $this->round->numCoins,
						$this->round->numBetLines, $this->round->amountType,
						$round_ids, $history, $spin_type, $details);
			$this->nextRound($details, $numFreeSpins, $numFreeSpins);
		}
	}
	private function nextRound($details, $numSpins, $spinsLeft)
	{
		$this->round->nextRound= Array(
					'type'       => "freespins",
					'num_spins'  => $numSpins,
					'spins_left' => $spinsLeft,
					'multiplier' => $details['fs_multiplier'],
					'parent_type'=> $details['parent_type']
				);
	}

	public function getBonusConfig($numScatters) {
		global $db;

		$table = "game.bonus_config";
		$query = <<<QUERY
			SELECT configuration
			  FROM $table
			 WHERE game_name = "{$this->game->gameName}" AND
				   bonus_game_id = {$this->bonusGameId} AND
				   spin_type = "{$this->round->spinType}" 
QUERY;
		$rs = $db->runQuery($query) or ErrorHandler::handleError(1, "WELLBONUS_001");
		if($db->numRows($rs) == 0) {
			return Null;
		}

		$row = $db->fetchRow($rs);
		return $row[0];
	}
}

?>