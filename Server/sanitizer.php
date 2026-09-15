<?php
require_once 'message_handler.php';

class Sanitizer {
    var $requestParams, $requestTypes, $initParams, $spinParams, $bonusParams,
        $amountTypes;

    public function __construct(&$requestParams) {
        $this->requestParams = &$requestParams;
        $this->requestTypes = Array(1, 2, 3, 4, 5, 6, 7, 8);
        $this->amountTypes  = Array(1, 3, 4);
        # todo TODO need to move from username to session_id
        
        $this->initParams = Array('game_id', 'sub_game_id', 'request_type',
                                  'amount_type','username');
        $this->spinParams = Array('game_id','sub_game_id' ,'request_type',
                                  'amount_type', 'username',
                                  'coin_value', 'num_coins',
                                  'num_betlines');
        $this->bonusParams = Array('game_id','sub_game_id' ,'request_type',
                                   'amount_type', 'username',
                                   'bonus_game_id', 'pick_position');
        $this->extraFreesSpinParams = Array('game_id', 'sub_game_id', 'request_type',
                                            'amount_type','username','coin_value', 'num_coins',
                                            'num_betlines');
        $this->extraBonusParams = Array('game_id','sub_game_id' ,'request_type',
                                   'amount_type', 'username',
                                   'bonus_game_id','pick_position');
        $this->gambleParams = Array('game_id', 'request_type',
                                   'amount_type', 'username',
                                   'bet_amount', 'pick_position');
       $this->endGameParams = Array('game_id', 'request_type',
                                    'amount_type', 'session_id');
    }

    public static function sanitizeInputParams(&$requestParams) {
        #return; # todo TODO XXX Need to enable this one
        $sanitizer = new Sanitizer($requestParams);
        $sanitizer->sanitize();
    }

    private function sanitize() {
        $this->sanitizeRequestType();
        
        if($this->requestParams['request_type'] === 1) {
            $this->sanitizeInitParams();
        }
        else if($this->requestParams['request_type'] === 2) {
            $this->sanitizeSpinParams();
        }
        else if($this->requestParams['request_type'] === 3) {
            $this->sanitizeBonusParams();
        }
        else if($this->requestParams['request_type'] === 4) {
            $this->sanitizeGambleParams();
        }
        else if($this->requestParams['request_type'] === 5) {
            $this->sanitizeEndGameRoundParams();
        }
        else if($this->requestParams['request_type'] === 6) {
            $this->handleOtherRequestParams();
        }
        else if($this->requestParams['request_type'] === 7) {
            $this->sanitizeInitParams();
        }
        else if($this->requestParams['request_type'] === 8) {
            $this->sanitizeextraFreesSpinParams();
        }
        else {
            ErrorHandler::handleError(1, "INVALID_DATA_REQ_TYPE", "Type of request type is invalid.");
        }

        $this->sanitizeGameId();
        $this->sanitizeAmountType();
        $this->sanitizeUserName();  # todo TODO need to change it to session_id
    }

    private function sanitizeRequestType()
    {
        // print_r($this->requestParams);
        if(!isset($this->requestParams['request_type'])) {
            ErrorHandler::handleError(1, "REQ_TYPE_NOT_FOUND", "Request type is not found.");
        }

        if(!in_array($this->requestParams['request_type'], $this->requestTypes) ||
           !is_numeric($this->requestParams['request_type']) ||
           is_float($this->requestParams['request_type'])) {
            ErrorHandler::handleError(1, "INVALID_REQ_TYPE", "Invalid request type.");
        }

        $this->requestParams['request_type'] = (int)$this->requestParams['request_type'];
        $_POST['request_type'] = $this->requestParams['request_type'];

        if($this->requestParams['request_type'] <= 0) {
            ErrorHandler::handleError(1, "INVALID_REQ_TYPE", "Invalid request type..");
        }
    }

    private function sanitizeInitParams() {
        $this->sanitizeNumberOfParams($this->initParams);
    }

    private function sanitizeSpinParams() {
        $this->sanitizeNumberOfParams($this->spinParams);
        $this->sanitizeNumCoins();
        $this->sanitizeCoinValue();
        $this->sanitizeNumBetLines();
    }

    private function sanitizeextraFreesSpinParams() {
        $this->sanitizeNumberOfParams($this->spinParams);
        $this->sanitizeNumCoins();
        $this->sanitizeCoinValue();
        $this->sanitizeNumBetLines();
    }



    private function sanitizeBonusParams() {
        $this->sanitizeNumberOfParams($this->bonusParams);
        $this->sanitizeBonusGameId();
        $this->sanitizePickPosition();
    }
    private function handleOtherRequestParams() {
        $this->sanitizeNumberOfParams($this->extraBonusParams);
        $this->sanitizeBonusGameId();
        $this->sanitizePickPosition();

    }

