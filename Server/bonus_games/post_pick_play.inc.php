<?php
require_once 'ibonus.inc.php';

class PickPlay extends BonusPickGame
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
	public function checkAndGrantBonusGame()
	{

	}
	public function playBonusGame($pickedPosition) {

		$pickedPosition = (int)$pickedPosition;
		$this->validatePick($pickedPosition);

		array_push($this->round->bonusGames['picks_data'], $pickedPosition);
		$this->round->bonusGames['num_user_picks']++;
		$state = $this->getState();
		$this->round->bonusGameRound['state'] = $state;

		$this->calculatePrizes($state, $pickedPosition);

	}
	private function validatePick($pickedPosition)
	{
		$prevPicks = $this->round->bonusGames['picks_data'];
		$numPrizes = $this->round->bonusGames['game_data']['num_prizes'];

		if(!isset($pickedPosition) or in_array($pickedPosition, $prevPicks) or
			// ($pickedPosition < 0 or $pickedPosition >$numPrizes)
			($pickedPosition < 0 or $pickedPosition > 5)
		) {
			ErrorHandler::handleError(1, "BONUSPICKS_0001", "Invalid pick position1");
		}
	}
	public function calculatePrizes($state, $pickedPosition)
	{
		$gameData = $this->round->bonusGames['game_data'];
		$num_picks = $gameData['num_picks'];
		$prizes = $gameData['prizes'];
		$winAmount = $prizes[$pickedPosition];
		$n = count($this->round->bonusGames['picks_data']) -1;
		$sym = $gameData['positions'][$n];
		$this->round->bonusGameRound['prize_value'] = $winAmount;
		$this->round->bonusGameRound['win_amount'] = $winAmount;
		$this->round->bonusGameRound['win_feature'] = $sym;
		$this->round->bonusGameRound['parent_type'] = $gameData['parent_type'];
		array_push($this->round->bonusGames['game_data']['pick_details'], $sym);

		if($state === 1) {
			$winAmt =  $this->round->bonusGames['win_amount'];
			$winAmt = to_coin_currency($winAmt);
			$winAmt += $winAmount;
			$this->round->bonusGameRound['total_win_amount'] = $winAmt;
			$this->round->bonusGameRound['all_prizes'] = $prizes;
			$this->round->winLineNumbers = array();
			$this->round->winAmount += $winAmt;
			array_push($this->round->winLineNumbers, 
					Array("pick_click", $this->round->winAmount));
		}
		$winAmount = to_base_currency($winAmount);
		$winAmount += $this->round->bonusGames['win_amount'];
		update_bonus_game($this->round->bonusGames['picks_data'],
						  $this->round->bonusGames['num_user_picks'],
						  $this->round->bonusGames['game_data'],
						  $winAmount, $state,
						  $this->round->bonusGames['round_id'],
						  $this->round->bonusGames['game_id'],
						  $this->accountId,
						  $this->round->bonusGames['id'],
						  $this->round->amountType);
	}
	private function getBonusConfig($numSymbols, $spinType) {
		global $db;

		$table = "game.bonus_config";
		$query = <<<QUERY
			SELECT configuration
			  FROM $table
			 WHERE game_name = "{$this->game->gameName}" AND
				   bonus_game_id = {$this->bonusGameId} AND
				   num_symbols = {$numSymbols} AND
				   spin_type = "{$spinType}"
QUERY;
		$rs = $db->runQuery($query) or ErrorHandler::handleError(1, "BONUSPICKS_001");
		if($db->numRows($rs) == 0) {
			return Null;
		}

		$row = $db->fetchRow($rs);
		return $row[0];
	}
}
?>