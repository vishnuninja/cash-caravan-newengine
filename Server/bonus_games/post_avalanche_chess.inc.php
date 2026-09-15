<?php
require_once 'ibonus.inc.php';
/**
 * 
 */
class AvalancheChess extends BonusPickGame
{
	protected $game;
	protected $round;
	protected $accountId;
	protected $symbol;
	protected $bonusGameId;
	protected $scattersCount;
	protected $avalancheWinAmount;
	protected $playerBalance;
	protected $avalancheDetails;
	protected $spredWild;
	protected $avalancheCount;

	public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount) {
		$scattersCount['total'] = isset($scattersCount[$symbol]) ?  $scattersCount[$symbol] : null;
		$this->game = $game;
		$this->round = $round;
		$this->accountId = $accountId;
		$this->scattersCount = $scattersCount;
		$this->symbol = $symbol;
		$this->bonusGameId = $bonusGameId;
		$this->avalancheWinAmount = 0;
		$this->playerBalance = 0;
		$this->avalancheDetails = array();
		$this->spredWild = false;
		$this->avalancheCount = 0;
	}

	public function checkAndGrantBonusGame()
	{

		if ($this->round->paylineWinAmount <=0) {
                         
			if( count($this->avalancheDetails) > 0 ) {
				$this->round->matrixString = $this->avalancheDetails[0]['pre_aval_matrixstr'];
			}
			// Before leaving avalanche check and play check and award freespins.
			$this->awardFreespins();
			// For client communication.
			$this->round->otherWins['cluster_wins'] = $this->avalancheDetails;
			$multData = $this->game->misc['multiplier'][$this->round->spinType];
			
			$mArr = array('multiplier' => $multData, 
				"hotspots" => $this->game->misc['hotspots']);
			array_push($this->round->multipliers, $mArr);

			$this->round->previousRound['misc']['log'] = $mArr;

			// For client communication.
			if($this->round->spinType == 'freespin' &&
				$this->round->freeSpins['spins_left'] == 1) {

				$this->round->freespinState = 1;
			}
			return;
		}

		$this->avalancheCount++;
		if (isset($this->game->misc['spread_wild']) &&
			$this->game->misc['spread_wild'] == "true") {
			$this->spredWild = true;
		}

		$prev_round_matrix = $this->round->matrix;
		$prev_round_matrixstr   = $this->round->matrixString;
		$prev_round_paylinewins = $this->round->paylineWins;
		
		list($bursted_raw_matrix, $prev_win_line, $prev_win_pos) = 
			$this->getBurstedRawMatrix();

		$sticky_sym_matrix  = $this->getStickySymMatrix($bursted_raw_matrix);
		$moved_index        = $this->getmovedIndex($bursted_raw_matrix);

		$prev_reel_pointers = $this->round->reelPointers;
		$prev_win           = $this->round->winAmount - $this->avalancheWinAmount;
		$this->avalancheWinAmount = $this->round->winAmount;
		$prev_hotspots = $this->game->misc['hotspots'];
		$prev_spread_wild = $this->game->misc['spread_wild'];
		$prev_multiplier = $this->game->misc['multiplier'][$this->round->spinType];
		
		$this->resetRound();

		$busted_info = $this->genStickyElementMatrix($sticky_sym_matrix);
                $moved_sym = $this->getMovedSym($moved_index);
		
                $this->spredingWild();
		$this->round->generateBetLines();
		$this->round->calculatePaylineWins();
		
		$curr_round_matrixstr   = $this->round->matrixString;
		$multiplier =1;
		if ($this->avalancheCount == 1) {
			if($this->round->spinType == 'normal') {
				$this->playerBalance = $this->round->player->balance  + to_base_currency($prev_win) - to_base_currency($this->round->totalBet);
			}
			else {
				$this->playerBalance = $this->round->player->balance  + to_base_currency($prev_win);
			}
		}else{
			$this->playerBalance += to_base_currency($prev_win);
		}
		
		$spread_wild ="";$spreadMatrix = "";
		if ($this->spredWild && $prev_spread_wild == "true") {
			$kingHotSpot = $this->game->misc['king_hotspot'];
			$spread_wild = array('positions' => $kingHotSpot['indexes'], 'spread_sym' => 'w');
			$spreadMatrix = $this->speardMatrix($prev_round_matrix, $kingHotSpot['indexes']);
		}
		$round_to_client = array(
			'pre_aval_matrixstr'    => $prev_round_matrixstr,
			'paylinewins'           => $prev_round_paylinewins,
			'multiplier'            => $prev_multiplier,
			'win_amount'            => $prev_win,
			'player_balance'        => $this->playerBalance,
			'post_aval_matrixstr'   => $curr_round_matrixstr,
			'busted_matrix'         => $sticky_sym_matrix,
			'busted_index'          => $moved_index, //All index either busted or whose sym moved due to busted sym.
			'new_symbols'           => $moved_sym,   //All new symbols on above indices. 
			'prev_won_paylines'     => $prev_win_line,
			'prev_won_pos'          => $prev_win_pos,
			'spread_wild'           => $spread_wild,
			'spread_matrix'			=> $spreadMatrix,
			'hotspots'              => $prev_hotspots,
			'post_hostspots'		=> $this->game->misc['hotspots']
		);

		array_push($this->avalancheDetails, $round_to_client); 

		$this->checkAndGrantBonusGame();

		return ;
	}

	public function getBurstedRawMatrix() {
		$burst_matrix 	= array();
		$pos 			= array();
		$bet_line_num 	= array();

		if ( isset($this->round->paylineWins['details'])
			&& ($this->round->paylineWins['details'] != "") ) {

			// format: "betline_number;win;blink;num_repeats;betline;matrix_positions"
			//          1:50:11100:3:wgghh:0,1,2;
			// $pos an array stores all won positions in a flat matrix.
			// These won positions will disappear in avalanche.
			$details = explode(";", $this->round->paylineWins['details']);

			for ($i=0; $i < count($details) ; $i++) {
				$temp = explode(":", $details[$i]);
				$positions = explode(",", $temp[5]);
				array_push($bet_line_num, $temp[0]);

				for($j = 0; $j < count($positions); $j++) {
					array_push($pos, $positions[$j]);
				}
			}
		}
  
		$pos = array_unique($pos);
		$pos = array_values($pos);

		$misc = $this->game->misc;
		$hotspots = $misc['hotspots'];
		$keys = array_keys($hotspots);
		for ($i=0; $i < count($pos); $i++) { 
			if (in_array($pos[$i], $keys) 
				&& $hotspots[$pos[$i]] == "true") {
				array_splice($pos, $i,1);
			}
		}

		for($i=0;$i<$this->game->numRows;$i++)
		{
			for($j=0;$j<$this->game->numColumns;$j++)
			{
				$burst_matrix[$i][$j]=1;
			}
		}

		for($i = 0; $i < count($pos); $i++) {
			$row = $pos[$i] / $this->game->numColumns;
			$col = $pos[$i] % $this->game->numColumns;
			$burst_matrix[$row][$col] = 0;
		}

		// If win pos reset $burst_matrix to blank array.
		if( count($pos) <= 0) {
			$burst_matrix = array();
		}

		return array($burst_matrix, $bet_line_num, $pos);
	}

	public function generateReelPointers($sticky_sym_matrix, $prev_reel_pointers) {
		$busted_count = $this->count_busted_sym($sticky_sym_matrix);
		$reel_pointers = [];

		for($i = 0; $i < count($prev_reel_pointers); $i++) {
			if($busted_count[$i] === 0) {
				$reel_pointers[$i] = $prev_reel_pointers[$i];
				continue;
			}
			
			$rounded_reel_pointer = $prev_reel_pointers[$i] - $busted_count[$i];
			if($rounded_reel_pointer < 0) {
				$reel_length = strlen($this->game->reels[$i]);
				$rounded_reel_pointer = ($reel_length) + $prev_reel_pointers[$i] - $busted_count[$i];
			}

			$reel_pointers[$i] = $rounded_reel_pointer;
		}

		return $reel_pointers;
	}

	public function getStickySymMatrix($burst_matrix) {
		$sticky_element_matrix = array();

		for($i = 0; $i < $this->game->numRows; $i++)
		{
			for($j = 0; $j < $this->game->numColumns; $j++)
			{
				$sticky_element_matrix[$i][$j]="0";
			}
		}

		$misc = $this->game->misc;
		$hotspots = $misc['hotspots'];
		$keys = array_keys($hotspots);
		$wild = $this->game->wilds[0];

		$bool = false;
		for($j = 0; $j < $this->game->numColumns; $j++)
		{
			$temp_counter = $this->game->numRows - 1;

			for($i = $this->game->numRows - 1; $i >= 0; $i--)
			{
				$index = ($i * $this->game->numColumns) + $j;
				if (in_array($index, $keys) && $hotspots[$index] == "true") {
					$sticky_element_matrix[$i][$j] = $wild;
					if ($index == $misc['king_hotspot']['index']) {
						$bool = true;
					}else{
						$temp_counter--;
					}
				}
				else if($burst_matrix[$i][$j] == 1)
				{
					$sticky_element_matrix[$temp_counter][$j] = $this->round->matrix[$i][$j];
					$temp_counter--;
				}
			}
		}
		if ($bool && $sticky_element_matrix[2][2] != $wild) {
		   $temp = $sticky_element_matrix[2][2];
		   $sticky_element_matrix[2][2] = $wild;
		   $temp1 = $sticky_element_matrix[1][2];
		   $sticky_element_matrix[1][2] = $temp;
		   $sticky_element_matrix[0][2] = $temp1;
		}
		return $sticky_element_matrix ;
	}

	/**
	* 
	* To count how many symbols busted on each reel
	*/
	function count_busted_sym($matrix) {
		$temp_arr = Array();

		for($i = 0; $i < $this->game->numColumns; $i++) {
			$count = 0;
			for($j = 0; $j < $this->game->numRows; $j++) {
				if($matrix[$j][$i] == '0') {
					$count++;
				}
			}
			array_push($temp_arr, $count);
		}

		return $temp_arr;
	}

	 /*
	* @fun resetRound 
	* Before calculating avalanche win reset some round object variables.
	* So that they will not effect the win and prize calculations 
	* after avalanche triggered.
	**/
	public function resetRound() {
		$this->round->paylineWins  = $this->getPaylineWinsFormat();
		$this->round->betLines     = Array();
		$this->round->paylineWinAmount = 0;
	}

	public function getPaylineWinsFormat() {
		return Array(
			'format'  => Array('betline_number', 'win', 'blink','num_repeats',
							   'betline', 'matrix_positions'),
			'details' => Array());
	}

	 public function genStickyElementMatrix($previous_matrix)
	{
		$numRows = $this->game->numRows;
		$offset  = ($numRows % 2 != 0) ? ($numRows - 1)/2 : $numRows/2;
		$busted_sym = array();
		$busted_index = array();
		for ($i = 0; $i < $numRows; $i++) { 
			$reel = $this->game->reels[$i];
			$reelLength = strlen($reel);
			$reelPointer = $this->round->reelPointers[$i] - $offset;
			for ($j = ($numRows-1); $j >= 0; $j--) {
				if ($previous_matrix[$j][$i] == "0") {
					$reelPointer--;
					$previous_matrix[$j][$i] = $reel[($reelPointer + $reelLength) % $reelLength];
					$this->round->reelPointers[$i]--;
					$mat_index = ($i * $this->game->numColumns) + $j;
					array_push($busted_index, $mat_index);
					array_push($busted_sym, $previous_matrix[$j][$i]);
				}
			}
			$this->round->reelPointers[$i] =  $reelPointer + $offset;
		}

		$this->round->matrix        = $previous_matrix;
		$this->round->matrixString  = array2d_to_string($this->round->matrix);
		$this->round->matrixFlatten = $this->round->generateFlatMatrix($this->round->matrix);

		return [$busted_index, $busted_sym];
	}
	// For client communication
	public function getmovedIndex($burst_matrix) {
		$moved_index = array();

		for($m = 0; $m < $this->game->numColumns; $m++) {
			$flag = 0;
			for($n = $this->game->numRows - 1; $n >= 0; $n-- ) {
				if( ($burst_matrix[$n][$m] == 0) || ($flag) ) {
					array_push($moved_index, $n * $this->game->numColumns + $m);
					$flag = 1;
				} 
			}
		
		}

		return $moved_index;
	}
	// For client communication
	public function getMovedSym($moved_index) {
		$moved_sym = array();

		for($i = 0; $i < count($moved_index); $i++) {
			array_push($moved_sym, $this->round->matrixFlatten[$moved_index[$i]]);
		}
		
		return $moved_sym;
	}

	private function spredingWild()
	{
		$misc = $this->game->misc;

		$spinType = $this->round->spinType;
		$mlt  = $misc['multiplier'][$spinType];

		$hotspots = $misc['hotspots'];
		$wildSym = $misc['wild_symbol'];
		$kingSpot = $misc['king_hotspot'];
		$index = $kingSpot["index"];
		$indexes = $kingSpot["indexes"];
		$fMatrix = $this->round->matrixFlatten;
		foreach ($hotspots as $key => $value) {
			if ($hotspots[$key] == "true") {
				$fMatrix[$key] = $wildSym;
			}
			if ($fMatrix[$key] == $wildSym && $hotspots[$key] != "true") {
				$hotspots[$key] = "true";
				if (isset($mlt[$key]) and $spinType == 'freespin') {
					$mlt[$key]++;
				}
			}
			if (!$this->spredWild && $hotspots[$index] == "true") {
				$count = count($indexes);
				for ($i=0; $i < $count; $i++) { 
					$fMatrix[$indexes[$i]] = $wildSym;
				}
				$this->game->misc['spread_wild'] = "true";
			}else {
				$this->game->misc['spread_wild'] = "false";
			}
		}
		$this->round->matrixFlatten = $fMatrix;
		$this->game->misc['hotspots'] = $hotspots;
		$this->game->misc['multiplier'][$spinType] = $mlt;
	}

	public function speardMatrix($matrix, $arrKingPos)
	{
		for ($i=0; $i < $this->game->numRows; $i++) { 
			for ($j=0; $j < $this->game->numColumns; $j++) {
				$index = ($i * $this->game->numColumns) + $j;
				if (in_array($index, $arrKingPos)) {
					$matrix[$j][$i] = $this->game->wilds[0]; 
				}
			}
		} return array2d_to_string($matrix);
	}

	/*
	* Award FS at a time triggered from normal spin
	* and from avalanche awarded from that normal spin.
	* So collected freespins are awarded. 
	* TODO check this flow.
	*/
	public function awardFreespins() {

		$data = $this->round->featureData['details'];

		$hotspots = $this->game->misc['hotspots'];
		$count = 0;
		foreach ($hotspots as $key => $value) {
			if ($value == "true") {
				$count++;
			}
		}

		if (isset($this->round->freeSpins)) {
			$numSpins     = isset($data[$count]) ? $data[$count] : 0 ;
			$baseRoundId  = $this->round->freeSpins['base_round_id'];
			$multiplier   = $data['fs_multiplier'];
			$this->round->freeSpins['details']['bonus_details'] = $this->game->misc['multiplier']['freespin'];
			if ($count > 2) {
				array_push($this->round->freeSpins['round_ids'], $this->round->roundId);
				array_push($this->round->freeSpins['history'], $numSpins);
				$this->setNextRound($numSpins, $multiplier);
			}

			update_freespins($this->round->freeSpins['id'], 
				$this->round->freeSpins['game_id'], $this->round->freeSpins['sub_game_id'],
				$this->accountId, $this->round->freeSpins['base_round_id'], 
				$numSpins, $multiplier, $this->round->amountType, 
				$this->round->freeSpins['round_ids'], $this->round->freeSpins['history'], 
				$this->round->freeSpins['details']);

			$this->round->freeSpins['spins_left'] += $numSpins;
			
		}else{
			if ($count < 3) {
				return;
			}
			$numSpins     = $data[$count];
			$baseRoundId  = $this->round->roundId;
			$multiplier   = $data['fs_multiplier'];
			$roundIds     = [$this->round->roundId];
			$history      = [$numSpins];
			$spinType     = 2;
			$numBetLines  = $this->round->numBetLines;

			$details      = array(
						'fs_multiplier' => $multiplier,
						'fs_game_id'    => $data['fs_game_id'],
						'parent_type'   => $this->round->spinType,
						'bonus_details' => $this->game->misc['multiplier']['freespin']
						);

			award_freespins($this->game->gameId, $this->game->subGameId,
						$this->accountId, $baseRoundId,
						$numSpins, $multiplier,
						$this->round->coinValue, $this->round->numCoins,
						$numBetLines, $this->round->amountType,
						$roundIds, $history, $spinType, $details);

			$this->setNextRound($numSpins, $multiplier);
		}
	}

	public function setNextRound($num_freespins, $multiplier)
	{
		$arrFS = array("type" => 'freespins',
					"num_spins" => $num_freespins,
					"spins_left" => $num_freespins,
					"fs_multiplier" => $multiplier);
		array_push($this->round->bonusGamesWon, $arrFS);
	}
}
?>