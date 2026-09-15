<?php
require_once 'game.php';
require_once 'round.php';
if (isset($_POST['session_id']) && ($_POST['session_id'] == "" || strlen($_POST['session_id']) <= 0)) {
  require_once 'player_inhouse.php';
} else {
  require_once 'player.php';
}

require_once 'gamble.php';
require_once 'handlers.php';
require_once 'round_id.inc.php';
require_once 'force_outcome.php';
require_once 'bonus_games/bonus_factory.php';
require_once 'bonus_games/ageofdavinci_bonus_game.php';
require_once 'bonus_games/candyburst_bonus_game.php';
require_once 'bonus_games/warriorsquest_bonus_game.php';
require_once 'linewins/line_win_factory.inc.php';
function close_expired_pfs($game, $round, $player)
{
  if (
    (!isset($round->freeSpins['amount_type'])
      || $round->freeSpins['amount_type'] != AMOUNT_TYPE_PFS)
    && (!isset($round->bonusGames['amount_type'])
      || $round->bonusGames['amount_type'] != AMOUNT_TYPE_PFS)
  ) {
    // call pfs end clouser
    // if any other PFS is in pending send that to client.
    $pfs_record_ids = array(); // TODO this will be useful when multiple ids send at same time in end-pfs-call
    $round_id = get_round_id('round_id');
    for ($i = 0; $i < count($player->promoDetails['expired']); $i++) {
      $expired_pfs = array(
        'expired' => 1,
        'pfs_round_id' => $player->promoDetails['expired'][$i]['record_id'],
        'win_amount' => $player->promoDetails['expired'][$i]['win_amount'],
        'game_name' => $player->promoDetails['expired'][$i]['game_name'],
        'game_mode' => 'normal',
        'round_id' => $round_id,
        'base_round_id' => $round_id,
        'round_end_state' => 1,
        'platform' => $_REQUEST['platform_type'],
        'promo_freespins' => 1
      );
      $player->endPFSGame($game->categoryId, $game->gameId, $round->amountType, $expired_pfs);
    }

    if (count($player->promoDetails['alive']) > 0) {
      $player->promoDetails['curr_spin'] = $player->promoDetails['alive'][0];
    } else {
      $player->promoDetails['curr_spin'] = array();
    }
  }

}

function close_abandoned_fun($round, $player, $request_params)
{

  global $db;

  if (
    $request_params['amount_type'] == AMOUNT_TYPE_FUN &&
    $request_params['request_type'] == INIT_MODE
  ) {
    $fs_table = "gamelog.bonus_games_fun";
    $bonus_table = "gamelog.freespins_fun";
    $queued_table = "gamelog.queued_bonus_games_fun";

    $query1 = <<<QR
                UPDATE {$fs_table} SET state=1 WHERE account_id={$player->accountId}
                AND game_id={$round->game->gameId} AND state=0;
QR;

    $query2 = <<<QR
                UPDATE {$bonus_table} SET state=1 WHERE account_id={$player->accountId}
                AND game_id={$round->game->gameId} AND state=0;
QR;


    $query3 = <<<QR
                UPDATE {$queued_table} SET state=1 WHERE account_id={$player->accountId}
                AND game_id={$round->game->gameId} AND state=0;
QR;

    $db->runQuery($query1) or ErrorHandler::handleError(1, "CASINOLIB_KILL_FUN 1");
    $db->runQuery($query2) or ErrorHandler::handleError(1, "CASINOLIB_KILL_FUN 2");
    $db->runQuery($query3) or ErrorHandler::handleError(1, "CASINOLIB_KILL_FUN 3");
  }

}

function handle_initialization(&$game, &$round, &$player)
{

  close_expired_pfs($game, $round, $player);
  load_misc_data($game, $round, $player);
  load_initializers($game, $round, $player);
  $player->ResetDemoBalance($round);
  if (!$round->bonusGames) {
    return;
  }

  $bonus_factory = new BonusFactory($game, $round);
  $bonus_game_id = $round->bonusGames['bonus_game_id'];
  $bonus_object = $bonus_factory->getObjectFromId($bonus_game_id);
  if (!$bonus_object or empty($bonus_object)) {
    ErrorHandler::handleError(1, "Invalid bonus game (CASINO_LIB009)");
  }
  $bonus_object->loadBonusGame();

}

function load_initializers(&$game, &$round, &$player)
{
  if (!array_key_exists('initializers', $game->misc) or count($game->misc['initializers']) <= 0) {

    return;
  }
  $count = count($game->misc['initializers']);
  for ($i = 0; $i < $count; $i++) {
    $bonus_factory = new BonusFactory($game, $round);
    $bonus_game_id = $game->misc['initializers'][$i]['bonus_game_id'];
    $bonus_object = $bonus_factory->getObjectFromId($bonus_game_id);

    $bonus_object->loadBonusGame();
  }
}


function load_misc_data(&$game, &$round, &$player)
{
  $bonus_game_id = 0;
  if (isset($game->bonusConfig['post_win_handlers']['normal'][0]['bonus_game_id'])) {
    $bonus_game_id = $game->bonusConfig['post_win_handlers']['normal'][0]['bonus_game_id'];
  }

  if (!is_valid_misc_bonus_game_id($bonus_game_id)) {
    return;
  }

  $bonus_factory = new BonusFactory($game, $round);
  $bonus_object = $bonus_factory->getObjectFromId($bonus_game_id);
  if (!$bonus_object or empty($bonus_object)) {
    ErrorHandler::handleError(1, "Invalid bonus game (CASINO_LIB009)");
  }
  $bonus_object->loadBonusGame();
}

function handle_spin(&$game, &$round, &$player)
{
  if ($round->bonusGames) {

    $round->requestParams['request_type'] = 1;
    handle_initialization($game, $round, $player);
    return;
  }

  if ($round->spinType != 'normal' || isset($round->freeSpins)) {
    $round->setBetDetails(
      $round->freeSpins['coin_value'],
      $round->freeSpins['num_coins'],
      $round->freeSpins['num_betlines']
    );
  } else {
    $round->setBetDetails(
      $round->requestParams['coin_value'],
      $round->requestParams['num_coins'],
      $round->requestParams['num_betlines']
    );


  }

  $round_id_key = "round_id";

  if ($round->amountType == AMOUNT_TYPE_FUN) {
    $round_id_key = 'round_id_fun';
  }


  # todo do the logging
  # debits and credits here
  if ($round->player->amountType != AMOUNT_TYPE_PFS && $_POST['request_type'] != INIT_MODE && !isset($round->freeSpins)) {
    $round->player->promoDetails = array();
  }
  $round->roundId = get_round_id($round_id_key);
  $pre_balance = $player->balance;
  $base_round_id = $round->getBaseRoundId();
  $round_end_state = $round->getRoundEndState();
  // Ante bet
  $round->getAnteBetPrize();

  if (is_wager_allowed($game, $round, $player)) {
    $prevBaseRoundId = $round->getPrevBaseRoundId();
    if ($prevBaseRoundId > 0) {
      $win_amount_gc = 0;
      $round_end_state_gc = 1;
      // $player->updateBalance($
      $round->closeRoundId($prevBaseRoundId, $round_end_state_gc);
    }
    /**
     * todo need to update this whole player transactions layer
     * Check Player Balance before debit
     * Change the game type from 'SL'
     */
    $num_coins = $round->totalBet / $round->requestParams['coin_value'];

    $context = array(
      'supermeter' => to_base_currency($round->requestParams['coin_value2'] * $num_coins),
      'cash' => to_base_currency($round->totalBet - ($round->requestParams['coin_value2'] * $num_coins))
    );

    validate_wager_limit($round, $player);
    $player->updateBalance(
      $game->categoryId,
      $round->totalBet,
      $game->gameId,
      WAGERING,
      $round->amountType,
      $round->roundId,
      $game->gameName,
      $round->spinType,
      $base_round_id,
      $round_end_state,
      $round->requestParams['platform_type'],
      $context
    );

    # todo what should happen if wagering fails
    # todo TODO kill the API and check what happends with failed Debit request
  }
  SpinHandler::handleSpin($game, $round);

  //$round_end_state = $round->getRoundEndState();
  $round_end_state = $round->getRoundStatePostDebit();
  # @ todo: ensure if debit has not happened, crediting should not happen
  # @ todo: need to change hardcoded money_type
  $player->updateBalance(
    $game->categoryId,
    $round->winAmount,
    $game->gameId,
    WINNING,
    $round->amountType,
    $round->roundId,
    $game->gameName,
    $round->spinType,
    $base_round_id,
    $round_end_state,
    $round->requestParams['platform_type']
  );

  $player->loadPlayerDetails();
  #$player->endGameRound($round_end_state, $base_round_id);

  // fun_mode
  if ($round->amountType == AMOUNT_TYPE_FUN) {
    return;
  }

  $extra_data = array(
    'round_id' => $round->roundId,
    'game_name' => $game->gameName,
    'spin_type' => $round->spinType,
    'base_round_id' => $base_round_id,
    'platform' => $round->requestParams['platform_type']
  );

  //   $player->endPFSGame(
  //   $game->categoryId,
  //   $game->gameId,
  //   $round->amountType,
  //   array(),
  //   $extra_data
  // );
  log_round($game, $round, $player, $pre_balance);
}


function handle_extra_fg_request(&$game, &$round, &$player)
{
  if ($round->bonusGames) {
    $round->requestParams['request_type'] = 1;
    handle_initialization($game, $round, $player);
    return;
  }
  // echo "2";

  if ($round->spinType != 'normal' || isset($round->freeSpins)) {
    return;
  } else {
    $round->setBetDetails(
      $round->requestParams['coin_value'],
      $round->requestParams['num_coins'],
      $round->requestParams['num_betlines']
    );


  }

  $round_id_key = "round_id";

  if ($round->amountType == AMOUNT_TYPE_FUN) {
    $round_id_key = 'round_id_fun';
  }

  // buy Fg

  # todo do the logging
  # debits and credits here
  if ($round->player->amountType != AMOUNT_TYPE_PFS && $_POST['request_type'] != INIT_MODE && !isset($round->freeSpins)) {
    $round->player->promoDetails = array();
  }
  $round->roundId = get_round_id($round_id_key);
  $pre_balance = $player->balance;
  $base_round_id = $round->getBaseRoundId();
  $round->getBuyFgBetPrize();
  $round->totalBet;
  $round_end_state = $round->getRoundEndState();
  $round->totalBet;
  if (is_wager_allowed($game, $round, $player)) {
    $prevBaseRoundId = $round->getPrevBaseRoundId();
    if ($prevBaseRoundId > 0) {
      $win_amount_gc = 0;
      $round_end_state_gc = 1;
      // $player->updateBalance($
      $round->closeRoundId($prevBaseRoundId, $round_end_state_gc);
    }

    /**
     * todo need to update this whole player transactions layer
     * Check Player Balance before debit
     * Change the game type from 'SL'
     */


    $num_coins = $round->totalBet / $round->requestParams['coin_value'];

    $context = array(
      'supermeter' => to_base_currency($round->requestParams['coin_value2'] * $num_coins),
      'cash' => to_base_currency($round->totalBet - ($round->requestParams['coin_value2'] * $num_coins))
    );

    validate_wager_limit($round, $player);
    $player->updateBalance(
      $game->categoryId,
      $round->totalBet,
      $game->gameId,
      WAGERING,
      $round->amountType,
      $round->roundId,
      $game->gameName,
      $round->spinType,
      $base_round_id,
      $round_end_state,
      $round->requestParams['platform_type'],
      $context
    );

    # todo what should happen if wagering fails
    # todo TODO kill the API and check what happends with failed Debit request
  }

  // $round->generateExtraFG($round, $player);
  // SpinHandler::handleSpin($game, $round);
  //$round_end_state = $round->getRoundEndState();
  ExtraFgSpin::handleFgSpin($game, $round);
  $round_end_state = $round->getRoundStatePostDebit();
  # @ todo: ensure if debit has not happened, crediting should not happen
  # @ todo: need to change hardcoded money_type
  $player->updateBalance(
    $game->categoryId,
    $round->winAmount,
    $game->gameId,
    WINNING,
    $round->amountType,
    $round->roundId,
    $game->gameName,
    $round->spinType,
    $base_round_id,
    $round_end_state,
    $round->requestParams['platform_type']
  );

  # @ todo: ensure if debit has not happened, crediting should not happen
  # @ todo: need to change hardcoded money_type
  // $player->updateBalance($game->categoryId, $round->winAmount, $game->gameId,
  // WINNING, $round->amountType, $round->roundId, $game->gameName,
  // $round->spinType, $base_round_id, $round_end_state, $round->requestParams['platform_type']);

  $player->loadPlayerDetails();
  #$player->endGameRound($round_end_state, $base_round_id);

  // fun_mode
  if ($round->amountType == AMOUNT_TYPE_FUN) {
    return;
  }

  $extra_data = array(
    'round_id' => $round->roundId,
    'game_name' => $game->gameName,
    'spin_type' => $round->spinType,
    'base_round_id' => $base_round_id,
    'platform' => $round->requestParams['platform_type']
  );

  // $player->endPFSGame(
  //   $game->categoryId,
  //   $game->gameId,
  //   $round->amountType,
  //   array(),
  //   $extra_data
  // );
  log_round($game, $round, $player, $pre_balance);

}


function validate_wager_limit($round, $player)
{
  global $db;
  $player_id = $player->accountId;

  $query = <<<QUERY
            select timeinterval, wager_amount from player.wager_limit where player_id = {$player_id}

QUERY;

  $rows = $db->runQuery($query) or ErrorHandler::handleError(1, "CASINO_LIB00111");

  while ($row = $db->fetchAssoc($rows)) {
    //continue;
    $wager_limit = $row['wager_amount'];
    $timeinterval = $row['timeinterval'];

    if ($row['timeinterval'] == 'daily') {
      $start_date = date("Y-m-d");
      $stop_date = date('Y-m-d H:i:s', strtotime($start_date . ' +1 day'));
    }
    if ($row['timeinterval'] == 'weekly') {
      $start_date = date("Y-m-d");
      $stop_date = date('Y-m-d H:i:s', strtotime($start_date . ' +1 day'));
      $start_date = date('Y-m-d H:i:s', strtotime($start_date . ' -6 day'));
    }

    $query = <<<QUERY
                  select SUM(amount_bet) total_wager
                  FROM gamelog.round
                  WHERE account_id = {$player_id} AND amount_type={$round->amountType}
                  AND timestamp >= '{$start_date}' AND timestamp < '{$stop_date}'
QUERY;

    $rows_data = $db->runQuery($query);
    $row_data = $db->fetchAssoc($rows_data);
    $wager_amt = $row_data['total_wager'];
    $total_wager_amt = $wager_amt + to_base_currency($round->totalBet);

    if ($total_wager_amt >= $wager_limit) {
      ErrorHandler::handleError(1, "WAGER_LIMIT", 'You have reached your wagering limit for the day. Please visit us tomorrow to enjoy our games.');
    }
  }

  $start_date = date("Y-m-d");
  $stop_date = date('Y-m-d H:i:s', strtotime($start_date . ' +1 day'));
}


