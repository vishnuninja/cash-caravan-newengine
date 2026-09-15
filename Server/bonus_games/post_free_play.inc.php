<?php
/**
 * 
 */
class FreeModes extends PickFreeGame
{
	
	public function checkAndGrantBonusGame()
	{
		if (!isset($this->round->freeSpins)) {

			if ($this->game->subGameId > 1) {
				$temp = array( "super_stack" => $this->game->subGameId);
				array_push($this->round->bonusGamesWon, $temp);
			}
			return;
		}

		$details = $this->round->freeSpins['details'];
		$mode = $details['fs_mode'];

		$this->replaceCollectionSym($details);

		switch ($mode) {
			case '0':
				$this->playModeZero($details);
				break;
			case '1':
				$this->playModeOne($details);
				break;
			case '2':
				$this->playModeTwo($details);
				break;
			case '3':
				$this->playModeThree($details);
				break;
			default:
				break;
		}
		if ($this->round->freeSpins['spins_left'] == 1) {
			$details = $this->round->freeSpins['details'];
			$this->grantPickAndClick($details);
			$this->round->freespinState = 1;
		}
	}

	private function playModeZero($details)
	{
		$index =-1;
		$collectSym = $details['collection_symbol'];
		$collectCount = $details['collection_count'];
		$fsMultiplier = $details['fs_multiplier'];
		if (in_array($collectSym, $this->round->matrixFlatten)) {
			++$details['collection_count'];
			++$details['fs_multiplier'];
			$index = $this->collectionPos($collectSym);
		}
		$temp = array(
            "collection_count" => $details['collection_count'],
            "multiplier" => $details['fs_multiplier'],
            "collection_pos" => $index,
            "parent_type" => $details['fs_mode'],
        );
        $details['bonus_details'] = array($temp);
        array_push($this->round->bonusGamesWon, $temp);
		$this->freeSpinsUpdation($details);
	}

	private function lowPaySymbols($symbols)
	{
		$temp = array();
		$n = count($symbols);
		$i = 0;
		while ( $i < $n) {
			if (in_array($symbols[$i], $this->round->matrixFlatten)) {
				array_push($temp, $symbols[$i]);
			}
			$i++;
		}
		$m = count($temp);
		if ($m == 0) {
			return array("", "");
		}elseif ($m == 1) {
			array_push($temp, $temp[0]);
		}

		return $temp;
	}

	private function playModeOne($details)
	{
		$index =-1;
		$collectSym = $details['collection_symbol'];
		if (in_array($collectSym, $this->round->matrixFlatten)) {
			$index = $this->collectionPos($collectSym);
			++$details['collection_count'];

			$lowSyms = $details["low_pay_syms"];
			$transSym = $details["trans_sym"];
			$lowSyms = $this->lowPaySymbols($lowSyms);
			list($key1,$key2) = array_rand($lowSyms, 2);

			$matrix = $this->round->matrix;
			$bPos = array();
			for($j=0; $j < $this->game->numColumns; $j++) {
                for($i=0; $i < $this->game->numRows; $i++) {

                    if($matrix[$i][$j] == $lowSyms[$key1] ||
                    	$matrix[$i][$j] == $lowSyms[$key2] ) {
                        $matrix[$i][$j] = $transSym;
                        $rnd = $j + $i*$this->game->numColumns;
                        array_push($bPos, $rnd);
                    }
                }
            }
			$this->round->postMatrixInfo['matrix'] = $matrix;
            $this->round->postMatrixInfo['feature_name'] = 'spawning_wild';
            $this->round->postMatrixInfo['matrixString'] = array2d_to_string($matrix);
            $this->round->postMatrixInfo['matrixFlatten'] = $this->round->generateFlatMatrix($matrix);
            $this->round->postMatrixInfo['random_wild_positions'] = $bPos;
            $this->round->postMatrixInfo['symbol'] = "b";
		}
		$temp = array(
            "collection_count" => $details['collection_count'],
            "multiplier" => $details['fs_multiplier'],
            "collection_pos" => $index,
            "parent_type" => $details['fs_mode'],
        );
        $details['bonus_details'] = array($temp);
        array_push($this->round->bonusGamesWon, $temp);
		$this->freeSpinsUpdation($details);
	}