    private function sanitizeGambleParams() {
        $this->sanitizeNumberOfParams($this->gambleParams);
        $this->sanitizeBetAmount();
        $this->sanitizePickPosition();
    }

    private function sanitizeEndGameRoundParams() {
        $this->sanitizeNumberOfParams($this->endGameParams);
    }



    private function sanitizeGameId()
    {
        if(!is_numeric($this->requestParams['game_id']) ||
           is_float($this->requestParams['game_id'])) {
            ErrorHandler::handleError(1, "INVALID_GAME_ID", "Invalid Game ID.");
        }

        $this->requestParams['game_id'] = (int)$this->requestParams['game_id'];
        $_POST['game_id'] = $this->requestParams['game_id'];

        if($this->requestParams['game_id'] <= 0) {
            ErrorHandler::handleError(1, "INVALID_GAME_ID", "Invalid Game ID.");
        }
    }

    private function sanitizeAmountType()
    {
        if(!is_numeric($this->requestParams['amount_type']) ||
           is_float($this->requestParams['amount_type'])) {
            ErrorHandler::handleError(1, "INVALID_AMOUNT_TYPE", "Invalid Amount Type.");
        }

        $this->requestParams['amount_type'] = (int)$this->requestParams['amount_type'];
        $_POST['amount_type'] = $this->requestParams['amount_type'];

        if($this->requestParams['amount_type'] <= 0 ||
           !in_array($this->requestParams['amount_type'], $this->amountTypes)) {
            ErrorHandler::handleError(1, "INVALID_AMOUNT_TYPE", "Invalid Amount Type.");
        }
    }

    private function sanitizeUserName() # todo TODO change it to session_id
    {
        if(!ctype_alnum($this->requestParams['username'])) {
            ErrorHandler::handleError(1, "INVALID_USERNAME", "Invalid Username.");
        }
    }

    private function sanitizeNumberOfParams($allowedParams) {
        if(count($allowedParams) != count($this->requestParams)) {
            // ErrorHandler::handleError(1, "INVALID_NUM_PARAMS", "Invalid number of parameters");
        }
        foreach($allowedParams as $index => $parameter) {

            if(!isset($this->requestParams[$parameter])) {
                ErrorHandler::handleError(1, "PARAM_NOT_FOUND", "Parameter {$parameter} is not sent by game.");
            }
        }
    }

    private function sanitizeNumCoins()
    {
        if(!is_numeric($this->requestParams['num_coins']) ||
           is_float($this->requestParams['num_coins'])) {
            ErrorHandler::handleError(1, "INVALID_NUM_COINSslot_nin1", "Invalid number of coins.");
        }

        $this->requestParams['num_coins'] = (int)$this->requestParams['num_coins'];
        $_POST['num_coins'] = $this->requestParams['num_coins'];

        if($this->requestParams['num_coins'] <= 0) {
            ErrorHandler::handleError(1, "INVALID_NUM_COINSslot_nin2", "Invalid number of coins.");
        }
    }

    private function sanitizeCoinValue()
    {
        if(!is_numeric($this->requestParams['coin_value']) ||
           is_float($this->requestParams['coin_value'])) {
            ErrorHandler::handleError(1, "INVALID_COIN_VALUE", "Invalid coin value.");
        }

        if(!is_numeric($this->requestParams['coin_value2']) ||
           is_float($this->requestParams['coin_value2'])) {
            ErrorHandler::handleError(1, "INVALID_COIN_VALUE2", "Invalid coin value2.");
        }

        $this->requestParams['coin_value2'] = (int)$this->requestParams['coin_value2'];
        $this->requestParams['coin_value'] = (int)$this->requestParams['coin_value'];
        $_POST['coin_value'] = $this->requestParams['coin_value'];

        if($this->requestParams['coin_value'] <= 0) {
            ErrorHandler::handleError(1, "INVALID_COIN_VALUE", "Invalid coin value.");
        }

        $this->requestParams['coin_value'] += $this->requestParams['coin_value2'];
        $_POST['coin_value'] = $this->requestParams['coin_value'];
    }

    private function sanitizeNumBetLines()
    {
        if(!is_numeric($this->requestParams['num_betlines']) ||
           is_float($this->requestParams['num_betlines'])) {
            ErrorHandler::handleError(1, "INVALID_NUM_BETLINES", "Invalid number of betlines.");
        }

        $this->requestParams['num_betlines'] = (int)$this->requestParams['num_betlines'];
        $_POST['num_betlines'] = $this->requestParams['num_betlines'];

        if($this->requestParams['num_betlines'] <= 0) {
            ErrorHandler::handleError(1, "INVALID_NUM_BETLINES", "Invalid number of betlines.");
        }
    }

