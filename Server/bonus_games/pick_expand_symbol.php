<?php
require_once 'ibonus.inc.php';

class PickExpandSym extends BonusPickGame
{
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
		$spinType = $this->round->spinType;
    	$postMatrixFeatures = $featureConfig['post_matrix_handlers'][$spinType];
    	$details = $postMatrixFeatures[0]['details'];
    	$minCount = $details['min_count'];
    	$bonusSym = $details['freespin_symbol'];

    	$count = array_count_values($this->round->matrixFlatten);
    	if (!in_array($bonusSym, $this->round->matrixFlatten) ||
    		$count[$bonusSym] < $minCount) {
    		return;
    	}

    	$symbols = $details['symbols'];
		$weights = $details['weights'];
		$index = get_weighted_index($weights);
		$selectedSym = $symbols[$index];
		$minArr = $details['min_arr'];

		if($index > $minCount) {
			$minCount = $minArr[1];
		}
		else {
			$minCount = $minArr[0];
		}
		$details['fs_details']['min_count'] = $minCount;
		$details['fs_details']['exp_symbol'] = $selectedSym;
		$details['fs_details']['max_count'] = $details['min_count'];
		if (isset($this->round->freeSpins)) {
			$data = $this->round->freeSpins['details'];
			$details['fs_details']['min_count'] = $data['min_count'];
			$details['fs_details']['exp_symbol'] = $data['exp_symbol'];
		}else{
			$exp_symbol = array(
				'exp_symbol' => $details['fs_details']['exp_symbol'],
					'min_count'=>$details['fs_details']['min_count']);
			$details['fs_details']['bonus_details']=array(
				'exp_symbol' => $details['fs_details']['exp_symbol'],
					'min_count'=>$details['fs_details']['min_count']);
			array_push($this->round->bonusGamesWon, $exp_symbol);
		}

		handle_freespins($this->round, $details);
	}
}
?>