	private function playModeTwo($details)
	{
		$index =-1;
		$collectSym = $details['collection_symbol'];
		if (in_array($collectSym, $this->round->matrixFlatten)) {
			$index = $this->collectionPos($collectSym);
			++$details['collection_count'];

			$min = $details['rnd_min'];
			$max = $details['rnd_max'];
			$reels = $details['reels'];
			$wild = $details['wild'];

			$flippedMatrix = flip_2d_array($this->round->matrix);
			$rndPos = array();
			for ($i=0; $i <count($reels) ; $i++) { 
				$rnd = get_random_number($min,$max);
				$key = $reels[$i];
				$flippedMatrix[$key][$rnd] = $wild;

				$pos = $key + $rnd * $this->game->numColumns;
				array_push($rndPos, $pos);
			}

			$matrix = flip_2d_array($flippedMatrix);
			$this->round->postMatrixInfo['matrix'] = $matrix;
            $this->round->postMatrixInfo['feature_name'] = 'spawning_wild';
            $this->round->postMatrixInfo['matrixString'] = array2d_to_string($matrix);
            $this->round->postMatrixInfo['matrixFlatten'] = $this->round->generateFlatMatrix($matrix);
            $this->round->postMatrixInfo['random_wild_positions'] = $rndPos;
		}
		$temp = array(
            "collection_count" => $details['collection_count'],
            "multiplier" => $details['fs_multiplier'],
            "collection_pos" => $index,
            "parent_type" => $details['fs_mode'],
        );

        $details['bonus_details'] = array($temp);
        array_push($this->round->bonusGamesWon, $temp);
		$this->freeSpinsUpdation($details);
	}

	private function playModeThree($details)
	{
		$index =-1;
		$collectSym = $details['collection_symbol'];
		if (in_array($collectSym, $this->round->matrixFlatten)) {
			$index = $this->collectionPos($collectSym);
			++$details['collection_count'];
			$details['extra_spins'] = 1;
			$temp = array(
				"collection_count" => $details['collection_count'],
				"multiplier" => $details['fs_multiplier'],
				"collection_pos" => $index,
				"parent_type" => $details['fs_mode'],
			);
			$details['bonus_details'] = array($temp);
			$this->freeSpinsUpdation($details);
		}
		$temp = array(
			"collection_count" => $details['collection_count'],
			"multiplier" => $details['fs_multiplier'],
			"collection_pos" => $index,
			"parent_type" => $details['fs_mode'],
		);
        array_push($this->round->bonusGamesWon, $temp);
	}

	protected function freeSpinsUpdation($details)
	{
		$multiplier = $details['fs_multiplier'];
		$numSpins = isset($details['extra_spins']) ? $details['extra_spins'] : 0;
		$this->updateFreeSpins($this->round->freeSpins['id'],
						$this->game->gameId, $this->accountId,
						$this->round->freeSpins['base_round_id'],
						$numSpins,$multiplier,$this->round->amountType,
						$this->round->freeSpins['round_ids'],
						$this->round->freeSpins['history'],
						$details);
	}

	public function grantPickAndClick($details)
	{
		$count = $details['max_pick_clicks'];
		$numPicks = $details['collection_count'];
		if ($numPicks >= $count) {
			$numPicks = $count;
			$count = $numPicks;
		}

		$bonusGameId = $this->game->misc['id'];
		$multiplier = $this->game->misc['multiplier'];
		$pick_click = $details['pick_click'];
		$values = $pick_click['values'];
		$weights = $pick_click['weights'];

		$prizes = array();
		for ($count; $count > 0; $count--) { 
			$value = weighted_random_number($weights,$values);
			$win = $value * $this->round->totalBet;
			array_push($prizes, $win);
		}

		$arr = $this->collectPicks($count, $numPicks);
		$bonusGameData = Array(
					'parent_type' => $details['fs_mode'],
					'num_picks' => $numPicks,
					'num_prizes' => $numPicks,
					'pick_details'=>  array(),
					'multiplier' => $multiplier,
					'prizes' => $prizes,
                    'positions' => $arr);
		grant_bonus_game($this->game->gameId, $this->game->subGameId,
					$this->round->freeSpins['base_round_id'], $this->round->roundId,
					$this->accountId, $bonusGameId,
					"ARK", $numPicks, encode_objects($bonusGameData),
					$multiplier, $this->round->amountType, $this->round->coinValue,
					$this->round->numCoins, $this->round->numBetLines);
		$bonusGameWon = Array(
					'type' => 'bonus_game',
					'bonus_game_id' => $bonusGameId,
					'num_picks' => $numPicks,
					'num_prizes' => $numPicks,
					'parent_type' => $details['fs_mode']
				);

		array_push($this->round->bonusGamesWon, $bonusGameWon);
		$this->round->nextRound = $bonusGameWon;
	}

	private function collectionPos($collectSym)
    {
        $matrix = $this->round->matrixFlatten;
        $index = $this->game->numColumns - 1;
        $length = count($matrix);
        while ($index < $length && ($matrix[$index] != $collectSym))
        {
            $index += $this->game->numColumns;
        }
        return $index;
    }

