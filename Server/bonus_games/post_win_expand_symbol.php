<?php
require_once 'ibonus.inc.php';

/**
 * @class PostExpandWin
 * @desc This class is used for the game GoldFish.
 */

class PostExpandWin extends PostWinHandler{

	/**
	 * @func
	 * @desc
	 */
	public function checkAndGrantBonusGame()
	{
		if(!isset($this->round->freeSpins)) {
			return;
		}

		$details = $this->round->freeSpins['details'];
		$expSym = $details['exp_symbol'];
		$minCount = $details['min_count'];
		$maxCount = $details['max_count'];
		$this->setFreeSpinState($maxCount); // Need to update on staging TODO
		$symCount = get_element_count($this->round->matrixFlatten, $expSym);

		if($symCount < $minCount ) {
			return;
		}
		$key = $symCount.''.$expSym;
		$winAmount = $this->game->payTable[$key] * $this->round->totalBet;
		$this->round->winAmount += $winAmount;

		$this->handleExpandingSymbol($details);
		$this->generateBetLines($winAmount, $expSym, $symCount);
	}

	private function handleExpandingSymbol($details)
	{
		$expanding_symbol = $details['exp_symbol'];

		$flipped_matrix = flip_2d_array($this->round->matrix);

		for($i = 0; $i < $this->game->numColumns; $i++) {
			if(!in_array($expanding_symbol, $flipped_matrix[$i])) {
				continue;
			}

			for($j = 0; $j < count($flipped_matrix[$i]); $j++) {
				$flipped_matrix[$i][$j] = $expanding_symbol;
			}

			$flipped_matrix[$i] = array_fill(0, count($flipped_matrix[$i]), $expanding_symbol);
		}

		$matrix = flip_2d_array($flipped_matrix);
		$this->round->postMatrixInfo['matrix'] = $matrix;
		$this->round->postMatrixInfo['feature_name'] = 'spawning_wild';
		$this->round->postMatrixInfo['matrixString'] = array2d_to_string($matrix);
		$this->round->postMatrixInfo['matrixFlatten'] = $this->round->generateFlatMatrix($matrix);
	}

	private function generateBetLines($winAmount, $expSym, $symCount)
	{
		global $paylines_config;

		if(isset($this->game->misc) && isset($this->game->misc['paylines_key'])) {
			$paylinesKey = $this->game->misc['paylines_key'];
		}
		else {
			$paylinesKey = $this->game->paylines."_".$this->game->numRows.'x'.
			$this->game->numColumns;
		}

		# @ todo need to get the payline key from db Config.
		if(!isset($paylines_config[$paylinesKey])) {
			ErrorHandler::handleError(1, "ROUND_PAYLINES_NOT_FOUND_0001");
		}
		# @  todo Need to change this paylines to paylines factory
		$payLines = $paylines_config[$paylinesKey];
		$lineWin = $winAmount/$this->round->numBetLines;
		$paylineDetails = array();
		$expPositions = array();

		# Generate only the betlines for what the player has bet on
		for($i = 0; $i < $this->round->numBetLines; ++$i) {
			$gameBetLine  = $payLines[$i];
			$blink = '';
			$roundBetLine = '';
			$matrixPositions = array();

			$fMatrix = $this->round->getFlattenMatrix();

			for($j = 0; $j < $this->game->numColumns; $j++) {
				$symbol = $fMatrix[$gameBetLine[$j]];
				$roundBetLine .= $symbol;
				if($symbol === $expSym) {
					$blink .= 1;
					array_push($matrixPositions, $gameBetLine[$j]);
					#array_push($expPositions, $gameBetLine[$j]);
				}
				else {
					$blink .= 0;
				}
			}
			$positions = implode(",", $matrixPositions);
			array_push($paylineDetails, Array(
					$i+1, $lineWin, $blink,$symCount,$roundBetLine,
					$positions));
		}
		$fMatrix = $this->round->getFlattenMatrix();
		foreach($fMatrix as $key => $value)
		{
			if ($value === $expSym) {
				array_push($expPositions, $key);
			}
		}
		$this->round->winLineNumbers = array_merge($this->round->winLineNumbers,$paylineDetails);
		$this->round->postMatrixInfo['exp_symbol'] = $expSym;
		$this->round->postMatrixInfo['expand_positions'] = array_unique($expPositions);
		$this->round->postMatrixInfo['payline_details'] = array2d_to_string($paylineDetails, ':');
		$this->round->postMatrixInfo['exp_amount'] = $winAmount;
	}

	private function setFreeSpinState($maxCount)
	{
		if($this->round->freeSpins['spins_left'] == 1 &&
			!isset($this->game->misc['fs_state']))
		{
			$arr = array_count_values($this->round->matrixFlatten);
			$sym = $this->game->scatters[0];
			if (!array_key_exists($sym,$arr) or $arr[$sym] < $maxCount) {
				$this->round->freespinState = 1;
			}
		}
	}
}
?>
