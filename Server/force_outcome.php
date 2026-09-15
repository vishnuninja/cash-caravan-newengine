<?php
define('ALLOW_FORCING', 1); # todo TODO simcode make it 0

function handle_forced_outcome(&$round) {
	global $db;

	if(!ALLOW_FORCING) {
		return;
	}

	$account_id = $round->player->accountId;
	$game_name = $round->game->gameName;

	$force_query = <<<QUERY
		SELECT account_id, game_id, game_name, reel_positions
	  	  FROM gamelog.forcing_data
	  	 WHERE account_id = {$account_id} AND
	  	 	   game_name = '{$game_name}' AND
	  	 	   expiry_date >= now()
QUERY;

	$result = $db->runQuery($force_query) or
		print "Error in forcing" . $db->error();

	if($db->numRows($result) > 0) {
		$row = $db->fetchAssoc($result);
		$game_name = $row['game_name'];
		$sub_game_id = $row['game_id'];
		$forced_reel_positions = $row['reel_positions'];
		$forced_reel_positions = explode(";", $row['reel_positions']);
		$forced_game_reels = get_game_reels($game_name, $sub_game_id);

		$tempSubGameId = $round->game->subGameId;
		if($forced_game_reels) {
			$round->game->reels = $forced_game_reels;
			$round->game->subGameId = $sub_game_id;
			$round->reelPointers = $forced_reel_positions;
		}
		/////////////////// To handle the reel pointers in forced . for games having rows 5,7,9....
		/// forced was lagging behinde
		$temp_reel_pointers = [];
		// print_r($round->reelPointers);
		for($i = 0; $i < count($round->reelPointers); $i++) {
			$numRows = $round->game->numRows;
			$offset = ($numRows % 2 != 0) ? ($numRows - 1)/2 : $numRows/2;
			// echo "offset", $offset;
			$reelsetConfig = $round->game->reelsetConfig;
			if ($reelsetConfig or isset($reelsetConfig[$round->spinType]) or isset($reelsetConfig[$round->spinType]["is_mega"])or $reelsetConfig[$round->spinType]["is_mega"] == true) {
				$temp_reel_pointers[$i] = $round->reelPointers[$i] - 1;
			}else{
				$temp_reel_pointers[$i] = $round->reelPointers[$i] + ($offset -1);
				
			}
			
			
			// $temp_reel_pointers[$i] = $round->reelPointers[$i] + ($offset -1);
		}
		//////////////////////////////////
		
		$round->reelPointers = $temp_reel_pointers;
		$round->game->subGameId = $tempSubGameId;
	}

}

function get_game_reels($game_name, $sub_game_id) {
	global $db;

	$game_query = <<<QUERY
		SELECT reels
		  FROM game.slots
		 WHERE game_name = '{$game_name}' AND
		 	   sub_game_id = {$sub_game_id}
QUERY;
	$result = $db->runQuery($game_query) or
		print "Error in game reels query" . $db->error();

	if($db->numRows($result) < 1) {
		return null;
	}

	$row = $db->fetchAssoc($result);
	return json_decode($row['reels']);
}
?>
