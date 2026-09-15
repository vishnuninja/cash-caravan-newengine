<?php
# todo Need to follow proper naming convention
# Need to have proper camelCase method and variable names
# todo Need to optimize this class file
class SymbolWin
{
	public function __construct(&$game, $round, $player)
	{
		$this->game     = $game;
		$this->round    = $round;
		$this->player   = $player;
	}

	public function handleLineWins()
	{
		/**
		 * Array([0]=>Array([a]=>8))
		 */
		$fsMultiplier = $this->getFsMultiplier();
		$scatterMultiplier = $this->getScatterMultiplier();
		$baseBet = $this->changeBet();
		$this->round->scatterWin =  $scatterMultiplier*$baseBet;
		$this->round->winAmount += $scatterMultiplier*$baseBet;
		
		if ($this->game->left2Right) {
			// echo $this->round->numBetLines;
			// print_r($this->round->betLines);
			$numBetLines = $this->round->numBetLines;
			for ($i=0; $i < $numBetLines; $i++) { // a,b,c
				$betLine = $this->round->betLines[$i];
				
				$blast_position = $this->round->blastPosition[$i];
				$prizeInfo = $this->checkWin($betLine);
				//'mult' => $win, 'numRepeats' => $repeat, 'symbol' => $symbol);
				$multiplier = $prizeInfo['mult'];
				$numRepeats = $prizeInfo['numRepeats'];
				$symbol = $prizeInfo['symbol'];

				$multiplier = $multiplier * $baseBet;
				if ($multiplier > 0) {
					// $multiplier *= $fsMultiplier;
					$this->round->paylineWinAmount += $multiplier;
					array_push($this->round->paylineWins['details'], Array(
						$i,$multiplier,"" ,$numRepeats, $symbol, $blast_position));

					array_push($this->round->winLineNumbers,
					Array($multiplier, $numRepeats, $symbol, $blast_position));
					
				}
			}
		}
		// $multiplier = "";
		$mul = 0;
		// $this->round->winAmount += $this->round->paylineWinAmount;
		if($this->round->screenWinAmount > 0 && $this->round->spinType == 'normal'){
			$this->round->paylineWinAmount *= $this->round->screenWinAmount;
		}
		elseif($this->round->spinType ==  'freespin') {
			if (isset($this->round->freeSpins['details']["prograssive_fs"]) and $this->round->freeSpins['details']["prograssive_fs"] == true) {
				$multiplier_collection = false;
				if (isset($this->round->freeSpins['details']["multiplier_collection"]) and $this->round->freeSpins['details']["multiplier_collection"] == true) {
					$multiplier_collection = true;
					
				}
				
				if($this->round->freeSpins['multiplier'] > 1){
					$mul = $this->round->freeSpins['multiplier'];
				}
				if($this->round->screenWinAmount > 1){
					$mul += $this->round->screenWinAmount;
				}elseif($this->round->screenWinAmount == 0 and $this->round->freeSpins['multiplier'] == 1){
					$mul = 1;
				}
				if($multiplier_collection  == true and $this->round->paylineWinAmount >= 0 and $this->round->screenWinAmount == 0 ){
					$mul = 1;
				}
				if($multiplier_collection  == true and $this->round->paylineWinAmount == 0 and $this->round->screenWinAmount > 1 ){
					$mul = 1;
				}
				// if(($this->round->game->gameId == 717 || $this->round->game->gameId == 719) and $this->round->paylineWinAmount >= 0 and $this->round->screenWinAmount == 0 ){
				// 	$mul = 1;
				// }
				// if(($this->round->game->gameId == 717 || $this->round->game->gameId == 719) and $this->round->paylineWinAmount == 0 and $this->round->screenWinAmount > 1 ){
				// 	$mul = 1;
				// }
			}
			else{

				if($this->round->screenWinAmount > 1){
					$mul = $this->round->screenWinAmount;
				}
				else{
					$mul = 1;
				}
				
			}
			
			// echo $mul;
			$this->round->paylineWinAmount *= $mul;
		}
		$this->round->winAmount += $this->round->paylineWinAmount;
		$this->round->paylineWins['format']  = array1d_to_string($this->round->paylineWins['format']);
		$this->round->paylineWins['details'] = array2d_to_string($this->round->paylineWins['details'], ':');
		
	}

	// * Array([a]=>8)

	public function getMultiplierSymbol(){
		$count = get_element_count($this->round->matrixFlatten, "m");
		if($count > 0){
			return $count;
		}
		return 1;
	}

	function changeBet(){
		$featureConfig = $this->game->symbolConfig;
		if (	
			!$featureConfig or !isset($featureConfig['anteBet']) or
			!isset($featureConfig['anteBet'][$this->round->spinType])
			) {
			return $this->round->totalBet;
		}

		$buy_fg_bet = $featureConfig['anteBet'][$this->round->spinType]["ante_bet"]; // 1.4
		$baseBet = $this->round->totalBet / $buy_fg_bet[0];
		return $baseBet;
		}


	public function checkWin($betLine){
		$win = 0;
		$symbol = "";
		$repeat = "";

		
		foreach ($betLine as $key => $value) {
			// echo "key = ", $key,"  ";
			if(!array_key_exists($key, $this->game->payTable)) {
				continue;
			}
			$symbol = $key;
			$repeat = $value;
			$pay_table = $this->game->payTable[$key];

			foreach ($pay_table as $item => $prize) {
				// echo "item = ", $item,"  ";
				if($item  <= $value ){ //8<=9 
					$win += $prize;
					break;
				}
			}
		}
		return Array('mult' => $win, 'numRepeats' => $repeat, 'symbol' => $symbol);
	}

	public function getFsMultiplier() {
		if($this->round->spinType != 'normal' && $this->round->freeSpins['multiplier'] > 1) {
			array_push($this->round->multipliers,
					Array( "type" => "fs_multiplier",
							"value" => $this->round->freeSpins['multiplier']));

			return $this->round->freeSpins['multiplier'];
		}
		return 1;
	}

	public function getScatterMultiplier()
	{
		$mul = 0;
		$scattersCount = 0;
		$symbol = "";
		if ($this->round->spinType == "normal") {
			foreach ($this->game->scatters as $ind => $scatter) {
				$symbol = $scatter;
				$count = get_element_count($this->round->matrixFlatten, $scatter);
				// $scattersCount[$scatter] = $count;
				$scattersCount += $count;
			}
			$win_details  = $this->game->payTable[$scatter];
			foreach ($win_details as $key => $value) {
				if($key  <= $scattersCount ){
					$mul = $value;
					return $mul;
				}
			}
		}
		return $mul;
	}

}
?>
