<?php
require_once 'ibonus.inc.php';

/**
 * 
 */
class MysteryReplace
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

	public function checkAndGrantBonusGame()
	{
		$featureConfig = $this->game->bonusConfig;
		$postMatrixFeatures = $featureConfig['post_matrix_handlers'][$this->round->spinType];
		$details = $postMatrixFeatures[0]['details'];
		$mysterySym = $details['mystery_symbol'];

		if(in_array($mysterySym, $this->round->matrixFlatten)){

			$symbols = $details['symbols'];
			$reelBoost = $details['reel_boost'];
			$symbolBoost = $details['symbol_boost'];
			$maxCount = $details['max_count'];
			$weights = array_fill(0, count($symbols), 0);

			$mysterySymCount = get_element_count($this->round->matrixFlatten,$mysterySym);
			if($mysterySymCount == $maxCount) {
				$weights = $symbolBoost;
			}
			else {
				for($i = 0; $i <  $this->round->game->numColumns; $i++) {
					for($j = 0; $j < $this->round->game->numRows; $j++) {
						if($this->round->matrix[$j][$i] == $mysterySym) {
							continue;
						}
						$id = array_search($this->round->matrix[$j][$i], $symbols);
						$weights[$id] += $reelBoost[$i] * $symbolBoost[$id];
					}
				}
			}

			$randSymbol = weighted_random_number($weights, $symbols);
			$mysteryPositions = array();
			for($i = 0; $i <  $this->round->game->numColumns; $i++) {
				for($j = 0; $j < $this->round->game->numRows; $j++) {
					if($this->round->matrix[$j][$i] == $mysterySym) {
						$this->round->matrix[$j][$i] = $randSymbol;
						$pos = ($this->round->game->numColumns * $j) + $i;
						array_push($mysteryPositions, $pos);
					}
				}
			}

			$matrix = $this->round->matrix;
			$this->round->postMatrixInfo['matrix'] = $matrix;
			$this->round->postMatrixInfo['feature_name'] = 'mystery_replace';
			$this->round->postMatrixInfo['matrixString'] = array2d_to_string($matrix);
			$this->round->matrixFlatten = $this->round->generateFlatMatrix($matrix);
			$this->round->postMatrixInfo['matrixFlatten'] = $this->round->matrixFlatten;
			$this->round->postMatrixInfo['mystery_config'] =
			array("selected_symbol" => $randSymbol,
			 "mystery_positions" => $mysteryPositions);
		}
		handle_freespins($this->round, $details['details']);
	}
}
?>