function handle_bonus_round(&$game, &$round, &$player)
{
  if (
    !isset($round->bonusGames['bonus_game_id']) or
    $round->requestParams['bonus_game_id'] != $round->bonusGames['bonus_game_id']
  ) {
    ErrorHandler::handleError(1, "Invalid bonus game (CASINO_LIB008)");
  }

  $bonus_factory = new BonusFactory($game, $round);
  $bonus_game_id = $round->bonusGames['bonus_game_id'];
  $bonus_object = $bonus_factory->getObjectFromId($bonus_game_id);
  if (!$bonus_object or empty($bonus_object)) {
    ErrorHandler::handleError(1, "Invalid bonus game (CASINO_LIB009)");
  }

  $round->setSpinType('bonus');

  $pick_position = $round->requestParams['pick_position'];
  $bonus_object->playBonusGame($pick_position);
  $base_round_id = $round->getBaseRoundId();
  //$round_end_state = $round->getRoundEndState();
  $round_end_state = $round->getRoundStatePostDebit();

  if ($round->bonusGameRound['state'] === 1 && $round->winAmount > 0) {
    $player->updateBalance(
      $game->categoryId,
      $round->winAmount,
      $game->gameId,
      WINNING,
      $round->amountType,
      $round->bonusGames['round_id'],
      $game->gameName,
      $round->spinType,
      $base_round_id,
      $round_end_state,
      $round->requestParams['platform_type']
    );
    update_prev_round_state($game, $round, $player);
  }
  #$player->loadPlayerDetails();
  #$player->endGameRound($round_end_state, $base_round_id);

  $round->setPromoFs();

  $extra_data = array(
    'round_id' => $base_round_id, // Pick bonus has no round id
    'game_name' => $game->gameName,
    'spin_type' => $round->spinType,
    'base_round_id' => $base_round_id,
    'platform' => $round->requestParams['platform_type']
  );

  if ($round->bonusGameRound['state'] === 1) {
    // $player->endPFSGame(
    //   $game->categoryId,
    //   $game->gameId,
    //   $round->amountType,
    //   array(),
    //   $extra_data
    // );
  }
}

function handle_game_end_round(&$game, &$round, &$player)
{
  if (isset($round->freeSpins['id']) && $round->freeSpins['id'] > 0) {
    $baseRoundId = $round->freeSpins['base_round_id'];
    $state = 0;
  } else if (
    isset($round->bonusGames['id'])
    && $round->bonusGames['id'] > 0
  ) {
    $baseRoundId = $round->bonusGames['base_round_id'];
    $state = 0;
  } else if (
    isset($round->queuedBonusGames['id']) &&
    $round->queuedBonusGames['id'] > 0
  ) {
    $baseRoundId = $round->queuedBonusGames['base_round_id'];
    $state = 0;
  } else {
    /*$baseRoundId = isset($round->previousRound['round_id']) ?
        $round->previousRound['round_id'] : 0;*/
    # $this->game->gameId, $this->player->accountId
    $baseRoundIdData = $round->getRecentBaseRoundId($game->gameId, $player->accountId);
    $state = 1;

    if (
      !isset($baseRoundIdData['round_id']) || !$baseRoundIdData['round_id'] ||
      !isset($baseRoundIdData['closed']) || $baseRoundIdData['closed'] == 1
    ) {
      $state = 0;
    }

    $baseRoundId = $baseRoundIdData['round_id'];
  }

  if ($state === 0) {
    return;
  }

  $result = $player->endGameRound($state, $baseRoundId);
  $round->setRoundEndData($result);

  if (isset($result['error']) && $result['error'] == 0) {
    $round->closeRoundId($baseRoundId, $state);
  }

}

function handle_gamble_round(&$game, &$round, &$player)
{
  $preRoundWin = to_coin_currency($round->previousRound['amount_won']);

  if ($preRoundWin == 0 || $preRoundWin === '') {
    ErrorHandler::handleError(1, "Invalid Gamble game (CASINO_LIB012)");
  }

  $betAmount = $round->requestParams['bet_amount'];
  $gamble = new Gamble($round->requestParams, $player, $game);

  if ($betAmount == $preRoundWin && !isset($round->gamble)) {
    $gamble->checkGamble($round);
    $gamble->loadConfig($round);
  } else if (isset($round->gamble)) {
    $gamble->updateConfig($round);
  } else {
    ErrorHandler::handleError(1, "Invalid Gamble game (CASINO_LIB0123)");
  }

  $reqst = (int) $round->requestParams['pick_position'];
  if ($gamble->betAmount != $gamble->winAmount && $reqst != COLLECT) {
    ErrorHandler::handleError(1, "Invalid Gamble game (CASINO_LIB011)");
  }
  /**
   * todo need to update this whole player transactions layer
   * Check Player Balance before debit
   * Change the game type from 'SL'
   */
  # todo TODO: what round->spinType is being for gamble round ?
  $round->roundId = get_round_id("round_id");
  $base_round_id = $round->getBaseRoundId();
  $round_end_state = $round->getRoundEndState();
  #$preRoundId = $round->previousRound['round_id'];
  if ($reqst == COLOR_1 or $reqst == COLOR_2 or $reqst == 4 or $reqst == 5 or $reqst == 6 or $reqst == 7) {
    $player->updateBalance(
      $game->categoryId,
      $gamble->betAmount,
      $game->gameId,
      WAGERING,
      $round->amountType,
      $round->roundId,
      $game->gameName,
      $round->spinType,
      $base_round_id,
      $round_end_state,
      $round->requestParams['platform_type']
    );
  }

  $gamble->playGamble($round);

  if ($reqst != COLLECT) {
    $round_end_state = 1;
    $player->updateBalance(
      $game->categoryId,
      $gamble->winAmount,
      $game->gameId,
      WINNING,
      $round->amountType,
      $round->roundId,
      $game->gameName,
      $round->spinType,
      $base_round_id,
      $round_end_state,
      $round->requestParams['platform_type']
    );

    $operatorCodes = array('DGM');
    $code = substr($_SESSION['full_site_code'], 2, 3);

    if (in_array($code, $operatorCodes)) {
      $state = 1;
      $result = $player->endGameRound($state, $round->roundId);
      $round->setRoundEndData($result);

      if (isset($result['error']) && $result['error'] == 0) {
        $round->closeRoundId($round->roundId, $state);
      }
    }
  }
  #$player->loadPlayerDetails();
}

function handle_other_request(&$game, &$round, &$player)
{
  if (
    !isset($round->bonusGames['bonus_game_id']) or
    $round->requestParams['bonus_game_id'] != $round->bonusGames['bonus_game_id']
  ) {
    ErrorHandler::handleError(1, "Invalid bonus game (CASINO_LIB009)");
  }

  $bonus_factory = new BonusFactory($game, $round);
  $bonus_game_id = $round->bonusGames['bonus_game_id'];
  $bonus_object = $bonus_factory->getObjectFromId($bonus_game_id);
  if (!$bonus_object or empty($bonus_object)) {
    ErrorHandler::handleError(1, "Invalid bonus game (CASINO_LIB009)");
  }
  $round->setSpinType('normal');
  $bonus_object->playBonusGame($round->requestParams['pick_position']);
  $base_round_id = $round->getBaseRoundId();
  //$round_end_state = $round->getRoundEndState();
  $round_end_state = $round->getRoundStatePostDebit();

  if ($round->bonusGameRound['state'] === 1 && $round->winAmount > 0) {
    $player->updateBalance(
      $game->categoryId,
      $round->winAmount,
      $game->gameId,
      WINNING,
      $round->amountType,
      $round->bonusGames['round_id'],
      $game->gameName,
      $round->spinType,
      $base_round_id,
      $round_end_state,
      $round->requestParams['platform_type']
    );
    update_prev_round_state($game, $round, $player);
  }
  #$player->loadPlayerDetails();
  #$player->endGameRound($round_end_state, $base_round_id);

  $round->setPromoFs();

  $extra_data = array(
    'round_id' => $base_round_id, // Pick bonus has no round id
    'game_name' => $game->gameName,
    'spin_type' => $round->spinType,
    'base_round_id' => $base_round_id,
    'platform' => $round->requestParams['platform_type']
  );

  if ($round->bonusGameRound['state'] === 1) {
    // $player->endPFSGame(
    //   $game->categoryId,
    //   $game->gameId,
    //   $round->amountType,
    //   array(),
    //   $extra_data
    // );
  }
}

function handle_collect_request1(&$game, &$round, &$player)
{
  $round_id_key = "round_id";
  $round->roundId = get_round_id($round_id_key);

  $base_round_id = $round->roundId;
  $round_end_state = 0;
  /*$context = Array(
      'supermeter' => 0,
      'cash' => 1);

$player->updateBalance($game->categoryId, 100, $game->gameId,
      WAGERING, $round->amountType, $round->roundId, $game->gameName,
      $round->spinType, $base_round_id, $round_end_state, $round->requestParams['platform_type'],
      $context);*/
  # todo what should happen if wagering fails
  # todo TODO kill the API and check what happends with failed Debit request

  $context = array("super_meter_collect" => 1);
  $base_round_id = $round->roundId;
  $round_end_state = 1;

  $player->updateBalance(
    $game->categoryId,
    to_coin_currency($player->cash2 + 1),
    $game->gameId,
    WINNING,
    $round->amountType,
    $base_round_id,
    $game->gameName,
    $round->spinType,
    $base_round_id,
    $round_end_state,
    $round->requestParams['platform_type'],
    $context
  );
}

function handle_collect_request(&$game, &$round, &$player)
{
  $round->roundId = $round->getPrevBaseRoundId();
  $context = array("super_meter_collect" => 1);
  $base_round_id = $round->roundId;
  $round_end_state = 1;

  $player->updateBalance(
    $game->categoryId,
    to_coin_currency($player->cash2),
    $game->gameId,
    WINNING,
    $round->amountType,
    $base_round_id,
    $game->gameName,
    $round->spinType,
    $base_round_id,
    $round_end_state,
    $round->requestParams['platform_type'],
    $context
  );

  $round->closeRoundId($base_round_id, $round_end_state);
}

function handle_default_request(&$game, &$round, &$player)
{
  return;
}

function get_round_id($category = 'round_id')
{
  $roundIdObj = new RoundId($category);
  $round_id = $roundIdObj->nextRoundId();
  unset($roundIdObj);

  return $round_id;
}

function is_wager_allowed($game, $round, $player)
{
  # todo need to complete this function
  # todo TODO allow only if player balance > 0
  if ($round->spinType == 'normal') {
    return true;
  }

  return false;
}