    private function sanitizeBonusGameId() {
        if(!is_numeric($this->requestParams['bonus_game_id']) ||
           is_float($this->requestParams['bonus_game_id'])) {
            ErrorHandler::handleError(1, "INVALID_BONUS_GAME_ID", "Invalid bonus game ID.");
        }

        $this->requestParams['bonus_game_id'] = (int)$this->requestParams['bonus_game_id'];
        $_POST['bonus_game_id'] = $this->requestParams['bonus_game_id'];

        if($this->requestParams['bonus_game_id'] <= 0) {
            ErrorHandler::handleError(1, "INVALID_BONUS_GAME_ID", "Invalid bonus game ID.");
        }
    }

    private function sanitizePickPosition() {
        if(!is_numeric($this->requestParams['pick_position']) ||
           is_float($this->requestParams['pick_position'])) {
            ErrorHandler::handleError(1, "INVALID_PICK_POSITION", "Invalid Pick Position.");
        }

        $this->requestParams['pick_position'] = (int)$this->requestParams['pick_position'];
        $_POST['pick_position'] = $this->requestParams['pick_position'];

        if($this->requestParams['pick_position'] < -1 ||
           $this->requestParams['pick_position'] > 50) {
            ErrorHandler::handleError(1, "INVALID_POSITION_VALUE", "Invalid position value.");
        }
    }

    private function sanitizeBetAmount()
    {
        if(!is_numeric($this->requestParams['bet_amount']) ||
           is_float($this->requestParams['bet_amount'])) {
            ErrorHandler::handleError(1, "INVALID_BET_AMOUNT", "Invalid Bet Amount.");
        }

        $this->requestParams['bet_amount'] = (int)$this->requestParams['bet_amount'];
        $_POST['bet_amount'] = $this->requestParams['bet_amount'];

        if($this->requestParams['bet_amount'] <= 0) {
            ErrorHandler::handleError(1, "INVALID_BET_AMOUNT", "Invalid Bet Amount.");
        }
    }
}

function validate_request_params($request_params, $game, $round) {
    if($request_params['request_type'] === 2 || $request_params['request_type'] === 8) {
        if(!in_array($request_params['coin_value'], $game->coinValues)) {
            # todo TODO Commented the below. Need to uncomment this later
            # ErrorHandler::handleError(1, "INVALID_COIN_VALUE","Invalid coin value..");
        }
        if($request_params['num_coins'] != $game->defaultCoins ||
           $game->defaultCoins != $game->minCoins || $game->defaultCoins != $game->maxCoins) {
            
            ErrorHandler::handleError(1, "INVALID_NUM_COINS","Invalid number of coins.");
        }

        if(!in_array($game->paylinesType, Array('fixed', 'variable'))) {
            ErrorHandler::handleError(1, "INVALID_BETLINES_TYPE","Invalid Betlines type configured.");
        }

        if(($game->paylinesType == 'fixed' && ($request_params['num_betlines'] != $game->paylines)
            && !(isset($round->game->misc['num_paylines'][$round->spinType]) &&
            ($round->game->misc['num_paylines'][$round->spinType] == $request_params['num_betlines'])))
            || ($game->paylinesType == 'variable' &&
            ($request_params['num_betlines'] < 1 || $request_params['num_betlines'] > $game->paylines)))
        {
            ErrorHandler::handleError(1, "INVALID_NUM_BETLINES1","Invalid number of betlines.");
        }
    }

    if($request_params['request_type'] === 2 &&
            $request_params['amount_type'] == AMOUNT_TYPE_PFS) {

            if( isset($round->player->promoDetails['curr_spin'])
                && isset($round->player->promoDetails['curr_spin']['date_expired'])
                && $round->player->promoDetails['curr_spin']['date_expired'] == 1 ) {

                    ErrorHandler::handleError(1, "EXPIRED_PFS","Your Bonus Free Spins have expired.");
            }

            if($request_params['num_coins'] != $round->player->promoDetails['curr_spin']['num_coins']) {
                ErrorHandler::handleError(1, "INVALID_PFS_NUM_COINS","Invalid PFS number of coins.");
            }

            if($request_params['coin_value'] != $round->player->promoDetails['curr_spin']['coin_value']) {
                ErrorHandler::handleError(1, "INVALID_PFS_COIN_VALUES","Invalid PFS coin values.");
            }
    }
}

function valid_bet_params($coin_value, $num_coins, $num_betlines) {
    if(!is_numeric($coin_value) || !is_numeric($num_coins) ||
       !is_numeric($num_betlines) || $coin_value <= 0 ||
       $num_coins <= 0 || $num_betlines <= 0) {
        return False;
    }

    return True;
}

# todo TODO remove this later
if($_POST['request_type'] == 5) {
    $_POST['username']= 'e103';
}
$request_params = $_POST;
#$request_params['username']== 'e103';

Sanitizer::sanitizeInputParams($request_params);

?>
