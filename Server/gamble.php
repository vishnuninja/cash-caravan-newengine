<?php
DEFINE('SUIT_MULT', 4);

class Gamble
{
	var $id, $gameId, $roundId, $betAmount,
		$winAmount, $config, $choiceType,
		$playerChoice, $multiplier, $game, $suitValue;

	public function __construct($requestParams, $player, $game)
	{
		$spinType = $game->spinType;

		if(!isset($game->bonusConfig['gamble_config']) or
		   !isset($game->bonusConfig['gamble_config'][$spinType]))
		{
			return;
		}
		$this->accountId = $player->accountId;
		$this->requestParams = $requestParams;
		$this->game = $game;
		$this->suitValue = -1;
	}

	public function updateConfig(&$round)
	{
		global $db;

		$gameId = $this->requestParams['game_id'];
		$amountType = $this->requestParams['amount_type'];
		$accountId = $this->accountId;
		$spinType = $round->spinType;

		$tableName = 'gamelog.gamble';

		if($round->amountType == AMOUNT_TYPE_FUN) {
			$tableName = 'gamelog.gamble_fun';
		}

		$q_query = <<<QRY
		SELECT id, round_id, win_amount,
			   config, multiplier
		FROM   {$tableName}
		WHERE  game_id = {$gameId} AND
			   account_id = {$accountId} AND
			   amount_type = {$amountType} AND
			   status = 0
		ORDER BY id DESC LIMIT 1
QRY;
		$result = $db->runQuery($q_query) or ErrorHandler::handleError(1, "GAMBLE_0001");

		if(!$result || $db->numRows($result) <= 0) {
			return;
		}

		$row = $db->fetchAssoc($result) or ErrorHandler::handleError(1, "GAMBLE_0002");
		$this->gameId       = $gameId;
		$this->roundId      = $row['round_id'];
		$this->betAmount    = $this->requestParams['bet_amount'];
		$this->winAmount    = $row['win_amount'];
		$this->config       = decode_object($row['config']);
		$this->choiceType   = '';
		$this->playerChoice = '';
		$this->multiplier   = $row['multiplier'];
	}
	public function loadConfig(&$round)
	{
		global $db;

		$spinType = $round->spinType;
		$gameId = $this->requestParams['game_id'];
		$amountType = $this->requestParams['amount_type'];

		$q_query = <<<QRY
		SELECT max_bet, max_win,
			   configuration,
			   multiplier, enabled
		FROM   game.gamble
		WHERE  game_id = {$gameId} AND
			   spin_type = '{$spinType}' AND
			   amount_type = {$amountType}
QRY;
		$result = $db->runQuery($q_query) or ErrorHandler::handleError(1, "GAMBLE_0003");

		if(!$result || $db->numRows($result) <= 0) {
			return;
		}

		$row = $db->fetchAssoc($result) or ErrorHandler::handleError(1, "GAMBLE_0004");
		if($row['enabled'] == 0 or $row['enabled'] == false) {
			ErrorHandler::handleError(1, 'GAMBLE_DISABLED', 'Gamble is disabled');
		}
		$this->gameId       = $gameId;
		$this->roundId      = $round->roundId;
		$this->betAmount    = $this->requestParams['bet_amount'];
		$this->winAmount    = $this->requestParams['bet_amount'];
		$this->config       = decode_object($row['configuration']);
		$this->choiceType   = '';
		$this->playerChoice = '';
		$this->multiplier   = $row['multiplier'];

		if ($this->requestParams['pick_position'] != COLLECT) {
			$this->closeGamble();
		}
	}

	private function validatePick($pickedPosition)
	{
		if($pickedPosition < COLOR_1 or $pickedPosition > 7) {
			ErrorHandler::handleError(1, "PICK_0001", "Invalid pick-- position");
		}
	}

	public function playGamble(&$round)
	{
		$this->playerChoice = (int)$this->requestParams['pick_position'];
		$this->validatePick($this->playerChoice);
		$this->checkColor($round);
	}

