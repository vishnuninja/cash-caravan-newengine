<?php
class LineWinsHandler {
	var $game, $round, $player;

	public function __construct(&$game, &$round, $player)
	{
		$this->game     = $game;
		$this->round    = $round;
		$this->player   = $player;
	}

	public function calculatePaylineWins()
	{
		$fsMultiplier = $this->getFsMultiplier();
		$scatterMultiplier = $this->getScatterMultiplier();
		$this->round->scatterWin =  $scatterMultiplier*$this->round->totalBet;
		$this->round->winAmount += $scatterMultiplier*$this->round->totalBet;
		if($this->game->left2Right) {
			
			$numBetLines = isset($this->round->numWinWays) ?
				$this->round->numWinWays : $this->round->numBetLines;
			for($i = 0; $i < $numBetLines; $i++) {
				$betLine = $this->round->betLines[$i];

				$betLineNumber = $i + 1;
				$val = $this->checkSpecialSymbolWildKatana($betLine);
				if(!$val){
					$prizeInfo = $this->getMultiplierInfo($betLine,$betLineNumber);
					$multiplier = $prizeInfo['mult'];
					$numRepeats = $prizeInfo['numRepeats'];
					$wildMultiplr = $prizeInfo['multiplier'];
					

					if($this->game->unitySymbols) {
						$uBetline   = $this->unitizeSymbols($betLine);
						$uPrizeInfo = $this->getMultiplierInfo($uBetline, $betLineNumber);
						if($uPrizeInfo['mult'] > $multiplier) {
							$this->handleUnitySymbols($betLineNumber);
							$multiplier = $uPrizeInfo['mult'];
							$numRepeats = $uPrizeInfo['numRepeats'];
						}
					}

					$multiplier = $multiplier * $this->round->lineBet;
					if($multiplier > 0) {
						$multiplier *= $fsMultiplier;
						$blinkMatrix = $this->blinkMatrix($numRepeats);
						$this->round->paylineWinAmount += $multiplier;
						$matrixPositions = $this->getMatrixPositsions($betLineNumber, $numRepeats);
						$matrixPositions = implode(",", $matrixPositions);
						array_push($this->round->paylineWins['details'], Array(
							$betLineNumber, $multiplier, $blinkMatrix,
							$numRepeats, $betLine, $matrixPositions));

						array_push($this->round->winLineNumbers,
						Array($betLineNumber, $multiplier, $betLine, $matrixPositions, $wildMultiplr, $fsMultiplier));
					}
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
				$prizeInfo = $this->getMultiplierInfo($betLine, $betLineNumber);
				$multiplier = $prizeInfo['mult'];
				$numRepeats = $prizeInfo['numRepeats'];
				$wildMultiplr = $prizeInfo['multiplier'];

				if($this->game->unitySymbols) {
					$uBetline   = $this->unitizeSymbols($betLine);
					$uPrizeInfo = $this->getMultiplierInfo($uBetline, $betLineNumber);
					if($uPrizeInfo['mult'] > $multiplier) {
						$this->handleUnitySymbols($betLineNumber);
						$multiplier = $uPrizeInfo['mult'];
						$numRepeats = $uPrizeInfo['numRepeats'];
					}
				}
				$multiplier = $multiplier * $this->round->lineBet;

				if($multiplier > 0 && $numRepeats < $this->game->numColumns ) {
					$multiplier *= $fsMultiplier;
					$blinkMatrix = strrev($this->blinkMatrix($numRepeats));
					$this->round->paylineWinAmount += $multiplier;
					$matrixPositions = $this->getMatrixPositsionsR2L($betLineNumber, $numRepeats);
					$matrixPositions = implode(",", $matrixPositions);
					array_push($this->round->paylineWins['details'], Array(
						$betLineNumber, $multiplier, $blinkMatrix,
						$numRepeats, $bet_ln, $matrixPositions));
					array_push($this->round->winLineNumbers,
						Array($betLineNumber, $multiplier, $betLine, $matrixPositions, $wildMultiplr, $fsMultiplier));
				}
			}
		}
		$extraMultiplierValue = $this->extraMultiplier();
		$this->round->paylineWinAmount *= $extraMultiplierValue;
		$this->round->paylineWins['format']  = array1d_to_string($this->round->paylineWins['format']);
		$this->round->paylineWins['details'] = array2d_to_string($this->round->paylineWins['details'], ':');
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
	public function extraMultiplier() {
		// "random_multiplier": true
		$random_multiplier = 1;
		if($this->round->spinType == 'normal' and isset($this->game->misc['random_multiplier'])and isset($this->game->misc['random_multiplier']) == true){
			
			$filtered_numbers = array_filter($this->round->screenWins, function($value) {
				return $value != 0;
			});
			// Calculate the product of the filtered array
			$random_multiplier = array_product($filtered_numbers);
			
		}
		
		elseif($this->round->spinType == 'freespin' and isset($this->game->misc['random_multiplier'])and isset($this->game->misc['random_multiplier']) == true){
			
		}

		return $random_multiplier;
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
			if ($scattersCount >= 2) {
				$mul = $this->game->payTable[$scattersCount . $symbol];
			}
		}
		return $mul;
	}
	function handleUnitySymbols($betLineNumber) {
		$this->round->unityFeature['type'] = 'unity_feature';
		$this->round->unityFeature['betline_numbers'][] = $betLineNumber;
	}

	function unitizeSymbols($betline) {
		foreach($this->game->unitySymbols as $unitySymbol => $unitySymbols)
			$betline = str_replace($unitySymbols, $unitySymbol, $betline);

		return $betline;
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

		for($i = $this->game->numColumns; $i >= $numRepeats; $i--) {
			array_push($tempPositions, $this->game->paylinesConfig[$betLineNumber-1][$i-1]);
		}
		return $tempPositions;
	}
	/**
	 *
	 * @desc Calculates the multiplier value for given betline
	 *       Encodes betLine and gets corresponding value from paytable.
	 *       Handles highest win amount per line incase of wild's presence
	 */
	# todo need to change name of handleWins()
	function handleWins($betLine,$betLineNumber = "") {
		# Wilds act as replacement for other characters
		# todo need to change the name handleOak()

		$symbolsW = $this->handleOak($betLine, $this->game->wilds);
		
		# Wilds is part of winning line combination
		$prizeInfo = $this->getWinInfo($symbolsW, $betLine, $betLineNumber);
		$multW = $prizeInfo['mult'];
		$r1 = $prizeInfo['numRepeats'];
		$multipler = $prizeInfo['multiplier'];

		# Wilds as just other regular characters
		$symbols = $this->handleOak($betLine, []);
		# Wilds is not part of winning line combination
		$prizeInfo = $this->getWinInfo($symbols, $betLine, $betLineNumber);
		$mult = $prizeInfo['mult'];
		$r2 = $prizeInfo['numRepeats'];
		$multipler1 = $prizeInfo['multiplier'];

		// return the max of the two as the winning combo
		if($multW >= $mult) {
			$repeats = $r1;
			$finalMult = $multW;
		}
		else {
			$repeats = $r2;
			$finalMult = $mult;
			$multipler = $multipler1;
		}

		return Array('mult' => $finalMult, 'numRepeats' => $repeats, 'multiplier' => $multipler);
	}
	/**
	 * todo change the function name and comments
	 * @fun getWinInfo($line)
	 * @desc Calculate the prize of the rle'd line using the g_paytable
	 * @arg1 array of characters with their occurrence.
	 * @arg2 count of the symbol getting selected.
	 * @arg3 symbol which will finally selected.
	 */
	 # todo change the following function body
	function getWinInfo($symbols, $betline, $betLineNumber= "") {
		$maxValue = 0; $payTable = 0; $repeats = 0; $wildMultiplier =1;
		foreach($symbols as $sym => $details)
		{
			$occurrence = $details['count'];
			$isWild = $details['with_wild'];
			$key = $occurrence.$sym;
			if(!array_key_exists($key, $this->game->payTable)) {
				continue;
			}
			
			$spin_type = $this->round->spinType;
			if(isset($this->game->misc['wild_multiplier_handler'][$spin_type])) {
				
				$wildMultiplier = $this->getWildMultiplier($betline, $occurrence,$betLineNumber );
				$payTable = $this->game->payTable[$key] * $wildMultiplier;
			}
			else if($this->round->wildMultiplier > 0 ) {
				$wildMultiplier = $this->getWildMultiplier($betline, $occurrence, $betLineNumber);
				$payTable = $this->game->payTable[$key] * $wildMultiplier; # todo here wildMultiplier
			}
			else if(!in_array($sym, $this->game->wilds) and $isWild) {
				$wildMultiplier = $this->getWildMultiplier($betline, $occurrence, $betLineNumber );
				$payTable = $this->game->payTable[$key] * $wildMultiplier; # todo here wildMultiplier
			}
			else {
				$payTable = $this->game->payTable[$key];
			}

			# todo Look at following if block in future if it creates issue
			#if($payTable > $maxValue or ($payTable == $maxValue and !in_array($sym, $wild[$sym])))
			if($payTable > $maxValue)
			{
				$maxValue = $payTable;
				$repeats = $occurrence;
			}
		}

		return Array('mult' => $maxValue, 'numRepeats' => $repeats, 'multiplier' => $wildMultiplier);
	}

	public function getWildMultiplier($betline, $occurrence, $betLineNumber = "")
	{
		$featureConfig = $this->game->bonusConfig;
		if($featureConfig and isset($featureConfig['expected_multiplier']) and
		isset($featureConfig['expected_multiplier'][$this->round->spinType])){
			return $this->get_Wild_Multiplier($betline, $occurrence);
		}
		
		$spin_type = $this->round->spinType;
		$wild_config = isset($this->game->misc['wild_multiplier_handler'][$spin_type]) ?
		$this->game->misc['wild_multiplier_handler'][$spin_type] : false;
		
		if($wild_config) {
			return $this->generateWildMultiplier($wild_config, $betline, $betLineNumber);
		}
		
		if($this->round->wildMultiplier > 0) {
			return $this->round->wildMultiplier;
		}
		# todo make it dynamic (factory pattern works?)
		return $this->game->wildMultiplier;
	}

	/*
	 * @fun generateWildMultiplier
	 * To generate the random wild multiplier.
	*/
	public function generateWildMultiplier($wild_config, $betline, $betLineNumber= "") {
		$betline_array = str_split($betline);
		$wild_on_betline = false;
		foreach($this->game->wilds as $wild_sym) {
			
			if(in_array($wild_sym, $betline_array)) {
				$wild_on_betline = true;
				break ;
			}
		}

		if(isset($wild_config['bonus_game_id']) && $wild_config['bonus_game_id'] > 0
		&& ($wild_on_betline) ) {

			$bonus_game_id = $wild_config['bonus_game_id'];
			$factory_object = new BonusFactory($this->game, $this->round);
			$bonusObject = $factory_object->getObjectFromId($bonus_game_id,$betLineNumber);
			if($bonusObject != null and !empty($bonusObject)) {
				return $bonusObject->checkAndGrantBonusGame($betline);
			}
		}

		return $this->game->wildMultiplier;
	}

# For All Games
	function get_Wild_Multiplier($betline,$numRepeats) {

		$featureConfig = $this->game->bonusConfig;

		$bet_line = substr($betline, 0, $numRepeats);
		$wild_count = count(array_intersect (str_split($bet_line),$this->game->wilds));

		if($wild_count < 1) return 1;
		$multiplir_info= Array("type"=>"multiplier",
			"value"=>$featureConfig['expected_multiplier'][$this->round->spinType][$wild_count]);
		array_push($this->round->multipliers, $multiplir_info);
		$this->round->multipliers = array_unique($this->round->multipliers, SORT_REGULAR);
		return $featureConfig['expected_multiplier'][$this->round->spinType][$wild_count];
	}

	/**
	 * Checks if the current character can be replaced by wild character
	 * Note: All are replacable except bonus and scatter characters
	 */
	function isWildable($char) {
		if(isset($this->game->misc) &&
			isset($this->game->misc['wild_scatter_same'])) {
			return $this->game->misc['wild_scatter_same'];
		}
		else if(in_array($char, $this->game->bonus)
			or in_array($char, $this->game->scatters)) {
			return false;
		}
		else
			return true;
	}

	/**
	 * @desc It is core of the game engine.
	 *       It counts the first consecutive repeating characters.
	 *
	 * @example
	 *      With wild consideration
	 *          handleOak('wwwwa', array('w')) -> array( 'a' => 5)
	 *          handleOak('wwwww', array('w')) -> array( 'w' => 5)
	 *          handleOak('aaawa', array('w')) -> array( 'a' => 5)
	 *          handleOak('wxyaa', array('w', 'x', 'y')) ->
	 *               array( 'w' => 3, 'x' => 3, 'y' => 3, 'a' =>5)
	 *
	 *      Without wild consideration
	 *          handleOak('aaawa',  '') -> 3awa
	 *          handleOak('aawaa',  '') -> 2awaa
	 */
	function handleOak($betLine, $wilds) {
		# consecutive count from left to right
		$sequentialCount = 1;

		# first character of the betline # todo change $firstChar to $prevChar
		$firstChar   = $betLine[0];

		# Contains multiple wild characters and one non wild character
		$symbols = array();

		# Wilds count till first non wild character
		$wildsCount = 0;

		# It is true as long as wild appear continuously from left
		# Becomes false once non wild characater is encountered
		$isWildCotinued = 0;

		# Checks if wild is part of win line combination
		$isWildPresent = 0;

		# Checks if first char is wild. If yes, need to count wilds
		if(in_array($firstChar, $wilds))
		{
			$symbols[$firstChar] = 1; $wildsCount = 1;
			$isWildCotinued = 1; $isWildPresent = 1;
		}

		# Count first repeating characaters till the character is
		# not first character or wild
		$betLineLength = strlen($betLine);
		for($i = 1; $i < $betLineLength; $i++) {
			$currentChar = $betLine[$i];

			# If first character is wild, we keep counting wilds till non wild
			# character is encountered.
			if($isWildCotinued and in_array($currentChar, $wilds))
			{
				$symbols[$currentChar] = 1;
				$wildsCount++;
			}
			else
				$isWildCotinued = 0;

			if(in_array($currentChar, $wilds)) {
				$isWildPresent = 1;
			}

			# Mark the current non wild char as the first one if first one is wild
			# @example waabc is aaabc
			if(in_array($firstChar, $wilds) and !in_array($currentChar, $wilds) and
				 $this->isWildable($currentChar)) {
				$firstChar = $currentChar;
				$sequentialCount += 1;
			}
			# Increment count if currentChar is same as either first one or wild
			# @example: aaa -> 3
			else if((in_array($currentChar, $wilds) or $currentChar == $firstChar) and
					$this->isWildable($firstChar)) {
				$sequentialCount += 1;
			}
			# Break it, if current element is not same as previous one
			else {
				break;
			}
		}

		# Assign all the wild characters occurred before first non wild character
		# with total count of wilds
		foreach($symbols as $key => $value)
		{
			$symbols[$key] =  array();
			$symbols[$key]['count'] = $wildsCount;
			$symbols[$key]['with_wild'] = 0;
		}

		# assigning the first symbol if it is not wild.
		if(!in_array($firstChar, $wilds))
		{
			$symbols[$firstChar] =  array();
			$symbols[$firstChar]['count'] = $sequentialCount;
			$symbols[$firstChar]['with_wild'] = $isWildPresent;
		}
		return $symbols;
	}

	# todo rename and change func body
	/**
	 * Calculates the blink string for a given line of length NumReels.
	 * The blink_mats are constructed left to right. Built based on length.
	 */
	function blinkMatrix($repeats) {
		return str_repeat('1', $repeats).str_repeat('0', $this->game->numColumns - $repeats);
	}

	public function getMultiplierInfo($betLine, $betLineNumber = "")
	{
		# todo need to change name of handleWins()
		// $wildFlag = $this->checkSpecialSymbolWildKatana($betLine);
		return $this->handleWins($betLine, $betLineNumber);
	}

	public function checkSpecialSymbolWildKatana($betLine){
		if($this->round->spinType == "freespin" && $this->game->gameName == "katanaWarriors" && isset($this->round->freeSpins) && isset($this->round->freeSpins['details']) && array_key_exists('random_symbol',$this->round->freeSpins['details'])){
			$firstChar   = $betLine[0];
			$count = 0;
			
			if($this->round->freeSpins['details']['random_symbol'] == $firstChar )
			{
				return true;
			}
		}
		else{
			return false;
		}
	}
}
?>
  