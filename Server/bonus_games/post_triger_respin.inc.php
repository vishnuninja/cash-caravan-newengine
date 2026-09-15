<?php 
require_once 'ibonus.inc.php';
/**
 * 
 */
class ReSpinTriger
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

	public function awardRespin($details)
	{
		$spinType = $details['type_spin'];
		$num_respins = $details['num_spins'];
		$multiplier = $details['fs_multiplier'];
		$rsCount = $details["respin_count"];

		award_freespins($this->game->gameId, $this->game->subGameId,
						$this->round->player->accountId, $this->round->roundId,
						$num_respins, $multiplier, $this->round->coinValue,
						$this->round->numCoins, $this->round->numBetLines,
						$this->round->amountType,"","",$spinType, $details);
		$this->round->nextRound = array("type" => "respins",
										"num_spins" => $num_respins,
										"spins_left" => $num_respins,
										"multiplier" => $multiplier,
										"respin_count" => $rsCount);
	}

	public function checkAndGrantBonusGame()
	{
		if (isset($this->round->freeSpins)) {
			$this->playReSpin();
		}else{
			if ($this->round->winAmount <= 0) {
				return;
			}
			$featureConfig = $this->game->bonusConfig;
			$spinType = $this->round->spinType;
			$postWinFeatures = $featureConfig['post_win_handlers'][$spinType];
			$details = $postWinFeatures[0]['details'];

			$this->awardRespin($details);
		}
	}

	public function playReSpin()
	{
		$dtls = $this->round->freeSpins["details"];

		$reSpinCount = ++$dtls['bonus_details']['respin_count'];
		if ($reSpinCount == $dtls['limit']) {
			$dtls['fs_game_id'] = $dtls['limit'];
		}
		/*=============Feature Selection==============*/
		$feature = "";
		$count = count($dtls["features"]);
		if ($count > 0) {
			$index = get_random_number(0, $count-1);
			$feature = $dtls["features"][$index];
			unset($dtls["features"][$index]);
			$dtls["features"] = array_values($dtls["features"]);
		}
		/*=============Feature Storing==============*/
		$symbols = $dtls["symbols"];

		if ($feature && array_key_exists($feature[0], $symbols)) {
			array_push($symbols[$feature[0]], $feature);
		}else if($feature && !array_key_exists($feature[0], $symbols)) {
			$symbols[$feature[0]] = array($feature);
		}
		/*============Feature's Application=================*/
		$paylineWins = $this->round->paylineWins['details'];
		$matrixes = array();
		$palineDetails = $this->round->paylineWins;
		$matrix = $this->round->matrixString;
		$intialWin = $this->round->paylineWinAmount;

		foreach ($symbols as $sym => $value) {
			$this->round->generateMatrix();
			$temp = array();
			for ($i=0; $i < count($value) ; $i++) { 
				if ($value[$i] == $sym."_S") {
					list($matrix, $swapPos)= $this->swapFeatures($sym);
					$temp["matrix"] = $matrix;
					$temp["swap_pos"] = $swapPos;
				}
				if ($value[$i] == $sym."_W") {
					$temp["wild"] = $this->wildFeatures($sym);
				}
				if ($value[$i] == $sym."_M") {
					$temp["multiplier"] = $this->mtplrFeatures($sym);
				}
			}
			$this->round->betLines = array();
			$this->round->generateBetLines();
			$this->round->paylineWins = $this->getPaylineWinsFormat();
			$this->round->paylineWinAmount =0;
			$this->round->calculatePaylineWins();
			$this->game->wilds = array();
			$this->game->misc['multiplier'] = array();
			$temp['payline_details'] = $this->round->paylineWins;
			$temp['win_amount'] = $this->round->paylineWinAmount;
			$matrixes[$sym] = $temp;

		}
		ksort($matrixes);
		$this->round->paylineWinAmount = $intialWin;
		$this->round->paylineWins = $palineDetails;
		$this->round->postMatrixInfo['feature_name'] = "respin_play";
		$this->round->postMatrixInfo['matrixString'] = $this->round->matrixString;
		$this->round->postMatrixInfo['matrix_info'] = $matrixes;

		$log = array(
			'initial_win' => array("payline_win" => $intialWin),
			'feature_win' => $matrixes);

		$this->round->previousRound['misc']['log'] = $log;

		$dtls["symbols"] =  $symbols;
		$dtls['bonus_details']["new_feature"] = $feature;

		$this->round->bonusGamesWon = $dtls['bonus_details'];
		if (isset($feature) && $feature != "") {
			array_push($dtls['bonus_details']["picked_feature"], $feature);
		}

		$this->closeRespin($dtls);
		if ($this->round->winAmount > 0) {
			$this->awardRespins($dtls);
		}
	}

	public function swapFeatures($sym)
	{
		if (in_array($sym, $this->round->matrixFlatten))
		{
			$bool = false;
			$strMatrix = $this->round->matrixString;
			$arrMatrix = explode(";",$strMatrix);
			$n = count($arrMatrix);
			
			for ($i=0; $i < $n; $i++) 
			{ 
				$row = $arrMatrix[$i];
				if (preg_match("/".$sym."...".$sym."/i",$row)) { #E---E
					$bool = true;
					$arrMatrix[$i] = $sym.$sym.$sym.$sym.$sym;
				}elseif (preg_match('/.'.$sym.'..'.$sym.'/i',$row)) {#-E--E
					$bool = true;
					$arrMatrix[$i] = $row[0].$sym.$sym.$sym.$sym;
				}elseif (preg_match('/'.$sym.'..'.$sym.'./i',$row)) {#E--E-
					$bool = true;
					$arrMatrix[$i] = $sym.$sym.$sym.$sym.$row[$n+1];
				}elseif (preg_match('/'.$sym.'.'.$sym.'../i',$row)) {#E-E--
					$bool = true;
					$arrMatrix[$i] = $sym.$sym.$sym.substr($row,$n);
				}elseif (preg_match('/..'.$sym.'.'.$sym.'/i',$row)) {#--E-E
					$bool = true;
					$arrMatrix[$i] = substr($row,0,2).$sym.$sym.$sym;
				}elseif (preg_match('/.'.$sym.'.'.$sym.'./i',$row)) {#-E-E-
					$bool = true;
					$arrMatrix[$i] = $row[0].$sym.$sym.$sym.$row[$n+1];
				}
			}

			if($bool){
				$tMatrix = array1d_to_string($arrMatrix,"");
				$indexes = $this->swapPositions($tMatrix);
				$matrix = array1d_to_string($arrMatrix);
				return array($matrix, $indexes);
			}
		}
		return array("",array());
	}

	public function wildFeatures($sym)
	{
		$this->game->wilds = array($sym);
		return "true";
	}

	public function mtplrFeatures($sym)
	{
		$this->game->misc['multiplier'] = array($sym);
		return "true";
	}

	private function getPaylineWinsFormat() {
		return Array(
			'format'  => Array('betline_number', 'win', 'blink','num_repeats',
							   'betline', 'matrix_positions'),
			'details' => Array());
	}

	public function awardRespins($details)
	{
		$spinType = $details['type_spin'];
		$num_respins = $details['num_spins'];
		$multiplier = $details['fs_multiplier'];
		$rsCount = $details["respin_count"];
		award_freespins($this->game->gameId, $this->game->subGameId,
						$this->round->player->accountId, 
						$this->round->freeSpins['base_round_id'],
						$num_respins, $multiplier, $this->round->coinValue,
						$this->round->numCoins, $this->round->numBetLines,
						$this->round->amountType,"","",$spinType, $details);
		$this->round->nextRound = array("type" => "respins",
										"num_spins" => $num_respins,
										"spins_left" => $num_respins,
										"multiplier" => $multiplier,
										"respin_count" => $rsCount);
	}

	public function swapPositions($matrix)
	{
		$fMatix = $this->round->matrixFlatten;
		$indexes = array();
		for ($i=0; $i < count($fMatix); $i++) { 
			if ($fMatix[$i] != $matrix[$i]) {
				array_push($indexes, $i);
				$this->round->matrixFlatten[$i] = $matrix[$i];
			}
		}
		return  $indexes;
	}

	public function closeRespin($details)
	{
		$state=0;
		$numSpins = $details['num_spins'];
		$multiplier = $details['fs_multiplier'];
		$roundIds = $this->round->roundId;

		update_freespins($this->round->freeSpins['id'], 
			$this->round->freeSpins['game_id'], $this->round->freeSpins['sub_game_id'],
			$this->accountId, $this->round->freeSpins['base_round_id'], 
			$numSpins, $multiplier, $this->round->amountType, 
			$roundIds, $this->round->freeSpins['history'], $details, $state);
	}
}
?>