function log_round($game, $round, $player, $pre_balance)
{
  global $db;

  if (defined('ENGINE_MODE_SIMULATION') && ENGINE_MODE_SIMULATION) {
    return; # for simulation code simcode
  }

  # todo look at the following if block
  /*if($game->spin_type == SPINTYPE_DUMMY || $game->money_type == MONEYTYPE_FREE) {
     return 0;
   }*/


  $game_id = $game->gameId;
  $sub_game_id = $game->subGameId;
  $account_id = $player->accountId;
  $round_id = $round->roundId;
  $coin_value = $round->coinValue;
  $num_coins = $round->numCoins;
  $num_betlines = $round->numBetLines;
  $reel_pointers = array1d_to_string($round->reelPointers);
  $matrix = $round->matrixString;
  $win_lines = array2d_to_string($round->winLineNumbers, '-');
  $amount_bet = 0;
  $amount_won = to_base_currency($round->winAmount);
  $amount_type = $round->amountType;
  $spin_type = get_spin_type($round->spinType);
  $currency = $player->currency;
  $matrix2 = '';
  $state = 1;
  $ip_address = get_user_ip_address();
  $balance = $player->balance;
  $betlines = $round->numBetLines;
  $bet_status = "lose";
  if ($amount_won > 0) {
    $bet_status = "win";
  }

  if (isset($game->misc['pay_lines'])) {
    $num_betlines = 0;
    $betlines = 1;
  }
  if ($round->spinType === "normal") {
    $amount_bet = to_base_currency($round->totalBet);
    if (isset($round->bonusGamesWon) && count($round->bonusGamesWon) > 0) {
      $state = 0;
    }
  } else {
    if ($round->freespinState == 1) {
      update_round_state($game, $round, $player);
    }
    if ($round->spinType === 'respin') {
      if (
        $round->parentSpintype == 'normal' &&
        count($round->bonusGamesWon) == 0
      ) {
        update_round_state($game, $round, $player);
      }
      if (
        $round->parentSpintype == '' &&
        $round->respinState == 1
      ) {
        if (
          isset($round->freespinState) &&
          $round->freespinState == 1
        ) {
          update_round_state($game, $round, $player);
        } elseif (!isset($round->freespinState)) {
          update_round_state($game, $round, $player);
        }
      }
    }
  }

  if (isset($round->postMatrixInfo['matrixString'])) {
    $matrix2 = $round->postMatrixInfo['matrixString'];
  }

  $cash_wagering_pct = 0;
  $bonus_amount_wagering_pct = 0;

  if (isset($round->previousRound['misc']['wager_split'])) {
    $cash_wagering_pct = $round->previousRound['misc']['wager_split']['cash_wagering_pct'];
    $bonus_amount_wagering_pct = $round->previousRound['misc']['wager_split']['bonus_amount_wagering_pct'];
  }

  if ($player->cashWageringPct > 0 or $player->bonusAmountWageringPct > 0) {
    $cash_wagering_pct = $player->cashWageringPct;
    $bonus_amount_wagering_pct = $player->bonusAmountWageringPct;
  }

  // TODO remove hardcoded amount type 3
  if ($cash_wagering_pct === 0 and $bonus_amount_wagering_pct === 0 and $round->amountType != 3) {
    ErrorHandler::handleError(1, "WAGER_PCT_ERROR_001");
  }

  if ($round->amountType == 3) {
    $balance = 0;
    $pre_balance = 0;
  }

  $misc = array(
    'wager_split' => array(
      'cash_wagering_pct' => $cash_wagering_pct,
      'bonus_amount_wagering_pct' => $bonus_amount_wagering_pct
    )
  );
  if (isset($round->previousRound['misc']['rage_meter'])) {
    $misc['rage_meter'] = $round->previousRound['misc']['rage_meter'];
  }
  if (isset($round->previousRound['misc']['log']) && $round->spinType != "normal") {
    $misc['log'] = $round->previousRound['misc']['log'];
  }
  $misc = encode_objects($misc);

  $logQry = <<<QUERY
      INSERT INTO gamelog.round(game_id, sub_game_id, account_id, round_id,
      			  coin_value, num_coins, num_betlines, reel_pointers, matrix,
      			  win_lines, amount_bet, amount_won, amount_type, pre_balance,
      			  post_balance, bet_status, spin_type,
      			  currency, matrix2, state, ip_address, misc)
      	   VALUES ($game_id, $sub_game_id, $account_id, $round_id, $coin_value,
      	   		   $num_coins, $num_betlines, '$reel_pointers', '$matrix', '$win_lines',
      	   		   $amount_bet, $amount_won, $amount_type, $pre_balance, $balance,
      	   		   '$bet_status', $spin_type, '$currency', '$matrix2', $state,
                   '$ip_address', '$misc')
QUERY;

  $result = $db->runQuery($logQry) or ErrorHandler::handleError(1, "CASINO_LIB001");

  // Below if condition will handle games like alchemist
  if (isset($round->otherWins['cluster_wins']) && $round->otherWins['cluster_wins'] != '') {
    $cluster_data = encode_objects($round->otherWins['cluster_wins']);
    $logCluster = <<<QUERY
            INSERT INTO gamelog.round_cluster(game_id, sub_game_id, account_id, round_id,
                      coin_value, num_coins, num_betlines, reel_pointers, matrix,
                      win_lines, amount_bet, amount_won, amount_type, pre_balance,
                      post_balance, bet_status, spin_type,
                      currency, matrix2, state, ip_address, misc)
            VALUES ($game_id, $sub_game_id, $account_id, $round_id, $coin_value,
                       $num_coins, $num_betlines, '$reel_pointers', '$matrix', '$win_lines',
                       $amount_bet, $amount_won, $amount_type, $pre_balance, $balance,
                       '$bet_status', $spin_type,
                       '$currency', '$matrix2', $state, '$ip_address', '$cluster_data')
QUERY;
    $result = $db->runQuery($logCluster) or ErrorHandler::handleError(1, "CASINO_LIB001CLUSTER");
  }

  $prevQry = <<<QUERY
     REPLACE INTO gamelog.prev_round (game_id, sub_game_id, account_id, round_id,
      			  coin_value, num_coins, num_betlines, reel_pointers, matrix,
      			  win_lines, amount_bet, amount_won, amount_type, pre_balance,
      			  post_balance, bet_status, spin_type,
      			  currency, matrix2, state, ip_address, misc)
      	   VALUES ($game_id, $sub_game_id, $account_id, $round_id, $coin_value,
      	   		   $num_coins, $betlines, '$reel_pointers', '$matrix', '$win_lines',
      	   		   $amount_bet, $amount_won, $amount_type, $pre_balance, $balance,
      	   		   '$bet_status', $spin_type, '$currency', '$matrix2', $state,
                   '$ip_address', '$misc')
QUERY;
  $result = $db->runQuery($prevQry) or ErrorHandler::handleError(1, "CASINO_LIB002");
}
function get_user_ip_address()
{
  if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $ip_address = $_SERVER['HTTP_CLIENT_IP'];
  }
  //whether ip is from proxy
  elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'];
  }
  //whether ip is from remote address
  else {
    $ip_address = $_SERVER['REMOTE_ADDR'];
  }
  return $ip_address;
}
function update_prev_round_state($game, $round, $player)
{
  if ($round->bonusGameRound['prize'] == 'multiplier') {
    global $db;

    $round_id = $round->bonusGames['round_id'];

    $query = "UPDATE gamelog.round
					SET state=1, timestamp=timestamp
					WHERE game_id = {$game->gameId} AND
						account_id = {$player->accountId} AND
						round_id <= {$round_id}";

    $result = $db->runQuery($query);
  }
}
function update_round_state($game, $round, $player)
{
  global $db;

  $query = "UPDATE gamelog.round
				SET state=1, timestamp=timestamp
				WHERE game_id = {$game->gameId} AND
					account_id = {$player->accountId} AND
					round_id < {$round->roundId}";

  $result = $db->runQuery($query);
}
function get_spin_type($spin_type)
{
  global $spin_types;

  if (!isset($spin_types[$spin_type])) {
    ErrorHandler::handleError(1, "CASINO_LIB007");
  }

  return $spin_types[$spin_type];
}

# Egpyt Cleopatra
function handle_sticky_wild_reel(&$round, $details)
{
  $range_Bar = $details['range_bar'];# range_Bar is max limit of progress_bar
  $level_Length = $details['level_length'];# level_Length is 4 points(4 bonus symbols)
  $bonus_symbol = $details['bonus_symbol'];
  $sticky_symbol = $details['sticky_symbol'];

  $old_level = $round->freeSpins['details']['level'];# intial level of progress_bar(default is 0)
  $progress_bar = $round->freeSpins['details']['progress_bar'];# default value is 0
  $positions = $round->freeSpins['details']['positions'];
  $bonus_details = $round->freeSpins['details']['bonus_details'];

  foreach ($bonus_details as $key => $value) {
    if ($value['type'] == "progress_bar") {
      continue;
    } else if ($value['type'] == "sticky_wilds_reel") {
      $sticky_reel = $details['levels'][$old_level]['sticky_wilds_reel'];
      sticky_wild_reel($round, $sticky_reel, $sticky_symbol, $bonus_symbol);
      $round->matrixString = array2d_to_string($round->matrix);
      sticky_wild_reel($round, $sticky_reel, $sticky_symbol, "");
    } else if ($value['type'] == "multiplier") {
      $round->game->wildMultiplier = $details['levels'][$old_level]['multiplier'];
    } else if ($value['type'] == "win_both_ways") {
      $round->game->right2Left = $details['levels'][$old_level]['right2left'];
    }
  }
  $progress_bar += get_element_count($round->matrixFlatten, $bonus_symbol);

  # checks progress_bar is with in range(0 -20).
  $progress_bar = ($progress_bar < $range_Bar) ? $progress_bar : $range_Bar;
  $level = floor($progress_bar / $level_Length);

  $sticky_wild_reel = $details['levels'][$level]['sticky_wilds_reel'];

  $extra_spin = 0;
  $feature_Won = array();

  while ($old_level != $level) {
    $old_level++;
    $nm_spins = $details['levels'][$old_level]['freespins'];
    $extra_spin += $nm_spins;
    $awards = $details['levels'][$old_level]['awards'];

    # while level change features awards to bonusGamesWon
    $levelChangeInfo =
      array(
        'type' => 'freespins',
        'new_level' => $level,
        'num_spins' => $extra_spin,
        'spins_left' => $round->freeSpins['spins_left']
      );

    if ($awards == 'win_both_ways') {
      $feature_Won = array('type' => $awards);
      array_push($bonus_details, $feature_Won);
      $feature_Won['freespins'] = $nm_spins;

    } else if ($awards == 'sticky_wilds_reel') {
      $reel = get_matrix_indexes($round, $positions, end($sticky_wild_reel));
      $feature_Won = array(
        'type' => $awards,
        'sticky_symbol' => $sticky_symbol,
        'freespins' => $nm_spins,
        'positions' => $reel
      );
      $positions = array_merge($positions, $reel);
      $bonus_details = simplify_object($bonus_details, $sticky_symbol, $positions);
    } else {
      $feature_Won = array(
        'type' => $awards,
        'value' => $details['levels'][$old_level][$awards]
      );
      array_push($bonus_details, $feature_Won);
      $feature_Won['freespins'] = $nm_spins;
    }

    array_push($round->bonusGamesWon, $feature_Won);
    if ($old_level === $level) {
      array_push($round->bonusGamesWon, $levelChangeInfo);
    }
  }
  $progress_bar_status = array(
    'type' => 'progress_bar',
    'bar_value' => $progress_bar,
    'current_level' => $level
  );

  $bonus_details = unique_objet($bonus_details, $progress_bar, $level);

  $details = array(
    'level' => $level,
    'fs_game_id' => $level + 2,
    'positions' => $positions,
    'progress_bar' => $progress_bar,
    'bonus_details' => $bonus_details
  );

  if ($round->freeSpins['spins_left'] > 1 or !empty($feature_Won)) {
    array_push($round->bonusGamesWon, $progress_bar_status);
    update_freespins(
      $round->freeSpins['id'],
      $round->game->gameId,
      $round->freeSpins['sub_game_id'],
      $round->player->accountId,
      $round->roundId,
      $extra_spin,
      $multiplier = 1,
      $round->amountType,
      $round->freeSpins['round_ids'],
      $round->freeSpins['history'],
      $details
    );
    $round->freeSpins['spins_left'] += $extra_spin;
  } else {
    array_push($round->bonusGamesWon, $progress_bar_status);
    $round->freespinState = 1;
  }

  if ($level > 0) {
    $matrix = $round->matrix;
    $round->postMatrixInfo['matrix'] = $matrix;
    $round->postMatrixInfo['feature_name'] = 'sticky_wild_reel';
    $round->postMatrixInfo['matrixString'] = array2d_to_string($matrix);
    $round->postMatrixInfo['matrixFlatten'] = $round->generateFlatMatrix($matrix);
  }
}



function handle_reel_position(&$round, $details)
{
  $win_round = $round->freeSpins['details']['jackpot_reward'];
  $gameData = $round->freeSpins['details']['jackpot_pool'];
  $pickedInfo = $gameData[$win_round];
  $count_sticky_reel = $pickedInfo['sticky_wilds_reel'][0];//2
  $reel = array();
  $cases = $gameData[$win_round]['case'];//[]
  $freq = $gameData[$win_round]['frequency'];//556
  $round_detail = $round->freeSpins['details']['jackpot_pool'][$win_round];
  $bonus_symbol = $details['bonus_symbol'];
  $sticky_symbol = $details['sticky_symbol'];
  if ($round_detail['sticky_wilds_reel'][0] > 0) {
    $reel = generate_random_sticky_reel($count_sticky_reel, $cases, $freq);
    sticky_wild_reel($round, $reel, $sticky_symbol, "");
    $round->matrixString = array2d_to_string($round->matrix);
    sticky_wild_reel($round, $reel, $sticky_symbol, "");
  } else if ($round_detail['multiplier'] > 1) {
    $round->game->wildMultiplier = $round_detail['multiplier'];
    // $multiplier = $round_detail['multiplier'];
  }
  $details = array(
    'fs_game_id' => $win_round + 1, //TODO 
    "jackpot_pool" => $round->freeSpins['details']['jackpot_pool'],
    "jackpot_reward" => $round->freeSpins['details']['jackpot_reward'],
    "parent_type" => "bonus",
    "multiplier" => $round_detail['multiplier'],
    "wild_positions" => $round->freeSpins['details']['wild_positions'] . encode_objects($reel)
  );

  if ($round->freeSpins['spins_left'] > 1) {
    update_freespins(
      $round->freeSpins['id'],
      $round->game->gameId,
      $round->freeSpins['sub_game_id'],
      $round->player->accountId,
      $round->roundId,
      0,
      $round_detail['multiplier'],
      $round->amountType,
      $round->freeSpins['round_ids'],
      $round->freeSpins['history'],
      $details
    );
  } else {
    $round->freespinState = 1;
  }
  if ($round->freeSpins['spins_left'] > 0) {
    $matrix = $round->matrix;
    $round->postMatrixInfo['matrix'] = $matrix;
    $round->postMatrixInfo['wild_positions'] = $reel;
    $round->postMatrixInfo['feature_name'] = 'sticky_wild_reel';
    $round->postMatrixInfo['matrixString'] = array2d_to_string($matrix);
    $round->postMatrixInfo['matrixFlatten'] = $round->generateFlatMatrix($matrix);
  }

}


function handle_sticky_wild_feature(&$round, $details)
{
  $win_round = $round->freeSpins['details']['jackpot_reward'];
  $gameData = $round->freeSpins['details']['jackpot_pool'];
  $cases = $gameData[$win_round]['case'];
  $freq = $gameData[$win_round]['frequency'];
  $round_detail = $round->freeSpins['details']['jackpot_pool'][$win_round];
  $bonus_symbol = $details['bonus_symbol'];
  $multiplier = $round->freeSpins['details']['multiplier'];
  $sticky_symbol = $details['sticky_symbol'];
  $multiplier = 1;
  if ($round_detail['sticky_wilds_reel'][0] > 0) {
    $arr = generate_random_sticky_reel_s($cases, $freq);

    $reel = $arr[0];
    if ($arr[1] > 1) {
      $round->winAmount += $arr[1] * $round->totalBet;
    }
    sticky_wild_reel($round, $reel, $sticky_symbol, "");
    $round->matrixString = array2d_to_string($round->matrix);
    // sticky_wild_reel($round, $reel, $sticky_symbol, "");
  } else if ($round_detail['multiplier'] > 1) {
    $round->game->wildMultiplier = $round_detail['multiplier'];
  }
  $details = array(
    'fs_game_id' => $win_round + 1,
    "jackpot_pool" => $round->freeSpins['details']['jackpot_pool'],
    "jackpot_reward" => $round->freeSpins['details']['jackpot_reward'],
    "parent_type" => "bonus",
    "wild_multiplier" => $multiplier,
    "multiplier" => $round_detail['multiplier'],
    "wild_positions" => $round->freeSpins['details']['wild_positions'] . $reel
  );

  if ($round->freeSpins['spins_left'] > 1) {
    update_freespins(
      $round->freeSpins['id'],
      $round->game->gameId,
      $round->freeSpins['sub_game_id'],
      $round->player->accountId,
      $round->roundId,
      0,
      $round_detail['multiplier'],
      $round->amountType,
      $round->freeSpins['round_ids'],
      $round->freeSpins['history'],
      $details
    );
  } else {
    $round->freespinState = 1;
  }
  if ($round->freeSpins['spins_left'] > 0) {
    $matrix = $round->matrix;
    $round->postMatrixInfo['matrix'] = $matrix;
    $round->postMatrixInfo['feature_name'] = 'sticky_wild_reel';
    $round->postMatrixInfo['wild_positions'] = $reel;
    $round->postMatrixInfo['multiplier'] = $arr[1];
    $round->postMatrixInfo['matrixString'] = array2d_to_string($matrix);
    $round->postMatrixInfo['matrixFlatten'] = $round->generateFlatMatrix($matrix);
  }

}

