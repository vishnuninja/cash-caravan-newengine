<?php
class BonusGameFeature implements iBonus
{
    protected $game;
    protected $round;
    protected $accountId;
    protected $symbol;
    protected $bonusGameId;


    public function __construct(&$game, &$round, $accountId, $bonusGameId)
    {
        // $scattersCount['total'] = isset($scattersCount[$symbol]) ?  $scattersCount[$symbol] : null;
        $this->game = $game;
        $this->round = $round;
        $this->accountId = $accountId;
        $this->bonusGameId = $bonusGameId;
    }

    public function checkAndGrantBonusGame()
    {
        $scatter_count = get_element_count($this->round->matrixFlatten, "s");
        if ($scatter_count >= 3) {
            $this->bonusGameId = null;
            return;
        }

        $config = decode_object($this->getBonusConfig());
        $data = [];
        $baseRoundId = $this->round->roundId;
        $details = $config;
        $bonusGameWon = array();
        
        $flag=0;
        $data["feature"] = "";
        if($this->round->spinType == "normal"){
            $random=rand(1,$details["basebonus"]);
            if($random == $details["basebonus"]){
                $data["feature"] = "basebonus_game";
                $flag=1;
            }

        }elseif($this->round->spinType == "freespin"){
            $random=rand(1,$details["freebonus"]);
            if($random == $details["freebonus"]){
                $data["feature"] = "freebonus_game";
                $flag = 1;
            }

        }


        /** Hard code for medusa free game bonus and base game bonus
         *
         * $flag = 1;
         *
         */
        // $flag = 1;
        if ($flag==1) {
            $bonusGameWon = array(
                'type'          => 'bonus_game',
                'bonus_game_id' => $this->bonusGameId,
                'feature' => $data["feature"],
                'goal' => 'goal'
            );
            array_push($this->round->bonusGamesWon, $bonusGameWon);

            $data['goal'] = 'goal';
            $data['betAmount'] = $this->round->totalBet;
            $data['spintype']=$this->round->spinType;

            $data = encode_objects($data);
            grant_bonus_game(
                $this->game->gameId,
                $this->game->subGameId,
                $baseRoundId,
                $this->round->roundId,
                $this->accountId,
                $this->bonusGameId,
                '',
                0,
                $data,
                0.0,
                $this->round->amountType,
                $this->round->coinValue,
                $this->round->numCoins,
                $this->round->numBetLines
            );
        }
    }

    public function loadBonusGame()
    {
        $data = decode_object($this->round->bonusGames['game_data']);
        if (!(is_null($data))) {
            $bonusGameWon = array(
                'goal' => $data['goal'],
                'bonus_game_id' => $this->bonusGameId,
                'betAmount' => $data['betAmount'],
                "prize" => "multiplier"
            );
            $this->round->nextRound = $bonusGameWon;
        }
    }

    public function playBonusGame($pickedPosition)
    {
        $flag=0;
        $details = decode_object($this->getBonusConfig());
        $random=rand(1, $details["total_weightage"]);
        if($random>$details["nogoal"]["weight"]){
            $flag=1;
        }
        $pickPosition = (int)$pickedPosition;
        $data = decode_object($this->round->bonusGames['game_data']);  //getBonusData();
        
        if ($data['spintype'] == 'normal') {
            
            /** Hard code for medusa  normal base game win
             *
             * $flag=1;
             *
             */
            // $flag=1;
            $data["betAmount"] = $this->round->totalBet;
            if ($flag==1) {
                
                $index = (rand(1, count($details["base_multiplier"]))) - 1;
                $multiplier = $details["base_multiplier"][$index];
                $data["multiplier"] = $multiplier;
                
            }
        } else if ($data['spintype'] == 'freespin') {
            
            /** Hard code for medusa freegame win
             *
             * $flag=1;
             *
             */
            if ($flag==1) {
                $index = (rand(1, count($details["free_multiplier"]))) - 1;
                $multiplier = $details["free_multiplier"][$index];
                $data["multiplier"] = $multiplier;
                $data["feature"] = "freebonus_game";
            }
        }
        else {
            $data["multiplier"] = 0;
        }

        if ($pickPosition > 0 &&   !(is_null($data))) {
            if (isset($multiplier)) {
                $winAmount = $multiplier * $data["betAmount"];
            } else {
                $winAmount = 0;
            }
            $this->round->bonusGameRound = array(
                'type'          => 'bonus_game',
                "multiplier" => $multiplier,
                "prize" => "multiplier",
                "winAmount" => to_base_currency($winAmount),
                "feature" => $data["feature"],
                "picked_position" => $pickPosition
            );

            $this->round->winAmount += $winAmount;
            $state = 1;
            //$winAmount=$data["multiplier"]*$data["betAmount"];

            update_bonus_game(
                $pickedPosition,
                1,
                $data,
                $winAmount,
                $state,
                $this->round->bonusGames['round_id'],
                $this->round->bonusGames['game_id'],
                $this->accountId,
                $this->round->bonusGames['id']
            );
        }
    }


    private function getBonusConfig()
    {
        global $db;

        $table = "game.bonus_config";
        $query = <<<QUERY
			SELECT configuration
			  FROM $table
			 WHERE game_name = "{$this->game->gameName}" AND
				   bonus_game_id = {$this->bonusGameId} 
				
QUERY;
        $rs = $db->runQuery($query) or ErrorHandler::handleError(1, "BONUSPICKS_001");
        if ($db->numRows($rs) == 0) {
            return Null;
        }

        $row = $db->fetchRow($rs);
        return $row[0];
    }



    private function getBonusData()
    {

        global $db;
        $state = 0;
        $gameId = $this->game->gameId;
        $accountId = $this->accountId;

        $g_query = <<<QRY
  SELECT  game_data
		FROM    gamelog.bonus_games
		WHERE   game_id = $gameId AND
				account_id = $accountId AND
				state = $state ;
QRY;


        $rs = $db->runQuery($g_query) or ErrorHandler::handleError(1, "BONUSPICKS_001");


        if ($db->numRows($rs) == 0) {
            return Null;
        }

        $row = $db->fetchRow($rs);


        return $row[0];
    }


}
