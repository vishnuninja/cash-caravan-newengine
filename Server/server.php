<?php
/**
 * @file    casino_server.php
 * @date    Arpil 18 2019
 * @authors
 *
 * @desc This is file where game client makes requests to casino server
 *       It is the core hanlder for casino slots server from where all
 *       the required funtions are called
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
ini_set("display_errors", 0); error_reporting(~E_ALL);
// ini_set("display_errors", 1); error_reporting(E_ALL);
require_once 'sanitizer.php';
if(isset($_POST['session_id']) && ($_POST['session_id'] == "" || strlen($_POST['session_id']) <= 0)) {
	require_once 'session_handler_inhouse.php';
}
else {
	require_once 'session_handler.php';
}
require_once 'tools.lib.php';
require_once 'casino.lib.php';
class CasinoServer {
	var $game, $round, $player;
	private function __construct($game, $round, $player)
	{
		$this->game   = $game;
		$this->round  = $round;
		$this->player = $player;
	}

	public static function initializeAndRunCasino($requestParams)
	{
		if(!is_request_allowed($requestParams['request_type'])) {
			return;
		}

        $player = new Player($requestParams['amount_type'],
		$requestParams['game_id'], $requestParams['platform_type']);

		$game   = Game::loadGame($requestParams['game_id'],$requestParams['sub_game_id']);
		
		$round  = new Round($game, $player);
		
		close_abandoned_fun($round, $player, $requestParams);
		#validate_request_params($requestParams, $game, $round);
		
		
        // If promo spin(free) present but from client amount_type 1
        // sent. In this case amout_type will be set to 3 in round.php
        // when round objected created.
		$casinoServerObj = new CasinoServer($game, $round, $player);
		
        // Now check if any fs or bonus triggered from promo spin is remaining
        // set amount_type = 3 in request params and load the fs and bonus games.
        $requestParamsPromo = $requestParams;
        $requestParamsPromo['amount_type'] = AMOUNT_TYPE_PFS;
        $casinoServerObj->setRequestParams($requestParamsPromo);
        $casinoServerObj->loadBonusGames();
        $casinoServerObj->loadFreeSpins();
        // If there is no any FS or bonus game from promo spin,
        // set request params back to what sent by client. And load the bonus and FS
        // $round->player->amountType = 3, means Promo spins are remaining.
		
        if(!$casinoServerObj->round->bonusGames && !$casinoServerObj->round->freeSpins
		&& $requestParams['amount_type'] != AMOUNT_TYPE_PFS) {
			$casinoServerObj->setRequestParams($requestParams);
            $casinoServerObj->loadBonusGames();     # simcode
            $casinoServerObj->loadFreeSpins();
			
        }
		// print_r($round->player);
        $casinoServerObj->loadPreviousRound();  # simcode
        $casinoServerObj->loadQueuedBonusGames(); #simcode
        $casinoServerObj->loadGamble();
        validate_request_params($requestParams, $game, $round);
        $casinoServerObj->player->setMiscData($round->previousRound['misc']); # for bonusamount
        $casinoServerObj->handleRequest();
	}

	private function setRequestParams($requestParams)
	{
		$this->round->setRequestParams($requestParams);
	}

	private function loadPreviousRound()
	{
		$this->round->loadPreviousRound($this->game->gameId,
										$this->player->accountId);
	}

	private function loadBonusGames()
	{
		$this->round->loadBonusGames();
	}



	private function loadQueuedBonusGames()
    {
        $this->round->loadQueuedBonusGames();
    }

	private function loadFreeSpins()
	{
		$this->round->loadFreeSpins();
		$this->round->loadFreeSpinsData();
	}

    private function loadGamble()
    {
        $this->round->loadGamble();
    }

	private function handleRequest() {
		$requestType = $this->round->requestParams['request_type'];
		switch($requestType) {
			case INIT_MODE:
				$this->handleInitialization();
				break;
			case PLAY_MODE:
				$this->handleSpin();
				break;
			case BONUS_MODE:
				$this->handleBonusRound();
				break;
			case GAMBLE_MODE:
				$this->handleGambleRound();
				break;
            case ENDROUND_MODE:
                $this->handleGameEndRound();
                break;
			case OTHER_MODE:
				$this->handleOtherRequest();
				break;
			case COLLECT_MODE:
				$this->handleCollectRequest();
				break;
			case ExtraFSMode:
				$this->handleExtraFGRequest();
				break;
			default:
				$this->handleDefaultRequest();
				break;
		}
		
		$this->sendMessageToClient();
	}

	private function handleInitialization() {
		handle_initialization($this->game, $this->round, $this->player);
	}

	private function handleSpin() {
		handle_spin($this->game, $this->round, $this->player);
	}

	private function handleExtraFGRequest() {
		handle_extra_fg_request($this->game, $this->round, $this->player);
	}

	private function handleBonusRound() {
		handle_bonus_round($this->game, $this->round, $this->player);
	}

	private function handleGambleRound() {
		handle_gamble_round($this->game, $this->round, $this->player);
	}

    private function handleGameEndRound() {
        handle_game_end_round($this->game, $this->round, $this->player);
    }

	private function handleOtherRequest() {
	
		handle_other_request($this->game, $this->round, $this->player);
	}

    private function handleCollectRequest() {
        handle_collect_request($this->game, $this->round, $this->player);
    }

	private function handleDefaultRequest() {
		handle_default_request($this->game, $this->round, $this->player);
	}

	private function sendMessageToClient() {
		MessageHandler::sendMessage($this->game, $this->round, $this->player);
	}
}

function main($request_params)
{
	CasinoServer::initializeAndRunCasino($request_params);
}
// print_r($request_params);
main($request_params); # simcode
?>