function generate_random_wild(&$round, $details)
{
  if (!$round->freeSpins) {
    $sticky_symbol = $details['sticky_symbol'];
    $levels = $details['levels'];
    $max_round = $levels['total_weightage'];
    $bonus = "";
    $random_number = rand(1, $max_round);
    $round_num = 0;
    // $count = get_element_count($round->matrixFlatten, $round->game->scatters[0]);
    // if($count >= 3){
    //     return;
    // }

    $weight = $details['levels'];
    $weight = $weight['normal_weights'];
    /** Hard code for katanawarrior bonus =>  sticky wild reel 
     * 
     * $random_number = 211;  // for 1 sticky wild reel 
     * $random_number = 44;  // for 2 sticky wild reel 
     * $random_number = 1;  // for 3 sticky wild reel 
     * 
     */

    /** Hard code for olympiangolds bonus =>  sticky wild reel 
     * 
     * $random_number = 800;  // for 1 sticky wild reel 
     * $random_number = 100;  // for 2 sticky wild reel 
     * $random_number = 11;  // for 3 sticky wild reel 
     * $random_number = 1;  // for 4 sticky wild reel 
     * 
     */
    $reel = [];
    for ($i = 0; $i < count($weight); $i++) {
      if ($random_number <= $weight[$i]) {
        $round_num = $i + 1;
        if ($round_num == count($weight)) { // 1 == 4
          $round_num = 0;
          break;
        }
        $bonus = "Wild" . (count($weight) - $round_num);
        break;
      }
    }
    // $round_num = 2;
    $reel = [];
    if ($round_num > 0) {
      $round_level = $details['levels'][$round_num];
      $index = rand(1, $round_level[0]);
      for ($i = 0; $i < count($round_level[2]); $i++) {
        if ($round_level[2][$i] >= $index) {
          $reel = $round_level[1][$i];
          break;
        }

      }
      sticky_wild_reel($round, $reel, $sticky_symbol, "");
      $round->matrixString = array2d_to_string($round->matrix);


      $matrix = $round->matrix;
      $round->postMatrixInfo['matrix'] = $matrix;
      $round->postMatrixInfo['feature_name'] = "StickyWild";
      $round->postMatrixInfo['bonus'] = $bonus;
      $round->postMatrixInfo['matrixString'] = array2d_to_string($matrix); // TODO
      $round->postMatrixInfo['wild_positions'] = $reel;
      $round->postMatrixInfo['matrixFlatten'] = $round->generateFlatMatrix($matrix);
      $round->matrixFlatten = $round->generateFlatMatrix($matrix);

    }

  }


}

function generate_random_sticky_reel_s($cases, $freq)
{

  $position = array();
  $random = rand(1, $freq);
  $num = $cases[0][$random][0];
  $mul = $cases[0][$random][1];
  if ($num > 0) {
    array_push($position, $num);

  }
  return array($position, $mul);
}

function generate_random_sticky_reel($count, $cases, $freq)
{
  $position = array();
  $random = rand(0, $freq);// frequency 1 to 10
  for ($i = 0; $i < count($cases); $i++) {
    if ($cases[$i]["weight"] >= $random) {
      $position = $cases[$i]["case" . ($i + 1)];
      return $position;
    }
  }

}



function sticky_wild_reel(&$round, $reels, $sticky_symbol, $bonus_symbol)
{
  for ($i = 0; $i < count($reels); $i++) {
    for ($j = 0; $j < $round->game->numRows and ($bonus_symbol != ""); $j++) {
      if ($round->matrix[$j][$reels[$i]] != $bonus_symbol) {
        $round->matrix[$j][$reels[$i]] = $sticky_symbol;
      }
    }
    for ($j = 0; $j < $round->game->numRows and ($bonus_symbol == ""); $j++) {
      $round->matrix[$j][$reels[$i]] = $sticky_symbol;
    }
  }
}



function get_matrix_indexes(&$round, $Positions, $index)
{
  $n = count($Positions);
  for ($i = 0; $i < $round->game->numRows; $i++) {
    array_push($Positions, $index + ($i * $round->game->numColumns));
  }
  return array_slice($Positions, $n);
}

function unique_objet($bonus_details, $progress_bar, $level)
{
  $n = count($bonus_details);
  if ($n == 0) {
    array_push($bonus_details, array('type' => 'progress_bar', 'bar_value' => $progress_bar, 'current_level' => $level));
  }
  for ($i = 0; $i < $n; $i++) {
    $key = $bonus_details[$i];
    if ($key['type'] == 'progress_bar') {
      $bonus_details[$i] = array('type' => 'progress_bar', 'bar_value' => $progress_bar, 'current_level' => $level);
      break;
    } else if ($key['type'] == 'sticky_wilds_reel' and ($i != $n - 1)) {
      continue;
    } else if ($i == $n - 1) {
      array_push($bonus_details, array('type' => 'progress_bar', 'bar_value' => $progress_bar, 'current_level' => $level));
    }
  }

  return $bonus_details;
}

function simplify_object($bonus_details, $sticky_symbol, $positions)
{
  $n = count($bonus_details);
  if ($n == 0) {
    array_push(
      $bonus_details,
      array(
        'type' => 'sticky_wilds_reel',
        'sticky_symbol' => $sticky_symbol,
        'positions' => $positions
      )
    );
  }
  for ($i = 0; $i < $n; $i++) {
    $key = $bonus_details[$i];
    if ($key['type'] == 'sticky_wilds_reel') {
      $bonus_details[$i] = array(
        'type' => 'sticky_wilds_reel',
        'sticky_symbol' => $sticky_symbol,
        'positions' => $positions
      );
      break;
    } else if ($key['type'] == 'progress_bar' and ($i != $n - 1)) {
      continue;
    } else if ($i == $n - 1) {
      array_push(
        $bonus_details,
        array(
          'type' => 'sticky_wilds_reel',
          'sticky_symbol' => $sticky_symbol,
          'positions' => $positions
        )
      );
    }
  }

  return $bonus_details;
}

# Master of Fortune
function handle_expanding_wilds_on_reels(&$round, $details)
{
  $wild_symbol = $details['wild_symbol'];
  $num_wild_symbols = $details['num_symbols'];
  $wild_postions = $details['pos_nos'];
  $weights = $details['weights'];

  $game = $round->game;

  $flipped_matrix = flip_2d_array($round->matrix);
  $rand = weighted_random_number($weights, $num_wild_symbols);
  shuffle($wild_postions);

  for ($i = 0; $i < $rand; $i++) {
    for ($j = 0; $j < $game->numRows; $j++) {
      $flipped_matrix[$wild_postions[$i]][$j] = $wild_symbol;
    }
  }
  if ($round->freeSpins['spins_left'] == 1) {
    $round->freespinState = 1;
  }

  $matrix = flip_2d_array($flipped_matrix);
  $round->postMatrixInfo['matrix'] = $matrix;
  $round->postMatrixInfo['feature_name'] = 'spawning_wild';
  $round->postMatrixInfo['matrixString'] = array2d_to_string($matrix);
  $round->postMatrixInfo['matrixFlatten'] = $round->generateFlatMatrix($matrix);
}

function handle_expanding_wild(&$round, $details)
{
  $expanding_symbol = $details['expanding_symbol'];

  if (!in_array($expanding_symbol, $round->matrixFlatten)) {
    return;
  }

  $game = $round->game;
  $flipped_matrix = flip_2d_array($round->matrix);
  for ($i = 0; $i < $game->numColumns; $i++) {
    if (!in_array($expanding_symbol, $flipped_matrix[$i])) {
      continue;
    }

    for ($j = 0; $j < count($flipped_matrix[$i]); $j++) {
      $flipped_matrix[$i][$j] = $expanding_symbol;
    }

    $flipped_matrix[$i] = array_fill(0, count($flipped_matrix[$i]), $expanding_symbol);
  }

  $feature_name = isset($details['feature_name']) ? $details['feature_name'] : 'spawning_wild';
  $matrix = flip_2d_array($flipped_matrix);
  $round->postMatrixInfo['matrix'] = $matrix;
  $round->postMatrixInfo['feature_name'] = $feature_name; # todo Hardcoded. Get it dynamically.
  $round->postMatrixInfo['matrixString'] = array2d_to_string($matrix);
  $round->postMatrixInfo['matrixFlatten'] = $round->generateFlatMatrix($matrix);
}

function handle_expanding_wild_freespins(&$round, $details)
{
  # todo log expanding wild infor too in DB
  $expanding_symbol = $details['expanding_symbol'];
  $game = $round->game;
  $expanding_length = $game->numRows;
  # todo remove the following line. Skiping all the required checks to award freespins
  # todo change the following multiplier value
  $multiplier = 1;

  if (!in_array($expanding_symbol, $round->matrixFlatten)) {
    return;
  }

  $flipped_matrix = flip_2d_array($round->matrix);
  for ($i = 0; $i < $game->numColumns; $i++) {
    if (!in_array($expanding_symbol, $flipped_matrix[$i])) {
      continue;
    }

    $reel_number = $i + 1;
    if (in_array($reel_number, $details['reel_numbers'])) {
      $num_freespins = $details['num_freespins'][$reel_number - 1];
      award_freespins(
        $game->gameId,
        $game->subGameId,
        $round->player->accountId,
        $round->roundId,
        $num_freespins,
        $multiplier,
        $round->coinValue,
        $round->numCoins,
        $round->numBetLines,
        $round->amountType
      );
    }
  }
}

# todo optimize the way freespins are awarded.
# todo remove default spin_type=2
function award_freespins(
  $game_id,
  $sub_game_id,
  $account_id,
  $base_round_id,
  $num_spins,
  $multiplier,
  $coin_value,
  $num_coins,
  $num_betlines,
  $amount_type,
  $round_ids,
  $history,
  $spin_type,
  $details = "",
  $total_win_amount = 0
) {
  global $db;

  $spins_left = $num_spins;
  $state = 0;
  $win_amount = 0;
  $details = encode_objects($details);
  $round_ids = encode_objects($round_ids);
  $history = encode_objects($history);
  $table_name = 'gamelog.freespins';

  if ($amount_type == AMOUNT_TYPE_FUN) {
    $table_name = 'gamelog.freespins_fun';
  }

  $fs_query = <<<QRY
    INSERT INTO {$table_name}(game_id, sub_game_id, amount_type, base_round_id,
          round_ids, history, account_id, coin_value, num_coins, num_betlines, num_spins,
          spins_left, multiplier, win_amount, details, state, spin_type, total_win_amount)
         VALUES ($game_id, $sub_game_id, $amount_type, $base_round_id,
         '{$round_ids}', '{$history}', $account_id, $coin_value, $num_coins, $num_betlines,
         $num_spins, $spins_left, $multiplier, {$win_amount}, '{$details}', $state, $spin_type, $total_win_amount)
QRY;
  $result = $db->runQuery($fs_query) or ErrorHandler::handleError(1, "CASINO_LIB0033");
}

function update_freespins(
  $row_id,
  $game_id,
  $sub_game_id,
  $account_id,
  $base_round_id,
  $num_spins,
  $multiplier,
  $amount_type,
  $round_ids,
  $history,
  $details = "",
  $state = 0
) {
  global $db;
  $details = encode_objects($details);
  $round_ids = encode_objects($round_ids);
  $history = encode_objects($history);
  $table_name = 'gamelog.freespins';

  if ($amount_type == AMOUNT_TYPE_FUN) {
    $table_name = 'gamelog.freespins_fun';
  }


  $fs_query = <<<QRY
	UPDATE {$table_name}
     SET spins_left = spins_left + {$num_spins},
         num_spins = num_spins + {$num_spins},
		   	 details ='{$details}',
         round_ids = '{$round_ids}',
         sub_game_id ={$sub_game_id},
         history = '{$history}',
         multiplier = '{$multiplier}'
  WHERE id = {$row_id} AND
				account_id = {$account_id} AND
				game_id = {$game_id} AND
				
				amount_type = {$amount_type} AND
				state = {$state}
QRY;
  $result = $db->runQuery($fs_query) or ErrorHandler::handleError(1, "CASINO_LIB003");
  # $round->loadFreeSpins();
}

function handle_screen_wins(&$round, $details)
{
  $screen_symbol = $details['screen_symbol'];

  $num_screen_symbols = get_element_count($round->matrixFlatten, $screen_symbol);

  if (!isset($details[$num_screen_symbols])) {
    return;
  }

  $award_name = $details[$num_screen_symbols]['award_name'];
  $num_awards = $details[$num_screen_symbols]['num_awards'];
  if ($award_name == 'total_bet') {
    $win_amount = $round->totalBet * $num_awards;
  } else {
    ErrorHandler::handleError(1, "CASINO_LIB010", "-Award Not found");
  }

  # @ todo need to credit this win_amount
  $screen_wins = array(
    'type' => 'screen_wins',
    'screen_symbol' => $screen_symbol,
    'num_screen_symbols' => $num_screen_symbols,
    'win_amount' => $win_amount,
    'multipler' => $num_awards
  );

  array_push($round->bonusGamesWon, $screen_wins);
  array_push($round->winLineNumbers, array("screen_wins", $num_screen_symbols . $screen_symbol, $win_amount, $num_awards));
  $round->winAmount += $win_amount;
}

function handle_freespins(&$round, $details)
{
  $freespin_symbol = $details['freespin_symbol'];
  $game = $round->game;
  if ($round->game->gameName == 'candyburst') {
    $flipped_matrix = flip_2d_array($round->matrix);
    $num_freespin_symbols = get_element_count_candyburst($flipped_matrix, $freespin_symbol);
  } else {
    $num_freespin_symbols = get_element_count($round->matrixFlatten, $freespin_symbol);
  }
  if (!isset($details[$num_freespin_symbols])) {
    return;
  }

  $num_freespins = $details[$num_freespin_symbols]['num_freespins'];
  $multiplier = $details['fs_multiplier'];

  if ($round->spinType == 'normal' && !$round->freeSpins) {
    $base_round_id = $round->roundId;
    $round_ids = array($round->roundId);
    $history = array($num_freespins);
    $parent_type = $round->getParentSpinType();
    $spin_type = 2;

    $fs_details = $details['fs_details'];
    $fs_details['parent_type'] = $parent_type;
    $fs_details['parent_spins_left'] = 0;
    $fs_bonus_options = $details['fs_details']["bonus_details"];


    award_freespins(
      $game->gameId,
      $game->subGameId,
      $round->player->accountId,
      $base_round_id,
      $num_freespins,
      $multiplier,
      $round->coinValue,
      $round->numCoins,
      $round->numBetLines,
      $round->amountType,
      $round_ids,
      $history,
      $spin_type,
      $fs_details
    );
  } else if (
    $round->spinType == 'freespin' &&
    $round->freeSpins['multiplier'] == $multiplier
  ) {
    $round_ids = $round->freeSpins['round_ids'];
    array_push($round_ids, $round->roundId);
    $history = $round->freeSpins['history'];
    array_push($history, $num_freespins);
    $parent_type = $round->freeSpins['details']['parent_type'];

    update_freespins(
      $round->freeSpins['id'],
      $round->freeSpins['game_id'],
      $round->freeSpins['sub_game_id'],
      $round->player->accountId,
      $round->freeSpins['base_round_id'],
      $num_freespins,
      $multiplier,
      $round->amountType,
      $round_ids,
      $history,
      $round->freeSpins['details']
    );
    $round->loadFreeSpins();
  }
  $bonus_game_id = $game->bonusConfig['bonus_config']['normal'][$freespin_symbol]['bonus_game_id'];

  $freespins_info = array(
    'type' => 'freespins',
    'num_spins' => $num_freespins,
    'spins_left' => $num_freespins,
    "win_amount" => 0,
    'parent_type' => $parent_type
  );
  if ($bonus_game_id) {
    $freespins_info["bonus_game_id"] = $bonus_game_id;
    $freespins_info["bonus_options"] = $fs_bonus_options;
  }
  array_push($round->bonusGamesWon, $freespins_info);
}

