<?php
class Chess extends LineWinsHandler {

	public function __construct(&$game, &$round, $player)
	{
		$this->game 	= $game;
		$this->round 	= $round;
		$this->player 	= $player;
	}

	public function handleLineWins()
	{
		if($this->game->left2Right) {
			$numBetLines = isset($this->round->numWinWays) ?
				$this->round->numWinWays : $this->round->numBetLines;

			for($i = 0; $i < $numBetLines; $i++) {

				$betLineNumber = $i + 1;

				$betLine = $this->round->betLines[$i];

				$winLine = $this->checkBigOneTwo($betLine);
				$wins = $this->evaluationOfBetLine($winLine);
				if (!$wins) { continue; }

				foreach ($wins as $key => $value) {
					if ($value < 3) { continue; }

					$line  = substr($winLine, $key);
					$prizeInfo = $this->getMultiplierInfo($line);
					$multiplier = $prizeInfo['mult'];
					$numRepeats = $prizeInfo['numRepeats'];
					$wildMultiplr = $prizeInfo['multiplier'];

					$multiplier = $multiplier * $this->round->lineBet;
					if($multiplier > 0) {
						$blinkMatrix = $this->blinksMatrix($key,$numRepeats);
						$matrixPositions = $this->getMatrixPositsions($key,$betLineNumber, $numRepeats);
						$fsMultiplier = $this->getMultiplier($matrixPositions);
						$multiplier *= $fsMultiplier;
						$this->round->paylineWinAmount += $multiplier;
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
		}

		$this->round->paylineWins['format']  = array1d_to_string($this->round->paylineWins['format']);
		$this->round->paylineWins['details'] = array2d_to_string($this->round->paylineWins['details'], ':');
		$this->round->winAmount += $this->round->paylineWinAmount;
	}

	private function getMatrixPositsions($start, $betLineNumber, $numRepeats)
	{
		$tempPositions = Array();

		for($i = $start; $i < ($start+$numRepeats); $i++) {
			array_push($tempPositions, $this->game->paylinesConfig[$betLineNumber-1][$i]);
		}
		return $tempPositions;
	}

	/**
	 * Calculates the blink string for a given line of length NumReels.
	 * The blink_mats are constructed left to right. Built based on length.
	 */
	public function blinksMatrix($key, $repeats) {
		return str_repeat('0', $key).str_repeat('1', $repeats).str_repeat('0', $this->game->numColumns - $repeats - $key);
	}

	public function evaluationOfBetLine($betline)
	{
		$line = $betline;
		$wins_found = 0;
		$heads = array();
		$length = array(0,0,0);
		$wild = $this->game->wilds[0];
		$numColumns = $this->game->numColumns;

		for ($it = 0; $it < 3; $it++)
		{	
			$heads[$it] = $line[$it];
			//win 1
			for ($i = $it; $i < $numColumns; $i++)
			{
				if ($line[$i] == $heads[$it] || $line[$i] == $wild)
				{
					$length[$it]++;
				} else if ($heads[$it] == $wild)
				{
					$heads[$it] = $line[$i];
					$length[$it]++;
				}else
					break;
			}
			if ($heads[$it] == $wild && $length[$it] != $numColumns )
			{
				$length[$it] = 0;
			}
			if ($length[$it] > 2){
				$wins_found++;
			}
		}
		if ( $wins_found > 0) {
			return $this->betLineCheck($heads, $length);
		}
		return $wins_found;
	}

	public function getMultiplier($matrixPos)
	{
		$misc = $this->game->misc;
		$spinType = $this->round->spinType;
		$multiplier = $misc['multiplier'][$spinType];

		$hotspots = $misc['hotspots'];
		$keys = array_keys($multiplier);
		$count = count($keys);
		$temp = 1;
		for ($i=0; $i < $count; $i++) { 
			if (in_array($keys[$i], $matrixPos) and
				$hotspots[$keys[$i]] == "true") {
				$temp *= $multiplier[$keys[$i]];
			}
		} return $temp;
	} 

	public function betLineCheck($heads, $lengths)
	{
		if ($heads[0] == $heads[1]) {
			$lengths[1] = 1;
		}
		if ($heads[1] == $heads[2]) {
			$lengths[2] = 1;
		}
		return $lengths;
	}

	private function checkBigOneTwo($betline)
	{
		if (!$this->str_contains($betline,"a") or 
			!$this->str_contains($betline,"b")) {
			return $betline;
		}
		$line = $betline;
		$wild = $this->game->wilds[0];
		if ($this->str_contains($line, $wild)) {
			$line = str_replace($wild, "", $line);
		}
		if ($this->str_contains($line,"ab") or 
			$this->str_contains($line,"ba")) {

			$betline = str_replace("a", "t", $betline);
			$betline = str_replace("b", "t", $betline);
		}
		return $betline;
	}

	#Todo PHP 8 Version has this function lower versions dont have
	function str_contains($haystack, $needle)
    {
        return '' === $needle || false !== strpos($haystack, $needle);
    }
}
?>