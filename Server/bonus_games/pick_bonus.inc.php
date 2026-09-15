<?php
require_once 'ibonus.inc.php';

class PickBonusGame implements iBonus {
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
		$prizesWon = $this->getPrizesWon($gameData['won_prizes']);

		$this->round->nextRound = Array(
			'bonus_game_id' => $this->round->bonusGames['bonus_game_id'],
			'num_picks' => $this->round->bonusGames['num_picks'],
			'num_prizes' => count($this->round->bonusGames['game_data']['prizes']),
			'prizes_won' => 'Bonus Game',  //$prizesWon,
			'type' => 'bonus_game',
			'pick_positions' => $this->round->bonusGames['picks_data']);
	}

	private function getPrizesWon($prizes) {
		$prizesWon = Array();
		for($i = 0; $i < $this->round->bonusGames['num_user_picks']; $i++)
		{
			array_push($prizesWon, $prizes[$i]);
		}

		return $prizesWon;
	}

	/**
	 * @method fsModeBonusPrizes
	 * This method will handle the bonus rounds triggered in a freespin.
	 * Bonus rounds triggered from the free spins will not be played with pick
	 * feature. Directly freespins will be provided. Here new freespins will be
	 *  added with running freespins.
	 * TODO check how to update num_spins in freespins table.Because  its not working.
	 * */
	public function fsModeBonusPrizes($config) {
		global $db;

		$featureName = $this->round->freeSpins['details']['feature'];
		$index = array_search($featureName, array_values($config['prizes']));
		$numSpins = $config['num_spins'][$index];
		$this->round->freeSpins['spins_left'] += $numSpins;
		$this->round->freeSpins['num_spins'] += $numSpins;
		$fs_id = $this->round->freeSpins['id'];

		$tableName = 'gamelog.freespins';

		if($this->round->amountType == AMOUNT_TYPE_FUN) {
			$tableName = 'gamelog.freespins_fun';
		}

		$update_freespins =<<<QUERY
			UPDATE {$tableName} SET num_spins= num_spins + {$numSpins},
			spins_left = spins_left + {$numSpins} where id={$fs_id}
QUERY;

		$result = $db->runQuery($update_freespins) or ErrorHandler::handleError(1, "PICK_BONUS001");
		$this->setBonusRound($numSpins, $featureName);
	}

	public function checkAndGrantBonusGame() {

		$numScatters = $this->scattersCount['total'];
		$config = $this->getBonusConfig($numScatters);

		if(!$this->isConfigValid($config)) {
			return null;
		}

		$config = decode_object($config);

		// From a respin pick round will be triggered
		// From a freespin pick round will not be triggered.
		if($this->round->freeSpins && isset($this->round->freeSpins['num_spins'])
			&& ($this->round->freeSpins['num_spins'] > 0)
			&& ($this->round->freeSpins['details']['spin_type'] !='respin') ) {

			$this->fsModeBonusPrizes($config);
			return false;
		}

		$numPicks = $config['num_picks'];
		$wonFeatures = Array(); $fsGameIds = Array();

		$bonusGameData = Array(
				'prizes'  => $config['prizes'],
				'won_prizes'=> $wonFeatures,
				'fs_game_id'  => $fsGameIds,
				'num_scatters' => $numScatters,
				'fs_multiplier' => $config['fs_multiplier']);

		$bonusGameData = encode_objects($bonusGameData);
		grant_bonus_game($this->game->gameId, $this->game->subGameId,
						 $this->round->roundId, $this->round->roundId,
						 $this->accountId, $this->bonusGameId,
						 $config['code'], $numPicks, $bonusGameData,
						 1, $this->round->amountType,
						 $this->round->coinValue, $this->round->numCoins,
						 $this->round->numBetLines);

		$bonusGameWon = Array(
					 'bonus_game_id' => $this->bonusGameId,
					 'num_picks' => $numPicks,
					 'num_prizes' => count($config['prizes']),
					 'type' => 'bonus_game');

		array_push($this->round->bonusGamesWon, $bonusGameWon);
	}

	public function playBonusGame($pickedPosition) {
		$pickedPosition = (int)$pickedPosition;
		$this->validatePick($pickedPosition);
		array_push($this->round->bonusGames['picks_data'], $pickedPosition);
		$this->round->bonusGames['num_user_picks']++;
		$state = $this->getState();

		$this->round->bonusGameRound = Array(
							'prize' => 'freespins',
							'prize_value' => '',
							'state' => $state);

		$this->calculatePrizes($state);
	}

	private function processPrizes($state, $numFreeSpins, $gameData, $details)
	{
		if($numFreeSpins <= 0) { // Means no free spin, like total_bet_multiplier.
			return ;
		}
		$round_ids = ''; $history = ''; $spin_type=2;
		$multiplier = $details['fs_multiplier'];

		// Add number of spins and number of spins left in freespins table.
		award_freespins($this->game->gameId, $this->game->subGameId,
						$this->accountId, $this->round->bonusGames['round_id'],
						$numFreeSpins, $multiplier,
						$this->round->coinValue, $this->round->numCoins,
						$this->round->numBetLines, $this->round->amountType,
						$round_ids, $history, $spin_type, $details);
	}

	public function getFsMultiplier($config, $feature) {
		if(isset($config[$feature]['multipliers'])) {
			$multipliers = $config[$feature]['multipliers'];
			$random_index = get_random_number(0, count($multipliers) - 1 );
			$fs_multiplier = $multipliers[$random_index];

			return $fs_multiplier;
		}

		return $config['fs_multiplier'];;
	}

	public function calculatePrizes($state) {
		$gameData = $this->round->bonusGames['game_data'];

		$numScatters = $gameData['num_scatters'];
		$config = $this->getPickBonusConfig($numScatters);

		if(!$this->isConfigValid($config)) {
			return null;
		}

		$config = decode_object($config);
		$wonFeatures = ''; $fsGameIds = '';
		$index = get_weighted_index($config['weights']);
		$wonFeatures = $config['prizes'][$index];
		array_push($this->round->bonusGames['game_data']['won_prizes'], $wonFeatures);
		$fsGameIds = $config['fs_game_id'][$index];
		$numFreeSpins = $config['num_spins'][$index];
		$totalBetMultiplier = $config['total_bet_multiplier'][$index];

		$details['fs_game_id'] = $fsGameIds;
		$details['feature'] = $wonFeatures;
		$details['source'] = $wonFeatures;
		$details['num_free_spins'] = $numFreeSpins;
		$details['total_bet_multiplier'] = $totalBetMultiplier;
		$details['parent_spins_left'] = 0;
		$details['spin_type'] = 'freespin';
		$details['fs_multiplier'] = $this->getFsMultiplier($config, $wonFeatures);

		$this->round->bonusGameRound['prize_value'] = $wonFeatures;
		$this->round->bonusGameRound['num_free_spins'] = $numFreeSpins;
		$this->round->bonusGameRound['total_bet_multiplier'] = $totalBetMultiplier;
		$this->round->bonusGameRound['fs_multiplier'] = $config['fs_multiplier'];

		$this->setNextRound($numFreeSpins, $wonFeatures);

		$this->updateBonusGame($state);

		if($state == 1 or $state == True) {
			$this->processPrizes($state, $numFreeSpins, $gameData, $details);
		}

		if($wonFeatures == 'total_bet_multiplier') {
			$this->round->winAmount += $totalBetMultiplier * $this->round->totalBet;
			$this->round->bonusGameRound['win_amount'] = $this->round->winAmount;
			unset($this->round->bonusGameRound['prize']);
			unset($this->round->bonusGameRound['num_free_spins']);
			unset($this->round->bonusGameRound['fs_multiplier']);
		}
	}

	public function setNextRound($numFreeSpins, $wonFeatures) {
		if($numFreeSpins) {
			$this->round->nextRound['num_spins'] = $numFreeSpins;
			$this->round->nextRound['spins_left'] = $numFreeSpins;
			$this->round->nextRound['type'] = 'freespins';
		}
	}

	public function setBonusRound($numFreeSpins, $wonFeatures) {
		if($numFreeSpins) {
			$bonusGamesWon['num_spins'] = $numFreeSpins;
			$bonusGamesWon['spins_left'] = $numFreeSpins;
			$bonusGamesWon['source'] = $wonFeatures;
			$bonusGamesWon['type'] = 'freespins';
			array_push($this->round->bonusGamesWon, $bonusGamesWon);
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
						$this->round->amountType
					);
	}

	public function getState()
	{
		return ($this->round->bonusGames['num_user_picks'] ==
			$this->round->bonusGames['num_picks']) ? 1 : 0;
	}

	private function validatePick($pickedPosition)
	{
		$prevPicks = $this->round->bonusGames['picks_data'];
		$numPrizes = count($this->round->bonusGames['game_data']['prizes']);

		if(!isset($pickedPosition) or in_array($pickedPosition, $prevPicks) or
			$pickedPosition < 0 or $pickedPosition >= $numPrizes) {
			ErrorHandler::handleError(1, "ROADBONUS_0001", "Invalid pick position");
		}
	}

	private function isConfigValid($config)
	{
		if(empty($config) or $config == Null or !$config) {
			return false;
		}

		return true;
	}

	private function getBonusConfig($numSymbols) {
		global $db;

		$table = "game.bonus_config";
		$query = <<<QUERY
				SELECT configuration
				  FROM $table
				 WHERE game_name = "{$this->game->gameName}" AND
						bonus_game_id = {$this->bonusGameId} AND
						num_symbols = {$numSymbols} AND
						spin_type = "{$this->round->spinType}"
QUERY;
		$rs = $db->runQuery($query) or ErrorHandler::handleError(1, "WELLBONUS_001");
		if($db->numRows($rs) == 0) {
			return Null;
		}

		$row = $db->fetchRow($rs);
		return $row[0];
	}

	private function getPickBonusConfig($numSymbols) {
		global $db;

		$table = "game.bonus_config";
		$query = <<<QUERY
				SELECT configuration
				  FROM $table
				 WHERE game_name = "{$this->game->gameName}" AND
					   bonus_game_id = {$this->bonusGameId} AND
					   num_symbols = {$numSymbols}
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
