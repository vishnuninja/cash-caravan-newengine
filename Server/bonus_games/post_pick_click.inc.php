<?php
require_once 'ibonus.inc.php';

class PickAndClick extends BonusPickGame
{
	protected $game;
	protected $round;
	protected $accountId;
	protected $symbol;
	protected $bonusGameId;
	protected $scattersCount;

	public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount)
	{
		$this->game = $game;
		$this->round = &$round;
		$this->accountId = $accountId;
		$this->symbol = $symbol;
		$this->bonusGameId = $bonusGameId;
		$scattersCount['total'] = isset($scattersCount[$symbol]) ?  $scattersCount[$symbol] : null;
		$this->scattersCount = $scattersCount;
	}

	public function loadBonusGame() {
		$gameData = $this->round->bonusGames['game_data'];

		$this->round->nextRound = Array(
			'type' => 'bonus_game',
			'num_picks' => $this->getRemainingPicks(),
			'pick_positions' => $this->round->bonusGames['picks_data'],
			'bonus_game_id' => $this->round->bonusGames['bonus_game_id'],
			'num_prizes' => $this->round->bonusGames['game_data']['num_prizes'],
			'parent_type' => $this->round->bonusGames['game_data']['parent_type'],
			'pick_prizes' => $this->round->bonusGames['game_data']['pick_prizes'],
			'pick_details' => $this->round->bonusGames['game_data']['pick_details'],
			'prize_indexes' => $this->round->bonusGames['game_data']['prize_indexes']
		);
	}

	private function getRemainingPicks() {
		return $this->round->bonusGames['num_picks'] -
			$this->round->bonusGames['num_user_picks'];
	}

	public function checkAndGrantBonusGame()
	{
		$numScatters = $this->scattersCount['total'];
		$config = $this->getBonusConfig($numScatters, $this->round->spinType);

		if(!$this->isConfigValid($config)) {
			return null;
		}
		$config = decode_object($config);
		$symbols = $config['bonus_symbols'];

		$categery = $config['categery'];
		$weights = $config['weights'];
		$feature = weighted_random_number($weights,$categery);

		if ($feature === "pick_click") {
			$pick_click = $config['pick_click'];
			
			$rndMax = $pick_click['rnd_max'][$this->round->numCoins];
			$value = $pick_click['value'][$this->round->numCoins];
			$prizes = $value;

			$keys = array_keys($value);
			$temp = $indexes = array();
			$bool = true;
			while ($bool) {
				$rnd = get_random_number(0,$rndMax);
				if ($value[$rnd] === 0) {
					$bool = false;
				}
				array_push($indexes, $keys[$rnd]);
				array_push($temp, $value[$rnd]);
				array_splice($value,$rnd,1);
				array_splice($keys,$rnd,1);
				if (count($value) <= $rndMax) {
					$rndMax = count($value)-1;
				}
			}

			$rnd = get_random_number(0,count($symbols)-1);
			$car = $symbols[$rnd];
			$numPicks = count($temp);
			$numPrizes = $pick_click['num_prizes'];
			$multiplier = $pick_click['multiplier'];
			$featureDetails = array('prize' => $car, 'total_prizes' => $prizes);
			$bonusGameData = Array(
					'parent_type' => "normal",
					'num_picks' => $numPicks,
					'num_prizes' => $numPrizes,
					'pick_details' => array(),
					'pick_prizes' => array(),
					'prize_indexes' => array(),
					'multiplier' => $multiplier,
					'prizes' => $temp,
					'indexes' => $indexes,
					'feature_details' => $featureDetails);
			$bonusGameData = encode_objects($bonusGameData);

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
						'num_prizes' => $numPrizes,
						'prize_value' => $car,
						'total_prizes' => $prizes);

			array_push($this->round->bonusGamesWon, $bonusGameWon);
			$this->round->nextRound = $bonusGameWon;
		} else {
			$details = $config['freespin'];
			$weights = $config['bonus_weights'];

			$numSpins = $details['num_spins'];
			$multiplier = $details['fs_multiplier'];			
			$collectSym = weighted_random_number($weights,$symbols);

			$details['values'] = $details['values'][$this->round->numCoins];
			$details['bonus_details'] = array('collect_symbol' => $collectSym,
				'collect_count' => 0,"mult_table" => $details['values']);
			$details['fs_game_id'] = $details['fs_game_id'][$this->round->numCoins];
			$spinType = $details['fs_game_id'];  

			award_freespins($this->game->gameId, $this->game->subGameId, 
				$this->accountId, $this->round->roundId, $numSpins, $multiplier, 
				$this->round->coinValue, $this->round->numCoins, $this->round->numBetLines,
				$this->round->amountType, Array($this->round->roundId), 
				Array($numSpins), $spinType, $details);

			$freeSpinsInfo = array('type' => 'freespins', 'num_spins' => $numSpins,
				'spins_left' => $numSpins, 'win_amount' => 0, 'parent_type' => 'normal',
				'collect_symbol' => $collectSym,"mult_table" => $details['values']);

			array_push($this->round->bonusGamesWon, $freeSpinsInfo);
			$this->round->nextRound = $freeSpinsInfo;

		}
	}

	public function calculatePrizes($state, $pickedPosition)
	{
		$gameData = $this->round->bonusGames['game_data'];

		$prize_indexes = $gameData['indexes'];
		$num_picks = $gameData['num_picks'];
		$prizes = $gameData['prizes'];

		$index = $this->round->bonusGames['num_user_picks'];
		$prize = $prizes[$index -1];
		$prizeIndex = $prize_indexes[$index -1];
		$winAmount = $prize * $this->round->bonusGames['coin_value'];

		array_push($this->round->bonusGames['game_data']['prize_indexes'], $prizeIndex);
		array_push($this->round->bonusGames['game_data']['pick_details'], $winAmount);
		array_push($this->round->bonusGames['game_data']['pick_prizes'], $prize);

		$this->round->bonusGameRound['prize_value'] = $prize;
		$this->round->bonusGameRound['win_amount'] = $winAmount;
		$this->round->bonusGameRound['prize_index'] = $prizeIndex;
		$winAmount += to_coin_currency($this->round->bonusGames['win_amount']);

		if($state === 1) {
			$this->round->bonusGameRound['total_win_amount'] = $winAmount;
			$this->round->winLineNumbers = array();
			$this->round->winAmount += $winAmount;
			array_push($this->round->winLineNumbers, 
					Array("pick_click", $this->round->winAmount));
		}

		$winAmount = to_base_currency($winAmount);
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
}
?>