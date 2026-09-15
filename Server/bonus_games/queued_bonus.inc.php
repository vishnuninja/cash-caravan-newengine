<?php
require_once 'ibonus.inc.php';

class QueuedBonus implements iBonus{
	protected $game;
	protected $round;
	protected $accountId;
	protected $symbol;
	protected $bonusGameId;
	protected $scattersCount;

	public function __construct(&$game, &$round, $accountId, $bonusGameId, $symbol, $scattersCount) {
		//$scattersCount['total'] = $scattersCount[$symbol];
		$this->game = $game;
		$this->round = $round;
		$this->accountId = $accountId;
		$this->scattersCount = $scattersCount;
		$this->symbol = $symbol;
		$this->bonusGameId = $bonusGameId;
	}

	public function loadBonusGame() {

	}

  	/*
   	* @ method checkAndGrantBonusGame
   	* Will be used to grant the queued bonus triggered in freespins.
   	* On  the end(last Spin) of  freespins round one bonus game  will be 
   	* picked from queue and granted(inserted into bonus log table).
   	* This method will work only in the last free spin round.
   	* */
	public function checkAndGrantBonusGame() 
	{  
		$this->round->freespinState = 0;

		if(!$this->round->freeSpins['spins_left'] 
			|| $this->round->freeSpins['spins_left'] != 1) 
		{
			return false;
		}

		// Control will come here only for the last FS.

		$this->round->freespinState = 1;
		$bonus_game_id = $this->getBonusGameId();

		if( isset($this->round->queuedBonusGames) 
			&& count($this->round->queuedBonusGames) > 0 ) 
		{
			$queued_game = $this->round->queuedBonusGames[0]; 
			$queued_game_data = decode_object($queued_game['game_data']);
			$prizes = $queued_game_data['prizes'];
			$fs_multiplier = $queued_game_data['fs_multiplier'];
			$id = $queued_game['id'];
			$num_picks = $queued_game['num_picks'];
			$bonus_code = $queued_game['bonus_game_code'];
			
			$numPaylines = isset($this->game->misc['num_paylines']['freespin']) ?
			    $this->game->misc['num_paylines']['freespin'] : 
			    $this->game->paylines;

			$won_features = Array(); 
			$fs_game_ids = Array();
			$bonus_game_data = Array(
				'prizes'  => $prizes,
				'won_prizes'=> $won_features,
				'fs_game_id'  => $fs_game_ids,
				'num_scatters' => '',
				'fs_multiplier' => $fs_multiplier,
				'win_ways_fs' => $numPaylines,
				'is_queued' => true,
			);

			$bonus_game_data = encode_objects($bonus_game_data);
			$base_round_id = $queued_game['base_round_id'];

			grant_bonus_game($this->game->gameId, $this->game->subGameId,
				$base_round_id, $this->round->roundId,
				$this->accountId, $bonus_game_id, $bonus_code,
				$num_picks, $bonus_game_data, 1,
				$this->round->amountType, $this->round->coinValue,
				$this->round->numCoins, $numPaylines);

			update_queued_bonus($id, $this->round->amountType);
			$this->setBonusDetailsMsg($num_picks, $prizes);
		}
	}

	public function getBonusGameId() {
		$bonus_config = $this->game->bonusConfig['bonus_config'][$this->round->spinType];
		$symbol = $this->game->scatters[0];
		$bonus_game_id = $bonus_config[$symbol]['bonus_game_id'];
		$this->bonusGameId = $bonus_game_id;

		return $bonus_game_id;
	}

  /* 
   * @fun setBonusDetailsMsg
   * It will be called in last freespin only.
   * Set here bonus_game and next round for client.
   * $this->round->nextRound need to be set here. Because
   * $bonusGameWon is having "is_queued" so $bonusGameWon
   * will not be set into $this->round->nextRound in message_handler.
   * So next_round will be here only.
   */
    public function setBonusDetailsMsg($num_picks, $prizes) 
    {
    	$current_round_bonus = 0;

    	if(isset($this->round->bonusGamesWon) && 
    		count($this->round->bonusGamesWon) > 0) 
    	{
    		$current_round_bonus = 1;
    	}

    	$bonusGameWon = Array(
	        'bonus_game_id' => $this->bonusGameId,
	        'num_picks' => $num_picks,
	        'num_prizes' => count($prizes),
	        'queued_bonus_count' => count($this->round->queuedBonusGames)
	          - 1 + $current_round_bonus,
	        'type' => 'bonus_game',
	        'is_queued' => true
	    );

	    $bonus_game_set = false;
	    $this->round->nextRound = $bonusGameWon;
	}

	public function playBonusGame($pickedPosition) {

	}

}

?>
