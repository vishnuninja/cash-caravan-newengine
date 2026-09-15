<?php
class Game
{
	const BASE_GAME_CONFIG  = "game.slots",
		  BONUS_GAME_CONFIG = "game.bonus_games",
		  ALL_GAMES			= "game.games";

	var $gameId, $subGameId, $gameName, $title, $description, $numRows, $numColumns,
		$minCoins, $maxCoins, $defaultCoins, $defaultCoinValue, $coinValues,
		$paylines, $elements, $wilds, $bonus, $scatters, $reels, $reelsetConfig,
		$payTable, $bonusConfig, $wildMultiplier, $pjpConfig, $unitySymbols,
		$left2Right, $right2Left, $enabled, $symbolConfig, $paylinesConfig,
		$fixedCoins, $paylinesType, $spinType, $misc, $categoryId, $rtp;

	# todo Need to have array of scatters and wilds
	# todo Need to have array of bonus symbol and virtual elements

	public function __construct()
	{
	}

	public static function loadGame($gameId, $subGameId=1)
	{
		global $db;
		$tableName = Game::BASE_GAME_CONFIG;
		$tableAllGames = Game::ALL_GAMES;
		if($_POST['request_type'] == INIT_MODE){
			global $db;
			$op_id = $_SESSION['operator_id'];

		$query = <<<QRY
                        SELECT sub_game_id, rtp
                        FROM gamelobby.var_rtp_games
                        WHERE operator_id ={$op_id}
                        AND game_id  = {$gameId} AND enabled = 1
QRY;
		$result = $db->runQuery($query) or ErrorHandler::handleError(1, "ROUND_RTPSUBGAMEID 1");

		
		if ($db->numRows($result) > 0) {
			$row = $db->fetchAssoc($result) or ErrorHandler::handleError(1, "ROUND_RTPSUBGAMEID 2");
			
			$subGameId = $row['sub_game_id'];
		}
		}

		$loadGame = "
			SELECT gs.game_id, sub_game_id, gs.game_name, gs.title, gs.description, num_rows,
				   num_columns, min_coins, max_coins, default_coins, default_coin_value,
				   coin_values, paylines, elements, wilds, bonus, scatters, symbol_config,
				   reels, reelset_config, pay_table, bonus_config, wild_multiplier,
				   pjp_config, unity_symbols, left2right, right2left, enabled,
				   fixed_coins, paylines_type, spin_type, misc, category_id, gs.rtp
			  FROM {$tableName} AS gs, {$tableAllGames} AS gg
			 WHERE gs.game_id = {$gameId} AND
				   sub_game_id = {$subGameId} AND
				   gs.game_id = gg.game_id";
		$result = $db->runQuery($loadGame) or ErrorHandler::handleError(1, "GAME_ERR1". $loadGame);
		$row    = $db->fetchAssoc($result) or ErrorHandler::handleError(1, "GAME_ERR2");

		if($row['enabled'] == 0 or $row['enabled'] == false) {
			ErrorHandler::handleError(1, 'GAME_DISABLED', 'Game is disabled');
		}

		$gameObj = new Game;
		$gameObj->gameId = $row['game_id'];
		$gameObj->subGameId = $row['sub_game_id'];
		$gameObj->gameName  = $row['game_name'];
		$gameObj->title = $row['title'];
		$gameObj->description = $row['description'];
		$gameObj->numRows = $row['num_rows'];
		$gameObj->numColumns = $row['num_columns'];
		$gameObj->minCoins = $row['min_coins'];
		$gameObj->maxCoins = $row['max_coins'];
		$gameObj->defaultCoins = $row['default_coins'];
		$gameObj->defaultCoinValue = $row['default_coin_value'];
		$gameObj->coinValues = decode_object($row['coin_values']);
		$gameObj->paylines = $row['paylines'];
		$gameObj->elements = decode_object($row['elements']);
		$gameObj->wilds = decode_object($row['wilds']);
		$gameObj->bonus = decode_object($row['bonus']);
		$gameObj->scatters = decode_object($row['scatters']);
		$gameObj->symbolConfig = decode_object($row['symbol_config']);
		$gameObj->reels = decode_object($row['reels']);
		$gameObj->reelsetConfig = decode_object($row['reelset_config']);
		$gameObj->payTable = decode_object($row['pay_table']);
		$gameObj->bonusConfig = decode_object($row['bonus_config']);
		$gameObj->wildMultiplier = $row['wild_multiplier'];
		$gameObj->pjpConfig = decode_object($row['pjp_config']);
		$gameObj->unitySymbols = decode_object($row['unity_symbols']);
		$gameObj->left2Right = $row['left2right'];
		$gameObj->right2Left = $row['right2left'];
		$gameObj->enabled = $row['enabled'];
		$gameObj->fixedCoins = $row['fixed_coins'];
		$gameObj->paylinesType = $row['paylines_type'];
		$gameObj->spinType = $row['spin_type'];
		$gameObj->misc = decode_object($row['misc']);
		$gameObj->categoryId = $row['category_id'];
		$gameObj->rtp = $row['rtp'];

		return $gameObj;
	}



}
?>