	public function replaceCollectionSym($details)
	{
		$collectSym = $details['collection_symbol'];
		if ($details['collection_count'] == 0 && 
			$this->round->freeSpins['spins_left'] == 1 &&
			!in_array($collectSym, $this->round->matrixFlatten))
		{
			$n = $details['max'];
			$mn = $details['rnd_min'];
			$mx = $details['rnd_max'];
			$in = $details['rnd_indx'];
			$val = get_random_number($mn,$mx);
			$numColumn = $this->game->numColumns;
			$this->round->reelPointers[$numColumn -1] = $in+$val+$n;
			$this->round->generateMatrix(); 
		}
	}

	private function collectPicks($count, $numPicks)
    {
        $misc = $this->game->misc;
		$features = $misc["features"];
		$temp = array();

		while ($count < $numPicks) {
			$count++;
			$dtls = $misc[$count.""];
			if($count == 1) {
				$sym = weighted_random_number($misc["wgt1"],$dtls["syms"]);
				array_push($temp, $sym);
			}
			if($count == 2) {
				if(!in_array("a", $temp)) {
					array_push($temp, "a");
				}else{
					$syms = $dtls["syms"];
					$index = get_random_number(3,4);
					array_push($syms, $features[$index]);
					$sym = weighted_random_number($misc["wgt2"],$syms);
					array_push($temp, $sym);
				}
			}
			if($count == 3) {
				if(in_array("b", $temp)) {
					$syms = $dtls["symc"];
					$index = get_random_number(3,4);
					array_push($syms, $features[$index]);
					$sym = weighted_random_number($misc["wgt4"],$syms);
					array_push($temp, $sym);
				}elseif(in_array("c", $temp)) {
					$syms = $dtls["symb"];
					$index = get_random_number(3,4);
					array_push($syms, $features[$index]);
					$sym = weighted_random_number($misc["wgt4"],$syms);
					array_push($temp, $sym);
				}elseif(in_array("d", $temp)) {
					$sym = weighted_random_number($misc["wgt2"],$dtls["syme"]);
					array_push($temp, $sym);
				}elseif(in_array("e", $temp)) {
					$sym = weighted_random_number($misc["wgt2"],$dtls["symd"]);
					array_push($temp, $sym);
				}
			}
			if($count == 4) {
				if(in_array("b", $temp) && in_array("c", $temp)){
					$syms = $dtls["symf"];
					$index = get_random_number(3,5);
					array_push($syms, $features[$index]);
					$sym = weighted_random_number($misc["wgt6"],$syms);
					array_push($temp, $sym);
				}elseif(in_array("b", $temp) && in_array("d", $temp)){
					$sym = weighted_random_number($misc["wgt4"],$dtls["symce"]);
					array_push($temp, $sym);
				}elseif(in_array("b", $temp) && in_array("e", $temp)){
					$sym = weighted_random_number($misc["wgt4"],$dtls["symcd"]);
					array_push($temp, $sym);
				}elseif(in_array("c", $temp) && in_array("d", $temp)){
					$sym = weighted_random_number($misc["wgt4"],$dtls["symbe"]);
					array_push($temp, $sym);
				}elseif(in_array("c", $temp) && in_array("e", $temp)){
					$sym = weighted_random_number($misc["wgt4"],$dtls["symbd"]);
					array_push($temp, $sym);
				}elseif(in_array("d", $temp) && in_array("e", $temp)){
					$sym = weighted_random_number($misc["wgt3"],$dtls["symbc"]);
					array_push($temp, $sym);
				}
			}
			if($count == 5) {
				if(in_array("a", $temp) && in_array("b", $temp) && in_array("c", $temp)) {
					if(in_array("d", $temp)) {
						$sym = weighted_random_number($misc["wgt6"],$dtls["symbe"]);
						array_push($temp, $sym);
					}elseif(in_array("e", $temp)) {
						$sym = weighted_random_number($misc["wgt6"],$dtls["symbd"]);
						array_push($temp, $sym);
					}elseif(in_array("f", $temp)) {
						$sym = weighted_random_number($misc["wgt5"],$dtls["symbc"]);
						array_push($temp, $sym);
					}
				}elseif(in_array("b", $temp)) {
					array_push($temp, "c");
				}elseif(in_array("c", $temp)) {
					array_push($temp, "b");
				}
			}
			if($count == 6) {
				if(in_array("d", $temp) && in_array("e", $temp)) {
					array_push($temp, "f");
				}elseif(in_array("d", $temp) && in_array("f", $temp)) {
					array_push($temp, "e");
				}else{
					array_push($temp, "d");
				}
			}
		} return $temp;
	}
}
?>