function handle_post_freespins_prizes(&$round, $details)
{
  // print_r($details);
  $game = $round->game;
  if ($round->spinType == 'normal' || $round->spinType == 'freespin') {
    #$base_round_id = $round->roundId;
    $base_round_id = 0;
    if ($round->spinType == 'normal') {
      $base_round_id = $round->roundId;
    } else {
      $base_round_id = $round->freeSpins['base_round_id'];
    }

    $multiplier = $details['multiplier'];
    $round_ids = array($round->roundId);
    $spin_type = 3;
    // $spin_type = $details['spin_type'];
    $num_spins = $details['num_spins'];
    $history = array($num_spins);

    award_freespins(
      $game->gameId,
      $game->subGameId,
      $round->player->accountId,
      $base_round_id,
      $num_spins,
      $multiplier,
      $round->coinValue,
      $round->numCoins,
      $round->numBetLines,
      $round->amountType,
      $round_ids,
      $history,
      $spin_type,
      $details
    );
  } else if ($round->spinType == 'respin') {
    $multiplier = $round->freeSpins['multiplier'];
    $roundIds = $round->freeSpins['round_ids'];
    $spin_type = 3;
    // $spin_type = $details['spin_type'];
    $history = $round->freeSpins['history'];
    $state = 0;
    $num_spins = $details['num_spins'];
    array_push($history, $num_spins);
    array_push($roundIds, $round->roundId);

    update_freespins(
      $round->freeSpins['id'],
      $round->freeSpins['game_id'],
      $round->freeSpins['sub_game_id'],
      $round->player->accountId,
      $round->freeSpins['base_round_id'],
      $num_spins,
      $multiplier,
      $round->amountType,
      $roundIds,
      $history,
      $details
    );
    $round->loadFreeSpins();
  }
}

function handle_freespins_katana(&$round, $details)
{

  $freespin_symbol = $details['freespin_symbol'];
  $game = $round->game;
  $num_freespin_symbols = get_element_count($round->matrixFlatten, $freespin_symbol);
  if (!isset($details[$num_freespin_symbols])) {
    return;
  }

  $num_freespins = $details[$num_freespin_symbols]['num_freespins'];
  $multiplier = $details['fs_multiplier'];
  if ($round->spinType == 'normal' && !$round->freeSpins) {
    // $multiplier = $details[$num_freespin_symbols]['multiplier'];
    $base_round_id = $round->roundId;
    $round_ids = array($round->roundId);
    $history = array($num_freespins);
    $parent_type = $round->getParentSpinType();
    $spin_type = 2;
    $random_symbol = $round->getRandomSymbol();
    // $round->winAmount = $round->totalBet * $details[$num_freespin_symbols]['multiplier'];
    $fs_details = $details['fs_details'];
    $fs_details['parent_type'] = $parent_type;
    $fs_details['parent_spins_left'] = 0;
    $fs_details['random_symbol'] = $random_symbol;
    $fs_details['multiplier'] = $multiplier;
    $fs_details['jackpot_reward'] = $num_freespin_symbols;
    $fs_bonus_options = $details['fs_details']["bonus_details"];
    award_freespins(
      $game->gameId,
      $game->subGameId,
      $round->player->accountId,
      $base_round_id,
      $num_freespins,
      $multiplier,
      $round->coinValue,
      $round->numCoins,
      $round->numBetLines,
      $round->amountType,
      $round_ids,
      $history,
      $spin_type,
      $fs_details
    );
  }

  $freespins_info = array(
    'type' => 'freespins',
    'num_spins' => $num_freespins,
    'spins_left' => $num_freespins,
    "win_amount" => 0,
    'parent_type' => $parent_type,
    "bonus_options" => $fs_bonus_options,
    "symbol" => $random_symbol,
    "multipler" => $details[$num_freespin_symbols]['multiplier']
  );

  array_push($round->bonusGamesWon, $freespins_info);
}

function handle_freespins_lotr(&$round, $details)
{
  $freespin_symbol = $details['freespin_symbol'];
  $freespin_min_symbol = $details['min_scatter'];
  $game = $round->game;
  $additional_fs = 0;
  $multiplier = $details['fs_multiplier'];

  if ($round->spinType == 'respin' && !$round->postFreeSpinInfo) {
    $num_freespin_symbols = get_element_count($round->matrixFlatten, $freespin_symbol);
    $freespin = $details['free_spin_sc'][$num_freespin_symbols];
    if ($num_freespin_symbols <= $freespin_min_symbol) {
      return;
    }
    $base_round_id = $round->roundId;
    $round_ids = array($round->roundId);
    $history = array($freespin);
    $spin_type = 2;
    $fs_details = $details['fs_details'];
    $fs_details['parent_type'] = "normal";
    $fs_details['multiplier'] = $multiplier;
    $fs_details['num_spins_reward'] = $freespin;
    $fs_details['jackpot_reward'] = $num_freespin_symbols;
    $fs_bonus_options = $details['fs_details']["bonus_details"];

    award_freespins(
      $game->gameId,
      $game->subGameId,
      $round->player->accountId,
      $base_round_id,
      $freespin,
      $multiplier,
      $round->coinValue,
      $round->numCoins,
      $round->numBetLines,
      $round->amountType,
      $round_ids,
      $history,
      $spin_type,
      $fs_details

    );
    $freespins_info = array(
      'type' => 'freespins',
      // 'num_spins' => $round->freeSpins['num_spins'] + $additional_fs,
      'num_spins' => $freespin,
      'spins_left' => $freespin,
      "win_amount" => 0,
      'parent_type' => "normal",
      "bonus_options" => $fs_bonus_options,
      "multipler" => $multiplier,
      "additional_fs" => $additional_fs

    );
    array_push($round->bonusGamesWon, $freespins_info);

  } elseif ($round->spinType == 'freespin') {
    $round_ids = $round->freeSpins['round_ids'];
    $multiplier = $round->freeSpins['multiplier'];
    $spin_left = $round->freeSpins['spins_left'];
    $multiplier += 1;
    $round->winAmount += $multiplier * $round->winAmount;
    $round->freeSpins["details"]['multiplier'] = $multiplier;


    // $inc_multiplier = $details['multiplier_inceremt'];
    $num_freespins = $round->freeSpins["details"]['num_spins_reward']; // 10
    $additional_fs = calcExtraFreeSpinCount($num_freespins, $spin_left);
    /** Hard code for LOTR trigger additional freespin in free game luckoftherainbow
     *
     * $additional_fs = 2;
     *
     */
    if ($additional_fs > 0) {
      $num_freespins += $additional_fs; // total_fs
      $spin_left += $additional_fs; // total_fs
      $freespins_info = array(
        'type' => 'freespins',
        'num_spins' => $num_freespins,
        'spins_left' => $spin_left,
        "win_amount" => 0,
        'parent_type' => "normal",
        "multipler" => $multiplier,
        "additional_fs" => $additional_fs

      );
      $round->freeSpins["details"]["additional_fs"] = $additional_fs;
      // array_push($round->bonusGamesWon, $freespins_info);
    }


    array_push($round_ids, $round->roundId);
    $history = $round->freeSpins['history'];
    array_push($history, $num_freespins);
    $parent_type = $round->freeSpins['details']['parent_type'];
    update_freespins(
      $round->freeSpins['id'],
      $round->freeSpins['game_id'],
      $round->freeSpins['sub_game_id'],
      $round->player->accountId,
      $round->freeSpins['base_round_id'],
      $additional_fs,
      $multiplier,
      $round->amountType,
      $round_ids,
      $history,
      $round->freeSpins['details']
    );
    $round->loadFreeSpins();
  } else {
    return;
  }

  if (!isset($additional_fs)) {
    $additional_fs = 0;
  }


}


function handle_freespins_bonaza(&$round, $details)
{
  // $round->bonusGamesWon = array();
  $freespin_symbol = $details['freespin_symbol'];
  $scatter_num = $details['min_scatter'];
  $game = $round->game;
  $extra_fs = 0;

  $num_freespin_symbols = get_element_count($round->matrixFlatten, $freespin_symbol);

  $num_freespins = $details['num_freespins'];
  $multiplier = $details['fs_multiplier'];

  if ($round->spinType == 'normal' && !$round->freeSpins) {
    // print_r($details);
    if ($scatter_num > $num_freespin_symbols) {
      return;
    }
    $base_round_id = $round->roundId;
    $round_ids = array($round->roundId);
    $history = array($num_freespins);
    $parent_type = $round->getParentSpinType();
    $spin_type = 2;
    $fs_details = array();
    $fs_details["bonus_details"] = array();
    $fs_details['parent_type'] = $parent_type;
    $fs_details['parent_spins_left'] = 0;
    //fs_game_id
    $fs_details['fs_game_id'] = $details["fs_details"]["fs_game_id"];
    $fs_details['multiplier'] = 1;
    if (isset($details["fs_details"]) or isset($details["fs_details"]["prograssive_fs"]) or $details["fs_details"]["prograssive_fs"] == true) {
      $fs_details['prograssive_fs'] = $details["fs_details"]["prograssive_fs"];
    }
    if (isset($details["fs_details"]) or isset($details["fs_details"]["multiplier_collection"]) or $details["fs_details"]["multiplier_collection"] == true) {
      $fs_details['multiplier_collection'] = $details["fs_details"]["multiplier_collection"];
    }
    $fs_details['fs_multipliers'] = array();
    $fs_details["bonus_details"]["total_multiplier_win"] = 0;
    $fs_details["bonus_details"]["multiplier_count"] = 0;
    $fs_details["bonus_details"]["extra_fs"] = 0;
    $fs_detail["bonus_details"]["tumbled_matrix"] = "";
    $fs_details["multiplier_win"] = array();
    $fs_details["screenWins"] = array();
    $fs_details["multiplier_values"] = array();
    $fs_details['multiplier_symbol'] = $details['multiplier_symbol'];
    $fs_details["fs_detail"] = $details['fs_details'];
    $fs_details["min_scatter"] = $details['min_scatter'];
    $fs_details["num_freespins"] = $details['num_freespins'];
    $fs_details["bonus_detail"] = $details['fs_details']['bonus_details'];


    award_freespins(
      $game->gameId,
      $game->subGameId,
      $round->player->accountId,
      $base_round_id,
      $num_freespins,
      $multiplier,
      $round->coinValue,
      $round->numCoins,
      $round->numBetLines,
      $round->amountType,
      $round_ids,
      $history,
      $spin_type,
      $fs_details,
      0
    );

    $freespins_info = array(
      'type' => 'freespins',
      'num_spins' => $num_freespins,
      'spins_left' => $num_freespins,
      "win_amount" => 0,
      'parent_type' => $parent_type,
      "extra_fs" => $extra_fs
    );


    array_push($round->bonusGamesWon, $freespins_info);

  } else if ($round->spinType == 'freespin') {
    $fs_detail = $round->freeSpins['details'];
    $win_multiplier = 0;
    $multiplers = array();
    $num_freespin_symbols = get_element_count($round->matrixFlatten, $freespin_symbol);
    // print_r($round->freeSpins);
    $round_ids = $round->freeSpins['round_ids'];
    $multiplier = $round->freeSpins['multiplier'];
    $bonud_detail = $fs_detail['fs_detail']["bonus_details"];
    $multipler_symbol = $fs_detail['multiplier_symbol'];
    $extra_fs = 0;
    // extra FS in FG
    foreach ($bonud_detail as $key => $value) {
      if ($num_freespin_symbols >= $key) {
        $extra_fs = $value;
        $round->postMatrixInfo["extra_fs"] = $value;
      }
    }

    $multiplers = array();
    if ($round->postMatrixInfo && isset($round->postMatrixInfo['multiplier'])) {
      $multiplers = $round->postMatrixInfo['multiplier'];
      $win_multiplier = $round->postMatrixInfo['win'];
    }
    // to check the multiplier condition
    $multiplier_collection = false;
    if (isset($fs_detail["multiplier_collection"]) and $fs_detail["multiplier_collection"] == true) {
      $multiplier_collection = true;
    }
    if ($round->postMatrixInfo["win"] > 0 and $multiplier_collection == false) {
      if (isset($fs_detail["prograssive_fs"]) and $fs_detail["prograssive_fs"] == true) {
        $fs_detail["bonus_details"]["total_multiplier_win"] += $win_multiplier;
        $fs_detail["bonus_details"]["multiplier_count"] += count($multiplers);
        if ($multiplier > 1) {
          $multiplier += $round->postMatrixInfo["win"]; /////////////////////////////////////////////////////////////////////
        } else {
          $multiplier = $round->postMatrixInfo["win"];
        }
      }
    } elseif ($round->paylineWinAmount > 0 and $multiplier_collection == true) {

      if (isset($fs_detail["prograssive_fs"]) or $fs_detail["prograssive_fs"] == true) {
        if ($round->postMatrixInfo["win"] > 0) {
          $fs_detail["bonus_details"]["total_multiplier_win"] += $win_multiplier;
          $fs_detail["bonus_details"]["multiplier_count"] += count($multiplers);
          if ($multiplier > 1) {
            $multiplier += $round->postMatrixInfo["win"]; /////////////////////////////////////////////////////////////////////
          } else {
            $multiplier = $round->postMatrixInfo["win"];
          }
        }
      }
    }
    array_push($round_ids, $round->roundId);

    $parent_type = $round->freeSpins['details']['parent_type'];
    $fs_detail['parent_type'] = $parent_type;
    $fs_detail['fs_multipliers'] = array();
    $fs_detail["bonus_details"]["total_extra_fs"] += $extra_fs;
    $fs_detail["total_extra_fs"] += $extra_fs;
    $fs_detail["bonus_details"]["tumbled_matrix"] = array2d_to_string($round->matrix);

    array_push($fs_detail["screenWins"], $round->screenWins);
    array_push($fs_detail["multiplier_win"], $win_multiplier);
    array_push($fs_detail["multiplier_values"], $multiplers);

    // $multiplier += $round->postMatrixInfo['multiplier'];

    $history = $round->freeSpins['history'];
    array_push($history, $num_freespins);

    $num_freespins = $extra_fs;
    update_freespins(
      $round->freeSpins['id'],
      $round->freeSpins['game_id'],
      $round->freeSpins['sub_game_id'],
      $round->player->accountId,
      $round->freeSpins['base_round_id'],
      $num_freespins,
      $multiplier,
      $round->amountType,
      $round_ids,
      $history,
      $fs_detail
    );
    $round->loadFreeSpins();
  }
  // $bonus_game_id = $game->bonusConfig['bonus_config']['normal'][$freespin_symbol]['bonus_game_id'];
}

