<?php
class Skulls extends LineWinsHandler {

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
			$numBetLines = isset($this->round->numWinWays) ?
				$this->round->numWinWays : $this->round->numBetLines;

			for($i = 0; $i < $numBetLines; $i++) {

				$betLine = $this->round->betLines[$i];
				$betLineNumber = $i + 1;
				$prizeInfo = $this->getMultiplierInfo($betLine);
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
		# todo check this R2L
		# todo TODO for wild Mult and same as above
		if($this->game->right2Left) {
			for($i = 0; $i < $this->round->numBetLines; $i++) {
				$bet_ln = $this->round->betLines[$i];
				$betLine = strrev($bet_ln);
				$betLineNumber = $i + 1;
				$prizeInfo = $this->getMultiplierInfo($betLine);
				$multiplier = $prizeInfo['mult'];
				$numRepeats = $prizeInfo['numRepeats'];
				$wildMultiplr = $prizeInfo['multiplier'];

				$multiplier = $multiplier * $this->round->lineBet;

				if($multiplier > 0 ) {
					$multiplier *= $fsMultiplier;
					$blinkMatrix = strrev($this->blinkMatrix($numRepeats));
					$this->round->paylineWinAmount += $multiplier;
					$matrixPositions = $this->getMatrixPositsionsR2L($betLineNumber, $numRepeats);
					$matrixPositions = implode(",", $matrixPositions);
					array_push($this->round->paylineWins['details'], Array(
						$betLineNumber, $multiplier, $blinkMatrix,
						$numRepeats, $bet_ln, $matrixPositions));
					array_push($this->round->winLineNumbers, 
						Array($betLineNumber, $betLine, $multiplier, $wildMultiplr, $fsMultiplier));
				}
			}
		}

		$this->round->paylineWins['format']  = array1d_to_string($this->round->paylineWins['format']);
		$this->round->paylineWins['details'] = array2d_to_string($this->round->paylineWins['details'], ':');
		$this->round->winAmount += $this->round->paylineWinAmount;
	}

	private function getMatrixPositsions($betLineNumber, $numRepeats)
	{
		$tempPositions = Array();

		for($i = 0; $i < $numRepeats; $i++) {
			array_push($tempPositions, $this->game->paylinesConfig[$betLineNumber-1][$i]);
		}
		return $tempPositions;
	}

	private function getMatrixPositsionsR2L($betLineNumber, $numRepeats)
	{
		$tempPositions = Array();

		for($i = 0; $i < $numRepeats; $i++) {
			$x = $this->game->numColumns-$i;
			array_push($tempPositions, $this->game->paylinesConfig[$betLineNumber-1][$x-1]);
		}
		return $tempPositions;
	}

	function get_Wild_Multiplier($betline,$numRepeats) {

        $bet_line = substr($betline, 0, $numRepeats);
        $symbols = $this->game->misc['multiplier'];
        $wild_count = count(array_intersect (str_split($bet_line),$symbols));
        if($wild_count < 1) return 1;
        return $this->game->misc['rs_multiplier'];
	}
}
?>