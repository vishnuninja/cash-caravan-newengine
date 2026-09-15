<?php
class WildPayoutHandler extends LineWinsHandler {

	public function __construct(&$game, &$round, $player)
	{
		$this->game 	= $game;
		$this->round 	= $round;
		$this->player 	= $player;
	}

	public function handleLineWins()
	{
		$fsMultiplier = $this->getFsMultiplier();
		if($this->game->left2Right) {
			// echo "numBetLines = ", $this->round->numBetLines;
			// echo "numWinWays = ", $this->round->numWinWays;
			$numBetLines = isset($this->round->numWinWays) ?
			$this->round->numWinWays : $this->round->numBetLines;
			
			// echo "numBetLines = ", $this->round->numBetLines;
			for($i = 0; $i < $numBetLines; $i++) {
				
				$betLine = $this->round->betLines[$i];
				$betLineNumber = $i + 1;
				$bLine = $this->getWildPay($betLine, $betLineNumber);
				$prizeInfo = $this->getMultiplierInfo($bLine);
				$multiplier = $prizeInfo['mult'];
				$numRepeats = $prizeInfo['numRepeats'];
				$wildMultiplr = $prizeInfo['multiplier'];
				$multiplier = $multiplier * $this->round->lineBet;
				if($multiplier > 0) {
					$multiplier *= $fsMultiplier;
					$blinkMatrix = $this->blinkMatrix($numRepeats);
					$this->round->paylineWinAmount += $multiplier;
					$matrixPositions = $this->getMatrixPositsions($betLineNumber, $numRepeats);
					$matrixPositions = implode(",", $matrixPositions);
					array_push($this->round->paylineWins['details'], Array(
						$betLineNumber, $multiplier, $blinkMatrix,
						$numRepeats, 
						$betLine, 
						$matrixPositions));
						
						array_push($this->round->winLineNumbers, 
						Array($betLineNumber, $betLine, $multiplier, $wildMultiplr, $fsMultiplier));
				}
			}
		}
		$extraMultiplierValue = $this->extraMultiplier();
		$this->round->paylineWinAmount *= $extraMultiplierValue;
		$this->round->paylineWins['format']  = array1d_to_string($this->round->paylineWins['format']);
		$this->round->paylineWins['details'] = array2d_to_string($this->round->paylineWins['details'], ':');
		$this->round->winAmount += $this->round->paylineWinAmount;
	}
	// wwabc
	private function getWildPay($betLine, $betLineNumber) {
		$wild = $this->game->wilds[0];
		$wild_payout = $this->game->misc['wild_payout'];
		
		if ($betLine[0] != $wild) {
			return $betLine;
		}

		$subStrings = $this->game->misc['sub_strings'];
		// $wild_payout = $this->game->misc['wild_payout'];
		$scatters = $this->game->scatters;
	    $wildsCount = 1;
		if ($this->str_contains($betLine, $subStrings[0]) or
		 $this->str_contains($betLine, $subStrings[1])) {
			for ($i = 1; $i < $this->game->numColumns; $i++) {
				if (in_array($betLine[$i], $this->game->wilds)) {
					$wildsCount++;
				} elseif(in_array($betLine[$i], $scatters)) {
					break;
				} else {
					$wildsCount = 0;
					break;
				}
			}

			$key = $wildsCount.$wild;
            if(array_key_exists($key, $wild_payout)) {
            	$win = $wild_payout[$key] * $this->round->lineBet;
            	$blinkMatrix = $this->blinkMatrix($wildsCount);
				$this->round->paylineWinAmount += $win;
				$matrixPositions = $this->getMatrixPositsions($betLineNumber, $wildsCount);
				$matrixPositions = implode(",", $matrixPositions);
				array_push($this->round->paylineWins['details'], Array(
					$betLineNumber, $win, $blinkMatrix,
					$wildsCount, $betLine, $matrixPositions));

				array_push($this->round->winLineNumbers, 
					 Array($betLineNumber, $betLine, $win, 1, 1));
			}
		}
		return $betLine;
	}

	#Todo PHP 8 Version has this function lower versions dont have
	function str_contains($haystack, $needle)
    {
        return '' === $needle || false !== strpos($haystack, $needle);
    }

	private function getMatrixPositsions($betLineNumber, $numRepeats)
	{
		$tempPositions = Array();

		for($i = 0; $i < $numRepeats; $i++) {
			array_push($tempPositions, $this->game->paylinesConfig[$betLineNumber-1][$i]);
		}
		return $tempPositions;
	}
}
?>