function handle_freespins_dog_house(&$round, $details){
  
  $freespin_symbol = $details['freespin_symbol'];
  $scatter_need = $details['min_scatter'];
  $game = $round->game;
  $num_freespin_symbols = get_element_count($round->matrixFlatten, $freespin_symbol);
  $num_freespins = $details[$num_freespin_symbols]['num_freespins'];
  
  $multiplier = $details['fs_multiplier'];
  if($round->spinType == 'normal' && !$round->freeSpins)
  {
    if($scatter_need > $num_freespin_symbols) {
    return; 
    }
    // $multiplier = $details[$num_freespin_symbols]['multiplier'];
    $bonus_details = $details["fs_details"]['bonus_details'];
    $fs_reel_size = $details["fs_details"]['matrix_reel'][0];
    $base_round_id = $round->roundId;

    $round_ids = Array($round->roundId);
    $history = Array($num_freespins);
    $parent_type = $round->getParentSpinType();
    $spin_type = 2;
    $fs_deatil = $round->generate_freespins($fs_reel_size, $bonus_details);
    // print_r($fs_deatil);
    $fs_reel = $fs_deatil[0];
    $num_freespins = $fs_deatil[1];

  // $round->winAmount = $round->totalBet * $details[$num_freespin_symbols]['multiplier'];
  $fs_details = $details['fs_details'];
  $fs_details['parent_type'] = $parent_type;
  $fs_details['screen_win'] = array_fill(0, $game->numRows * $game->numColumns, 0);;
  $fs_details['parent_spins_left'] = 0;
  $fs_details['fs_reel'] = $fs_reel;
  $fs_details['num_freespins'] = $num_freespins;
  $fs_details['multiplier'] = [];
  $fs_details['jackpot_reward'] = $num_freespin_symbols;
  $fs_bonus_options = $details['fs_details']["bonus_details"];
  award_freespins($game->gameId, $game->subGameId, $round->player->accountId,
  $base_round_id, $num_freespins, $multiplier,
  $round->coinValue, $round->numCoins, $round->numBetLines,
      $round->amountType, $round_ids, $history, $spin_type, $fs_details);

      $freespins_info = Array('type' => 'freespins', 'num_spins' => $num_freespins,
      'spins_left' => $num_freespins, "win_amount" => 0,
      'parent_type' => $parent_type,"fs_reel"=>$fs_reel );

array_push($round->bonusGamesWon, $freespins_info);
}else if($round->spinType == 'freespin' ) {
  // echo "freepin";
  $round_ids = $round->freeSpins['round_ids'];
  $fs_details = $round->freeSpins['details'];
    array_push($round_ids, $round->roundId);
    $history = $round->freeSpins['history'];
    array_push($history, $num_freespins);
    $parent_type = $round->freeSpins['details']['parent_type'];
    $detail_multi = $fs_details["multiplier"];
    $fs_details["screen_win"]= $round->screenWins;
    // array_push($fs_details["multiplier"], $round->screenWins);
    // $fs_details["multiplier"] = $detail_multi+ $round->screenWins;
    $fs_details["bonus_details"]["screen_win"] = $round->screenWins;
    // $fs_details["multiplier"] = $detail_multi+ $round->screenWins;
    $num_freespins = 0;
    $history = Array($num_freespins);

    update_freespins($round->freeSpins['id'], $round->freeSpins['game_id'],
                    $round->freeSpins['sub_game_id'], $round->player->accountId,
                    $round->freeSpins['base_round_id'], $num_freespins,
                    $multiplier, $round->amountType, $round_ids, $history,
                    $fs_details);
    $round->loadFreeSpins();
    }


}

function handle_freespins_wild_gang(&$round, $details)
{
  $freespin_symbol = $details['freespin_symbol'];
  $game = $round->game;
  $multiplier = $details['fs_multiplier'];
  if ($round->spinType == 'normal' && !$round->freeSpins) {
    $num_freespin_symbols = get_element_count($round->matrixFlatten, $freespin_symbol);
    if (!isset($details[$num_freespin_symbols])) {
      return;
    }
    $num_freespins = $details[$num_freespin_symbols]['num_freespins'];
    $feature_name = "freespin";
    if (isset($details[$num_freespin_symbols]['feature_name'])) {
      $feature_name = $details[$num_freespin_symbols]['feature_name'];
    }
    // $multiplier = $details[$num_freespin_symbols]['multiplier'];
    $base_round_id = $round->roundId;
    $round_ids = array($round->roundId);
    $history = array($num_freespins);
    $parent_type = $round->getParentSpinType();
    $spin_type = 2;
    // $round->winAmount = $round->totalBet * $details[$num_freespin_symbols]['multiplier'];
    $fs_details = $details['fs_details'];
    $fs_details['parent_type'] = $parent_type;
    $fs_details['num_freespins'] = $num_freespins;
    $fs_details['screen_win'] = array_fill(0, $game->numRows * $game->numColumns, 0);
    $fs_details['multiplier_reel'] = array_fill(0, $game->numColumns, []);
    $fs_details['parent_spins_left'] = 0;
    $fs_details['type'] = $feature_name;
    $fs_details['extra_fg'] = [];

    award_freespins(
      $game->gameId,
      $game->subGameId,
      $round->player->accountId,
      $base_round_id,
      $num_freespins,
      $multiplier,
      $round->coinValue,
      $round->numCoins,
      $round->numBetLines,
      $round->amountType,
      $round_ids,
      $history,
      $spin_type,
      $fs_details
    );
    $freespins_info = array(
      'type' => 'freespins',
      'num_spins' => $num_freespins,
      'spins_left' => $num_freespins,
      "win_amount" => 0,
      'parent_type' => $parent_type,
      "feature_name" => $feature_name,
      "multipler" => $details[$num_freespin_symbols]['multiplier']
    );

    array_push($round->bonusGamesWon, $freespins_info);
  } elseif ($round->spinType == 'freespin') {

    $round_ids = $round->freeSpins['round_ids'];
    $fs_details = $round->freeSpins['details'];
    array_push($round_ids, $round->roundId);
    $history = $round->freeSpins['history'];
    $multiplier = $round->freeSpins['multiplier'];

    $num_freespins = 0;
    $parent_type = $round->freeSpins['details']['parent_type'];
    array_push($history, $num_freespins);
    // $round->screenWins
    $fs_details["screen_win"] = $round->screenWins;
    $fs_details["multiplier"] = $round->freeSpins['multiplier'];
    // $fs_details["multiplier"] = 
    if (isset($round->postMatrixInfo['reel_multipliar'])) {
      $fs_details['multiplier_reel'] = $round->postMatrixInfo['reel_multipliar'];
    }
    $multipler_arr = [];
    for ($i = 0; $i < count($fs_details['multiplier_reel']); $i++) {
      array_push($multipler_arr, count($fs_details['multiplier_reel'][$i]));
    }

    $round->postMatrixInfo['reel_pos'] = $multipler_arr;
    $round->postMatrixInfo['reel_multipliar'] = "";
    if (isset($round->freeSpins['details']["extra_fg_details"]) or isset($round->freeSpins['details']["extra_fg_details"]["extra_spin"])) {
      $config = $round->freeSpins['details']["extra_fg_details"]["extra_spin"];
      $fg_left = $fs_details['extra_fg'];
      $num_free = checkNestedArray($fs_details['multiplier_reel'], $config, $fg_left);
      if ($num_free > 0 and !in_array($num_free, $fg_left)) {
        array_push($fs_details['extra_fg'], $num_free);
        $num_freespins = 2;
        $round->postMatrixInfo['extra_fs'] = $num_freespins;
      }

    }
    // $num_freespins = 0;
    $history = array($num_freespins);
    update_freespins(
      $round->freeSpins['id'],
      $round->freeSpins['game_id'],
      $round->freeSpins['sub_game_id'],
      $round->player->accountId,
      $round->freeSpins['base_round_id'],
      $num_freespins,
      $multiplier,
      $round->amountType,
      $round_ids,
      $history,
      $fs_details
    );
    $round->loadFreeSpins();

  }


}


function checkNestedArray($nestedArray, $config, $fg_left)
{
  $countOne = 0;
  $countTwo = 0;
  $count_arr = array_filter($nestedArray, function ($ele) {
    return count($ele) > 0;
  });
  // if ($fg_left == 0) {
  //   return 0;
  // return 1;
  // }
  $count = count($count_arr);
  if (!isset($config[$count])) {
    return 0;
  }


  foreach ($nestedArray as $array) {
    if (is_array($array) && (count($array) == 1 or count($array) == 2)) {
      $countOne++;
    } elseif (is_array($array) && count($array) == 2) {
      $countTwo++;
    }
  }
  // Check the conditions and return the appropriate value
  if ($countTwo >= $count) {
    return 2;
  } elseif ($countOne >= $count) {
    return 1;
  } else {
    return 0;
  }
}
function multipler_feature(&$round, $details)
{

  $featureConfig = $round->game->symbolConfig;
  if (
    !$featureConfig or !isset($featureConfig["symbol_check"]) && !isset($featureConfig["symbol_check"][$round->spinType])
  ) {
    return;
  }
  $val = $round->game->symbolConfig["symbol_check"][$round->spinType];
  $multipler_symbol = $details['multipler_symbol'];

  if ($round->spinType == 'normal') {
    $matrixFlatten = $round->matrixFlatten;

    $found = array_keys($matrixFlatten, $multipler_symbol);
    $round->count = count($found);
    for ($i = 0; $i < count($found); $i++) {
      $round->screenWins[$found[$i]] = $round->getMultiplierValue($val["total_weight"], $val["win_amount"]);
    }
    for ($i = 0; $i < $round->game->numRows; $i++) {
      for ($j = 0; $j < $round->game->numColumns; $j++) {
        // array_push($dataArray[$i][$j]["symbol"], $matrix[$i][$j]);
        $round->matrixData[$i][$j]["data"] = $round->screenWins[(($round->game->numColumns) * $i) + $j];
      }
    }
    $round->screenWinAmount = array_sum($round->screenWins);

  }
  if ($round->spinType == 'freespin') {
    $matrixFlatten = $round->matrixFlatten;
    $found = array_keys($matrixFlatten, $multipler_symbol);
    $round->count = count($found);
    for ($i = 0; $i < count($found); $i++) {
      $round->screenWins[$found[$i]] = $round->getMultiplierValue($val["total_weight"], $val["win_amount"]);
    }
    for ($i = 0; $i < $round->game->numRows; $i++) {
      for ($j = 0; $j < $round->game->numColumns; $j++) {
        // array_push($dataArray[$i][$j]["symbol"], $matrix[$i][$j]);
        $round->matrixData[$i][$j]["data"] = $round->screenWins[(($round->game->numColumns) * $i) + $j];
      }
    }
    $round->screenWinAmount = array_sum($round->screenWins);
  }
}

function handle_max_win_cap(&$round, $details)
{

  if (
    !$details or !isset($details["max_win_cap"])
  ) {
    return;
  }
  $baseBet = $round->changeBet();

  if ($round->spinType == 'normal') {
    $maxWinCapping = $details["max_win_cap"];

    $winCapping = $maxWinCapping * $baseBet;
    // $winCapping = 24999;
    if ($round->winAmount >= $winCapping) {
      $round->winAmount = $winCapping;
    }
  }
  if ($round->spinType == 'freespin') {
    $maxWinCapping = $details["max_win_cap"];
    $winCapping = $maxWinCapping * $baseBet;
    // if($this->freeSpins['spins_left'] == 1){
    // 	echo $this->freeSpins['spins_left'];
    // }
    if (($round->freeSpins['win_amount'] + $round->winAmount) >= $winCapping) {
      $round->freeSpins['win_amount'] = $winCapping;
      $round->freeSpins['spins_left'] = 1;
      $round->freeSpins['total_win_amount'] = $winCapping;
      $round->winAmount = 0;
    }
  }
}

function reelset_change(&$round, $details)
{
  if ($round->spinType == 'normal') {
    $reels_length = $details[$round->spinType]['reels_length'];
    for ($i = 0; $i < $round->game->numColumns; $i++) {
      for ($j = 0; $j < $round->game->numRows; $j++) {
        if ($reels_length[$i] == $j) {
          $round->matrix[$j][$i] = "x";
        }
      }
    }
  } elseif ($round->spinType == 'freespin') {
    $type = $round->spinType;
    if (isset($round->freeSpins['details']["type"])) {
      $type = $round->freeSpins['details']["type"];
    }
    $reels_length = $details[$type]['reels_length'];
    for ($i = 0; $i < $round->game->numColumns; $i++) {
      for ($j = 0; $j < $round->game->numRows; $j++) {
        // echo $reels_length[$i] ," == " , $j, ",   ";
        if ($reels_length[$i] == $j) {
          $round->matrix[$j][$i] = "x";
        }
      }
    }
  }
}

function select_wild_mystry(&$round, $details)
{
  if ($round->spinType == 'freespin') {
    $type = $round->spinType;
    $winx = 1;
    $details = $round->freeSpins['details'];
    if (isset($round->freeSpins['details']["type"])) {
      $type = $round->freeSpins['details']["type"];
    }
    if (isset($round->freeSpins['details']["extra_fg_details"])) {
      $details = $round->freeSpins['details']["extra_fg_details"];
      $winx = $details["fg_win_weight"][$type];

      if ($winx > 1) {
        if ($round->freeSpins["win_amount"] < $winx * $round->totalBet) {
          $freespin_feature = $round->getMultiplierValue($details["fg_weight_table"]["total_weight"], $details["fg_weight_table"]["symbiol_weight"]);
          // $freespin_feature = "fg_wd";
          $round->postMatrixInfo['reel_pos'] = $freespin_feature; // TODO
          $feature_details = $details[$freespin_feature];
          if ($freespin_feature == "fg_wd") {
            addWildSymbol($round, $feature_details);
          }
          if ($freespin_feature == "fg_my") {
            addMystrySymbol($round, $feature_details);
          }
        }
      }
    }
  }
}

function addWildSymbol($round, $details)
{
  $reel_num = [];
  $num_of_wild = $round->getMultiplierValue($details["symbol_config"]["total_weight"], $details["symbol_config"]["symbiol_weight"]);
  // $num_of_wild = 2;
  $round->postMatrixInfo["count"] = $num_of_wild;
  while (count($reel_num) < $num_of_wild) {
    $reel_position = $round->getMultiplierValue($details["reel_config"]["total_weight"], $details["reel_config"]["symbiol_weight"]);
    if (!in_array($reel_position - 1, $reel_num)) {
      array_push($reel_num, $reel_position - 1);
    }
  }
  // print_r($reel_num);
  for ($i = 0; $i < count($reel_num); $i++) {
    $random = rand(0, $round->game->numRows - 1);
    $round->matrix[$random][$reel_num[$i]] = "s";

  }
  $round->matrixString = array2d_to_string($round->matrix);
  $round->generateMatrixData($round->matrix);
  $round->matrixFlatten = $round->generateFlatMatrix($round->matrix);
  // echo $round->matrixString;  
}

