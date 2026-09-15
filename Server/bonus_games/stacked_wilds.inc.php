<?php
require_once 'ibonus.inc.php';

/**
 * @class SpawningWild
 * @implements iBonus
 * @desc This class is used for the game Wrath of the Dragons.
 *       Gets called for the bonus game Spawning Wilds.
 */

class PostVegas extends BonusPickGame {
	protected $game;
	protected $round;
	protected $accountId;
	protected $symbol;
	protected $bonusGameId;
	protected $scattersCount;

	public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount)
	{
		$scattersCount['total'] = isset($scattersCount[$symbol]) ?  $scattersCount[$symbol] : null;
		$this->game = $game;
		$this->round = &$round;
		$this->accountId = $accountId;
		$this->symbol = $symbol;
		$this->bonusGameId = $bonusGameId;
		$this->scattersCount = $scattersCount;
	}

	/**
	 * @func checkAndGrantBonusGame
	 * @desc Gets called when there are 3 or more bonus symbols in screen.
	 *       It awards free spins at the end of the bonus game
	 */
	public function checkAndGrantBonusGame()
	{
		if (isset($this->round->freeSpins) and 
			$this->round->winAmount >= 0 and !empty($this->round->multipliers)) {
			$this->checkCapWinAmount();
			return;
		}

		$details = $this->round->featureData['details'];

		$length = $details['count'];
		$stackSymbol = $details['stack_symbol'];
		$wildMultiplier = $details['wild_multiplier'];

		[$stackCount, $reels, $scattersCount] = $this->checkStacked($stackSymbol, $length);
		$this->round->wildMultiplier = $wildMultiplier[$stackCount];

		if ($scattersCount >= $length) {
			$this->scatterWinAmount($scattersCount);
		}
		#communication
		$multipliers = array("multiplier" => $this->round->wildMultiplier, 'reels' => $reels);
		array_push($this->round->multipliers, $multipliers);

		if(isset($this->round->freeSpins)) {
			$temp = $this->round->wildMultiplier * $this->round->freeSpins['multiplier'];
			$log = array("multiplier" => $temp );
			$this->round->previousRound['misc']['log'] = $log;
		} else {
			
			$this->round->previousRound['misc']['bonus'] = $log;
		}
	}

	private function checkStacked($stackSymbol, $length) 
	{
		$stackCount = 0;
		$reels = array();
		$scattersCount = 0;
		$matrix = $this->round->matrix;
		for ($i=0; $i < $this->game->numColumns; $i++) { 
			$count = 0;
			for ($j=0; $j < $this->game->numRows; $j++) { 
				if ($matrix[$j][$i] == $stackSymbol) {
					$count++;
				} elseif(in_array($matrix[$j][$i], $this->game->scatters)) {
					$scattersCount++;
				}
			}
			if ($count == $length) {
				$stackCount++;
				array_push($reels, $i); 
			}
		}
		return [$stackCount, $reels, $scattersCount]; 
	}
	
	public function checkCapWinAmount()
	{
	  $details = $this->round->freeSpins['details'];

	  $baseAmount = $details['base_amount'];
	  $capAmount = $details['cap_amount'];

	  $fsTotalWin = round_half($this->round->freeSpins['total_win_amount']);
	  $total = $baseAmount + $fsTotalWin + $this->round->winAmount;

	  if ($total >= $capAmount) {
		$this->round->freeSpins['spins_left'] = 1;
		$this->round->freespinState = 1;

		$win = $capAmount - ($baseAmount + $fsTotalWin);
		if ($win < 0 ) {
			$this->round->winAmount = $capAmount - $fsTotalWin;
		}else{
			$this->round->winAmount = $win;
			
		}
		$this->round->game->misc["cap_bet"] = "true";
		array_push($this->round->bonusGamesWon, array("cap_bet" => "true"));
	  }
	}

	public function scatterWinAmount($numScatters)
    {
        $bonusConfig = $this->round->game->bonusConfig;
        $screenWinFeatures = $bonusConfig['screen_wins'][$this->round->spinType];
        foreach($screenWinFeatures as $index => $feature) {
            $featureName = $feature['feature'];
            $details = $feature['details'];
        }

        $award_name = $details[$numScatters]['award_name'];
        $num_awards = $details[$numScatters]['num_awards'];
        $wildMultiplier = $this->round->wildMultiplier;

        $win_amount = 0;
        if($award_name == 'total_bet') {
            $win_amount = $this->round->lineBet * $num_awards * $wildMultiplier;
            if (isset($this->round->freeSpins)) {
                $win_amount *= $this->round->freeSpins['multiplier'];
            }
            $this->round->winAmount += $win_amount;
        }
        else {
            ErrorHandler::handleError(1, "VEGAS_01", "-Award Not found");
        }

        $screenWins = array(
            'type' => 'screen_wins',
            'screen_symbol' => $this->game->scatters[0],
            'num_screen_symbols' => $numScatters,
            'win_amount' => $win_amount,
            'multipler' => $num_awards,
            'wildMultiplier' => $wildMultiplier
        );

        array_push($this->round->screenWins, $screenWins);
    }
}
?>