	private function checkColor(&$round)
	{
            $state = 0;
            $baseRoundId = $round->previousRound['round_id'];
            if(isset($this->game->bonusConfig['gamble_config'][$this->game->spinType]['num_choices']) &&
                    $this->game->bonusConfig['gamble_config'][$this->game->spinType]['num_choices'] == 7) {
                $this->suitValue = get_random_number(4, 7);
                if($this->suitValue == 4 || $this->suitValue == 5) { # if Red Hear or Diamond
                    $this->choiceType = 1; # color is Red
                } else {
                    $this->choiceType = 2; # else color is black
                }
            } else {
                $this->choiceType = get_random_number(COLOR_1,COLOR_2);
            }

            if($this->playerChoice == $this->suitValue) {
                $winAmount = SUIT_MULT * $this->betAmount;
                // if($winAmount > $this->config['max_bet']) {
                // $state = 1;
                // }
                $this->winAmount = $winAmount;
                $this->config['curr_round']++;
                if ($this->config['curr_round'] == $this->config['max_rounds']) {
                    $state = 1;
                }
            }
            else if($this->choiceType == $this->playerChoice)
            {
                $this->config['curr_round']++;
                $this->winAmount = $this->multiplier * $this->betAmount;
                if ($this->config['curr_round'] == $this->config['max_rounds']) {
                    $state = 1;
                }
            }
            else {
                $state = 1;
                $this->winAmount = 0;
            }
            $this->updateGamble($baseRoundId, $state, $round->roundId);

            $gmbl = Array("bet_amount" => $this->betAmount,
                    "win_amount" => $this->winAmount,
                    "picked_color" => $this->playerChoice,
                    "right_color" => $this->choiceType,
                    "suit_value" => $this->suitValue,
                    "state" => $state);

            $round->bonusGameRound = $gmbl;
        }

	private function updateGamble($baseRoundId, $state, $roundId)
	{
		global $db;

		$game_id = $this->gameId;
		$account_id = $this->accountId;
		$amount_type = $this->requestParams['amount_type'];
		$bet_amount = $this->betAmount;
		$win_amount = $this->winAmount;
		$multiplier = $this->multiplier;
		$pickedChoice = $this->playerChoice;
		$rightChoice = $this->choiceType;
		$config = encode_objects($this->config);

		$tableName = 'gamelog.gamble';

        if($round->amountType == AMOUNT_TYPE_FUN) {
                $tableName = 'gamelog.gamble_fun';
        }

		$g_query = <<<QRY
		INSERT INTO {$tableName}(game_id, base_round_id, round_id,
				account_id, bet_amount, win_amount, multiplier,
				amount_type, choice_type,
				player_choice, config, status) VALUES ($game_id,
				$baseRoundId, $roundId, $account_id, $bet_amount,
				$win_amount, $multiplier, $amount_type,
				$rightChoice, $pickedChoice, '{$config}', $state)
QRY;
		$result = $db->runQuery($g_query) or ErrorHandler::handleError(1, "GAMBLE_0005");
		if($state == 1){
			$this->closeGamble();
		}
	}

	private function closeGamble()
	{
		global $db;

		$accountId = $this->accountId;
		$gameId = $this->requestParams['game_id'];
		$amountType = $this->requestParams['amount_type'];

		$tableName = 'gamelog.gamble';

                if($round->amountType == AMOUNT_TYPE_FUN) {
                        $tableName = 'gamelog.gamble_fun';
                }


		$g_query = <<<QRY
		UPDATE  {$tableName}
		SET     status = 1
		WHERE   game_id = $gameId AND
				account_id = $accountId AND
				amount_type = $amountType AND
				status = 0
QRY;
		$result = $db->runQuery($g_query) or ErrorHandler::handleError(1, "GAMBLE_0006");
	}

	public function checkGamble($round)
	{
		global $db;

		$accountId = $this->accountId;
		$gameId = $this->requestParams['game_id'];
		$amountType = $this->requestParams['amount_type'];
		$preRoundId = $round->previousRound['round_id'];

		$tableName = 'gamelog.gamble';

                if($round->amountType == AMOUNT_TYPE_FUN) {
                        $tableName = 'gamelog.gamble_fun';
                }


		$g_query = <<<QRY
		SELECT  *
		FROM    {$tableName}
		WHERE   game_id = $gameId AND
				account_id = $accountId AND
				amount_type = $amountType AND
				round_id = $preRoundId AND
				status = 1
QRY;
		$result = $db->runQuery($g_query);
		if(is_bool($result) or $db->numRows($result) > 0){
			ErrorHandler::handleError(1, "Invalid Gamble game (GAMBLE_0007)");
		}
	}
}
?>