function addMystrySymbol($round, $details)
{
  $reel_position = [];
  $count = 0;
  $reelCount = $details["reel"];
  while (count($reel_position) < $reelCount) {
    // echo count($reel_position), $reelCount;
    $weight = $round->getMultiplierValue($details["reel_config"]["total_weight"], $details["reel_config"]["symbiol_weight"]);
    if (in_array($weight, $reel_position) == false) {
      array_push($reel_position, $weight);

    }
  }
  $reel_occ = [];
  for ($i = 0; $i < count($reel_position); $i++) {
    $weight1 = $round->getMultiplierValue($details["symbol_config"]["total_weight"], $details["symbol_config"]["symbiol_weight"]);
    array_push($reel_occ, $weight1);
  }

  $index = rand(0, 1);
  for ($i = 0; $i < count($reel_position); $i++) {
    $index_val = $index;
    if ($index_val == 0) {
      for ($j = 0; $j < $reel_occ[$i]; $j++) {
        $round->matrix[$index_val][$reel_position[$i] - 1] = "m";
        $index_val += 1;
      }
    } elseif ($index_val == 1) {
      $index_val = $round->game->numRows - 1;
      $col = $reel_position[$i] - 1;
      if ($round->matrix[$index_val][$col] == "x") {
        $index_val -= 1;
      }
      for ($j = 0; $j < $reel_occ[$i]; $j++) {
        $round->matrix[$index_val][$col] = "m";
        $index_val -= 1;
      }
    }
  }
  $round->matrixString = array2d_to_string($round->matrix);
  $round->generateMatrixData($round->matrix);
  $round->matrixFlatten = $round->generateFlatMatrix($round->matrix);
}

function deside_wild_or_scatter(&$round, $details)
{
  $symbol = $details['symbol'];
  $count = get_element_count($round->matrixFlatten, $symbol);
  $weight = $details['weight'];
  $symbol_consider = "";
  $keys_weight = array_keys($weight);
  for ($i = 0; $i < count($keys_weight); $i++) {
    if ($count <= $keys_weight[$i]) {
      $symbol_consider = $weight[$keys_weight[$i]];
      break;
    }
  }
  if ($symbol_consider) {
    for ($i = 0; $i < $round->game->numColumns; $i++) { //5
      for ($j = 0; $j < $round->game->numRows; $j++) {  //3
        if ($symbol == $round->matrix[$j][$i]) {
          $round->matrix[$j][$i] = $symbol_consider;
        }
      }
    }

    $round->matrixString = array2d_to_string($round->matrix);
    $round->generateMatrixData($round->matrix);
    $round->matrixFlatten = $round->generateFlatMatrix($round->matrix);
  }
}

function handle_wild_multiplier(&$round, $details)
{
  $wild_position = [];
  $is_handle_wild_multiplier = false;

  if ($round->spinType == "normal") {
    $count = get_element_count($round->matrixFlatten, $round->game->wilds[0]);
    if ($count > 0) {
      // echo "count = ", $count;
      for ($col = 0; $col < ($round->game->numRows); $col++) {
        // echo "col = ";
        // print_r($round->matrix[$col]);
        $w_reel = array_filter($round->matrix[$col], function ($ele) {
          return $ele == "w";
        });
        // echo "wild_reel = ";
        // print_r($w_reel);
        if (count($w_reel) > 0) {
          $index_f = array_keys($w_reel);
          for ($i = 0; $i < count($index_f); $i++) {
            $round->screenWins[($col * $round->game->numColumns) + $index_f[$i]] = $round->getMultiplierValue($details[$round->spinType]["total_weight"], $details[$round->spinType]["bonus_weight"]);
            array_push($wild_position, ($col * $round->game->numColumns) + $index_f[$i]);
          }
        }
      }
      $is_handle_wild_multiplier = true;
    }
  } elseif ($round->spinType == "freespin") {
    $count = get_element_count($round->matrixFlatten, $round->game->wilds[0]);
    // print_r($round->screenWins);
    $type = $round->spinType;
    if (isset($round->freeSpins['details']["type"])) {
      $type = $round->freeSpins['details']["type"];
    }
    if (!isset($details["onereel"]) and $details["onereel"] != true) {
      $round->screenWins = $round->freeSpins['details']["screen_win"];
    }
    $mul = 1;
    $fs_deatils = $round->freeSpins['details'];
    $reel_multipliar = $fs_deatils['multiplier_reel'];
    // print_r($round->screenWins);
    for ($col = 0; $col < ($round->game->numColumns); $col++) {
      for ($i = 0; $i < $round->game->numRows; $i++) {
        $index = ($i * $round->game->numColumns) + $col;

        if (isset($details["onereel"]) and $details["onereel"] == true) {
            if ($round->matrix[$i][$col] == "w") {
            $mul_arr = checkReelMultplier($round, $details, $i, $col, $type, $reel_multipliar);
            $mul = $mul_arr[0];
            $reel_multipliar = $mul_arr[1];
            if ($mul > 1) {
              $is_handle_wild_multiplier = true;
              $round->screenWins[$index] = $mul;
              array_push($wild_position, $index);
              $round->freeSpins['multiplier'] *= $mul;
            }}
          } else {
          
            if ($round->screenWins[$index] == 0 and $round->matrix[$i][$col] == "w") {
              $mul = $round->getMultiplierValue($details[$type]["total_weight"], $details[$type]["bonus_weight"]);
              $round->screenWins[$index] = $mul;
              $is_handle_wild_multiplier = true;
              array_push($wild_position, $index);
            } elseif ($round->screenWins[$index] > 0) {
              $round->matrix[$i][$col] = "w";
            }
          }
        
      }
    }
    $round->postMatrixInfo['reel_multipliar'] = $reel_multipliar;

  }
  $round->matrixString = array2d_to_string($round->matrix);
  $round->matrixFlatten = $round->generateFlatMatrix($round->matrix);
  $matrix = $round->matrix;
  if ($is_handle_wild_multiplier) {
    $round->postMatrixInfo['matrix'] = $matrix;
    $round->postMatrixInfo['feature_name'] = "StickyWild";
    $round->postMatrixInfo['matrixString'] = array2d_to_string($matrix);
    $round->postMatrixInfo['wild_positions'] = $wild_position;
    $round->postMatrixInfo['matrixFlatten'] = $round->generateFlatMatrix($matrix);
    // $round->matrixFlatten = $round->generateFlatMatrix($matrix);
  }

}

function checkReelMultplier($round, $details, $row, $col, $type, $reel_multipliar)
{


  if (isset($details[$type]["bonus_weight"][count($reel_multipliar[$col])])) {
    $multiplier = $details[$type]["bonus_weight"][count($reel_multipliar[$col])];
    array_push($reel_multipliar[$col], $multiplier);
  } else {
    $multiplier = 1;
  }
  // $fs_deatils['multiplier_reel'] = $reel_multipliar;
  $round->postMatrixInfo['reel_multipliar'] = $reel_multipliar;
  // print_r($round->postMatrixInfo['reel_multipliar']);
  return array($multiplier, $reel_multipliar);
}

function handle_special_symbol(&$round, $details)
{
  $wild_position = [];
  $is_special_symbol = false;
  $old_matrix = $round->matrix;

  if ($round->spinType == "normal") {
    // print_r($round->matrixFlatten);
    // echo "round->matrixFlatten = ", $round->game->wilds[0];
    $sym = $details["mystry_symbol"];
    $total_weight = $details["total_weight"];
    $symbiol_weight = $details["symbiol_weight"];
    $count = get_element_count($round->matrixFlatten, $sym);
    if ($count > 0) {
      $symValue = $round->getMultiplierValue($total_weight, $symbiol_weight);
      for ($col = 0; $col < ($round->game->numRows); $col++) {
        $m_reel = array_filter($round->matrix[$col], function ($ele) {
          return $ele == "m";
        });
        // print_r($m_reel);
        if (count($m_reel) > 0) {
          $is_special_symbol = true;
          $index_f = array_keys($m_reel);
          for ($i = 0; $i < count($index_f); $i++) {
            // echo "col = ", $col, "  , ", $index_f;
            $round->matrix[$col][$index_f[$i]] = $symValue;
            // $round->screenWins[($col  * $round->game->numColumns) + $index_f[$i]]  = $round->getMultiplierValue($details[$round->spinType]["total_weight"], $details[$round->spinType]["bonus_weight"]);
            array_push($wild_position, ($col * $round->game->numColumns) + $index_f[$i]);
          }
        }
      }
    }
    // echo "2";
  } elseif ($round->spinType == "freespin") {
    $sym = $details["mystry_symbol"];
    $total_weight = $details["total_weight"];
    $symbiol_weight = $details["symbiol_weight"];
    $count = get_element_count($round->matrixFlatten, $sym);

    if ($count > 0) {
      $symValue = $round->getMultiplierValue($total_weight, $symbiol_weight);
      for ($i = 0; $i < $round->game->numColumns; $i++) { //5
        for ($j = 0; $j < $round->game->numRows; $j++) {  //3
          if ($round->matrix[$j][$i] == $sym) {
            $is_special_symbol = true;
            $round->matrix[$j][$i] = $symValue;
            //(($round->game->numColumns) * $i) + $j
            array_push($wild_position, (($round->game->numColumns) * $j) + $i);
          }
        }
      }
    }
  }
  if ($is_special_symbol) {
    $round->matrixString = array2d_to_string($round->matrix);
    $round->matrixFlatten = $round->generateFlatMatrix($round->matrix);
    // $round->postMatrixInfo['matrix'] = array2d_to_string($old_matrix);
    $round->postMatrixInfo['feature_name'] = "MystryFeature";
    $round->postMatrixInfo['symbol'] = $symValue;
    $round->postMatrixInfo['matrixString'] = array2d_to_string($old_matrix);
    $round->postMatrixInfo['wild_positions'] = $wild_position;
    // $round->matrixFlatten = $round->generateFlatMatrix($matrix);
  }

}

function calcExtraFreeSpinCount($fgstart, $presentfg)
{
  $difference = $fgstart - $presentfg;
  $extraFreeSpinsRewarded = 0;
  if ($difference > 0 && rand(0, 7) == 1) {
    $bigrandom = rand(0, ($difference * ($difference + 1) / 2));
    for ($i = $difference; $i > 0; $i--) {
      if ($bigrandom >= 0) {
        $extraFreeSpinsRewarded++;
        $bigrandom = $bigrandom - $i;
      }
    }
  }
  return $extraFreeSpinsRewarded;
}

function check_special_symbol_win(&$round, $details)
{
  $feature_val = [];
  $wild_position = [];
  $random_symbol = $round->freeSpins['details']['random_symbol'];
  $multiplier = $round->freeSpins['details']['multiplier'];
  $reel_pos = array();
  for ($i = 0; $i < $round->game->numColumns; $i++) { //5
    $sym = false;
    for ($j = 0; $j < $round->game->numRows; $j++) {  //3
      if ($round->matrix[$j][$i] == $random_symbol) {
        $sym = true;
      }
    }
    if ($sym == true) {
      array_push($reel_pos, $i);
      $sym = false;
    }
  }
  $feature_val = $round->check_symbol_win($reel_pos, $random_symbol);
  if ($feature_val) {
    $feature_val["wild_positions"] = $reel_pos;
    if ($feature_val['win'] > 0) {
      $round->winAmount += $feature_val['win'];
    }
  }
  $details = array(
    'fs_game_id' => 2,
    "random_symbol" => $round->freeSpins['details']['random_symbol'],
    "jackpot_reward" => $round->freeSpins['details']['jackpot_reward'],
    "parent_type" => "bonus",
    "wild_positions" => $wild_position,
    "multiplier" => $round->freeSpins['details']['multiplier']
  );

  if ($round->freeSpins['spins_left'] > 1) {
    update_freespins(
      $round->freeSpins['id'],
      $round->game->gameId,
      $round->freeSpins["details"]['fs_game_id'],
      $round->player->accountId,
      $round->roundId,
      0,
      $multiplier,
      $round->amountType,
      $round->freeSpins['round_ids'],
      $round->freeSpins['history'],
      $details
    );
  } else {
    $round->freespinState = 1;
  }

  if ($round->freeSpins['spins_left'] > 0) {
    $round->postMatrixInfo = $feature_val;
  }

}

function get_element_count($array, $element)
{
  return count(array_keys($array, $element));
}

function check_nacro_bonus(&$round, $details)
{
  $bonus_game_id = 0;
  $count = get_element_count($round->matrixFlatten, $round->game->scatters[0]);
  if ($count >= 3) {
    return;
  }
  $bonus_occurance = $details['total_weight'];
  $generate_random = rand(1, $bonus_occurance);
  /** Hard code for terracotta nacro bonus
   * 
   * $generate_random = 199;  // for nacro bonus
   * $generate_random = 201;  // for nacro diamond
   * 
   */
  // TODO
  // $generate_random = 199;
  for ($i = 0; $i < count($details['bonus_weight']); $i++) {
    if ($details['bonus_weight'][$i] >= $generate_random) { //200 >= 219
      $bonus_game_id = $details['bonus_game_ids'][$i];
      break;
    }
  }
  if ($bonus_game_id) {
    $factoryObject = new BonusFactory($round->game, $round);
    $bonusObject = $factoryObject->getObjectFromId($bonus_game_id);
    if ($bonusObject != null and !empty($bonusObject)) {
      $bonusObject->checkAndGrantBonusGame();
    }
  }
  // if($generate_random <= 200){   
  //   $bonus_game_id = 380002;
  // }
  // if($generate_random > 200 && $generate_random <= 273){
  //   $bonus_game_id = 380003;
  // }
  // $bonus_game_id = 380003;
  // $bonus_game_id = 380002;
  return $bonus_game_id;
}


# todo need to make it generic
function get_element_count_candyburst($array, $element)
{
  $symbols_count = 0;

  for ($i = 0; $i < count($array); $i++) {

    if (in_array($element, $array[$i])) {
      $symbols_count++;
    }

  }

  return $symbols_count;
}

function flip_2d_array($matrix)
{
  $flipped_matrix = array();
  for ($i = 0; $i < count($matrix); $i++) {
    for ($j = 0; $j < count($matrix[0]); $j++) {
      $flipped_matrix[$j][$i] = $matrix[$i][$j];
    }
  }

  return $flipped_matrix;
}

