<?php
require_once 'ibonus.inc.php';

/**
 * @class 
 * @implements iBonus
 * @desc This class is used for the game Shelby.
 *       Gets called for every spin.
 */

class CollectionSymbol extends BonusPickGame {
	
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

	public function checkAndGrantBonusGame()
	{
		$spinType = $this->round->spinType;
		
		if ($spinType == "freespin") {
			$details = $this->round->freeSpins["details"];

			$sym = $details['bonus_details']['collect_symbol'];
			$count = $details['bonus_details']["collect_count"];
			
			$temp = array_count_values($this->round->matrixFlatten);
			
			if (array_key_exists($sym,$temp)) {
				$count += $temp[$sym];
				$details['bonus_details']["collect_count"] = $count;
			}
			array_push($this->round->bonusGamesWon, $details['bonus_details']);
			$list = $details["count"];
			$values = $details["values"];
			$multiplier = $details['fs_multiplier'];

			for ($i=0; $i < count($list); $i++) {
				if ($list[$i] < $count) {
					$multiplier = $values[$i];
				} else if ($list[$i] == $count) {
					$multiplier = $values[$i];
					break;
				}
			}

			$details['fs_multiplier'] = $multiplier;
			$log = array('multiplier' => $multiplier);
			$this->round->previousRound['misc']['log'] = $log;
			$this->updateFreeSpins($this->round->freeSpins['id'],
						$this->game->gameId, $this->accountId,
						$this->round->freeSpins['base_round_id'],
						0,$multiplier,$this->round->amountType,
						$this->round->freeSpins['round_ids'],
						$this->round->freeSpins['history'],
						$details);
		}
		$featureConfig = $this->game->bonusConfig;
		$postMatrixFeatures = $featureConfig['post_matrix_handlers'][$spinType];
		$details = $postMatrixFeatures[0]['details'];

		$collSym = $details['collection_symbol'];

		if (in_array($collSym, $this->round->matrixFlatten))
		{
			$payTable = $details['payment'];
			$temp = array_count_values($this->round->matrixFlatten);
			$cWin = array();
			foreach ($payTable as $sym => $value) {
				if (array_key_exists($sym,$temp)) {
					if (isset($this->round->freeSpins)) {
						$value = $value * $this->round->freeSpins['multiplier'];
					}
					$win =  $value * $this->round->coinValue;
					$this->round->winAmount += $temp[$sym] * $win;
					$cWin[$sym] = array("win" => $win, 
						"indexes" => $this->getIndexes($sym));
				}
			}
			if ($this->round->winAmount > 0) {
				$cWin["total_win"] = $this->round->winAmount;
				array_push($this->round->bonusGamesWon, $cWin);
			}
		}
	}

	public function getIndexes($symbol)
	{
		$temp = array();
		$matrix = $this->round->matrixFlatten;

		for ($i=0; $i < 20; $i++) { 
			if ($matrix[$i] == $symbol) {
				array_push($temp, $i);
			}
		}
		return $temp;
	}
}
?>