function handle_spawning_wild(&$round, $details)
{
  # todo reuse the body of handle_expanding_wild() function
  $bonus_symbol = $details['bonus_symbol'];

  $num_bonus_symbols = 0;
  if (in_array($bonus_symbol, $round->matrixFlatten)) {
    $num_bonus_symbols = array_count_values($round->matrixFlatten)[$bonus_symbol];
  }

  # check: number of bonus symbols must be less than 3
  if (!in_array($num_bonus_symbols, $details['eligible_num_symbols'])) {
    return;
  }

  $weights = $details['weights'];
  $num_wild_reels = $details['num_wild_reels'];

  # Probability check
  # Determine how many reels can become spawning wild reels
  $num_spawning_reels = weighted_random_number($weights, $num_wild_reels);

  # todo remove following hardcoded $num_spawning_reels line force / forcing
  if ($num_spawning_reels === 0 || $num_spawning_reels == 0 || !$num_spawning_reels) {
    return;
  }

  $flipped_matrix = flip_2d_array($round->matrix);

  $game = $round->game;
  $reel_indexes = array();

  for ($i = 0; $i < $game->numColumns; $i++) {
    array_push($reel_indexes, $i);
  }

  # Wild reel can spawn any reel from 0 to machine's num_reels
  # Values will range from 0 to $game->numColumns
  shuffle($reel_indexes);

  $min_spawn_wild_reel_index = $reel_indexes[0];
  $max_reel_index = $reel_indexes[0];
  $choosen_reel_indexs = array();

  for ($i = 0; $i < $num_spawning_reels; $i++) {
    $reel_index = $reel_indexes[$i];

    $flipped_matrix[$reel_index] = array_fill(
      0,
      $game->numRows,
      $details['spawning_wild_symbol']
    );

    if ($reel_index <= $min_spawn_wild_reel_index) {
      $min_spawn_wild_reel_index = $reel_index;
    }

    if ($reel_index > $max_reel_index) {
      $max_reel_index = $reel_index;
    }

    array_push($choosen_reel_indexs, $reel_index);
  }
  $round->multipliers = array(
    "type" => "wild_multiplier",
    "id" => 1,
    "value" => $max_reel_index + 1
  );

  $matrix = flip_2d_array($flipped_matrix);
  $round->postMatrixInfo['matrix'] = $matrix;
  $round->postMatrixInfo['feature_name'] = 'spawning_wild';
  $round->postMatrixInfo['matrixString'] = array2d_to_string($matrix);
  $round->postMatrixInfo['matrixFlatten'] = $round->generateFlatMatrix($matrix);

  sort($choosen_reel_indexs);
  $moving_wilds_data = get_walking_wild_data($choosen_reel_indexs);

  # print "MIN ".$min_spawn_wild_reel_index."\n";
  # 0, 1, 2, 3, 4
  # Num re-spins to award: $game->numColumns - (min_spawn_wild_reel_index + 1)
  #....
  #.... To load re-spin reelset ID during re-spins
  # $game->numColumns - $spins_left => 5 - 4 = 1
  # $game->numColumns - $spins_left => 5 - 3 = 2
  # $game->numColumns - $spins_left => 5 - 2 = 3
  # $game->numColumns - $spins_left => 5 - 1 = 4

  $num_respins = $game->numColumns - ($min_spawn_wild_reel_index + 1);
  if ($num_respins <= 0) {
    return;
  }

  $multiplier = 1; # todo get this mult dynamically from configuration
  $round_ids = array($round->roundId);
  $history = array($num_respins);
  $rs_details = array(
    "spin_type" => "respin",
    "bonus_game_id" => $details['bonus_game_id'],
    "moving_wilds_data" => $moving_wilds_data
  );

  award_freespins(
    $game->gameId,
    $game->subGameId,
    $round->player->accountId,
    $round->roundId,
    $num_respins,
    $multiplier,
    $round->coinValue,
    $round->numCoins,
    $round->numBetLines,
    $round->amountType,
    $round_ids,
    $history,
    $rs_details
  );


  $respins_info = array(
    'type' => 'respins',
    'num_spins' => $num_respins,
    'spins_left' => $num_respins,
    "win_amount" => 0
  );

  array_push($round->bonusGamesWon, $respins_info);
}

/*
 * @ fun handle_spawning_wild_candy_burst.
 * This function will be called in post matrix feature and for two type
 * of spin types, normal and freespin. So it will be not called in respin.
 * Its not configured for the respin. ****
 * */
function handle_spawning_wild_candy_burst(&$round, $details)
{
  # todo reuse the body of handle_expanding_wild() function

  // If current round is sticky respin round, spawning wild feature will not be triggered. // 20032019
  if (
    isset($round->previousRound['sticky_win_details']) && isset($round->previousRound['sticky_win_details'])
    && ($round->previousRound['sticky_win_details']['sticky_win_round'])
  ) {
    return false;
  }

  $bonus_symbol = $details['bonus_symbol'];
  $num_bonus_symbols = 0;
  $flipped_matrix = flip_2d_array($round->matrix);

  if (in_array($bonus_symbol, $round->matrixFlatten)) {
    $num_bonus_symbols = get_element_count_candyburst($flipped_matrix, $bonus_symbol); // 16042019
  }


  # check: number of bonus symbols must be less than 3
  if (!in_array($num_bonus_symbols, $details['eligible_num_symbols'])) {
    return;
  }

  $weights = $details['weights'];
  $num_wild_reels = $details['num_wild_reels'];

  # Probability check
  # Determine how many reels can become spawning wild reels
  $num_spawning_reels = weighted_random_number($weights, $num_wild_reels);

  if ($num_spawning_reels === 0 || $num_spawning_reels == 0 || !$num_spawning_reels) {
    return;
  }

  $game = $round->game;
  $reel_indexes = array();

  // @ var $reel_indexes, store index of only those
  // reels which are not having bonus symbols.

  for ($i = 0; $i < $game->numColumns; $i++) {

    if (in_array($bonus_symbol, $flipped_matrix[$i])) {
      continue;
    }

    array_push($reel_indexes, $i);
  }

  # Wild reel can spawn any reel from 0 to machine's num_reels
  # Values will range from 0 to $game->numColumns
  shuffle($reel_indexes);

  $min_spawn_wild_reel_index = $reel_indexes[0];
  $choosen_reel_indexs = array();
  $round->spawnFeature = [];

  // Below if condition to ensure that wild symbols
  // will be placed on only reels having no bonus symbol.

  if (count($reel_indexes) < $num_spawning_reels) {
    $num_spawning_reels = count($reel_indexes);
  }

  for ($i = 0; $i < $num_spawning_reels; $i++) {
    $reel_index = $reel_indexes[$i];

    $weights_num_wild_symbols = $details['weights_num_wild_symbols'];
    $num_wild_symbols = $details['num_wild_symbols'];
    # Determine how many spawning wild symbols could be stacked on a reel.
    $num_spawning_wild_symbols = weighted_random_number($weights_num_wild_symbols, $num_wild_symbols);
    for ($k = 0; $k < $num_spawning_wild_symbols; $k++) {
      $flipped_matrix[$reel_index][$k] = $details['spawning_wild_symbol'];
    }

  }

  $round->postMatrixInfo['original_matrix'] = $round->matrixString;
  $matrix = flip_2d_array($flipped_matrix);
  $round->matrix = $matrix;
  $round->matrixFlatten = $round->generateFlatMatrix($matrix);

  $round->postMatrixInfo['matrix'] = $round->matrix;
  $round->postMatrixInfo['feature_name'] = 'spawning_wild';
  $round->postMatrixInfo['matrixString'] = array2d_to_string($matrix);
  $round->postMatrixInfo['matrixFlatten'] = $round->matrixFlatten;

  $round->spawnFeature['feature'] = true;
}

function get_walking_wild_data($choosen_reel_indexs)
{
  # todo move this config to database or some other configuration
  $walking_wilds_config = array(
    0 => array(1, 2, 3, 4),
    1 => array(2, 3, 4),
    2 => array(3, 4),
    3 => array(4),
    4 => array()
  );

  $reel_index_to_move = array();

  foreach ($choosen_reel_indexs as $index => $reel_index) {
    array_push($reel_index_to_move, $walking_wilds_config[$reel_index]);
  }

  $num_moving_wild_reels = count($reel_index_to_move);
  $max_num_moving = count($reel_index_to_move[0]);
  $moving_wilds_data = array();

  for ($i = 0; $i < $max_num_moving; $i++) {
    $temp = array();
    for ($j = 0; $j < $num_moving_wild_reels; $j++) {
      $len = count($reel_index_to_move[$j]);
      if ($i + 1 <= $len) {
        array_push($temp, $reel_index_to_move[$j][$i]);
      }
    }
    array_push($moving_wilds_data, $temp);
  }
  return $moving_wilds_data;
}

function handle_walking_wilds(&$round, $details)
{
  $walking_wild_symbol = $details['walking_wild_symbol'];

  $game = $round->game;
  $flipped_matrix = flip_2d_array($round->matrix);
  $moving_wilds_data = $round->freeSpins['details']['moving_wilds_data'];
  $walking_wilds_data_index = $round->freeSpins['num_spins'] - $round->freeSpins['spins_left'];
  $walking_wild_reel_indexes = $moving_wilds_data[$walking_wilds_data_index];
  $reel_count = count($walking_wild_reel_indexes);

  for ($i = 0; $i < $reel_count; $i++) {
    $reel_index = $walking_wild_reel_indexes[$i];
    $flipped_matrix[$reel_index] =
      array_fill(0, count($flipped_matrix[$reel_index]), $walking_wild_symbol);
  }

  $matrix = flip_2d_array($flipped_matrix);
  $round->postMatrixInfo['matrix'] = $matrix;
  $round->postMatrixInfo['feature_name'] = 'walking_wild'; # todo Hardcoded. Get it dynamically.
  $round->postMatrixInfo['matrixString'] = array2d_to_string($matrix);
  $round->postMatrixInfo['matrixFlatten'] = $round->generateFlatMatrix($matrix);
}

function handle_default_handler(&$round, $details)
{
  print "Post matrix feature not implemented.";
  exit;
}
// function pick_one_bonus(&$round, $details){


// }

function grant_bonus_game(
  $game_id,
  $sub_game_id,
  $base_round_id,
  $round_id,
  $account_id,
  $bonus_game_id,
  $bonus_game_code,
  $num_picks,
  $game_data,
  $multiplier,
  $amount_type,
  $coin_value,
  $num_coins,
  $num_betlines,
  $state = 0
) {
  global $db;
  $table_name = 'gamelog.bonus_games';

  if ($amount_type == AMOUNT_TYPE_FUN) {
    $table_name = 'gamelog.bonus_games_fun';
  }

  $bonus_query = <<<QUERY
    INSERT INTO {$table_name}(game_id, sub_game_id,
                base_round_id, round_id, account_id, bonus_game_id,
                bonus_game_code, num_picks, num_user_picks, picks_data,
                game_data, multiplier, win_amount, amount_type, state,
                coin_value, num_coins, num_betlines)
         VALUES ($game_id, $sub_game_id, $base_round_id, $round_id,
                 $account_id, $bonus_game_id, '$bonus_game_code', $num_picks,
                 0, '', '$game_data', $multiplier, 0, $amount_type, $state,
                 $coin_value, $num_coins, $num_betlines)
QUERY;
  $db->runQuery($bonus_query) or ErrorHandler::handleError(1, "CASINO_LIB004");
}

function update_bonus_game(
  $picks_data,
  $num_user_picks,
  $game_data,
  $win_amount,
  $state,
  $round_id,
  $game_id,
  $user_id,
  $row_id,
  $amount_type = AMOUNT_TYPE_CASH
) {
  global $db;

  $picks_data = encode_objects($picks_data);
  $game_data = encode_objects($game_data);
  $table_name = 'gamelog.bonus_games';

  if ($amount_type == AMOUNT_TYPE_FUN) {
    $table_name = 'gamelog.bonus_games_fun';
  }

  $query = <<<QUERY
        UPDATE {$table_name}
           SET picks_data     = '{$picks_data}',
               num_user_picks = {$num_user_picks},
               game_data      = '{$game_data}',
               win_amount     = {$win_amount},
               state          = {$state}
         WHERE round_id = {$round_id} AND
               game_id = {$game_id} AND
               account_id  = {$user_id} AND
               id = {$row_id} AND
               state = 0
QUERY;

  $db->runQuery($query) or ErrorHandler::handleError(1, "CASINO_LIB005");
}

/*
 * @fun grant_queued_bonus
 * To save the queued games in db.
 */
function grant_queued_bonus(
  $game_id,
  $sub_game_id,
  $base_round_id,
  $round_id,
  $account_id,
  $bonus_game_id,
  $bonus_game_code,
  $num_picks,
  $game_data,
  $multiplier,
  $amount_type,
  $coin_value,
  $num_coins,
  $num_betlines,
  $state = 0
) {
  global $db;

  $tableName = 'gamelog.queued_bonus_games';

  if ($amount_type == AMOUNT_TYPE_FUN) {
    $tableName = 'gamelog.queued_bonus_games_fun';
  }

  $queued_query = <<<QUERY
    INSERT INTO {$tableName}(game_id, sub_game_id,
                base_round_id, round_id, account_id, bonus_game_id,
                bonus_game_code, num_picks, num_user_picks, picks_data,
                game_data, multiplier, win_amount, amount_type, state,
                coin_value, num_coins, num_betlines)
        VALUES ($game_id, $sub_game_id, $base_round_id, $round_id,
                $account_id, $bonus_game_id, '$bonus_game_code', $num_picks,
                0, '', '$game_data', $multiplier, 0, $amount_type, $state,
                $coin_value, $num_coins, $num_betlines)
QUERY;
  $db->runQuery($queued_query) or ErrorHandler::handleError(1, "CASINO_LIB004");
}

/*
 * @fun update_queued_bonus
 * Once queued bonus is palyed state will get set to 1.
 */
function update_queued_bonus($id, $amount_type = AMOUNT_TYPE_CASH, $state = 1)
{
  global $db;

  $tableName = 'gamelog.queued_bonus_games';

  if ($amount_type == AMOUNT_TYPE_FUN) {
    $tableName = 'gamelog.queued_bonus_games_fun';
  }

  $update_query = <<<QUERY
		UPDATE {$tableName}
		SET state={$state}
		WHERE id={$id}
QUERY;

  $db->runQuery($update_query) or ErrorHandler::handleError(1, "CASINO_LIB013");
}

function is_request_allowed($request_type)
{
  # todo TODO XXX Configure the below ones in config.php
  $end_game_allowed_operators = array('DGM', 'BTN');
  $operator_code = substr($_SESSION['full_site_code'], 2, 3);
  if ($request_type == ENDROUND_MODE && !in_array($operator_code, $end_game_allowed_operators)) {
    return false;
  }

  return true;
}
?>